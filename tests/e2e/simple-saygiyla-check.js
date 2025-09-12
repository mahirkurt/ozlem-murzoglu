const { chromium } = require('playwright');

async function simpleSaygiylaCheck() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Saygıyla sayfası kontrol ediliyor...\n');
  
  // Türkçe versiyonu kontrol et
  console.log('📄 Türkçe Versiyon:');
  await page.goto('http://localhost:4200/saygiyla');
  await page.waitForTimeout(3000);
  
  const trFeaturedHeader = await page.locator('.featured-section h2').first().textContent().catch(() => 'Bulunamadı');
  const trTimelineHeader = await page.locator('.timeline-section h2').first().textContent().catch(() => 'Bulunamadı');
  
  console.log(`  Featured başlık: "${trFeaturedHeader}"`);
  console.log(`  Timeline başlık: "${trTimelineHeader}"`);
  
  // İngilizce versiyonu kontrol et
  console.log('\n📄 İngilizce Versiyon:');
  await page.goto('http://localhost:4200/en/saygiyla');
  await page.waitForTimeout(3000);
  
  const enFeaturedHeader = await page.locator('.featured-section h2').first().textContent().catch(() => 'Bulunamadı');
  const enTimelineHeader = await page.locator('.timeline-section h2').first().textContent().catch(() => 'Bulunamadı');
  
  console.log(`  Featured başlık: "${enFeaturedHeader}"`);
  console.log(`  Timeline başlık: "${enTimelineHeader}"`);
  
  // Karşılaştırma
  console.log('\n📊 Sonuç:');
  if (trFeaturedHeader === enFeaturedHeader) {
    console.log('  ❌ Featured başlıklar aynı - çeviri sorunu var!');
  }
  if (trTimelineHeader === enTimelineHeader) {
    console.log('  ❌ Timeline başlıklar aynı - çeviri sorunu var!');
  }
  
  // Screenshot al
  await page.screenshot({ path: 'saygiyla-en-check.png', fullPage: true });
  console.log('\n📸 Screenshot: saygiyla-en-check.png');
  
  await browser.close();
}

simpleSaygiylaCheck().catch(console.error);