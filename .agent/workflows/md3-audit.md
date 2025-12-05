---
description: MD3 Design Audit Process with Playwright
---

# MD3 Design System Audit Process

This workflow defines the standard procedure for verifying Material Design 3 (MD3) compliance using automated Playwright tests and MCP capabilities.

## 1. Prerequisites
- [x] **Playwright Installed**: Ensure `@playwright/test` is in dependencies.
- [x] **Test Suite**: `e2e/md3-audit.spec.ts` must exist.
- [x] **Local Server**: The application must be buildable (`npm start`).

## 2. Running the Audit
To perform a visual and structural audit of the MD3 implementation, run the following command:

```bash
// turbo
npx playwright test
```

## 3. Interpreting Results (MCP Analysis)

### 🔴 Failure: Typography Violation
If the test fails on "Typography", check:
- Is `src/styles.scss` importing local fonts instead of `_typography.scss` variables?
- Are inline styles modifying `font-family`?

### 🔴 Failure: Touch Targets
If the test fails on "Touch Targets":
- Ensure buttons have `height: 56px` (or `40px` for dense/text buttons).
- Verify `padding` is sufficient.

### 🔴 Failure: Expressive Motion
If the test fails on "Motion":
- Ensure elements use `--md-sys-motion-easing-expressive-*`.
- Check if `transform` transitions are present.

## 4. Visual Regression (Visual Audit)
To perform a visual check of specific components:

1.  Run the server: `npm start`
2.  Use the MCP to take a screenshot:
    ```
    @browser_subagent "Take a screenshot of the homepage hero section and analyze the button shapes."
    ```
3.  Compare against `docs/design/MD3-STYLES-GUIDE.md`.

## 5. Continuous Monitoring
- Run this workflow before every major UI deployment.
- Update `e2e/md3-audit.spec.ts` when new tokens are added.
