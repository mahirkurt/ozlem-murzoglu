# Material Design 3 (MD3) Expressive Design Guide
> **Version**: 2.0 (Expressive Update)
> **Date**: 2025
> **Focus**: Expressive Motion, Advanced Shapes, Variable Typography

## 🌟 Introduction to Expressive Design

Material Design 3 "Expressive" features are designed to create a more dynamic, organic, and emotionally resonating user experience. Unlike the "Standard" or "Utilitarian" style which focuses purely on efficiency, **Expressive** design values:

-   **Overshoot & Bounce**: Motion that feels alive, using spring physics.
-   **Asymmetric Shapes**: Containers that break the grid to draw attention.
-   **Variable Typography**: Fluid type scales that breathe with the screen size.
-   **Vibrant Colors**: Using the full gamut of the OKLCH color space.

---

## 🚀 Expressive Motion System

Motion is not just decoration; it's the physical language of the interface. In Expressive MD3, we move away from mechanical easing to **Spring Physics**.

### Core Principles
1.  **Mass & Weight**: Elements feel like they have physical presence.
2.  **Springs not Curves**: While we use `cubic-bezier` for CSS, the math is derived from spring damping ratios.
3.  **Overshoot**: Elements slightly pass their target and settle back, creating a "snap" effect.

### CSS Implementation (Ref: `src/styles/md3/_motion.scss`)

The following tokens are available for use in `transition` and `animation` properties.

| Token | CSS Variable | Bezier Curve | Use Case |
|-------|--------------|--------------|----------|
| **Standard** | `--md-sys-motion-easing-standard` | `0.2, 0, 0, 1` | Simple UI changes, fades, color shifts. |
| **Expressive** | `--md-sys-motion-easing-expressive-standard` | `0.4, 1.4, 0.2, 1` | **Hero moments**, large layout shifts, modals entering. **(Has Bounce)** |
| **Decelerate** | `--md-sys-motion-easing-expressive-decelerate` | `0, 1.4, 0.2, 1` | Elements entering the screen rapidly. |

### Usage Example
```css
.md3-card-expressive {
  transition: transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-expressive-standard);
}

.md3-card-expressive:hover {
  transform: scale(1.05); /* Will bounce slightly on hover */
}
```

---

## 📐 Advanced Shape System

Expressive shapes break the monotony of rectangular grids. We use specific corner asymmetric tokens to guide the user's eye.

### Shape Tokens (Ref: `src/styles/md3/_shapes.scss`)

| Token | Value | Use Case |
|-------|-------|----------|
| `--md-sys-shape-corner-extra-large-top` | `28px 28px 0 0` | Bottom Sheets, Action Sheets |
| `--md-sys-shape-corner-large-end` | `0 16px 16px 0` | Navigation Drawers (Right side), Side panels |
| `--md-sys-shape-corner-large-start` | `16px 0 0 16px` | Navigation Drawers (Left side) |

### Container Strategies
-   **Cards**: Use `medium` corners (`12px`) for standard cards, but `extra-large` (`28px`) for "Hero" or "Feature" cards to make them friendly.
-   **Buttons**: Always use `full` (`999px`) for standard actions to maintain approachability.

---

## 🔡 Variable & Fluid Typography

We utilize **Figtree** and **DM Sans** as Variable Fonts (`wght` axis) to allow for smooth animations and fluid scaling without layout shifts.

### Fluid Typescale
Typography adapts to the viewport width continuously, not just at breakpoints.

```css
/* Example of Fluid Scale implementation in _typography.scss */
:root {
  --md-sys-typescale-display-large-size: clamp(3rem, 2rem + 5vw, 5rem);
}
```

---

## 🎨 Advanced Color (OKLCH)

We have migrated to **OKLCH** for perceptually uniform colors. This ensures that a color with "60% lightness" visually appears the same brightness regardless of its hue (unlike HSL).

### System Tokens (Ref: `src/styles/md3/_colors.scss`)
-   **Surface Tones**: Uses `surface-dim`, `surface`, `surface-bright` for depth without shadows.
-   **Fixed Colors**: Used for elements that should *not* change in Dark Mode (like brand logos or specific status indicators).

---

## 🛠️ Implementation Checklist (For Developers)

-   [ ] **Motion**: Are you using `expressive-standard` for the main interaction of your component?
-   [ ] **Shape**: Does the container shape reflect its hierarchy? (Rounder = Higher Attention).
-   [ ] **Elevation**: Are you using the new `surface-container` colors instead of shadows where possible? (Modern MD3 prefers tonal elevation over drop shadows).

## 🧩 Component Library Status

The following components in `src/styles/md3/components/` have been updated to Expressive standards:
-   `_buttons.scss`
-   `_cards.scss`
-   `_navigation.scss`

*(Note: See individual files for implementation details)*
