const puppeteer = require('puppeteer');

async function testTranslations() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();

  try {
    console.log('Testing Turkish version...');
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Hover over Saygıyla menu
    const saygiylaMenu = await page.$('a[href="/saygiyla"]');
    if (saygiylaMenu) {
      await saygiylaMenu.hover();
      await new Promise(r => setTimeout(r, 1000));
      
      // Get dropdown content
      const dropdownText = await page.evaluate(() => {
        const dropdown = document.querySelector('.dropdown-menu');
        return dropdown ? dropdown.innerText : 'No dropdown found';
      });
      
      console.log('Turkish dropdown content:');
      console.log(dropdownText);
      console.log('---');
    }

    // Switch to English
    console.log('Switching to English...');
    const langSwitcher = await page.$('.language-switcher button');
    if (langSwitcher) {
      await langSwitcher.click();
      await new Promise(r => setTimeout(r, 2000));
      
      // Hover over Saygıyla menu again
      const saygiylaMenuEn = await page.$('a[href="/saygiyla"]');
      if (saygiylaMenuEn) {
        await saygiylaMenuEn.hover();
        await new Promise(r => setTimeout(r, 1000));
        
        // Get dropdown content
        const dropdownTextEn = await page.evaluate(() => {
          const dropdown = document.querySelector('.dropdown-menu');
          return dropdown ? dropdown.innerText : 'No dropdown found';
        });
        
        console.log('English dropdown content:');
        console.log(dropdownTextEn);
        console.log('---');
      }
    }

    // Check specific translation keys
    console.log('Checking translation implementation...');
    const translationKeys = await page.evaluate(() => {
      const dropdownLinks = document.querySelectorAll('.dropdown-menu .dropdown-link');
      const keys = [];
      dropdownLinks.forEach(link => {
        keys.push(link.textContent.trim());
      });
      return keys;
    });
    
    console.log('Found dropdown items:', translationKeys);

    // Check if translate pipe is working
    const htmlContent = await page.evaluate(() => {
      const dropdown = document.querySelector('.dropdown-menu');
      return dropdown ? dropdown.innerHTML : '';
    });
    
    if (htmlContent.includes('SAYGIYLA.PIONEERS')) {
      console.log('⚠️ WARNING: Translation keys are visible in HTML, translate pipe may not be working');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testTranslations();