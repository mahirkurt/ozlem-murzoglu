#!/usr/bin/env node

/**
 * Lighthouse Performance Test for MD3 Migration
 * Tests performance metrics after MD3 implementation
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4200',
  outputDir: path.join(__dirname, '..', 'lighthouse-reports'),
  pages: [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/services', name: 'services' },
    { path: '/contact', name: 'contact' }
  ],
  thresholds: {
    performance: 90,
    accessibility: 90,
    bestPractices: 90,
    seo: 90,
    pwa: 50
  }
};

// Lighthouse options
const lighthouseOptions = {
  logLevel: 'info',
  output: ['html', 'json'],
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
  formFactor: 'desktop',
  throttling: {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
    cpuSlowdownMultiplier: 1
  },
  screenEmulation: {
    mobile: false,
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    disabled: false
  }
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

/**
 * Run Lighthouse test for a single page
 */
async function runLighthouseTest(browser, page) {
  const url = `${config.baseUrl}${page.path}`;
  console.log(`\\n🔍 Testing: ${url}`);

  try {
    const { lhr, report } = await lighthouse(url, {
      ...lighthouseOptions,
      port: new URL(browser.wsEndpoint()).port
    });

    // Save reports
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFileName = `${page.name}-${timestamp}`;

    // Save HTML report
    fs.writeFileSync(
      path.join(config.outputDir, `${baseFileName}.html`),
      report[0]
    );

    // Save JSON report
    fs.writeFileSync(
      path.join(config.outputDir, `${baseFileName}.json`),
      report[1]
    );

    // Extract scores
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      pwa: Math.round(lhr.categories.pwa.score * 100)
    };

    // Extract metrics
    const metrics = {
      fcp: lhr.audits['first-contentful-paint'].displayValue,
      lcp: lhr.audits['largest-contentful-paint'].displayValue,
      tbt: lhr.audits['total-blocking-time'].displayValue,
      cls: lhr.audits['cumulative-layout-shift'].displayValue,
      si: lhr.audits['speed-index'].displayValue
    };

    // MD3 specific checks
    const md3Checks = {
      unusedCss: lhr.audits['unused-css-rules'] ?
        lhr.audits['unused-css-rules'].displayValue : 'N/A',
      unusedJs: lhr.audits['unused-javascript'] ?
        lhr.audits['unused-javascript'].displayValue : 'N/A',
      renderBlockingResources: lhr.audits['render-blocking-resources'] ?
        lhr.audits['render-blocking-resources'].displayValue : 'N/A',
      totalByteWeight: lhr.audits['total-byte-weight'] ?
        lhr.audits['total-byte-weight'].displayValue : 'N/A'
    };

    return { page: page.name, scores, metrics, md3Checks };
  } catch (error) {
    console.error(`❌ Error testing ${page.name}:`, error.message);
    return null;
  }
}

/**
 * Check if scores meet thresholds
 */
function checkThresholds(scores) {
  const failures = [];

  Object.entries(config.thresholds).forEach(([category, threshold]) => {
    if (scores[category] < threshold) {
      failures.push(`${category}: ${scores[category]} < ${threshold}`);
    }
  });

  return failures;
}

/**
 * Generate summary report
 */
function generateSummary(results) {
  console.log('\\n' + '='.repeat(60));
  console.log('📊 LIGHTHOUSE TEST SUMMARY - MD3 MIGRATION');
  console.log('='.repeat(60));

  const allScores = {
    performance: [],
    accessibility: [],
    bestPractices: [],
    seo: [],
    pwa: []
  };

  results.forEach(result => {
    if (result) {
      console.log(`\\n📄 Page: ${result.page}`);
      console.log('-'.repeat(40));

      // Display scores
      console.log('Scores:');
      Object.entries(result.scores).forEach(([key, value]) => {
        const emoji = value >= 90 ? '✅' : value >= 50 ? '⚠️' : '❌';
        console.log(`  ${emoji} ${key}: ${value}`);
        allScores[key].push(value);
      });

      // Display metrics
      console.log('\\nPerformance Metrics:');
      Object.entries(result.metrics).forEach(([key, value]) => {
        console.log(`  • ${key.toUpperCase()}: ${value}`);
      });

      // Display MD3 checks
      console.log('\\nMD3 Optimization Checks:');
      Object.entries(result.md3Checks).forEach(([key, value]) => {
        console.log(`  • ${key}: ${value}`);
      });

      // Check thresholds
      const failures = checkThresholds(result.scores);
      if (failures.length > 0) {
        console.log('\\n⚠️  Threshold failures:');
        failures.forEach(failure => console.log(`  • ${failure}`));
      }
    }
  });

  // Calculate averages
  console.log('\\n' + '='.repeat(60));
  console.log('📈 AVERAGE SCORES ACROSS ALL PAGES');
  console.log('='.repeat(60));

  Object.entries(allScores).forEach(([category, scores]) => {
    if (scores.length > 0) {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const emoji = avg >= 90 ? '✅' : avg >= 50 ? '⚠️' : '❌';
      console.log(`${emoji} ${category}: ${avg}`);
    }
  });

  // MD3 Migration Success Criteria
  console.log('\\n' + '='.repeat(60));
  console.log('🎯 MD3 MIGRATION SUCCESS CRITERIA');
  console.log('='.repeat(60));

  const avgPerformance = Math.round(
    allScores.performance.reduce((a, b) => a + b, 0) / allScores.performance.length
  );

  const criteria = [
    {
      name: 'Performance Score > 90',
      met: avgPerformance > 90,
      value: avgPerformance
    },
    {
      name: 'Accessibility Score > 90',
      met: Math.round(allScores.accessibility.reduce((a, b) => a + b, 0) /
           allScores.accessibility.length) > 90,
      value: Math.round(allScores.accessibility.reduce((a, b) => a + b, 0) /
             allScores.accessibility.length)
    },
    {
      name: 'No render-blocking resources',
      met: results.every(r => !r?.md3Checks.renderBlockingResources ||
           r.md3Checks.renderBlockingResources === '0'),
      value: 'Check individual pages'
    },
    {
      name: 'Minimal unused CSS',
      met: results.every(r => !r?.md3Checks.unusedCss ||
           r.md3Checks.unusedCss === 'N/A'),
      value: 'Check individual pages'
    }
  ];

  criteria.forEach(criterion => {
    const emoji = criterion.met ? '✅' : '❌';
    console.log(`${emoji} ${criterion.name}: ${criterion.value}`);
  });

  const successRate = (criteria.filter(c => c.met).length / criteria.length) * 100;
  console.log(`\\n🏆 Overall Success Rate: ${successRate.toFixed(0)}%`);

  return successRate >= 75; // 75% or more criteria met = success
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Lighthouse Performance Tests for MD3 Migration');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  console.log(`📁 Reports will be saved to: ${config.outputDir}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  try {
    // Test each page
    for (const page of config.pages) {
      const result = await runLighthouseTest(browser, page);
      results.push(result);
    }

    // Generate summary
    const success = generateSummary(results);

    console.log('\\n' + '='.repeat(60));
    if (success) {
      console.log('✅ MD3 Migration Performance Tests PASSED!');
    } else {
      console.log('⚠️  MD3 Migration Performance Tests need improvement');
    }
    console.log('='.repeat(60));

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if Lighthouse is available
try {
  require.resolve('lighthouse');
} catch (e) {
  console.error('❌ Lighthouse is not installed.');
  console.log('Please install it with: npm install -D lighthouse');
  process.exit(1);
}

// Run the tests
main().catch(console.error);