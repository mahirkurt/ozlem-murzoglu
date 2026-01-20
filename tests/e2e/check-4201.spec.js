const { test, expect } = require('@playwright/test');

test('Check Triple P on 4200', async ({ page }) => {
  await page.goto('http://localhost:4200/hizmetlerimiz/triple-p');
  await page.waitForTimeout(3000);

  // Get page content
  const content = await page.content();
  console.log('Page has sections:', {
    hasIntro: content.includes('program-intro-section'),
    hasPhilosophy: content.includes('philosophy-section'),
    hasPrinciples: content.includes('five-principles-section'),
    hasStructure: content.includes('structure-section'),
    hasLevels: content.includes('levels-section')
  });

  const title = await page.title();
  console.log('Page title:', title);

  // Check what's visible
  const headerText = await page.locator('h1, h2').first().innerText();
  console.log('First heading:', headerText);

  await page.screenshot({ path: 'triple-p-4200.png', fullPage: true });
  console.log('Screenshot saved: triple-p-4200.png');
});
