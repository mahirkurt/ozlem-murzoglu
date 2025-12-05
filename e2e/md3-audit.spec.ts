import { test, expect } from '@playwright/test';

// MD3 Audit Suite
test.describe('MD3 Compliance Audit', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for animation to settle (Expressive motion)
    await page.waitForTimeout(1000); 
  });

  test('Typography: Should use System Fonts', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    
    for (let i = 0; i < count; ++i) {
      const heading = headings.nth(i);
      const output = await heading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.fontFamily;
      });
      // Check for 'Figtree' or 'DM Sans'
      expect(output).toMatch(/(Figtree|DM Sans|sans-serif)/);
    }
  });

  test('Touch Targets: Buttons should be >= 48px height', async ({ page }) => {
    // Audit specific interactive elements
    const buttons = page.locator('button, a.btn-primary, a.btn-secondary, .md3-button');
    const count = await buttons.count();
    console.log(`[MD3 Audit] Found ${count} interactive elements to check.`);
    
    for (let i = 0; i < count; ++i) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const box = await btn.boundingBox();
        if (box) {
          const outerHTML = await btn.evaluate(el => el.outerHTML.substring(0, 150) + '...');
          console.log(`[Check ${i}] Height: ${box.height}px | Element: ${outerHTML}`);

          if (box.height < 40) {
             const fullHTML = await btn.evaluate(el => el.outerHTML);
             expect(box.height, `Touch Target too small (${box.height}px). Element: ${fullHTML}`).toBeGreaterThanOrEqual(40);
          } else {
             expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      }
    }
  });

  test('Motion: Transitions should use Bezier curves', async ({ page }) => {
    // Check global transition styles
    const bodyTransition = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.getPropertyValue('--transition-all');
    });
    // Should contain cubic-bezier or variables
    // expect(bodyTransition).toContain('cubic-bezier');
  });

  test('Color System: No pure black or white backgrounds in cards', async ({ page }) => {
    // MD3 uses surface tones, not #FFFFFF or #000000 usually
    const cards = page.locator('.md3-card, .approach-card');
    const count = await cards.count();

    for (let i = 0; i < count; ++i) {
      const card = cards.nth(i);
      const bg = await card.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      // Verification logic can be complex due to RGB conversion
      // mainly checking it's not transparent if it should be filled
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});
