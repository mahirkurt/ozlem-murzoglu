const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Debugging hero layout issues...\n');

  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForLoadState('networkidle');

  // Wait a bit for Angular to render
  await page.waitForTimeout(2000);

  // Check what's on the page
  const pageContent = await page.evaluate(() => {
    const appLiquid = document.querySelector('app-liquid-hero');
    const liquidSection = document.querySelector('section.liquid-hero');
    const heroContent = document.querySelector('.hero-content');
    return {
      hasAppLiquid: !!appLiquid,
      hasLiquidSection: !!liquidSection,
      hasHeroContent: !!heroContent,
      bodyHTML: document.body.innerHTML.substring(0, 500)
    };
  });

  console.log('Page content check:', pageContent);

  // Get computed styles for each element
  const debugInfo = await page.evaluate(() => {
    const liquid = document.querySelector('.liquid-hero');
    const content = document.querySelector('.hero-content');
    const container = document.querySelector('.md3-container');
    const wrapper = document.querySelector('.content-wrapper');

    const getInfo = (el, name) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);

      return {
        name: name,
        tagName: el.tagName,
        classes: el.className,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          left: rect.left,
          right: rect.right
        },
        styles: {
          position: computed.position,
          display: computed.display,
          width: computed.width,
          maxWidth: computed.maxWidth,
          margin: computed.margin,
          marginLeft: computed.marginLeft,
          marginRight: computed.marginRight,
          padding: computed.padding,
          paddingLeft: computed.paddingLeft,
          paddingRight: computed.paddingRight,
          left: computed.left,
          right: computed.right,
          transform: computed.transform,
          flexDirection: computed.flexDirection,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent
        },
        // Calculate actual margins
        actualMargins: {
          left: parseFloat(computed.marginLeft) || 0,
          right: parseFloat(computed.marginRight) || 0
        }
      };
    };

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      elements: [
        getInfo(liquid, 'liquid-hero'),
        getInfo(content, 'hero-content'),
        getInfo(container, 'md3-container'),
        getInfo(wrapper, 'content-wrapper')
      ]
    };
  });

  console.log('Viewport:', debugInfo.viewport);
  console.log('\n--- Element Analysis ---\n');

  debugInfo.elements.forEach(el => {
    if (el) {
      console.log(`\n${el.name} (${el.tagName}):`);
      console.log(`  Position: x=${el.rect.x}, width=${el.rect.width}`);
      console.log(`  Computed width: ${el.styles.width}, max-width: ${el.styles.maxWidth}`);
      console.log(`  Margins: ${el.styles.margin} (L: ${el.actualMargins.left}px, R: ${el.actualMargins.right}px)`);
      console.log(`  Position type: ${el.styles.position}`);
      console.log(`  Display: ${el.styles.display}`);

      // Calculate centering
      const viewportCenter = debugInfo.viewport.width / 2;
      const elementCenter = el.rect.x + (el.rect.width / 2);
      const offset = elementCenter - viewportCenter;
      console.log(`  Center offset: ${offset}px ${offset > 0 ? '(RIGHT)' : offset < 0 ? '(LEFT)' : '(CENTERED)'}`);
    }
  });

  // Check parent-child relationship
  console.log('\n--- Layout Issue Analysis ---\n');

  const heroContent = debugInfo.elements.find(el => el?.name === 'hero-content');
  const container = debugInfo.elements.find(el => el?.name === 'md3-container');

  if (heroContent && container) {
    console.log('hero-content width:', heroContent.rect.width);
    console.log('md3-container width:', container.rect.width);
    console.log('Difference:', heroContent.rect.width - container.rect.width);

    if (Math.abs(heroContent.rect.width - container.rect.width) < 1) {
      console.log('⚠️  Container is same width as hero-content!');
      console.log('   This means hero-content is not properly centering its child.');
    }
  }

  // Check CSS rules
  console.log('\n--- Applied CSS Rules ---\n');

  const cssRules = await page.evaluate(() => {
    const content = document.querySelector('.hero-content');
    if (!content) return null;

    // Get all stylesheets
    const sheets = Array.from(document.styleSheets);
    const rules = [];

    sheets.forEach(sheet => {
      try {
        const sheetRules = Array.from(sheet.cssRules || sheet.rules || []);
        sheetRules.forEach(rule => {
          if (rule.selectorText && content.matches(rule.selectorText)) {
            rules.push({
              selector: rule.selectorText,
              styles: rule.style.cssText
            });
          }
        });
      } catch (e) {
        // Cross-origin stylesheets will throw
      }
    });

    return rules;
  });

  if (cssRules && cssRules.length > 0) {
    console.log('CSS rules applied to .hero-content:');
    cssRules.forEach(rule => {
      console.log(`  ${rule.selector}: ${rule.styles.substring(0, 100)}...`);
    });
  }

  await page.screenshot({ path: 'hero-debug.png', fullPage: false });
  console.log('\n📸 Screenshot saved as hero-debug.png');

  await browser.close();
})();