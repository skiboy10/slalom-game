# Flip Plugin

Animate layout changes seamlessly using the FLIP technique (First, Last, Invert, Play).

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [State Management](#state-management)
3. [Layout Transitions](#layout-transitions)
4. [Filtering & Sorting](#filtering--sorting)
5. [Enter & Leave Animations](#enter--leave-animations)
6. [With ScrollTrigger](#with-scrolltrigger)

---

## Basic Usage

```javascript
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);
```

### The FLIP Pattern

```javascript
// 1. Capture the FIRST state
const state = Flip.getState('.items');

// 2. Make DOM changes (the LAST state happens automatically)
items.forEach(item => container.appendChild(item));  // Reorder
// or
element.classList.toggle('expanded');  // Style change
// or
newContainer.appendChild(element);  // Move to new parent

// 3. INVERT and PLAY - Flip handles this
Flip.from(state, {
  duration: 0.6,
  ease: 'power2.inOut'
});
```

---

## State Management

### Basic State Capture

```javascript
// Capture position, size, and transforms
const state = Flip.getState('.item');
```

### With Specific Properties

```javascript
const state = Flip.getState('.item', {
  props: 'backgroundColor,borderRadius,boxShadow',  // Include these CSS properties
  simple: true  // Faster, only captures x/y (no scale/rotation)
});
```

### Multiple Elements

```javascript
// Array of elements
const state = Flip.getState([element1, element2, element3]);

// Mixed selectors and elements
const state = Flip.getState('.card, .header, #special');
```

### Nested State

```javascript
// Capture parent and children separately
const state = Flip.getState('.container, .container > *', {
  nested: true  // Track parent-child relationships
});
```

---

## Layout Transitions

### Expand/Collapse Card

```javascript
const card = document.querySelector('.card');

card.addEventListener('click', () => {
  const state = Flip.getState(card);

  card.classList.toggle('expanded');

  Flip.from(state, {
    duration: 0.5,
    ease: 'power2.inOut'
  });
});
```

```css
.card {
  width: 300px;
  height: 200px;
}

.card.expanded {
  width: 100%;
  height: auto;
  min-height: 400px;
}
```

### Grid to List Toggle

```javascript
const toggleBtn = document.querySelector('.toggle-view');
const container = document.querySelector('.items-container');

toggleBtn.addEventListener('click', () => {
  const state = Flip.getState('.item');

  container.classList.toggle('list-view');

  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut',
    stagger: 0.03
  });
});
```

### Move Element Between Containers

```javascript
function moveItem(item, targetContainer) {
  const state = Flip.getState(item);

  targetContainer.appendChild(item);

  Flip.from(state, {
    duration: 0.5,
    ease: 'power2.inOut'
  });
}
```

---

## Filtering & Sorting

### Filter Items

```javascript
const items = gsap.utils.toArray('.item');
const filterBtns = gsap.utils.toArray('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    const state = Flip.getState(items);

    items.forEach(item => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.style.display = matches ? 'block' : 'none';
    });

    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.03,
      absolute: true,  // Use absolute positioning during animation
      onEnter: elements => gsap.from(elements, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4
      }),
      onLeave: elements => gsap.to(elements, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4
      })
    });
  });
});
```

### Sort Items

```javascript
const container = document.querySelector('.items-container');
const items = gsap.utils.toArray('.item');

function sortItems(property, direction = 'asc') {
  const state = Flip.getState(items);

  // Sort the array
  items.sort((a, b) => {
    const aVal = a.dataset[property];
    const bVal = b.dataset[property];
    return direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Reorder DOM
  items.forEach(item => container.appendChild(item));

  // Animate
  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut',
    stagger: 0.02
  });
}
```

### Shuffle

```javascript
function shuffleItems() {
  const items = gsap.utils.toArray('.item');
  const state = Flip.getState(items);

  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    items[i].parentNode.insertBefore(items[j], items[i]);
  }

  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut',
    stagger: 0.02
  });
}
```

---

## Enter & Leave Animations

### onEnter and onLeave Callbacks

```javascript
Flip.from(state, {
  duration: 0.6,
  stagger: 0.03,

  // Elements entering (weren't in original state)
  onEnter: elements => {
    return gsap.from(elements, {
      opacity: 0,
      scale: 0,
      duration: 0.4,
      stagger: 0.02
    });
  },

  // Elements leaving (were in state, now hidden/removed)
  onLeave: elements => {
    return gsap.to(elements, {
      opacity: 0,
      scale: 0,
      duration: 0.3
    });
  }
});
```

### Custom Enter Animation

```javascript
Flip.from(state, {
  duration: 0.5,
  onEnter: elements => gsap.from(elements, {
    opacity: 0,
    scale: 0.5,
    rotation: -180,
    duration: 0.6,
    ease: 'back.out(1.7)'
  })
});
```

### Fading Out Hidden Elements

```javascript
// When filtering hides elements
Flip.from(state, {
  onLeave: elements => gsap.to(elements, {
    opacity: 0,
    y: -30,
    duration: 0.3,
    onComplete: () => {
      // Optionally remove from DOM
      elements.forEach(el => el.remove());
    }
  })
});
```

---

## With ScrollTrigger

### Scroll-Triggered Layout Change

```javascript
const cards = gsap.utils.toArray('.card');

ScrollTrigger.create({
  trigger: '.cards-section',
  start: 'top center',
  onEnter: () => {
    const state = Flip.getState(cards);

    document.querySelector('.cards-container').classList.add('expanded');

    Flip.from(state, {
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: 0.05
    });
  },
  once: true
});
```

### Reveal with Layout Change

```javascript
const items = gsap.utils.toArray('.reveal-item');

items.forEach(item => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top 80%',
    onEnter: () => {
      const state = Flip.getState(item);

      item.classList.add('revealed');

      Flip.from(state, {
        duration: 0.6,
        ease: 'power3.out'
      });
    },
    once: true
  });
});
```

---

## Advanced Options

### Full Options Reference

```javascript
Flip.from(state, {
  // Timing
  duration: 0.6,
  ease: 'power2.inOut',
  stagger: 0.03,
  delay: 0,

  // Positioning
  absolute: true,      // Use absolute positioning during animation
  scale: true,         // Animate scale changes
  simple: false,       // Disable rotation/skew detection

  // Callbacks
  onEnter: elements => {},
  onLeave: elements => {},
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},

  // Advanced
  props: 'backgroundColor,borderRadius',  // Extra CSS properties to animate
  prune: true,         // Remove elements that haven't changed
  spin: true,          // Allow rotation > 180deg to take shortest path
  nested: true,        // Handle nested elements

  // ScrollTrigger integration
  scrollTrigger: {
    trigger: '.section',
    start: 'top center'
  }
});
```

### Flip.fit() for Direct Positioning

```javascript
// Instantly position element to match another element's bounds
Flip.fit('.element', '.target');

// With options
Flip.fit('.element', '.target', {
  scale: true,
  duration: 0  // Instant
});
```

### Flip.getState() vs Flip.from()

```javascript
// getState captures current state
const state = Flip.getState('.items');

// from() animates FROM the captured state TO current
Flip.from(state, { duration: 0.5 });

// to() animates FROM current TO a state (less common)
Flip.to(state, { duration: 0.5 });
```

---

## Reduced Motion

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Full Flip animations
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const state = Flip.getState(items);
      // ... filter logic
      Flip.from(state, { duration: 0.6, stagger: 0.03 });
    });
  });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Instant layout changes
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Just change the layout without animation
      // ... filter logic
    });
  });
});
```

---

## Performance Tips

1. **Use `absolute: true`** for smoother animations (prevents layout thrashing)
2. **Limit elements** - Flip works best with <50 elements
3. **Use `simple: true`** when you don't need rotation/skew detection
4. **Batch state capture** - Capture once, even if multiple changes

```javascript
// GOOD - Single state capture
const state = Flip.getState('.items');
item1.classList.add('active');
item2.classList.remove('active');
container.appendChild(newItem);
Flip.from(state, { duration: 0.5 });

// BAD - Multiple captures
const state1 = Flip.getState(item1);
item1.classList.add('active');
Flip.from(state1);
// ... repeated for each change
```

---

## Common Patterns

### Tab Content Switch

```javascript
const tabs = gsap.utils.toArray('.tab');
const panels = gsap.utils.toArray('.panel');

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    const state = Flip.getState(panels);

    // Hide all panels
    panels.forEach(p => p.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    // Show selected
    panels[i].classList.add('active');
    tab.classList.add('active');

    Flip.from(state, {
      duration: 0.4,
      ease: 'power2.inOut',
      onEnter: els => gsap.from(els, { opacity: 0, y: 20 }),
      onLeave: els => gsap.to(els, { opacity: 0, y: -20 })
    });
  });
});
```

### Lightbox Open/Close

```javascript
function openLightbox(thumbnail) {
  const state = Flip.getState(thumbnail);

  // Move thumbnail to lightbox container
  lightboxContainer.appendChild(thumbnail);
  thumbnail.classList.add('lightbox-active');

  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut'
  });
}

function closeLightbox(thumbnail, originalContainer) {
  const state = Flip.getState(thumbnail);

  originalContainer.appendChild(thumbnail);
  thumbnail.classList.remove('lightbox-active');

  Flip.from(state, {
    duration: 0.5,
    ease: 'power2.inOut'
  });
}
```
