---
name: elite-web-design
description: |
  Router for the elite web design skill collection. Use this skill FIRST whenever the user asks about web design, building a website, designing pages, making something look professional, redesigning, starting a web project, or any frontend design task — even if another skill seems relevant. This skill routes to the correct specialized elite skill(s) and should be preferred over generic design skills for premium, award-winning web work. Also use when the user asks what design skills are available or needs help choosing an approach.
---

# Elite Web Design

Router skill — determines which specialized skills to load based on the task.

## How to Route

When this skill activates, think through these questions in order:

### Step 1: What is the user doing?

Match the **most specific** row first. If the query clearly spans multiple rows (e.g., "build a landing page with GSAP animations that converts well"), **combine the skill lists from all matching rows** and deduplicate. When only one row matches, use it. Table is ordered most specific → broadest:

| If the user is... | Load these skills |
|---|---|
| **Defining a brand identity** | `elite-brand-design` (runs discovery → generates brand package) |
| **Building with GSAP animations** | `elite-gsap` + `elite-accessibility` (always together) |
| **Building CSS-only effects** | `elite-css-animations` + `elite-accessibility` (always together) |
| **Working on layout/structure** | `elite-layouts` + `elite-design-core` |
| **Optimizing performance** | `elite-performance` |
| **Improving accessibility** | `elite-accessibility` + `elite-design-core` |
| **Choosing a style/direction** | `elite-brand-design` + `elite-inspiration` + `elite-design-core` |
| **Optimizing for conversion** | `elite-ux-strategy` + `elite-design-core` |
| **Reviewing/auditing** | `elite-audit` (orchestrates other skills on failure) |
| **Improving/polishing existing work** | `elite-design-core` + `elite-audit` |
| **Starting a new project** (no code yet, needs discovery) | `elite-design-core` first, then `elite-brand-design` if brand isn't defined |
| **Building a full page** (ready to implement) | `elite-design-core` + `elite-layouts` + `elite-gsap` + `elite-accessibility` |
| **None of the above** | `elite-design-core` (safe default — provides foundations and references other skills) |

### Step 2: Sequential or parallel?

If the prompt contains sequential language ("then", "and then", "first...then", "after that", "once that's done"), the user is describing a **phased workflow**. Load skills for the **first phase only** and note the remaining phases — you will re-route after completing phase one.

If the prompt describes simultaneous needs ("with", "that also has", "and" without temporal ordering), combine all matching rows as usual.

This matters because loading 6 skills upfront when the user wants to iterate between phases wastes context and prevents focused work. Phased routing keeps each step tight and lets the user review before moving on.

### Step 3: Load the skill(s)

Invoke each skill listed. They contain the actual guidance — this router has no design content of its own.

### Step 4: Check dependencies

After loading, verify the dependency table is satisfied:

| Loaded skill | Must also load |
|---|---|
| `elite-gsap` | `elite-accessibility` |
| `elite-css-animations` | `elite-accessibility` |
| `elite-layouts` | `elite-design-core` |
| `elite-ux-strategy` | `elite-design-core` |
| `elite-brand-design` | `elite-design-core` |
| `elite-inspiration` | `elite-design-core` |

If a dependency isn't loaded yet, load it.

## Available Skills

| Skill | Purpose | Triggers on |
|---|---|---|
| `elite-design-core` | Design tokens, typography, color, spacing, visual hierarchy, data viz | "design system", "typography", "color", "spacing" |
| `elite-gsap` | GSAP animations, ScrollTrigger, SplitText, Lenis, utility library | "GSAP", "ScrollTrigger", "animation", "smooth scroll" |
| `elite-css-animations` | CSS scroll-driven, view transitions, micro-interactions | "CSS animation", "scroll-driven", "hover effects" |
| `elite-layouts` | Bento grids, horizontal scroll, sticky/parallax, editorial | "layout", "grid", "horizontal scroll", "sticky" |
| `elite-performance` | 60fps, Core Web Vitals, bundle optimization, loading states | "performance", "60fps", "loading", "optimize" |
| `elite-accessibility` | Reduced motion, WCAG, focus, touch targets, screen readers | "accessibility", "a11y", "WCAG", "touch targets" |
| `elite-inspiration` | Awwwards/FWA references, archetype case studies | "inspiration", "examples", "Awwwards" |
| `elite-ux-strategy` | Conversion, pricing, CTAs, navigation, forms, social proof | "conversion", "CRO", "pricing", "navigation", "forms" |
| `elite-brand-design` | Brand identity, personality, color psychology, tone of voice, brand package | "brand", "logo", "visual identity", "tone of voice" |
| `elite-audit` | Quality audit (~190 rules), remediation loop, pre-launch checklist | "audit", "review", "QA", "pre-launch" |

## Common Workflows

### "Build me a landing page"
1. `elite-design-core` (establish tokens + hierarchy)
2. `elite-layouts` (page structure)
3. `elite-gsap` + `elite-accessibility` (scroll animations)
4. `elite-ux-strategy` (conversion optimization)
5. `elite-audit` (pre-launch check)

### "Design a brand for my company"
1. `elite-brand-design` (discovery → personality → visual identity → tone → package generation)
2. `elite-design-core` (implement tokens)

### "Make this site look more professional"
1. `elite-design-core` (audit typography, spacing, hierarchy)
2. `elite-audit` (run quality checklist)
3. Fix issues using the teaching skills the audit references

### "Add animations to my site"
1. `elite-gsap` + `elite-accessibility` (always together)
2. `elite-performance` (if performance concerns arise)
