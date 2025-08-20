const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    console.log('Console:', msg.type(), msg.text());
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  // Listen to request failures
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), request.failure().errorText);
  });

  await page.goto('http://localhost:3004', { waitUntil: 'networkidle2' });
  
  // Get page content
  const content = await page.content();
  console.log('Page HTML length:', content.length);
  
  // Check for specific elements
  const hasHeader = await page.$('header') !== null;
  const hasMain = await page.$('main') !== null;
  const hasFooter = await page.$('footer') !== null;
  
  console.log('Has header:', hasHeader);
  console.log('Has main:', hasMain);
  console.log('Has footer:', hasFooter);
  
  // Get all text content
  const textContent = await page.evaluate(() => document.body.innerText);
  console.log('Page text:', textContent.substring(0, 500));
  
  // Wait for user to close
  await new Promise(resolve => setTimeout(resolve, 60000));
  await browser.close();
})();