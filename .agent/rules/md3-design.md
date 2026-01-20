---
description: MD3 Expressive Design System - Core Philosophy & Supreme Authority
globs: ["**/*.scss", "**/*.css", "**/*.html", "**/*.ts"]
---

# MD3 Expressive Design System

> **SUPREME AUTHORITY**: `src/styles/MASTER-STYLE-GUIDE.md`
> **Version**: 5.0 (December 2025)
> **Philosophy**: Emotion-Driven Design, Spring Physics, Dynamic Theming, OKLCH Color Science

---

## 1. THE SUPREME COMMANDMENT

**"TOKEN OR NOTHING"** - You are FORBIDDEN from using hardcoded values.

```scss
// FORBIDDEN
color: #008080;
padding: 16px;
border-radius: 8px;
transition: all 0.3s ease;

// REQUIRED
color: var(--md-sys-color-primary);
padding: var(--md-sys-spacing-4);
border-radius: var(--md-sys-shape-corner-small);
transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
```

---

## 2. EXPRESSIVE DESIGN PILLARS

MD3 Expressive is backed by Google's most comprehensive research:
- 46 global user studies, 18,000+ participants
- Users spot key UI elements **4x faster**
- **87%** preference rate (18-24 age group)

### Four Pillars

| Pillar | Implementation |
|--------|----------------|
| **Color** | Dynamic theming, OKLCH, tonal palettes |
| **Shape** | Morphic transitions, asymmetric corners |
| **Motion** | Spring physics, expressive easing |
| **Size** | Component scaling, responsive sizing |

---

## 3. BRAND COLORS (OKLCH)

### Primary - Teal (Trust, Health)
```scss
--md-sys-color-primary: oklch(57% 0.15 194);
```

### Secondary - Amber (Energy, Joy)
```scss
--md-sys-color-secondary: oklch(79% 0.18 85);
```

### Tertiary - Coral (Warmth, Care)
```scss
--md-sys-color-tertiary: oklch(64% 0.19 39);
```

---

## 4. ICONOGRAPHY

**ONLY USE**: Material Icons Rounded
**FORBIDDEN**: FontAwesome (`fa-*`), Emojis

```html
<!-- CORRECT -->
<span class="material-icons-rounded">child_care</span>

<!-- FORBIDDEN -->
<i class="fas fa-baby"></i>
```

---

## 5. MOTION SYSTEM

### Standard (Utility)
```scss
transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
```

### Emphasized (Important)
```scss
transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
```

### Expressive (Hero Moments - Spring Physics)
```scss
transition: transform var(--md-sys-motion-duration-medium4)
            var(--md-sys-motion-easing-expressive-standard);
```

---

## 6. SHAPE SYSTEM

| Token | Value | Usage |
|-------|-------|-------|
| `corner-none` | 0 | Dividers |
| `corner-extra-small` | 4px | Text fields |
| `corner-small` | 8px | Chips, buttons |
| `corner-medium` | 12px | Cards, dialogs |
| `corner-large` | 16px | FABs, large cards |
| `corner-extra-large` | 28px | Hero elements |
| `corner-full` | 9999px | Pills, avatars |

---

## 7. GLASSMORPHISM STANDARD

```scss
.glass-surface {
  background: oklch(from var(--md-sys-color-surface) l c h / 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid oklch(from var(--md-sys-color-outline) l c h / 0.2);
  border-radius: var(--md-sys-shape-corner-large);
}
```

---

## 8. COMPONENT STANDARDS

- **Page Headers**: ALL sub-pages MUST use `<app-page-header>`
- **Buttons**: Use MD3 button hierarchy (Filled - Tonal - Elevated - Outlined - Text)
- **Cards**: Use elevation tokens, not hardcoded shadows
- **Touch Targets**: Minimum 48x48px

---

## 9. DARK MODE RULES

- **NO Pure Black**: Use `oklch(18%)` NOT `#000`
- **Primary Lightness**: 57% light - 70% dark
- **Surface Tint**: Warm (85deg) light - Cool (194deg) dark

---

## 10. ACCESSIBILITY

- Contrast minimum 4.5:1
- Touch targets 48x48px
- Focus ring: 2px solid primary
- `prefers-reduced-motion` supported
- High contrast mode supported

---

## 11. PRE-COMMIT AUDIT

Before finishing ANY task, search for violations:

```bash
# Hex colors
grep -rn "#[0-9a-fA-F]{3,6}" src/app/**/*.scss

# Hardcoded pixels
grep -rn "[^-]\\d+px" src/app/**/*.scss

# FontAwesome
grep -rn "fa-" src/app/**/*.html
```

**REJECT any violations.**

---

*See `md3-tokens-*.md` for complete token reference*
*See `md3-components-*.md` for component specifications*
*See `md3-pages-*.md` for page patterns*
