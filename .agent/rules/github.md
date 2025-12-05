---
trigger: always_on
---

# Project Constitution & Rules

## 🎨 Design Constitution (MD3 Expressive)
The following files are the **absolute law** for this project. Any deviation requires explicit user approval.
- **Reference**: `D:\Repositories\ozlem-murzoglu\docs\design\MD3-STYLES-GUIDE.md`
- **Implementation**: `D:\Repositories\ozlem-murzoglu\src\styles.scss`

### Styling Rules
1.  **NO Hardcoded Values**: Never use Hex codes (`#FFFFFF`), RGB values, or fixed pixels (`16px`) for system properties.
    *   ❌ `color: #00897B;`
    *   ✅ `color: var(--md-sys-color-primary);`
    *   ❌ `border-radius: 12px;`
    *   ✅ `border-radius: var(--md-sys-shape-corner-medium);`
2.  **Strict SCSS Usage**: All new styles must be SCSS.
    *   Use `@import 'src/styles/md3/index';` to access tokens.
    *   Use nesting and mixins where appropriate.
3.  **Expressive by Default**: Use "Expressive" tokens for Motion and Shape unless the component is purely utilitarian (e.g., a data table).
    *   Use `cubic-bezier(0.4, 1.4, 0.2, 1)` (Expressive Standard) for main interactions.

## 🚀 Deployment & Git Workflow
1.  **Post-Deployment Commit**: IMMEDIATE action required after any successful deployment check.
    *   Run `git add .`
    *   Run `git commit -m "feat: <description> [deploy-success]"`
    *   Run `git push origin main`
2.  **Clean Workspace**: Before starting a critical task or deployment, ensure `git status` is clean.

## 🤖 AI Behavior
- If you find a file with hardcoded styles, **refactor it** immediately to use MD3 tokens.
- Cross-reference `MD3-STYLES-GUIDE.md` before creating any new UI component.
