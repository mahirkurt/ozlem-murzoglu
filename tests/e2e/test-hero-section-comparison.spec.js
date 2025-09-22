const { test, expect } = require('@playwright/test');

test.describe('Hero Section Comparison', () => {
  test('Compare hero sections between About and Dr. Ozlem pages', async ({ page }) => {
    // First, inspect the About page (reference)
    await page.goto('https://ozlemmurzoglu.com/hakkimizda');
    await page.waitForSelector('.hero-section', { timeout: 10000 });

    // Get About page hero section details
    const aboutHeroSection = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section');
      const heroContent = document.querySelector('.hero-section .hero-content');
      const container = hero?.closest('.container') || hero?.parentElement;
      const computedStyle = window.getComputedStyle(hero);

      return {
        exists: !!hero,
        marginTop: computedStyle.marginTop,
        minHeight: computedStyle.minHeight,
        height: computedStyle.height,
        position: computedStyle.position,
        display: computedStyle.display,
        parentClass: hero?.parentElement?.className,
        containerClass: container?.className,
        offsetTop: hero?.offsetTop,
        boundingRect: hero?.getBoundingClientRect(),
        heroContentPadding: heroContent ? window.getComputedStyle(heroContent).padding : null,
        htmlStructure: hero?.parentElement?.outerHTML?.substring(0, 500)
      };
    });

    console.log('About Page Hero Section:');
    console.log(JSON.stringify(aboutHeroSection, null, 2));

    // Now inspect the Dr. Ozlem page
    await page.goto('https://ozlemmurzoglu.com/hakkimizda/dr-ozlem-murzoglu');
    await page.waitForSelector('.hero-section', { timeout: 10000 });

    const drOzlemHeroSection = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section');
      const heroContent = document.querySelector('.hero-section .hero-content');
      const container = hero?.closest('.container') || hero?.parentElement;
      const computedStyle = window.getComputedStyle(hero);

      return {
        exists: !!hero,
        marginTop: computedStyle.marginTop,
        minHeight: computedStyle.minHeight,
        height: computedStyle.height,
        position: computedStyle.position,
        display: computedStyle.display,
        parentClass: hero?.parentElement?.className,
        containerClass: container?.className,
        offsetTop: hero?.offsetTop,
        boundingRect: hero?.getBoundingClientRect(),
        heroContentPadding: heroContent ? window.getComputedStyle(heroContent).padding : null,
        htmlStructure: hero?.parentElement?.outerHTML?.substring(0, 500)
      };
    });

    console.log('\nDr. Ozlem Page Hero Section:');
    console.log(JSON.stringify(drOzlemHeroSection, null, 2));

    // Compare the differences
    console.log('\n=== DIFFERENCES ===');
    console.log('Margin Top - About:', aboutHeroSection.marginTop, 'vs Dr:', drOzlemHeroSection.marginTop);
    console.log('Min Height - About:', aboutHeroSection.minHeight, 'vs Dr:', drOzlemHeroSection.minHeight);
    console.log('Offset Top - About:', aboutHeroSection.offsetTop, 'vs Dr:', drOzlemHeroSection.offsetTop);
    console.log('Parent Class - About:', aboutHeroSection.parentClass, 'vs Dr:', drOzlemHeroSection.parentClass);

    // Check for any wrapper divs
    const aboutWrapper = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section');
      let parent = hero?.parentElement;
      const wrappers = [];

      while (parent && parent.tagName !== 'BODY') {
        wrappers.push({
          tagName: parent.tagName,
          className: parent.className,
          id: parent.id,
          computedStyle: {
            marginTop: window.getComputedStyle(parent).marginTop,
            paddingTop: window.getComputedStyle(parent).paddingTop,
            position: window.getComputedStyle(parent).position
          }
        });
        parent = parent.parentElement;
      }

      return wrappers;
    });

    await page.goto('https://ozlemmurzoglu.com/hakkimizda/dr-ozlem-murzoglu');
    await page.waitForSelector('.hero-section');

    const drOzlemWrapper = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section');
      let parent = hero?.parentElement;
      const wrappers = [];

      while (parent && parent.tagName !== 'BODY') {
        wrappers.push({
          tagName: parent.tagName,
          className: parent.className,
          id: parent.id,
          computedStyle: {
            marginTop: window.getComputedStyle(parent).marginTop,
            paddingTop: window.getComputedStyle(parent).paddingTop,
            position: window.getComputedStyle(parent).position
          }
        });
        parent = parent.parentElement;
      }

      return wrappers;
    });

    console.log('\n=== WRAPPER HIERARCHY - About Page ===');
    console.log(JSON.stringify(aboutWrapper.slice(0, 3), null, 2));

    console.log('\n=== WRAPPER HIERARCHY - Dr. Ozlem Page ===');
    console.log(JSON.stringify(drOzlemWrapper.slice(0, 3), null, 2));
  });
});