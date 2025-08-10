/**
 * Global test setup
 * Runs once before all tests
 */

export default async function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_APP_ENV = 'test'
  
  // Set default locale for tests
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE = 'tr'
  
  console.log('🚀 Global test setup completed')
}