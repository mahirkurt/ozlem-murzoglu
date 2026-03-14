#!/usr/bin/env python3
"""Build and deploy Firebase hosting for ozlemmurzoglu.com."""

from __future__ import annotations

import argparse
import pathlib
from typing import Any

from common import REPO_ROOT, RUNS_ROOT, env_optional, fail, parse_bool, run_command, success, utc_now_iso, write_json


def _record_step(name: str, result: Any) -> dict[str, Any]:
    return {
        "step": name,
        "return_code": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build + deploy Firebase hosting")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--output", default="")
    parser.add_argument("--dry-run", default="false")
    args = parser.parse_args()

    dry_run = parse_bool(args.dry_run)
    run_dir = RUNS_ROOT / args.run_id
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "deploy-report.json"

    project_id = env_optional("FIREBASE_PROJECT_ID")
    deploy_cmd = ["firebase", "deploy", "--only", "hosting"]
    if project_id:
        deploy_cmd.extend(["--project", project_id])

    report: dict[str, Any] = {
        "run_id": args.run_id,
        "generated_at": utc_now_iso(),
        "dry_run": dry_run,
        "project_id": project_id,
        "steps": [],
    }

    if dry_run:
        report["steps"].append(
            {
                "step": "dry_run",
                "return_code": 0,
                "stdout": "Build and deploy skipped because --dry-run=true",
                "stderr": "",
            }
        )
        write_json(output_path, report)
        success({"run_id": args.run_id, "deploy_report": str(output_path), "dry_run": True})
        return

    build = run_command(["npm", "run", "build"], cwd=REPO_ROOT)
    report["steps"].append(_record_step("build", build))
    if build.returncode != 0:
        write_json(output_path, report)
        fail("Build failed during deploy pipeline.", {"report": str(output_path)})

    deploy = run_command(deploy_cmd, cwd=REPO_ROOT)
    report["steps"].append(_record_step("firebase_deploy", deploy))
    if deploy.returncode != 0:
        write_json(output_path, report)
        fail("Firebase deploy failed.", {"report": str(output_path)})

    write_json(output_path, report)
    success({"run_id": args.run_id, "deploy_report": str(output_path), "dry_run": False})


if __name__ == "__main__":
    main()
