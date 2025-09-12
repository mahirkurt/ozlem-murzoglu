# Material Design 3 (MD3) Uzmanlaşma Rehberi

## 🎨 MD3 Temelleri

### 1. Core Principles (Temel Prensipler)
- **Personal**: Kişiselleştirilebilir ve adaptif
- **Adaptive**: Her platforma uyumlu
- **Expressive**: İfade gücü yüksek

### 2. Design Tokens Sistemi

#### Color Tokens (Renk Tokenleri)
```scss
// Primary palette
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container

// Secondary palette
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container

// Tertiary palette
--md-sys-color-tertiary
--md-sys-color-on-tertiary
--md-sys-color-tertiary-container
--md-sys-color-on-tertiary-container

// Surface tokens (5 levels)
--md-sys-color-surface-dim
--md-sys-color-surface
--md-sys-color-surface-bright
--md-sys-color-surface-container-lowest
--md-sys-color-surface-container-low
--md-sys-color-surface-container
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest
```

#### Typography Tokens
```scss
// Display - Hero moments
--md-sys-typescale-display-large
--md-sys-typescale-display-medium
--md-sys-typescale-display-small

// Headline - Section headers
--md-sys-typescale-headline-large
--md-sys-typescale-headline-medium
--md-sys-typescale-headline-small

// Title - Component headers
--md-sys-typescale-title-large
--md-sys-typescale-title-medium
--md-sys-typescale-title-small

// Body - Reading content
--md-sys-typescale-body-large
--md-sys-typescale-body-medium
--md-sys-typescale-body-small

// Label - UI elements
--md-sys-typescale-label-large
--md-sys-typescale-label-medium
--md-sys-typescale-label-small
```

#### Shape Tokens
```scss
--md-sys-shape-corner-none: 0
--md-sys-shape-corner-extra-small: 4px
--md-sys-shape-corner-small: 8px
--md-sys-shape-corner-medium: 12px
--md-sys-shape-corner-large: 16px
--md-sys-shape-corner-extra-large: 28px
--md-sys-shape-corner-full: 9999px
```

#### Motion Tokens
```scss
// Easing
--md-sys-motion-easing-emphasized
--md-sys-motion-easing-emphasized-decelerate
--md-sys-motion-easing-emphasized-accelerate
--md-sys-motion-easing-standard
--md-sys-motion-easing-linear

// Duration
--md-sys-motion-duration-short1: 50ms
--md-sys-motion-duration-short2: 100ms
--md-sys-motion-duration-short3: 150ms
--md-sys-motion-duration-short4: 200ms
--md-sys-motion-duration-medium1: 250ms
--md-sys-motion-duration-medium2: 300ms
--md-sys-motion-duration-medium3: 350ms
--md-sys-motion-duration-medium4: 400ms
--md-sys-motion-duration-long1: 450ms
--md-sys-motion-duration-long2: 500ms
--md-sys-motion-duration-long3: 550ms
--md-sys-motion-duration-long4: 600ms
```

## 🛠️ Projedeki MD3 Uygulamaları

### 1. MaterialYouColorService
Görsellerden dinamik tema üretimi:
- **QuantizerCelebi**: Dominant renkleri bulur
- **Score**: Renkleri puanlar
- **SchemeContent/Expressive/Vibrant**: Farklı tema stilleri
- **MaterialDynamicColors**: MD3 renk rolleri

### 2. SCSS Theme System
```scss
// _md3-theme.scss kullanımı
@use 'app/styles/md3-theme' as theme;

// Button örneği
.my-button {
  @include theme.button-filled;
}

// Card örneği
.my-card {
  @include theme.card-elevated;
}

// Text field örneği
.my-input {
  @include theme.text-field-outlined;
}
```

### 3. State Layer System
```scss
// Hover, focus, pressed durumları
@mixin state-layer($color, $opacity: 0.08) {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: $color;
    opacity: 0;
    transition: opacity 200ms;
  }
  
  &:hover::before {
    opacity: $opacity;
  }
  
  &:focus-visible::before {
    opacity: calc($opacity * 1.5);
  }
  
  &:active::before {
    opacity: calc($opacity * 1.5);
  }
}
```

## 📚 MD3 Best Practices

### 1. Renk Kullanımı
```typescript
// ✅ Doğru: Semantic color kullan
background-color: var(--md-sys-color-surface-container);
color: var(--md-sys-color-on-surface);

// ❌ Yanlış: Hard-coded renkler
background-color: #f5f5f5;
color: #333;
```

### 2. Tipografi Hiyerarşisi
```scss
// ✅ Doğru: MD3 type scale kullan
.page-title {
  @extend .display-large;
}

.section-title {
  @extend .headline-medium;
}

.body-text {
  @extend .body-large;
}
```

### 3. Elevation Kullanımı
```scss
// MD3 elevation levels (0-5)
@mixin apply-elevation($level) {
  @if $level == 0 {
    box-shadow: none;
  } @else if $level == 1 {
    box-shadow: 
      0px 1px 2px rgba(0, 0, 0, 0.3),
      0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  } @else if $level == 2 {
    box-shadow: 
      0px 1px 2px rgba(0, 0, 0, 0.3),
      0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  }
  // ... levels 3-5
}
```

### 4. Component Patterns

#### Buttons
```scss
// Hierarchy: FAB > Filled > Elevated > Outlined > Text
.fab-primary { /* Most emphasis */ }
.button-filled { /* High emphasis */ }
.button-elevated { /* Medium emphasis */ }
.button-outlined { /* Medium-low emphasis */ }
.button-text { /* Low emphasis */ }
```

#### Cards
```scss
// Three variants
.card-elevated { /* Default */ }
.card-filled { /* Subtle background */ }
.card-outlined { /* Border only */ }
```

#### Navigation
```scss
// Navigation rail (side)
.nav-rail {
  width: 80px;
  // Centered icons with labels
}

// Navigation drawer (modal)
.nav-drawer {
  width: 360px;
  // Full menu with sections
}

// Bottom navigation (mobile)
.bottom-nav {
  height: 80px;
  // 3-5 destinations
}
```

## 🚀 İleri Seviye MD3 Özellikleri

### 1. Dynamic Color (Material You)
```typescript
// Görseldan tema üret
const colorService = inject(MaterialYouColorService);
await colorService.generateSchemeFromImage('/assets/hero.jpg');

// Farklı şema tipleri
colorService.setSchemeType('expressive'); // Daha canlı
colorService.setSchemeType('vibrant');    // Çok canlı
colorService.setSchemeType('neutral');    // Nötr
colorService.setSchemeType('monochrome'); // Tek renk
```

### 2. Adaptive Layouts
```scss
// Compact (phones)
@media (max-width: 599px) {
  --md-sys-shape-corner-large: 12px;
  --md-sys-typescale-display-large-size: 45px;
}

// Medium (tablets)
@media (min-width: 600px) and (max-width: 839px) {
  --md-sys-shape-corner-large: 16px;
  --md-sys-typescale-display-large-size: 57px;
}

// Expanded (desktop)
@media (min-width: 840px) {
  --md-sys-shape-corner-large: 28px;
  --md-sys-typescale-display-large-size: 64px;
}
```

### 3. Accessibility
```scss
// High contrast mode
@media (prefers-contrast: high) {
  --md-sys-color-outline: rgba(0, 0, 0, 0.87);
  --md-sys-state-hover-opacity: 0.12;
  --md-sys-state-focus-opacity: 0.16;
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎯 Angular Material 18 MD3 Entegrasyonu

### Kurulum
```bash
ng add @angular/material
# Material 3 seçeneğini seçin
```

### Theme Yapılandırması
```scss
// styles.scss
@use '@angular/material' as mat;

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$green-palette,
  ),
  typography: (
    brand-family: 'Figtree',
    plain-family: 'DM Sans',
  ),
  density: (
    scale: 0,
  ),
));

@include mat.all-component-themes($theme);
```

### Component Kullanımı
```typescript
// Standalone component
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>MD3 Card</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Material Design 3 içerik</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>CANCEL</button>
        <button mat-raised-button color="primary">SAVE</button>
      </mat-card-actions>
    </mat-card>
  `
})
```

## 📖 Kaynaklar

- [Material Design 3 Official](https://m3.material.io/)
- [Angular Material Docs](https://material.angular.dev/)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [Material Theme Builder](https://m3.material.io/theme-builder)
- [MD3 Figma Kit](https://www.figma.com/community/file/1035203688168086460)

## 🔄 Güncelleme Notları

### Angular Material 18.2+ ile MD3
- Stable MD3 support
- CSS custom properties based
- Dynamic theming support
- Backwards compatible with MD2

### Projedeki Geliştirilecek Alanlar
1. Angular Material componentlerini entegre et
2. MD3 navigation patterns uygula
3. Adaptive layout breakpoints ekle
4. Motion choreography geliştir
5. A11y (accessibility) iyileştirmeleri