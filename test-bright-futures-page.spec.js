const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🔍 Bright Futures Sayfası Kapsamlı Test Başlıyor...\n');

  try {
    // Sayfaya git
    await page.goto('http://localhost:4200/hizmetlerimiz/bright-futures-program');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('✅ Sayfa yüklendi\n');

    // 1. MD3 EXPRESSIVE TASARIM TEMASI KONTROLÜ
    console.log('📐 1. MD3 Expressive Tasarım Teması Kontrolü:');
    console.log('================================================');

    // MD3 renk değişkenlerini kontrol et
    const md3ColorVars = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue('--md-sys-color-primary').trim(),
        primaryContainer: styles.getPropertyValue('--md-sys-color-primary-container').trim(),
        secondary: styles.getPropertyValue('--md-sys-color-secondary').trim(),
        tertiary: styles.getPropertyValue('--md-sys-color-tertiary').trim(),
        surface: styles.getPropertyValue('--md-sys-color-surface').trim(),
        surfaceVariant: styles.getPropertyValue('--md-sys-color-surface-variant').trim()
      };
    });

    console.log('MD3 Renk Değişkenleri:');
    Object.entries(md3ColorVars).forEach(([key, value]) => {
      if (value) {
        console.log(`  ✅ --md-sys-color-${key}: ${value}`);
      } else {
        console.log(`  ❌ --md-sys-color-${key}: Tanımlı değil`);
      }
    });

    // Border radius ve elevation kontrolü
    const designTokens = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card, .principle-card, .pillar-card, .visit-card');
      const tokens = {
        borderRadius: [],
        boxShadow: [],
        padding: []
      };
      
      cards.forEach(card => {
        const styles = getComputedStyle(card);
        tokens.borderRadius.push(styles.borderRadius);
        tokens.boxShadow.push(styles.boxShadow);
        tokens.padding.push(styles.padding);
      });
      
      return tokens;
    });

    console.log('\nMD3 Design Tokens:');
    console.log(`  Border Radius kullanımı: ${designTokens.borderRadius.filter(r => r && r !== 'none').length > 0 ? '✅' : '❌'}`);
    console.log(`  Box Shadow (elevation): ${designTokens.boxShadow.filter(s => s && s !== 'none').length > 0 ? '✅' : '❌'}`);
    console.log(`  Padding consistency: ${designTokens.padding.filter(p => p && p !== '0px').length > 0 ? '✅' : '❌'}`);

    // Typography kontrolü
    const typography = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4');
      const fonts = [];
      headings.forEach(h => {
        fonts.push(getComputedStyle(h).fontFamily);
      });
      return fonts;
    });

    const hasRoboto = typography.some(font => font.includes('Roboto'));
    console.log(`  Typography (Roboto font): ${hasRoboto ? '✅' : '❌'}`);

    // 2. İÇERİK ORGANİZASYONU KONTROLÜ
    console.log('\n📋 2. İçerik Organizasyonu ve Estetik:');
    console.log('================================================');

    const contentSections = await page.evaluate(() => {
      const sections = [];
      
      // Hero section
      const hero = document.querySelector('app-hero-section');
      if (hero) sections.push('Hero Section');
      
      // Ana içerik bölümleri
      const whatIs = document.querySelector('.section-title');
      if (whatIs) sections.push('What is Bright Futures');
      
      // Principles section
      const principles = document.querySelectorAll('.principle-card');
      if (principles.length > 0) sections.push(`Principles (${principles.length} cards)`);
      
      // Three pillars
      const pillars = document.querySelectorAll('.pillar-card');
      if (pillars.length > 0) sections.push(`Three Pillars (${pillars.length} cards)`);
      
      // Visit schedule
      const visitCards = document.querySelectorAll('.visit-card');
      if (visitCards.length > 0) sections.push(`Visit Schedule (${visitCards.length} cards)`);
      
      // CTA section
      const cta = document.querySelector('app-cta-section');
      if (cta) sections.push('CTA Section');
      
      return sections;
    });

    console.log('Bulunan içerik bölümleri:');
    contentSections.forEach(section => {
      console.log(`  ✅ ${section}`);
    });

    // Responsive grid layout kontrolü
    const layoutCheck = await page.evaluate(() => {
      const grids = document.querySelectorAll('.grid, .principles-grid, .pillars-grid');
      return grids.length;
    });

    console.log(`\nGrid Layout Kullanımı: ${layoutCheck > 0 ? `✅ (${layoutCheck} grid bulundu)` : '❌'}`);

    // Visual hierarchy kontrolü
    const visualHierarchy = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const h3 = document.querySelector('h3');
      const p = document.querySelector('p');
      
      const h2Size = h2 ? parseFloat(getComputedStyle(h2).fontSize) : 0;
      const h3Size = h3 ? parseFloat(getComputedStyle(h3).fontSize) : 0;
      const pSize = p ? parseFloat(getComputedStyle(p).fontSize) : 0;
      
      return h2Size > h3Size && h3Size > pSize;
    });

    console.log(`Visual Hierarchy (H2 > H3 > P): ${visualHierarchy ? '✅' : '❌'}`);

    // 3. ÇEVİRİ KONTROLÜ
    console.log('\n🌍 3. Çeviri ve Hardcoded Text Kontrolü:');
    console.log('================================================');

    // Hardcoded Türkçe text kontrolü
    const hardcodedTextCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const turkishPatterns = [
        /\b(ve|veya|için|ile|ama|fakat|ancak|çünkü)\b/gi,
        /[çğıöşüÇĞİÖŞÜ]/g
      ];
      
      // Çeviri pipe kullanımını kontrol et
      const htmlContent = document.body.innerHTML;
      const translationPipes = (htmlContent.match(/\|\s*translate/g) || []).length;
      
      // Hardcoded text örnekleri bul
      const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, li');
      const hardcodedExamples = [];
      
      elements.forEach(el => {
        const text = el.innerText.trim();
        // Çeviri içermeyen ve Türkçe karakter içeren metinleri bul
        if (text && turkishPatterns[1].test(text) && !el.closest('[class*="translate"]')) {
          // innerHTML'de translate pipe var mı kontrol et
          const hasTranslatePipe = el.innerHTML.includes('translate');
          if (!hasTranslatePipe && text.length > 3) {
            hardcodedExamples.push(text.substring(0, 50));
          }
        }
      });
      
      return {
        translationPipes,
        hardcodedExamples: hardcodedExamples.slice(0, 5),
        hasTurkishChars: turkishPatterns[1].test(bodyText)
      };
    });

    console.log(`Translation Pipes Kullanımı: ${hardcodedTextCheck.translationPipes} adet`);
    console.log(`Türkçe karakter içeren sayfa: ${hardcodedTextCheck.hasTurkishChars ? 'Evet' : 'Hayır'}`);
    
    if (hardcodedTextCheck.hardcodedExamples.length > 0) {
      console.log('\n⚠️  Potansiyel Hardcoded Text Örnekleri:');
      hardcodedTextCheck.hardcodedExamples.forEach((text, i) => {
        console.log(`  ${i + 1}. "${text}..."`);
      });
    } else {
      console.log('✅ Hardcoded text tespit edilmedi');
    }

    // Dil değiştirme testi
    console.log('\n🔄 Dil Değiştirme Testi:');
    
    // İngilizce'ye geç
    await page.evaluate(() => {
      localStorage.setItem('language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    const englishContent = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      return {
        hasEnglishText: /\b(the|and|or|for|with|but|because)\b/i.test(bodyText),
        hasTurkishChars: /[çğıöşüÇĞİÖŞÜ]/.test(bodyText),
        sampleText: document.querySelector('h2')?.innerText || ''
      };
    });

    console.log(`  İngilizce içerik: ${englishContent.hasEnglishText ? '✅' : '❌'}`);
    console.log(`  Türkçe karakter kaldı mı: ${englishContent.hasTurkishChars ? '❌ Evet' : '✅ Hayır'}`);
    console.log(`  Örnek başlık: "${englishContent.sampleText}"`);

    // Türkçe'ye geri dön
    await page.evaluate(() => {
      localStorage.setItem('language', 'tr');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // 4. CTA SECTION KONTROLÜ
    console.log('\n🎯 4. CTA Section Global Stil Kontrolü:');
    console.log('================================================');

    const ctaCheck = await page.evaluate(() => {
      const ctaSection = document.querySelector('app-cta-section');
      if (!ctaSection) return { exists: false };

      const section = ctaSection.querySelector('.cta-section');
      if (!section) return { exists: false, hasSection: false };

      const styles = getComputedStyle(section);
      const title = section.querySelector('.cta-title');
      const button = section.querySelector('.cta-button');
      
      return {
        exists: true,
        hasSection: true,
        background: styles.backgroundColor,
        padding: styles.padding,
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom,
        titleColor: title ? getComputedStyle(title).color : null,
        titleSize: title ? getComputedStyle(title).fontSize : null,
        buttonExists: !!button,
        buttonBackground: button ? getComputedStyle(button).backgroundColor : null,
        buttonBorderRadius: button ? getComputedStyle(button).borderRadius : null
      };
    });

    if (ctaCheck.exists) {
      console.log('✅ CTA Section mevcut');
      console.log(`  Background: ${ctaCheck.background}`);
      console.log(`  Padding: ${ctaCheck.padding}`);
      console.log(`  Margin Top: ${ctaCheck.marginTop}`);
      console.log(`  Margin Bottom: ${ctaCheck.marginBottom}`);
      
      if (ctaCheck.titleColor) {
        console.log(`  Title Color: ${ctaCheck.titleColor}`);
        console.log(`  Title Size: ${ctaCheck.titleSize}`);
      }
      
      if (ctaCheck.buttonExists) {
        console.log(`  Button Background: ${ctaCheck.buttonBackground}`);
        console.log(`  Button Border Radius: ${ctaCheck.buttonBorderRadius}`);
      }
    } else {
      console.log('❌ CTA Section bulunamadı');
    }

    // Screenshot al
    await page.screenshot({ 
      path: 'bright-futures-test-result.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot: bright-futures-test-result.png olarak kaydedildi');

    // GENEL ÖZET
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SONUÇ ÖZETİ:');
    console.log('='.repeat(50));
    
    const summary = {
      'MD3 Tasarım Uyumu': md3ColorVars.primary ? '✅' : '❌',
      'İçerik Organizasyonu': contentSections.length >= 5 ? '✅' : '⚠️',
      'Çeviri Sistemi': hardcodedTextCheck.translationPipes > 0 ? '✅' : '❌',
      'CTA Section': ctaCheck.exists ? '✅' : '❌'
    };

    Object.entries(summary).forEach(([test, result]) => {
      console.log(`${test}: ${result}`);
    });

  } catch (error) {
    console.error('❌ Test sırasında hata:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Test tamamlandı');
  }
})();