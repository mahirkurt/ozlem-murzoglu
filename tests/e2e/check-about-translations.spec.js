const { test, expect } = require('@playwright/test');

test.describe('About Page Translation Check', () => {
  test('should not have any untranslated keys visible on the page', async ({ page }) => {
    // Navigate to the about page
    await page.goto('https://ozlemmurzoglu.com/hakkimizda');

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Get all text content
    const pageContent = await page.locator('body').textContent();

    // Check for translation key patterns
    const translationKeyPatterns = [
      /ABOUT\.[A-Z_]+/g,
      /HEADER\.[A-Z_]+/g,
      /SERVICES\.[A-Z_]+/g,
      /APPROACH\.[A-Z_]+/g,
      /COMMON\.[A-Z_]+/g
    ];

    const foundKeys = [];
    for (const pattern of translationKeyPatterns) {
      const matches = pageContent.match(pattern);
      if (matches) {
        foundKeys.push(...matches);
      }
    }

    // Log any found translation keys
    if (foundKeys.length > 0) {
      console.log('Found untranslated keys:', [...new Set(foundKeys)]);
    }

    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'tests/screenshots/about-page.png', fullPage: true });

    // Get all visible text elements and check for specific patterns
    const visibleTexts = await page.evaluate(() => {
      const texts = [];
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        if (el.offsetParent !== null && el.childNodes.length > 0) {
          for (let node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              texts.push(node.textContent.trim());
            }
          }
        }
      });
      return texts;
    });

    // Filter for texts that look like translation keys
    const suspiciousTexts = visibleTexts.filter(text =>
      text.includes('.') && text.match(/^[A-Z_]+(\.[A-Z_]+)+$/)
    );

    console.log('Suspicious texts found:', suspiciousTexts);

    // Assertion
    expect(foundKeys.length).toBe(0);
  });
});