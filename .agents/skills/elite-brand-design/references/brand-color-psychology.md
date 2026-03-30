# Brand Color Psychology

Color is the fastest brand signal — people form color-based impressions in 90 seconds.

## Table of Contents

1. [Color Meaning](#color-meaning)
2. [Palette Building from Personality](#palette-building-from-personality)
3. [The 60-30-10 Rule](#the-60-30-10-rule)
4. [Building a Full-Shade Scale](#building-a-full-shade-scale)
5. [Dark Mode Translation](#dark-mode-translation)
6. [Category Color Coding](#category-color-coding)

---

## Color Meaning

Colors carry cultural associations. These are Western defaults — research your audience's cultural context.

| Color | Associations | Brand Use |
|-------|-------------|-----------|
| **Blue** | Trust, stability, professionalism | Finance, healthcare, tech |
| **Navy/Midnight** | Authority, depth, seriousness | Legal, luxury, corporate |
| **Green/Sage** | Growth, health, nature, calm | Wellness, sustainability, finance |
| **Gold** | Premium, achievement, warmth | Luxury, legal, awards |
| **Coral/Orange** | Energy, creativity, warmth | Creative studios, youth, food |
| **Plum/Purple** | Wisdom, calm, creativity | Wellness, luxury, education |
| **Red** | Urgency, passion, energy | Sales, food, entertainment |
| **Black** | Sophistication, power, luxury | Fashion, tech, luxury |
| **White/Cream** | Purity, simplicity, space | Healthcare, minimalist brands |

---

## Palette Building from Personality

### Step 1: Choose a Primary

Your primary color is the one most associated with your brand. It should reflect your core personality trait:

- **Confident/Bold** → Saturated, high-energy (coral #f97316, lime #D5FA71)
- **Refined/Luxury** → Warm, muted metallics (Arabian gold #b8956a)
- **Warm/Inclusive** → Soft, expanded (plum #5f5289 as base, not as single color)
- **Authoritative** → Traditional power (navy #1E3A5F, gold #C9A84C)
- **Professional** → Clean, functional (teal, slate, or warm grey)

### Step 2: Build Supporting Colors

Each supporting color should have a purpose:

- **Secondary**: Complements primary for variety
- **Accent**: Calls to action, highlights — used sparingly
- **Neutral**: Text, borders, backgrounds — the workhorse
- **Semantic**: Success (green), error (red), warning (amber)

### Step 3: Map to Intent

*Mental health clinic example — each color family carries meaning:*
- **Plum**: Primary brand — wisdom, depth, calm
- **Lavender**: Decorative accent — softness, serenity
- **Sage**: Secondary accent — growth, healing
- **Rose**: Warm accent — empathy, human connection
- **Neutral**: Warm-tinted greys (not pure grey — avoids clinical coldness)

---

## The 60-30-10 Rule

- **60%**: Dominant surface (background) — sets the baseline mood
- **30%**: Supporting elements (cards, sections) — creates rhythm
- **10%**: Accent (CTAs, highlights) — drives attention

In practice:
- 60% cream/white → calm, spacious feel
- 30% cards, sections with subtle background shift
- 10% plum/gold/coral CTAs — the eye goes here first

---

## Building a Full-Shade Scale

A production-grade palette needs 10-12 shades per color family:

```
50   — Lightest tint (backgrounds, subtle fills)
100  — Light tint (tag backgrounds, hover fills)
200  — Light (borders, dividers)
300  — Medium-light (disabled states)
400  — Medium (secondary icons)
500  — Base (standalone use, secondary text)
600  — Medium-dark (primary buttons, links)
700  — Dark (hover states for buttons)
800  — Darker (headings, high emphasis)
900  — Darkest (primary text)
950  — Maximum (near-black alternative)
```

Tools to generate consistent scales from a base color:
- **Tailwind CSS Color Generator** (uicolors.app)
- **Leonardo** (leonardocolor.io) — perceptually uniform scales
- **Radix Colors** — accessible by default

---

## Dark Mode Translation

Dark mode isn't inverting colors. It's remapping the same brand to a dark surface:

1. **Background**: 950 shade (near-black with brand tint)
2. **Elevated surfaces**: 900 shade (slightly lighter = higher elevation)
3. **Text**: 50-100 shade (off-white, not pure white)
4. **Accent**: Shift lighter (600 → 400) for sufficient contrast on dark
5. **Borders**: Low-opacity white (rgba(255, 255, 255, 0.12))

The brand should still feel like the same brand — just in a different light.

---

## Category Color Coding

When products or services have distinct categories, assign each a unique hue for instant visual grouping:

*Fragrance e-commerce example:*
- Citrus → warm yellow (#d4a843)
- Floral → soft pink (#c47088)
- Woody → warm brown (#8b6e4e)
- Oriental → rich amber (#b85c3e)
- Fresh → cool teal (#5e9e9b)

This works for any taxonomy: blog categories, service tiers, team departments, product lines. The semantic connection between color and content builds faster mental models.

→ See **elite-design-core/color-theory.md** for token implementation.
