# Sticky & Parallax Sections

Layered, depth-driven layouts with sticky positioning and parallax effects.

## Table of Contents

1. [CSS Sticky Basics](#css-sticky-basics)
2. [Stacking Sections](#stacking-sections)
3. [GSAP Pin Patterns](#gsap-pin-patterns)
4. [Parallax Effects](#parallax-effects)
5. [Layered Compositions](#layered-compositions)

---

## CSS Sticky Basics

### How Sticky Works

```css
.sticky-element {
  position: sticky;
  top: 0;  /* Sticks when reaching top of viewport */
}
```

**Key requirements:**
1. Parent must have scrollable height
2. Sticky element needs `top`, `bottom`, `left`, or `right`
3. Parent can't have `overflow: hidden`
4. Works within nearest scrolling ancestor

### Simple Sticky Header

```css
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg-primary);
  backdrop-filter: blur(10px);
  transition: box-shadow 0.3s ease;
}

.sticky-header.scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
```

```javascript
// Add shadow when scrolled
const header = document.querySelector('.sticky-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });
```

### Sticky Sidebar

```css
.layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.main-content {
  /* Long content that scrolls */
}
```

---

## Stacking Sections

### CSS-Only Stacking

```html
<div class="stacking-container">
  <section class="stacking-section" style="--bg: #1a1a2e;">
    <div class="section-content">Section 1</div>
  </section>
  <section class="stacking-section" style="--bg: #16213e;">
    <div class="section-content">Section 2</div>
  </section>
  <section class="stacking-section" style="--bg: #0f3460;">
    <div class="section-content">Section 3</div>
  </section>
  <section class="stacking-section" style="--bg: #e94560;">
    <div class="section-content">Section 4</div>
  </section>
</div>
```

```css
.stacking-container {
  /* Total height = sections × 100vh + scroll space */
}

.stacking-section {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

/* Stack with increasing z-index */
.stacking-section:nth-child(1) { z-index: 1; }
.stacking-section:nth-child(2) { z-index: 2; }
.stacking-section:nth-child(3) { z-index: 3; }
.stacking-section:nth-child(4) { z-index: 4; }
```

### Cards Stacking with Offset

```css
.stacking-section {
  position: sticky;
  top: 0;
  height: 100vh;
  padding-top: calc(var(--index, 0) * 4rem);
}

.stacking-section:nth-child(1) { --index: 0; z-index: 1; }
.stacking-section:nth-child(2) { --index: 1; z-index: 2; }
.stacking-section:nth-child(3) { --index: 2; z-index: 3; }
.stacking-section:nth-child(4) { --index: 3; z-index: 4; }

.section-card {
  background: var(--color-bg-secondary);
  border-radius: 24px;
  padding: 3rem;
  height: calc(100vh - var(--index, 0) * 4rem - 4rem);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
}
```

### Reveal on Stack

```css
.stacking-section {
  position: sticky;
  top: 0;
  height: 100vh;
}

.section-content {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Use Intersection Observer to trigger */
.stacking-section.in-view .section-content {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
const sections = document.querySelectorAll('.stacking-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, {
  threshold: 0.5
});

sections.forEach(section => observer.observe(section));
```

---

## GSAP Pin Patterns

### Basic Pin

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to('.pinned-section', {
  scrollTrigger: {
    trigger: '.pinned-section',
    pin: true,
    start: 'top top',
    end: '+=100%',  // Pin for 100vh of scrolling
    scrub: true
  }
});
```

### Pin with Content Animation

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '.feature-section',
    pin: true,
    start: 'top top',
    end: '+=300%',  // Pin for 3 screens worth of scroll
    scrub: 1
  }
})
.from('.feature-1', { opacity: 0, y: 100 })
.to('.feature-1', { opacity: 0, y: -100 })
.from('.feature-2', { opacity: 0, y: 100 })
.to('.feature-2', { opacity: 0, y: -100 })
.from('.feature-3', { opacity: 0, y: 100 });
```

### Pin with Progress-Based Content

```javascript
const features = gsap.utils.toArray('.feature');

gsap.timeline({
  scrollTrigger: {
    trigger: '.features-container',
    pin: true,
    start: 'top top',
    end: `+=${features.length * 100}%`,
    scrub: 1
  }
})
.to('.features-track', {
  y: () => -(features.length - 1) * window.innerHeight,
  ease: 'none'
});
```

### Pin Spacer Styling

```javascript
ScrollTrigger.create({
  trigger: '.section',
  pin: true,
  pinSpacing: true,  // Default - adds spacer
  // pinSpacing: false,  // No spacer - content overlaps
  // pinSpacing: "margin",  // Uses margin instead of spacer
});
```

### Multiple Pinned Sections

```javascript
const sections = gsap.utils.toArray('.pin-section');

sections.forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    pin: true,
    start: 'top top',
    end: '+=100%',
    pinSpacing: i === sections.length - 1  // Only last has spacing
  });
});
```

---

## Parallax Effects

### CSS-Only Parallax

```css
.parallax-container {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  perspective: 1px;
  perspective-origin: center center;
}

.parallax-layer {
  position: absolute;
  inset: 0;
}

.parallax-layer.back {
  transform: translateZ(-1px) scale(2);
}

.parallax-layer.mid {
  transform: translateZ(-0.5px) scale(1.5);
}

.parallax-layer.front {
  transform: translateZ(0);
}
```

### Scroll-Driven Parallax

```css
@media (prefers-reduced-motion: no-preference) {
  .parallax-bg {
    animation: parallax linear;
    animation-timeline: scroll();
  }

  @keyframes parallax {
    from { transform: translateY(0); }
    to { transform: translateY(-20%); }
  }
}
```

### GSAP Parallax Layers

```javascript
gsap.to('.parallax-bg', {
  y: '-30%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

gsap.to('.parallax-mid', {
  y: '-15%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// Foreground moves slower or opposite
gsap.to('.parallax-fg', {
  y: '10%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});
```

### Hero Parallax with Fade

```javascript
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

heroTl
  .to('.hero-bg', { y: '30%', scale: 1.1 }, 0)
  .to('.hero-content', { y: '50%', opacity: 0 }, 0)
  .to('.hero-overlay', { opacity: 0.8 }, 0);
```

### Text Parallax

```javascript
gsap.utils.toArray('.parallax-text').forEach(text => {
  gsap.to(text, {
    y: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: text,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    }
  });
});
```

---

## Layered Compositions

### Depth Layers

```html
<section class="layered-section">
  <div class="layer layer-bg">
    <img src="bg.jpg" alt="">
  </div>
  <div class="layer layer-mid">
    <img src="mountains.png" alt="">
  </div>
  <div class="layer layer-content">
    <h1>Discover Nature</h1>
  </div>
  <div class="layer layer-fg">
    <img src="trees.png" alt="">
  </div>
</section>
```

```css
.layered-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.layer-bg { z-index: 1; }
.layer-mid { z-index: 2; }
.layer-content { z-index: 3; }
.layer-fg { z-index: 4; pointer-events: none; }
```

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '.layered-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
})
.to('.layer-bg', { y: '20%', scale: 1.1 }, 0)
.to('.layer-mid', { y: '30%' }, 0)
.to('.layer-content', { y: '60%', opacity: 0 }, 0)
.to('.layer-fg', { y: '5%' }, 0);
```

### Reveal with Mask

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '.masked-section',
    pin: true,
    start: 'top top',
    end: '+=150%',
    scrub: 1
  }
})
.from('.reveal-mask', {
  clipPath: 'circle(0% at 50% 50%)',
  ease: 'none'
})
.to('.reveal-mask', {
  clipPath: 'circle(150% at 50% 50%)',
  ease: 'none'
});
```

### Scale and Fade Layers

```javascript
const layers = gsap.utils.toArray('.scale-layer');

layers.forEach((layer, i) => {
  gsap.from(layer, {
    scale: 0.8,
    opacity: 0,
    scrollTrigger: {
      trigger: '.scale-section',
      start: `top+=${i * 20}% center`,
      end: `top+=${(i + 1) * 20}% center`,
      scrub: true
    }
  });
});
```

---

## Complete Example: Feature Showcase

```html
<section class="feature-showcase">
  <div class="feature-sticky">
    <div class="feature-visual">
      <img class="feature-image" data-feature="1" src="feature1.jpg" alt="">
      <img class="feature-image" data-feature="2" src="feature2.jpg" alt="">
      <img class="feature-image" data-feature="3" src="feature3.jpg" alt="">
    </div>
  </div>

  <div class="feature-content">
    <article class="feature-item" data-feature="1">
      <span class="feature-number">01</span>
      <h2>Feature One</h2>
      <p>Description of the first feature...</p>
    </article>

    <article class="feature-item" data-feature="2">
      <span class="feature-number">02</span>
      <h2>Feature Two</h2>
      <p>Description of the second feature...</p>
    </article>

    <article class="feature-item" data-feature="3">
      <span class="feature-number">03</span>
      <h2>Feature Three</h2>
      <p>Description of the third feature...</p>
    </article>
  </div>
</section>
```

```css
.feature-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 300vh;
}

.feature-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.feature-visual {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4/3;
}

.feature-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.feature-image.active {
  opacity: 1;
  transform: scale(1);
}

.feature-content {
  padding: 4rem;
  display: flex;
  flex-direction: column;
}

.feature-item {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
}

.feature-number {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent);
}

.feature-item h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.5rem 0 1rem;
}
```

```javascript
const featureItems = gsap.utils.toArray('.feature-item');
const featureImages = gsap.utils.toArray('.feature-image');

featureItems.forEach((item, i) => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveFeature(i),
    onEnterBack: () => setActiveFeature(i)
  });
});

function setActiveFeature(index) {
  featureImages.forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });
}

// Initialize first as active
setActiveFeature(0);
```

---

## Accessibility

### Reduced Motion

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable parallax effects
  ScrollTrigger.getAll().forEach(st => st.kill());

  // Show all content immediately
  gsap.set('.parallax-element', { clearProps: 'all' });
}
```

### Keyboard Navigation for Pinned Sections

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    // Allow natural scroll, don't interfere
  }
});
```

### Screen Reader Consideration

```html
<section class="sticky-section" aria-label="Feature showcase with scrolling images">
  <div class="sticky-visual" aria-hidden="true">
    <!-- Decorative parallax elements -->
  </div>
  <div class="sticky-content">
    <!-- Accessible content -->
  </div>
</section>
```

---

## Mobile-Specific Sticky Elements

### Sticky Add-to-Cart Bar

Slides in from below when the main product CTA scrolls out of view (e-commerce pattern):

```css
.sticky-atc {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 40;
  padding: 0.75rem 1rem;
  background: white;
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06);
}

.sticky-atc.visible {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .sticky-atc {
    transition: none;
  }
}
```

Toggled via IntersectionObserver on the main CTA button — when it exits the viewport, the sticky bar becomes visible.

### Mobile Bottom CTA Bar

Fixed bottom bar for service businesses where phone calls are high-intent:

```css
.mobile-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: var(--color-dark);
}

/* Account for bar height in body */
body {
  padding-bottom: 4rem; /* Match bar height */
}

/* Hide on desktop */
@media (min-width: 768px) {
  .mobile-bar { display: none; }
  body { padding-bottom: 0; }
}
```
