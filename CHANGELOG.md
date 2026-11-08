# Changelog

## 0.2.0

### Minor Changes

- New charts and parts, all additive:
  - `RateColumnsChart` (`vizloom/charts`): a daily rate line over base columns with a window navigator, wheel and pinch zoom, mouse range selection, best/worst days and event markers.
  - `CountdownChart` (`vizloom/charts`): stacked columns by days before a date with zones, a metric switch, selection zoom and event markers.
  - `TimelineStrip` and `SheetSummary` (`vizloom/charts`): the scrub strip and the summary of phone bottom sheets.
  - Funnel, heatmap and donut on phones: hold-and-drag scrub and a bottom sheet with a summary; default texts follow the locale (English and Russian).
  - `RollingNumber` (`vizloom/core`): rolling digits and sliding characters for live values.
  - `Veil` (`vizloom/core`): hides a block the viewer may not see, with a consumer-provided cover (particles, spoiler) and a badge.
  - Tooltip: optional `--vl-tooltip-*` tokens (colours, font, paddings, rows, beak, gap), a table layout of rows (`vl-tooltip__content--table`), `ChartTooltip` `overflow="viewport"` and anchor `height`.
  - Palettes: `data-vl-palette="plus"` and `"okabe"`.
  - Visual refresh of existing charts: funnel columns (loss hatching, step arrows), heatmap (per-day and per-hour totals, peak, scale ends, `labels.hot`), donut and half-ring geometry, gauge (default size by shape), bar list, split bar, sparkline, pace, refunds, guides, legend and card.
  - Optional tokens: `--vl-card-title-size`, `--vl-card-title-color`, `--vl-funnel-of-display`, `--vl-heat-color`, `--vl-donut-value-size`.
  - Locale: `percentSpace` (off by default, so Russian percent is `1,7%` now). Base palette: dark slot 2 and light "other" adjusted.

## 0.1.0

First public release.

- Charts: time series (area, line, stacked area, columns) with a period navigator, zoom, pan and
  touch gestures, zones, event markers and a live mode; donut, funnel, heatmap, pace, refunds,
  flow, gauge, sparkline, bar list, bars and split bar.
- Data table: sorting, grouping, filters, selection, column settings, virtualization, rich cells,
  a phone layout and a headless core.
- Dashboard blocks: KPI strip, chart card, 12-column grid, stat tile, insights, activity feed.
- Core: time model, locale-aware formatting, palettes, motion with reduced-motion support,
  gestures, tooltips, legend and the five block states.
- Light and dark themes through CSS variables, SSR-safe, tree-shakeable, English and Russian.
