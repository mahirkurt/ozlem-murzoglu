const { test, expect } = require('@playwright/test');

test('Detailed CTA Spacing Investigation', async ({ page }) => {
  console.log('Navigating to live clinic page...');
  await page.goto('https://dr-murzoglu.web.app/hakkimizda/klinigimiz');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  console.log('Page loaded');

  // Get detailed CSS properties for CTA section and all its children
  const ctaAnalysis = await page.evaluate(() => {
    const ctaSection = document.querySelector('.cta-section');
    if (!ctaSection) return null;

    const getComputedStyles = (el) => ({
      tagName: el.tagName,
      className: el.className,
      paddingTop: getComputedStyle(el).paddingTop,
      paddingBottom: getComputedStyle(el).paddingBottom,
      marginTop: getComputedStyle(el).marginTop,
      marginBottom: getComputedStyle(el).marginBottom,
      height: el.getBoundingClientRect().height,
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom
    });

    const result = {
      ctaSection: getComputedStyles(ctaSection),
      children: []
    };

    // Get all direct children
    Array.from(ctaSection.children).forEach(child => {
      result.children.push(getComputedStyles(child));
    });

    return result;
  });

  console.log('=== CTA SECTION ANALYSIS ===');
  console.log('CTA Section:', ctaAnalysis.ctaSection);
  console.log('CTA Children:');
  ctaAnalysis.children.forEach((child, index) => {
    console.log(`  ${index + 1}. ${child.tagName}.${child.className}`);
    console.log(`     Height: ${child.height}px, Padding: ${child.paddingTop}/${child.paddingBottom}, Margin: ${child.marginTop}/${child.marginBottom}`);
  });

  // Check if there's a wrapper div causing the spacing
  const allCTAElements = await page.evaluate(() => {
    const ctaSection = document.querySelector('.cta-section');
    const footer = document.querySelector('.footer');

    if (!ctaSection || !footer) return null;

    const ctaRect = ctaSection.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    // Get all elements that might be causing spacing
    const suspects = [];

    // Check klinigimiz-page wrapper
    const pageWrapper = document.querySelector('.klinigimiz-page');
    if (pageWrapper) {
      suspects.push({
        element: 'klinigimiz-page',
        paddingBottom: getComputedStyle(pageWrapper).paddingBottom,
        marginBottom: getComputedStyle(pageWrapper).marginBottom,
        height: pageWrapper.getBoundingClientRect().height
      });
    }

    // Check main content area
    const mainContent = document.querySelector('main');
    if (mainContent) {
      suspects.push({
        element: 'main',
        paddingBottom: getComputedStyle(mainContent).paddingBottom,
        marginBottom: getComputedStyle(mainContent).marginBottom,
        height: mainContent.getBoundingClientRect().height
      });
    }

    // Check for any divs with klinigimiz class
    const klinigimizElements = document.querySelectorAll('[class*="klinigimiz"]');
    klinigimizElements.forEach(el => {
      suspects.push({
        element: el.tagName + '.' + el.className,
        paddingBottom: getComputedStyle(el).paddingBottom,
        marginBottom: getComputedStyle(el).marginBottom,
        height: el.getBoundingClientRect().height
      });
    });

    return {
      ctaBottom: ctaRect.bottom,
      footerTop: footerRect.top,
      gap: footerRect.top - ctaRect.bottom,
      suspects
    };
  });

  console.log('=== SPACING SUSPECTS ===');
  console.log('Gap:', allCTAElements.gap);
  allCTAElements.suspects.forEach((suspect, index) => {
    console.log(`${index + 1}. ${suspect.element} - paddingBottom: ${suspect.paddingBottom}, marginBottom: ${suspect.marginBottom}`);
  });

  // Get the last element inside CTA section
  const lastCTAChild = await page.evaluate(() => {
    const ctaSection = document.querySelector('.cta-section');
    if (!ctaSection) return null;

    const lastChild = ctaSection.lastElementChild;
    if (!lastChild) return null;

    return {
      tagName: lastChild.tagName,
      className: lastChild.className,
      paddingBottom: getComputedStyle(lastChild).paddingBottom,
      marginBottom: getComputedStyle(lastChild).marginBottom,
      height: lastChild.getBoundingClientRect().height,
      bottom: lastChild.getBoundingClientRect().bottom
    };
  });

  console.log('=== LAST CTA CHILD ===');
  console.log('Last child:', lastCTAChild);
});