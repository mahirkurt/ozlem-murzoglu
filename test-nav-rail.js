const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📱 Testing navigation rail and content visibility...\n');

  // Go to homepage
  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForLoadState('networkidle');

  // Check for navigation rail
  console.log('🔍 Checking for navigation rail...');
  const navRail = await page.$('md3-navigation-rail, .navigation-rail, .md3-navigation-rail, nav[class*="rail"]');
  if (navRail) {
    console.log('❌ Navigation rail found!');
    const navRailBox = await navRail.boundingBox();
    console.log('   Position:', navRailBox);
  } else {
    console.log('✅ No navigation rail found');
  }

  // Check main content visibility
  console.log('\n🔍 Checking main content...');
  const main = await page.$('main');
  if (main) {
    const mainBox = await main.boundingBox();
    console.log('   Main element:', mainBox);

    const isVisible = await main.isVisible();
    console.log('   Main visible:', isVisible);
  }

  // Check liquid hero
  console.log('\n🔍 Checking liquid hero section...');
  const liquidHero = await page.$('app-liquid-hero, .liquid-hero');
  if (liquidHero) {
    const heroBox = await liquidHero.boundingBox();
    console.log('   Hero section:', heroBox);

    const isVisible = await liquidHero.isVisible();
    console.log('   Hero visible:', isVisible);

    // Check hero content
    const heroContent = await page.$('.hero-content');
    if (heroContent) {
      const contentVisible = await heroContent.isVisible();
      console.log('   Hero content visible:', contentVisible);
    }
  }

  // Check for any element with width that might be a rail
  console.log('\n🔍 Checking for sidebar-like elements...');
  const sidebarElements = await page.$$eval('*', elements => {
    return elements
      .filter(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        // Look for narrow fixed/sticky elements on the left
        return (
          rect.width > 0 && rect.width < 100 &&
          rect.height > 400 &&
          rect.left === 0 &&
          (styles.position === 'fixed' || styles.position === 'sticky')
        );
      })
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        class: el.className,
        id: el.id,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        position: window.getComputedStyle(el).position
      }));
  });

  if (sidebarElements.length > 0) {
    console.log('❌ Found sidebar-like elements:');
    sidebarElements.forEach(el => {
      console.log('  ', el);
    });
  } else {
    console.log('✅ No sidebar-like elements found');
  }

  // Take screenshot
  await page.screenshot({ path: 'nav-rail-check.png', fullPage: false });
  console.log('\n📸 Screenshot saved as nav-rail-check.png');

  // Check page layout
  console.log('\n🔍 Checking page layout...');
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const styles = window.getComputedStyle(body);
    return {
      marginLeft: styles.marginLeft,
      paddingLeft: styles.paddingLeft,
      transform: styles.transform
    };
  });
  console.log('   Body styles:', bodyStyles);

  // Check for any transform or margin on main
  const mainStyles = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return null;
    const styles = window.getComputedStyle(main);
    return {
      marginLeft: styles.marginLeft,
      paddingLeft: styles.paddingLeft,
      transform: styles.transform,
      position: styles.position,
      left: styles.left
    };
  });
  console.log('   Main styles:', mainStyles);

  await browser.close();
})();