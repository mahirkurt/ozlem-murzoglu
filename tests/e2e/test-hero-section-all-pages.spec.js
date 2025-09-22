const { test, expect } = require('@playwright/test');

test.describe('Hero Section Analysis - All Pages', () => {
  test('Analyze hero sections on all three pages', async ({ page }) => {
    const pages = [
      { name: 'Hakkımızda', url: 'https://ozlemmurzoglu.com/hakkimizda' },
      { name: 'SSS', url: 'https://ozlemmurzoglu.com/sss' },
      { name: 'Dr. Özlem', url: 'https://ozlemmurzoglu.com/hakkimizda/dr-ozlem-murzoglu' }
    ];

    const results = {};

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await page.waitForTimeout(2000); // Wait for page to fully load

      const heroData = await page.evaluate(() => {
        const hero = document.querySelector('.hero-section');
        const appHero = document.querySelector('app-hero-section');
        const header = document.querySelector('app-header, header');
        const body = document.body;

        // Get header height
        const headerHeight = header ? header.getBoundingClientRect().height : 0;

        if (!hero) {
          return {
            exists: false,
            message: 'No hero section found'
          };
        }

        const heroRect = hero.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(hero);
        const appHeroStyle = appHero ? window.getComputedStyle(appHero) : null;

        // Check parent elements
        let parent = hero.parentElement;
        const parents = [];
        while (parent && parent !== body) {
          parents.push({
            tag: parent.tagName,
            class: parent.className,
            styles: {
              marginTop: window.getComputedStyle(parent).marginTop,
              paddingTop: window.getComputedStyle(parent).paddingTop,
              position: window.getComputedStyle(parent).position
            }
          });
          parent = parent.parentElement;
        }

        return {
          exists: true,
          headerHeight,
          hero: {
            top: heroRect.top,
            height: heroRect.height,
            marginTop: computedStyle.marginTop,
            paddingTop: computedStyle.paddingTop,
            position: computedStyle.position,
            display: computedStyle.display,
            minHeight: computedStyle.minHeight
          },
          appHero: appHero ? {
            marginTop: appHeroStyle.marginTop,
            display: appHeroStyle.display,
            position: appHeroStyle.position
          } : null,
          distanceFromHeader: heroRect.top - headerHeight,
          parents: parents.slice(0, 2), // First 2 parents
          actualTopPosition: hero.offsetTop
        };
      });

      results[pageInfo.name] = heroData;
      console.log(`\n=== ${pageInfo.name} Page ===`);
      console.log(JSON.stringify(heroData, null, 2));
    }

    // Compare results
    console.log('\n\n=== COMPARISON ===');
    console.log('Distance from header:');
    for (const [page, data] of Object.entries(results)) {
      if (data.exists) {
        console.log(`${page}: ${data.distanceFromHeader}px (margin-top: ${data.hero.marginTop})`);
      }
    }

    console.log('\nActual top positions:');
    for (const [page, data] of Object.entries(results)) {
      if (data.exists) {
        console.log(`${page}: ${data.actualTopPosition}px`);
      }
    }

    // Check CSS rules
    console.log('\n=== CSS ANALYSIS ===');
    const cssData = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      const heroRules = [];

      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          rules.forEach(rule => {
            if (rule.selectorText && rule.selectorText.includes('hero-section')) {
              heroRules.push({
                selector: rule.selectorText,
                marginTop: rule.style.marginTop,
                minHeight: rule.style.minHeight,
                position: rule.style.position
              });
            }
          });
        } catch (e) {
          // Cross-origin stylesheets may throw errors
        }
      });

      return heroRules;
    });

    console.log('Hero section CSS rules found:');
    console.log(JSON.stringify(cssData, null, 2));
  });
});