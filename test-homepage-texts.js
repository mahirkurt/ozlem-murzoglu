const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Anasayfa metinleri inceleniyor...\n');

  // Local dev server'a git
  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('📝 TÜM GÖRÜNEN METİNLER:');
  console.log('========================\n');

  // Tüm görünür metinleri topla
  const allTexts = await page.evaluate(() => {
    const texts = [];
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
      // Sadece doğrudan text içeren elementleri al
      if (element.childNodes.length > 0) {
        element.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            const text = child.textContent.trim();
            // Çeviri tag'lerini veya özel karakterleri tespit et
            if (text.includes('{{') || text.includes('}}') ||
                text.includes('HERO.') || text.includes('HOME.') ||
                text.includes('SERVICES.') || text.includes('ABOUT.') ||
                text.includes('APPROACH.') || text.includes('TESTIMONIAL.') ||
                text.includes('APPOINTMENT.') || text.includes('GALLERY.') ||
                text.includes('BIO.')) {
              texts.push({
                type: 'TRANSLATION_TAG',
                text: text,
                element: element.tagName.toLowerCase(),
                class: element.className
              });
            } else if (text.length > 2 && !text.includes('|') && !text.includes('•')) {
              // Normal metinleri topla (çok kısa olanları ve separator'ları hariç tut)
              texts.push({
                type: 'TEXT',
                text: text,
                element: element.tagName.toLowerCase(),
                class: element.className
              });
            }
          }
        });
      }
    });

    return texts;
  });

  // Çeviri tag'lerini ayır
  const translationTags = allTexts.filter(t => t.type === 'TRANSLATION_TAG');
  const hardcodedTexts = allTexts.filter(t => t.type === 'TEXT');

  if (translationTags.length > 0) {
    console.log('❌ ÇEVİRİ TAG\'LERİ GÖRÜNÜYOR:');
    console.log('-----------------------------');
    translationTags.forEach(tag => {
      console.log(`- "${tag.text}" (${tag.element}.${tag.class})`);
    });
    console.log('');
  }

  console.log('📄 HARDCODED METİNLER:');
  console.log('----------------------');

  // Tekrar eden metinleri grupla
  const uniqueTexts = {};
  hardcodedTexts.forEach(item => {
    if (!uniqueTexts[item.text]) {
      uniqueTexts[item.text] = [];
    }
    uniqueTexts[item.text].push(`${item.element}.${item.class}`);
  });

  // Sadece ilk 50 unique metni göster
  let count = 0;
  for (const [text, locations] of Object.entries(uniqueTexts)) {
    if (count++ >= 50) break;
    console.log(`\n"${text}"`);
    console.log(`  Konumlar: ${locations.slice(0, 3).join(', ')}${locations.length > 3 ? '...' : ''}`);
  }

  // Spesifik bölümleri kontrol et
  console.log('\n\n🎯 SPESİFİK BÖLÜM KONTROL:');
  console.log('===========================\n');

  // Hero Section
  const heroTitle = await page.textContent('.hero-title');
  const heroSubtitle = await page.textContent('.hero-subtitle');
  const heroButton = await page.textContent('.hero-button');

  console.log('HERO SECTION:');
  console.log(`  Başlık: ${heroTitle || 'Bulunamadı'}`);
  console.log(`  Alt Başlık: ${heroSubtitle || 'Bulunamadı'}`);
  console.log(`  Buton: ${heroButton || 'Bulunamadı'}`);

  // Approach Section
  const approachTitle = await page.textContent('.approach-section h2');
  const approachCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.approach-card')).map(card => ({
      title: card.querySelector('h3')?.textContent?.trim(),
      text: card.querySelector('p')?.textContent?.trim()
    }));
  });

  console.log('\nAPPROACH SECTION:');
  console.log(`  Başlık: ${approachTitle || 'Bulunamadı'}`);
  approachCards.forEach((card, i) => {
    console.log(`  Kart ${i+1}: ${card.title || 'Başlık yok'}`);
  });

  // Services Section
  const servicesTitle = await page.textContent('.services-section h2');
  const serviceCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.service-card')).map(card => ({
      title: card.querySelector('.service-title')?.textContent?.trim(),
      desc: card.querySelector('.service-description')?.textContent?.trim()
    }));
  });

  console.log('\nSERVICES SECTION:');
  console.log(`  Başlık: ${servicesTitle || 'Bulunamadı'}`);
  serviceCards.forEach((card, i) => {
    if (i < 3) { // İlk 3 servisi göster
      console.log(`  Servis ${i+1}: ${card.title || 'Başlık yok'}`);
    }
  });

  // Doctor Bio Section
  const bioTitle = await page.textContent('.doctor-bio h2');
  const bioText = await page.textContent('.doctor-bio .bio-content');

  console.log('\nDOCTOR BIO SECTION:');
  console.log(`  Başlık: ${bioTitle || 'Bulunamadı'}`);
  console.log(`  İçerik: ${bioText ? bioText.substring(0, 100) + '...' : 'Bulunamadı'}`);

  // Gallery Section
  const galleryTitle = await page.textContent('.clinic-gallery h2');

  console.log('\nGALLERY SECTION:');
  console.log(`  Başlık: ${galleryTitle || 'Bulunamadı'}`);

  // Appointment Section
  const appointmentTitle = await page.textContent('.appointment-section h2');
  const appointmentButton = await page.textContent('.appointment-section .cta-button');

  console.log('\nAPPOINTMENT SECTION:');
  console.log(`  Başlık: ${appointmentTitle || 'Bulunamadı'}`);
  console.log(`  Buton: ${appointmentButton || 'Bulunamadı'}`);

  // Testimonial Section
  const testimonialTitle = await page.textContent('.testimonial-section h2');

  console.log('\nTESTIMONIAL SECTION:');
  console.log(`  Başlık: ${testimonialTitle || 'Bulunamadı'}`);

  await browser.close();
  console.log('\n✅ İnceleme tamamlandı!');
})();