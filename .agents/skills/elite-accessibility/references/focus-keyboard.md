# Focus & Keyboard Navigation

Ensuring all interactive elements are accessible via keyboard.

## Table of Contents

1. [Focus Styles](#focus-styles)
2. [Keyboard Navigation](#keyboard-navigation)
3. [Skip Links](#skip-links)
4. [Focus Trapping](#focus-trapping)
5. [Custom Components](#custom-components)

---

## Focus Styles

### The Basics

Every interactive element must have a visible focus indicator:

```css
/* Remove default, add custom */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Why :focus-visible?

- `:focus` - Shows on ALL focus (including mouse clicks)
- `:focus-visible` - Shows only on keyboard focus

```css
/* Modern approach */
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* With fallback for older browsers */
button:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

button:focus:not(:focus-visible) {
  outline: none;  /* Hide on mouse click */
}
```

### Focus Style Patterns

```css
/* Outline (recommended) */
.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Ring shadow */
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

/* Combined */
.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

/* High contrast for dark backgrounds */
.dark-section .btn:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}
```

### Focus Contrast Requirements

Focus indicators must have 3:1 contrast ratio with:
- Adjacent colors (the unfocused state)
- Background colors

```css
/* Example: Blue button needs visible focus */
.btn-primary {
  background: #2563eb;  /* Blue */
}

.btn-primary:focus-visible {
  outline: 2px solid white;  /* White contrasts with blue */
  outline-offset: 2px;
}
```

---

## Keyboard Navigation

### Standard Patterns

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift + Tab | Move to previous focusable element |
| Enter | Activate buttons, links |
| Space | Activate buttons, toggle checkboxes |
| Arrow keys | Navigate within components (tabs, menus) |
| Escape | Close modals, menus, popovers |

### Focusable Elements

Naturally focusable:
- `<a href="...">` (links with href)
- `<button>`
- `<input>`, `<select>`, `<textarea>`
- `<details>`, `<summary>`
- Elements with `tabindex="0"`

Not focusable:
- `<div>`, `<span>` (without tabindex)
- `<a>` without href
- Disabled elements
- Elements with `tabindex="-1"`

### Tab Order

```html
<!-- Natural order follows DOM -->
<button>First</button>
<button>Second</button>
<button>Third</button>

<!-- Avoid positive tabindex -->
<!-- BAD -->
<button tabindex="3">Third</button>
<button tabindex="1">First</button>
<button tabindex="2">Second</button>

<!-- If you need to remove from tab order -->
<button tabindex="-1">Not in tab order</button>
```

### Managing Focus Programmatically

```javascript
// Move focus to an element
element.focus();

// Move focus with scroll prevention
element.focus({ preventScroll: true });

// Make non-interactive element focusable
element.setAttribute('tabindex', '-1');
element.focus();  // Can focus programmatically
// User can't tab to it, but screen readers can
```

---

## Skip Links

Allow keyboard users to skip repetitive content:

```html
<body>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <header>
    <!-- Navigation here -->
  </header>

  <main id="main-content" tabindex="-1">
    <!-- Main content -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  padding: 8px 16px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-accent);
  border-radius: 4px;
  z-index: 9999;
  text-decoration: none;
}

.skip-link:focus {
  top: 16px;
}
```

### Multiple Skip Links

```html
<nav aria-label="Skip links">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <a href="#primary-nav" class="skip-link">Skip to navigation</a>
  <a href="#footer" class="skip-link">Skip to footer</a>
</nav>
```

---

## Focus Trapping

Keep focus within modals and dialogs:

### HTML Dialog Element

```html
<!-- Native dialog handles focus trapping -->
<dialog id="modal">
  <h2>Modal Title</h2>
  <p>Content here</p>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<button onclick="document.getElementById('modal').showModal()">
  Open Modal
</button>
```

### Custom Focus Trap

```javascript
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Store previously focused element
  const previouslyFocused = document.activeElement;

  // Focus first element
  firstFocusable.focus();

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeydown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeydown);
    previouslyFocused?.focus();
  };
}

// Usage
const cleanup = trapFocus(modalElement);
// Later: cleanup() to release trap and restore focus
```

### Focus Restoration

```javascript
function openModal(modal) {
  const previouslyFocused = document.activeElement;

  modal.showModal();

  modal.addEventListener('close', () => {
    previouslyFocused?.focus();
  }, { once: true });
}
```

---

## Custom Components

### Custom Button

```html
<!-- If using a div as button -->
<div
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeydown(event)"
>
  Click me
</div>
```

```javascript
function handleKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}
```

**Better: Just use a button**

```html
<button type="button" onclick="handleClick()">
  Click me
</button>
```

### Custom Tabs

```html
<div role="tablist" aria-label="Content tabs">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-1"
    id="tab-1"
    tabindex="0"
  >
    Tab 1
  </button>
  <button
    role="tab"
    aria-selected="false"
    aria-controls="panel-2"
    id="tab-2"
    tabindex="-1"
  >
    Tab 2
  </button>
</div>

<div
  role="tabpanel"
  id="panel-1"
  aria-labelledby="tab-1"
  tabindex="0"
>
  Panel 1 content
</div>

<div
  role="tabpanel"
  id="panel-2"
  aria-labelledby="tab-2"
  tabindex="0"
  hidden
>
  Panel 2 content
</div>
```

```javascript
// Arrow key navigation within tabs
tablist.addEventListener('keydown', (e) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const currentIndex = tabs.indexOf(document.activeElement);

  let newIndex;
  switch (e.key) {
    case 'ArrowLeft':
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = tabs.length - 1;
      break;
    case 'ArrowRight':
      newIndex = currentIndex + 1;
      if (newIndex >= tabs.length) newIndex = 0;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = tabs.length - 1;
      break;
    default:
      return;
  }

  e.preventDefault();
  tabs[newIndex].focus();
  // Optionally activate tab on focus
  // activateTab(tabs[newIndex]);
});
```

### Custom Dropdown Menu

```html
<div class="dropdown">
  <button
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="dropdown-menu"
  >
    Menu
  </button>

  <ul
    id="dropdown-menu"
    role="menu"
    hidden
  >
    <li role="menuitem" tabindex="-1">Option 1</li>
    <li role="menuitem" tabindex="-1">Option 2</li>
    <li role="menuitem" tabindex="-1">Option 3</li>
  </ul>
</div>
```

```javascript
// Open menu
button.addEventListener('click', () => {
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !isOpen);
  menu.hidden = isOpen;

  if (!isOpen) {
    // Focus first item
    menu.querySelector('[role="menuitem"]').focus();
  }
});

// Arrow navigation in menu
menu.addEventListener('keydown', (e) => {
  const items = [...menu.querySelectorAll('[role="menuitem"]')];
  const currentIndex = items.indexOf(document.activeElement);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
      break;
    case 'ArrowUp':
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
      break;
    case 'Escape':
      button.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      button.focus();
      break;
  }
});
```

---

## Checklist

- [ ] All interactive elements have visible focus styles
- [ ] Focus styles have 3:1 contrast ratio
- [ ] Tab order follows logical reading order
- [ ] Skip links provided for long pages
- [ ] Modals trap focus correctly
- [ ] Focus is restored when modals close
- [ ] Custom components support keyboard navigation
- [ ] Arrow keys work in composite widgets (tabs, menus)
- [ ] Escape closes modals and menus

---

## Custom Focus Ring Patterns

### Brand-Tinted Focus Rings

Replace the default browser blue focus ring with brand-appropriate colors:

```css
/* Digital studio — coral accent */
:focus-visible {
  outline: 2px solid var(--color-accent);  /* #f97316 */
  outline-offset: 2px;
}

/* Mental health clinic — lavender (calming) */
:focus-visible {
  outline: 2px solid var(--color-lavender-400);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Legal firm — gold (premium, authoritative) */
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
```

### Focus Ring with Glow

For brands that want a softer, more prominent focus indicator:

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(184, 169, 201, 0.3);
}
```

The `box-shadow` adds a translucent glow beyond the outline, making focus state more visible without being harsh.

### Skip-to-Content Pattern

Every production site includes this for keyboard navigation:

```css
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-bg);
  font-weight: 600;
  text-decoration: none;
}

.skip-to-content:focus {
  left: 0;
}
```

```html
<a class="skip-to-content" href="#main-content">Skip to content</a>
```

Placed as the first focusable element in the body. Invisible until focused via Tab key.
