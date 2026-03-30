# Container Queries

Component-level responsive design based on container size, not viewport.

## Table of Contents

1. [Basic Syntax](#basic-syntax)
2. [Common Patterns](#common-patterns)
3. [Card Components](#card-components)
4. [Layout Components](#layout-components)
5. [Style Queries](#style-queries)

---

## Basic Syntax

### Defining Containment

```css
/* Size containment - most common */
.card-container {
  container-type: inline-size;
}

/* With a name for targeted queries */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Shorthand */
.card-container {
  container: card / inline-size;
}
```

### Container Types

```css
/* inline-size: Query width only (most common) */
.container {
  container-type: inline-size;
}

/* size: Query both width and height */
.container {
  container-type: size;
}

/* normal: No size containment, only style queries */
.container {
  container-type: normal;
}
```

### Writing Queries

```css
/* Anonymous container (nearest ancestor) */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

/* Named container */
@container card (min-width: 400px) {
  .card-content {
    padding: 2rem;
  }
}

/* Range syntax */
@container (300px <= width <= 600px) {
  .card {
    /* Medium size styles */
  }
}
```

### Container Query Units

```css
.card {
  /* Container query length units */
  padding: 5cqi;    /* 5% of container inline size */
  font-size: 3cqw;  /* 3% of container width */
  margin: 2cqh;     /* 2% of container height */
  gap: 2cqmin;      /* 2% of smaller dimension */
  border-radius: 1cqmax; /* 1% of larger dimension */
}
```

---

## Common Patterns

### Responsive Card

```html
<div class="card-container">
  <article class="card">
    <img class="card-image" src="image.jpg" alt="">
    <div class="card-content">
      <h3 class="card-title">Card Title</h3>
      <p class="card-description">Card description text...</p>
      <a class="card-link" href="#">Read more</a>
    </div>
  </article>
</div>
```

```css
.card-container {
  container: card / inline-size;
}

/* Base: Vertical stack */
.card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.card-image {
  aspect-ratio: 16/9;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* Medium: Side by side */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }

  .card-image {
    flex: 0 0 40%;
    aspect-ratio: 1;
  }

  .card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-link {
    margin-top: auto;
  }
}

/* Large: Enhanced layout */
@container card (min-width: 600px) {
  .card-image {
    flex: 0 0 50%;
  }

  .card-content {
    padding: 2rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-description {
    font-size: 1.125rem;
  }
}
```

### Adaptive Navigation

```css
.nav-container {
  container: nav / inline-size;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: none;
}

.nav-menu-btn {
  display: block;
}

/* Show links when space available */
@container nav (min-width: 600px) {
  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-menu-btn {
    display: none;
  }
}

/* Full nav with all features */
@container nav (min-width: 900px) {
  .nav-search {
    display: block;
  }

  .nav-links {
    gap: 2rem;
  }
}
```

### Sidebar Content

```css
.sidebar-container {
  container: sidebar / inline-size;
}

.sidebar-widget {
  padding: 1rem;
}

.widget-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

@container sidebar (min-width: 250px) {
  .sidebar-widget {
    padding: 1.5rem;
  }

  .widget-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
```

---

## Card Components

### Product Card

```css
.product-container {
  container: product / inline-size;
}

.product-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  overflow: hidden;
}

.product-image {
  aspect-ratio: 1;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
}

.product-actions {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
}

.product-actions button {
  flex: 1;
  padding: 0.75rem;
}

/* Wide card */
@container product (min-width: 350px) {
  .product-card {
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr auto;
  }

  .product-image {
    grid-row: span 2;
    aspect-ratio: auto;
    height: 100%;
  }

  .product-info {
    padding: 1.5rem;
  }

  .product-price {
    font-size: 1.5rem;
  }
}

/* Large card */
@container product (min-width: 500px) {
  .product-card {
    grid-template-columns: 50% 1fr;
  }

  .product-info {
    padding: 2rem;
  }

  .product-actions {
    padding: 0 2rem 2rem;
    gap: 1rem;
  }
}
```

### Profile Card

```css
.profile-container {
  container: profile / inline-size;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border-radius: 16px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.profile-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

@container profile (min-width: 300px) {
  .profile-card {
    flex-direction: row;
    text-align: left;
    gap: 1.5rem;
  }

  .profile-avatar {
    margin-bottom: 0;
  }

  .profile-stats {
    margin-top: 0.5rem;
  }
}

@container profile (min-width: 450px) {
  .profile-card {
    padding: 2rem;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .profile-actions {
    margin-left: auto;
  }
}
```

### Feature Card

```css
.feature-container {
  container: feature / inline-size;
}

.feature-card {
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border-radius: 12px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

.feature-title {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

@container feature (min-width: 280px) {
  .feature-card {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .feature-icon {
    margin-bottom: 0;
    flex-shrink: 0;
  }
}

@container feature (min-width: 400px) {
  .feature-card {
    padding: 2rem;
  }

  .feature-icon {
    width: 56px;
    height: 56px;
  }

  .feature-title {
    font-size: 1.25rem;
  }

  .feature-description {
    font-size: 1rem;
  }
}
```

---

## Layout Components

### Dashboard Widget

```css
.widget-container {
  container: widget / inline-size;
}

.widget {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 1rem;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.widget-chart {
  height: 150px;
}

.widget-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--color-bg-primary);
  border-radius: 8px;
}

@container widget (min-width: 300px) {
  .widget {
    padding: 1.5rem;
  }

  .widget-chart {
    height: 200px;
  }

  .widget-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container widget (min-width: 500px) {
  .widget {
    padding: 2rem;
  }

  .widget-chart {
    height: 250px;
  }

  .widget-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Media Object

```css
.media-container {
  container: media / inline-size;
}

.media {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.media-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 8px;
}

.media-body {
  flex: 1;
}

@container media (min-width: 400px) {
  .media {
    flex-direction: row;
  }

  .media-image {
    width: 150px;
    aspect-ratio: 1;
  }
}

@container media (min-width: 600px) {
  .media-image {
    width: 200px;
  }

  .media-body {
    font-size: 1.125rem;
  }
}
```

### Form Layout

```css
.form-container {
  container: form / inline-size;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
}

@container form (min-width: 500px) {
  .form-row {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .form-label {
    flex: 0 0 150px;
    text-align: right;
  }

  .form-input {
    flex: 1;
  }
}

@container form (min-width: 700px) {
  .form-row.inline {
    display: grid;
    grid-template-columns: 150px 1fr 1fr;
    gap: 1rem;
  }
}
```

---

## Style Queries

### Querying Custom Properties

```css
.theme-container {
  container-type: normal;  /* No size containment needed */
  --theme: light;
}

.theme-container.dark {
  --theme: dark;
}

/* Style query based on custom property */
@container style(--theme: dark) {
  .card {
    background: #1a1a1a;
    color: white;
  }

  .card-link {
    color: #60a5fa;
  }
}
```

### Feature Flags

```css
.feature-container {
  container-type: normal;
  --has-image: false;
  --is-featured: false;
}

.feature-container.with-image {
  --has-image: true;
}

.feature-container.featured {
  --is-featured: true;
}

@container style(--has-image: true) {
  .card {
    grid-template-columns: 200px 1fr;
  }

  .card-image {
    display: block;
  }
}

@container style(--is-featured: true) {
  .card {
    border: 2px solid var(--color-accent);
    box-shadow: 0 4px 20px rgba(var(--color-accent-rgb), 0.2);
  }
}
```

### Combining Size and Style Queries

```css
.card-container {
  container: card / inline-size;
  --variant: default;
}

.card-container.compact {
  --variant: compact;
}

/* Size + style combination */
@container card (min-width: 400px) and style(--variant: default) {
  .card {
    flex-direction: row;
    padding: 2rem;
  }
}

@container card (min-width: 400px) and style(--variant: compact) {
  .card {
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
  }
}
```

---

## Browser Support

Container queries are supported in all modern browsers (2026):

- Chrome 105+
- Firefox 110+
- Safari 16+
- Edge 105+

### Fallback Strategy

```css
/* Base styles work without container queries */
.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* Use @supports for container query features */
@supports (container-type: inline-size) {
  .card-container {
    container: card / inline-size;
  }

  @container card (min-width: 400px) {
    .card {
      flex-direction: row;
    }
  }
}

/* Or use @media as fallback */
@media (min-width: 768px) {
  .card {
    flex-direction: row;
  }
}
```

---

## Best Practices

### Name Your Containers

```css
/* Prefer named containers for clarity */
.sidebar { container: sidebar / inline-size; }
.main { container: main / inline-size; }
.card { container: card / inline-size; }

@container sidebar (min-width: 300px) { /* ... */ }
@container card (min-width: 400px) { /* ... */ }
```

### Avoid Deep Nesting

```css
/* Good: Shallow container hierarchy */
.page-container {
  container: page / inline-size;
}

.card-container {
  container: card / inline-size;
}

/* Avoid: Multiple nested containers */
/* This can cause performance issues */
```

### Use Semantic Breakpoints

```css
/* Define breakpoints as custom properties */
:root {
  --card-compact: 300px;
  --card-medium: 400px;
  --card-large: 600px;
}

@container card (min-width: 300px) { /* Compact */ }
@container card (min-width: 400px) { /* Medium */ }
@container card (min-width: 600px) { /* Large */ }
```

### Combine with Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.grid-item {
  container: card / inline-size;
}

/* Cards adapt to their actual space in the grid */
@container card (min-width: 350px) {
  .card {
    /* Styles when card has more space */
  }
}
```
