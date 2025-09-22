const { test, expect } = require('@playwright/test');

test.describe('Dr. Özlem Murzoğlu Page Translation Check', () => {
  test('check for translation keys on dr-ozlem-murzoglu page', async ({ page }) => {
    // Navigate to the dr-ozlem-murzoglu page
    await page.goto('https://ozlemmurzoglu.com/hakkimizda/dr-ozlem-murzoglu');

    // Wait for content to load
    await page.waitForTimeout(5000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/dr-page.png', fullPage: true });

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
    visibleTexts.slice(0, 100).forEach(text => {
      if (text.length > 2 && text.length < 200) {
        console.log('  - ' + text);
      }
    });

    // Find texts that look like translation keys
    const translationKeys = visibleTexts.filter(text => {
      // Check for patterns like ABOUT.XXX, HEADER.XXX, etc.
      return text.match(/^(ABOUT|HEADER|SERVICES|APPROACH|COMMON|CONTACT|FOOTER|DOCTOR_BIO)\.([A-Z_\.]+)$/);
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
      { selector: '.hero-title', description: 'Hero title' },
      { selector: '.hero-subtitle', description: 'Hero subtitle' },
      { selector: '.section-title', description: 'Section titles' },
      { selector: '.bio-text', description: 'Biography text' },
      { selector: '.education-item h4', description: 'Education titles' },
      { selector: '.experience-item h4', description: 'Experience titles' },
      { selector: '.cert-item h4', description: 'Certificate titles' },
      { selector: '.specialty-item', description: 'Specialty items' },
      { selector: '.timeline-item', description: 'Timeline items' },
      { selector: '.institution', description: 'Institution names' },
      { selector: '.location', description: 'Location names' },
      { selector: '.date', description: 'Date fields' }
    ];

    console.log('\nChecking specific elements:');
    for (const check of checkElements) {
      const elements = await page.locator(check.selector).all();
      if (elements.length > 0) {
        console.log(`\n${check.description} (${elements.length} found):`);
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.match(/^(ABOUT|DOCTOR_BIO|COMMON)\./)) {
            console.log(`  ❌ Untranslated: ${text}`);
          } else if (text) {
            // Show first few to verify content
            const index = elements.indexOf(element);
            if (index < 3) {
              console.log(`  ✓ ${text.substring(0, 100)}`);
            }
          }
        }
      }
    }

    // Final assertion
    expect(translationKeys.length).toBe(0);
  });
});