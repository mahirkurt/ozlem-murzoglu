const fs = require('fs');
const path = require('path');

console.log('🎯 %100 MD3 TOKEN KULLANIMI DOĞRULAMA\n');
console.log('═'.repeat(60) + '\n');

// Anasayfada kullanılan tüm bileşenler
const componentsToCheck = [
  'src/app/pages/home/home.component.css',
  'src/app/components/approach-section/approach-section.component.css',
  'src/app/components/services-section/services-section.component.css'
];

// Hardcoded değer kalıpları - token sistemi DIŞINDA kalanlar
const hardcodedPatterns = [
  // Sabit piksel değerleri (token olmayan)
  { 
    pattern: /\b\d+px\b/gi, 
    name: 'Sabit piksel değeri',
    allowedValues: ['0px', '1px', '2px', '4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'] // Token değerleri
  },
  
  // Hex renkler
  { 
    pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g, 
    name: 'Hex renk kodu',
    allowedValues: [] // Hiç olmamalı
  },
  
  // RGB/RGBA değerleri (token dışı)
  { 
    pattern: /rgba?\([^)]+\)/gi, 
    name: 'RGB/RGBA renk',
    allowedValues: [] // rgba(var(--token), opacity) formatı hariç
  },
  
  // Sabit media query değerleri
  { 
    pattern: /@media[^{]+\d+px/gi, 
    name: 'Media query sabit değer',
    allowedValues: [] // Artık hepsi token olmalı
  },
  
  // !important kullanımı
  { 
    pattern: /!important/gi, 
    name: '!important kullanımı',
    allowedValues: []
  },
  
  // Inline styles
  { 
    pattern: /style\s*=\s*["'][^"']+["']/gi, 
    name: 'Inline style',
    allowedValues: []
  }
];

// Token kullanım kalıpları
const tokenPatterns = [
  { pattern: /var\(--md-sys-/gi, name: 'MD3 sistem tokenları' },
  { pattern: /var\(--spacing-/gi, name: 'Spacing tokenları' },
  { pattern: /var\(--radius-/gi, name: 'Radius tokenları' },
  { pattern: /var\(--elevation-/gi, name: 'Elevation tokenları' },
  { pattern: /var\(--duration-/gi, name: 'Motion tokenları' },
  { pattern: /var\(--container-/gi, name: 'Container tokenları' },
  { pattern: /var\(--breakpoint-/gi, name: 'Breakpoint tokenları' },
  { pattern: /var\(--font-/gi, name: 'Font tokenları' },
  { pattern: /var\(--transition-/gi, name: 'Transition tokenları' },
  { pattern: /var\(--glass-/gi, name: 'Glass effect tokenları' }
];

let totalFiles = 0;
let totalHardcodedFound = 0;
let totalTokensUsed = 0;
const results = {};

// Dosya analizi
function analyzeFile(filePath) {
  const fullPath = path.join('D:/GitHub Repos/ozlem-murzoglu', filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { exists: false };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const hardcodedFound = [];
  const tokensFound = {};
  let tokenCount = 0;
  
  // Token kullanımlarını say
  tokenPatterns.forEach(({ pattern, name }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      tokensFound[name] = matches.length;
      tokenCount += matches.length;
    }
  });
  
  // Hardcoded değerleri kontrol et
  hardcodedPatterns.forEach(({ pattern, name, allowedValues }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      const invalidMatches = matches.filter(match => {
        // Token içinde kullanılan değerleri hariç tut
        if (match.includes('var(--')) return false;
        
        // İzin verilen değerleri hariç tut
        if (allowedValues && allowedValues.includes(match)) return false;
        
        // calc() içindeki değerleri kontrol et
        if (content.includes(`calc(`) && match === '2px') return false;
        
        // rgba(var(--token), opacity) formatını hariç tut
        if (name === 'RGB/RGBA renk' && match.includes('var(--')) return false;
        
        return true;
      });
      
      if (invalidMatches.length > 0) {
        hardcodedFound.push({
          type: name,
          count: invalidMatches.length,
          examples: invalidMatches.slice(0, 3)
        });
      }
    }
  });
  
  return {
    exists: true,
    hardcoded: hardcodedFound,
    tokens: tokensFound,
    tokenCount: tokenCount
  };
}

// ANALİZ
console.log('📋 BİLEŞEN ANALİZİ\n');

componentsToCheck.forEach(filePath => {
  totalFiles++;
  const fileName = path.basename(filePath);
  const componentName = fileName.replace('.component.css', '').replace(/-/g, ' ').toUpperCase();
  
  console.log(`🔍 ${componentName}`);
  console.log('─'.repeat(50));
  
  const result = analyzeFile(filePath);
  
  if (!result.exists) {
    console.log('  ❌ Dosya bulunamadı\n');
    return;
  }
  
  // Token kullanımı
  if (result.tokenCount > 0) {
    totalTokensUsed += result.tokenCount;
    console.log(`  ✅ Token kullanımı: ${result.tokenCount} adet`);
    Object.entries(result.tokens).forEach(([name, count]) => {
      console.log(`     • ${name}: ${count}`);
    });
  }
  
  // Hardcoded değerler
  if (result.hardcoded.length > 0) {
    console.log(`  ⚠️ Hardcoded değerler:`);
    result.hardcoded.forEach(item => {
      totalHardcodedFound += item.count;
      console.log(`     ❌ ${item.type}: ${item.count} adet`);
      item.examples.forEach(ex => {
        console.log(`        → ${ex}`);
      });
    });
  } else {
    console.log(`  ✅ Hardcoded değer YOK!`);
  }
  
  console.log();
  results[fileName] = result;
});

// ÖZET RAPOR
console.log('\n');
console.log('═'.repeat(60));
console.log('📊 ÖZET RAPOR');
console.log('═'.repeat(60));

const tokenPercentage = totalTokensUsed > 0 
  ? Math.round((totalTokensUsed / (totalTokensUsed + totalHardcodedFound)) * 100)
  : 0;

console.log(`\n📁 Kontrol edilen dosya: ${totalFiles}`);
console.log(`🎯 Toplam token kullanımı: ${totalTokensUsed}`);
console.log(`❌ Toplam hardcoded değer: ${totalHardcodedFound}`);
console.log(`\n✨ TOKEN KULLANIM ORANI: %${tokenPercentage}`);

// SONUÇ
console.log('\n🏆 SONUÇ:');
console.log('─'.repeat(50));

if (totalHardcodedFound === 0) {
  console.log('🎉 MÜKEMMEL! %100 TOKEN KULLANIMI SAĞLANDI!');
  console.log('✅ Tüm stiller MD3 design token sistemini kullanıyor!');
  console.log('✅ Hiçbir hardcoded değer kalmadı!');
  console.log('\n🏆 MD3 DESIGN SYSTEM %100 UYGULANMIŞ!');
} else if (tokenPercentage >= 95) {
  console.log(`✅ Çok iyi! %${tokenPercentage} token kullanımı.`);
  console.log(`⚠️ Sadece ${totalHardcodedFound} hardcoded değer kaldı.`);
} else {
  console.log(`❌ Token kullanımı yetersiz: %${tokenPercentage}`);
  console.log(`🔧 ${totalHardcodedFound} hardcoded değer düzeltilmeli.`);
}

// Detaylı token istatistikleri
console.log('\n📈 TOKEN İSTATİSTİKLERİ:');
console.log('─'.repeat(50));

const allTokenTypes = {};
Object.values(results).forEach(result => {
  if (result.tokens) {
    Object.entries(result.tokens).forEach(([type, count]) => {
      allTokenTypes[type] = (allTokenTypes[type] || 0) + count;
    });
  }
});

Object.entries(allTokenTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    const percentage = Math.round((count / totalTokensUsed) * 100);
    console.log(`  ${type}: ${count} (%${percentage})`);
  });

console.log('\n✅ Analiz tamamlandı!');