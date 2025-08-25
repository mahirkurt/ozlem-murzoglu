const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

// Test sonuçlarını sakla
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Konsola renkli yazdırma
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const color = type === 'success' ? colors.green : 
                type === 'error' ? colors.red : 
                type === 'warning' ? colors.yellow :
                type === 'header' ? colors.cyan : colors.blue;
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

function logTestResult(testName, passed, message = '') {
  if (passed) {
    testResults.passed.push(testName);
    log(`✓ ${testName}`, 'success');
  } else {
    testResults.failed.push({ test: testName, message });
    log(`✗ ${testName}: ${message}`, 'error');
  }
}

async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function testHomePage(page) {
  log('\n=== ANA SAYFA TESTLERİ ===', 'header');
  
  // Ana sayfayı yükle
  const startTime = performance.now();
  await page.goto('http://localhost:4201', { waitUntil: 'networkidle2' });
  const loadTime = performance.now() - startTime;
  
  log(`Sayfa yükleme süresi: ${(loadTime/1000).toFixed(2)}s`);
  if (loadTime > 3000) {
    testResults.warnings.push(`Ana sayfa yükleme süresi yüksek: ${(loadTime/1000).toFixed(2)}s`);
  }
  
  // Hero section kontrolü
  const heroExists = await waitForElement(page, '.hero-section, app-hero-section, .home-hero');
  logTestResult('Hero section mevcut', heroExists, 'Hero section bulunamadı');
  
  // Header kontrolü
  const headerExists = await waitForElement(page, 'app-header, .header, nav');
  logTestResult('Header mevcut', headerExists, 'Header bulunamadı');
  
  // Logo kontrolü
  const logoExists = await waitForElement(page, '.logo, .navbar-brand, img[alt*="logo" i], img[alt*="özlem" i], img[alt*="murzoğlu" i]');
  logTestResult('Logo mevcut', logoExists, 'Logo bulunamadı');
  
  // Navigasyon menüsü kontrolü
  const navExists = await waitForElement(page, '.nav-menu, .navbar-nav, nav ul, .navigation');
  logTestResult('Navigasyon menüsü mevcut', navExists, 'Navigasyon menüsü bulunamadı');
  
  // Footer kontrolü
  const footerExists = await waitForElement(page, 'app-footer, footer, .footer');
  logTestResult('Footer mevcut', footerExists, 'Footer bulunamadı');
  
  // WhatsApp butonu kontrolü
  const whatsappExists = await waitForElement(page, '.whatsapp-button, .whatsapp-float, [href*="whatsapp"], .wa-button');
  logTestResult('WhatsApp butonu mevcut', whatsappExists, 'WhatsApp butonu bulunamadı');
  
  // Randevu butonu kontrolü
  const appointmentBtnExists = await waitForElement(page, '.appointment-btn, .btn-appointment, button[class*="appointment"], a[href*="randevu"]');
  logTestResult('Randevu butonu mevcut', appointmentBtnExists, 'Randevu butonu bulunamadı');
}

async function testNavigation(page) {
  log('\n=== NAVİGASYON TESTLERİ ===', 'header');
  
  const routes = [
    { path: '/hakkimizda', name: 'Hakkımızda' },
    { path: '/hizmetlerimiz', name: 'Hizmetlerimiz' },
    { path: '/bilgi-merkezi', name: 'Bilgi Merkezi' },
    { path: '/iletisim', name: 'İletişim' },
    { path: '/randevu', name: 'Randevu' }
  ];
  
  for (const route of routes) {
    try {
      await page.goto(`http://localhost:4201${route.path}`, { waitUntil: 'networkidle2', timeout: 10000 });
      const title = await page.title();
      logTestResult(`${route.name} sayfası yüklendi`, true);
      
      // Sayfa içeriği kontrolü
      const hasContent = await page.evaluate(() => {
        const body = document.body;
        return body && body.textContent.trim().length > 100;
      });
      
      if (!hasContent) {
        testResults.warnings.push(`${route.name} sayfası içeriği çok az`);
      }
    } catch (error) {
      logTestResult(`${route.name} sayfası yüklendi`, false, error.message);
    }
  }
}

async function testResponsive(page) {
  log('\n=== RESPONSİVE TASARIM TESTLERİ ===', 'header');
  
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:4201', { waitUntil: 'networkidle2' });
    
    // Mobil menü kontrolü
    if (viewport.name === 'Mobile') {
      const mobileMenuExists = await waitForElement(page, '.mobile-menu-toggle, .hamburger, .navbar-toggler, button[aria-label*="menu"]');
      logTestResult('Mobil menü butonu mevcut', mobileMenuExists, 'Mobil menü butonu bulunamadı');
      
      // Mobil menüyü aç
      if (mobileMenuExists) {
        try {
          await page.click('.mobile-menu-toggle, .hamburger, .navbar-toggler, button[aria-label*="menu"]');
          await page.waitForTimeout(500);
          const menuOpen = await waitForElement(page, '.mobile-menu.open, .navbar-collapse.show, .nav-menu.active');
          logTestResult('Mobil menü açılıyor', menuOpen, 'Mobil menü açılamadı');
        } catch (error) {
          logTestResult('Mobil menü açılıyor', false, error.message);
        }
      }
    }
    
    // Layout kontrolü
    const layoutCheck = await page.evaluate((viewportName) => {
      const issues = [];
      
      // Overflow kontrolü
      if (document.body.scrollWidth > window.innerWidth) {
        issues.push('Yatay overflow var');
      }
      
      // Görünür içerik kontrolü
      const header = document.querySelector('header, app-header, .header');
      if (header && header.offsetHeight === 0) {
        issues.push('Header görünmüyor');
      }
      
      // Text okunabilirlik kontrolü
      const allText = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      let tooSmallText = 0;
      allText.forEach(el => {
        const fontSize = window.getComputedStyle(el).fontSize;
        if (parseFloat(fontSize) < 12 && el.textContent.trim().length > 0) {
          tooSmallText++;
        }
      });
      
      if (tooSmallText > 5) {
        issues.push(`${tooSmallText} element çok küçük font boyutuna sahip`);
      }
      
      return issues;
    }, viewport.name);
    
    if (layoutCheck.length === 0) {
      logTestResult(`${viewport.name} layout doğru`, true);
    } else {
      layoutCheck.forEach(issue => {
        testResults.warnings.push(`${viewport.name}: ${issue}`);
      });
      logTestResult(`${viewport.name} layout doğru`, false, layoutCheck.join(', '));
    }
  }
}

async function testForms(page) {
  log('\n=== FORM TESTLERİ ===', 'header');
  
  // Randevu sayfasına git
  try {
    await page.goto('http://localhost:4201/randevu', { waitUntil: 'networkidle2' });
    
    // Form elemanları kontrolü
    const formExists = await waitForElement(page, 'form, .appointment-form, .contact-form');
    logTestResult('Randevu formu mevcut', formExists, 'Randevu formu bulunamadı');
    
    if (formExists) {
      // Input alanları kontrolü
      const inputs = await page.evaluate(() => {
        const formInputs = document.querySelectorAll('input, textarea, select');
        return {
          count: formInputs.length,
          types: Array.from(formInputs).map(input => ({
            type: input.type || input.tagName.toLowerCase(),
            name: input.name || input.id,
            required: input.required
          }))
        };
      });
      
      logTestResult(`Form ${inputs.count} input alanı içeriyor`, inputs.count > 0, 'Form input alanı bulunamadı');
      
      // Zorunlu alanlar kontrolü
      const requiredFields = inputs.types.filter(f => f.required);
      if (requiredFields.length > 0) {
        log(`${requiredFields.length} zorunlu alan bulundu`);
      }
      
      // Form validasyon testi
      const submitBtn = await waitForElement(page, 'button[type="submit"], input[type="submit"], .submit-btn');
      if (submitBtn) {
        // Boş form gönderimi dene
        await page.click('button[type="submit"], input[type="submit"], .submit-btn');
        await page.waitForTimeout(500);
        
        // Hata mesajları kontrolü
        const errorMessages = await page.evaluate(() => {
          const errors = document.querySelectorAll('.error, .invalid-feedback, .error-message, [class*="error"]');
          return errors.length;
        });
        
        logTestResult('Form validasyonu çalışıyor', errorMessages > 0 || requiredFields.length === 0, 
                     'Form validasyon mesajları görünmüyor');
      }
    }
  } catch (error) {
    logTestResult('Randevu formu testi', false, error.message);
  }
}

async function testPerformance(page) {
  log('\n=== PERFORMANS TESTLERİ ===', 'header');
  
  // Ana sayfaya git
  await page.goto('http://localhost:4201', { waitUntil: 'networkidle2' });
  
  // Performance metrics
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      domInteractive: perfData.domInteractive,
      firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime
    };
  });
  
  log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
  log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
  log(`First Paint: ${metrics.firstPaint?.toFixed(2)}ms`);
  log(`First Contentful Paint: ${metrics.firstContentfulPaint?.toFixed(2)}ms`);
  
  // Performans uyarıları
  if (metrics.firstContentfulPaint > 2500) {
    testResults.warnings.push(`First Contentful Paint yüksek: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
  }
  
  // Resim optimizasyonu kontrolü
  const images = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    const largeImages = [];
    imgs.forEach(img => {
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        largeImages.push({
          src: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      }
    });
    return { total: imgs.length, large: largeImages };
  });
  
  log(`Toplam ${images.total} resim bulundu`);
  if (images.large.length > 0) {
    testResults.warnings.push(`${images.large.length} büyük boyutlu resim bulundu (>2000px)`);
  }
  
  // JavaScript hataları kontrolü
  const jsErrors = [];
  page.on('pageerror', error => {
    jsErrors.push(error.message);
  });
  
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForTimeout(2000);
  
  if (jsErrors.length > 0) {
    jsErrors.forEach(error => {
      testResults.failed.push({ test: 'JavaScript Hatası', message: error });
    });
    log(`${jsErrors.length} JavaScript hatası bulundu`, 'error');
  } else {
    logTestResult('JavaScript hataları yok', true);
  }
}

async function testAccessibility(page) {
  log('\n=== ERİŞİLEBİLİRLİK TESTLERİ ===', 'header');
  
  await page.goto('http://localhost:4201', { waitUntil: 'networkidle2' });
  
  const accessibilityIssues = await page.evaluate(() => {
    const issues = [];
    
    // Alt text kontrolü
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} resim alt text içermiyor`);
    }
    
    // Form label kontrolü
    const inputsWithoutLabel = document.querySelectorAll('input:not([aria-label]):not([id]), textarea:not([aria-label]):not([id])');
    const labelsWithoutFor = document.querySelectorAll('label:not([for])');
    if (inputsWithoutLabel.length > 0 || labelsWithoutFor.length > 0) {
      issues.push('Bazı form elemanları label içermiyor');
    }
    
    // Heading hiyerarşisi kontrolü
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let hierarchyBroken = false;
    headings.forEach(h => {
      const level = parseInt(h.tagName[1]);
      if (level - lastLevel > 1 && lastLevel !== 0) {
        hierarchyBroken = true;
      }
      lastLevel = level;
    });
    if (hierarchyBroken) {
      issues.push('Heading hiyerarşisi bozuk');
    }
    
    // Kontrast kontrolü (basit)
    const buttons = document.querySelectorAll('button, .btn, a.button');
    buttons.forEach(btn => {
      const style = window.getComputedStyle(btn);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      // Basit bir kontrol - gerçek kontrast hesaplaması daha karmaşık
      if (bgColor === textColor) {
        issues.push('Bazı butonlarda kontrast sorunu olabilir');
      }
    });
    
    // ARIA landmarks kontrolü
    const main = document.querySelector('main, [role="main"]');
    const nav = document.querySelector('nav, [role="navigation"]');
    if (!main) issues.push('Main landmark eksik');
    if (!nav) issues.push('Navigation landmark eksik');
    
    return issues;
  });
  
  if (accessibilityIssues.length === 0) {
    logTestResult('Erişilebilirlik kontrolleri başarılı', true);
  } else {
    accessibilityIssues.forEach(issue => {
      testResults.warnings.push(`Erişilebilirlik: ${issue}`);
      log(`⚠ ${issue}`, 'warning');
    });
  }
}

async function testSEO(page) {
  log('\n=== SEO TESTLERİ ===', 'header');
  
  await page.goto('http://localhost:4201', { waitUntil: 'networkidle2' });
  
  const seoData = await page.evaluate(() => {
    const data = {};
    
    // Title tag
    data.title = document.title;
    data.titleLength = data.title ? data.title.length : 0;
    
    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    data.description = metaDesc ? metaDesc.content : null;
    data.descriptionLength = data.description ? data.description.length : 0;
    
    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    data.keywords = metaKeywords ? metaKeywords.content : null;
    
    // Open Graph tags
    data.ogTitle = document.querySelector('meta[property="og:title"]')?.content;
    data.ogDescription = document.querySelector('meta[property="og:description"]')?.content;
    data.ogImage = document.querySelector('meta[property="og:image"]')?.content;
    
    // H1 tags
    const h1Tags = document.querySelectorAll('h1');
    data.h1Count = h1Tags.length;
    data.h1Text = Array.from(h1Tags).map(h => h.textContent.trim());
    
    // Canonical URL
    data.canonical = document.querySelector('link[rel="canonical"]')?.href;
    
    // Robots meta
    data.robots = document.querySelector('meta[name="robots"]')?.content;
    
    return data;
  });
  
  // SEO kontrolleri
  logTestResult('Title tag mevcut', seoData.title && seoData.titleLength > 0, 'Title tag eksik');
  
  if (seoData.titleLength > 60) {
    testResults.warnings.push(`Title çok uzun: ${seoData.titleLength} karakter`);
  }
  
  logTestResult('Meta description mevcut', seoData.description && seoData.descriptionLength > 0, 'Meta description eksik');
  
  if (seoData.descriptionLength > 160) {
    testResults.warnings.push(`Meta description çok uzun: ${seoData.descriptionLength} karakter`);
  }
  
  logTestResult('H1 tag mevcut', seoData.h1Count > 0, 'H1 tag eksik');
  
  if (seoData.h1Count > 1) {
    testResults.warnings.push(`Birden fazla H1 tag bulundu: ${seoData.h1Count}`);
  }
  
  logTestResult('Open Graph tags mevcut', seoData.ogTitle && seoData.ogDescription, 'Open Graph tags eksik');
}

async function runAllTests() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Console logları yakala
  page.on('console', msg => {
    if (msg.type() === 'error') {
      testResults.warnings.push(`Console error: ${msg.text()}`);
    }
  });
  
  try {
    log('🚀 PUPPETEER TEST SUITE BAŞLATILIYOR...', 'header');
    log('================================\n', 'header');
    
    // Testleri çalıştır
    await testHomePage(page);
    await testNavigation(page);
    await testResponsive(page);
    await testForms(page);
    await testPerformance(page);
    await testAccessibility(page);
    await testSEO(page);
    
    // Test sonuçları özeti
    log('\n================================', 'header');
    log('📊 TEST SONUÇLARI ÖZETİ', 'header');
    log('================================\n', 'header');
    
    log(`✅ Başarılı: ${testResults.passed.length} test`, 'success');
    log(`❌ Başarısız: ${testResults.failed.length} test`, testResults.failed.length > 0 ? 'error' : 'success');
    log(`⚠️  Uyarılar: ${testResults.warnings.length} uyarı`, testResults.warnings.length > 0 ? 'warning' : 'success');
    
    if (testResults.failed.length > 0) {
      log('\n❌ BAŞARISIZ TESTLER:', 'error');
      testResults.failed.forEach(fail => {
        log(`  - ${fail.test}: ${fail.message}`, 'error');
      });
    }
    
    if (testResults.warnings.length > 0) {
      log('\n⚠️  UYARILAR:', 'warning');
      testResults.warnings.forEach(warning => {
        log(`  - ${warning}`, 'warning');
      });
    }
    
    // Başarı durumu
    const successRate = (testResults.passed.length / (testResults.passed.length + testResults.failed.length) * 100).toFixed(1);
    log(`\n📈 Başarı Oranı: ${successRate}%`, successRate >= 80 ? 'success' : 'warning');
    
  } catch (error) {
    log(`\n🚨 KRITIK HATA: ${error.message}`, 'error');
    console.error(error);
  } finally {
    await browser.close();
  }
}

// Testleri başlat
runAllTests().then(() => {
  process.exit(testResults.failed.length > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});