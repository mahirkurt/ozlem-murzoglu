const { test, expect } = require('@playwright/test');

test('Check Page Structure', async ({ page }) => {
  console.log('Navigating to clinic page...');
  await page.goto('http://localhost:4200/hakkimizda/klinigimiz');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  console.log('Page loaded');

  // Get all section-like elements
  const pageStructure = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('div, section, main, footer'));
    return elements
      .filter(el => el.offsetHeight > 50) // Only visible elements with meaningful height
      .map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        height: el.getBoundingClientRect().height,
        top: el.getBoundingClientRect().top,
        textContent: el.textContent.substring(0, 100).replace(/\s+/g, ' ').trim()
      }))
      .sort((a, b) => a.top - b.top);
  });

  console.log('=== PAGE STRUCTURE ===');
  pageStructure.forEach((el, index) => {
    console.log(`${index + 1}. ${el.tagName}.${el.className || 'no-class'} - Height: ${el.height}px - "${el.textContent}"`);
  });

  // Check if specific classes exist
  const hasCtaSection = await page.locator('.cta-section').count() > 0;
  const hasFooter = await page.locator('.footer').count() > 0;
  const hasCtaContent = await page.locator('.cta-content').count() > 0;

  console.log('=== CLASS CHECKS ===');
  console.log('Has .cta-section:', hasCtaSection);
  console.log('Has .footer:', hasFooter);
  console.log('Has .cta-content:', hasCtaContent);

  // Take screenshot
  await page.screenshot({
    path: 'tests/screenshots/page-structure.png',
    fullPage: true
  });
  console.log('Screenshot saved');
});