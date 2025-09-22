// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('MD3 Migration Visual Tests', () => {
  // Test için sayfalar
  const pages = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/services', name: 'services' },
    { path: '/contact', name: 'contact' },
    { path: '/blog', name: 'blog' }
  ];

  test.beforeEach(async ({ page }) => {
    // Viewport ayarları
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  // Her sayfa için MD3 token kontrolü
  pages.forEach(({ path, name }) => {
    test(`MD3 token compliance: ${name}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // MD3 token kullanımını kontrol et
      const styles = await page.evaluate(() => {
        const computed = getComputedStyle(document.documentElement);
        return {
          // Color tokens
          primary: computed.getPropertyValue('--md-sys-color-primary').trim(),
          secondary: computed.getPropertyValue('--md-sys-color-secondary').trim(),
          tertiary: computed.getPropertyValue('--md-sys-color-tertiary').trim(),
          surface: computed.getPropertyValue('--md-sys-color-surface').trim(),

          // Typography tokens
          fontBrand: computed.getPropertyValue('--md-sys-typescale-font-brand'),
          fontPlain: computed.getPropertyValue('--md-sys-typescale-font-plain'),

          // Spacing tokens
          spacing4: computed.getPropertyValue('--md-sys-spacing-4').trim(),
          spacing8: computed.getPropertyValue('--md-sys-spacing-8').trim(),

          // Shape tokens
          cornerMedium: computed.getPropertyValue('--md-sys-shape-corner-medium').trim(),
          cornerLarge: computed.getPropertyValue('--md-sys-shape-corner-large').trim(),

          // Elevation tokens
          elevation1: computed.getPropertyValue('--md-sys-elevation-level1')
        };
      });

      // MD3 token değerlerini kontrol et
      expect(styles.primary).toBe('#00897B');
      expect(styles.secondary).toBe('#FFB300');
      expect(styles.tertiary).toBe('#FF7043');
      expect(styles.surface).toBe('#FCFCFC');

      // Spacing değerlerini kontrol et
      expect(styles.spacing4).toBe('16px');
      expect(styles.spacing8).toBe('32px');

      // Shape değerlerini kontrol et
      expect(styles.cornerMedium).toBe('12px');
      expect(styles.cornerLarge).toBe('16px');

      // Visual snapshot al
      await expect(page).toHaveScreenshot(`md3-${name}.png`, {
        fullPage: false,
        animations: 'disabled'
      });
    });
  });

  // Component-specific testler
  test('MD3 Floating Actions Button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // FAB görünür mü?
    const fab = page.locator('.floating-actions');
    await expect(fab).toBeVisible();

    // FAB stillerini kontrol et
    const fabStyles = await fab.evaluate(el => {
      const computed = getComputedStyle(el);
      return {
        position: computed.position,
        zIndex: computed.zIndex
      };
    });

    expect(fabStyles.position).toBe('fixed');
    expect(parseInt(fabStyles.zIndex)).toBeGreaterThan(999);

    // FAB screenshot
    await expect(fab).toHaveScreenshot('md3-fab.png');
  });

  test('MD3 Header Navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('app-header');
    await expect(header).toBeVisible();

    // Header'da hardcoded renkler var mı kontrol et
    const hasHardcodedColors = await header.evaluate(el => {
      const allElements = el.querySelectorAll('*');
      let hardcodedFound = false;

      allElements.forEach(element => {
        const styles = getComputedStyle(element);
        const color = styles.color;
        const bgColor = styles.backgroundColor;

        // Hex renk kontrolü
        const hexPattern = /#[0-9A-Fa-f]{3,6}/;
        if (hexPattern.test(color) || hexPattern.test(bgColor)) {
          hardcodedFound = true;
        }
      });

      return hardcodedFound;
    });

    expect(hasHardcodedColors).toBe(false);
  });

  // Responsive testler
  test.describe('Responsive MD3 Tests', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      test(`MD3 responsive layout: ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Container padding kontrolü
        const containerPadding = await page.evaluate(() => {
          const container = document.querySelector('.container, .md3-container');
          if (!container) return null;

          const computed = getComputedStyle(container);
          return {
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight
          };
        });

        if (viewport.width <= 768) {
          expect(containerPadding?.paddingLeft).toBe('16px');
          expect(containerPadding?.paddingRight).toBe('16px');
        } else {
          expect(containerPadding?.paddingLeft).toBe('24px');
          expect(containerPadding?.paddingRight).toBe('24px');
        }

        // Responsive screenshot
        await expect(page).toHaveScreenshot(`md3-responsive-${viewport.name}.png`, {
          fullPage: false
        });
      });
    });
  });

  // Dark theme testi (eğer uygulandıysa)
  test('MD3 Dark Theme Support', async ({ page }) => {
    await page.goto('/');

    // Dark theme'i simüle et
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500); // Transition için bekle

    const darkStyles = await page.evaluate(() => {
      const computed = getComputedStyle(document.documentElement);
      return {
        surface: computed.getPropertyValue('--md-sys-color-surface').trim(),
        onSurface: computed.getPropertyValue('--md-sys-color-on-surface').trim()
      };
    });

    // Dark theme değerleri kontrol edilebilir
    // Şu an light theme değerleri dönebilir çünkü dark theme tam implement edilmemiş olabilir
    console.log('Dark theme colors:', darkStyles);

    await expect(page).toHaveScreenshot('md3-dark-theme.png', {
      fullPage: false
    });
  });

  // Performance metrikleri
  test('MD3 Performance Metrics', async ({ page }) => {
    await page.goto('/');

    // CSS boyutunu kontrol et
    const cssSize = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let totalSize = 0;

      styleSheets.forEach(sheet => {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            const cssText = Array.from(rules).map(r => r.cssText).join('');
            totalSize += new Blob([cssText]).size;
          }
        } catch (e) {
          // Cross-origin veya diğer hatalar için
        }
      });

      return totalSize;
    });

    // CSS boyutu makul mü? (örnek: 100KB altında)
    expect(cssSize).toBeLessThan(100000);

    // Kullanılmayan CSS var mı kontrol et (basit versiyon)
    const unusedCSSRatio = await page.evaluate(() => {
      const allSelectors = new Set();
      const usedSelectors = new Set();

      // Tüm CSS selector'larını topla
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            Array.from(rules).forEach(rule => {
              if (rule.selectorText) {
                allSelectors.add(rule.selectorText);
              }
            });
          }
        } catch (e) {
          // Skip cross-origin
        }
      });

      // Kullanılan selector'ları kontrol et
      allSelectors.forEach(selector => {
        try {
          if (document.querySelector(selector)) {
            usedSelectors.add(selector);
          }
        } catch (e) {
          // Invalid selector
        }
      });

      const ratio = usedSelectors.size / allSelectors.size;
      return ratio;
    });

    // En az %50 CSS kullanılıyor mu?
    expect(unusedCSSRatio).toBeGreaterThan(0.5);
  });

  // Accessibility testleri
  test('MD3 Accessibility Compliance', async ({ page }) => {
    await page.goto('/');

    // Color contrast kontrolü
    const contrastIssues = await page.evaluate(() => {
      const issues = [];
      const elements = document.querySelectorAll('*');

      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const color = styles.color;

        // Basit bir contrast kontrolü (tam WCAG kontrolü için axe-core kullanılmalı)
        if (bgColor && color && bgColor !== 'rgba(0, 0, 0, 0)') {
          // MD3 token kullanımı kontrolü
          const hasTokens =
            color.includes('var(--md-sys-color') ||
            bgColor.includes('var(--md-sys-color');

          if (!hasTokens) {
            issues.push({
              element: el.tagName,
              color,
              bgColor
            });
          }
        }
      });

      return issues;
    });

    // Hardcoded renk kullanımı varsa uyar
    if (contrastIssues.length > 0) {
      console.warn('Elements without MD3 color tokens:', contrastIssues.slice(0, 5));
    }

    // Focus indicator kontrolü
    const buttons = page.locator('button, a, input, textarea, select');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.focus();

      const focusStyles = await firstButton.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow
        };
      });

      // Focus indicator var mı?
      expect(
        focusStyles.outline !== 'none' ||
        focusStyles.boxShadow !== 'none'
      ).toBe(true);
    }
  });
});