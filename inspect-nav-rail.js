const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Inspecting page for navigation rail...\n');

  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForLoadState('networkidle');

  // Check for navigation rail by various selectors
  const navRailSelectors = [
    '.navigation-rail',
    '.nav-rail',
    'nav[role="navigation"]',
    'aside',
    '.sidebar',
    '.side-nav',
    '.md3-navigation-rail',
    '[class*="rail"]',
    '[class*="sidebar"]'
  ];

  console.log('Checking for navigation rail elements...');
  for (const selector of navRailSelectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        console.log('\n✅ Found element with selector:', selector);
        const html = await element.evaluate(el => el.outerHTML.substring(0, 500));
        console.log('HTML:', html);
        const box = await element.boundingBox();
        console.log('Position:', box);
      }
    } catch (err) {
      // Continue checking
    }
  }

  // Get all elements on the left side that could be a rail
  console.log('\n🔍 Checking for left-side fixed/sticky elements...');
  const leftElements = await page.$$eval('*', elements => {
    return elements
      .filter(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        return (
          rect.x === 0 &&
          rect.width > 50 && rect.width < 400 &&
          rect.height > 400 &&
          (styles.position === 'fixed' || styles.position === 'sticky' || styles.position === 'absolute')
        );
      })
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        class: el.className,
        id: el.id,
        position: {
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height
        },
        styles: {
          position: window.getComputedStyle(el).position,
          display: window.getComputedStyle(el).display,
          zIndex: window.getComputedStyle(el).zIndex
        }
      }));
  });

  if (leftElements.length > 0) {
    console.log('Found left-side elements:', JSON.stringify(leftElements, null, 2));
  } else {
    console.log('No left-side fixed/sticky elements found');
  }

  // Check if header has navigation
  console.log('\n🔍 Checking header structure...');
  const header = await page.$('app-header, header, .header');
  if (header) {
    const headerHTML = await header.evaluate(el => el.innerHTML.substring(0, 1000));
    console.log('Header HTML (first 1000 chars):', headerHTML);
  }

  // Take a screenshot
  await page.screenshot({ path: 'nav-rail-inspect.png', fullPage: false });
  console.log('\n📸 Screenshot saved as nav-rail-inspect.png');

  await browser.close();
})();