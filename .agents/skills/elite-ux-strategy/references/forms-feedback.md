# Forms & Feedback Patterns

Comprehensive patterns for form interactions, user feedback, and state communication.

## Table of Contents

1. [Toast Notifications](#toast-notifications)
2. [Confirmation Dialogs](#confirmation-dialogs)
3. [Error Handling](#error-handling)
4. [Form States](#form-states)
5. [Multi-Step Forms](#multi-step-forms)
6. [Data Preservation](#data-preservation)
7. [Empty States](#empty-states)

---

## Toast Notifications

### Rules

- **Auto-dismiss in 3-5s** — Long enough to read, short enough to not annoy
- **Don't steal focus** — Toast must not pull focus from user's current task
- **`aria-live="polite"`** — Screen readers announce without interrupting
- **Provide undo** — For destructive actions, include "Undo" action in the toast
- **Position consistently** — Top-center (web) or bottom (mobile), never both on the same page

```html
<div class="toast-container" aria-live="polite" aria-atomic="true">
  <div class="toast toast-success" role="status">
    <span>Item deleted</span>
    <button class="toast-action">Undo</button>
    <button class="toast-dismiss" aria-label="Dismiss">×</button>
  </div>
</div>
```

```css
.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-inverted);
  color: var(--color-text-inverted);
  box-shadow: var(--shadow-lg);
  animation: toast-in 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-action {
  font-weight: 600;
  color: var(--color-accent-light);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
}
```

---

## Confirmation Dialogs

### When to use

- **Before destructive actions**: Delete, remove, cancel subscription
- **Before irreversible actions**: Send email, publish, submit payment

### Rules

- **Destructive button uses danger color** (red) and is visually separated from cancel
- **Cancel is the default** — Escape key and click-outside dismiss without action
- **Clear consequence** — "Delete 3 items? This cannot be undone." not "Are you sure?"
- **Verb-based buttons** — "Delete" not "OK", "Cancel subscription" not "Yes"

```html
<dialog class="confirm-dialog">
  <h2>Delete 3 items?</h2>
  <p>This action cannot be undone.</p>
  <div class="dialog-actions">
    <button class="btn-secondary" autofocus>Cancel</button>
    <button class="btn-destructive">Delete items</button>
  </div>
</dialog>
```

```css
.btn-destructive {
  background: var(--color-error);
  color: white;
  font-weight: 600;
}

.btn-destructive:hover {
  background: var(--color-error-dark);
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
```

---

## Error Handling

### Error Placement

- **Inline errors below the field** — Not at the top of the form
- **Validate on blur** — Not on every keystroke (too aggressive)
- **Error messages state cause + fix** — "Email is invalid. Please enter a valid email address." not "Invalid input"
- **Auto-focus first error** — After submit, move focus to the first invalid field

### Error Summary (Multiple Errors)

For forms with multiple errors, show a summary at the top with anchor links:

```html
<div class="error-summary" role="alert">
  <h3>Please fix 2 errors:</h3>
  <ul>
    <li><a href="#email">Email address is required</a></li>
    <li><a href="#phone">Phone number format is invalid</a></li>
  </ul>
</div>
```

### Inline Error Pattern

```css
.field-error .input {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--text-sm);
  margin-top: 0.25rem;
}

/* Error state must meet 4.5:1 contrast */
```

### `aria-live` for Errors

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" aria-describedby="email-error" aria-invalid="true" />
  <p id="email-error" class="error-message" aria-live="polite">
    Please enter a valid email address
  </p>
</div>
```

---

## Form States

### Required Fields

Mark required fields clearly — asterisk with explanation:

```html
<p class="form-note">Fields marked with <span aria-hidden="true">*</span> are required</p>
<label for="name">Full name <span class="required" aria-label="required">*</span></label>
```

### Disabled State

```css
.input:disabled,
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

Reduced opacity (0.38-0.5) + cursor change + semantic `disabled` attribute. Visually and functionally distinct from read-only.

### Read-Only State

```css
.input[readonly] {
  opacity: 0.8;
  background: var(--color-bg-secondary);
  cursor: default;
  /* No pointer-events: none — user can still select/copy text */
}
```

Read-only is NOT disabled: text is selectable, tab-focusable, and visually less muted.

### Password Toggle

```html
<div class="password-field">
  <input id="password" type="password" />
  <button type="button" class="password-toggle" aria-label="Show password">
    <svg><!-- eye icon --></svg>
  </button>
</div>
```

### Success Feedback

After completed actions, provide brief visual confirmation:
- Checkmark icon replacing submit button (300ms, then reset)
- Success toast ("Changes saved")
- Color flash on the saved field (green border, 1s fade)

---

## Multi-Step Forms

### Rules

- **Step indicator or progress bar** — Show current position and total steps
- **Allow back navigation** — Users can revise previous answers
- **One concern per step** — Don't combine unrelated fields
- **Progress preservation** — Navigating back keeps entered data

```html
<nav class="step-indicator" aria-label="Form progress">
  <ol>
    <li class="step completed">Details</li>
    <li class="step active" aria-current="step">Payment</li>
    <li class="step">Review</li>
  </ol>
</nav>
```

```css
.step-indicator ol {
  display: flex;
  gap: 1rem;
  list-style: none;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.step.completed { color: var(--color-success); }
.step.active { color: var(--color-accent); font-weight: 600; }
```

---

## Data Preservation

- **Autosave for long forms** — Save drafts every 30s or on blur to prevent data loss
- **Sheet dismiss confirm** — If user tries to close a form with unsaved changes, confirm first
- **Timeout feedback** — If a request times out, show clear message with retry option (not a silent failure)

```javascript
// Autosave pattern
let saveTimeout;
form.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDraft(new FormData(form));
  }, 3000); // Save 3s after last input
});
```

---

## Empty States

When there's no content to display, provide:

1. **Illustration or icon** — Visual cue that this isn't an error
2. **Clear message** — "No projects yet" not "No data"
3. **Suggested action** — "Create your first project" button
4. **Context** — Explain what would appear here

```html
<div class="empty-state">
  <svg class="empty-icon"><!-- illustration --></svg>
  <h3>No projects yet</h3>
  <p>Create a project to get started with your first design.</p>
  <button class="btn-primary">Create project</button>
</div>
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.empty-state p {
  color: var(--color-text-secondary);
  max-width: 35ch;
}
```
