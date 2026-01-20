---
description: MD3 Components Part 2 - Forms, Icons, Navigation, Lists (from actual SCSS)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Components - Part 2: Forms, Icons and Navigation

> **SOURCE**: src/styles/md3/components/, _icons.scss, _navigation.scss
> **Related**: See md3-components-part1.md for buttons, cards

---

## 1. ICONOGRAPHY SYSTEM (from _icons.scss)

**ONLY USE**: Material Symbols Rounded (variable icon font)
**FORBIDDEN**: FontAwesome (fa-*), Emojis

### Variable Font Axes

| Axis | Range | Default | Description |
|------|-------|---------|-------------|
| FILL | 0-1 | 0 | 0=Outlined, 1=Filled |
| wght | 100-700 | 400 | Stroke weight |
| GRAD | -50-200 | 0 | Gradient/contrast |
| opsz | 20-48 | 24 | Optical size |

### Icon Sizing Tokens

```scss
--md-sys-icon-size-xs: 16px;   // Small labels
--md-sys-icon-size-sm: 20px;   // Button icons
--md-sys-icon-size-md: 24px;   // Default
--md-sys-icon-size-lg: 32px;   // Large actions
--md-sys-icon-size-xl: 40px;   // Feature icons
--md-sys-icon-size-xxl: 48px;  // Hero icons
```

### Icon Animation
```scss
.icon-interactive {
  font-variation-settings: 'FILL' 0, 'wght' 400;
  transition: font-variation-settings
    var(--md-sys-motion-duration-short4)
    var(--md-sys-motion-easing-standard);
}

.icon-interactive:hover {
  font-variation-settings: 'FILL' 1, 'wght' 500;
}
```

---

## 2. TEXT FIELDS (from _text-fields.scss)

### Text Field Shapes
```scss
--md-sys-shape-text-field-filled: 4px 4px 0 0;   // Top rounded only
--md-sys-shape-text-field-outlined: var(--md-sys-shape-corner-extra-small);
```

### Text Field Spacing
```scss
--md-sys-spacing-text-field-padding: var(--md-sys-spacing-4);
--md-sys-spacing-text-field-height: var(--md-sys-spacing-14);  // 56px
--md-sys-spacing-text-field-gap: var(--md-sys-spacing-2);      // 8px
--md-sys-spacing-text-field-icon-padding: var(--md-sys-spacing-3);
```

### Filled Text Field
```scss
.md3-text-field input {
  width: 100%;
  height: var(--md-sys-spacing-14);
  padding: var(--md-sys-spacing-4);
  padding-top: var(--md-sys-spacing-5);
  
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  color: var(--md-sys-color-on-surface);
  
  background: var(--md-sys-color-surface-container);
  border: none;
  border-bottom: 1px solid var(--md-sys-color-outline);
  border-radius: 4px 4px 0 0;
  
  &:focus {
    outline: none;
    border-bottom: 2px solid var(--md-sys-color-primary);
  }
}
```

---

## 3. STATE LAYER CLASSES (from _states.scss)

### Base State Layer
```scss
.md3-state-layer {
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    border-radius: inherit;
    pointer-events: none;
    transition: opacity 150ms var(--md-sys-motion-easing-standard);
  }
  
  &:hover::before { opacity: 0.08; }
  &:focus-visible::before { opacity: 0.10; }
  &:active::before { opacity: 0.10; }
}
```

### Expressive State Layer
```scss
.md3-state-layer-expressive {
  @extend .md3-state-layer;
  
  &:hover::before { opacity: 0.12; }
  &:focus-visible::before { opacity: 0.14; }
  &:active::before { opacity: 0.14; }
}
```

---

## 4. NAVIGATION COMPONENTS (from _navigation.scss)

### Navigation Spacing Tokens
```scss
--md-sys-spacing-nav-item-padding-x: var(--md-sys-spacing-4);  // 16px
--md-sys-spacing-nav-item-padding-y: var(--md-sys-spacing-3);  // 12px
--md-sys-spacing-nav-rail-width: var(--md-sys-spacing-20);     // 80px
--md-sys-spacing-nav-drawer-width: 360px;
--md-sys-spacing-nav-bottom-height: var(--md-sys-spacing-20);  // 80px
--md-sys-spacing-nav-top-height: var(--md-sys-spacing-16);     // 64px
```

### Navigation Shapes
```scss
--md-sys-shape-nav-drawer: var(--md-sys-shape-corner-large-end);
--md-sys-shape-nav-bar-item: var(--md-sys-shape-corner-full);
```

### Navigation Rail (Desktop)
```scss
.md3-navigation-rail {
  width: var(--md-sys-spacing-20);
  background: var(--md-sys-color-surface-container);
  padding: var(--md-sys-spacing-3) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--md-sys-spacing-3);
}
```

### Bottom Navigation (Mobile)
```scss
.md3-bottom-navigation {
  height: var(--md-sys-spacing-20);
  background: var(--md-sys-color-surface-container);
  display: flex;
  justify-content: space-around;
  box-shadow: var(--md-sys-elevation-level2);
}
```

---

## 5. LIST COMPONENTS (from _lists.scss)

### List Spacing Tokens
```scss
--md-sys-spacing-list-item-padding: var(--md-sys-spacing-4);
--md-sys-spacing-list-item-gap: var(--md-sys-spacing-4);
--md-sys-spacing-list-item-min-height: 56px;
--md-sys-spacing-list-divider-inset: var(--md-sys-spacing-16);
--md-sys-spacing-list-section-gap: var(--md-sys-spacing-8);
```

### List Shapes
```scss
--md-sys-shape-list: var(--md-sys-shape-corner-none);
--md-sys-shape-list-item: var(--md-sys-shape-corner-none);
```

### List Item
```scss
.md3-list-item {
  display: flex;
  align-items: center;
  gap: var(--md-sys-spacing-4);
  padding: var(--md-sys-spacing-3) var(--md-sys-spacing-4);
  min-height: var(--md-sys-spacing-14);
  
  @extend .md3-state-layer;
  
  .headline {
    font-family: var(--md-sys-typescale-body-large-font);
    color: var(--md-sys-color-on-surface);
  }
  
  .supporting-text {
    font-family: var(--md-sys-typescale-body-medium-font);
    color: var(--md-sys-color-on-surface-variant);
  }
}
```

---

## 6. FOCUS RING SYSTEM (from _states.scss)

```scss
--md-sys-state-focus-ring-width: 3px;
--md-sys-state-focus-ring-offset: 2px;
--md-sys-state-focus-ring-color: var(--md-sys-color-primary);

:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
}
```

---

## 7. BADGE (from _states.scss)

```scss
--md-sys-spacing-badge-padding: var(--md-sys-spacing-1) var(--md-sys-spacing-2);
--md-sys-spacing-badge-offset: -8px;

.md3-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--md-sys-spacing-4);
  height: var(--md-sys-spacing-4);
  padding: var(--md-sys-spacing-badge-padding);
  background: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
  border-radius: var(--md-sys-shape-corner-full);
  font-size: var(--md-sys-typescale-label-small-size);
}
```

---

## 8. CHECKLIST

- [ ] Icons use Material Symbols Rounded only
- [ ] No FontAwesome or emojis
- [ ] Text fields use token spacing
- [ ] State layers on interactive elements
- [ ] Focus rings visible (3px)
- [ ] Touch targets 48x48px minimum

---

*Continue to Part 3 for dialogs, snackbars, tooltips, progress*
