const { test, expect } = require('@playwright/test');

test('Quick detect translation tags', async ({ page }) => {
  // Start local server
  await page.goto('http://localhost:4200/hakkimizda/klinigimiz');
  await page.waitForLoadState('networkidle');

  // Get all text
  const allText = await page.evaluate(() => document.body.innerText);

  // Find translation tags
  const tagPattern = /[A-Z_]+\.[A-Z_]+/g;
  const foundTags = allText.match(tagPattern) || [];

  console.log('Found tags:', [...new Set(foundTags)]);

  // Check specific elements
  const elements = await page.evaluate(() => {
    const hero = document.querySelector('.hero-title')?.innerText || '';
    const subtitle = document.querySelector('.hero-subtitle')?.innerText || '';
    const sections = Array.from(document.querySelectorAll('.section-title')).map(el => el.innerText);
    const teamCards = Array.from(document.querySelectorAll('.team-card h3')).map(el => el.innerText);

    return { hero, subtitle, sections, teamCards };
  });

  console.log('Elements:', elements);
});