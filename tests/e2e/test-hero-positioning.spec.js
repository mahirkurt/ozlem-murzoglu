const { test, expect } = require('@playwright/test');

test.describe('Hero Section Positioning', () => {
  const pagesToTest = [
    { path: '/hakkimizda', name: 'About' },
    { path: '/hakkimizda/dr-ozlem-murzoglu', name: 'Dr. Özlem Murzoğlu' },
    { path: '/hakkimizda/klinigimiz', name: 'Clinic' },
    { path: '/hakkimizda/sss', name: 'FAQ' },
    { path: '/hizmetlerimiz/laboratuvar', name: 'Laboratory' },
    { path: '/bilgi-merkezi/gelisim-rehberleri/triple-p', name: 'Triple P' },
    { path: '/hizmetlerimiz/asi', name: 'Vaccination' },
    { path: '/hizmetlerimiz/check-up', name: 'Check-up' }
  ];

  for (const page of pagesToTest) {
    test(`${page.name} page - hero section clears header`, async ({ page: browserPage }) => {
      await browserPage.goto(`http://localhost:4201${page.path}`);
      await browserPage.waitForLoadState('networkidle');

      // Get header height
      const header = await browserPage.locator('app-header, header').first();
      const headerBox = await header.boundingBox();
      const headerHeight = headerBox ? headerBox.height : 0;

      // Get hero section position
      const heroSection = await browserPage.locator('app-hero-section, .hero-section').first();
      const heroBox = await heroSection.boundingBox();

      // Check if hero section exists
      expect(heroBox).not.toBeNull();

      if (heroBox) {
        // Hero section should start at or below header bottom
        const heroTop = heroBox.y;
        const headerBottom = headerHeight;

        console.log(`${page.name}: Header height=${headerHeight}px, Hero top=${heroTop}px`);

        // Hero should not be under header (heroTop should be >= headerBottom)
        expect(heroTop).toBeGreaterThanOrEqual(headerBottom - 1); // Allow 1px tolerance

        // Hero should have proper margin-top (around 60-80px depending on viewport)
        const heroMarginTop = await heroSection.evaluate(el => {
          return window.getComputedStyle(el).marginTop;
        });

        console.log(`${page.name}: Hero margin-top=${heroMarginTop}`);

        // Verify margin-top is set
        expect(heroMarginTop).toMatch(/\d+px/);

        // Take screenshot for visual verification
        await browserPage.screenshot({
          path: `hero-position-${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          clip: {
            x: 0,
            y: 0,
            width: 1280,
            height: 400
          }
        });
      }
    });
  }

  test('Responsive hero positioning on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('http://localhost:4201/hizmetlerimiz/laboratuvar');
    await page.waitForLoadState('networkidle');

    // Get header height on mobile
    const header = await page.locator('app-header, header').first();
    const headerBox = await header.boundingBox();
    const headerHeight = headerBox ? headerBox.height : 0;

    // Get hero section
    const heroSection = await page.locator('app-hero-section, .hero-section').first();
    const heroBox = await heroSection.boundingBox();

    if (heroBox) {
      const heroTop = heroBox.y;

      console.log(`Mobile: Header height=${headerHeight}px, Hero top=${heroTop}px`);

      // Hero should clear the mobile header
      expect(heroTop).toBeGreaterThanOrEqual(headerHeight - 1);

      // Check mobile margin-top
      const heroMarginTop = await heroSection.evaluate(el => {
        return window.getComputedStyle(el).marginTop;
      });

      console.log(`Mobile: Hero margin-top=${heroMarginTop}`);

      // Mobile should have around 60px margin-top
      const marginValue = parseInt(heroMarginTop);
      expect(marginValue).toBeGreaterThanOrEqual(55);
      expect(marginValue).toBeLessThanOrEqual(65);
    }
  });
});