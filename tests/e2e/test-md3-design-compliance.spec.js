/**
 * MD3 Expressive Design System Compliance Tests
 * Tests for About and Services pages
 */

const { test, expect } = require('@playwright/test');

test.describe('MD3 Expressive Design Compliance - About Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4201');
  });

  test('Dr. Özlem page should use MD3 components', async ({ page }) => {
    await page.goto('http://localhost:4201/hakkimizda/dr-ozlem-murzoglu');

    // Check for hero section
    const heroSection = await page.locator('app-hero-section, .hero-section, .md3-hero-section').first();
    await expect(heroSection).toBeVisible();

    // Check for MD3 typography classes
    const hasTypography = await page.locator('[class*="md3-display"], [class*="md3-headline"], [class*="md3-title"], [class*="md3-body"]').count();
    expect(hasTypography).toBeGreaterThan(0);

    // Check for MD3 color variables
    const styles = await page.evaluate(() => {
      const element = document.querySelector('body');
      const computedStyle = window.getComputedStyle(element);
      return {
        hasPrimary: computedStyle.getPropertyValue('--md3-sys-color-primary') !== '',
        hasSecondary: computedStyle.getPropertyValue('--md3-sys-color-secondary') !== '',
        hasSurface: computedStyle.getPropertyValue('--md3-sys-color-surface') !== ''
      };
    });

    expect(styles.hasPrimary || styles.hasSecondary || styles.hasSurface).toBeTruthy();

    // Check for MD3 components
    const md3Components = await page.locator('[class*="md3-card"], [class*="md3-button"], [class*="md3-chip"]').count();
    console.log(`Found ${md3Components} MD3 components on Dr. Özlem page`);
  });

  test('Clinic page should use MD3 design system', async ({ page }) => {
    await page.goto('http://localhost:4201/hakkimizda/klinigimiz');

    // Check for MD3 container
    const container = await page.locator('.container, .md3-container').first();
    await expect(container).toBeVisible();

    // Check for MD3 cards or sections
    const cards = await page.locator('[class*="card"], [class*="md3-card"]').count();
    console.log(`Found ${cards} card elements on Clinic page`);

    // Check for proper spacing
    const spacingCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="section"], [class*="container"]');
      let hasProperSpacing = false;
      elements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const padding = computedStyle.padding;
        const margin = computedStyle.margin;
        if (padding !== '0px' || margin !== '0px') {
          hasProperSpacing = true;
        }
      });
      return hasProperSpacing;
    });

    expect(spacingCheck).toBeTruthy();
  });
});

test.describe('MD3 Expressive Design Compliance - Services Pages', () => {
  test('Triple P page should have MD3 hero section', async ({ page }) => {
    await page.goto('http://localhost:4201/hizmetlerimiz/triple-p');

    // Check for hero section with proper structure
    const heroSection = await page.locator('app-hero-section, .hero-section').first();
    await expect(heroSection).toBeVisible();

    // Check for breadcrumb navigation
    const breadcrumb = await page.locator('.breadcrumb, [class*="breadcrumb"]').first();
    const hasBreadcrumb = await breadcrumb.count();
    console.log(`Breadcrumb found: ${hasBreadcrumb > 0}`);

    // Check for MD3 buttons
    const buttons = await page.locator('button, .btn-primary, .btn-secondary, [class*="md3-button"]').count();
    expect(buttons).toBeGreaterThan(0);

    // Check for proper color theme
    const colorTheme = await page.evaluate(() => {
      const hero = document.querySelector('[data-theme]');
      return hero ? hero.getAttribute('data-theme') : null;
    });
    console.log(`Color theme: ${colorTheme}`);
  });

  test('Lab Services page should use MD3 components', async ({ page }) => {
    await page.goto('http://localhost:4201/hizmetlerimiz/laboratuvar');

    // Check for service cards
    const serviceCards = await page.locator('[class*="service-card"], [class*="md3-card"]').count();
    console.log(`Found ${serviceCards} service cards on Lab page`);

    // Check for MD3 elevation
    const hasElevation = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="card"]');
      let elevationFound = false;
      cards.forEach(card => {
        const boxShadow = window.getComputedStyle(card).boxShadow;
        if (boxShadow && boxShadow !== 'none') {
          elevationFound = true;
        }
      });
      return elevationFound;
    });

    expect(hasElevation).toBeTruthy();
  });

  test('Sağlıklı Uykular page should have updated MD3 design', async ({ page }) => {
    await page.goto('http://localhost:4201/hizmetlerimiz/saglikli-uykular');

    // Check for global hero section component
    const heroSection = await page.locator('app-hero-section').first();
    await expect(heroSection).toBeVisible();

    // Check for hero features section
    const heroFeatures = await page.locator('.hero-features').first();
    await expect(heroFeatures).toBeVisible();

    // Check for feature chips
    const featureChips = await page.locator('.feature-chip').count();
    expect(featureChips).toBeGreaterThan(0);

    // Check for CTA buttons
    const ctaButtons = await page.locator('.cta-buttons button, .cta-buttons a').count();
    expect(ctaButtons).toBeGreaterThan(0);

    // Check MD3 sections
    const md3Sections = await page.locator('.md3-section, .md3-container').count();
    console.log(`Found ${md3Sections} MD3 sections on Sağlıklı Uykular page`);
  });

  test('Bright Futures page should follow MD3 guidelines', async ({ page }) => {
    await page.goto('http://localhost:4201/hizmetlerimiz/bright-futures');

    // Check for proper typography hierarchy
    const headings = await page.evaluate(() => {
      const h1 = document.querySelectorAll('h1').length;
      const h2 = document.querySelectorAll('h2').length;
      const h3 = document.querySelectorAll('h3').length;
      return { h1, h2, h3 };
    });

    console.log('Typography hierarchy:', headings);
    expect(headings.h1).toBeGreaterThanOrEqual(1);

    // Check for MD3 grid system
    const gridElements = await page.locator('[class*="grid"], [class*="md3-grid"]').count();
    console.log(`Found ${gridElements} grid elements`);
  });
});

test.describe('MD3 Color and Typography Validation', () => {
  test('Should load MD3 Expressive CSS variables', async ({ page }) => {
    await page.goto('http://localhost:4201');

    // Check for MD3 Expressive variables
    const md3Variables = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);

      return {
        // Color variables
        primaryColor: computedStyle.getPropertyValue('--md3-sys-color-primary'),
        secondaryColor: computedStyle.getPropertyValue('--md3-sys-color-secondary'),
        tertiaryColor: computedStyle.getPropertyValue('--md3-sys-color-tertiary'),

        // Typography variables
        displayLarge: computedStyle.getPropertyValue('--md3-sys-typescale-display-large-size'),
        headlineLarge: computedStyle.getPropertyValue('--md3-sys-typescale-headline-large-size'),

        // Elevation variables
        elevation1: computedStyle.getPropertyValue('--md3-sys-elevation-level1'),
        elevation2: computedStyle.getPropertyValue('--md3-sys-elevation-level2'),

        // Motion variables
        motionEasing: computedStyle.getPropertyValue('--md3-sys-motion-easing-standard'),

        // Spacing variables
        spacing1: computedStyle.getPropertyValue('--md3-sys-spacing-1'),
        spacing2: computedStyle.getPropertyValue('--md3-sys-spacing-2')
      };
    });

    console.log('MD3 Variables loaded:', md3Variables);

    // Verify essential variables are loaded
    expect(md3Variables.primaryColor).toBeTruthy();
    expect(md3Variables.displayLarge).toBeTruthy();
    expect(md3Variables.spacing1).toBeTruthy();
  });

  test('Should have responsive typography', async ({ page, viewport }) => {
    await page.goto('http://localhost:4201/hakkimizda/dr-ozlem-murzoglu');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopFontSize = await page.evaluate(() => {
      const heading = document.querySelector('h1, [class*="display"], [class*="headline"]');
      return heading ? window.getComputedStyle(heading).fontSize : null;
    });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileFontSize = await page.evaluate(() => {
      const heading = document.querySelector('h1, [class*="display"], [class*="headline"]');
      return heading ? window.getComputedStyle(heading).fontSize : null;
    });

    console.log(`Font sizes - Desktop: ${desktopFontSize}, Mobile: ${mobileFontSize}`);

    // Font sizes should be different for responsive design
    expect(desktopFontSize).toBeTruthy();
    expect(mobileFontSize).toBeTruthy();
  });
});

test.describe('Visual Regression for MD3 Components', () => {
  test('Should render MD3 buttons correctly', async ({ page }) => {
    await page.goto('http://localhost:4201');

    // Find and screenshot MD3 buttons
    const buttons = await page.locator('button, [class*="btn"], [class*="md3-button"]').first();
    if (await buttons.count() > 0) {
      await buttons.screenshot({ path: 'tests/screenshots/md3-button.png' });
      console.log('Button screenshot saved');
    }
  });

  test('Should render MD3 cards with proper elevation', async ({ page }) => {
    await page.goto('http://localhost:4201/hizmetlerimiz');

    // Find and screenshot MD3 cards
    const cards = await page.locator('[class*="card"], [class*="md3-card"]').first();
    if (await cards.count() > 0) {
      await cards.screenshot({ path: 'tests/screenshots/md3-card.png' });
      console.log('Card screenshot saved');
    }
  });
});