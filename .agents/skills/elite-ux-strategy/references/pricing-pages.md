# Pricing Pages

Psychology and design for pricing that converts.

## Table of Contents

1. [Pricing Psychology](#pricing-psychology)
2. [Tier Design](#tier-design)
3. [Layout Patterns](#layout-patterns)
4. [Common Mistakes](#common-mistakes)

---

## Pricing Psychology

### Anchoring

First number seen influences perception of all others.

```
High anchor strategy:
"Enterprise: $299/mo" (shown first)
"Pro: $99/mo" (seems reasonable now)
"Basic: $29/mo" (seems cheap)

Value anchor strategy:
"Save $1,200/year with annual billing"
"$10,000 value for just $499"
"Compared to hiring a $80k/year employee..."
```

### Decoy Effect

A third option changes perception of the other two.

```
Without decoy:
Basic: $10/mo    Pro: $30/mo
(Many choose Basic)

With decoy:
Basic: $10/mo    Plus: $25/mo    Pro: $30/mo
(Many choose Pro — only $5 more than Plus!)
```

**The decoy (Plus) is designed to be inferior to Pro, making Pro the obvious choice.**

### Charm Pricing

Prices ending in 9 feel significantly lower.

```
$99 feels much cheaper than $100
$29/mo feels cheaper than $30/mo

When to use:
- B2C products
- Lower-priced tiers
- Discount-sensitive audiences

When NOT to use:
- Premium positioning
- Enterprise pricing
- Luxury brands
```

### Price Framing

How you present the price matters as much as the price itself.

```
Daily framing:
"Less than $1/day" vs "$29/mo"

Comparison framing:
"Less than your morning coffee"
"Costs less than one hour of your time"

Investment framing:
"Pays for itself in 2 weeks"
"Average customer sees 10x ROI"

Annual savings:
"$19/mo billed annually (save $60)"
```

### Mental Accounting

People categorize money differently.

```
Expense framing:
"$99/mo" (operating cost)

Investment framing:
"$99/mo that generates $500/mo in leads"
(ROI, not expense)

Budget framing:
"Fits your marketing budget"
"Cheaper than your current solution"
```

---

## Tier Design

### Standard 3-Tier Structure

```
┌─────────────┬─────────────┬─────────────┐
│   BASIC     │     PRO     │ ENTERPRISE  │
│             │ ★ POPULAR ★ │             │
│   $29/mo    │   $79/mo    │   $199/mo   │
├─────────────┼─────────────┼─────────────┤
│ Core        │ Everything  │ Everything  │
│ features    │ in Basic    │ in Pro      │
│             │ Plus...     │ Plus...     │
│             │             │             │
│ 1 user      │ 5 users     │ Unlimited   │
│ 1,000 items │ 10,000 items│ Unlimited   │
│ Email       │ Priority    │ Dedicated   │
│ support     │ support     │ support     │
├─────────────┼─────────────┼─────────────┤
│ [Start free]│ [Start free]│[Contact us] │
└─────────────┴─────────────┴─────────────┘
```

### Tier Naming Psychology

```
Functional names:
Basic, Standard, Pro, Enterprise
(Clear but boring)

Value-based names:
Starter, Growth, Scale
(Suggests progression)

Persona-based names:
Solo, Team, Organization
(User identifies with tier)

Aspirational names:
Essential, Professional, Business
(Professional = desirable)
```

**Best practice:** Match naming to your audience. B2B often prefers functional. Consumer products can be more creative.

### Feature Differentiation

```
Effective differentiation:
- Usage limits (seats, items, API calls)
- Feature access (advanced features in higher tiers)
- Support level (email → priority → dedicated)
- Customization (branding, integrations)

Avoid:
- Crippling lower tiers
- Hiding essential features
- Complex feature matrices
- Too many tiers (3-4 max)
```

### The Recommended Tier

**Goal:** 60-70% of customers choose the middle tier.

```
Highlight the target tier:
- "Most Popular" badge
- Visual emphasis (larger, bordered)
- Slight color differentiation
- Pre-selected toggle state
```

**If too many choose lowest:** Raise its price or reduce features.
**If too many choose highest:** Your middle tier isn't compelling.

### Enterprise Tier

```
Characteristics:
- "Contact us" or "Custom" pricing
- Unlimited/custom features
- Dedicated support
- Security/compliance
- Custom contracts

When to include:
- B2B products
- High ACV potential
- Complex implementation needs
- Compliance requirements
```

---

## Layout Patterns

### Horizontal Comparison

```
Standard layout:
┌─────┬─────┬─────┐
│Tier1│Tier2│Tier3│
└─────┴─────┴─────┘

Best for:
- 3 tiers
- Desktop-first
- Quick comparison

Mobile adaptation:
- Horizontal scroll
- Accordion expand
- Separate cards
```

### Vertical Feature Table

```
Feature comparison:
┌──────────────┬───────┬───────┬───────┐
│ Feature      │ Basic │  Pro  │ Enter │
├──────────────┼───────┼───────┼───────┤
│ Users        │   1   │   5   │  ∞    │
│ Storage      │  5GB  │ 50GB  │  ∞    │
│ API access   │   ✗   │   ✓   │   ✓   │
│ Priority     │   ✗   │   ✓   │   ✓   │
│ Custom       │   ✗   │   ✗   │   ✓   │
└──────────────┴───────┴───────┴───────┘

Best for:
- Many features
- Feature-conscious buyers
- Enterprise comparisons
```

### Annual/Monthly Toggle

```
Design patterns:
┌──────────────────────────────┐
│  [Monthly]  ●══════○  [Annual]  │
│             Save 20%          │
└──────────────────────────────┘

Best practices:
- Default to annual (better LTV)
- Show savings clearly
- Animate price change
- Consistent percentage discount
```

### Pricing Calculator

```
Use case:
- Usage-based pricing
- Complex products
- Enterprise

Components:
- Slider inputs
- Real-time price update
- "Estimate only" disclaimer
- Option to "Talk to sales"
```

---

## Common Mistakes

### Pricing Page Killers

```
❌ Too many tiers (5+)
   → Paradox of choice, confusion

❌ Unclear differentiation
   → "What do I actually get?"

❌ Hidden costs/limits
   → Destroys trust at checkout

❌ No recommended tier
   → Customer has to decide alone

❌ Missing trust signals
   → Hesitation at payment moment

❌ Confusing feature matrix
   → Analysis paralysis

❌ No FAQ
   → Unanswered objections

❌ Poor mobile experience
   → Lost mobile conversions
```

### Pricing Page Must-Haves

```
✓ Clear tier names and prices
✓ Obvious feature differences
✓ Recommended tier highlighted
✓ Annual/monthly option
✓ Trust signals near CTA
✓ FAQ addressing objections
✓ Money-back guarantee
✓ Easy comparison
✓ Clear next step
```

### FAQ for Pricing Pages

Common questions to address:

```
Payment:
"Can I cancel anytime?"
"What payment methods do you accept?"
"Do you offer refunds?"

Value:
"Which plan is right for me?"
"What happens if I exceed limits?"
"Can I upgrade/downgrade later?"

Trust:
"Is my payment secure?"
"Do you offer discounts?"
"Is there a free trial?"
```

---

## Testing Pricing Pages

### High-Impact Tests

```
1. Number of tiers (2 vs 3 vs 4)
2. Price points
3. Annual vs monthly default
4. Feature emphasis
5. CTA copy
6. Social proof placement
7. Guarantee wording
```

### What NOT to Test

```
- Micro-copy tweaks (low impact)
- Color variations (usually)
- Font changes
- Minor layout shifts

Focus on strategic changes.
```
