const { chromium } = require('playwright');

async function quickTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Saygiyla Hizli Test\n');
  console.log('='.repeat(50));
  
  // Ana sayfa - Turkce
  console.log('\n1. Ana Sayfa Turkce:');
  await page.goto('http://localhost:4200/saygiyla');
  await page.waitForTimeout(2000);
  
  const trFeatured = await page.locator('.featured-section h2').textContent().catch(() => 'Bulunamadi');
  console.log(`   Featured: "${trFeatured}"`);
  
  // Ana sayfa - Ingilizce
  console.log('\n2. Ana Sayfa Ingilizce:');
  await page.goto('http://localhost:4200/en/saygiyla');
  await page.waitForTimeout(2000);
  
  const enFeatured = await page.locator('.featured-section h2').textContent().catch(() => 'Bulunamadi');
  console.log(`   Featured: "${enFeatured}"`);
  
  // Jonas Salk - Turkce
  console.log('\n3. Jonas Salk Turkce:');
  await page.goto('http://localhost:4200/saygiyla/jonas-salk');
  await page.waitForTimeout(2000);
  
  const trTitle = await page.locator('.hero-title').textContent().catch(() => 'Bulunamadi');
  const trSubtitle = await page.locator('.hero-subtitle').textContent().catch(() => 'Bulunamadi');
  console.log(`   Baslik: "${trTitle}"`);
  console.log(`   Alt baslik: "${trSubtitle}"`);
  
  // Jonas Salk - Ingilizce
  console.log('\n4. Jonas Salk Ingilizce:');
  await page.goto('http://localhost:4200/en/saygiyla/jonas-salk');
  await page.waitForTimeout(2000);
  
  const enTitle = await page.locator('.hero-title').textContent().catch(() => 'Bulunamadi');
  const enSubtitle = await page.locator('.hero-subtitle').textContent().catch(() => 'Bulunamadi');
  console.log(`   Baslik: "${enTitle}"`);
  console.log(`   Alt baslik: "${enSubtitle}"`);
  
  // Sonuc
  console.log('\n' + '='.repeat(50));
  console.log('SONUC:');
  
  if (trFeatured !== enFeatured && !enFeatured.includes('SAYGIYLA')) {
    console.log('[OK] Ana sayfa cevirileri calisiyor');
  } else {
    console.log('[HATA] Ana sayfa cevirileri calismiyor');
  }
  
  if (trTitle !== enTitle && !enTitle.includes('SAYGIYLA')) {
    console.log('[OK] Jonas Salk cevirileri calisiyor');
  } else {
    console.log('[HATA] Jonas Salk cevirileri calismiyor');
  }
  
  await browser.close();
}

quickTest().catch(console.error);