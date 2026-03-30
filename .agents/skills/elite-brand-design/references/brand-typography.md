# Brand Typography

Type is voice made visible. Before selecting fonts, understand what different typefaces communicate.

## Table of Contents

1. [Type as Voice](#type-as-voice)
2. [Weight as Expression](#weight-as-expression)
3. [Pairing Strategy](#pairing-strategy)
4. [Five Archetype Pairings](#five-archetype-pairings)
5. [Variable Fonts for Brand Expression](#variable-fonts-for-brand-expression)

---

## Type as Voice

### What Font Classes Communicate

| Class | Feel | Signal |
|-------|------|--------|
| **Geometric Sans** (Space Grotesk, Outfit) | Modern, precise, technical | "We're forward-thinking" |
| **Humanist Sans** (Inter, DM Sans) | Friendly, readable, neutral | "We're approachable" |
| **Transitional Serif** (Gelasio, Georgia) | Established, trustworthy | "We're serious" |
| **Display Serif** (Fraunces, Cormorant) | Editorial, expressive, premium | "We're distinctive" |
| **Monospace** (JetBrains Mono) | Technical, precise, code | "We're detail-oriented" |

### The Personality Test

Read your brand's key message in three different fonts. Which one *sounds* right? Typography is auditory before it's visual — you hear the tone before you see the shape.

---

## Weight as Expression

Font weight controls intensity:

- **Light (300)**: Elegant, delicate — luxury, fashion
- **Regular (400)**: Neutral, readable — body text default
- **Medium (500)**: Slightly assertive — subheadings, UI
- **Semibold (600)**: Confident — section headings
- **Bold (700)**: Commanding — hero headlines, CTAs

A brand that uses 700 for hero text and 400 for body creates strong hierarchy. A brand that uses 500 and 400 creates subtle, quiet hierarchy.

---

## Pairing Strategy

### The Contrast Principle

Pair fonts with clear contrast. Similar fonts create confusion; contrasting fonts create harmony.

**Effective contrasts:**
- Serif display + Sans body (most common, reliable)
- Geometric + Humanist (both sans, but different personalities)
- Display weight + Text weight (same family, different roles)

**Avoid:**
- Two serif fonts (unless from the same superfamily)
- Two geometric sans (they blur together)
- Fonts that are "almost the same"

### The Two-Family Rule

Maximum two font families per brand. Three functional roles:
1. **Display** — Headlines, hero text (personality carrier)
2. **Body** — Paragraphs, UI text (clarity carrier)
3. **Accent** — Mono labels, pull quotes (optional, can be from family 1 or 2)

---

## Five Archetype Pairings

### Space Grotesk + Inter = "Technical Confidence"

Space Grotesk's geometric shapes with Inter's humanist readability. The display font says "we know what we're doing"; the body font says "and we'll explain it clearly."

Tight letter-spacing on display (-0.03em) creates density. Mono labels with wide tracking (0.15em) provide rhythmic counterpoint.

### Cormorant Garamond + Poppins = "Refined Accessibility"

Cormorant's thin, high-contrast strokes evoke luxury. Poppins' geometric friendliness ensures readability without competing with the serif's elegance. The italic variant of Cormorant as an accent font adds editorial flair.

### Fraunces + Inter = "Warm Editorial"

Fraunces is a variable font with optical size, wonkiness, and softness axes. Setting `SOFT: 50` literally rounds the letterforms — the typography itself communicates safety and warmth. Inter provides clinical clarity for body text.

### Gelasio + Inter = "Formal Authority"

Gelasio's sturdy serifs project permanence and weight. Combined with sharp corners and navy/gold colors, the type reinforces "take me seriously." Inter handles body text so the serif doesn't fatigue readers in long passages.

### DM Serif Display + DM Sans = "Approachable Expertise"

Built to pair. From the same type family, these fonts share skeletal structure but differ in personality. The serif adds warmth for headings; the sans provides everyday clarity. Zero tension between them.

---

## Variable Fonts for Brand Expression

Variable fonts enable continuous control over typography axes:

```
font-variation-settings: 'opsz' 32, 'WONK' 0, 'SOFT' 50;
```

| Axis | What It Controls | Brand Use |
|------|-----------------|-----------|
| `wght` | Weight (100-900) | Precise hierarchy without loading multiple files |
| `opsz` | Optical size | Optimizes letterforms for display vs text sizes |
| `WONK` | Quirkiness | 0 = neutral, 1 = characterful |
| `SOFT` | Softness | 0 = sharp, 100 = fully rounded |
| `wdth` | Width | Condensed to expanded for responsive layouts |

Variable fonts are one file covering all weights and axes, making them both more expressive and more performant than static fonts.

→ See **elite-design-core/typography.md** for type scale implementation.
