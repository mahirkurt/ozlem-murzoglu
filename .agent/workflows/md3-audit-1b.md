---
description: "MD3 Audit Phase 1B: Spacing, Shape, Motion & Elevation Tokens"
version: "3.0"
last_updated: "2025-12-19"
---

# MD3 Audit Phase 1B: Spacing, Shape, Motion & Elevation

> **Workflow**: 1B of 5 | **Prev**: `md3-audit-1a.md` | **Next**: `md3-audit-2.md`
> **Authority**: `src/styles/MASTER-STYLE-GUIDE.md` (v5.0 Final Production Edition)
> **Rules**: `.agent/rules/md3-tokens-part1.md`, `.agent/rules/md3-tokens-part2.md`, `.agent/rules/md3-tokens-part3.md`
> **Scope**: SCSS dosyalarindaki spacing, shape, motion ve elevation token uyumlulugu (Spring Physics)

---

## Prerequisites

**Token Dosyalari**: `_spacing.scss`, `_shapes.scss`, `_motion.scss`, `_elevation.scss`, `_states.scss`

```bash
ls src/styles/md3/  # Token dosyalarini dogrula
```

---

## STEP 3: Spacing Token Audit (HIGH)

### 3.1 Hardcoded Pixel Spacing Detection
```bash
grep -rn "padding:\s*[0-9]\+px\|margin:\s*[0-9]\+px\|gap:\s*[0-9]\+px" --include="*.scss" src/app/
```
**Kural**: Pixel degerler ihlaldir. Token sistemi kullanilmali.

**Duzeltme Ornekleri**:
```diff
- padding: 4px;
+ padding: var(--md-sys-spacing-1);

- padding: 8px;
+ padding: var(--md-sys-spacing-2);

- padding: 12px;
+ padding: var(--md-sys-spacing-3);

- padding: 16px;
+ padding: var(--md-sys-spacing-4);

- margin: 20px;
+ margin: var(--md-sys-spacing-5);

- margin: 24px;
+ margin: var(--md-sys-spacing-6);

- gap: 32px;
+ gap: var(--md-sys-spacing-8);

- padding: 40px;
+ padding: var(--md-sys-spacing-10);

- padding: 48px;
+ padding: var(--md-sys-spacing-12);

- padding: 64px;
+ padding: var(--md-sys-spacing-16);
```

### 3.2 Spacing Scale Reference (4px Base)

| Token | Value | Kullanim |
|-------|-------|----------|
| `--md-sys-spacing-0` | 0 | Reset, no spacing |
| `--md-sys-spacing-1` | 4px | Micro spacing, icon padding |
| `--md-sys-spacing-2` | 8px | Button padding, chip spacing |
| `--md-sys-spacing-3` | 12px | Compact card padding |
| `--md-sys-spacing-4` | 16px | Card padding, standard gap |
| `--md-sys-spacing-5` | 20px | Medium component gap |
| `--md-sys-spacing-6` | 24px | Section gaps, form spacing |
| `--md-sys-spacing-8` | 32px | Component separation |
| `--md-sys-spacing-10` | 40px | Large gap |
| `--md-sys-spacing-12` | 48px | Section padding mobile |
| `--md-sys-spacing-16` | 64px | Section padding tablet |
| `--md-sys-spacing-20` | 80px | Large section |
| `--md-sys-spacing-24` | 96px | Extra large spacing |

### 3.3 Section-Specific Tokens

| Token | Value | Kullanim |
|-------|-------|----------|
| `--md-sys-spacing-section-mobile` | 60px | Mobile section padding |
| `--md-sys-spacing-section-desktop` | 100px | Desktop section padding |
| `--md-sys-spacing-container-x` | 24px | Container horizontal padding |
| `--md-sys-spacing-container-x-mobile` | 16px | Mobile container padding |
| `--md-sys-spacing-card-padding` | 24px | Default card internal padding |
| `--md-sys-spacing-card-gap` | 24px | Gap between cards in grid |

---

## STEP 4: Shape Token Audit (HIGH)

### 4.1 Hardcoded Border Radius Detection
```bash
grep -rn "border-radius:\s*[0-9]" --include="*.scss" src/app/
```

**Duzeltme Ornekleri**:
```diff
- border-radius: 0;
+ border-radius: var(--md-sys-shape-corner-none);

- border-radius: 4px;
+ border-radius: var(--md-sys-shape-corner-extra-small);

- border-radius: 8px;
+ border-radius: var(--md-sys-shape-corner-small);

- border-radius: 12px;
+ border-radius: var(--md-sys-shape-corner-medium);

- border-radius: 16px;
+ border-radius: var(--md-sys-shape-corner-large);

- border-radius: 20px;
+ border-radius: var(--md-sys-shape-corner-large);

- border-radius: 28px;
+ border-radius: var(--md-sys-shape-corner-extra-large);

- border-radius: 50%;
+ border-radius: var(--md-sys-shape-corner-full);

- border-radius: 9999px;
+ border-radius: var(--md-sys-shape-corner-full);
```

### 4.2 Shape Scale Reference

| Token | Value | Kullanim |
|-------|-------|----------|
| `--md-sys-shape-corner-none` | 0 | Sharp edges, tables |
| `--md-sys-shape-corner-extra-small` | 4px | Chip, tooltip, badge |
| `--md-sys-shape-corner-small` | 8px | Button, text field, small card |
| `--md-sys-shape-corner-medium` | 12px | Card, dialog, dropdown |
| `--md-sys-shape-corner-large` | 16px | Feature card, image container |
| `--md-sys-shape-corner-extra-large` | 28px | Modal, bottom sheet |
| `--md-sys-shape-corner-full` | 9999px | Pill button, FAB, avatar |

### 4.3 Asymmetric Corner Tokens

| Token | Kullanim |
|-------|----------|
| `--md-sys-shape-corner-extra-large-top` | Bottom sheet (28px 28px 0 0) |
| `--md-sys-shape-corner-large-end` | Navigation drawer (0 16px 16px 0) |
| `--md-sys-shape-corner-large-start` | Navigation drawer (16px 0 0 16px) |
| `--md-sys-shape-corner-medium-top` | Card header (12px 12px 0 0) |

---

## STEP 5: Motion Token Audit (HIGH)

### 5.1 Hardcoded Transitions Detection
```bash
grep -rn "transition:.*[0-9]\+ms\|transition:.*[0-9]\+s[^y]" --include="*.scss" src/app/ | grep -v "var(--md-sys"
```

**Duzeltme Ornekleri**:
```diff
- transition: all 0.3s ease;
+ transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);

- transition: transform 200ms ease-out;
+ transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized);

- transition: opacity 0.15s;
+ transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);

- transition: background-color 0.2s ease-in-out;
+ transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);

- transition: color 150ms linear;
+ transition: color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
```

### 5.2 Hardcoded Easings Detection
```bash
grep -rn "ease-in\|ease-out\|ease-in-out\|cubic-bezier" --include="*.scss" src/app/ | grep -v "var(--md-sys"
```

### 5.3 Expressive Easing Reference (Spring Physics)

| Preset | Curve | Kullanim |
|--------|-------|----------|
| `expressive-standard` | `cubic-bezier(0.4, 1.4, 0.2, 1)` | Card hover, button press |
| `expressive-decelerate` | `cubic-bezier(0, 1.4, 0.2, 1)` | Element entrance, appear |
| `expressive-accelerate` | `cubic-bezier(0.4, 0, 0.2, 1)` | Element exit, disappear |

### 5.4 Standard Easing Reference

| Preset | Curve | Kullanim |
|--------|-------|----------|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | Utility, simple transitions |
| `emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Default, important elements |
| `emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Enter animations |
| `emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exit animations |

### 5.5 Duration Scale Reference

| Token | Value | Kullanim |
|-------|-------|----------|
| `short1` | 50ms | Ripple start |
| `short2` | 100ms | Micro fade, tooltip appear |
| `short3` | 150ms | Quick feedback, state |
| `short4` | 200ms | Button state change |
| `medium1` | 250ms | Standard transition |
| `medium2` | 300ms | Card hover, default |
| `medium3` | 350ms | Complex state change |
| `medium4` | 400ms | Modal entrance |
| `long1` | 450ms | Page element animate |
| `long2` | 500ms | Complex animation |
| `long3` | 550ms | Elaborate motion |
| `long4` | 600ms | Page transition |

### 5.6 Reduced Motion Support (WCAG 2.2 CRITICAL)
```bash
grep -rn "prefers-reduced-motion" --include="*.scss" src/
```

**Gerekli Pattern** (`_motion.scss`):
```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

---

## STEP 6: Elevation Token Audit (MEDIUM)

### 6.1 Hardcoded Box Shadows Detection
```bash
grep -rn "box-shadow:\s*0" --include="*.scss" src/app/ | grep -v "var(--md-sys"
```

**Duzeltme Ornekleri**:
```diff
- box-shadow: none;
+ box-shadow: var(--md-sys-elevation-level0);

- box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
+ box-shadow: var(--md-sys-elevation-level1);

- box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
+ box-shadow: var(--md-sys-elevation-level2);

- box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
+ box-shadow: var(--md-sys-elevation-level3);

- box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
+ box-shadow: var(--md-sys-elevation-level4);

- box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
+ box-shadow: var(--md-sys-elevation-level5);
```

### 6.2 Elevation Level Reference

| Level | Token | Kullanim |
|-------|-------|----------|
| 0 | `level0` | Flat surface, no shadow |
| 1 | `level1` | Card at rest, navigation |
| 2 | `level2` | Raised card, dropdown, hover |
| 3 | `level3` | FAB, modal overlay |
| 4 | `level4` | FAB hover, elevated modal |
| 5 | `level5` | Tooltip, popover, top level |

### 6.3 Tonal Elevation (Dark Mode Alternative)

| Elevation | Surface Token | Usage |
|-----------|---------------|-------|
| Level 0 | `surface` | Base background |
| Level 1 | `surface-container-low` | Subtle elevation |
| Level 2 | `surface-container` | Standard elevation |
| Level 3 | `surface-container-high` | Prominent elevation |
| Level 4 | `surface-container-highest` | Maximum elevation |

---

## STEP 7: State Layer Tokens (MEDIUM)

### 7.1 State Layer Opacity Reference

| State | Opacity | Token |
|-------|---------|-------|
| Hover | 8% | `--md-sys-state-hover-opacity` |
| Focus | 10% | `--md-sys-state-focus-opacity` |
| Pressed | 10% | `--md-sys-state-pressed-opacity` |
| Dragged | 16% | `--md-sys-state-dragged-opacity` |
| Disabled | 38% | `--md-sys-state-disabled-opacity` |

### 7.2 State Layer Implementation Pattern
```scss
.interactive-element {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
    pointer-events: none;
    border-radius: inherit;
  }

  &:hover::before {
    opacity: var(--md-sys-state-hover-opacity);
  }
  &:focus-visible::before {
    opacity: var(--md-sys-state-focus-opacity);
  }
  &:active::before {
    opacity: var(--md-sys-state-pressed-opacity);
  }
  &:disabled::before {
    opacity: 0;
  }
}
```

---

## Phase 1B Output Template

```markdown
## Spacing, Shape, Motion & Elevation Audit - Phase 1B
### Date: YYYY-MM-DD

### HIGH Violations
| Dosya | Satir | Sorun | Mevcut | Gerekli Token |
|-------|-------|-------|--------|---------------|

### MEDIUM Violations
| Dosya | Satir | Sorun |
|-------|-------|-------|
```

---

## Verification Commands

```bash
echo "=== PHASE 1B VERIFICATION ===" && \
echo "--- SPACING ---" && grep -rn "padding:\s*[0-9]\+px" --include="*.scss" src/app/ | wc -l && \
echo "--- MARGIN ---" && grep -rn "margin:\s*[0-9]\+px" --include="*.scss" src/app/ | wc -l && \
echo "--- GAP ---" && grep -rn "gap:\s*[0-9]\+px" --include="*.scss" src/app/ | wc -l && \
echo "--- SHAPE ---" && grep -rn "border-radius:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "--- MOTION DURATION ---" && grep -rn "transition:.*[0-9]\+ms" --include="*.scss" src/app/ | grep -v "var(--md-sys" | wc -l && \
echo "--- MOTION EASING ---" && grep -rn "ease-in\|ease-out\|cubic-bezier" --include="*.scss" src/app/ | grep -v "var(--md-sys" | wc -l && \
echo "--- ELEVATION ---" && grep -rn "box-shadow:\s*0" --include="*.scss" src/app/ | grep -v "var(--md-sys" | wc -l && \
echo "--- REDUCED MOTION ---" && grep -rn "prefers-reduced-motion" --include="*.scss" src/ | wc -l
```

---

## AUTO-CONTINUE

Sonraki workflow: `.agent/workflows/md3-audit-2.md`
