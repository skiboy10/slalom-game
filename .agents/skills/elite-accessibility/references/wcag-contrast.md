# WCAG Contrast

Color contrast requirements for accessible design.

## Table of Contents

1. [WCAG Requirements](#wcag-requirements)
2. [APCA (New Standard)](#apca-new-standard)
3. [Testing Tools](#testing-tools)
4. [Safe Color Combinations](#safe-color-combinations)
5. [Common Issues](#common-issues)

---

## WCAG Requirements

### Contrast Ratios

| Content Type | Level AA | Level AAA |
|--------------|----------|-----------|
| Normal text (<18px) | 4.5:1 | 7:1 |
| Large text (≥18px or ≥14px bold) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | 3:1 |
| Focus indicators | 3:1 | 3:1 |

### What Counts as "Large Text"

- 18px (14pt) and above at regular weight
- 14px (11pt) and above at bold weight (700+)

### What's Exempt

- Logos and decorative text
- Disabled UI components
- Incidental text in images (not meant to convey info)

---

## APCA (New Standard)

APCA (Advanced Perceptual Contrast Algorithm) is replacing WCAG 2.x contrast. It's more accurate for modern displays.

### APCA Values

| Use Case | Minimum Lc |
|----------|------------|
| Body text (400 weight) | Lc 75 |
| Bold body text (700) | Lc 60 |
| Large headlines | Lc 45-60 |
| Placeholder text | Lc 60 |
| Disabled text | Lc 30-45 |

### Key Differences from WCAG

1. **Polarity matters** - Dark text on light is different from light on dark
2. **Font weight matters** - Bolder text needs less contrast
3. **Size matters more** - Larger text needs less contrast
4. **More accurate** - Based on modern display technology

### When to Use APCA

- For internal/modern projects targeting 2026+ browsers
- When WCAG produces obviously wrong results
- When fine-tuning contrast for optimal readability

Use WCAG for:
- Legal compliance requirements
- Broad compatibility
- When in doubt

---

## Testing Tools

### Browser Extensions

- **axe DevTools** - Comprehensive accessibility testing
- **WAVE** - Visual overlay showing issues
- **Stark** - Design-focused contrast checker
- **Contrast** - macOS menu bar app

### Online Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- [APCA Calculator](https://www.myndex.com/APCA/)
- [Colour Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Chrome DevTools

1. Open DevTools → Elements panel
2. Click on a text element
3. Look at the color property
4. Click the color square
5. See "Contrast ratio" in the color picker

### Automated Testing

```javascript
// Using axe-core
import axe from 'axe-core';

axe.run(document, {
  rules: ['color-contrast']
}).then(results => {
  console.log(results.violations);
});
```

---

## Safe Color Combinations

### Light Backgrounds

```css
/* On white (#ffffff) background */

/* Text - All pass AAA */
--text-primary: #171717;     /* 18.2:1 ✓ AAA */
--text-secondary: #404040;   /* 9.0:1 ✓ AAA */
--text-muted: #525252;       /* 7.5:1 ✓ AAA */
--text-subtle: #737373;      /* 4.6:1 ✓ AA */

/* Interactive */
--link: #1d4ed8;             /* 8.6:1 ✓ AAA */
--link-hover: #1e40af;       /* 9.5:1 ✓ AAA */

/* Buttons - Check both text and background */
--btn-primary-bg: #2563eb;   /* 4.5:1 with white text ✓ AA */
--btn-primary-text: #ffffff;
```

### Dark Backgrounds

```css
/* On near-black (#0a0a0a) background */

/* Text - All pass AAA */
--text-primary: #fafafa;     /* 18.9:1 ✓ AAA */
--text-secondary: #d4d4d4;   /* 11.7:1 ✓ AAA */
--text-muted: #a3a3a3;       /* 7.0:1 ✓ AAA */
--text-subtle: #737373;      /* 4.5:1 ✓ AA */

/* Interactive - need lighter versions */
--link: #60a5fa;             /* 7.3:1 ✓ AAA */
--link-hover: #93c5fd;       /* 10.1:1 ✓ AAA */

/* Buttons */
--btn-primary-bg: #3b82f6;   /* 5.1:1 with white text ✓ AA */
--btn-primary-text: #ffffff;
```

### Colored Backgrounds

```css
/* On blue (#2563eb) background */
--text-on-blue: #ffffff;     /* 4.5:1 ✓ AA */

/* On accent backgrounds, prefer white or very dark text */
/* Test each combination individually */
```

---

## Common Issues

### Issue 1: Placeholder Text Too Light

```css
/* BAD - Fails contrast */
input::placeholder {
  color: #c0c0c0;  /* ~2.5:1 on white - FAIL */
}

/* GOOD - Passes AA */
input::placeholder {
  color: #757575;  /* 4.6:1 on white - PASS */
}
```

### Issue 2: Disabled State Still Needs Some Contrast

```css
/* BAD - Completely invisible */
button:disabled {
  color: #e0e0e0;
  background: #f0f0f0;  /* ~1.1:1 - too low */
}

/* GOOD - Clearly disabled but readable */
button:disabled {
  color: #9e9e9e;
  background: #f5f5f5;  /* ~2.5:1 - acceptable for disabled */
}
```

### Issue 3: Focus Indicators Too Subtle

```css
/* BAD - Hard to see */
:focus {
  outline: 1px solid #93c5fd;  /* Light blue, low contrast */
}

/* GOOD - Clearly visible */
:focus-visible {
  outline: 2px solid #2563eb;  /* Strong blue, 4.5:1+ */
  outline-offset: 2px;
}
```

### Issue 4: Text Over Images

```css
/* BAD - No protection */
.hero-text {
  color: white;
  /* On complex image, contrast varies */
}

/* GOOD - Overlay protection */
.hero {
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}

.hero-text {
  position: relative;
  z-index: 1;
  color: white;  /* Now has consistent contrast */
}
```

### Issue 5: Link Color Same as Text

```css
/* BAD - Links indistinguishable */
a {
  color: #333;  /* Same as body text */
  text-decoration: none;
}

/* GOOD - Links clearly different */
a {
  color: #1d4ed8;  /* Distinct color */
  text-decoration: underline;  /* Or use underline */
}

/* If removing underline, must have 3:1 contrast with surrounding text */
a {
  color: #1d4ed8;  /* Distinct enough from #333 body text */
  text-decoration: none;
}
a:hover {
  text-decoration: underline;  /* Show on hover */
}
```

---

## Quick Reference Card

```
WCAG AA Minimum Ratios:
├── Normal text: 4.5:1
├── Large text (18px+ or 14px+ bold): 3:1
├── UI components: 3:1
└── Focus indicators: 3:1

Safe grays on white:
├── #171717 (18.2:1) - Primary text
├── #404040 (9.0:1) - Secondary text
├── #525252 (7.5:1) - Muted text
└── #737373 (4.6:1) - Subtle/large text only

Safe grays on black:
├── #fafafa (18.9:1) - Primary text
├── #d4d4d4 (11.7:1) - Secondary text
├── #a3a3a3 (7.0:1) - Muted text
└── #737373 (4.5:1) - Subtle/large text only
```

---

## Checklist

- [ ] All body text meets 4.5:1 contrast ratio
- [ ] All large text meets 3:1 contrast ratio
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Links are distinguishable from surrounding text
- [ ] Form placeholders meet minimum contrast
- [ ] Text over images has consistent contrast
- [ ] Tested with automated tools (axe, WAVE)
- [ ] Tested manually with color contrast checkers

---

## Additional Accessibility Rules

Rules that complement contrast requirements for a fully accessible interface.

### Alt Text

```html
<!-- Meaningful image: descriptive alt -->
<img src="team-photo.jpg" alt="Our team of five designers collaborating at a whiteboard" />

<!-- Decorative image: empty alt -->
<img src="decorative-wave.svg" alt="" />

<!-- Icon in button: button has label, icon is decorative -->
<button aria-label="Close dialog">
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>
```

Rule: If removing the image would lose information, it needs descriptive alt text. If it's decorative, use `alt=""` and optionally `aria-hidden="true"`.

### Color Not Only

Never convey information by color alone — always supplement with icon, text, or pattern:

```html
<!-- BAD: Color-only status -->
<span class="dot-green"></span>

<!-- GOOD: Color + text -->
<span class="status status-success">
  <svg aria-hidden="true"><!-- checkmark --></svg>
  Active
</span>

<!-- GOOD: Color + pattern (for charts) -->
<!-- Use stripes, dots, or crosshatch in addition to color -->
```

### Escape Routes

Every overlay, modal, and multi-step flow must provide escape:

- **Escape key** closes modals and popovers
- **Click outside** (on scrim) dismisses overlays
- **Visible close button** always present
- **Back navigation** in multi-step flows
- **Swipe-down to dismiss** on mobile sheets

### Dynamic Type / Text Scaling

Support system text scaling without layout breakage:

- Use `rem`/`em` units, never `px` for text sizes
- Test at 200% text zoom (WCAG requirement)
- Avoid `overflow: hidden` on text containers (allows truncation at large sizes)
- Use `clamp()` for fluid sizing that still scales with user preferences
- Avoid fixed-height containers for text content

### Heading Hierarchy

Sequential h1→h6, no level skips:

```html
<!-- GOOD -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

<!-- BAD: Skipping h2 -->
<h1>Page Title</h1>
  <h3>Subsection</h3>
```

Screen readers use heading levels for page navigation — skipping levels breaks this landmark system.

### aria-live for Dynamic Content

```html
<!-- Error messages that appear after user action -->
<p id="email-error" aria-live="polite" role="alert">
  Please enter a valid email address
</p>

<!-- Live updating content (stock prices, notifications) -->
<div aria-live="polite" aria-atomic="true">
  Updated: 3 new messages
</div>
```

- `aria-live="polite"` — Waits for user to finish current task before announcing
- `aria-live="assertive"` — Interrupts immediately (use sparingly, only for critical alerts)
- `role="alert"` — Equivalent to `aria-live="assertive"` with `aria-atomic="true"`
