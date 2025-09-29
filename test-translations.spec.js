const { test, expect } = require('@playwright/test');

test.describe('Translation Check', () => {
  test('should load Turkish translations correctly', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:4201');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot for debugging
    await page.screenshot({ path: 'homepage-translations.png' });

    // Check if translations are loaded
    const headerHome = await page.locator('text=/Ana Sayfa|NAV_HOME/').first();
    const isTranslationTag = await headerHome.textContent();

    console.log('Header text found:', isTranslationTag);

    // Check for translation tags
    const translationTags = await page.locator('text=/[A-Z_]+\.[A-Z_]+/').all();
    console.log('Found translation tags:', translationTags.length);

    if (translationTags.length > 0) {
      // Print first 5 translation tags
      for (let i = 0; i < Math.min(5, translationTags.length); i++) {
        const text = await translationTags[i].textContent();
        console.log(`Translation tag ${i + 1}:`, text);
      }
    }

    // Check network for i18n file loading
    const i18nRequests = [];
    page.on('request', request => {
      if (request.url().includes('i18n')) {
        i18nRequests.push(request.url());
      }
    });

    // Reload to capture network requests
    await page.reload();
    await page.waitForLoadState('networkidle');

    console.log('i18n requests:', i18nRequests);

    // Check console errors
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    if (consoleLogs.length > 0) {
      console.log('Console errors:', consoleLogs);
    }

    // Check if tr.json is accessible
    const response = await page.request.get('http://localhost:4201/assets/i18n/tr.json');
    console.log('tr.json status:', response.status());

    if (response.ok()) {
      const json = await response.json();
      console.log('tr.json keys:', Object.keys(json).slice(0, 5));
    }

    // Assert no translation tags are visible
    const visibleTags = await page.locator('text=/^[A-Z_]+\\.[A-Z_]+/').count();
    expect(visibleTags).toBe(0);
  });
});