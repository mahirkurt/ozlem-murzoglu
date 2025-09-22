const { test, expect } = require('@playwright/test');

test.describe('Hero Section Consistency Verification', () => {
  const pages = [
    { url: '/hakkimizda', name: 'Hakkımızda' },
    { url: '/sss', name: 'SSS' },
    { url: '/hakkimizda/dr-ozlem-murzoglu', name: 'Dr. Özlem Murzoğlu' },
    { url: '/bilgi-merkezi', name: 'Kaynaklar' }
  ];

  test('All pages should have consistent hero section positioning', async ({ page }) => {
    const results = [];

    for (const testPage of pages) {
      await page.goto(testPage.url);
      await page.waitForSelector('.hero-section', { timeout: 10000 });

      // Get hero section position
      const heroSection = await page.locator('.hero-section').first();
      const heroOffsetTop = await heroSection.evaluate(el => el.offsetTop);

      // Get parent section element
      const parentSection = await page.locator('section[class*="-page"]').first();
      const parentPaddingTop = await parentSection.evaluate(el =>
        window.getComputedStyle(el).paddingTop
      );

      // Check translations are rendered (not showing keys)
      const heroTitle = await page.locator('.hero-title').first().textContent();
      const hasTranslationKeys = heroTitle.includes('COMMON.') ||
                                heroTitle.includes('ABOUT.') ||
                                heroTitle.includes('RESOURCES.') ||
                                heroTitle.includes('FAQ.');

      results.push({
        page: testPage.name,
        url: testPage.url,
        heroOffsetTop,
        parentPaddingTop,
        translationsWorking: !hasTranslationKeys,
        heroTitle: heroTitle.trim()
      });
    }

    // Display results
    console.log('\n=== Hero Section Consistency Report ===\n');
    results.forEach(r => {
      console.log(`${r.page}:`);
      console.log(`  - Hero offset from top: ${r.heroOffsetTop}px`);
      console.log(`  - Parent section padding: ${r.parentPaddingTop}`);
      console.log(`  - Translations working: ${r.translationsWorking ? '✓' : '✗'}`);
      console.log(`  - Hero title: "${r.heroTitle}"`);
      console.log('');
    });

    // Verify consistency
    const firstOffset = results[0].heroOffsetTop;
    const allConsistent = results.every(r => r.heroOffsetTop === firstOffset);

    expect(allConsistent).toBeTruthy();
    console.log(`\nConsistency check: ${allConsistent ? '✓ PASSED' : '✗ FAILED'}`);

    // Verify no translation keys showing
    const allTranslationsWorking = results.every(r => r.translationsWorking);
    expect(allTranslationsWorking).toBeTruthy();
    console.log(`Translation check: ${allTranslationsWorking ? '✓ PASSED' : '✗ FAILED'}`);
  });
});