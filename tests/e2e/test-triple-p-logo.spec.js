const { test, expect } = require('@playwright/test');

test('Triple P logo and translations check', async ({ page }) => {
  await page.goto('http://localhost:4200/hizmetlerimiz/triple-p');
  await page.waitForTimeout(3000);

  // Check logo visibility
  const logo = page.locator('img[src="/images/Triple_P.svg"]');
  const logoExists = await logo.count() > 0;
  console.log('Logo with correct path exists:', logoExists);

  if (logoExists) {
    const isVisible = await logo.isVisible();
    console.log('Logo is visible:', isVisible);

    // Check if image actually loads
    const imgStatus = await logo.evaluate((img) => {
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        src: img.src,
        loaded: img.naturalWidth > 0 && img.naturalHeight > 0
      };
    });
    console.log('Logo image status:', imgStatus);
  }

  // Check for translation placeholders
  const bodyText = await page.locator('body').innerText();
  const hasTRTags = bodyText.includes('[TR]');
  const hasENTags = bodyText.includes('[EN]');

  console.log('\n=== Translation Check ===');
  console.log('Has [TR] placeholders:', hasTRTags);
  console.log('Has [EN] placeholders:', hasENTags);

  // Check specific translations
  const titleElement = page.locator('h2').filter({ hasText: 'Pozitif Ebeveynlik Programı' });
  const titleExists = await titleElement.count() > 0;
  console.log('Has "Pozitif Ebeveynlik Programı" title:', titleExists);

  const scienceTitle = page.locator('h2').filter({ hasText: 'Bilimin Işığında Ebeveynlik' });
  const scienceExists = await scienceTitle.count() > 0;
  console.log('Has "Bilimin Işığında Ebeveynlik" title:', scienceExists);

  // Check section paddings
  const sections = [
    '.program-intro-section',
    '.philosophy-section',
    '.five-principles-section',
    '.benefits-section',
    '.structure-section',
    '.levels-section',
    '.group-section'
  ];

  console.log('\n=== Section Padding Check ===');
  for (const selector of sections) {
    const section = page.locator(selector).first();
    const exists = await section.count() > 0;

    if (exists) {
      const padding = await section.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          left: computed.paddingLeft,
          right: computed.paddingRight
        };
      });
      console.log(`${selector}: L=${padding.left} R=${padding.right}`);
    }
  }

  // Take a screenshot for visual verification
  await page.screenshot({ path: 'triple-p-verified.png', fullPage: true });
  console.log('\n=== Screenshot saved: triple-p-verified.png ===');
});