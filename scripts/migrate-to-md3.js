#!/usr/bin/env node

/**
 * MD3 Pure CSS Migration Script
 * Automatically converts hardcoded values to MD3 tokens
 *
 * Usage: node scripts/migrate-to-md3.js [--dry-run] [--file path/to/file]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const specificFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

// Color mappings - Old hardcoded values to MD3 tokens
const colorMappings = {
  // Primary colors - Various teal shades to MD3 primary
  '#005F73': 'var(--md-sys-color-primary)',
  '#005f73': 'var(--md-sys-color-primary)',
  '#0A9396': 'var(--md-sys-color-primary)',
  '#0a9396': 'var(--md-sys-color-primary)',
  '#00897b': 'var(--md-sys-color-primary)',
  '#00897B': 'var(--md-sys-color-primary)',

  // Secondary colors - Amber/Yellow to MD3 secondary
  '#FFB74D': 'var(--md-sys-color-secondary)',
  '#ffb74d': 'var(--md-sys-color-secondary)',
  '#FFB300': 'var(--md-sys-color-secondary)',
  '#ffb300': 'var(--md-sys-color-secondary)',
  '#FFC107': 'var(--md-sys-color-secondary)',
  '#ffc107': 'var(--md-sys-color-secondary)',

  // Tertiary colors - Coral/Orange to MD3 tertiary
  '#FF7043': 'var(--md-sys-color-tertiary)',
  '#ff7043': 'var(--md-sys-color-tertiary)',
  '#EE6C4D': 'var(--md-sys-color-tertiary)',
  '#ee6c4d': 'var(--md-sys-color-tertiary)',

  // Surface colors
  '#ffffff': 'var(--md-sys-color-surface)',
  '#FFFFFF': 'var(--md-sys-color-surface)',
  '#fcfcfc': 'var(--md-sys-color-surface)',
  '#FCFCFC': 'var(--md-sys-color-surface)',
  '#f8f9fa': 'var(--md-sys-color-surface-container-low)',
  '#F8F9FA': 'var(--md-sys-color-surface-container-low)',
  '#f5f5f5': 'var(--md-sys-color-surface-container)',
  '#F5F5F5': 'var(--md-sys-color-surface-container)',
  '#f0f4f8': 'var(--md-sys-color-surface-container)',
  '#F0F4F8': 'var(--md-sys-color-surface-container)',
  '#e8e8e8': 'var(--md-sys-color-surface-container-high)',
  '#E8E8E8': 'var(--md-sys-color-surface-container-high)',

  // Text colors
  '#333333': 'var(--md-sys-color-on-surface)',
  '#333': 'var(--md-sys-color-on-surface)',
  '#212121': 'var(--md-sys-color-on-surface)',
  '#1a1a1a': 'var(--md-sys-color-on-surface)',
  '#666666': 'var(--md-sys-color-on-surface-variant)',
  '#666': 'var(--md-sys-color-on-surface-variant)',
  '#757575': 'var(--md-sys-color-on-surface-variant)',

  // Error colors
  '#ba1a1a': 'var(--md-sys-color-error)',
  '#BA1A1A': 'var(--md-sys-color-error)',
  '#d32f2f': 'var(--md-sys-color-error)',
  '#D32F2F': 'var(--md-sys-color-error)',
  '#f44336': 'var(--md-sys-color-error)',
  '#F44336': 'var(--md-sys-color-error)',

  // Success colors
  '#4caf50': 'var(--md-sys-color-success)',
  '#4CAF50': 'var(--md-sys-color-success)',

  // WhatsApp brand color
  '#25D366': 'var(--md-sys-color-brand-whatsapp)',
  '#25d366': 'var(--md-sys-color-brand-whatsapp)',
  '#128C7E': 'var(--md-sys-color-brand-whatsapp-dark)',
  '#128c7e': 'var(--md-sys-color-brand-whatsapp-dark)',
};

// RGB/RGBA color mappings
const rgbMappings = {
  'rgba(0, 95, 115,': 'rgba(var(--md-sys-color-primary-rgb),',
  'rgb(0, 95, 115)': 'rgb(var(--md-sys-color-primary-rgb))',
  'rgba(255, 183, 77,': 'rgba(var(--md-sys-color-secondary-rgb),',
  'rgb(255, 183, 77)': 'rgb(var(--md-sys-color-secondary-rgb))',
  'rgba(0, 0, 0,': 'rgba(var(--md-sys-color-shadow),',
};

// Font family mappings
const fontMappings = {
  // Figtree mappings (headlines)
  "'Figtree', sans-serif": 'var(--md-sys-typescale-font-brand)',
  '"Figtree", sans-serif': 'var(--md-sys-typescale-font-brand)',
  "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif": 'var(--md-sys-typescale-font-brand)',

  // DM Sans mappings (body)
  "'DM Sans', sans-serif": 'var(--md-sys-typescale-font-plain)',
  '"DM Sans", sans-serif': 'var(--md-sys-typescale-font-plain)',
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif": 'var(--md-sys-typescale-font-plain)',

  // Inter mappings (fallback to plain)
  "'Inter', sans-serif": 'var(--md-sys-typescale-font-plain)',
  '"Inter", sans-serif': 'var(--md-sys-typescale-font-plain)',
};

// Spacing mappings (px to MD3 tokens)
const spacingMap = {
  4: 'var(--md-sys-spacing-1)',
  8: 'var(--md-sys-spacing-2)',
  12: 'var(--md-sys-spacing-3)',
  16: 'var(--md-sys-spacing-4)',
  20: 'var(--md-sys-spacing-5)',
  24: 'var(--md-sys-spacing-6)',
  28: 'var(--md-sys-spacing-7)',
  32: 'var(--md-sys-spacing-8)',
  40: 'var(--md-sys-spacing-10)',
  48: 'var(--md-sys-spacing-12)',
  56: 'var(--md-sys-spacing-14)',
  60: 'var(--md-sys-spacing-15)',
  64: 'var(--md-sys-spacing-16)',
  80: 'var(--md-sys-spacing-20)',
  96: 'var(--md-sys-spacing-24)',
  128: 'var(--md-sys-spacing-32)',
};

// Border radius mappings
const radiusMappings = {
  '4px': 'var(--md-sys-shape-corner-extra-small)',
  '8px': 'var(--md-sys-shape-corner-small)',
  '12px': 'var(--md-sys-shape-corner-medium)',
  '16px': 'var(--md-sys-shape-corner-large)',
  '20px': 'var(--md-sys-shape-corner-large)',
  '24px': 'var(--md-sys-shape-corner-extra-large)',
  '28px': 'var(--md-sys-shape-corner-extra-large)',
  '30px': 'var(--md-sys-shape-corner-extra-large)',
  '32px': 'var(--md-sys-shape-corner-extra-large)',
  '50%': 'var(--md-sys-shape-corner-full)',
  '9999px': 'var(--md-sys-shape-corner-full)',
  '999px': 'var(--md-sys-shape-corner-full)',
};

// Statistics tracking
let stats = {
  filesProcessed: 0,
  filesModified: 0,
  colorReplacements: 0,
  fontReplacements: 0,
  spacingReplacements: 0,
  radiusReplacements: 0,
  totalReplacements: 0,
};

/**
 * Get MD3 spacing token for a pixel value
 */
function getSpacingToken(px) {
  const value = parseInt(px);

  // Try exact match first
  if (spacingMap[value]) {
    return spacingMap[value];
  }

  // Find closest value
  const values = Object.keys(spacingMap).map(Number).sort((a, b) => a - b);
  const closest = values.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );

  // If within 4px of a token, use it
  if (Math.abs(closest - value) <= 4) {
    return spacingMap[closest];
  }

  // Otherwise, leave as-is with a TODO comment
  return `${px}px /* TODO: Consider MD3 spacing token */`;
}

/**
 * Process a single file
 */
function migrateFile(filePath, fileStats = {
  colorReplacements: 0,
  fontReplacements: 0,
  spacingReplacements: 0,
  radiusReplacements: 0,
}) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Replace colors
  Object.entries(colorMappings).forEach(([old, newVal]) => {
    const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    if (matches) {
      fileStats.colorReplacements += matches.length;
      content = content.replace(regex, newVal);
    }
  });

  // Replace RGB/RGBA colors
  Object.entries(rgbMappings).forEach(([old, newVal]) => {
    const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      fileStats.colorReplacements += matches.length;
      content = content.replace(regex, newVal);
    }
  });

  // Replace font families
  Object.entries(fontMappings).forEach(([old, newVal]) => {
    const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      fileStats.fontReplacements += matches.length;
      content = content.replace(regex, newVal);
    }
  });

  // Replace padding values (handle multi-value padding)
  content = content.replace(/padding:\s*([0-9]+px)(\s+[0-9]+px)?(\s+[0-9]+px)?(\s+[0-9]+px)?/g, (match, p1, p2, p3, p4) => {
    fileStats.spacingReplacements++;
    const values = [p1, p2, p3, p4].filter(Boolean).map(v => getSpacingToken(v));
    return `padding: ${values.join(' ')}`;
  });

  // Replace margin values (handle multi-value margin)
  content = content.replace(/margin:\s*([0-9]+px)(\s+[0-9]+px)?(\s+[0-9]+px)?(\s+[0-9]+px)?/g, (match, p1, p2, p3, p4) => {
    fileStats.spacingReplacements++;
    const values = [p1, p2, p3, p4].filter(Boolean).map(v => getSpacingToken(v));
    return `margin: ${values.join(' ')}`;
  });

  // Replace gap values
  content = content.replace(/gap:\s*([0-9]+px)/g, (match, px) => {
    fileStats.spacingReplacements++;
    return `gap: ${getSpacingToken(px)}`;
  });

  // Replace border-radius values
  Object.entries(radiusMappings).forEach(([old, newVal]) => {
    const regex = new RegExp(`border-radius:\\s*${old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      fileStats.radiusReplacements += matches.length;
      content = content.replace(regex, `border-radius: ${newVal}`);
    }
  });

  // Check if file was modified
  if (content !== originalContent) {
    if (!isDryRun) {
      fs.writeFileSync(filePath, content);
    }

    const totalChanges = fileStats.colorReplacements + fileStats.fontReplacements +
                        fileStats.spacingReplacements + fileStats.radiusReplacements;

    console.log(`✅ ${isDryRun ? '[DRY RUN] Would modify' : 'Modified'}: ${filePath}`);
    console.log(`   - Colors: ${fileStats.colorReplacements} replacements`);
    console.log(`   - Fonts: ${fileStats.fontReplacements} replacements`);
    console.log(`   - Spacing: ${fileStats.spacingReplacements} replacements`);
    console.log(`   - Radius: ${fileStats.radiusReplacements} replacements`);
    console.log(`   - Total: ${totalChanges} replacements\n`);

    // Update global stats
    stats.colorReplacements += fileStats.colorReplacements;
    stats.fontReplacements += fileStats.fontReplacements;
    stats.spacingReplacements += fileStats.spacingReplacements;
    stats.radiusReplacements += fileStats.radiusReplacements;
    stats.totalReplacements += totalChanges;
    stats.filesModified++;

    return true;
  }

  return false;
}

/**
 * Recursively scan directory for files to migrate
 */
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Skip certain directories
    const skipDirs = ['node_modules', 'dist', '.git', '.angular', 'coverage'];
    if (stat.isDirectory() && !skipDirs.includes(file)) {
      scanDirectory(fullPath);
    } else if (stat.isFile()) {
      // Process CSS, SCSS, and TS files
      const extensions = ['.css', '.scss', '.ts'];
      const ext = path.extname(file).toLowerCase();

      if (extensions.includes(ext)) {
        // Skip spec files and config files
        if (!file.includes('.spec.') && !file.includes('.config.')) {
          stats.filesProcessed++;
          migrateFile(fullPath);
        }
      }
    }
  });
}

/**
 * Main execution
 */
console.log('🚀 Starting MD3 Migration Script');
console.log(`Mode: ${isDryRun ? 'DRY RUN (no files will be modified)' : 'LIVE (files will be modified)'}\n`);

if (specificFile) {
  // Process specific file
  const filePath = path.resolve(specificFile);
  stats.filesProcessed = 1;

  if (migrateFile(filePath)) {
    console.log('✨ Migration complete for single file!\n');
  } else {
    console.log('ℹ️ No changes needed for this file.\n');
  }
} else {
  // Process entire src/app directory
  const srcPath = path.join(process.cwd(), 'src', 'app');

  if (!fs.existsSync(srcPath)) {
    console.error('❌ src/app directory not found. Are you in the project root?');
    process.exit(1);
  }

  scanDirectory(srcPath);
  console.log('✨ Migration scan complete!\n');
}

// Print summary statistics
console.log('📊 Migration Statistics:');
console.log('━'.repeat(40));
console.log(`Files scanned:        ${stats.filesProcessed}`);
console.log(`Files modified:       ${stats.filesModified}`);
console.log(`Color replacements:   ${stats.colorReplacements}`);
console.log(`Font replacements:    ${stats.fontReplacements}`);
console.log(`Spacing replacements: ${stats.spacingReplacements}`);
console.log(`Radius replacements:  ${stats.radiusReplacements}`);
console.log('━'.repeat(40));
console.log(`Total replacements:   ${stats.totalReplacements}`);

if (isDryRun) {
  console.log('\n⚠️  This was a DRY RUN. No files were actually modified.');
  console.log('Run without --dry-run flag to apply changes.');
} else if (stats.filesModified > 0) {
  console.log('\n✅ Migration completed successfully!');
  console.log('📝 Please review the changes and test your application.');
} else {
  console.log('\nℹ️ No changes were needed. Your code is already using MD3 tokens!');
}

process.exit(0);