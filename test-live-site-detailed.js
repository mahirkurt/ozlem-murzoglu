const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500 // Slow down for better observation
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  console.log('======================================');
  console.log('TESTING LIVE SITE: dr-murzoglu.web.app');
  console.log('======================================\n');

  // Navigate to homepage
  await page.goto('https://dr-murzoglu.web.app', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(3000);

  // 1. Check Hero Section Content
  console.log('1. HERO SECTION CONTENT:');
  console.log('------------------------');
  try {
    // Check if hero section exists
    const heroSection = await page.$('.liquid-hero');
    if (heroSection) {
      console.log('✓ Hero section found');

      // Get hero title
      const heroTitle = await page.$eval('h1.hero-title', el => el.textContent);
      console.log('Title:', heroTitle ? heroTitle.trim() : 'NOT FOUND');

      // Get hero subtitle
      try {
        const heroSubtitle = await page.$eval('p.hero-subtitle', el => el.textContent);
        console.log('Subtitle:', heroSubtitle ? heroSubtitle.trim() : 'NOT FOUND');
      } catch {
        console.log('Subtitle: NOT FOUND (element doesn\'t exist)');
      }
    } else {
      console.log('✗ Hero section NOT found');
    }
  } catch (e) {
    console.log('Error checking hero:', e.message);
  }

  // 2. Check Header Position
  console.log('\n2. HEADER POSITIONING:');
  console.log('----------------------');
  const header = await page.$('header');
  if (header) {
    const headerBox = await header.boundingBox();
    console.log('Header position:', headerBox);

    // Check container inside header
    const headerContainer = await page.$('header .container');
    if (headerContainer) {
      const containerBox = await headerContainer.boundingBox();
      console.log('Header container:', containerBox);

      // Check if centered
      const pageWidth = await page.evaluate(() => window.innerWidth);
      const expectedCenter = pageWidth / 2;
      const actualCenter = containerBox.x + (containerBox.width / 2);
      const offset = Math.abs(expectedCenter - actualCenter);

      if (offset < 10) {
        console.log('✓ Header is centered (offset:', offset, 'px)');
      } else {
        console.log('✗ Header is NOT centered (offset:', offset, 'px)');
      }
    }
  }

  // 3. Check Navigation Links
  console.log('\n3. NAVIGATION LINKS:');
  console.log('--------------------');

  // Check for href vs routerLink
  const hrefLinks = await page.$$eval('header a[href]', links =>
    links.map(link => ({
      text: link.textContent?.trim(),
      href: link.getAttribute('href')
    }))
  );

  const routerLinks = await page.$$eval('header a[routerLink]', links =>
    links.map(link => ({
      text: link.textContent?.trim(),
      routerLink: link.getAttribute('routerLink')
    }))
  );

  console.log('Links with href:', hrefLinks.length);
  console.log('Links with routerLink:', routerLinks.length);

  if (hrefLinks.length > 0) {
    console.log('\nHref links found (PROBLEM - should be routerLink):');
    hrefLinks.slice(0, 5).forEach(link => {
      if (link.href?.startsWith('/')) {
        console.log(`  ✗ "${link.text}" -> ${link.href}`);
      }
    });
  }

  // 4. Test Navigation
  console.log('\n4. TESTING NAVIGATION:');
  console.log('----------------------');

  // Try clicking "Hakkımızda"
  try {
    const aboutLink = await page.$('text=Hakkımızda');
    if (aboutLink) {
      console.log('Clicking "Hakkımızda"...');
      await aboutLink.click();
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);

      if (currentUrl.includes('/hakkimizda')) {
        console.log('✓ Navigation worked');
      } else {
        console.log('✗ Navigation FAILED - still on:', currentUrl);
      }
    } else {
      console.log('✗ "Hakkımızda" link not found');
    }
  } catch (e) {
    console.log('Error testing navigation:', e.message);
  }

  // Go back to homepage
  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForTimeout(2000);

  // 5. Check for any console errors
  console.log('\n5. CONSOLE ERRORS:');
  console.log('------------------');
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });

  // 6. Take screenshots
  console.log('\n6. TAKING SCREENSHOTS:');
  console.log('----------------------');
  await page.screenshot({ path: 'live-site-full.png', fullPage: true });
  console.log('✓ Full page screenshot: live-site-full.png');

  await page.screenshot({ path: 'live-site-viewport.png', fullPage: false });
  console.log('✓ Viewport screenshot: live-site-viewport.png');

  // 7. Check actual HTML source
  console.log('\n7. HTML SOURCE CHECK:');
  console.log('---------------------');
  const heroHtml = await page.$eval('.liquid-hero', el => el.innerHTML.substring(0, 500));
  console.log('Hero HTML preview:', heroHtml.includes('Bilimin') ? '✓ Contains new text' : '✗ OLD TEXT still present');

  await browser.close();
  console.log('\n======================================');
  console.log('TEST COMPLETED');
  console.log('======================================');
})();