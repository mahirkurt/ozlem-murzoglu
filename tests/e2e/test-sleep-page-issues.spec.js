const { test, expect } = require('@playwright/test');

test.describe('Sağlıklı Uykular Page Issues', () => {
  test('should capture current design state', async ({ page }) => {
    await page.goto('http://localhost:4200/hizmetlerimiz/saglikli-uykular');

    // Wait for content to load
    await page.waitForSelector('.healthy-sleep-page', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for animations

    // Full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/sleep-page-before-fix.png',
      fullPage: true
    });

    // Check CTA section spacing
    const ctaSection = await page.locator('.cta-section');
    await expect(ctaSection).toBeVisible();

    // Scroll to CTA and take screenshot
    await ctaSection.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'tests/screenshots/sleep-cta-before-fix.png'
    });

    // Check package cards
    const packageCards = await page.locator('.md3-package-card').all();
    console.log(`Found ${packageCards.length} package cards`);

    // Check accordion items
    const accordionItems = await page.locator('.md3-accordion-item').all();
    console.log(`Found ${accordionItems.length} accordion items`);

    // Check stats section
    const statsSection = await page.locator('.md3-stats-grid');
    await expect(statsSection).toBeVisible();

    await statsSection.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'tests/screenshots/sleep-stats-before-fix.png'
    });
  });
});
