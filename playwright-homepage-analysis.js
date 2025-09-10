// Ana sayfa tasarım analizi - Playwright
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('🔍 Ana sayfa tasarım analizi başlıyor...\n');
  
  // Ana sayfaya git
  await page.goto('http://localhost:4200', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Sayfa yüklenene kadar bekle
  await page.waitForTimeout(2000);
  
  console.log('📐 Yerleşim düzeni analizi:\n');
  
  // 1. Hero Section Analizi
  const heroSection = await page.evaluate(() => {
    const hero = document.querySelector('.liquid-hero');
    if (!hero) return null;
    
    const styles = window.getComputedStyle(hero);
    const rect = hero.getBoundingClientRect();
    
    return {
      height: rect.height,
      width: rect.width,
      marginTop: styles.marginTop,
      padding: styles.padding,
      position: styles.position,
      display: styles.display,
      alignItems: styles.alignItems,
      justifyContent: styles.justifyContent,
      overflow: styles.overflow,
      background: styles.background
    };
  });
  
  console.log('1️⃣ Hero Section:');
  console.log('   - Boyutlar:', heroSection?.width, 'x', heroSection?.height);
  console.log('   - Margin Top:', heroSection?.marginTop);
  console.log('   - Position:', heroSection?.position);
  console.log('   - Display:', heroSection?.display);
  console.log('   - Overflow:', heroSection?.overflow);
  
  // 2. Header Analizi
  const headerAnalysis = await page.evaluate(() => {
    const header = document.querySelector('app-header, .header, header');
    if (!header) return null;
    
    const styles = window.getComputedStyle(header);
    const rect = header.getBoundingClientRect();
    
    return {
      height: rect.height,
      width: rect.width,
      position: styles.position,
      top: styles.top,
      zIndex: styles.zIndex,
      background: styles.background,
      boxShadow: styles.boxShadow
    };
  });
  
  console.log('\n2️⃣ Header:');
  console.log('   - Boyutlar:', headerAnalysis?.width, 'x', headerAnalysis?.height);
  console.log('   - Position:', headerAnalysis?.position);
  console.log('   - Z-Index:', headerAnalysis?.zIndex);
  
  // 3. Container ve spacing analizi
  const containerAnalysis = await page.evaluate(() => {
    const containers = document.querySelectorAll('.container, .md3-container');
    const results = [];
    
    containers.forEach((container, index) => {
      const styles = window.getComputedStyle(container);
      const rect = container.getBoundingClientRect();
      
      results.push({
        index,
        width: rect.width,
        maxWidth: styles.maxWidth,
        padding: styles.padding,
        margin: styles.margin,
        className: container.className
      });
    });
    
    return results;
  });
  
  console.log('\n3️⃣ Container Analizi:');
  containerAnalysis?.forEach(container => {
    console.log(`   Container ${container.index}:`);
    console.log(`   - Width: ${container.width}px`);
    console.log(`   - Max-Width: ${container.maxWidth}`);
    console.log(`   - Padding: ${container.padding}`);
    console.log(`   - Margin: ${container.margin}`);
  });
  
  // 4. Typography analizi
  const typographyAnalysis = await page.evaluate(() => {
    const headings = document.querySelectorAll('h1, h2, h3, .hero-title');
    const results = [];
    
    headings.forEach((heading) => {
      const styles = window.getComputedStyle(heading);
      results.push({
        tag: heading.tagName,
        text: heading.innerText?.substring(0, 30),
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontFamily: styles.fontFamily,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        color: styles.color,
        textAlign: styles.textAlign,
        className: heading.className
      });
    });
    
    return results;
  });
  
  console.log('\n4️⃣ Typography Analizi:');
  typographyAnalysis?.forEach(text => {
    console.log(`   ${text.tag} - "${text.text}..."`);
    console.log(`   - Font Size: ${text.fontSize}`);
    console.log(`   - Font Family: ${text.fontFamily}`);
    console.log(`   - Line Height: ${text.lineHeight}`);
    console.log(`   - Text Align: ${text.textAlign}`);
  });
  
  // 5. Button ve CTA analizi
  const buttonAnalysis = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, .md3-button, .cta-button, a.btn, .hero-button');
    const results = [];
    
    buttons.forEach((button) => {
      const styles = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      
      results.push({
        text: button.innerText,
        width: rect.width,
        height: rect.height,
        padding: styles.padding,
        fontSize: styles.fontSize,
        background: styles.background || styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        className: button.className
      });
    });
    
    return results;
  });
  
  console.log('\n5️⃣ Button/CTA Analizi:');
  buttonAnalysis?.forEach(button => {
    console.log(`   Button: "${button.text}"`);
    console.log(`   - Boyutlar: ${button.width}x${button.height}`);
    console.log(`   - Padding: ${button.padding}`);
    console.log(`   - Border Radius: ${button.borderRadius}`);
  });
  
  // 6. Spacing ve margin problemleri
  const spacingIssues = await page.evaluate(() => {
    const sections = document.querySelectorAll('section, .section, [class*="section"]');
    const issues = [];
    
    sections.forEach((section, index) => {
      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();
      
      // Problemli spacing tespiti
      const marginTop = parseFloat(styles.marginTop);
      const marginBottom = parseFloat(styles.marginBottom);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      
      if (marginTop < 0 || marginTop > 200) {
        issues.push({
          element: section.className,
          issue: `Anormal margin-top: ${marginTop}px`,
          suggestion: 'var(--spacing-xxl) kullanın'
        });
      }
      
      if (paddingTop === 0 && paddingBottom === 0) {
        issues.push({
          element: section.className,
          issue: 'Section padding yok',
          suggestion: 'padding: var(--spacing-xl) 0 ekleyin'
        });
      }
    });
    
    return issues;
  });
  
  console.log('\n⚠️ Tespit Edilen Spacing Problemleri:');
  spacingIssues?.forEach(issue => {
    console.log(`   - ${issue.element}`);
    console.log(`     Problem: ${issue.issue}`);
    console.log(`     Öneri: ${issue.suggestion}`);
  });
  
  // 7. Responsive breakpoint kontrolü
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  console.log('\n📱 Responsive Analiz:');
  
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500);
    
    const layoutCheck = await page.evaluate(() => {
      const hero = document.querySelector('.liquid-hero');
      const container = document.querySelector('.container, .md3-container');
      
      return {
        heroHeight: hero?.getBoundingClientRect().height,
        containerWidth: container?.getBoundingClientRect().width,
        overflow: document.body.scrollWidth > window.innerWidth
      };
    });
    
    console.log(`\n   ${viewport.name} (${viewport.width}px):`);
    console.log(`   - Hero Height: ${layoutCheck.heroHeight}px`);
    console.log(`   - Container Width: ${layoutCheck.containerWidth}px`);
    console.log(`   - Horizontal Overflow: ${layoutCheck.overflow ? '❌ VAR' : '✅ YOK'}`);
  }
  
  // 8. Z-index ve katmanlama analizi
  const zIndexAnalysis = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const zIndexed = [];
    
    elements.forEach(el => {
      const zIndex = window.getComputedStyle(el).zIndex;
      if (zIndex !== 'auto' && zIndex !== '0') {
        zIndexed.push({
          element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : ''),
          zIndex: parseInt(zIndex)
        });
      }
    });
    
    return zIndexed.sort((a, b) => b.zIndex - a.zIndex).slice(0, 10);
  });
  
  console.log('\n🔢 Z-Index Katmanları (En yüksek 10):');
  zIndexAnalysis?.forEach(item => {
    console.log(`   ${item.element}: ${item.zIndex}`);
  });
  
  // 9. MD3 token kullanımı kontrolü
  const md3Usage = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let md3Count = 0;
    let customCount = 0;
    
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const styleString = styles.cssText;
      
      if (styleString.includes('var(--md-sys-') || styleString.includes('var(--spacing-')) {
        md3Count++;
      }
      
      if (styleString.includes('px') && !styleString.includes('var(')) {
        customCount++;
      }
    });
    
    return { md3Count, customCount };
  });
  
  console.log('\n🎨 MD3 Token Kullanımı:');
  console.log(`   - MD3 token kullanan elementler: ${md3Usage.md3Count}`);
  console.log(`   - Hardcoded değer kullanan elementler: ${md3Usage.customCount}`);
  console.log(`   - MD3 kullanım oranı: ${Math.round((md3Usage.md3Count / (md3Usage.md3Count + md3Usage.customCount)) * 100)}%`);
  
  // 10. Performance metrics
  const performanceMetrics = await page.evaluate(() => {
    const paintMetrics = performance.getEntriesByType('paint');
    return {
      firstPaint: paintMetrics.find(metric => metric.name === 'first-paint')?.startTime,
      firstContentfulPaint: paintMetrics.find(metric => metric.name === 'first-contentful-paint')?.startTime,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
    };
  });
  
  console.log('\n⚡ Performance Metrikleri:');
  console.log(`   - First Paint: ${performanceMetrics.firstPaint?.toFixed(2)}ms`);
  console.log(`   - First Contentful Paint: ${performanceMetrics.firstContentfulPaint?.toFixed(2)}ms`);
  console.log(`   - DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
  console.log(`   - Page Load Complete: ${performanceMetrics.loadComplete}ms`);
  
  // Screenshot al
  await page.screenshot({ path: 'homepage-analysis.png', fullPage: true });
  console.log('\n📸 Tam sayfa screenshot: homepage-analysis.png');
  
  await browser.close();
  
  console.log('\n✅ Analiz tamamlandı!');
})();