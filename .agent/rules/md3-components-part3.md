---
description: MD3 Components Part 3 - Dialogs, Snackbars, Tooltips, Progress (from actual SCSS)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Components - Part 3: Dialogs, Snackbars, Progress

> **SOURCE**: src/styles/md3/components/_dialogs.scss, _snackbars.scss, _tooltips.scss, _progress.scss
> **File sizes**: Dialogs 28KB, Snackbars 26KB, Tooltips 25KB, Progress 26KB

---

## 1. DIALOG SYSTEM (from _dialogs.scss)

### Dialog Shapes
```scss
--md-sys-shape-dialog: var(--md-sys-shape-corner-extra-large);
--md-sys-shape-dialog-full-screen: var(--md-sys-shape-corner-none);
--md-sys-shape-bottom-sheet: var(--md-sys-shape-corner-extra-large-top);
--md-sys-shape-side-sheet: var(--md-sys-shape-corner-extra-large-end);
```

### Dialog Spacing
```scss
--md-sys-spacing-dialog-padding: var(--md-sys-spacing-6);
--md-sys-spacing-dialog-icon-size: var(--md-sys-spacing-6);
--md-sys-spacing-dialog-button-gap: var(--md-sys-spacing-2);
--md-sys-spacing-dialog-content-gap: var(--md-sys-spacing-4);
```

### Dialog Types

| Type | Use Case | Shape |
|------|----------|-------|
| Basic | Confirmations | extra-large (28px) |
| Alert | Critical warnings | extra-large |
| Full-screen | Mobile forms | none |
| Bottom Sheet | Mobile actions | extra-large-top |
| Side Sheet | Desktop detail | extra-large-end |

### Dialog Animation
```scss
.md3-dialog-enter {
  animation: modalEnter
    var(--md-sys-motion-duration-medium4)
    var(--md-sys-motion-easing-expressive-decelerate) forwards;
}

.md3-dialog-scrim {
  background: var(--md-sys-color-scrim);
  opacity: 0.32;
}
```

---

## 2. SNACKBAR SYSTEM (from _snackbars.scss)

### Snackbar Tokens
```scss
--md-sys-snackbar-min-width: 288px;
--md-sys-snackbar-max-width: 568px;
--md-sys-snackbar-padding: 14px 16px;
--md-sys-snackbar-shape: var(--md-sys-shape-corner-extra-small);

--md-sys-snackbar-surface: var(--md-sys-color-inverse-surface);
--md-sys-snackbar-text: var(--md-sys-color-inverse-on-surface);
--md-sys-snackbar-action: var(--md-sys-color-inverse-primary);

--md-sys-snackbar-duration: 4000ms;
```

### Snackbar Spacing
```scss
--md-sys-spacing-snackbar-padding: var(--md-sys-spacing-4);
--md-sys-spacing-snackbar-gap: var(--md-sys-spacing-4);
--md-sys-spacing-snackbar-action-gap: var(--md-sys-spacing-2);
--md-sys-spacing-snackbar-margin: var(--md-sys-spacing-4);
```

### Snackbar Variants

| Variant | Background | Text |
|---------|------------|------|
| Default | inverse-surface | inverse-on-surface |
| Success | success | on-success |
| Error | error | on-error |
| Warning | warning | on-warning |
| Info | info | on-info |

---

## 3. TOOLTIP SYSTEM (from _tooltips.scss)

### Plain Tooltip Tokens
```scss
--md-sys-tooltip-plain-height: 24px;
--md-sys-tooltip-plain-padding: 4px 8px;
--md-sys-tooltip-plain-max-width: 200px;
--md-sys-tooltip-plain-shape: var(--md-sys-shape-corner-extra-small);
```

### Rich Tooltip Tokens
```scss
--md-sys-tooltip-rich-min-width: 200px;
--md-sys-tooltip-rich-max-width: 312px;
--md-sys-tooltip-rich-padding: 12px 16px;
--md-sys-tooltip-rich-shape: var(--md-sys-shape-corner-medium);
```

### Tooltip Timing
```scss
--md-sys-tooltip-delay: 500ms;
--md-sys-tooltip-enter-duration: 150ms;
--md-sys-tooltip-exit-duration: 75ms;
```

### Tooltip Spacing
```scss
--md-sys-spacing-tooltip-padding: var(--md-sys-spacing-2) var(--md-sys-spacing-2);
--md-sys-spacing-tooltip-padding-rich: var(--md-sys-spacing-3) var(--md-sys-spacing-4);
--md-sys-spacing-tooltip-offset: var(--md-sys-spacing-2);
```

---

## 4. PROGRESS INDICATORS (from _progress.scss)

### Linear Progress Tokens
```scss
--md-sys-progress-linear-track-height: 4px;
--md-sys-progress-linear-shape: var(--md-sys-shape-corner-full);
--md-sys-progress-indicator-color: var(--md-sys-color-primary);
--md-sys-progress-track-color: var(--md-sys-color-surface-container-highest);
```

### Circular Progress Tokens
```scss
--md-sys-progress-circular-size: 48px;
--md-sys-progress-circular-stroke-width: 4px;
```

### Progress Types

| Type | Use Case |
|------|----------|
| Linear Determinate | Known progress % |
| Linear Indeterminate | Unknown duration |
| Circular Determinate | Compact spaces |
| Circular Indeterminate | Loading spinners |

---

## 5. SKELETON LOADER (from _progress.scss)

```scss
.md3-skeleton {
  background: linear-gradient(
    90deg,
    var(--md-sys-color-surface-container) 25%,
    var(--md-sys-color-surface-container-high) 50%,
    var(--md-sys-color-surface-container) 75%
  );
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
  border-radius: var(--md-sys-shape-corner-small);
}

@keyframes skeletonShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Skeleton Variants
```scss
.md3-skeleton-text { height: 16px; margin-bottom: 8px; }
.md3-skeleton-heading { height: 24px; width: 60%; margin-bottom: 16px; }
.md3-skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.md3-skeleton-image { width: 100%; height: 200px; }
```

---

## 6. ELEVATION SYSTEM (from _elevation.scss)

### Standard Levels

| Level | Box Shadow |
|-------|------------|
| 0 | none |
| 1 | 0 1px 2px 0 rgba(0,0,0,0.30), 0 1px 3px 1px rgba(0,0,0,0.15) |
| 2 | 0 1px 2px 0 rgba(0,0,0,0.30), 0 2px 6px 2px rgba(0,0,0,0.15) |
| 3 | 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.30) |
| 4 | 0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px 0 rgba(0,0,0,0.30) |
| 5 | 0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px 0 rgba(0,0,0,0.30) |

### Expressive Elevation (softer, larger)

```scss
--md-sys-elevation-expressive-2: 0 4px 8px -2px rgba(0,0,0,0.15), 0 8px 16px 0 rgba(0,0,0,0.10);
--md-sys-elevation-expressive-3: 0 8px 16px -4px rgba(0,0,0,0.18), 0 16px 24px 0 rgba(0,0,0,0.08);
--md-sys-elevation-expressive-4: 0 12px 24px -6px rgba(0,0,0,0.16), 0 24px 48px 0 rgba(0,0,0,0.06);
```

### Colored Shadows

```scss
--md-sys-elevation-primary-1: 0 2px 4px -1px rgba(primary-rgb, 0.25), 0 4px 8px 0 rgba(primary-rgb, 0.15);
--md-sys-elevation-primary-2: 0 4px 8px -2px rgba(primary-rgb, 0.30), 0 8px 16px 0 rgba(primary-rgb, 0.20);
```

### Glow Effects

```scss
--md-sys-glow-primary-soft: 0 0 20px 0 rgba(primary-rgb, 0.20);
--md-sys-glow-primary-medium: 0 0 40px 0 rgba(primary-rgb, 0.30);
--md-sys-glow-aurora: 0 0 30px rgba(primary), 0 0 60px rgba(secondary), 0 0 90px rgba(tertiary);
```

---

## 7. CHECKLIST

- [ ] Dialogs use extra-large corners (28px)
- [ ] Snackbars positioned at bottom center
- [ ] Tooltips have 500ms delay
- [ ] Progress uses token colors
- [ ] Skeletons include shimmer animation
- [ ] Elevation respects dark mode glow

---

*This completes MD3 Components reference.*
