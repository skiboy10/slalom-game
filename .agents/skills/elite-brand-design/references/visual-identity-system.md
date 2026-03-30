# Visual Identity System

The visible elements that carry your brand across every touchpoint.

## Table of Contents

1. [Logo Architecture](#logo-architecture)
2. [Logo Usage Rules](#logo-usage-rules)
3. [Pattern & Texture as Brand](#pattern--texture-as-brand)
4. [Imagery Direction](#imagery-direction)
5. [Icon System](#icon-system)

---

## Logo Architecture

### Types

| Type | Description | When to Use |
|------|-------------|-------------|
| **Wordmark** | Brand name in custom typography | When the name itself is distinctive |
| **Symbol/Mark** | Abstract or pictorial icon | When the brand is well-established |
| **Combination** | Symbol + wordmark together | Most versatile — works at all sizes |
| **Lettermark** | Initials only | When the name is long or complex |

### Logo Variations

A complete logo system includes:

1. **Primary** — Full combination mark (symbol + wordmark)
2. **Secondary** — Stacked or horizontal variant
3. **Icon** — Symbol only (for small spaces: favicon, app icon, social avatar)
4. **Wordmark** — Text only (for in-line usage, headers)

### Responsive Logo Behavior

Logo should adapt to context:
- **Desktop header**: Full combination mark
- **Mobile header**: Icon + abbreviated wordmark
- **Favicon**: Icon only, simplified (16×16 must be legible)
- **Social avatar**: Icon on brand background, centered

---

## Logo Usage Rules

### Clear Space

Define minimum clear space as a proportion of the logo (e.g., the height of the logo's "x" letter). No other elements within this zone.

### Minimum Size

Set a minimum display size below which the logo becomes illegible. Typically:
- **Print**: 25mm wide
- **Digital**: 80px wide (combination), 24px (icon only)

### Backgrounds

Define approved background combinations:
- Logo on primary brand color
- Logo on white/light
- Logo on dark/black
- Monochrome versions (all-white, all-black) for constrained contexts

### Don'ts

- Don't stretch or distort
- Don't rotate
- Don't change the colors outside approved variations
- Don't add effects (shadows, gradients, outlines)
- Don't place on busy/low-contrast backgrounds

---

## Pattern & Texture as Brand

Subtle textures create depth and signal quality:

**Grain/Noise overlay** — Adds film-like sophistication. Used by both modern studios (subtle, opacity 0.035) and editorial sites (moderate, opacity 0.08). The feTurbulence SVG pattern creates GPU-friendly, resolution-independent grain. → See **elite-design-core/design-tokens.md** for implementation.

**Geometric patterns** — Repeating shapes that echo the logo or brand mark. Work as section backgrounds, card fills, or loading states.

**Color wash** — Gradient overlays using brand colors. Unify photography with brand palette.

---

## Imagery Direction

### Photography Style

Define the brand's photography guidelines:
- **Lighting**: Bright/natural vs moody/dramatic
- **Color treatment**: Warm/cool, saturated/muted
- **Composition**: Centered/symmetric vs dynamic/off-center
- **Subjects**: Lifestyle vs product vs abstract
- **Post-processing**: Minimal vs stylized

### Illustration vs Photography

| Context | Photography | Illustration |
|---------|-------------|-------------|
| Trust-building (healthcare, legal) | Strong choice — real faces build trust | Can feel impersonal |
| Conceptual content (tech, SaaS) | Stock photos feel generic | Custom illustration differentiates |
| Luxury/lifestyle | Essential for aspiration | Feels too casual |
| Warmth/approachability | Works if authentic | Works if style matches brand |

---

## Icon System

### Consistency Rules

- Consistent stroke weight across all icons
- Same corner radius as brand (rounded vs sharp)
- Single color or two-tone (primary + accent)
- Consistent size grid (24×24 or 20×20 base)
- Visual weight should feel even across the set

### Icon as Brand Expression

Icons carry brand personality:
- **Modern/Bold**: Geometric, filled, sharp angles
- **Warm/Inclusive**: Rounded, stroke-only, generous corners
- **Authoritative**: Clean, minimal, uniform stroke
- **Luxury**: Thin strokes, elegant curves, less dense
