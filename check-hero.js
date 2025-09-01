const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Canlı siteyi kontrol et
  await page.goto('https://dr-murzoglu.web.app', { waitUntil: 'networkidle2' });
  
  // Hero section başlıklarını al
  const heroContent = await page.evaluate(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    const title = document.querySelector('.hero-title');
    
    return {
      subtitle: subtitle ? subtitle.innerText : 'Subtitle bulunamadı',
      title: title ? title.innerText : 'Title bulunamadı'
    };
  });
  
  console.log('\n=== HERO SECTION BAŞLIKLAR ===');
  console.log('Üst başlık (küçük):', heroContent.subtitle);
  console.log('Ana başlık (büyük):', heroContent.title);
  
  // Footer içeriğini kontrol et
  const footerContent = await page.evaluate(() => {
    const footerTexts = [];
    const footerElements = document.querySelectorAll('.footer-title, .footer-link');
    
    footerElements.forEach(el => {
      footerTexts.push(el.innerText);
    });
    
    return footerTexts;
  });
  
  console.log('\n=== FOOTER İÇERİĞİ ===');
  footerContent.forEach(text => {
    // İngilizce metinleri tespit et
    if (text && /[A-Z][a-z]+/.test(text) && !text.includes('Dr.') && !text.includes('©')) {
      console.log('Potansiyel İngilizce metin:', text);
    }
  });
  
  await browser.close();
})();