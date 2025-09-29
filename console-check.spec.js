const { test } = require('@playwright/test');

test('Check console errors and network', async ({ page }) => {
  // Listen to console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Listen to network requests
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('i18n') || request.url().includes('.json')) {
      networkRequests.push({
        url: request.url(),
        method: request.method()
      });
    }
  });

  // Listen to network responses
  const networkResponses = [];
  page.on('response', response => {
    if (response.url().includes('i18n') || response.url().includes('.json')) {
      networkResponses.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  // Navigate to page
  await page.goto('http://localhost:4201');
  await page.waitForTimeout(3000);

  // Print console messages
  console.log('\n=== Console Messages ===');
  consoleMessages.forEach(msg => {
    if (msg.type === 'error' || msg.type === 'warning') {
      console.log(`${msg.type.toUpperCase()}: ${msg.text}`);
    }
  });

  // Print network requests
  console.log('\n=== i18n Network Requests ===');
  networkRequests.forEach(req => {
    console.log(`${req.method}: ${req.url}`);
  });

  // Print network responses
  console.log('\n=== i18n Network Responses ===');
  networkResponses.forEach(res => {
    console.log(`${res.status}: ${res.url}`);
  });

  // Check localStorage
  const lang = await page.evaluate(() => localStorage.getItem('selectedLanguage'));
  console.log('\n=== LocalStorage Language ===');
  console.log('Selected language:', lang);

  // Check if TranslateService is working
  const translateCheck = await page.evaluate(() => {
    const translateService = window.ng?.getComponent(document.querySelector('app-root'))?.translate;
    if (translateService) {
      return {
        currentLang: translateService.currentLang,
        defaultLang: translateService.defaultLang,
        langs: translateService.langs
      };
    }
    return null;
  });

  console.log('\n=== TranslateService Status ===');
  console.log(translateCheck);

  // Get sample text from page
  const headerText = await page.locator('header').textContent();
  console.log('\n=== Header Text Sample ===');
  console.log(headerText.substring(0, 200));
});