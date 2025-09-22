#!/usr/bin/env node

/**
 * i18n Auto-Sync System
 * Automatically detects and syncs translation keys across the codebase
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  componentsPath: 'src/app',
  translationPath: 'src/assets/i18n',
  languages: ['tr', 'en'],
  defaultLanguage: 'tr',
  patterns: {
    // Pattern to find translation keys in HTML files
    html: [
      /\{\{\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]\s*\|\s*translate\s*\}\}/g,
      /\[title\]="'([A-Z_]+(?:\.[A-Z_]+)+)'"/g,
      /\[subtitle\]="'([A-Z_]+(?:\.[A-Z_]+)+)'"/g,
      /title="([A-Z_]+(?:\.[A-Z_]+)+)"/g,
      /subtitle="([A-Z_]+(?:\.[A-Z_]+)+)"/g,
      /\[label\]="'([A-Z_]+(?:\.[A-Z_]+)+)'"/g,
      /label:\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]/g,
      /labelKey:\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]/g
    ],
    // Pattern to find translation keys in TypeScript files
    ts: [
      /translate\.instant\(['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]\)/g,
      /translate\.get\(['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]\)/g,
      /label:\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]/g,
      /labelKey:\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]/g,
      /title:\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]/g,
      /subtitle:\s*['"]([A-Z_]+(?:\.[A-Z_]+)+)['"]/g
    ]
  }
};

// Color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
const log = {
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.bright}${COLORS.cyan}${msg}${COLORS.reset}\n${'='.repeat(50)}`)
};

class I18nAutoSync {
  constructor() {
    this.usedKeys = new Set();
    this.existingTranslations = {};
    this.missingKeys = new Map();
    this.unusedKeys = new Set();
    this.fileKeyMap = new Map();
  }

  /**
   * Main execution function
   */
  async run() {
    log.header('i18n Auto-Sync System');

    // Step 1: Load existing translations
    log.info('Loading existing translations...');
    this.loadExistingTranslations();

    // Step 2: Scan codebase for translation keys
    log.info('Scanning codebase for translation keys...');
    this.scanCodebase();

    // Step 3: Analyze differences
    log.info('Analyzing translation differences...');
    this.analyzeDifferences();

    // Step 4: Generate report
    this.generateReport();

    // Step 5: Update translation files if needed
    if (this.missingKeys.size > 0) {
      log.info('Updating translation files...');
      await this.updateTranslationFiles();
    }

    // Step 6: Create validation file
    this.createValidationFile();

    log.header('Process Complete');
  }

  /**
   * Load existing translation files
   */
  loadExistingTranslations() {
    CONFIG.languages.forEach(lang => {
      const filePath = path.join(CONFIG.translationPath, `${lang}.json`);
      if (fs.existsSync(filePath)) {
        this.existingTranslations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        log.success(`Loaded ${lang}.json`);
      } else {
        log.warning(`Translation file ${lang}.json not found`);
        this.existingTranslations[lang] = {};
      }
    });
  }

  /**
   * Scan codebase for translation keys
   */
  scanCodebase() {
    // Scan HTML files
    const htmlFiles = glob.sync(`${CONFIG.componentsPath}/**/*.html`);
    htmlFiles.forEach(file => this.scanFile(file, 'html'));

    // Scan TypeScript files
    const tsFiles = glob.sync(`${CONFIG.componentsPath}/**/*.ts`);
    tsFiles.forEach(file => this.scanFile(file, 'ts'));

    log.success(`Scanned ${htmlFiles.length} HTML and ${tsFiles.length} TypeScript files`);
    log.info(`Found ${this.usedKeys.size} unique translation keys`);
  }

  /**
   * Scan a single file for translation keys
   */
  scanFile(filePath, type) {
    const content = fs.readFileSync(filePath, 'utf8');
    const patterns = CONFIG.patterns[type] || [];
    const fileKeys = new Set();

    patterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern);
      while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (key && this.isValidTranslationKey(key)) {
          this.usedKeys.add(key);
          fileKeys.add(key);
        }
      }
    });

    if (fileKeys.size > 0) {
      this.fileKeyMap.set(filePath, Array.from(fileKeys));
    }
  }

  /**
   * Check if a string is a valid translation key
   */
  isValidTranslationKey(key) {
    // Must contain at least one dot and uppercase letters/underscores
    return /^[A-Z_]+(\.[A-Z_]+)+$/.test(key);
  }

  /**
   * Analyze differences between used keys and existing translations
   */
  analyzeDifferences() {
    // Check for missing keys
    this.usedKeys.forEach(key => {
      CONFIG.languages.forEach(lang => {
        if (!this.getNestedProperty(this.existingTranslations[lang], key)) {
          if (!this.missingKeys.has(key)) {
            this.missingKeys.set(key, new Set());
          }
          this.missingKeys.get(key).add(lang);
        }
      });
    });

    // Check for unused keys (keys in translations but not in code)
    const checkUnusedKeys = (obj, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          checkUnusedKeys(obj[key], fullKey);
        } else {
          if (!this.usedKeys.has(fullKey)) {
            this.unusedKeys.add(fullKey);
          }
        }
      });
    };

    Object.keys(this.existingTranslations).forEach(lang => {
      checkUnusedKeys(this.existingTranslations[lang]);
    });
  }

  /**
   * Generate report of findings
   */
  generateReport() {
    log.header('Translation Analysis Report');

    // Report missing keys
    if (this.missingKeys.size > 0) {
      log.error(`Found ${this.missingKeys.size} missing translation keys:`);
      this.missingKeys.forEach((langs, key) => {
        const langsStr = Array.from(langs).join(', ');
        console.log(`  ${COLORS.red}•${COLORS.reset} ${key} ${COLORS.yellow}(missing in: ${langsStr})${COLORS.reset}`);

        // Show which files use this key
        this.fileKeyMap.forEach((keys, file) => {
          if (keys.includes(key)) {
            console.log(`    ${COLORS.cyan}↳${COLORS.reset} ${path.relative(process.cwd(), file)}`);
          }
        });
      });
    } else {
      log.success('No missing translation keys found!');
    }

    // Report unused keys
    if (this.unusedKeys.size > 0) {
      log.warning(`\nFound ${this.unusedKeys.size} unused translation keys:`);
      this.unusedKeys.forEach(key => {
        console.log(`  ${COLORS.yellow}•${COLORS.reset} ${key}`);
      });
    }

    // Statistics
    console.log(`\n${COLORS.bright}Statistics:${COLORS.reset}`);
    console.log(`  Total keys in use: ${this.usedKeys.size}`);
    console.log(`  Missing keys: ${this.missingKeys.size}`);
    console.log(`  Unused keys: ${this.unusedKeys.size}`);
    console.log(`  Files scanned: ${this.fileKeyMap.size}`);
  }

  /**
   * Update translation files with missing keys
   */
  async updateTranslationFiles() {
    const updates = {};

    // Prepare updates for each language
    CONFIG.languages.forEach(lang => {
      updates[lang] = { ...this.existingTranslations[lang] };
    });

    // Add missing keys with placeholder values
    this.missingKeys.forEach((langs, key) => {
      langs.forEach(lang => {
        const value = this.generatePlaceholderValue(key, lang);
        this.setNestedProperty(updates[lang], key, value);
      });
    });

    // Write updated files
    CONFIG.languages.forEach(lang => {
      const filePath = path.join(CONFIG.translationPath, `${lang}.json`);
      const content = JSON.stringify(updates[lang], null, 2);
      fs.writeFileSync(filePath, content, 'utf8');
      log.success(`Updated ${lang}.json`);
    });
  }

  /**
   * Generate placeholder value for missing translation
   */
  generatePlaceholderValue(key, lang) {
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];

    // Convert key to human-readable format
    const humanized = lastPart
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());

    if (lang === 'tr') {
      return `[TR] ${humanized}`;
    } else if (lang === 'en') {
      return `[EN] ${humanized}`;
    }

    return `[${lang.toUpperCase()}] ${humanized}`;
  }

  /**
   * Create validation file for CI/CD
   */
  createValidationFile() {
    const validationData = {
      timestamp: new Date().toISOString(),
      statistics: {
        totalKeys: this.usedKeys.size,
        missingKeys: this.missingKeys.size,
        unusedKeys: this.unusedKeys.size,
        filesScanned: this.fileKeyMap.size
      },
      missingKeys: Array.from(this.missingKeys.entries()).map(([key, langs]) => ({
        key,
        missingIn: Array.from(langs)
      })),
      unusedKeys: Array.from(this.unusedKeys)
    };

    const outputPath = path.join(CONFIG.translationPath, 'validation-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(validationData, null, 2), 'utf8');
    log.success(`Validation report saved to ${outputPath}`);
  }

  /**
   * Get nested property from object
   */
  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested property in object
   */
  setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
}

// Run the sync process
if (require.main === module) {
  const sync = new I18nAutoSync();
  sync.run().catch(error => {
    log.error(`Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = I18nAutoSync;