const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Puppeteer test...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to homepage...');
    await page.goto('https://dr-murzoglu.web.app', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit for Angular to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n=== HOMEPAGE CONTENT TEST ===\n');
    
    // Get all text content from the page
    const pageContent = await page.evaluate(() => document.body.innerText);
    console.log('Page loaded successfully. Checking for content...\n');
    
    // Check if key Turkish phrases exist on the page
    const keyPhrases = [
      'Uzm.Dr. Özlem Murzoğlu',
      'Çocuk Sağlığı ve Hastalıkları',
      'Sosyal Pediatri',
      'Çocuk Gelişimi'
    ];
    
    console.log('=== CHECKING FOR KEY PHRASES ===');
    keyPhrases.forEach(phrase => {
      const found = pageContent.includes(phrase);
      console.log(`${phrase}: ${found ? '✓ FOUND' : '✗ NOT FOUND'}`);
    });
    
    // Try to find hero content with different selectors
    console.log('\n=== HERO SECTION CONTENT ===');
    
    // Try liquid-hero first
    const liquidHeroTitle = await page.$eval('app-liquid-hero h1', el => el.textContent.trim()).catch(() => null);
    const liquidHeroSubtitle = await page.$eval('app-liquid-hero .subtitle', el => el.textContent.trim()).catch(() => null);
    
    if (liquidHeroTitle || liquidHeroSubtitle) {
      console.log('Liquid Hero Title:', liquidHeroTitle || 'NOT FOUND');
      console.log('Liquid Hero Subtitle:', liquidHeroSubtitle || 'NOT FOUND');
    } else {
      // Try hero-section
      const heroTitle = await page.$eval('.hero-title', el => el.textContent.trim()).catch(() => null);
      const heroSubtitle = await page.$eval('.hero-subtitle', el => el.textContent.trim()).catch(() => null);
      
      console.log('Hero Title:', heroTitle || 'NOT FOUND');
      console.log('Hero Subtitle:', heroSubtitle || 'NOT FOUND');
    }
    
    // Check services section
    console.log('\n=== SERVICES SECTION ===');
    const servicesExist = await page.$('.services-section') !== null;
    console.log('Services section exists:', servicesExist);
    
    if (servicesExist) {
      const servicesTitle = await page.$eval('.services-section h2', el => el.textContent.trim()).catch(() => null);
      console.log('Services Title:', servicesTitle || 'NOT FOUND');
      
      // Check service cards
      const serviceCards = await page.$$eval('.service-card', cards => 
        cards.map(card => ({
          title: card.querySelector('.service-title')?.textContent?.trim() || 
                 card.querySelector('h3')?.textContent?.trim() || 'NO TITLE',
          description: card.querySelector('.service-description')?.textContent?.trim() || 
                      card.querySelector('p')?.textContent?.trim() || 'NO DESCRIPTION'
        }))
      ).catch(() => []);
      
      if (serviceCards.length > 0) {
        console.log(`\nFound ${serviceCards.length} service cards:`);
        serviceCards.forEach((card, index) => {
          console.log(`  ${index + 1}. ${card.title}`);
          if (card.title === 'NO TITLE' || card.title.includes('SERVICE_')) {
            console.log('     ⚠️  Translation issue detected!');
          }
        });
      } else {
        console.log('No service cards found');
      }
    }
    
    // Check for translation placeholders (indicates translation issues)
    console.log('\n=== CHECKING FOR TRANSLATION ISSUES ===');
    const hasTranslationIssues = pageContent.includes('SERVICE_') || 
                                 pageContent.includes('SERVICES.') || 
                                 pageContent.includes('APPROACH.') ||
                                 pageContent.includes('HOME.');
    
    if (hasTranslationIssues) {
      console.log('⚠️  WARNING: Translation placeholders found on page!');
      console.log('This indicates the translation system is not working properly.');
      
      // Find specific placeholders
      const placeholders = pageContent.match(/[A-Z_]+\.[A-Z_]+/g) || [];
      if (placeholders.length > 0) {
        console.log('Found placeholders:', [...new Set(placeholders)].slice(0, 10));
      }
    } else {
      console.log('✓ No translation placeholders found - translations appear to be working');
    }
    
    // Take screenshots
    console.log('\n=== TAKING SCREENSHOTS ===');
    await page.screenshot({ 
      path: 'homepage-full-test.png',
      fullPage: true
    });
    console.log('Full page screenshot saved as homepage-full-test.png');
    
    await page.screenshot({ 
      path: 'homepage-viewport-test.png',
      fullPage: false
    });
    console.log('Viewport screenshot saved as homepage-viewport-test.png');
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();