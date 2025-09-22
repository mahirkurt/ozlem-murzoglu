const { test, expect } = require('@playwright/test');

test('Detect translation tags on Kliniğimiz page', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://ozlemmurzoglu.com/hakkimizda/klinigimiz');
  await page.waitForTimeout(3000); // Wait for translations to load

  // Get all visible text content
  const bodyText = await page.textContent('body');

  // Check for translation key patterns
  const patterns = [
    /CLINIC_DESIGN\.\w+/g,
    /CLINIC\.\w+/g,
    /HEADER\.\w+/g,
    /ABOUT\.\w+/g,
    /COMMON\.\w+/g
  ];

  const foundTags = [];
  patterns.forEach(pattern => {
    const matches = bodyText.match(pattern);
    if (matches) {
      foundTags.push(...matches);
    }
  });

  // Get specific elements
  const heroTitle = await page.locator('.hero-title').textContent().catch(() => 'Not found');
  const heroSubtitle = await page.locator('.hero-subtitle').textContent().catch(() => 'Not found');
  const breadcrumbs = await page.locator('.breadcrumb-item').allTextContents().catch(() => []);

  // Check section titles
  const sectionTitles = await page.locator('.section-title').allTextContents().catch(() => []);

  // Check team cards
  const teamCardTitles = await page.locator('.team-card h3').allTextContents().catch(() => []);
  const teamCardContent = await page.locator('.team-card p').allTextContents().catch(() => []);

  // Check CTA section
  const ctaTitle = await page.locator('.cta-title').textContent().catch(() => 'Not found');
  const ctaSubtitle = await page.locator('.cta-subtitle').textContent().catch(() => 'Not found');
  const ctaButton = await page.locator('.cta-button').textContent().catch(() => 'Not found');

  // Check menu navigation
  await page.hover('text=Hakkımızda');
  await page.waitForTimeout(500);
  const menuItems = await page.locator('.dropdown-menu a, [class*="submenu"] a, [class*="nav-dropdown"] a').allTextContents().catch(() => []);

  console.log('\n=== TRANSLATION TAGS DETECTION REPORT ===\n');

  console.log('Page URL: https://ozlemmurzoglu.com/hakkimizda/klinigimiz\n');

  console.log('Hero Section:');
  console.log('  Title:', heroTitle);
  console.log('  Subtitle:', heroSubtitle);

  console.log('\nBreadcrumbs:');
  breadcrumbs.forEach((crumb, i) => console.log(`  ${i + 1}. ${crumb}`));

  console.log('\nSection Titles:');
  sectionTitles.forEach((title, i) => console.log(`  ${i + 1}. ${title}`));

  console.log('\nTeam Cards:');
  console.log('  Titles:', teamCardTitles);
  console.log('  First paragraph samples:', teamCardContent.slice(0, 2));

  console.log('\nCTA Section:');
  console.log('  Title:', ctaTitle);
  console.log('  Subtitle:', ctaSubtitle);
  console.log('  Button:', ctaButton);

  console.log('\nMenu Items (Hakkımızda dropdown):');
  menuItems.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));

  console.log('\n=== FOUND TRANSLATION TAGS ===');
  const uniqueTags = [...new Set(foundTags)];
  if (uniqueTags.length > 0) {
    console.log('❌ Found untranslated tags:');
    uniqueTags.forEach(tag => console.log(`  - ${tag}`));
  } else {
    console.log('✅ No translation tags found in visible text');
  }

  // Assert no translation tags
  expect(uniqueTags.length).toBe(0);
});