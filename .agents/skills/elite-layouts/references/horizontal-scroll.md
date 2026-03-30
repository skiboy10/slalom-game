# Horizontal Scroll Sections

Immersive horizontal scrolling patterns for storytelling and galleries.

## Table of Contents

1. [CSS-Only Approach](#css-only-approach)
2. [GSAP ScrollTrigger](#gsap-scrolltrigger)
3. [Progress Indicators](#progress-indicators)
4. [Content Patterns](#content-patterns)
5. [Mobile Considerations](#mobile-considerations)

---

## CSS-Only Approach

### Native Scroll with Snap

```css
.horizontal-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;  /* Firefox */
}

.horizontal-container::-webkit-scrollbar {
  display: none;  /* Chrome, Safari */
}

.horizontal-section {
  flex: 0 0 100vw;
  min-width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem);
}
```

### Partial Width Sections

```css
.horizontal-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding: 2rem;
  gap: 2rem;
}

.horizontal-card {
  flex: 0 0 min(400px, 85vw);
  scroll-snap-align: center;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 2rem;
}
```

### With Scroll Padding

```css
.horizontal-container {
  scroll-padding-inline: clamp(1rem, 5vw, 4rem);
  scroll-snap-type: x mandatory;
}

.horizontal-card {
  scroll-snap-align: start;
}

/* First and last items have extra space */
.horizontal-card:first-child {
  margin-left: clamp(1rem, 5vw, 4rem);
}

.horizontal-card:last-child {
  margin-right: clamp(1rem, 5vw, 4rem);
}
```

### Pros and Cons

**Pros:**
- No JavaScript required
- Native performance
- Touch/trackpad friendly
- Browser handles momentum

**Cons:**
- Less control over animation
- Can't pin while scrolling vertically
- Limited progress tracking
- No scrub animation support

---

## GSAP ScrollTrigger

### Basic Pinned Horizontal Scroll

```html
<section class="horizontal-wrapper">
  <div class="horizontal-track">
    <div class="horizontal-panel">Section 1</div>
    <div class="horizontal-panel">Section 2</div>
    <div class="horizontal-panel">Section 3</div>
    <div class="horizontal-panel">Section 4</div>
  </div>
</section>
```

```css
.horizontal-wrapper {
  overflow: hidden;
}

.horizontal-track {
  display: flex;
  width: max-content;
}

.horizontal-panel {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem);
}
```

```javascript
gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector('.horizontal-track');
const panels = gsap.utils.toArray('.horizontal-panel');

gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    pin: true,
    scrub: 1,
    end: () => `+=${track.scrollWidth}`,
    invalidateOnRefresh: true
  }
});
```

### With Panel Animations

```javascript
gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector('.horizontal-track');
const panels = gsap.utils.toArray('.horizontal-panel');

// Main horizontal scroll
const scrollTween = gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    pin: true,
    scrub: 1,
    end: () => `+=${track.scrollWidth}`,
    invalidateOnRefresh: true
  }
});

// Animate each panel's content
panels.forEach((panel, i) => {
  const content = panel.querySelector('.panel-content');
  const title = panel.querySelector('.panel-title');

  gsap.from(content, {
    opacity: 0,
    y: 50,
    scrollTrigger: {
      trigger: panel,
      containerAnimation: scrollTween,
      start: 'left 80%',
      end: 'left 20%',
      scrub: true
    }
  });

  gsap.from(title, {
    opacity: 0,
    x: -50,
    scrollTrigger: {
      trigger: panel,
      containerAnimation: scrollTween,
      start: 'left center',
      toggleActions: 'play none none reverse'
    }
  });
});
```

### Variable Width Panels

```css
.horizontal-panel {
  flex-shrink: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem;
}

.horizontal-panel.narrow {
  width: 50vw;
}

.horizontal-panel.medium {
  width: 75vw;
}

.horizontal-panel.wide {
  width: 100vw;
}

.horizontal-panel.extra-wide {
  width: 150vw;
}
```

### Snap Points with GSAP

```javascript
const panels = gsap.utils.toArray('.horizontal-panel');
const snapPoints = panels.map((panel, i) => {
  return i / (panels.length - 1);
});

gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    pin: true,
    scrub: 0.5,
    snap: {
      snapTo: snapPoints,
      duration: { min: 0.2, max: 0.5 },
      ease: 'power1.inOut'
    },
    end: () => `+=${track.scrollWidth}`
  }
});
```

---

## Progress Indicators

### Scroll Progress Bar

```html
<div class="horizontal-progress" aria-hidden="true">
  <div class="progress-track">
    <div class="progress-fill"></div>
  </div>
  <div class="progress-dots">
    <button class="progress-dot active" data-index="0"></button>
    <button class="progress-dot" data-index="1"></button>
    <button class="progress-dot" data-index="2"></button>
    <button class="progress-dot" data-index="3"></button>
  </div>
</div>
```

```css
.horizontal-progress {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.progress-track {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 1px;
  transform-origin: left;
  transform: scaleX(0);
}

.progress-dots {
  display: flex;
  gap: 0.75rem;
}

.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.progress-dot.active {
  background: var(--color-accent);
  transform: scale(1.2);
}
```

```javascript
const progressFill = document.querySelector('.progress-fill');
const dots = document.querySelectorAll('.progress-dot');
const panels = gsap.utils.toArray('.horizontal-panel');

ScrollTrigger.create({
  trigger: '.horizontal-wrapper',
  start: 'top top',
  end: () => `+=${track.scrollWidth}`,
  onUpdate: (self) => {
    // Update progress bar
    gsap.to(progressFill, {
      scaleX: self.progress,
      duration: 0.1,
      overwrite: true
    });

    // Update active dot
    const activeIndex = Math.round(self.progress * (panels.length - 1));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }
});

// Click to navigate
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    const progress = i / (panels.length - 1);
    const scrollTo = progress * (track.scrollWidth - window.innerWidth);
    const scrollTriggerProgress = progress * track.scrollWidth;

    gsap.to(window, {
      scrollTo: {
        y: `.horizontal-wrapper`,
        offsetY: -scrollTriggerProgress
      },
      duration: 1,
      ease: 'power2.inOut'
    });
  });
});
```

### Section Numbers

```html
<div class="section-counter">
  <span class="current">01</span>
  <span class="divider">/</span>
  <span class="total">04</span>
</div>
```

```css
.section-counter {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  z-index: 100;
}

.current {
  font-size: 2rem;
  font-weight: 700;
}

.divider, .total {
  opacity: 0.5;
}
```

```javascript
const counter = document.querySelector('.section-counter .current');

ScrollTrigger.create({
  trigger: '.horizontal-wrapper',
  start: 'top top',
  end: () => `+=${track.scrollWidth}`,
  onUpdate: (self) => {
    const index = Math.round(self.progress * (panels.length - 1)) + 1;
    counter.textContent = String(index).padStart(2, '0');
  }
});
```

---

## Content Patterns

### Project Showcase

```html
<div class="horizontal-panel project-panel">
  <div class="project-image">
    <img src="project.jpg" alt="Project name" loading="lazy">
  </div>
  <div class="project-info">
    <span class="project-number">01</span>
    <h2 class="project-title">Project Name</h2>
    <p class="project-description">Brief description of the project</p>
    <a href="#" class="project-link">View Project</a>
  </div>
</div>
```

```css
.project-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 8rem;
  align-items: center;
}

.project-image {
  border-radius: 16px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: auto;
}

.project-number {
  font-size: 0.875rem;
  font-family: var(--font-mono);
  opacity: 0.5;
}

.project-title {
  font-size: clamp(2rem, 5vw, 4rem);
  margin: 0.5rem 0 1rem;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-accent);
}
```

### Image Gallery

```html
<div class="horizontal-gallery">
  <div class="gallery-track">
    <figure class="gallery-item large">
      <img src="image1.jpg" alt="">
      <figcaption>Caption text</figcaption>
    </figure>
    <figure class="gallery-item">
      <img src="image2.jpg" alt="">
    </figure>
    <figure class="gallery-item tall">
      <img src="image3.jpg" alt="">
    </figure>
    <!-- More items -->
  </div>
</div>
```

```css
.gallery-track {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 4rem;
  height: 100vh;
}

.gallery-item {
  flex-shrink: 0;
  margin: 0;
}

.gallery-item img {
  height: 50vh;
  width: auto;
  object-fit: cover;
  border-radius: 8px;
}

.gallery-item.large img {
  height: 70vh;
}

.gallery-item.tall img {
  height: 80vh;
}

.gallery-item figcaption {
  margin-top: 1rem;
  font-size: 0.875rem;
  opacity: 0.7;
}
```

### Text-Heavy Sections

```html
<div class="horizontal-panel text-panel">
  <div class="text-content">
    <h2>Section Title</h2>
    <div class="text-columns">
      <p>First column of text content...</p>
      <p>Second column of text content...</p>
    </div>
  </div>
</div>
```

```css
.text-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-content {
  max-width: 1000px;
  padding: 0 4rem;
}

.text-content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 2rem;
}

.text-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.text-columns p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
}
```

---

## Mobile Considerations

### Disable on Mobile

```javascript
const mm = gsap.matchMedia();

mm.add('(min-width: 768px)', () => {
  // Desktop horizontal scroll
  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '.horizontal-wrapper',
      pin: true,
      scrub: 1,
      end: () => `+=${track.scrollWidth}`
    }
  });

  return () => {
    // Cleanup on resize to mobile
  };
});

mm.add('(max-width: 767px)', () => {
  // Mobile: Stack vertically
  gsap.set(track, { x: 0 });
});
```

```css
/* Mobile: Stack vertically */
@media (max-width: 767px) {
  .horizontal-track {
    flex-direction: column;
    width: 100%;
  }

  .horizontal-panel {
    width: 100%;
    height: auto;
    min-height: 100vh;
  }
}
```

### Touch-Friendly Native Scroll

```css
/* Mobile: Use native horizontal scroll */
@media (max-width: 767px) {
  .horizontal-wrapper {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .horizontal-track {
    display: flex;
  }

  .horizontal-panel {
    flex: 0 0 100vw;
    scroll-snap-align: start;
  }
}
```

---

## Accessibility

### Skip Link

```html
<a href="#after-horizontal" class="skip-link">
  Skip horizontal gallery
</a>

<section class="horizontal-wrapper" aria-label="Project gallery">
  <!-- Content -->
</section>

<div id="after-horizontal" tabindex="-1"></div>
```

### Keyboard Navigation

```javascript
const wrapper = document.querySelector('.horizontal-wrapper');

wrapper.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    navigateToPanel('next');
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    navigateToPanel('prev');
  }
});

function navigateToPanel(direction) {
  const current = Math.round(scrollTrigger.progress * (panels.length - 1));
  const next = direction === 'next'
    ? Math.min(current + 1, panels.length - 1)
    : Math.max(current - 1, 0);

  const progress = next / (panels.length - 1);
  gsap.to(window, {
    scrollTo: scrollTrigger.start + progress * (scrollTrigger.end - scrollTrigger.start),
    duration: 0.8,
    ease: 'power2.inOut'
  });
}
```

### Screen Reader Announcements

```javascript
const liveRegion = document.getElementById('live-region');

ScrollTrigger.create({
  trigger: '.horizontal-wrapper',
  start: 'top top',
  end: () => `+=${track.scrollWidth}`,
  onUpdate: (self) => {
    const index = Math.round(self.progress * (panels.length - 1));
    const panel = panels[index];
    const title = panel.querySelector('h2')?.textContent;

    if (title && panel !== currentPanel) {
      currentPanel = panel;
      liveRegion.textContent = `Now viewing: ${title}`;
    }
  }
});
```

### Reduced Motion

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Fall back to native scroll
  wrapper.style.overflowX = 'auto';
  wrapper.style.scrollSnapType = 'x mandatory';
  track.style.display = 'flex';
  panels.forEach(panel => {
    panel.style.scrollSnapAlign = 'start';
  });
} else {
  // GSAP implementation
  initHorizontalScroll();
}
```
