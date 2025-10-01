const { test, expect } = require('@playwright/test');

test('Live Site CTA Footer Spacing Analysis', async ({ page }) => {
  console.log('Navigating to live clinic page...');
  await page.goto('https://dr-murzoglu.web.app/hakkimizda/klinigimiz');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  console.log('Page loaded');

  // Check if specific classes exist first
  const hasCtaSection = await page.locator('.cta-section').count() > 0;
  const hasFooter = await page.locator('.footer').count() > 0;

  console.log('=== CLASS CHECKS ===');
  console.log('Has .cta-section:', hasCtaSection);
  console.log('Has .footer:', hasFooter);

  if (!hasCtaSection || !hasFooter) {
    console.log('Missing expected elements. Checking page structure...');

    // Get all section-like elements
    const pageStructure = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div, section, main, footer, [class*="cta"], [class*="footer"]'));
      return elements
        .filter(el => el.offsetHeight > 50)
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

    console.log('=== PAGE STRUCTURE (first 10) ===');
    pageStructure.slice(0, 10).forEach((el, index) => {
      console.log(`${index + 1}. ${el.tagName}.${el.className || 'no-class'} - Height: ${el.height}px`);
    });

    return;
  }

  // Get CTA section element
  const ctaSection = page.locator('.cta-section');
  const footer = page.locator('.footer');

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
      return rect.top >= ctaRect.bottom && rect.bottom <= footerRect.top && rect.height > 5;
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
    path: 'tests/screenshots/live-cta-footer-spacing.png',
    fullPage: true
  });
  console.log('Screenshot saved to tests/screenshots/live-cta-footer-spacing.png');
});