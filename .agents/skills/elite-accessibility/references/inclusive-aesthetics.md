# Inclusive Aesthetics

Design choices that are both beautiful and accessible — proving that accessibility and aesthetics aren't in tension.

## Table of Contents

1. [Brand-Tinted Shadows](#brand-tinted-shadows)
2. [Selection Customization](#selection-customization)
3. [Typography Comfort](#typography-comfort)
4. [Decorative Element Accessibility](#decorative-element-accessibility)

---

## Brand-Tinted Shadows

Replace pure black shadows with brand-colored shadows:

```css
/* Pure black shadows — harsh, clinical */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);

/* Brand-tinted shadows — warm, cohesive */
--shadow-md: 0 4px 12px rgba(40, 33, 62, 0.06);
```

The `rgba(40, 33, 62, ...)` uses plum as the shadow base. The visual result is softer and more harmonious — shadows feel "warm" rather than sterile. This is particularly effective for brands in wellness, healthcare, and personal services.

---

## Selection Customization

`::selection` is a micro-brand touchpoint:

```css
/* Match brand palette */
::selection {
  background: var(--color-accent-light);
  color: var(--color-text-primary);
}
```

Ensure selected text maintains WCAG contrast — the selection background + text color combination must meet 4.5:1.

---

## Typography Comfort

### Optimal Reading Width

```css
p {
  max-width: 65ch;
  line-height: 1.65;
}
```

The `65ch` measure keeps lines within the 45-75 character optimal range. `line-height: 1.65` provides comfortable vertical rhythm for extended reading.

### Text Wrapping

```css
h1, h2, h3, h4 {
  text-wrap: balance;
}
```

`text-wrap: balance` distributes text evenly across lines in headings, preventing awkward single-word last lines (widows/orphans).

### Font Rendering

```css
html {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Decorative Element Accessibility

All decorative elements must be invisible to assistive technology:

```html
<!-- Grain overlay — aria-hidden -->
<div class="grain-overlay" aria-hidden="true"></div>

<!-- Ticker/marquee — aria-hidden on the animated track -->
<div class="ticker" aria-label="Client testimonials">
  <div class="ticker-track" aria-hidden="true">
    <!-- Duplicated content for seamless loop -->
  </div>
</div>

<!-- Container-frame guides — aria-hidden -->
<div class="container-frame" aria-hidden="true"></div>

<!-- Animated background — aria-hidden -->
<canvas class="bg-animation" aria-hidden="true"></canvas>
```

The pattern: decorative animations get `aria-hidden="true"`, while the parent element gets an `aria-label` describing the content semantically.
