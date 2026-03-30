# Navigation Patterns

Predictable, accessible navigation is foundational to usability. These patterns apply to both web and mobile interfaces.

## Table of Contents

1. [Bottom Navigation](#bottom-navigation)
2. [Sidebar & Drawer](#sidebar--drawer)
3. [Adaptive Navigation](#adaptive-navigation)
4. [Back Behavior & State](#back-behavior--state)
5. [Breadcrumbs](#breadcrumbs)
6. [Deep Linking](#deep-linking)
7. [Active State & Wayfinding](#active-state--wayfinding)
8. [Modal vs Navigation](#modal-vs-navigation)
9. [Search Accessibility](#search-accessibility)
10. [Navigation Accessibility](#navigation-accessibility)

---

## Bottom Navigation

### Rules

- **Max 5 items** — More causes crowding and decision paralysis
- **Icon + label required** — Icon-only nav harms discoverability; always pair with text
- **Top-level only** — Bottom nav is for primary destinations, never nested sub-pages
- **Active state indicator** — Current location must be visually highlighted (color, weight, filled icon)
- **Badge sparingly** — Use badges for unread/pending counts; clear after user visits

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
  padding-bottom: env(safe-area-inset-bottom); /* iPhone safe area */
  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
  z-index: var(--z-header);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 64px;
  min-height: 44px; /* Touch target */
  font-size: 0.625rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.bottom-nav-item.active {
  color: var(--color-accent);
  font-weight: 600;
}
```

---

## Sidebar & Drawer

- **Sidebar for secondary nav** — Not for primary actions. Primary goes in bottom/top nav.
- **Drawer on mobile** — Slides in from left, dimmed scrim behind (40-60% opacity)
- **Escape affordance** — Clear close button + tap-on-scrim dismisses + swipe gesture
- **Destructive separation** — Dangerous items (logout, delete account) visually separated at bottom with danger color

```css
.drawer-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-overlay);
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: var(--color-bg-primary);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: calc(var(--z-overlay) + 1);
  overflow-y: auto;
}

.drawer.open {
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .drawer { transition: none; }
}
```

---

## Adaptive Navigation

Navigation pattern should adapt to screen size:

| Screen Size | Pattern |
|-------------|---------|
| Mobile (<768px) | Bottom nav (3-5 items) + hamburger drawer for secondary |
| Tablet (768-1023px) | Top nav with condensed items or bottom nav |
| Desktop (≥1024px) | Persistent sidebar or top nav bar |

```css
.sidebar-nav {
  display: none;
}

@media (min-width: 1024px) {
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    width: 240px;
    position: sticky;
    top: 0;
    height: 100dvh;
    border-right: 1px solid var(--color-border);
  }

  .bottom-nav {
    display: none;
  }
}
```

---

## Back Behavior & State

- **Predictable back** — Back button/gesture always returns to previous screen, never resets to home
- **State preservation** — Navigating back restores scroll position, filter state, and form input
- **Never silently reset** — Don't jump to home or clear the navigation stack unexpectedly
- **Gesture support** — Support system back gestures (iOS swipe-back, Android predictive back) without conflict

### State Preservation Pattern

```javascript
// Save state before navigating away
function saveScrollState(key) {
  sessionStorage.setItem(`scroll-${key}`, window.scrollY);
}

// Restore on return
function restoreScrollState(key) {
  const saved = sessionStorage.getItem(`scroll-${key}`);
  if (saved) {
    requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)));
  }
}
```

---

## Breadcrumbs

Use for hierarchies 3+ levels deep. Essential for e-commerce and content-heavy sites.

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Product Name</li>
  </ol>
</nav>
```

```css
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.breadcrumbs li:not(:last-child)::after {
  content: '/';
  margin-left: 0.5rem;
  color: var(--color-text-muted);
}

.breadcrumbs a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}
```

---

## Deep Linking

All key screens must be reachable via URL for sharing and notifications:

- Every page/view has a unique, shareable URL
- Query parameters preserve filter/sort state (e.g., `/products?sort=price&category=shoes`)
- Hash fragments for in-page sections (`/faq#returns`)
- SPA frameworks must update the URL on route change

---

## Active State & Wayfinding

- **Current location highlighted** — Color, font-weight, indicator bar, or filled icon
- **Navigation consistency** — Same placement on all pages, never hidden in sub-flows
- **Persistent nav** — Core navigation reachable from deep pages (don't trap users)
- **Avoid mixed patterns** — Don't combine Tab + Sidebar + Bottom Nav at the same hierarchy level

```css
.nav-item.active {
  color: var(--color-accent);
  font-weight: 600;
  position: relative;
}

/* Indicator bar */
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
}
```

---

## Modal vs Navigation

- **Modals for confirmations and quick tasks** — Delete confirm, share dialog, quick edit
- **Navigation for primary flows** — Checkout, onboarding, settings pages
- **Never use modals for multi-step flows** — They break the user's mental model of navigation
- **Modal escape** — Always provide close button, Escape key, and click-outside to dismiss
- **Sheet dismiss confirm** — Confirm before dismissing a sheet/modal with unsaved changes

---

## Search Accessibility

- Search must be easily reachable (top bar or dedicated tab)
- Provide recent/suggested queries
- Show clear "no results" state with suggestions
- Support keyboard: Enter to search, Escape to clear
- `role="search"` on the search form container

---

## Navigation Accessibility

- **Focus on route change** — After page transition, move focus to main content (`<main>`) for screen readers
- **`aria-current="page"`** — Mark the current page in navigation for assistive technology
- **Tab order** — Navigation tab order matches visual order
- **Overflow menu** — When actions exceed space, use "more" menu instead of cramming
- **Empty nav state** — When a destination is unavailable, explain why instead of silently hiding it
