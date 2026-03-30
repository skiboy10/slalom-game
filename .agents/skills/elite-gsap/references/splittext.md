# SplitText

Split text into characters, words, and lines for animation.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Split Types](#split-types)
3. [Animation Patterns](#animation-patterns)
4. [Masked Reveals](#masked-reveals)
5. [Scroll-Triggered Text](#scroll-triggered-text)
6. [Responsive Handling](#responsive-handling)

---

## Basic Setup

```javascript
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);
```

### Basic Split

```javascript
const split = new SplitText('.headline', {
  type: 'chars,words,lines'
});

console.log(split.chars);  // Array of character elements
console.log(split.words);  // Array of word elements
console.log(split.lines);  // Array of line elements

// Animate
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.02,
  duration: 0.8
});

// IMPORTANT: Revert when done to restore original HTML
split.revert();
```

---

## Split Types

### Characters Only

```javascript
const split = new SplitText('.text', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: 20,
  rotationX: -90,
  stagger: 0.02
});
```

### Words Only

```javascript
const split = new SplitText('.text', { type: 'words' });

gsap.from(split.words, {
  opacity: 0,
  y: 30,
  stagger: 0.05
});
```

### Lines Only

```javascript
const split = new SplitText('.text', { type: 'lines' });

gsap.from(split.lines, {
  opacity: 0,
  y: 50,
  stagger: 0.1
});
```

### Combined (All Three)

```javascript
const split = new SplitText('.text', { type: 'chars,words,lines' });

// Access each level
split.chars;  // Individual characters
split.words;  // Words (contain chars)
split.lines;  // Lines (contain words)
```

### With Custom Classes

```javascript
const split = new SplitText('.text', {
  type: 'chars,words,lines',
  charsClass: 'char',
  wordsClass: 'word',
  linesClass: 'line'
});
```

---

## Animation Patterns

### Character Cascade

```javascript
const split = new SplitText('.headline', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  rotationX: -90,
  stagger: 0.02,
  duration: 0.8,
  ease: 'power4.out'
});
```

### Wave Effect

```javascript
const split = new SplitText('.headline', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: 100,
  stagger: {
    each: 0.02,
    from: 'center'  // Wave from center
  },
  duration: 0.8,
  ease: 'power4.out'
});
```

### Random Reveal

```javascript
const split = new SplitText('.headline', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: gsap.utils.random(-100, 100),
  rotation: gsap.utils.random(-45, 45),
  stagger: {
    each: 0.02,
    from: 'random'
  },
  duration: 0.6,
  ease: 'power3.out'
});
```

### Word by Word

```javascript
const split = new SplitText('.paragraph', { type: 'words' });

gsap.from(split.words, {
  opacity: 0,
  y: 20,
  stagger: 0.05,
  duration: 0.5,
  ease: 'power2.out'
});
```

### Line by Line

```javascript
const split = new SplitText('.text-block', { type: 'lines' });

gsap.from(split.lines, {
  opacity: 0,
  y: 40,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out'
});
```

### 3D Flip Characters

```javascript
const split = new SplitText('.headline', { type: 'chars' });

// Set perspective on parent
gsap.set('.headline', { perspective: 400 });

gsap.from(split.chars, {
  opacity: 0,
  rotationY: 90,
  transformOrigin: '50% 50% -50',
  stagger: 0.02,
  duration: 0.8,
  ease: 'power4.out'
});
```

---

## Masked Reveals

The most premium text animation pattern.

### Line Mask Reveal

```javascript
const split = new SplitText('.headline', {
  type: 'lines',
  linesClass: 'line'
});

// Wrap each line in overflow:hidden container
split.lines.forEach(line => {
  const wrapper = document.createElement('div');
  wrapper.style.overflow = 'hidden';
  line.parentNode.insertBefore(wrapper, line);
  wrapper.appendChild(line);
});

gsap.from(split.lines, {
  yPercent: 100,
  duration: 1,
  stagger: 0.1,
  ease: 'power4.out'
});
```

### With SplitText Mask Option (2026)

```javascript
const split = new SplitText('.headline', {
  type: 'lines',
  mask: true  // Built-in masking
});

gsap.from(split.lines, {
  yPercent: 100,
  duration: 1,
  stagger: 0.1,
  ease: 'power4.out'
});
```

### Word Mask Reveal

```javascript
const split = new SplitText('.text', {
  type: 'words',
  wordsClass: 'word'
});

// Wrap words in mask containers
split.words.forEach(word => {
  const wrapper = document.createElement('span');
  wrapper.style.display = 'inline-block';
  wrapper.style.overflow = 'hidden';
  wrapper.style.verticalAlign = 'top';
  word.parentNode.insertBefore(wrapper, word);
  wrapper.appendChild(word);
});

gsap.from(split.words, {
  yPercent: 100,
  duration: 0.8,
  stagger: 0.03,
  ease: 'power4.out'
});
```

---

## Scroll-Triggered Text

### Basic Scroll Reveal

```javascript
const split = new SplitText('.headline', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.02,
  duration: 0.8,
  scrollTrigger: {
    trigger: '.headline',
    start: 'top 80%',
    toggleActions: 'play none none none'
  }
});
```

### Scrubbed Text Reveal

```javascript
const split = new SplitText('.scroll-text', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0.2,
  stagger: 0.05,
  scrollTrigger: {
    trigger: '.scroll-text',
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: true
  }
});
```

### Per-Section Headlines

```javascript
gsap.utils.toArray('.section-title').forEach(title => {
  const split = new SplitText(title, { type: 'chars,words' });

  gsap.from(split.chars, {
    opacity: 0,
    y: 30,
    stagger: 0.02,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 85%'
    }
  });
});
```

---

## Responsive Handling

### Revert and Re-split on Resize

```javascript
let split;

function initSplit() {
  // Revert previous split
  if (split) split.revert();

  // Create new split
  split = new SplitText('.headline', { type: 'lines' });

  // Animate
  gsap.from(split.lines, {
    opacity: 0,
    y: 40,
    stagger: 0.1
  });
}

initSplit();

// Debounced resize handler
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initSplit, 250);
});
```

### With ScrollTrigger Refresh

```javascript
let split;

function setupTextAnimation() {
  if (split) split.revert();

  split = new SplitText('.headline', { type: 'lines' });

  gsap.from(split.lines, {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.headline',
      start: 'top 80%'
    }
  });
}

setupTextAnimation();

// On resize, revert and refresh
ScrollTrigger.addEventListener('refresh', setupTextAnimation);
```

### MediaQuery-Based Split

```javascript
const mm = gsap.matchMedia();

mm.add('(min-width: 768px)', () => {
  // Desktop: Character animation
  const split = new SplitText('.headline', { type: 'chars' });

  gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    stagger: 0.02
  });

  return () => split.revert();  // Cleanup on media query change
});

mm.add('(max-width: 767px)', () => {
  // Mobile: Simpler word animation
  const split = new SplitText('.headline', { type: 'words' });

  gsap.from(split.words, {
    opacity: 0,
    y: 20,
    stagger: 0.05
  });

  return () => split.revert();
});
```

---

## Reduced Motion

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const split = new SplitText('.headline', { type: 'chars' });

  gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    stagger: 0.02,
    duration: 0.8
  });

  return () => split.revert();
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Simple fade, no split needed
  gsap.from('.headline', {
    opacity: 0,
    duration: 0.3
  });
});
```

---

## Performance Tips

1. **Limit character count** - Splitting 1000+ characters can be slow
2. **Use lines for long text** - More efficient than individual characters
3. **Revert when done** - Restore original HTML to reduce DOM nodes
4. **Debounce resize** - Don't re-split on every resize event
5. **Use context for cleanup** - Ensures proper memory management

```javascript
const ctx = gsap.context(() => {
  const split = new SplitText('.headline', { type: 'chars' });

  gsap.from(split.chars, { opacity: 0, y: 50 });

  // Split will be reverted when context reverts
  return () => split.revert();
});

// Later: ctx.revert() cleans up everything
```

---

## Troubleshooting

### Text Reflowing After Split

Lines can shift when split. Solutions:

1. Use fixed width container
2. Set `whiteSpace: nowrap` on parent
3. Call `split.revert()` after animation if needed

### Accessibility

Screen readers see the DOM structure. For complex splits:

```html
<h1 aria-label="Hello World">
  <span class="headline" aria-hidden="true">Hello World</span>
</h1>
```

### Inline vs Block Elements

SplitText works best with block-level text elements. For inline elements:

```css
.split-target {
  display: inline-block;  /* or block */
}
```

---

## SplitText Mask Mode (GSAP 3.14+)

GSAP 3.14 introduced built-in mask support for SplitText, eliminating the need for manual `overflow: hidden` wrapper divs.

### How Mask Works

```javascript
const split = new SplitText(element, {
  type: 'words',
  mask: 'words'  // Creates overflow mask per word
});

// Slide words up from below the mask
gsap.from(split.words, {
  yPercent: 110,    // 110% pushes text fully below mask
  duration: 0.8,
  stagger: 0.04,
  ease: 'power4.out'
});
```

With `mask: 'words'`, each word gets an `overflow: hidden` container automatically. Animating `yPercent: 110` slides the text up from behind this mask — no `opacity` change needed.

### Mask vs Non-Mask Comparison

```javascript
// MASK MODE: Clean "reveal from behind" effect
gsap.from(split.words, {
  yPercent: 110,         // No opacity needed
  duration: 0.8,
  stagger: 0.04,
  ease: 'power4.out'
});

// NON-MASK MODE: Traditional fade + slide
gsap.from(split.words, {
  y: 20,
  opacity: 0,           // Opacity needed
  duration: 0.8,
  stagger: 0.04,
  ease: 'power4.out'
});
```

**Mask mode** creates a more polished, editorial reveal. The text appears to slide into place from a hidden position, with a sharp clip edge rather than a soft opacity fade.

### Production Pattern with Reduced Motion

```javascript
function splitReveal(element, opts = {}) {
  const { mask = true, type = 'words' } = opts;
  let split = null;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      split = new SplitText(element, {
        type,
        ...(mask && { mask: type })
      });

      const targets = type === 'chars' ? split.chars :
                      type === 'lines' ? split.lines : split.words;

      gsap.from(targets, {
        ...(mask ? { yPercent: 110 } : { y: 20, opacity: 0 }),
        duration: 0.8,
        stagger: 0.04,
        ease: 'power4.out'
      });

      return () => split?.revert();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Instant appearance
      gsap.from(element, { opacity: 0, duration: 0.01 });
    });
  });

  return () => {
    split?.revert();
    ctx.revert();
  };
}
```
