# ScrollTrigger

Scroll-based animations with fine-grained control.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Configuration Options](#configuration-options)
3. [Pin Behavior](#pin-behavior)
4. [Scrub Animations](#scrub-animations)
5. [Horizontal Scrolling](#horizontal-scrolling)
6. [Parallax Effects](#parallax-effects)
7. [Batch Animations](#batch-animations)
8. [Advanced Patterns](#advanced-patterns)

---

## Basic Setup

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Inline ScrollTrigger

```javascript
gsap.from('.element', {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    end: 'bottom 20%'
  }
});
```

### Standalone ScrollTrigger

```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  onEnter: () => console.log('Entered'),
  onLeave: () => console.log('Left'),
  onEnterBack: () => console.log('Entered back'),
  onLeaveBack: () => console.log('Left back')
});
```

---

## Configuration Options

### Start & End Positions

```javascript
scrollTrigger: {
  trigger: '.element',

  // Format: '[trigger position] [scroller position]'

  // Trigger position: where on the trigger element
  // 'top', 'center', 'bottom', or percentage/pixels

  // Scroller position: where on the viewport
  // 'top', 'center', 'bottom', or percentage/pixels

  start: 'top center',     // When trigger's top hits viewport center
  start: 'top 80%',        // When trigger's top hits 80% down viewport
  start: 'top bottom',     // When trigger's top enters viewport
  start: 'center center',  // When trigger's center hits viewport center
  start: 'top top',        // When trigger's top hits viewport top

  end: 'bottom top',       // When trigger's bottom leaves viewport top
  end: 'bottom center',    // When trigger's bottom hits viewport center
  end: '+=500',            // 500px after start position
  end: '+=100%',           // 100% of trigger height after start
}
```

### Toggle Actions

```javascript
scrollTrigger: {
  // Format: 'onEnter onLeave onEnterBack onLeaveBack'
  // Values: 'play', 'pause', 'resume', 'reset', 'restart', 'complete', 'reverse', 'none'

  toggleActions: 'play none none none',      // Default: play once
  toggleActions: 'play pause resume reset',  // Interactive
  toggleActions: 'play reverse play reverse', // Ping-pong
  toggleActions: 'play complete none none',   // Play to end immediately on leave
}
```

### Toggle Class

```javascript
ScrollTrigger.create({
  trigger: '.element',
  start: 'top center',
  toggleClass: 'active',  // Add class when active

  // Or with custom class
  toggleClass: {
    targets: '.element, .other-element',
    className: 'is-visible'
  }
});
```

### Markers (Debug)

```javascript
scrollTrigger: {
  markers: true,  // Shows start/end markers

  // Custom markers
  markers: {
    startColor: 'green',
    endColor: 'red',
    fontSize: '12px',
    indent: 20
  }
}

// Global markers (dev only)
ScrollTrigger.defaults({
  markers: process.env.NODE_ENV === 'development'
});
```

---

## Pin Behavior

### Basic Pin

```javascript
ScrollTrigger.create({
  trigger: '.sticky-section',
  start: 'top top',
  end: '+=100%',  // Pin for 100% of viewport height
  pin: true,
  pinSpacing: true  // Add space for pinned duration
});
```

### Pin Without Spacing

```javascript
// Content scrolls over pinned element
ScrollTrigger.create({
  trigger: '.hero',
  start: 'top top',
  end: 'bottom top',
  pin: true,
  pinSpacing: false,  // No extra scroll space
  anticipatePin: 1    // Smooth pin on slow scroll
});
```

### Pin Different Element

```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top top',
  end: 'bottom bottom',
  pin: '.sticky-sidebar',  // Pin sidebar, not trigger
  pinSpacing: false
});
```

### Pin with Animation

```javascript
gsap.to('.progress-bar', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.article',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.progress-container',
    scrub: true
  }
});
```

---

## Scrub Animations

Scrub ties animation progress to scroll position.

### Basic Scrub

```javascript
gsap.to('.element', {
  x: 500,
  rotation: 360,
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true  // Direct 1:1 with scroll
  }
});
```

### Smoothed Scrub

```javascript
gsap.to('.element', {
  y: -200,
  scrollTrigger: {
    trigger: '.section',
    scrub: 0.5,  // 0.5 second smoothing
    // scrub: 1,   // 1 second smoothing
    // scrub: 2,   // 2 second smoothing (buttery smooth)
  }
});
```

### Scrub with Snap

```javascript
gsap.to('.carousel', {
  xPercent: -75,  // 4 panels
  ease: 'none',
  scrollTrigger: {
    trigger: '.carousel-wrapper',
    pin: true,
    scrub: 1,
    snap: {
      snapTo: 1/3,  // Snap to 0, 0.33, 0.66, 1
      duration: { min: 0.2, max: 0.5 },
      delay: 0.1,
      ease: 'power1.inOut'
    }
  }
});
```

---

## Horizontal Scrolling

### Basic Horizontal Scroll

```javascript
const panels = gsap.utils.toArray('.panel');

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-container',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + document.querySelector('.horizontal-container').scrollWidth
  }
});
```

### Horizontal with Varying Panel Widths

```javascript
const container = document.querySelector('.horizontal-container');
const panels = gsap.utils.toArray('.panel');

gsap.to(panels, {
  x: () => -(container.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    pin: true,
    scrub: 1,
    end: () => '+=' + (container.scrollWidth - window.innerWidth),
    invalidateOnRefresh: true  // Recalculate on resize
  }
});
```

### Horizontal with Per-Panel Animations

```javascript
const panels = gsap.utils.toArray('.panel');

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.horizontal-container',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + (panels.length * window.innerWidth)
  }
});

panels.forEach((panel, i) => {
  // Move to this panel
  tl.to(panels, { xPercent: -100 * i }, i);

  // Animate content within panel
  tl.from(panel.querySelector('.content'), {
    opacity: 0,
    y: 50
  }, i);
});
```

---

## Parallax Effects

### Simple Parallax

```javascript
gsap.to('.parallax-bg', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});
```

### Multi-Layer Parallax

```javascript
const layers = [
  { element: '.layer-1', speed: 0.5 },
  { element: '.layer-2', speed: 0.8 },
  { element: '.layer-3', speed: 1.2 },
];

layers.forEach(layer => {
  gsap.to(layer.element, {
    y: () => -window.innerHeight * layer.speed,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});
```

### Parallax Text

```javascript
gsap.to('.parallax-text', {
  yPercent: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '.text-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});
```

---

## Batch Animations

Efficiently animate many elements that enter viewport.

```javascript
ScrollTrigger.batch('.card', {
  onEnter: batch => {
    gsap.from(batch, {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    });
  },
  onLeave: batch => {
    gsap.to(batch, { opacity: 0.5 });
  },
  onEnterBack: batch => {
    gsap.to(batch, { opacity: 1 });
  },
  start: 'top 85%',
  batchMax: 5  // Max elements per batch
});
```

---

## Advanced Patterns

### Progress Indicator

```javascript
gsap.to('.progress-bar', {
  scaleX: 1,
  transformOrigin: 'left center',
  ease: 'none',
  scrollTrigger: {
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});
```

### Section Counter

```javascript
const sections = gsap.utils.toArray('.section');
const counter = document.querySelector('.section-counter');

sections.forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    onEnter: () => counter.textContent = `${i + 1} / ${sections.length}`,
    onEnterBack: () => counter.textContent = `${i + 1} / ${sections.length}`
  });
});
```

### Scroll Velocity-Based Animation

```javascript
let scrollVelocity = 0;
const skewElement = document.querySelector('.skew-on-scroll');

ScrollTrigger.create({
  onUpdate: (self) => {
    scrollVelocity = self.getVelocity() / 300;

    gsap.to(skewElement, {
      skewY: scrollVelocity,
      duration: 0.2,
      ease: 'power3.out'
    });
  }
});
```

### Reveal with Clip Path

```javascript
gsap.from('.reveal-section', {
  clipPath: 'inset(100% 0 0 0)',
  duration: 1.5,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.reveal-section',
    start: 'top 80%'
  }
});
```

---

## Cleanup

### Single ScrollTrigger

```javascript
const trigger = ScrollTrigger.create({ ... });
trigger.kill();  // Remove this trigger
```

### All ScrollTriggers

```javascript
ScrollTrigger.getAll().forEach(trigger => trigger.kill());
```

### With Context (Recommended)

```javascript
const ctx = gsap.context(() => {
  // All ScrollTriggers here are tracked
  ScrollTrigger.create({ ... });
  gsap.to('.el', { scrollTrigger: { ... } });
});

// Clean up everything
ctx.revert();
```

### Refresh on DOM Changes

```javascript
// After DOM changes
ScrollTrigger.refresh();

// After async content load
setTimeout(() => ScrollTrigger.refresh(), 100);
```

---

## Reduced Motion

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Full scroll animations
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Static or simple fade-only versions
  gsap.set('.animated', { opacity: 1, y: 0 });
});
```

---

## Troubleshooting

### Common Issues

1. **Animation doesn't trigger**
   - Check trigger element exists
   - Verify start/end positions with `markers: true`
   - Ensure element is in DOM when ScrollTrigger creates

2. **Pin causes layout shift**
   - Add `anticipatePin: 1` for smoother pinning
   - Check for conflicting CSS position values

3. **Horizontal scroll not working**
   - Ensure container has `overflow: hidden`
   - Set panels to `display: flex; flex-shrink: 0`
   - Call `invalidateOnRefresh: true` for resize handling

4. **Memory leaks**
   - Always use `gsap.context()` for cleanup
   - Call `ScrollTrigger.kill()` on unmount
