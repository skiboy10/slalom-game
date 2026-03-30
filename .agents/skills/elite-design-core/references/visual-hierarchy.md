# Visual Hierarchy

Visual hierarchy determines how users scan and understand content. It's the invisible architecture that makes design feel "professional" or "amateur."

## Table of Contents

1. [The 3-Second Rule](#the-3-second-rule)
2. [Hierarchy Techniques](#hierarchy-techniques)
3. [Contrast Relationships](#contrast-relationships)
4. [Spatial Grouping](#spatial-grouping)
5. [Motion as Hierarchy](#motion-as-hierarchy)
6. [Common Mistakes](#common-mistakes)

---

## The 3-Second Rule

In the first 3 seconds, users should understand:
1. What this site/section is about
2. What they can do here
3. Where to look first

Test hierarchy by squinting at your design. What stands out? That should be your primary message.

---

## Hierarchy Techniques

### Scale Contrast

Size is the most powerful hierarchy tool. Larger = more important.

```css
/* Effective scale ratios */
.hero-headline { font-size: var(--text-5xl); }  /* 61px - commands attention */
.section-title { font-size: var(--text-3xl); }  /* 39px - clearly secondary */
.card-title { font-size: var(--text-xl); }      /* 25px - tertiary */
.body-text { font-size: var(--text-base); }     /* 16px - recedes */
.caption { font-size: var(--text-sm); }         /* 14px - supporting info */
```

**Rule of thumb:** Each hierarchy level should be at least 1.25x the size of the next level down.

### Weight Contrast

Font weight creates hierarchy without changing size.

```css
.primary-heading {
  font-weight: 700;  /* Bold - strong emphasis */
}

.secondary-heading {
  font-weight: 600;  /* Semi-bold - moderate emphasis */
}

.body-text {
  font-weight: 400;  /* Regular - neutral */
}

.supporting-text {
  font-weight: 400;
  color: var(--color-text-secondary);  /* Weight + color for receding */
}
```

**Best practice:** Combine weight with color. Don't rely on weight alone - differences can be subtle.

### Color/Saturation Contrast

Color draws attention. Use strategically.

```css
/* Hierarchy through color */
.primary-cta {
  background: var(--color-accent);  /* Highest saturation - primary action */
  color: white;
}

.secondary-cta {
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);  /* Lower visual weight */
}

.tertiary-link {
  color: var(--color-text-secondary);  /* Minimal visual weight */
  text-decoration: underline;
}
```

**Principle:** Reserve high-saturation colors for primary actions. Everything else should be neutral.

### Positioning

Position influences importance perception.

```
Importance perception by position:

┌────────────────────────────┐
│  HIGH         HIGH         │  ← Top of viewport
│  importance   importance   │
│                            │
│  MEDIUM       MEDIUM       │
│                            │
│  LOWER        LOWER        │  ← Below fold
│  (requires scroll)         │
└────────────────────────────┘

Left-to-right reading cultures: top-left is prime real estate
```

**Exception:** A large element lower on the page can outrank a small element higher up. Position + size together determine hierarchy.

---

## Contrast Relationships

### The 60-30-10 Rule

Distribute visual weight across your design:
- **60%** - Dominant color/element (background, primary surfaces)
- **30%** - Secondary color/element (cards, sections)
- **10%** - Accent color/element (CTAs, highlights)

```css
:root {
  /* 60% - Dominant */
  --color-bg-primary: #ffffff;

  /* 30% - Secondary */
  --color-bg-secondary: #f5f5f5;

  /* 10% - Accent */
  --color-accent: #2563eb;
}
```

### Squint Test

Blur your vision or step back from the screen. You should still see:
1. Clear primary element
2. Logical groupings
3. Visual flow direction

If everything blurs together, hierarchy is too flat.

### Hierarchy Levels

Most designs need 4-5 hierarchy levels:

| Level | Purpose | Example |
|-------|---------|---------|
| 1 | Primary focus | Hero headline, main CTA |
| 2 | Section anchors | Section titles |
| 3 | Content groups | Card titles, feature names |
| 4 | Body content | Paragraphs, descriptions |
| 5 | Supporting | Captions, metadata |

More than 5 levels creates confusion. Fewer than 3 is too flat.

---

## Spatial Grouping

### Proximity Principle

Elements close together are perceived as related.

```css
/* Card with proper grouping */
.card {
  padding: var(--space-6);  /* 24px internal padding */
}

.card-title {
  margin-bottom: var(--space-2);  /* 8px - tight to description */
}

.card-description {
  margin-bottom: var(--space-4);  /* 16px - grouped with title */
}

.card-meta {
  margin-top: var(--space-4);  /* 16px - separated from main content */
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);  /* Visual separator */
}
```

### White Space Hierarchy

More space = more separation = different group.

```css
/* Section spacing creates hierarchy */
section {
  padding-block: var(--space-24);  /* 96px - major separation */
}

.section-header {
  margin-bottom: var(--space-12);  /* 48px - header separate from content */
}

.content-group {
  margin-bottom: var(--space-8);  /* 32px - between content groups */
}

.content-item {
  margin-bottom: var(--space-4);  /* 16px - between related items */
}
```

### Visual Containers

Group related content with subtle containers:

```css
.content-group {
  /* Option 1: Background color */
  background: var(--color-bg-secondary);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.content-group {
  /* Option 2: Border */
  border: 1px solid var(--color-border);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.content-group {
  /* Option 3: Shadow (use sparingly) */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}
```

---

## Motion as Hierarchy

Animation draws attention. Use it to establish hierarchy.

### Stagger Reveals

Reveal order indicates importance:

```javascript
// First element revealed = most important
gsap.from('.hero-content', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  stagger: 0.15,  // Each child 150ms after previous
  ease: 'power3.out'
});
```

### Attention Through Motion

Moving elements attract attention. Static elements recede.

```css
/* Subtle motion draws eye to CTA */
.cta-button {
  transition: transform 0.2s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
}

/* Static elements don't compete */
.secondary-link {
  transition: color 0.2s ease;  /* Minimal motion */
}
```

### Animation Hierarchy Rules

1. **Primary actions** get the most noticeable motion
2. **Secondary elements** get subtle transitions
3. **Background elements** should be static or very subtle
4. **Too much motion** destroys hierarchy - everything competes

---

## Common Mistakes

### 1. Everything is Bold

When everything is emphasized, nothing is emphasized.

```css
/* BAD - No hierarchy */
.card-title { font-weight: 700; font-size: 24px; }
.card-description { font-weight: 600; font-size: 20px; }
.card-meta { font-weight: 600; font-size: 18px; }

/* GOOD - Clear hierarchy */
.card-title { font-weight: 600; font-size: 20px; color: var(--text-primary); }
.card-description { font-weight: 400; font-size: 16px; color: var(--text-secondary); }
.card-meta { font-weight: 400; font-size: 14px; color: var(--text-muted); }
```

### 2. Multiple CTAs Competing

One primary action per viewport.

```html
<!-- BAD - Competing actions -->
<div class="hero">
  <button class="btn-primary">Get Started</button>
  <button class="btn-primary">Learn More</button>
  <button class="btn-primary">Contact Us</button>
</div>

<!-- GOOD - Clear hierarchy -->
<div class="hero">
  <button class="btn-primary">Get Started</button>
  <button class="btn-secondary">Learn More</button>
</div>
```

### 3. Flat Color Scheme

All text same color = no hierarchy.

```css
/* BAD - Flat */
h1, h2, h3, p, span { color: #333; }

/* GOOD - Color hierarchy */
h1 { color: var(--text-primary); }    /* #111 - darkest */
h2 { color: var(--text-primary); }
p { color: var(--text-secondary); }    /* #444 - softer */
.meta { color: var(--text-muted); }    /* #666 - recedes */
```

### 4. Ignoring Whitespace

Cramped layouts destroy hierarchy.

```css
/* BAD - No breathing room */
section { padding: 20px; }
h2 { margin-bottom: 10px; }
p { margin-bottom: 10px; }

/* GOOD - Whitespace creates hierarchy */
section { padding-block: var(--space-24); }
h2 { margin-bottom: var(--space-6); }
p { margin-bottom: var(--space-4); }
```

### 5. Inconsistent Scale Jumps

Random sizes feel unprofessional.

```css
/* BAD - Random sizes */
.title-1 { font-size: 42px; }
.title-2 { font-size: 28px; }
.title-3 { font-size: 19px; }

/* GOOD - Systematic scale (1.25 ratio) */
.title-1 { font-size: var(--text-4xl); }  /* 49px */
.title-2 { font-size: var(--text-2xl); }  /* 31px */
.title-3 { font-size: var(--text-xl); }   /* 25px */
```

---

## Quick Checklist

Before shipping, verify:

- [ ] One clear primary element per viewport
- [ ] 4-5 distinct hierarchy levels
- [ ] Color saturation reserved for primary actions
- [ ] Consistent spacing creates clear groupings
- [ ] Squint test passes (hierarchy visible when blurred)
- [ ] Animation reinforces (not undermines) hierarchy
