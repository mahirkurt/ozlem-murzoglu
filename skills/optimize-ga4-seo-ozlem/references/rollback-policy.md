# Rollback Policy

## Trigger Conditions
- Any failure after whitelist file edits are applied.
- Postcheck failure on live URL.
- Manual operator request: `run-autopilot --rollback <run_id>`.

## Rollback Steps
1. Restore file backups from `rollback-manifest.json`.
2. If GTM previous live version exists, re-publish that version.
3. If manifest marks deploy as enabled, re-run hosting deploy.
4. Write `rollback-report.json` with run-id trace.

## Data Sources
- `runs/<run_id>/rollback-manifest.json`
- `runs/<run_id>/backups/*`
- `runs/<run_id>/gtm-publish-report.json`

## Non-goals
- Rollback does not modify non-whitelisted source files.
- Rollback does not regenerate strategy artifacts.
