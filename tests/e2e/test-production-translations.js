const { chromium } = require('@playwright/test');

async function testProductionTranslations() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🔍 Production sitesi çeviri kontrolü başlıyor...\n');
  console.log('URL: https://dr-murzoglu.web.app\n');
  
  // Network isteklerini dinle
  const jsonRequests = [];
  page.on('response', response => {
    if (response.url().includes('.json')) {
      jsonRequests.push({
        url: response.url(),
        status: response.status()
      });
    }
  });
  
  // Ana sayfa
  console.log('📄 Ana sayfa yükleniyor...');
  try {
    await page.goto('https://dr-murzoglu.web.app', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
  } catch (e) {
    console.log('⚠️ Ana sayfa yüklenemedi, Saygıyla sayfasına direkt gidiliyor...');
  }
  
  await page.waitForTimeout(2000);
  
  console.log('\n📡 JSON dosyaları:');
  jsonRequests.forEach(req => {
    console.log(`  ${req.status === 200 ? '✅' : '❌'} ${req.url}`);
  });
  
  // Saygıyla menüsüne hover yap
  console.log('\n🎯 Saygıyla menüsü test ediliyor...');
  
  const saygiylaLink = await page.locator('a[href="/saygiyla"]').first();
  await saygiylaLink.hover();
  await page.waitForTimeout(1500);
  
  // Dropdown içeriğini kontrol et
  const dropdownContent = await page.evaluate(() => {
    const dropdown = document.querySelector('.dropdown-menu:not(.mobile-menu)');
    if (!dropdown) return { error: 'Dropdown bulunamadı' };
    
    const links = Array.from(dropdown.querySelectorAll('.dropdown-link'));
    return {
      count: links.length,
      items: links.map(link => ({
        text: link.textContent?.trim(),
        hasKey: link.textContent?.includes('SAYGIYLA.'),
        href: link.getAttribute('href')
      }))
    };
  });
  
  console.log(`\n📋 Dropdown içeriği (${dropdownContent.count} öğe):`);
  if (dropdownContent.items) {
    dropdownContent.items.forEach(item => {
      const status = item.hasKey ? '❌' : '✅';
      console.log(`  ${status} ${item.text} -> ${item.href}`);
    });
  }
  
  // Saygıyla sayfasına git
  console.log('\n📄 Saygıyla sayfasına gidiliyor...');
  await page.goto('https://dr-murzoglu.web.app/saygiyla', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  
  // Çevirilerin yüklenmesi için bekle
  console.log('⏳ Çevirilerin yüklenmesi bekleniyor...');
  await page.waitForTimeout(10000); // 10 saniye bekle
  
  // Sayfayı analiz et
  const pageAnalysis = await page.evaluate(() => {
    const results = {
      untranslatedKeys: [],
      categoryTitles: [],
      pioneerNames: [],
      badge: null,
      heroTitle: null
    };
    
    // Badge kontrolü
    const badge = document.querySelector('.badge-text');
    results.badge = {
      text: badge?.textContent?.trim(),
      hasKey: badge?.textContent?.includes('SAYGIYLA.')
    };
    
    // Hero title kontrolü
    const heroTitle = document.querySelector('.hero-title');
    results.heroTitle = {
      text: heroTitle?.textContent?.trim(),
      hasKey: heroTitle?.textContent?.includes('SAYGIYLA.')
    };
    
    // Category titles
    const categoryTitles = document.querySelectorAll('.category-title');
    categoryTitles.forEach(title => {
      results.categoryTitles.push({
        text: title.textContent?.trim(),
        hasKey: title.textContent?.includes('SAYGIYLA.')
      });
    });
    
    // Pioneer names
    const pioneerElements = document.querySelectorAll('.pioneer-item h4');
    pioneerElements.forEach(el => {
      results.pioneerNames.push({
        text: el.textContent?.trim(),
        hasKey: el.textContent?.includes('SAYGIYLA.')
      });
    });
    
    // Tüm çevrilmemiş anahtarları bul
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const text = el.textContent?.trim();
      if (text && !el.children.length && text.includes('SAYGIYLA.')) {
        results.untranslatedKeys.push({
          key: text,
          element: `${el.tagName}.${el.className}`
        });
      }
    }
    
    return results;
  });
  
  console.log('\n📊 Sayfa Analizi:');
  console.log('═'.repeat(50));
  
  // Badge
  console.log('\n🏷️ Badge:');
  if (pageAnalysis.badge.text) {
    console.log(`  ${pageAnalysis.badge.hasKey ? '❌' : '✅'} "${pageAnalysis.badge.text}"`);
  } else {
    console.log('  ⚠️ Badge bulunamadı');
  }
  
  // Hero Title
  console.log('\n📌 Hero Title:');
  if (pageAnalysis.heroTitle.text) {
    console.log(`  ${pageAnalysis.heroTitle.hasKey ? '❌' : '✅'} "${pageAnalysis.heroTitle.text}"`);
  } else {
    console.log('  ⚠️ Hero title bulunamadı');
  }
  
  // Category Titles
  console.log('\n📂 Kategori Başlıkları:');
  pageAnalysis.categoryTitles.forEach((title, i) => {
    if (title.text) {
      console.log(`  ${title.hasKey ? '❌' : '✅'} Kategori ${i+1}: "${title.text}"`);
    } else {
      console.log(`  ⚠️ Kategori ${i+1} başlığı bulunamadı`);
    }
  });
  
  // Pioneer Names
  if (pageAnalysis.pioneerNames.length > 0) {
    console.log('\n👥 Öncü İsimleri:');
    const hasKeyCount = pageAnalysis.pioneerNames.filter(p => p.hasKey).length;
    console.log(`  ${hasKeyCount}/${pageAnalysis.pioneerNames.length} çevrilmemiş`);
    
    if (hasKeyCount > 0) {
      pageAnalysis.pioneerNames.filter(p => p.hasKey).slice(0, 5).forEach(pioneer => {
        console.log(`  ❌ ${pioneer.text}`);
      });
    }
  }
  
  // Genel özet
  console.log('\n📈 Özet:');
  console.log(`  Toplam çevrilmemiş anahtar: ${pageAnalysis.untranslatedKeys.length}`);
  
  if (pageAnalysis.untranslatedKeys.length > 0) {
    console.log('\n❌ İlk 10 çevrilmemiş anahtar:');
    pageAnalysis.untranslatedKeys.slice(0, 10).forEach(item => {
      console.log(`  • ${item.key} (${item.element})`);
    });
  }
  
  // Component durumunu kontrol et
  console.log('\n🔧 Component Durumu:');
  const componentStatus = await page.evaluate(() => {
    try {
      // Angular componentini kontrol et
      const appRoot = document.querySelector('app-saygiyla');
      if (!appRoot) return 'app-saygiyla component bulunamadı';
      
      // ng attribute kontrolü
      const hasNgVersion = document.querySelector('[ng-version]');
      return hasNgVersion ? 'Angular app çalışıyor' : 'Angular app tespit edilemedi';
    } catch (e) {
      return 'Hata: ' + e.message;
    }
  });
  console.log(`  ${componentStatus}`);
  
  await browser.close();
  
  // Sonuç
  const totalIssues = pageAnalysis.untranslatedKeys.length;
  if (totalIssues === 0) {
    console.log('\n✅ Tüm çeviriler başarılı!');
  } else {
    console.log(`\n❌ ${totalIssues} çeviri sorunu tespit edildi!`);
    console.log('\n💡 Muhtemel Sorunlar:');
    console.log('  1. Çeviri dosyaları yüklenmiyor olabilir');
    console.log('  2. Component\'te translate.instant() timing sorunu olabilir');
    console.log('  3. Lazy-loaded modülde TranslateModule import edilmemiş olabilir');
  }
}

// Test'i çalıştır
testProductionTranslations().catch(console.error);