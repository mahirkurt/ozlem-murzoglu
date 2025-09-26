const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForLoadState('networkidle');

  // Get all nav elements
  const navElements = await page.$$eval('nav', navs => {
    return navs.map(nav => ({
      classes: nav.className,
      id: nav.id,
      position: window.getComputedStyle(nav).position,
      display: window.getComputedStyle(nav).display,
      width: nav.getBoundingClientRect().width,
      height: nav.getBoundingClientRect().height,
      x: nav.getBoundingClientRect().x,
      y: nav.getBoundingClientRect().y,
      hasHakkimizda: nav.textContent?.includes('Hakkımızda'),
      textSample: nav.textContent?.substring(0, 100)
    }));
  });

  console.log('Nav elements found:', JSON.stringify(navElements, null, 2));

  // Check for dropdowns that might be visible
  const dropdowns = await page.$$eval('.dropdown-menu, .menu-dropdown, [class*=dropdown]', els => {
    return els.filter(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && styles.display !== 'none';
    }).map(el => ({
      classes: el.className,
      position: window.getComputedStyle(el).position,
      display: window.getComputedStyle(el).display,
      visibility: window.getComputedStyle(el).visibility,
      width: el.getBoundingClientRect().width,
      x: el.getBoundingClientRect().x,
      textSample: el.textContent?.substring(0, 50)
    }));
  });

  console.log('\nVisible dropdown elements:', JSON.stringify(dropdowns, null, 2));

  // Check if there's a dropdown that's expanded
  const expandedDropdown = await page.$('.dropdown-menu.show, .dropdown-menu[style*="display: block"], .dropdown-content.show');
  if (expandedDropdown) {
    console.log('\nFound expanded dropdown!');
    const info = await expandedDropdown.evaluate(el => ({
      classes: el.className,
      style: el.getAttribute('style'),
      parent: el.parentElement?.className
    }));
    console.log('Expanded dropdown info:', info);
  }

  await browser.close();
})();