# Spacing Systems

Consistent spacing is the foundation of professional design. The 8px grid system provides mathematical harmony that users perceive as "polished" even if they can't articulate why.

## Table of Contents

1. [The 8px Grid](#the-8px-grid)
2. [Spacing Scale](#spacing-scale)
3. [Spacing Relationships](#spacing-relationships)
4. [Component Spacing](#component-spacing)
5. [Responsive Spacing](#responsive-spacing)
6. [Common Patterns](#common-patterns)

---

## The 8px Grid

### Why 8px?

- **Divisible:** 8 divides evenly (8, 4, 2, 1) for sub-grid needs
- **Screen-friendly:** Most screen resolutions are multiples of 8
- **Android compatibility:** Android uses 4dp base, scales cleanly to 8px
- **Visual harmony:** Creates consistent rhythm across all elements

### Base Unit

```css
:root {
  --base-unit: 0.5rem;  /* 8px at default font size */
}
```

All spacing derives from this base:

```css
/* Spacing as multiples of 8px */
--space-1: calc(var(--base-unit) * 0.5);   /* 4px */
--space-2: var(--base-unit);                /* 8px */
--space-3: calc(var(--base-unit) * 1.5);   /* 12px */
--space-4: calc(var(--base-unit) * 2);     /* 16px */
```

---

## Spacing Scale

### Complete Scale

```css
:root {
  /* Micro spacing (tight relationships) */
  --space-0: 0;
  --space-px: 1px;
  --space-0.5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */

  /* Small spacing (within components) */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */

  /* Medium spacing (between elements) */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */

  /* Large spacing (between groups) */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */

  /* Section spacing */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-32: 8rem;       /* 128px */

  /* Hero/dramatic spacing */
  --space-40: 10rem;      /* 160px */
  --space-48: 12rem;      /* 192px */
  --space-64: 16rem;      /* 256px */
}
```

### When to Use Each Size

| Size | Use Case |
|------|----------|
| 0-1 (0-4px) | Icon padding, border-like gaps |
| 2-3 (8-12px) | Tight element relationships (label to input) |
| 4-6 (16-24px) | Standard element spacing, card padding |
| 8-12 (32-48px) | Between content groups, section headers |
| 16-24 (64-96px) | Section padding, major separations |
| 32+ (128px+) | Hero sections, dramatic whitespace |

---

## Spacing Relationships

### The Proximity Principle

Related elements should be closer together than unrelated elements.

```css
/* Form field grouping */
.form-group {
  margin-bottom: var(--space-6);  /* 24px between groups */
}

.form-label {
  margin-bottom: var(--space-2);  /* 8px - tight to input */
}

.form-input {
  margin-bottom: var(--space-1);  /* 4px - very tight to helper */
}

.form-helper {
  /* No margin - helper is part of input group */
}
```

### Ratio Relationships

Maintain consistent ratios between spacing levels:

```
Section padding : Content group spacing : Element spacing
      3         :          2            :        1

Example:
Section padding: 96px (var(--space-24))
Group spacing:   64px (var(--space-16))
Element spacing: 32px (var(--space-8))
```

### Container Padding Pattern

Larger containers need more padding:

```css
/* Card sizes with proportional padding */
.card-sm {
  padding: var(--space-4);  /* 16px */
}

.card-md {
  padding: var(--space-6);  /* 24px */
}

.card-lg {
  padding: var(--space-8);  /* 32px */
}

/* Section padding scales with importance */
.section {
  padding-block: var(--space-24);  /* 96px default */
}

.section-hero {
  padding-block: var(--space-32);  /* 128px - more dramatic */
}
```

---

## Component Spacing

### Button Spacing

```css
.btn {
  /* Horizontal padding > vertical (2:1 or 3:2 ratio) */
  padding: var(--space-3) var(--space-6);  /* 12px 24px */
}

.btn-sm {
  padding: var(--space-2) var(--space-4);  /* 8px 16px */
}

.btn-lg {
  padding: var(--space-4) var(--space-8);  /* 16px 32px */
}

/* Button groups */
.btn-group {
  gap: var(--space-3);  /* 12px between buttons */
}
```

### Card Spacing

```css
.card {
  padding: var(--space-6);  /* 24px */
}

.card-header {
  margin-bottom: var(--space-4);  /* 16px */
}

.card-title {
  margin-bottom: var(--space-2);  /* 8px - tight to description */
}

.card-description {
  margin-bottom: var(--space-4);  /* 16px - before actions */
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}
```

### List Spacing

```css
/* Stacked list items */
.list-item {
  padding-block: var(--space-4);  /* 16px */
  border-bottom: 1px solid var(--color-border);
}

/* Inline lists */
.inline-list {
  display: flex;
  gap: var(--space-6);  /* 24px horizontal gap */
}

/* Navigation items */
.nav-item {
  padding: var(--space-2) var(--space-4);  /* 8px 16px */
}
```

### Form Spacing

```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);  /* 24px between form groups */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);  /* 8px between label/input/helper */
}

.form-row {
  display: flex;
  gap: var(--space-4);  /* 16px between inline fields */
}
```

---

## Responsive Spacing

### Fluid Spacing with clamp()

```css
:root {
  /* Fluid section padding: 48px → 96px */
  --section-padding: clamp(3rem, 8vw, 6rem);

  /* Fluid container padding: 16px → 32px */
  --container-padding: clamp(1rem, 4vw, 2rem);

  /* Fluid gap: 16px → 32px */
  --grid-gap: clamp(1rem, 3vw, 2rem);
}

section {
  padding-block: var(--section-padding);
}

.container {
  padding-inline: var(--container-padding);
}

.grid {
  gap: var(--grid-gap);
}
```

### Breakpoint Adjustments

```css
/* Mobile-first spacing */
:root {
  --section-padding: var(--space-12);  /* 48px */
  --card-padding: var(--space-4);      /* 16px */
}

@media (min-width: 768px) {
  :root {
    --section-padding: var(--space-16);  /* 64px */
    --card-padding: var(--space-6);      /* 24px */
  }
}

@media (min-width: 1024px) {
  :root {
    --section-padding: var(--space-24);  /* 96px */
    --card-padding: var(--space-8);      /* 32px */
  }
}
```

### Container Queries for Components

```css
.card-container {
  container-type: inline-size;
}

.card {
  padding: var(--space-4);  /* 16px default */
}

@container (min-width: 400px) {
  .card {
    padding: var(--space-6);  /* 24px when container allows */
  }
}
```

---

## Common Patterns

### Section Structure

```css
.section {
  padding-block: var(--space-24);  /* 96px vertical */
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-16);  /* 64px before content */
}

.section-title {
  margin-bottom: var(--space-4);  /* 16px to description */
}

.section-description {
  max-width: 60ch;
  margin-inline: auto;
}

.section-content {
  /* Content grid/layout here */
}
```

### Hero Section

```css
.hero {
  padding-block: var(--space-32);  /* 128px - dramatic */
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  margin-bottom: var(--space-6);  /* 24px */
}

.hero-description {
  margin-bottom: var(--space-8);  /* 32px - before CTA */
}

.hero-actions {
  display: flex;
  gap: var(--space-4);  /* 16px between buttons */
}
```

### Grid Layouts

```css
/* Bento grid spacing */
.bento-grid {
  display: grid;
  gap: var(--space-4);  /* 16px - tight for bento */
}

/* Card grid spacing */
.card-grid {
  display: grid;
  gap: var(--space-6);  /* 24px - standard */
}

/* Feature grid (more breathing room) */
.feature-grid {
  display: grid;
  gap: var(--space-8);  /* 32px - more whitespace */
}
```

### Content Stacking

```css
/* Consistent vertical rhythm */
.content-stack > * + * {
  margin-top: var(--space-4);  /* 16px between elements */
}

/* Larger stack for sections */
.section-stack > * + * {
  margin-top: var(--space-16);  /* 64px between sections */
}
```

---

## Quick Reference

### Spacing Cheat Sheet

```
4px   (--space-1)   → Icon gaps, micro adjustments
8px   (--space-2)   → Tight relationships (label-input)
12px  (--space-3)   → Button padding vertical
16px  (--space-4)   → Standard element spacing
24px  (--space-6)   → Card padding, form group gaps
32px  (--space-8)   → Between content groups
48px  (--space-12)  → Section header to content
64px  (--space-16)  → Medium section padding
96px  (--space-24)  → Standard section padding
128px (--space-32)  → Hero/dramatic sections
```

### Rules of Thumb

1. **Double or halve** - When unsure, double the spacing for more separation, halve it for tighter grouping
2. **Inside < outside** - Padding inside a component should be less than margin outside
3. **Related = close** - Elements that belong together should be closer than elements that don't
4. **Consistent ratios** - Maintain similar relationships throughout (e.g., header always 2x body spacing)
5. **When in doubt, add space** - More whitespace usually improves design; less rarely does
