---
description: Automated i18n Translation Enforcer
---

# i18n Translation Workflow

This workflow ensures that **ALL** text content in the application is fully internationalized. It must be run or followed every time new UI content is added or modified.

## 1. Detection Phase
Scan the target file (HTML or TS) for any hardcoded strings.
-   **Ignore**: logging statements, comments, internal IDs.
-   **Target**: Any text visible to the end-user (e.g., `<p>Text</p>`, `label="Text"`, `title="Text"`).

## 2. Key Generation Strategy
Construct a semantic key for the new text using the following hierarchy:
`PAGE_NAME.SECTION_NAME.ELEMENT_NAME`

**Examples:**
-   `ABOUT.DOCTOR_BIO.TITLE`
-   `HOME.HERO.CTA_BUTTON`
-   `CONTACT.FORM.SUBMIT_SUCCESS`
-   `COMMON.BUTTONS.READ_MORE` (for shared elements)

> [!IMPORTANT]
> Keys must be UPPERCASE_SNAKE_CASE.

## 3. Extraction & Update
1.  Read `d:/Repositories/ozlem-murzoglu/src/assets/i18n/tr.json`.
2.  Check if the generated key already exists.
    -   *If yes:* Use the existing key.
    -   *If no:* Add the new key-value pair to the JSON object.
    -   *Ordering:* Attempt to place the new key alphabetically within its parent object, or at the end of the section if unsure.
3.  **Write** the updated JSON back to `tr.json`.

## 4. Source Replacement
Replace the hardcoded text in the source file using the appropriate Angular mechanisms.

**HTML Template:**
```html
<!-- Before -->
<h1>Welcome to our Clinic</h1>

<!-- After (Pipe) -->
<h1>{{ 'HOME.WELCOME_TITLE' | translate }}</h1>

<!-- After (Directive/Input) -->
<app-header [title]="'HOME.HEADER_TITLE' | translate"></app-header>
```

**TypeScript Component:**
```typescript
// Before
this.notification.show('Success!');

// After
this.translate.get('COMMON.NOTIFICATIONS.SUCCESS').subscribe(res => {
    this.notification.show(res);
});
// OR using instant if loader is synced
this.notification.show(this.translate.instant('COMMON.NOTIFICATIONS.SUCCESS'));
```

## 5. Verification
-   Ensure `tr.json` is valid JSON (no trailing commas).
-   Ensure the key path in the HTML matches exactly what was written to the JSON.