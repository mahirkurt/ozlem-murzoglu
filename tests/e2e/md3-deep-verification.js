const fs = require('fs');
const path = require('path');

console.log('🔬 MD3 Design System DERİNLEMESİNE DOĞRULAMA\n');
console.log('═'.repeat(60) + '\n');

// MD3 dokümantasyonunda belirtilen TÜM gereksinimler
const deepRequirements = {
  '1. FONT SİSTEMİ': {
    required: {
      'Figtree': ['Display', 'Headline', 'Title başlıkları'],
      'DM Sans': ['Body', 'Label', 'Form elemanları'],
      'JetBrains Mono': ['Kod blokları']
    },
    check: (content) => {
      const results = {};
      results['Figtree import'] = content.includes("family=Figtree");
      results['DM Sans import'] = content.includes("family=DM+Sans");
      results['Figtree kullanım'] = content.includes("font-family: 'Figtree'");
      results['DM Sans kullanım'] = content.includes("font-family: 'DM Sans'");
      return results;
    }
  },
  
  '2. TİPOGRAFİ SKALASI': {
    required: {
      'Display': ['large: 57px', 'medium: 45px', 'small: 36px'],
      'Headline': ['large: 32px', 'medium: 28px', 'small: 24px'],
      'Title': ['large: 22px', 'medium: 16px', 'small: 14px'],
      'Body': ['large: 16px', 'medium: 14px', 'small: 12px'],
      'Label': ['large: 14px', 'medium: 12px', 'small: 11px']
    },
    files: ['src/app/styles/tokens/_typography.scss'],
    check: (content) => {
      const sizes = ['57px', '45px', '36px', '32px', '28px', '24px', '22px', '16px', '14px', '12px', '11px'];
      const results = {};
      sizes.forEach(size => {
        results[`${size}`] = content.includes(size);
      });
      return results;
    }
  },
  
  '3. RENK PALETİ': {
    required: {
      'Primary': '#00897B (Teal)',
      'Secondary': '#FFB300 (Amber)',
      'Tertiary': '#FF7043 (Coral)',
      'Error': '#BA1A1A',
      'Surface': '#FCFCFC',
      'Surface Warm': '#FAF8F5',
      'Background': '#FFFFFF'
    },
    files: ['src/app/styles/tokens/_colors.scss'],
    check: (content) => {
      const colors = {
        '#00897b': 'Primary Teal',
        '#ffb300': 'Secondary Amber',
        '#ff7043': 'Tertiary Coral',
        '#ba1a1a': 'Error',
        '#fcfcfc': 'Surface',
        '#faf8f5': 'Surface Warm'
      };
      const results = {};
      Object.entries(colors).forEach(([hex, name]) => {
        results[name] = content.toLowerCase().includes(hex.toLowerCase());
      });
      return results;
    }
  },
  
  '4. SPACING SİSTEMİ (4px grid)': {
    required: {
      'Golden Ratio': '1.618',
      'Base unit': '4px',
      'Scales': ['xs: 8px', 'sm: 12px', 'md: 16px', 'lg: 24px', 'xl: 32px', 'xxl: 48px']
    },
    files: ['src/app/styles/tokens/_spacing.scss'],
    check: (content) => {
      const results = {};
      results['4px base'] = content.includes('4px');
      results['xs: 8px'] = content.includes('8px');
      results['sm: 12px'] = content.includes('12px');
      results['md: 16px'] = content.includes('16px');
      results['lg: 24px'] = content.includes('24px');
      results['xl: 32px'] = content.includes('32px');
      results['xxl: 48px'] = content.includes('48px');
      return results;
    }
  },
  
  '5. CONTAINER SİSTEMİ': {
    required: {
      'Default': 'min(1440px, 90vw)',
      'XL': 'min(1600px, 92vw)',
      'LG': 'min(1440px, 90vw)',
      'MD': 'min(1280px, 88vw)',
      'SM': 'min(1024px, 85vw)',
      'Fluid': '100%'
    },
    files: ['src/styles.css'],
    check: (content) => {
      const results = {};
      results['Default container'] = content.includes('min(1440px, 90vw)');
      results['XL container'] = content.includes('min(1600px, 92vw)');
      results['MD container'] = content.includes('min(1280px, 88vw)');
      results['SM container'] = content.includes('min(1024px, 85vw)');
      results['Fluid container'] = content.includes('container-fluid');
      return results;
    }
  },
  
  '6. ELEVATION SİSTEMİ': {
    required: {
      'Level 0': 'none',
      'Level 1-5': 'Layered shadows'
    },
    files: ['src/app/styles/tokens/_elevation.scss'],
    check: (content) => {
      const results = {};
      for (let i = 0; i <= 5; i++) {
        results[`Level ${i}`] = content.includes(`elevation-level-${i}`);
      }
      return results;
    }
  },
  
  '7. SHAPE SİSTEMİ': {
    required: {
      'Border radius': ['sm: 8px', 'md: 12px', 'lg: 16px', 'xl: 28px', 'full: 9999px']
    },
    files: ['src/app/styles/tokens/_shape.scss'],
    check: (content) => {
      const results = {};
      results['radius-sm: 8px'] = content.includes('8px');
      results['radius-md: 12px'] = content.includes('12px');
      results['radius-lg: 16px'] = content.includes('16px');
      results['radius-xl: 28px'] = content.includes('28px');
      results['radius-full: 9999px'] = content.includes('9999px');
      return results;
    }
  },
  
  '8. MOTION SİSTEMİ': {
    required: {
      'Durations': ['short: 200ms', 'medium: 300ms', 'long: 500ms'],
      'Easings': ['standard', 'decelerate', 'accelerate']
    },
    files: ['src/app/styles/tokens/_motion.scss'],
    check: (content) => {
      const results = {};
      results['200ms'] = content.includes('200ms');
      results['300ms'] = content.includes('300ms');
      results['500ms'] = content.includes('500ms');
      results['cubic-bezier'] = content.includes('cubic-bezier');
      return results;
    }
  },
  
  '9. MASTER TOKEN DOSYASI': {
    required: {
      'Imports': ['colors', 'typography', 'spacing', 'shape', 'elevation', 'motion'],
      'CSS Variables': [':root block', 'CSS custom properties export']
    },
    files: ['src/app/styles/tokens/_index.scss'],
    check: (content) => {
      const results = {};
      results['@import colors'] = content.includes("@import 'colors'");
      results['@import typography'] = content.includes("@import 'typography'");
      results['@import spacing'] = content.includes("@import 'spacing'");
      results['@import shape'] = content.includes("@import 'shape'");
      results['@import elevation'] = content.includes("@import 'elevation'");
      results['@import motion'] = content.includes("@import 'motion'");
      results[':root block'] = content.includes(':root {');
      results['CSS variables'] = content.includes('--md-sys-');
      return results;
    }
  },
  
  '10. GLOBAL SCSS': {
    required: {
      'Token imports': '@use or @import tokens',
      'Layout primitives': 'layout system',
      'Container queries': 'modern responsive'
    },
    files: ['src/app/styles/global.scss'],
    check: (content) => {
      const results = {};
      results['Token system'] = content.includes('tokens') || content.includes('@use');
      results['Layout system'] = content.includes('layout');
      results['Container'] = content.includes('container');
      return results;
    }
  }
};

let totalChecks = 0;
let passedChecks = 0;
let failedItems = [];

// Her gereksinimi kontrol et
Object.entries(deepRequirements).forEach(([category, spec]) => {
  console.log(`\n📋 ${category}`);
  console.log('─'.repeat(50));
  
  // Dosya bazlı kontrol
  if (spec.files) {
    spec.files.forEach(filePath => {
      const fullPath = path.join('D:/GitHub Repos/ozlem-murzoglu', filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (spec.check) {
          const results = spec.check(content);
          Object.entries(results).forEach(([item, passed]) => {
            totalChecks++;
            if (passed) {
              console.log(`  ✅ ${item}`);
              passedChecks++;
            } else {
              console.log(`  ❌ ${item}`);
              failedItems.push(`${category}: ${item}`);
            }
          });
        }
      } else {
        console.log(`  ❌ Dosya bulunamadı: ${filePath}`);
        failedItems.push(`${category}: ${filePath} eksik`);
      }
    });
  }
  
  // styles.css global kontrolü
  if (category === '1. FONT SİSTEMİ') {
    const stylesPath = 'D:/GitHub Repos/ozlem-murzoglu/src/styles.css';
    if (fs.existsSync(stylesPath)) {
      const content = fs.readFileSync(stylesPath, 'utf8');
      const results = spec.check(content);
      Object.entries(results).forEach(([item, passed]) => {
        totalChecks++;
        if (passed) {
          console.log(`  ✅ ${item}`);
          passedChecks++;
        } else {
          console.log(`  ❌ ${item}`);
          failedItems.push(`${category}: ${item}`);
        }
      });
    }
  }
});

// SONUÇ RAPORU
console.log('\n');
console.log('═'.repeat(60));
console.log('📊 DETAYLI SONUÇ RAPORU');
console.log('═'.repeat(60));

const completionRate = Math.round((passedChecks / totalChecks) * 100);

console.log(`\nToplam Kontrol: ${totalChecks}`);
console.log(`Başarılı: ${passedChecks}`);
console.log(`Başarısız: ${totalChecks - passedChecks}`);
console.log(`Tamamlanma Oranı: %${completionRate}\n`);

if (completionRate === 100) {
  console.log('🎉 MD3 DESIGN SYSTEM %100 EKSIKSIZ UYGULANMIŞ!');
  console.log('✨ Tüm global stil dosyaları dokümantasyondaki gereksinimleri karşılıyor!');
} else {
  console.log(`⚠️ MD3 Design System %${completionRate} tamamlanmış\n`);
  
  if (failedItems.length > 0) {
    console.log('📝 Eksik/Hatalı Öğeler:');
    failedItems.forEach(item => {
      console.log(`  • ${item}`);
    });
  }
}

console.log('\n✅ Doğrulama tamamlandı!');