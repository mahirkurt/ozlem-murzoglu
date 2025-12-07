import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/hakkimizda',
  '/hakkimizda/dr-ozlem-murzoglu',
  '/hakkimizda/klinigimiz',
  '/hizmetlerimiz',
  '/hizmetlerimiz/laboratuvar-goruntuleme',
  '/hizmetlerimiz/triple-p',
  '/hizmetlerimiz/saglikli-uykular',
  '/hizmetlerimiz/bright-futures-program',
  '/hizmetlerimiz/sos-feeding',
  '/blog',
  '/sss',
  '/saygiyla',
  '/kaynaklar',
  '/iletisim'
];

test.describe('Full Site MD3 Compliance Audit', () => {

  for (const route of routes) {
    test(`[${route}] Check MD3 Compliance`, async ({ page }) => {
      console.log(`\n\n--- Auditing Route: ${route} ---`);
      
      // 1. Navigation
      await page.goto(route);
      await page.waitForTimeout(1000); // Wait for animations/rendering

      // 2. Color System Check (Backgrounds)
      const bgElements = page.locator('body, .page-container, mat-card, .card');
      const bgCount = await bgElements.count();
      for (let i = 0; i < bgCount; i++) {
        if (await bgElements.nth(i).isVisible()) {
          const bg = await bgElements.nth(i).evaluate(el => window.getComputedStyle(el).backgroundColor);
          // Expect valid non-black (unless explicitly dark theme intended, but usually surfaces are tinted)
          // This is a loose check to catch obvious breakage like transparency on top of black
          expect(bg, `[${route}] Background element ${i} should not be pure black`).not.toBe('rgb(0, 0, 0)'); 
        }
      }

      // 3. Touch Targets (Strict 48px)
      // Including more selectors to catch wider range of interactive elements
      const interactiveSelector = 'button, a, input, select, textarea, [role="button"]';
      const elements = page.locator(interactiveSelector);
      const count = await elements.count();
      
      let failCount = 0;

      for (let i = 0; i < count; ++i) {
        const el = elements.nth(i);
        if (await el.isVisible()) {
          const box = await el.boundingBox();
          if (box) {
            // Filter out obviously non-interactive layout links if necessary, but strictly 'a' and 'button' should match
            // Small exception for very small text links might be needed, but strictly MD3 wants 48px targets.
            // We will verify height OR width >= 48 OR padding padding to make clickable area large enough.
            // For now, strict box model check.
            
            if (box.height < 48 && box.width < 48) {
               const outerHTML = await el.evaluate(e => e.outerHTML.substring(0, 150));
               // Log failures but don't fail immediately to see all issues? 
               // No, let's fail to enforce the rule.
               // Actually, for "Audit" purposes, logging soft failures might be better to see the full picture.
               // Let's use a soft assertion pattern or just log.
               // User asked to "Verify", meaning pass/fail.
               
               console.log(`[Failure] ${route} - Element too small (${box.width}x${box.height}): ${outerHTML}`);
               failCount++;
            }
          }
        }
      }
      
      expect(failCount, `[${route}] Found ${failCount} elements with touch targets < 48px`).toBe(0);

      // 4. Typography Check (System Fonts)
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const hCount = await headings.count();
      for (let i = 0; i < hCount; ++i) {
        const font = await headings.nth(i).evaluate(el => window.getComputedStyle(el).fontFamily);
        expect(font, `[${route}] Heading ${i} font mismatch`).toMatch(/(Figtree|DM Sans|sans-serif)/);
      }

    });
  }

});

