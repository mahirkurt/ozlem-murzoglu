---
description: "MD3 Audit Phase 3B: Visual Verification & Action Plan"
version: "3.0"
last_updated: "2025-12-19"
---

# MD3 Audit Phase 3B: Visual Verification & Action Plan

> **Workflow**: 3B of 5 (FINAL) | **Prev**: `md3-audit-3a.md`
> **Authority**: `src/styles/MASTER-STYLE-GUIDE.md` (v5.0 Final Production Edition)
> **Rules**: All `.agent/rules/md3-*.md` rule files
> **Scope**: Manuel goruntusel dogrulama, remediation rehberi ve merge kriterleri

---

## Prerequisites

```bash
npm start  # localhost:4200 bekle
# DevTools > Rendering > Emulate prefers-color-scheme
# DevTools > Network > Throttling: Fast 3G (performance test)
```

---

## STEP 1: Typography Visual Check

### 1.1 Font Family Verification
`http://localhost:4200` ac, DevTools > Elements > Computed:

| Element | Expected Font | Weight |
|---------|---------------|--------|
| h1, h2, h3 (Display/Headline) | Figtree | 600-700 |
| p, span (Body) | DM Sans | 400 |
| button, label (Label) | DM Sans | 500 |
| Hero title | Figtree | 700 |
| Section titles | Figtree | 600 |
| Card titles | Figtree | 500 |

### 1.2 Fluid Typography Test
Browser'i resize et (375px → 1440px):
- [ ] Display text smooth scale (clamp() calisiyor)
- [ ] Headline responsive (no jumps)
- [ ] Body text okunabilir (min 14px)
- [ ] Line-height oranli kaliyor
- [ ] Letter-spacing korunuyor
- [ ] No text overflow or truncation issues

### 1.3 Typography Hierarchy
- [ ] h1 > h2 > h3 > h4 boyut sirasi dogru
- [ ] Section title'lar primary color
- [ ] Body text on-surface color
- [ ] Caption on-surface-variant
- [ ] Link primary + hover underline

---

## STEP 2: Color System Visual Check

### 2.1 Primary Color (Teal - Brand Identity)
- [ ] Header/Navigation background or accent
- [ ] CTA buttons (filled variant)
- [ ] Links (text and hover state)
- [ ] Active states (primary-container)
- [ ] Accent icons and highlights

### 2.2 Secondary Color (Amber - Energy)
- [ ] Highlights, Badges
- [ ] Warning states
- [ ] Accent elements
- [ ] Tag backgrounds

### 2.3 Surface Hierarchy (Tonal Elevation)
| Level | Token | Usage |
|-------|-------|-------|
| 0 | surface | Page background |
| 1 | surface-container-low | Basic cards |
| 2 | surface-container | Elevated cards |
| 3 | surface-container-high | Dropdowns |
| 4 | surface-container-highest | Modals |

### 2.4 Semantic Colors
- [ ] Error: Red (error token) - form validation, destructive
- [ ] Success: Green (success token) - confirmation, positive
- [ ] Warning: Amber (warning token) - caution notices
- [ ] Info: Blue (info token) - informational badges

---

## STEP 3: Component Visual Check

### 3.1 Button States
| State | Visual Feedback | Token |
|-------|-----------------|-------|
| Default | Base styling | - |
| Hover | 8% state layer + scale | state-hover-opacity |
| Pressed | 12% state layer | state-pressed-opacity |
| Focus | 2px outline + offset | primary |
| Disabled | 38% opacity | state-disabled-opacity |

**Test All Variants**: filled, elevated, tonal, outlined, text

### 3.2 Card Hover Animation
- [ ] Smooth transform (scale 1.02)
- [ ] Shadow level1 → level2
- [ ] Duration ~300ms (medium2)
- [ ] No jank/stuttering
- [ ] Easing: expressive-standard

### 3.3 Icon Rendering
- [ ] Material Icons Rounded font yuklu
- [ ] Default: 24px, Button: 20px, Feature: 40px
- [ ] Color inherit from parent (currentColor)
- [ ] NO FontAwesome icons anywhere
- [ ] Icons properly aligned with text

### 3.4 Glass Card (Gradient Only)
- [ ] Blur effect (20px backdrop-filter)
- [ ] Semi-transparent bg (oklch with alpha)
- [ ] Subtle border (outline-variant)
- [ ] SADECE gradient/image arka planlarda kullan

### 3.5 Navigation
- [ ] Desktop: Horizontal nav (≥840px)
- [ ] Mobile (<840px): Hamburger menu
- [ ] Active: aria-current + visual indicator
- [ ] Smooth mobile menu transition

---

## STEP 4: Motion & Animation Check

### 4.1 Easing Verification
- [ ] Button hover: Expressive (slight bounce/overshoot)
- [ ] Card hover: Standard
- [ ] Page transitions: Emphasized
- [ ] Menu: Expressive decelerate

### 4.2 Duration Consistency
| Animation | Expected Duration | Token |
|-----------|-------------------|-------|
| Micro (hover) | 100-200ms | short2-short4 |
| State change | 200-300ms | short4-medium2 |
| Enter/Exit | 300-400ms | medium2-medium4 |
| Complex | 400-500ms | medium4-long2 |

### 4.3 Reduced Motion Test
OS Settings > Accessibility > Reduce Motion ON:
- [ ] Decorative animations disabled
- [ ] Essential transitions instant (0.01ms)
- [ ] Page still fully functional
- [ ] No auto-playing animations

### 4.4 Stagger Animation
- [ ] List items 50ms delay increment
- [ ] Cards sequential appearance
- [ ] Smooth choreography overall

---

## STEP 5: Responsive Testing

### 5.1 Breakpoint Tests
DevTools > Device toolbar:

| Width | Type | Columns | Margin |
|-------|------|---------|--------|
| 375px | Compact | 4 (single) | 16px |
| 600px | Medium start | 8 (2-col) | 24px |
| 840px | Expanded start | 12 (3-col) | 24px |
| 1440px | Max width | 12 | 24px |

### 5.2 Touch Target Verification
- [ ] All buttons ≥48x48dp
- [ ] 8dp min spacing between targets
- [ ] Form inputs ≥48dp height
- [ ] Icon buttons 48dp touch area

### 5.3 Container Max-Width
- [ ] Content centered at large screens
- [ ] Max-width: 1440px (or 90vw)
- [ ] Padding: 24px desktop, 16px mobile
- [ ] No horizontal scroll anywhere

---

## STEP 6: Dark Mode Testing

### 6.1 Toggle Method
DevTools > Rendering > Emulate prefers-color-scheme: dark

### 6.2 Checklist
- [ ] Background: Dark surface (NOT pure black #000)
- [ ] Text: Light on-surface (high contrast)
- [ ] Primary: Lighter teal variant (higher lightness)
- [ ] Cards: Tonal elevation visible
- [ ] Shadows: More subtle or none
- [ ] Focus rings: Still visible (adequate contrast)
- [ ] Glass cards: Adapted opacity (reduced)

### 6.3 Specific OKLCH Checks
| Element | Light | Dark |
|---------|-------|------|
| Page bg | ~oklch(98%) | ~oklch(18%) |
| Card bg | ~oklch(97%) | ~oklch(22%) |
| Text | ~oklch(24%) | ~oklch(90%) |
| Primary | ~oklch(57%) | ~oklch(70%) |

---

## STEP 7: Severity Classification

### CRITICAL (Must Fix - Zero Tolerance)
- Hex colors in SCSS (`#xxx`)
- Hardcoded font sizes (`font-size: 16px`)
- Missing i18n keys (hardcoded text)
- FontAwesome icons (`fa-xxx`)
- Pure black usage (`#000`)
- Missing focus states
- Touch targets <48dp
- No reduced motion support
- Broken keyboard navigation
- Missing ARIA on interactive elements

### HIGH (Should Fix)
- Hardcoded spacing (`padding: 16px`)
- Hardcoded border-radius (`border-radius: 8px`)
- Hardcoded transitions (`transition: 0.3s`)
- Missing page-header on sub-pages
- Missing contact-cta at page bottom
- Hero section on non-homepage
- Wrong icon variant (outlined/sharp)
- Insufficient color contrast

### MEDIUM (Nice to Fix)
- Hardcoded shadows
- Wrong container class
- Missing ARIA on non-critical
- Minor animation inconsistency

### LOW (Backlog)
- Micro-animation polish
- Advanced choreography
- Edge case responsive

---

## STEP 8: Quick Remediation Reference

### Color Fixes
```diff
- color: #00798c;
+ color: var(--md-sys-color-primary);

- background: white;
+ background: var(--md-sys-color-surface);

- background: rgba(0, 128, 128, 0.5);
+ background: oklch(from var(--md-sys-color-primary) l c h / 0.5);

- border: 1px solid #e0e0e0;
+ border: 1px solid var(--md-sys-color-outline-variant);
```

### Typography Fixes
```diff
- font-size: 24px;
+ font-size: var(--md-sys-typescale-headline-small-size);

- font-weight: 600;
+ font-weight: var(--md-sys-typescale-headline-large-weight);

- line-height: 1.5;
+ line-height: var(--md-sys-typescale-body-large-line-height);

- font-family: 'Roboto';
+ font-family: var(--md-sys-typescale-body-large-font);
```

### Spacing Fixes
```diff
- padding: 16px;
+ padding: var(--md-sys-spacing-4);

- margin: 24px;
+ margin: var(--md-sys-spacing-6);

- gap: 8px;
+ gap: var(--md-sys-spacing-2);
```

### Shape Fixes
```diff
- border-radius: 8px;
+ border-radius: var(--md-sys-shape-corner-small);

- border-radius: 16px;
+ border-radius: var(--md-sys-shape-corner-large);

- border-radius: 50%;
+ border-radius: var(--md-sys-shape-corner-full);
```

### Motion Fixes
```diff
- transition: all 0.3s ease;
+ transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);

- transition: transform 0.2s ease-out;
+ transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-expressive-decelerate);
```

### Icon Fixes
```diff
- <i class="fas fa-home"></i>
+ <span class="material-icons-rounded">home</span>

- <i class="material-icons-outlined">settings</i>
+ <span class="material-icons-rounded">settings</span>
```

### i18n Fixes
```diff
- <h2>Hizmetlerimiz</h2>
+ <h2>{{ 'SERVICES.TITLE' | translate }}</h2>

- <button>Randevu Al</button>
+ <button>{{ 'COMMON.BOOK_APPOINTMENT' | translate }}</button>
```

---

## STEP 9: Final Checklist

### Token System
- [ ] Hex colors: 0
- [ ] Named colors: 0
- [ ] Hardcoded font-size: 0
- [ ] Hardcoded spacing: 0
- [ ] Hardcoded border-radius: 0
- [ ] Hardcoded transitions: 0
- [ ] Hardcoded box-shadow: 0

### Components
- [ ] All sub-pages use page-header
- [ ] All pages end with contact-cta
- [ ] Hero only on homepage
- [ ] Correct button variants
- [ ] Material Icons Rounded only
- [ ] No FontAwesome

### Accessibility
- [ ] Focus-visible states
- [ ] Skip link functional
- [ ] Reduced motion supported
- [ ] Touch targets ≥48dp
- [ ] Color contrast WCAG AA
- [ ] ARIA attributes complete
- [ ] Keyboard navigation

### Dark Mode
- [ ] All tokens have dark override
- [ ] No pure black (#000)
- [ ] Surface hierarchy preserved
- [ ] Glass effects adapted

### i18n
- [ ] All text uses translate pipe
- [ ] Keys exist in tr.json and en.json
- [ ] `npm run i18n:validate` passes

---

## STEP 10: Post-Audit Actions

### Fix & Build
```bash
npm run build  # Compile error check
npm run i18n:check  # i18n validation
```

### Lighthouse Audit
```bash
npx lighthouse http://localhost:4200 --only-categories=accessibility --output=html
```
**Hedef**: Accessibility score ≥90

---

## Full Verification Script

```bash
echo "=== MD3 AUDIT FULL VERIFICATION ===" && \
echo "--- TOKEN VIOLATIONS ---" && \
echo "Hex:" && grep -rn "#[0-9a-fA-F]\{3,6\}" --include="*.scss" src/app/ | wc -l && \
echo "Named:" && grep -rn "color:\s*\(white\|black\)" --include="*.scss" src/app/ | wc -l && \
echo "Font-size:" && grep -rn "font-size:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "Spacing:" && grep -rn "padding:\s*[0-9]\+px" --include="*.scss" src/app/ | wc -l && \
echo "Radius:" && grep -rn "border-radius:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "--- COMPONENT VIOLATIONS ---" && \
echo "FontAwesome:" && grep -rn "fa-" --include="*.html" src/app/ | wc -l && \
echo "Wrong icons:" && grep -rn "material-icons-outlined" --include="*.html" src/app/ | wc -l && \
echo "--- A11Y COMPLIANCE ---" && \
echo "Focus:" && grep -rn ":focus-visible" --include="*.scss" src/ | wc -l && \
echo "Reduced motion:" && grep -rn "prefers-reduced-motion" --include="*.scss" src/ | wc -l && \
echo "ARIA:" && grep -rn "aria-" --include="*.html" src/app/ | wc -l && \
echo "--- DARK MODE ---" && \
echo "Dark theme:" && grep -rn "prefers-color-scheme: dark" --include="*.scss" src/styles/ | wc -l && \
echo "Pure black:" && grep -rn "#000000" --include="*.scss" src/ | wc -l && \
echo "--- I18N ---" && \
echo "Translate pipes:" && grep -rn "| translate" --include="*.html" src/app/pages/ | wc -l && \
echo "=== COMPLETE ==="
```

---

## Merge Kriterleri

- [ ] Tum CRITICAL cozuldu
- [ ] Tum HIGH cozuldu
- [ ] Build basarili (`npm run build`)
- [ ] i18n validation geciyor (`npm run i18n:check`)
- [ ] Light & dark mode visual review tamam
- [ ] Lighthouse accessibility ≥90

---

## WORKFLOW COMPLETE

Bu dosya MD3 Audit serisinin son asamasidir.
Tum workflow'lar: `1a` → `1b` → `2` → `3a` → `3b` (FINAL)
