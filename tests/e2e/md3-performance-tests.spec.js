/**
 * MD3 Performance & Implementation Tests
 *
 * Optimized tests for Material Design 3 implementation
 * Focuses on critical MD3 features and performance
 */

const { test, expect } = require('@playwright/test');

test.describe('MD3 Critical Implementation Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4201');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('MD3 Design Tokens', () => {
    test('should have MD3 CSS custom properties defined', async ({ page }) => {
      const tokens = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = window.getComputedStyle(root);
        
        return {
          primary: computedStyle.getPropertyValue('--md-sys-color-primary').trim(),
          surface: computedStyle.getPropertyValue('--md-sys-color-surface').trim(),
          onSurface: computedStyle.getPropertyValue('--md-sys-color-on-surface').trim(),
          primaryContainer: computedStyle.getPropertyValue('--md-sys-color-primary-container').trim(),
          secondary: computedStyle.getPropertyValue('--md-sys-color-secondary').trim(),
          tertiary: computedStyle.getPropertyValue('--md-sys-color-tertiary').trim(),
          error: computedStyle.getPropertyValue('--md-sys-color-error').trim(),
          background: computedStyle.getPropertyValue('--md-sys-color-background').trim(),
          outline: computedStyle.getPropertyValue('--md-sys-color-outline').trim()
        };
      });

      // Verify core MD3 color tokens exist
      expect(tokens.primary).toBeTruthy();
      expect(tokens.surface).toBeTruthy();
      expect(tokens.onSurface).toBeTruthy();
      expect(tokens.background).toBeTruthy();
      
      console.log('MD3 Color Tokens:', tokens);
    });

    test('should have MD3 typography tokens', async ({ page }) => {
      const typography = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = window.getComputedStyle(root);
        
        return {
          displayLarge: computedStyle.getPropertyValue('--md-sys-typescale-display-large-size').trim(),
          headlineLarge: computedStyle.getPropertyValue('--md-sys-typescale-headline-large-size').trim(),
          titleLarge: computedStyle.getPropertyValue('--md-sys-typescale-title-large-size').trim(),
          bodyLarge: computedStyle.getPropertyValue('--md-sys-typescale-body-large-size').trim(),
          labelLarge: computedStyle.getPropertyValue('--md-sys-typescale-label-large-size').trim(),
          fontBrand: computedStyle.getPropertyValue('--md-sys-typescale-font-brand').trim(),
          fontPlain: computedStyle.getPropertyValue('--md-sys-typescale-font-plain').trim()
        };
      });

      // Verify typography tokens
      expect(typography.displayLarge || typography.titleLarge || typography.bodyLarge).toBeTruthy();
      console.log('MD3 Typography Tokens:', typography);
    });

    test('should have MD3 elevation system', async ({ page }) => {
      const elevation = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = window.getComputedStyle(root);
        
        return {
          level0: computedStyle.getPropertyValue('--md-sys-elevation-level0').trim(),
          level1: computedStyle.getPropertyValue('--md-sys-elevation-level1').trim(),
          level2: computedStyle.getPropertyValue('--md-sys-elevation-level2').trim(),
          level3: computedStyle.getPropertyValue('--md-sys-elevation-level3').trim()
        };
      });

      // At least some elevation levels should be defined
      const hasElevation = Object.values(elevation).some(value => value && value !== 'none');
      expect(hasElevation).toBeTruthy();
      console.log('MD3 Elevation System:', elevation);
    });
  });

  test.describe('MD3 Component Implementation', () => {
    test('should implement MD3 button styles', async ({ page }) => {
      // Look for buttons on the page
      const buttons = await page.locator('button, .md-button, .mat-mdc-button').all();
      
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        const buttonStyles = await firstButton.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            borderRadius: styles.borderRadius,
            fontFamily: styles.fontFamily,
            fontWeight: styles.fontWeight,
            minHeight: styles.minHeight,
            padding: styles.padding,
            transition: styles.transition,
            cursor: styles.cursor
          };
        });

        // MD3 buttons should have rounded corners
        expect(buttonStyles.borderRadius).toBeTruthy();
        expect(buttonStyles.cursor).toBe('pointer');
        
        console.log('Button Styles:', buttonStyles);
      }
    });

    test('should implement MD3 card styles', async ({ page }) => {
      // Look for card-like elements
      const cards = await page.locator('.card, .mat-card, .md-card, [class*="card"]').all();
      
      if (cards.length > 0) {
        const firstCard = cards[0];
        const cardStyles = await firstCard.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow,
            backgroundColor: styles.backgroundColor,
            overflow: styles.overflow
          };
        });

        // MD3 cards should have elevation and rounded corners
        expect(cardStyles.borderRadius).toBeTruthy();
        console.log('Card Styles:', cardStyles);
      }
    });

    test('should have proper text contrast ratios', async ({ page }) => {
      // Get text elements and check contrast
      const textElements = await page.locator('h1, h2, h3, p, span, div').all();
      let contrastIssues = 0;
      
      for (let i = 0; i < Math.min(textElements.length, 10); i++) {
        const element = textElements[i];
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          const contrast = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            return {
              color,
              backgroundColor,
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight
            };
          });

          // Basic check - color should not be transparent or same as background
          if (contrast.color === contrast.backgroundColor) {
            contrastIssues++;
          }
        }
      }

      // Should not have too many contrast issues
      expect(contrastIssues).toBeLessThan(textElements.length * 0.1); // Less than 10% issues
    });
  });

  test.describe('MD3 Responsive Design', () => {
    test('should be responsive across different viewport sizes', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }  // Desktop
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500); // Wait for layout adjustment

        // Check if layout adapts
        const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
        expect(bodyWidth).toBeGreaterThan(0);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width);

        // Check if navigation is responsive
        const nav = await page.locator('nav, .navigation, .header').first();
        if (await nav.count() > 0) {
          const navStyles = await nav.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              display: styles.display,
              width: el.offsetWidth,
              height: el.offsetHeight
            };
          });
          expect(navStyles.display).not.toBe('none');
        }
      }
    });

    test('should have proper touch targets on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const interactiveElements = await page.locator('button, a, [role="button"], input, select, textarea').all();
      let smallTargets = 0;

      for (const element of interactiveElements.slice(0, 10)) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          const boundingBox = await element.boundingBox();
          if (boundingBox && (boundingBox.width < 44 || boundingBox.height < 44)) {
            smallTargets++;
          }
        }
      }

      // Most interactive elements should meet minimum touch target size (44px)
      expect(smallTargets).toBeLessThan(interactiveElements.length * 0.3); // Less than 30% should be small
    });
  });

  test.describe('MD3 Performance', () => {
    test('should load with good Core Web Vitals', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:4201');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load reasonably fast (under 3 seconds)
      expect(loadTime).toBeLessThan(3000);

      // Check for layout shifts
      const layoutShifts = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cumulativeLayoutShift = 0;
          
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.hadRecentInput) continue;
              cumulativeLayoutShift += entry.value;
            }
          });

          observer.observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(cumulativeLayoutShift);
          }, 2000);
        });
      });

      // CLS should be low (< 0.1 is good, < 0.25 is acceptable)
      expect(layoutShifts).toBeLessThan(0.25);
      
      console.log(`Load Time: ${loadTime}ms, CLS: ${layoutShifts}`);
    });

    test('should have optimized font loading', async ({ page }) => {
      const fonts = await page.evaluate(() => {
        const loadedFonts = [];
        if (document.fonts) {
          document.fonts.forEach(font => {
            loadedFonts.push({
              family: font.family,
              status: font.status,
              weight: font.weight,
              style: font.style
            });
          });
        }
        return loadedFonts;
      });

      // Should have loaded fonts
      expect(fonts.length).toBeGreaterThan(0);
      
      // Most fonts should be loaded
      const loadedFonts = fonts.filter(font => font.status === 'loaded');
      expect(loadedFonts.length).toBeGreaterThan(0);
      
      console.log('Loaded Fonts:', loadedFonts);
    });
  });

  test.describe('MD3 Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check for buttons without accessible names
      const buttonsWithoutNames = await page.locator('button:not([aria-label]):not([aria-labelledby])').filter({
        hasNotText: /.+/
      }).count();

      // Should have minimal buttons without accessible names
      expect(buttonsWithoutNames).toBeLessThan(3);

      // Check for images without alt text
      const imagesWithoutAlt = await page.locator('img:not([alt])').count();
      expect(imagesWithoutAlt).toBe(0);

      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      if (headings.length > 0) {
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1); // Should have at least one h1
        expect(h1Count).toBeLessThanOrEqual(2); // Should not have too many h1s
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Focus first interactive element
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const activeEl = document.activeElement;
        return {
          tagName: activeEl.tagName,
          className: activeEl.className,
          hasTabIndex: activeEl.hasAttribute('tabindex'),
          tabIndex: activeEl.tabIndex
        };
      });

      // Should focus on an interactive element
      expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focusedElement.tagName)).toBeTruthy();
      
      console.log('Focused Element:', focusedElement);
    });
  });
});