const { test, expect } = require('@playwright/test');

test.describe('Hakkımızda Menu Translation Check', () => {
  const pages = [
    { url: '/hakkimizda', name: 'Hakkımızda Ana Sayfa' },
    { url: '/hakkimizda/dr-ozlem-murzoglu', name: 'Dr. Özlem Murzoğlu' },
    { url: '/hakkimizda/klinigimiz', name: 'Kliniğimiz' }
  ];

  test('Check all pages for untranslated tags', async ({ page }) => {
    const results = [];

    for (const testPage of pages) {
      await page.goto(testPage.url);
      await page.waitForTimeout(2000); // Wait for translations to load

      // Get all text content
      const bodyText = await page.textContent('body');

      // Check for common translation key patterns
      const translationPatterns = [
        /HEADER\.\w+/g,
        /ABOUT\.\w+/g,
        /CLINIC_DESIGN\.\w+/g,
        /CLINIC\.\w+/g,
        /COMMON\.\w+/g,
        /SERVICES\.\w+/g,
        /RESOURCES\.\w+/g,
        /CONTACT\.\w+/g
      ];

      const foundKeys = [];
      translationPatterns.forEach(pattern => {
        const matches = bodyText.match(pattern);
        if (matches) {
          foundKeys.push(...matches);
        }
      });

      // Also check specific elements
      const heroTitle = await page.locator('.hero-title').first().textContent().catch(() => '');
      const heroSubtitle = await page.locator('.hero-subtitle').first().textContent().catch(() => '');
      const breadcrumbs = await page.locator('.breadcrumb-item').allTextContents().catch(() => []);

      results.push({
        page: testPage.name,
        url: testPage.url,
        untranslatedKeys: [...new Set(foundKeys)], // Remove duplicates
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        breadcrumbs: breadcrumbs.map(b => b.trim()),
        hasTags: foundKeys.length > 0
      });
    }

    // Display results
    console.log('\n=== Translation Status Report ===\n');
    results.forEach(r => {
      console.log(`${r.page} (${r.url}):`);
      console.log(`  Hero Title: "${r.heroTitle}"`);
      console.log(`  Hero Subtitle: "${r.heroSubtitle}"`);
      console.log(`  Breadcrumbs: ${r.breadcrumbs.join(' > ')}`);

      if (r.hasTags) {
        console.log(`  ⚠️ UNTRANSLATED KEYS FOUND:`);
        r.untranslatedKeys.forEach(key => console.log(`    - ${key}`));
      } else {
        console.log(`  ✅ All translations working`);
      }
      console.log('');
    });

    // Assert no untranslated keys
    const failedPages = results.filter(r => r.hasTags);
    if (failedPages.length > 0) {
      console.log(`\n❌ ${failedPages.length} pages have untranslated keys`);
    } else {
      console.log(`\n✅ All pages properly translated`);
    }

    expect(failedPages.length).toBe(0);
  });
});