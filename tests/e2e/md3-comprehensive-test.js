const fs = require('fs');
const path = require('path');

console.log('🔬 MD3 DESIGN SYSTEM KAPSAMLI TEST SUITE\n');
console.log('═'.repeat(60) + '\n');

// Test kategorileri
const testCategories = {
  '1. RESPONSIVE DESIGN': {
    tests: [
      {
        name: 'Container Genişlik Kontrolü',
        check: () => {
          const stylesPath = 'src/styles.css';
          const content = fs.readFileSync(stylesPath, 'utf8');
          const hasNewContainer = content.includes('min(1440px, 90vw)');
          const hasOldContainer = content.includes('max-width: 1200px');
          return {
            passed: hasNewContainer && !hasOldContainer,
            details: hasNewContainer ? '✅ min(1440px, 90vw) kullanılıyor' : '❌ Eski container genişliği'
          };
        }
      },
      {
        name: 'Breakpoint Token Sistemi',
        check: () => {
          const breakpointsPath = 'src/app/styles/tokens/_breakpoints.scss';
          if (!fs.existsSync(breakpointsPath)) {
            return { passed: false, details: '❌ Breakpoints dosyası eksik' };
          }
          const content = fs.readFileSync(breakpointsPath, 'utf8');
          const hasTokens = content.includes('--breakpoint-') && content.includes('$breakpoint-');
          return {
            passed: hasTokens,
            details: hasTokens ? '✅ Breakpoint tokenları tanımlı' : '❌ Breakpoint tokenları eksik'
          };
        }
      },
      {
        name: 'Media Query Token Kullanımı',
        check: () => {
          const components = [
            'src/app/components/approach-section/approach-section.component.css',
            'src/app/components/services-section/services-section.component.css'
          ];
          let allUsesTokens = true;
          let details = [];
          
          components.forEach(file => {
            if (fs.existsSync(file)) {
              const content = fs.readFileSync(file, 'utf8');
              const hasTokenMediaQuery = content.includes('var(--breakpoint-');
              const hasHardcodedMediaQuery = content.match(/@media[^{]+\d{3,4}px/);
              
              if (hasTokenMediaQuery && !hasHardcodedMediaQuery) {
                details.push(`✅ ${path.basename(file)}: Token kullanıyor`);
              } else {
                allUsesTokens = false;
                details.push(`❌ ${path.basename(file)}: Hardcoded media query`);
              }
            }
          });
          
          return {
            passed: allUsesTokens,
            details: details.join('\n     ')
          };
        }
      }
    ]
  },
  
  '2. TYPOGRAPHY SYSTEM': {
    tests: [
      {
        name: 'Font Yükleme',
        check: () => {
          const stylesPath = 'src/styles.css';
          const content = fs.readFileSync(stylesPath, 'utf8');
          const hasFigtree = content.includes('Figtree');
          const hasDMSans = content.includes('DM+Sans') || content.includes('DM Sans');
          const hasJetBrains = content.includes('JetBrains+Mono') || content.includes('JetBrains Mono');
          
          return {
            passed: hasFigtree && hasDMSans,
            details: `Figtree: ${hasFigtree ? '✅' : '❌'} | DM Sans: ${hasDMSans ? '✅' : '❌'} | JetBrains Mono: ${hasJetBrains ? '✅' : '⚠️'}`
          };
        }
      },
      {
        name: 'Tipografi Token Sistemi',
        check: () => {
          const typographyPath = 'src/app/styles/tokens/_typography.scss';
          if (!fs.existsSync(typographyPath)) {
            return { passed: false, details: '❌ Typography dosyası eksik' };
          }
          const content = fs.readFileSync(typographyPath, 'utf8');
          
          const requiredSizes = ['57px', '45px', '36px', '32px', '28px', '24px', '22px', '16px', '14px', '12px', '11px'];
          const missingSizes = requiredSizes.filter(size => !content.includes(size));
          
          return {
            passed: missingSizes.length === 0,
            details: missingSizes.length === 0 
              ? '✅ Tüm tipografi boyutları tanımlı' 
              : `❌ Eksik boyutlar: ${missingSizes.join(', ')}`
          };
        }
      },
      {
        name: 'Font Hierarchy',
        check: () => {
          const indexPath = 'src/app/styles/tokens/_index.scss';
          const content = fs.readFileSync(indexPath, 'utf8');
          
          const scales = ['display', 'headline', 'title', 'body', 'label'];
          const missingScales = scales.filter(scale => !content.toLowerCase().includes(`typescale-${scale}`));
          
          return {
            passed: missingScales.length === 0,
            details: missingScales.length === 0
              ? '✅ Tüm tipografi seviyeleri mevcut'
              : `❌ Eksik seviyeler: ${missingScales.join(', ')}`
          };
        }
      }
    ]
  },
  
  '3. COLOR SYSTEM': {
    tests: [
      {
        name: 'MD3 Renk Paleti',
        check: () => {
          const colorsPath = 'src/app/styles/tokens/_colors.scss';
          if (!fs.existsSync(colorsPath)) {
            return { passed: false, details: '❌ Colors dosyası eksik' };
          }
          const content = fs.readFileSync(colorsPath, 'utf8').toLowerCase();
          
          const requiredColors = {
            'Primary': '#00897b',
            'Secondary': '#ffb300',
            'Tertiary': '#ff7043',
            'Error': '#ba1a1a'
          };
          
          let details = [];
          let allPresent = true;
          
          Object.entries(requiredColors).forEach(([name, hex]) => {
            if (content.includes(hex)) {
              details.push(`✅ ${name}: ${hex}`);
            } else {
              allPresent = false;
              details.push(`❌ ${name}: Eksik`);
            }
          });
          
          return {
            passed: allPresent,
            details: details.join('\n     ')
          };
        }
      },
      {
        name: 'RGB Değişkenleri',
        check: () => {
          const colorsPath = 'src/app/styles/tokens/_colors.scss';
          const content = fs.readFileSync(colorsPath, 'utf8');
          
          const hasRgbVars = content.includes('-rgb:') || content.includes('--md-sys-color-primary-rgb');
          
          return {
            passed: hasRgbVars,
            details: hasRgbVars 
              ? '✅ RGB değişkenleri tanımlı (opacity desteği)' 
              : '⚠️ RGB değişkenleri eksik'
          };
        }
      }
    ]
  },
  
  '4. SPACING & LAYOUT': {
    tests: [
      {
        name: '4px Grid Sistemi',
        check: () => {
          const spacingPath = 'src/app/styles/tokens/_spacing.scss';
          if (!fs.existsSync(spacingPath)) {
            return { passed: false, details: '❌ Spacing dosyası eksik' };
          }
          const content = fs.readFileSync(spacingPath, 'utf8');
          
          const gridValues = ['8px', '12px', '16px', '24px', '32px', '48px'];
          const hasAllValues = gridValues.every(val => content.includes(val));
          
          return {
            passed: hasAllValues,
            details: hasAllValues 
              ? '✅ 4px grid sistemi uygulanmış' 
              : '❌ Grid değerleri eksik'
          };
        }
      },
      {
        name: 'Golden Ratio Spacing',
        check: () => {
          const spacingPath = 'src/app/styles/tokens/_spacing.scss';
          const content = fs.readFileSync(spacingPath, 'utf8');
          
          const hasGoldenRatio = content.includes('1.618') || content.includes('golden');
          
          return {
            passed: hasGoldenRatio,
            details: hasGoldenRatio 
              ? '✅ Golden ratio referansı var' 
              : '⚠️ Golden ratio uygulanmamış'
          };
        }
      }
    ]
  },
  
  '5. COMPONENT CONSISTENCY': {
    tests: [
      {
        name: 'Elevation Sistem',
        check: () => {
          const elevationPath = 'src/app/styles/tokens/_elevation.scss';
          if (!fs.existsSync(elevationPath)) {
            return { passed: false, details: '❌ Elevation dosyası eksik' };
          }
          const content = fs.readFileSync(elevationPath, 'utf8');
          
          const levels = [0, 1, 2, 3, 4, 5];
          const hasAllLevels = levels.every(level => 
            content.includes(`elevation-level-${level}`) || 
            content.includes(`elevation-level${level}`)
          );
          
          return {
            passed: hasAllLevels,
            details: hasAllLevels 
              ? '✅ Tüm elevation seviyeleri tanımlı' 
              : '❌ Eksik elevation seviyeleri'
          };
        }
      },
      {
        name: 'Shape System',
        check: () => {
          const shapePath = 'src/app/styles/tokens/_shape.scss';
          if (!fs.existsSync(shapePath)) {
            return { passed: false, details: '❌ Shape dosyası eksik' };
          }
          const content = fs.readFileSync(shapePath, 'utf8');
          
          const radiusValues = ['8px', '12px', '16px', '28px'];
          const hasAllRadius = radiusValues.every(val => content.includes(val));
          
          return {
            passed: hasAllRadius,
            details: hasAllRadius 
              ? '✅ Tüm radius değerleri tanımlı' 
              : '❌ Eksik radius değerleri'
          };
        }
      },
      {
        name: 'Motion System',
        check: () => {
          const motionPath = 'src/app/styles/tokens/_motion.scss';
          if (!fs.existsSync(motionPath)) {
            return { passed: false, details: '❌ Motion dosyası eksik' };
          }
          const content = fs.readFileSync(motionPath, 'utf8');
          
          const hasDurations = content.includes('200ms') && content.includes('300ms') && content.includes('500ms');
          const hasEasing = content.includes('cubic-bezier');
          
          return {
            passed: hasDurations && hasEasing,
            details: `Durations: ${hasDurations ? '✅' : '❌'} | Easing: ${hasEasing ? '✅' : '❌'}`
          };
        }
      }
    ]
  },
  
  '6. ACCESSIBILITY': {
    tests: [
      {
        name: 'Touch Target Size',
        check: () => {
          const breakpointsPath = 'src/app/styles/tokens/_breakpoints.scss';
          if (!fs.existsSync(breakpointsPath)) {
            return { passed: false, details: '⚠️ Breakpoints dosyası yok' };
          }
          const content = fs.readFileSync(breakpointsPath, 'utf8');
          
          const hasMinTouch = content.includes('--min-touch-target') && content.includes('48px');
          
          return {
            passed: hasMinTouch,
            details: hasMinTouch 
              ? '✅ Minimum touch target (48px) tanımlı' 
              : '⚠️ Touch target tanımı eksik'
          };
        }
      },
      {
        name: 'Focus States',
        check: () => {
          const elevationPath = 'src/app/styles/tokens/_elevation.scss';
          const content = fs.readFileSync(elevationPath, 'utf8');
          
          const hasFocusElevation = content.includes('--elevation-focus');
          
          return {
            passed: hasFocusElevation,
            details: hasFocusElevation 
              ? '✅ Focus elevation tanımlı' 
              : '⚠️ Focus state eksik'
          };
        }
      }
    ]
  },
  
  '7. PERFORMANCE': {
    tests: [
      {
        name: 'Token Kullanım Oranı',
        check: () => {
          // Basit bir token kullanım kontrolü
          const components = [
            'src/app/components/approach-section/approach-section.component.css',
            'src/app/components/services-section/services-section.component.css'
          ];
          
          let totalVars = 0;
          let totalHardcoded = 0;
          
          components.forEach(file => {
            if (fs.existsSync(file)) {
              const content = fs.readFileSync(file, 'utf8');
              const varMatches = content.match(/var\(--/g);
              const pxMatches = content.match(/\d+px/g);
              
              if (varMatches) totalVars += varMatches.length;
              if (pxMatches) totalHardcoded += pxMatches.length;
            }
          });
          
          const tokenRate = Math.round((totalVars / (totalVars + totalHardcoded)) * 100);
          
          return {
            passed: tokenRate >= 95,
            details: `Token kullanım oranı: %${tokenRate}`
          };
        }
      }
    ]
  }
};

// Testleri çalıştır
let totalTests = 0;
let passedTests = 0;
let warnings = 0;
const testResults = {};

Object.entries(testCategories).forEach(([category, { tests }]) => {
  console.log(`\n📋 ${category}`);
  console.log('─'.repeat(50));
  
  const categoryResults = [];
  
  tests.forEach(test => {
    totalTests++;
    try {
      const result = test.check();
      
      if (result.passed) {
        passedTests++;
        console.log(`  ✅ ${test.name}`);
      } else {
        console.log(`  ❌ ${test.name}`);
      }
      
      if (result.details) {
        console.log(`     ${result.details}`);
      }
      
      categoryResults.push({
        name: test.name,
        ...result
      });
    } catch (error) {
      console.log(`  ⚠️ ${test.name} - Test hatası`);
      warnings++;
    }
  });
  
  testResults[category] = categoryResults;
});

// PROBLEMLER VE ÖNERİLER
console.log('\n\n');
console.log('═'.repeat(60));
console.log('🔧 TESPİT EDİLEN PROBLEMLER VE ÖNERİLER');
console.log('═'.repeat(60));

const problems = [];
const suggestions = [];

// Problemleri analiz et
Object.entries(testResults).forEach(([category, results]) => {
  results.forEach(result => {
    if (!result.passed) {
      problems.push(`${category} - ${result.name}: ${result.details}`);
      
      // Öneriler
      if (result.name.includes('Container')) {
        suggestions.push('Container genişliğini min(1440px, 90vw) olarak güncelle');
      }
      if (result.name.includes('RGB')) {
        suggestions.push('Renk değişkenlerine RGB versiyonları ekle (opacity desteği için)');
      }
      if (result.name.includes('Touch')) {
        suggestions.push('Minimum touch target size (48px) tanımla');
      }
    }
  });
});

if (problems.length > 0) {
  console.log('\n❌ Problemler:');
  problems.forEach(p => console.log(`  • ${p}`));
}

if (suggestions.length > 0) {
  console.log('\n💡 Öneriler:');
  suggestions.forEach(s => console.log(`  • ${s}`));
}

// ÖZET RAPOR
console.log('\n\n');
console.log('═'.repeat(60));
console.log('📊 TEST SONUÇ RAPORU');
console.log('═'.repeat(60));

const successRate = Math.round((passedTests / totalTests) * 100);

console.log(`\nToplam Test: ${totalTests}`);
console.log(`Başarılı: ${passedTests}`);
console.log(`Başarısız: ${totalTests - passedTests}`);
console.log(`Uyarı: ${warnings}`);
console.log(`\nBaşarı Oranı: %${successRate}`);

if (successRate === 100) {
  console.log('\n🎉 MÜKEMMEL! Tüm MD3 testleri başarılı!');
} else if (successRate >= 90) {
  console.log('\n✅ Çok iyi! MD3 sistem büyük oranda uygulanmış.');
} else if (successRate >= 75) {
  console.log('\n⚠️ İyi, ancak bazı önemli eksikler var.');
} else {
  console.log('\n❌ Kritik eksikler var, düzeltmeler gerekiyor.');
}

console.log('\n✅ Test tamamlandı!');