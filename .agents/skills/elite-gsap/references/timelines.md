# Timelines

Orchestrate complex animation sequences.

## Table of Contents

1. [Basic Timeline](#basic-timeline)
2. [Position Parameter](#position-parameter)
3. [Labels](#labels)
4. [Defaults](#defaults)
5. [Control Methods](#control-methods)
6. [Nested Timelines](#nested-timelines)
7. [Common Patterns](#common-patterns)

---

## Basic Timeline

```javascript
const tl = gsap.timeline();

// Sequential by default
tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { x: 100, duration: 1 })
  .to('.box3', { x: 100, duration: 1 });

// Total duration: 3 seconds (1 + 1 + 1)
```

### Why Timelines?

1. **Sequencing** - Animations play in order automatically
2. **Control** - Play, pause, reverse, seek the whole sequence
3. **Organization** - Group related animations logically
4. **Reusability** - Create animation functions that return timelines

---

## Position Parameter

The position parameter controls WHEN an animation starts within the timeline.

### Absolute Time

```javascript
tl.to('.a', { x: 100 }, 0)     // Start at 0 seconds
  .to('.b', { x: 100 }, 1)     // Start at 1 second
  .to('.c', { x: 100 }, 0.5);  // Start at 0.5 seconds
```

### Relative to End

```javascript
tl.to('.a', { x: 100 })
  .to('.b', { x: 100 }, '+=1')   // 1 second AFTER previous ends
  .to('.c', { x: 100 }, '-=0.5') // 0.5 seconds BEFORE previous ends (overlap)
  .to('.d', { x: 100 }, '+=0');  // Immediately after previous (same as no position)
```

### Relative to Start

```javascript
tl.to('.a', { x: 100, duration: 2 })
  .to('.b', { x: 100 }, '<')       // Same START time as previous
  .to('.c', { x: 100 }, '<0.5')    // 0.5s after previous STARTS
  .to('.d', { x: 100 }, '<+=1');   // 1s after previous STARTS
```

### Relative to End (Shorthand)

```javascript
tl.to('.a', { x: 100, duration: 2 })
  .to('.b', { x: 100 }, '>')       // When previous ENDS
  .to('.c', { x: 100 }, '>-0.5');  // 0.5s before previous ENDS
```

### Percentage

```javascript
tl.to('.a', { x: 100 }, '25%')   // 25% through the timeline
  .to('.b', { x: 100 }, '50%');  // 50% through the timeline
```

---

## Labels

Labels make complex timelines more readable and maintainable.

### Adding Labels

```javascript
const tl = gsap.timeline();

tl.addLabel('start')
  .to('.hero-title', { opacity: 1, y: 0 })
  .to('.hero-subtitle', { opacity: 1, y: 0 }, '-=0.3')
  .addLabel('contentStart')
  .to('.content', { opacity: 1 })
  .addLabel('end');

// Later: tl.seek('contentStart');
```

### Using Labels as Positions

```javascript
const tl = gsap.timeline();

tl.addLabel('intro')
  .to('.a', { x: 100 })
  .addLabel('middle')
  .to('.b', { x: 100 })
  .addLabel('outro')
  .to('.c', { x: 100 });

// Insert at labels
tl.to('.d', { y: 50 }, 'intro')        // At 'intro' label
tl.to('.e', { y: 50 }, 'middle+=0.5')  // 0.5s after 'middle'
tl.to('.f', { y: 50 }, 'outro-=0.3');  // 0.3s before 'outro'
```

---

## Defaults

Set defaults to avoid repetition.

```javascript
const tl = gsap.timeline({
  defaults: {
    duration: 0.8,
    ease: 'power3.out'
  }
});

// All animations inherit defaults
tl.from('.title', { opacity: 0, y: 50 })    // duration: 0.8, ease: power3.out
  .from('.subtitle', { opacity: 0, y: 30 })  // duration: 0.8, ease: power3.out
  .from('.cta', { opacity: 0, y: 20, duration: 0.5 }); // Override: duration: 0.5
```

### Global Defaults

```javascript
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6
});

// Affects all tweens and timelines
```

---

## Control Methods

### Basic Control

```javascript
const tl = gsap.timeline({ paused: true });

tl.to('.box', { x: 100 })
  .to('.box', { y: 100 });

// Control
tl.play();          // Start playing
tl.pause();         // Pause
tl.resume();        // Resume from paused position
tl.reverse();       // Play backwards
tl.restart();       // Start from beginning
tl.kill();          // Remove timeline completely
```

### Seeking

```javascript
tl.seek(2);           // Jump to 2 seconds
tl.seek('labelName'); // Jump to label
tl.progress(0.5);     // Jump to 50%
tl.time(1.5);         // Jump to 1.5 seconds (same as seek)
```

### Speed Control

```javascript
tl.timeScale(2);      // 2x speed
tl.timeScale(0.5);    // Half speed
tl.timeScale(-1);     // Reverse at normal speed
```

### Getting Info

```javascript
tl.duration();        // Total duration
tl.time();            // Current time
tl.progress();        // Current progress (0-1)
tl.isActive();        // Is playing?
tl.paused();          // Is paused?
```

---

## Nested Timelines

### Creating Reusable Animations

```javascript
function createHeroAnimation() {
  const tl = gsap.timeline();

  return tl
    .from('.hero-title', { opacity: 0, y: 50, duration: 1 })
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
    .from('.hero-cta', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
}

function createContentAnimation() {
  const tl = gsap.timeline();

  return tl
    .from('.content-heading', { opacity: 0, y: 30 })
    .from('.content-text', { opacity: 0 }, '-=0.3')
    .from('.content-image', { opacity: 0, scale: 0.9 }, '-=0.2');
}

// Master timeline
const master = gsap.timeline();

master
  .add(createHeroAnimation())
  .add(createContentAnimation(), '-=0.5');  // Overlap by 0.5s
```

### Position Nested Timelines

```javascript
const master = gsap.timeline();

const introTL = gsap.timeline();
const mainTL = gsap.timeline();
const outroTL = gsap.timeline();

master
  .add(introTL, 0)                    // At 0 seconds
  .add(mainTL, 'intro+=1')            // 1 second after intro label
  .add(outroTL, '-=0.5');             // 0.5 seconds before mainTL ends
```

---

## Common Patterns

### Page Load Animation

```javascript
function createPageLoadAnimation() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 0.8 }
  });

  return tl
    .from('.logo', { opacity: 0, y: -20 })
    .from('.nav-item', { opacity: 0, y: -20, stagger: 0.1 }, '-=0.5')
    .from('.hero-content', { opacity: 0, y: 50 }, '-=0.3')
    .from('.hero-image', { opacity: 0, scale: 0.9 }, '<0.2');
}

// Run on load
createPageLoadAnimation();
```

### Hover Animation

```javascript
function createHoverAnimation(element) {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    duration: 0.3
  })
  .to(element.querySelector('.icon'), {
    rotation: 360,
    duration: 0.5
  }, 0);

  return tl;
}

// Apply to elements
document.querySelectorAll('.card').forEach(card => {
  const animation = createHoverAnimation(card);

  card.addEventListener('mouseenter', () => animation.play());
  card.addEventListener('mouseleave', () => animation.reverse());
});
```

### Section Reveal

```javascript
function createSectionReveal(section) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    defaults: { duration: 0.6, ease: 'power3.out' }
  });

  return tl
    .from(section.querySelector('.section-title'), { opacity: 0, y: 50 })
    .from(section.querySelectorAll('.section-item'), {
      opacity: 0,
      y: 30,
      stagger: 0.1
    }, '-=0.3');
}

// Apply to all sections
gsap.utils.toArray('.section').forEach(createSectionReveal);
```

### Modal Animation

```javascript
function createModalAnimation(modal) {
  const tl = gsap.timeline({ paused: true });

  tl.to(modal, { autoAlpha: 1, duration: 0.3 })
    .from(modal.querySelector('.modal-content'), {
      scale: 0.9,
      y: 50,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, '-=0.1');

  return tl;
}

const modal = document.querySelector('.modal');
const modalAnimation = createModalAnimation(modal);

// Open
openBtn.addEventListener('click', () => modalAnimation.play());

// Close
closeBtn.addEventListener('click', () => modalAnimation.reverse());
```

---

## Reduced Motion

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const tl = gsap.timeline();

  tl.from('.hero', { opacity: 0, y: 50, duration: 1 })
    .from('.content', { opacity: 0, duration: 0.8 }, '-=0.5');
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Simple fade only
  const tl = gsap.timeline();

  tl.from('.hero, .content', { opacity: 0, duration: 0.3 });
});
```

---

## Tips

1. **Return timelines** from functions for reusability
2. **Use defaults** to reduce repetition
3. **Use labels** for complex sequences
4. **Nest timelines** for modular code
5. **Pause initially** for controlled playback
6. **Store references** if you need to control later

```javascript
// Store for later control
const pageAnimation = createPageLoadAnimation();

// Can control from anywhere
document.querySelector('.replay-btn').addEventListener('click', () => {
  pageAnimation.restart();
});
```
