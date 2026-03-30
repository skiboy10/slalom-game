# Bento Grids

Asymmetric, visually dynamic grids inspired by Apple's product pages.

## Table of Contents

1. [Basic Structure](#basic-structure)
2. [Item Variations](#item-variations)
3. [Responsive Patterns](#responsive-patterns)
4. [Animation Integration](#animation-integration)
5. [Subgrid Patterns](#subgrid-patterns)

---

## Basic Structure

### Core Grid

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: clamp(0.75rem, 2vw, 1.5rem);
  padding: clamp(1rem, 3vw, 2rem);
}

.bento-item {
  background: var(--color-bg-secondary);
  border-radius: clamp(12px, 2vw, 24px);
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  position: relative;
}
```

### With Named Areas

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, minmax(200px, auto));
  grid-template-areas:
    "hero hero    side1 side2"
    "hero hero    side3 side3"
    "wide wide    tall  small";
  gap: 1rem;
}

.bento-hero { grid-area: hero; }
.bento-side1 { grid-area: side1; }
.bento-side2 { grid-area: side2; }
.bento-side3 { grid-area: side3; }
.bento-wide { grid-area: wide; }
.bento-tall { grid-area: tall; }
.bento-small { grid-area: small; }
```

---

## Item Variations

### Span Classes

```css
/* Column spans */
.bento-item.span-2 { grid-column: span 2; }
.bento-item.span-3 { grid-column: span 3; }
.bento-item.span-4 { grid-column: span 4; }

/* Row spans */
.bento-item.tall { grid-row: span 2; }
.bento-item.taller { grid-row: span 3; }

/* Combined */
.bento-item.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-item.hero {
  grid-column: span 3;
  grid-row: span 2;
}
```

### Content Variations

```css
/* Text-focused item */
.bento-item.text-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
}

.bento-item.text-item h3 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Image-focused item */
.bento-item.image-item {
  padding: 0;
}

.bento-item.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Stat/metric item */
.bento-item.stat-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

/* Icon item */
.bento-item.icon-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bento-item.icon-item .icon {
  width: 48px;
  height: 48px;
  color: var(--color-accent);
}
```

### Background Variations

```css
/* Gradient background */
.bento-item.gradient-bg {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
}

/* Image background with overlay */
.bento-item.image-bg {
  background-image: url('image.jpg');
  background-size: cover;
  background-position: center;
  color: white;
}

.bento-item.image-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  z-index: 0;
}

.bento-item.image-bg > * {
  position: relative;
  z-index: 1;
}

/* Glass effect */
.bento-item.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## Responsive Patterns

### Mobile-First Approach

```css
/* Mobile: 2 columns */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

/* All items single column on mobile */
.bento-item.featured,
.bento-item.hero,
.bento-item.span-3,
.bento-item.span-4 {
  grid-column: span 2;
}

/* Tablet: 3 columns */
@media (min-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .bento-item.featured {
    grid-column: span 2;
    grid-row: span 2;
  }

  .bento-item.span-3 {
    grid-column: span 3;
  }
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .bento-item.hero {
    grid-column: span 3;
  }
}
```

### Responsive Named Areas

```css
/* Mobile layout */
.bento-grid {
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "hero  hero"
    "a     b"
    "c     c"
    "d     e";
}

/* Tablet */
@media (min-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "hero hero a"
      "hero hero b"
      "c    d    e";
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "hero hero a b"
      "hero hero c d"
      "e    f    g g";
  }
}
```

### Fluid Auto-Fit

```css
/* No breakpoints needed */
.bento-grid-fluid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 280px), 1fr)
  );
  gap: clamp(0.75rem, 2vw, 1.5rem);
}

/* Larger featured items still work */
.bento-item.featured {
  grid-column: span min(2, var(--columns, 2));
}
```

---

## Animation Integration

### Scroll-Driven Reveal

```css
@media (prefers-reduced-motion: no-preference) {
  .bento-item {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    animation: revealBento linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }

  /* Stagger effect via delay */
  .bento-item:nth-child(1) { animation-range: entry 0% cover 25%; }
  .bento-item:nth-child(2) { animation-range: entry 5% cover 30%; }
  .bento-item:nth-child(3) { animation-range: entry 10% cover 35%; }
  .bento-item:nth-child(4) { animation-range: entry 15% cover 40%; }
}

@keyframes revealBento {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### GSAP Staggered Reveal

```javascript
gsap.from('.bento-item', {
  opacity: 0,
  y: 50,
  scale: 0.95,
  duration: 0.8,
  ease: 'power3.out',
  stagger: {
    amount: 1,
    grid: 'auto',
    from: 'start'
  },
  scrollTrigger: {
    trigger: '.bento-grid',
    start: 'top 80%'
  }
});
```

### Hover Effects

```css
.bento-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bento-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Image zoom on hover */
.bento-item.image-item img {
  transition: transform 0.5s ease;
}

.bento-item.image-item:hover img {
  transform: scale(1.05);
}
```

### FLIP for Filtering

```javascript
// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Capture current state
    const state = Flip.getState('.bento-item');

    // Apply filter
    document.querySelectorAll('.bento-item').forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    // Animate
    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.05,
      absolute: true,
      onEnter: elements => gsap.fromTo(elements,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4 }
      ),
      onLeave: elements => gsap.to(elements,
        { opacity: 0, scale: 0.8, duration: 0.4 }
      )
    });
  });
});
```

---

## Subgrid Patterns

### Card with Aligned Content

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.bento-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* Header, content, footer */
}

.bento-card-header {
  font-size: 1.25rem;
  font-weight: 600;
}

.bento-card-content {
  color: var(--color-text-secondary);
}

.bento-card-footer {
  margin-top: auto;
}
```

### Feature Grid with Subgrid

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 1rem;
  padding: 2rem;
  background: var(--color-bg-secondary);
  border-radius: 16px;
}

/* With subgrid, icons and titles align across cards */
@supports (grid-template-rows: subgrid) {
  .features-grid {
    grid-template-rows: repeat(4, auto);
  }

  .feature-card {
    grid-template-rows: subgrid;
    grid-row: span 4;
  }
}
```

---

## Complete Example

```html
<section class="bento-section">
  <div class="bento-grid">
    <!-- Hero item -->
    <article class="bento-item featured image-bg">
      <h2>Flagship Product</h2>
      <p>Revolutionary design meets performance</p>
      <a href="#" class="bento-cta">Explore</a>
    </article>

    <!-- Stat items -->
    <article class="bento-item stat-item">
      <span class="stat-value">99%</span>
      <span class="stat-label">Customer satisfaction</span>
    </article>

    <article class="bento-item stat-item gradient-bg">
      <span class="stat-value">10M+</span>
      <span class="stat-label">Users worldwide</span>
    </article>

    <!-- Feature items -->
    <article class="bento-item icon-item tall">
      <svg class="icon"><!-- Icon --></svg>
      <h3>Feature One</h3>
      <p>Description of this amazing feature</p>
    </article>

    <article class="bento-item text-item span-2">
      <h3>Our Mission</h3>
      <p>Creating products that inspire and delight</p>
    </article>

    <!-- Image item -->
    <article class="bento-item image-item">
      <img src="product.jpg" alt="Product showcase" loading="lazy">
    </article>
  </div>
</section>
```

```css
.bento-section {
  padding: clamp(3rem, 10vh, 8rem) 0;
  background: var(--color-bg-primary);
}

.bento-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 5vw, 3rem);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: clamp(0.75rem, 2vw, 1.5rem);
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bento-item.featured,
  .bento-item.span-2 {
    grid-column: span 2;
  }
}
```

---

## Accessibility

### Focus States

```css
.bento-item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

.bento-item a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Screen Reader Context

```html
<section aria-label="Product features" class="bento-section">
  <h2 class="sr-only">Key Features</h2>
  <div class="bento-grid" role="list">
    <article class="bento-item" role="listitem">
      <!-- Content -->
    </article>
  </div>
</section>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .bento-item {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .bento-item:hover {
    transform: none;
  }
}
```
