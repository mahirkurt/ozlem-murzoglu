# CTA & Footer Aesthetic Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Contact CTA section with bold coral gradient and organic blobs, plus deepen the footer's teal palette with enhanced glassmorphism — both with polished dark mode support.

**Architecture:** Pure CSS/SCSS changes to two existing Angular components. CTA switches from teal to coral gradient with decorative blob elements (mirroring hero-section pattern). Footer deepens its teal gradient and gets structural polish. A color transition band bridges the two sections.

**Tech Stack:** Angular 18 standalone components, SCSS with MD3 tokens from `src/styles/md3/`, oklch color space, CSS animations with `prefers-reduced-motion` support.

---

### Task 1: CTA Section — HTML Structure Update

**Files:**
- Modify: `src/app/components/contact-cta/contact-cta.component.html`

**Step 1: Add decorative blob elements and transition band**

Replace the entire file content with:

```html
<section class="contact-cta">
  <!-- Decorative blobs -->
  <div class="cta-blobs" aria-hidden="true">
    <div class="cta-blob cta-blob--1"></div>
    <div class="cta-blob cta-blob--2"></div>
  </div>

  <div class="container">
    <div class="cta-content">
      <div class="cta-header">
        <span class="section-label">{{ 'CONTACT_CTA.LABEL' | translate }}</span>
        <h2>{{ 'CONTACT_CTA.TITLE' | translate }}</h2>
        <p>{{ 'CONTACT_CTA.DESCRIPTION' | translate }}</p>
      </div>

      <div class="cta-actions">
        <a routerLink="/iletisim" class="btn-primary">
          <span class="material-icons-rounded">calendar_today</span>
          {{ 'CONTACT_CTA.APPOINTMENT' | translate }}
        </a>
        <a href="https://wa.me/905300000000" target="_blank" class="btn-secondary">
          <span class="material-icons-rounded">chat</span>
          {{ 'CONTACT_CTA.WHATSAPP' | translate }}
        </a>
      </div>
    </div>
  </div>

  <!-- Transition band to footer -->
  <div class="cta-transition" aria-hidden="true"></div>
</section>
```

**Step 2: Verify no TS changes needed**

No changes to `contact-cta.component.ts` — the component has no logic tied to the template structure changes.

---

### Task 2: CTA Section — Complete SCSS Rewrite

**Files:**
- Modify: `src/app/components/contact-cta/contact-cta.scss`

**Step 1: Rewrite the full SCSS file**

Replace the entire file with the bold coral design:

```scss
@import 'styles/md3/index';

// ==========================================================================
// CONTACT CTA — Bold Coral Theme
// ==========================================================================

.contact-cta {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  --cta-footer-underlap: var(--md-sys-spacing-16);
  padding: var(--md-sys-spacing-section-vertical-sm) 0
    calc(var(--md-sys-spacing-section-vertical-sm) + var(--cta-footer-underlap));
  margin: 0;

  // Coral palette tokens (scoped)
  --cta-bg-from: var(--md-sys-color-tertiary);
  --cta-bg-to: color-mix(in oklch, var(--md-sys-color-tertiary) 65%, var(--md-sys-color-shadow));
  --cta-glow-teal: color-mix(in oklch, var(--md-sys-color-primary) 28%, transparent);
  --cta-glow-deep: color-mix(in oklch, var(--md-ref-palette-tertiary30) 30%, transparent);
  --cta-text: var(--md-sys-color-on-tertiary);
  --cta-text-secondary: color-mix(in oklch, var(--md-sys-color-on-tertiary) 80%, transparent);

  background:
    radial-gradient(
      ellipse 70% 60% at 15% 20%,
      var(--cta-glow-teal) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 60% 50% at 85% 80%,
      var(--cta-glow-deep) 0%,
      transparent 55%
    ),
    linear-gradient(
      135deg,
      var(--cta-bg-from) 0%,
      var(--cta-bg-to) 100%
    );
  border-top: 1px solid color-mix(in oklch, var(--md-sys-color-on-tertiary) 12%, transparent);
}

// Noise overlay
.contact-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--md-sys-glass-noise-url);
  opacity: var(--md-sys-glass-noise-opacity);
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}

// ==========================================================================
// Organic Blobs
// ==========================================================================

.cta-blobs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.cta-blob {
  position: absolute;
  border-radius: 42% 58% 62% 38% / 48% 32% 68% 52%;
  filter: blur(clamp(40px, 6vw, 70px));
  will-change: transform, border-radius;
}

.cta-blob--1 {
  width: clamp(180px, 22vw, 320px);
  aspect-ratio: 1.15;
  background: color-mix(in oklch, var(--md-sys-color-on-tertiary) 18%, transparent);
  top: -18%;
  left: -6%;
  animation: _cta-blob-a 20s var(--md-sys-motion-easing-standard) infinite;
}

.cta-blob--2 {
  width: clamp(140px, 16vw, 260px);
  aspect-ratio: 0.9;
  background: color-mix(in oklch, var(--md-sys-color-tertiary-container) 28%, transparent);
  bottom: -14%;
  right: -4%;
  animation: _cta-blob-b 24s var(--md-sys-motion-easing-standard) infinite;
}

@keyframes _cta-blob-a {
  0%, 100% {
    border-radius: 42% 58% 62% 38% / 48% 32% 68% 52%;
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    border-radius: 58% 42% 38% 62% / 32% 68% 32% 68%;
    transform: translate(14px, -20px) rotate(5deg);
  }
  66% {
    border-radius: 38% 62% 58% 42% / 68% 48% 52% 32%;
    transform: translate(-10px, 12px) rotate(-3deg);
  }
}

@keyframes _cta-blob-b {
  0%, 100% {
    border-radius: 58% 42% 48% 52% / 38% 62% 42% 58%;
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    border-radius: 42% 58% 52% 48% / 62% 38% 58% 42%;
    transform: translate(12px, 16px) rotate(-4deg);
  }
  66% {
    border-radius: 52% 48% 42% 58% / 48% 52% 38% 62%;
    transform: translate(-14px, -8px) rotate(3deg);
  }
}

// Reduced motion
@include reduced-motion {
  .cta-blob {
    animation: none;
  }
}

// ==========================================================================
// Transition band (coral → teal fade)
// ==========================================================================

.cta-transition {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in oklch, var(--md-sys-color-primary) 40%, var(--md-sys-color-tertiary) 60%) 50%,
    color-mix(in oklch, var(--md-sys-color-primary) 75%, var(--md-sys-color-shadow)) 100%
  );
  pointer-events: none;
  z-index: 2;
}

// ==========================================================================
// Content
// ==========================================================================

.container {
  @include content-width('narrow');
  @include container-padding;
  position: relative;
  z-index: 3;
  text-align: center;
}

.cta-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--md-sys-spacing-10);
}

.cta-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--md-sys-spacing-3);
  max-width: var(--md-sys-spacing-text-max-width);
}

.cta-header h2 {
  font-family: var(--md-sys-typescale-display-small-font);
  font-size: var(--md-sys-typescale-display-small-size);
  font-weight: var(--md-sys-typescale-display-small-weight);
  line-height: var(--md-sys-typescale-display-small-line-height);
  letter-spacing: var(--md-sys-typescale-display-small-tracking);
  color: var(--cta-text);
  margin: 0;
  text-shadow: 0 2px 12px oklch(from var(--md-sys-color-shadow) l c h / 0.15);
}

.cta-header p {
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  font-weight: var(--md-sys-typescale-body-large-weight);
  line-height: var(--md-sys-typescale-body-large-line-height);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
  color: var(--cta-text-secondary);
  margin: 0;
}

// Section label pill
.section-label {
  display: inline-block;
  padding: 8px 16px;
  background: color-mix(in oklch, var(--md-sys-color-on-tertiary) 16%, transparent);
  color: var(--cta-text);
  border: 1px solid color-mix(in oklch, var(--md-sys-color-on-tertiary) 24%, transparent);
  border-radius: var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--md-sys-spacing-4);
  backdrop-filter: blur(4px);
  box-shadow: 0 6px 14px oklch(from var(--md-sys-color-shadow) l c h / 0.10);
}

// ==========================================================================
// Buttons — inverted on coral background
// ==========================================================================

.cta-actions {
  display: flex;
  gap: var(--md-sys-spacing-4);
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--md-sys-spacing-button-icon-gap);
  min-height: var(--md-sys-touch-target-min);
  padding: var(--md-sys-spacing-button-padding-y) var(--md-sys-spacing-button-padding-x);
  border-radius: var(--md-sys-shape-button-filled);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  text-decoration: none;
  transition: var(--md-sys-transition-emphasized);
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
}

// Primary: white bg + coral text
.btn-primary {
  background: var(--md-sys-color-on-tertiary);
  color: var(--md-sys-color-tertiary);
  border: none;
  box-shadow:
    0 4px 16px oklch(from var(--md-sys-color-shadow) l c h / 0.18),
    0 1px 4px oklch(from var(--md-sys-color-shadow) l c h / 0.10);
  @include state-layer(var(--md-sys-color-tertiary));
  @include ripple-effect(var(--md-sys-color-tertiary));

  &:hover {
    transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
    box-shadow:
      0 8px 28px oklch(from var(--md-sys-color-shadow) l c h / 0.22),
      0 2px 8px oklch(from var(--md-sys-color-shadow) l c h / 0.12);
  }

  &:active {
    transform: translateY(0);
  }
}

// Secondary: transparent outline + white text
.btn-secondary {
  background: color-mix(in oklch, var(--md-sys-color-on-tertiary) 10%, transparent);
  color: var(--md-sys-color-on-tertiary);
  border: 1.5px solid color-mix(in oklch, var(--md-sys-color-on-tertiary) 45%, transparent);
  backdrop-filter: blur(8px);
  @include state-layer(var(--md-sys-color-on-tertiary));
  @include ripple-effect(var(--md-sys-color-on-tertiary));

  &:hover {
    transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
    background: color-mix(in oklch, var(--md-sys-color-on-tertiary) 18%, transparent);
    border-color: color-mix(in oklch, var(--md-sys-color-on-tertiary) 60%, transparent);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-primary .material-icons-rounded,
.btn-secondary .material-icons-rounded {
  font-size: var(--md-icon-size-sm);
}

// ==========================================================================
// Responsive
// ==========================================================================

@include bp-below-medium {
  .contact-cta {
    --cta-footer-underlap: var(--md-sys-spacing-12);
    padding: var(--md-sys-spacing-section-vertical-tablet) 0
      calc(var(--md-sys-spacing-section-vertical-tablet) + var(--cta-footer-underlap));
  }

  .cta-actions {
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@include bp-expanded {
  .contact-cta {
    --cta-footer-underlap: var(--md-sys-spacing-18);
    padding: var(--md-sys-spacing-section-vertical) 0
      calc(var(--md-sys-spacing-section-vertical) + var(--cta-footer-underlap));
  }
}

// ==========================================================================
// Dark Mode
// ==========================================================================

:host-context([data-theme='dark']) .contact-cta {
  --cta-bg-from: color-mix(in oklch, var(--md-sys-color-tertiary) 75%, var(--md-sys-color-shadow));
  --cta-bg-to: color-mix(in oklch, var(--md-sys-color-tertiary) 40%, var(--md-sys-color-shadow));
  --cta-glow-teal: color-mix(in oklch, var(--md-sys-color-primary) 18%, transparent);
  --cta-glow-deep: color-mix(in oklch, var(--md-ref-palette-tertiary20) 22%, transparent);
}

:host-context([data-theme='dark']) .cta-blob {
  opacity: 0.12;
  filter: blur(clamp(50px, 8vw, 90px));
}

:host-context([data-theme='dark']) .cta-transition {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in oklch, var(--md-sys-color-primary) 30%, oklch(20% 0.02 194)) 50%,
    color-mix(in oklch, var(--md-sys-color-primary) 50%, oklch(15% 0.02 194)) 100%
  );
}

:host-context([data-theme='dark']) .btn-primary {
  background: var(--md-sys-color-on-tertiary);
  color: var(--md-sys-color-tertiary);
  box-shadow:
    0 4px 20px oklch(from var(--md-sys-color-tertiary) l c h / 0.30),
    0 1px 6px oklch(from var(--md-sys-color-shadow) l c h / 0.20);

  &:hover {
    box-shadow:
      0 8px 32px oklch(from var(--md-sys-color-tertiary) l c h / 0.40),
      0 2px 10px oklch(from var(--md-sys-color-shadow) l c h / 0.25);
  }
}

:host-context([data-theme='dark']) .btn-secondary {
  border-color: color-mix(in oklch, var(--md-sys-color-on-tertiary) 35%, transparent);

  &:hover {
    border-color: color-mix(in oklch, var(--md-sys-color-on-tertiary) 50%, transparent);
    box-shadow: 0 0 20px oklch(from var(--md-sys-color-tertiary) l c h / 0.20);
  }
}
```

---

### Task 3: Footer — SCSS Redesign

**Files:**
- Modify: `src/app/components/footer/footer.scss`

**Step 1: Rewrite footer SCSS with deep teal + structural enhancements**

Replace the entire file with:

```scss
@import 'styles/md3/index';

// ==========================================================================
// FOOTER — Deep Teal Theme
// ==========================================================================

.footer {
  margin-top: -60px;
  position: relative;
  z-index: 10;
  background: transparent;
  pointer-events: none;
}

.footer-curve {
  pointer-events: auto;
  position: relative;
  background: linear-gradient(
    145deg,
    color-mix(in oklch, var(--md-sys-color-primary) 85%, var(--md-sys-color-shadow)) 0%,
    color-mix(in oklch, var(--md-sys-color-primary) 40%, var(--md-sys-color-shadow)) 100%
  );
  border-radius: var(--md-sys-shape-corner-extra-large-top);
  padding: var(--md-sys-spacing-20) 0 var(--md-sys-spacing-10);
  color: var(--md-sys-color-on-primary);
  overflow: hidden;

  // Aurora + coral bridge glow
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 140%;
    height: 100%;
    background:
      radial-gradient(
        ellipse 50% 40% at 80% 10%,
        color-mix(in oklch, var(--md-sys-color-tertiary) 12%, transparent) 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--md-sys-color-tertiary-container) 10%, transparent) 0%,
        transparent 70%
      );
    opacity: 0.5;
    pointer-events: none;
  }
}

.container {
  @include content-width;
  @include container-padding;
}

// ==========================================================================
// Footer Grid
// ==========================================================================

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: var(--md-sys-spacing-12);
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--md-sys-spacing-12);
    text-align: center;
  }
}

// ==========================================================================
// Brand Column
// ==========================================================================

.brand-col {
  display: flex;
  flex-direction: column;
  gap: var(--md-sys-spacing-6);

  @media (max-width: 640px) {
    align-items: center;
  }
}

.footer-logo {
  height: 64px;
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-bio {
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
  line-height: 1.6;
  color: color-mix(in srgb, var(--md-sys-color-on-primary) 80%, transparent);
  margin: 0;
  max-width: 320px;
}

// ==========================================================================
// Social Orbs — with stagger hover
// ==========================================================================

.social-orbs {
  display: flex;
  gap: var(--md-sys-spacing-2);
  margin-top: var(--md-sys-spacing-2);
}

.social-orb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--md-sys-color-on-primary) 10%, transparent);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-primary);
  transition:
    transform 0.3s var(--md-sys-motion-easing-expressive-standard),
    background 0.3s var(--md-sys-motion-easing-standard),
    color 0.3s var(--md-sys-motion-easing-standard),
    box-shadow 0.3s var(--md-sys-motion-easing-standard);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-on-primary) 10%, transparent);

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s var(--md-sys-motion-easing-expressive-standard);
  }

  &:hover {
    background: var(--md-sys-color-on-primary);
    color: var(--md-sys-color-primary);
    transform: translateY(-4px) scale(1.08);
    box-shadow:
      0 8px 20px oklch(from var(--md-sys-color-shadow) l c h / 0.25),
      0 0 0 3px color-mix(in srgb, var(--md-sys-color-on-primary) 15%, transparent);

    svg {
      transform: scale(1.1);
    }
  }

  // Brand colors on hover
  &[aria-label="instagram"]:hover { color: var(--md-sys-color-brand-instagram); }
  &[aria-label="facebook"]:hover { color: var(--md-sys-color-brand-facebook); }
  &[aria-label="whatsapp"]:hover { color: var(--md-sys-color-brand-whatsapp); }
  &[aria-label="google"]:hover { color: var(--md-sys-color-brand-google); }
}

.social-orb:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
}

// Stagger animation on parent hover
.social-orbs:hover .social-orb {
  @for $i from 1 through 7 {
    &:nth-child(#{$i}) {
      transition-delay: #{($i - 1) * 30}ms;
    }
  }
}

.social-orbs:not(:hover) .social-orb {
  transition-delay: 0ms;
}

// ==========================================================================
// Navigation Columns
// ==========================================================================

.col-title, .footer-title {
  font-family: var(--md-sys-typescale-title-medium-font);
  font-size: var(--md-sys-typescale-title-medium-size);
  font-weight: 600;
  margin: 0 0 24px 0;
  color: var(--md-sys-color-on-primary);
  letter-spacing: 0.5px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--md-sys-spacing-4);
}

// Footer links with animated underline
.footer-link {
  color: color-mix(in srgb, var(--md-sys-color-on-primary) 70%, transparent);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--md-sys-typescale-body-medium-size);
  position: relative;
  padding-bottom: 2px;
  transition: color 0.2s var(--md-sys-motion-easing-standard);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--md-sys-color-on-primary);
    transition: width 0.3s var(--md-sys-motion-easing-emphasized);
  }

  &:hover {
    color: var(--md-sys-color-on-primary);
    transform: translateX(4px);

    &::after {
      width: 100%;
    }
  }
}

.footer-link:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
  border-radius: var(--md-sys-shape-corner-small);
}

// ==========================================================================
// Contact Card — enhanced glassmorphism
// ==========================================================================

.contact-card {
  background: color-mix(in srgb, var(--md-sys-color-on-primary) 7%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: var(--md-sys-shape-corner-extra-large);
  padding: var(--md-sys-spacing-6);
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid color-mix(in srgb, var(--md-sys-color-on-primary) 12%, transparent);
  box-shadow: 0 4px 24px oklch(from var(--md-sys-color-shadow) l c h / 0.08);
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  border-radius: var(--md-sys-shape-corner-large);
  padding: var(--md-sys-spacing-2);
  margin: calc(-1 * var(--md-sys-spacing-2));
  transition: background 0.2s var(--md-sys-motion-easing-standard);

  .icon-box {
    width: 40px;
    height: 40px;
    background: color-mix(in srgb, var(--md-sys-color-on-primary) 10%, transparent);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      background 0.3s var(--md-sys-motion-easing-standard),
      transform 0.3s var(--md-sys-motion-easing-expressive-standard),
      box-shadow 0.3s var(--md-sys-motion-easing-standard);

    .material-icons-rounded {
      font-size: 20px;
      color: var(--md-sys-color-tertiary-container);
    }
  }

  .contact-text {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .label {
      font-size: var(--md-sys-typescale-label-small-size);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: color-mix(in srgb, var(--md-sys-color-on-primary) 50%, transparent);
    }

    .value {
      font-size: var(--md-sys-typescale-label-large-size);
      color: color-mix(in srgb, var(--md-sys-color-on-primary) 90%, transparent);
      line-height: 1.4;
      transition: color 0.2s ease;
    }
  }

  &:hover {
    background: color-mix(in srgb, var(--md-sys-color-on-primary) 5%, transparent);

    .icon-box {
      background: var(--md-sys-color-tertiary-container);
      transform: scale(1.08);
      box-shadow: 0 6px 16px oklch(from var(--md-sys-color-tertiary) l c h / 0.20);

      .material-icons-rounded { color: var(--md-sys-color-on-tertiary-container); }
    }

    .value {
      color: var(--md-sys-color-on-primary);
    }
  }
}

.contact-row:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
  border-radius: var(--md-sys-shape-corner-large);
}

// ==========================================================================
// Footer Bottom — gradient separator
// ==========================================================================

.footer-bottom {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid transparent;
  background-image: linear-gradient(
    to right,
    color-mix(in srgb, var(--md-sys-color-on-primary) 0%, transparent),
    color-mix(in srgb, var(--md-sys-color-on-primary) 15%, transparent) 50%,
    color-mix(in srgb, var(--md-sys-color-on-primary) 0%, transparent)
  );
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: top;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
}

.footer-controls {
  display: flex;
  align-items: center;
  gap: var(--md-sys-spacing-4);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--md-sys-spacing-3);
  }
}

.footer-theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--md-sys-spacing-10);
  height: var(--md-sys-spacing-10);
  padding: 0;
  border-radius: var(--md-sys-shape-corner-full);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-on-primary) 20%, transparent);
  background: color-mix(in srgb, var(--md-sys-color-on-primary) 10%, transparent);
  color: var(--md-sys-color-on-primary);
  font-family: var(--md-sys-typescale-label-medium-font);
  font-size: var(--md-sys-typescale-label-medium-size);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s var(--md-sys-motion-easing-standard),
    color 0.2s var(--md-sys-motion-easing-standard),
    transform 0.2s var(--md-sys-motion-easing-expressive-standard);

  .material-icons-rounded {
    font-size: 18px;
  }
}

.footer-theme-toggle:hover {
  background: var(--md-sys-color-on-primary);
  color: var(--md-sys-color-primary);
  transform: translateY(-1px) rotate(15deg);
}

.footer-theme-toggle:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
}

.copyright {
  font-size: var(--md-sys-typescale-label-medium-size);
  color: color-mix(in srgb, var(--md-sys-color-on-primary) 50%, transparent);
}

.legal-links {
  display: flex;
  gap: 24px;

  .legal-link {
    font-size: var(--md-sys-typescale-label-medium-size);
    color: color-mix(in srgb, var(--md-sys-color-on-primary) 50%, transparent);
    text-decoration: none;
    position: relative;
    transition: color 0.2s;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--md-sys-color-on-primary);
      transition: width 0.3s var(--md-sys-motion-easing-emphasized);
    }

    &:hover {
      color: var(--md-sys-color-on-primary);

      &::after {
        width: 100%;
      }
    }
  }
}

.legal-links .legal-link:focus-visible {
  outline: var(--md-sys-state-focus-ring-width) solid var(--md-sys-state-focus-ring-color);
  outline-offset: var(--md-sys-state-focus-ring-offset);
  border-radius: var(--md-sys-shape-corner-small);
}

// ==========================================================================
// Dark Mode
// ==========================================================================

:host-context([data-theme='dark']) .footer-curve {
  background: linear-gradient(
    145deg,
    color-mix(in oklch, var(--md-sys-color-primary) 35%, oklch(15% 0.02 194)) 0%,
    color-mix(in oklch, var(--md-sys-color-primary) 15%, oklch(10% 0.01 194)) 100%
  );
  color: var(--md-sys-color-on-surface);

  &::before {
    opacity: 0.6;
    background:
      radial-gradient(
        ellipse 50% 40% at 80% 10%,
        color-mix(in oklch, var(--md-sys-color-tertiary) 16%, transparent) 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 50% 50%,
        color-mix(in oklch, var(--md-sys-color-primary) 10%, transparent) 0%,
        transparent 70%
      );
  }
}

:host-context([data-theme='dark']) .footer-bio {
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 72%, transparent);
}

:host-context([data-theme='dark']) .col-title,
:host-context([data-theme='dark']) .footer-title {
  color: var(--md-sys-color-on-surface);
}

:host-context([data-theme='dark']) .footer-link {
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 68%, transparent);

  &::after {
    background: var(--md-sys-color-on-surface);
  }

  &:hover {
    color: var(--md-sys-color-on-surface);
  }
}

:host-context([data-theme='dark']) .social-orb {
  background: color-mix(in oklch, var(--md-sys-color-on-surface) 14%, transparent);
  border-color: color-mix(in oklch, var(--md-sys-color-outline) 30%, transparent);
  color: var(--md-sys-color-on-surface);
}

:host-context([data-theme='dark']) .social-orb:hover {
  background: var(--md-sys-color-on-surface);
  color: var(--md-sys-color-surface);
  box-shadow:
    0 0 0 1px oklch(from var(--md-sys-color-primary) l c h / 0.3),
    0 12px 24px oklch(from var(--md-sys-color-shadow) l c h / 0.45),
    0 0 20px oklch(from var(--md-sys-color-primary) l c h / 0.15);
}

:host-context([data-theme='dark']) .contact-card {
  background: color-mix(in oklch, var(--md-sys-color-on-surface) 6%, transparent);
  border-color: color-mix(in oklch, var(--md-sys-color-outline) 30%, transparent);
  box-shadow: 0 4px 32px oklch(from var(--md-sys-color-shadow) l c h / 0.20);
}

:host-context([data-theme='dark']) .contact-row .icon-box {
  background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
}

:host-context([data-theme='dark']) .contact-row .contact-text .label {
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 55%, transparent);
}

:host-context([data-theme='dark']) .contact-row .contact-text .value {
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 90%, transparent);
}

:host-context([data-theme='dark']) .contact-row:hover .icon-box {
  background: var(--md-sys-color-tertiary);
  box-shadow: 0 10px 20px oklch(from var(--md-sys-color-tertiary) l c h / 0.35);
}

:host-context([data-theme='dark']) .contact-row:hover .icon-box .material-icons-rounded {
  color: var(--md-sys-color-on-tertiary);
}

:host-context([data-theme='dark']) .footer-bottom {
  background-image: linear-gradient(
    to right,
    color-mix(in oklch, var(--md-sys-color-outline) 0%, transparent),
    color-mix(in oklch, var(--md-sys-color-outline) 40%, transparent) 50%,
    color-mix(in oklch, var(--md-sys-color-outline) 0%, transparent)
  );
}

:host-context([data-theme='dark']) .copyright {
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 55%, transparent);
}

:host-context([data-theme='dark']) .legal-links .legal-link {
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 55%, transparent);

  &::after {
    background: var(--md-sys-color-on-surface);
  }

  &:hover {
    color: var(--md-sys-color-on-surface);
  }
}

:host-context([data-theme='dark']) .footer-theme-toggle:hover {
  box-shadow: 0 0 16px oklch(from var(--md-sys-color-primary) l c h / 0.25);
}
```

---

### Task 4: Build Verification

**Step 1: Run the dev build**

Run: `npm start` (or check existing dev server)

Expected: No SCSS compilation errors, site loads at http://localhost:4200

**Step 2: Visual check — Light mode**

Navigate to homepage, scroll to bottom. Verify:
- CTA has coral gradient with visible organic blobs
- Buttons are white/coral (primary) and outlined white (secondary)
- Transition band fades from coral to teal
- Footer has deeper teal with coral glow at top-right
- Contact card shows glassmorphism blur
- Footer links have animated underline on hover

**Step 3: Visual check — Dark mode**

Toggle theme. Verify:
- CTA coral darkens but stays warm
- Blobs are subtler (lower opacity)
- Footer becomes charcoal-teal with glowing aurora
- Social orbs have glow shadow on hover
- All text remains readable

**Step 4: Responsive check**

Resize to mobile width. Verify:
- Buttons stack full-width
- Footer grid collapses to single column
- Blobs don't overflow or cause horizontal scroll

**Step 5: Commit**

```bash
git add src/app/components/contact-cta/ src/app/components/footer/
git commit -m "feat: redesign CTA with bold coral theme and enhance footer aesthetics"
```
