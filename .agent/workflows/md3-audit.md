---
description: MD3 Design System Audit Process v3.0
version: "3.0"
last_updated: "2025-12-19"
---

# MD3 Design System Audit Process

Bu workflow, Material Design 3 Expressive (MD3) tasarim sisteminin eksiksiz uygulandigini dogrulamak icin standart proseduru tanimlar.

## Audit Workflow Haritasi

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MD3 AUDIT WORKFLOW v3.0                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Phase 1A          Phase 1B          Phase 2                       │
│   ┌─────────┐       ┌─────────┐       ┌─────────┐                   │
│   │ COLOR   │  ───► │ SPACING │  ───► │COMPONENT│                   │
│   │ TYPO    │       │ SHAPE   │       │STRUCTURE│                   │
│   │         │       │ MOTION  │       │ I18N    │                   │
│   │         │       │ ELEV.   │       │         │                   │
│   └─────────┘       └─────────┘       └─────────┘                   │
│        │                 │                 │                         │
│        ▼                 ▼                 ▼                         │
│   Phase 3A          Phase 3B                                        │
│   ┌─────────┐       ┌─────────┐                                     │
│   │ A11Y    │  ───► │ VISUAL  │  ───► MERGE READY                   │
│   │ DARK    │       │ FINAL   │                                     │
│   │ MODE    │       │ CHECK   │                                     │
│   └─────────┘       └─────────┘                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Yetki ve Referans Dokumanlar

| Dokuman | Yol | Icerik |
|---------|-----|--------|
| **Tasarim Anayasasi** | `src/styles/MASTER-STYLE-GUIDE.md` | v5.0 Final Production Edition |
| **Token Rules** | `.agent/rules/md3-tokens-part*.md` | Color, Typography, Spacing, Motion |
| **Component Rules** | `.agent/rules/md3-components-part*.md` | Button, Card, Navigation, Forms |
| **Page Rules** | `.agent/rules/md3-pages-part*.md` | Structure, Layout, A11y |
| **Design Rules** | `.agent/rules/md3-design.md` | Philosophy, Brand Identity |

## Prerequisites

```bash
# 1. Node modules yuklu olmali
npm install

# 2. Dev server calisir olmali
npm start  # localhost:4200

# 3. Token dosyalari mevcut olmali
ls src/styles/md3/
# Beklenen: _colors.scss, _typography.scss, _shapes.scss, _elevation.scss,
#           _motion.scss, _spacing.scss, _states.scss, _breakpoints.scss,
#           _icons.scss, _effects.scss, _unified-layout.scss, _utilities.scss,
#           _accessibility.scss, _print.scss, _index.scss
#           components/, sections/
```

## Audit Fazlari

### Phase 1A: Color & Typography Token Compliance
**Dosya**: `.agent/workflows/md3-audit-1a.md`
**Kapsam**: Renk ve tipografi token uyumlulugu
**Kritik**: OKLCH color space, Figtree/DM Sans dual-font

### Phase 1B: Spacing, Shape, Motion & Elevation Tokens
**Dosya**: `.agent/workflows/md3-audit-1b.md`
**Kapsam**: 4px grid, shape tokens, spring physics, tonal elevation
**Kritik**: Reduced motion support (WCAG 2.3.3)

### Phase 2: Component & Structure Compliance
**Dosya**: `.agent/workflows/md3-audit-2.md`
**Kapsam**: Page structure, card/button system, iconography, i18n
**Kritik**: Material Symbols only (no FontAwesome)

### Phase 3A: Accessibility & Dark Mode
**Dosya**: `.agent/workflows/md3-audit-3a.md`
**Kapsam**: WCAG 2.2, keyboard nav, focus states, dark mode tokens
**Kritik**: Touch targets 48dp, focus-visible, no pure black

### Phase 3B: Visual Verification & Action Plan
**Dosya**: `.agent/workflows/md3-audit-3b.md`
**Kapsam**: Manuel gorsel dogrulama, severity classification, remediation
**Kritik**: Final checklist, merge kriterleri

---

## Hizli Audit Komutlari

### Tek Satirlik Tum Ihlalleri Say
```bash
echo "=== MD3 QUICK AUDIT ===" && \
echo "Hex colors:" && grep -rn "#[0-9a-fA-F]\{3,6\}" --include="*.scss" src/app/ | wc -l && \
echo "Font-size px:" && grep -rn "font-size:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "Padding px:" && grep -rn "padding:\s*[0-9]\+px" --include="*.scss" src/app/ | wc -l && \
echo "Border-radius:" && grep -rn "border-radius:\s*[0-9]" --include="*.scss" src/app/ | wc -l && \
echo "FontAwesome:" && grep -rn "fa-" --include="*.html" src/app/ | wc -l && \
echo "Hardcoded text:" && grep -rn ">[A-Za-z]\{5,\}<" --include="*.html" src/app/pages/ | grep -v "{{" | wc -l
```

### Token Kullanim Sayilari
```bash
echo "=== TOKEN USAGE ===" && \
echo "Color tokens:" && grep -rn "var(--md-sys-color" --include="*.scss" src/ | wc -l && \
echo "Typography tokens:" && grep -rn "var(--md-sys-typescale" --include="*.scss" src/ | wc -l && \
echo "Spacing tokens:" && grep -rn "var(--md-sys-spacing" --include="*.scss" src/ | wc -l && \
echo "Shape tokens:" && grep -rn "var(--md-sys-shape" --include="*.scss" src/ | wc -l && \
echo "Motion tokens:" && grep -rn "var(--md-sys-motion" --include="*.scss" src/ | wc -l && \
echo "Elevation tokens:" && grep -rn "var(--md-sys-elevation" --include="*.scss" src/ | wc -l
```

---

## Severity Classification

| Seviye | Aciklama | Ornek |
|--------|----------|-------|
| **CRITICAL** | Sifir tolerans, merge engeller | Hex color, FontAwesome, hardcoded font-size |
| **HIGH** | Duzeltilmeli, kalite etkiler | Hardcoded spacing/radius, missing page-header |
| **MEDIUM** | Iyilestirme, backlog'a alinabilir | Hardcoded shadow, minor a11y |
| **LOW** | Polish, nice-to-have | Micro-animation tweaks |

---

## Merge Kriterleri

Audit sonrasi merge icin asagidaki kosullar saglanmalidir:

- [ ] Tum CRITICAL ihlaller cozuldu
- [ ] Tum HIGH ihlaller cozuldu
- [ ] Build basarili (`npm run build`)
- [ ] i18n validation geciyor (`npm run i18n:check`)
- [ ] Light mode gorsel inceleme tamam
- [ ] Dark mode gorsel inceleme tamam
- [ ] Lighthouse accessibility score >= 90

---

## Playwright Testleri (Opsiyonel)

Otomatik gorsel testler icin:

```bash
npx playwright test tests/e2e/md3-visual-test.spec.js
```

---

## Audit Baslat

Audit'i baslatmak icin Phase 1A ile basla:

```
.agent/workflows/md3-audit-1a.md
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2025-12-19 | Updated authority doc to MASTER-STYLE-GUIDE.md, added part3 rules refs |
| 2.0 | 2025-12-17 | Initial 5-phase audit structure |
| 1.0 | 2025-12-15 | Basic Playwright-based audit |
