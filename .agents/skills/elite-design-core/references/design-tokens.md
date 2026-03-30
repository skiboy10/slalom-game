# Design Tokens

A complete token system creates consistency and enables rapid theming. This reference shows production-tested token architectures from real projects.

## Table of Contents

1. [Tailwind v4 @theme Pattern](#tailwind-v4-theme-pattern)
2. [Spacing Tokens](#spacing-tokens)
3. [Z-Index Scale](#z-index-scale)
4. [Radius Scale](#radius-scale)
5. [Transition Tokens](#transition-tokens)
6. [Container Patterns](#container-patterns)
7. [Section Theming](#section-theming)
8. [Decorative Elements](#decorative-elements)
9. [Grain/Noise Texture](#grainnoise-texture)

---

## Tailwind v4 @theme Pattern

Tailwind v4 replaces `tailwind.config.js` with CSS-native `@theme {}` blocks. All tokens defined here automatically become utility classes.

```css
@import 'tailwindcss';

@theme {
  /* ── Color palette ──────────────────────── */
  --color-void: #1a1614;
  --color-void-soft: #221e1b;
  --color-surface: #f5f3ef;
  --color-accent: #f97316;
  --color-accent-hover: #ea580c;
  --color-highlight: #D5FA71;

  /* ── Typography ─────────────────────────── */
  --font-display: 'Space Grotesk Variable', system-ui, sans-serif;
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* ── Fluid spacing ──────────────────────── */
  --spacing-section: clamp(7rem, 14vw, 12rem);
  --spacing-container: clamp(1.5rem, 5vw, 4rem);
  --spacing-grid: clamp(1.5rem, 3vw, 2.5rem);

  /* ── Z-index scale ──────────────────────── */
  --z-base: 1;
  --z-header: 25;
  --z-overlay: 30;
  --z-modal: 40;

  /* ── Radius scale ───────────────────────── */
  --radius-sm: 0.5rem;
  --radius: 0.75rem;
  --radius-lg: 1.25rem;
}
```

---

## Spacing Tokens

### Fluid Section Spacing

Different industries need different spatial density:

| Archetype | --spacing-section | Feel |
|-----------|-------------------|------|
| Digital Studio | `clamp(7rem, 14vw, 12rem)` | Generous, airy |
| Luxury E-commerce | `clamp(4rem, 8vw, 8rem)` | Moderate, editorial |
| Mental Health Clinic | `clamp(4rem, 10vw, 7rem)` | Balanced, calm |
| Criminal Defense Firm | `clamp(5rem, 10vw, 9rem)` | Confident, spacious |

### Standard Fluid Tokens

```css
@theme {
  --spacing-section: clamp(4rem, 10vw, 7rem);
  --spacing-section-lg: clamp(5rem, 12vw, 9rem);
  --spacing-container: clamp(1.25rem, 5vw, 4rem);
  --spacing-grid: clamp(1rem, 2.5vw, 2rem);
}
```

---

## Z-Index Scale

A predictable z-index system prevents stacking wars:

```css
@theme {
  --z-base: 1;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-header: 25;
  --z-drawer: 30;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;
}
```

---

## Radius Scale

```css
/* Rounded aesthetic (clinic, e-commerce) */
@theme {
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}

/* Sharp aesthetic (legal, editorial) */
/* Enforce globally: */
*, *::before, *::after {
  border-radius: 0 !important;
}
```

Radius is a powerful brand signal. Rounded corners feel approachable and modern; sharp corners feel authoritative and editorial.

---

## Transition Tokens

```css
@theme {
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-default: 300ms;
  --duration-slow: 500ms;
}
```

Production easing values:
- `cubic-bezier(0.22, 1, 0.36, 1)` — primary ease-out, used for UI transitions (nav, accordion, hover)
- `cubic-bezier(0.4, 0, 0.2, 1)` — standard ease, used for button and icon transitions
- `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring ease, used for playful bounces

---

## Container Patterns

### Standard Container

```css
.container-site {
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
}

.container-narrow {
  max-width: 900px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
}
```

### Full-Bleed Grid

A 12-column named-line grid that supports full-bleed backgrounds with contained content:

```css
.grid-page {
  --columns: 12;
  --gutter: clamp(1rem, 2vw, 2rem);
  --margin: clamp(1rem, 5vw, 6rem);
  display: grid;
  grid-template-columns:
    [full-start] var(--margin)
    [content-start] repeat(var(--columns), 1fr)
    [content-end] var(--margin) [full-end];
  gap: var(--gutter);
}

.grid-page > * {
  grid-column: content-start / content-end;
}

.grid-page > .full-bleed {
  grid-column: full-start / full-end;
}
```

---

## Section Theming

Toggle sections between light and dark with CSS classes:

```css
.section-dark {
  background: var(--color-void);
  color: var(--color-text-light);
}

.section-light {
  background: var(--color-surface);
  color: var(--color-text-dark);
}

/* Dark section inherits text color to children */
.dark-section :is(h1, h2, h3, h4, h5, h6, p, a, span, li) {
  color: inherit;
}
```

---

## Decorative Elements

### Accent Line

```css
.accent-line {
  width: 2.5rem;
  height: 2px;
  background: var(--color-accent);
  display: block;
}
```

### Gradient Decorative Rule

```css
.decorative-rule {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-border-dark) 20%,
    var(--color-accent) 50%,
    var(--color-border-dark) 80%,
    transparent
  );
}
```

---

## Grain/Noise Texture

A subtle film grain overlay adds sophistication and depth. Used across multiple production sites with different opacity levels.

### Implementation

```css
.grain-overlay {
  position: relative;
}

.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.035; /* Subtle for dark backgrounds */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  z-index: 1;
}
```

### Tuning Parameters

| Parameter | Subtle (dark bg) | Moderate (light bg) |
|-----------|-----------------|-------------------|
| `opacity` | 0.035 | 0.08 |
| `baseFrequency` | 0.9 | 0.8 |
| `numOctaves` | 4 | 4 |
| `background-size` | 256px 256px | 256px 256px |

The `256px` tile with `repeat` is GPU-friendly. Always include `pointer-events: none` so the overlay doesn't block clicks, and set a `z-index` above content backgrounds but below interactive elements.

---

## Style Selection Rules

Rules for maintaining visual consistency and polish across the interface.

### One Primary Action Per Screen

Each screen should have ONE clearly dominant CTA. Secondary actions must be visually subordinate:

```css
/* Primary: filled, prominent */
.btn-primary {
  background: var(--color-accent);
  color: white;
  font-weight: 600;
}

/* Secondary: outlined, understated */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

/* Ghost: minimal, tertiary */
.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
}
```

### Elevation Scale

Use a consistent shadow scale — never invent random shadow values:

```css
@theme {
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 40px rgba(0, 0, 0, 0.16);
}
```

Higher elevation = closer to user. Cards at `sm`, dropdowns at `md`, modals at `lg`, popovers at `xl`.

### No Emoji Icons

Always use SVG icons (Heroicons, Lucide, Phosphor). Never emojis:

- Emojis render differently across platforms and devices
- Emojis can't be styled with CSS (no color tokens, no stroke width)
- Emojis break at different text sizes
- SVG icons scale cleanly, support theming, and maintain consistency

### Icon Consistency

Within a single product, all icons must share:
- Same **stroke width** (e.g., 1.5px or 2px)
- Same **corner radius** (matching the brand: rounded or sharp)
- Same **visual weight** (consistent fill density)
- Same **size grid** (24x24 or 20x20 base)

### State Clarity

Every interactive element must have visually distinct states:

| State | Visual Treatment |
|-------|-----------------|
| Default | Base appearance |
| Hover | Subtle background/border change, cursor: pointer |
| Pressed/Active | Darkened background or scale (0.96) |
| Focused | 2px outline + 2px offset (keyboard) |
| Disabled | Opacity 0.4, cursor: not-allowed |
| Loading | Spinner or skeleton replacing content |
