const { test, expect } = require('@playwright/test');

test('Detailed CTA to Footer spacing analysis', async ({ page }) => {
  // Go to the live site
  await page.goto('https://dr-murzoglu.web.app/hakkimizda/klinigimiz');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Get detailed element information
  const elementInfo = await page.evaluate(() => {
    const cta = document.querySelector('.cta-section:last-of-type');
    const footer = document.querySelector('app-footer');

    const ctaRect = cta.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    // Get computed styles
    const ctaStyles = window.getComputedStyle(cta);
    const footerStyles = window.getComputedStyle(footer);

    // Check the parent container
    const parent = cta.parentElement;
    const parentStyles = window.getComputedStyle(parent);

    return {
      cta: {
        bottom: ctaRect.bottom,
        height: ctaRect.height,
        paddingBottom: ctaStyles.paddingBottom,
        marginBottom: ctaStyles.marginBottom,
        tagName: cta.tagName,
        className: cta.className
      },
      footer: {
        top: footerRect.top,
        height: footerRect.height,
        marginTop: footerStyles.marginTop,
        paddingTop: footerStyles.paddingTop,
        tagName: footer.tagName,
        className: footer.className
      },
      parent: {
        tagName: parent.tagName,
        className: parent.className,
        marginBottom: parentStyles.marginBottom,
        paddingBottom: parentStyles.paddingBottom
      },
      gap: footerRect.top - ctaRect.bottom
    };
  });

  console.log('CTA Info:', elementInfo.cta);
  console.log('Footer Info:', elementInfo.footer);
  console.log('Parent Info:', elementInfo.parent);
  console.log('Calculated Gap:', elementInfo.gap);

  // Check if elements are overlapping
  if (elementInfo.gap <= 0) {
    console.log('ISSUE: Elements are overlapping or touching!');
  } else {
    console.log('SUCCESS: There is a gap of', elementInfo.gap, 'px');
  }

  // Take a detailed screenshot
  await page.screenshot({
    path: 'detailed-spacing-test.png',
    fullPage: true
  });
});