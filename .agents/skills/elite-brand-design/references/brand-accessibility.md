# Brand Accessibility

An inclusive brand serves all users. Accessibility isn't a constraint on brand expression — it's a quality signal.

## Table of Contents

1. [Color Contrast](#color-contrast)
2. [Cognitive Load](#cognitive-load)
3. [Cultural Sensitivity](#cultural-sensitivity)
4. [Accessible Motion Language](#accessible-motion-language)

---

## Color Contrast

### Design Contrast In From the Start

Don't pick colors then test for contrast — build contrast into the palette:

1. Start with your 50-950 shade scale
2. Test the intended background/foreground pairs immediately
3. Ensure body text achieves 4.5:1 (WCAG AA) minimum
4. Ensure large text achieves 3:1 minimum
5. Ensure interactive elements (links, buttons) are distinguishable

### Common Traps

- **Light grey text on white**: Looks elegant, fails contrast. Use 600+ shade for body text on light backgrounds.
- **Brand color as text**: Many brand accent colors fail contrast as text colors. Use them for backgrounds or large display text only.
- **Pure black on pure white**: Technically high contrast but optically harsh. Off-white (#fafafa) on near-black (#1a1a1a) is softer and still exceeds requirements.

---

## Cognitive Load

### Simplicity as Inclusivity

- **Maximum 2 font families** — Reduces cognitive processing
- **Consistent visual hierarchy** — Predictable structure helps everyone, especially users with cognitive disabilities
- **Clear labels** — Don't sacrifice clarity for brand personality. A clever button label that confuses is worse than a clear one.
- **Adequate spacing** — Crowded layouts increase cognitive burden
- **Line length 45-75 characters** — Optimal for reading comprehension

### Text Readability

```css
p {
  max-width: 65ch;
  line-height: 1.65;
  text-wrap: balance; /* for headings */
}
```

---

## Cultural Sensitivity

- **Color meaning varies by culture** — Red means luck in China, danger in the West
- **Imagery assumptions** — Ensure photography represents your actual audience
- **Name/language** — Test brand names for unintended meanings in other languages
- **Symbols** — Icons that seem universal may not be (e.g., mailbox shape, telephone handset)

---

## Accessible Motion Language

Brand motion should respect user preferences:

- Always provide `prefers-reduced-motion` alternatives
- Logo animations should have a static fallback
- Essential information should never be conveyed only through animation
- Consider vestibular disorders — large-scale motion and parallax can cause nausea

→ See **elite-accessibility** for comprehensive motion accessibility patterns.
