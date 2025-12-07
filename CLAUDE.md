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
node scripts/lighthouse-test.js       # Performance testing
firebase hosting:channel:deploy preview  # Preview deployment
```

## Architecture

### Core Stack
- **Angular 18.2** standalone components (no NgModules), bootstrapped via `bootstrapApplication()` in `main.ts`
- **TypeScript 5.5** with strict mode and all strict flags
- **MD3 Styling**: Pure CSS with SCSS tokens in `src/app/styles/tokens/` (no @angular/material)
- **i18n**: @ngx-translate with default language 'tr', HTTP loader, nested key structure

### Key Directories
- `src/app/components/` - Reusable UI (header, footer, hero, MD3 components)
- `src/app/pages/` - Page components with lazy loading
- `src/app/pages/resources/` - Auto-generated resource pages from documents
- `src/app/styles/tokens/` - MD3 design tokens (_colors, _typography, _spacing, _shape, _elevation, _motion)
- `src/assets/i18n/` - Translation files (tr.json, en.json)
- `tools/` - Document processing and build scripts
- `tests/e2e/` - Playwright E2E tests

### Routing
All routes lazy-loaded in `app.routes.ts`. Resource routes auto-generated in `resource-routes.ts`:
```typescript
{ path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) }
```

### MD3 Token System
Design tokens exported as CSS custom properties in `_index.scss`:
```scss
--md-sys-color-primary, --md-sys-typescale-body-large, --spacing-md, --radius-lg, --elevation-level-2
```
**CRITICAL**: Never use hardcoded styles. Always use MD3 tokens from `src/app/styles/tokens/`.

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

**Before committing**: Run `npm run i18n:check` - GitHub Actions validates on PRs.

## Testing

- **Unit**: `npm test` (Karma/Jasmine)
- **E2E**: Playwright config at `tests/config/playwright.config.js`
  - Auto-starts server on port 4201
  - Browsers: Chromium, Firefox, WebKit, Mobile Chrome/Safari
  - Screenshots/video on failure

## Build Output

`dist/angular-app/browser` - used by both Firebase and Vercel

## Deployment

- **Firebase**: `npm run deploy` or `firebase deploy`
- **Preview**: `firebase hosting:channel:deploy preview`
- **Vercel**: Auto-deploys on push with build command `npm ci && npm run build`