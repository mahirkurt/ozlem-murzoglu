#!/usr/bin/env python3
"""Orchestrate full GA4 + GSC + GTM + SEO autopilot workflow."""

from __future__ import annotations

import argparse
import pathlib
from typing import Any

from common import (
    RUNS_ROOT,
    env_required,
    fail,
    load_json,
    make_run_id,
    parse_bool,
    run_command,
    success,
    utc_now_iso,
    write_json,
)


def _script_path(name: str) -> pathlib.Path:
    return pathlib.Path(__file__).resolve().parent / f"{name}.py"


def _run_python(script: str, args: list[str]) -> dict[str, Any]:
    cmd = ["python3", str(_script_path(script)), *args]
    res = run_command(cmd)
    return {
        "script": script,
        "command": cmd,
        "return_code": res.returncode,
        "stdout": res.stdout,
        "stderr": res.stderr,
    }


def _run_or_fail(script: str, args: list[str], steps: list[dict[str, Any]]) -> None:
    result = _run_python(script, args)
    steps.append(result)
    if result["return_code"] != 0:
        fail(
            f"Pipeline step failed: {script}",
            {
                "command": result["command"],
                "stdout": result["stdout"],
                "stderr": result["stderr"],
            },
        )


def _auto_rollback(run_id: str, reason: str, steps: list[dict[str, Any]]) -> None:
    rollback_result = _run_python(
        "rollback",
        ["--run-id", run_id, "--skip-deploy", "true"],
    )
    rollback_result["auto_reason"] = reason
    steps.append(rollback_result)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run full autopilot workflow")
    parser.add_argument("--window", choices=["28d", "90d"], default="28d")
    parser.add_argument("--lang", choices=["tr", "en", "both"], default="both")
    parser.add_argument("--goal", default="appointment_conversion")
    parser.add_argument("--mode", default="full-auto")
    parser.add_argument("--publish", default="false")
    parser.add_argument("--dry-run", default="true")
    parser.add_argument("--rollback", default="")
    args = parser.parse_args()

    if args.rollback.strip():
        rollback_result = _run_python("rollback", ["--run-id", args.rollback.strip()])
        if rollback_result["return_code"] != 0:
            fail("Rollback execution failed.", rollback_result)
        success({"rollback_run_id": args.rollback.strip(), "details": rollback_result})
        return

    if args.mode != "full-auto":
        fail("Unsupported mode. Only --mode full-auto is accepted.")
    if args.goal != "appointment_conversion":
        fail("Unsupported goal. Only --goal appointment_conversion is accepted.")

    publish = parse_bool(args.publish)
    dry_run = parse_bool(args.dry_run)

    try:
        env_required(
            [
                "GA4_PROPERTY_ID",
                "GA4_MEASUREMENT_ID",
                "GSC_SITE_URL",
                "GTM_CONTAINER_ID",
                "GOOGLE_CLIENT_ID",
                "GOOGLE_CLIENT_SECRET",
                "GOOGLE_REFRESH_TOKEN",
                "FIREBASE_PROJECT_ID",
            ]
        )
    except RuntimeError as exc:
        fail(str(exc))

    run_id = make_run_id()
    run_dir = RUNS_ROOT / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    analysis_path = run_dir / "analysis.json"
    plan_path = run_dir / "plan-90d.json"
    execution_path = run_dir / "execution-report.json"
    deploy_path = run_dir / "deploy-report.json"
    gtm_path = run_dir / "gtm-publish-report.json"
    postcheck_path = run_dir / "postcheck-report.json"
    manifest_path = run_dir / "rollback-manifest.json"
    run_report_path = run_dir / "run-report.json"

    steps: list[dict[str, Any]] = []
    manifest: dict[str, Any] = {
        "run_id": run_id,
        "created_at": utc_now_iso(),
        "file_backups": [],
        "deploy": {"enabled": publish and not dry_run},
        "gtm": {"previous_live_version_path": ""},
    }

    try:
        _run_or_fail(
            "fetch_ga4_gsc",
            [
                "--window",
                args.window,
                "--run-id",
                run_id,
                "--goal",
                args.goal,
                "--output",
                str(analysis_path),
            ],
            steps,
        )

        _run_or_fail(
            "generate_plan",
            [
                "--analysis",
                str(analysis_path),
                "--lang",
                args.lang,
                "--output",
                str(plan_path),
            ],
            steps,
        )

        _run_or_fail(
            "apply_seo",
            [
                "--plan",
                str(plan_path),
                "--run-id",
                run_id,
                "--dry-run",
                str(dry_run).lower(),
                "--output",
                str(execution_path),
            ],
            steps,
        )

        execution_report = load_json(execution_path)
        manifest["file_backups"] = execution_report.get("backups", [])
        write_json(manifest_path, manifest)

        if publish:
            _run_or_fail(
                "deploy_hosting",
                [
                    "--run-id",
                    run_id,
                    "--dry-run",
                    str(dry_run).lower(),
                    "--output",
                    str(deploy_path),
                ],
                steps,
            )

            _run_or_fail(
                "publish_gtm",
                [
                    "--run-id",
                    run_id,
                    "--dry-run",
                    str(dry_run).lower(),
                    "--output",
                    str(gtm_path),
                ],
                steps,
            )

            if gtm_path.exists():
                gtm_report = load_json(gtm_path)
                manifest["gtm"]["previous_live_version_path"] = (
                    gtm_report.get("live_before", {}).get("version_path", "")
                )
                write_json(manifest_path, manifest)

        _run_or_fail(
            "postcheck",
            [
                "--run-id",
                run_id,
                "--output",
                str(postcheck_path),
            ],
            steps,
        )

    except SystemExit:
        if manifest_path.exists() and not dry_run:
            _auto_rollback(run_id, "pipeline_failed", steps)
        raise

    run_report = {
        "run_id": run_id,
        "generated_at": utc_now_iso(),
        "config": {
            "window": args.window,
            "lang": args.lang,
            "goal": args.goal,
            "mode": args.mode,
            "publish": publish,
            "dry_run": dry_run,
        },
        "artifacts": {
            "analysis": str(analysis_path),
            "plan": str(plan_path),
            "execution_report": str(execution_path),
            "rollback_manifest": str(manifest_path),
            "deploy_report": str(deploy_path) if deploy_path.exists() else "",
            "gtm_publish_report": str(gtm_path) if gtm_path.exists() else "",
            "postcheck_report": str(postcheck_path),
        },
        "steps": steps,
    }
    write_json(run_report_path, run_report)

    success(
        {
            "run_id": run_id,
            "run_report": str(run_report_path),
            "analysis": str(analysis_path),
            "plan": str(plan_path),
            "execution_report": str(execution_path),
            "rollback_manifest": str(manifest_path),
        }
    )


if __name__ == "__main__":
    main()
