const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('\n=== CANLI SİTE KONTROLÜ ===');
  console.log('URL: https://dr-murzoglu.web.app');
  console.log('Zaman:', new Date().toLocaleString('tr-TR'));
  
  // Cache'i bypass etmek için
  await page.setCacheEnabled(false);
  
  // Canlı siteyi kontrol et
  await page.goto('https://dr-murzoglu.web.app?nocache=' + Date.now(), { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Hero section içeriğini kontrol et
  const heroContent = await page.evaluate(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    const title = document.querySelector('.hero-title');
    const description = document.querySelector('.hero-description');
    
    return {
      subtitle: subtitle ? subtitle.innerText : 'Subtitle bulunamadı',
      title: title ? title.innerText : 'Title bulunamadı',
      description: description ? description.innerText : 'Description elementi yok',
      subtitleHTML: subtitle ? subtitle.outerHTML.substring(0, 200) : 'N/A',
      titleHTML: title ? title.outerHTML.substring(0, 200) : 'N/A'
    };
  });
  
  console.log('\n=== HERO SECTION İÇERİĞİ ===');
  console.log('Subtitle:', heroContent.subtitle);
  console.log('Title:', heroContent.title);
  console.log('Description:', heroContent.description);
  
  // Sayfa kaynağından çeviri anahtarlarını kontrol et
  const pageSource = await page.content();
  const hasOldTitle = pageSource.includes('Çocuğunuzun Sağlığı İçin Güvenilir Adres');
  const hasNewTitle = pageSource.includes('Çocuk Hekimliğini Sosyal Pediatri');
  
  console.log('\n=== SAYFA KAYNAĞI KONTROLÜ ===');
  console.log('Eski başlık var mı?:', hasOldTitle);
  console.log('Yeni başlık var mı?:', hasNewTitle);
  
  // JavaScript dosyalarını kontrol et
  const jsFiles = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.map(s => s.src).filter(src => src.includes('main'));
  });
  
  console.log('\n=== YÜKLENEN JS DOSYALARI ===');
  jsFiles.forEach(file => {
    console.log('- ' + file.split('/').pop());
  });
  
  // Cache kontrolü
  const response = await page.reload({ waitUntil: 'networkidle2' });
  const headers = response.headers();
  
  console.log('\n=== CACHE HEADERS ===');
  console.log('Cache-Control:', headers['cache-control'] || 'Yok');
  console.log('ETag:', headers['etag'] || 'Yok');
  console.log('Last-Modified:', headers['last-modified'] || 'Yok');
  
  await browser.close();
})();