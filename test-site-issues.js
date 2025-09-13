const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('1. Testing deployed site...');
  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForTimeout(2000);

  // Check hero text
  console.log('\n2. Checking hero section text...');
  const heroTitle = await page.textContent('h1.hero-title');
  console.log('Hero Title:', heroTitle);

  const heroSubtitle = await page.textContent('p.hero-subtitle');
  console.log('Hero Subtitle:', heroSubtitle);

  // Check header alignment
  console.log('\n3. Checking header alignment...');
  const headerBounds = await page.locator('header').boundingBox();
  console.log('Header position:', headerBounds);

  // Check menu links
  console.log('\n4. Testing menu navigation...');

  // Test "Hakkımızda" link
  await page.click('text=Hakkımızda');
  await page.waitForTimeout(1000);
  const aboutUrl = page.url();
  console.log('After clicking Hakkımızda, URL:', aboutUrl);

  // Go back and test "Hizmetlerimiz"
  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForTimeout(1000);
  await page.click('text=Hizmetlerimiz');
  await page.waitForTimeout(1000);
  const servicesUrl = page.url();
  console.log('After clicking Hizmetlerimiz, URL:', servicesUrl);

  // Take screenshots
  console.log('\n5. Taking screenshots...');
  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'homepage-issue.png', fullPage: false });
  console.log('Screenshot saved as homepage-issue.png');

  // Check for navigation rail
  console.log('\n6. Checking for navigation rail...');
  const navRail = await page.locator('.navigation-rail, .nav-rail, [class*="rail"]').count();
  console.log('Navigation rail elements found:', navRail);

  // Check container alignment
  const container = await page.locator('.container, .md3-container').first();
  const containerBounds = await container.boundingBox();
  console.log('Container bounds:', containerBounds);

  await browser.close();
  console.log('\nTest completed!');
})();