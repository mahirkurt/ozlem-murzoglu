import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take a full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('services page visual comparison', async ({ page }) => {
    await page.goto('/hizmetlerimiz');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('services.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('about page visual comparison', async ({ page }) => {
    await page.goto('/hakkimizda');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('contact page visual comparison', async ({ page }) => {
    await page.goto('/iletisim');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('contact.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('header component visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('app-header');
    await expect(header).toHaveScreenshot('header.png');
  });

  test('footer component visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('app-footer');
    await expect(footer).toHaveScreenshot('footer.png');
  });

  test.describe('Responsive Visual Tests', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`homepage on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });

  test.describe('Dark Mode Visual Tests', () => {
    test('homepage in dark mode', async ({ page }) => {
      await page.goto('/');
      
      // Try to enable dark mode if available
      const darkModeToggle = page.locator('[aria-label*="dark"], [aria-label*="theme"]');
      if (await darkModeToggle.isVisible()) {
        await darkModeToggle.click();
        await page.waitForTimeout(500); // Wait for theme transition
      }
      
      await expect(page).toHaveScreenshot('homepage-dark.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});