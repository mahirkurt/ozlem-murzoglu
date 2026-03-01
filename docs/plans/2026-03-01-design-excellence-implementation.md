# "Bilimsel Sicaklik" Design Excellence Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform ozlemmurzoglu.com from a clean but generic site into a distinctive "Scientific Warmth" identity that highlights Social Pediatrics, following the approved design in `docs/plans/2026-03-01-design-excellence-roadmap-design.md`.

**Architecture:** 9-phase progressive enhancement building on the existing MD3 token system (OKLCH colors, glassmorphism, 40+ animations). All new components are Angular 18 standalone components with i18n support. SVG illustrations are inline for zero HTTP overhead. CSS-only art for hero section, no external dependencies.

**Tech Stack:** Angular 18.2, SCSS with MD3 tokens, SVG inline illustrations, IntersectionObserver (native), Angular route animations, @ngx-translate

**Design Doc:** `docs/plans/2026-03-01-design-excellence-roadmap-design.md`
**Style Guide:** `docs/design/master-style-guide.md` (v6.0 — Bilimsel Sicaklik Edition)

---

## Task 1: Hero Section — Background & Layout Restructure

**Files:**
- Modify: `src/app/components/liquid-hero/liquid-hero.ts`
- Modify: `src/app/components/liquid-hero/liquid-hero.scss`
- Modify: `src/assets/i18n/tr.json` (HOME section)
- Modify: `src/assets/i18n/en.json` (HOME section)

**Step 1: Update hero SCSS to two-column asymmetric layout**

Change the hero from centered single-column to 60/40 split layout. Make the existing blob shapes visible (currently opacity: 0). Add dot-grid pattern overlay and amber ambient glow.

Key SCSS changes:
```scss
// In liquid-hero.scss
.hero-content {
  display: grid;
  grid-template-columns: 1fr 0.7fr;
  gap: var(--spacing-xl);
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

// Make blobs visible
.hero-float {
  opacity: 0.15; // was 0
}

// Add dot-grid pattern overlay
.hero-pattern-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--md-sys-color-on-surface) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.03;
  pointer-events: none;
}

// Amber ambient glow
.hero-ambient-glow {
  position: absolute;
  bottom: 10%;
  left: 15%;
  width: 400px;
  height: 300px;
  background: radial-gradient(ellipse, var(--md-sys-color-secondary) 0%, transparent 70%);
  opacity: 0.08;
  filter: blur(60px);
  pointer-events: none;
}
```

**Step 2: Update hero template for two-column layout**

Left column: overline + title + subtitle + CTA buttons.
Right column: CSS art placeholder (to be filled in Task 2).
Bottom row: accreditation badges.

**Step 3: Add new i18n keys**

```json
// tr.json HOME section additions
"HOME": {
  "HERO_OVERLINE": "SOSYAL PEDİATRİ & ÇOCUK SAĞLIĞI KLİNİĞİ",
  "HERO_BADGE_BRIGHT": "Bright Futures® Sertifikalı",
  "HERO_BADGE_TRIPLE_P": "Triple P® Lisanslı",
  "HERO_BADGE_SOCIAL_PED": "Sosyal Pediatri Doktora"
}
```

**Step 4: Run i18n check and verify**

Run: `npm run i18n:check`
Expected: PASS — all keys synced between tr.json and en.json

**Step 5: Commit**

```bash
git add src/app/components/liquid-hero/ src/assets/i18n/
git commit -m "feat(hero): restructure to two-column layout with visible blobs and pattern overlay"
```

---

## Task 2: Hero Section — CSS "Growth Tree" Art

**Files:**
- Modify: `src/app/components/liquid-hero/liquid-hero.ts`
- Modify: `src/app/components/liquid-hero/liquid-hero.scss`

**Step 1: Create the CSS growth tree in the right column**

Build an abstract organic branching structure using SVG paths and CSS animations. Branches represent different service areas with different color tones. Leaf nodes are small circular forms with breathing pulse animation.

```scss
// Growth tree keyframes
@keyframes tree-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1.5deg); }
}

@keyframes leaf-breathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}
```

The tree SVG should be inline in the component template with CSS classes for animation.

**Step 2: Add reduced-motion fallback**

```scss
@media (prefers-reduced-motion: reduce) {
  .tree-branch, .tree-leaf {
    animation: none !important;
  }
}
```

**Step 3: Test responsiveness**

On mobile (< 840px), the tree should either hide or scale down below the text content.

**Step 4: Commit**

```bash
git add src/app/components/liquid-hero/
git commit -m "feat(hero): add CSS growth tree art with organic animations"
```

---

## Task 3: SVG Service Icon System

**Files:**
- Create: `src/assets/icons/services/bright-futures.svg`
- Create: `src/assets/icons/services/triple-p.svg`
- Create: `src/assets/icons/services/sleep-program.svg`
- Create: `src/assets/icons/services/vaccination.svg`
- Create: `src/assets/icons/services/development.svg`
- Create: `src/assets/icons/services/laboratory.svg`
- Create: `src/assets/icons/services/evidence-based.svg`
- Create: `src/assets/icons/services/family-centered.svg`
- Create: `src/assets/icons/services/growth-focused.svg`

**Step 1: Create SVG icons following style rules**

Each SVG follows the rules in master-style-guide.md v6.0, Bolum 16.1.1:
- ViewBox: 0 0 48 48
- Stroke: 2px, round linecap/linejoin
- Main color: `currentColor` (inherits from CSS)
- Accent: via `class="accent"` fill
- No fixed colors — all via CSS custom properties

Example structure:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="..." />
  <circle class="accent" cx="..." cy="..." r="..." fill="var(--service-accent-color)" stroke="none" />
</svg>
```

**Step 2: Verify all 9 icons render correctly**

Open each SVG in browser and verify visual consistency (stroke width, style, proportions).

**Step 3: Commit**

```bash
git add src/assets/icons/services/
git commit -m "feat(icons): add 9 custom SVG service illustration icons"
```

---

## Task 4: Homepage New Sections — "Neden Sosyal Pediatri?" + "Sayilarla Biz"

**Files:**
- Create: `src/app/components/why-social-pediatrics/why-social-pediatrics.component.ts`
- Create: `src/app/components/why-social-pediatrics/why-social-pediatrics.component.html`
- Create: `src/app/components/why-social-pediatrics/why-social-pediatrics.component.scss`
- Create: `src/app/components/stats-section/stats-section.component.ts`
- Create: `src/app/components/stats-section/stats-section.component.html`
- Create: `src/app/components/stats-section/stats-section.component.scss`
- Modify: `src/app/pages/home/home.component.html`
- Modify: `src/app/pages/home/home.component.ts`
- Modify: `src/assets/i18n/tr.json`
- Modify: `src/assets/i18n/en.json`

**Step 1: Create WhySocialPediatrics component**

3-column value proposition section with SVG icons (evidence-based, family-centered, growth-focused). White background with thin teal vertical line on left edge.

```typescript
@Component({
  selector: 'app-why-social-pediatrics',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './why-social-pediatrics.component.html',
  styleUrl: './why-social-pediatrics.component.scss'
})
export class WhySocialPediatricsComponent {}
```

**Step 2: Create StatsSection component**

4 stat cards with countUp animation on scroll. Uses IntersectionObserver to trigger count animation when visible.

Stats: 15+ Years, 5000+ Families, 3 Certifications, AAP-Aligned

CountUp implementation: Use `requestAnimationFrame` loop, no external library. Trigger on IntersectionObserver entry.

```typescript
private animateCount(element: HTMLElement, target: number, duration: number): void {
  const start = performance.now();
  const update = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    element.textContent = Math.floor(eased * target).toString();
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = target.toString();
  };
  requestAnimationFrame(update);
}
```

**Step 3: Add both components to home.component.html**

Insert after hero, before doctor-bio (WhySocialPediatrics) and after services-section (StatsSection).

```html
<app-liquid-hero></app-liquid-hero>

<div scrollReveal="fade-up" [scrollDelay]="100">
  <app-why-social-pediatrics></app-why-social-pediatrics>
</div>

<div scrollReveal="fade-up" [scrollDelay]="150">
  <app-doctor-bio></app-doctor-bio>
</div>

<div scrollReveal="fade-up" [scrollDelay]="200">
  <app-services-section [locale]="locale"></app-services-section>
</div>

<div scrollReveal="fade-up" [scrollDelay]="250">
  <app-stats-section></app-stats-section>
</div>

<div scrollReveal="fade-up" [scrollDelay]="300">
  <app-google-business-reviews></app-google-business-reviews>
</div>

<div scrollReveal="fade-up" [scrollDelay]="350">
  <app-contact-cta></app-contact-cta>
</div>
```

**Step 4: Add i18n keys and run check**

```json
// tr.json
"HOME": {
  "WHY_SP_TITLE": "Neden Sosyal Pediatri?",
  "WHY_SP_EVIDENCE_TITLE": "Kanıta Dayalı Tıp",
  "WHY_SP_EVIDENCE_DESC": "Uluslararası kılavuzlar ve güncel araştırmalarla desteklenen yaklaşım.",
  "WHY_SP_FAMILY_TITLE": "Aile Merkezli Bakım",
  "WHY_SP_FAMILY_DESC": "Çocuğun sağlığını ailenin bütünlüğü içinde değerlendiren bakış açısı.",
  "WHY_SP_GROWTH_TITLE": "Gelişim Odaklı Yaklaşım",
  "WHY_SP_GROWTH_DESC": "Fiziksel sağlığın ötesinde, sosyal ve duygusal gelişimi de kapsayan bütüncül takip.",
  "STATS_TITLE": "Sayılarla Biz",
  "STATS_YEARS": "Yıl Deneyim",
  "STATS_FAMILIES": "Aile Takibi",
  "STATS_CERTS": "Sertifikasyon",
  "STATS_AAP": "AAP Uyumlu"
}
```

Run: `npm run i18n:check`

**Step 5: Commit**

```bash
git add src/app/components/why-social-pediatrics/ src/app/components/stats-section/ src/app/pages/home/ src/assets/i18n/
git commit -m "feat(home): add 'Why Social Pediatrics' and 'Stats' sections"
```

---

## Task 5: Service Card Redesign — Color-Coded Strips

**Files:**
- Modify: `src/app/components/services-section/services-section.component.html`
- Modify: `src/app/components/services-section/services-section.component.scss`
- Modify: `src/app/components/services-section/services-section.component.ts`

**Step 1: Update service card template to new design**

Replace current generic cards with the "Bilimsel Sicaklik" service card variant from master-style-guide v6.0, Bolum 19.3. Each card gets:
- Left color strip (3px, hover: 6px)
- SVG service icon (inline)
- Title + teal divider line + description
- "Detaylar →" coral link

**Step 2: Add color-strip SCSS**

Implement `data-service-color` attribute system and hover effects as specified in the style guide.

**Step 3: Integrate SVG icons from Task 3**

Inline the SVG icons into the template. Each service maps to its specific icon.

**Step 4: Verify responsive behavior**

Cards should stack in a single column on mobile, 2 columns on tablet, 3 on desktop.

**Step 5: Commit**

```bash
git add src/app/components/services-section/
git commit -m "feat(services): redesign cards with color-coded strips and SVG icons"
```

---

## Task 6: Doctor Page Timeline Redesign

**Files:**
- Modify: `src/app/pages/about/dr-ozlem-murzoglu/dr-ozlem-murzoglu.component.html`
- Modify: `src/app/pages/about/dr-ozlem-murzoglu/dr-ozlem-murzoglu.component.css`
- Modify: `src/assets/i18n/tr.json` (ABOUT section)
- Modify: `src/assets/i18n/en.json` (ABOUT section)

**Step 1: Replace tab-based layout with visual timeline**

Remove tab navigation. Create a vertical timeline with:
- Left: teal vertical line (2px)
- Each milestone: circle marker (12px) + year + short description
- Key milestones: amber or coral accent on the marker

```scss
.timeline {
  position: relative;
  padding-left: var(--spacing-xl);

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--md-sys-color-primary);
    opacity: 0.3;
  }
}

.timeline-item {
  position: relative;
  padding-bottom: var(--spacing-lg);

  &::before {
    content: '';
    position: absolute;
    left: calc(-1 * var(--spacing-xl) + 1px);
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--md-sys-color-primary);
  }

  &.milestone-highlight::before {
    background: var(--md-sys-color-tertiary);
    box-shadow: 0 0 0 4px var(--md-sys-color-tertiary-container);
  }
}
```

**Step 2: Add blockquote "Felsefemiz" section**

```scss
.philosophy-quote {
  border-left: 3px solid var(--md-sys-color-primary);
  background: var(--md-sys-color-surface-container-low);
  padding: var(--spacing-lg);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-style: italic;
  font-size: var(--md-sys-typescale-body-large-size);
}
```

**Step 3: Simplify intro section**

Doctor photo with teal frame + short warm paragraph + credential glassmorphism pills (replacing the detailed qualification boxes).

**Step 4: Add i18n keys for timeline milestones and run check**

Run: `npm run i18n:check`

**Step 5: Commit**

```bash
git add src/app/pages/about/dr-ozlem-murzoglu/ src/assets/i18n/
git commit -m "feat(about): redesign doctor page with visual timeline and blockquote"
```

---

## Task 7: Color Rebalancing & Typography Expression

**Files:**
- Modify: `src/app/components/doctor-bio/doctor-bio.ts`
- Modify: `src/app/components/doctor-bio/doctor-bio.scss`
- Modify: `src/app/components/contact-cta/contact-cta.scss`
- Modify: `src/app/components/google-business-reviews/google-business-reviews.component.scss`
- Modify: `src/styles.scss` (global blockquote and link styles)

**Step 1: Apply amber warmth to doctor-bio section**

Add surface-container-low background, amber-tinted credential pills, warmer overall tone.

**Step 2: Enhance contact CTA blob visibility**

Make the organic blob shapes more prominent (increase opacity from current levels).

**Step 3: Add global typography expression rules**

```scss
// In styles.scss — new global rules
blockquote,
.scientific-quote {
  border-left: 3px solid var(--md-sys-color-primary);
  background: var(--md-sys-color-surface-container-low);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-style: italic;
}

// Link hover underline animation
a:not(.md3-button):not(.nav-link) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--md-sys-color-primary);
    transition: width var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  }
  &:hover::after {
    width: 100%;
  }
}
```

**Step 4: Update Google reviews section styling**

Add glassmorphism to testimonial cards, add teal-tinted quote mark SVG decoration.

**Step 5: Commit**

```bash
git add src/app/components/ src/styles.scss
git commit -m "feat(style): apply color rebalancing and typography expression rules"
```

---

## Task 8: Page Transition Animations

**Files:**
- Modify: `src/app/app.component.ts`
- Modify: `src/app/app.component.html`
- Modify: `src/app/app.routes.ts`

**Step 1: Add Angular route animations**

Angular animations are already configured (provideAnimationsAsync in app.config.ts). Add route transition animation:

```typescript
// In app.component.ts
import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('200ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true }),
    ])
  ])
]);
```

**Step 2: Apply animation to router-outlet**

```html
<!-- app.component.html -->
<div [@routeAnimation]="getRouteAnimationData()">
  <router-outlet></router-outlet>
</div>
```

**Step 3: Add route data for animation states**

In app.routes.ts, add `data: { animation: 'pageName' }` to each route.

**Step 4: Add reduced-motion check**

Skip animations if `prefers-reduced-motion: reduce` is active.

**Step 5: Commit**

```bash
git add src/app/app.component.ts src/app/app.component.html src/app/app.routes.ts
git commit -m "feat(routing): add page transition fade animations"
```

---

## Task 9: Service/Contact/Resources Page Enhancements

**Files:**
- Modify: `src/app/pages/services/services.html`
- Modify: `src/app/pages/services/services.component.scss` (or similar)
- Modify: `src/app/pages/contact/contact.html`
- Modify: `src/app/pages/contact/contact.component.scss` (or similar)
- Modify: `src/app/pages/resources/resources.component.html` (or similar)
- Modify: `src/app/pages/resources/resources.component.scss` (or similar)

**Step 1: Services page — featured services as full-width horizontal cards**

Change featured services from 3-column grid to stacked full-width cards (SVG left, content right). Keep other services as 3-column grid with new card style.

**Step 2: Contact page — teal glow on form focus**

```scss
.form-field:focus-within {
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--md-sys-color-primary) 20%, transparent);
}
```

Add amber accent to working hours section. Add glassmorphism overlay to map area.

**Step 3: Resources page — category cards with SVG icons and color strips**

Replace generic category icons with SVG illustrations. Add left color strip to each category card. Add horizontal scroll carousel for popular resources.

**Step 4: Run i18n check**

Run: `npm run i18n:check`

**Step 5: Commit**

```bash
git add src/app/pages/services/ src/app/pages/contact/ src/app/pages/resources/ src/assets/i18n/
git commit -m "feat(pages): enhance services, contact, and resources with Bilimsel Sicaklik style"
```

---

## Task 10: Micro-interaction Polish & Final Verification

**Files:**
- Modify: Various component SCSS files
- Modify: `src/styles.scss`

**Step 1: Enhance existing hover states across all cards**

Ensure all interactive elements have consistent hover states as defined in master-style-guide v6.0 KISIM 0, Bolum 0.7.

**Step 2: Add button hover glow**

```scss
.md3-button-filled:hover,
.md3-button-tonal:hover {
  box-shadow: var(--md-sys-elevation-level2), 0 0 12px color-mix(in oklch, var(--md-sys-color-tertiary) 15%, transparent);
}
```

**Step 3: Verify footer social icon brand colors on hover**

Instagram: purple-pink gradient, WhatsApp: green, Facebook: blue, etc.

**Step 4: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 5: Run i18n check**

Run: `npm run i18n:check`
Expected: All keys valid.

**Step 6: Visual verification with Playwright**

Run Playwright tests to capture updated screenshots and compare with baseline.

Run: `npx playwright test tests/e2e/md3-visual-test.spec.js`

**Step 7: Commit**

```bash
git add -A
git commit -m "feat(polish): micro-interaction refinements and final visual verification"
```

---

## Execution Notes

### Parallel Execution Opportunities
- Task 1 (Hero layout) and Task 3 (SVG icons) can run in parallel
- Task 7 (Color rebalancing) and Task 8 (Page transitions) can run in parallel

### Dependencies
- Task 2 depends on Task 1 (hero layout must exist first)
- Task 4 depends on Task 3 (new sections use SVG icons)
- Task 5 depends on Task 3 (service cards use SVG icons)
- Task 9 depends on Task 3 and Task 5 (reuses card styles and icons)
- Task 10 depends on all other tasks (final polish)

### Testing Strategy
- After each task: `npm run i18n:check` (translation validation)
- After Task 4, 8, 10: `npm run build` (production build verification)
- After Task 10: Full Playwright visual test suite

### Key References
- Design doc: `docs/plans/2026-03-01-design-excellence-roadmap-design.md`
- Style guide: `docs/design/master-style-guide.md` (v6.0)
- Existing scroll-reveal: `src/app/directives/scroll-reveal.directive.ts`
- MD3 tokens: `src/styles/md3/` (especially `_colors.scss`, `_motion.scss`, `_effects.scss`)
- i18n files: `src/assets/i18n/tr.json`, `src/assets/i18n/en.json`
