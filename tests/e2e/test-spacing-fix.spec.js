const { test, expect } = require('@playwright/test');

test('Check CTA to Footer spacing on live site', async ({ page }) => {
  // Go to the live site
  await page.goto('https://dr-murzoglu.web.app/hakkimizda/klinigimiz');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Find CTA section and footer
  const ctaSection = page.locator('.cta-section').last();
  const footer = page.locator('app-footer');

  // Get bounding boxes
  const ctaBoundingBox = await ctaSection.boundingBox();
  const footerBoundingBox = await footer.boundingBox();

  console.log('CTA Section bottom:', ctaBoundingBox.y + ctaBoundingBox.height);
  console.log('Footer top:', footerBoundingBox.y);
  console.log('Gap between CTA and Footer:', footerBoundingBox.y - (ctaBoundingBox.y + ctaBoundingBox.height));

  // Check computed styles of CTA section
  const ctaStyles = await ctaSection.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      paddingBottom: styles.paddingBottom,
      marginBottom: styles.marginBottom,
      background: styles.background
    };
  });

  console.log('CTA Section styles:', ctaStyles);

  // Look for any elements between CTA and footer
  const elementsBetween = await page.evaluate(() => {
    const cta = document.querySelector('.cta-section:last-of-type');
    const footer = document.querySelector('app-footer');
    const ctaRect = cta.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    const elementsInBetween = [];
    const allElements = document.querySelectorAll('*');

    for (let el of allElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= ctaRect.bottom && rect.bottom <= footerRect.top && rect.height > 0) {
        elementsInBetween.push({
          tagName: el.tagName,
          className: el.className,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom
        });
      }
    }

    return elementsInBetween;
  });

  console.log('Elements between CTA and Footer:', elementsBetween);

  // Take a screenshot of the area
  await page.screenshot({
    path: 'cta-footer-spacing-test.png',
    fullPage: true
  });

  console.log('Screenshot saved as cta-footer-spacing-test.png');
});