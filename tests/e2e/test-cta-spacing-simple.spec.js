const { test, expect } = require('@playwright/test');

test('CTA Footer Spacing Analysis', async ({ page }) => {
  console.log('Navigating to clinic page...');
  await page.goto('http://localhost:4200/hakkimizda/klinigimiz');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  console.log('Page loaded');

  // Get CTA section element
  const ctaSection = page.locator('.cta-section');
  await expect(ctaSection).toBeVisible();

  // Get footer element
  const footer = page.locator('.footer');
  await expect(footer).toBeVisible();

  // Get bounding boxes
  const ctaBoundingBox = await ctaSection.boundingBox();
  const footerBoundingBox = await footer.boundingBox();

  console.log('=== CTA FOOTER SPACING ANALYSIS ===');
  console.log('CTA Section bottom:', ctaBoundingBox.y + ctaBoundingBox.height);
  console.log('Footer top:', footerBoundingBox.y);
  console.log('Gap between CTA and Footer:', footerBoundingBox.y - (ctaBoundingBox.y + ctaBoundingBox.height));

  // Check CSS properties
  const ctaPaddingBottom = await ctaSection.evaluate(el => getComputedStyle(el).paddingBottom);
  const ctaMarginBottom = await ctaSection.evaluate(el => getComputedStyle(el).marginBottom);
  const footerMarginTop = await footer.evaluate(el => getComputedStyle(el).marginTop);

  console.log('=== CSS PROPERTIES ===');
  console.log('CTA padding-bottom:', ctaPaddingBottom);
  console.log('CTA margin-bottom:', ctaMarginBottom);
  console.log('Footer margin-top:', footerMarginTop);

  // Check elements between CTA and footer
  const elementsInBetween = await page.evaluate(() => {
    const ctaSection = document.querySelector('.cta-section');
    const footer = document.querySelector('.footer');

    if (!ctaSection || !footer) return [];

    const ctaRect = ctaSection.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    const allElements = Array.from(document.querySelectorAll('*'));
    const betweenElements = allElements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top >= ctaRect.bottom && rect.bottom <= footerRect.top && rect.height > 0;
    });

    return betweenElements.map(el => ({
      tagName: el.tagName,
      className: el.className,
      height: el.getBoundingClientRect().height,
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom
    }));
  });

  console.log('=== ELEMENTS BETWEEN CTA AND FOOTER ===');
  console.log('Count:', elementsInBetween.length);
  elementsInBetween.forEach((el, index) => {
    console.log(`${index + 1}. ${el.tagName}.${el.className} - Height: ${el.height}px`);
  });

  // Take screenshot
  await page.screenshot({
    path: 'tests/screenshots/cta-footer-spacing.png',
    fullPage: true
  });
  console.log('Screenshot saved to tests/screenshots/cta-footer-spacing.png');
});