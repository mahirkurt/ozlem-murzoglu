/**
 * Playwright Global Teardown
 * Runs once after all tests
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  // Perform cleanup tasks here
  // For example: clean up test data, close external services, etc.

  console.log('✅ Global teardown completed');
}

export default globalTeardown;