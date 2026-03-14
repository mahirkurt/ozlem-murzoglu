#!/usr/bin/env python3
"""Fetch GA4 and GSC data and produce analysis.json."""

from __future__ import annotations

import argparse
import pathlib
from typing import Any

from common import (
    RUNS_ROOT,
    date_window,
    env_required,
    fail,
    google_api_request,
    make_run_id,
    refresh_access_token,
    success,
    utc_now_iso,
    write_json,
)


def _metric_value(row: dict[str, Any], index: int = 0, default: float = 0.0) -> float:
    values = row.get("metricValues", [])
    if index >= len(values):
        return default
    try:
        return float(values[index].get("value", default))
    except (TypeError, ValueError):
        return default


def _run_ga4_report(property_id: str, token: str, payload: dict[str, Any]) -> dict[str, Any]:
    url = f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport"
    return google_api_request(url, method="POST", token=token, payload=payload)


def _query_gsc(site_url: str, token: str, payload: dict[str, Any]) -> dict[str, Any]:
    encoded = site_url if site_url.endswith("/") else f"{site_url}/"
    encoded = encoded.replace("://", "%3A%2F%2F").replace("/", "%2F")
    url = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{encoded}/searchAnalytics/query"
    return google_api_request(url, method="POST", token=token, payload=payload)


def _extract_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    extracted: list[dict[str, Any]] = []
    for row in rows:
        extracted.append(
            {
                "keys": row.get("keys", []),
                "clicks": _metric_value(row, 0),
                "impressions": _metric_value(row, 1),
                "ctr": _metric_value(row, 2),
                "position": _metric_value(row, 3),
            }
        )
    return extracted


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch GA4 + GSC and write analysis JSON.")
    parser.add_argument("--window", choices=["28d", "90d"], default="28d")
    parser.add_argument("--run-id", default="")
    parser.add_argument("--output", default="")
    parser.add_argument("--goal", default="appointment_conversion")
    args = parser.parse_args()

    try:
        env = env_required(
            [
                "GA4_PROPERTY_ID",
                "GA4_MEASUREMENT_ID",
                "GSC_SITE_URL",
                "GTM_CONTAINER_ID",
                "FIREBASE_PROJECT_ID",
                "GOOGLE_CLIENT_ID",
                "GOOGLE_CLIENT_SECRET",
                "GOOGLE_REFRESH_TOKEN",
            ]
        )
    except RuntimeError as exc:
        fail(str(exc))

    run_id = args.run_id.strip() or make_run_id()
    run_dir = RUNS_ROOT / run_id
    output_path = pathlib.Path(args.output).resolve() if args.output else run_dir / "analysis.json"

    try:
        token_payload = refresh_access_token()
        token = token_payload["access_token"]

        start_date, end_date = date_window(args.window)

        ga4_sessions = _run_ga4_report(
            env["GA4_PROPERTY_ID"],
            token,
            {
                "dateRanges": [{"startDate": start_date, "endDate": end_date}],
                "metrics": [
                    {"name": "sessions"},
                    {"name": "totalUsers"},
                    {"name": "newUsers"},
                    {"name": "engagedSessions"},
                    {"name": "engagementRate"},
                ],
            },
        )

        ga4_events = _run_ga4_report(
            env["GA4_PROPERTY_ID"],
            token,
            {
                "dateRanges": [{"startDate": start_date, "endDate": end_date}],
                "dimensions": [{"name": "eventName"}],
                "metrics": [{"name": "eventCount"}],
                "dimensionFilter": {
                    "filter": {
                        "fieldName": "eventName",
                        "inListFilter": {
                            "values": [
                                "phone_click",
                                "whatsapp_click",
                                "form_submit",
                                "contact_click",
                            ]
                        },
                    }
                },
            },
        )

        gsc_queries = _query_gsc(
            env["GSC_SITE_URL"],
            token,
            {
                "startDate": start_date,
                "endDate": end_date,
                "dimensions": ["query"],
                "rowLimit": 25,
            },
        )

        gsc_pages = _query_gsc(
            env["GSC_SITE_URL"],
            token,
            {
                "startDate": start_date,
                "endDate": end_date,
                "dimensions": ["page"],
                "rowLimit": 25,
            },
        )

    except Exception as exc:  # noqa: BLE001
        fail("Failed to fetch GA4/GSC data.", {"reason": str(exc)})

    session_row = (ga4_sessions.get("rows") or [{}])[0]
    sessions = int(_metric_value(session_row, 0, 0))
    total_users = int(_metric_value(session_row, 1, 0))
    new_users = int(_metric_value(session_row, 2, 0))
    engaged_sessions = int(_metric_value(session_row, 3, 0))
    engagement_rate = _metric_value(session_row, 4, 0.0)

    event_counts: dict[str, int] = {"phone_click": 0, "whatsapp_click": 0, "form_submit": 0, "contact_click": 0}
    for row in ga4_events.get("rows", []):
        keys = row.get("dimensionValues", [])
        if not keys:
            continue
        name = keys[0].get("value", "")
        if name in event_counts:
            event_counts[name] = int(_metric_value(row, 0, 0))

    # KPI contract: appointment_conversion_rate = (phone_click + whatsapp_click + form_submit) / sessions
    appointment_events = (
        event_counts.get("phone_click", 0)
        + event_counts.get("whatsapp_click", 0)
        + event_counts.get("form_submit", 0)
    )
    if appointment_events == 0 and event_counts.get("contact_click", 0) > 0:
        appointment_events = event_counts["contact_click"]

    appointment_conversion_rate = round(appointment_events / sessions, 6) if sessions > 0 else 0.0

    query_rows = _extract_rows(gsc_queries.get("rows", []))
    page_rows = _extract_rows(gsc_pages.get("rows", []))

    top_queries = [row["keys"][0] for row in query_rows[:10] if row.get("keys")]
    top_pages = [row["keys"][0] for row in page_rows[:10] if row.get("keys")]

    tr_summary = (
        f"Son {args.window} donemde GA4 oturum: {sessions}, randevu olaylari: {appointment_events}, "
        f"donusum orani: {appointment_conversion_rate:.2%}. Search Console en iyi sorgulari ve sayfalari toplandi."
    )
    en_summary = (
        f"For the last {args.window}, GA4 sessions: {sessions}, appointment events: {appointment_events}, "
        f"conversion rate: {appointment_conversion_rate:.2%}. Top Search Console queries and pages were collected."
    )

    analysis = {
        "run_id": run_id,
        "generated_at": utc_now_iso(),
        "window": args.window,
        "goal": args.goal,
        "summary": {"tr": tr_summary, "en": en_summary},
        "ga4": {
            "property_id": env["GA4_PROPERTY_ID"],
            "measurement_id": env["GA4_MEASUREMENT_ID"],
            "sessions": sessions,
            "total_users": total_users,
            "new_users": new_users,
            "engaged_sessions": engaged_sessions,
            "engagement_rate": engagement_rate,
            "event_counts": event_counts,
        },
        "gsc": {
            "site_url": env["GSC_SITE_URL"],
            "top_queries": top_queries,
            "top_pages": top_pages,
            "queries": query_rows,
            "pages": page_rows,
        },
        "kpi": {
            "appointment_events": appointment_events,
            "appointment_conversion_rate": appointment_conversion_rate,
            "formula": "(phone_click + whatsapp_click + form_submit) / sessions",
        },
    }

    write_json(output_path, analysis)
    success({"run_id": run_id, "analysis": str(output_path)})


if __name__ == "__main__":
    main()
