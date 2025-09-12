#!/usr/bin/env node

/**
 * Script to find and remove unused translation keys
 * Run with: node scripts/clean-unused-translations.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Paths
const translationFiles = {
  tr: path.join(__dirname, '../src/assets/i18n/tr.json'),
  en: path.join(__dirname, '../src/assets/i18n/en.json')
};

const srcPath = path.join(__dirname, '../src');

// Read all TypeScript and HTML files
function getAllSourceFiles() {
  // Use forward slashes for glob patterns even on Windows
  const tsPattern = path.join(srcPath, '**/*.ts').replace(/\\/g, '/');
  const htmlPattern = path.join(srcPath, '**/*.html').replace(/\\/g, '/');
  
  const tsFiles = glob.sync(tsPattern, { ignore: ['**/node_modules/**'] });
  const htmlFiles = glob.sync(htmlPattern, { ignore: ['**/node_modules/**'] });
  console.log(`Looking for files in: ${srcPath}`);
  console.log(`Found ${tsFiles.length} TypeScript files and ${htmlFiles.length} HTML files`);
  return [...tsFiles, ...htmlFiles];
}

// Extract translation keys from source files
function extractUsedKeys(files) {
  const usedKeys = new Set();
  
  const patterns = [
    // TypeScript patterns
    /translate\.instant\(['"`]([^'"`]+)['"`]/g,
    /translate\.get\(['"`]([^'"`]+)['"`]/g,
    /translate\.stream\(['"`]([^'"`]+)['"`]/g,
    // HTML pipe pattern
    /\|\s*translate\s*:\s*{[^}]*}|'([^']+)'\s*\|\s*translate|"([^"]+)"\s*\|\s*translate/g,
    // Direct key references in HTML
    /\[placeholder\]="'([^']+)'\s*\|\s*translate"/g,
    /\[title\]="'([^']+)'\s*\|\s*translate"/g,
    /\[label\]="'([^']+)'\s*\|\s*translate"/g
  ];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        // Get the captured group (key)
        const key = match[1] || match[2] || match[3];
        if (key) {
          usedKeys.add(key);
          // Also add parent keys (e.g., for 'HEADER.NAV_HOME', add 'HEADER')
          const parts = key.split('.');
          for (let i = 1; i < parts.length; i++) {
            usedKeys.add(parts.slice(0, i).join('.'));
          }
        }
      }
    });
  });
  
  return usedKeys;
}

// Get all keys from translation file
function getAllTranslationKeys(obj, prefix = '') {
  const keys = new Set();
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.add(fullKey);
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const nestedKeys = getAllTranslationKeys(obj[key], fullKey);
      nestedKeys.forEach(k => keys.add(k));
    }
  }
  
  return keys;
}

// Remove unused keys from translation object
function removeUnusedKeys(obj, usedKeys, prefix = '') {
  const cleaned = {};
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    // Check if this key or any of its children are used
    const isUsed = Array.from(usedKeys).some(usedKey => 
      usedKey === fullKey || usedKey.startsWith(fullKey + '.')
    );
    
    if (isUsed) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        cleaned[key] = removeUnusedKeys(obj[key], usedKeys, fullKey);
        // Remove empty objects
        if (Object.keys(cleaned[key]).length === 0) {
          delete cleaned[key];
        }
      } else {
        cleaned[key] = obj[key];
      }
    }
  }
  
  return cleaned;
}

// Main function
function cleanTranslations(dryRun = true) {
  console.log('🔍 Analyzing translation usage...\n');
  
  // Get all source files
  const sourceFiles = getAllSourceFiles();
  console.log(`Found ${sourceFiles.length} source files`);
  
  // Extract used keys
  const usedKeys = extractUsedKeys(sourceFiles);
  console.log(`Found ${usedKeys.size} used translation keys\n`);
  
  // Process each translation file
  Object.entries(translationFiles).forEach(([lang, filePath]) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Translation file not found: ${filePath}`);
      return;
    }
    
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const allKeys = getAllTranslationKeys(translations);
    
    // Find unused keys
    const unusedKeys = Array.from(allKeys).filter(key => !usedKeys.has(key));
    
    console.log(`\n📊 ${lang.toUpperCase()} Translation File:`);
    console.log(`   Total keys: ${allKeys.size}`);
    console.log(`   Used keys: ${Array.from(allKeys).filter(key => usedKeys.has(key)).length}`);
    console.log(`   Unused keys: ${unusedKeys.length}`);
    
    if (unusedKeys.length > 0) {
      console.log(`\n   Sample unused keys (first 10):`);
      unusedKeys.slice(0, 10).forEach(key => console.log(`     - ${key}`));
      
      if (!dryRun) {
        // Create backup
        const backupPath = filePath.replace('.json', '.backup.json');
        fs.writeFileSync(backupPath, JSON.stringify(translations, null, 2));
        console.log(`\n   ✅ Backup created: ${backupPath}`);
        
        // Clean translations
        const cleanedTranslations = removeUnusedKeys(translations, usedKeys);
        
        // Save cleaned translations
        fs.writeFileSync(filePath, JSON.stringify(cleanedTranslations, null, 2));
        console.log(`   ✅ Cleaned translation file saved`);
        
        // Report file size reduction
        const originalSize = fs.statSync(backupPath).size;
        const newSize = fs.statSync(filePath).size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`   📉 File size reduced by ${reduction}% (${originalSize} → ${newSize} bytes)`);
      }
    }
  });
  
  if (dryRun) {
    console.log('\n⚠️  This was a dry run. To actually clean the files, run:');
    console.log('   node scripts/clean-unused-translations.js --clean\n');
  } else {
    console.log('\n✅ Translation files cleaned successfully!');
    console.log('   Backup files created with .backup.json extension\n');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--clean');

// Check if glob is installed
try {
  require.resolve('glob');
} catch (e) {
  console.error('❌ glob package is required. Install it with: npm install --save-dev glob');
  process.exit(1);
}

// Run the cleaning process
cleanTranslations(dryRun);