#!/usr/bin/env python3
"""Publish Google Tag Manager workspace version for the configured container."""

from __future__ import annotations

import argparse
import pathlib
from typing import Any

from common import RUNS_ROOT, env_required, fail, google_api_request, refresh_access_token, success, utc_now_iso, write_json


def _api_path(path: str) -> str:
    base = "https://tagmanager.googleapis.com/tagmanager/v2"
    if path.startswith("/"):
        return base + path
    return f"{base}/{path}"


def _api_get(token: str, path: str) -> dict[str, Any]:
    return google_api_request(_api_path(path), token=token)


def _api_post(token: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    return google_api_request(_api_path(path), method="POST", token=token, payload=payload or {})


def _discover_container(token: str, public_id: str) -> dict[str, str]:
    accounts_payload = _api_get(token, "accounts")
    accounts = accounts_payload.get("account", [])

    for account in accounts:
        account_id = account.get("accountId", "")
        if not account_id:
            continue
        containers_payload = _api_get(token, f"accounts/{account_id}/containers")
        containers = containers_payload.get("container", [])
        for container in containers:
            if container.get("publicId") == public_id:
                return {
                    "account_id": account_id,
                    "container_id": container.get("containerId", ""),
                    "container_name": container.get("name", ""),
                }

    raise RuntimeError(f"Could not find GTM container by public ID: {public_id}")


def _select_workspace(token: str, account_id: str, container_id: str) -> dict[str, str]:
    payload = _api_get(token, f"accounts/{account_id}/containers/{container_id}/workspaces")
    workspaces = payload.get("workspace", [])
    if not workspaces:
        raise RuntimeError("No GTM workspaces found.")

    selected = None
    for workspace in workspaces:
        name = workspace.get("name", "").lower()
        if "default" in name:
            selected = workspace
            break
    if selected is None:
        selected = workspaces[0]

    return {
        "workspace_id": selected.get("workspaceId", ""),
        "workspace_name": selected.get("name", ""),
    }


def _current_live_version(token: str, account_id: str, container_id: str) -> dict[str, Any]:
    try:
        payload = _api_get(token, f"accounts/{account_id}/containers/{container_id}/environments/live")
    except Exception:  # noqa: BLE001
        return {}

    version_id = payload.get("containerVersionId", "")
    if not version_id:
        return {}

    return {
        "container_version_id": version_id,
        "version_path": f"accounts/{account_id}/containers/{container_id}/versions/{version_id}",
        "environment_path": payload.get("path", ""),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Publish GTM workspace")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--output", default="")
    parser.add_argument("--dry-run", default="false")
    args = parser.parse_args()

    run_dir = RUNS_ROOT / args.run_id
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "gtm-publish-report.json"

    try:
        env = env_required(["GTM_CONTAINER_ID", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"])
    except RuntimeError as exc:
        fail(str(exc))

    dry_run = args.dry_run.strip().lower() == "true"

    try:
        token_payload = refresh_access_token()
        token = token_payload["access_token"]

        discovered = _discover_container(token, env["GTM_CONTAINER_ID"])
        workspace = _select_workspace(token, discovered["account_id"], discovered["container_id"])
        live_before = _current_live_version(token, discovered["account_id"], discovered["container_id"])

        report: dict[str, Any] = {
            "run_id": args.run_id,
            "generated_at": utc_now_iso(),
            "dry_run": dry_run,
            "container_public_id": env["GTM_CONTAINER_ID"],
            "account_id": discovered["account_id"],
            "container_id": discovered["container_id"],
            "container_name": discovered["container_name"],
            "workspace_id": workspace["workspace_id"],
            "workspace_name": workspace["workspace_name"],
            "live_before": live_before,
        }

        if not dry_run:
            create_payload = _api_post(
                token,
                (
                    f"accounts/{discovered['account_id']}/containers/{discovered['container_id']}"
                    f"/workspaces/{workspace['workspace_id']}:create_version"
                ),
                {
                    "name": f"autopilot-{args.run_id}",
                    "notes": "GA4+SEO autopilot publish",
                },
            )

            version_path = create_payload.get("containerVersion", {}).get("path", "")
            if not version_path:
                raise RuntimeError(f"GTM create_version response missing containerVersion.path: {create_payload}")

            publish_payload = _api_post(token, f"{version_path}:publish")
            report["created_version_path"] = version_path
            report["publish_response"] = publish_payload
        else:
            report["created_version_path"] = ""
            report["publish_response"] = {"skipped": True}

    except Exception as exc:  # noqa: BLE001
        fail("GTM publish failed.", {"reason": str(exc)})

    write_json(output_path, report)
    success({"run_id": args.run_id, "gtm_publish_report": str(output_path), "dry_run": dry_run})


if __name__ == "__main__":
    main()
