const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Checking localhost hero section...\n');

  // Go to localhost
  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check hero section content
  console.log('📝 HERO SECTION CONTENT:');
  console.log('========================');

  try {
    // Check if translate pipe is working
    const heroTitle = await page.textContent('.hero-title');
    const heroSubtitle = await page.textContent('.hero-subtitle');
    const heroButton = await page.textContent('.hero-button');

    console.log('Title:', heroTitle);
    console.log('Subtitle:', heroSubtitle);
    console.log('Button:', heroButton);

    // Check if translation keys are visible as text
    if (heroTitle && heroTitle.includes('HERO.')) {
      console.log('\n❌ Hero title showing translation key!');
    }
    if (heroSubtitle && heroSubtitle.includes('HERO.')) {
      console.log('❌ Hero subtitle showing translation key!');
    }

    // Check approach section
    console.log('\n📝 APPROACH SECTION:');
    console.log('====================');

    const approachCards = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.approach-card')).map(card => ({
        title: card.querySelector('h3')?.textContent?.trim(),
        desc: card.querySelector('p')?.textContent?.trim()
      }));
    });

    approachCards.forEach((card, i) => {
      console.log(`Card ${i+1}:`, card.title);
      if (card.title && card.title.includes('APPROACH.')) {
        console.log('  ❌ Translation key visible!');
      }
    });

    // Check services section
    console.log('\n📝 SERVICES SECTION:');
    console.log('===================');

    const serviceCards = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.service-card')).slice(0, 3).map(card => ({
        title: card.querySelector('.service-title')?.textContent?.trim(),
        desc: card.querySelector('.service-description')?.textContent?.trim()
      }));
    });

    serviceCards.forEach((card, i) => {
      console.log(`Service ${i+1}:`, card.title);
      if (card.title && card.title.includes('SERVICES.')) {
        console.log('  ❌ Translation key visible!');
      }
    });

  } catch (error) {
    console.log('Error:', error.message);
  }

  await browser.close();
  console.log('\n✅ Check complete!');
})();