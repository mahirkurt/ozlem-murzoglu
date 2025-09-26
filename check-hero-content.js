const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Checking hero content positioning...\n');

  await page.goto('https://dr-murzoglu.web.app');
  await page.waitForLoadState('networkidle');

  // Check liquid hero section
  const heroSection = await page.$('.liquid-hero');
  if (heroSection) {
    const heroBox = await heroSection.boundingBox();
    console.log('Hero Section:', heroBox);

    const heroStyles = await heroSection.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        width: computed.width,
        height: computed.height,
        margin: computed.margin,
        padding: computed.padding
      };
    });
    console.log('Hero Section styles:', heroStyles);
  }

  // Check hero content
  console.log('\n🔍 Checking hero-content...');
  const heroContent = await page.$('.hero-content');
  if (heroContent) {
    const contentBox = await heroContent.boundingBox();
    console.log('Hero Content box:', contentBox);

    const contentStyles = await heroContent.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        top: computed.top,
        left: computed.left,
        right: computed.right,
        transform: computed.transform,
        width: computed.width,
        padding: computed.padding,
        display: computed.display,
        alignItems: computed.alignItems,
        justifyContent: computed.justifyContent
      };
    });
    console.log('Hero Content styles:', contentStyles);
  }

  // Check md3-container
  console.log('\n🔍 Checking md3-container...');
  const container = await page.$('.md3-container');
  if (container) {
    const containerBox = await container.boundingBox();
    console.log('Container box:', containerBox);

    const containerStyles = await container.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: computed.width,
        maxWidth: computed.maxWidth,
        margin: computed.margin,
        padding: computed.padding,
        actualWidth: rect.width,
        x: rect.x,
        parentWidth: el.parentElement.getBoundingClientRect().width
      };
    });
    console.log('Container styles:', containerStyles);
  }

  // Check content-wrapper
  console.log('\n🔍 Checking content-wrapper...');
  const wrapper = await page.$('.content-wrapper');
  if (wrapper) {
    const wrapperBox = await wrapper.boundingBox();
    console.log('Wrapper box:', wrapperBox);

    const wrapperStyles = await wrapper.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        flexDirection: computed.flexDirection,
        alignItems: computed.alignItems,
        justifyContent: computed.justifyContent,
        textAlign: computed.textAlign,
        width: computed.width,
        gap: computed.gap
      };
    });
    console.log('Wrapper styles:', wrapperStyles);
  }

  // Check hero title position
  console.log('\n🔍 Checking hero-title position...');
  const heroTitle = await page.$('.hero-title');
  if (heroTitle) {
    const titleBox = await heroTitle.boundingBox();
    console.log('Hero Title box:', titleBox);

    const titleText = await heroTitle.textContent();
    console.log('Hero Title text:', titleText);

    // Calculate center position
    const viewportSize = page.viewportSize();
    const centerX = viewportSize.width / 2;
    const titleCenterX = titleBox.x + (titleBox.width / 2);
    const offset = titleCenterX - centerX;

    console.log('\n📏 Positioning Analysis:');
    console.log(`Viewport width: ${viewportSize.width}`);
    console.log(`Viewport center: ${centerX}`);
    console.log(`Title center: ${titleCenterX}`);
    console.log(`Offset from center: ${offset}px ${offset > 0 ? '(shifted right)' : offset < 0 ? '(shifted left)' : '(centered)'}`);
  }

  // Take screenshot
  await page.screenshot({ path: 'hero-content-check.png', fullPage: false });
  console.log('\n📸 Screenshot saved as hero-content-check.png');

  await browser.close();
})();