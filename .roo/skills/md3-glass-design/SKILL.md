---
name: md3-glass-design
description: Provides a workflow for applying Material Design 3 (MD3/Material You) token-based theming plus controlled glassmorphism accents and component patterns to a web UI; use when asked for a modern MD3 look, glass blur surfaces, or a tokenized design refresh.
---

# When to use

- The user asks for “Material Design 3 / MD3 / Material You” styling.
- You need consistent semantic tokens (color roles, typography, shape, elevation) across multiple pages/components.
- You want **subtle** glassmorphism (frosted surfaces) while keeping readability and accessibility.

# When NOT to use

- The request is only a small CSS bugfix (do a targeted patch instead of a theming pass).
- The product must avoid translucency/blur entirely (e.g., strict performance constraints, policy restrictions).
- The user wants a complete brand redesign (start with a branding + visual direction exercise first).

# Inputs required from the user

1) Brand + direction
- Primary/seed color(s) (HEX), any “must-keep” brand colors
- Typography constraints (brand font or “system sans only”)
- Visual adjectives (e.g., clinical, warm, premium, playful)

2) Scope
- Target pages/components to update first (hero, navigation, cards, forms, etc.)
- Light only vs light+dark

3) Constraints
- Accessibility target (at least WCAG AA unless explicitly waived)
- Glass strength: subtle / medium (avoid “strong” unless the user insists)
- Performance constraints (low-end phones? heavy scrolling pages?)

# Workflow

## 1) Establish baseline + definition of done

1. Pick **one reference screen** (the most representative page).
2. List the components on that screen (nav, hero, cards, buttons, chips, forms).
3. Define “done” in measurable terms:
   - No hard-coded colors in component styles (use tokens)
   - Consistent corner radius + typography scale
   - Clear hover/pressed/focus states
   - Contrast on all text, including on glass surfaces

## 2) Build an MD3 token map (semantic first)

1. Derive an MD3 palette (use official tooling/guidance):
   - MD3 site: https://m3.material.io/
   - Material Theme Builder: https://material-foundation.github.io/material-theme-builder/
   - Color utilities (reference): https://github.com/material-foundation/material-color-utilities
2. Create/confirm **semantic roles** (don’t paint with raw hex values):
   - primary / on-primary / primary-container / on-primary-container
   - secondary / tertiary
   - surface / surface-container-* / on-surface
   - outline / outline-variant
3. Ensure tokens cover both light and dark if required.

## 3) Add a glass accent system (MD3-aligned constraints)

Glass is an accent layer on top of MD3 surfaces—not a replacement for the color system.

Rules:
- Prefer glass only on **large, low-density** surfaces (hero overlay panels, side sheets, featured cards).
- Avoid glass behind long text blocks; use filled/tonal surfaces for readability.
- Don’t “fade” content by lowering container opacity. Keep content opaque; make the *background* translucent.
- Always provide a fallback for environments without blur support.

Example (conceptual) tokens to introduce:
```css
:root {
  --glass-bg: color-mix(in srgb, var(--md-sys-color-surface) 70%, transparent);
  --glass-border: color-mix(in srgb, var(--md-sys-color-outline-variant) 55%, transparent);
  --glass-blur: 16px;
}

.glass-surface {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur)) saturate(1.15);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.15);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface { backdrop-filter: none; -webkit-backdrop-filter: none; }
}
```

## 4) Apply component patterns (MD3 first, glass second)

Use MD3 component anatomy and state layering; then selectively apply glass variants.

Recommended patterns:
- **Hero**: background gradient/media + scrim; foreground glass panel for headline/CTA; strong typographic hierarchy.
- **Cards**: default to MD3 filled/tonal; reserve glass for “featured” cards only.
- **Navigation**: tonal surfaces, clear elevation changes at scroll, visible focus outlines.
- **Buttons**: consistent corner radius, icon sizing, and state layers; avoid multiple competing glow/shadow effects.
- **Forms**: high-contrast labels, clear focus ring, error states that don’t rely on color alone.

## 5) Validate (accessibility + performance)

1. Contrast check: all text/icons on glass and on tonal surfaces.
2. Focus states: visible, consistent, keyboard navigable.
3. Motion: ensure reduced motion mode avoids “floaty” parallax/blur transitions.
4. Performance: limit blur usage in large scrolling lists; prefer static hero glass and a small number of glass surfaces.
5. Regression: run existing UI checks/e2e if available.

# Repo integration points (this repository)

- Token definitions (start here): [src/app/shared/styles/tokens.css](../../../src/app/shared/styles/tokens.css)
- MD3 SCSS primitives: [src/styles/md3/](../../../src/styles/md3/)
- MD3 audit e2e (if used in CI): [e2e/md3-audit.spec.ts](../../../e2e/md3-audit.spec.ts)
- MD3 stylelint config: [.stylelintrc.md3.json](../../../.stylelintrc.md3.json)

# Examples (copy/paste prompts)

## Example 1 — “Subtle MD3 + glass hero only”

“Update the homepage hero to MD3. Keep glassmorphism subtle: only a frosted panel behind the headline and CTAs, with solid tonal surfaces elsewhere. Implement tokenized colors (MD3 roles), consistent typography scale, and clear hover/pressed/focus states.”

## Example 2 — “Token hardening pass”

“Do a token hardening pass: remove hard-coded hex colors from component styles and route everything through MD3 semantic roles in the central tokens file. Do not change layout.”

# Troubleshooting / edge cases

- **Text is hard to read on glass**: increase surface tint (less transparency), reduce blur, add a scrim behind text, or switch that section to a filled/tonal surface.
- **Blur looks cheap/noisy**: reduce blur radius, simplify background imagery, add a subtle border, and avoid combining strong shadows + strong blur.
- **Performance drops on scroll**: restrict `backdrop-filter` to a few large, static surfaces; avoid glass in repeated list items.
- **Design feels “not MD3”**: revisit semantic roles (surface containers, outline variants) and state layers before adding more effects.
