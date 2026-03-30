# Editorial Layout Patterns

Layout patterns that create editorial, magazine-style web experiences.

## Table of Contents

1. [Container-Frame Guides](#container-frame-guides)
2. [Full-Bleed Grid](#full-bleed-grid)
3. [Fluid Section Spacing](#fluid-section-spacing)
4. [Sharp Corner Enforcement](#sharp-corner-enforcement)
5. [Scrollable Embedded Viewport](#scrollable-embedded-viewport)

---

## Container-Frame Guides

Fixed vertical guide lines at content edges — the web equivalent of a designer's column rulers. Creates a subtle sense of editorial precision and alignment.

```css
.container-frame {
  position: fixed;
  inset: 0;
  max-width: 1320px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
  pointer-events: none;
  z-index: 0;
}

.container-frame::before,
.container-frame::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(0, 0, 0, 0.06);
}

.container-frame::before {
  left: var(--spacing-container);
}

.container-frame::after {
  right: var(--spacing-container);
}
```

```html
<!-- Place once in the body, outside main content -->
<div class="container-frame" aria-hidden="true"></div>
```

`aria-hidden="true"` because this is purely decorative. `pointer-events: none` ensures it doesn't block clicks. The lines align with the container's padding edges, reinforcing the content boundaries.

---

## Full-Bleed Grid

A named-line grid that supports full-bleed backgrounds while containing content:

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

/* Default: children stay within content area */
.grid-page > * {
  grid-column: content-start / content-end;
}

/* Opt-in: stretch edge-to-edge */
.grid-page > .full-bleed {
  grid-column: full-start / full-end;
}
```

This pattern eliminates the need for negative-margin hacks to break out of containers. Content stays within the 12-column grid; background images and decorative sections span the full viewport.

---

## Fluid Section Spacing

Different industries use different spatial density. All use `clamp()` for smooth responsive scaling:

| Archetype | --spacing-section | Density | Mood |
|-----------|-------------------|---------|------|
| Digital Studio | `clamp(7rem, 14vw, 12rem)` | Low | Generous, airy, confident |
| Luxury E-commerce | `clamp(4rem, 8vw, 8rem)` | Medium | Editorial, breathing room |
| Mental Health Clinic | `clamp(4rem, 10vw, 7rem)` | Medium | Calm, unhurried |
| Criminal Defense Firm | `clamp(5rem, 10vw, 9rem)` | Medium-Low | Spacious, authoritative |
| Community Pharmacy | `clamp(3rem, 6vw, 5rem)` | High | Information-dense, efficient |

```css
.section {
  padding-block: var(--spacing-section);
}

.section-lg {
  padding-block: var(--spacing-section-lg);
}
```

---

## Sharp Corner Enforcement

For editorial/authoritative aesthetics, enforce zero border-radius globally:

```css
*,
*::before,
*::after {
  border-radius: 0 !important;
}
```

This is a strong brand signal. It says "precision, authority, no softness." Used in legal, editorial, and some luxury contexts. The `!important` override is intentional — it enforces the brand rule even when third-party components inject rounded corners.

---

## Scrollable Embedded Viewport

A contained scrollable area within a page section (for project showcases, code previews, or gallery browsers):

```css
.scroll-viewport {
  max-height: 70vh;
  overflow-y: auto;
  position: relative;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-viewport::-webkit-scrollbar {
  display: none;
}

/* Gradient overlay hints "there's more below" */
.scroll-viewport::after {
  content: '';
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: linear-gradient(transparent, var(--color-bg));
  pointer-events: none;
  display: block;
}
```

If using Lenis for smooth scroll, add `data-lenis-prevent` to exclude this viewport from the smooth scroll handler:

```html
<div class="scroll-viewport" data-lenis-prevent>
  <!-- Scrollable content -->
</div>
```

---

## Responsive Completeness

### Viewport Meta Tag

Required on every page — without it, mobile browsers render at desktop width:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Never disable zoom** — `user-scalable=no` and `maximum-scale=1` are accessibility violations. Users with low vision need zoom.

### Orientation Support

Layouts must remain readable and functional in landscape:

- Don't lock orientation unless the app is inherently single-orientation (e.g., camera)
- Fixed headers/footers must not consume >30% of landscape viewport height
- Test with both portrait and landscape orientations

### Fixed Element Offset

Fixed/sticky headers and bottom bars must reserve space for content underneath:

```css
/* Bottom bar offset */
body {
  padding-bottom: 4rem; /* Match bar height */
}

/* Header offset for anchor links */
html {
  scroll-padding-top: 5rem; /* Match header height */
}

/* Safe area for iOS bottom bar */
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom);
}

@media (min-width: 768px) {
  body { padding-bottom: 0; }
  .bottom-bar { display: none; }
}
```

### Dynamic Viewport Height

Use `dvh` instead of `vh` on mobile to prevent content from being hidden behind the browser's URL bar:

```css
.full-screen-section {
  min-height: 100dvh;
}

@supports not (min-height: 100dvh) {
  .full-screen-section {
    min-height: 100vh;
  }
}
```
