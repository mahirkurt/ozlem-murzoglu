const { test, expect } = require('@playwright/test');

test.describe('Translation Check', () => {
  const baseUrl = 'http://localhost:4201';
  
  test('Check header translations', async ({ page }) => {
    console.log('Navigating to homepage...');
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded
    const title = await page.title();
    console.log('Page title:', title);
    
    // Take screenshot of header
    await page.screenshot({ path: 'header-tr.png', fullPage: false });
    
    // Check for Saygıyla menu item
    console.log('Looking for Saygıyla menu...');
    const saygiyla = await page.locator('nav >> text=Saygıyla').count();
    console.log('Found Saygıyla elements:', saygiyla);
    
    // Check all navigation items
    const navItems = await page.locator('nav a').allTextContents();
    console.log('Navigation items:', navItems);
    
    // Look for translation tags that are not processed
    const translationTags = await page.locator('text=/HEADER\\.|FOOTER\\.|ABOUT\\./').count();
    console.log('Unprocessed translation tags found:', translationTags);
    
    expect(translationTags).toBe(0);
  });

  test('Check footer translations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Take screenshot of footer
    await page.screenshot({ path: 'footer-tr.png', fullPage: false });
    
    // Check footer content
    const footerText = await page.locator('footer').textContent();
    console.log('Footer contains:', footerText?.substring(0, 200));
    
    // Check for unprocessed tags in footer
    const footerTags = await page.locator('footer >> text=/FOOTER\\./').count();
    console.log('Footer translation tags:', footerTags);
    
    expect(footerTags).toBe(0);
  });

  test('Check About page translations', async ({ page }) => {
    await page.goto(`${baseUrl}/hakkimizda`);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'about-page.png', fullPage: false });
    
    // Check for hardcoded text
    const pageContent = await page.content();
    
    // Check experience section
    const hasHardcodedDates = pageContent.includes('Ağu 2022') || 
                               pageContent.includes('Tem 2017') ||
                               pageContent.includes('Haz 2017');
    console.log('Has hardcoded dates:', hasHardcodedDates);
    
    // Check for translation tags
    const aboutTags = await page.locator('text=/ABOUT\\./').count();
    console.log('About page translation tags:', aboutTags);
    
    // Check specific elements
    const experienceSection = await page.locator('.experience-timeline').textContent();
    console.log('Experience section sample:', experienceSection?.substring(0, 200));
  });
});