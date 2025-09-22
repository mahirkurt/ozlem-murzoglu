const { test, expect } = require('@playwright/test');

test.describe('Complete Translation Check', () => {
  test('find all placeholder translations on dr page', async ({ page }) => {
    // Navigate to the page
    await page.goto('https://ozlemmurzoglu.com/hakkimizda/dr-ozlem-murzoglu');

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Get all visible text content
    const allTexts = await page.evaluate(() => {
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
          const parent = node.parentElement;
          if (parent && parent.offsetParent !== null) {
            texts.push(text);
          }
        }
      }
      return texts;
    });

    // Find all placeholder translations
    const placeholderTexts = allTexts.filter(text => {
      return text.startsWith('[EN]') || text.startsWith('[TR]');
    });

    // Find translation keys
    const translationKeys = allTexts.filter(text => {
      return text.match(/^(ABOUT|HEADER|SERVICES|APPROACH|COMMON|CONTACT|FOOTER|DOCTOR_BIO)\.([A-Z_\.]+)$/);
    });

    console.log('\n=== PLACEHOLDER TRANSLATIONS ===');
    if (placeholderTexts.length > 0) {
      console.log('Found', placeholderTexts.length, 'placeholder texts:');
      [...new Set(placeholderTexts)].forEach(text => {
        console.log('  •', text);
      });
    }

    console.log('\n=== TRANSLATION KEYS ===');
    if (translationKeys.length > 0) {
      console.log('Found', translationKeys.length, 'translation keys:');
      [...new Set(translationKeys)].forEach(key => {
        console.log('  •', key);
      });
    }

    // Check for mixed language content (Turkish text on English page)
    console.log('\n=== MIXED LANGUAGE CONTENT ===');
    const turkishTexts = allTexts.filter(text => {
      // Look for common Turkish text patterns
      return text.includes('2007\'de "Hasta odaya') ||
             text.includes('Artık kanıta dayalı') ||
             text.includes('Eşim, kızım, annem');
    });

    if (turkishTexts.length > 0) {
      console.log('Found Turkish text on page:');
      turkishTexts.forEach(text => {
        console.log('  •', text.substring(0, 100) + '...');
      });
    }

    // Assert no issues found
    expect(placeholderTexts.length).toBe(0);
    expect(translationKeys.length).toBe(0);
  });
});