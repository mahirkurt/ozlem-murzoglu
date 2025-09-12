const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });
  
  // Navigate to page
  await page.goto('http://localhost:4200/hizmetlerimiz/bright-futures-program');
  await page.waitForTimeout(3000);
  
  // Check for content
  const content = await page.content();
  const hasNewContent = content.includes('Temel İlkelerimiz');
  const hasOldContent = content.includes('Bright Futures');
  
  console.log('Has "Temel İlkelerimiz":', hasNewContent);
  console.log('Has "Bright Futures":', hasOldContent);
  
  // Check visible text
  const visibleText = await page.innerText('body');
  console.log('Visible text length:', visibleText.length);
  console.log('First 500 chars:', visibleText.substring(0, 500));
  
  await browser.close();
})();