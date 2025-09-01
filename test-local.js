const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('\n=== LOCALHOST KONTROLÜ ===');
  console.log('URL: http://localhost:4201');
  
  try {
    // Localhost'u kontrol et
    await page.goto('http://localhost:4201', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    // Hero section içeriğini kontrol et
    const heroContent = await page.evaluate(() => {
      const subtitle = document.querySelector('.hero-subtitle');
      const title = document.querySelector('.hero-title');
      const description = document.querySelector('.hero-description');
      
      return {
        subtitle: subtitle ? subtitle.innerText : 'Subtitle bulunamadı',
        title: title ? title.innerText : 'Title bulunamadı',
        description: description ? description.innerText : 'Description elementi yok'
      };
    });
    
    console.log('\n=== HERO SECTION İÇERİĞİ (LOCALHOST) ===');
    console.log('Subtitle:', heroContent.subtitle);
    console.log('Title:', heroContent.title);
    console.log('Description:', heroContent.description);
    
  } catch (error) {
    console.log('Localhost bağlantı hatası:', error.message);
  }
  
  await browser.close();
})();