---
trigger: always_on
---

# 🛡️ Git & Deployment Constitution

This file governs the release cycle and safeguards the codebase state.

## 1. 🔄 Continuous Synchronization (Restore Points)
**Rule**: You must create "Restore Points" regularly, not just after deployment.
-   **When**: After completing any significant component, logic block, or sub-task.
-   **Why**: To ensure we can revert to a clean state if the next step fails.
-   **Action**:
    `ash
    git add .
    git commit -m "chore: save state [restore-point]"
    git push origin main
    `

## 2. 🚫 NO Automatic Deployments
**Rule**: You are **FORBIDDEN** from running irebase deploy or 
pm run deploy without an explicit, direct command from the User.
-   **Protocol**:
    1.  User asks for a feature.
    2.  You implement and verify locally.
    3.  **You ASK**: "Shall I deploy this?"
    4.  **Only** upon "Yes", you proceed.

## 3. ⚡ Localhost "Hot Reload" Priority
**Rule**: All changes must be verified on the local development server first.
-   **URL**: http://localhost:4200
-   **Method**: Rely on Angular's HMR (Hot Module Replacement) for instant feedback.
-   **Prohibited**: Do NOT deploy to a "staging" URL just to test a CSS change. Use 
pm start.

## 4. 🚀 Post-Deployment Protocol
**Rule**: If a deployment is authorized and successful, you **MUST** immediately seal the state.
-   **Immediate Action**:
    `ash
    git add .
    git commit -m "feat: <description> [deploy-success]"
    git push origin main
    `
-   **Never** leave a deployed version uncommitted in the local workspace.
