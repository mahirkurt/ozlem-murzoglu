---
description: MD3 Pages Part 3 - Brand Guidelines, Logo System and Typography Details
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Page Design - Part 3: Brand and Logo System

> **SUPREME AUTHORITY**: `src/styles/MASTER-STYLE-GUIDE.md`
> **Related**: See `md3-pages-part1.md` for Structure, `md3-pages-part2.md` for Accessibility

---

## 1. LOGO SYSTEM

### Logo Hierarchy

```
PRIMARY LOGO (Horizontal)
+--------------------------------------------------+
|  [Icon]  Dr. Ozlem Murzoglu                      |
|          Cocuk Sagligi ve Hastaliklari Uzmani    |
+--------------------------------------------------+
Usage: Header, footer, official documents
Min width: 200px

SECONDARY LOGO (Stacked/Vertical)
+----------------------+
|        [Icon]        |
|   Dr. Ozlem Murzoglu |
|   Pediatri Uzmani    |
+----------------------+
Usage: Social media, profile images
Min width: 120px

ICON ONLY (Favicon/App Icon)
+--------+
| [Icon] |  Min size: 32x32px
+--------+  Favicon: 16px, 32px, 48px, 180px
```

### Logo Clear Space

```scss
// Minimum space around logo = "M" height
-clearspace: 1.5rem; // ~24px

.brand-logo {
  margin: -clearspace;

  @media (max-width: 768px) {
    margin: calc(-clearspace * 0.75);
  }
}
```

### Logo Color Variants

| Variant | Usage | Background |
|---------|-------|------------|
| Primary (Teal) | Default | Light surfaces |
| White/Inverse | Dark mode | Dark surfaces |
| Monochrome | Print | Any |

### Logo FORBIDDEN Usage

- DO NOT change logo colors
- DO NOT stretch/squeeze proportions
- DO NOT add borders around logo
- DO NOT overlay text/images
- DO NOT use on low-contrast backgrounds
- DO NOT use below minimum size
- DO NOT separate/rearrange elements

---

## 2. VARIABLE FONT CONFIGURATION

### Figtree (Brand Font)

**Role**: Display, Headlines, Titles
**Character**: Modern, friendly, approachable

```scss
--md-sys-typescale-font-brand: 'Figtree', -apple-system, BlinkMacSystemFont,
  'Segoe UI', sans-serif;
```

**Variable Axes:**
- `wght`: 300-900 (Light to Black)
- `ital`: 0-1 (Upright to Italic)

### DM Sans (Content Font)

**Role**: Body, Labels, UI Elements
**Character**: Clean, readable, professional

```scss
--md-sys-typescale-font-plain: 'DM Sans', -apple-system, BlinkMacSystemFont,
  'Segoe UI', sans-serif;
```

**Variable Axes:**
- `wght`: 100-1000 (Thin to ExtraBlack)
- `opsz`: 9-40 (Optical Size)
- `ital`: 0-1 (Upright to Italic)

### Font Import

```scss
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
```

---

## 3. FLUID TYPOGRAPHY

### Clamp Formula

```
clamp(MIN, PREFERRED, MAX)
       |       |        |
       |       |        +-- Maximum size
       |       +-- Ideal (usually vw-based)
       +-- Minimum size
```

### Display Styles

| Token | Size Formula | Weight | Line Height |
|-------|--------------|--------|-------------|
| `display-large` | clamp(3rem, 5vw + 1rem, 57px) | 700 | 1.1 |
| `display-medium` | clamp(2.25rem, 4vw + 1rem, 45px) | 600 | 1.15 |
| `display-small` | clamp(1.75rem, 3vw + 1rem, 36px) | 600 | 1.2 |

### Headline Styles

| Token | Size Formula | Weight | Line Height |
|-------|--------------|--------|-------------|
| `headline-large` | clamp(1.75rem, 2vw + 1rem, 32px) | 600 | 1.25 |
| `headline-medium` | clamp(1.5rem, 1.5vw + 1rem, 28px) | 500 | 1.3 |
| `headline-small` | clamp(1.25rem, 1vw + 1rem, 24px) | 500 | 1.35 |

---

## 4. TYPOGRAPHY MIXIN

```scss
@mixin typescale() {
  font-family: var(--md-sys-typescale-#{}-font);
  font-size: var(--md-sys-typescale-#{}-size);
  font-weight: var(--md-sys-typescale-#{}-weight);
  line-height: var(--md-sys-typescale-#{}-line-height);
  letter-spacing: var(--md-sys-typescale-#{}-tracking);
}

// Usage
.hero-title {
  @include typescale(display-large);
  color: var(--md-sys-color-on-surface);
}

.card-headline {
  @include typescale(headline-small);
  color: var(--md-sys-color-on-surface);
}

.button-label {
  @include typescale(label-large);
}
```

---

## 5. FONT WEIGHT ANIMATIONS

```scss
.text-emphasis {
  font-variation-settings: 'wght' 400;
  transition: font-variation-settings
    var(--md-sys-motion-duration-medium2)
    var(--md-sys-motion-easing-emphasized);
}

.text-emphasis:hover {
  font-variation-settings: 'wght' 700;
}

// Optical size animation
.dynamic-text {
  font-variation-settings: 'opsz' 14;
  transition: font-variation-settings
    var(--md-sys-motion-duration-short4)
    var(--md-sys-motion-easing-standard);
}

.dynamic-text.large {
  font-variation-settings: 'opsz' 32;
}
```

---

## 6. EMOTIONAL DESIGN PRINCIPLES

### Don Norman's Three Layers

| Layer | Focus | Implementation |
|-------|-------|----------------|
| **Visceral** | First impression | Color palette, typography |
| **Behavioral** | Usability | Clear navigation, 3-click rule |
| **Reflective** | Meaning | Brand trust, memorability |

### Target Audience Needs

| Audience | Primary Emotion | Design Response |
|----------|-----------------|-----------------|
| **Parents** | Worry, protection | Calm colors, clear hierarchy |
| **Children** | Fear, curiosity | Warm colors, soft shapes |

### Brand Values to Visual

| Value | Visual | Application |
|-------|--------|-------------|
| Trust | Teal | Primary actions, headings |
| Joy | Amber | Highlights, accents |
| Warmth | Coral | CTAs, attention getters |
| Professionalism | Clean typography | Figtree + DM Sans |
| Friendliness | Soft shapes | Rounded corners |

---

## 7. MICRO-EMOTIONS MAP

```
User Journey                    Emotion Opportunity
---------------                 ------------------
Page loading         --------->  Curiosity, Anticipation
First impression     --------->  Trust, Warmth
Button hover         --------->  Control, Response
Click animation      --------->  Satisfaction, Confirmation
Form completion      --------->  Success, Relief
Error message        --------->  Understanding, Support (NOT frustration!)
```

---

## 8. ILLUSTRATION GUIDELINES

### Illustration Styles

| Style | Usage | Example |
|-------|-------|---------|
| **Line Art** | Decorative, minimal | Hero backgrounds |
| **Flat** | Educational, explainer | Service pages |
| **Isometric** | Data visualization | Dashboard |
| **Character** | Child-focused | Parent guides |

### Illustration Colors

```scss
.illustration {
  --illust-primary: var(--md-sys-color-primary);
  --illust-secondary: var(--md-sys-color-secondary);
  --illust-accent: var(--md-sys-color-tertiary);
  --illust-background: var(--md-sys-color-primary-container);
  --illust-neutral: var(--md-sys-color-on-surface-variant);
}
```

### Illustration Sizes

```scss
.illustration-hero { max-width: 600px; height: auto; }
.illustration-inline { width: 200px; height: 200px; }
.illustration-spot { width: 80px; height: 80px; }  // Small highlights
```

---

## 9. FILE STRUCTURE REFERENCE

```
src/styles/
+-- md3/
|   +-- _index.scss           # Main entry point
|   +-- _colors.scss          # Color tokens (OKLCH)
|   +-- _typography.scss      # Type scale
|   +-- _shapes.scss          # Corner radii
|   +-- _elevation.scss       # Shadow tokens
|   +-- _motion.scss          # Easing and duration
|   +-- _spacing.scss         # Spacing tokens
|   +-- _states.scss          # State layers
|   +-- _effects.scss         # Glass effects
|   +-- _utilities.scss       # Utility classes
|   +-- components/
|   |   +-- _buttons.scss
|   |   +-- _cards.scss
|   |   +-- _dialogs.scss
|   |   +-- _navigation.scss
|   +-- sections/
|       +-- _hero.scss
|       +-- _cta.scss
+-- MASTER-STYLE-GUIDE.md     # This constitution
```

---

*This completes MD3 Brand and Logo reference.*
