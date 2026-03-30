# Touch Interaction

Critical interaction patterns for touch devices. These rules are CRITICAL priority — violations directly cause usability failures.

## Table of Contents

1. [Touch Targets](#touch-targets)
2. [Touch Spacing](#touch-spacing)
3. [Press Feedback](#press-feedback)
4. [Tap Delay](#tap-delay)
5. [Gesture Patterns](#gesture-patterns)
6. [Safe Area Awareness](#safe-area-awareness)
7. [Hover Fallbacks](#hover-fallbacks)

---

## Touch Targets

Minimum interactive area:
- **Apple HIG**: 44×44pt
- **Material Design**: 48×48dp
- **WCAG 2.2**: 24×24px minimum, 44×44px recommended

### Expanding Hit Area

When the visual element is smaller than the minimum (e.g., a 24px icon), expand the tap area:

```css
/* Method 1: Padding */
.icon-button {
  padding: 12px; /* 24px icon + 12px padding = 48px touch target */
}

/* Method 2: Pseudo-element expansion */
.icon-button {
  position: relative;
}

.icon-button::after {
  content: '';
  position: absolute;
  inset: -8px; /* Expands hit area by 8px on each side */
}
```

---

## Touch Spacing

Minimum **8px gap** between adjacent touch targets to prevent mis-taps.

```css
.button-group {
  display: flex;
  gap: 8px; /* Minimum */
}

/* For critical actions (like delete), increase to 16px */
.destructive-group {
  gap: 16px;
}
```

---

## Press Feedback

Provide visual response within **100ms** of tap. Options:

### Opacity Press

```css
.pressable {
  transition: opacity 0.1s;
}

.pressable:active {
  opacity: 0.7;
}
```

### Scale Press

```css
.pressable {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.pressable:active {
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .pressable:active {
    transform: none;
    opacity: 0.7; /* Fallback to opacity */
  }
}
```

### Ripple Effect (Material Design)

```css
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(0,0,0,0.12) 10%, transparent 10%);
  background-size: 1000%;
  background-position: center;
  opacity: 0;
  transition: background-size 0.4s, opacity 0.3s;
}

.ripple:active::after {
  background-size: 100%;
  opacity: 1;
  transition: 0s;
}
```

---

## Tap Delay

Remove the 300ms delay on mobile browsers:

```css
/* Apply globally */
* {
  touch-action: manipulation;
}
```

This tells the browser not to wait for a potential double-tap, making taps feel instant.

---

## Gesture Patterns

### Rules

- **One primary gesture per region** — Don't overlap tap, swipe, and drag in the same area
- **Gesture alternatives** — Always provide visible button controls alongside gesture-only actions
- **Swipe affordance** — Swipe actions must show hint (chevron, partial reveal, tutorial)
- **Drag threshold** — Require 10-15px of movement before starting a drag (prevents accidental)
- **System gesture protection** — Don't block OS gestures (Control Center swipe, back swipe, home indicator)

### Swipe Action Reveal

```css
.swipe-item {
  position: relative;
  overflow: hidden;
}

.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  transform: translateX(100%);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.swipe-item.swiped .swipe-actions {
  transform: translateX(0);
}
```

---

## Safe Area Awareness

Keep interactive content away from device edges, notch, Dynamic Island, and gesture bars:

```css
/* Bottom fixed bar — account for home indicator */
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Full-screen layout */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Viewport meta must include viewport-fit */
/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"> */
```

---

## Hover Fallbacks

Never rely on hover for primary interactions — touch devices don't have hover.

```css
/* Pattern: Use hover as enhancement, not requirement */
.card {
  /* Base state is always visible and functional */
}

/* Hover enhancement only for pointer devices */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

/* Touch: use active state instead */
@media (hover: none) {
  .card:active {
    transform: scale(0.98);
  }
}
```

The `@media (hover: hover)` query targets devices with a precise pointer (mouse). `@media (hover: none)` targets touch devices. This ensures hover effects don't "stick" on mobile.
