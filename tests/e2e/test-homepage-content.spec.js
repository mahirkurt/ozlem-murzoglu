// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage Content Loading', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage
    await page.goto('https://dr-murzoglu.web.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
  });

  test('should load all homepage sections', async ({ page }) => {
    // Wait for main content to be visible
    await page.waitForLoadState('domcontentloaded');

    // Check if liquid hero is loaded
    const liquidHero = await page.locator('app-liquid-hero').first();
    await expect(liquidHero).toBeVisible({ timeout: 10000 });
    console.log('✓ Liquid Hero loaded');

    // Check if approach section is loaded
    const approachSection = await page.locator('app-approach-section').first();
    await expect(approachSection).toBeVisible({ timeout: 10000 });
    console.log('✓ Approach Section loaded');

    // Check if doctor bio is loaded
    const doctorBio = await page.locator('app-doctor-bio').first();
    await expect(doctorBio).toBeVisible({ timeout: 10000 });
    console.log('✓ Doctor Bio loaded');

    // Check if services section is loaded
    const servicesSection = await page.locator('app-services-section').first();
    await expect(servicesSection).toBeVisible({ timeout: 10000 });
    console.log('✓ Services Section loaded');

    // Check if appointment section is loaded
    const appointmentSection = await page.locator('app-appointment-section').first();
    await expect(appointmentSection).toBeVisible({ timeout: 10000 });
    console.log('✓ Appointment Section loaded');

    // Check if clinic gallery is loaded
    const clinicGallery = await page.locator('app-clinic-gallery').first();
    await expect(clinicGallery).toBeVisible({ timeout: 10000 });
    console.log('✓ Clinic Gallery loaded');

    // Check if testimonial section is loaded
    const testimonialSection = await page.locator('app-testimonial-section').first();
    await expect(testimonialSection).toBeVisible({ timeout: 10000 });
    console.log('✓ Testimonial Section loaded');
  });

  test('should load hero content correctly', async ({ page }) => {
    // Check hero title
    const heroTitle = await page.locator('.hero-title').first();
    await expect(heroTitle).toBeVisible({ timeout: 10000 });
    const titleText = await heroTitle.textContent();
    console.log('Hero Title:', titleText);
    expect(titleText).toBeTruthy();

    // Check hero subtitle
    const heroSubtitle = await page.locator('.hero-subtitle').first();
    await expect(heroSubtitle).toBeVisible({ timeout: 10000 });
    const subtitleText = await heroSubtitle.textContent();
    console.log('Hero Subtitle:', subtitleText);
    expect(subtitleText).toBeTruthy();
  });

  test('should not show translation keys', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check page content for translation keys
    const pageContent = await page.content();

    // Check for common translation key patterns
    const translationKeyPatterns = [
      'CLINIC.GALLERY_TITLE',
      'CLINIC.GALLERY_SUBTITLE',
      'HOME.',
      'HERO.',
      'APPROACH.',
      'SERVICES.'
    ];

    for (const pattern of translationKeyPatterns) {
      const hasTranslationKey = pageContent.includes(pattern);
      if (hasTranslationKey) {
        console.log(`⚠ Found translation key: ${pattern}`);
        // Take screenshot for debugging
        await page.screenshot({
          path: `tests/e2e/screenshots/translation-key-${pattern.replace(/\./g, '-')}.png`,
          fullPage: true
        });
      }
      expect(hasTranslationKey).toBe(false);
    }
  });

  test('should load gallery images', async ({ page }) => {
    // Scroll to gallery section
    await page.locator('app-clinic-gallery').scrollIntoViewIfNeeded();

    // Wait for gallery images
    const galleryImages = page.locator('.gallery-image');
    await expect(galleryImages.first()).toBeVisible({ timeout: 10000 });

    const imageCount = await galleryImages.count();
    console.log(`Found ${imageCount} gallery images`);
    expect(imageCount).toBeGreaterThan(0);
  });

  test('should check for console errors', async ({ page }) => {
    const errors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('Console Error:', msg.text());
      }
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check if there are any critical errors
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('Google Maps') &&
      !error.includes('Failed to load resource')
    );

    if (criticalErrors.length > 0) {
      console.log('Critical Errors Found:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });
});