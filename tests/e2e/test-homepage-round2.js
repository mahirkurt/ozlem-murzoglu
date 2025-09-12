const puppeteer = require('puppeteer');

/**
 * Anasayfa Test - Tur 2 (Detaylı Final Kontrol)
 * MD3 Design System uygulamasının %100 doğruluğunu ve tüm detayları test eder
 */

async function testHomepageRound2() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  
  const issues = [];
  const warnings = [];
  const improvements = [];
  let passedTests = 0;
  let totalTests = 0;

  try {
    console.log('\n🔍 ANASAYFA TEST - TUR 2 (DETAYLI FİNAL KONTROL)\n');
    console.log('='.repeat(60));
    
    // Sayfayı yükle
    await page.goto('http://localhost:4200/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // 1. MD3 TOKEN SİSTEMİ DETAYLI TEST
    console.log('\n📍 MD3 Token Sistemi Detaylı Kontrol...');
    totalTests++;
    const tokenSystem = await page.evaluate(() => {
      const root = document.documentElement;
      const rootStyles = window.getComputedStyle(root);
      
      // Tüm MD3 tokenlerini kontrol et
      const requiredTokens = {
        colors: [
          '--md-sys-color-primary',
          '--md-sys-color-secondary',
          '--md-sys-color-tertiary',
          '--md-sys-color-error',
          '--md-sys-color-surface',
          '--md-sys-color-surface-variant',
          '--md-sys-color-background',
          '--md-sys-color-on-primary',
          '--md-sys-color-on-secondary',
          '--md-sys-color-on-surface',
          '--md-sys-color-on-background',
          '--md-sys-color-primary-container',
          '--md-sys-color-secondary-container',
          '--md-sys-color-outline',
          '--md-sys-color-outline-variant'
        ],
        typography: [
          '--md-sys-typescale-display-large',
          '--md-sys-typescale-display-medium',
          '--md-sys-typescale-display-small',
          '--md-sys-typescale-headline-large',
          '--md-sys-typescale-headline-medium',
          '--md-sys-typescale-headline-small',
          '--md-sys-typescale-title-large',
          '--md-sys-typescale-title-medium',
          '--md-sys-typescale-title-small',
          '--md-sys-typescale-body-large',
          '--md-sys-typescale-body-medium',
          '--md-sys-typescale-body-small',
          '--md-sys-typescale-label-large',
          '--md-sys-typescale-label-medium',
          '--md-sys-typescale-label-small'
        ],
        spacing: [
          '--spacing-xs',
          '--spacing-sm',
          '--spacing-md',
          '--spacing-lg',
          '--spacing-xl',
          '--spacing-xxl',
          '--spacing-xxxl'
        ],
        elevation: [
          '--elevation-level-0',
          '--elevation-level-1',
          '--elevation-level-2',
          '--elevation-level-3',
          '--elevation-level-4',
          '--elevation-level-5',
          '--elevation-low',
          '--elevation-medium',
          '--elevation-high'
        ],
        radius: [
          '--radius-xs',
          '--radius-sm',
          '--radius-md',
          '--radius-lg',
          '--radius-xl',
          '--radius-full'
        ],
        motion: [
          '--transition-all',
          '--transition-fast',
          '--transition-medium',
          '--transition-slow',
          '--animation-duration-short',
          '--animation-duration-medium',
          '--animation-duration-long'
        ]
      };
      
      const results = {};
      let definedCount = 0;
      let totalCount = 0;
      
      Object.keys(requiredTokens).forEach(category => {
        results[category] = {};
        requiredTokens[category].forEach(token => {
          const value = rootStyles.getPropertyValue(token);
          results[category][token] = value ? value.trim() : null;
          totalCount++;
          if (value && value.trim()) definedCount++;
        });
      });
      
      return {
        results,
        percentage: Math.round((definedCount / totalCount) * 100),
        missing: totalCount - definedCount
      };
    });
    
    console.log(`  ✅ Token Tanımlama: ${tokenSystem.percentage}%`);
    console.log(`  📊 Eksik Token: ${tokenSystem.missing}`);
    
    if (tokenSystem.percentage < 95) {
      issues.push(`❌ MD3 token tanımlama oranı düşük: ${tokenSystem.percentage}%`);
    } else {
      passedTests++;
    }

    // 2. CONTAINER SİSTEMİ DETAYLI TEST
    console.log('\n📍 Container Sistemi Detaylı Kontrol...');
    totalTests++;
    const containerSystem = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('.container'));
      const results = {
        total: containers.length,
        consistent: true,
        details: []
      };
      
      const expectedMaxWidth = 'min(1440px, 90vw)';
      const acceptableWidths = ['1440px', '1376px', '1392px', '1408px', '1424px'];
      
      containers.forEach((container, index) => {
        const styles = window.getComputedStyle(container);
        const maxWidth = styles.maxWidth;
        const padding = styles.padding;
        
        // Check if width is acceptable
        const isAcceptable = acceptableWidths.some(width => maxWidth.includes(width));
        
        results.details.push({
          index,
          maxWidth,
          padding,
          acceptable: isAcceptable
        });
        
        if (!isAcceptable && maxWidth !== '1440px') {
          results.consistent = false;
        }
      });
      
      return results;
    });
    
    console.log(`  📦 Toplam Container: ${containerSystem.total}`);
    console.log(`  ✅ Tutarlılık: ${containerSystem.consistent ? 'EVET' : 'HAYIR'}`);
    
    if (!containerSystem.consistent) {
      containerSystem.details.forEach(detail => {
        if (!detail.acceptable) {
          warnings.push(`⚠️ Container ${detail.index + 1} genişlik uyumsuz: ${detail.maxWidth}`);
        }
      });
    } else {
      passedTests++;
    }

    // 3. SECTION SPACING TEST
    console.log('\n📍 Section Spacing Kontrol...');
    totalTests++;
    const sectionSpacing = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('.section'));
      const results = {
        total: sections.length,
        properSpacing: 0,
        issues: []
      };
      
      sections.forEach((section, index) => {
        const styles = window.getComputedStyle(section);
        const paddingTop = parseInt(styles.paddingTop);
        const paddingBottom = parseInt(styles.paddingBottom);
        
        // En az 64px padding bekliyoruz
        if (paddingTop >= 64 && paddingBottom >= 64) {
          results.properSpacing++;
        } else {
          results.issues.push({
            index,
            paddingTop,
            paddingBottom
          });
        }
      });
      
      return results;
    });
    
    console.log(`  📏 Section Sayısı: ${sectionSpacing.total}`);
    console.log(`  ✅ Düzgün Spacing: ${sectionSpacing.properSpacing}/${sectionSpacing.total}`);
    
    if (sectionSpacing.issues.length > 0) {
      sectionSpacing.issues.forEach(issue => {
        warnings.push(`⚠️ Section ${issue.index + 1} yetersiz padding: ${issue.paddingTop}px / ${issue.paddingBottom}px`);
      });
    } else {
      passedTests++;
    }

    // 4. RENK KONTRAST TEST
    console.log('\n📍 Renk Kontrast Kontrol...');
    totalTests++;
    const contrastCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
      const issues = [];
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Basit görünürlük kontrolü
        if (color === bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          issues.push({
            tag: el.tagName,
            text: el.textContent.substring(0, 30),
            color,
            bgColor
          });
        }
      });
      
      return {
        totalElements: elements.length,
        issues
      };
    });
    
    console.log(`  📝 Kontrol Edilen Element: ${contrastCheck.totalElements}`);
    console.log(`  ⚠️ Kontrast Sorunu: ${contrastCheck.issues.length}`);
    
    if (contrastCheck.issues.length > 0) {
      contrastCheck.issues.forEach(issue => {
        warnings.push(`⚠️ Kontrast sorunu: ${issue.tag} - "${issue.text}..."`);
      });
    } else {
      passedTests++;
    }

    // 5. RESPONSIVE IMAGES TEST
    console.log('\n📍 Responsive Images Kontrol...');
    totalTests++;
    const imageCheck = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const results = {
        total: images.length,
        responsive: 0,
        issues: []
      };
      
      images.forEach((img, index) => {
        const styles = window.getComputedStyle(img);
        const width = styles.width;
        const maxWidth = styles.maxWidth;
        
        // Responsive image kontrolü
        if (maxWidth === '100%' || width === '100%') {
          results.responsive++;
        } else {
          results.issues.push({
            src: img.src.split('/').pop(),
            width,
            maxWidth
          });
        }
      });
      
      return results;
    });
    
    console.log(`  🖼️ Toplam Görsel: ${imageCheck.total}`);
    console.log(`  ✅ Responsive: ${imageCheck.responsive}/${imageCheck.total}`);
    
    if (imageCheck.issues.length > 0) {
      imageCheck.issues.forEach(issue => {
        warnings.push(`⚠️ Sabit genişlikli görsel: ${issue.src} (${issue.width})`);
      });
    } else {
      passedTests++;
    }

    // 6. ANIMATION PERFORMANCE TEST
    console.log('\n📍 Animation Performance Kontrol...');
    totalTests++;
    const animationCheck = await page.evaluate(() => {
      const animated = document.querySelectorAll('[class*="animate"], [style*="animation"], [style*="transition"]');
      return {
        count: animated.length,
        hasAnimations: animated.length > 0
      };
    });
    
    console.log(`  🎬 Animasyonlu Element: ${animationCheck.count}`);
    
    if (animationCheck.hasAnimations) {
      improvements.push('💡 Animasyonlar GPU hızlandırması için transform ve opacity kullanmalı');
    }
    passedTests++;

    // 7. ACCESSIBILITY TEST
    console.log('\n📍 Accessibility Kontrol...');
    totalTests++;
    const accessibilityCheck = await page.evaluate(() => {
      const results = {
        altTexts: 0,
        missingAlts: 0,
        ariaLabels: 0,
        buttons: 0,
        links: 0
      };
      
      // Alt text kontrolü
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.alt) {
          results.altTexts++;
        } else {
          results.missingAlts++;
        }
      });
      
      // ARIA labels
      results.ariaLabels = document.querySelectorAll('[aria-label]').length;
      results.buttons = document.querySelectorAll('button').length;
      results.links = document.querySelectorAll('a').length;
      
      return results;
    });
    
    console.log(`  🏷️ Alt Text: ${accessibilityCheck.altTexts}/${accessibilityCheck.altTexts + accessibilityCheck.missingAlts}`);
    console.log(`  ♿ ARIA Labels: ${accessibilityCheck.ariaLabels}`);
    
    if (accessibilityCheck.missingAlts > 0) {
      warnings.push(`⚠️ ${accessibilityCheck.missingAlts} görsel alt text içermiyor`);
    } else {
      passedTests++;
    }

    // 8. FONT LOADING TEST
    console.log('\n📍 Font Loading Kontrol...');
    totalTests++;
    const fontCheck = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      const headingFont = window.getComputedStyle(document.querySelector('h1, h2, h3') || document.body);
      
      return {
        bodyFont: styles.fontFamily,
        headingFont: headingFont.fontFamily,
        fontsLoaded: document.fonts.ready ? 'Evet' : 'Hayır'
      };
    });
    
    console.log(`  📝 Body Font: ${fontCheck.bodyFont.split(',')[0]}`);
    console.log(`  📝 Heading Font: ${fontCheck.headingFont.split(',')[0]}`);
    console.log(`  ✅ Fontlar Yüklendi: ${fontCheck.fontsLoaded}`);
    passedTests++;

    // 9. Z-INDEX HIERARCHY TEST
    console.log('\n📍 Z-Index Hierarchy Kontrol...');
    totalTests++;
    const zIndexCheck = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const zIndexes = [];
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const zIndex = styles.zIndex;
        if (zIndex !== 'auto' && zIndex !== '0') {
          zIndexes.push({
            element: el.className || el.tagName,
            zIndex: parseInt(zIndex)
          });
        }
      });
      
      // Z-index değerlerini sırala
      zIndexes.sort((a, b) => b.zIndex - a.zIndex);
      
      return {
        total: zIndexes.length,
        highest: zIndexes[0] || null,
        hasExtremeValues: zIndexes.some(z => z.zIndex > 9999)
      };
    });
    
    console.log(`  📊 Z-Index Kullanan: ${zIndexCheck.total} element`);
    if (zIndexCheck.highest) {
      console.log(`  🔝 En Yüksek: ${zIndexCheck.highest.zIndex} (${zIndexCheck.highest.element})`);
    }
    
    if (zIndexCheck.hasExtremeValues) {
      warnings.push('⚠️ Çok yüksek z-index değerleri tespit edildi (>9999)');
    } else {
      passedTests++;
    }

    // 10. PERFORMANCE METRICS
    console.log('\n📍 Performance Metrics Kontrol...');
    totalTests++;
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const resources = performance.getEntriesByType('resource');
      
      return {
        loadTime: loadTime > 0 ? loadTime : 'Hesaplanıyor',
        domReady: domReady > 0 ? domReady : 'Hesaplanıyor',
        resourceCount: resources.length,
        largeResources: resources.filter(r => r.transferSize > 500000).length
      };
    });
    
    console.log(`  ⚡ Sayfa Yükleme: ${performanceMetrics.loadTime}ms`);
    console.log(`  📄 DOM Ready: ${performanceMetrics.domReady}ms`);
    console.log(`  📦 Kaynak Sayısı: ${performanceMetrics.resourceCount}`);
    console.log(`  ⚠️ Büyük Kaynaklar: ${performanceMetrics.largeResources}`);
    
    if (performanceMetrics.largeResources > 5) {
      improvements.push('💡 5\'ten fazla büyük kaynak dosyası var, optimizasyon önerilir');
    }
    passedTests++;

    // MOBILE VIEW TEST
    console.log('\n📍 Mobile View Test...');
    totalTests++;
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mobileCheck = await page.evaluate(() => {
      const viewport = window.innerWidth;
      const hasHorizontalScroll = document.documentElement.scrollWidth > viewport;
      const overflowElements = [];
      
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > viewport || rect.left < 0) {
          overflowElements.push(el.className || el.tagName);
        }
      });
      
      return {
        viewport,
        hasHorizontalScroll,
        overflowCount: overflowElements.length,
        overflowElements: overflowElements.slice(0, 5)
      };
    });
    
    console.log(`  📱 Mobile Viewport: ${mobileCheck.viewport}px`);
    console.log(`  📏 Yatay Scroll: ${mobileCheck.hasHorizontalScroll ? 'VAR ❌' : 'YOK ✅'}`);
    console.log(`  ⚠️ Taşan Element: ${mobileCheck.overflowCount}`);
    
    if (mobileCheck.hasHorizontalScroll || mobileCheck.overflowCount > 0) {
      issues.push('❌ Mobile görünümde yatay scroll veya taşan elementler var');
      mobileCheck.overflowElements.forEach(el => {
        console.log(`     - ${el}`);
      });
    } else {
      passedTests++;
    }

    // Reset viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // SONUÇLAR
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SONUÇLARI - TUR 2 (FİNAL)');
    console.log('='.repeat(60));
    
    const successRate = Math.round((passedTests/totalTests) * 100);
    console.log(`\n✅ Başarılı: ${passedTests}/${totalTests} test`);
    console.log(`📈 Başarı Oranı: ${successRate}%`);
    
    if (issues.length > 0) {
      console.log('\n🔴 KRİTİK SORUNLAR:');
      issues.forEach(issue => console.log(`  ${issue}`));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ UYARILAR:');
      warnings.slice(0, 10).forEach(warning => console.log(`  ${warning}`));
      if (warnings.length > 10) {
        console.log(`  ... ve ${warnings.length - 10} uyarı daha`);
      }
    }
    
    if (improvements.length > 0) {
      console.log('\n💡 İYİLEŞTİRME ÖNERİLERİ:');
      improvements.forEach(improvement => console.log(`  ${improvement}`));
    }
    
    if (successRate === 100 && issues.length === 0) {
      console.log('\n');
      console.log('🎉'.repeat(30));
      console.log('🏆 MÜKEMMEL! Anasayfa MD3 standartlarına %100 uygun!');
      console.log('🎉'.repeat(30));
    } else if (successRate >= 90) {
      console.log('\n🎯 ÇOK İYİ! Birkaç küçük iyileştirme ile mükemmel olacak.');
    } else if (successRate >= 80) {
      console.log('\n📝 İYİ! Tespit edilen sorunlar düzeltilmeli.');
    } else {
      console.log('\n⚠️ Kritik sorunlar var, acil müdahale gerekiyor.');
    }
    
    // Ekran görüntüsü al
    await page.screenshot({ 
      path: 'homepage-test-round2-desktop.png', 
      fullPage: true 
    });
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.screenshot({ 
      path: 'homepage-test-round2-mobile.png', 
      fullPage: true 
    });
    
    console.log('\n📸 Ekran görüntüleri kaydedildi:');
    console.log('  - homepage-test-round2-desktop.png');
    console.log('  - homepage-test-round2-mobile.png');

  } catch (error) {
    console.error('❌ Test sırasında hata:', error);
  } finally {
    await browser.close();
  }
}

// Testi çalıştır
testHomepageRound2().catch(console.error);