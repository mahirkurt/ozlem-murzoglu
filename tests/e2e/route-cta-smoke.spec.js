const { test, expect } = require('@playwright/test');

const redirectCases = [
  { from: '/home', to: '/' },
  { from: '/anasayfa', to: '/' },
  { from: '/anasayfa/legacy-slug', to: '/' },
  { from: '/hizmetlerimiz/asi-takibi', to: '/hizmetlerimiz' },
  { from: '/hizmetlerimiz/gelisim-takibi', to: '/hizmetlerimiz' },
  { from: '/hizmetlerimiz/gelisim-degerlendirmesi', to: '/hizmetlerimiz' },
  { from: '/yasal/gizlilik', to: '/legal/privacy' },
  { from: '/yasal/kullanim-kosullari', to: '/legal/terms' },
  { from: '/yasal/kvkk', to: '/legal/kvkk' },
];

const directRoutes = ['/randevu', '/legal/privacy', '/legal/terms', '/legal/kvkk'];

test.describe('Route + CTA smoke', () => {
  for (const c of redirectCases) {
    test(`redirect ${c.from} -> ${c.to}`, async ({ page }) => {
      await page.goto(c.from, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(new RegExp(`${c.to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), {
        timeout: 20000,
      });
    });
  }

  for (const route of directRoutes) {
    test(`route responds with content: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toBeVisible();
      const pathname = new URL(page.url()).pathname;
      expect(pathname).toBe(route);

      const bodyTextLen = await page.locator('body').innerText().then((t) => t.trim().length);
      expect(bodyTextLen).toBeGreaterThan(120);
    });
  }

  test('home and faq WhatsApp CTAs point to centralized contact values', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });

    const headerWhatsappHref = await page.locator('.utility-row a.utility-link.whatsapp').first().getAttribute('href');
    expect(headerWhatsappHref).toContain('api.whatsapp.com/send?phone=905466884483');

    const contactCtaHref = await page.locator('section.contact-cta a.btn-secondary').first().getAttribute('href');
    expect(contactCtaHref).toContain('wa.me/905466884483');

    await page.goto('/sss', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/hakkimizda\/sss$/, { timeout: 20000 });
    const faqCtaHref = await page.locator('section.cta-section a.btn-secondary').first().getAttribute('href');
    expect(faqCtaHref).toContain('wa.me/905466884483');
  });

  test('legal pages use current phone/email contact details', async ({ page }) => {
    await page.goto('/legal/privacy', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/legal\/privacy$/, { timeout: 20000 });

    const phoneHref = await page.locator('a[href^="tel:"]').first().getAttribute('href');
    const emailHref = await page.locator('a[href^="mailto:"]').first().getAttribute('href');
    const phoneText = (await page.locator('a[href^="tel:"]').first().innerText())
      .replace(/\s+/g, ' ')
      .trim();
    const emailText = (await page.locator('a[href^="mailto:"]').first().innerText()).trim();

    expect(phoneHref).toBe('tel:+902166884483');
    expect(phoneText).toContain('0216 688 44 83');
    expect(emailHref).toBe('mailto:klinik@drmurzoglu.com');
    expect(emailText).toBe('klinik@drmurzoglu.com');
  });
});
