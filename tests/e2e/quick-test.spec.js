const { test, expect } = require('@playwright/test');

test('Triple P page screenshot', async ({ page }) => {
  await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
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

  // Check what's actually visible
  const visibleText = await page.locator('body').innerText();
  console.log('Visible text length:', visibleText.length);
  console.log('First 500 chars:', visibleText.substring(0, 500));

  await page.screenshot({ path: 'triple-p-current.png', fullPage: true });
  console.log('Screenshot saved: triple-p-current.png');
});