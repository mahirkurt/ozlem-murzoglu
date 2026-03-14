#!/usr/bin/env python3
"""Generate 90-day SEO + analytics plan from analysis.json."""

from __future__ import annotations

import argparse
import pathlib
from typing import Any

from common import RUNS_ROOT, load_json, slugify_queries, success, utc_now_iso, write_json

FALLBACK_KEYWORDS = [
    "atasehir cocuk doktoru",
    "pediatri uzmani istanbul",
    "dr ozlem murzoglu",
    "cocuk sagligi",
    "bebek doktoru",
    "bright futures",
    "triple p",
    "sos feeding",
    "cocuk gelisim takibi",
]


def _performance_band(rate: float) -> str:
    if rate < 0.02:
        return "critical"
    if rate < 0.05:
        return "improve"
    return "stable"


def _build_descriptions() -> dict[str, str]:
    return {
        "tr": (
            "Atasehir cocuk doktoru Dr. Ozlem Murzoglu klinigi. Cocuk sagligi, gelisim takibi, "
            "asi, Bright Futures, Triple P ve randevu iletisimi icin bize ulasin."
        ),
        "en": (
            "Pediatric clinic in Atasehir led by Dr. Ozlem Murzoglu. Child health visits, "
            "development follow-up, vaccination, Bright Futures, Triple P, and appointment contact options."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate 90-day plan from analysis.json")
    parser.add_argument("--analysis", required=True)
    parser.add_argument("--output", default="")
    parser.add_argument("--lang", choices=["tr", "en", "both"], default="both")
    args = parser.parse_args()

    analysis_path = pathlib.Path(args.analysis).resolve()
    analysis = load_json(analysis_path)

    run_id = analysis.get("run_id", "")
    if not run_id:
        raise SystemExit("analysis.json missing run_id")

    run_dir = RUNS_ROOT / run_id
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "plan-90d.json"

    conversion_rate = float(analysis.get("kpi", {}).get("appointment_conversion_rate", 0.0))
    band = _performance_band(conversion_rate)

    top_queries = analysis.get("gsc", {}).get("top_queries", [])
    keyword_block = slugify_queries(top_queries, FALLBACK_KEYWORDS, max_items=12)
    descriptions = _build_descriptions()

    if band == "critical":
        priority_tr = "Acil: donusum hunisini onceliklendiren temel teknik duzeltmeler"
        priority_en = "Urgent: prioritize conversion funnel and baseline technical fixes"
    elif band == "improve":
        priority_tr = "Orta seviye: teknik kazanimi koru, landing page ve event kalitesini artir"
        priority_en = "Medium: keep technical baseline, improve landing pages and event quality"
    else:
        priority_tr = "Iyi durum: olceklenebilir icerik ve local SEO ile buyume"
        priority_en = "Stable: scale with content and local SEO expansion"

    plan = {
        "run_id": run_id,
        "generated_at": utc_now_iso(),
        "window_used": analysis.get("window", "28d"),
        "strategy_horizon": "90d",
        "goal": "appointment_conversion",
        "summary": {
            "tr": (
                f"90 gunluk plan olusturuldu. Mevcut conversion: {conversion_rate:.2%}. Oncelik: {priority_tr}."
            ),
            "en": (
                f"90-day plan created. Current conversion: {conversion_rate:.2%}. Priority: {priority_en}."
            ),
        },
        "kpi_targets": {
            "appointment_conversion_rate": {
                "formula": "(phone_click + whatsapp_click + form_submit) / sessions",
                "baseline": conversion_rate,
                "target_30d": max(conversion_rate, 0.03),
                "target_60d": max(conversion_rate, 0.045),
                "target_90d": max(conversion_rate, 0.06),
            },
            "organic_clicks_growth": {"target_90d": "+20%"},
            "avg_position_improvement": {"target_90d": "-1.5"},
        },
        "phases": [
            {
                "days": "0-30",
                "focus": "Instrumentation + baseline hygiene",
                "actions": [
                    "Validate GA4 event taxonomy for phone_click, whatsapp_click, form_submit.",
                    "Sync GTM/GA4 identifiers in source files and publish with smoke test.",
                    "Harden homepage metadata from top GSC queries.",
                ],
            },
            {
                "days": "31-60",
                "focus": "Landing-page conversion lift",
                "actions": [
                    "Prioritize top 5 service pages from GSC page data for metadata experiments.",
                    "Add CTA placement tests and track impact with event delta.",
                    "Review low CTR queries and map them to intent-aligned snippets.",
                ],
            },
            {
                "days": "61-90",
                "focus": "Scale + local SEO reinforcement",
                "actions": [
                    "Consolidate winning snippets and roll out to secondary pages.",
                    "Publish local authority content supporting appointment intent.",
                    "Benchmark KPI trend and lock next-quarter roadmap.",
                ],
            },
        ],
        "autopilot_patch": {
            "whitelist_targets": [
                "src/index.html",
                "src/app/config/seo.config.ts",
            ],
            "index_html": {
                "description_tr": descriptions["tr"],
                "description_en": descriptions["en"],
                "keywords": keyword_block,
            },
            "seo_config": {
                "sync_ga4_measurement_id_from_env": True,
                "sync_gtm_container_id_from_env": True,
                "sync_site_verification_from_env": False,
            },
        },
        "recommendations_only": {
            "note": "All non-whitelisted file changes are emitted as recommendations only.",
            "top_pages": analysis.get("gsc", {}).get("top_pages", [])[:10],
            "top_queries": top_queries[:15],
        },
    }

    write_json(output_path, plan)
    success({"run_id": run_id, "plan": str(output_path), "language": args.lang})


if __name__ == "__main__":
    main()
