# Reduced Motion

Complete implementation patterns for respecting `prefers-reduced-motion`.

## Table of Contents

1. [Understanding the Preference](#understanding-the-preference)
2. [CSS Implementation](#css-implementation)
3. [GSAP Implementation](#gsap-implementation)
4. [ScrollTrigger Patterns](#scrolltrigger-patterns)
5. [CSS Scroll-Driven Animations](#css-scroll-driven-animations)
6. [JavaScript Detection](#javascript-detection)
7. [User Toggle](#user-toggle)

---

## Understanding the Preference

### Who Uses This?

- People with vestibular disorders (~35% of adults 40+)
- Migraine sufferers (motion can trigger attacks)
- People with motion sickness
- Users with cognitive disabilities (ADHD, anxiety)
- Anyone who finds animations distracting

### What It Detects

`prefers-reduced-motion` has two values:

- `no-preference` - User hasn't requested reduced motion
- `reduce` - User has explicitly requested reduced motion

---

## CSS Implementation

### Global Disable (Nuclear Option)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Pros:** Catches everything
**Cons:** Removes ALL motion, including subtle helpful transitions

### Selective Disable (Recommended)

```css
/* Base animations */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion: instant transition */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Progressive Enhancement Pattern

```css
/* Start with no animation (accessible default) */
.animated-element {
  opacity: 1;
  transform: none;
}

/* Only add animation if motion is OK */
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .animated-element.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Reduced vs Disabled

Sometimes reduce instead of disable entirely:

```css
/* Full animation */
.button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Reduced: keep feedback, remove movement */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: box-shadow 0.15s ease;  /* Shorter, simpler */
  }

  .button:hover {
    transform: none;  /* No movement */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
```

---

## GSAP Implementation

### Using gsap.matchMedia()

The correct way to handle motion preferences in GSAP:

```javascript
import gsap from 'gsap';

const mm = gsap.matchMedia();

// Full animations
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.from('.hero-cta', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.6,
    ease: 'power3.out'
  });
});

// Reduced motion: instant or simple fade
mm.add('(prefers-reduced-motion: reduce)', () => {
  // Option 1: Instant (no animation at all)
  gsap.set('.hero-title, .hero-description, .hero-cta', {
    opacity: 1,
    y: 0
  });

  // Option 2: Simple fade only
  // gsap.from('.hero-title, .hero-description, .hero-cta', {
  //   opacity: 0,
  //   duration: 0.3,
  //   stagger: 0.1
  // });
});
```

### Context Cleanup

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const ctx = gsap.context(() => {
    // Animations here
    gsap.from('.element', { opacity: 0, y: 50 });
  });

  // Cleanup function - called when media query no longer matches
  return () => ctx.revert();
});
```

### Timeline Conditionals

```javascript
const mm = gsap.matchMedia();

mm.add({
  isMotionOK: '(prefers-reduced-motion: no-preference)',
  isMotionReduced: '(prefers-reduced-motion: reduce)'
}, (context) => {
  const { isMotionOK, isMotionReduced } = context.conditions;

  const tl = gsap.timeline();

  if (isMotionOK) {
    tl.from('.title', { opacity: 0, y: 50, duration: 1 })
      .from('.subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
      .from('.content', { opacity: 0, duration: 0.6 }, '-=0.3');
  }

  if (isMotionReduced) {
    tl.from('.title, .subtitle, .content', { opacity: 0, duration: 0.3 });
  }

  return () => tl.revert();
});
```

---

## ScrollTrigger Patterns

### Scroll-Triggered Reveals

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('.reveal-section').forEach(section => {
    gsap.from(section.querySelectorAll('.reveal-item'), {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Content is visible by default (no animation needed)
  gsap.set('.reveal-item', { opacity: 1, y: 0 });
});
```

### Parallax Effects

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
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
});

// No mm.add for reduced motion - just don't animate
// The background stays in place by default
```

### Horizontal Scroll

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const panels = gsap.utils.toArray('.panel');

  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: '.horizontal-wrapper',
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () => '+=' + document.querySelector('.horizontal-wrapper').offsetWidth
    }
  });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Convert to vertical scroll layout
  document.querySelector('.horizontal-wrapper').classList.add('vertical-fallback');
});
```

```css
/* Fallback vertical layout */
.vertical-fallback {
  display: flex;
  flex-direction: column;
}

.vertical-fallback .panel {
  width: 100%;
  height: auto;
  min-height: 100vh;
}
```

---

## CSS Scroll-Driven Animations

### Progressive Enhancement

```css
/* Default: content visible */
.scroll-reveal {
  opacity: 1;
  transform: none;
}

/* Only animate if motion is OK */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .scroll-reveal {
      opacity: 0;
      transform: translateY(30px);
      animation: reveal linear forwards;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Progress Indicator (Safe Animation)

```css
/* Progress bars are generally safe - just showing position */
.scroll-progress {
  transform-origin: left;
  transform: scaleX(0);
  animation: progress linear;
  animation-timeline: scroll();
}

@keyframes progress {
  to { transform: scaleX(1); }
}

/* But still respect the preference */
@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    /* Show full bar or hide entirely */
    transform: scaleX(1);
    animation: none;
  }
}
```

---

## JavaScript Detection

### Checking the Preference

```javascript
// Check current preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Skip animation setup
} else {
  // Initialize animations
}
```

### Listening for Changes

```javascript
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleMotionPreference(event) {
  if (event.matches) {
    // User enabled reduced motion - disable animations
    disableAnimations();
  } else {
    // User disabled reduced motion - enable animations
    enableAnimations();
  }
}

// Initial check
handleMotionPreference(motionQuery);

// Listen for changes
motionQuery.addEventListener('change', handleMotionPreference);
```

---

## User Toggle

Some users may not know about the system setting. Provide an in-app toggle:

### HTML

```html
<button id="motion-toggle" aria-pressed="false">
  <span class="motion-on">Reduce motion</span>
  <span class="motion-off">Enable motion</span>
</button>
```

### CSS

```css
/* Custom property for motion state */
:root {
  --motion-ok: 1;
}

:root[data-reduced-motion="true"] {
  --motion-ok: 0;
}

/* Use the property in animations */
.animated {
  transition-duration: calc(0.3s * var(--motion-ok));
}

/* Or disable entirely */
:root[data-reduced-motion="true"] .animated {
  animation: none;
  transition: none;
}
```

### JavaScript

```javascript
const toggle = document.getElementById('motion-toggle');
const root = document.documentElement;

// Check saved preference or system preference
const savedPreference = localStorage.getItem('reduced-motion');
const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reducedMotion = savedPreference === 'true' || (savedPreference === null && systemPreference);

// Apply initial state
if (reducedMotion) {
  root.dataset.reducedMotion = 'true';
  toggle.setAttribute('aria-pressed', 'true');
}

// Handle toggle
toggle.addEventListener('click', () => {
  const isReduced = root.dataset.reducedMotion === 'true';
  const newState = !isReduced;

  root.dataset.reducedMotion = newState;
  toggle.setAttribute('aria-pressed', newState);
  localStorage.setItem('reduced-motion', newState);

  // If using GSAP matchMedia, it will automatically respond
});
```

---

## Testing Checklist

- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify all content is still visible and accessible
- [ ] Confirm no jarring state changes
- [ ] Test the user toggle if provided
- [ ] Verify ScrollTrigger animations have alternatives
- [ ] Check that parallax effects are disabled
- [ ] Ensure horizontal scroll has vertical fallback

---

## Production Reduced Motion Patterns

Real-world patterns showing how production sites handle reduced motion across different animation types.

### Global CSS Killswitch

Every production site uses this as a safety net:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This catches any animation that slips through without a manual check. `0.01ms` (not `0ms`) ensures `animationend`/`transitionend` events still fire, preventing broken JavaScript that listens for these events.

### GSAP matchMedia Dual-Branch

Every GSAP utility provides both a `no-preference` and `reduce` branch:

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from(element, { opacity: 0, y: 30, duration: 0.7 });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Instant appearance — content still visible
  gsap.from(element, { opacity: 0, duration: 0.01 });
});
```

### Horizontal Scroll Fallback

Desktop horizontal scroll becomes a vertical stack with simple reveals:

```javascript
// Desktop: pinned horizontal scroll
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
  gsap.to(track, { x: -totalWidth, scrollTrigger: { pin: true, scrub: 1 } });
});

// Mobile OR reduced motion: vertical reveal
mm.add('(max-width: 768px), (prefers-reduced-motion: reduce)', () => {
  gsap.from(cards, { opacity: 0, y: 30, stagger: 0.12, ease: 'power3.out' });
});
```

### Typewriter Effect Fallback

Shows static first word instead of typing animation:

```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  element.textContent = words[0]; // Show first word, no animation
  return;
}
// Otherwise: run typing animation
```

### Ticker/Marquee Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .ticker-track {
    animation: none;
  }
}
```

Content becomes static — still visible, just not scrolling.

### Hover-Lift Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .hover-lift:hover {
    transform: none;
  }
}
```

Card still receives hover state (cursor change, potential color shift) but no vertical movement.
