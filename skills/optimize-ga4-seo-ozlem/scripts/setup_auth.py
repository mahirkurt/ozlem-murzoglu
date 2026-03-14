#!/usr/bin/env python3
"""Interactive OAuth setup for GA4 + GSC + GTM + Firebase automation."""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import threading
import urllib.parse
import urllib.request
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer

from common import SKILL_ROOT, env_required, fail, success

SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/tagmanager.edit.containers",
    "https://www.googleapis.com/auth/tagmanager.publish",
    "https://www.googleapis.com/auth/firebase",
    "https://www.googleapis.com/auth/cloud-platform",
]


class CallbackHandler(BaseHTTPRequestHandler):
    code: str | None = None

    def do_GET(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        if "code" in query and query["code"]:
            CallbackHandler.code = query["code"][0]
            body = b"<h2>Authorization successful. You can close this tab.</h2>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        body = b"<h2>Authorization pending...</h2>"
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:  # noqa: A003
        return


def exchange_code(
    *, client_id: str, client_secret: str, code: str, redirect_uri: str
) -> dict[str, str]:
    body = urllib.parse.urlencode(
        {
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        method="POST",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Setup OAuth refresh token for autopilot skill.")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument(
        "--save",
        default=str(SKILL_ROOT / ".tokens" / "oauth-token.json"),
        help="Path to save token payload.",
    )
    args = parser.parse_args()

    try:
        creds = env_required(["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"])
    except RuntimeError as exc:
        fail(str(exc))

    redirect_uri = f"http://localhost:{args.port}"
    auth_query = urllib.parse.urlencode(
        {
            "client_id": creds["GOOGLE_CLIENT_ID"],
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": " ".join(SCOPES),
            "access_type": "offline",
            "prompt": "consent",
        }
    )
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{auth_query}"

    server = HTTPServer(("localhost", args.port), CallbackHandler)

    thread = threading.Thread(target=server.handle_request, daemon=True)
    thread.start()

    opened = webbrowser.open(auth_url)
    if not opened:
        print("Open this URL manually:")
        print(auth_url)

    thread.join(timeout=300)
    server.server_close()

    if not CallbackHandler.code:
        fail("Authorization code was not received within 5 minutes.")

    try:
        token_payload = exchange_code(
            client_id=creds["GOOGLE_CLIENT_ID"],
            client_secret=creds["GOOGLE_CLIENT_SECRET"],
            code=CallbackHandler.code,
            redirect_uri=redirect_uri,
        )
    except Exception as exc:  # noqa: BLE001
        fail(f"Token exchange failed: {exc}")

    refresh_token = token_payload.get("refresh_token", "").strip()
    if not refresh_token:
        fail("Token exchange completed but refresh_token is missing.")

    save_path = pathlib.Path(args.save).resolve()
    save_path.parent.mkdir(parents=True, exist_ok=True)
    save_path.write_text(json.dumps(token_payload, indent=2), encoding="utf-8")

    export_lines = {
        "GOOGLE_CLIENT_ID": creds["GOOGLE_CLIENT_ID"],
        "GOOGLE_CLIENT_SECRET": creds["GOOGLE_CLIENT_SECRET"],
        "GOOGLE_REFRESH_TOKEN": refresh_token,
    }

    success(
        {
            "message": "OAuth setup completed.",
            "token_file": str(save_path),
            "exports": export_lines,
            "hint": "Store exports in .env (not committed).",
        }
    )


if __name__ == "__main__":
    main()
