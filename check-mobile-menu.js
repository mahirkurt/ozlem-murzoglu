const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForLoadState('networkidle');

  // Check if mobile menu exists and its state
  const mobileMenuSelector = '.mobile-menu';
  const mobileMenu = await page.$(mobileMenuSelector);

  if (mobileMenu) {
    const isActive = await mobileMenu.evaluate(el => el.classList.contains('active'));
    console.log('Mobile menu found, active:', isActive);

    const styles = await mobileMenu.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        right: computed.right,
        left: computed.left,
        width: computed.width,
        display: computed.display,
        visibility: computed.visibility,
        transform: computed.transform,
        zIndex: computed.zIndex
      };
    });
    console.log('Mobile menu styles:', JSON.stringify(styles, null, 2));

    const boundingBox = await mobileMenu.boundingBox();
    console.log('Mobile menu position:', boundingBox);
  } else {
    console.log('No mobile menu found');
  }

  // Check all visible fixed elements
  console.log('\nChecking for visible fixed elements...');
  const fixedElements = await page.$$eval('*', elements => {
    return elements
      .filter(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        // Check for fixed elements that are visible and on screen
        return (
          styles.position === 'fixed' &&
          rect.width > 100 &&
          rect.height > 100 &&
          rect.x >= 0 &&
          rect.x < window.innerWidth &&
          styles.display !== 'none' &&
          styles.visibility !== 'hidden'
        );
      })
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        classes: el.className,
        id: el.id,
        hasMenuItems: el.textContent?.includes('Hakkımızda') || el.textContent?.includes('Hizmetlerimiz'),
        rect: {
          x: Math.round(el.getBoundingClientRect().x),
          y: Math.round(el.getBoundingClientRect().y),
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height)
        }
      }));
  });

  console.log('Fixed elements found:', JSON.stringify(fixedElements, null, 2));

  // Check for any element containing the menu text
  const menuTextElement = await page.$('text=Hakkımızda');
  if (menuTextElement) {
    const parent = await menuTextElement.evaluateHandle(el => {
      let current = el;
      // Find the container that has fixed positioning
      while (current && current.parentElement) {
        const styles = window.getComputedStyle(current);
        if (styles.position === 'fixed' || styles.position === 'absolute') {
          return current;
        }
        current = current.parentElement;
      }
      return el;
    });

    const info = await parent.evaluate(el => ({
      tag: el.tagName,
      classes: el.className,
      id: el.id,
      position: window.getComputedStyle(el).position,
      rect: el.getBoundingClientRect()
    }));

    console.log('\nMenu text container:', JSON.stringify(info, null, 2));
  }

  await page.screenshot({ path: 'mobile-menu-check.png', fullPage: false });
  console.log('\nScreenshot saved as mobile-menu-check.png');

  await browser.close();
})();