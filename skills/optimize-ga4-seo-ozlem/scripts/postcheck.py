#!/usr/bin/env python3
"""Smoke checks after deploy/publish."""

from __future__ import annotations

import argparse
import pathlib
import re
import urllib.request

from common import RUNS_ROOT, env_optional, env_required, fail, success, utc_now_iso, write_json


def _check(condition: bool, name: str, details: str) -> dict[str, str | bool]:
    return {"name": name, "ok": condition, "details": details}


def main() -> None:
    parser = argparse.ArgumentParser(description="Run smoke checks on live site")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--url", default="")
    parser.add_argument("--output", default="")
    args = parser.parse_args()

    run_dir = RUNS_ROOT / args.run_id
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "postcheck-report.json"

    try:
        env = env_required(["GTM_CONTAINER_ID"])
    except RuntimeError as exc:
        fail(str(exc))

    target_url = args.url.strip() or env_optional("SITE_URL", "https://ozlemmurzoglu.com")

    try:
        with urllib.request.urlopen(target_url, timeout=30) as response:
            status = response.status
            html = response.read().decode("utf-8", errors="replace")
    except Exception as exc:  # noqa: BLE001
        fail("Postcheck request failed.", {"reason": str(exc), "url": target_url})

    checks = []
    checks.append(_check(status == 200, "http_status", f"status={status}"))
    checks.append(
        _check(
            env["GTM_CONTAINER_ID"] in html,
            "gtm_container_present",
            f"container={env['GTM_CONTAINER_ID']}",
        )
    )
    checks.append(
        _check(
            bool(re.search(r'<meta name="description" content="[^"]+">', html)),
            "meta_description_present",
            "description tag exists",
        )
    )
    checks.append(
        _check(
            bool(re.search(r'<meta name="keywords" content="[^"]+">', html)),
            "meta_keywords_present",
            "keywords tag exists",
        )
    )

    ok = all(bool(item["ok"]) for item in checks)

    report = {
        "run_id": args.run_id,
        "generated_at": utc_now_iso(),
        "url": target_url,
        "checks": checks,
        "ok": ok,
    }

    write_json(output_path, report)

    if not ok:
        fail("Postcheck failed.", {"report": str(output_path)}, exit_code=2)

    success({"run_id": args.run_id, "postcheck_report": str(output_path), "url": target_url})


if __name__ == "__main__":
    main()
