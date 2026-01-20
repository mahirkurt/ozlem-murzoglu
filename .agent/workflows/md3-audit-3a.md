---
description: "MD3 Audit Phase 3A: Accessibility & Dark Mode Compliance"
version: "3.0"
last_updated: "2025-12-19"
---

# MD3 Audit Phase 3A: Accessibility & Dark Mode

> **Workflow**: 3A of 5 | **Prev**: `md3-audit-2.md` | **Next**: `md3-audit-3b.md`
> **Authority**: `src/styles/MASTER-STYLE-GUIDE.md` (v5.0 Final Production Edition)
> **Rules**: `.agent/rules/md3-pages-part2.md`, `.agent/rules/md3-pages-part3.md`
> **Scope**: WCAG 2.2 erisileblirlik, keyboard navigation, dark mode token uyumlulugu

---

## Prerequisites

**Kontrol Dosyalari**: `_colors.scss`, `_motion.scss`, `_states.scss`, `src/app/**/*.scss`, `src/app/**/*.html`

```bash
ls src/styles/md3/
npm start  # localhost:4200 bekle
```

---

## STEP 1: Focus States (CRITICAL - WCAG 2.4.7)

### 1.1 Focus-Visible Detection
```bash
grep -rn ":focus-visible" --include="*.scss" src/app/ | wc -l
grep -rn ":focus-visible" --include="*.scss" src/styles/ | wc -l
```

### 1.2 Required Focus Pattern
```scss
/* Global focus-visible */
*:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Remove outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Filled button focus */
.md3-button-filled:focus-visible {
  outline: 2px solid var(--md-sys-color-on-primary-container);
  outline-offset: 2px;
}

/* Link focus */
a:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  text-decoration: underline;
}

/* Form element focus */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-color: var(--md-sys-color-primary);
}

/* Card focus */
.md3-card-elevated:focus-visible,
[tabindex="0"]:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 4px;
}
```

### 1.3 Focus Ring Violation Check
```bash
grep -rn "outline:\s*none" --include="*.scss" src/app/ | grep -v "focus-visible"
```
**Kural**: `outline: none` SADECE `:focus:not(:focus-visible)` icinde kullanilabilir.

---

## STEP 2: Keyboard Navigation (WCAG 2.1.1)

### 2.1 Navigation Checklist
- [ ] Tab ile TUM interaktif elementlere ulasim
- [ ] Focus sirasi DOM order ile ayni (tabindex kotu kullanim yok)
- [ ] Skip link mevcut ve calisir
- [ ] Modal'da focus trap aktif
- [ ] Escape modal/dropdown kapatir
- [ ] Enter/Space butonlari aktive eder
- [ ] Arrow keys menu/listbox navigation
- [ ] Home/End keys list basina/sonuna

### 2.2 Skip Link Detection
```bash
grep -rn "skip-to\|skip-link" --include="*.html" src/app/
```

**Gerekli Skip Link Pattern**:
```html
<!-- app.component.html basinda -->
<a href="#main-content" class="skip-link">
  {{ 'ACCESSIBILITY.SKIP_TO_CONTENT' | translate }}
</a>

<!-- Main content'de -->
<main id="main-content" tabindex="-1" role="main">
  ...
</main>
```

**Skip Link Style**:
```scss
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--md-sys-spacing-4);
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-primary);
  padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4);
  border-radius: var(--md-sys-shape-corner-small);
  z-index: 9999;
  text-decoration: none;
  font-weight: 500;

  &:focus {
    top: var(--md-sys-spacing-2);
    outline: 2px solid var(--md-sys-color-primary);
  }
}
```

### 2.3 Focus Trap Pattern (Modal)
```typescript
@HostListener('keydown', ['$event'])
handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    this.close();
  }
  if (event.key === 'Tab') {
    this.trapFocus(event);
  }
}

private trapFocus(event: KeyboardEvent) {
  const focusableElements = this.el.nativeElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
```

---

## STEP 3: Reduced Motion (CRITICAL - WCAG 2.3.3)

### 3.1 Detection
```bash
grep -rn "prefers-reduced-motion" --include="*.scss" src/
```

### 3.2 Required Global Pattern
```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 3.3 Keyframes Check
```bash
grep -rn "@keyframes" --include="*.scss" src/app/
```
**Kural**: Her `@keyframes` icin reduced-motion alternative olmali.

### 3.4 Essential vs Decorative Motion
- **Decorative**: Disabled with reduced-motion (hover effects, page transitions)
- **Essential**: Simplified but preserved (loading spinners, progress indicators)

---

## STEP 4: Touch Targets (CRITICAL - WCAG 2.5.8)

### 4.1 Size Check
```bash
grep -rn "min-height:\s*48\|min-width:\s*48" --include="*.scss" src/app/
```

### 4.2 Touch Target Requirements
| Element | Min Size | Spacing |
|---------|----------|---------|
| Button | 48x48dp | 8dp gap |
| Icon button | 48x48dp | 8dp gap |
| Input field | 48dp height | - |
| List item | 48dp height | - |
| Checkbox/Radio | 48x48dp | - |
| Link (inline) | 24px height | - |
| Tab | 48dp height | - |

### 4.3 Spacing Check
```bash
grep -rn "gap:\s*[0-7]px" --include="*.scss" src/app/
```
**Kural**: Interaktif elementler arasi min 8dp spacing.

### 4.4 Touch Target Implementation
```scss
.icon-button {
  min-width: 48px;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--md-sys-spacing-2);
}

.touch-target-wrapper {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
  }
}
```

---

## STEP 5: Color Contrast (WCAG 1.4.3)

### 5.1 Contrast Requirements
| Content | Min Ratio |
|---------|-----------|
| Normal text (<18px) | 4.5:1 |
| Large text (≥18px bold, ≥24px) | 3:1 |
| UI components (borders, icons) | 3:1 |
| Focus indicators | 3:1 |
| Placeholder text | 4.5:1 |

### 5.2 OKLCH Contrast Verification (Pre-tested)
| Combination | Light | Dark |
|-------------|-------|------|
| on-surface / surface | ~12:1 ✓ | ~10:1 ✓ |
| primary / surface | ~4.5:1 ✓ | ~5:1 ✓ |
| on-surface-variant / surface | ~6:1 ✓ | ~5:1 ✓ |
| on-primary / primary | ~8:1 ✓ | ~7:1 ✓ |

### 5.3 Lighthouse Testing
```bash
npx lighthouse http://localhost:4200 --only-categories=accessibility --output=html
```

---

## STEP 6: ARIA Attributes (WCAG 4.1.2)

### 6.1 Detection
```bash
grep -rn "aria-" --include="*.html" src/app/ | wc -l
grep -rn "role=" --include="*.html" src/app/ | wc -l
```

### 6.2 Required ARIA Patterns
```html
<!-- Icon-only button -->
<button aria-label="{{ 'COMMON.CLOSE' | translate }}">
  <span class="material-icons-rounded" aria-hidden="true">close</span>
</button>

<!-- Accordion -->
<button aria-expanded="false" aria-controls="panel-1" id="accordion-1">
  {{ 'FAQ.QUESTION_1' | translate }}
</button>
<div id="panel-1" role="region" aria-labelledby="accordion-1" hidden>
  {{ 'FAQ.ANSWER_1' | translate }}
</div>

<!-- Navigation -->
<nav role="navigation" aria-label="{{ 'HEADER.MAIN_NAV' | translate }}">
  <a [attr.aria-current]="isActive ? 'page' : null" [routerLink]="link">
    {{ label | translate }}
  </a>
</nav>

<!-- Loading state -->
<div aria-live="polite" aria-busy="true">
  {{ 'COMMON.LOADING' | translate }}
</div>

<!-- Form error -->
<input [attr.aria-describedby]="hasError ? 'error-' + id : null"
       [attr.aria-invalid]="hasError">
<span [id]="'error-' + id" role="alert" *ngIf="hasError">
  {{ errorMessage | translate }}
</span>

<!-- Image -->
<img [src]="src" [alt]="altText | translate">
```

### 6.3 Landmark Roles
```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main role="main" id="main-content">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

---

## STEP 7: Dark Mode (CRITICAL)

### 7.1 Detection
```bash
grep -rn "prefers-color-scheme: dark" --include="*.scss" src/styles/
```

### 7.2 Surface Token Mapping (OKLCH)
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| surface | oklch(98% 0.005 85) | oklch(18% 0.01 85) |
| surface-dim | oklch(90% 0.005 85) | oklch(14% 0.01 85) |
| surface-container-lowest | oklch(100% 0 0) | oklch(14% 0.005 85) |
| surface-container-low | oklch(98% 0 0) | oklch(18% 0.005 85) |
| surface-container | oklch(97% 0 0) | oklch(22% 0.005 85) |
| surface-container-high | oklch(94% 0 0) | oklch(26% 0.005 85) |
| surface-container-highest | oklch(92% 0 0) | oklch(30% 0.005 85) |

### 7.3 Primary Token Mapping
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| primary | oklch(57% 0.15 194) | oklch(70% 0.12 194) |
| on-primary | oklch(100% 0 0) | oklch(20% 0.043 194) |
| primary-container | oklch(86% 0.057 194) | oklch(30% 0.08 194) |
| on-primary-container | oklch(20% 0.043 194) | oklch(86% 0.057 194) |

### 7.4 Text Token Mapping
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| on-surface | oklch(24% 0.02 85) | oklch(90% 0.01 85) |
| on-surface-variant | oklch(45% 0.02 85) | oklch(75% 0.01 85) |

### 7.5 No Pure Black (CRITICAL)
```bash
grep -rn "#000000\|#000[^0-9a-f]\|oklch(0%" --include="*.scss" src/
```
**Kural**: Pure black (#000) YASAK. Min `oklch(14%)` kullanilmali.

### 7.6 Glass Card Dark Adaptation
```scss
.md3-glass-card {
  background: oklch(from var(--md-sys-color-surface) l c h / 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid oklch(from var(--md-sys-color-outline) l c h / 0.1);

  @media (prefers-color-scheme: dark) {
    background: oklch(from var(--md-sys-color-surface) l c h / 0.5);
    border: 1px solid oklch(100% 0 0 / 0.08);
  }
}
```

### 7.7 Elevation in Dark Mode
Dark mode'da shadow yerine tonal elevation:
- Level 1: `surface-container-low`
- Level 2: `surface-container`
- Level 3: `surface-container-high`
- Level 4: `surface-container-highest`

---

## STEP 8: High Contrast Mode (A11Y)

### 8.1 Detection
```bash
grep -rn "prefers-contrast" --include="*.scss" src/
```

### 8.2 High Contrast Pattern
```scss
@media (prefers-contrast: more) {
  :root {
    --md-sys-color-outline: oklch(0% 0 0);
    --md-sys-color-on-surface: oklch(0% 0 0);
  }
  *:focus-visible {
    outline-width: 3px;
  }
  .md3-button-filled,
  .md3-button-elevated {
    border: 2px solid currentColor;
  }
}
```

---

## Phase 3A Output Template

```markdown
## Accessibility & Dark Mode Audit - Phase 3A
### Date: YYYY-MM-DD

### Focus State Issues
| Dosya | Satir | Sorun |
|-------|-------|-------|

### Touch Target Issues
| Dosya | Element | Current Size | Required |
|-------|---------|--------------|----------|

### Dark Mode Issues
| Dosya | Satir | Sorun |
|-------|-------|-------|

### ARIA Issues
| Dosya | Element | Missing Attribute |
|-------|---------|-------------------|
```

---

## Verification Commands

```bash
echo "=== PHASE 3A VERIFICATION ===" && \
echo "--- FOCUS STATES ---" && grep -rn ":focus-visible" --include="*.scss" src/ | wc -l && \
echo "--- REDUCED MOTION ---" && grep -rn "prefers-reduced-motion" --include="*.scss" src/ | wc -l && \
echo "--- SKIP LINK ---" && grep -rn "skip-link\|skip-to" --include="*.html" src/app/ | wc -l && \
echo "--- ARIA ATTRS ---" && grep -rn "aria-" --include="*.html" src/app/ | wc -l && \
echo "--- ROLES ---" && grep -rn "role=" --include="*.html" src/app/ | wc -l && \
echo "--- DARK MODE ---" && grep -rn "prefers-color-scheme: dark" --include="*.scss" src/styles/ | wc -l && \
echo "--- PURE BLACK ---" && grep -rn "#000000\|#000[^0-9a-f]" --include="*.scss" src/ | wc -l && \
echo "--- HIGH CONTRAST ---" && grep -rn "prefers-contrast" --include="*.scss" src/ | wc -l
```

---

## AUTO-CONTINUE

Sonraki workflow: `.agent/workflows/md3-audit-3b.md`
