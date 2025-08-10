/**
 * Homepage E2E Tests
 * Tests the main homepage functionality and user interactions
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Dr\. Özlem Murzoğlu/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('displays hero section', async ({ page }) => {
    // Check hero elements
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Dr. Özlem Murzoğlu');
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Çocuk Doktoru');
    await expect(page.locator('[data-testid="hero-cta"]')).toBeVisible();
  });

  test('displays services section', async ({ page }) => {
    await expect(page.locator('[data-testid="services-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="services-title"]')).toContainText('Hizmetlerimiz');
    
    // Check service cards
    const serviceCards = page.locator('[data-testid="service-card"]');
    await expect(serviceCards).toHaveCount(3);
    
    // Verify each service has expected elements
    await expect(serviceCards.first()).toContainText('Genel Muayene');
  });

  test('displays values section', async ({ page }) => {
    await expect(page.locator('[data-testid="values-section"]')).toBeVisible();
    
    // Check values cards
    const valueCards = page.locator('[data-testid="value-card"]');
    await expect(valueCards.count()).toBeGreaterThan(0);
  });

  test('header navigation works', async ({ page }) => {
    // Test navigation menu
    const nav = page.locator('[data-testid="main-navigation"]');
    await expect(nav).toBeVisible();
    
    // Test navigation links
    await expect(page.locator('[data-testid="nav-home"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-services"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-about"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-contact"]')).toBeVisible();
  });

  test('footer is displayed', async ({ page }) => {
    await expect(page.locator('[data-testid="main-footer"]')).toBeVisible();
    await expect(page.locator('[data-testid="footer-contact-info"]')).toBeVisible();
  });

  test('CTA button scrolls to contact section', async ({ page }) => {
    const ctaButton = page.locator('[data-testid="hero-cta"]');
    await ctaButton.click();
    
    // Check if page scrolled to contact section
    const contactSection = page.locator('[data-testid="contact-section"]');
    await expect(contactSection).toBeInViewport();
  });

  test('contact form is functional', async ({ page }) => {
    // Navigate to contact form
    const contactForm = page.locator('[data-testid="contact-form"]');
    await expect(contactForm).toBeVisible();
    
    // Fill out the form
    await page.fill('[data-testid="contact-name"]', 'Test User');
    await page.fill('[data-testid="contact-email"]', 'test@example.com');
    await page.fill('[data-testid="contact-phone"]', '+90 555 123 4567');
    await page.fill('[data-testid="contact-message"]', 'This is a test message.');
    
    // Submit form (mock the submission)
    await page.click('[data-testid="contact-submit"]');
    
    // Check for success message (this would depend on implementation)
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible({ timeout: 10000 });
  });

  test('mobile navigation works', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');
    
    // Test mobile menu toggle
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuToggle).toBeVisible();
    
    await menuToggle.click();
    
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
    
    // Test navigation links in mobile menu
    await page.click('[data-testid="mobile-nav-services"]');
    await expect(page.locator('[data-testid="services-section"]')).toBeInViewport();
  });

  test('social media links are present', async ({ page }) => {
    const footer = page.locator('[data-testid="main-footer"]');
    await expect(footer.locator('[data-testid="social-links"]')).toBeVisible();
    
    // Check for social media icons/links
    await expect(footer.locator('[aria-label="Facebook"]')).toBeVisible();
    await expect(footer.locator('[aria-label="Instagram"]')).toBeVisible();
    await expect(footer.locator('[aria-label="LinkedIn"]')).toBeVisible();
  });

  test('language switcher works', async ({ page }) => {
    // If language switcher exists
    const langSwitcher = page.locator('[data-testid="language-switcher"]');
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      const englishOption = page.locator('[data-testid="lang-en"]');
      await englishOption.click();
      
      // Verify language changed
      await expect(page.locator('h1')).toContainText('Dr. Özlem Murzoğlu');
      // Subtitle should change to English
      await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Pediatrician');
    }
  });

  test('images load correctly', async ({ page }) => {
    // Check hero image
    const heroImage = page.locator('[data-testid="hero-image"]');
    await expect(heroImage).toBeVisible();
    
    // Check that image has loaded (not broken)
    const imageSrc = await heroImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    
    // Test image accessibility
    await expect(heroImage).toHaveAttribute('alt');
  });

  test('performance metrics are acceptable', async ({ page }) => {
    // Navigate to page and wait for load
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Measure performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      };
    });
    
    // Assert performance thresholds
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // 5 seconds
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // 3 seconds
  });

  test('SEO meta tags are present', async ({ page }) => {
    // Check essential meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content');
    
    // Check canonical URL
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href');
  });

  test('schema.org structured data is present', async ({ page }) => {
    // Check for structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(1);
    
    // Verify structured data content
    const jsonLd = await structuredData.textContent();
    expect(jsonLd).toContain('MedicalOrganization');
    expect(jsonLd).toContain('Dr. Özlem Murzoğlu');
  });

  test.describe('Accessibility', () => {
    test('meets WCAG standards', async ({ page }) => {
      await injectAxe(page);
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: true }
      });
    });

    test('keyboard navigation works', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      // Continue tabbing through focusable elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await expect(page.locator(':focus')).toBeVisible();
      }
    });

    test('skip links work', async ({ page }) => {
      // Test skip to main content link
      await page.keyboard.press('Tab');
      const skipLink = page.locator('[data-testid="skip-to-main"]');
      
      if (await skipLink.isVisible()) {
        await skipLink.click();
        const mainContent = page.locator('main');
        await expect(mainContent).toBeFocused();
      }
    });

    test('has proper heading hierarchy', async ({ page }) => {
      // Check that there's only one h1
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCount(1);
      
      // Check heading hierarchy (h2s should follow h1, h3s should follow h2s, etc.)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      let currentLevel = 0;
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const level = parseInt(tagName.substring(1));
        
        if (currentLevel === 0) {
          expect(level).toBe(1); // First heading should be h1
        } else {
          expect(level).toBeLessThanOrEqual(currentLevel + 1); // No skipping levels
        }
        
        currentLevel = level;
      }
    });

    test('images have alt text', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('forms have proper labels', async ({ page }) => {
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');
        
        // Skip hidden inputs
        if (type === 'hidden') continue;
        
        // Check for label association
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        
        // Input should have either a label, aria-label, or aria-labelledby
        const hasLabel = id && await page.locator(`label[for="${id}"]`).count() > 0;
        const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby;
        
        expect(hasAccessibleName).toBe(true);
      }
    });

    test('focus indicators are visible', async ({ page }) => {
      // Test that focus indicators are visible on focusable elements
      const focusableElements = page.locator(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      const count = await focusableElements.count();
      if (count > 0) {
        await focusableElements.first().focus();
        
        // Check if focus outline is visible (this might need customization based on CSS)
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });
  });

  test.describe('Visual Regression', () => {
    test('visual - homepage desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(page).toHaveScreenshot('homepage-desktop.png');
    });

    test('visual - homepage mobile', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Mobile-specific test');
      await expect(page).toHaveScreenshot('homepage-mobile.png');
    });

    test('visual - homepage tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page).toHaveScreenshot('homepage-tablet.png');
    });

    test('visual - dark mode', async ({ page }) => {
      // Enable dark mode if supported
      await page.emulateMedia({ colorScheme: 'dark' });
      await expect(page).toHaveScreenshot('homepage-dark.png');
    });

    test('visual - high contrast mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' });
      await expect(page).toHaveScreenshot('homepage-high-contrast.png');
    });
  });
});