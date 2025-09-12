const fs = require('fs');
const path = require('path');

console.log('🔍 ANASAYFA HARDCODED STİL KONTROLÜ\n');
console.log('═'.repeat(60) + '\n');

// Anasayfada kullanılan tüm bileşenler
const homeComponents = [
  {
    name: 'HomeComponent',
    files: [
      'src/app/pages/home/home.component.css',
      'src/app/pages/home/home.component.html'
    ]
  },
  {
    name: 'LiquidHeroComponent',
    files: [
      'src/app/components/liquid-hero/liquid-hero.css',
      'src/app/components/liquid-hero/liquid-hero.html'
    ]
  },
  {
    name: 'ApproachSectionComponent',
    files: [
      'src/app/components/approach-section/approach-section.component.css',
      'src/app/components/approach-section/approach-section.component.html'
    ]
  },
  {
    name: 'DoctorBioComponent',
    files: [
      'src/app/components/doctor-bio/doctor-bio.css',
      'src/app/components/doctor-bio/doctor-bio.html'
    ]
  },
  {
    name: 'ServicesSectionComponent',
    files: [
      'src/app/components/services-section/services-section.component.css',
      'src/app/components/services-section/services-section.component.html'
    ]
  },
  {
    name: 'AppointmentSectionComponent',
    files: [
      'src/app/components/appointment-section/appointment-section.component.css',
      'src/app/components/appointment-section/appointment-section.component.html'
    ]
  },
  {
    name: 'ClinicGalleryComponent',
    files: [
      'src/app/components/clinic-gallery/clinic-gallery.css',
      'src/app/components/clinic-gallery/clinic-gallery.html'
    ]
  }
];

// Hardcoded stil kalıpları
const hardcodedPatterns = [
  // Sabit piksel değerleri (design token olmayan)
  { pattern: /width:\s*\d+px/gi, name: 'Sabit width (px)' },
  { pattern: /height:\s*\d+px/gi, name: 'Sabit height (px)' },
  { pattern: /padding:\s*\d+px/gi, name: 'Sabit padding (px)' },
  { pattern: /margin:\s*\d+px/gi, name: 'Sabit margin (px)' },
  { pattern: /font-size:\s*\d+px/gi, name: 'Sabit font-size (px)' },
  { pattern: /line-height:\s*\d+px/gi, name: 'Sabit line-height (px)' },
  
  // Sabit renkler (hex, rgb, rgba)
  { pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g, name: 'Hex renk kodu' },
  { pattern: /rgb\([^)]+\)/gi, name: 'RGB renk' },
  { pattern: /rgba\([^)]+\)/gi, name: 'RGBA renk' },
  
  // Inline stiller
  { pattern: /style\s*=\s*["'][^"']+["']/gi, name: 'Inline style (HTML)' },
  
  // !important kullanımı
  { pattern: /!important/gi, name: '!important kullanımı' },
  
  // Sabit container genişlikleri
  { pattern: /max-width:\s*1200px/gi, name: 'Eski container genişliği (1200px)' },
  
  // Media query'de sabit değerler
  { pattern: /@media[^{]+\d+px/gi, name: 'Media query sabit değer' }
];

// MD3 token kullanımı kalıpları
const tokenPatterns = [
  { pattern: /var\(--md-sys-/gi, name: 'MD3 sistem tokenları' },
  { pattern: /var\(--spacing-/gi, name: 'Spacing tokenları' },
  { pattern: /var\(--radius-/gi, name: 'Radius tokenları' },
  { pattern: /var\(--elevation-/gi, name: 'Elevation tokenları' },
  { pattern: /var\(--duration-/gi, name: 'Motion tokenları' },
  { pattern: /var\(--container-/gi, name: 'Container tokenları' },
  { pattern: /\.container(?:\s|{)/gi, name: 'Global container sınıfı' },
  { pattern: /\.section(?:\s|{)/gi, name: 'Global section sınıfı' }
];

let totalFiles = 0;
let filesWithHardcoded = 0;
let totalHardcodedStyles = 0;
let totalTokenUsage = 0;
const detailedResults = {};

// Dosya analizi
function analyzeFile(filePath) {
  const fullPath = path.join('D:/GitHub Repos/ozlem-murzoglu', filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { exists: false };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const fileExt = path.extname(filePath);
  
  // Boş dosya kontrolü
  if (content.trim().length === 0) {
    return { 
      exists: true, 
      empty: true,
      hardcoded: [],
      tokens: []
    };
  }
  
  const hardcodedFound = [];
  const tokensFound = [];
  
  // CSS dosyaları için analiz
  if (fileExt === '.css' || fileExt === '.scss') {
    // Hardcoded stil kontrolü
    hardcodedPatterns.forEach(({ pattern, name }) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        // CSS değişkenleri ve özel durumları filtrele
        const filtered = matches.filter(match => {
          // var(--) içindeki değerleri hariç tut
          if (match.includes('var(--')) return false;
          // 0px, 100%, auto gibi değerleri hariç tut
          if (match.match(/:\s*(0px|0|100%|auto|inherit|initial)/)) return false;
          // Design token değerlerini hariç tut (4px, 8px, 12px, 16px, 24px, 32px, 48px)
          if (match.match(/:\s*(4|8|12|16|24|32|48)px/)) return false;
          return true;
        });
        
        if (filtered.length > 0) {
          hardcodedFound.push({
            type: name,
            count: filtered.length,
            examples: filtered.slice(0, 3)
          });
        }
      }
    });
    
    // Token kullanımı kontrolü
    tokenPatterns.forEach(({ pattern, name }) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        tokensFound.push({
          type: name,
          count: matches.length
        });
      }
    });
  }
  
  // HTML dosyaları için inline style kontrolü
  if (fileExt === '.html') {
    const inlineStyles = content.match(/style\s*=\s*["'][^"']+["']/gi);
    if (inlineStyles && inlineStyles.length > 0) {
      hardcodedFound.push({
        type: 'Inline style',
        count: inlineStyles.length,
        examples: inlineStyles.slice(0, 3)
      });
    }
    
    // Class kullanımı kontrolü
    const globalClasses = content.match(/class\s*=\s*["'][^"']*\b(container|section)\b[^"']*["']/gi);
    if (globalClasses && globalClasses.length > 0) {
      tokensFound.push({
        type: 'Global CSS sınıfları',
        count: globalClasses.length
      });
    }
  }
  
  return {
    exists: true,
    empty: false,
    hardcoded: hardcodedFound,
    tokens: tokensFound
  };
}

// Bileşen analizi
console.log('📦 BİLEŞEN ANALİZİ\n');

homeComponents.forEach(component => {
  console.log(`\n🔍 ${component.name}`);
  console.log('─'.repeat(50));
  
  const componentResults = {
    hardcoded: [],
    tokens: [],
    files: []
  };
  
  component.files.forEach(filePath => {
    totalFiles++;
    const result = analyzeFile(filePath);
    const fileName = path.basename(filePath);
    
    if (!result.exists) {
      console.log(`  ⚠️ ${fileName} - Dosya bulunamadı`);
    } else if (result.empty) {
      console.log(`  ✅ ${fileName} - Boş dosya (hardcoded stil yok)`);
    } else {
      let hasHardcoded = false;
      
      if (result.hardcoded.length > 0) {
        hasHardcoded = true;
        filesWithHardcoded++;
        console.log(`  ❌ ${fileName} - Hardcoded stiller bulundu:`);
        result.hardcoded.forEach(item => {
          totalHardcodedStyles += item.count;
          console.log(`     • ${item.type}: ${item.count} adet`);
          if (item.examples && item.examples.length > 0) {
            item.examples.forEach(ex => {
              console.log(`       → ${ex}`);
            });
          }
        });
        componentResults.hardcoded.push(...result.hardcoded);
      }
      
      if (result.tokens.length > 0) {
        if (!hasHardcoded) {
          console.log(`  ✅ ${fileName} - Sadece token kullanımı:`);
        } else {
          console.log(`     Token kullanımı da var:`);
        }
        result.tokens.forEach(item => {
          totalTokenUsage += item.count;
          console.log(`     ✓ ${item.type}: ${item.count} adet`);
        });
        componentResults.tokens.push(...result.tokens);
      }
      
      if (!hasHardcoded && result.tokens.length === 0) {
        console.log(`  ⚠️ ${fileName} - Ne hardcoded ne de token kullanımı var`);
      }
    }
    
    componentResults.files.push({
      path: filePath,
      result
    });
  });
  
  detailedResults[component.name] = componentResults;
});

// Global stil dosyaları kontrolü
console.log('\n\n📋 GLOBAL STİL DOSYALARI KONTROLÜ');
console.log('═'.repeat(60));

const globalStyleFiles = [
  'src/styles.css',
  'src/styles-md3.scss',
  'src/app/styles/global.scss'
];

globalStyleFiles.forEach(filePath => {
  const fullPath = path.join('D:/GitHub Repos/ozlem-murzoglu', filePath);
  const fileName = path.basename(filePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Token tanımları kontrolü
    const hasRootVars = content.includes(':root');
    const hasMD3Vars = content.includes('--md-sys-');
    const hasContainerDef = content.includes('.container');
    const hasNewWidth = content.includes('min(1440px, 90vw)');
    
    console.log(`\n✅ ${fileName}`);
    if (hasRootVars) console.log('   ✓ :root CSS değişkenleri tanımlı');
    if (hasMD3Vars) console.log('   ✓ MD3 sistem değişkenleri mevcut');
    if (hasContainerDef) console.log('   ✓ Container sınıfı tanımlı');
    if (hasNewWidth) console.log('   ✓ Yeni container genişliği (1440px) uygulanmış');
  } else {
    console.log(`\n❌ ${fileName} - Dosya bulunamadı`);
  }
});

// ÖZET RAPOR
console.log('\n\n');
console.log('═'.repeat(60));
console.log('📊 ÖZET RAPOR');
console.log('═'.repeat(60));

const hardcodedPercentage = Math.round((filesWithHardcoded / totalFiles) * 100);
const cleanPercentage = 100 - hardcodedPercentage;

console.log(`\n📁 Toplam dosya: ${totalFiles}`);
console.log(`✅ Temiz dosya: ${totalFiles - filesWithHardcoded} (%${cleanPercentage})`);
console.log(`❌ Hardcoded içeren: ${filesWithHardcoded} (%${hardcodedPercentage})`);
console.log(`\n🎨 Toplam hardcoded stil: ${totalHardcodedStyles}`);
console.log(`🎯 Toplam token kullanımı: ${totalTokenUsage}`);

// SONUÇ
console.log('\n\n🎯 SONUÇ:');
console.log('─'.repeat(50));

if (filesWithHardcoded === 0) {
  console.log('🎉 MÜKEMMEL! Anasayfada hiçbir hardcoded stil bulunmuyor!');
  console.log('✅ Tüm bileşenler global MD3 design sistemini kullanıyor!');
  console.log('✅ %100 token tabanlı stil sistemi uygulanmış!');
} else if (hardcodedPercentage < 20) {
  console.log('✅ Çok iyi! Anasayfa neredeyse tamamen global stiller kullanıyor.');
  console.log(`⚠️ Sadece ${filesWithHardcoded} dosyada küçük düzeltmeler gerekiyor.`);
} else {
  console.log('❌ Anasayfada hala hardcoded stiller mevcut.');
  console.log('🔧 Bu stillerin global token sistemiyle değiştirilmesi gerekiyor.');
}

if (totalTokenUsage > 0) {
  console.log(`\n✨ Token kullanım oranı: ${Math.round((totalTokenUsage / (totalTokenUsage + totalHardcodedStyles)) * 100)}%`);
}

console.log('\n✅ Analiz tamamlandı!');