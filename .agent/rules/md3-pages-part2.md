---
description: MD3 Pages Part 2 - Dark Mode, Accessibility, Print (from _accessibility.scss, _print.scss)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Page Design - Part 2: Dark Mode, Accessibility

> **SOURCE**: src/styles/md3/_accessibility.scss (20KB), _print.scss (32KB)
> **Related**: See md3-pages-part1.md for Structure, Hero, CTA

---

## 1. DARK MODE SYSTEM

### Architecture
Dark mode via CSS media query - automatic, no JavaScript:

```scss
@media (prefers-color-scheme: dark) {
  :root {
    // Primary shifts lighter for visibility
    --md-sys-color-primary: oklch(70% 0.11 194);  // vs 57% light
    
    // Surface uses cool tint (brand hue 194)
    --md-sys-color-surface: oklch(18% 0.005 194);  // NO pure black!
    
    // On-surface stays light
    --md-sys-color-on-surface: oklch(92% 0.005 85);
  }
}
```

### Design Principles

| Principle | Light | Dark |
|-----------|-------|------|
| **No Pure Black** | N/A | oklch(18%) NOT #000 |
| **Primary Lightness** | 57% | 70% |
| **Surface Tint** | Warm (85deg) | Cool (194deg) |
| **Elevation** | Shadows | Glows |

### State Layer Dark Mode (from _states.scss)
```scss
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-state-hover-opacity: 0.10;   // vs 0.08 light
    --md-sys-state-focus-opacity: 0.12;   // vs 0.10 light
    --md-sys-state-pressed-opacity: 0.12; // vs 0.10 light
  }
}
```

---

## 2. ACCESSIBILITY (from _accessibility.scss)

### Focus Ring System
```scss
--md-sys-state-focus-ring-width: 3px;
--md-sys-state-focus-ring-offset: 2px;
--md-sys-state-focus-ring-color: var(--md-sys-color-primary);

:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
}

:focus:not(:focus-visible) {
  outline: none;
}
```

### Touch Targets (from _spacing.scss)
```scss
--md-sys-touch-target-min: 48px;       // WCAG 2.2 AA
--md-sys-touch-target-default: 48px;
--md-sys-touch-target-comfortable: 56px;
--md-sys-touch-target-spacing: 8px;    // Min between targets

button, a.btn {
  min-height: var(--md-sys-spacing-11);  // 44px minimum
  min-width: var(--md-sys-spacing-11);
}

.icon-button {
  min-width: var(--md-sys-spacing-12);   // 48px
  min-height: var(--md-sys-spacing-12);
}
```

### Skip Link
```scss
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  background: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);
  border-radius: var(--md-sys-shape-corner-full);
  z-index: 9999;
  
  &:focus { top: 16px; }
}
```

### Reduced Motion
```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .hero-section {
    animation: none;
    background-size: 100% 100%;
  }
  
  .parallax-layer { transform: none !important; }
}
```

### High Contrast Mode (from _states.scss)
```scss
@media (prefers-contrast: more) {
  :root {
    --md-sys-state-hover-opacity: 0.14;
    --md-sys-state-focus-opacity: 0.18;
    --md-sys-state-focus-ring-width: 4px;
    --md-sys-color-outline: oklch(50% 0 0);
  }
  
  :focus-visible { outline-width: 4px; }
}
```

### Forced Colors Mode (Windows High Contrast)
```scss
@media (forced-colors: active) {
  button, .md3-button {
    border: 2px solid ButtonText !important;
    background: ButtonFace;
    color: ButtonText;
    forced-color-adjust: none;
  }
  
  .md3-card { border: 1px solid CanvasText !important; }
  a { color: LinkText; }
  :disabled { color: GrayText; }
}
```

---

## 3. PRINT STYLES (from _print.scss)

```scss
@media print {
  nav, header, footer, .hero-section, .cta-section, button, .no-print {
    display: none !important;
  }
  
  * {
    color: #000 !important;
    background: #fff !important;
    box-shadow: none !important;
  }
  
  body { font-size: 12pt; line-height: 1.5; }
  
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
  }
  
  @page { margin: 2cm; }
}
```

---

## 4. i18n COMPLIANCE

All text MUST use translate pipe:

```html
<!-- CORRECT -->
<h1>{{ 'PAGE.TITLE' | translate }}</h1>

<!-- FORBIDDEN -->
<h1>Page Title</h1>
```

---

## 5. PAGE COMPLIANCE CHECKLIST

### Structure
- [ ] Uses app-page-header with breadcrumbs
- [ ] Has main.page-content wrapper
- [ ] Ends with app-contact-cta

### Tokens
- [ ] All spacing uses --md-sys-spacing-*
- [ ] All colors use --md-sys-color-*
- [ ] All typography uses --md-sys-typescale-*
- [ ] NO hardcoded px, hex, rgb values

### Dark Mode
- [ ] No pure black (#000) or white (#fff)
- [ ] Contrast maintained (4.5:1 minimum)
- [ ] Glass effects adapt

### Accessibility
- [ ] Focus states visible (3px ring)
- [ ] Touch targets 48x48px minimum
- [ ] Reduced motion supported
- [ ] High contrast mode supported
- [ ] All images have alt text

### i18n
- [ ] All text uses translate pipe

---

*See Part 3 for Brand, Logo and Typography details.*
