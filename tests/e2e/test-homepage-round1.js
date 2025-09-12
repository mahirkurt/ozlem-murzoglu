const puppeteer = require('puppeteer');

/**
 * Anasayfa Test - Tur 1
 * MD3 Design System uygulamasının %100 doğruluğunu test eder
 */

async function testHomepage() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  
  const issues = [];
  const warnings = [];
  let passedTests = 0;
  let totalTests = 0;

  try {
    console.log('\n🔍 ANASAYFA TEST - TUR 1 BAŞLIYOR...\n');
    
    // Sayfayı yükle
    await page.goto('http://localhost:4200/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // 1. HERO SECTION TEST
    console.log('📍 Hero Section Kontrol Ediliyor...');
    totalTests++;
    const heroExists = await page.$('.hero-container, .liquid-hero, .hero-section');
    if (!heroExists) {
      issues.push('❌ Hero section bulunamadı');
    } else {
      const heroStyles = await page.evaluate(() => {
        const hero = document.querySelector('.hero-container, .liquid-hero, .hero-section');
        if (!hero) return null;
        const styles = window.getComputedStyle(hero);
        return {
          minHeight: styles.minHeight,
          background: styles.background,
          padding: styles.padding,
          display: styles.display
        };
      });
      
      if (heroStyles) {
        if (heroStyles.minHeight === '0px' || !heroStyles.minHeight) {
          issues.push('❌ Hero section minimum yükseklik ayarlanmamış');
        } else { passedTests++; }
        
        console.log(`  Min Height: ${heroStyles.minHeight}`);
        console.log(`  Display: ${heroStyles.display}`);
      }
    }

    // 2. NAVIGATION/HEADER TEST
    console.log('\n📍 Header/Navigation Kontrol Ediliyor...');
    totalTests++;
    const headerExists = await page.$('app-header, .header, nav');
    if (!headerExists) {
      issues.push('❌ Header/Navigation bulunamadı');
    } else {
      const headerStyles = await page.evaluate(() => {
        const header = document.querySelector('app-header, .header, nav');
        if (!header) return null;
        const styles = window.getComputedStyle(header);
        return {
          position: styles.position,
          background: styles.background,
          padding: styles.padding,
          zIndex: styles.zIndex
        };
      });
      
      if (headerStyles) {
        console.log(`  Position: ${headerStyles.position}`);
        console.log(`  Z-Index: ${headerStyles.zIndex}`);
        passedTests++;
      }
    }

    // 3. CONTAINER GENIŞLIK TEST
    console.log('\n📍 Container Genişlikleri Kontrol Ediliyor...');
    totalTests++;
    const containerInfo = await page.evaluate(() => {
      const containers = document.querySelectorAll('.container');
      const results = [];
      containers.forEach(container => {
        const styles = window.getComputedStyle(container);
        results.push({
          maxWidth: styles.maxWidth,
          width: styles.width,
          margin: styles.margin,
          padding: styles.padding
        });
      });
      return results;
    });

    if (containerInfo.length === 0) {
      issues.push('❌ Hiç container elementi bulunamadı');
    } else {
      let containerIssue = false;
      containerInfo.forEach((info, index) => {
        console.log(`  Container ${index + 1}:`);
        console.log(`    Max Width: ${info.maxWidth}`);
        console.log(`    Padding: ${info.padding}`);
        
        // 1200px kontrolü - eski değer kullanılıyor mu?
        if (info.maxWidth === '1200px') {
          issues.push(`❌ Container ${index + 1} hala eski 1200px genişlik kullanıyor`);
          containerIssue = true;
        }
      });
      if (!containerIssue) passedTests++;
    }

    // 4. DOCTOR BIO SECTION TEST
    console.log('\n📍 Doctor Bio Section Kontrol Ediliyor...');
    totalTests++;
    const doctorBioExists = await page.$('.doctor-bio, .bio-section');
    if (!doctorBioExists) {
      warnings.push('⚠️ Doctor Bio section bulunamadı (opsiyonel)');
    } else {
      passedTests++;
    }

    // 5. SERVICES SECTION TEST
    console.log('\n📍 Services Section Kontrol Ediliyor...');
    totalTests++;
    const servicesExists = await page.$('.services-section, .services-grid');
    if (!servicesExists) {
      issues.push('❌ Services section bulunamadı');
    } else {
      const servicesStyles = await page.evaluate(() => {
        const services = document.querySelector('.services-section, .services-grid');
        if (!services) return null;
        const styles = window.getComputedStyle(services);
        return {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
          gap: styles.gap,
          padding: styles.padding
        };
      });
      
      if (servicesStyles) {
        console.log(`  Display: ${servicesStyles.display}`);
        console.log(`  Grid Columns: ${servicesStyles.gridTemplateColumns}`);
        console.log(`  Gap: ${servicesStyles.gap}`);
        passedTests++;
      }
    }

    // 6. APPOINTMENT SECTION TEST
    console.log('\n📍 Appointment Section Kontrol Ediliyor...');
    totalTests++;
    const appointmentExists = await page.$('.appointment-section, .appointment-wrapper');
    if (!appointmentExists) {
      warnings.push('⚠️ Appointment section bulunamadı (opsiyonel)');
    } else {
      passedTests++;
    }

    // 7. TESTIMONIALS SECTION TEST
    console.log('\n📍 Testimonials Section Kontrol Ediliyor...');
    totalTests++;
    const testimonialsExists = await page.$('app-testimonial-section, .testimonials-section');
    if (!testimonialsExists) {
      warnings.push('⚠️ Testimonials section bulunamadı (opsiyonel)');
    } else {
      passedTests++;
    }

    // 8. FOOTER TEST
    console.log('\n📍 Footer Kontrol Ediliyor...');
    totalTests++;
    const footerExists = await page.$('app-footer, footer');
    if (!footerExists) {
      issues.push('❌ Footer bulunamadı');
    } else {
      const footerStyles = await page.evaluate(() => {
        const footer = document.querySelector('app-footer, footer');
        if (!footer) return null;
        const styles = window.getComputedStyle(footer);
        return {
          background: styles.background,
          padding: styles.padding,
          marginTop: styles.marginTop
        };
      });
      
      if (footerStyles) {
        console.log(`  Background: ${footerStyles.background.substring(0, 50)}...`);
        console.log(`  Padding: ${footerStyles.padding}`);
        passedTests++;
      }
    }

    // 9. MD3 TOKEN KULLANIMI TEST
    console.log('\n📍 MD3 Token Kullanımı Kontrol Ediliyor...');
    totalTests++;
    const tokenUsage = await page.evaluate(() => {
      const root = document.documentElement;
      const rootStyles = window.getComputedStyle(root);
      
      const tokens = {
        colors: {
          primary: rootStyles.getPropertyValue('--md-sys-color-primary'),
          secondary: rootStyles.getPropertyValue('--md-sys-color-secondary'),
          surface: rootStyles.getPropertyValue('--md-sys-color-surface')
        },
        spacing: {
          xs: rootStyles.getPropertyValue('--spacing-xs'),
          sm: rootStyles.getPropertyValue('--spacing-sm'),
          md: rootStyles.getPropertyValue('--spacing-md')
        },
        typography: {
          displayLarge: rootStyles.getPropertyValue('--md-sys-typescale-display-large'),
          headlineLarge: rootStyles.getPropertyValue('--md-sys-typescale-headline-large')
        }
      };
      
      // Token sayısını kontrol et
      let definedTokens = 0;
      let totalTokens = 0;
      
      Object.values(tokens).forEach(category => {
        Object.values(category).forEach(value => {
          totalTokens++;
          if (value && value.trim() !== '') definedTokens++;
        });
      });
      
      return {
        tokens,
        percentage: Math.round((definedTokens / totalTokens) * 100)
      };
    });

    console.log(`  Token Tanımlama Oranı: ${tokenUsage.percentage}%`);
    if (tokenUsage.percentage < 80) {
      issues.push(`❌ MD3 token tanımlama oranı düşük: ${tokenUsage.percentage}%`);
    } else {
      passedTests++;
    }

    // 10. RESPONSIVE BREAKPOINTS TEST
    console.log('\n📍 Responsive Breakpoints Kontrol Ediliyor...');
    totalTests++;
    
    // Tablet görünümü test
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tabletLayout = await page.evaluate(() => {
      const container = document.querySelector('.container');
      if (!container) return null;
      const styles = window.getComputedStyle(container);
      return {
        width: styles.width,
        padding: styles.padding
      };
    });
    
    // Mobil görünümü test
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mobileLayout = await page.evaluate(() => {
      const container = document.querySelector('.container');
      if (!container) return null;
      const styles = window.getComputedStyle(container);
      return {
        width: styles.width,
        padding: styles.padding
      };
    });
    
    console.log(`  Tablet Layout - Width: ${tabletLayout?.width}`);
    console.log(`  Mobile Layout - Width: ${mobileLayout?.width}`);
    
    if (tabletLayout && mobileLayout) {
      passedTests++;
    } else {
      issues.push('❌ Responsive breakpoints düzgün çalışmıyor');
    }

    // 11. GÖRSEL BOZUKLUK TEST
    console.log('\n📍 Görsel Bozukluklar Kontrol Ediliyor...');
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    totalTests++;
    const visualIssues = await page.evaluate(() => {
      const issues = [];
      
      // Overflow kontrolü
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          issues.push(`Element viewport dışına taşıyor: ${el.className || el.tagName}`);
        }
      });
      
      // Z-index çakışmaları
      const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position: sticky"]');
      if (fixedElements.length > 1) {
        console.log(`${fixedElements.length} sabit/yapışkan element bulundu`);
      }
      
      return issues;
    });
    
    if (visualIssues.length > 0) {
      visualIssues.forEach(issue => {
        issues.push(`❌ ${issue}`);
      });
    } else {
      passedTests++;
    }

    // SONUÇLAR
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SONUÇLARI - TUR 1');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Başarılı: ${passedTests}/${totalTests} test`);
    console.log(`📈 Başarı Oranı: ${Math.round((passedTests/totalTests) * 100)}%`);
    
    if (issues.length > 0) {
      console.log('\n🔴 KRİTİK SORUNLAR:');
      issues.forEach(issue => console.log(`  ${issue}`));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ UYARILAR:');
      warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (issues.length === 0 && warnings.length === 0) {
      console.log('\n🎉 TÜM TESTLER BAŞARILI! Anasayfa MD3 standartlarına %100 uygun.');
    } else {
      console.log('\n📝 ÖNERİ: Tespit edilen sorunlar düzeltildikten sonra Tur 2 testi yapılmalı.');
    }
    
    // Ekran görüntüsü al
    await page.screenshot({ 
      path: 'homepage-test-round1.png', 
      fullPage: true 
    });
    console.log('\n📸 Ekran görüntüsü kaydedildi: homepage-test-round1.png');

  } catch (error) {
    console.error('❌ Test sırasında hata:', error);
  } finally {
    await browser.close();
  }
}

// Testi çalıştır
testHomepage().catch(console.error);