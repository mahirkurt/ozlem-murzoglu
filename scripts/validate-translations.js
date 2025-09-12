#!/usr/bin/env node

/**
 * Translation Validation Script for CI/CD
 * Checks for missing translation keys between languages
 * Run with: node scripts/validate-translations.js
 */

const fs = require('fs');
const path = require('path');

// Translation file paths
const translationFiles = {
  tr: path.join(__dirname, '../src/assets/i18n/tr.json'),
  en: path.join(__dirname, '../src/assets/i18n/en.json')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Get all keys from an object recursively
function getAllKeys(obj, prefix = '') {
  const keys = new Set();
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.add(fullKey);
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const nestedKeys = getAllKeys(obj[key], fullKey);
      nestedKeys.forEach(k => keys.add(k));
    }
  }
  
  return keys;
}

// Compare translation files
function compareTranslations() {
  console.log(`${colors.blue}🔍 Translation Validation Started${colors.reset}\n`);
  
  const translations = {};
  const allKeys = {};
  let hasErrors = false;
  
  // Load translation files
  for (const [lang, filePath] of Object.entries(translationFiles)) {
    if (!fs.existsSync(filePath)) {
      console.error(`${colors.red}❌ Translation file not found: ${filePath}${colors.reset}`);
      return false;
    }
    
    try {
      translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allKeys[lang] = getAllKeys(translations[lang]);
      console.log(`${colors.green}✓${colors.reset} Loaded ${lang.toUpperCase()}: ${allKeys[lang].size} keys`);
    } catch (error) {
      console.error(`${colors.red}❌ Error parsing ${lang}.json: ${error.message}${colors.reset}`);
      return false;
    }
  }
  
  console.log('');
  
  // Find missing keys in each language
  const languages = Object.keys(translations);
  
  for (let i = 0; i < languages.length; i++) {
    for (let j = 0; j < languages.length; j++) {
      if (i !== j) {
        const lang1 = languages[i];
        const lang2 = languages[j];
        const missing = Array.from(allKeys[lang1]).filter(key => !allKeys[lang2].has(key));
        
        if (missing.length > 0) {
          hasErrors = true;
          console.log(`${colors.yellow}⚠️  Keys in ${lang1.toUpperCase()} missing in ${lang2.toUpperCase()}: ${missing.length}${colors.reset}`);
          
          // Show first 10 missing keys
          const samplesToShow = Math.min(10, missing.length);
          for (let k = 0; k < samplesToShow; k++) {
            console.log(`   ${colors.magenta}- ${missing[k]}${colors.reset}`);
          }
          
          if (missing.length > samplesToShow) {
            console.log(`   ${colors.blue}... and ${missing.length - samplesToShow} more${colors.reset}`);
          }
          console.log('');
        }
      }
    }
  }
  
  // Check for empty translations (keys with empty string values)
  console.log(`${colors.blue}Checking for empty translations...${colors.reset}\n`);
  
  for (const [lang, translation] of Object.entries(translations)) {
    const emptyKeys = findEmptyValues(translation);
    
    if (emptyKeys.length > 0) {
      hasErrors = true;
      console.log(`${colors.yellow}⚠️  Empty values in ${lang.toUpperCase()}: ${emptyKeys.length}${colors.reset}`);
      
      const samplesToShow = Math.min(5, emptyKeys.length);
      for (let i = 0; i < samplesToShow; i++) {
        console.log(`   ${colors.magenta}- ${emptyKeys[i]}${colors.reset}`);
      }
      
      if (emptyKeys.length > samplesToShow) {
        console.log(`   ${colors.blue}... and ${emptyKeys.length - samplesToShow} more${colors.reset}`);
      }
      console.log('');
    }
  }
  
  return !hasErrors;
}

// Find keys with empty string values
function findEmptyValues(obj, prefix = '') {
  const emptyKeys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'string' && obj[key].trim() === '') {
      emptyKeys.push(fullKey);
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      emptyKeys.push(...findEmptyValues(obj[key], fullKey));
    }
  }
  
  return emptyKeys;
}

// Generate report
function generateReport() {
  const translations = {};
  const allKeys = {};
  
  // Load all translations
  for (const [lang, filePath] of Object.entries(translationFiles)) {
    if (fs.existsSync(filePath)) {
      translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allKeys[lang] = getAllKeys(translations[lang]);
    }
  }
  
  // Create report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    missingKeys: {},
    emptyValues: {}
  };
  
  // Add summary
  for (const lang in allKeys) {
    report.summary[lang] = {
      totalKeys: allKeys[lang].size,
      fileSize: fs.statSync(translationFiles[lang]).size
    };
  }
  
  // Find missing keys
  const languages = Object.keys(translations);
  for (let i = 0; i < languages.length; i++) {
    for (let j = 0; j < languages.length; j++) {
      if (i !== j) {
        const lang1 = languages[i];
        const lang2 = languages[j];
        const missing = Array.from(allKeys[lang1]).filter(key => !allKeys[lang2].has(key));
        
        if (missing.length > 0) {
          if (!report.missingKeys[lang2]) {
            report.missingKeys[lang2] = {};
          }
          report.missingKeys[lang2][`missingFrom_${lang1}`] = missing;
        }
      }
    }
  }
  
  // Find empty values
  for (const [lang, translation] of Object.entries(translations)) {
    const emptyKeys = findEmptyValues(translation);
    if (emptyKeys.length > 0) {
      report.emptyValues[lang] = emptyKeys;
    }
  }
  
  // Save report
  const reportPath = path.join(__dirname, '../translation-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`${colors.green}📊 Report saved to: ${reportPath}${colors.reset}`);
}

// Main execution
console.log(`${colors.blue}═══════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}     Translation Validation Tool${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════════${colors.reset}\n`);

const isValid = compareTranslations();

if (isValid) {
  console.log(`${colors.green}✅ All translations are valid!${colors.reset}\n`);
} else {
  console.log(`${colors.red}❌ Translation validation failed!${colors.reset}`);
  console.log(`${colors.yellow}Please fix the issues above before committing.${colors.reset}\n`);
}

// Generate report
generateReport();

// Exit with appropriate code for CI/CD
process.exit(isValid ? 0 : 1);