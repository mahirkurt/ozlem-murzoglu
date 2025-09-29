const { test } = require('@playwright/test');

test('Check translations', async ({ page }) => {
  await page.goto('http://localhost:4201');
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'translation-check.png', fullPage: true });

  // Get page content
  const bodyText = await page.locator('body').textContent();

  // Check for translation tags
  const hasTranslationTags = /[A-Z_]+\.[A-Z_]+/.test(bodyText);

  console.log('Has translation tags:', hasTranslationTags);

  if (hasTranslationTags) {
    // Find first 10 translation tags
    const matches = bodyText.match(/[A-Z_]+\.[A-Z_]+/g);
    console.log('First translation tags found:', matches.slice(0, 10));
  }

  // Check network for tr.json
  const response = await page.request.get('http://localhost:4201/assets/i18n/tr.json');
  console.log('tr.json status:', response.status());
});