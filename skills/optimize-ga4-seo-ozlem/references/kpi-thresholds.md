# KPI Thresholds and Formulas

## Primary KPI
- Name: `appointment_conversion_rate`
- Formula:
  - `(phone_click + whatsapp_click + form_submit) / sessions`
- Baseline window default: last 28 days
- Strategy horizon: 90 days

## Suggested Bands
- Critical: `< 0.02`
- Improve: `0.02 - 0.05`
- Stable: `>= 0.05`

## Secondary KPIs
- Organic clicks growth (GSC)
- Average position improvement (GSC)
- Engagement rate (GA4)
- Event integrity (GA4 event taxonomy completeness)

## Monitoring Fields
- GA4 sessions
- Event counts for `phone_click`, `whatsapp_click`, `form_submit`
- Top queries and pages from GSC
- GTM publish version path for traceability

## Acceptance Targets (90-day)
- Primary KPI trend positive vs baseline
- GTM publish version logged
- Deploy and rollback traceability by run_id
