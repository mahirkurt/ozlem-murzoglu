# Material Design 3 Expressive Design System
## Pure CSS Implementation Guide

> **Source of Truth** - Modern MD3 Expressive implementasyonu için kapsamlı rehber
> 
> Bu doküman [material.io/design](https://m3.material.io/) spesifikasyonlarına göre hazırlanmıştır.

## 🎯 Table of Contents

1. [Expressive Theme Overview](#expressive-theme-overview)
2. [Design Tokens System](#design-tokens-system)
3. [Color System (Expressive)](#color-system-expressive)
4. [Typography (Expressive)](#typography-expressive)
5. [Shape & Layout](#shape--layout)
6. [Motion & Animation](#motion--animation)
7. [Component Library](#component-library)
8. [Advanced Features](#advanced-features)
9. [Implementation Guide](#implementation-guide)
10. [Dynamic Theming](#dynamic-theming)

---

## 🌟 Expressive Theme Overview

MD3 Expressive theme, duygusal bağ kuran, kişiselleştirilebilir ve dinamik deneyimler yaratmak için tasarlanmıştır. Bu tema:

- **Vibrant Colors**: Daha canlı ve ifadeli renk paletleri
- **Dynamic Shapes**: Adaptif ve organik şekil dili
- **Expressive Motion**: Duygusal hareket ve animasyonlar
- **Personal Touch**: Kullanıcıya özel tema adaptasyonu

### Core Principles
- **Emotional**: Duygusal bağlantı kuran tasarım
- **Dynamic**: Dinamik ve akıcı deneyimler
- **Personalized**: Kişiselleştirilebilir ve adaptif
- **Contextual**: Bağlama duyarlı tasarım

---

## 🎨 Design Tokens System

### Global CSS Variables Structure
```css
:root {
  /* ===== EXPRESSIVE COLOR SYSTEM ===== */
  
  /* Primary Expressive Palette */
  --md-sys-color-primary: #6200ea;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #bb86fc;
  --md-sys-color-on-primary-container: #1a0033;
  
  /* Secondary Expressive Palette */
  --md-sys-color-secondary: #03dac6;
  --md-sys-color-on-secondary: #000000;
  --md-sys-color-secondary-container: #80e5d7;
  --md-sys-color-on-secondary-container: #001f1c;
  
  /* Tertiary Expressive Palette */
  --md-sys-color-tertiary: #ff6b35;
  --md-sys-color-on-tertiary: #ffffff;
  --md-sys-color-tertiary-container: #ffb099;
  --md-sys-color-on-tertiary-container: #331100;
  
  /* Error Palette */
  --md-sys-color-error: #cf6679;
  --md-sys-color-on-error: #000000;
  --md-sys-color-error-container: #f2b8c5;
  --md-sys-color-on-error-container: #1e0001;
  
  /* Expressive Surface Colors (Enhanced) */
  --md-sys-color-surface-dim: #ddd8e0;
  --md-sys-color-surface: #fef8ff;
  --md-sys-color-surface-bright: #ffffff;
  --md-sys-color-surface-container-lowest: #ffffff;
  --md-sys-color-surface-container-low: #f8f2ff;
  --md-sys-color-surface-container: #f3eefd;
  --md-sys-color-surface-container-high: #ece7f6;
  --md-sys-color-surface-container-highest: #e6e1f0;
  
  /* Surface Variants */
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface: #1c1b1f;
  --md-sys-color-on-surface-variant: #49454f;
  
  /* Outline Colors */
  --md-sys-color-outline: #79747e;
  --md-sys-color-outline-variant: #cac4d0;
  
  /* Inverse Colors */
  --md-sys-color-inverse-surface: #313033;
  --md-sys-color-inverse-on-surface: #f4eff4;
  --md-sys-color-inverse-primary: #d0bcff;
  
  /* Shadow & Scrim */
  --md-sys-color-shadow: #000000;
  --md-sys-color-scrim: #000000;
  
  /* ===== EXPRESSIVE GRADIENTS ===== */
  --md-sys-gradient-primary: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-tertiary) 100%);
  --md-sys-gradient-surface: linear-gradient(180deg, var(--md-sys-color-surface-container-low) 0%, var(--md-sys-color-surface-container-high) 100%);
  --md-sys-gradient-accent: radial-gradient(circle at 30% 30%, var(--md-sys-color-secondary) 0%, transparent 70%);
}

/* Dark Theme Expressive */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #bb86fc;
    --md-sys-color-on-primary: #1a0033;
    --md-sys-color-primary-container: #6200ea;
    --md-sys-color-on-primary-container: #e8d5ff;
    
    --md-sys-color-secondary: #03dac6;
    --md-sys-color-on-secondary: #001f1c;
    --md-sys-color-secondary-container: #004d45;
    --md-sys-color-on-secondary-container: #80e5d7;
    
    --md-sys-color-surface: #121212;
    --md-sys-color-on-surface: #e3e3e3;
    --md-sys-color-surface-container: #1e1e1e;
    --md-sys-color-surface-container-high: #262626;
    --md-sys-color-surface-container-highest: #2d2d2d;
  }
}
```

---

## 🎨 Color System (Expressive)

### Dynamic Color Generation
```css
/* Expressive Color Utilities */
.md-color-primary-expressive {
  background: var(--md-sys-gradient-primary);
  color: var(--md-sys-color-on-primary);
}

.md-color-surface-expressive {
  background: var(--md-sys-gradient-surface);
  color: var(--md-sys-color-on-surface);
}

.md-color-accent-overlay {
  position: relative;
}

.md-color-accent-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--md-sys-gradient-accent);
  opacity: 0.1;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.md-color-accent-overlay:hover::before {
  opacity: 0.2;
}

/* Color Harmonies */
.md-color-harmonious {
  --harmony-color-1: var(--md-sys-color-primary);
  --harmony-color-2: var(--md-sys-color-secondary);
  --harmony-color-3: var(--md-sys-color-tertiary);
  
  background: conic-gradient(
    from 0deg at 50% 50%,
    var(--harmony-color-1) 0deg 120deg,
    var(--harmony-color-2) 120deg 240deg,
    var(--harmony-color-3) 240deg 360deg
  );
}
```

---

## 📝 Typography (Expressive)

### Enhanced Typography Scale
```css
:root {
  /* Font Families - Expressive */
  --md-sys-typescale-font-brand: 'Google Sans', 'Roboto Flex', system-ui;
  --md-sys-typescale-font-plain: 'Roboto', system-ui;
  --md-sys-typescale-font-mono: 'Roboto Mono', 'JetBrains Mono', monospace;
  
  /* Display Scale - Expressive */
  --md-sys-typescale-display-large-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-display-large-size: clamp(3.5rem, 8vw, 6rem);
  --md-sys-typescale-display-large-line-height: 1.1;
  --md-sys-typescale-display-large-weight: 300;
  --md-sys-typescale-display-large-tracking: -0.5px;
  
  --md-sys-typescale-display-medium-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-display-medium-size: clamp(2.8rem, 6vw, 4.5rem);
  --md-sys-typescale-display-medium-line-height: 1.15;
  --md-sys-typescale-display-medium-weight: 300;
  --md-sys-typescale-display-medium-tracking: -0.25px;
  
  --md-sys-typescale-display-small-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-display-small-size: clamp(2.25rem, 4vw, 3.6rem);
  --md-sys-typescale-display-small-line-height: 1.2;
  --md-sys-typescale-display-small-weight: 400;
  --md-sys-typescale-display-small-tracking: 0;
  
  /* Headline Scale - Expressive */
  --md-sys-typescale-headline-large-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-headline-large-size: clamp(2rem, 3vw, 2rem);
  --md-sys-typescale-headline-large-line-height: 1.25;
  --md-sys-typescale-headline-large-weight: 500;
  --md-sys-typescale-headline-large-tracking: 0;
  
  --md-sys-typescale-headline-medium-font: var(--md-sys-typescale-font-brand);
  --md-sys-typescale-headline-medium-size: clamp(1.75rem, 2.5vw, 1.75rem);
  --md-sys-typescale-headline-medium-line-height: 1.3;
  --md-sys-typescale-headline-medium-weight: 500;
  --md-sys-typescale-headline-medium-tracking: 0;
  
  --md-sys-typescale-headline-small-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-headline-small-size: 1.5rem;
  --md-sys-typescale-headline-small-line-height: 1.35;
  --md-sys-typescale-headline-small-weight: 500;
  --md-sys-typescale-headline-small-tracking: 0;
  
  /* Title Scale */
  --md-sys-typescale-title-large-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-title-large-size: 1.375rem;
  --md-sys-typescale-title-large-line-height: 1.4;
  --md-sys-typescale-title-large-weight: 500;
  --md-sys-typescale-title-large-tracking: 0;
  
  --md-sys-typescale-title-medium-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-title-medium-size: 1rem;
  --md-sys-typescale-title-medium-line-height: 1.5;
  --md-sys-typescale-title-medium-weight: 500;
  --md-sys-typescale-title-medium-tracking: 0.15px;
  
  --md-sys-typescale-title-small-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-title-small-size: 0.875rem;
  --md-sys-typescale-title-small-line-height: 1.45;
  --md-sys-typescale-title-small-weight: 500;
  --md-sys-typescale-title-small-tracking: 0.1px;
  
  /* Body Scale */
  --md-sys-typescale-body-large-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-body-large-size: 1rem;
  --md-sys-typescale-body-large-line-height: 1.6;
  --md-sys-typescale-body-large-weight: 400;
  --md-sys-typescale-body-large-tracking: 0.5px;
  
  --md-sys-typescale-body-medium-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-body-medium-size: 0.875rem;
  --md-sys-typescale-body-medium-line-height: 1.55;
  --md-sys-typescale-body-medium-weight: 400;
  --md-sys-typescale-body-medium-tracking: 0.25px;
  
  --md-sys-typescale-body-small-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-body-small-size: 0.75rem;
  --md-sys-typescale-body-small-line-height: 1.5;
  --md-sys-typescale-body-small-weight: 400;
  --md-sys-typescale-body-small-tracking: 0.4px;
  
  /* Label Scale */
  --md-sys-typescale-label-large-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-label-large-size: 0.875rem;
  --md-sys-typescale-label-large-line-height: 1.4;
  --md-sys-typescale-label-large-weight: 500;
  --md-sys-typescale-label-large-tracking: 0.1px;
  
  --md-sys-typescale-label-medium-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-label-medium-size: 0.75rem;
  --md-sys-typescale-label-medium-line-height: 1.35;
  --md-sys-typescale-label-medium-weight: 500;
  --md-sys-typescale-label-medium-tracking: 0.5px;
  
  --md-sys-typescale-label-small-font: var(--md-sys-typescale-font-plain);
  --md-sys-typescale-label-small-size: 0.6875rem;
  --md-sys-typescale-label-small-line-height: 1.3;
  --md-sys-typescale-label-small-weight: 500;
  --md-sys-typescale-label-small-tracking: 0.5px;
}

/* Typography Utility Classes */
.md-typescale-display-large {
  font-family: var(--md-sys-typescale-display-large-font);
  font-size: var(--md-sys-typescale-display-large-size);
  line-height: var(--md-sys-typescale-display-large-line-height);
  font-weight: var(--md-sys-typescale-display-large-weight);
  letter-spacing: var(--md-sys-typescale-display-large-tracking);
}

.md-typescale-display-medium {
  font-family: var(--md-sys-typescale-display-medium-font);
  font-size: var(--md-sys-typescale-display-medium-size);
  line-height: var(--md-sys-typescale-display-medium-line-height);
  font-weight: var(--md-sys-typescale-display-medium-weight);
  letter-spacing: var(--md-sys-typescale-display-medium-tracking);
}

.md-typescale-headline-large {
  font-family: var(--md-sys-typescale-headline-large-font);
  font-size: var(--md-sys-typescale-headline-large-size);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}

.md-typescale-body-large {
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}

/* Expressive Typography Effects */
.md-typography-expressive {
  background: var(--md-sys-gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

---

## 🔷 Shape & Layout

### Expressive Shape System
```css
:root {
  /* Dynamic Shape Values */
  --md-sys-shape-corner-none: 0;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 50%;
  
  /* Expressive Shape Variations */
  --md-sys-shape-corner-organic: 8px 24px 8px 24px;
  --md-sys-shape-corner-playful: 4px 16px 4px 16px;
  --md-sys-shape-corner-dynamic: 12px 28px 12px 28px;
  
  /* Container Constraints */
  --md-sys-container-max-width: 1200px;
  --md-sys-container-margin: max(16px, calc((100vw - var(--md-sys-container-max-width)) / 2));
  
  /* Grid System */
  --md-sys-grid-columns: 12;
  --md-sys-grid-gap: clamp(16px, 3vw, 24px);
  --md-sys-grid-margin: var(--md-sys-container-margin);
}

/* Layout Utilities */
.md-container {
  max-width: var(--md-sys-container-max-width);
  margin-inline: auto;
  padding-inline: var(--md-sys-container-margin);
}

.md-grid {
  display: grid;
  grid-template-columns: repeat(var(--md-sys-grid-columns), 1fr);
  gap: var(--md-sys-grid-gap);
  margin-inline: var(--md-sys-grid-margin);
}

.md-flex {
  display: flex;
  gap: var(--md-sys-grid-gap);
}

/* Shape Utilities */
.md-shape-organic {
  border-radius: var(--md-sys-shape-corner-organic);
}

.md-shape-playful {
  border-radius: var(--md-sys-shape-corner-playful);
}

.md-shape-dynamic {
  border-radius: var(--md-sys-shape-corner-dynamic);
  transition: border-radius 0.3s ease;
}

.md-shape-dynamic:hover {
  border-radius: var(--md-sys-shape-corner-extra-large);
}
```

---

## 🎭 Motion & Animation

### Expressive Motion System
```css
:root {
  /* Motion Curves - Expressive */
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --md-sys-motion-easing-expressive: cubic-bezier(0.4, 0, 0.2, 1);
  --md-sys-motion-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --md-sys-motion-easing-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Duration Scale - Expressive */
  --md-sys-motion-duration-instant: 0ms;
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

/* Expressive Animations */
@keyframes md-motion-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes md-motion-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes md-motion-pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--md-sys-color-primary-rgb), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--md-sys-color-primary-rgb), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--md-sys-color-primary-rgb), 0); }
}

@keyframes md-motion-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Motion Utility Classes */
.md-motion-breathe {
  animation: md-motion-breathe var(--md-sys-motion-duration-extra-long2) var(--md-sys-motion-easing-emphasized) infinite;
}

.md-motion-float {
  animation: md-motion-float var(--md-sys-motion-duration-extra-long3) var(--md-sys-motion-easing-emphasized) infinite;
}

.md-motion-pulse {
  animation: md-motion-pulse var(--md-sys-motion-duration-extra-long1) infinite;
}

.md-motion-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: md-motion-shimmer var(--md-sys-motion-duration-extra-long2) infinite;
}

/* Interaction States */
.md-interactive {
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
  cursor: pointer;
}

.md-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--md-sys-elevation-level4);
}

.md-interactive:active {
  transform: translateY(0);
  transition-duration: var(--md-sys-motion-duration-short2);
}
```

---

## 🧩 Component Library

### Expressive Buttons
```css
.md-button {
  /* Base Button Foundation */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
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
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
  overflow: hidden;
  isolation: isolate;
  text-decoration: none;
  
  /* State Layer */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized);
    border-radius: inherit;
    z-index: -1;
  }
  
  /* Ripple Effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, currentColor 10%, transparent 10.01%);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
    border-radius: 50%;
    z-index: -1;
  }
  
  /* Hover State */
  &:hover::before {
    opacity: 0.08;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--md-sys-elevation-level2);
  }
  
  /* Focus State */
  &:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
  
  /* Active State */
  &:active::after {
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.12;
    transition-duration: var(--md-sys-motion-duration-short1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* Disabled State */
  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

/* Button Variants */
.md-button-filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--md-sys-elevation-level1);
  
  &:hover {
    box-shadow: var(--md-sys-elevation-level3);
  }
}

.md-button-expressive {
  background: var(--md-sys-gradient-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--md-sys-elevation-level2);
  
  &:hover {
    box-shadow: var(--md-sys-elevation-level4);
    background: var(--md-sys-gradient-primary);
    background-size: 150% 150%;
  }
}

.md-button-tonal {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.md-button-outlined {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
  
  &:hover {
    background-color: rgba(var(--md-sys-color-primary-rgb), 0.08);
    border-color: var(--md-sys-color-primary);
  }
}

.md-button-text {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 0 12px;
  box-shadow: none;
  
  &:hover {
    box-shadow: none;
    transform: none;
  }
}
```

### Expressive Cards
```css
.md-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--md-sys-shape-corner-medium);
  overflow: hidden;
  transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  container-type: inline-size;
  
  /* Variants */
  &.md-card-elevated {
    background-color: var(--md-sys-color-surface-container-low);
    box-shadow: var(--md-sys-elevation-level1);
    
    &:hover {
      box-shadow: var(--md-sys-elevation-level3);
      transform: translateY(-4px);
    }
  }
  
  &.md-card-filled {
    background-color: var(--md-sys-color-surface-container-highest);
  }
  
  &.md-card-outlined {
    background-color: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
  }
  
  &.md-card-expressive {
    background: var(--md-sys-gradient-surface);
    border-radius: var(--md-sys-shape-corner-dynamic);
    
    &:hover {
      border-radius: var(--md-sys-shape-corner-extra-large);
      transform: translateY(-6px) scale(1.02);
    }
  }
}

/* Card Components */
.md-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized);
  }
  
  .md-card:hover & img,
  .md-card:hover & video {
    transform: scale(1.05);
  }
}

.md-card-content {
  padding: 16px;
  flex: 1;
  
  .md-card-headline {
    font-family: var(--md-sys-typescale-headline-small-font);
    font-size: var(--md-sys-typescale-headline-small-size);
    font-weight: var(--md-sys-typescale-headline-small-weight);
    line-height: var(--md-sys-typescale-headline-small-line-height);
    color: var(--md-sys-color-on-surface);
    margin: 0 0 8px 0;
  }
  
  .md-card-subhead {
    font-family: var(--md-sys-typescale-title-medium-font);
    font-size: var(--md-sys-typescale-title-medium-size);
    font-weight: var(--md-sys-typescale-title-medium-weight);
    line-height: var(--md-sys-typescale-title-medium-line-height);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 12px 0;
  }
  
  .md-card-supporting-text {
    font-family: var(--md-sys-typescale-body-medium-font);
    font-size: var(--md-sys-typescale-body-medium-size);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    line-height: var(--md-sys-typescale-body-medium-line-height);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }
}

.md-card-actions {
  display: flex;
  gap: 8px;
  padding: 8px 16px 16px;
  
  &.md-card-actions-full-bleed {
    padding: 8px 0 0;
    
    .md-button {
      flex: 1;
      border-radius: 0;
    }
  }
}
```

### Expressive Navigation
```css
/* Navigation Bar */
.md-navigation-bar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 16px;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 100;
  transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  
  &.md-navigation-bar-elevated {
    box-shadow: var(--md-sys-elevation-level2);
  }
  
  &.md-navigation-bar-expressive {
    background: var(--md-sys-gradient-surface);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }
  
  .md-navigation-bar-leading {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .md-navigation-bar-title {
    font-family: var(--md-sys-typescale-title-large-font);
    font-size: var(--md-sys-typescale-title-large-size);
    font-weight: var(--md-sys-typescale-title-large-weight);
    line-height: var(--md-sys-typescale-title-large-line-height);
    margin: 0;
    flex: 1;
  }
  
  .md-navigation-bar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* Bottom Navigation */
.md-bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: var(--md-sys-color-surface-container);
  border-top: 1px solid var(--md-sys-color-outline-variant);
  z-index: 100;
  
  .md-bottom-navigation-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    padding: 12px 0;
    gap: 4px;
    cursor: pointer;
    position: relative;
    color: var(--md-sys-color-on-surface-variant);
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
    text-decoration: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 64px;
      height: 32px;
      background-color: var(--md-sys-color-secondary-container);
      border-radius: var(--md-sys-shape-corner-full);
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
      transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
      z-index: -1;
    }
    
    &:hover {
      color: var(--md-sys-color-on-surface);
    }
    
    &.active {
      color: var(--md-sys-color-on-secondary-container);
      
      &::before {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
    
    .md-navigation-icon {
      font-size: 24px;
      transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-bounce);
    }
    
    &:active .md-navigation-icon {
      transform: scale(0.9);
    }
    
    .md-navigation-label {
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      font-weight: var(--md-sys-typescale-label-medium-weight);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking);
    }
  }
}

/* Navigation Drawer */
.md-navigation-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 360px;
  max-width: 80vw;
  background: var(--md-sys-gradient-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transform: translateX(-100%);
  transition: transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized);
  z-index: 1000;
  overflow-y: auto;
  border-right: 1px solid var(--md-sys-color-outline-variant);
  
  &.open {
    transform: translateX(0);
    box-shadow: var(--md-sys-elevation-level2);
  }
  
  .md-navigation-drawer-header {
    padding: 16px 28px 16px 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    
    .md-navigation-drawer-headline {
      font-family: var(--md-sys-typescale-title-large-font);
      font-size: var(--md-sys-typescale-title-large-size);
      font-weight: var(--md-sys-typescale-title-large-weight);
      line-height: var(--md-sys-typescale-title-large-line-height);
      color: var(--md-sys-color-on-surface);
      margin: 0;
    }
  }
  
  .md-navigation-drawer-content {
    padding: 12px 0;
  }
  
  .md-navigation-drawer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 0 24px 0 16px;
    margin: 0 12px;
    border-radius: var(--md-sys-shape-corner-full);
    cursor: pointer;
    position: relative;
    color: var(--md-sys-color-on-surface-variant);
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
    text-decoration: none;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--md-sys-color-secondary-container);
      border-radius: inherit;
      transform: scale(0);
      opacity: 0;
      transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);
      z-index: -1;
    }
    
    &:hover {
      color: var(--md-sys-color-on-surface);
      
      &::before {
        transform: scale(1);
        opacity: 0.08;
      }
    }
    
    &.active {
      color: var(--md-sys-color-on-secondary-container);
      
      &::before {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    .md-navigation-drawer-icon {
      font-size: 24px;
      z-index: 1;
    }
    
    .md-navigation-drawer-label {
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      font-weight: var(--md-sys-typescale-label-large-weight);
      line-height: var(--md-sys-typescale-label-large-line-height);
      letter-spacing: var(--md-sys-typescale-label-large-tracking);
      z-index: 1;
    }
  }
}
```

---

## 🎚️ Advanced Features

### Elevation System
```css
:root {
  /* Enhanced Elevation Values */
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
  
  /* Expressive Elevation (with color tints) */
  --md-sys-elevation-level1-tinted: 
    0px 1px 2px 0px rgba(var(--md-sys-color-primary-rgb), 0.20),
    0px 1px 3px 1px rgba(var(--md-sys-color-primary-rgb), 0.10);
  --md-sys-elevation-level2-tinted: 
    0px 1px 2px 0px rgba(var(--md-sys-color-primary-rgb), 0.20),
    0px 2px 6px 2px rgba(var(--md-sys-color-primary-rgb), 0.10);
  --md-sys-elevation-level3-tinted: 
    0px 4px 8px 3px rgba(var(--md-sys-color-primary-rgb), 0.10),
    0px 1px 3px 0px rgba(var(--md-sys-color-primary-rgb), 0.20);
}

/* Elevation Utilities */
.md-elevation-0 { box-shadow: var(--md-sys-elevation-level0); }
.md-elevation-1 { box-shadow: var(--md-sys-elevation-level1); }
.md-elevation-2 { box-shadow: var(--md-sys-elevation-level2); }
.md-elevation-3 { box-shadow: var(--md-sys-elevation-level3); }
.md-elevation-4 { box-shadow: var(--md-sys-elevation-level4); }
.md-elevation-5 { box-shadow: var(--md-sys-elevation-level5); }

.md-elevation-1-tinted { box-shadow: var(--md-sys-elevation-level1-tinted); }
.md-elevation-2-tinted { box-shadow: var(--md-sys-elevation-level2-tinted); }
.md-elevation-3-tinted { box-shadow: var(--md-sys-elevation-level3-tinted); }
```

### State Layer System
```css
/* Interactive State Layers */
.md-state-layer {
  position: relative;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized);
    border-radius: inherit;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 0.08;
  }
  
  &:focus-visible::before {
    opacity: 0.12;
  }
  
  &:active::before {
    opacity: 0.16;
  }
}

/* Dragged State */
.md-state-layer-dragged::before {
  opacity: 0.16;
}

/* Pressed State with Ripple */
.md-ripple {
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, currentColor 10%, transparent 10.01%);
    transform: scale(0);
    opacity: 0;
    transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
    pointer-events: none;
  }
  
  &:active::after {
    transform: scale(4);
    opacity: 0.12;
    transition-duration: var(--md-sys-motion-duration-short1);
  }
}
```

### Dynamic Theming Support
```css
/* Theme Switching */
[data-theme="light"] {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-on-surface: #1c1b1f;
}

[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #e6e0e9;
}

[data-theme="expressive"] {
  --md-sys-color-primary: #7c4dff;
  --md-sys-color-secondary: #00e676;
  --md-sys-color-tertiary: #ff6d00;
  --md-sys-gradient-primary: linear-gradient(135deg, #7c4dff 0%, #00e676 50%, #ff6d00 100%);
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  :root {
    --md-sys-color-outline: #000000;
    --md-sys-color-outline-variant: #000000;
  }
  
  .md-button-outlined {
    border-width: 2px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 Implementation Guide

### 1. Project Setup
```scss
// styles/main.scss
@import 'foundations/tokens';
@import 'foundations/typography';
@import 'foundations/colors';
@import 'foundations/shapes';
@import 'foundations/motion';
@import 'foundations/elevation';

@import 'components/buttons';
@import 'components/cards';
@import 'components/navigation';
@import 'components/forms';
@import 'components/dialogs';

@import 'utilities/layout';
@import 'utilities/spacing';
@import 'utilities/states';
```

### 2. Base HTML Structure
```html
<!DOCTYPE html>
<html lang="tr" data-theme="expressive">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MD3 Expressive App</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  
  <!-- Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  
  <link rel="stylesheet" href="styles/main.css">
</head>
<body class="md-typography-body-large">
  <header class="md-navigation-bar md-navigation-bar-expressive md-elevation-2">
    <div class="md-navigation-bar-leading">
      <button class="md-button-text" aria-label="Menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="md-navigation-bar-title">Expressive App</h1>
    </div>
    <div class="md-navigation-bar-actions">
      <button class="md-button-text" aria-label="Search">
        <span class="material-symbols-outlined">search</span>
      </button>
    </div>
  </header>
  
  <main class="md-container">
    <!-- Content goes here -->
  </main>
  
  <footer class="md-bottom-navigation">
    <a href="#home" class="md-bottom-navigation-item active">
      <span class="material-symbols-outlined md-navigation-icon">home</span>
      <span class="md-navigation-label">Ana Sayfa</span>
    </a>
    <a href="#explore" class="md-bottom-navigation-item">
      <span class="material-symbols-outlined md-navigation-icon">explore</span>
      <span class="md-navigation-label">Keşfet</span>
    </a>
    <a href="#profile" class="md-bottom-navigation-item">
      <span class="material-symbols-outlined md-navigation-icon">person</span>
      <span class="md-navigation-label">Profil</span>
    </a>
  </footer>
</body>
</html>
```

### 3. Component Usage Examples
```html
<!-- Expressive Hero Section -->
<section class="hero-section md-color-accent-overlay">
  <div class="md-container">
    <h1 class="md-typescale-display-large md-typography-expressive">
      Hoş Geldiniz
    </h1>
    <p class="md-typescale-body-large">
      Modern ve ifadeli tasarım deneyimi
    </p>
    <div class="hero-actions">
      <button class="md-button-expressive md-motion-float">
        <span class="material-symbols-outlined">rocket_launch</span>
        Başlayın
      </button>
      <button class="md-button-outlined">
        Daha Fazla Bilgi
      </button>
    </div>
  </div>
</section>

<!-- Expressive Card Grid -->
<section class="card-grid">
  <div class="md-container">
    <div class="md-grid">
      <div class="md-card md-card-expressive md-motion-breathe" style="grid-column: span 4;">
        <div class="md-card-media">
          <img src="image1.jpg" alt="Example" loading="lazy">
        </div>
        <div class="md-card-content">
          <h3 class="md-card-headline">Başlık</h3>
          <p class="md-card-supporting-text">Açıklama metni</p>
        </div>
        <div class="md-card-actions">
          <button class="md-button-text">Oku</button>
          <button class="md-button-text">Paylaş</button>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 🎨 Dynamic Theming

### Angular Service Integration
```typescript
// material-you-color.service.ts
import { Injectable } from '@angular/core';
import { 
  argbFromHex, 
  themeFromSourceColor, 
  applyTheme 
} from '@material/material-color-utilities';

@Injectable({ providedIn: 'root' })
export class MaterialYouColorService {
  
  generateExpressiveTheme(sourceColor: string): void {
    const sourceColorArgb = argbFromHex(sourceColor);
    const theme = themeFromSourceColor(sourceColorArgb);
    
    // Apply to CSS custom properties
    this.applyExpressiveTheme(theme);
  }
  
  private applyExpressiveTheme(theme: any): void {
    const root = document.documentElement;
    
    // Light theme colors
    root.style.setProperty('--md-sys-color-primary', this.argbToHex(theme.schemes.light.primary));
    root.style.setProperty('--md-sys-color-on-primary', this.argbToHex(theme.schemes.light.onPrimary));
    root.style.setProperty('--md-sys-color-secondary', this.argbToHex(theme.schemes.light.secondary));
    root.style.setProperty('--md-sys-color-tertiary', this.argbToHex(theme.schemes.light.tertiary));
    
    // Create expressive gradients
    const primary = this.argbToHex(theme.schemes.light.primary);
    const secondary = this.argbToHex(theme.schemes.light.secondary);
    const tertiary = this.argbToHex(theme.schemes.light.tertiary);
    
    root.style.setProperty('--md-sys-gradient-primary', 
      `linear-gradient(135deg, ${primary} 0%, ${tertiary} 100%)`);
    root.style.setProperty('--md-sys-gradient-surface', 
      `linear-gradient(180deg, ${this.argbToHex(theme.schemes.light.surfaceContainerLow)} 0%, ${this.argbToHex(theme.schemes.light.surfaceContainerHigh)} 100%)`);
  }
  
  private argbToHex(argb: number): string {
    const hex = (argb >>> 0).toString(16).padStart(8, '0');
    return `#${hex.slice(2)}`;
  }
}
```

### Theme Switching
```typescript
// theme.service.ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  
  setTheme(themeName: 'light' | 'dark' | 'expressive'): void {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  }
  
  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as any;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    this.setTheme(theme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!savedTheme) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}
```

---

## 📚 Resources & Tools

### Official Resources
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Theme Builder](https://m3.material.io/theme-builder)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [Material Symbols & Icons](https://fonts.google.com/icons)

### Development Tools
- [Material Web Components](https://github.com/material-components/material-web)
- [Figma Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460)
- [CSS Custom Properties Support](https://caniuse.com/css-variables)

### Browser Support
- **Modern Browsers**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+
- **CSS Features**: Custom Properties, Grid, Flexbox, Container Queries
- **JavaScript**: ES6+ for dynamic theming

---

## 🎯 Best Practices

1. **Performance**
   - Use CSS custom properties for theme switching
   - Minimize repaints with `transform` and `opacity`
   - Use `contain` property for layout isolation

2. **Accessibility**
   - Maintain WCAG 2.1 AA contrast ratios
   - Support high contrast mode
   - Respect reduced motion preferences
   - Provide focus indicators

3. **Responsive Design**
   - Use container queries where supported
   - Implement fluid typography with `clamp()`
   - Design mobile-first approach

4. **Maintainability**
   - Use semantic color names
   - Document custom properties
   - Create component variants systematically
   - Follow BEM or similar naming conventions

---

*Bu doküman MD3 Expressive Design System için tek kaynak dokümanıdır. Tüm implementasyon detayları ve en güncel spesifikasyonları içerir.*