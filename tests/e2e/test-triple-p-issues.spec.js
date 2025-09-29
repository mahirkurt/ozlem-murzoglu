const { test, expect } = require('@playwright/test');

test.describe('Triple P Page Issues Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(2000);
  });

  test('Check Triple P logo visibility', async ({ page }) => {
    const logo = page.locator('img[src*="Triple_P.svg"]');
    const logoExists = await logo.count() > 0;
    console.log('Logo exists:', logoExists);

    if (logoExists) {
      const isVisible = await logo.isVisible();
      console.log('Logo visible:', isVisible);

      const src = await logo.getAttribute('src');
      console.log('Logo src:', src);

      // Check if image loads
      const imgStatus = await logo.evaluate((img) => {
        return {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          src: img.src
        };
      });
      console.log('Image status:', imgStatus);
    }
  });

  test('Compare padding with laboratory page', async ({ page }) => {
    // Check Triple P page sections
    const sections = await page.locator('section').all();
    console.log('\n=== Triple P Page Sections ===');

    for (const section of sections) {
      const className = await section.getAttribute('class');
      if (className && !className.includes('hero')) {
        const styles = await section.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            padding: computed.padding,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom
          };
        });
        console.log(`Section ${className}:`, styles);
      }
    }

    // Compare with laboratory page
    await page.goto('http://localhost:4202/hizmetlerimiz/laboratuvar-goruntuleme');
    await page.waitForTimeout(1000);

    console.log('\n=== Laboratory Page Sections ===');
    const labSections = await page.locator('section').all();

    for (const section of labSections) {
      const className = await section.getAttribute('class');
      if (className && !className.includes('hero')) {
        const styles = await section.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            padding: computed.padding,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight
          };
        });
        console.log(`Section ${className}:`, styles);
      }
    }
  });

  test('Check section titles and icons', async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(1000);

    const sectionTitles = await page.locator('.section-title').all();
    console.log('\n=== Section Titles ===');

    for (const title of sectionTitles) {
      const text = await title.textContent();
      const styles = await title.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          textAlign: computed.textAlign,
          margin: computed.margin,
          fontSize: computed.fontSize
        };
      });

      // Check for icon siblings
      const parent = await title.evaluateHandle(el => el.parentElement);
      const hasIcon = await parent.evaluate(el => {
        const icons = el.querySelectorAll('i, .fa, .fas, .far, .section-icon, .title-icon');
        return icons.length > 0;
      });

      console.log(`Title: "${text?.substring(0, 30)}..."`, {
        styles,
        hasIcon
      });
    }
  });

  test('Check for Font Awesome icons', async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(1000);

    // Check for Font Awesome icons
    const faIcons = await page.locator('i[class*="fa"], .fas, .far, .fab').all();
    console.log('\n=== Font Awesome Icons Found ===');
    console.log('Count:', faIcons.length);

    for (const icon of faIcons) {
      const className = await icon.getAttribute('class');
      const parent = await icon.evaluateHandle(el => el.parentElement);
      const parentClass = await parent.evaluate(el => el.className);
      console.log(`Icon: ${className} in parent: ${parentClass}`);
    }

    // Check for SVG icons
    const svgIcons = await page.locator('svg').all();
    console.log('\n=== SVG Icons Found ===');
    console.log('Count:', svgIcons.length);
  });

  test('Check Program Structure section', async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(1000);

    const structureSection = page.locator('.structure-section');
    const exists = await structureSection.count() > 0;
    console.log('\n=== Program Structure Section ===');
    console.log('Exists:', exists);

    if (exists) {
      const grid = page.locator('.structure-grid');
      const gridExists = await grid.count() > 0;
      console.log('Grid exists:', gridExists);

      if (gridExists) {
        const items = await grid.locator('.structure-item').all();
        console.log('Structure items count:', items.length);

        const gridStyles = await grid.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            display: computed.display,
            gridTemplateColumns: computed.gridTemplateColumns,
            gap: computed.gap
          };
        });
        console.log('Grid styles:', gridStyles);
      }
    }
  });

  test('Check Program Levels section', async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(1000);

    const levelsSection = page.locator('.levels-section');
    const exists = await levelsSection.count() > 0;
    console.log('\n=== Program Levels Section ===');
    console.log('Exists:', exists);

    if (exists) {
      const container = page.locator('.levels-container');
      const containerExists = await container.count() > 0;
      console.log('Container exists:', containerExists);

      if (containerExists) {
        const cards = await container.locator('.level-card').all();
        console.log('Level cards count:', cards.length);

        const containerStyles = await container.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            display: computed.display,
            gridTemplateColumns: computed.gridTemplateColumns,
            gap: computed.gap
          };
        });
        console.log('Container styles:', containerStyles);
      }
    }
  });

  test('Check translations', async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(1000);

    // Look for [TR] or [EN] placeholders
    const bodyText = await page.locator('body').innerText();
    const placeholders = bodyText.match(/\[TR\]|\[EN\]/g) || [];

    console.log('\n=== Translation Placeholders ===');
    console.log('Found placeholders:', placeholders.length);

    if (placeholders.length > 0) {
      // Find specific elements with placeholders
      const elements = await page.locator('*:has-text("[TR]"), *:has-text("[EN]")').all();
      for (const el of elements.slice(0, 10)) { // First 10 for brevity
        const text = await el.textContent();
        if (text && (text.includes('[TR]') || text.includes('[EN]'))) {
          console.log('Placeholder in:', text.substring(0, 100));
        }
      }
    }
  });

  test('Visual comparison of sections', async ({ page }) => {
    await page.goto('http://localhost:4202/hizmetlerimiz/triple-p');
    await page.waitForTimeout(2000);

    // Take screenshot of full page
    await page.screenshot({
      path: 'triple-p-full-page.png',
      fullPage: true
    });

    console.log('\n=== Screenshot saved as triple-p-full-page.png ===');

    // Check specific sections
    const sections = [
      '.program-intro-section',
      '.philosophy-section',
      '.five-principles-section',
      '.benefits-section',
      '.structure-section',
      '.levels-section',
      '.group-section',
      '.validation-section'
    ];

    for (const selector of sections) {
      const section = page.locator(selector);
      const exists = await section.count() > 0;
      if (exists) {
        const box = await section.boundingBox();
        console.log(`${selector}:`, box ? `${box.width}x${box.height}` : 'not visible');
      } else {
        console.log(`${selector}: NOT FOUND`);
      }
    }
  });
});