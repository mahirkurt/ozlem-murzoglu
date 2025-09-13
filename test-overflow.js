
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });

    const overflow = await page.evaluate(() => {
      const body = document.body;
      if (body.scrollWidth > body.clientWidth) {
        // Find the element causing the overflow
        const findOverflowingElement = (element) => {
          if (element.scrollWidth > element.clientWidth) {
            const children = Array.from(element.children);
            for (const child of children) {
              const overflowingChild = findOverflowingElement(child);
              if (overflowingChild) {
                return overflowingChild;
              }
            }
            return element;
          }
          return null;
        };
        const overflowingElement = findOverflowingElement(body);
        if (overflowingElement) {
          return {
            hasOverflow: true,
            element: overflowingElement.tagName,
            id: overflowingElement.id,
            className: overflowingElement.className,
            scrollWidth: overflowingElement.scrollWidth,
            clientWidth: overflowingElement.clientWidth
          };
        }
      }
      return { hasOverflow: false };
    });

    if (overflow.hasOverflow) {
      console.log('Sayfa genişliğinde taşma tespit edildi!');
      console.log('Taşmaya neden olan element:');
      console.log(`  Tag: ${overflow.element}`);
      console.log(`  ID: ${overflow.id}`);
      console.log(`  Class: ${overflow.className}`);
      console.log(`  scrollWidth: ${overflow.scrollWidth}`);
      console.log(`  clientWidth: ${overflow.clientWidth}`);
    } else {
      console.log('Sayfa genişliğinde taşma tespit edilmedi.');
    }

  } catch (error) {
    console.error('Test sırasında bir hata oluştu:', error);
  } finally {
    await browser.close();
  }
})();
