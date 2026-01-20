---
description: MD3 Token System Part 1 - Zero Hardcoded Values Policy and OKLCH Color System
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Token System - Part 1: Enforcement Rules

> **SUPREME AUTHORITY**: src/styles/MASTER-STYLE-GUIDE.md
> **Token Files**: src/styles/md3/_*.scss
> **Related**: See md3-tokens-part2.md for token reference tables

---

## 1. ZERO HARDCODED VALUES POLICY

**STRICTLY FORBIDDEN**: Hardcoded values in any styling context.

### 1.1 Color Violations - CRITICAL

```scss
// FORBIDDEN
color: #008080;
background: rgba(0, 128, 128, 0.5);
box-shadow: 0 4px 8px rgba(0,0,0,0.1);

// REQUIRED (from _colors.scss)
color: var(--md-sys-color-primary);
background: var(--md-sys-color-surface-container);
box-shadow: var(--md-sys-elevation-level2);

// For transparency, use OKLCH relative syntax
background: oklch(from var(--md-sys-color-primary) l c h / 0.5);
```

### 1.2 Spacing Violations - CRITICAL

```scss
// FORBIDDEN
padding: 16px;
margin: 1rem;
gap: 8px;

// REQUIRED (from _spacing.scss - 4px grid)
padding: var(--md-sys-spacing-4);   // 16px = 4 x 4
margin: var(--md-sys-spacing-6);    // 24px = 6 x 4
gap: var(--md-sys-spacing-2);       // 8px  = 2 x 4

// Named aliases also available
padding: var(--spacing-md);         // 16px
gap: var(--spacing-inline-icon);    // 8px
```

### 1.3 Shape/Border-Radius Violations

```scss
// FORBIDDEN
border-radius: 8px;
border-radius: 50%;

// REQUIRED (from _shapes.scss)
border-radius: var(--md-sys-shape-corner-small);        // 8px
border-radius: var(--md-sys-shape-corner-full);         // 9999px

// Asymmetric shapes available
border-radius: var(--md-sys-shape-corner-extra-large-top);  // Bottom sheet
border-radius: var(--md-sys-shape-corner-large-end);         // Side drawer
```

### 1.4 Typography Violations

```scss
// FORBIDDEN
font-size: 24px;
font-weight: 600;
font-family: 'Arial', sans-serif;

// REQUIRED (from _typography.scss)
font-family: var(--md-sys-typescale-headline-small-font);
font-size: var(--md-sys-typescale-headline-small-size);
font-weight: var(--md-sys-typescale-headline-small-weight);
line-height: var(--md-sys-typescale-headline-small-line-height);
letter-spacing: var(--md-sys-typescale-headline-small-tracking);
```

### 1.5 Motion/Animation Violations

```scss
// FORBIDDEN
transition: all 0.3s ease;
animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

// REQUIRED (from _motion.scss)
transition: all var(--md-sys-motion-duration-medium2)
            var(--md-sys-motion-easing-emphasized);

// Expressive/Spring animations (bouncy)
transition: all var(--md-sys-motion-duration-medium4)
            var(--md-sys-motion-easing-expressive-standard);

// Preset transitions
transition: var(--md-sys-transition-standard);
transition: var(--md-sys-transition-expressive);
```

### 1.6 Elevation/Shadow Violations

```scss
// FORBIDDEN
box-shadow: 0 4px 8px rgba(0,0,0,0.1);

// REQUIRED (from _elevation.scss)
box-shadow: var(--md-sys-elevation-level0);   // Flat
box-shadow: var(--md-sys-elevation-level1);   // Resting cards
box-shadow: var(--md-sys-elevation-level2);   // Elevated
box-shadow: var(--md-sys-elevation-level3);   // Dialogs
box-shadow: var(--md-sys-elevation-level4);   // Dropdowns

// Expressive shadows (larger, softer)
box-shadow: var(--md-sys-elevation-expressive-3);

// Colored shadows
box-shadow: var(--md-sys-elevation-primary-2);
```

### 1.7 State Layer Violations

```scss
// FORBIDDEN
opacity: 0.08;  // for hover states

// REQUIRED (from _states.scss)
opacity: var(--md-sys-state-hover-opacity);    // 0.08
opacity: var(--md-sys-state-focus-opacity);    // 0.10
opacity: var(--md-sys-state-pressed-opacity);  // 0.10
opacity: var(--md-sys-state-dragged-opacity);  // 0.16
opacity: var(--md-sys-state-disabled-opacity); // 0.38

// Use state layer classes
.interactive { @extend .md3-state-layer; }
```

---

## 2. OKLCH COLOR SYSTEM

OKLCH provides perceptually uniform color manipulation.

### 2.1 OKLCH Format

```
oklch(L% C H)

L = Lightness : 0% (black) - 100% (white)
C = Chroma    : 0 (gray) - ~0.4 (saturated)
H = Hue       : 0-360 degrees

Brand Colors:
Primary (Teal):     oklch(57% 0.15 194)
Secondary (Amber):  oklch(79% 0.18 85)
Tertiary (Coral):   oklch(64% 0.19 39)
```

### 2.2 Relative Color Syntax

```scss
// Transparency
background: oklch(from var(--md-sys-color-primary) l c h / 0.08);

// Lighten (increase L)
background: oklch(from var(--md-sys-color-primary) calc(l + 0.1) c h);

// Darken (decrease L)
background: oklch(from var(--md-sys-color-primary) calc(l - 0.05) c h);

// Desaturate (decrease C)
background: oklch(from var(--md-sys-color-primary) l calc(c * 0.7) h);
```

---

## 3. GLASS EFFECTS

### 3.1 Glassmorphism (from _effects.scss)

```scss
// Blur levels
--md-sys-glass-blur-xs: 4px;
--md-sys-glass-blur-sm: 8px;
--md-sys-glass-blur: 12px;       // Default
--md-sys-glass-blur-lg: 16px;
--md-sys-glass-blur-xl: 24px;
--md-sys-glass-blur-heavy: 40px;
--md-sys-glass-blur-extreme: 60px;

// Use glass classes
.glass-card { @extend .md3-glass; }
.glass-elevated { @extend .md3-glass-elevated; }
```

---

## 4. VIOLATION DETECTION

```bash
# Hex colors
grep -rn "#[0-9a-fA-F]\{3,6\}" src/app/**/*.scss

# Hardcoded pixels (excluding negative/calc)
grep -rn "[^-]\d\+px" src/app/**/*.scss

# Hardcoded transitions
grep -rn "transition.*[0-9]\+ms" src/app/**/*.scss

# Pure black/white
grep -rn "#000\|#fff" src/app/**/*.scss

# FontAwesome
grep -rn "fa-" src/app/**/*.html
```

---

## 5. QUICK AUDIT CHECKLIST

- [ ] No hardcoded hex colors (#xxx)
- [ ] No hardcoded rgba/rgb/hsl
- [ ] No hardcoded pixel values
- [ ] No hardcoded font-family
- [ ] No hardcoded border-radius
- [ ] No hardcoded transitions
- [ ] No hardcoded box-shadows
- [ ] OKLCH for all color modifications
- [ ] State layers use token opacities
- [ ] Expressive motion for hero moments

---

*Continue to Part 2 for complete token reference tables*
