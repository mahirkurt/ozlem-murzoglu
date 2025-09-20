const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('🔍 Checking header alignment at 1920x1080...\n');

  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check container and logo alignment
  const measurements = await page.evaluate(() => {
    const container = document.querySelector('.main-nav .container');
    const logo = document.querySelector('.logo');
    const navActions = document.querySelector('.nav-actions');
    const navContent = document.querySelector('.nav-content');

    if (!container || !logo) return null;

    const containerRect = container.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const navContentRect = navContent.getBoundingClientRect();
    const containerStyles = window.getComputedStyle(container);
    const navContentStyles = window.getComputedStyle(navContent);

    // Calculate actual content edges
    const contentLeftEdge = logoRect.left;
    const contentRightEdge = navActions ? navActions.getBoundingClientRect().right : navContentRect.right;

    // Calculate margins from viewport edges
    const leftMargin = contentLeftEdge;
    const rightMargin = window.innerWidth - contentRightEdge;

    return {
      viewport: window.innerWidth,
      container: {
        width: containerRect.width,
        left: containerRect.left,
        right: containerRect.right,
        paddingLeft: containerStyles.paddingLeft,
        paddingRight: containerStyles.paddingRight
      },
      navContent: {
        width: navContentRect.width,
        left: navContentRect.left,
        right: navContentRect.right,
        justifyContent: navContentStyles.justifyContent,
        gap: navContentStyles.gap
      },
      logo: {
        left: logoRect.left,
        width: logoRect.width
      },
      navActions: navActions ? {
        right: navActions.getBoundingClientRect().right,
        width: navActions.getBoundingClientRect().width
      } : null,
      margins: {
        left: leftMargin,
        right: rightMargin,
        difference: leftMargin - rightMargin
      }
    };
  });

  console.log('📐 Layout Analysis at 1920px viewport:');
  console.log('=====================================');

  console.log('\n🖼️ Viewport:', measurements.viewport + 'px');

  console.log('\n📦 Container:');
  console.log(`  Width: ${measurements.container.width}px`);
  console.log(`  Position: ${measurements.container.left}px from left, ${measurements.viewport - measurements.container.right}px from right`);
  console.log(`  Padding: ${measurements.container.paddingLeft} left, ${measurements.container.paddingRight} right`);

  console.log('\n📍 Nav Content:');
  console.log(`  Width: ${measurements.navContent.width}px`);
  console.log(`  Justify: ${measurements.navContent.justifyContent}`);
  console.log(`  Gap: ${measurements.navContent.gap}`);

  console.log('\n🎯 Logo:');
  console.log(`  Left edge: ${measurements.logo.left}px from viewport`);
  console.log(`  Width: ${measurements.logo.width}px`);

  if (measurements.navActions) {
    console.log('\n🔘 Nav Actions:');
    console.log(`  Right edge: ${measurements.navActions.right}px`);
    console.log(`  Distance from right: ${measurements.viewport - measurements.navActions.right}px`);
  }

  console.log('\n📊 MARGIN ANALYSIS:');
  console.log(`  Left margin (logo to edge): ${measurements.margins.left.toFixed(1)}px`);
  console.log(`  Right margin (actions to edge): ${measurements.margins.right.toFixed(1)}px`);
  console.log(`  Difference: ${Math.abs(measurements.margins.difference).toFixed(1)}px`);

  if (Math.abs(measurements.margins.difference) > 10) {
    console.log(`\n⚠️  SIGNIFICANT ASYMMETRY DETECTED!`);
    if (measurements.margins.difference > 0) {
      console.log(`  The logo has ${measurements.margins.difference.toFixed(1)}px MORE space on the left`);
    } else {
      console.log(`  The nav actions have ${Math.abs(measurements.margins.difference).toFixed(1)}px MORE space on the right`);
    }
  } else {
    console.log('\n✅ Margins are reasonably balanced');
  }

  await browser.close();
  console.log('\n✅ Analysis complete!');
})();