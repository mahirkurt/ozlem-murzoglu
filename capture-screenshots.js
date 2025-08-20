const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  
  // Desktop screenshot
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1920, height: 1080 });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });
  await desktopPage.screenshot({ path: 'screenshot-desktop.png', fullPage: true });
  console.log('Desktop screenshot saved');
  
  // Mobile screenshot
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });
  await mobilePage.screenshot({ path: 'screenshot-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  // Get logo dimensions and all images on page
  const pageInfo = await desktopPage.evaluate(() => {
    const logos = document.querySelectorAll('.logo img, header img');
    const allImages = document.querySelectorAll('img');
    
    const logoInfo = [];
    logos.forEach(logo => {
      const rect = logo.getBoundingClientRect();
      logoInfo.push({
        src: logo.src,
        alt: logo.alt,
        width: rect.width,
        height: rect.height,
        naturalWidth: logo.naturalWidth,
        naturalHeight: logo.naturalHeight,
        className: logo.className
      });
    });
    
    const largeImages = [];
    allImages.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.width > 200 || rect.height > 200) {
        largeImages.push({
          src: img.src,
          alt: img.alt,
          width: rect.width,
          height: rect.height,
          className: img.className
        });
      }
    });
    
    return { logos: logoInfo, largeImages };
  });
  
  console.log('Page Info:', JSON.stringify(pageInfo, null, 2));
  
  await browser.close();
})();