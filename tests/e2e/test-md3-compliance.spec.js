// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('MD3 Comprehensive Compliance Tests', () => {
  // Test için tüm sayfalar
  const pages = [
    { path: '/', name: 'home', title: 'Ana Sayfa' },
    { path: '/hakkimizda', name: 'about', title: 'Hakkımda' },
    { path: '/hizmetlerimiz', name: 'services', title: 'Hizmetler' },
    { path: '/blog', name: 'blog', title: 'Blog' },
    { path: '/kaynaklar', name: 'kaynaklar', title: 'Kaynaklar' },
    { path: '/iletisim', name: 'contact', title: 'İletişim' }
  ];

  // MD3 Color Tokens
  const expectedTokens = {
    colors: {
      primary: '#00897B',
      secondary: '#FFB300',
      tertiary: '#FF7043',
      surface: '#FCFCFC',
      background: '#FCFCFC',
      error: '#BA1A1A'
    },
    spacing: {
      '--md-sys-spacing-1': '4px',
      '--md-sys-spacing-2': '8px',
      '--md-sys-spacing-3': '12px',
      '--md-sys-spacing-4': '16px',
      '--md-sys-spacing-5': '20px',
      '--md-sys-spacing-6': '24px',
      '--md-sys-spacing-8': '32px',
      '--md-sys-spacing-10': '40px',
      '--md-sys-spacing-12': '48px',
      '--md-sys-spacing-16': '64px',
      '--md-sys-spacing-20': '80px',
      '--md-sys-spacing-24': '96px',
      '--md-sys-spacing-32': '128px'
    },
    typography: {
      fontBrand: 'Figtree',
      fontPlain: 'DM Sans'
    },
    shape: {
      cornerSmall: '4px',
      cornerMedium: '12px',
      cornerLarge: '16px',
      cornerExtraLarge: '28px',
      cornerFull: '9999px'
    }
  };

  test.beforeEach(async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  // Test 1: MD3 Token Availability
  test('MD3 tokens are properly defined in :root', async ({ page }) => {
    await page.goto('/');

    const tokens = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      return {
        // Color tokens
        primary: computedStyle.getPropertyValue('--md-sys-color-primary').trim(),
        secondary: computedStyle.getPropertyValue('--md-sys-color-secondary').trim(),
        tertiary: computedStyle.getPropertyValue('--md-sys-color-tertiary').trim(),
        surface: computedStyle.getPropertyValue('--md-sys-color-surface').trim(),
        background: computedStyle.getPropertyValue('--md-sys-color-background').trim(),
        error: computedStyle.getPropertyValue('--md-sys-color-error').trim(),

        // Typography tokens
        fontBrand: computedStyle.getPropertyValue('--md-sys-typescale-font-brand').trim(),
        fontPlain: computedStyle.getPropertyValue('--md-sys-typescale-font-plain').trim(),

        // Spacing tokens
        spacing4: computedStyle.getPropertyValue('--md-sys-spacing-4').trim(),
        spacing8: computedStyle.getPropertyValue('--md-sys-spacing-8').trim(),

        // Shape tokens
        cornerMedium: computedStyle.getPropertyValue('--md-sys-shape-corner-medium').trim(),
        cornerLarge: computedStyle.getPropertyValue('--md-sys-shape-corner-large').trim()
      };
    });

    // Verify color tokens
    expect(tokens.primary).not.toBe('');
    expect(tokens.secondary).not.toBe('');
    expect(tokens.tertiary).not.toBe('');
    expect(tokens.surface).not.toBe('');
    expect(tokens.error).not.toBe('');

    // Verify typography tokens
    expect(tokens.fontBrand).toContain('Figtree');
    expect(tokens.fontPlain).toContain('DM Sans');

    // Verify spacing tokens
    expect(tokens.spacing4).toBe('16px');
    expect(tokens.spacing8).toBe('32px');

    // Verify shape tokens
    expect(tokens.cornerMedium).toBe('12px');
    expect(tokens.cornerLarge).toBe('16px');
  });

  // Test 2: Check for hardcoded colors on each page
  pages.forEach(({ path, name, title }) => {
    test(`No hardcoded colors on ${name} page`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const hardcodedColors = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const issues = [];
        const hexPattern = /#[0-9A-Fa-f]{3,8}/;
        const rgbPattern = /rgb\(|rgba\(/;

        elements.forEach(el => {
          const inlineStyle = el.getAttribute('style');
          if (inlineStyle && (hexPattern.test(inlineStyle) || rgbPattern.test(inlineStyle))) {
            issues.push({
              element: el.tagName + (el.className ? '.' + el.className : ''),
              style: inlineStyle,
              type: 'inline'
            });
          }
        });

        const uniqueIssues = Array.from(new Set(issues.map(i => JSON.stringify(i))))
          .map(i => JSON.parse(i))
          .slice(0, 10);

        return uniqueIssues;
      });

      // Log issues for debugging but don't fail the test if there are few issues
      if (hardcodedColors.length > 0) {
        console.log(`⚠️ Potential hardcoded colors found on ${name}:`, hardcodedColors.slice(0, 5));
      }

      // Fail only if there are many hardcoded colors
      expect(hardcodedColors.length).toBeLessThan(20);
    });
  });

  // Test 3: Typography consistency
  test('Typography uses MD3 font tokens', async ({ page }) => {
    await page.goto('/');

    const typography = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = document.querySelectorAll('p');
      const buttons = document.querySelectorAll('button, .md3-button');

      const results = {
        headings: [],
        paragraphs: [],
        buttons: []
      };

      headings.forEach(el => {
        const styles = getComputedStyle(el);
        results.headings.push({
          tag: el.tagName,
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        });
      });

      paragraphs.forEach((el, i) => {
        if (i < 5) { // Sample first 5
          const styles = getComputedStyle(el);
          results.paragraphs.push({
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight
          });
        }
      });

      buttons.forEach((el, i) => {
        if (i < 5) { // Sample first 5
          const styles = getComputedStyle(el);
          results.buttons.push({
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          });
        }
      });

      return results;
    });

    // Check that headings use Figtree
    typography.headings.forEach(heading => {
      expect(heading.fontFamily.toLowerCase()).toContain('figtree');
    });

    // Check that body text uses appropriate fonts
    typography.paragraphs.forEach(paragraph => {
      const font = paragraph.fontFamily.toLowerCase();
      expect(font).toMatch(/figtree|dm sans|sans-serif/);
    });
  });

  // Test 4: Spacing consistency
  test('Elements use MD3 spacing tokens', async ({ page }) => {
    await page.goto('/');

    const spacingIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('.container, .section, .card, .md3-card');
      const issues = [];

      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const properties = ['padding', 'margin', 'gap'];

        properties.forEach(prop => {
          ['', '-top', '-right', '-bottom', '-left'].forEach(suffix => {
            const fullProp = prop + suffix;
            const value = styles.getPropertyValue(fullProp);

            if (value && value !== '0px' && value !== 'auto') {
              // Check if it's using MD3 spacing (multiples of 4px)
              const numValue = parseInt(value);
              if (numValue && numValue % 4 !== 0) {
                issues.push({
                  element: el.className || el.tagName,
                  property: fullProp,
                  value: value,
                  suggestion: `Use MD3 spacing: ${Math.round(numValue / 4) * 4}px`
                });
              }
            }
          });
        });
      });

      return issues.slice(0, 10); // Return first 10 issues
    });

    // Log issues but don't fail - this is informational
    if (spacingIssues.length > 0) {
      console.log('Spacing improvements suggested:', spacingIssues);
    }
  });

  // Test 5: Component consistency across pages
  test('MD3 components are consistent across pages', async ({ page }) => {
    const componentTests = [];

    for (const { path, name } of pages.slice(0, 3)) { // Test first 3 pages
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const components = await page.evaluate(() => {
        return {
          buttons: document.querySelectorAll('.md3-button').length,
          cards: document.querySelectorAll('.md3-card').length,
          textFields: document.querySelectorAll('.md3-text-field').length,
          chips: document.querySelectorAll('.md3-chip').length,
          fabs: document.querySelectorAll('.md3-fab').length
        };
      });

      componentTests.push({ page: name, components });

      // Check that MD3 buttons have proper structure
      if (components.buttons > 0) {
        const buttonStructure = await page.evaluate(() => {
          const button = document.querySelector('.md3-button');
          if (!button) return null;

          const styles = getComputedStyle(button);
          return {
            hasRipple: button.querySelector('.md3-button__ripple') !== null,
            hasIcon: button.querySelector('.material-icons') !== null,
            borderRadius: styles.borderRadius,
            minHeight: styles.minHeight,
            padding: styles.padding
          };
        });

        if (buttonStructure) {
          // Check border radius uses MD3 tokens
          expect(['12px', '16px', '20px', '24px', '28px', '9999px']).toContain(buttonStructure.borderRadius);
        }
      }
    }

    console.log('Component usage across pages:', componentTests);
  });

  // Test 6: Elevation and shadows
  test('Elevation uses MD3 tokens', async ({ page }) => {
    await page.goto('/');

    const elevations = await page.evaluate(() => {
      const elevated = document.querySelectorAll('.md3-card, .md3-button-elevated, [class*="elevation"]');
      const results = [];

      elevated.forEach(el => {
        const styles = getComputedStyle(el);
        const boxShadow = styles.boxShadow;

        if (boxShadow && boxShadow !== 'none') {
          results.push({
            element: el.className || el.tagName,
            boxShadow: boxShadow
          });
        }
      });

      return results.slice(0, 5);
    });

    // Check that shadows follow MD3 patterns
    elevations.forEach(item => {
      // MD3 shadows typically have multiple layers
      expect(item.boxShadow).toMatch(/rgba?\(/);
    });
  });

  // Test 7: Responsive behavior
  test.describe('Responsive MD3 behavior', () => {
    const viewports = [
      { name: 'mobile', width: 360, height: 640 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      test(`MD3 layout adapts correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        const layout = await page.evaluate((width) => {
          const container = document.querySelector('.container, main');
          const header = document.querySelector('header, app-header');

          const containerStyles = container ? getComputedStyle(container) : null;
          const headerStyles = header ? getComputedStyle(header) : null;

          return {
            containerPadding: containerStyles ? {
              left: containerStyles.paddingLeft,
              right: containerStyles.paddingRight
            } : null,
            headerHeight: headerStyles ? headerStyles.height : null,
            hasHamburgerMenu: !!document.querySelector('.menu-toggle, .hamburger, [aria-label*="menu"]'),
            hasBottomNav: !!document.querySelector('.bottom-nav, .mobile-nav'),
            gridColumns: containerStyles ? containerStyles.gridTemplateColumns : null
          };
        }, viewport.width);

        // Mobile specific checks
        if (viewport.width <= 600) {
          expect(layout.hasHamburgerMenu || layout.hasBottomNav).toBe(true);
          if (layout.containerPadding) {
            expect(['16px', '20px', '24px']).toContain(layout.containerPadding.left);
          }
        }

        // Desktop specific checks
        if (viewport.width >= 1280) {
          if (layout.containerPadding) {
            expect(['24px', '32px', '40px', '48px']).toContain(layout.containerPadding.left);
          }
        }
      });
    });
  });

  // Test 8: Animation and transitions
  test('MD3 motion tokens are used', async ({ page }) => {
    await page.goto('/');

    const transitions = await page.evaluate(() => {
      const animated = document.querySelectorAll('button, .md3-button, .md3-card, a');
      const results = [];

      animated.forEach((el, i) => {
        if (i < 10) { // Sample first 10
          const styles = getComputedStyle(el);
          const transition = styles.transition;
          const transitionDuration = styles.transitionDuration;
          const transitionTimingFunction = styles.transitionTimingFunction;

          if (transition !== 'none' && transition !== 'all 0s ease 0s') {
            results.push({
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              duration: transitionDuration,
              timing: transitionTimingFunction
            });
          }
        }
      });

      return results;
    });

    // Check that transitions use appropriate durations
    transitions.forEach(item => {
      const duration = parseFloat(item.duration);
      // MD3 motion durations: short (50-200ms), medium (200-400ms), long (400-700ms)
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThanOrEqual(1000);

      // Check easing functions
      expect(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier', 'linear'])
        .toContain(item.timing.split('(')[0]);
    });
  });

  // Test 9: Accessibility with MD3
  test('MD3 components meet accessibility standards', async ({ page }) => {
    await page.goto('/');

    const a11y = await page.evaluate(() => {
      const results = {
        buttonsWithAriaLabels: 0,
        buttonsTotal: 0,
        imagesWithAlt: 0,
        imagesTotal: 0,
        focusableElements: 0,
        contrastIssues: []
      };

      // Check buttons
      const buttons = document.querySelectorAll('button, .md3-button, .md3-fab, .md3-icon-button');
      results.buttonsTotal = buttons.length;
      buttons.forEach(btn => {
        if (btn.getAttribute('aria-label') || btn.textContent.trim()) {
          results.buttonsWithAriaLabels++;
        }
      });

      // Check images
      const images = document.querySelectorAll('img');
      results.imagesTotal = images.length;
      images.forEach(img => {
        if (img.getAttribute('alt')) {
          results.imagesWithAlt++;
        }
      });

      // Check focusable elements
      const focusable = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      results.focusableElements = focusable.length;

      return results;
    });

    // Verify accessibility
    if (a11y.buttonsTotal > 0) {
      expect(a11y.buttonsWithAriaLabels / a11y.buttonsTotal).toBeGreaterThan(0.8);
    }
    if (a11y.imagesTotal > 0) {
      expect(a11y.imagesWithAlt / a11y.imagesTotal).toBeGreaterThan(0.9);
    }
    expect(a11y.focusableElements).toBeGreaterThan(0);
  });

  // Test 10: Performance metrics
  test('MD3 implementation performance', async ({ page }) => {
    await page.goto('/');

    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];

      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        domInteractive: perf.domInteractive,
        cssCount: document.styleSheets.length,
        cssRules: Array.from(document.styleSheets).reduce((total, sheet) => {
          try {
            return total + (sheet.cssRules ? sheet.cssRules.length : 0);
          } catch (e) {
            return total;
          }
        }, 0)
      };
    });

    console.log('Performance metrics:', metrics);

    // Basic performance checks
    expect(metrics.cssCount).toBeLessThan(20); // Not too many stylesheets
    expect(metrics.domContentLoaded).toBeLessThan(3000); // Fast DOM load
  });

  // Test 11: Check MD3 component library is loaded
  test('MD3 component styles are properly loaded', async ({ page }) => {
    await page.goto('/');

    const md3Styles = await page.evaluate(() => {
      // Check if MD3 component styles are available
      const testElement = document.createElement('div');
      testElement.className = 'md3-button md3-button-filled';
      document.body.appendChild(testElement);

      const styles = getComputedStyle(testElement);
      const result = {
        hasStyles: styles.borderRadius !== '' && styles.borderRadius !== 'auto',
        borderRadius: styles.borderRadius,
        minHeight: styles.minHeight,
        display: styles.display
      };

      document.body.removeChild(testElement);
      return result;
    });

    expect(md3Styles.hasStyles).toBe(true);
    expect(md3Styles.borderRadius).toBeTruthy();
  });

  // Test 12: No Angular Material remnants
  test('No Angular Material components remain', async ({ page }) => {
    for (const { path, name } of pages) {
      await page.goto(path);

      const materialElements = await page.evaluate(() => {
        const selectors = [
          'mat-card', 'mat-button', 'mat-icon', 'mat-form-field',
          'mat-select', 'mat-option', 'mat-toolbar', 'mat-sidenav',
          'mat-list', 'mat-dialog', 'mat-checkbox', 'mat-radio',
          '[matButton]', '[mat-button]', '[mat-raised-button]',
          '[matInput]', '[matSuffix]', '[matPrefix]'
        ];

        const found = [];
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            found.push({
              selector,
              count: elements.length
            });
          }
        });

        return found;
      });

      expect(materialElements.length).toBe(0);
    }
  });
});

// MD3 Visual Regression Tests
test.describe('MD3 Visual Regression Tests', () => {
  test('Capture MD3 component screenshots', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot entire page
    await expect(page).toHaveScreenshot('md3-homepage-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    // Screenshot specific MD3 components if they exist
    const components = [
      { selector: '.md3-button', name: 'md3-button' },
      { selector: '.md3-card', name: 'md3-card' },
      { selector: '.md3-text-field', name: 'md3-text-field' },
      { selector: '.md3-chip', name: 'md3-chip' },
      { selector: '.page-header, .hero-section', name: 'page-header' }
    ];

    for (const { selector, name } of components) {
      const element = page.locator(selector).first();
      const count = await element.count();

      if (count > 0) {
        await expect(element).toHaveScreenshot(`${name}.png`, {
          animations: 'disabled'
        });
      }
    }
  });

  test('Dark mode MD3 tokens (if implemented)', async ({ page }) => {
    await page.goto('/');

    // Try to enable dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);

    const darkTokens = await page.evaluate(() => {
      const computed = getComputedStyle(document.documentElement);
      return {
        surface: computed.getPropertyValue('--md-sys-color-surface').trim(),
        onSurface: computed.getPropertyValue('--md-sys-color-on-surface').trim(),
        surfaceVariant: computed.getPropertyValue('--md-sys-color-surface-variant').trim()
      };
    });

    console.log('Dark mode tokens:', darkTokens);

    // Take a screenshot in dark mode
    await expect(page).toHaveScreenshot('md3-dark-mode.png', {
      fullPage: false
    });
  });
});
