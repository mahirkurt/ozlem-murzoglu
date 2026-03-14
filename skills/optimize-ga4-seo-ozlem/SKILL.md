---
name: optimize-ga4-seo-ozlem
description: End-to-end GA4 + GSC + GTM SEO autopilot for ozlemmurzoglu.com. Use when users ask to analyze analytics data, generate a 90-day SEO roadmap, improve appointment conversion, apply SEO metadata changes, publish GTM updates, deploy hosting, run smoke checks, or rollback failed releases. Trigger for both Turkish and English intents such as "google analytics plan", "SEO strategy", "randevu donusum", "GA4", "Search Console", "GTM publish", "full auto", "rollback", and "run-autopilot".
---

# Optimize GA4 SEO Ozlem

## Overview
Use this skill to run full automation for GA4 + GSC + GTM driven SEO operations on `ozlemmurzoglu.com`, including planning, whitelisted code edits, publish, verification, and rollback.

## Workflow Decision Tree
1. Run preflight:
   - Validate required env vars.
   - Validate GSC property access with live API call.
   - Stop with explicit error if preflight fails.
2. Collect data (`fetch-ga4-gsc`):
   - Pull GA4 session and appointment-event metrics.
   - Pull GSC top queries/pages.
   - Write `analysis.json` with TR+EN summary.
3. Build strategy (`generate-plan`):
   - Generate 90-day plan from baseline KPIs.
   - Write `plan-90d.json` with phased actions.
4. Apply code (`apply-seo`):
   - Enforce whitelist-only edits:
     - `src/index.html`
     - `src/app/config/seo.config.ts`
   - Create backups for rollback.
   - Write `execution-report.json`.
5. Publish (`deploy-hosting` + `publish-gtm`):
   - Build and deploy hosting.
   - Publish GTM workspace/container version.
6. Post-check (`postcheck`):
   - Verify live HTML status, GTM ID, and metadata tags.
7. Rollback (`rollback`):
   - Restore file backups.
   - Re-publish previous GTM live version when present.
   - Re-deploy hosting if rollback manifest requires.

## Orchestrator Contract
Use this exact command contract:

```bash
./scripts/run-autopilot \
  --window 28d|90d \
  --lang tr|en|both \
  --goal appointment_conversion \
  --mode full-auto \
  --publish true|false \
  --dry-run true|false
```

Rollback contract:

```bash
./scripts/run-autopilot --rollback <run_id>
```

## Environment Contract
Require these env vars (do not store in repo files):

- `GA4_PROPERTY_ID`
- `GA4_MEASUREMENT_ID`
- `GSC_SITE_URL`
- `GTM_CONTAINER_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `FIREBASE_PROJECT_ID`

Store secrets in local `.env` and local token files only. Never write secrets to git-tracked files.

## Output Contract
For each run, write artifacts under `skills/optimize-ga4-seo-ozlem/runs/<run_id>/`:

- `analysis.json`
- `plan-90d.json`
- `execution-report.json`
- `rollback-manifest.json`
- `deploy-report.json` (when publish path runs)
- `gtm-publish-report.json` (when publish path runs)
- `postcheck-report.json`

Each primary artifact must include TR and EN summary text where relevant.

## Safety Rules
- Never edit files outside whitelist in automatic apply mode.
- Treat non-whitelisted actions as recommendations only.
- Abort publish if preflight fails.
- If a publish-stage step fails after file edits, execute rollback automatically.

## References
Load only the needed reference file:

- Site specifics: `references/site-profile.md`
- KPI rules and formulas: `references/kpi-thresholds.md`
- 90-day strategy structure: `references/seo-playbook-90d.md`
- GTM publish constraints: `references/gtm-change-policy.md`
- Rollback behavior: `references/rollback-policy.md`
