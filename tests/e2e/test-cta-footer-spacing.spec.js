const { test, expect } = require('@playwright/test');

test.describe('CTA Section and Footer Spacing', () => {
  test('should have no gap between CTA section and footer on clinic page', async ({ page }) => {
    // Navigate to clinic page
    await page.goto('http://localhost:4200/hakkimizda/klinigimiz');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get CTA section element
    const ctaSection = page.locator('.cta-section');
    await expect(ctaSection).toBeVisible();

    // Get footer element
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();

    // Get bounding boxes
    const ctaBoundingBox = await ctaSection.boundingBox();
    const footerBoundingBox = await footer.boundingBox();

    console.log('CTA Section bottom:', ctaBoundingBox.y + ctaBoundingBox.height);
    console.log('Footer top:', footerBoundingBox.y);
    console.log('Gap between CTA and Footer:', footerBoundingBox.y - (ctaBoundingBox.y + ctaBoundingBox.height));

    // Calculate gap between CTA section and footer
    const gap = footerBoundingBox.y - (ctaBoundingBox.y + ctaBoundingBox.height);

    // Gap should be 0 or very minimal (allowing for sub-pixel differences)
    expect(gap).toBeLessThanOrEqual(2);

    // Take screenshot for verification
    await page.screenshot({
      path: 'tests/screenshots/cta-footer-spacing.png',
      fullPage: true
    });
  });

  test('should check CTA section CSS properties', async ({ page }) => {
    await page.goto('http://localhost:4200/hakkimizda/klinigimiz');
    await page.waitForLoadState('networkidle');

    const ctaSection = page.locator('.cta-section');

    // Check padding-bottom is 0
    const paddingBottom = await ctaSection.evaluate(el =>
      getComputedStyle(el).paddingBottom
    );
    console.log('CTA Section padding-bottom:', paddingBottom);

    // Check margin-bottom is 0
    const marginBottom = await ctaSection.evaluate(el =>
      getComputedStyle(el).marginBottom
    );
    console.log('CTA Section margin-bottom:', marginBottom);

    expect(paddingBottom).toBe('0px');
    expect(marginBottom).toBe('0px');
  });

  test('should check footer CSS properties', async ({ page }) => {
    await page.goto('http://localhost:4200/hakkimizda/klinigimiz');
    await page.waitForLoadState('networkidle');

    const footer = page.locator('.footer');

    // Check margin-top is 0
    const marginTop = await footer.evaluate(el =>
      getComputedStyle(el).marginTop
    );
    console.log('Footer margin-top:', marginTop);

    expect(marginTop).toBe('0px');
  });

  test('should measure actual visual gap', async ({ page }) => {
    await page.goto('http://localhost:4200/hakkimizda/klinigimiz');
    await page.waitForLoadState('networkidle');

    // Scroll to CTA section
    await page.locator('.cta-section').scrollIntoViewIfNeeded();

    // Get all elements between CTA and footer
    const elementsInBetween = await page.evaluate(() => {
      const ctaSection = document.querySelector('.cta-section');
      const footer = document.querySelector('.footer');

      if (!ctaSection || !footer) return [];

      const ctaRect = ctaSection.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();

      // Find all elements between CTA bottom and footer top
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

    console.log('Elements between CTA and footer:', elementsInBetween);

    // Should have no elements between CTA and footer
    expect(elementsInBetween.length).toBe(0);
  });
});