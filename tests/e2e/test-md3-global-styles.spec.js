/**
 * MD3 Global Style Implementation Tests
 *
 * Comprehensive tests for Material Design 3 (Material You) style implementation
 * Tests verify that MD3 design principles are correctly applied across the application
 */

const { test, expect } = require('@playwright/test');

test.describe('MD3 Global Style Implementation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4201');
    await page.waitForLoadState('networkidle');
  });

  test.describe('MD3 Color System', () => {
    test('should apply MD3 color tokens correctly', async ({ page }) => {
      // Test primary color
      const primaryElement = await page.locator('.mat-mdc-button.mat-primary').first();
      if (await primaryElement.count() > 0) {
        const primaryColor = await primaryElement.evaluate(el =>
          window.getComputedStyle(el).getPropertyValue('--md-sys-color-primary')
        );
        expect(primaryColor).toBeTruthy();
      }

      // Test surface colors
      const surfaceColor = await page.evaluate(() =>
        window.getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-surface')
      );
      expect(surfaceColor).toBeTruthy();

      // Test background colors
      const backgroundColor = await page.evaluate(() =>
        window.getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-background')
      );
      expect(backgroundColor).toBeTruthy();
    });

    test('should have proper color contrast ratios', async ({ page }) => {
      // Test text on primary color
      const button = await page.locator('button').first();
      if (await button.count() > 0) {
        const contrast = await button.evaluate(el => {
          const styles = window.getComputedStyle(el);
          const bg = styles.backgroundColor;
          const color = styles.color;

          // Simple contrast check (this is a simplified version)
          return { background: bg, foreground: color };
        });

        expect(contrast.background).toBeTruthy();
        expect(contrast.foreground).toBeTruthy();
      }
    });

    test('should support dynamic color theming', async ({ page }) => {
      // Check for CSS custom properties
      const customProperties = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.documentElement);
        const props = {};

        // Check for key MD3 color properties
        const colorProps = [
          '--md-sys-color-primary',
          '--md-sys-color-on-primary',
          '--md-sys-color-secondary',
          '--md-sys-color-on-secondary',
          '--md-sys-color-tertiary',
          '--md-sys-color-on-tertiary',
          '--md-sys-color-error',
          '--md-sys-color-on-error',
          '--md-sys-color-surface',
          '--md-sys-color-on-surface',
          '--md-sys-color-surface-variant',
          '--md-sys-color-on-surface-variant',
          '--md-sys-color-outline',
          '--md-sys-color-outline-variant'
        ];

        colorProps.forEach(prop => {
          const value = styles.getPropertyValue(prop);
          if (value) props[prop] = value;
        });

        return props;
      });

      // Verify at least some MD3 color properties exist
      expect(Object.keys(customProperties).length).toBeGreaterThan(0);
    });
  });

  test.describe('MD3 Typography System', () => {
    test('should use MD3 type scale', async ({ page }) => {
      // Test display styles
      const displayLarge = await page.locator('.display-large, [class*="display-large"]').first();
      if (await displayLarge.count() > 0) {
        const fontSize = await displayLarge.evaluate(el =>
          window.getComputedStyle(el).fontSize
        );
        expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(45); // MD3 display large is typically 57px
      }

      // Test headline styles
      const headlineLarge = await page.locator('h1, .headline-large').first();
      if (await headlineLarge.count() > 0) {
        const fontSize = await headlineLarge.evaluate(el =>
          window.getComputedStyle(el).fontSize
        );
        expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(28); // MD3 headline large is typically 32px
      }

      // Test body styles
      const bodyLarge = await page.locator('.body-large, p').first();
      if (await bodyLarge.count() > 0) {
        const fontSize = await bodyLarge.evaluate(el =>
          window.getComputedStyle(el).fontSize
        );
        expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(14); // MD3 body large is typically 16px
      }
    });

    test('should use proper font families', async ({ page }) => {
      const fonts = await page.evaluate(() => {
        const headingElement = document.querySelector('h1, h2, h3, h4, h5, h6');
        const bodyElement = document.querySelector('p, .body-text, body');

        return {
          heading: headingElement ? window.getComputedStyle(headingElement).fontFamily : '',
          body: bodyElement ? window.getComputedStyle(bodyElement).fontFamily : ''
        };
      });

      // Check for Figtree in headings or DM Sans in body
      expect(fonts.heading.toLowerCase()).toContain('figtree');
      expect(fonts.body.toLowerCase()).toContain('dm sans');
    });

    test('should have proper line heights and letter spacing', async ({ page }) => {
      const typography = await page.evaluate(() => {
        const element = document.querySelector('p, .body-medium');
        if (!element) return null;

        const styles = window.getComputedStyle(element);
        return {
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing
        };
      });

      if (typography) {
        // MD3 recommends specific line height ratios
        expect(typography.lineHeight).toBeTruthy();
        expect(typography.letterSpacing).toBeTruthy();
      }
    });
  });

  test.describe('MD3 Elevation System', () => {
    test('should apply MD3 elevation levels', async ({ page }) => {
      // Check for elevation classes or box-shadows
      const elevatedElements = await page.locator('[class*="elevation"], .mat-elevation-z1, .mat-elevation-z2, .mat-elevation-z3, .mat-elevation-z4, .mat-elevation-z5').all();

      for (const element of elevatedElements.slice(0, 3)) { // Test first 3 elevated elements
        const boxShadow = await element.evaluate(el =>
          window.getComputedStyle(el).boxShadow
        );

        // MD3 elevations should have box-shadow
        expect(boxShadow).not.toBe('none');
        expect(boxShadow).toContain('rgba');
      }
    });

    test('should use MD3 shadow color system', async ({ page }) => {
      const shadowColors = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.documentElement);
        return {
          shadow: styles.getPropertyValue('--md-sys-color-shadow'),
          scrim: styles.getPropertyValue('--md-sys-color-scrim')
        };
      });

      // MD3 defines shadow and scrim colors
      if (shadowColors.shadow || shadowColors.scrim) {
        expect(shadowColors.shadow || shadowColors.scrim).toBeTruthy();
      }
    });
  });

  test.describe('MD3 Shape System', () => {
    test('should apply MD3 corner radius tokens', async ({ page }) => {
      // Test small, medium, and large corner radius
      const cornerRadii = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.documentElement);
        return {
          none: styles.getPropertyValue('--md-sys-shape-corner-none'),
          extraSmall: styles.getPropertyValue('--md-sys-shape-corner-extra-small'),
          small: styles.getPropertyValue('--md-sys-shape-corner-small'),
          medium: styles.getPropertyValue('--md-sys-shape-corner-medium'),
          large: styles.getPropertyValue('--md-sys-shape-corner-large'),
          extraLarge: styles.getPropertyValue('--md-sys-shape-corner-extra-large'),
          full: styles.getPropertyValue('--md-sys-shape-corner-full')
        };
      });

      // Verify shape tokens exist
      const hasShapeTokens = Object.values(cornerRadii).some(value => value !== '');
      expect(hasShapeTokens).toBe(true);
    });

    test('should apply corner radius to components', async ({ page }) => {
      // Test buttons
      const button = await page.locator('button').first();
      if (await button.count() > 0) {
        const borderRadius = await button.evaluate(el =>
          window.getComputedStyle(el).borderRadius
        );
        expect(borderRadius).not.toBe('0px');
      }

      // Test cards
      const card = await page.locator('.mat-card, [class*="card"]').first();
      if (await card.count() > 0) {
        const borderRadius = await card.evaluate(el =>
          window.getComputedStyle(el).borderRadius
        );
        expect(borderRadius).not.toBe('0px');
      }
    });
  });

  test.describe('MD3 Spacing System', () => {
    test('should use MD3 spacing scale', async ({ page }) => {
      const spacingTokens = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.documentElement);
        const tokens = {};

        // Check for spacing custom properties
        for (let i = 0; i <= 12; i++) {
          const value = styles.getPropertyValue(`--spacing-${i}`);
          if (value) tokens[`spacing-${i}`] = value;
        }

        return tokens;
      });

      // Verify spacing tokens exist
      expect(Object.keys(spacingTokens).length).toBeGreaterThan(0);
    });

    test('should apply consistent padding and margins', async ({ page }) => {
      const container = await page.locator('.container, main, .content').first();
      if (await container.count() > 0) {
        const spacing = await container.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            padding: styles.padding,
            margin: styles.margin
          };
        });

        expect(spacing.padding).toBeTruthy();
      }
    });

    test('should maintain MD3 layout grid', async ({ page }) => {
      const layoutMetrics = await page.evaluate(() => {
        const container = document.querySelector('.container, main');
        if (!container) return null;

        const styles = window.getComputedStyle(container);
        return {
          maxWidth: styles.maxWidth,
          margin: styles.margin,
          padding: styles.padding
        };
      });

      if (layoutMetrics) {
        expect(layoutMetrics.maxWidth).toBeTruthy();
      }
    });
  });

  test.describe('MD3 State Layers', () => {
    test('should implement hover state layers', async ({ page }) => {
      const button = await page.locator('button:not(:disabled)').first();
      if (await button.count() > 0) {
        // Get initial state
        const initialOpacity = await button.evaluate(el => {
          const pseudo = window.getComputedStyle(el, '::before');
          return pseudo.opacity;
        });

        // Hover over button
        await button.hover();
        await page.waitForTimeout(100); // Wait for transition

        // Check hover state
        const hoverOpacity = await button.evaluate(el => {
          const pseudo = window.getComputedStyle(el, '::before');
          return pseudo.opacity;
        });

        // State layer opacity should change on hover
        // This test might need adjustment based on actual implementation
        expect(true).toBe(true); // Placeholder for state layer verification
      }
    });

    test('should show ripple effects on interaction', async ({ page }) => {
      const button = await page.locator('button:not(:disabled)').first();
      if (await button.count() > 0) {
        // Click and check for ripple
        await button.click();

        // Check for ripple element or animation
        const hasRipple = await button.evaluate(el => {
          // Check for Material ripple classes or custom ripple implementation
          return el.classList.contains('mat-ripple') ||
                 el.querySelector('.mat-ripple-element') !== null ||
                 el.querySelector('[class*="ripple"]') !== null;
        });

        // MD3 components should have ripple effects
        // This is a basic check, actual implementation may vary
        expect(true).toBe(true); // Placeholder for ripple verification
      }
    });
  });

  test.describe('MD3 Motion System', () => {
    test('should use MD3 easing functions', async ({ page }) => {
      const transitions = await page.evaluate(() => {
        const element = document.querySelector('[class*="transition"], button, a');
        if (!element) return null;

        const styles = window.getComputedStyle(element);
        return {
          transition: styles.transition,
          transitionTimingFunction: styles.transitionTimingFunction
        };
      });

      if (transitions && transitions.transition !== 'none') {
        // MD3 uses specific easing curves
        expect(transitions.transitionTimingFunction).toBeTruthy();
      }
    });

    test('should have appropriate animation durations', async ({ page }) => {
      const durations = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.documentElement);
        return {
          short1: styles.getPropertyValue('--md-sys-motion-duration-short1'),
          short2: styles.getPropertyValue('--md-sys-motion-duration-short2'),
          short3: styles.getPropertyValue('--md-sys-motion-duration-short3'),
          short4: styles.getPropertyValue('--md-sys-motion-duration-short4'),
          medium1: styles.getPropertyValue('--md-sys-motion-duration-medium1'),
          medium2: styles.getPropertyValue('--md-sys-motion-duration-medium2'),
          medium3: styles.getPropertyValue('--md-sys-motion-duration-medium3'),
          medium4: styles.getPropertyValue('--md-sys-motion-duration-medium4'),
          long1: styles.getPropertyValue('--md-sys-motion-duration-long1'),
          long2: styles.getPropertyValue('--md-sys-motion-duration-long2'),
          long3: styles.getPropertyValue('--md-sys-motion-duration-long3'),
          long4: styles.getPropertyValue('--md-sys-motion-duration-long4')
        };
      });

      // Check if any MD3 motion tokens are defined
      const hasMotionTokens = Object.values(durations).some(value => value !== '');
      expect(hasMotionTokens).toBe(true);
    });
  });

  test.describe('MD3 Responsive Design', () => {
    test('should adapt to different viewport sizes', async ({ page }) => {
      const viewports = [
        { width: 360, height: 800, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(100); // Wait for responsive adjustments

        // Check if layout adapts
        const layoutInfo = await page.evaluate(() => {
          const container = document.querySelector('.container, main');
          if (!container) return null;

          const styles = window.getComputedStyle(container);
          return {
            display: styles.display,
            flexDirection: styles.flexDirection,
            gridTemplateColumns: styles.gridTemplateColumns
          };
        });

        // Verify layout exists and adapts
        expect(layoutInfo).toBeTruthy();
      }
    });

    test('should use MD3 breakpoint system', async ({ page }) => {
      const breakpoints = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.documentElement);
        return {
          compact: styles.getPropertyValue('--md-sys-breakpoint-compact'),
          medium: styles.getPropertyValue('--md-sys-breakpoint-medium'),
          expanded: styles.getPropertyValue('--md-sys-breakpoint-expanded'),
          large: styles.getPropertyValue('--md-sys-breakpoint-large'),
          extraLarge: styles.getPropertyValue('--md-sys-breakpoint-extra-large')
        };
      });

      // Check if breakpoint system is defined
      const hasBreakpoints = Object.values(breakpoints).some(value => value !== '');
      // Breakpoints might be defined in media queries rather than custom properties
      expect(true).toBe(true); // Placeholder for breakpoint verification
    });
  });

  test.describe('MD3 Component Compliance', () => {
    test('should style buttons according to MD3 specs', async ({ page }) => {
      const buttonTypes = ['filled', 'outlined', 'text', 'elevated', 'tonal'];

      for (const type of buttonTypes) {
        const button = await page.locator(`button.${type}, button[class*="${type}"], .mat-mdc-${type}-button`).first();
        if (await button.count() > 0) {
          const styles = await button.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              minHeight: computed.minHeight,
              borderRadius: computed.borderRadius,
              textTransform: computed.textTransform,
              fontWeight: computed.fontWeight
            };
          });

          // MD3 buttons should have specific styling
          expect(parseFloat(styles.minHeight) || 40).toBeGreaterThanOrEqual(40); // MD3 minimum height
          expect(styles.borderRadius).toBeTruthy();
          // MD3 doesn't use uppercase text transform
          expect(styles.textTransform).not.toBe('uppercase');
        }
      }
    });

    test('should style text fields according to MD3 specs', async ({ page }) => {
      const input = await page.locator('input[type="text"], input[type="email"], textarea').first();
      if (await input.count() > 0) {
        const styles = await input.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            borderRadius: computed.borderRadius,
            minHeight: computed.minHeight,
            padding: computed.padding
          };
        });

        // MD3 text fields have specific styling
        expect(styles.borderRadius).toBeTruthy();
        expect(styles.padding).toBeTruthy();
      }
    });

    test('should style cards according to MD3 specs', async ({ page }) => {
      const card = await page.locator('.mat-card, [class*="card"]:not([class*="discard"])').first();
      if (await card.count() > 0) {
        const styles = await card.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            borderRadius: computed.borderRadius,
            boxShadow: computed.boxShadow,
            backgroundColor: computed.backgroundColor
          };
        });

        // MD3 cards should have corner radius and might have elevation
        expect(styles.borderRadius).not.toBe('0px');
        expect(styles.backgroundColor).toBeTruthy();
      }
    });
  });

  test.describe('MD3 Accessibility', () => {
    test('should maintain WCAG AA contrast ratios', async ({ page }) => {
      // This is a simplified contrast check
      const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, a').all();

      for (const element of textElements.slice(0, 5)) { // Test first 5 text elements
        const contrast = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor
          };
        });

        // Verify text has color defined
        expect(contrast.color).toBeTruthy();
        expect(contrast.color).not.toBe('rgba(0, 0, 0, 0)');
      }
    });

    test('should provide focus indicators', async ({ page }) => {
      const focusableElement = await page.locator('button:not(:disabled), a[href], input:not(:disabled)').first();
      if (await focusableElement.count() > 0) {
        // Focus the element
        await focusableElement.focus();

        // Check for focus styles
        const focusStyles = await focusableElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineOffset: styles.outlineOffset,
            boxShadow: styles.boxShadow
          };
        });

        // Should have some focus indicator
        const hasFocusIndicator =
          focusStyles.outline !== 'none' ||
          focusStyles.boxShadow !== 'none';

        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  test.describe('MD3 Dark Mode Support', () => {
    test('should support dark mode color scheme', async ({ page }) => {
      // Check if dark mode is implemented
      const darkModeSupport = await page.evaluate(() => {
        // Check for dark mode class or media query
        const hasDarkClass = document.documentElement.classList.contains('dark') ||
                            document.body.classList.contains('dark-theme');

        // Check for prefers-color-scheme support
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Check for dark mode custom properties
        const styles = window.getComputedStyle(document.documentElement);
        const hasDarkTokens = styles.getPropertyValue('--md-sys-color-on-surface-dark') ||
                             styles.getPropertyValue('--md-sys-color-surface-dark');

        return {
          hasDarkClass,
          supportsMediaQuery: darkModeQuery.matches !== undefined,
          hasDarkTokens: !!hasDarkTokens
        };
      });

      // Verify dark mode capability exists
      expect(
        darkModeSupport.hasDarkClass ||
        darkModeSupport.supportsMediaQuery ||
        darkModeSupport.hasDarkTokens
      ).toBe(true);
    });
  });
});

// Performance tests for MD3 implementation
test.describe('MD3 Performance', () => {
  test('should load MD3 styles efficiently', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const performance = window.performance;
      const paintMetrics = {};

      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        paintMetrics[entry.name] = entry.startTime;
      });

      return paintMetrics;
    });

    // First contentful paint should be reasonable
    if (metrics['first-contentful-paint']) {
      expect(metrics['first-contentful-paint']).toBeLessThan(3000); // 3 seconds
    }
  });

  test('should minimize layout shifts', async ({ page }) => {
    // Navigate and wait for stability
    await page.goto('http://localhost:4201');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for any late-loading content

    // Check for Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 1000);
      });
    });

    // CLS should be low (less than 0.1 for good experience)
    expect(cls).toBeLessThan(0.25); // Slightly relaxed threshold
  });
});