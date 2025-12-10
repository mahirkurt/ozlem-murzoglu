# MD3 Expressive Design Rules

This file is the **PRIMARY AUTHORITY** for all design and styling decisions. You must check this file before writing any CSS/SCSS.

## 1. The Core Commandment: "Token or Nothing"
You are strictly **FORBIDDEN** from using hardcoded values for system properties.
-   ❌ color: #6750A4;
-   ✅ color: var(--md-sys-color-primary);
-   ❌ border-radius: 16px;
-   ✅ border-radius: var(--md-sys-shape-corner-large);

## 2. Iconography & Visuals (Strict)
-   **Icons**: ALWAYS use **Material Symbols Rounded** (filled or outlined based on state).
    -   Format: <span class="material-icons">home</span>
-   **NO EMOJIS**: Emojis are strictly **FORBIDDEN** in the UI. They cheapen the premium aesthetic. Use high-quality SVG/Icons only.
-   **Rounded**: Ensure the icon font is set to Rounded style in index.html/css.

## 3. Consistency Mandate
-   **Section Headers**: All pages containing sections (About, Services, Testimonials) MUST use identical typography, spacing, and decoration for headers.
-   **Elements**: Do not reinvent the wheel. If a "Services Card" exists, reuse its classes for similar grid items.

## 4. Expressive Aesthetic Enforcement
We differ from standard Material 3; we use **Expressive MD3**.
-   **Motion**: Default to expressive-standard (Spring Physics: bounce & overshoot).
-   **Shapes**: Use "Extra Large" (28px-40px) or asymmetrical corners.
    -   Bio/Feature Cards: 40px rounded corners.

## 5. Premium Glassmorphism Standard
Adhere to the "Ozlem Glass" standard:
\\\scss
.glass-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5));
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 20px 40px rgba(0,0,0,0.05),
    0 1px 0 rgba(255,255,255,0.6) inset;
}
\\\`n
## 6. Component Standards
-   **Page Headers**: ALL sub-pages MUST use <app-page-header>.
-   **Buttons**: Use .btn-primary, .btn-secondary, or .btn-primary-glass.
-   **Spacing**: Use the 8pt grid system (8, 16, 24, 32, 48, 64, 100px).

> [!CRITICAL]
> **Audit Process**: Before finishing a task, search your code for # (hex codes), px (hardcoded sizes), and Emojis within the UI content. **REJECT** any violations.
