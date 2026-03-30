# Brand Touchpoints

Every interaction is a brand moment. Consistency across touchpoints builds recognition and trust.

## Table of Contents

1. [Digital Touchpoints](#digital-touchpoints)
2. [Social & Meta](#social--meta)
3. [Brand in Code](#brand-in-code)

---

## Digital Touchpoints

### Favicon

- Must be legible at 16×16 pixels
- Simplify the logo to its most essential form
- Test on both light and dark browser tabs
- Provide multiple sizes: 16×16, 32×32, 180×180 (Apple touch), 512×512 (PWA)

### Social Media Images

| Platform | Size | Content |
|----------|------|---------|
| Open Graph | 1200×630 | Feature image with logo and brief text |
| Twitter Card | 1200×628 | Similar to OG, test in card validator |
| LinkedIn | 1200×627 | Professional variant |
| Instagram | 1080×1080 | Visual-first, minimal text |

All should feel immediately recognizable as the same brand.

### Email Templates

- Use brand fonts (or web-safe fallbacks for email clients)
- Maintain color tokens
- Consistent header/footer structure
- Match the verbal tone of the website

---

## Social & Meta

### Open Graph Tags

```html
<meta property="og:title" content="Brand Name — Tagline" />
<meta property="og:description" content="Brand positioning statement" />
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
```

The OG image is often the first visual brand impression. Invest in it.

---

## Brand in Code

Subtle code-level details that reinforce brand:

### Selection Color

```css
::selection {
  background: var(--color-accent-light);
  color: var(--color-text-primary);
}
```

### Custom Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--color-bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--color-neutral-400); border-radius: 4px; }
```

### Focus Rings

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Brand-tinted focus rings (using the accent color instead of browser default blue) maintain brand consistency even in keyboard navigation.

### Loading States

Loading skeletons, spinners, and progress bars are brand moments. Use brand colors and match the animation easing to the brand's motion language.

→ See **elite-css-animations** for skeleton shimmer patterns.
