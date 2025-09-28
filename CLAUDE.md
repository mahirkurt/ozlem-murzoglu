# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 application for Dr. Özlem Murzoğlu's pediatric clinic website with Material Design 3 principles (pure CSS implementation), i18n support (Turkish/English), and Firebase/Vercel hosting.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
npm start

# Production build (includes i18n:sync prebuild step)
npm run build

# Run unit tests (Karma)
npm test

# Run single unit test spec
npm test -- --include=**/seo.service.spec.ts

# Build and watch for changes (development mode)
npm run watch

# Deploy to Firebase (includes i18n:check and build)
npm run deploy

# i18n Translation Management
npm run i18n:sync      # Scan codebase and sync missing translation keys
npm run i18n:validate  # Validate translation consistency between languages
npm run i18n:clean     # Remove unused translation keys
npm run i18n:check     # Run sync and validate together (prebuild step)

# Run E2E tests (Playwright)
npx playwright test --config=tests/config/playwright.config.js

# Run single E2E test file
npx playwright test tests/e2e/test-i18n.spec.js

# Run E2E tests with UI mode
npx playwright test --ui

# E2E test server (port 4201)
npm run start -- --port 4201

# Optimize SVG illustrations
npm run svgo

# Firebase deployment
firebase deploy

# Firebase preview channel deployment
firebase hosting:channel:deploy preview

# Translation validation
node scripts/validate-translations.js

# Clean unused translations
node scripts/clean-unused-translations.js

# WebP image conversion
node scripts/convert-to-webp.js

# MD3 migration tool
node scripts/migrate-to-md3.js

# Lighthouse performance testing
node scripts/lighthouse-test.js

# Process resource documents (multiple tools available)
node tools/process-documents.mjs
node tools/process-all-documents.mjs
node tools/process-clean-documents.mjs
node tools/test-documents.mjs
node tools/process-sample-documents.mjs

# i18n auto-synchronization tool
node tools/i18n-auto-sync.js

# Resource regeneration
node tools/resource-regenerate.js

# SEO link checking
node tools/seo-check-links.js

# MCP integration tool
node tools/mcp.js

## Architecture

### Core Technologies
- **Framework**: Angular 18.2 with standalone components (no NgModules)
- **TypeScript**: 5.5.2 with strict mode and all strict flags enabled
- **Styling**: Pure CSS with Material Design 3 principles, SCSS tokens (no @angular/material)
- **Fonts**: Figtree (headings), DM Sans (body)
- **i18n**: @ngx-translate/core v17 for Turkish/English support (1963+ translation keys)
- **i18n Auto-Sync**: Automatic translation key detection and synchronization system
- **Deployment**: Firebase Hosting / Vercel
- **Testing**: Karma 6.4 with Jasmine 5.2 (unit), Playwright (E2E with 23 test files)
- **Build**: Angular CLI 18.2.20 with application builder
- **Document Processing**: Mammoth 1.10 for Word docs, Marked 16.2 for markdown

### Project Structure
- `src/app/components/` - Reusable UI components (header, footer, hero sections, MD3 components)
- `src/app/pages/` - Page components with lazy loading
- `src/app/services/` - Services (SEO, theme, document, blog, Google reviews)
- `src/app/directives/` - Custom directives (image optimization, scroll reveal, magnetic button, lazy load)
- `src/app/styles/tokens/` - Material Design 3 SCSS tokens
- `src/assets/i18n/` - Translation files (tr.json, en.json)
- `tests/e2e/` - E2E tests with Playwright configuration
- `tests/config/` - Test configuration files (playwright.config.js, percy.config.js)
- `tools/` - Build and document processing scripts (.mjs files)
- `scripts/` - Utility scripts for translations and image conversion

### Key Features
- **Routing**: Lazy-loaded routes in `app.routes.ts` with auto-generated resource routes in `resource-routes.ts`
- **SEO**: SeoService with meta tags and structured data
- **i18n**: Default language 'tr', HTTP loader for translations, nested key structure
- **i18n Auto-Sync System**:
  - Automatically scans HTML/TypeScript files for translation keys
  - Detects missing and unused translation keys
  - Updates translation files with placeholder values
  - Generates validation reports for CI/CD
  - GitHub Actions workflow for PR validation
- **Resources System**: Dynamic resource/document pages at `/bilgi-merkezi/{category}/{document}`
- **Animations**: Liquid hero animations, scroll-triggered reveals, async animations provider
- **Custom Components**: MD3 expandable app bar, navigation rail, floating action buttons
- **Document Processing**: Automatic conversion of Word/text documents to Angular components using Mammoth

### Build Configuration
- **Output**: `dist/angular-app/browser` (for both Firebase and Vercel)
- **TypeScript**: ES2022 target with strict mode enabled
- **Budgets**: Initial 700KB warning/2MB error; Component styles 15KB warning/30KB error
- **Angular Config**: Application builder with zone.js polyfill, event coalescing
- **Compiler Options**: Strict templates, strict injection parameters, strict input access modifiers, noImplicitOverride
- **Assets**: Files from `public/` folder copied to build output
- **Styles**: SCSS tokens from `src/app/styles/tokens/_index.scss`, global styles from `src/styles.css`

### Testing Setup
- **Unit Tests**: Karma with Jasmine, Chrome launcher, runs with `npm test`
- **E2E Tests**: Playwright with config at `tests/config/playwright.config.js`
  - Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
  - Test Server: Port 4201 (webServer command auto-starts server with `npm run start -- --port 4201`)
  - Base URL: http://localhost:4200 (default), http://localhost:4201 (E2E server)
  - Test Directory: `tests/e2e/` (23 test files covering MD3 compliance, i18n, performance, visual regression)
  - Test Patterns: `**/*.spec.js`
  - Features: Screenshots on failure, video on failure, HTML reporter, trace on first retry
  - Timeout: 120 seconds
  - Parallel execution: Fully parallel, CI retries: 2

### Deployment Configuration
- **Vercel**:
  - Root directory: Empty (leave blank) or `.`
  - Build command: `npm ci && npm run build`
  - Install command: `npm ci`
  - Output directory: `dist/angular-app/browser`
- **Firebase**:
  - Public directory: `dist/angular-app/browser`
  - Config file: `firebase.json`
  - SPA rewrites: All routes to index.html

## High-Level Architecture Patterns

### Standalone Component Architecture
The application uses Angular's standalone components architecture without NgModules. Key points:
- **Bootstrap**: Application bootstrapped via `bootstrapApplication()` in `main.ts` with providers configuration
- **Route Imports**: Each lazy-loaded route imports its dependencies directly in the component
- **Shared Components**: Import shared components directly where needed (e.g., `HeroSectionComponent`, `HeaderComponent`)

### Resource System Architecture
Dynamic content system for medical information pages:
- **Auto-Generation**: Tools in `tools/` directory process documents and generate components
- **Route Generation**: `resource-routes.ts` auto-generated with all resource routes
- **Component Structure**: Each resource has its own component in `src/app/pages/resources/{category}/{name}/`
- **Document Processing Flow**: Word/Markdown → Mammoth/Marked → Angular Component → Route Registration

### i18n Architecture
Translation system with automatic key synchronization:
- **Key Detection**: `tools/i18n-auto-sync.js` scans all HTML/TS files for translation patterns
- **Auto-Sync Flow**: Missing keys → Placeholder generation → JSON update → CI validation
- **Translation Loading**: HTTP loader fetches JSON files based on selected language
- **Key Structure**: Nested objects (e.g., `SERVICES.VACCINATION.TITLE`) for organization

### Theme and Styling Architecture
Material Design 3 implementation without Angular Material:
- **Design Tokens**: SCSS variables in `src/app/styles/tokens/` define colors, typography, spacing
- **Component Styles**: Each component has scoped styles with `:host` selectors
- **Global Styles**: `src/styles.css` and `src/styles/design-system.css` for app-wide styles
- **CSS Custom Properties**: Dynamic theme switching via CSS variables

## Important Notes

- All components use standalone architecture with `bootstrapApplication()` in main.ts
- Routes are lazy-loaded for optimal performance with dynamic resource route generation in `resource-routes.ts`
- Translation keys follow nested object structure with default language 'tr' (1963+ keys across tr.json and en.json)
- Resource pages are auto-generated from documents using tools in `tools/` directory
- Strict TypeScript compilation with all strict flags including noImplicitReturns
- Application uses zone.js with event coalescing for change detection
- SVGO configuration in `tools/svgo.config.mjs` for SVG optimization
- Custom cursor implementation with interactive hover effects
- MD3 components are implemented in pure CSS without @angular/material dependency
- Python scripts available for bulk resource updates (`scripts/update_*.py`)
- GitHub Actions CI/CD workflow for i18n validation on pull requests (`i18n-check.yml`)
- Performance testing integrated via Lighthouse (`scripts/lighthouse-test.js`)

## i18n Translation Workflow

### Automatic Translation Synchronization
The project includes an automated i18n sync system that ensures all translation keys are properly maintained:

1. **Auto-Detection**: The `i18n-auto-sync.js` tool scans all HTML and TypeScript files for translation keys
2. **Pattern Recognition**: Recognizes various translation patterns including:
   - `{{ 'KEY' | translate }}`
   - `[title]="'KEY'"`
   - `translate.instant('KEY')`
   - And other common patterns

3. **Automatic Updates**: Missing keys are automatically added with placeholder values:
   - Turkish: `[TR] Key Name`
   - English: `[EN] Key Name`

4. **CI/CD Integration**: GitHub Actions workflow validates translations on every PR

### Usage
```bash
# Check and sync translations
npm run i18n:sync

# Validate translation consistency
npm run i18n:validate

# Clean unused translations
npm run i18n:clean

# Full check (sync + validate)
npm run i18n:check
```

### Best Practices
- Always run `npm run i18n:check` before committing
- Review automatically generated placeholder translations
- Keep translation keys in UPPERCASE with underscores (e.g., `HEADER.NAV_HOME`)
- Use nested structure for organization (e.g., `SERVICES.VACCINATION.TITLE`)
- Validation reports are saved to `src/assets/i18n/validation-report.json`

## Common Development Workflows

### Adding a New Page
1. Create component in `src/app/pages/{page-name}/`
2. Add route to `app.routes.ts` with lazy loading
3. Add translation keys to `tr.json` and `en.json` (or run `npm run i18n:sync`)
4. Update navigation in `HeaderComponent` if needed

### Adding a New Resource Document
1. Place document in appropriate `tools/documents/{category}/` folder
2. Run `node tools/process-documents.mjs` or `node tools/process-all-documents.mjs`
3. Routes auto-generated in `resource-routes.ts`
4. Component created in `src/app/pages/resources/{category}/{name}/`

### Testing Workflow
1. **Before committing**: Run `npm run i18n:check` to validate translations
2. **Unit tests**: Run `npm test` for all tests or `npm test -- --include=**/{spec-name}.spec.ts` for specific test
3. **E2E tests**: Start test server with `npm run start -- --port 4201`, then run `npx playwright test`
4. **Visual testing**: Use `npx playwright test --ui` for interactive mode

### Deployment Workflow
1. **Firebase**: Run `npm run deploy` (includes i18n:check and build)
2. **Preview**: Use `firebase hosting:channel:deploy preview` for preview deployments
3. **Vercel**: Push to repository, auto-deploys with configured build command