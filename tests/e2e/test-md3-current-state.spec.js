// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('MD3 Current State Analysis', () => {
  test('Analyze current MD3 implementation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all MD3 tokens
    const tokens = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      const allTokens = {};

      // Get all CSS custom properties
      const cssRules = Array.from(document.styleSheets)
        .filter(sheet => {
          try {
            return sheet.cssRules;
          } catch {
            return false;
          }
        })
        .flatMap(sheet => Array.from(sheet.cssRules))
        .filter(rule => rule.selectorText === ':root' && rule.style);

      cssRules.forEach(rule => {
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith('--md-')) {
            allTokens[prop] = computed.getPropertyValue(prop).trim();
          }
        }
      });

      // Also check computed styles
      ['primary', 'secondary', 'tertiary', 'error', 'surface', 'background'].forEach(color => {
        const key = `--md-sys-color-${color}`;
        const value = computed.getPropertyValue(key).trim();
        if (value) allTokens[key] = value;
      });

      return allTokens;
    });

    console.log('=== Current MD3 Tokens ===');
    console.log(JSON.stringify(tokens, null, 2));

    // Check for hardcoded colors
    const hardcodedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      const hexPattern = /#[0-9A-Fa-f]{3,8}/;

      for (let i = 0; i < Math.min(elements.length, 100); i++) {
        const el = elements[i];
        const inlineStyle = el.getAttribute('style');

        if (inlineStyle && hexPattern.test(inlineStyle)) {
          issues.push({
            tag: el.tagName,
            class: el.className,
            style: inlineStyle
          });
        }
      }

      return issues;
    });

    console.log('\n=== Hardcoded Inline Styles ===');
    console.log(hardcodedElements.slice(0, 10));

    // Check component usage
    const components = await page.evaluate(() => {
      return {
        md3Buttons: document.querySelectorAll('.md3-button').length,
        md3Cards: document.querySelectorAll('.md3-card').length,
        md3TextFields: document.querySelectorAll('.md3-text-field').length,
        md3Chips: document.querySelectorAll('.md3-chip').length,
        md3Fabs: document.querySelectorAll('.md3-fab').length,

        // Check for old material components
        matElements: document.querySelectorAll('[class*="mat-"]').length,
        matTags: document.querySelectorAll('mat-card, mat-button, mat-icon').length
      };
    });

    console.log('\n=== Component Usage ===');
    console.log(components);

    // Check typography
    const typography = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const p = document.querySelector('p');
      const button = document.querySelector('button');

      const results = {};

      if (h1) {
        const styles = getComputedStyle(h1);
        results.h1 = {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          color: styles.color
        };
      }

      if (p) {
        const styles = getComputedStyle(p);
        results.p = {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          color: styles.color
        };
      }

      if (button) {
        const styles = getComputedStyle(button);
        results.button = {
          fontFamily: styles.fontFamily,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius
        };
      }

      return results;
    });

    console.log('\n=== Typography Analysis ===');
    console.log(typography);

    // Test assertions (lenient for analysis)
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
    expect(components.matTags).toBe(0); // No Angular Material tags
  });

  test('Check MD3 on all pages', async ({ page }) => {
    const pages = [
      { path: '/', name: 'home' },
      { path: '/about', name: 'about' },
      { path: '/services', name: 'services' },
      { path: '/blog', name: 'blog' },
      { path: '/contact', name: 'contact' }
    ];

    for (const { path, name } of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const analysis = await page.evaluate(() => {
        const computed = getComputedStyle(document.documentElement);

        return {
          primaryColor: computed.getPropertyValue('--md-sys-color-primary').trim(),
          hasContainer: !!document.querySelector('.container'),
          hasMD3Components: !!document.querySelector('[class*="md3-"]'),
          bodyBgColor: getComputedStyle(document.body).backgroundColor,
          bodyFont: getComputedStyle(document.body).fontFamily
        };
      });

      console.log(`\n=== ${name.toUpperCase()} Page ===`);
      console.log(analysis);
    }
  });
});