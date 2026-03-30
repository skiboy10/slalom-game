# Data Visualization

Condensed guide for accessible, effective charts and data display on the web.

## Table of Contents

1. [Chart Type Selection](#chart-type-selection)
2. [Accessibility](#accessibility)
3. [Responsive Charts](#responsive-charts)
4. [States](#states)
5. [Best Practices](#best-practices)

---

## Chart Type Selection

Match the data relationship to the right chart type:

| Data Relationship | Chart Type | Example |
|-------------------|-----------|---------|
| Trend over time | Line chart | Revenue over 12 months |
| Comparison | Bar chart (vertical or horizontal) | Sales by region |
| Proportion | Donut/pie (≤5 categories only) | Market share |
| Distribution | Histogram, box plot | Age distribution |
| Correlation | Scatter plot | Price vs demand |
| Hierarchy | Treemap | Budget allocation |
| Flow/conversion | Funnel chart | Signup → purchase |
| Progress | Progress bar, gauge | Task completion |
| Geographic | Choropleth map | Sales by country |

**Rule:** Use bar charts instead of pie/donut for >5 categories. Pie charts become unreadable past 5 slices.

---

## Accessibility

### Required Elements

- **Legends always visible** — Position near the chart, not below a scroll fold
- **Tooltips on hover/tap** — Show exact values on interaction (keyboard-reachable, not hover-only)
- **`aria-label` summary** — Describe the chart's key insight for screen readers
- **Data table alternative** — Provide a table view toggle; charts alone aren't screen-reader friendly
- **Pattern/texture supplements** — Don't rely on color alone; add stripes, dots, or crosshatch

```html
<figure>
  <div class="chart" role="img" aria-label="Revenue grew 23% from Q1 to Q4 2025, reaching $4.2M">
    <!-- Chart rendered here -->
  </div>
  <figcaption>Quarterly Revenue, 2025</figcaption>
  <details>
    <summary>View as table</summary>
    <table>
      <thead><tr><th>Quarter</th><th>Revenue</th></tr></thead>
      <tbody>
        <tr><td>Q1</td><td>$3.4M</td></tr>
        <tr><td>Q2</td><td>$3.6M</td></tr>
        <tr><td>Q3</td><td>$3.9M</td></tr>
        <tr><td>Q4</td><td>$4.2M</td></tr>
      </tbody>
    </table>
  </details>
</figure>
```

### Contrast

- Data elements (lines, bars) vs background: ≥3:1
- Data labels/text: ≥4.5:1
- Chart animations must respect `prefers-reduced-motion` — data should be readable immediately

---

## Responsive Charts

- **Reflow on small screens** — Switch vertical bars to horizontal on mobile
- **Fewer ticks** — Auto-skip axis labels on narrow viewports
- **Touch targets** — Interactive elements (points, bars, slices) ≥44pt tap area
- **Simplify** — On mobile, consider showing key numbers instead of the full chart

```css
.chart-container {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
}

@media (max-width: 640px) {
  .chart-container {
    aspect-ratio: 4 / 3; /* Taller on mobile */
  }
}
```

---

## States

### Loading

Use skeleton/shimmer placeholder while data loads — not an empty axis frame:

```css
.chart-skeleton {
  background: linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-border) 50%, var(--color-bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
```

### Empty

Show meaningful message when no data exists — "No data yet" + guidance, not a blank chart.

### Error

Data load failure → error message + retry button, not a broken/empty chart.

---

## Best Practices

| Rule | Do | Don't |
|------|----|----|
| **Direct labeling** | Label values on the chart for small datasets | Force users to cross-reference legend for every data point |
| **Subtle gridlines** | Low-contrast lines (gray-200) | Heavy gridlines that compete with data |
| **Limit density** | One insight per chart; split if needed | Cram multiple stories into one chart |
| **Tabular figures** | Use `font-variant-numeric: tabular-nums` for numbers | Let proportional figures misalign columns |
| **Interactive legends** | Click to toggle series visibility | Static legends with no interaction |
| **Trend over decoration** | Emphasize the data trend | Heavy gradients/shadows that obscure data |
| **Export option** | Offer CSV/image export for data-heavy products | Lock users into view-only charts |
| **Time clarity** | Label time granularity (day/week/month), allow switching | Ambiguous time axis |
| **Sortable tables** | Support sorting with `aria-sort` attribute | Unsortable data tables |
| **Drill-down** | Clear back-path and breadcrumb for drill-down | Deep drill-down with no way back |

```css
/* Tabular figures for data alignment */
.chart-label,
.data-value,
.table-number {
  font-variant-numeric: tabular-nums;
}
```
