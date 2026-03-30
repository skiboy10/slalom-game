# GSAP Utility Library

Production-tested animation utilities for scroll-driven websites. Each utility handles plugin registration, reduced motion, and cleanup automatically.

## Table of Contents

1. [Setup](#setup)
2. [reveal()](#reveal)
3. [staggerReveal()](#staggerreveal)
4. [batchReveal()](#batchreveal)
5. [splitReveal()](#splitreveal)
6. [parallax()](#parallax)
7. [horizontalScroll()](#horizontalscroll)
8. [countUp()](#countup)
9. [Framework Integration](#framework-integration)

---

## Setup

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
```

---

## reveal()

Fade-up a single element when it scrolls into view.

```javascript
function reveal(element, opts = {}) {
  const { delay = 0, y = 30, duration = 0.7, start = 'top 85%' } = opts;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(element, {
        opacity: 0,
        y,
        delay,
        duration,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once: true }
      });
    });
  });

  return () => ctx.revert(); // cleanup
}

// Usage
const cleanup = reveal(document.querySelector('.hero-title'));
// Later: cleanup();
```

---

## staggerReveal()

Cascade children into view with staggered timing.

```javascript
function staggerReveal(container, opts = {}) {
  const {
    stagger = 0.08,
    y = 30,
    duration = 0.6,
    start = 'top 85%',
    selector = ':scope > *'
  } = opts;

  const children = container.querySelectorAll(selector);
  if (!children.length) return () => {};

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(children, {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: container, start, once: true }
      });
    });
  });

  return () => ctx.revert();
}
```

---

## batchReveal()

Efficiently reveal grid items using `ScrollTrigger.batch()`. More performant than `staggerReveal()` for 20+ items — creates a single ScrollTrigger instead of one per element.

```javascript
function batchReveal(container, opts = {}) {
  const {
    y = 30,
    duration = 0.5,
    stagger = 0.08,
    start = 'top 90%',
    selector = ':scope > *'
  } = opts;

  const items = container.querySelectorAll(selector);
  if (!items.length) return () => {};

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(items, { opacity: 0, y });

      ScrollTrigger.batch(items, {
        start,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: 'power3.out',
            overwrite: true
          });
        },
        once: true
      });
    });
  });

  return () => ctx.revert();
}
```

**When to use batch vs stagger:**
- **staggerReveal**: Container with 3-15 children that enter view together
- **batchReveal**: Grids with 20+ items that enter view at different scroll positions

---

## splitReveal()

Word-by-word (or char/line) text reveal using SplitText with optional mask mode.

```javascript
function splitReveal(element, opts = {}) {
  const {
    delay = 0,
    duration = 0.8,
    stagger = 0.04,
    type = 'words',      // 'words' | 'chars' | 'lines'
    scrollTriggered = false,
    mask = true           // GSAP 3.14+ mask mode
  } = opts;

  let split = null;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      split = new SplitText(element, {
        type,
        ...(mask && { mask: type })
      });

      const targets =
        type === 'chars' ? split.chars :
        type === 'lines' ? split.lines :
        split.words;

      gsap.from(targets, {
        // Mask mode: slide up from below (no opacity needed)
        // Non-mask mode: fade + translate
        ...(mask ? { yPercent: 110 } : { y: 20, opacity: 0 }),
        duration,
        stagger,
        delay,
        ease: 'power4.out',
        ...(scrollTriggered && {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true
          }
        })
      });

      return () => split?.revert();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.from(element, { opacity: 0, duration: 0.01 });
    });
  });

  return () => {
    split?.revert();
    ctx.revert();
  };
}
```

**Mask mode** (GSAP 3.14+): Each word is clipped by an overflow mask. `yPercent: 110` slides text up from below the mask — no opacity change needed. Creates a more polished "reveal from behind" effect.

**Non-mask mode**: Traditional `y + opacity` animation. Simpler but less dramatic.

---

## parallax()

Scroll-driven parallax effect using `yPercent`.

```javascript
function parallax(element, opts = {}) {
  const { speed = 0.2 } = opts;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(element, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  });

  return () => ctx.revert();
}

// Usage: parallax(image, { speed: 0.2 })
// speed 0.1 = subtle, 0.3 = dramatic
```

---

## horizontalScroll()

Pinned horizontal scroll on desktop with vertical stack fallback on mobile.

```javascript
function horizontalScroll(section, opts = {}) {
  const { end = '+=300%', ease = 'none' } = opts;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    // Desktop: horizontal scroll
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const track = section.querySelector('[data-scroll-track]');
      if (!track) return;

      const totalWidth = track.scrollWidth - section.clientWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1
        }
      });
    });

    // Mobile or reduced motion: vertical stack with reveals
    mm.add('(max-width: 768px), (prefers-reduced-motion: reduce)', () => {
      const cards = section.querySelectorAll('[data-scroll-card]');
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true }
        });
      }
    });
  });

  return () => ctx.revert();
}
```

**HTML structure:**
```html
<section class="horizontal-section">
  <div data-scroll-track class="flex gap-8">
    <div data-scroll-card class="min-w-[80vw]">Card 1</div>
    <div data-scroll-card class="min-w-[80vw]">Card 2</div>
    <div data-scroll-card class="min-w-[80vw]">Card 3</div>
  </div>
</section>
```

---

## countUp()

Animated number counter that preserves prefix/suffix (e.g., "$1.2M", "99%").

```javascript
function countUp(element, opts = {}) {
  const { duration = 1.5 } = opts;
  const text = element.textContent?.trim() ?? '';
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  const prefix = text.match(/^[^0-9]*/)?.[0] ?? '';
  const suffix = text.match(/[^0-9]*$/)?.[0] ?? '';

  if (isNaN(num)) return () => {};

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 85%', once: true },
        onUpdate() {
          const display = Number.isInteger(num)
            ? Math.round(obj.val)
            : obj.val.toFixed(1);
          element.textContent = `${prefix}${display}${suffix}`;
        }
      });
    });
  });

  return () => ctx.revert();
}

// Usage: countUp(document.querySelector('.stat'))
// Handles: "$1.2M" → counts from $0 to $1.2M
// Handles: "99%" → counts from 0% to 99%
```

---

## Framework Integration

### Svelte 5 Action Pattern

Each utility becomes a reusable Svelte action that auto-cleans on unmount:

```svelte
<!-- Usage: <div use:reveal={{ delay: 0.2 }}>...</div> -->

<script>
  // The utility functions ARE Svelte actions (return { destroy() })
  import { reveal, staggerReveal, splitReveal } from '$lib/utils/gsap';
</script>

<h1 use:splitReveal>Hero Title</h1>
<div use:staggerReveal={{ stagger: 0.1 }}>
  <div>Card 1</div>
  <div>Card 2</div>
</div>
```

Svelte actions must return `{ destroy() }` — our utilities already return a cleanup function, so they work directly as actions.

### React Pattern

```jsx
function useGsapReveal(ref, opts = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const cleanup = reveal(ref.current, opts);
    return cleanup;
  }, []);
}
```

### Vue Pattern

```javascript
// Directive
app.directive('reveal', {
  mounted(el, binding) {
    el._gsapCleanup = reveal(el, binding.value || {});
  },
  unmounted(el) {
    el._gsapCleanup?.();
  }
});
```

---

## Animation UX Rules

Technical animation quality is necessary but not sufficient. These UX-level rules determine whether animations feel professional.

### Exit Faster Than Enter

Exit animations should be 60-70% of enter duration. Users are done with the element — don't make them wait.

```javascript
// Enter: 0.3s
gsap.from(modal, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power3.out' });

// Exit: 0.2s (67% of enter)
gsap.to(modal, { opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in' });
```

### Interruptible Animations

User tap/gesture must cancel in-progress animations immediately:

```javascript
// Kill any running animation on this element before starting new one
gsap.killTweensOf(element);
gsap.to(element, { /* new animation */ });
```

Never block user input during an animation — UI must stay interactive.

### Scale Feedback

Subtle scale on press for tappable cards and buttons:

```javascript
// Press: scale down slightly
element.addEventListener('pointerdown', () => {
  gsap.to(element, { scale: 0.96, duration: 0.1, ease: 'power2.out' });
});

// Release: spring back
element.addEventListener('pointerup', () => {
  gsap.to(element, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
});
```

Range: 0.95-1.05. Anything beyond 1.1 feels cartoony; below 0.9 feels broken.

### Opacity Threshold

Don't linger below opacity 0.2 — elements should either be visible or gone:

```javascript
// BAD: Long fade lingers at low opacity
gsap.to(element, { opacity: 0, duration: 2 }); // Spends ~1.5s below 0.2

// GOOD: Fast fade, clean exit
gsap.to(element, { opacity: 0, duration: 0.3, ease: 'power2.in' });
```

### Modal Motion

Modals should animate from their trigger source for spatial context:

```javascript
// Get trigger button position
const rect = triggerButton.getBoundingClientRect();

gsap.from(modal, {
  scale: 0.8,
  opacity: 0,
  transformOrigin: `${rect.left + rect.width/2}px ${rect.top + rect.height/2}px`,
  duration: 0.3,
  ease: 'power3.out'
});
```

### Navigation Direction

Maintain spatial consistency:
- **Forward navigation**: Content enters from right/below
- **Backward navigation**: Content enters from left/above

```javascript
function pageTransition(direction = 'forward') {
  const xFrom = direction === 'forward' ? 50 : -50;
  gsap.from(newPage, { x: xFrom, opacity: 0, duration: 0.3, ease: 'power3.out' });
  gsap.to(oldPage, { x: -xFrom, opacity: 0, duration: 0.2, ease: 'power2.in' });
}
```

### Crossfade

Use for content replacement within the same container:

```javascript
gsap.timeline()
  .to(oldContent, { opacity: 0, duration: 0.15 })
  .from(newContent, { opacity: 0, duration: 0.15 });
```

### Stagger Timing

30-50ms per item for list/grid entrances. Too fast (<20ms) and stagger is invisible; too slow (>80ms) and it feels sluggish.

### Gesture-Driven Animation

Drag, swipe, and pinch must provide real-time visual response tracking the finger — not just an end-state animation.

**GSAP Draggable:**

```javascript
import { Draggable } from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

Draggable.create(card, {
  type: 'x,y',
  bounds: container,
  inertia: true,          // Momentum after release
  onDrag() {
    // Real-time: element follows finger every frame
    const progress = this.x / container.offsetWidth;
    gsap.set(shadow, { opacity: Math.abs(progress) * 0.3 });
  },
  onDragEnd() {
    // Snap to position or spring back
    if (Math.abs(this.x) > threshold) {
      gsap.to(card, { x: this.x > 0 ? 300 : -300, opacity: 0, duration: 0.3 });
    } else {
      gsap.to(card, { x: 0, y: 0, duration: 0.4, ease: 'back.out(2)' });
    }
  }
});
```

**GSAP Observer (for custom gesture handling):**

```javascript
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);

Observer.create({
  target: element,
  type: 'touch,pointer',
  onDrag(self) {
    // self.deltaX, self.deltaY — frame-by-frame movement
    gsap.set(element, {
      x: `+=${self.deltaX}`,
      y: `+=${self.deltaY}`
    });
  },
  onDragEnd(self) {
    // self.velocityX, self.velocityY — for inertia
    gsap.to(element, {
      x: 0, y: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  }
});
```

**Key principle:** The visual must track the finger 1:1 during the gesture. Post-release animations (snap, spring, inertia) happen only after the user lifts their finger.

### Hierarchy Motion

Use translate/scale direction to express hierarchy depth:

- **Enter from below** → navigating deeper into content
- **Enter from above** → returning to parent/overview
- **Scale up from small** → expanding detail from a summary
- **Scale down** → collapsing detail back to summary

```javascript
// Drill-down: child enters from below
function drillDown(child) {
  gsap.from(child, { y: 60, opacity: 0, duration: 0.35, ease: 'power3.out' });
}

// Return: parent enters from above
function drillUp(parent) {
  gsap.from(parent, { y: -40, opacity: 0, duration: 0.25, ease: 'power2.out' });
}
```

This differs from Navigation Direction (forward/backward = horizontal). Hierarchy motion is vertical — deeper = down, shallower = up.

### Duration Budget

| Category | Duration | Examples |
|----------|----------|---------|
| Micro-interactions | 100-200ms | Button press, toggle, icon rotation |
| State transitions | 200-300ms | Hover, focus, accordion, tab switch |
| Reveals & entrances | 300-500ms | Scroll reveal, modal enter, page section |
| Complex sequences | 400-800ms | Horizontal scroll, multi-step timeline |
| Page transitions | 300-500ms | Route change, view transition |
| **Never exceed** | **>800ms** | Feels sluggish; user loses causal connection |

**Exit = 60-70% of enter.** If enter is 300ms, exit is 180-210ms.

### Layout Shift Prevention

Animations must never cause reflow or Cumulative Layout Shift:
- Use `transform` for position changes (never `top/left/margin`)
- Use `opacity` for visibility (never `display/visibility`)
- Pre-allocate space for entering elements before animating them in
