/**
 * Playwright Global Setup
 * Runs once before all tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Playwright tests...');

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the development server to be ready
    console.log('⏳ Waiting for development server...');
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 60000 });
    
    console.log('✅ Development server is ready');

    // Perform any global setup tasks here
    // For example: seed test data, authenticate users, etc.
    
    // Health check
    const title = await page.title();
    if (!title) {
      throw new Error('Application failed to load properly');
    }
    
    console.log(`📄 Application loaded: ${title}`);

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;