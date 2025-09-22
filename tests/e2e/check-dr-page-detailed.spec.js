const { test, expect } = require('@playwright/test');

test.describe('Detailed DR Page Translation Check', () => {
  test('capture all visible text on dr page', async ({ page }) => {
    // Navigate to the page
    await page.goto('https://ozlemmurzoglu.com/hakkimizda/dr-ozlem-murzoglu');

    // Wait for content to load
    await page.waitForTimeout(5000);

    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'tests/screenshots/dr-page-current.png', fullPage: true });

    // Get all visible text content with more detail
    const pageContent = await page.evaluate(() => {
      const result = {
        title: document.title,
        headings: [],
        paragraphs: [],
        lists: [],
        buttons: [],
        links: [],
        allTexts: []
      };

      // Get all headings
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        if (heading.offsetParent !== null) {
          const text = heading.innerText?.trim();
          if (text) {
            result.headings.push({
              level: heading.tagName,
              text: text
            });
          }
        }
      });

      // Get all paragraphs
      document.querySelectorAll('p').forEach(p => {
        if (p.offsetParent !== null) {
          const text = p.innerText?.trim();
          if (text && text.length > 0) {
            result.paragraphs.push(text);
          }
        }
      });

      // Get all list items
      document.querySelectorAll('li').forEach(li => {
        if (li.offsetParent !== null) {
          const text = li.innerText?.trim();
          if (text && text.length > 0) {
            result.lists.push(text);
          }
        }
      });

      // Get all buttons
      document.querySelectorAll('button, [role="button"]').forEach(btn => {
        if (btn.offsetParent !== null) {
          const text = btn.innerText?.trim();
          if (text && text.length > 0) {
            result.buttons.push(text);
          }
        }
      });

      // Get all links
      document.querySelectorAll('a').forEach(link => {
        if (link.offsetParent !== null) {
          const text = link.innerText?.trim();
          if (text && text.length > 0) {
            result.links.push(text);
          }
        }
      });

      // Get all text nodes
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
            result.allTexts.push(text);
          }
        }
      }

      return result;
    });

    console.log('\n=== PAGE TITLE ===');
    console.log(pageContent.title);

    console.log('\n=== HEADINGS ===');
    pageContent.headings.forEach(h => {
      console.log(`${h.level}: ${h.text}`);
    });

    console.log('\n=== UNTRANSLATED OR PLACEHOLDER TEXT ===');
    const allContent = [
      ...pageContent.headings.map(h => h.text),
      ...pageContent.paragraphs,
      ...pageContent.lists,
      ...pageContent.buttons,
      ...pageContent.links
    ];

    const issues = allContent.filter(text => {
      return text.startsWith('[EN]') ||
             text.startsWith('[TR]') ||
             text.includes('[EN]') ||
             text.includes('[TR]');
    });

    if (issues.length > 0) {
      console.log('Found issues:');
      issues.forEach(text => {
        console.log('  •', text);
      });
    } else {
      console.log('No placeholder text found');
    }

    console.log('\n=== SAMPLE PARAGRAPHS (first 5) ===');
    pageContent.paragraphs.slice(0, 5).forEach(p => {
      console.log('  •', p.substring(0, 100) + (p.length > 100 ? '...' : ''));
    });

    console.log('\n=== BUTTONS ===');
    pageContent.buttons.forEach(btn => {
      console.log('  •', btn);
    });

    // Check for any text containing "EN]" pattern
    console.log('\n=== CHECKING FOR ANY [EN] PATTERN ===');
    const enPattern = pageContent.allTexts.filter(text => text.includes('EN]'));
    if (enPattern.length > 0) {
      console.log('Found [EN] patterns:');
      enPattern.forEach(text => {
        console.log('  •', text);
      });
    } else {
      console.log('No [EN] patterns found');
    }

    // No assertions for detailed inspection
  });
});