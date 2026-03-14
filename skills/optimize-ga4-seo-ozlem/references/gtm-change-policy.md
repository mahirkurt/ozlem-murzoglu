# GTM Change Policy

## Allowed in Full-Auto Publish
- Discover container by `GTM_CONTAINER_ID` (public ID).
- Select default workspace (or first available).
- Create a new workspace version tagged with `autopilot-<run_id>`.
- Publish created version.
- Record previous live version path for rollback.

## Required Preconditions
- OAuth token has Tag Manager publish scope.
- Container discovery succeeds.
- Workspace exists.

## Mandatory Logging
- Account ID
- Container ID
- Workspace ID
- Created version path
- Previous live version path
- Publish API response

## Failure Handling
- If GTM publish fails, fail pipeline.
- If prior file changes were applied, trigger rollback path.
