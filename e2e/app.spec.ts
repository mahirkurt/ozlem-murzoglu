import { test, expect } from '@playwright/test';

test.describe('ozlemmurzoglu.com E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Dr. Özlem Murzoğlu/);
    
    // Check if header is visible
    const header = page.locator('app-header');
    await expect(header).toBeVisible();
    
    // Check if main content is loaded
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should navigate to services page', async ({ page }) => {
    // Click on services link
    await page.click('text=Hizmetlerimiz');
    
    // Wait for navigation
    await page.waitForURL('**/hizmetlerimiz');
    
    // Check if services page is loaded
    const servicesTitle = page.locator('h1');
    await expect(servicesTitle).toContainText(/Hizmetlerimiz/);
  });

  test('should navigate to about page', async ({ page }) => {
    // Click on about link
    await page.click('text=Hakkımızda');
    
    // Wait for navigation
    await page.waitForURL('**/hakkimizda/**');
    
    // Check if about page is loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to contact page', async ({ page }) => {
    // Click on contact link
    await page.click('text=İletişim');
    
    // Wait for navigation
    await page.waitForURL('**/iletisim');
    
    // Check if contact page is loaded
    const contactTitle = page.locator('h1');
    await expect(contactTitle).toContainText(/İletişim/);
  });

  test('should have working language switcher', async ({ page }) => {
    // Find language switcher
    const langSwitcher = page.locator('[aria-label*="language"], [aria-label*="dil"]');
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      // Check if language options are visible
      const englishOption = page.locator('text=English');
      await expect(englishOption).toBeVisible();
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu is visible
    const mobileMenu = page.locator('[aria-label*="menu"], [aria-label*="menü"]');
    await expect(mobileMenu).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('app-header')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('app-header')).toBeVisible();
  });
});