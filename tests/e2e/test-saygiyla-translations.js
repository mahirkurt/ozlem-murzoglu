const { chromium } = require('playwright');

async function testSaygiylaTranslations() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🔍 Saygıyla bölümü çeviri testi başlıyor...\n');
  
  const issues = [];
  const testUrls = [
    { path: '/saygiyla', name: 'Ana Saygıyla Sayfası' },
    { path: '/saygiyla/ataturk', name: 'Atatürk' },
    { path: '/saygiyla/jonas-salk', name: 'Jonas Salk' },
    { path: '/saygiyla/louis-pasteur', name: 'Louis Pasteur' },
    { path: '/saygiyla/turkan-saylan', name: 'Türkan Saylan' },
    { path: '/saygiyla/ihsan-dogramaci', name: 'İhsan Doğramacı' },
    { path: '/saygiyla/virginia-apgar', name: 'Virginia Apgar' },
    { path: '/saygiyla/malala-yousafzai', name: 'Malala Yousafzai' },
    { path: '/saygiyla/ursula-leguin', name: 'Ursula Le Guin' }
  ];
  
  // Test each page in English
  for (const test of testUrls) {
    console.log(`\n📄 Testing: ${test.name}`);
    console.log('=' . repeat(50));
    
    // Navigate to English version
    await page.goto(`http://localhost:4200/en${test.path}`);
    await page.waitForLoadState('networkidle');
    
    // Check for untranslated text (Turkish)
    const turkishPatterns = [
      'Öne Çıkan Hikayeler',
      'Tarihte İz Bırakanlar',
      'İnsanlığa yön veren',
      'Hikayesini Oku',
      'Detaylar',
      'Yüzyıllar boyunca',
      'ilham veren yaşam öyküleri'
    ];
    
    for (const pattern of turkishPatterns) {
      const elements = await page.locator(`text="${pattern}"`).count();
      if (elements > 0) {
        issues.push({
          page: test.name,
          issue: `Turkish text found: "${pattern}"`,
          count: elements
        });
        console.log(`  ❌ Turkish text found: "${pattern}" (${elements} occurrences)`);
      }
    }
    
    // Check for translation tags showing
    const tagPatterns = [
      /SAYGIYLA\.\w+/,
      /COMMON\.\w+/,
      /\{\{.*\|\s*translate\s*\}\}/
    ];
    
    const pageContent = await page.content();
    for (const pattern of tagPatterns) {
      const matches = pageContent.match(new RegExp(pattern, 'g'));
      if (matches && matches.length > 0) {
        const visibleTags = [];
        for (const match of matches) {
          const isVisible = await page.locator(`text="${match}"`).count() > 0;
          if (isVisible) {
            visibleTags.push(match);
          }
        }
        if (visibleTags.length > 0) {
          issues.push({
            page: test.name,
            issue: `Translation tags visible`,
            tags: visibleTags
          });
          console.log(`  ❌ Translation tags visible: ${visibleTags.join(', ')}`);
        }
      }
    }
    
    // Check for empty translations
    const emptyElements = await page.locator('*:empty').evaluateAll(elements => {
      return elements.filter(el => {
        const text = el.textContent?.trim();
        return !text && el.tagName !== 'BR' && el.tagName !== 'IMG' && 
               el.tagName !== 'INPUT' && el.tagName !== 'META' && 
               el.tagName !== 'LINK' && el.tagName !== 'SCRIPT';
      }).map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id
      }));
    });
    
    if (emptyElements.length > 0) {
      console.log(`  ⚠️  Found ${emptyElements.length} empty elements`);
    }
    
    // Take screenshot for documentation
    await page.screenshot({ 
      path: `screenshots/saygiyla-${test.path.replace(/\//g, '-')}-en.png`,
      fullPage: true 
    });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (issues.length === 0) {
    console.log('✅ No translation issues found!');
  } else {
    console.log(`❌ Found ${issues.length} issues:\n`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.page}:`);
      console.log(`   Issue: ${issue.issue}`);
      if (issue.tags) {
        console.log(`   Tags: ${issue.tags.join(', ')}`);
      }
      if (issue.count) {
        console.log(`   Count: ${issue.count}`);
      }
    });
  }
  
  await browser.close();
}

testSaygiylaTranslations().catch(console.error);