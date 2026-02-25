# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 pediatric clinic website with Material Design 3 (pure CSS), i18n (Turkish/English), and Firebase/Vercel hosting.

## Development Commands

```bash
npm start                 # Dev server at http://localhost:4200
npm run build             # Production build (runs i18n:sync first)
npm run deploy            # Firebase deploy (runs i18n:check + build)
npm test                  # Run unit tests (Karma)
npm test -- --include=**/seo.service.spec.ts  # Single test

# i18n Management
npm run i18n:check        # Run sync + validate (pre-commit check)
npm run i18n:sync         # Sync missing translation keys
npm run i18n:validate     # Validate translation consistency
npm run i18n:clean        # Remove unused keys

# E2E Tests (Playwright)
npx playwright test --config=tests/config/playwright.config.js
npx playwright test tests/e2e/md3-visual-test.spec.js  # Single file
npx playwright test --ui   # Interactive mode

# Document Processing
node tools/process-documents.mjs      # Process resource documents
node tools/process-all-documents.mjs  # Process all documents

# Utilities
npm run svgo              # Optimize SVG illustrations
npm run resources:update-hero  # Update resource page heroes
npm start:linux           # Dev server via start_server.sh
npm run watch             # Build with watch mode
node scripts/lighthouse-test.js       # Performance testing
firebase hosting:channel:deploy preview  # Preview deployment
```

## Architecture

### Core Stack
- **Angular 18.2** standalone components (no NgModules), bootstrapped via `bootstrapApplication()` in `main.ts`
- **TypeScript 5.5** with strict mode and all strict flags
- **MD3 Styling**: Pure CSS with SCSS tokens in `src/styles/md3/` (no @angular/material)
- **i18n**: @ngx-translate with default language 'tr', HTTP loader, nested key structure

### Key Directories
- `src/app/components/` - Reusable UI (header, footer, liquid-hero, floating-actions, whatsapp-button, etc.)
- `src/app/pages/` - Page components with lazy loading
- `src/app/pages/resources/` - Auto-generated resource pages from documents
- `src/app/services/` - Feature services (blog, theme, seo, document, google-reviews, pediatric-icons)
- `src/app/core/services/` - Infrastructure services (design-tokens, analytics, accessibility, performance-optimizer, pwa, etc.)
- `src/styles/md3/` - MD3 design system: tokens (`_colors`, `_typography`, `_spacing`, `_shapes`, `_elevation`, `_motion`, `_breakpoints`, `_effects`, `_icons`, `_states`, `_utilities`), plus `components/` and `sections/` subdirectories
- `src/styles/` - Also contains `design-system.css` and `MASTER-STYLE-GUIDE.md`
- `src/assets/i18n/` - Translation files (tr.json, en.json)
- `tools/` - Document processing, i18n sync, and build scripts
- `scripts/` - Utility scripts (translations, lighthouse, resource heroes, server)
- `tests/e2e/` - Playwright E2E tests

### Key Files
- `src/main.ts` - Bootstrap with `bootstrapApplication(AppComponent, appConfig)`
- `src/app/app.config.ts` - Providers: router, HTTP, TranslateModule (default 'tr'), async animations
- `src/app/app.routes.ts` - All top-level routes (lazy-loaded)
- `src/app/pages/resources/resource-routes.ts` - Auto-generated resource routes (lazy-loaded)
- `src/styles/md3/_index.scss` - MD3 design system entry point
- `tools/i18n-auto-sync.js` - Translation key auto-detection
- `firebase.json` - Firebase hosting config (public: `dist/angular-app/browser`, SPA rewrites)

### Routing
All routes lazy-loaded in `app.routes.ts`. Resource routes auto-generated in `resource-routes.ts`:
```typescript
{ path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) }
```
Catch-all `**` redirects to home. Old `bilgi-merkezi` paths redirect to `kaynaklar`.

### MD3 Token System
Design tokens exported as CSS custom properties via `src/styles/md3/_index.scss`:
```scss
--md-sys-color-primary, --md-sys-typescale-body-large, --spacing-md, --radius-lg, --elevation-level-2
```
Import order matters — see `_index.scss` for the layered load sequence (tokens → foundation → layout → components → sections → utilities → a11y → print).

**CRITICAL**: Never use hardcoded styles. Always use MD3 tokens from `src/styles/md3/`.

### Resource System
Dynamic content pages auto-generated from Word/Markdown documents:
1. Place document in `tools/documents/{category}/`
2. Run `node tools/process-documents.mjs`
3. Component created in `src/app/pages/resources/{category}/{name}/`
4. Route auto-added to `resource-routes.ts`

## i18n Workflow

Translation keys auto-detected by `tools/i18n-auto-sync.js`:
- `{{ 'KEY' | translate }}`
- `[title]="'KEY'"`
- `translate.instant('KEY')`

Keys use UPPERCASE with underscores: `SERVICES.VACCINATION.TITLE`

Top-level key groups: `META`, `COMMON`, `HEADER`, `HOME`, `ABOUT`, `SERVICES`, `RESOURCES`, `CONTACT`, `FOOTER`, `LANGUAGE_SWITCHER`, `PAGES`, `FAQ`, `BLOG`, `APPOINTMENT`, `HERO`

**Before committing**: Run `npm run i18n:check` — CI validates on PRs and pushes to master/main.

## Testing

- **Unit**: `npm test` (Karma/Jasmine)
- **E2E**: Playwright config at `tests/config/playwright.config.js`
  - Auto-starts dev server on port 4200 (reuses existing if running)
  - Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
  - Screenshots on failure, video retained on failure, trace on first retry

## CI/CD

- **GitHub Actions** (`.github/workflows/`):
  - `i18n-check.yml` — Runs `i18n:sync` + `i18n:validate` on PRs/pushes when `src/` files change
  - `playwright.yml` — Runs full E2E suite on PRs/pushes to master/main, uploads report artifact

## Build Output

`dist/angular-app/browser` — used by both Firebase and Vercel

## Deployment

- **Firebase**: `npm run deploy` or `firebase deploy` (predeploy runs i18n:check + build)
- **Preview**: `firebase hosting:channel:deploy preview`
- **Vercel**: Auto-deploys on push with build command `npm ci && npm run build`

## Code Style

- 2-space indentation, LF line endings, UTF-8 (see `.editorconfig`)
- Single quotes in TypeScript
- SCSS follows MD3 token conventions; stylelint is a devDependency

## Environment Setup

Requires Node.js v24+ and npm 11+. First-time setup:
```bash
npm install
```

## Gotchas

- **Two service directories**: `src/app/services/` (feature-level) vs `src/app/core/services/` (infrastructure). Existing components import from `../../services/` (the `app/services/` path), not `core/services/`.
- **Language saved in localStorage**: Key is `selectedLanguage`. Falls back to browser language, then 'tr'.
- **Resource routes are auto-generated**: Do not manually edit `resource-routes.ts` — run `node tools/process-documents.mjs` instead.
- **prebuild hook**: `npm run build` automatically runs `i18n:sync` first (configured in package.json `prebuild` script).
- **predeploy hook**: `npm run deploy` automatically runs `i18n:check` + `build` before Firebase deploy.
- **Playwright baseURL**: E2E tests use port 4200 (same as dev server), not a separate port.