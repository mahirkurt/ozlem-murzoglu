const { test, expect } = require('@playwright/test');

test.describe('Live Site Translation Check', () => {
  test('check for translation keys on live about page', async ({ page }) => {
    // Navigate to the live site
    await page.goto('https://ozlemmurzoglu.com/hakkimizda');

    // Wait for content to load
    await page.waitForTimeout(5000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/live-about-page.png', fullPage: true });

    // Get all visible text content
    const visibleTexts = await page.evaluate(() => {
      const texts = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text && text.length > 0) {
          // Check if parent is visible
          const parent = node.parentElement;
          if (parent && parent.offsetParent !== null) {
            texts.push(text);
          }
        }
      }
      return texts;
    });

    console.log('Sample of visible texts:');
    visibleTexts.slice(0, 50).forEach(text => {
      if (text.includes('.') && text.match(/^[A-Z]/)) {
        console.log('  - ' + text);
      }
    });

    // Find texts that look like translation keys
    const translationKeys = visibleTexts.filter(text => {
      // Check for patterns like ABOUT.XXX, HEADER.XXX, etc.
      return text.match(/^(ABOUT|HEADER|SERVICES|APPROACH|COMMON|CONTACT|FOOTER)\.[A-Z_\.]+$/);
    });

    if (translationKeys.length > 0) {
      console.log('\n❌ Found untranslated keys:');
      const uniqueKeys = [...new Set(translationKeys)];
      uniqueKeys.forEach(key => {
        console.log('  - ' + key);
      });
    } else {
      console.log('\n✅ No translation keys found - all texts are properly translated');
    }

    // Check specific elements that commonly have issues
    const checkElements = [
      { selector: '.exp-period', description: 'Experience periods' },
      { selector: '.institution', description: 'Institution names' },
      { selector: '.company', description: 'Company names' },
      { selector: '.location', description: 'Locations' },
      { selector: '.cert-content h4', description: 'Certificate titles' },
      { selector: '.value-card h3', description: 'Approach titles' }
    ];

    for (const check of checkElements) {
      const elements = await page.locator(check.selector).all();
      if (elements.length > 0) {
        console.log(`\nChecking ${check.description}:`);
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.match(/^(ABOUT|HEADER|SERVICES|APPROACH|COMMON)\./)) {
            console.log(`  ❌ Untranslated: ${text}`);
          }
        }
      }
    }

    // Final assertion
    expect(translationKeys.length).toBe(0);
  });
});