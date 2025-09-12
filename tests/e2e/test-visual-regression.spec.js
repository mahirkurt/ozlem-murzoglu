// @ts-check
const { test, expect } = require('@playwright/test');

// Kilit sayfalar1n listesi
const pages = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hakk1m1zda', path: '/hakkimizda' },
  { name: 'Dr. Özlem Mürzolu', path: '/hakkimizda/dr-ozlem-murzoglu' },
  { name: 'Klinik', path: '/hakkimizda/klinigimiz' },
  { name: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
  { name: 'Triple P', path: '/hizmetlerimiz/triple-p' },
  { name: 'Bright Futures', path: '/hizmetlerimiz/bright-futures-program' },
  { name: 'SOS Feeding', path: '/hizmetlerimiz/sos-feeding' },
  { name: 'Sal1kl1 Uykular', path: '/hizmetlerimiz/saglikli-uykular' },
  { name: 'Laboratuvar Görüntüleme', path: '/hizmetlerimiz/laboratuvar-goruntuleme' },
  { name: 'Kaynaklar', path: '/kaynaklar' },
  { name: 'Örnek Kaynak', path: '/kaynaklar/bright-futures-aile/1-ay-aile-in-bilgiler' },
  { name: 'SSS', path: '/sss' },
  { name: '0leti_im', path: '/iletisim' },
  { name: 'Blog', path: '/blog' },
  { name: 'Sayg1yla', path: '/saygiyla' },
  { name: 'Style Guide', path: '/style-guide' },
  { name: 'Material Showcase', path: '/material-showcase' }
];

// Farkl1 viewport boyutlar1
const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

test.describe('Görsel Regresyon Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Animasyonlar1 devre d1_1 b1rak
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  for (const pageInfo of pages) {
    for (const viewport of viewports) {
      test(`${pageInfo.name} - ${viewport.name}`, async ({ page }) => {
        // Viewport boyutunu ayarla
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Sayfaya git
        await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
        
        // Lazy loading için biraz bekle
        await page.waitForTimeout(1000);
        
        // Görüntülerin yüklenmesini bekle
        await page.waitForLoadState('domcontentloaded');
        
        // Cookie banner'1 kapat (varsa)
        const cookieBanner = page.locator('[data-testid="cookie-banner-close"]');
        if (await cookieBanner.isVisible()) {
          await cookieBanner.click();
        }
        
        // Full page screenshot al
        await expect(page).toHaveScreenshot(
          `${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name}.png`,
          { 
            fullPage: true,
            maxDiffPixels: 100,
            threshold: 0.2
          }
        );
      });
    }
  }

  test.describe('Bile_en Testleri', () => {
    test('Resource Hero Bile_eni', async ({ page }) => {
      await page.goto('/style-guide');
      await page.waitForLoadState('networkidle');
      
      const heroSection = page.locator('app-resource-hero').first();
      await expect(heroSection).toHaveScreenshot('resource-hero-component.png');
    });

    test('TOC Sidebar Bile_eni', async ({ page }) => {
      await page.goto('/style-guide');
      await page.waitForLoadState('networkidle');
      
      const tocSection = page.locator('app-toc-sidebar').first();
      await expect(tocSection).toHaveScreenshot('toc-sidebar-component.png');
    });

    test('Content Card Bile_eni', async ({ page }) => {
      await page.goto('/style-guide');
      await page.waitForLoadState('networkidle');
      
      const cardSection = page.locator('app-content-card').first();
      await expect(cardSection).toHaveScreenshot('content-card-component.png');
    });

    test('Action Bar Bile_eni', async ({ page }) => {
      await page.goto('/style-guide');
      await page.waitForLoadState('networkidle');
      
      const actionBar = page.locator('app-action-bar').first();
      await expect(actionBar).toHaveScreenshot('action-bar-component.png');
    });
  });

  test.describe('Tema Testleri', () => {
    test('Light Theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Light tema aktif olmal1 (varsay1lan)
      const body = page.locator('body');
      await expect(body).toHaveScreenshot('theme-light.png', { fullPage: false });
    });

    test('Dark Theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Dark tema'ya geç (eer tema dei_tirici varsa)
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        const body = page.locator('body');
        await expect(body).toHaveScreenshot('theme-dark.png', { fullPage: false });
      }
    });
  });
});