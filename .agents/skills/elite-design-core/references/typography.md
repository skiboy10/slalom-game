# Typography

Typography creates hierarchy, establishes tone, and ensures readability. It's the most impactful design element - get it right and everything else follows.

## Table of Contents

1. [Type Scale](#type-scale)
2. [Fluid Typography](#fluid-typography)
3. [Line Height & Spacing](#line-height--spacing)
4. [Font Pairing](#font-pairing)
5. [Responsive Typography](#responsive-typography)
6. [Performance](#performance)

---

## Type Scale

### The 1.25 Ratio (Major Third)

A 1.25 ratio creates balanced progression - noticeable but not jarring.

```css
:root {
  /* Base size */
  --text-base: 1rem;        /* 16px */

  /* Scale down */
  --text-sm: 0.875rem;      /* 14px */
  --text-xs: 0.75rem;       /* 12px */

  /* Scale up (each × 1.25) */
  --text-lg: 1.25rem;       /* 20px */
  --text-xl: 1.563rem;      /* 25px */
  --text-2xl: 1.953rem;     /* 31px */
  --text-3xl: 2.441rem;     /* 39px */
  --text-4xl: 3.052rem;     /* 49px */
  --text-5xl: 3.815rem;     /* 61px */
  --text-6xl: 4.768rem;     /* 76px */
}
```

### Alternative Ratios

| Ratio | Name | Character |
|-------|------|-----------|
| 1.125 | Major Second | Subtle, conservative |
| 1.200 | Minor Third | Moderate |
| **1.250** | **Major Third** | **Balanced (recommended)** |
| 1.333 | Perfect Fourth | Bold |
| 1.414 | Augmented Fourth | Dramatic |
| 1.618 | Golden Ratio | Very dramatic |

### Applying the Scale

```css
/* Semantic size mapping */
h1 { font-size: var(--text-5xl); }  /* 61px - hero headlines */
h2 { font-size: var(--text-3xl); }  /* 39px - section titles */
h3 { font-size: var(--text-2xl); }  /* 31px - subsection titles */
h4 { font-size: var(--text-xl); }   /* 25px - card titles */
h5 { font-size: var(--text-lg); }   /* 20px - small headings */
h6 { font-size: var(--text-base); } /* 16px - label-like */

p { font-size: var(--text-base); }  /* 16px - body copy */
small { font-size: var(--text-sm); } /* 14px - supporting text */
```

---

## Fluid Typography

### Using clamp()

Fluid type scales smoothly between viewport sizes without breakpoints.

```css
/* Syntax: clamp(minimum, preferred, maximum) */

:root {
  /* Body text: 16px → 18px */
  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);

  /* Headings with larger range */
  --text-h1: clamp(2.5rem, 2rem + 3vw, 4.5rem);   /* 40px → 72px */
  --text-h2: clamp(2rem, 1.5rem + 2vw, 3rem);     /* 32px → 48px */
  --text-h3: clamp(1.5rem, 1.25rem + 1.5vw, 2.25rem); /* 24px → 36px */
}

h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); }
h3 { font-size: var(--text-h3); }
p { font-size: var(--text-body); }
```

### The clamp() Formula

```
clamp(min, preferred, max)

Preferred value formula:
baseSize + (maxSize - minSize) / (maxVW - minVW) × 100vw

Simplified approach:
clamp(minRem, baseRem + Xvw, maxRem)

Where X is typically 1-3 for body text, 2-5 for headings
```

### Practical Fluid Scale

```css
:root {
  /* Complete fluid scale */
  --fluid-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --fluid-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --fluid-base: clamp(1rem, 0.925rem + 0.4vw, 1.125rem);
  --fluid-lg: clamp(1.125rem, 1rem + 0.6vw, 1.375rem);
  --fluid-xl: clamp(1.25rem, 1.1rem + 0.8vw, 1.625rem);
  --fluid-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);
  --fluid-3xl: clamp(1.875rem, 1.5rem + 1.9vw, 3rem);
  --fluid-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 4rem);
  --fluid-5xl: clamp(3rem, 2.25rem + 3.75vw, 6rem);
}
```

---

## Line Height & Spacing

### Line Height Guidelines

```css
:root {
  /* Line heights by text role */
  --leading-none: 1;        /* Display text, single-line headings */
  --leading-tight: 1.25;    /* Large headings */
  --leading-snug: 1.375;    /* Subheadings, short paragraphs */
  --leading-normal: 1.5;    /* Body text (optimal for readability) */
  --leading-relaxed: 1.625; /* Long-form reading */
  --leading-loose: 2;       /* Spaced-out text, poetry */
}
```

### Applying Line Heights

```css
/* Headings - tighter line height */
h1, h2, h3 {
  line-height: var(--leading-tight);  /* 1.25 */
}

/* Body - optimal reading */
p, li {
  line-height: var(--leading-normal);  /* 1.5 */
}

/* Long-form content */
article p {
  line-height: var(--leading-relaxed);  /* 1.625 */
}

/* UI text - compact */
.btn, .nav-link {
  line-height: var(--leading-tight);  /* 1.25 */
}
```

### Letter Spacing

```css
:root {
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}

/* Large headings - tighten */
h1 {
  letter-spacing: var(--tracking-tight);
}

/* All caps - widen */
.label {
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  font-size: var(--text-xs);
}
```

### Paragraph Spacing

```css
/* Consistent paragraph rhythm */
p + p {
  margin-top: 1.5em;  /* One line of space */
}

/* Or use explicit spacing */
p {
  margin-bottom: var(--space-4);  /* 16px */
}

/* Long-form has more breathing room */
article p {
  margin-bottom: var(--space-6);  /* 24px */
}
```

---

## Font Pairing

### The Contrast Principle

Pair fonts with clear contrast - don't use similar fonts.

**Good pairings:**
- Serif headlines + Sans-serif body
- Geometric sans + Humanist sans
- Display font + Neutral body

**Avoid:**
- Two serif fonts
- Two geometric sans fonts
- Fonts that are "almost the same"

### Recommended Pairings

```css
/* Modern Tech */
:root {
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
}

/* Editorial/Premium */
:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
}

/* Clean/Minimal */
:root {
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
}

/* Bold/Creative */
:root {
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

/* Corporate/Professional */
:root {
  --font-heading: 'Libre Franklin', sans-serif;
  --font-body: 'Libre Franklin', sans-serif;
}
```

### Weight Distribution

```css
/* Heading weights */
h1 { font-weight: 700; }  /* Bold for impact */
h2 { font-weight: 600; }  /* Semi-bold for sections */
h3 { font-weight: 600; }
h4 { font-weight: 500; }  /* Medium for smaller headings */

/* Body weights */
p { font-weight: 400; }        /* Regular for body */
strong { font-weight: 600; }   /* Semi-bold for emphasis */
```

---

## Responsive Typography

### Mobile-First Approach

```css
/* Base (mobile) */
h1 { font-size: var(--text-3xl); }  /* 39px */
h2 { font-size: var(--text-2xl); }  /* 31px */
p { font-size: var(--text-base); }  /* 16px */

/* Tablet and up */
@media (min-width: 768px) {
  h1 { font-size: var(--text-4xl); }  /* 49px */
  h2 { font-size: var(--text-3xl); }  /* 39px */
}

/* Desktop */
@media (min-width: 1024px) {
  h1 { font-size: var(--text-5xl); }  /* 61px */
}
```

### Measure (Line Length)

Optimal line length is 45-75 characters. Use `ch` units:

```css
/* Constrain body text width */
p {
  max-width: 65ch;  /* ~65 characters */
}

/* Wider for headings */
h1, h2 {
  max-width: 25ch;  /* Shorter measure for impact */
}

/* Full-width container, constrained text */
.text-container {
  max-width: 70ch;
  margin-inline: auto;
}
```

### Container Queries for Typography

```css
.card-container {
  container-type: inline-size;
}

.card-title {
  font-size: var(--text-lg);  /* 20px default */
}

@container (min-width: 400px) {
  .card-title {
    font-size: var(--text-xl);  /* 25px when space allows */
  }
}

@container (min-width: 600px) {
  .card-title {
    font-size: var(--text-2xl);  /* 31px on large cards */
  }
}
```

---

## Performance

### Font Loading Strategy

```css
/* Use font-display for fast rendering */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;  /* Show fallback immediately, swap when loaded */
  font-weight: 400;
}
```

### Preload Critical Fonts

```html
<head>
  <!-- Preload the most critical font weights -->
  <link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/inter-600.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

### Variable Fonts

Variable fonts reduce file count and size:

```css
@font-face {
  font-family: 'Inter';
  src: url('Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;  /* Full weight range */
  font-display: swap;
}

/* Use any weight */
h1 { font-weight: 725; }  /* Precise control */
h2 { font-weight: 650; }
```

### System Font Stack Fallback

Always provide fallbacks:

```css
:root {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;

  --font-serif: 'Playfair Display', ui-serif, Georgia,
    Cambria, 'Times New Roman', Times, serif;

  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular,
    Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
}
```

---

## Quick Reference

### Typography Checklist

- [ ] Type scale established (1.25 ratio recommended)
- [ ] Fluid typography using clamp() for key sizes
- [ ] Line heights appropriate (1.5 for body, 1.25 for headings)
- [ ] Max-width on body text (45-75ch)
- [ ] Font weights creating clear hierarchy
- [ ] Fonts preloaded for critical paths
- [ ] font-display: swap for all custom fonts
- [ ] System font fallbacks in place

### Size Quick Reference

```
12px (xs)    → Captions, labels, metadata
14px (sm)    → Secondary text, helper text
16px (base)  → Body copy (never smaller)
20px (lg)    → Lead paragraphs, large body
25px (xl)    → Small headings, card titles
31px (2xl)   → Subheadings
39px (3xl)   → Section titles
49px (4xl)   → Page titles
61px (5xl)   → Hero headlines
```

---

## Real-World Font Pairing Examples

Production font pairings from five industry archetypes, each demonstrating how type choices reinforce brand personality.

### Modern/Bold Digital Studio

```css
@import '@fontsource-variable/space-grotesk';
@import '@fontsource-variable/inter';

:root {
  --font-display: 'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif;
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

.text-hero {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 2rem + 5vw, 7rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.text-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
```

**Why it works:** Space Grotesk's geometric personality signals technical confidence. Tight letter-spacing on display (-0.03em) creates density and impact. Mono labels with wide tracking (0.15em) provide counterpoint rhythm.

### Luxury Serif E-commerce

```css
@import '@fontsource-variable/cormorant-garamond';
@import '@fontsource/poppins/400.css';
@import '@fontsource/poppins/500.css';
@import '@fontsource/poppins/600.css';

:root {
  --font-heading: 'Cormorant Garamond Variable', Georgia, serif;
  --font-body: 'Poppins', system-ui, sans-serif;
  --font-accent: 'Cormorant Garamond Variable', Georgia, serif;

  --text-hero: clamp(3.5rem, 2rem + 5vw, 6rem);
  --text-4xl: clamp(2.25rem, 1.5rem + 2.5vw, 3.5rem);
}

.text-accent {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
}
```

**Why it works:** Cormorant Garamond's thin strokes and high contrast evoke luxury. Poppins as body provides modern legibility without competing with the serif's elegance. The italic accent font creates editorial flair for feature text.

### Warm/Inclusive Clinic

```css
@import '@fontsource-variable/fraunces';
@import '@fontsource-variable/inter';

:root {
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Inter Variable', 'Inter', system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-variation-settings: 'opsz' 32, 'WONK' 0, 'SOFT' 50;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h1 {
  font-size: clamp(2.25rem, 1.75rem + 2.5vw, 3.815rem);
  font-weight: 600;
}
```

**Why it works:** Fraunces is a variable font with optical size (`opsz`), wonkiness (`WONK`), and softness (`SOFT`) axes. Setting `SOFT: 50` rounds the letterforms for a warm, approachable feel — the typography itself communicates safety. Inter as body provides clinical clarity without coldness.

### Authoritative Legal Practice

```css
:root {
  --font-serif: 'Gelasio', Georgia, serif;
  --font-sans: 'Inter Variable', system-ui, sans-serif;
}

.text-hero {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 2rem + 4vw, 5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.text-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  font-weight: 600;
}
```

**Why it works:** Gelasio's sturdy serifs project authority and permanence. Combined with globally enforced sharp corners (`border-radius: 0`), the typography reinforces an editorial, no-nonsense aesthetic. Gold-colored labels add premium signaling without softening the tone.

### Professional Healthcare

```css
@import '@fontsource/dm-serif-display';
@import '@fontsource-variable/dm-sans';

:root {
  --font-heading: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans Variable', system-ui, sans-serif;
}
```

**Why it works:** DM Serif Display + DM Sans is a built-to-pair combination from the same type family. The serif's warmth avoids the coldness of clinical settings while maintaining professionalism. DM Sans provides exceptional legibility at body sizes.

### Fluid Type Scale Comparison

| Level | Digital Studio | Luxury E-commerce | Clinic | Legal |
|-------|---------------|-------------------|--------|-------|
| Hero | `clamp(2.75rem, 2rem + 5vw, 7rem)` | `clamp(3.5rem, 2rem + 5vw, 6rem)` | `clamp(2.25rem, 1.75rem + 2.5vw, 3.815rem)` | `clamp(3rem, 2rem + 4vw, 5rem)` |
| H2 | `clamp(1.75rem, 1.25rem + 2vw, 3rem)` | `clamp(2.25rem, 1.5rem + 2.5vw, 3.5rem)` | `clamp(1.75rem, 1.4rem + 1.75vw, 2.441rem)` | `clamp(2.25rem, 1.5rem + 3vw, 3.5rem)` |
| Body | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` | `1rem` (static) | `1rem` (via scale) | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` |

### @fontsource-variable Import Pattern

Self-hosted fonts via `@fontsource-variable` eliminate external requests and FOUT:

```css
/* Variable fonts — single file, all weights */
@import '@fontsource-variable/inter';
@import '@fontsource-variable/fraunces';

/* Static fonts — import only weights you need */
@import '@fontsource/poppins/400.css';
@import '@fontsource/poppins/600.css';
```

Variable fonts are preferred: one file covers the full weight range, enabling precise `font-weight: 650` values and axis control via `font-variation-settings`.
