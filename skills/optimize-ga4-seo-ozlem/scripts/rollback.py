#!/usr/bin/env python3
"""Rollback repo, GTM publish state, and hosting deploy from a run manifest."""

from __future__ import annotations

import argparse
import pathlib
from typing import Any

from common import (
    REPO_ROOT,
    RUNS_ROOT,
    env_optional,
    google_api_request,
    load_json,
    refresh_access_token,
    restore_file,
    run_command,
    success,
    utc_now_iso,
    write_json,
)


def _publish_version(token: str, version_path: str) -> dict[str, Any]:
    url = f"https://tagmanager.googleapis.com/tagmanager/v2/{version_path}:publish"
    return google_api_request(url, method="POST", token=token, payload={})


def main() -> None:
    parser = argparse.ArgumentParser(description="Rollback autopilot run using rollback-manifest.json")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--output", default="")
    parser.add_argument("--skip-gtm", default="false")
    parser.add_argument("--skip-deploy", default="false")
    args = parser.parse_args()

    run_dir = RUNS_ROOT / args.run_id
    manifest_path = run_dir / "rollback-manifest.json"
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "rollback-report.json"

    manifest = load_json(manifest_path)

    skip_gtm = args.skip_gtm.strip().lower() == "true"
    skip_deploy = args.skip_deploy.strip().lower() == "true"

    report: dict[str, Any] = {
        "run_id": args.run_id,
        "generated_at": utc_now_iso(),
        "restored_files": [],
        "gtm": {"attempted": False, "skipped": skip_gtm},
        "deploy": {"attempted": False, "skipped": skip_deploy},
    }

    for item in manifest.get("file_backups", []):
        target = pathlib.Path(item["file"]).resolve()
        backup = pathlib.Path(item["backup"]).resolve()
        restore_file(backup, target)
        report["restored_files"].append({"file": str(target), "backup": str(backup)})

    previous_version = manifest.get("gtm", {}).get("previous_live_version_path", "")
    if previous_version and not skip_gtm:
        report["gtm"]["attempted"] = True
        try:
            token_payload = refresh_access_token()
            publish_response = _publish_version(token_payload["access_token"], previous_version)
            report["gtm"]["ok"] = True
            report["gtm"]["response"] = publish_response
            report["gtm"]["version_path"] = previous_version
        except Exception as exc:  # noqa: BLE001
            report["gtm"]["ok"] = False
            report["gtm"]["error"] = str(exc)
    elif previous_version:
        report["gtm"]["version_path"] = previous_version

    if manifest.get("deploy", {}).get("enabled") and not skip_deploy:
        report["deploy"]["attempted"] = True
        script = run_dir.parents[1] / "scripts" / "deploy_hosting.py"
        cmd = ["python3", str(script), "--run-id", args.run_id, "--dry-run", "false"]
        deploy_res = run_command(cmd, cwd=REPO_ROOT)
        report["deploy"]["return_code"] = deploy_res.returncode
        report["deploy"]["stdout"] = deploy_res.stdout
        report["deploy"]["stderr"] = deploy_res.stderr
        report["deploy"]["ok"] = deploy_res.returncode == 0

    write_json(output_path, report)
    success({"run_id": args.run_id, "rollback_report": str(output_path)})


if __name__ == "__main__":
    main()
