const { test, expect } = require('@playwright/test');

test('About page shadow effects verification', async ({ page }) => {
  await page.goto('http://localhost:4200/hakkimizda');
  await page.waitForLoadState('networkidle');

  // Check service cards shadow
  const serviceCards = await page.locator('.services-overview .service-card').first();
  const serviceShadow = await serviceCards.evaluate(el => {
    return window.getComputedStyle(el).boxShadow;
  });

  console.log('Service card shadow:', serviceShadow);

  // Check value cards shadow
  const valueCards = await page.locator('.value-card').first();
  const valueShadow = await valueCards.evaluate(el => {
    return window.getComputedStyle(el).boxShadow;
  });

  console.log('Value card shadow:', valueShadow);

  // Verify shadows are applied
  expect(serviceShadow).not.toBe('none');
  expect(valueShadow).not.toBe('none');

  // Check if shadows contain multiple layers
  expect(serviceShadow).toContain('rgba');
  expect(valueShadow).toContain('rgba');

  // Take screenshot for visual verification
  await page.screenshot({
    path: 'about-shadow-test.png',
    fullPage: true
  });
});