# 🚀 MD3 Pure CSS Geçiş Planı

## 📋 Özet
Bu doküman, mevcut hibrit sistemden tamamen MD3 Pure CSS sistemine geçiş için detaylı bir yol haritası sunar.

## 🎯 Hedefler
1. Angular Material bağımlılığını kaldır
2. Tüm hardcoded stilleri MD3 token'larıyla değiştir
3. Tutarlı bir Pure CSS MD3 design system oluştur
4. Performans optimizasyonu sağla

## 📊 Mevcut Durum Analizi

### Sorunlar
- **95+ hardcoded renk** değeri
- **100+ hardcoded font-family** tanımı
- **Tutarsız spacing** kullanımı
- **Angular Material** ile Pure CSS karışımı
- **Çelişkili token** sistemleri

### Güçlü Yanlar
- MD3 token altyapısı mevcut
- SCSS modüler yapı kurulu
- CSS değişkenleri tanımlı

---

## 🔄 FASE 1: Token Sistemi Standardizasyonu (1. Gün)

### 1.1 Spacing Token Sistemi Oluşturma

**Yeni Dosya:** `src/app/styles/tokens/_spacing-md3.scss`

```scss
// MD3 Spacing Scale (8px grid system)
:root {
  // Base unit: 4px
  --md-sys-spacing-base: 4px;

  // Spacing scale
  --md-sys-spacing-1: 4px;   // 0.25rem
  --md-sys-spacing-2: 8px;   // 0.5rem
  --md-sys-spacing-3: 12px;  // 0.75rem
  --md-sys-spacing-4: 16px;  // 1rem
  --md-sys-spacing-5: 20px;  // 1.25rem
  --md-sys-spacing-6: 24px;  // 1.5rem
  --md-sys-spacing-8: 32px;  // 2rem
  --md-sys-spacing-10: 40px; // 2.5rem
  --md-sys-spacing-12: 48px; // 3rem
  --md-sys-spacing-16: 64px; // 4rem
  --md-sys-spacing-20: 80px; // 5rem
  --md-sys-spacing-24: 96px; // 6rem

  // Component spacing
  --md-sys-spacing-card-padding: var(--md-sys-spacing-4);
  --md-sys-spacing-section-gap: var(--md-sys-spacing-12);
  --md-sys-spacing-container-padding: var(--md-sys-spacing-6);
}
```

### 1.2 Renk Sistemi Birleştirme

**Güncelleme:** `src/app/styles/tokens/_colors.scss`

```scss
// Eski değerleri MD3 ile eşleştir
:root {
  // Legacy to MD3 mapping (geçiş dönemi için)
  --color-primary-old: #005F73; // Eski
  --md-sys-color-primary: #00897B; // Yeni MD3

  // Tüm eski referansları yönlendir
  --color-primary: var(--md-sys-color-primary);
  --color-secondary: var(--md-sys-color-secondary);
  --color-tertiary: var(--md-sys-color-tertiary);
}
```

### 1.3 Typography Token Güncelleme

**Güncelleme:** `src/app/styles/tokens/_typography.scss`

```scss
:root {
  // Font stacks
  --md-sys-typescale-font-brand: 'Figtree', -apple-system, sans-serif;
  --md-sys-typescale-font-plain: 'DM Sans', -apple-system, sans-serif;

  // Utility classes
  .md3-display-large {
    font: var(--md-sys-typescale-display-large-weight)
          var(--md-sys-typescale-display-large-size)/var(--md-sys-typescale-display-large-line-height)
          var(--md-sys-typescale-display-large-font);
    letter-spacing: var(--md-sys-typescale-display-large-tracking);
  }
  // ... diğer utility class'lar
}
```

---

## 🔄 FASE 2: Component Migration (2-3. Gün)

### 2.1 Kritik Component Öncelik Sırası

#### Seviye 1 - Kritik (İlk gün)
1. **floating-actions.component.ts**
   ```scss
   // ESKİ
   background: '#005F73'
   color: '#FFFFFF'

   // YENİ
   background: 'var(--md-sys-color-primary)'
   color: 'var(--md-sys-color-on-primary)'
   ```

2. **appointment-section.component.ts**
   ```scss
   // WhatsApp yeşili için semantic token
   --md-sys-color-brand-whatsapp: #25D366;
   --md-sys-color-on-brand-whatsapp: #FFFFFF;
   ```

3. **header.component.css**
   - Navigation için MD3 navigation patterns uygula

#### Seviye 2 - Önemli (İkinci gün)
1. **about.component.css** (95+ hardcoded değer)
2. **services.component.css** (Font sorunları)
3. **hero-section.component.css**

#### Seviye 3 - Normal (Üçüncü gün)
1. Legal sayfalar (privacy, terms, kvkk)
2. Blog components
3. Footer component

### 2.2 Migration Script

**Otomatik Dönüşüm Script:** `scripts/migrate-to-md3.js`

```javascript
const fs = require('fs');
const path = require('path');

const colorMappings = {
  '#005F73': 'var(--md-sys-color-primary)',
  '#FFB74D': 'var(--md-sys-color-secondary)',
  '#0A9396': 'var(--md-sys-color-tertiary)',
  '#333': 'var(--md-sys-color-on-surface)',
  '#666': 'var(--md-sys-color-on-surface-variant)',
  '#f8f9fa': 'var(--md-sys-color-surface-container-low)',
  '#ffffff': 'var(--md-sys-color-surface)',
  // ... diğer eşleştirmeler
};

const fontMappings = {
  "'Figtree', sans-serif": 'var(--md-sys-typescale-font-brand)',
  "'DM Sans', sans-serif": 'var(--md-sys-typescale-font-plain)',
  '"Figtree", sans-serif': 'var(--md-sys-typescale-font-brand)',
  '"DM Sans", sans-serif': 'var(--md-sys-typescale-font-plain)',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Renkleri değiştir
  Object.entries(colorMappings).forEach(([old, newVal]) => {
    const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    content = content.replace(regex, newVal);
  });

  // Fontları değiştir
  Object.entries(fontMappings).forEach(([old, newVal]) => {
    const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, newVal);
  });

  // Spacing değerlerini değiştir
  content = content.replace(/padding:\s*(\d+)px/g, (match, px) => {
    const spacing = getSpacingToken(parseInt(px));
    return `padding: ${spacing}`;
  });

  content = content.replace(/margin:\s*(\d+)px/g, (match, px) => {
    const spacing = getSpacingToken(parseInt(px));
    return `margin: ${spacing}`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`✅ Migrated: ${filePath}`);
}

function getSpacingToken(px) {
  const spacingMap = {
    4: 'var(--md-sys-spacing-1)',
    8: 'var(--md-sys-spacing-2)',
    12: 'var(--md-sys-spacing-3)',
    16: 'var(--md-sys-spacing-4)',
    20: 'var(--md-sys-spacing-5)',
    24: 'var(--md-sys-spacing-6)',
    32: 'var(--md-sys-spacing-8)',
    40: 'var(--md-sys-spacing-10)',
    48: 'var(--md-sys-spacing-12)',
    60: 'var(--md-sys-spacing-15)',
    64: 'var(--md-sys-spacing-16)',
    80: 'var(--md-sys-spacing-20)',
  };

  return spacingMap[px] || `${px}px /* TODO: MD3 token needed */`;
}

// Tüm CSS ve TS dosyalarını tara
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !fullPath.includes('node_modules')) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.ts')) {
      migrateFile(fullPath);
    }
  });
}

// Migration başlat
console.log('🚀 Starting MD3 migration...');
scanDirectory('./src/app');
console.log('✨ Migration complete!');
```

---

## 🔄 FASE 3: Angular Material Temizliği (4. Gün)

### 3.1 Angular Material Kaldırma

```bash
# Angular Material paketlerini kaldır
npm uninstall @angular/material @angular/cdk

# Theme dosyalarını temizle
rm -rf src/app/styles/theme.scss
```

### 3.2 Pure CSS MD3 Components

**Yeni Dosya:** `src/app/styles/md3-components.scss`

```scss
// MD3 Button Components
@import 'md3/buttons';
@import 'md3/cards';
@import 'md3/navigation';
@import 'md3/forms';
@import 'md3/chips';
@import 'md3/dialogs';

// Component library
.md3-button {
  @include md3-button-base();

  &--filled {
    @include md3-button-filled();
  }

  &--outlined {
    @include md3-button-outlined();
  }

  &--text {
    @include md3-button-text();
  }
}
```

---

## 🔄 FASE 4: Test ve Doğrulama (5. Gün)

### 4.1 Visual Regression Testing

```javascript
// tests/e2e/md3-visual-test.spec.js
import { test, expect } from '@playwright/test';

test.describe('MD3 Migration Visual Tests', () => {
  const pages = [
    '/',
    '/about',
    '/services',
    '/contact',
  ];

  pages.forEach(page => {
    test(`MD3 compliance: ${page}`, async ({ page: browserPage }) => {
      await browserPage.goto(page);

      // Token kullanımını kontrol et
      const styles = await browserPage.evaluate(() => {
        const computed = getComputedStyle(document.documentElement);
        return {
          primary: computed.getPropertyValue('--md-sys-color-primary'),
          secondary: computed.getPropertyValue('--md-sys-color-secondary'),
          fontBrand: computed.getPropertyValue('--md-sys-typescale-font-brand'),
        };
      });

      expect(styles.primary).toBe('#00897b');
      expect(styles.secondary).toBe('#ffb300');

      // Visual snapshot
      await expect(browserPage).toHaveScreenshot(`md3-${page.replace('/', 'home')}.png`);
    });
  });
});
```

### 4.2 Linting Rules

**Yeni Dosya:** `.stylelintrc.md3.json`

```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "declaration-property-value-disallowed-list": {
      "font-family": ["/^(?!var\\(--md-sys-typescale-).*$/"],
      "color": ["/#[0-9a-fA-F]{3,6}/"],
      "background-color": ["/#[0-9a-fA-F]{3,6}/"],
      "padding": ["/^\\d+px$/"],
      "margin": ["/^\\d+px$/"]
    },
    "custom-property-pattern": "^(md-sys|md-ref|brand)-.*$"
  }
}
```

---

## 📊 Başarı Metrikleri

### KPI'lar
- [ ] 0 hardcoded hex color değeri
- [ ] 0 hardcoded font-family tanımı
- [ ] 100% MD3 token kullanımı
- [ ] Angular Material bağımlılığı kaldırıldı
- [ ] Bundle size %15 azaltıldı
- [ ] Lighthouse performance skoru >95

### Kontrol Listesi
- [ ] Tüm renkler MD3 token kullanıyor
- [ ] Tüm fontlar typescale değişkenleri kullanıyor
- [ ] Spacing 8px grid sistemine uygun
- [ ] Elevation MD3 seviyelerini kullanıyor
- [ ] Shape token'ları tutarlı
- [ ] Motion/animation MD3 easing kullanıyor
- [ ] Dark theme desteği eksiksiz
- [ ] Accessibility WCAG AAA uyumlu

---

## 🚀 Uygulama Takvimi

### Hafta 1
- **Pazartesi**: Token sistemi standardizasyonu
- **Salı-Çarşamba**: Kritik component migration
- **Perşembe**: Angular Material temizliği
- **Cuma**: Test ve doğrulama

### Hafta 2
- **Pazartesi-Salı**: Bug fixing
- **Çarşamba**: Documentation güncelleme
- **Perşembe**: Performance optimization
- **Cuma**: Production deployment

---

## 🛠️ Araçlar ve Scriptler

### Gerekli Araçlar
```bash
npm install -D stylelint stylelint-config-standard-scss
npm install -D playwright @playwright/test
npm install -D prettier
```

### Yardımcı Komutlar
```bash
# Migration script çalıştır
node scripts/migrate-to-md3.js

# Stil kontrolü
npx stylelint "src/**/*.{css,scss}" --config .stylelintrc.md3.json

# Visual test
npx playwright test tests/e2e/md3-visual-test.spec.js

# Token kullanım raporu
node scripts/analyze-token-usage.js
```

---

## ⚠️ Risk ve Önlemler

### Riskler
1. **Visual Breaking Changes**: Screenshot karşılaştırması ile önlenecek
2. **Performance Degradation**: Bundle analizi ile takip edilecek
3. **Browser Compatibility**: CSS variable polyfill eklenecek

### Rollback Planı
```bash
# Git branch stratejisi
git checkout -b feature/md3-migration
# Her fase için ayrı commit
git commit -m "feat(md3): Phase 1 - Token standardization"
# Sorun durumunda
git revert HEAD
```

---

## 📚 Referanslar

- [Material Design 3 Guidelines](https://m3.material.io/)
- [MD3 Web Implementation](https://github.com/material-components/material-web)
- [CSS Custom Properties Best Practices](https://web.dev/css-custom-properties/)
- Mevcut: `docs/design/MD3-MASTERY-GUIDE.md`

---

## ✅ Onay ve İmzalar

- [ ] Frontend Lead Onayı
- [ ] UX/UI Designer Onayı
- [ ] QA Team Onayı
- [ ] Product Owner Onayı

**Hazırlayan**: Claude AI Assistant
**Tarih**: 2024-01-20
**Versiyon**: 1.0.0