---
description: MD3 Token System Part 2 - Complete Token Reference Tables (from actual SCSS)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Token System - Part 2: Token Reference

> **SOURCE**: src/styles/md3/_*.scss (actual implementation)
> **Related**: See md3-tokens-part1.md for enforcement rules

---

## 1. SPACING SCALE (from _spacing.scss)

4px grid system. Each token = 4px x multiplier.

| Token | Value | Common Usage |
|-------|-------|--------------|
| spacing-0 | 0px | Reset |
| spacing-1 | 4px | Icon margins, hairline |
| spacing-2 | 8px | Button gaps |
| spacing-3 | 12px | Small padding |
| spacing-4 | 16px | Standard padding |
| spacing-5 | 20px | Medium spacing |
| spacing-6 | 24px | Card padding, grids |
| spacing-8 | 32px | Chip height |
| spacing-10 | 40px | Button height |
| spacing-11 | 44px | Touch target base |
| spacing-12 | 48px | 3XL, FAB size |
| spacing-14 | 56px | Text field height |
| spacing-16 | 64px | Nav bar height |
| spacing-20 | 80px | Nav rail width |
| spacing-24 | 96px | Section spacing XL |
| spacing-32 | 128px | Section spacing XXL |

### Named Aliases

| Name | Token | Value |
|------|-------|-------|
| spacing-xs | spacing-1 | 4px |
| spacing-sm | spacing-2 | 8px |
| spacing-md | spacing-4 | 16px |
| spacing-lg | spacing-6 | 24px |
| spacing-xl | spacing-8 | 32px |
| spacing-2xl | spacing-12 | 48px |
| spacing-3xl | spacing-16 | 64px |

---

## 2. SHAPE CORNER TOKENS (from _shapes.scss)

| Token | Value | Usage |
|-------|-------|-------|
| corner-none | 0 | Squared elements |
| corner-extra-small | 4px | Text fields |
| corner-small | 8px | Chips, small buttons |
| corner-medium | 12px | Cards, dialogs |
| corner-large | 16px | FABs, large cards |
| corner-extra-large | 28px | Hero cards, modals |
| corner-full | 9999px | Pills, avatars |

### Asymmetric Shapes

| Token | Use Case |
|-------|----------|
| corner-extra-large-top | Bottom sheet |
| corner-extra-large-bottom | Top sheet |
| corner-large-end | Right drawer |
| corner-large-start | Left drawer |
| corner-diagonal-tl-br | Creative layouts |
| corner-leaf | Organic shapes |
| corner-blob | 30% 70% 70% 30% |

---

## 3. COLOR TOKENS (from _colors.scss)

### 3.1 Primary Palette (Teal)

| Token | OKLCH Value |
|-------|-------------|
| primary | oklch(57% 0.15 194) |
| on-primary | oklch(100% 0 0) |
| primary-container | oklch(86% 0.057 194) |
| on-primary-container | oklch(20% 0.043 194) |
| inverse-primary | oklch(70% 0.11 194) |

### 3.2 Secondary Palette (Amber)

| Token | OKLCH Value |
|-------|-------------|
| secondary | oklch(79% 0.18 85) |
| on-secondary | oklch(26% 0.04 45) |
| secondary-container | oklch(96% 0.04 85) |
| on-secondary-container | oklch(38% 0.06 45) |

### 3.3 Tertiary Palette (Coral)

| Token | OKLCH Value |
|-------|-------------|
| tertiary | oklch(64% 0.19 39) |
| on-tertiary | oklch(100% 0 0) |
| tertiary-container | oklch(87% 0.07 39) |
| on-tertiary-container | oklch(44% 0.18 39) |

### 3.4 Surface Hierarchy

| Token | Light | Dark |
|-------|-------|------|
| surface | oklch(98% 0.005 85) | oklch(18% 0.005 194) |
| surface-dim | oklch(97% 0 0) | oklch(12% 0 0) |
| surface-container-lowest | oklch(100% 0 0) | oklch(8% 0 0) |
| surface-container-low | oklch(98% 0 0) | oklch(14% 0 0) |
| surface-container | oklch(97% 0 0) | oklch(18% 0 0) |
| surface-container-high | oklch(94% 0 0) | oklch(22% 0 0) |
| surface-container-highest | oklch(92% 0 0) | oklch(26% 0 0) |

### 3.5 Semantic Colors

| Token | Light OKLCH |
|-------|-------------|
| error | oklch(48% 0.22 28) |
| success | oklch(50% 0.16 150) |
| warning | oklch(75% 0.19 65) |
| info | oklch(55% 0.15 260) |

---

## 4. TYPOGRAPHY SCALE (from _typography.scss)

### Fonts
- **Brand**: Figtree (Display, Headlines, Titles)
- **Plain**: DM Sans (Body, Labels)
- **Mono**: JetBrains Mono (Code)

### Display (Hero headings)

| Token | Size | Weight | Line Height |
|-------|------|--------|-------------|
| display-large | clamp(3rem, 5vw + 1rem, 3.5625rem) | 700 | 1.1 |
| display-medium | clamp(2.25rem, 4vw + 1rem, 2.8125rem) | 600 | 1.15 |
| display-small | clamp(1.75rem, 3vw + 1rem, 2.25rem) | 600 | 1.2 |

### Headline (Section)

| Token | Size | Weight |
|-------|------|--------|
| headline-large | clamp(1.75rem, 2vw + 1rem, 2rem) | 600 |
| headline-medium | clamp(1.5rem, 1.5vw + 1rem, 1.75rem) | 500 |
| headline-small | clamp(1.25rem, 1vw + 1rem, 1.5rem) | 500 |

### Body (Content)

| Token | Size | Weight |
|-------|------|--------|
| body-large | 1rem | 400 |
| body-medium | 0.875rem | 400 |
| body-small | 0.75rem | 400 |

### Label (Buttons, chips)

| Token | Size | Weight |
|-------|------|--------|
| label-large | 0.875rem | 500 |
| label-medium | 0.75rem | 500 |
| label-small | 0.6875rem | 500 |

---

## 5. ELEVATION TOKENS (from _elevation.scss)

| Level | Usage |
|-------|-------|
| level0 | none - Flat surfaces |
| level1 | Resting cards |
| level2 | Elevated cards, buttons |
| level3 | Dialogs, modals |
| level4 | Dropdown menus |
| level5 | Navigation drawers |

### Expressive Elevation (softer, larger)

| Token | Usage |
|-------|-------|
| expressive-2 | Hero cards |
| expressive-3 | Feature cards |
| expressive-4 | Floating panels |
| expressive-5 | Maximum depth |

### Z-Index Hierarchy

| Token | Value |
|-------|-------|
| dropdown | 1000 |
| sticky | 1020 |
| fixed | 1030 |
| modal-backdrop | 1040 |
| modal | 1050 |
| popover | 1060 |
| tooltip | 1070 |
| toast | 1080 |

---

## 6. STATE LAYER TOKENS (from _states.scss)

| State | Opacity |
|-------|---------|
| hover | 0.08 |
| focus | 0.10 |
| pressed | 0.10 |
| dragged | 0.16 |
| disabled | 0.38 |

### Expressive States (larger opacity)

| State | Opacity |
|-------|---------|
| hover-expressive | 0.12 |
| focus-expressive | 0.14 |
| pressed-expressive | 0.14 |

---

## 7. GRADIENT PRESETS (from _effects.scss)

| Token | Description |
|-------|-------------|
| gradient-primary | Primary to inverse-primary |
| gradient-secondary | Secondary to secondary-container |
| gradient-aurora | Primary + Secondary + Tertiary mesh |
| gradient-mesh | Radial multi-color |
| gradient-surface-up | Surface to surface-container |
| gradient-text-primary | For text gradients |

---

## 8. BREAKPOINT REFERENCE (from _breakpoints.scss)

| Name | Min | Max | Columns |
|------|-----|-----|---------|
| compact | - | 599px | 4 |
| medium | 600px | 839px | 8 |
| expanded | 840px | 1199px | 12 |
| large | 1200px | 1599px | 12 |
| extra-large | 1600px | - | 12 |

---

*This completes the MD3 Token System reference.*
