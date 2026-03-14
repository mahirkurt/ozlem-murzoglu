#!/usr/bin/env python3
"""Apply SEO changes to whitelisted files only."""

from __future__ import annotations

import argparse
import difflib
import pathlib
from typing import Any

from common import (
    REPO_ROOT,
    RUNS_ROOT,
    backup_file,
    env_optional,
    env_required,
    fail,
    load_json,
    parse_bool,
    read_text,
    regex_replace_once,
    success,
    utc_now_iso,
    validate_whitelist,
    write_json,
    write_text,
)


def _patch_index_html(content: str, *, description: str, keywords: str, gtm_id: str) -> str:
    updated = content
    updated = regex_replace_once(
        updated,
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{description}">',
        "index.html meta description",
    )
    updated = regex_replace_once(
        updated,
        r'<meta name="keywords" content="[^"]*">',
        f'<meta name="keywords" content="{keywords}">',
        "index.html meta keywords",
    )
    updated = regex_replace_once(
        updated,
        r"\(window,document,'script','dataLayer','GTM-[A-Z0-9]+'\)",
        f"(window,document,'script','dataLayer','{gtm_id}')",
        "index.html GTM bootstrap",
    )
    updated = regex_replace_once(
        updated,
        r"ns\.html\?id=GTM-[A-Z0-9]+",
        f"ns.html?id={gtm_id}",
        "index.html GTM noscript",
    )
    return updated


def _patch_seo_config(content: str, *, ga4_id: str, gtm_id: str, gsc_code: str) -> str:
    updated = content
    updated = regex_replace_once(
        updated,
        r"GOOGLE_ANALYTICS_ID:\s*'[^']*'",
        f"GOOGLE_ANALYTICS_ID: '{ga4_id}'",
        "seo.config.ts GOOGLE_ANALYTICS_ID",
    )
    updated = regex_replace_once(
        updated,
        r"GOOGLE_TAG_MANAGER_ID:\s*'[^']*'",
        f"GOOGLE_TAG_MANAGER_ID: '{gtm_id}'",
        "seo.config.ts GOOGLE_TAG_MANAGER_ID",
    )
    if gsc_code:
        updated = regex_replace_once(
            updated,
            r"GOOGLE_SITE_VERIFICATION:\s*'[^']*'",
            f"GOOGLE_SITE_VERIFICATION: '{gsc_code}'",
            "seo.config.ts GOOGLE_SITE_VERIFICATION",
        )
    return updated


def _make_diff(path: pathlib.Path, original: str, updated: str) -> str:
    lines = difflib.unified_diff(
        original.splitlines(keepends=True),
        updated.splitlines(keepends=True),
        fromfile=str(path),
        tofile=str(path),
    )
    return "".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Apply SEO patches to whitelisted files")
    parser.add_argument("--plan", required=True)
    parser.add_argument("--run-id", default="")
    parser.add_argument("--output", default="")
    parser.add_argument("--dry-run", default="true")
    args = parser.parse_args()

    try:
        env = env_required(["GA4_MEASUREMENT_ID", "GTM_CONTAINER_ID"])
    except RuntimeError as exc:
        fail(str(exc))

    plan = load_json(pathlib.Path(args.plan).resolve())
    run_id = args.run_id.strip() or plan.get("run_id", "")
    if not run_id:
        fail("run_id is missing. Provide --run-id or include run_id in plan.")

    dry_run = parse_bool(args.dry_run)
    run_dir = RUNS_ROOT / run_id
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "execution-report.json"

    index_path = (REPO_ROOT / "src/index.html").resolve()
    seo_config_path = (REPO_ROOT / "src/app/config/seo.config.ts").resolve()
    targets = [index_path, seo_config_path]

    try:
        validate_whitelist(targets)
    except Exception as exc:  # noqa: BLE001
        fail(str(exc))

    patch = plan.get("autopilot_patch", {})
    index_patch = patch.get("index_html", {})
    description = index_patch.get("description_tr") or "Atasehir cocuk doktoru ve pediatri klinigi."
    keywords = index_patch.get("keywords") or "atasehir cocuk doktoru, pediatri"

    gsc_code = env_optional("GOOGLE_SITE_VERIFICATION")

    original_index = read_text(index_path)
    original_seo = read_text(seo_config_path)

    try:
        updated_index = _patch_index_html(
            original_index,
            description=description,
            keywords=keywords,
            gtm_id=env["GTM_CONTAINER_ID"],
        )
        updated_seo = _patch_seo_config(
            original_seo,
            ga4_id=env["GA4_MEASUREMENT_ID"],
            gtm_id=env["GTM_CONTAINER_ID"],
            gsc_code=gsc_code,
        )
    except Exception as exc:  # noqa: BLE001
        fail("Failed to generate SEO patches.", {"reason": str(exc)})

    changes: list[dict[str, Any]] = []
    backups: list[dict[str, str]] = []

    for path, old, new in [
        (index_path, original_index, updated_index),
        (seo_config_path, original_seo, updated_seo),
    ]:
        if old == new:
            continue

        diff = _make_diff(path, old, new)
        item: dict[str, Any] = {
            "file": str(path),
            "changed": True,
            "diff": diff,
        }

        if not dry_run:
            backup_path = backup_file(path, run_dir / "backups")
            write_text(path, new)
            item["applied"] = True
            item["backup"] = str(backup_path)
            backups.append({"file": str(path), "backup": str(backup_path)})
        else:
            item["applied"] = False

        changes.append(item)

    report = {
        "run_id": run_id,
        "generated_at": utc_now_iso(),
        "dry_run": dry_run,
        "whitelist": [str(p) for p in targets],
        "changes": changes,
        "backups": backups,
    }

    write_json(output_path, report)
    success(
        {
            "run_id": run_id,
            "execution_report": str(output_path),
            "changed_files": [item["file"] for item in changes],
            "dry_run": dry_run,
        }
    )


if __name__ == "__main__":
    main()
