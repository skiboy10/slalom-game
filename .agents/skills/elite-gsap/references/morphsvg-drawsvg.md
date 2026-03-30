# MorphSVG & DrawSVG

SVG path animations for morphing shapes and drawing strokes.

## Table of Contents

1. [DrawSVG Setup](#drawsvg-setup)
2. [Drawing Strokes](#drawing-strokes)
3. [MorphSVG Setup](#morphsvg-setup)
4. [Morphing Shapes](#morphing-shapes)
5. [Combined Patterns](#combined-patterns)

---

## DrawSVG Setup

```javascript
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);
```

### SVG Requirements

DrawSVG works on stroked paths, not fills:

```html
<svg viewBox="0 0 100 100">
  <path
    d="M10 50 L90 50"
    fill="none"
    stroke="#000"
    stroke-width="2"
  />
</svg>
```

---

## Drawing Strokes

### Basic Draw Animation

```javascript
// Draw from 0% to 100%
gsap.from('.line', {
  drawSVG: 0,
  duration: 2,
  ease: 'power2.inOut'
});

// Or use fromTo for clarity
gsap.fromTo('.line',
  { drawSVG: '0%' },
  { drawSVG: '100%', duration: 2 }
);
```

### Draw from Center

```javascript
gsap.from('.line', {
  drawSVG: '50% 50%',  // Starts at center, expands outward
  duration: 1.5,
  ease: 'power2.out'
});
```

### Draw Partial

```javascript
// Draw only 50% of the path
gsap.to('.line', {
  drawSVG: '25% 75%',  // Draw middle 50%
  duration: 1
});
```

### Animated Position

```javascript
// Move the drawn portion along the path
gsap.fromTo('.line',
  { drawSVG: '0% 10%' },  // 10% segment at start
  { drawSVG: '90% 100%', duration: 2, ease: 'power1.inOut' }  // Move to end
);
```

### Logo Reveal

```javascript
// Common pattern: draw all paths in logo
const paths = gsap.utils.toArray('.logo path');

gsap.from(paths, {
  drawSVG: 0,
  duration: 1.5,
  stagger: 0.2,
  ease: 'power2.inOut'
});
```

### Handwriting Effect

```javascript
// Single continuous path for handwriting
gsap.from('.signature', {
  drawSVG: 0,
  duration: 3,
  ease: 'none'  // Linear for consistent speed
});
```

---

## MorphSVG Setup

```javascript
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);
```

---

## Morphing Shapes

### Basic Morph

```javascript
// Morph one shape into another
gsap.to('#circle', {
  morphSVG: '#square',
  duration: 1,
  ease: 'power2.inOut'
});
```

### Morph Using Path Data

```javascript
// Morph to inline path data
gsap.to('#shape', {
  morphSVG: 'M10,50 L50,10 L90,50 L50,90 Z',
  duration: 1
});
```

### Multiple States

```javascript
const tl = gsap.timeline({ repeat: -1 });

tl.to('#shape', { morphSVG: '#state2', duration: 1 })
  .to('#shape', { morphSVG: '#state3', duration: 1 })
  .to('#shape', { morphSVG: '#state1', duration: 1 });
```

### Morph with Origin Control

```javascript
gsap.to('#shape', {
  morphSVG: {
    shape: '#target',
    origin: '50% 50%',  // Morph from center
    // origin: 'left top'
    // origin: '0% 100%'
  },
  duration: 1.5
});
```

### Shape Matching

```javascript
// Control how points are mapped
gsap.to('#complex-shape', {
  morphSVG: {
    shape: '#target',
    shapeIndex: 'auto',  // Automatically find best match
    // shapeIndex: 2,    // Start at specific point index
    // shapeIndex: -1,   // Reverse direction
  },
  duration: 1
});

// Preview shape index options
MorphSVGPlugin.pathDataToBezier('#path1').shapeIndex;
```

---

## Combined Patterns

### Draw then Morph

```javascript
const tl = gsap.timeline();

// First draw the shape
tl.from('#icon', {
  drawSVG: 0,
  duration: 1,
  ease: 'power2.out'
})
// Then morph it
.to('#icon', {
  morphSVG: '#icon-active',
  duration: 0.5,
  ease: 'power2.inOut'
});
```

### Icon State Transitions

```javascript
// Hamburger to X animation
const menuIcon = document.querySelector('.menu-icon');
let isOpen = false;

menuIcon.addEventListener('click', () => {
  isOpen = !isOpen;

  if (isOpen) {
    gsap.to('.line-1', { morphSVG: '.x-line-1', duration: 0.3 });
    gsap.to('.line-2', { drawSVG: 0, duration: 0.15 });
    gsap.to('.line-3', { morphSVG: '.x-line-2', duration: 0.3 });
  } else {
    gsap.to('.line-1', { morphSVG: '.line-1-default', duration: 0.3 });
    gsap.to('.line-2', { drawSVG: '100%', duration: 0.15, delay: 0.15 });
    gsap.to('.line-3', { morphSVG: '.line-3-default', duration: 0.3 });
  }
});
```

### Loading Animation

```javascript
function createLoader() {
  const tl = gsap.timeline({ repeat: -1 });

  tl.to('.loader-shape', {
    morphSVG: '.loader-state-2',
    duration: 0.5
  })
  .to('.loader-shape', {
    morphSVG: '.loader-state-3',
    duration: 0.5
  })
  .to('.loader-shape', {
    morphSVG: '.loader-state-1',
    duration: 0.5
  });

  return tl;
}
```

### Scroll-Triggered Draw

```javascript
gsap.from('.svg-illustration path', {
  drawSVG: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.illustration-section',
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 1
  }
});
```

### Scroll-Triggered Morph

```javascript
gsap.to('.morphing-shape', {
  morphSVG: '#final-shape',
  scrollTrigger: {
    trigger: '.morph-section',
    start: 'top center',
    end: 'bottom center',
    scrub: true
  }
});
```

---

## Reduced Motion

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.logo path', {
    drawSVG: 0,
    duration: 2,
    stagger: 0.2
  });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Just show the final state
  gsap.set('.logo path', { drawSVG: '100%' });
});
```

---

## Tips

### Preparing SVGs

1. **Outline strokes** - Convert text to paths
2. **Simplify paths** - Fewer points = smoother morphs
3. **Match point counts** - Similar point counts morph better
4. **Single paths** - Combine shapes when possible

### Performance

1. **Limit complexity** - Complex paths can be slow
2. **Use `will-change`** - Add to animated SVG elements
3. **Reduce point count** - Simplify in Illustrator/Figma

### Debug MorphSVG

```javascript
// Visualize control points
MorphSVGPlugin.convertToPath('#rect');  // Convert shapes to paths

// Check path compatibility
console.log(MorphSVGPlugin.pathDataToBezier('#path1'));
```

### Converting Shapes

```javascript
// Convert non-path elements (rect, circle, etc.) to paths
MorphSVGPlugin.convertToPath('circle, rect, ellipse, polygon');

// Then morph them
gsap.to('#converted-circle', {
  morphSVG: '#converted-rect',
  duration: 1
});
```

---

## Real-World DrawSVG: Hand-Drawn Arrow

A production pattern combining DrawSVG with center-based stagger for a playful, organic animation sequence (used on a mental health clinic site to convey warmth).

### The Animation Sequence

1. Specialty pills stagger in from center outward
2. Hand-drawn SVG arrow draws itself with `drawSVG`
3. Logo card springs in with `back.out` easing

```javascript
const ctx = gsap.context(() => {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        once: true
      }
    });

    // 1. Pills stagger from center
    tl.from(pills, {
      opacity: 0,
      y: 15,
      scale: 0.9,
      duration: 0.5,
      stagger: { each: 0.08, from: 'center' },
      ease: 'power3.out'
    });

    // 2. Hand-drawn arrow draws itself
    tl.from(arrowPaths, {
      drawSVG: '0%',
      duration: 0.6,
      stagger: 0.3,
      ease: 'power2.inOut'
    }, '-=0.2');

    // 3. Logo card springs in
    tl.from(logoCard, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.3');
  });
});
```

### Center-Based Stagger

```javascript
stagger: { each: 0.08, from: 'center' }
```

Items animate outward from the center of the array. Creates a natural, organic expansion effect — particularly effective for tag/pill clusters where a linear left-to-right stagger feels mechanical.

### SVG Path for Hand-Drawn Arrow

```html
<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path class="arrow-path" d="M10 40 C30 38, 60 35, 90 40 C95 40, 100 42, 105 45"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path class="arrow-path" d="M95 35 L105 45 L98 52"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

Use `stroke-linecap="round"` and `stroke-linejoin="round"` for a hand-drawn feel. The wiggly curve path (using cubic Bezier control points) reinforces the organic quality.
