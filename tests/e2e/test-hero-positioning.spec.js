const { test, expect } = require('@playwright/test');

test.describe('Header Section Positioning', () => {
  const pagesToTest = [
    { path: '/hakkimizda', name: 'About' },
    { path: '/hakkimizda/dr-ozlem-murzoglu', name: 'Dr Ozlem Murzoglu' },
    { path: '/hakkimizda/klinigimiz', name: 'Clinic' },
    { path: '/sss', name: 'FAQ' },
    { path: '/hizmetlerimiz/laboratuvar-goruntuleme', name: 'Laboratory' },
    { path: '/hizmetlerimiz/triple-p', name: 'Triple P' },
    { path: '/hizmetlerimiz/saglikli-uykular', name: 'Healthy Sleep' },
    { path: '/hizmetlerimiz/bright-futures-program', name: 'Bright Futures' },
    { path: '/saygiyla', name: 'Respect' },
    { path: '/kaynaklar', name: 'Resources' }
  ];

  for (const page of pagesToTest) {
    test(`${page.name} page - header section clears header`, async ({ page: browserPage }) => {
      await browserPage.goto(`http://localhost:4200${page.path}`);
      await browserPage.waitForLoadState('networkidle');

      const header = await browserPage.locator('app-header, header').first();
      const headerBox = await header.boundingBox();
      const headerHeight = headerBox ? headerBox.height : 0;

      const pageHeader = await browserPage
        .locator('app-hero-section, .hero-section, app-page-header, .page-header')
        .first();
      const sectionBox = await pageHeader.boundingBox();

      expect(sectionBox).not.toBeNull();

      if (sectionBox) {
        const sectionTop = sectionBox.y;
        const headerBottom = headerHeight;

        console.log(`${page.name}: Header height=${headerHeight}px, section top=${sectionTop}px`);

        expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 1);

        await browserPage.screenshot({
          path: `header-position-${page.name.toLowerCase().replace(/\\s+/g, '-')}.png`,
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

  test('Responsive header positioning on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('http://localhost:4200/hizmetlerimiz/laboratuvar-goruntuleme');
    await page.waitForLoadState('networkidle');

    const header = await page.locator('app-header, header').first();
    const headerBox = await header.boundingBox();
    const headerHeight = headerBox ? headerBox.height : 0;

    const pageHeader = await page
      .locator('app-hero-section, .hero-section, app-page-header, .page-header')
      .first();
    const sectionBox = await pageHeader.boundingBox();

    if (sectionBox) {
      const sectionTop = sectionBox.y;

      console.log(`Mobile: Header height=${headerHeight}px, section top=${sectionTop}px`);

      expect(sectionTop).toBeGreaterThanOrEqual(headerHeight - 1);
    }
  });
});
