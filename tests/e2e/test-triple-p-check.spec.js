const { test, expect } = require('@playwright/test');

test.describe('Triple P Page Verification', () => {
  test('Check all issues on Triple P page', async ({ page }) => {
    await page.goto('https://dr-murzoglu.web.app/hizmetlerimiz/triple-p');
    await page.waitForTimeout(3000);

    console.log('\n=== LOGO CHECK ===');
    // Check for logo
    const logoSelectors = [
      'img[src*="Triple_P"]',
      'img[alt*="Triple P"]',
      '.triple-p-logo',
      '.logo-container img'
    ];

    for (const selector of logoSelectors) {
      const logo = page.locator(selector);
      const count = await logo.count();
      if (count > 0) {
        const src = await logo.first().getAttribute('src');
        const isVisible = await logo.first().isVisible();
        console.log(`Found logo with selector "${selector}": src="${src}", visible=${isVisible}`);

        // Check if image loads
        const imgStatus = await logo.first().evaluate((img) => {
          return {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            loaded: img.naturalWidth > 0
          };
        });
        console.log('Image status:', imgStatus);
      }
    }

    console.log('\n=== TRANSLATION TAGS CHECK ===');
    // Check for [TR] or [EN] tags
    const bodyText = await page.locator('body').innerText();
    const trTags = bodyText.match(/\[TR\]/g) || [];
    const enTags = bodyText.match(/\[EN\]/g) || [];
    console.log(`Found ${trTags.length} [TR] tags`);
    console.log(`Found ${enTags.length} [EN] tags`);

    if (trTags.length > 0 || enTags.length > 0) {
      // Find specific elements with tags
      const elements = await page.locator('*:has-text("[TR]"), *:has-text("[EN]")').all();
      for (const el of elements.slice(0, 5)) {
        const text = await el.textContent();
        if (text && (text.includes('[TR]') || text.includes('[EN]'))) {
          console.log('Tag found in:', text.substring(0, 100));
        }
      }
    }

    console.log('\n=== SECTION PADDING CHECK ===');
    // Check padding for all major sections
    const sections = [
      { selector: '.program-intro-section', name: 'Program Intro (Pozitif Ebeveynlik)' },
      { selector: '.philosophy-section', name: 'Philosophy' },
      { selector: '.five-principles-section', name: 'Five Principles' },
      { selector: '.benefits-section', name: 'Benefits' },
      { selector: '.structure-section', name: 'Structure' },
      { selector: '.levels-section', name: 'Levels' },
      { selector: '.group-section', name: 'Group' },
      { selector: '.validation-section', name: 'Validation' }
    ];

    for (const { selector, name } of sections) {
      const section = page.locator(selector).first();
      const exists = await section.count() > 0;

      if (exists) {
        const styles = await section.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom
          };
        });
        console.log(`${name}: L=${styles.paddingLeft} R=${styles.paddingRight} T=${styles.paddingTop} B=${styles.paddingBottom}`);
      } else {
        console.log(`${name}: NOT FOUND`);
      }
    }

    console.log('\n=== SPECIFIC TEXT CHECK ===');
    // Check for specific text
    const textsToCheck = [
      'Kanıta Dayalı Program',
      'Pozitif Ebeveynlik Programı',
      'Bilimin Işığında Ebeveynlik'
    ];

    for (const text of textsToCheck) {
      const element = page.locator(`text="${text}"`);
      const exists = await element.count() > 0;
      console.log(`"${text}": ${exists ? 'FOUND' : 'NOT FOUND'}`);

      if (exists) {
        // Check parent section padding
        const parent = await element.first().evaluateHandle(el => {
          let current = el;
          while (current && !current.classList.contains('section')) {
            current = current.parentElement;
            if (current && current.tagName === 'SECTION') break;
          }
          return current;
        });

        if (parent) {
          const padding = await parent.evaluate(el => {
            if (el) {
              const computed = window.getComputedStyle(el);
              return {
                class: el.className,
                paddingLeft: computed.paddingLeft,
                paddingRight: computed.paddingRight
              };
            }
            return null;
          });
          if (padding) {
            console.log(`  Parent section: ${padding.class}, padding: L=${padding.paddingLeft} R=${padding.paddingRight}`);
          }
        }
      }
    }

    console.log('\n=== SCREENSHOT ===');
    await page.screenshot({ path: 'triple-p-live-check.png', fullPage: true });
    console.log('Screenshot saved: triple-p-live-check.png');
  });
});