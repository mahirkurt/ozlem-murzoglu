---
description: "MD3 Audit Phase 2: Component & Structure Compliance"
version: "3.0"
last_updated: "2025-12-19"
---

# MD3 Audit Phase 2: Component & Structure Compliance

> **Workflow**: 2 of 5 | **Prev**: `md3-audit-1b.md` | **Next**: `md3-audit-3a.md`
> **Authority**: `src/styles/MASTER-STYLE-GUIDE.md` (v5.0 Final Production Edition)
> **Rules**: `.agent/rules/md3-components-part1.md`, `.agent/rules/md3-components-part2.md`, `.agent/rules/md3-components-part3.md`, `.agent/rules/md3-pages-part1.md`
> **Scope**: Sayfa yapisi, component kullanimi, breadcrumb, card, button, icon ve i18n uyumlulugu

---

## Prerequisites

**Kontrol Dosyalari**: `src/app/pages/**/*.html`, `src/app/pages/**/*.ts`, `src/app/components/**/*.html`, `src/assets/i18n/*.json`

```bash
ls src/app/pages/
ls src/app/components/
```

---

## STEP 1: Page Structure (CRITICAL)

### 1.1 Page Header Usage Detection
```bash
grep -rn "app-page-header" --include="*.html" src/app/pages/ | wc -l
```
**Kural**: TUM alt sayfalar (homepage haric) `<app-page-header>` kullanmali.

### 1.2 Find Missing Page Headers
```bash
find src/app/pages -name "*.html" -type f | while read file; do
  if ! grep -q "app-page-header" "$file"; then
    if ! echo "$file" | grep -q "home"; then
      echo "EKSIK PAGE-HEADER: $file"
    fi
  fi
done
```

### 1.3 Hero Section Restriction
```bash
grep -rn "app-hero-section\|app-liquid-hero" --include="*.html" src/app/pages/ | grep -v "home"
```
**Kural**: Hero SADECE homepage'de kullanilabilir. Alt sayfalar page-header kullanir.

### 1.4 CTA Component Check
```bash
find src/app/pages -name "*.html" -type f | while read file; do
  if ! grep -q "app-contact-cta" "$file"; then
    echo "EKSIK CONTACT-CTA: $file"
  fi
done
```
**Kural**: TUM sayfalar `<app-contact-cta>` ile bitmeli.

### 1.5 Standard Page Structure Pattern
```html
<!-- Alt sayfa template -->
<app-page-header
  [title]="'PAGE.TITLE' | translate"
  [subtitle]="'PAGE.SUBTITLE' | translate"
  [breadcrumbs]="breadcrumbs">
</app-page-header>

<main class="page-content">
  <section class="section">
    <div class="container">
      <!-- Sayfa icerigi -->
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <!-- Alternatif arka plan section -->
    </div>
  </section>
</main>

<app-contact-cta></app-contact-cta>
```

### 1.6 Homepage Structure Pattern
```html
<!-- SADECE homepage icin -->
<app-liquid-hero></app-liquid-hero>

<main class="page-content">
  <section class="section">
    <div class="container">
      <!-- Homepage sections -->
    </div>
  </section>
</main>

<app-contact-cta></app-contact-cta>
```

---

## STEP 2: Breadcrumb System (HIGH)

### 2.1 Breadcrumb Format Detection
```bash
grep -rn "breadcrumbs\s*=" -A 8 --include="*.ts" src/app/pages/
```

**Gerekli Format**:
```typescript
breadcrumbs = [
  { translateKey: 'HEADER.NAV_HOME', url: '/' },
  { translateKey: 'HEADER.NAV_SERVICES', url: '/hizmetlerimiz' },
  { translateKey: 'SERVICES.BRIGHT_FUTURES.TITLE' }  // Son item - URL yok
];
```

### 2.2 Hardcoded Label Detection (IHLAL)
```bash
grep -rn "label:\s*['\"]" --include="*.ts" src/app/pages/ | grep -v "translateKey"
```
**Kural**: Breadcrumb'larda `label` yerine `translateKey` kullanilmali.

### 2.3 Breadcrumb Hierarchy
- Home her zaman ilk item
- Kategori sayfasi ikinci (varsa)
- Mevcut sayfa son item (URL yok)
- Max 4 seviye derinlik

---

## STEP 3: Card System (HIGH)

### 3.1 Card Variant Usage Detection
```bash
grep -rn "md3-card-elevated\|md3-card-filled\|md3-card-outlined\|md3-glass-card" --include="*.html" src/app/
```

**Card Variant Reference**:
| Variant | Class | Kullanim | Elevation |
|---------|-------|----------|-----------|
| Elevated | `.md3-card-elevated` | Default kartlar | level1 → level2 |
| Filled | `.md3-card-filled` | Dense UI, list | level0 (tonal) |
| Outlined | `.md3-card-outlined` | Form, secondary | level0 + border |
| Glass | `.md3-glass-card` | SADECE gradient bg | blur + alpha |

### 3.2 Glass Card Validation
```bash
grep -rn "md3-glass-card" -B 5 -A 5 --include="*.html" src/app/
```
**Kural**: Glassmorphism SADECE gradient veya image arka planlarda kullanilir.

### 3.3 Card Hover States
Her kart icin dogrulanmali:
- Default: `elevation-level1`
- Hover: `elevation-level2` + `scale(1.02)`
- Focus: `outline: 2px solid var(--md-sys-color-primary)`
- Transition: `var(--md-sys-motion-duration-medium2)`

### 3.4 Card Content Structure
```html
<article class="md3-card-elevated">
  <div class="card-media">
    <img [src]="image" [alt]="title" loading="lazy">
  </div>
  <div class="card-content">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
  </div>
  <div class="card-actions">
    <button class="md3-button-text">{{ 'COMMON.LEARN_MORE' | translate }}</button>
  </div>
</article>
```

---

## STEP 4: Button System (HIGH)

### 4.1 Button Variant Usage Detection
```bash
grep -rn "md3-button-filled\|md3-button-elevated\|md3-button-tonal\|md3-button-outlined\|md3-button-text" --include="*.html" src/app/
```

**Button Hierarchy Reference**:
| Variant | Oncelik | Kullanim | Visual |
|---------|---------|----------|--------|
| Filled | En yuksek | Primary CTA | Solid bg, white text |
| Elevated | Yuksek | Secondary CTA | Shadow + bg |
| Tonal | Orta | Subtle action | Soft bg, primary text |
| Outlined | Dusuk | Tertiary, cancel | Border only |
| Text | En dusuk | Inline link | Text only |

### 4.2 Max Filled Buttons Check
```bash
find src/app/pages -name "*.html" -type f | while read file; do
  count=$(grep -c "md3-button-filled" "$file" 2>/dev/null || echo "0")
  if [ "$count" -gt "3" ]; then
    echo "FAZLA FILLED BUTTON ($count): $file"
  fi
done
```
**Kural**: Sayfa basina max 3 filled button. Fazlasi hierarchy'yi bozar.

### 4.3 Button States
| State | Visual Feedback |
|-------|-----------------|
| Default | Base styling |
| Hover | 8% state layer + subtle scale |
| Pressed | 12% state layer |
| Focus | 2px outline + offset |
| Disabled | 38% opacity, no interaction |

### 4.4 Button with Icon Pattern
```html
<button class="md3-button-filled">
  <span class="material-icons-rounded" aria-hidden="true">calendar_today</span>
  {{ 'COMMON.BOOK_APPOINTMENT' | translate }}
</button>
```

---

## STEP 5: Iconography (CRITICAL)

### 5.1 FontAwesome Detection (IHLAL)
```bash
grep -rn "fa-\|fas \|fab \|far " --include="*.html" src/app/
```
**Kural**: FontAwesome YASAK. Sifir tolerans.

### 5.2 Material Icons Count
```bash
grep -rn "material-icons-rounded" --include="*.html" src/app/ | wc -l
```

### 5.3 Wrong Icon Variants Detection (IHLAL)
```bash
grep -rn "material-icons-outlined\|material-icons-sharp\|material-icons[^-]" --include="*.html" src/app/
```
**Kural**: SADECE `material-icons-rounded` kullanilir.

### 5.4 Icon Size Reference
| Context | Size | Token |
|---------|------|-------|
| Default | 24px | - |
| Button icon | 20px | - |
| Navigation | 28px | - |
| Hero/Feature | 40-48px | - |
| Card accent | 32px | - |
| Small/badge | 18px | - |

### 5.5 Icon Color Usage
- Inherit from parent: `currentColor`
- Primary accent: `var(--md-sys-color-primary)`
- Muted/secondary: `var(--md-sys-color-on-surface-variant)`
- Error state: `var(--md-sys-color-error)`
- Success state: `var(--md-sys-color-success)`

### 5.6 Icon Accessibility
```html
<!-- Decorative icon (hidden from screen readers) -->
<span class="material-icons-rounded" aria-hidden="true">home</span>

<!-- Icon-only button (needs aria-label) -->
<button aria-label="{{ 'COMMON.CLOSE' | translate }}">
  <span class="material-icons-rounded" aria-hidden="true">close</span>
</button>
```

---

## STEP 6: Container System (MEDIUM)

### 6.1 Container Classes Detection
```bash
grep -rn "class=\"container\|class=\"md3-container" --include="*.html" src/app/
```

**Container Reference**:
| Class | Max Width | Kullanim |
|-------|-----------|----------|
| `.container` | min(1440px, 90vw) | Default, general |
| `.container-lg` | 1240px | Wide content |
| `.container-md` | 1024px | Medium width |
| `.container-sm` | 960px | Narrow, forms |
| `.container-fluid` | 100% | Full width (rare) |

### 6.2 Container Padding
- Desktop: `var(--md-sys-spacing-container-x)` (24px)
- Mobile: `var(--md-sys-spacing-container-x-mobile)` (16px)

---

## STEP 7: Responsive & Grid (HIGH)

### 7.1 MD3 Breakpoint Detection
```bash
grep -rn "@media" --include="*.scss" src/app/ | grep -E "599px|600px|839px|840px"
```

**MD3 Breakpoint Reference**:
| Breakpoint | Range | Columns | Margin |
|------------|-------|---------|--------|
| Compact | 0-599px | 4 | 16px |
| Medium | 600-839px | 8 | 24px |
| Expanded | 840px+ | 12 | 24px |

### 7.2 Touch Targets (WCAG 2.2)
```bash
grep -rn "min-height:\s*48\|min-width:\s*48" --include="*.scss" src/app/
```
**Gerekli**: Interaktif elementler min 48x48dp.

### 7.3 Grid Gap Reference
- Card grids: `var(--md-sys-spacing-6)` (24px)
- Compact grids: `var(--md-sys-spacing-4)` (16px)
- Dense grids: `var(--md-sys-spacing-3)` (12px)

---

## STEP 8: i18n Compliance (CRITICAL)

### 8.1 Hardcoded Text Detection
```bash
grep -rn ">[A-Za-zÇÖŞÜİĞçöşüığ]\{5,\}<" --include="*.html" src/app/pages/ | grep -v "{{"
```
**Kural**: TUM visible text `{{ 'KEY' | translate }}` kullanmali.

### 8.2 Translate Pipe Count
```bash
grep -rn "| translate" --include="*.html" src/app/pages/ | wc -l
```

### 8.3 i18n Validation Commands
```bash
npm run i18n:validate  # Key kontrolu
npm run i18n:check     # Sync + validate
npm run i18n:sync      # Missing key sync
```

### 8.4 Translation Key Format
- Uppercase: `SERVICES.TITLE`
- Nested: `HEADER.NAV_HOME`
- Parameters: `{{ 'KEY' | translate:params }}`
- Pluralization: `{{ 'KEY' | translate:{count: n} }}`

---

## STEP 9: Section Standards (HIGH)

### 9.1 Section Title Pattern
```scss
.section-title {
  font-family: var(--md-sys-typescale-display-small-font);
  font-size: var(--md-sys-typescale-display-small-size);
  font-weight: var(--md-sys-typescale-display-small-weight);
  color: var(--md-sys-color-primary);
  text-align: center;
  margin-bottom: var(--md-sys-spacing-4);
}
```

### 9.2 Section Spacing Pattern
```scss
.section {
  padding-block: var(--md-sys-spacing-section-desktop);

  @media (max-width: 768px) {
    padding-block: var(--md-sys-spacing-section-mobile);
  }
}
```

### 9.3 Alternating Section Backgrounds
- Odd sections: `var(--md-sys-color-surface)`
- Even sections: `var(--md-sys-color-surface-container)`

---

## Phase 2 Output Template

```markdown
## Component & Structure Audit - Phase 2
### Date: YYYY-MM-DD

### Page Structure Issues
| Sayfa | Header Eksik | CTA Eksik | Hero Ihlal |
|-------|--------------|-----------|------------|

### Icon Violations
| Dosya | Satir | Sorun |
|-------|-------|-------|

### i18n Violations
| Dosya | Satir | Hardcoded Text |
|-------|-------|----------------|
```

---

## Verification Commands

```bash
echo "=== PHASE 2 VERIFICATION ===" && \
echo "--- PAGE HEADERS ---" && grep -rn "app-page-header" --include="*.html" src/app/pages/ | wc -l && \
echo "--- CONTACT CTA ---" && grep -rn "app-contact-cta" --include="*.html" src/app/pages/ | wc -l && \
echo "--- HERO (non-home) ---" && grep -rn "app-liquid-hero\|app-hero-section" --include="*.html" src/app/pages/ | grep -v "home" | wc -l && \
echo "--- FONTAWESOME ---" && grep -rn "fa-" --include="*.html" src/app/ | wc -l && \
echo "--- WRONG ICONS ---" && grep -rn "material-icons-outlined\|material-icons-sharp" --include="*.html" src/app/ | wc -l && \
echo "--- MATERIAL ICONS ---" && grep -rn "material-icons-rounded" --include="*.html" src/app/ | wc -l && \
echo "--- I18N PIPES ---" && grep -rn "| translate" --include="*.html" src/app/pages/ | wc -l
```

---

## AUTO-CONTINUE

Sonraki workflow: `.agent/workflows/md3-audit-3a.md`
