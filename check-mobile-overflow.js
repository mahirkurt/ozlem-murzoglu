// Check what's causing mobile overflow
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });
  const page = await context.newPage();
  
  console.log('📱 Mobile overflow analysis...\n');
  
  await page.goto('http://localhost:4200', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  await page.waitForTimeout(2000);
  
  // Find elements causing overflow
  const overflowElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overflowing = [];
    const viewportWidth = window.innerWidth;
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > viewportWidth || rect.left < 0) {
        const styles = window.getComputedStyle(el);
        overflowing.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          width: rect.width,
          left: rect.left,
          right: rect.right,
          position: styles.position,
          display: styles.display,
          overflow: styles.overflow,
          maxWidth: styles.maxWidth,
          margin: styles.margin,
          padding: styles.padding,
          text: el.innerText?.substring(0, 50)
        });
      }
    });
    
    return overflowing;
  });
  
  console.log('Elements causing overflow:');
  overflowElements.forEach(el => {
    console.log(`\n${el.tag}${el.id ? '#' + el.id : ''}${el.class ? '.' + el.class.split(' ').join('.') : ''}`);
    console.log(`  Width: ${el.width}px`);
    console.log(`  Left: ${el.left}px, Right: ${el.right}px`);
    console.log(`  Position: ${el.position}`);
    console.log(`  Max-width: ${el.maxWidth}`);
    console.log(`  Text: "${el.text}..."`);
  });
  
  // Check body and html overflow
  const bodyOverflow = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return {
      bodyWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      htmlWidth: html.scrollWidth,
      htmlClientWidth: html.clientWidth,
      viewportWidth: window.innerWidth,
      hasHorizontalScroll: body.scrollWidth > window.innerWidth || html.scrollWidth > window.innerWidth
    };
  });
  
  console.log('\n📊 Overflow metrics:');
  console.log(`  Body width: ${bodyOverflow.bodyWidth}px`);
  console.log(`  Body client width: ${bodyOverflow.bodyClientWidth}px`);
  console.log(`  HTML width: ${bodyOverflow.htmlWidth}px`);
  console.log(`  Viewport width: ${bodyOverflow.viewportWidth}px`);
  console.log(`  Has horizontal scroll: ${bodyOverflow.hasHorizontalScroll ? '❌ YES' : '✅ NO'}`);
  
  await browser.close();
})();