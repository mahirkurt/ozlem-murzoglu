const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });

  // Test with cache busting (adding timestamp to URL)
  const timestamp = Date.now();
  const context = await browser.newContext({
    // Disable cache
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });

  const page = await context.newPage();

  console.log('Testing with cache bypass...');
  await page.goto(`https://dr-murzoglu.web.app?v=${timestamp}`, {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(3000);

  // Check hero text
  console.log('\nChecking hero section text:');
  try {
    const heroTitle = await page.textContent('h1.hero-title');
    console.log('Hero Title:', heroTitle);

    const heroSubtitle = await page.textContent('p.hero-subtitle');
    console.log('Hero Subtitle:', heroSubtitle);
  } catch (e) {
    console.log('Could not find hero elements');
  }

  // Check if routerLink is working
  console.log('\nTesting navigation:');
  const menuLinks = await page.$$eval('a[routerLink]', links =>
    links.map(link => ({
      text: link.textContent?.trim(),
      routerLink: link.getAttribute('routerLink')
    }))
  );

  console.log('Found routerLink elements:', menuLinks.length);
  menuLinks.forEach(link => {
    console.log(`- ${link.text}: ${link.routerLink}`);
  });

  // Test actual navigation
  const aboutLink = await page.$('a[routerLink="/hakkimizda"]');
  if (aboutLink) {
    await aboutLink.click();
    await page.waitForTimeout(2000);
    console.log('\nAfter clicking About link, URL:', page.url());
  }

  // Take screenshot
  await page.goto(`https://dr-murzoglu.web.app?v=${timestamp}`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'cache-busted-test.png', fullPage: false });
  console.log('\nScreenshot saved as cache-busted-test.png');

  await browser.close();
  console.log('\nTest completed!');
})();