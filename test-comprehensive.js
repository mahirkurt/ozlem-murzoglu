const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ComprehensiveWebTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:4200';
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Console loglarını yakala
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.results.failed.push(`Console Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        this.results.warnings.push(`Console Warning: ${msg.text()}`);
      }
    });

    // Network hatalarını yakala
    this.page.on('response', response => {
      if (!response.ok()) {
        this.results.failed.push(`Network Error: ${response.status()} - ${response.url()}`);
      }
    });
  }

  async testPageLoad(url, testName) {
    console.log(`\n🧪 Testing: ${testName}`);
    try {
      const response = await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      if (response.ok()) {
        this.results.passed.push(`✅ ${testName} - Page loaded successfully`);
        return true;
      } else {
        this.results.failed.push(`❌ ${testName} - Page failed to load: ${response.status()}`);
        return false;
      }
    } catch (error) {
      this.results.failed.push(`❌ ${testName} - Error: ${error.message}`);
      return false;
    }
  }

  async testResponsiveDesign() {
    console.log('\n📱 Testing Responsive Design...');
    
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' },
      { width: 1920, height: 1080, name: 'Large Desktop' }
    ];

    for (const viewport of viewports) {
      await this.page.setViewport({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000);
      
      // Navigation menüsünü kontrol et
      const navVisible = await this.page.evaluate(() => {
        const nav = document.querySelector('nav, .navbar, .navigation');
        return nav && window.getComputedStyle(nav).display !== 'none';
      });

      if (navVisible) {
        this.results.passed.push(`✅ Navigation visible on ${viewport.name}`);
      } else {
        this.results.failed.push(`❌ Navigation not visible on ${viewport.name}`);
      }

      // Content overflow kontrolü
      const hasOverflow = await this.page.evaluate(() => {
        const body = document.body;
        return body.scrollWidth > window.innerWidth + 10; // 10px tolerance
      });

      if (!hasOverflow) {
        this.results.passed.push(`✅ No horizontal overflow on ${viewport.name}`);
      } else {
        this.results.failed.push(`❌ Horizontal overflow detected on ${viewport.name}`);
      }
    }
  }

  async testNavigation() {
    console.log('\n🧭 Testing Navigation...');
    
    // Ana sayfa navigasyonu
    const navLinks = await this.page.$$eval('nav a, .nav a, .navbar a', links => 
      links.map(link => ({
        text: link.textContent.trim(),
        href: link.href
      })).filter(link => link.href && !link.href.includes('#'))
    );

    console.log(`Found ${navLinks.length} navigation links`);

    for (const link of navLinks.slice(0, 8)) { // İlk 8 linki test et
      try {
        console.log(`Testing navigation to: ${link.text}`);
        await this.page.goto(link.href, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Sayfa başlığını kontrol et
        const title = await this.page.title();
        if (title && title !== '') {
          this.results.passed.push(`✅ Navigation to "${link.text}" - Page has title: ${title}`);
        } else {
          this.results.warnings.push(`⚠️ Navigation to "${link.text}" - No page title`);
        }

        // Angular router-outlet kontrolü
        const hasContent = await this.page.evaluate(() => {
          const routerOutlet = document.querySelector('router-outlet');
          const main = document.querySelector('main');
          return (routerOutlet && routerOutlet.nextElementSibling) || 
                 (main && main.children.length > 0);
        });

        if (hasContent) {
          this.results.passed.push(`✅ Navigation to "${link.text}" - Content loaded`);
        } else {
          this.results.failed.push(`❌ Navigation to "${link.text}" - No content found`);
        }

      } catch (error) {
        this.results.failed.push(`❌ Navigation to "${link.text}" - Error: ${error.message}`);
      }
    }
  }

  async testFormsAndInteractions() {
    console.log('\n📝 Testing Forms and Interactions...');

    // İletişim formunu test et
    try {
      await this.page.goto(`${this.baseUrl}/iletisim`, { waitUntil: 'networkidle2' });
      
      // Form elementlerini bul
      const formInputs = await this.page.$$('input, textarea, select');
      console.log(`Found ${formInputs.length} form elements`);

      if (formInputs.length > 0) {
        this.results.passed.push(`✅ Contact form found with ${formInputs.length} elements`);
        
        // Form doldurma testi
        await this.page.type('input[type="text"]', 'Test User', { delay: 100 });
        await this.page.type('input[type="email"]', 'test@example.com', { delay: 100 });
        await this.page.type('textarea', 'Bu bir test mesajıdır.', { delay: 100 });
        
        this.results.passed.push(`✅ Form filling test completed`);
      } else {
        this.results.warnings.push(`⚠️ No form elements found on contact page`);
      }

      // Butonları test et
      const buttons = await this.page.$$('button');
      if (buttons.length > 0) {
        this.results.passed.push(`✅ Found ${buttons.length} interactive buttons`);
      }

    } catch (error) {
      this.results.failed.push(`❌ Form testing error: ${error.message}`);
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');

    // Ana sayfaya git ve performance ölç
    const startTime = Date.now();
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - startTime;

    if (loadTime < 5000) {
      this.results.passed.push(`✅ Page load time: ${loadTime}ms (Good)`);
    } else if (loadTime < 10000) {
      this.results.warnings.push(`⚠️ Page load time: ${loadTime}ms (Acceptable)`);
    } else {
      this.results.failed.push(`❌ Page load time: ${loadTime}ms (Too slow)`);
    }

    // Memory usage kontrolü
    const metrics = await this.page.metrics();
    if (metrics.JSHeapUsedSize < 50 * 1024 * 1024) { // 50MB
      this.results.passed.push(`✅ Memory usage: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB (Good)`);
    } else {
      this.results.warnings.push(`⚠️ Memory usage: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB (High)`);
    }
  }

  async testSEO() {
    console.log('\n🔍 Testing SEO Elements...');

    // Meta tags kontrolü
    const metaTags = await this.page.evaluate(() => {
      const tags = {};
      tags.title = document.title;
      tags.description = document.querySelector('meta[name="description"]')?.content;
      tags.keywords = document.querySelector('meta[name="keywords"]')?.content;
      tags.viewport = document.querySelector('meta[name="viewport"]')?.content;
      tags.ogTitle = document.querySelector('meta[property="og:title"]')?.content;
      tags.ogDescription = document.querySelector('meta[property="og:description"]')?.content;
      return tags;
    });

    if (metaTags.title) {
      this.results.passed.push(`✅ Page title: "${metaTags.title}"`);
    } else {
      this.results.failed.push(`❌ Missing page title`);
    }

    if (metaTags.description) {
      this.results.passed.push(`✅ Meta description found`);
    } else {
      this.results.warnings.push(`⚠️ Missing meta description`);
    }

    if (metaTags.viewport) {
      this.results.passed.push(`✅ Viewport meta tag found`);
    } else {
      this.results.failed.push(`❌ Missing viewport meta tag`);
    }

    // Heading structure kontrolü
    const headings = await this.page.evaluate(() => {
      const h1s = document.querySelectorAll('h1').length;
      const h2s = document.querySelectorAll('h2').length;
      const h3s = document.querySelectorAll('h3').length;
      return { h1s, h2s, h3s };
    });

    if (headings.h1s === 1) {
      this.results.passed.push(`✅ Proper H1 structure (1 H1 found)`);
    } else if (headings.h1s > 1) {
      this.results.warnings.push(`⚠️ Multiple H1 tags found (${headings.h1s})`);
    } else {
      this.results.failed.push(`❌ No H1 tag found`);
    }
  }

  async testAccessibility() {
    console.log('\n♿ Testing Accessibility...');

    // Alt text kontrolü
    const images = await this.page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: !!img.alt
      }))
    );

    const imagesWithoutAlt = images.filter(img => !img.hasAlt);
    if (imagesWithoutAlt.length === 0) {
      this.results.passed.push(`✅ All ${images.length} images have alt text`);
    } else {
      this.results.failed.push(`❌ ${imagesWithoutAlt.length} images missing alt text`);
    }

    // Form label kontrolü
    const formAccessibility = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const inputsWithoutLabels = Array.from(inputs).filter(input => {
        const id = input.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = input.getAttribute('aria-label');
        const placeholder = input.placeholder;
        return !label && !ariaLabel && !placeholder;
      });
      return {
        total: inputs.length,
        withoutLabels: inputsWithoutLabels.length
      };
    });

    if (formAccessibility.withoutLabels === 0) {
      this.results.passed.push(`✅ All form elements have proper labels`);
    } else {
      this.results.warnings.push(`⚠️ ${formAccessibility.withoutLabels} form elements missing labels`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Web Tests...\n');
    
    await this.init();

    // Ana test sekansı
    const testPages = [
      { url: this.baseUrl, name: 'Ana Sayfa' },
      { url: `${this.baseUrl}/hakkinda`, name: 'Hakkında' },
      { url: `${this.baseUrl}/hizmetler`, name: 'Hizmetler' },
      { url: `${this.baseUrl}/kaynaklar`, name: 'Kaynaklar' },
      { url: `${this.baseUrl}/iletisim`, name: 'İletişim' }
    ];

    // Sayfa yükleme testleri
    for (const testPage of testPages) {
      await this.testPageLoad(testPage.url, testPage.name);
    }

    // Ana sayfada detaylı testler
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
    
    await this.testResponsiveDesign();
    await this.testNavigation();
    await this.testFormsAndInteractions();
    await this.testPerformance();
    await this.testSEO();
    await this.testAccessibility();

    await this.generateReport();
    await this.browser.close();
  }

  async generateReport() {
    console.log('\n📊 Test Results Summary\n');
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⚠️ Warnings: ${this.results.warnings.length}`);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.results.passed.length,
        failed: this.results.failed.length,
        warnings: this.results.warnings.length
      },
      details: this.results
    };

    // Console output
    if (this.results.passed.length > 0) {
      console.log('\n✅ PASSED TESTS:');
      this.results.passed.forEach(test => console.log(`  ${test}`));
    }

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.results.warnings.forEach(warning => console.log(`  ${warning}`));
    }

    if (this.results.failed.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.failed.forEach(failure => console.log(`  ${failure}`));
    }

    // JSON raporu kaydet
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: test-report.json');
  }
}

// Test çalıştır
const tester = new ComprehensiveWebTester();
tester.runAllTests().catch(console.error);
