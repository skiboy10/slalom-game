# Brand Style Guide

A living document that ensures consistency as the brand scales across teams and touchpoints.

## Table of Contents

1. [Essential Sections](#essential-sections)
2. [Digital-First Approach](#digital-first-approach)
3. [Template Structure](#template-structure)
4. [Maintaining Consistency](#maintaining-consistency)

---

## Essential Sections

Every brand style guide should include:

1. **Brand Story** — Mission, values, positioning (1 page)
2. **Logo Usage** — Variations, clear space, minimum size, don'ts
3. **Color Palette** — Primary, secondary, accent, semantic + hex/RGB/HSL values
4. **Typography** — Font families, weights, scale, pairing rules
5. **Spacing & Layout** — Grid system, spacing scale, container widths
6. **Imagery** — Photography style, illustration guidelines, icon system
7. **Voice & Tone** — Writing guidelines, example copy, do/don't list
8. **Components** — Button styles, card patterns, form elements

---

## Digital-First Approach

Modern brand guidelines are design token systems, not PDF documents.

The `@theme {}` block (Tailwind v4) or `:root {}` custom properties ARE the style guide. They're the single source of truth that both designers and developers reference.

```
Brand Brief → Design Tokens → Components → Pages
                    ↑
         This IS the style guide
```

When someone asks "what's the brand's primary color?", the answer is `var(--color-accent)`, not a hex code in a PDF. When the color changes, it changes everywhere.

→ See **elite-design-core/design-tokens.md** for token architecture.

---

## Template Structure

```
Brand Guide
├── 1. Introduction
│   ├── Brand story & mission
│   ├── Core values
│   └── Target audience
├── 2. Visual Identity
│   ├── Logo system & usage
│   ├── Color palette & meaning
│   ├── Typography & scale
│   └── Imagery & iconography
├── 3. Verbal Identity
│   ├── Voice dimensions
│   ├── Tone by context
│   ├── Key messages
│   └── Microcopy patterns
├── 4. Design Tokens
│   ├── Color tokens (primitive + semantic)
│   ├── Typography tokens
│   ├── Spacing tokens
│   └── Component tokens
└── 5. Component Library
    ├── Buttons & CTAs
    ├── Cards & containers
    ├── Navigation patterns
    └── Form elements
```

---

## Maintaining Consistency

### Rules for Teams

1. **Always reference tokens** — Never hardcode hex values or pixel sizes
2. **Use semantic names** — `var(--color-accent)`, not `var(--color-plum-600)`
3. **Follow the typography scale** — Don't invent new sizes
4. **Respect the spacing system** — Use tokens, not arbitrary values
5. **Match the voice** — Read the voice guide before writing any copy

### When to Break the Rules

A style guide is a living document. If a rule consistently causes problems:
1. Document the exception
2. Discuss with the team
3. Update the guide if the exception is the better pattern
