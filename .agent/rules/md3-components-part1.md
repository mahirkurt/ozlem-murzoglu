---
description: MD3 Components Part 1 - Buttons, FABs and Cards (from _buttons.scss, _cards.scss)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Components - Part 1: Buttons and Cards

> **SOURCE**: src/styles/md3/components/_buttons.scss, _cards.scss
> **Related**: See md3-components-part2.md for forms, icons

---

## 1. BUTTON HIERARCHY

```
HIGH EMPHASIS ----------------------------------------> LOW EMPHASIS

  Filled         Tonal         Elevated       Outlined        Text
    ##            []              {}             ()            --

  1 per page    Multiple      Multiple       Multiple       Multiple
```

---

## 2. BUTTON SHAPES (from _shapes.scss)

```scss
--md-sys-shape-button-filled: var(--md-sys-shape-corner-full);
--md-sys-shape-button-elevated: var(--md-sys-shape-corner-full);
--md-sys-shape-button-outlined: var(--md-sys-shape-corner-full);
--md-sys-shape-button-text: var(--md-sys-shape-corner-small);
--md-sys-shape-button-icon: var(--md-sys-shape-corner-full);
```

---

## 3. BUTTON SPACING (from _spacing.scss)

```scss
--md-sys-spacing-button-padding-x: var(--md-sys-spacing-6);          // 24px
--md-sys-spacing-button-padding-x-compact: var(--md-sys-spacing-4);   // 16px
--md-sys-spacing-button-padding-y: var(--md-sys-spacing-3);           // 12px
--md-sys-spacing-button-icon-gap: var(--md-sys-spacing-2);            // 8px
--md-sys-spacing-button-fab-padding: var(--md-sys-spacing-4);         // 16px
--md-sys-spacing-button-extended-fab-padding: 16px 24px;
```

---

## 4. FILLED BUTTON

```scss
.md3-button-filled {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border: none;
  border-radius: var(--md-sys-shape-corner-full);
  
  height: var(--md-sys-spacing-10);              // 40px
  padding: 0 var(--md-sys-spacing-6);            // 0 24px
  
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  
  transition: var(--md-sys-transition-emphasized);
  
  @extend .md3-state-layer;
  
  &:disabled {
    background: oklch(from var(--md-sys-color-on-surface) l c h / 0.12);
    color: oklch(from var(--md-sys-color-on-surface) l c h / 0.38);
  }
}
```

---

## 5. OTHER BUTTON VARIANTS

### Elevated Button
```scss
.md3-button-elevated {
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-primary);
  box-shadow: var(--md-sys-elevation-level1);
  border-radius: var(--md-sys-shape-corner-full);
  
  &:hover { box-shadow: var(--md-sys-elevation-level2); }
}
```

### Tonal Button
```scss
.md3-button-tonal {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  border-radius: var(--md-sys-shape-corner-full);
}
```

### Outlined Button
```scss
.md3-button-outlined {
  background: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
  border-radius: var(--md-sys-shape-corner-full);
  
  &:hover {
    background: oklch(from var(--md-sys-color-primary) l c h / 0.08);
  }
}
```

---

## 6. FAB SYSTEM

### FAB Shapes (from _shapes.scss)
```scss
--md-sys-shape-fab-small: var(--md-sys-shape-corner-medium);
--md-sys-shape-fab: var(--md-sys-shape-corner-large);
--md-sys-shape-fab-large: var(--md-sys-shape-corner-extra-large);
--md-sys-shape-fab-extended: var(--md-sys-shape-corner-large);
```

### FAB Sizes

| Size | Dimensions | Border Radius | Icon |
|------|------------|---------------|------|
| Small | 40x40px | medium (12px) | 24px |
| Standard | 56x56px | large (16px) | 24px |
| Large | 96x96px | extra-large (28px) | 36px |

### Standard FAB
```scss
.md3-fab {
  width: var(--md-sys-spacing-14);   // 56px
  height: var(--md-sys-spacing-14);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-radius: var(--md-sys-shape-corner-large);
  box-shadow: var(--md-sys-elevation-level3);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: var(--md-sys-transition-expressive);
  
  &:hover { box-shadow: var(--md-sys-elevation-level4); }
}
```

---

## 7. CARD SYSTEM

### Card Shapes (from _shapes.scss)
```scss
--md-sys-shape-card: var(--md-sys-shape-corner-medium);
--md-sys-shape-card-elevated: var(--md-sys-shape-corner-medium);
--md-sys-shape-card-filled: var(--md-sys-shape-corner-medium);
--md-sys-shape-card-outlined: var(--md-sys-shape-corner-medium);
--md-sys-shape-card-hero: var(--md-sys-shape-corner-extra-large);
```

### Card Spacing (from _spacing.scss)
```scss
--md-sys-spacing-card-padding: 24px;          // Standard
--md-sys-spacing-card-padding-compact: 16px;  // Dense
--md-sys-spacing-card-gap: 16px;              // Between items
--md-sys-spacing-card-margin: 8px;            // Between cards
--md-sys-spacing-card-grid-gap: 24px;         // Grid gap
```

### Elevated Card
```scss
.md3-card-elevated {
  background: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level1);
  padding: var(--md-sys-spacing-card-padding);
  
  transition: var(--md-sys-transition-expressive);
  
  &:hover {
    box-shadow: var(--md-sys-elevation-level2);
    transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
  }
}
```

### Glass Card
```scss
.md3-glass-card {
  @extend .md3-glass;
  border-radius: var(--md-sys-shape-corner-large);
  padding: var(--md-sys-spacing-6);
}
```

---

## 8. CHIP SYSTEM (from _chips.scss)

### Chip Shapes
```scss
--md-sys-shape-chip: var(--md-sys-shape-corner-small);  // 8px
```

### Chip Spacing
```scss
--md-sys-spacing-chip-padding-x: 16px;
--md-sys-spacing-chip-height: 32px;
--md-sys-spacing-chip-gap: 8px;
```

### Filter Chip
```scss
.md3-chip-filter {
  display: inline-flex;
  align-items: center;
  gap: var(--md-sys-spacing-2);
  height: var(--md-sys-spacing-8);
  padding: 0 var(--md-sys-spacing-4);
  background: transparent;
  border: 1px solid var(--md-sys-color-outline);
  border-radius: var(--md-sys-shape-corner-small);
  
  &.selected {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
}
```

---

## 9. COMPONENT CHECKLIST

- [ ] Uses token-based colors
- [ ] Uses token-based spacing
- [ ] Uses token-based shapes
- [ ] Uses transition presets
- [ ] Touch targets 48x48px minimum
- [ ] State layer for interactivity
- [ ] Focus ring visible

---

*Continue to Part 2 for forms, icons, navigation*
