const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Canlı siteyi kontrol et
  await page.goto('https://dr-murzoglu.web.app', { waitUntil: 'networkidle2' });
  
  // Footer başlıklarını kontrol et
  const footerHeaders = await page.evaluate(() => {
    const headers = [];
    const footerTitles = document.querySelectorAll('.footer-title');
    
    footerTitles.forEach(el => {
      headers.push(el.innerText);
    });
    
    return headers;
  });
  
  console.log('\n=== FOOTER BAŞLIKLAR ===');
  footerHeaders.forEach(header => {
    console.log('- ' + header);
  });
  
  // Dil ayarını kontrol et
  const lang = await page.evaluate(() => {
    return document.documentElement.lang || 'Dil bulunamadı';
  });
  
  console.log('\n=== SAYFA DİLİ ===');
  console.log('Lang attribute:', lang);
  
  await browser.close();
})();