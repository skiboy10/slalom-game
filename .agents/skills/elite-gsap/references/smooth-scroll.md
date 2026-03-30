# Smooth Scroll with Lenis

Lenis provides smooth, inertia-based scrolling that replaces native browser scroll behavior. It's a standard companion to GSAP ScrollTrigger in production animated websites.

## Table of Contents

1. [Why Lenis](#why-lenis)
2. [Setup](#setup)
3. [SvelteKit Integration](#sveltekit-integration)
4. [Viewport Exclusion](#viewport-exclusion)
5. [Lenis vs Native Scroll](#lenis-vs-native-scroll)
6. [Reduced Motion](#reduced-motion)

---

## Why Lenis

- Normalizes scroll behavior across browsers and devices
- Provides smooth momentum-based scrolling with configurable easing
- Works with GSAP ScrollTrigger automatically (no explicit sync needed in modern versions)
- Lightweight (~3KB gzipped)

---

## Setup

```bash
npm install lenis
```

### Vanilla JS

```javascript
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Cleanup when done
// lenis.destroy();
```

### Configuration

| Option | Default | Production Value | Notes |
|--------|---------|-----------------|-------|
| `duration` | 1.2 | 1.2 | Time in seconds for scroll to settle |
| `easing` | — | Exponential decay | `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` |
| `orientation` | `'vertical'` | `'vertical'` | Can be `'horizontal'` |
| `smoothWheel` | `true` | `true` | Smooth mouse wheel scroll |
| `touchMultiplier` | `2` | `2` | Touch scroll sensitivity |

The exponential easing `Math.pow(2, -10 * t)` creates a fast initial response with a long, gentle settle — feels natural and premium.

---

## SvelteKit Integration

### Basic Setup (Layout)

```svelte
<script>
  import { onMount } from 'svelte';
  import 'lenis/dist/lenis.css';

  let { children } = $props();

  onMount(() => {
    const Lenis = (await import('lenis')).default;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  });
</script>

{@render children()}
```

### With Route Change Scroll Restoration

For multi-page SvelteKit apps, scroll to top on navigation:

```svelte
<script>
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import 'lenis/dist/lenis.css';

  let { children } = $props();
  let lenis;

  afterNavigate(() => {
    lenis?.scrollTo(0, { immediate: true });
  });

  onMount(() => {
    const Lenis = (await import('lenis')).default;
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  });
</script>

{@render children()}
```

Key details:
- `history.scrollRestoration = 'manual'` prevents the browser's default scroll restoration
- `lenis.scrollTo(0, { immediate: true })` scrolls to top instantly (no smooth animation) on route change

### React Layout

```jsx
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

---

## Viewport Exclusion

Nested scrollable areas (like embedded galleries or code blocks) need to opt out of Lenis:

```html
<!-- This div scrolls natively, not with Lenis -->
<div data-lenis-prevent class="overflow-y-auto max-h-[400px]">
  <!-- Scrollable content -->
</div>
```

The `data-lenis-prevent` attribute tells Lenis to ignore scroll events within this element.

---

## Lenis vs Native Scroll

| Factor | Lenis | Native `scroll-behavior: smooth` |
|--------|-------|----------------------------------|
| **Feel** | Momentum-based with easing | Linear interpolation |
| **Consistency** | Same across all browsers | Varies by browser |
| **Performance** | RAF loop (main thread) | Browser-native (off thread) |
| **Customization** | Duration, easing, callbacks | CSS only, limited |
| **GSAP compatibility** | Automatic | Automatic |
| **Bundle size** | ~3KB gzipped | 0KB |
| **Mobile** | Good (touch support) | Native (best) |

**Use Lenis when:** The site has heavy scroll-driven animations and the premium scroll feel is important to the brand experience.

**Use native when:** Performance is paramount, the site is content-heavy with minimal animations, or mobile performance is the primary concern.

---

## Reduced Motion

Lenis smooth scrolling is a **UX enhancement**, not decorative animation. It stays active even when `prefers-reduced-motion: reduce` is set. The distinction:

- **Lenis**: Makes scroll smoother — remains active
- **GSAP animations**: Decorative motion — disabled for reduced motion

Individual GSAP animations handle their own reduced motion via `gsap.matchMedia()`.
