/**
 * Strapi Webhook Configuration
 * Firebase Functions ile cache temizleme için webhook kurulumu
 */

const axios = require('axios');
const crypto = require('crypto');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const FIREBASE_FUNCTIONS_URL = process.env.FIREBASE_FUNCTIONS_URL || 'https://europe-west1-dr-murzoglu.cloudfunctions.net';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || crypto.randomBytes(32).toString('hex');

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Create webhook in Strapi
 */
async function createWebhook() {
  try {
    const webhookConfig = {
      name: 'Firebase Functions Cache Clear',
      url: `${FIREBASE_FUNCTIONS_URL}/strapiWebhook`,
      headers: {
        'x-strapi-signature': WEBHOOK_SECRET
      },
      events: [
        'entry.create',
        'entry.update',
        'entry.delete',
        'entry.publish',
        'entry.unpublish',
        'media.create',
        'media.update',
        'media.delete'
      ],
      enabled: true
    };

    // Note: Webhook creation usually requires admin panel access
    // This is a template for manual configuration
    console.log('Webhook Configuration:');
    console.log('=======================');
    console.log(`Name: ${webhookConfig.name}`);
    console.log(`URL: ${webhookConfig.url}`);
    console.log(`Secret Header: x-strapi-signature = ${WEBHOOK_SECRET}`);
    console.log(`Events: ${webhookConfig.events.join(', ')}`);
    console.log('=======================');
    
    console.log('\nTo set up the webhook:');
    console.log('1. Go to Strapi Admin Panel > Settings > Webhooks');
    console.log('2. Click "Create new webhook"');
    console.log('3. Enter the configuration above');
    console.log('4. Save the webhook');
    
    console.log('\nFirebase Functions Configuration:');
    console.log('Run this command to set the webhook secret:');
    console.log(`firebase functions:config:set strapi.webhook_secret="${WEBHOOK_SECRET}"`);
    
    return WEBHOOK_SECRET;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
}

/**
 * Test webhook
 */
async function testWebhook() {
  try {
    console.log('\nTesting webhook...');
    
    const testPayload = {
      event: 'entry.update',
      model: 'resource',
      entry: {
        id: 1,
        resourceKey: 'TEST_RESOURCE',
        categoryKey: 'test'
      }
    };
    
    const response = await axios.post(
      `${FIREBASE_FUNCTIONS_URL}/strapiWebhook`,
      testPayload,
      {
        headers: {
          'x-strapi-signature': WEBHOOK_SECRET
        }
      }
    );
    
    console.log('Webhook test response:', response.data);
    return true;
  } catch (error) {
    console.error('Webhook test failed:', error.message);
    return false;
  }
}

/**
 * Main setup function
 */
async function setupWebhook() {
  try {
    console.log('Setting up Strapi webhook...\n');
    
    const secret = await createWebhook();
    
    console.log('\n=================================');
    console.log('Webhook setup completed!');
    console.log(`Webhook Secret: ${secret}`);
    console.log('=================================');
    
    // Optional: Test the webhook
    const testResult = await testWebhook();
    if (testResult) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('⚠️ Webhook test failed. Please check your configuration.');
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupWebhook();
}

module.exports = { setupWebhook, testWebhook };