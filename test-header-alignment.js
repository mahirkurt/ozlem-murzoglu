const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Checking header alignment...\n');

  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check container and logo alignment
  const containerInfo = await page.evaluate(() => {
    const container = document.querySelector('.main-nav .container');
    const logo = document.querySelector('.logo');
    const navActions = document.querySelector('.nav-actions');

    if (!container || !logo) return null;

    const containerRect = container.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const containerStyles = window.getComputedStyle(container);
    const bodyWidth = document.body.clientWidth;

    // Calculate actual distances
    const leftDistance = logoRect.left;
    const rightDistance = bodyWidth - (navActions ? navActions.getBoundingClientRect().right : containerRect.right);

    return {
      container: {
        width: containerRect.width,
        left: containerRect.left,
        right: containerRect.right,
        paddingLeft: containerStyles.paddingLeft,
        paddingRight: containerStyles.paddingRight,
        maxWidth: containerStyles.maxWidth
      },
      logo: {
        left: logoRect.left,
        width: logoRect.width,
        distanceFromLeftEdge: leftDistance
      },
      navActions: navActions ? {
        right: navActions.getBoundingClientRect().right,
        distanceFromRightEdge: rightDistance
      } : null,
      viewport: {
        width: bodyWidth
      },
      asymmetry: leftDistance - rightDistance
    };
  });

  console.log('📐 Container Info:');
  console.log(`  Width: ${containerInfo.container.width}px`);
  console.log(`  Max Width: ${containerInfo.container.maxWidth}`);
  console.log(`  Padding Left: ${containerInfo.container.paddingLeft}`);
  console.log(`  Padding Right: ${containerInfo.container.paddingRight}`);
  console.log(`  Left Position: ${containerInfo.container.left}px`);
  console.log(`  Right Position: ${containerInfo.container.right}px`);

  console.log('\n🎯 Logo Position:');
  console.log(`  Logo Left Edge: ${containerInfo.logo.left}px`);
  console.log(`  Distance from browser left: ${containerInfo.logo.distanceFromLeftEdge}px`);

  if (containerInfo.navActions) {
    console.log('\n🔘 Nav Actions Position:');
    console.log(`  Distance from browser right: ${containerInfo.navActions.distanceFromRightEdge}px`);
  }

  console.log('\n📊 Alignment Analysis:');
  console.log(`  Viewport Width: ${containerInfo.viewport.width}px`);
  console.log(`  Left Margin: ${containerInfo.logo.distanceFromLeftEdge}px`);
  console.log(`  Right Margin: ${containerInfo.navActions?.distanceFromRightEdge || 'N/A'}px`);

  if (containerInfo.navActions) {
    const asymmetry = Math.abs(containerInfo.asymmetry);
    if (asymmetry > 5) {
      console.log(`  ⚠️  ASYMMETRY DETECTED: ${asymmetry.toFixed(1)}px difference`);
      if (containerInfo.asymmetry > 0) {
        console.log('     Left margin is larger than right margin');
      } else {
        console.log('     Right margin is larger than left margin');
      }
    } else {
      console.log(`  ✅ Margins are balanced (difference: ${asymmetry.toFixed(1)}px)`);
    }
  }

  // Take screenshot with guides
  await page.evaluate(() => {
    // Add visual guides
    const leftGuide = document.createElement('div');
    leftGuide.style.cssText = 'position: fixed; left: 0; top: 0; bottom: 200px; width: 1px; background: red; z-index: 10000;';

    const rightGuide = document.createElement('div');
    rightGuide.style.cssText = 'position: fixed; right: 0; top: 0; bottom: 200px; width: 1px; background: red; z-index: 10000;';

    const logo = document.querySelector('.logo');
    const navActions = document.querySelector('.nav-actions');

    if (logo) {
      const logoLeft = logo.getBoundingClientRect().left;
      const logoGuide = document.createElement('div');
      logoGuide.style.cssText = `position: fixed; left: ${logoLeft}px; top: 0; bottom: 200px; width: 1px; background: blue; z-index: 10000;`;
      document.body.appendChild(logoGuide);
    }

    if (navActions) {
      const navRight = navActions.getBoundingClientRect().right;
      const navGuide = document.createElement('div');
      navGuide.style.cssText = `position: fixed; left: ${navRight}px; top: 0; bottom: 200px; width: 1px; background: green; z-index: 10000;`;
      document.body.appendChild(navGuide);
    }

    document.body.appendChild(leftGuide);
    document.body.appendChild(rightGuide);
  });

  await page.screenshot({ path: 'header-alignment-check.png' });
  console.log('\n📸 Screenshot saved: header-alignment-check.png');
  console.log('   Red lines: Browser edges');
  console.log('   Blue line: Logo left edge');
  console.log('   Green line: Nav actions right edge');

  await browser.close();
  console.log('\n✅ Alignment check complete!');
})();