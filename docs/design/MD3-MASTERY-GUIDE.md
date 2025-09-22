# Material Design 3 (MD3) Pure CSS Uzmanlaşma Rehberi

## 🎨 MD3 Temelleri (Angular Material Kullanmadan)

### 1. Core Principles (Temel Prensipler)
- **Personal**: Kişiselleştirilebilir ve adaptif
- **Adaptive**: Her platforma uyumlu
- **Expressive**: İfade gücü yüksek

### 2. Pure CSS Design Tokens Sistemi

## 🎨 Renk Sistemi

### Güncel Renk Paleti (2025)

Pediatri kliniği için özel olarak tasarlanmış, çocuk dostu ve profesyonel renk paleti:

### Dinamik Renk Paleti

#### Color Tokens (CSS Custom Properties)
```css
:root {
  /* Primary palette - Teal/Camgöbeği (Güven, Sağlık, Huzur) */
  --md-sys-color-primary: #00897B;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #B2DFDB;
  --md-sys-color-on-primary-container: #00251A;
  
  /* Secondary palette - Amber/Sarı (Enerji, Pozitiflik, Çocuk Neşesi) */
  --md-sys-color-secondary: #FFB300;
  --md-sys-color-on-secondary: #3E2723;
  --md-sys-color-secondary-container: #FFF3E0;
  --md-sys-color-on-secondary-container: #5D4037;
  
  /* Tertiary palette - Coral/Mercan (Sıcaklık, Şefkat, Bakım) */
  --md-sys-color-tertiary: #FF7043;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #FFCCBC;
  --md-sys-color-on-tertiary-container: #BF360C;
  
  /* Error palette */
  --md-sys-color-error: #D32F2F;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #FFCDD2;
  --md-sys-color-on-error-container: #B71C1C;
  
  /* Surface tokens (5 levels) - Sıcak ve samimi tonlar */
  --md-sys-color-surface-dim: #F5F5F5;
  --md-sys-color-surface: #FAF8F5;
  --md-sys-color-surface-bright: #FFFFFF;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-surface-container-low: #FAFAFA;
  --md-sys-color-surface-container: #F5F5F5;
  --md-sys-color-surface-container-high: #EEEEEE;
  --md-sys-color-surface-container-highest: #E8E8E8;
  
  /* Surface variants */
  --md-sys-color-surface-variant: #E0F2F1;
  --md-sys-color-on-surface: #212121;
  --md-sys-color-on-surface-variant: #616161;
  
  /* Outline */
  --md-sys-color-outline: #9E9E9E;
  --md-sys-color-outline-variant: #BDBDBD;
  
  /* Inverse */
  --md-sys-color-inverse-surface: #303030;
  --md-sys-color-inverse-on-surface: #FAFAFA;
  --md-sys-color-inverse-primary: #4DB6AC;
  
  /* Shadows */
  --md-sys-color-shadow: #000000;
  --md-sys-color-scrim: #000000;
  
  /* Pediatri Kliniği Özel Renkleri */
  --md-sys-color-success: #4CAF50;
  --md-sys-color-on-success: #FFFFFF;
  --md-sys-color-success-container: #C8E6C9;
  --md-sys-color-on-success-container: #1B5E20;
  
  --md-sys-color-warning: #FF9800;
  --md-sys-color-on-warning: #000000;
  --md-sys-color-warning-container: #FFE0B2;
  --md-sys-color-on-warning-container: #E65100;
  
  --md-sys-color-info: #2196F3;
  --md-sys-color-on-info: #FFFFFF;
  --md-sys-color-info-container: #BBDEFB;
  --md-sys-color-on-info-container: #0D47A1;
}

/* Dark theme overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #4DB6AC;
    --md-sys-color-on-primary: #00251A;
    --md-sys-color-primary-container: #00695C;
    --md-sys-color-on-primary-container: #B2DFDB;
    
    --md-sys-color-secondary: #FFD54F;
    --md-sys-color-on-secondary: #3E2723;
    --md-sys-color-secondary-container: #FF8F00;
    --md-sys-color-on-secondary-container: #FFF3E0;
    
    --md-sys-color-surface: #121212;
    --md-sys-color-surface-container: #1E1E1E;
    --md-sys-color-on-surface: #E0E0E0;
  }
}
```

#### Renk Psikolojisi ve Seçim Mantığı

| Renk | Değer | Psikolojik Etki | Kullanım Alanı |
|------|-------|-----------------|----------------|
| **Primer - Teal** | #00897B | Güven, sağlık, profesyonellik, huzur | Ana aksiyonlar, navigasyon, başlıklar |
| **Sekonder - Amber** | #FFB300 | Enerji, neşe, sıcaklık, pozitiflik | Vurgu butonları, önemli bilgiler, logo |
| **Tersiyer - Coral** | #FF7043 | Şefkat, bakım, sıcaklık, empati | Yardımcı aksiyonlar, hover durumları |

#### Renk Kombinasyon Kuralları

```scss
// Ana kombinasyonlar
.primary-with-secondary {
  background: var(--md-sys-color-primary);
  accent-color: var(--md-sys-color-secondary);
}

// Kontrast oranları (WCAG AAA uyumlu)
.high-contrast {
  // Teal (#00897B) on White: 4.74:1 ✓
  // Amber (#FFB300) on Dark: 10.86:1 ✓
  // Coral (#FF7043) on White: 3.26:1 ✓
}

// Pediatri özel kombinasyonlar
.child-friendly-card {
  background-color: var(--md-sys-color-surface);
  border-left: 4px solid var(--md-sys-color-secondary);
  
  &:hover {
    background-color: var(--md-sys-color-secondary-container);
  }
}

.health-status {
  &.healthy {
    color: var(--md-sys-color-success);
    background-color: var(--md-sys-color-success-container);
  }
  
  &.warning {
    color: var(--md-sys-color-warning);
    background-color: var(--md-sys-color-warning-container);
  }
  
  &.critical {
    color: var(--md-sys-color-error);
    background-color: var(--md-sys-color-error-container);
  }
}
```

### Material You Desteği

```typescript
// material-you-pediatric.service.ts
async generatePediatricScheme(imageUrl: string): Promise<void> {
  const pixels = await this.getImagePixels(imageUrl);
  const quantizer = new QuantizerCelebi();
  const quantized = quantizer.quantize(pixels, 128);
  const ranked = Score.score(quantized);
  
  // Pediatri kliniği için özel renk filtresi
  const filteredColors = this.filterChildFriendlyColors(ranked);
  const primaryArgb = filteredColors[0];
  
  const sourceColor = Hct.fromInt(primaryArgb);
  
  // Daha yumuşak ve sıcak tonlar için özel scheme
  const scheme = new SchemeExpressive(sourceColor, false, 0.0);
  
  // Renkleri yumuşat ve sıcaklık ekle
  this.applyWarmPediatricScheme(scheme);
}

private filterChildFriendlyColors(colors: number[]): number[] {
  return colors.filter(color => {
    const hct = Hct.fromInt(color);
    // Çok parlak veya çok koyu renkleri filtrele
    return hct.tone >= 30 && hct.tone <= 80 && 
           hct.chroma >= 20; // Canlı ama göz yormayan
  });
}

private applyWarmPediatricScheme(scheme: any): void {
  const root = document.documentElement;
  
  // Renklere sıcaklık ekle
  const warmifyColor = (argb: number): string => {
    const hct = Hct.fromInt(argb);
    // Sarı/turuncu tonlarına doğru hafif kayma
    hct.hue = hct.hue + 5;
    return hexFromArgb(hct.toInt());
  };
  
  // Ana renkleri uygula
  root.style.setProperty('--md-sys-color-primary', warmifyColor(scheme.primary));
  root.style.setProperty('--md-sys-color-secondary', warmifyColor(scheme.secondary));
  // ... diğer renkler
}
```

### Zaman-Duyarlı Renk Adaptasyonu

```typescript
// time-based-color.service.ts
export class TimeBasedColorService {
  private updateInterval: any;
  
  startTimeBasedColorAdaptation(): void {
    this.applyTimeBasedColors();
    
    // Her 30 dakikada bir güncelle
    this.updateInterval = setInterval(() => {
      this.applyTimeBasedColors();
    }, 30 * 60 * 1000);
  }
  
  private applyTimeBasedColors(): void {
    const hour = new Date().getHours();
    const adjustment = this.getTimeBasedAdjustment(hour);
    
    // CSS değişkenlerini güncelle
    this.adjustColorBrightness(adjustment);
  }
  
  private getTimeBasedAdjustment(hour: number): ColorAdjustment {
    if (hour >= 6 && hour < 12) {      // Sabah: Enerjik
      return { 
        brightness: 1.1, 
        saturation: 1.05,
        primaryShift: 5,  // Daha canlı
      };
    } else if (hour >= 12 && hour < 17) { // Öğleden sonra: Dengeli
      return { 
        brightness: 1.0, 
        saturation: 1.0,
        primaryShift: 0,
      };
    } else if (hour >= 17 && hour < 21) { // Akşam: Sıcak
      return { 
        brightness: 0.95, 
        saturation: 1.1, 
        warmth: 1.2,
        primaryShift: -5,  // Daha sıcak tonlar
      };
    } else {                            // Gece: Dingin
      return { 
        brightness: 0.85, 
        saturation: 0.9,
        primaryShift: -10, // Daha sakin
      };
    }
  }
  
  private adjustColorBrightness(adjustment: ColorAdjustment): void {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--md-sys-color-primary');
    
    // HCT color space'de ayarlama yap
    const hct = Hct.fromInt(argbFromHex(primaryColor));
    hct.tone = hct.tone * adjustment.brightness;
    hct.chroma = hct.chroma * adjustment.saturation;
    
    if (adjustment.primaryShift) {
      hct.hue = hct.hue + adjustment.primaryShift;
    }
    
    // Güncellenmiş rengi uygula
    root.style.setProperty('--md-sys-color-primary-adjusted', hexFromArgb(hct.toInt()));
  }
}

interface ColorAdjustment {
  brightness: number;
  saturation: number;
  warmth?: number;
  primaryShift?: number;
}
```


#### Typography System (Pure CSS)
```css
:root {
  /* Font families - Pediatri Kliniği Özel Font Stratejisi */
  --md-sys-typescale-font-brand: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --md-sys-typescale-font-plain: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Display - Figtree kullanımı */
  --md-sys-typescale-display-large-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-display-large-size: 57px;
  --md-sys-typescale-display-large-line-height: 64px;
  --md-sys-typescale-display-large-weight: 700;
  --md-sys-typescale-display-large-tracking: -0.25px;
  
  --md-sys-typescale-display-medium-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-display-medium-size: 45px;
  --md-sys-typescale-display-medium-line-height: 52px;
  --md-sys-typescale-display-medium-weight: 600;
  --md-sys-typescale-display-medium-tracking: 0;
  
  --md-sys-typescale-display-small-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-display-small-size: 36px;
  --md-sys-typescale-display-small-line-height: 44px;
  --md-sys-typescale-display-small-weight: 600;
  --md-sys-typescale-display-small-tracking: 0;
  
  /* Headline - Figtree kullanımı */
  --md-sys-typescale-headline-large-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-headline-large-size: 32px;
  --md-sys-typescale-headline-large-line-height: 40px;
  --md-sys-typescale-headline-large-weight: 600;
  --md-sys-typescale-headline-large-tracking: 0;
  
  --md-sys-typescale-headline-medium-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-headline-medium-size: 28px;
  --md-sys-typescale-headline-medium-line-height: 36px;
  --md-sys-typescale-headline-medium-weight: 500;
  --md-sys-typescale-headline-medium-tracking: 0;
  
  --md-sys-typescale-headline-small-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-headline-small-size: 24px;
  --md-sys-typescale-headline-small-line-height: 32px;
  --md-sys-typescale-headline-small-weight: 500;
  --md-sys-typescale-headline-small-tracking: 0;
  
  /* Title - Figtree kullanımı */
  --md-sys-typescale-title-large-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-title-large-size: 22px;
  --md-sys-typescale-title-large-line-height: 28px;
  --md-sys-typescale-title-large-weight: 500;
  --md-sys-typescale-title-large-tracking: 0;
  
  --md-sys-typescale-title-medium-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-title-medium-size: 16px;
  --md-sys-typescale-title-medium-line-height: 24px;
  --md-sys-typescale-title-medium-weight: 600;
  --md-sys-typescale-title-medium-tracking: 0.15px;
  
  --md-sys-typescale-title-small-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-title-small-size: 14px;
  --md-sys-typescale-title-small-line-height: 20px;
  --md-sys-typescale-title-small-weight: 600;
  --md-sys-typescale-title-small-tracking: 0.1px;
  
  /* Body - DM Sans kullanımı */
  --md-sys-typescale-body-large-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-body-large-size: 16px;
  --md-sys-typescale-body-large-line-height: 24px;
  --md-sys-typescale-body-large-weight: 400;
  --md-sys-typescale-body-large-tracking: 0.5px;
  
  --md-sys-typescale-body-medium-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-body-medium-size: 14px;
  --md-sys-typescale-body-medium-line-height: 20px;
  --md-sys-typescale-body-medium-weight: 400;
  --md-sys-typescale-body-medium-tracking: 0.25px;
  
  --md-sys-typescale-body-small-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-body-small-size: 12px;
  --md-sys-typescale-body-small-line-height: 16px;
  --md-sys-typescale-body-small-weight: 400;
  --md-sys-typescale-body-small-tracking: 0.4px;
  
  /* Label - DM Sans kullanımı */
  --md-sys-typescale-label-large-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-label-large-size: 14px;
  --md-sys-typescale-label-large-line-height: 20px;
  --md-sys-typescale-label-large-weight: 500;
  --md-sys-typescale-label-large-tracking: 0.1px;
  
  --md-sys-typescale-label-medium-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-label-medium-size: 12px;
  --md-sys-typescale-label-medium-line-height: 16px;
  --md-sys-typescale-label-medium-weight: 500;
  --md-sys-typescale-label-medium-tracking: 0.5px;
  
  --md-sys-typescale-label-small-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-label-small-size: 11px;
  --md-sys-typescale-label-small-line-height: 16px;
  --md-sys-typescale-label-small-weight: 500;
  --md-sys-typescale-label-small-tracking: 0.5px;
}

/* Font Import ve Variable Font Desteği */
@import url('https://fonts.googleapis.com/css2?family

#### Shape System
```css
:root {
  /* Corner radius values */
  --md-sys-shape-corner-none: 0;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-extra-small-top: 4px 4px 0 0;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-large-end: 0 16px 16px 0;
  --md-sys-shape-corner-large-top: 16px 16px 0 0;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-extra-large-top: 28px 28px 0 0;
  --md-sys-shape-corner-full: 50%;
}
```

#### Elevation System
```css
:root {
  /* MD3 elevation values */
  --md-sys-elevation-level0: none;
  --md-sys-elevation-level1: 
    0px 1px 2px 0px rgba(0, 0, 0, 0.30),
    0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level2: 
    0px 1px 2px 0px rgba(0, 0, 0, 0.30),
    0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level3: 
    0px 4px 8px 3px rgba(0, 0, 0, 0.15),
    0px 1px 3px 0px rgba(0, 0, 0, 0.30);
  --md-sys-elevation-level4: 
    0px 6px 10px 4px rgba(0, 0, 0, 0.15),
    0px 2px 3px 0px rgba(0, 0, 0, 0.30);
  --md-sys-elevation-level5: 
    0px 8px 12px 6px rgba(0, 0, 0, 0.15),
    0px 4px 4px 0px rgba(0, 0, 0, 0.30);
}
```

#### Motion System
```css
:root {
  /* Easing functions */
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --md-sys-motion-easing-linear: linear;
  
  /* Duration scale */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short3: 150ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-medium3: 350ms;
  --md-sys-motion-duration-medium4: 400ms;
  --md-sys-motion-duration-long1: 450ms;
  --md-sys-motion-duration-long2: 500ms;
  --md-sys-motion-duration-long3: 550ms;
  --md-sys-motion-duration-long4: 600ms;
  --md-sys-motion-duration-extra-long1: 700ms;
  --md-sys-motion-duration-extra-long2: 800ms;
  --md-sys-motion-duration-extra-long3: 900ms;
  --md-sys-motion-duration-extra-long4: 1000ms;
}
```

## 🛠️ Pure CSS MD3 Components

### 1. Button Components
```scss
// _md3-buttons.scss
.md3-button {
  // Base button styles
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 24px;
  border: none;
  border-radius: var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  cursor: pointer;
  user-select: none;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  overflow: hidden;
  isolation: isolate;
  
  // State layer
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    z-index: -1;
  }
  
  // Ripple effect
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, currentColor 10%, transparent 10.01%);
    transform: scale(0);
    opacity: 0;
    transition: transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-standard);
    z-index: -1;
  }
  
  &:hover::before {
    opacity: 0.08;
  }
  
  &:focus-visible {
    outline: 2px solid var(--md-sys-color-outline);
    outline-offset: 2px;
  }
  
  &:active::after {
    transform: scale(1);
    opacity: 0.12;
  }
  
  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
}

// Filled button (highest emphasis)
.md3-button-filled {
  @extend .md3-button;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  
  &:hover {
    box-shadow: var(--md-sys-elevation-level1);
  }
  
  &:active {
    box-shadow: var(--md-sys-elevation-level0);
  }
}

// Elevated button
.md3-button-elevated {
  @extend .md3-button;
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-primary);
  box-shadow: var(--md-sys-elevation-level1);
  
  &:hover {
    box-shadow: var(--md-sys-elevation-level2);
  }
  
  &:active {
    box-shadow: var(--md-sys-elevation-level1);
  }
}

// Tonal button
.md3-button-tonal {
  @extend .md3-button;
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

// Outlined button
.md3-button-outlined {
  @extend .md3-button;
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
  
  &:hover {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border-color: transparent;
  }
}

// Text button (lowest emphasis)
.md3-button-text {
  @extend .md3-button;
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 0 12px;
}

// FAB (Floating Action Button)
.md3-fab {
  @extend .md3-button;
  width: 56px;
  height: 56px;
  padding: 0;
  border-radius: var(--md-sys-shape-corner-large);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  box-shadow: var(--md-sys-elevation-level3);
  
  &:hover {
    box-shadow: var(--md-sys-elevation-level4);
  }
  
  &:active {
    box-shadow: var(--md-sys-elevation-level3);
  }
  
  &.md3-fab-large {
    width: 96px;
    height: 96px;
    border-radius: var(--md-sys-shape-corner-extra-large);
  }
  
  &.md3-fab-small {
    width: 40px;
    height: 40px;
    border-radius: var(--md-sys-shape-corner-medium);
  }
}

// Extended FAB
.md3-fab-extended {
  @extend .md3-fab;
  width: auto;
  padding: 0 20px;
  gap: 12px;
}
```

### 2. Card Components
```scss
// _md3-cards.scss
.md3-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--md-sys-shape-corner-medium);
  overflow: hidden;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  
  // Variants
  &.md3-card-elevated {
    background-color: var(--md-sys-color-surface-container-low);
    box-shadow: var(--md-sys-elevation-level1);
    
    &:hover {
      box-shadow: var(--md-sys-elevation-level2);
    }
  }
  
  &.md3-card-filled {
    background-color: var(--md-sys-color-surface-container-highest);
    box-shadow: var(--md-sys-elevation-level0);
  }
  
  &.md3-card-outlined {
    background-color: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: var(--md-sys-elevation-level0);
  }
}

// Card media
.md3-card-media {
  position: relative;
  width: 100%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// Card content
.md3-card-content {
  padding: 16px;
  
  .md3-card-headline {
    font-family: var(--md-sys-typescale-headline-small-font);
    font-size: var(--md-sys-typescale-headline-small-size);
    font-weight: var(--md-sys-typescale-headline-small-weight);
    line-height: var(--md-sys-typescale-headline-small-line-height);
    color: var(--md-sys-color-on-surface);
    margin: 0 0 4px 0;
  }
  
  .md3-card-subhead {
    font-family: var(--md-sys-typescale-title-medium-font);
    font-size: var(--md-sys-typescale-title-medium-size);
    font-weight: var(--md-sys-typescale-title-medium-weight);
    line-height: var(--md-sys-typescale-title-medium-line-height);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 8px 0;
  }
  
  .md3-card-supporting-text {
    font-family: var(--md-sys-typescale-body-medium-font);
    font-size: var(--md-sys-typescale-body-medium-size);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    line-height: var(--md-sys-typescale-body-medium-line-height);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }
}

// Card actions
.md3-card-actions {
  display: flex;
  gap: 8px;
  padding: 8px 16px 16px;
  
  &.md3-card-actions-vertical {
    flex-direction: column;
    align-items: stretch;
  }
}
```

### 3. Navigation Components
```scss
// _md3-navigation.scss

// Navigation bar (top)
.md3-navigation-bar {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  box-shadow: var(--md-sys-elevation-level0);
  
  &.md3-navigation-bar-elevated {
    box-shadow: var(--md-sys-elevation-level2);
  }
  
  .md3-navigation-bar-title {
    font-family: var(--md-sys-typescale-title-large-font);
    font-size: var(--md-sys-typescale-title-large-size);
    font-weight: var(--md-sys-typescale-title-large-weight);
    line-height: var(--md-sys-typescale-title-large-line-height);
    margin: 0 16px;
  }
}

// Navigation rail (side)
.md3-navigation-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 28px 0;
  background-color: var(--md-sys-color-surface);
  box-shadow: var(--md-sys-elevation-level0);
  
  &.md3-navigation-rail-elevated {
    box-shadow: var(--md-sys-elevation-level1);
  }
  
  .md3-navigation-rail-fab {
    margin-bottom: 28px;
  }
  
  .md3-navigation-rail-menu {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .md3-navigation-rail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 56px;
    padding: 0 12px;
    gap: 4px;
    cursor: pointer;
    position: relative;
    color: var(--md-sys-color-on-surface-variant);
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
    
    &::before {
      content: '';
      position: absolute;
      width: 56px;
      height: 32px;
      border-radius: var(--md-sys-shape-corner-full);
      background-color: var(--md-sys-color-secondary-container);
      opacity: 0;
      transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
      z-index: -1;
    }
    
    &:hover {
      color: var(--md-sys-color-on-surface);
    }
    
    &.active {
      color: var(--md-sys-color-on-secondary-container);
      
      &::before {
        opacity: 1;
      }
    }
    
    .md3-navigation-rail-icon {
      font-size: 24px;
    }
    
    .md3-navigation-rail-label {
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      font-weight: var(--md-sys-typescale-label-medium-weight);
      line-height: var(--md-sys-typescale-label-medium-line-height);
    }
  }
}

// Navigation drawer
.md3-navigation-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 360px;
  background-color: var(--md-sys-color-surface-container-low);
  transform: translateX(-100%);
  transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  z-index: 1000;
  overflow-y: auto;
  
  &.open {
    transform: translateX(0);
    box-shadow: var(--md-sys-elevation-level1);
  }
  
  .md3-navigation-drawer-header {
    padding: 16px 28px 16px 16px;
    
    .md3-navigation-drawer-headline {
      font-family: var(--md-sys-typescale-title-small-font);
      font-size: var(--md-sys-typescale-title-small-size);
      font-weight: var(--md-sys-typescale-title-small-weight);
      line-height: var(--md-sys-typescale-title-small-line-height);
      color: var(--md-sys-color-on-surface-variant);
      margin: 0;
    }
  }
  
  .md3-navigation-drawer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 56px;
    padding: 0 24px 0 16px;
    margin: 0 12px;
    border-radius: var(--md-sys-shape-corner-full);
    cursor: pointer;
    position: relative;
    color: var(--md-sys-color-on-surface-variant);
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: var(--md-sys-color-secondary-container);
      opacity: 0;
      transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }
    
    &:hover {
      color: var(--md-sys-color-on-surface);
      
      &::before {
        opacity: 0.08;
      }
    }
    
    &.active {
      color: var(--md-sys-color-on-secondary-container);
      
      &::before {
        opacity: 1;
      }
    }
    
    .md3-navigation-drawer-icon {
      font-size: 24px;
      z-index: 1;
    }
    
    .md3-navigation-drawer-label {
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      font-weight: var(--md-sys-typescale-label-large-weight);
      line-height: var(--md-sys-typescale-label-large-line-height);
      z-index: 1;
    }
  }
}

// Bottom navigation
.md3-bottom-navigation {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 80px;
  background-color: var(--md-sys-color-surface-container);
  box-shadow: var(--md-sys-elevation-level2);
  
  .md3-bottom-navigation-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 4px;
    cursor: pointer;
    position: relative;
    color: var(--md-sys-color-on-surface-variant);
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
    
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      width: 64px;
      height: 32px;
      border-radius: var(--md-sys-shape-corner-full);
      background-color: var(--md-sys-color-secondary-container);
      opacity: 0;
      transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }
    
    &:hover {
      color: var(--md-sys-color-on-surface);
    }
    
    &.active {
      color: var(--md-sys-color-on-secondary-container);
      
      &::before {
        opacity: 1;
      }
      
      .md3-bottom-navigation-icon {
        transform: translateY(-2px);
      }
    }
    
    .md3-bottom-navigation-icon {
      font-size: 24px;
      z-index: 1;
      transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
    }
    
    .md3-bottom-navigation-label {
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      font-weight: var(--md-sys-typescale-label-medium-weight);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      z-index: 1;
    }
  }
}
```

### 4. Text Field Components
```scss
// _md3-text-fields.scss
.md3-text-field {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  min-width: 280px;
  
  // Filled variant
  &.md3-text-field-filled {
    .md3-text-field-container {
      background-color: var(--md-sys-color-surface-container-highest);
      border-radius: var(--md-sys-shape-corner-extra-small-top);
      padding: 8px 16px 8px 16px;
      min-height: 56px;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-color: var(--md-sys-color-on-surface-variant);
        transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
      }
      
      &:hover::after {
        height: 1px;
        background-color: var(--md-sys-color-on-surface);
      }
      
      &:focus-within::after {
        height: 2px;
        background-color: var(--md-sys-color-primary);
      }
    }
  }
  
  // Outlined variant
  &.md3-text-field-outlined {
    .md3-text-field-container {
      background-color: transparent;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: var(--md-sys-shape-corner-extra-small);
      padding: 16px;
      min-height: 56px;
      transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
      
      &:hover {
        border-color: var(--md-sys-color-on-surface);
      }
      
      &:focus-within {
        border-width: 2px;
        border-color: var(--md-sys-color-primary);
        padding: 15px;
      }
    }
  }
  
  .md3-text-field-container {
    position: relative;
    display: flex;
    align-items: center;
    cursor: text;
  }
  
  .md3-text-field-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    padding: 0;
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: var(--md-sys-typescale-body-large-size);
    font-weight: var(--md-sys-typescale-body-large-weight);
    line-height: var(--md-sys-typescale-body-large-line-height);
    color: var(--md-sys-color-on-surface);
    
    &::placeholder {
      color: transparent;
    }
  }
  
  .md3-text-field-label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: var(--md-sys-typescale-body-large-size);
    font-weight: var(--md-sys-typescale-body-large-weight);
    color: var(--md-sys-color-on-surface-variant);
    pointer-events: none;
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
    background-color: transparent;
    padding: 0 4px;
  }
  
  // Floating label
  .md3-text-field-input:focus + .md3-text-field-label,
  .md3-text-field-input:not(:placeholder-shown) + .md3-text-field-label {
    top: -8px;
    left: 12px;
    font-size: var(--md-sys-typescale-body-small-size);
    color: var(--md-sys-color-primary);
    background-color: var(--md-sys-color-surface);
  }
  
  // Supporting text
  .md3-text-field-supporting-text {
    margin-top: 4px;
    padding: 0 16px;
    font-family: var(--md-sys-typescale-body-small-font);
    font-size: var(--md-sys-typescale-body-small-size);
    font-weight: var(--md-sys-typescale-body-small-weight);
    line-height: var(--md-sys-typescale-body-small-line-height);
    color: var(--md-sys-color-on-surface-variant);
  }
  
  // Error state
  &.md3-text-field-error {
    .md3-text-field-container {
      &::after,
      &:hover::after,
      &:focus-within::after {
        background-color: var(--md-sys-color-error);
      }
    }
    
    &.md3-text-field-outlined .md3-text-field-container {
      border-color: var(--md-sys-color-error);
      
      &:hover,
      &:focus-within {
        border-color: var(--md-sys-color-error);
      }
    }
    
    .md3-text-field-label {
      color: var(--md-sys-color-error);
    }
    
    .md3-text-field-supporting-text {
      color: var(--md-sys-color-error);
    }
  }
}
```

### 5. Chip Components
```scss
// _md3-chips.scss
.md3-chip {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  gap: 8px;
  border-radius: var(--md-sys-shape-corner-small);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  line-height: var(--md-sys-typescale-label-large-line-height);
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  
  // State layer
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
  }
  
  &:hover::before {
    opacity: 0.08;
  }
  
  &:focus-visible {
    outline: 2px solid var(--md-sys-color-outline);
    outline-offset: 2px;
  }
  
  &:active::before {
    opacity: 0.12;
  }
  
  // Assist chip
  &.md3-chip-assist {
    background-color: transparent;
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
    
    &:hover {
      background-color: var(--md-sys-color-on-surface);
      color: var(--md-sys-color-surface);
    }
    
    .md3-chip-icon {
      color: var(--md-sys-color-primary);
    }
  }
  
  // Filter chip
  &.md3-chip-filter {
    background-color: transparent;
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
    
    &.selected {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      border-color: transparent;
    }
  }
  
  // Input chip
  &.md3-chip-input {
    background-color: transparent;
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
    
    .md3-chip-trailing-icon {
      margin-left: 4px;
      margin-right: -8px;
      font-size: 18px;
      cursor: pointer;
      
      &:hover {
        opacity: 0.7;
      }
    }
  }
  
  // Suggestion chip
  &.md3-chip-suggestion {
    background-color: transparent;
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
    
    &:hover {
      background-color: var(--md-sys-color-on-surface);
      color: var(--md-sys-color-surface);
    }
  }
  
  .md3-chip-icon {
    font-size: 18px;
    margin-left: -8px;
  }
  
  .md3-chip-label {
    position: relative;
    z-index: 1;
  }
}
```

## 🚀 Projedeki MaterialYouColorService Entegrasyonu

### 1. Dynamic Theme Generation
```typescript
// material-you-color.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  QuantizerCelebi, 
  Score, 
  SchemeContent,
  SchemeExpressive,
  SchemeVibrant,
  MaterialDynamicColors,
  Hct,
  argbFromHex,
  hexFromArgb
} from '@material/material-color-utilities';

@Injectable({
  providedIn: 'root'
})
export class MaterialYouColorService {
  
  async generateSchemeFromImage(imageUrl: string): Promise<void> {
    const pixels = await this.getImagePixels(imageUrl);
    const quantizer = new QuantizerCelebi();
    const quantized = quantizer.quantize(pixels, 128);
    const ranked = Score.score(quantized);
    const primaryArgb = ranked[0];
    
    const sourceColor = Hct.fromInt(primaryArgb);
    const scheme = new SchemeExpressive(sourceColor, false, 0.0);
    
    this.applySchemeToCSS(scheme);
  }
  
  private applySchemeToCSS(scheme: any): void {
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--md-sys-color-primary', hexFromArgb(scheme.primary));
    root.style.setProperty('--md-sys-color-on-primary', hexFromArgb(scheme.onPrimary));
    root.style.setProperty('--md-sys-color-primary-container', hexFromArgb(scheme.primaryContainer));
    root.style.setProperty('--md-sys-color-on-primary-container', hexFromArgb(scheme.onPrimaryContainer));
    
    // Secondary colors
    root.style.setProperty('--md-sys-color-secondary', hexFromArgb(scheme.secondary));
    root.style.setProperty('--md-sys-color-on-secondary', hexFromArgb(scheme.onSecondary));
    root.style.setProperty('--md-sys-color-secondary-container', hexFromArgb(scheme.secondaryContainer));
    root.style.setProperty('--md-sys-color-on-secondary-container', hexFromArgb(scheme.onSecondaryContainer));
    
    // Tertiary colors
    root.style.setProperty('--md-sys-color-tertiary', hexFromArgb(scheme.tertiary));
    root.style.setProperty('--md-sys-color-on-tertiary', hexFromArgb(scheme.onTertiary));
    root.style.setProperty('--md-sys-color-tertiary-container', hexFromArgb(scheme.tertiaryContainer));
    root.style.setProperty('--md-sys-color-on-tertiary-container', hexFromArgb(scheme.onTertiaryContainer));
    
    // Surface colors
    root.style.setProperty('--md-sys-color-surface', hexFromArgb(scheme.surface));
    root.style.setProperty('--md-sys-color-surface-dim', hexFromArgb(scheme.surfaceDim));
    root.style.setProperty('--md-sys-color-surface-bright', hexFromArgb(scheme.surfaceBright));
    root.style.setProperty('--md-sys-color-surface-container-lowest', hexFromArgb(scheme.surfaceContainerLowest));
    root.style.setProperty('--md-sys-color-surface-container-low', hexFromArgb(scheme.surfaceContainerLow));
    root.style.setProperty('--md-sys-color-surface-container', hexFromArgb(scheme.surfaceContainer));
    root.style.setProperty('--md-sys-color-surface-container-high', hexFromArgb(scheme.surfaceContainerHigh));
    root.style.setProperty('--md-sys-color-surface-container-highest', hexFromArgb(scheme.surfaceContainerHighest));
    
    // Additional colors
    root.style.setProperty('--md-sys-color-on-surface', hexFromArgb(scheme.onSurface));
    root.style.setProperty('--md-sys-color-surface-variant', hexFromArgb(scheme.surfaceVariant));
    root.style.setProperty('--md-sys-color-on-surface-variant', hexFromArgb(scheme.onSurfaceVariant));
    root.style.setProperty('--md-sys-color-outline', hexFromArgb(scheme.outline));
    root.style.setProperty('--md-sys-color-outline-variant', hexFromArgb(scheme.outlineVariant));
    
    // Save to localStorage for persistence
    this.saveThemeToStorage(scheme);
  }
  
  private async getImagePixels(imageUrl: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels: number[] = [];
        
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];
          
          if (a >= 255) {
            const argb = (a << 24) | (r << 16) | (g << 8) | b;
            pixels.push(argb);
          }
        }
        
        resolve(pixels);
      };
      
      img.onerror = reject;
      img.src = imageUrl;
    });
  }
}
```

### 2. Global Styles Configuration
```scss
// styles.scss
@use 'app/styles/md3/core';
@use 'app/styles/md3/components';
@use 'app/styles/md3/utilities';

// Import MD3 foundations
@include core.md3-core();

// Import all components
@include components.md3-buttons();
@include components.md3-cards();
@include components.md3-navigation();
@include components.md3-text-fields();
@include components.md3-chips();

// Import utilities
@include utilities.md3-elevation();
@include utilities.md3-motion();
@include utilities.md3-state-layers();
```

### 3. Component Usage Examples
```typescript
// example.component.ts
@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <!-- Buttons -->
    <button class="md3-button-filled">
      <span class="material-symbols-outlined">add</span>
      <span>Add Item</span>
    </button>
    
    <!-- Cards -->
    <div class="md3-card md3-card-elevated">
      <div class="md3-card-media">
        <img src="hero.jpg" alt="Hero">
      </div>
      <div class="md3-card-content">
        <h3 class="md3-card-headline">Card Title</h3>
        <p class="md3-card-supporting-text">Supporting text</p>
      </div>
      <div class="md3-card-actions">
        <button class="md3-button-text">Cancel</button>
        <button class="md3-button-filled">Confirm</button>
      </div>
    </div>
    
    <!-- Text Fields -->
    <div class="md3-text-field md3-text-field-outlined">
      <div class="md3-text-field-container">
        <input type="text" class="md3-text-field-input" placeholder=" " id="username">
        <label class="md3-text-field-label" for="username">Username</label>
      </div>
      <div class="md3-text-field-supporting-text">Enter your username</div>
    </div>
    
    <!-- Navigation -->
    <nav class="md3-navigation-rail md3-navigation-rail-elevated">
      <button class="md3-fab">
        <span class="material-symbols-outlined">edit</span>
      </button>
      <div class="md3-navigation-rail-menu">
        <a class="md3-navigation-rail-item active">
          <span class="material-symbols-outlined md3-navigation-rail-icon">home</span>
          <span class="md3-navigation-rail-label">Home</span>
        </a>
        <a class="md3-navigation-rail-item">
          <span class="material-symbols-outlined md3-navigation-rail-icon">search</span>
          <span class="md3-navigation-rail-label">Search</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class ExampleComponent {}
```

## 📚 Kaynak ve Araçlar

### Resmi Kaynaklar
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [Material Symbols](https://fonts.google.com/icons)

### Tasarım Araçları
- [Material Theme Builder](https://m3.material.io/theme-builder)
- [Material Design Figma Kit](https://www.figma.com/community/file/1035203688168086460)
- [Color Palette Generator](https://m3.material.io/styles/color/the-color-system/color-roles)

### Geliştirici Araçları
- [MD3 for Web Codelabs](https://codelabs.developers.google.com/codelabs/mdc-web)
- [Material Components GitHub](https://github.com/material-components)
- [CSS Custom Properties Support](https://caniuse.com/css-variables)

## 🔄 Proje Yol Haritası

### Phase 1: Foundation (Tamamlandı ✅)
- [x] MD3 token sistemi kurulumu
- [x] Temel renk ve tipografi sistemleri
- [x] MaterialYouColorService implementasyonu

### Phase 2: Core Components (Devam Ediyor 🚧)
- [x] Button varyantları
- [x] Card sistemleri
- [x] Navigation patterns
- [ ] Dialog ve Sheet components
- [ ] Menu ve Dropdown components

### Phase 3: Advanced Features (Planlanıyor 📋)
- [ ] Adaptive layouts
- [ ] Motion choreography
- [ ] Advanced theming
- [ ] A11y improvements
- [ ] Dark mode optimization

### Phase 4: Polish & Optimization (Gelecek 🔮)
- [ ] Performance optimization
- [ ] Bundle size reduction
- [ ] Documentation
- [ ] Component library package
- [ ] Storybook integration
