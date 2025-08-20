const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    console.log('Page loaded, taking screenshot...');
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('Screenshot saved as test-screenshot.png');
    
    // Wait 3 seconds to see the page
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();