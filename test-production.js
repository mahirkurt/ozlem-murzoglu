const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to production page
  await page.goto('https://dr-murzoglu.web.app/hizmetlerimiz/bright-futures-program');
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'bright-futures-production.png', fullPage: true });
  
  // Check for content
  const content = await page.content();
  const hasNewContent = content.includes('Temel İlkelerimiz');
  const hasPrinciples = content.includes('Aile Merkezli');
  const hasEvidence = content.includes('Kanıtlanmış Faydaları');
  
  console.log('Has "Temel İlkelerimiz":', hasNewContent);
  console.log('Has "Aile Merkezli":', hasPrinciples);
  console.log('Has "Kanıtlanmış Faydaları":', hasEvidence);
  
  // Check visible text
  const visibleText = await page.innerText('body');
  console.log('Visible text length:', visibleText.length);
  
  // Check specific sections
  const sections = await page.$$eval('section', elements => elements.length);
  console.log('Number of sections:', sections);
  
  await browser.close();
})();