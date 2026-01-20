---
description: MD3 Pages Part 1 - Page Structure, Hero, CTA, Layout (from _unified-layout.scss)
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Page Design - Part 1: Structure and Layout

> **SOURCE**: src/styles/md3/_unified-layout.scss, sections/_hero.scss, sections/_cta.scss
> **Related**: See md3-pages-part2.md for Dark Mode, Accessibility

---

## 1. PAGE STRUCTURE

### Standard Page Template
```html
<app-page-header
  [title]="'SECTION.TITLE' | translate"
  [subtitle]="'SECTION.SUBTITLE' | translate"
  [breadcrumbs]="breadcrumbs">
</app-page-header>

<main class="page-content">
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ 'SECTION.TITLE' | translate }}</h2>
      </div>
      <div class="cards-grid"><!-- Content --></div>
    </div>
  </section>
</main>

<app-contact-cta></app-contact-cta>
```

---

## 2. SECTION SPACING (from _spacing.scss)

```scss
--md-sys-spacing-section-padding-y: var(--md-sys-spacing-24);            // 96px desktop
--md-sys-spacing-section-padding-y-tablet: var(--md-sys-spacing-16);     // 64px tablet
--md-sys-spacing-section-padding-y-mobile: var(--md-sys-spacing-12);     // 48px mobile

--md-sys-spacing-section-gap: var(--md-sys-spacing-16);                  // 64px between sections
--md-sys-spacing-section-title-gap: var(--md-sys-spacing-4);             // 16px
--md-sys-spacing-section-subtitle-margin: var(--md-sys-spacing-12);      // 48px
--md-sys-spacing-section-content-gap: var(--md-sys-spacing-8);           // 32px
--md-sys-spacing-section-header-margin: var(--md-sys-spacing-12);        // 48px below header
```

---

## 3. HERO SECTION

### Hero Spacing Tokens
```scss
--md-sys-spacing-hero-min-height: 480px;
--md-sys-spacing-hero-padding-y: var(--md-sys-spacing-24);               // 96px
--md-sys-spacing-hero-padding-y-mobile: var(--md-sys-spacing-16);        // 64px
--md-sys-spacing-hero-content-gap: var(--md-sys-spacing-6);              // 24px
--md-sys-spacing-hero-title-margin: var(--md-sys-spacing-4);             // 16px
--md-sys-spacing-hero-button-gap: var(--md-sys-spacing-4);               // 16px
```

### Hero Gradient (from _colors.scss)
```scss
--gradient-aurora: linear-gradient(
  135deg,
  var(--md-sys-color-primary) 0%,
  oklch(65% 0.14 140) 50%,
  var(--md-sys-color-tertiary) 100%
);
```

### Hero Styling
```scss
.hero-section {
  position: relative;
  min-height: var(--md-sys-spacing-hero-min-height);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  background: var(--gradient-aurora);
  background-size: 400% 400%;
  animation: heroWave 15s ease infinite;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-size: 100% 100%;
  }
}
```

---

## 4. CTA SECTION

### CTA Styling
```scss
.cta-section {
  background: linear-gradient(
    135deg,
    var(--md-sys-color-surface-container-lowest) 0%,
    var(--md-sys-color-surface-container) 100%
  );
  padding: var(--md-sys-spacing-24) 0;
}

.cta-btn-primary {
  background: var(--md-sys-color-secondary);
  color: var(--md-sys-color-on-secondary);
  border-radius: var(--md-sys-shape-corner-extra-large);
  padding: var(--md-sys-spacing-4) var(--md-sys-spacing-8);
  box-shadow: var(--md-sys-elevation-level2);
  
  &:hover {
    transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
    box-shadow: var(--md-sys-elevation-level4);
  }
}
```

---

## 5. CONTAINER SYSTEM (from _spacing.scss)

```scss
--md-sys-spacing-container-max-width: 1440px;
--md-sys-spacing-container-padding: var(--md-sys-spacing-6);             // 24px desktop
--md-sys-spacing-container-padding-tablet: var(--md-sys-spacing-5);      // 20px
--md-sys-spacing-container-padding-mobile: var(--md-sys-spacing-4);      // 16px
--md-sys-spacing-container-padding-xs: var(--md-sys-spacing-3);          // 12px

--md-sys-spacing-content-max-width: 1200px;
--md-sys-spacing-content-max-width-narrow: 800px;
--md-sys-spacing-content-max-width-wide: 1440px;
--md-sys-spacing-text-max-width: 65ch;  // Optimal reading width
```

### Container Classes
```scss
.container {
  max-width: var(--md-sys-spacing-container-max-width);
  width: 90vw;
  padding: 0 var(--md-sys-spacing-container-padding);
  margin: 0 auto;
}

.container-lg { max-width: 1240px; }
.container-md { max-width: 1024px; }
.container-sm { max-width: 960px; }
```

---

## 6. GRID SYSTEM

```scss
--md-sys-spacing-card-grid-gap: var(--md-sys-spacing-6);                 // 24px
--md-sys-spacing-card-grid-gap-mobile: var(--md-sys-spacing-4);          // 16px

.cards-grid {
  display: grid;
  gap: var(--md-sys-spacing-card-grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

---

## 7. BREAKPOINTS (from _breakpoints.scss)

| Name | Range | Columns | Margin |
|------|-------|---------|--------|
| Compact | 0-599px | 4 | 16px |
| Medium | 600-839px | 8 | 24px |
| Expanded | 840-1199px | 12 | 24px |
| Large | 1200-1599px | 12 | 24px |
| Extra-large | 1600px+ | 12 | 24px |

---

## 8. Z-INDEX SYSTEM (from _elevation.scss)

```scss
--md-sys-zindex-dropdown: 1000;
--md-sys-zindex-sticky: 1020;
--md-sys-zindex-fixed: 1030;
--md-sys-zindex-modal-backdrop: 1040;
--md-sys-zindex-modal: 1050;
--md-sys-zindex-popover: 1060;
--md-sys-zindex-tooltip: 1070;
--md-sys-zindex-toast: 1080;
--md-sys-zindex-maximum: 9999;
```

---

## 9. SECTION HEADER MIXIN (from _unified-layout.scss)

```scss
@mixin section-header-unified {
  text-align: center;
  margin-bottom: 48px;
  
  .section-label {
    display: inline-block;
    padding: 8px 16px;
    background: oklch(from var(--md-sys-color-primary) l c h / 0.1);
    color: var(--md-sys-color-primary);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  h2 {
    font-family: var(--md-sys-typescale-display-small-font);
    font-size: 40px;
    background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-inverse-primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

---

*See Part 2 for Dark Mode, Accessibility and Compliance.*
