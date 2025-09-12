# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 application for Dr. Özlem Murzoğlu's pediatric clinic website with Material Design 3 principles, i18n support (Turkish/English), and Firebase hosting.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
npm start

# Production build
npm run build

# Run tests
npm test

# Optimize SVG illustrations
npm run svgo

# Run Playwright E2E tests
npx playwright test --config=tests/config/playwright.config.js

# Firebase deployment
firebase deploy
```

## Architecture

### Core Technologies
- **Framework**: Angular 18 with standalone components
- **Styling**: CSS with Material Design 3 principles
- **Fonts**: Figtree (headings), DM Sans (body)
- **i18n**: @ngx-translate for Turkish/English support
- **Deployment**: Firebase Hosting / Vercel
- **Testing**: Karma (unit), Playwright (E2E)

### Project Structure
- `src/app/components/` - Reusable UI components (header, footer, hero sections, MD3 components)
- `src/app/pages/` - Page components with lazy loading
- `src/app/services/` - Services (SEO service with structured data support)
- `src/app/directives/` - Custom directives (image optimization)
- `src/assets/i18n/` - Translation files (tr.json, en.json)
- `tests/` - E2E tests with Playwright configuration
- `tools/` - Build and document processing scripts
- `scripts/` - Utility scripts (translation validation, WebP conversion)

### Key Features
- **Routing**: Lazy-loaded routes in `app.routes.ts`
- **SEO**: SeoService with meta tags and structured data
- **i18n**: Multi-language support with translation JSON files
- **Resources System**: Dynamic resource/document pages generation
- **Animations**: Liquid hero animations, scroll-triggered reveals
- **Custom Components**: MD3 expandable app bar, navigation rail, floating action buttons

### Build Configuration
- **Output**: `dist/angular-app/browser`
- **TypeScript**: Strict mode enabled
- **Budgets**: Initial 700KB warning, 2MB error

### Testing Setup
- **Unit Tests**: Angular Karma with Jasmine
- **E2E Tests**: Playwright with multiple browser configurations
- **Test Server**: Runs on port 4201 for E2E tests

## Important Notes

- All components use standalone architecture (no NgModules)
- Routes are lazy-loaded for optimal performance
- Translation keys follow nested object structure
- Resource pages are auto-generated from documents
- Firebase config in `firebase.json` with SPA rewrites
- Strict TypeScript compilation with all strict flags enabled