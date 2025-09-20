const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 ozlemmurzoglu.com sitesi inceleniyor...\n');

  // Sayfaya git (Local dev server kullanıyoruz)
  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });

  // Sayfanın yüklenmesini bekle
  await page.waitForTimeout(3000);

  // Hero section içeriğini kontrol et
  console.log('📝 Hero Section İçeriği:');
  console.log('=======================');

  try {
    // Hero başlık
    const heroTitle = await page.textContent('.hero-title, .liquid-hero h1');
    console.log('Başlık:', heroTitle);

    // Hero alt başlık
    const heroSubtitle = await page.textContent('.hero-subtitle, .liquid-hero p');
    console.log('Alt Başlık:', heroSubtitle);

  } catch (error) {
    console.log('Hero section bulunamadı veya hata:', error.message);
  }

  // Container genişliklerini kontrol et
  console.log('\n📏 Container Hizalamaları:');
  console.log('=========================');

  // Header container
  const headerContainer = await page.evaluate(() => {
    const container = document.querySelector('.top-bar .container, .top-bar-content');
    if (container) {
      const rect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      return {
        width: rect.width,
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight
      };
    }
    return null;
  });

  console.log('Header Container:', headerContainer);

  // Hero container
  const heroContainer = await page.evaluate(() => {
    const container = document.querySelector('.liquid-hero .md3-container, .liquid-hero .container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      return {
        width: rect.width,
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight
      };
    }
    return null;
  });

  console.log('Hero Container:', heroContainer);

  // Main nav container
  const mainNavContainer = await page.evaluate(() => {
    const container = document.querySelector('.main-nav .container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      return {
        width: rect.width,
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight
      };
    }
    return null;
  });

  console.log('Main Nav Container:', mainNavContainer);

  // CSS değişkenlerini kontrol et
  console.log('\n🎨 CSS Değişkenleri:');
  console.log('===================');

  const cssVariables = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      containerMaxWidth: getComputedStyle(root).getPropertyValue('--container-max-width'),
      containerPaddingX: getComputedStyle(root).getPropertyValue('--container-padding-x')
    };
  });

  console.log('CSS Variables:', cssVariables);

  // Viewport genişliği
  const viewportSize = page.viewportSize();
  console.log('\n📱 Viewport:', viewportSize);

  // Ekran görüntüsü al
  await page.screenshot({ path: 'live-site-full.png', fullPage: true });
  console.log('\n📸 Tam sayfa ekran görüntüsü: live-site-full.png');

  // Sadece viewport görüntüsü
  await page.screenshot({ path: 'live-site-viewport.png' });
  console.log('📸 Viewport ekran görüntüsü: live-site-viewport.png');

  await browser.close();
  console.log('\n✅ İnceleme tamamlandı!');
})();