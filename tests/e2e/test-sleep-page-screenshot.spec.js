const { test } = require('@playwright/test');

test('Take screenshot of sleep page', async ({ page }) => {
  // Go to live site
  await page.goto('https://ozlemmurzoglu.com/hizmetlerimiz/saglikli-uykular');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take full page screenshot
  await page.screenshot({
    path: 'sleep-page-live.png',
    fullPage: true
  });

  console.log('Screenshot saved to sleep-page-live.png');
});
