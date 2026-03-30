# Brand Identity Package Generator

After completing brand discovery (personality, positioning, colors, typography, tone), generate a complete `brand-assets/` folder with all deliverables.

## Table of Contents

1. [Template Variables](#template-variables)
2. [Generation Process](#generation-process)
3. [Directory Structure](#directory-structure)
4. [File Templates](#file-templates)

---

## Template Variables

Collect these from the brand discovery process before generating:

| Variable | Source | Example |
|----------|--------|---------|
| `{{brand-name}}` | Discovery Phase 1 | Trellis Studio |
| `{{brand-tagline}}` | Discovery Phase 2 | Brand, Digital, and AI for firms that lead |
| `{{archetype}}` | Discovery Phase 2 | Modern/Bold |
| `{{color-primary}}` | Discovery Phase 3 | #5f5289 |
| `{{color-primary-rgb}}` | Derived | 95, 82, 137 |
| `{{color-accent}}` | Discovery Phase 3 | #f97316 |
| `{{color-accent-rgb}}` | Derived | 249, 115, 22 |
| `{{color-surface}}` | Discovery Phase 3 | #faf6f1 |
| `{{color-surface-dark}}` | Discovery Phase 3 | #1a1614 |
| `{{color-text}}` | Derived | #1a1614 |
| `{{color-text-light}}` | Derived | #f5f3ef |
| `{{font-heading}}` | Discovery Phase 3 | Fraunces |
| `{{font-heading-stack}}` | Derived | 'Fraunces', Georgia, serif |
| `{{font-body}}` | Discovery Phase 3 | Inter Variable |
| `{{font-body-stack}}` | Derived | 'Inter Variable', system-ui, sans-serif |
| `{{font-mono}}` | Optional | JetBrains Mono |
| `{{radius-value}}` | From archetype | 0.75rem |
| `{{grain-opacity}}` | From archetype | 0.035 |
| `{{shadow-tint-rgb}}` | From primary | 95, 82, 137 |
| `{{spacing-section}}` | From archetype | clamp(5rem, 10vw, 8rem) |
| `{{initial-letter}}` | From brand-name | T |
| `{{voice-formality}}` | Discovery Phase 4 | Casual |
| `{{voice-energy}}` | Discovery Phase 4 | Enthusiastic |
| `{{headline-example}}` | Discovery Phase 4 | We build what others can't |
| `{{cta-example}}` | Discovery Phase 4 | Start a project |

### Archetype Defaults

If the user hasn't specified every value, use these defaults based on archetype:

| Value | Modern/Bold | Luxury/Editorial | Warm/Inclusive | Authoritative | Professional |
|-------|-------------|-----------------|----------------|---------------|-------------|
| radius | 0.75rem | 0.5rem | 1rem | 0 | 0.5rem |
| grain-opacity | 0.035 | 0 | 0 | 0.08 | 0 |
| shadow-tint | primary-rgb | 0,0,0 | primary-rgb | 0,0,0 | 0,0,0 |
| spacing-section | clamp(7rem, 14vw, 12rem) | clamp(4rem, 8vw, 8rem) | clamp(4rem, 10vw, 7rem) | clamp(5rem, 10vw, 9rem) | clamp(3rem, 6vw, 5rem) |
| logo-shape | rounded-rect | circle | circle | sharp-rect | rounded-rect |

---

## Generation Process

1. **Confirm variables** — Verify all required template variables are defined from brand discovery
2. **Create directory** — Build `brand-assets/` with all subdirectories
3. **Write files** — Generate each file by substituting variables into templates below
4. **Report** — Show summary table of generated files
5. **Suggest next steps:**
   - Replace logo placeholders with professional design
   - Run favicon PNG rasterization as a build step if needed
   - Integrate `design-tokens.css` into the project's Tailwind/CSS setup
   - Review brand-guidelines.md with stakeholders

---

## Directory Structure

Create this exact structure:

```
brand-assets/
├── tokens/
│   └── design-tokens.css
├── logo/
│   ├── logo-icon.svg
│   ├── logo-wordmark.svg
│   └── logo-full.svg
├── favicon/
│   ├── favicon.svg
│   └── apple-touch-icon.svg
├── social/
│   ├── og-template.svg
│   └── profile-template.svg
├── css/
│   ├── base.css
│   └── components.css
└── guidelines/
    └── brand-guidelines.md
```

---

## File Templates

### tokens/design-tokens.css

```css
/* {{brand-name}} — Design Tokens
   Generated from brand discovery. Source of truth for all visual decisions.
   Import into Tailwind v4 projects or use :root variables directly. */

@import 'tailwindcss';

@theme {
  /* ── Color: Primary ─────────────────────── */
  --color-primary-50: /* lightest tint — generate from {{color-primary}} */;
  --color-primary-100: ;
  --color-primary-200: ;
  --color-primary-300: ;
  --color-primary-400: ;
  --color-primary-500: {{color-primary}};
  --color-primary-600: ;
  --color-primary-700: ;
  --color-primary-800: ;
  --color-primary-900: ;
  --color-primary-950: ;

  /* ── Color: Accent ──────────────────────── */
  --color-accent: {{color-accent}};
  --color-accent-hover: /* darken 10% */;
  --color-accent-glow: rgba({{color-accent-rgb}}, 0.15);

  /* ── Color: Surfaces ────────────────────── */
  --color-surface: {{color-surface}};
  --color-surface-dark: {{color-surface-dark}};

  /* ── Color: Text ────────────────────────── */
  --color-text: {{color-text}};
  --color-text-light: {{color-text-light}};
  --color-text-muted: /* 50% opacity of text */;

  /* ── Color: Borders ─────────────────────── */
  --color-border: /* 10% opacity of text */;
  --color-border-dark: /* 12% opacity of text-light */;

  /* ── Color: Semantic ────────────────────── */
  --color-success: #4a8c6f;
  --color-error: #c44040;
  --color-warning: #d4a843;

  /* ── Typography ─────────────────────────── */
  --font-heading: {{font-heading-stack}};
  --font-body: {{font-body-stack}};
  --font-mono: '{{font-mono}}', ui-monospace, monospace;

  /* ── Fluid Spacing ──────────────────────── */
  --spacing-section: {{spacing-section}};
  --spacing-container: clamp(1.25rem, 5vw, 4rem);
  --spacing-grid: clamp(1rem, 2.5vw, 2rem);

  /* ── Z-Index ────────────────────────────── */
  --z-base: 1;
  --z-header: 25;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;

  /* ── Border Radius ──────────────────────── */
  --radius-sm: calc({{radius-value}} * 0.5);
  --radius: {{radius-value}};
  --radius-lg: calc({{radius-value}} * 1.67);
  --radius-xl: calc({{radius-value}} * 2);
  --radius-full: 9999px;

  /* ── Shadows (brand-tinted) ─────────────── */
  --shadow-xs: 0 1px 2px rgba({{shadow-tint-rgb}}, 0.03);
  --shadow-sm: 0 2px 4px rgba({{shadow-tint-rgb}}, 0.04);
  --shadow-md: 0 4px 12px rgba({{shadow-tint-rgb}}, 0.06);
  --shadow-lg: 0 8px 24px rgba({{shadow-tint-rgb}}, 0.08);
  --shadow-xl: 0 16px 40px rgba({{shadow-tint-rgb}}, 0.1);

  /* ── Transitions ────────────────────────── */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-default: 300ms;
  --duration-slow: 500ms;
}

/* ── Semantic Token Layer ─────────────────── */
:root {
  --color-text-primary: var(--color-primary-900);
  --color-text-secondary: var(--color-primary-600);
  --color-text-on-dark: var(--color-surface);

  --color-bg-primary: var(--color-surface);
  --color-bg-dark: var(--color-primary-950);
  --color-bg-elevated: #ffffff;

  --color-accent-active: var(--color-accent);
  --color-accent-active-hover: var(--color-accent-hover);
  --color-focus: var(--color-accent);
}
```

**Note to agent:** Generate the full 50-950 shade scale for the primary color. Use HSL manipulation: 50 is very light (95% lightness), 500 is the base, 950 is very dark (10% lightness). Interpolate evenly.

---

### logo/logo-icon.svg

```svg
<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Archetype-appropriate shape -->
  <!-- Modern/Bold: rx="8" | Luxury: rx="20" (circle) | Warm: rx="20" | Authoritative: rx="0" | Professional: rx="8" -->
  <rect width="40" height="40" rx="{{radius-for-logo}}" fill="{{color-primary}}" />
  <text
    x="20" y="27"
    text-anchor="middle"
    font-family="{{font-heading}}"
    font-weight="700"
    font-size="22"
    fill="{{color-text-light}}"
  >{{initial-letter}}</text>
</svg>
```

---

### logo/logo-wordmark.svg

```svg
<svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text
    x="0" y="30"
    font-family="{{font-heading}}"
    font-weight="700"
    font-size="28"
    letter-spacing="-0.02em"
    fill="{{color-text}}"
  >{{brand-name}}</text>
</svg>
```

Adjust viewBox width based on brand name length (~12px per character at font-size 28).

---

### logo/logo-full.svg

```svg
<svg viewBox="0 0 260 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon -->
  <rect width="40" height="40" rx="{{radius-for-logo}}" fill="{{color-primary}}" />
  <text x="20" y="27" text-anchor="middle" font-family="{{font-heading}}" font-weight="700" font-size="22" fill="{{color-text-light}}">{{initial-letter}}</text>

  <!-- Wordmark (offset by icon width + spacing) -->
  <text x="52" y="30" font-family="{{font-heading}}" font-weight="700" font-size="28" letter-spacing="-0.02em" fill="{{color-text}}">{{brand-name}}</text>
</svg>
```

---

### favicon/favicon.svg

```svg
<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="{{radius-for-favicon}}" fill="{{color-primary}}" />
  <text x="16" y="22" text-anchor="middle" font-family="{{font-heading}}" font-weight="700" font-size="18" fill="{{color-text-light}}">{{initial-letter}}</text>
</svg>

<!-- HTML: <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> -->
```

---

### favicon/apple-touch-icon.svg

```svg
<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="{{color-primary}}" />
  <text x="90" y="110" text-anchor="middle" font-family="{{font-heading}}" font-weight="700" font-size="90" fill="{{color-text-light}}">{{initial-letter}}</text>
</svg>
```

---

### social/og-template.svg

```svg
<svg viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="{{color-surface-dark}}" />

  <!-- Gradient overlay (optional, subtle) -->
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="{{color-primary}}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg-grad)" />

  <!-- Logo icon (top-left) -->
  <rect x="60" y="60" width="48" height="48" rx="{{radius-for-logo}}" fill="{{color-accent}}" />
  <text x="84" y="92" text-anchor="middle" font-family="{{font-heading}}" font-weight="700" font-size="26" fill="{{color-text-light}}">{{initial-letter}}</text>

  <!-- Brand name -->
  <text x="60" y="320" font-family="{{font-heading}}" font-weight="700" font-size="64" fill="{{color-text-light}}">{{brand-name}}</text>

  <!-- Tagline -->
  <text x="60" y="380" font-family="{{font-body}}" font-weight="400" font-size="28" fill="{{color-text-light}}" opacity="0.7">{{brand-tagline}}</text>
</svg>
```

---

### social/profile-template.svg

```svg
<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="{{color-primary}}" />
  <text x="200" y="240" text-anchor="middle" font-family="{{font-heading}}" font-weight="700" font-size="160" fill="{{color-text-light}}">{{initial-letter}}</text>
</svg>
```

---

### css/base.css

```css
/* {{brand-name}} — Base Styles */
@import './tokens/design-tokens.css';

/* Fonts — adjust imports based on chosen fonts */
/* @import '@fontsource-variable/{{font-heading-lowercase}}'; */
/* @import '@fontsource-variable/{{font-body-lowercase}}'; */

/* ── Base ─────────────────────────────────── */
html {
  scroll-behavior: smooth;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  line-height: 1.6;
}

/* ── Selection ────────────────────────────── */
::selection {
  background: var(--color-accent-glow);
  color: var(--color-text-primary);
}

/* ── Headings ─────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h1 { font-size: clamp(2.25rem, 1.75rem + 2.5vw, 3.815rem); font-weight: 700; }
h2 { font-size: clamp(1.75rem, 1.4rem + 1.75vw, 2.441rem); font-weight: 600; }
h3 { font-size: clamp(1.375rem, 1.2rem + 0.875vw, 1.953rem); font-weight: 500; }
h4 { font-size: 1.563rem; font-weight: 500; }

p { max-width: 65ch; line-height: 1.65; }

/* ── Links ────────────────────────────────── */
a {
  color: var(--color-accent-active);
  text-decoration-color: transparent;
  transition: color var(--duration-fast) var(--ease-default),
    text-decoration-color var(--duration-fast) var(--ease-default);
}

a:hover {
  color: var(--color-accent-active-hover);
  text-decoration-color: currentColor;
}

/* ── Focus ────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* ── Skip to Content ──────────────────────── */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-text-light);
  font-weight: 600;
  text-decoration: none;
}

.skip-to-content:focus { left: 0; }

/* ── Reduced Motion ───────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### css/components.css

```css
/* {{brand-name}} — Component Library */

/* ── Buttons ──────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0.875rem 2rem;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: all var(--duration-default) var(--ease-out);
  text-decoration: none;
}

.btn-primary {
  background: var(--color-accent-active);
  color: white;
}

.btn-primary:hover {
  background: var(--color-accent-active-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--color-accent-active);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-accent-active);
  background: rgba({{color-accent-rgb}}, 0.05);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
}

.btn-ghost:hover {
  background: var(--color-bg-elevated);
}

@media (prefers-reduced-motion: reduce) {
  .btn-primary:hover { transform: none; }
}

/* ── Cards ────────────────────────────────── */
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: box-shadow var(--duration-default) var(--ease-out),
    transform var(--duration-default) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .card:hover { transform: none; }
}

/* ── Containers ───────────────────────────── */
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

/* ── Section Theming ──────────────────────── */
.section { padding-block: var(--spacing-section); }

.section-dark {
  background: var(--color-bg-dark);
  color: var(--color-text-on-dark);
}

.section-light {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* ── Decorative Elements ──────────────────── */
.accent-line {
  width: 2.5rem;
  height: 2px;
  background: var(--color-accent);
  display: block;
}

.grain-overlay { position: relative; }

.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: {{grain-opacity}};
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  z-index: 1;
}

/* ── Fluid Typography ─────────────────────── */
.text-hero {
  font-family: var(--font-heading);
  font-size: clamp(2.75rem, 2rem + 5vw, 7rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.text-h1 {
  font-family: var(--font-heading);
  font-size: clamp(2.25rem, 1.5rem + 3.5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.025em;
}

.text-h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 1.25rem + 2vw, 3rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.text-body {
  font-family: var(--font-body);
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.75;
}

.text-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 400;
}
```

---

### guidelines/brand-guidelines.md

Generate this as a complete document substituting all brand values:

```markdown
# {{brand-name}} — Brand Guidelines

## Brand Story

**Name:** {{brand-name}}
**Tagline:** {{brand-tagline}}
**Archetype:** {{archetype}}

### Positioning

[Substitute the "Only ___" positioning statement from discovery]

### Target Audience

[Substitute from discovery]

---

## Visual Identity

### Logo

The {{brand-name}} logo consists of three variations:

- **Full logo** (logo-full.svg) — Icon + wordmark. Use on website headers, marketing materials.
- **Icon** (logo-icon.svg) — Lettermark only. Use for favicon, app icon, social avatars.
- **Wordmark** (logo-wordmark.svg) — Text only. Use inline where icon doesn't fit.

**These are placeholder logos.** Replace with professional design while maintaining the brand colors and personality.

### Logo Usage Rules

- Maintain clear space equal to the icon height on all sides
- Minimum size: 80px width (full), 24px (icon)
- Approved backgrounds: {{color-surface}}, {{color-surface-dark}}, white
- Never rotate, distort, add effects, or change colors outside approved variations

---

## Color Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | {{color-primary}} | {{color-primary-rgb}} | Brand identity, headings on dark |
| Accent | {{color-accent}} | {{color-accent-rgb}} | CTAs, links, interactive elements |
| Surface | {{color-surface}} | — | Primary background |
| Surface Dark | {{color-surface-dark}} | — | Dark sections, footer |
| Text | {{color-text}} | — | Body copy, headings |
| Text Light | {{color-text-light}} | — | Text on dark backgrounds |

Full shade scales (50-950) defined in `tokens/design-tokens.css`.

---

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | {{font-heading}} | 600-700 | h1-h4, hero text, display |
| Body | {{font-body}} | 400-500 | Paragraphs, UI text, labels |
| Mono | {{font-mono}} | 400 | Code, technical labels |

### Type Scale

- Hero: clamp(2.75rem, 2rem + 5vw, 7rem)
- H1: clamp(2.25rem, 1.5rem + 3.5vw, 4.5rem)
- H2: clamp(1.75rem, 1.25rem + 2vw, 3rem)
- Body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)

---

## Voice & Tone

**Formality:** {{voice-formality}}
**Energy:** {{voice-energy}}

### Example Copy

- **Headline:** {{headline-example}}
- **CTA:** {{cta-example}}

[Include full 4-dimension voice chart from discovery Phase 4]

---

## Spacing & Layout

- Section spacing: {{spacing-section}}
- Container max-width: 1440px
- Grid gap: clamp(1rem, 2.5vw, 2rem)
- Base unit: 8px

---

## Do / Don't

### Do
- Use design tokens from design-tokens.css (never hardcode values)
- Follow the type scale (don't invent new sizes)
- Maintain brand-tinted shadows
- Include prefers-reduced-motion handling on all animations

### Don't
- Use more than 2 font families
- Animate width, height, margin, or padding
- Use color as the only means of conveying information
- Skip focus styles on interactive elements
```

---

## After Generation

Report to the user:

```
Brand package generated in brand-assets/:

| File | Purpose |
|------|---------|
| tokens/design-tokens.css | Tailwind v4 @theme + semantic tokens |
| logo/logo-icon.svg | Lettermark placeholder |
| logo/logo-wordmark.svg | Wordmark placeholder |
| logo/logo-full.svg | Combination mark placeholder |
| favicon/favicon.svg | SVG favicon |
| favicon/apple-touch-icon.svg | Apple touch icon |
| social/og-template.svg | Open Graph image (1200x630) |
| social/profile-template.svg | Social profile image (400x400) |
| css/base.css | Base styles, headings, links, focus, reduced motion |
| css/components.css | Buttons, cards, containers, sections, grain overlay |
| guidelines/brand-guidelines.md | Complete brand documentation |

Next steps:
1. Replace logo placeholders with professional design
2. Install fonts: npm install @fontsource-variable/{{font-body-lowercase}} @fontsource-variable/{{font-heading-lowercase}}
3. Import design-tokens.css into your project
4. Review brand-guidelines.md with stakeholders
```
