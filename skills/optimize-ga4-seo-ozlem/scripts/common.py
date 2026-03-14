#!/usr/bin/env python3
"""Shared helpers for optimize-ga4-seo-ozlem scripts."""

from __future__ import annotations

import datetime as dt
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

SCRIPT_PATH = pathlib.Path(__file__).resolve()
SKILL_ROOT = SCRIPT_PATH.parents[1]
REPO_ROOT = SCRIPT_PATH.parents[3]
RUNS_ROOT = SKILL_ROOT / "runs"

WHITELIST_PATHS = {
    (REPO_ROOT / "src/index.html").resolve(),
    (REPO_ROOT / "src/app/config/seo.config.ts").resolve(),
}


def ensure_dir(path: pathlib.Path) -> pathlib.Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def utc_now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def make_run_id() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def parse_bool(value: str | bool) -> bool:
    if isinstance(value, bool):
        return value
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "y"}:
        return True
    if normalized in {"0", "false", "no", "n"}:
        return False
    raise ValueError(f"Invalid boolean value: {value}")


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def load_json(path: pathlib.Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def write_json(path: pathlib.Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def env_required(names: list[str]) -> dict[str, str]:
    values: dict[str, str] = {}
    missing: list[str] = []
    for name in names:
        value = os.getenv(name, "").strip()
        if not value:
            missing.append(name)
        else:
            values[name] = value
    if missing:
        missing_str = ", ".join(missing)
        raise RuntimeError(f"Missing required environment variables: {missing_str}")
    return values


def env_optional(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def run_command(cmd: list[str], cwd: pathlib.Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=str(cwd or REPO_ROOT),
        text=True,
        capture_output=True,
        check=False,
        env=os.environ.copy(),
    )


def fail(message: str, details: dict[str, Any] | None = None, exit_code: int = 1) -> None:
    payload: dict[str, Any] = {"ok": False, "error": message}
    if details:
        payload["details"] = details
    sys.stderr.write(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    raise SystemExit(exit_code)


def success(payload: dict[str, Any]) -> None:
    out = {"ok": True, **payload}
    sys.stdout.write(json.dumps(out, indent=2, ensure_ascii=False) + "\n")


def refresh_access_token() -> dict[str, Any]:
    creds = env_required(
        ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]
    )
    body = urllib.parse.urlencode(
        {
            "client_id": creds["GOOGLE_CLIENT_ID"],
            "client_secret": creds["GOOGLE_CLIENT_SECRET"],
            "refresh_token": creds["GOOGLE_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        method="POST",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            token_payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        content = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OAuth token refresh failed: {exc.code} {content}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"OAuth token refresh failed: {exc.reason}") from exc

    if "access_token" not in token_payload:
        raise RuntimeError(f"OAuth token refresh response missing access_token: {token_payload}")
    return token_payload


def google_api_request(
    url: str,
    *,
    method: str = "GET",
    token: str,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    data = None
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, method=method.upper(), data=data, headers=headers)

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            if not body:
                return {}
            return json.loads(body)
    except urllib.error.HTTPError as exc:
        content = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Google API request failed ({exc.code}) for {url}: {content}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Google API request failed for {url}: {exc.reason}") from exc


def validate_whitelist(paths: list[pathlib.Path]) -> None:
    for path in paths:
        resolved = path.resolve()
        if resolved not in WHITELIST_PATHS:
            raise RuntimeError(f"Path not in SEO whitelist: {resolved}")


def backup_file(source: pathlib.Path, backup_root: pathlib.Path) -> pathlib.Path:
    resolved = source.resolve()
    if not resolved.exists():
        raise FileNotFoundError(f"Cannot backup missing file: {resolved}")
    relative = resolved.relative_to(REPO_ROOT)
    dest = backup_root / relative
    ensure_dir(dest.parent)
    shutil.copy2(resolved, dest)
    return dest


def restore_file(backup_path: pathlib.Path, destination: pathlib.Path) -> None:
    ensure_dir(destination.parent)
    shutil.copy2(backup_path, destination)


def regex_replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"Expected exactly one match for {label}, found {count}")
    return updated


def slugify_queries(queries: list[str], fallback: list[str], max_items: int = 12) -> str:
    cleaned: list[str] = []
    seen: set[str] = set()

    for raw in queries + fallback:
        token = re.sub(r"\s+", " ", raw.strip().lower())
        token = re.sub(r"[^a-z0-9\-\s]", "", token)
        if not token:
            continue
        if token in seen:
            continue
        seen.add(token)
        cleaned.append(token)
        if len(cleaned) >= max_items:
            break

    return ", ".join(cleaned)


def date_window(window: str) -> tuple[str, str]:
    days = 28 if window == "28d" else 90
    end = dt.date.today() - dt.timedelta(days=1)
    start = end - dt.timedelta(days=days - 1)
    return start.isoformat(), end.isoformat()
