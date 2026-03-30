# Mobile Conversion

Close the desktop-mobile gap.

## Table of Contents

1. [Mobile-First Patterns](#mobile-first-patterns)
2. [Mobile Checkout](#mobile-checkout)
3. [Cross-Device Journeys](#cross-device-journeys)
4. [Mobile-Specific Issues](#mobile-specific-issues)

---

## Mobile-First Patterns

### The Mobile Reality

```
Stats:
- 60%+ of web traffic is mobile
- Mobile converts 40-60% of desktop rate
- Gap = massive opportunity

Why the gap:
- Harder input (no keyboard)
- Smaller screen
- More distractions
- Less visible trust signals
- Slower connections
- Security concerns
```

### Thumb Zone Design

```
Easy reach (green):
- Bottom center of screen
- Primary CTAs here

OK reach (yellow):
- Middle of screen
- Secondary actions

Hard reach (red):
- Top corners
- Navigation, less frequent actions

┌─────────────────────┐
│ Hard │      │ Hard  │
├──────┤  OK  ├───────┤
│      │      │       │
│  OK  │ Easy │  OK   │
│      │      │       │
│ Easy │ Easy │ Easy  │
└─────────────────────┘
```

### Touch Targets

```
Minimum size: 44 × 44px
Recommended: 48 × 48px
Spacing between targets: 8px minimum

Button sizing:
- Primary CTA: Full width, 48-56px height
- Secondary: Full width or large enough
- Icon buttons: 44px minimum
```

### Mobile Form Design

```
Best practices:
- Single column layout
- Full-width fields
- Large input areas (44px+ height)
- Appropriate keyboard types
- Autofill enabled
- Clear labels above fields
- Instant validation
- Sticky submit button

Keyboard optimization:
- type="email" → @ keyboard
- type="tel" → number pad
- type="number" → number keyboard
- inputmode="numeric" → number only
- autocomplete attributes for autofill
```

### Mobile Navigation

```
Patterns:
- Hamburger menu (familiar but hidden)
- Bottom navigation bar (easy reach)
- Simplified top nav (fewer items)
- Search prominent

CTA placement:
- Sticky bottom bar for primary action
- Don't bury CTAs in hamburger
- Keep most important action visible
```

---

## Mobile Checkout

### Payment Integration

```
Priority order:
1. Apple Pay / Google Pay (1-tap)
2. PayPal (fast login)
3. Saved cards (returning users)
4. Manual entry (fallback)

Apple Pay benefits:
- 1-tap purchase
- Built-in authentication
- No typing required
- Higher conversion
```

### Mobile Checkout Flow

```
Streamlined flow:
1. Cart review (editable)
2. Shipping (autofill, address lookup)
3. Payment (wallet preferred)
4. Confirmation

Not this:
1. Login/register
2. Shipping address
3. Billing address
4. Shipping method
5. Payment method
6. Payment details
7. Review
8. Confirmation
(Too many steps!)
```

### Guest Checkout

```
Always offer guest checkout:
- Account creation after purchase
- Or optional during
- Never block purchase for registration

"Create account to track your order"
(Post-purchase, incentive-based)
```

### Progress Indication

```
Mobile progress:
[●───●───●───○]
Cart  Ship  Pay  Done

Keep visible but compact
Show current step clearly
Allow back navigation
```

### Trust on Mobile

```
Space is limited, prioritize:
- Security badge near payment
- "Secure checkout" in header
- Payment logos
- Brief guarantee text

Don't crowd but don't skip
```

---

## Cross-Device Journeys

### The Reality

```
User behavior:
- Research on mobile
- Purchase on desktop
- Or vice versa

Challenge:
- Tracking across devices
- Maintaining context
- Reducing re-friction
```

### Save-for-Later Patterns

```
Wishlist/save:
- Easy add on mobile
- Sync to account
- Email reminder option

Cart persistence:
- Save cart to account
- Email cart link
- SMS cart recovery

Progress saving:
- "Email my progress"
- Save and continue later
- Bookmark-able state
```

### Cross-Device Features

```
Account sync:
- Saved items
- Cart contents
- Preferences
- Browsing history

Communication bridges:
- "Continue on desktop" email
- SMS with link
- QR code for app

Seamless transition:
- Same state on any device
- No re-authentication friction
- Remember user context
```

### Attribution Challenges

```
Cross-device attribution:
- User login connects devices
- Email click tracking
- Probabilistic matching (less reliable)

Focus on:
- Making login valuable
- Easy account creation
- Clear value of signing in
```

---

## Mobile-Specific Issues

### Speed

```
Mobile speed is critical:
- 53% abandon if > 3 seconds
- Each second = 7% conversion loss
- Mobile networks vary widely

Optimization:
- Compress images (WebP, AVIF)
- Lazy load below fold
- Minimize JavaScript
- Use CDN
- Optimize web fonts
- Server-side rendering
```

### Fat Finger Errors

```
Prevention:
- Large touch targets
- Adequate spacing
- Undo capability
- Confirmation for destructive actions

Recovery:
- Easy error correction
- Don't clear form on error
- Inline validation
```

### Context Switching

```
Mobile users are distracted:
- Notifications interrupt
- Multitasking
- Environment changes

Design for interruption:
- Save state frequently
- Easy re-engagement
- Clear "where was I?"
- Session recovery
```

### Limited Visibility

```
Less content visible:
- Key info above fold
- Progressive disclosure
- Expandable sections
- Scannable content

Trust signal visibility:
- Show most important
- Don't hide in footer
- Sticky trust elements if needed
```

---

## Mobile Testing Checklist

```
Functionality:
□ Forms work with mobile keyboards
□ Touch targets are large enough
□ No horizontal scroll
□ Navigation is accessible
□ Payment methods work
□ All CTAs are tappable

Performance:
□ < 3 second load
□ Images optimized
□ No layout shift
□ Smooth scroll
□ Responsive to touch

Usability:
□ Thumb-friendly layout
□ Easy to read text (16px+ base)
□ Sufficient contrast
□ Clear error states
□ Progress indication

Testing tools:
- Real devices (not just emulators)
- Different connection speeds
- Various screen sizes
- Both iOS and Android
```

---

## Mobile Bottom Bar CTA

A fixed bottom bar for service businesses (legal, medical, trades) where phone calls are high-intent actions:

```css
.mobile-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

body {
  padding-bottom: 4rem;
}

@media (min-width: 768px) {
  .mobile-bar { display: none; }
  body { padding-bottom: 0; }
}
```

Split-grid pattern: "Call Now" (tel: link) + "Book Consultation" (form/calendar link). The two-button layout lets users choose their comfort level — a phone call is higher intent, a booking form is lower pressure.

### When to use:
- Service businesses where phone is the primary conversion channel
- Mobile users represent >50% of traffic
- The primary CTA requires a phone interaction (legal, medical, emergency services)

---

## Sticky Add-to-Cart

Mobile-only sticky CTA that slides in when the main product CTA scrolls out of view:

```css
.sticky-atc {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 40;
  padding: 0.75rem 1rem;
  background: white;
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06);
}

.sticky-atc.visible {
  transform: translateY(0);
}
```

```javascript
// Toggle visibility with IntersectionObserver
const observer = new IntersectionObserver(([entry]) => {
  stickyBar.classList.toggle('visible', !entry.isIntersecting);
}, { threshold: 0 });

observer.observe(mainCtaButton);
```

Includes product name, price, and button states (add to cart, adding..., added, sold out). Toggle `aria-hidden` to match visibility for screen readers.
