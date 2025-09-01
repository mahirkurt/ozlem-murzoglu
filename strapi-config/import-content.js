/**
 * Strapi Content Import Script
 * Mevcut JSON içeriklerini Strapi'ye aktarır
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Strapi API configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Resource mapping
const RESOURCE_MAPPINGS = {
  // Vaccines
  'HPV_VACCINE': { categoryKey: 'vaccines', resourceKey: 'HPV_VACCINE' },
  'KKK_VACCINE': { categoryKey: 'vaccines', resourceKey: 'KKK_VACCINE' },
  'KKKS_VACCINE': { categoryKey: 'vaccines', resourceKey: 'KKKS_VACCINE' },
  'MENINGOKOK_ACWY_VACCINE': { categoryKey: 'vaccines', resourceKey: 'MENINGOKOK_ACWY_VACCINE' },
  'MENINGOKOK_B_VACCINE': { categoryKey: 'vaccines', resourceKey: 'MENINGOKOK_B_VACCINE' },
  'INFLUENZA_VACCINE': { categoryKey: 'vaccines', resourceKey: 'INFLUENZA_VACCINE' },
  'ROTAVIRUS_VACCINE': { categoryKey: 'vaccines', resourceKey: 'ROTAVIRUS_VACCINE' },
  
  // General Info
  'BREASTFEEDING_YOUR_BABY': { categoryKey: 'general', resourceKey: 'BREASTFEEDING_YOUR_BABY' },
  'SAFE_SLEEP_SIDS': { categoryKey: 'general', resourceKey: 'SAFE_SLEEP_SIDS' },
  'TOILET_TRAINING': { categoryKey: 'general', resourceKey: 'TOILET_TRAINING' },
  'WATER_SAFETY': { categoryKey: 'general', resourceKey: 'WATER_SAFETY' },
  'SCREEN_TIME': { categoryKey: 'general', resourceKey: 'SCREEN_TIME' },
  'NUTRITION_TIPS': { categoryKey: 'general', resourceKey: 'NUTRITION_TIPS' },
  
  // Development Guides
  'DEVELOPMENT_2_MONTHS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_2_MONTHS' },
  'DEVELOPMENT_4_MONTHS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_4_MONTHS' },
  'DEVELOPMENT_6_MONTHS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_6_MONTHS' },
  'DEVELOPMENT_9_MONTHS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_9_MONTHS' },
  'DEVELOPMENT_12_MONTHS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_12_MONTHS' },
  'DEVELOPMENT_2_MONTHS_NEW': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_2_MONTHS_NEW' },
  'DEVELOPMENT_4_MONTHS_NEW': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_4_MONTHS_NEW' },
  'DEVELOPMENT_6_MONTHS_NEW': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_6_MONTHS_NEW' },
  'DEVELOPMENT_4_YEARS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_4_YEARS' },
  'DEVELOPMENT_TIPS_ACTIVITIES_4_YEARS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_TIPS_ACTIVITIES_4_YEARS' },
  'DEVELOPMENT_SUGGESTIONS_1_YEAR': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_SUGGESTIONS_1_YEAR' },
  'DEVELOPMENT_SUGGESTIONS_4_YEARS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_SUGGESTIONS_4_YEARS' },
  'DEVELOPMENT_SUGGESTIONS_5_YEARS': { categoryKey: 'development', resourceKey: 'DEVELOPMENT_SUGGESTIONS_5_YEARS' },
  
  // Diseases
  'NEWBORN_JAUNDICE': { categoryKey: 'diseases', resourceKey: 'NEWBORN_JAUNDICE' },
  'RASHES': { categoryKey: 'diseases', resourceKey: 'RASHES' },
  'SINUSITIS': { categoryKey: 'diseases', resourceKey: 'SINUSITIS' },
  'MIDDLE_EAR_INFECTION': { categoryKey: 'diseases', resourceKey: 'MIDDLE_EAR_INFECTION' },
  'FEVER_IN_CHILDREN': { categoryKey: 'diseases', resourceKey: 'FEVER_IN_CHILDREN' },
  'ECZEMA_IN_CHILDREN': { categoryKey: 'diseases', resourceKey: 'ECZEMA_IN_CHILDREN' },
  'TONSILLITIS': { categoryKey: 'diseases', resourceKey: 'TONSILLITIS' },
  'ANTIBIOTICS': { categoryKey: 'diseases', resourceKey: 'ANTIBIOTICS' },
  'ASTHMA_ATTACK_PREVENTION': { categoryKey: 'diseases', resourceKey: 'ASTHMA_ATTACK_PREVENTION' }
};

/**
 * Load translations from JSON files
 */
async function loadTranslations() {
  const trPath = path.join(__dirname, '../src/assets/i18n/tr.json');
  const enPath = path.join(__dirname, '../src/assets/i18n/en.json');
  
  const trContent = await fs.readFile(trPath, 'utf8');
  const enContent = await fs.readFile(enPath, 'utf8');
  
  return {
    tr: JSON.parse(trContent),
    en: JSON.parse(enContent)
  };
}

/**
 * Extract resource content from translations
 */
function extractResourceContent(translations, locale, resourceKey, categoryKey) {
  const category = categoryKey.toUpperCase().replace(/-/g, '_');
  const resource = translations.RESOURCES?.[category]?.[resourceKey];
  
  if (!resource) {
    console.warn(`Resource not found: ${category}.${resourceKey} for locale ${locale}`);
    return null;
  }
  
  return {
    resourceKey,
    categoryKey,
    title: resource.title || '',
    description: resource.description || '',
    content: resource.content || '',
    contentType: resource.contentType || 'html',
    locale,
    metadata: resource.metadata || {},
    publishedAt: new Date().toISOString()
  };
}

/**
 * Create or update resource in Strapi
 */
async function upsertResource(resourceData) {
  try {
    // Check if resource exists
    const existingResponse = await api.get('/resources', {
      params: {
        filters: {
          resourceKey: { $eq: resourceData.resourceKey },
          categoryKey: { $eq: resourceData.categoryKey },
          locale: resourceData.locale
        }
      }
    });
    
    if (existingResponse.data.data && existingResponse.data.data.length > 0) {
      // Update existing resource
      const resourceId = existingResponse.data.data[0].id;
      const response = await api.put(`/resources/${resourceId}`, {
        data: resourceData
      });
      console.log(`Updated: ${resourceData.resourceKey} (${resourceData.locale})`);
      return response.data;
    } else {
      // Create new resource
      const response = await api.post('/resources', {
        data: resourceData
      });
      console.log(`Created: ${resourceData.resourceKey} (${resourceData.locale})`);
      return response.data;
    }
  } catch (error) {
    console.error(`Error upserting resource ${resourceData.resourceKey}:`, error.message);
    throw error;
  }
}

/**
 * Main import function
 */
async function importContent() {
  try {
    console.log('Loading translations...');
    const translations = await loadTranslations();
    
    console.log('Starting content import...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const [resourceKey, mapping] of Object.entries(RESOURCE_MAPPINGS)) {
      console.log(`\nProcessing ${resourceKey}...`);
      
      // Import Turkish version
      const trContent = extractResourceContent(
        translations.tr,
        'tr',
        resourceKey,
        mapping.categoryKey
      );
      
      if (trContent) {
        try {
          await upsertResource(trContent);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      
      // Import English version
      const enContent = extractResourceContent(
        translations.en,
        'en',
        resourceKey,
        mapping.categoryKey
      );
      
      if (enContent) {
        try {
          await upsertResource(enContent);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n=================================');
    console.log(`Import completed!`);
    console.log(`Success: ${successCount} resources`);
    console.log(`Errors: ${errorCount} resources`);
    console.log('=================================');
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run import if called directly
if (require.main === module) {
  if (!STRAPI_API_TOKEN) {
    console.error('Error: STRAPI_API_TOKEN environment variable is required');
    console.log('Usage: STRAPI_API_TOKEN=your-token node import-content.js');
    process.exit(1);
  }
  
  importContent();
}

module.exports = { importContent };