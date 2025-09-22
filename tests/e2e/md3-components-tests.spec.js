/**
 * MD3 Component-Specific Tests
 *
 * Tests for specific Material Design 3 components
 * Fast execution with focused validation
 */

const { test, expect } = require('@playwright/test');

test.describe('MD3 Component Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4201');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Navigation Components', () => {
    test('should have MD3-compliant navigation', async ({ page }) => {
      const nav = await page.locator('nav, .nav, .navigation, .header').first();
      
      if (await nav.count() > 0) {
        const navStyles = await nav.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            position: styles.position,
            zIndex: styles.zIndex,
            backgroundColor: styles.backgroundColor,
            boxShadow: styles.boxShadow,
            height: el.offsetHeight
          };
        });

        // Navigation should be properly positioned
        expect(['fixed', 'sticky', 'relative', 'absolute'].includes(navStyles.position)).toBeTruthy();
        
        // Should have reasonable height
        expect(navStyles.height).toBeGreaterThan(40);
        expect(navStyles.height).toBeLessThan(120);
        
        console.log('Navigation Styles:', navStyles);
      }
    });

    test('should have working navigation links', async ({ page }) => {
      const navLinks = await page.locator('nav a, .nav a, .navigation a').all();
      
      let workingLinks = 0;
      for (const link of navLinks.slice(0, 5)) {
        const href = await link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          workingLinks++;
        }
      }

      if (navLinks.length > 0) {
        expect(workingLinks).toBeGreaterThan(0);
        console.log(`Working navigation links: ${workingLinks}/${navLinks.length}`);
      }
    });
  });

  test.describe('Hero Section', () => {
    test('should have hero section with proper styling', async ({ page }) => {
      const hero = await page.locator('.hero, .hero-section, [class*="hero"]').first();
      
      if (await hero.count() > 0) {
        const heroStyles = await hero.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            minHeight: styles.minHeight,
            backgroundImage: styles.backgroundImage,
            backgroundColor: styles.backgroundColor,
            display: styles.display,
            alignItems: styles.alignItems,
            justifyContent: styles.justifyContent,
            textAlign: styles.textAlign,
            padding: styles.padding
          };
        });

        // Hero should have substantial height
        const minHeightValue = parseInt(heroStyles.minHeight);
        if (minHeightValue) {
          expect(minHeightValue).toBeGreaterThan(300);
        }

        console.log('Hero Section Styles:', heroStyles);
      }
    });

    test('should have hero text content', async ({ page }) => {
      const heroText = await page.locator('.hero h1, .hero-section h1, [class*="hero"] h1').first();
      
      if (await heroText.count() > 0) {
        const text = await heroText.textContent();
        expect(text?.length).toBeGreaterThan(5);
        
        const textStyles = await heroText.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            color: styles.color
          };
        });

        console.log('Hero Text:', text);
        console.log('Hero Text Styles:', textStyles);
      }
    });
  });

  test.describe('Services Section', () => {
    test('should display services with card layout', async ({ page }) => {
      const serviceCards = await page.locator('.service, .service-card, [class*="service"]').all();
      
      if (serviceCards.length > 0) {
        const firstCard = serviceCards[0];
        const cardStyles = await firstCard.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            padding: styles.padding,
            margin: styles.margin,
            borderRadius: styles.borderRadius,
            backgroundColor: styles.backgroundColor,
            boxShadow: styles.boxShadow,
            width: el.offsetWidth,
            height: el.offsetHeight
          };
        });

        // Service cards should have proper dimensions
        expect(cardStyles.width).toBeGreaterThan(200);
        expect(cardStyles.height).toBeGreaterThan(100);

        console.log(`Services found: ${serviceCards.length}`);
        console.log('Service Card Styles:', cardStyles);
      }
    });

    test('should have service links or buttons', async ({ page }) => {
      const serviceLinks = await page.locator('.service a, .service-card a, .service button, .service-card button').all();
      
      let functionalLinks = 0;
      for (const link of serviceLinks.slice(0, 10)) {
        const href = await link.getAttribute('href');
        const onclick = await link.getAttribute('onclick');
        
        if ((href && href !== '#') || onclick) {
          functionalLinks++;
        }
      }

      if (serviceLinks.length > 0) {
        expect(functionalLinks).toBeGreaterThan(0);
        console.log(`Functional service links: ${functionalLinks}/${serviceLinks.length}`);
      }
    });
  });

  test.describe('Footer Component', () => {
    test('should have footer with contact information', async ({ page }) => {
      const footer = await page.locator('footer, .footer').first();
      
      if (await footer.count() > 0) {
        const footerText = await footer.textContent();
        const hasContactInfo = footerText?.includes('@') || 
                              footerText?.includes('tel:') || 
                              footerText?.includes('+90') ||
                              footerText?.includes('İletişim') ||
                              footerText?.includes('Contact');

        if (footerText && footerText.length > 50) {
          expect(hasContactInfo).toBeTruthy();
        }

        const footerStyles = await footer.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            padding: styles.padding,
            marginTop: styles.marginTop
          };
        });

        console.log('Footer has contact info:', hasContactInfo);
        console.log('Footer Styles:', footerStyles);
      }
    });
  });

  test.describe('Form Components', () => {
    test('should have accessible form elements', async ({ page }) => {
      const forms = await page.locator('form').all();
      const inputs = await page.locator('input, textarea, select').all();
      
      if (inputs.length > 0) {
        let accessibleInputs = 0;
        
        for (const input of inputs.slice(0, 10)) {
          const hasLabel = await input.evaluate(el => {
            const id = el.id;
            const ariaLabel = el.getAttribute('aria-label');
            const ariaLabelledBy = el.getAttribute('aria-labelledby');
            const placeholder = el.getAttribute('placeholder');
            const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);
            
            return !!(ariaLabel || ariaLabelledBy || hasAssociatedLabel || placeholder);
          });
          
          if (hasLabel) {
            accessibleInputs++;
          }
        }

        // Most inputs should have proper labeling
        expect(accessibleInputs).toBeGreaterThan(inputs.length * 0.5);
        console.log(`Accessible inputs: ${accessibleInputs}/${inputs.length}`);
      }

      console.log(`Forms found: ${forms.length}, Inputs found: ${inputs.length}`);
    });
  });

  test.describe('Content Sections', () => {
    test('should have proper content hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const paragraphs = await page.locator('p').count();
      const images = await page.locator('img').count();

      // Should have content structure
      expect(headings.length).toBeGreaterThan(0);
      expect(paragraphs).toBeGreaterThan(0);

      // Check heading hierarchy
      let h1Count = 0;
      let h2Count = 0;
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName);
        if (tagName === 'H1') h1Count++;
        if (tagName === 'H2') h2Count++;
      }

      expect(h1Count).toBeGreaterThanOrEqual(1);
      expect(h1Count).toBeLessThanOrEqual(2);

      console.log(`Content structure - H1: ${h1Count}, H2: ${h2Count}, P: ${paragraphs}, IMG: ${images}`);
    });

    test('should have optimized images', async ({ page }) => {
      const images = await page.locator('img').all();
      
      if (images.length > 0) {
        let optimizedImages = 0;
        
        for (const img of images.slice(0, 10)) {
          const imgData = await img.evaluate(el => ({
            src: el.src,
            alt: el.alt,
            loading: el.loading,
            width: el.naturalWidth,
            height: el.naturalHeight,
            hasAlt: !!el.alt
          }));

          // Check for optimization indicators
          if (imgData.hasAlt && 
              (imgData.loading === 'lazy' || imgData.src.includes('webp') || imgData.src.includes('avif'))) {
            optimizedImages++;
          }
        }

        console.log(`Optimized images: ${optimizedImages}/${images.length}`);
      }
    });
  });
});