// @ts-check
const { test, expect } = require('@playwright/test');

const pages = [
  {
    name: 'dr-ozlem',
    path: '/hakkimizda/dr-ozlem-murzoglu',
    requireContactCta: true,
    requirePageHeader: true
  },
  {
    name: 'saglikli-uykular',
    path: '/hizmetlerimiz/saglikli-uykular',
    requireContactCta: true,
    requirePageHeader: true
  }
];

test.describe('MD3 page header and CTA compliance', () => {
  test('MD3 tokens are available', async ({ page }) => {
    await page.goto('/');

    const tokens = await page.evaluate(() => {
      const computed = getComputedStyle(document.documentElement);
      return {
        primary: computed.getPropertyValue('--md-sys-color-primary').trim(),
        surface: computed.getPropertyValue('--md-sys-color-surface').trim(),
        spacing4: computed.getPropertyValue('--md-sys-spacing-4').trim(),
        cornerLarge: computed.getPropertyValue('--md-sys-shape-corner-large').trim()
      };
    });

    expect(tokens.primary).not.toBe('');
    expect(tokens.surface).not.toBe('');
    expect(tokens.spacing4).toBe('16px');
    expect(tokens.cornerLarge).not.toBe('');
  });

  pages.forEach((pageInfo) => {
    test(`page header and CTA on ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const headerCount = await page.locator('app-page-header, .page-header').count();
      if (pageInfo.requirePageHeader) {
        expect(headerCount).toBeGreaterThan(0);
      }

      const ctaCount = await page.locator('app-contact-cta, .contact-cta').count();
      if (pageInfo.requireContactCta) {
        expect(ctaCount).toBeGreaterThan(0);
      }

      const heroCount = await page.locator('app-hero-section, .hero-section').count();
      expect(heroCount).toBe(0);

      const faIcons = await page.locator('[class*="fa-"]').count();
      expect(faIcons).toBe(0);

      const bodyText = (await page.locator('body').textContent()) || '';
      expect(bodyText).not.toMatch(/COMMON\.|CONTACT_CTA\.|ABOUT\.|SERVICES\.|RESOURCES\./);
    });
  });
});
