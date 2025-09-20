# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 application for Dr. Özlem Murzoğlu's pediatric clinic website with Material Design 3 principles, i18n support (Turkish/English), and Firebase/Vercel hosting.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
npm start

# Production build
npm run build

# Run unit tests (Karma)
npm test

# Run E2E tests (Playwright)
npx playwright test --config=tests/config/playwright.config.js

# Run single E2E test file
npx playwright test tests/e2e/test-i18n.spec.js

# E2E test server (port 4201)
npm run start -- --port 4201

# Optimize SVG illustrations
npm run svgo

# Firebase deployment
firebase deploy

# Translation validation
node scripts/validate-translations.js

# Clean unused translations
node scripts/clean-unused-translations.js

# WebP image conversion
node scripts/convert-to-webp.js

# Process resource documents (multiple tools available)
node tools/process-documents.mjs
node tools/process-all-documents.mjs
node tools/process-clean-documents.mjs
```

## Architecture

### Core Technologies
- **Framework**: Angular 18.2 with standalone components (no NgModules)
- **TypeScript**: 5.5.2 with strict mode and all strict flags enabled
- **Styling**: CSS with Material Design 3 principles, SCSS tokens
- **UI Library**: @angular/material 18.2.14 with CDK
- **Fonts**: Figtree (headings), DM Sans (body)
- **i18n**: @ngx-translate/core v17 for Turkish/English support
- **Deployment**: Firebase Hosting / Vercel
- **Testing**: Karma 6.4 with Jasmine 5.2 (unit), Playwright (E2E)
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
- **Resources System**: Dynamic resource/document pages at `/bilgi-merkezi/{category}/{document}`
- **Animations**: Liquid hero animations, scroll-triggered reveals, async animations provider
- **Custom Components**: MD3 expandable app bar, navigation rail, floating action buttons
- **Document Processing**: Automatic conversion of Word/text documents to Angular components using Mammoth

### Build Configuration
- **Output**: `dist/angular-app/browser` (for both Firebase and Vercel)
- **TypeScript**: ES2022 target with strict mode enabled
- **Budgets**: Initial 700KB warning/2MB error; Component styles 12KB warning/24KB error
- **Angular Config**: Application builder with zone.js polyfill, event coalescing
- **Compiler Options**: Strict templates, strict injection parameters, strict input access modifiers, noImplicitOverride

### Testing Setup
- **Unit Tests**: Karma with Jasmine, Chrome launcher, runs with `npm test`
- **E2E Tests**: Playwright with config at `tests/config/playwright.config.js`
  - Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
  - Test Server: Port 4201
  - Test Patterns: `check-*.spec.js` and `test-*.spec.js`
  - Features: Screenshots on failure, video on failure, HTML reporter
  - Timeout: 120 seconds

### Deployment Configuration
- **Vercel**:
  - Root directory: Empty (leave blank)
  - Build command: `npm ci && npm run build`
  - Output directory: `dist/angular-app/browser`
- **Firebase**:
  - Public directory: `dist/angular-app/browser`
  - SPA rewrites: All routes to index.html

## Important Notes

- All components use standalone architecture with `bootstrapApplication()` in main.ts
- Routes are lazy-loaded for optimal performance
- Translation keys follow nested object structure with default language 'tr'
- Resource pages are auto-generated from documents using tools in `tools/` directory
- Strict TypeScript compilation with all strict flags including noImplicitReturns
- Application uses zone.js with event coalescing for change detection
- SVGO configuration in `tools/svgo.config.mjs` for SVG optimization
- Custom cursor implementation with interactive hover effects