# Forms & CTAs

Reduce friction, increase conversion.

## Table of Contents

1. [Form Optimization](#form-optimization)
2. [CTA Design](#cta-design)
3. [Objection Prevention](#objection-prevention)
4. [Multi-Step Forms](#multi-step-forms)

---

## Form Optimization

### The Friction Equation

```
Every field you add = friction
Every field you remove = potential conversion increase

Field reduction study:
11 fields → 4 fields = 120% increase in conversions
```

### Field Priority

```
Essential (keep):
□ Email
□ Name (if needed for personalization)

Evaluate carefully:
□ Phone (only if you'll call)
□ Company (B2B only)
□ Message (contact forms)

Usually remove:
□ "How did you hear about us?"
□ Fax number
□ Address (unless shipping)
□ Website URL
□ Job title (get later)
```

### Progressive Profiling

Collect information over time, not all at once.

```
Signup (email only):
[Email] [Get started]

Onboarding (add context):
"Help us personalize your experience"
[Company name] [Team size] [Role]

Later (expand profile):
Prompt in-app to complete profile
Incentivize with features
```

### Form UX Patterns

**Labels:**
```
Above field (best):
Email
[_______________]

Floating/animated:
[___Email_______] → Email
                   [_______________]

Avoid:
- Placeholder-only labels (accessibility)
- Labels inside that disappear
```

**Inline Validation:**
```
Real-time feedback:
✓ Valid email format
✗ Password needs 1 number

Show on blur (not on each keystroke)
Don't validate empty required fields until submit
```

**Smart Defaults:**
```
- Pre-select country from IP
- Default phone format to local
- Pre-fill from browser autofill
- Remember preferences
```

**Error States:**
```
Helpful error messages:
"Please enter a valid email (like: you@example.com)"
Not: "Invalid input"

Visual clarity:
- Red border on field
- Error message below field
- Icon indicator
- Scroll to first error
```

### Form Layout

```
Single column > Multi-column
(Faster scanning, better mobile)

Left-aligned labels > Center
(Faster reading)

Full-width fields > Mixed widths
(Unless logically grouped like City/State)

Logical grouping:
[Personal info]
[Contact info]
[Payment info]
```

---

## CTA Design

### Copy Formulas

**Action + Benefit:**
```
"Start growing" > "Sign up"
"Get my free guide" > "Download"
"See it in action" > "Demo"
"Unlock my account" > "Register"
```

**First-Person:**
```
"Start my trial" > "Start your trial"
"Get my results" > "Get results"
"Claim my spot" > "Register"
```

**Specificity:**
```
"Download the 2024 Report" > "Download"
"Get your free audit" > "Submit"
"Start 14-day trial" > "Start trial"
```

### Visual Hierarchy

```
Primary CTA:
- High contrast color
- Larger size
- Prominent placement
- Clear affordance (looks clickable)

Secondary CTA:
- Lower contrast / ghost button
- Smaller or same size
- Supporting placement
- "Or: [secondary option]"

Tertiary:
- Text link style
- Smaller
- Below main actions
```

### Button States

```css
/* Rest state */
.btn { background: #007bff; }

/* Hover - subtle feedback */
.btn:hover { background: #0056b3; transform: translateY(-1px); }

/* Active - pressed */
.btn:active { transform: translateY(0); }

/* Focus - keyboard users */
.btn:focus-visible { outline: 2px solid #007bff; outline-offset: 2px; }

/* Disabled */
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Loading */
.btn.loading { opacity: 0.8; cursor: wait; }
```

### CTA Placement

```
Above fold:
- Primary CTA visible without scroll
- Hero section CTA

After value prop:
- Reinforce after explaining value
- "Ready to [benefit]?"

After social proof:
- Leverage trust momentum
- "Join [X] others"

Sticky/floating:
- Mobile bottom bar
- Scroll-triggered header CTA
- Side floating button
```

### Mobile CTA Considerations

```
Touch targets:
- Minimum 44x44px
- Spacing between targets
- Full-width buttons often better

Thumb zone:
- Place primary CTA in easy reach
- Bottom of screen preferable
- Avoid corners

Sticky CTAs:
- Fixed bottom bar effective
- Don't cover content
- Dismiss option if intrusive
```

---

## Objection Prevention

### Anticipate and Address

Don't wait for objections—prevent them.

```
Near email field:
"We respect your inbox. Unsubscribe anytime."
"No spam, ever."

Near payment:
"Cancel anytime, no questions asked"
"30-day money-back guarantee"
"Your card won't be charged for 14 days"

Near signup:
"Free forever plan available"
"No credit card required"
"Takes 30 seconds"
```

### Trust Signals at Friction Points

```
Form submission:
- Privacy policy link
- Security badges
- "Your data is encrypted"

Payment:
- SSL/security badges
- Payment method logos
- Guarantee badge
- Support availability

Account creation:
- Social login options (reduce friction)
- Password requirements shown
- What happens next
```

### FAQ Placement

```
Strategic FAQ placement:
- Pricing page (justify value)
- Checkout (reduce abandonment)
- Contact form (reduce unnecessary contacts)
- Feature pages (answer implementation questions)

Format:
- Accordion (save space)
- Searchable (many questions)
- Categorized (complex products)
```

### Risk Reversal Messaging

```
Types:
- Money-back guarantee
- Free trial (no card)
- Cancel anytime
- Results guarantee
- Free consultation

Placement:
- Near CTA button
- In button microcopy
- As supporting text below CTA
```

---

## Multi-Step Forms

### When to Use

```
Good for:
- Long forms (5+ fields)
- Complex processes
- Sensitive information collection
- Onboarding flows

Not needed for:
- Simple signup (email only)
- Contact forms (3-4 fields)
- Newsletter opt-in
```

### Progress Indication

```
Step indicators:
[1] ──── [2] ──── [3] ──── [4]
 ●        ○        ○        ○
Account  Company  Payment  Done

Progress bar:
[████████░░░░░░░░] 50% complete

Text:
"Step 2 of 4: Company Details"
```

### Multi-Step Best Practices

```
1. Show progress clearly
2. Allow back navigation
3. Save progress (don't lose data)
4. Group logically
5. Hardest/most sensitive last
6. Celebrate completion
7. Keep steps short (3-5 fields each)
```

### Commitment Ladder

```
Step 1: Easy (low commitment)
- Email only
- Or simple preference

Step 2: Medium
- Name, company
- Use case selection

Step 3: Higher commitment
- Detailed information
- Account setup

Step 4: Highest
- Payment info
- Contract agreement
```

### Abandonment Recovery

```
Exit-intent on multi-step:
- Save progress offer
- Email progress link
- Reduced commitment option
- Support chat trigger

Follow-up:
- Email reminder
- SMS (if mobile)
- Retargeting ads
```

---

## Form Testing

### High-Impact Tests

```
1. Number of fields (reduce)
2. Field order
3. CTA copy
4. Error message helpfulness
5. Single vs multi-step
6. Social login options
7. Progress indication
```

### Measurement

```
Form analytics:
- Start rate (viewed form / started)
- Completion rate (started / completed)
- Field drop-off (which field loses people)
- Time to complete
- Error rate by field
```

---

## Quiz-Based Lead Generation

A multi-phase interactive flow that qualifies leads before asking for contact information. Higher completion rates than direct forms because users get value (personalized recommendations) before giving information.

### Flow Structure

```
Phase 1: Quiz Questions (3-5 questions)
  → Phase 2: Personalized Results
    → Phase 3: Preferences/Refinement
      → Phase 4: Contact Form (name, email, phone)
        → Phase 5: Success/Next Steps
```

### Design Principles

1. **One question per screen** — Progressive disclosure, not a long form
2. **Auto-advance on single-select** — Tap an option, immediately move to next
3. **Manual continue on multi-select** — Users need to indicate they're done selecting
4. **Progress bar with back navigation** — Users can revise previous answers
5. **Results before contact** — Show the personalized recommendation BEFORE asking for info
6. **Clear "why"** — Explain why you need each piece of information

### Implementation Pattern

State machine with derived progress:

```javascript
const phases = ['quiz', 'results', 'preferences', 'form', 'success'];
let currentPhase = 'quiz';
let quizStep = 0;
const totalQuizSteps = 5;

// Progress calculation
function getProgress() {
  const phaseIndex = phases.indexOf(currentPhase);
  if (currentPhase === 'quiz') {
    return (quizStep / totalQuizSteps) * 0.4; // Quiz is 40% of total
  }
  return 0.4 + (phaseIndex - 1) * 0.15; // Remaining phases split rest
}
```

### Conversion Insights

- Quizzes typically achieve 40-60% completion rates (vs 5-15% for direct forms)
- Showing personalized results before the contact form increases form completion by 2-3x
- The quiz itself serves as qualification — unqualified leads self-select out
- Mobile-first design is critical — most quiz completions happen on mobile
