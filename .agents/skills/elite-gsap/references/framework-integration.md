# Framework Integration

GSAP patterns for React, Vue, Svelte, and vanilla JavaScript.

## Table of Contents

1. [React](#react)
2. [Vue 3](#vue-3)
3. [Svelte](#svelte)
4. [Vanilla JavaScript](#vanilla-javascript)

---

## React

### Using @gsap/react

The official React integration handles cleanup automatically.

```bash
npm install @gsap/react
```

```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

function Component() {
  const container = useRef();

  useGSAP(() => {
    // Animations are automatically cleaned up on unmount
    gsap.from('.box', { opacity: 0, y: 50, stagger: 0.1 });

  }, { scope: container }); // Scope selector to container

  return (
    <div ref={container}>
      <div className="box">Box 1</div>
      <div className="box">Box 2</div>
    </div>
  );
}
```

### With Dependencies

```jsx
function Component({ isActive }) {
  const container = useRef();

  useGSAP(() => {
    if (isActive) {
      gsap.to('.box', { x: 100 });
    } else {
      gsap.to('.box', { x: 0 });
    }
  }, { scope: container, dependencies: [isActive] });

  return <div ref={container}>...</div>;
}
```

### contextSafe for Event Handlers

```jsx
function Component() {
  const container = useRef();

  const { contextSafe } = useGSAP({ scope: container });

  // Wrap event handlers to ensure they're in context
  const handleClick = contextSafe(() => {
    gsap.to('.box', { rotation: 360, duration: 1 });
  });

  return (
    <div ref={container}>
      <div className="box" onClick={handleClick}>Click me</div>
    </div>
  );
}
```

### With ScrollTrigger

```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Section() {
  const sectionRef = useRef();

  useGSAP(() => {
    gsap.from('.content', {
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%'
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef}>
      <div className="content">...</div>
    </section>
  );
}
```

### Manual Context (Alternative)

```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Component() {
  const container = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.box', { opacity: 0, y: 50 });
    }, container);

    return () => ctx.revert(); // Cleanup
  }, []);

  return <div ref={container}>...</div>;
}
```

---

## Vue 3

### Composition API

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.box', { opacity: 0, y: 50, stagger: 0.1 });
  }, container.value);
});

onBeforeUnmount(() => {
  ctx.revert();
});
</script>

<template>
  <div ref="container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
  </div>
</template>
```

### With ScrollTrigger

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const section = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.content', {
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: section.value,
        start: 'top 80%'
      }
    });
  }, section.value);
});

onBeforeUnmount(() => {
  ctx.revert();
});
</script>

<template>
  <section ref="section">
    <div class="content">...</div>
  </section>
</template>
```

### Reactive Animations

```vue
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';

const isExpanded = ref(false);
const box = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {}, box.value);
});

watch(isExpanded, (newValue) => {
  ctx.add(() => {
    gsap.to(box.value, {
      width: newValue ? 400 : 200,
      height: newValue ? 300 : 150,
      duration: 0.5
    });
  });
});

onBeforeUnmount(() => {
  ctx.revert();
});
</script>

<template>
  <div ref="box" @click="isExpanded = !isExpanded">
    Click to toggle
  </div>
</template>
```

---

## Svelte

### Basic Usage

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';

  let container;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      gsap.from('.box', { opacity: 0, y: 50, stagger: 0.1 });
    }, container);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<div bind:this={container}>
  <div class="box">Box 1</div>
  <div class="box">Box 2</div>
</div>
```

### With ScrollTrigger

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let section;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      gsap.from('.content', {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        }
      });
    }, section);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<section bind:this={section}>
  <div class="content">...</div>
</section>
```

### Reactive with $effect (Svelte 5)

```svelte
<script>
  import gsap from 'gsap';

  let isExpanded = $state(false);
  let box;

  $effect(() => {
    const ctx = gsap.context(() => {
      gsap.to(box, {
        width: isExpanded ? 400 : 200,
        duration: 0.5
      });
    });

    return () => ctx.revert();
  });
</script>

<div bind:this={box} onclick={() => isExpanded = !isExpanded}>
  Click to toggle
</div>
```

### Svelte Action Pattern

```svelte
<script>
  import gsap from 'gsap';

  function fadeIn(node, { delay = 0, duration = 0.6 }) {
    const ctx = gsap.context(() => {
      gsap.from(node, {
        opacity: 0,
        y: 30,
        delay,
        duration
      });
    });

    return {
      destroy() {
        ctx.revert();
      }
    };
  }
</script>

<div use:fadeIn={{ delay: 0.2, duration: 0.8 }}>
  Animated content
</div>
```

---

## Vanilla JavaScript

### Module Pattern

```javascript
// animations.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPageAnimations(container) {
  const ctx = gsap.context(() => {
    // Hero animation
    gsap.from('.hero-title', {
      opacity: 0,
      y: 50,
      duration: 1
    });

    // Scroll-triggered sections
    gsap.utils.toArray('.section').forEach(section => {
      gsap.from(section.querySelectorAll('.animate'), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        }
      });
    });
  }, container);

  return () => ctx.revert();
}

// main.js
import { initPageAnimations } from './animations.js';

const cleanup = initPageAnimations(document.body);

// On SPA navigation:
// cleanup();
// initPageAnimations(newContainer);
```

### Class Pattern

```javascript
// AnimationController.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AnimationController {
  constructor(container) {
    this.container = container;
    this.ctx = null;
  }

  init() {
    this.ctx = gsap.context(() => {
      this.setupHero();
      this.setupScrollAnimations();
    }, this.container);

    return this;
  }

  setupHero() {
    gsap.from('.hero-content', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });
  }

  setupScrollAnimations() {
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      });
    });
  }

  destroy() {
    this.ctx?.revert();
  }
}

// Usage
const controller = new AnimationController(document.body).init();

// Cleanup
controller.destroy();
```

### Event-Based Pattern

```javascript
// For vanilla SPAs
import gsap from 'gsap';

class PageAnimations {
  constructor() {
    this.currentContext = null;
  }

  // Called on page change
  enter(container) {
    // Clean up previous
    this.currentContext?.revert();

    // Setup new
    this.currentContext = gsap.context(() => {
      gsap.from('.page-content', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1
      });
    }, container);
  }

  // Called before leaving
  leave(container) {
    return gsap.to(container, {
      opacity: 0,
      duration: 0.3
    });
  }
}

export const pageAnimations = new PageAnimations();
```

---

## Reduced Motion (All Frameworks)

```javascript
// Utility function
export function createAnimation(options) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    return options.full();
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    return options.reduced?.() || options.full();
  });

  return mm;
}

// Usage
createAnimation({
  full: () => gsap.from('.hero', { opacity: 0, y: 50, duration: 1 }),
  reduced: () => gsap.from('.hero', { opacity: 0, duration: 0.3 })
});
```

---

## Common Gotchas

### 1. Animations on Unmounted Elements

Always use `gsap.context()` - it prevents animating elements that no longer exist.

### 2. Multiple Contexts

Don't create multiple contexts for the same container. Use one context and add to it:

```javascript
// BAD
useEffect(() => {
  gsap.context(() => { ... }, container);
}, [dep1]);

useEffect(() => {
  gsap.context(() => { ... }, container); // Another context!
}, [dep2]);

// GOOD
useGSAP(() => {
  // All animations in one context
}, { scope: container, dependencies: [dep1, dep2] });
```

### 3. Server-Side Rendering

GSAP only runs in browser. Guard SSR:

```javascript
// React
useEffect(() => {
  // Only runs client-side
}, []);

// Vue
onMounted(() => {
  // Only runs client-side
});
```

### 4. Ref Timing

Ensure refs are populated before animating:

```javascript
// React
useGSAP(() => {
  // Runs after mount, refs are ready
}, { scope: container });

// NOT
useLayoutEffect(() => {
  gsap.to(ref.current, { ... }); // ref might not be ready
}, []);
```

---

## Svelte 5 Action Pattern

Svelte actions are the most ergonomic way to use GSAP in Svelte. An action is a function that receives a DOM node and returns `{ destroy() }` — which is exactly what our GSAP utilities already return.

### How It Works

```javascript
// gsap-utils.js — each utility IS a Svelte action
export function reveal(node, opts = {}) {
  const ctx = gsap.context(() => {
    // ... animation setup
  });

  return {
    destroy() {
      ctx.revert();
    }
  };
}
```

### Usage in Components

```svelte
<script>
  import { reveal, staggerReveal, splitReveal, parallax } from '$lib/utils/gsap';
</script>

<!-- Single element reveal -->
<div use:reveal>Fades up on scroll</div>
<div use:reveal={{ delay: 0.2, y: 50 }}>With options</div>

<!-- Children stagger -->
<div use:staggerReveal={{ stagger: 0.1 }}>
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- SplitText reveal -->
<h1 use:splitReveal>Hero Headline</h1>
<h2 use:splitReveal={{ type: 'chars', mask: false }}>Character Reveal</h2>

<!-- Parallax -->
<img use:parallax={{ speed: 0.2 }} src="hero.jpg" alt="" />
```

### Key Benefits

1. **Automatic cleanup**: Svelte calls `destroy()` on component unmount — `gsap.context().revert()` cleans up all animations and ScrollTriggers
2. **Reactive options**: Pass different opts per instance
3. **No lifecycle boilerplate**: No `onMount`/`onDestroy` needed
4. **Composable**: Stack multiple actions on one element: `<div use:reveal use:parallax>`
