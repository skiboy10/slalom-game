# Testing & Benchmarks

What to test, how to test, and what "good" looks like.

## Table of Contents

1. [CRO Frameworks](#cro-frameworks)
2. [Industry Benchmarks](#industry-benchmarks)
3. [A/B Testing](#ab-testing)
4. [Prioritization](#prioritization)

---

## CRO Frameworks

### ResearchXL (CXL)

**Principle:** CRO is 80% research, 20% testing.

```
Six research steps:
1. Technical analysis
   - Page speed issues
   - Browser/device bugs
   - Tracking accuracy

2. Heuristic analysis
   - Clarity, friction, distraction
   - Value proposition
   - CTA effectiveness

3. Web analytics analysis
   - Where users drop off
   - High-exit pages
   - Traffic source performance

4. Mouse tracking analysis
   - Heatmaps (where they click/look)
   - Session recordings
   - Scroll depth

5. Form analytics
   - Field-level abandonment
   - Error rates
   - Time per field

6. User testing/Qualitative
   - User interviews
   - Usability tests
   - Surveys
```

### LIFT Model (WiderFunnel)

Six conversion factors to evaluate any page:

```
┌─────────────────────────────────────────────┐
│                                             │
│              VALUE PROPOSITION              │
│           (Core of the model)               │
│                                             │
├───────────────┬─────────────┬───────────────┤
│   CLARITY     │  RELEVANCE  │   URGENCY     │
│ (↑ increases  │ (↑ increases│ (↑ increases  │
│  conversion)  │  conversion)│  conversion)  │
├───────────────┼─────────────┼───────────────┤
│  ANXIETY      │ DISTRACTION │               │
│ (↓ decreases  │ (↓ decreases│               │
│  conversion)  │  conversion)│               │
└───────────────┴─────────────┴───────────────┘

Evaluation questions:
- Value prop: Is it clear why someone should act?
- Clarity: Is the message easy to understand?
- Relevance: Does it match visitor expectations?
- Urgency: Why should they act now?
- Anxiety: What concerns might they have?
- Distraction: What might pull focus from CTA?
```

### Jobs-to-be-Done (JTBD)

Focus on what users are trying to accomplish.

```
Framework:
"When I [situation], I want to [motivation],
so I can [expected outcome]."

Example:
"When I'm preparing a sales report,
I want to pull data automatically,
so I can focus on insights, not data entry."

Application:
- Copy focuses on job, not features
- Design supports job completion
- Remove friction from job path
```

---

## Industry Benchmarks

### Landing Page Conversion Rates

| Performance | Conversion Rate |
|-------------|-----------------|
| Poor | < 2% |
| Below average | 2-3% |
| Average | 3-5% |
| Good | 5-10% |
| Excellent | 10-15% |
| Top performers | 15%+ |

**By traffic source:**
| Source | Average CR |
|--------|------------|
| Email | 4-6% |
| Organic search | 2-4% |
| Paid search | 2-5% |
| Social | 1-3% |
| Display | 0.5-2% |

### E-commerce Benchmarks

| Metric | Average | Good | Excellent |
|--------|---------|------|-----------|
| Overall conversion | 2-3% | 3-5% | 5%+ |
| Add to cart rate | 8-12% | 12-15% | 15%+ |
| Cart abandonment | 70-75% | 65-70% | < 65% |
| Checkout abandonment | 20-25% | 15-20% | < 15% |

**By device:**
| Device | Conversion Rate |
|--------|-----------------|
| Desktop | 3-4% |
| Tablet | 2-3% |
| Mobile | 1.5-2.5% |

### SaaS Benchmarks

| Metric | Average | Good | Excellent |
|--------|---------|------|-----------|
| Free trial signup | 2-5% | 5-10% | 10%+ |
| Trial to paid | 10-15% | 15-25% | 25%+ |
| Freemium to paid | 2-5% | 5-10% | 10%+ |
| Demo request | 1-3% | 3-5% | 5%+ |

**PQL vs MQL conversion:**
- MQL to customer: 5-10%
- PQL to customer: 25-30%

### Email Capture Benchmarks

| Type | Average | Good |
|------|---------|------|
| Popup | 2-4% | 5%+ |
| Inline form | 1-2% | 3%+ |
| Landing page | 20-30% | 40%+ |
| Exit intent | 2-4% | 5%+ |

### Mobile vs Desktop Gap

```
Typical ratio: Mobile converts 40-60% of desktop rate

Example:
Desktop: 4% conversion
Mobile: 1.6-2.4% conversion

Gap causes:
- Harder checkout on mobile
- Slower load times
- Smaller screen = more friction
- Less trust signals visible
```

---

## A/B Testing

### Statistical Significance

```
Minimum requirement: 95% confidence

What this means:
- 95% chance the result is real
- 5% chance it's random noise

Sample size matters:
- Too small = unreliable results
- Use calculators to determine needed sample
```

### Sample Size Calculation

```
Factors:
1. Baseline conversion rate
2. Minimum detectable effect (MDE)
3. Statistical significance level (95%)
4. Statistical power (80%)

Tools:
- Evan Miller's calculator
- Optimizely calculator
- VWO calculator
- ABTestGuide

Rule of thumb:
- Small effect (5%): Large sample needed
- Large effect (25%+): Smaller sample OK
```

### Testing Duration

```
Minimum: 1-2 full business cycles
(e.g., 2 weeks covers weekday/weekend variation)

Factors:
- Traffic volume
- Conversion rate
- Effect size
- Seasonal patterns

Don't stop early:
- Even if it "looks" significant
- Random fluctuations can mislead
- Wait for planned sample size
```

### What to Test First

```
High impact (test first):
1. Headlines and value props
2. CTA copy and placement
3. Hero section
4. Social proof presence/type
5. Form length
6. Pricing presentation

Medium impact:
7. Page layout
8. Image selection
9. Testimonial selection
10. Feature ordering

Lower impact (test last):
11. Button color (usually)
12. Minor copy tweaks
13. Icon changes
14. Font variations
```

### Common Testing Mistakes

```
1. Stopping too early
   → Wait for significance

2. Testing too many variations
   → Splits traffic, takes forever

3. Making changes mid-test
   → Invalidates results

4. Not tracking properly
   → Garbage in, garbage out

5. Testing low-traffic pages
   → Never reaches significance

6. Ignoring segments
   → Average hides important patterns

7. Testing too small changes
   → Effect size below detection
```

---

## Prioritization

### PIE Framework

```
Score each test idea 1-10:

P = Potential
    How much improvement is possible?
    (Based on problem severity)

I = Importance
    How valuable is this page/audience?
    (Traffic × conversion value)

E = Ease
    How easy to implement?
    (Development time, resources)

Priority = (P + I + E) / 3
```

### ICE Framework

```
Score each test idea 1-10:

I = Impact
    How big could the improvement be?

C = Confidence
    How sure are you it will work?
    (Based on data, past tests, best practices)

E = Ease
    How easy to implement?

Priority = (I × C × E) or average
```

### Impact vs Effort Matrix

```
                HIGH IMPACT
                    ↑
        Quick wins  │  Big bets
        (Do now)    │  (Plan carefully)
    ────────────────┼────────────────→
        Fill-ins    │  Money pits
        (Do later)  │  (Avoid)
                    │          HIGH EFFORT
```

### Where to Focus

```
Highest ROI testing areas:
1. Highest-traffic pages
2. Highest-value conversions
3. Biggest drop-off points
4. Pages with obvious problems

Funnel prioritization:
- Fix bottom of funnel first
- Each improvement compounds up
- Checkout > Cart > Product > Home
```

---

## Analytics Setup

### Key Events to Track

```
Engagement:
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page
- Video plays
- Clicks on key elements

Conversion:
- Form starts
- Form completions
- CTA clicks
- Purchases/signups

Funnel:
- Each step completion
- Drop-off points
- Time between steps
```

### Segmentation

```
Always segment by:
- Device type
- Traffic source
- New vs returning
- Geography

Useful segments:
- High-value customers
- Engaged users (multiple visits)
- Cart abandoners
- Feature users vs non-users
```
