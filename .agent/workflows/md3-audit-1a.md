---
description: "MD3 Audit Phase 1A: Color & Typography Token Compliance"
version: "3.0"
last_updated: "2025-12-19"
---

# MD3 Audit Phase 1A: Color & Typography

> **Workflow**: 1A of 5 | **Next**: `md3-audit-1b.md`
> **Authority**: `src/styles/MASTER-STYLE-GUIDE.md` (v5.0 Final Production Edition)
> **Rules**: `.agent/rules/md3-tokens-part1.md`, `.agent/rules/md3-tokens-part2.md`, `.agent/rules/md3-tokens-part3.md`
> **Scope**: SCSS dosyalarindaki renk ve tipografi token uyumlulugu (OKLCH color space)

---

## Prerequisites

```bash
npm start  # localhost:4200 bekle
ls src/styles/md3/  # Token dosyalarini dogrula: _colors.scss, _typography.scss
```

**Gerekli Token Dosyalari**:
- `src/styles/md3/_colors.scss` - OKLCH renk tokenlari
- `src/styles/md3/_typography.scss` - Figtree/DM Sans type scale

---

## STEP 1: Color Token Audit (CRITICAL)

### 1.1 Hex Color Detection
```bash
grep -rn "#[0-9a-fA-F]\{3,6\}" --include="*.scss" --include="*.css" src/app/
```
**Kural**: TUM hex kodlar ihlaldir. Sifir tolerans. OKLCH token sistemi kullanilmali.

**Duzeltme Ornekleri**:
```diff
- color: #00798c;
+ color: var(--md-sys-color-primary);

- background: #fff;
+ background: var(--md-sys-color-surface);

- background: #f5f5f5;
+ background: var(--md-sys-color-surface-container);

- border: 1px solid #e0e0e0;
+ border: 1px solid var(--md-sys-color-outline);

- color: #333;
+ color: var(--md-sys-color-on-surface);

- color: #666;
+ color: var(--md-sys-color-on-surface-variant);
```

### 1.2 Named Color Detection
```bash
grep -rn "color:\s*\(white\|black\|red\|blue\|green\|gray\|grey\|teal\|orange\)" --include="*.scss" src/app/
```

**Duzeltme Ornekleri**:
```diff
- color: white;
+ color: var(--md-sys-color-on-primary);

- background: black;
+ background: var(--md-sys-color-inverse-surface);

- color: red;
+ color: var(--md-sys-color-error);

- color: green;
+ color: var(--md-sys-color-success);

- color: gray;
+ color: var(--md-sys-color-on-surface-variant);
```

### 1.3 RGBA/RGB Without Tokens
```bash
grep -rn "rgba(\|rgb(" --include="*.scss" src/app/ | grep -v "var(--md-sys"
```

**Duzeltme (OKLCH relative color syntax)**:
```diff
- background: rgba(0, 128, 128, 0.5);
+ background: oklch(from var(--md-sys-color-primary) l c h / 0.5);

- background: rgba(255, 255, 255, 0.8);
+ background: oklch(from var(--md-sys-color-surface) l c h / 0.8);

- box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
+ box-shadow: var(--md-sys-elevation-level2);

- border: 1px solid rgba(0, 0, 0, 0.12);
+ border: 1px solid var(--md-sys-color-outline-variant);
```

### 1.4 Color Token Reference (OKLCH Color Space)

**Primary Palette (Teal - Trust, Health, Calm)**:
| Token | OKLCH Value | Kullanim |
|-------|-------------|----------|
| `--md-sys-color-primary` | `oklch(57% 0.15 194)` | Header, CTA, link, brand |
| `--md-sys-color-on-primary` | `oklch(100% 0 0)` | Primary uzerinde text |
| `--md-sys-color-primary-container` | `oklch(86% 0.057 194)` | Secili durum bg, soft highlight |
| `--md-sys-color-on-primary-container` | `oklch(20% 0.043 194)` | Container uzerinde text |
| `--md-sys-color-primary-fixed` | `oklch(86% 0.057 194)` | Dark mode'da degismeyen |
| `--md-sys-color-primary-fixed-dim` | `oklch(70% 0.12 194)` | Dim variant |

**Secondary Palette (Amber - Energy, Joy, Warmth)**:
| Token | OKLCH Value | Kullanim |
|-------|-------------|----------|
| `--md-sys-color-secondary` | `oklch(79% 0.18 85)` | Highlight, badge, accent |
| `--md-sys-color-on-secondary` | `oklch(26% 0.04 45)` | Secondary uzerinde text |
| `--md-sys-color-secondary-container` | `oklch(96% 0.04 85)` | Tag, pozitif badge bg |
| `--md-sys-color-on-secondary-container` | `oklch(24% 0.05 85)` | Container text |

**Tertiary Palette (Coral - Care, Attention)**:
| Token | OKLCH Value | Kullanim |
|-------|-------------|----------|
| `--md-sys-color-tertiary` | `oklch(64% 0.19 39)` | Accent CTA, special action |
| `--md-sys-color-on-tertiary` | `oklch(100% 0 0)` | Tertiary uzerinde text |
| `--md-sys-color-tertiary-container` | `oklch(87% 0.07 39)` | Featured card bg |
| `--md-sys-color-on-tertiary-container` | `oklch(22% 0.06 39)` | Container text |

**Surface Hierarchy (Tonal Elevation - 6 Seviye)**:
| Token | OKLCH Value | Kullanim |
|-------|-------------|----------|
| `--md-sys-color-surface` | `oklch(98% 0.005 85)` | Ana sayfa arka plan (warm tint) |
| `--md-sys-color-surface-dim` | `oklch(90% 0.005 85)` | Dimmed surface |
| `--md-sys-color-surface-bright` | `oklch(98% 0.005 85)` | Bright variant |
| `--md-sys-color-surface-container-lowest` | `oklch(100% 0 0)` | Modal, dialog (en ust) |
| `--md-sys-color-surface-container-low` | `oklch(98% 0 0)` | Level 1 kartlar |
| `--md-sys-color-surface-container` | `oklch(97% 0 0)` | Default kartlar, elevated |
| `--md-sys-color-surface-container-high` | `oklch(94% 0 0)` | Vurgulu container, dropdown |
| `--md-sys-color-surface-container-highest` | `oklch(92% 0 0)` | Max tonal elevation |

**Text & Content Colors**:
| Token | Kullanim |
|-------|----------|
| `--md-sys-color-on-surface` | Primary text, headings |
| `--md-sys-color-on-surface-variant` | Secondary text, captions |
| `--md-sys-color-inverse-surface` | Inverse background (snackbar) |
| `--md-sys-color-inverse-on-surface` | Text on inverse |
| `--md-sys-color-inverse-primary` | Primary on inverse bg |

**Semantic Colors (Feedback)**:
| Token | OKLCH Value | Kullanim |
|-------|-------------|----------|
| `--md-sys-color-error` | `oklch(48% 0.22 28)` | Validation error, destructive |
| `--md-sys-color-on-error` | `oklch(100% 0 0)` | Error uzerinde text |
| `--md-sys-color-error-container` | `oklch(92% 0.05 28)` | Error message bg |
| `--md-sys-color-success` | `oklch(69% 0.19 142)` | Success feedback |
| `--md-sys-color-warning` | `oklch(75% 0.19 65)` | Caution notice |
| `--md-sys-color-info` | `oklch(65% 0.18 260)` | Informational badge |

**Outline & Divider**:
| Token | Kullanim |
|-------|----------|
| `--md-sys-color-outline` | Primary border, divider |
| `--md-sys-color-outline-variant` | Soft border, subtle divider |

---

## STEP 2: Typography Token Audit (CRITICAL)

### 2.1 Hardcoded Font Sizes
```bash
grep -rn "font-size:\s*[0-9]" --include="*.scss" src/app/
```

**Duzeltme Ornekleri**:
```diff
- font-size: 57px;
+ font-size: var(--md-sys-typescale-display-large-size);

- font-size: 45px;
+ font-size: var(--md-sys-typescale-display-medium-size);

- font-size: 36px;
+ font-size: var(--md-sys-typescale-display-small-size);

- font-size: 32px;
+ font-size: var(--md-sys-typescale-headline-large-size);

- font-size: 28px;
+ font-size: var(--md-sys-typescale-headline-medium-size);

- font-size: 24px;
+ font-size: var(--md-sys-typescale-headline-small-size);

- font-size: 22px;
+ font-size: var(--md-sys-typescale-title-large-size);

- font-size: 16px;
+ font-size: var(--md-sys-typescale-body-large-size);

- font-size: 14px;
+ font-size: var(--md-sys-typescale-body-medium-size);

- font-size: 12px;
+ font-size: var(--md-sys-typescale-body-small-size);
```

### 2.2 Hardcoded Font Weights
```bash
grep -rn "font-weight:\s*[0-9]" --include="*.scss" src/app/
```

**Duzeltme Ornekleri**:
```diff
- font-weight: 700;
+ font-weight: var(--md-sys-typescale-display-large-weight);

- font-weight: 600;
+ font-weight: var(--md-sys-typescale-headline-large-weight);

- font-weight: 500;
+ font-weight: var(--md-sys-typescale-title-large-weight);

- font-weight: 400;
+ font-weight: var(--md-sys-typescale-body-large-weight);
```

### 2.3 Wrong Font Families
```bash
grep -rn "font-family:" --include="*.scss" src/app/ | grep -v "var(--md-sys"
```

**Duzeltme**:
```diff
- font-family: 'Arial', sans-serif;
+ font-family: var(--md-sys-typescale-font-plain);

- font-family: 'Roboto', sans-serif;
+ font-family: var(--md-sys-typescale-font-brand);

- font-family: 'Helvetica';
+ font-family: var(--md-sys-typescale-body-large-font);
```

### 2.4 Hardcoded Line Heights
```bash
grep -rn "line-height:\s*[0-9]" --include="*.scss" src/app/ | grep -v "var(--md-sys"
```

### 2.5 Typography Scale Reference (Dual-Font Architecture)

**Display Scale (Figtree - Hero, Section Titles)**:
| Role | Size | Weight | Line H. | Tracking | Kullanim |
|------|------|--------|---------|----------|----------|
| `display-large` | clamp(3rem, 5vw+1rem, 57px) | 700 | 1.1 | -0.25px | Hero title |
| `display-medium` | clamp(2.25rem, 4vw+1rem, 45px) | 600 | 1.15 | 0 | Page title |
| `display-small` | clamp(1.75rem, 3vw+1rem, 36px) | 600 | 1.2 | 0 | Section title |

**Headline Scale (Figtree - Subsections)**:
| Role | Size | Weight | Line H. | Kullanim |
|------|------|--------|---------|----------|
| `headline-large` | clamp(1.75rem, 2vw+1rem, 32px) | 600 | 1.25 | Card title |
| `headline-medium` | clamp(1.5rem, 1.5vw+1rem, 28px) | 500 | 1.3 | Subsection |
| `headline-small` | clamp(1.25rem, 1vw+1rem, 24px) | 500 | 1.35 | Feature title |

**Title Scale (Figtree - Component Headers)**:
| Role | Size | Weight | Line H. | Kullanim |
|------|------|--------|---------|----------|
| `title-large` | 22px | 500 | 28px | List header |
| `title-medium` | 16px | 600 | 24px | Card header |
| `title-small` | 14px | 600 | 20px | Chip label |

**Body Scale (DM Sans - Content)**:
| Role | Size | Weight | Line H. | Tracking | Kullanim |
|------|------|--------|---------|----------|----------|
| `body-large` | 16px | 400 | 24px | 0.5px | Paragraf |
| `body-medium` | 14px | 400 | 20px | 0.25px | Secondary text |
| `body-small` | 12px | 400 | 16px | 0.4px | Caption |

**Label Scale (DM Sans - UI Elements)**:
| Role | Size | Weight | Line H. | Kullanim |
|------|------|--------|---------|----------|
| `label-large` | 14px | 500 | 20px | Button text |
| `label-medium` | 12px | 500 | 16px | Form label |
| `label-small` | 11px | 500 | 16px | Badge text |

---

## Phase 1A Output Template

```markdown
## Color & Typography Audit - Phase 1A
### Date: YYYY-MM-DD

### CRITICAL Violations
| Dosya | Satir | Sorun | Mevcut | Gerekli Token |
|-------|-------|-------|--------|---------------|
| | | Hex color | #xxx | var(--md-sys-color-*) |
| | | Font-size | Xpx | var(--md-sys-typescale-*-size) |
| | | Font-weight | X | var(--md-sys-typescale-*-weight) |
| | | Named color | white | var(--md-sys-color-*) |

### Token Usage Summary
- Color token kullanimi: X adet
- Typography token kullanimi: X adet
- Toplam ihlal sayisi: X adet
- CRITICAL: X | HIGH: X | MEDIUM: X
```

---

## Verification Commands

```bash
echo "=== PHASE 1A VERIFICATION ===" && \
echo "--- HEX COLORS (CRITICAL) ---" && \
grep -rn "#[0-9a-fA-F]\{3,6\}" --include="*.scss" src/app/ | wc -l && \
echo "--- NAMED COLORS (CRITICAL) ---" && \
grep -rn "color:\s*\(white\|black\|red\|green\)" --include="*.scss" src/app/ | wc -l && \
echo "--- FONT SIZES (CRITICAL) ---" && \
grep -rn "font-size:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "--- FONT WEIGHTS (CRITICAL) ---" && \
grep -rn "font-weight:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "--- RGBA WITHOUT TOKEN ---" && \
grep -rn "rgba(" --include="*.scss" src/app/ | grep -v "var(--md-sys" | wc -l && \
echo "=== TOKEN USAGE ===" && \
echo "Color tokens:" && grep -rn "var(--md-sys-color" --include="*.scss" src/app/ | wc -l && \
echo "Typography tokens:" && grep -rn "var(--md-sys-typescale" --include="*.scss" src/app/ | wc -l
```

---

## AUTO-CONTINUE

**Bu fazi tamamladiktan sonra otomatik olarak bir sonraki faza gec.**

Sonraki workflow dosyasini oku ve calistir:
```
.agent/workflows/md3-audit-1b.md
```
