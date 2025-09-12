const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate to the page
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:4201', { waitUntil: 'networkidle2' });
  
  // Wait for content to load
  await page.waitForSelector('header', { timeout: 5000 });
  
  // Take screenshot of full page
  await page.screenshot({ path: 'homepage-full.png', fullPage: true });
  console.log('Homepage screenshot saved');
  
  // Get header text
  const headerText = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.innerText : 'Header not found';
  });
  console.log('Header content:', headerText);
  
  // Check for Saygıyla menu
  const hasSaygiyla = await page.evaluate(() => {
    return document.body.innerText.includes('Saygıyla');
  });
  console.log('Has "Saygıyla" menu:', hasSaygiyla);
  
  // Check for translation tags
  const hasTranslationTags = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('HEADER.') || text.includes('FOOTER.') || text.includes('ABOUT.');
  });
  console.log('Has unprocessed translation tags:', hasTranslationTags);
  
  // Navigate to About page
  console.log('\nNavigating to About page...');
  await page.goto('http://localhost:4201/hakkimizda', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'about-page.png', fullPage: false });
  
  // Check about page content
  const aboutContent = await page.evaluate(() => {
    return document.body.innerText.substring(0, 500);
  });
  console.log('About page sample:', aboutContent);
  
  await browser.close();
})();