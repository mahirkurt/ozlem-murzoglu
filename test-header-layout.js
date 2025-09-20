const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Testing header layout at different screen sizes...\n');

  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Test at different viewport widths
  const viewports = [
    { width: 1920, height: 1080, name: 'Full HD' },
    { width: 1366, height: 768, name: 'Common Laptop' },
    { width: 1200, height: 800, name: 'Medium-Large' },
    { width: 1024, height: 768, name: 'iPad Landscape' },
    { width: 992, height: 768, name: 'Bootstrap lg breakpoint' },
    { width: 768, height: 1024, name: 'iPad Portrait' }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(500);

    console.log(`\n📱 ${viewport.name} (${viewport.width}x${viewport.height}):`);
    console.log('=====================================');

    // Check if desktop menu is visible
    const menuVisible = await page.isVisible('.nav-menu');
    console.log(`Desktop Menu: ${menuVisible ? '✓ Visible' : '✗ Hidden'}`);

    // Check if mobile toggle is visible
    const mobileToggleVisible = await page.isVisible('.mobile-menu-toggle');
    console.log(`Mobile Toggle: ${mobileToggleVisible ? '✓ Visible' : '✗ Hidden'}`);

    // Check if appointment button is visible
    const appointmentBtnVisible = await page.isVisible('.appointment-btn');
    console.log(`Appointment Button: ${appointmentBtnVisible ? '✓ Visible' : '✗ Hidden'}`);

    // Count visible menu items if menu is visible
    if (menuVisible) {
      const menuItems = await page.$$eval('.nav-link', links => links.map(link => link.textContent.trim()));
      console.log(`Menu Items (${menuItems.length}): ${menuItems.join(', ')}`);
    }

    // Test navigation links
    if (viewport.width >= 992) {
      console.log('\n🔗 Testing navigation links:');

      // Test a dropdown item
      await page.hover('.nav-item:nth-child(3)'); // Info Center
      await page.waitForTimeout(500);

      const dropdownVisible = await page.isVisible('.dropdown-menu');
      console.log(`Dropdown opens on hover: ${dropdownVisible ? '✓ Yes' : '✗ No'}`);

      if (dropdownVisible) {
        const firstDropdownLink = await page.$eval('.dropdown-link', el => el.href);
        console.log(`First dropdown link: ${firstDropdownLink}`);
      }
    }
  }

  await browser.close();
  console.log('\n✅ Header layout test complete!');
})();