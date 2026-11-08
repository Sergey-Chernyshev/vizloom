import { type KeyboardEvent, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import {
  type CategoryChartProps,
  ChartDataTable,
  ChartTooltip,
  cx,
  DURATION,
  type BlockState,
  StateView,
  Swatch,
  TooltipContent,
  type TooltipContext,
  type TooltipRow,
  UNIT_COUNT,
  useControllableState,
  useElementSize,
  useFormat,
  useIsomorphicLayoutEffect,
  useLocale,
  type Locale,
  useTweenedValues,
  VisuallyHidden,
} from '../../core';
import { BottomSheet } from '../shared/bottom-sheet';
import { useIsPhone, useScrub } from '../shared/hooks';
import { colorOf } from '../shared/series';
import { SheetSummary } from '../shared/sheet-summary';
import { arrowTarget, elementAt, formatShare, isMouse, markState, type TooltipAnchor, useCssVars } from './common';
import { DONUT_LABELS_RU, isRu } from './labels';
import {
  type DonutRow,
  type DonutVariant,
  DONUT_SPAN,
  donutRows,
  GEOMETRY,
  layoutArcs,
  polar,
  sliceSweeps,
  slicePath,
  trackPath,
} from './donut-model';

/** Rows shown before the tail collapses into "Other": fits the 8-colour palette with the grey bucket. */
export const DEFAULT_VISIBLE_ROWS = 7;

/** Words of the phone sheet. Defaults follow the locale (English or Russian). */
export interface DonutLabels {
  /** Label of the headline stat: the amount of the row. */
  readonly value: string;
  readonly share: string;
  /** "of 1,000". */
  readonly ofTotal: (total: string) => string;
  /** Accessible name of the sheet's close button. */
  readonly close: string;
}

export const DEFAULT_DONUT_LABELS: DonutLabels = {
  value: 'Amount',
  share: 'Share',
  ofTotal: (total) => `of ${total}`,
  close: 'Close',
};

/** Words of the donut sheet for a locale: Russian for `ru`, English otherwise. `labels` overrides any. */
export const donutLabels = (locale: Locale): DonutLabels => (isRu(locale) ? DONUT_LABELS_RU : DEFAULT_DONUT_LABELS);

export interface DonutChartProps<Key extends string = string> extends CategoryChartProps<Key> {
  /** `ring` (default), `pie` (full) or `semi` (half ring, a gauge-like share). */
  readonly variant?: DonutVariant;
  /**
   * Rows kept before the rest merges into one "Other" row (also in the legend and tooltip).
   * Default 7; `limit` from the category contract is an alias when this is not set.
   */
  readonly visibleRows?: number;
  /** Highlighted row key (`'__other__'` for the merged row). Pass it to control; `null` — nothing. */
  readonly highlight?: string | null;
  readonly onHighlight?: (key: string | null) => void;
  /** Caption under the centre value when nothing is highlighted. Default: "Total". */
  readonly caption?: string;
  /** Centre value when nothing is highlighted. Default: the total. */
  readonly centerValue?: string;
  /** The legend list with values and shares next to the drawing. Default true. */
  readonly legend?: boolean;
  /** Words of the phone sheet (tap a slice or a legend row). */
  readonly labels?: Partial<DonutLabels>;
}

function rowColor(row: DonutRow, index: number): string {
  return colorOf({ color: row.color, slot: row.slot }, index);
}

/**
 * Share of a whole: ring, full pie or half ring. The centre shows the total and switches to the
 * hovered or focused slice; a legend lists values and shares. Slices sweep in on first draw and
 * morph on updates; highlight is controlled or uncontrolled.
 */
export function DonutChart<Key extends string = string>(props: DonutChartProps<Key>) {
  const { data, sort, limit, visibleRows, state, className, height } = props;
  const locale = useLocale();
  const rows = useMemo(
    () => donutRows(data, { sort, visibleRows: visibleRows ?? limit ?? DEFAULT_VISIBLE_ROWS, otherLabel: locale.strings.other }),
    [data, sort, visibleRows, limit, locale.strings.other],
  );
  const total = rows.reduce((s, r) => s + r.value, 0);
  let effective: BlockState = state ?? { status: 'ready' };
  if (effective.status === 'ready' && total <= 0) effective = { status: 'empty' };
  const rootRef = useCssVars<HTMLDivElement>(height ? { '--vl-donut-size': `${height}px` } : {});
  return (
    <div ref={rootRef} className={cx('vl-donut', `vl-donut--${props.variant ?? 'ring'}`, className)} data-testid={props['data-testid']}>
      <StateView state={effective} skeleton="circle">
        <DonutBody {...props} rows={rows} total={total} />
      </StateView>
    </div>
  );
}

interface BodyProps<Key extends string> extends DonutChartProps<Key> {
  readonly rows: readonly DonutRow[];
  readonly total: number;
}

function DonutBody<Key extends string>({
  rows,
  total,
  title,
  description,
  variant = 'ring',
  unit = UNIT_COUNT,
  formatValue,
  animate = true,
  tooltip = true,
  highlight,
  onHighlight,
  onHover,
  onSelect,
  caption,
  centerValue,
  legend = true,
  labels,
}: BodyProps<Key>) {
  const fmt = useFormat();
  const locale = useLocale();
  const phone = useIsPhone();
  const l = { ...donutLabels(locale), ...labels };
  const geometry = GEOMETRY[variant];
  const span = DONUT_SPAN[variant].span;
  const value = (v: number) => (formatValue ? formatValue(v) : fmt.value(v, unit, true));

  const fractions = useMemo(() => rows.map((r) => (total > 0 ? r.value / total : 0)), [rows, total]);
  const tweened = useTweenedValues(fractions, { duration: DURATION.data });
  const shown = animate ? tweened : fractions;
  const arcs = layoutArcs(sliceSweeps(shown, span), variant);

  const [active, setActive] = useControllableState<string | null>(highlight, null, onHighlight);
  const activeIndex = active === null ? -1 : rows.findIndex((r) => r.key === active);
  const activeRow = activeIndex >= 0 ? rows[activeIndex] : null;
  const activeArc = arcs.find((a) => a.index === activeIndex) ?? null;

  const [rootRef, rootSize, rootNode] = useElementSize<HTMLDivElement>();
  const plotRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null);
  const mid = activeArc?.mid ?? null;
  useIsomorphicLayoutEffect(() => {
    const plot = plotRef.current;
    if (!rootNode || !plot || mid === null) return;
    const box = plot.getBoundingClientRect();
    const origin = rootNode.getBoundingClientRect();
    const p = polar(geometry, mid, geometry.ro);
    setAnchor({
      x: box.left - origin.left + (p.x / geometry.width) * box.width,
      y: box.top - origin.top + (p.y / geometry.height) * box.height,
    });
  }, [mid, rootNode, rootSize.width, rootSize.height, geometry]);

  function set(index: number | null) {
    const next = index === null ? null : (rows[index]?.key ?? null);
    setActive(next);
    onHover?.(index, null);
  }

  /** Row opened in the phone sheet. */
  const [sheet, setSheet] = useState<string | null>(null);
  // Hold and drag on a phone: the finger reads slices and legend rows, the centre follows.
  const scrub = useScrub<HTMLDivElement>({
    enabled: phone,
    onMove: (x, y) => {
      const hit = elementAt(rootNode, x, y, '[data-slice], [data-legend]');
      const key = hit?.dataset['slice'] ?? hit?.dataset['legend'];
      const index = rows.findIndex((r) => r.key === key);
      if (index >= 0) set(index);
    },
    onEnd: () => set(null),
  });
  const attachRoot = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef(node);
      scrub.ref(node);
    },
    // Both setters are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rootRef, scrub.ref],
  );
  function tap(index: number) {
    if (phone && scrub.swallowClick()) return;
    if (phone) {
      set(null);
      setSheet(rows[index]?.key ?? null);
    }
    onSelect?.(index, null);
  }
  const sheetIndex = sheet === null ? -1 : rows.findIndex((r) => r.key === sheet);
  const sheetRow = sheetIndex >= 0 ? rows[sheetIndex] : null;

  function onSliceKey(event: KeyboardEvent<SVGPathElement>, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(index, null);
      return;
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
      return;
    }
    const order = arcs.map((a) => a.index);
    const at = order.indexOf(index);
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    let to: number | null = null;
    if (forward) to = arrowTarget('ArrowRight', at, order.length);
    else if (backward) to = arrowTarget('ArrowLeft', at, order.length);
    else if (event.key === 'Home' || event.key === 'End') to = arrowTarget(event.key, at, order.length);
    if (to === null) return;
    event.preventDefault();
    svgRef.current?.querySelectorAll<SVGPathElement>('[data-slice]')[to]?.focus();
  }

  function describe(row: DonutRow): string {
    return `${row.label}: ${value(row.value)}, ${formatShare(fmt, total > 0 ? row.value / total : Number.NaN)}`;
  }

  function context(row: DonutRow, index: number): TooltipContext {
    const share = formatShare(fmt, total > 0 ? row.value / total : Number.NaN);
    const rowsOut: TooltipRow[] = [
      { id: row.key, label: row.label, value: value(row.value), color: rowColor(row, index), note: share, strong: true },
    ];
    return { title: row.label, rows: rowsOut, index, values: { [row.key]: row.value } };
  }

  function tooltipBody(row: DonutRow, index: number): ReactNode {
    const ctx = context(row, index);
    if (typeof tooltip === 'function') return tooltip(ctx);
    const footer = row.merged > 1 ? locale.strings.more(row.merged) : row.hint;
    return <TooltipContent rows={ctx.rows} footer={footer} />;
  }

  const showTooltip = tooltip !== false;
  const bigValue = activeRow ? value(activeRow.value) : (centerValue ?? value(total));
  const bigCaption = activeRow ? activeRow.label : (caption ?? locale.strings.total);
  const hasCenter = variant !== 'pie';
  const centerY = variant === 'semi' ? geometry.cy - 22 : geometry.cy - 2;
  const captionY = variant === 'semi' ? geometry.cy - 2 : geometry.cy + 22;

  return (
    <div ref={attachRoot} className="vl-donut__body vl-scrub-area" onPointerLeave={() => !scrub.scrubbing && set(null)}>
      <div ref={plotRef} className="vl-donut__plot">
        <svg ref={svgRef} className="vl-donut__svg" viewBox={`0 0 ${geometry.width} ${geometry.height}`} role="group" aria-label={title}>
          <title>{title}</title>
          {variant === 'ring' ? (
            <circle cx={geometry.cx} cy={geometry.cy} r={(geometry.ro + geometry.ri) / 2} className="vl-donut__track" />
          ) : null}
          {variant === 'semi' ? <path d={trackPath(geometry)} className="vl-donut__track" /> : null}
          {arcs.map((arc) => {
            const row = rows[arc.index];
            const state = markState(activeIndex, arc.index);
            return (
              <path
                key={row.key}
                d={slicePath(geometry, arc.a0, arc.a1)}
                fill={rowColor(row, arc.index)}
                className="vl-donut__slice"
                data-slice={row.key}
                data-state={state}
                role="img"
                tabIndex={0}
                aria-label={describe(row)}
                onPointerEnter={(e) => isMouse(e) && set(arc.index)}
                onFocus={() => set(arc.index)}
                onBlur={() => set(null)}
                onKeyDown={(e) => onSliceKey(e, arc.index)}
                onClick={() => tap(arc.index)}
              />
            );
          })}
          {hasCenter ? (
            <g key={activeRow?.key ?? 'total'} className="vl-donut__center" aria-hidden="true">
              <text x={geometry.cx} y={centerY} textAnchor="middle" className="vl-donut__big">
                {bigValue}
              </text>
              <text x={geometry.cx} y={captionY} textAnchor="middle" className="vl-donut__caption">
                {bigCaption}
              </text>
            </g>
          ) : null}
        </svg>
      </div>
      {legend ? (
        <ul className="vl-donut__legend" aria-hidden="true">
          {rows.map((row, i) => {
            const state = markState(activeIndex, i);
            return (
              <li
                key={row.key}
                className="vl-donut__row"
                data-legend={row.key}
                data-state={state}
                data-empty={row.value <= 0 || undefined}
                onPointerEnter={(e) => isMouse(e) && set(i)}
                onClick={() => tap(i)}
              >
                <span className="vl-donut__label" title={row.label}>
                  <Swatch color={rowColor(row, i)} />
                  <span className="vl-donut__name">{row.label}</span>
                </span>
                <span className="vl-donut__figures">
                  <span className="vl-donut__share">{formatShare(fmt, total > 0 ? row.value / total : Number.NaN)}</span>
                  <span className="vl-donut__value">{value(row.value)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {showTooltip ? (
        <ChartTooltip
          open={activeRow !== null && anchor !== null && !phone}
          anchor={anchor}
          bounds={rootSize}
          prefer="top"
          aria-label={title}
        >
          {activeRow ? tooltipBody(activeRow, activeIndex) : null}
        </ChartTooltip>
      ) : null}
      {phone ? (
        <BottomSheet open={sheetRow !== null} onClose={() => setSheet(null)} closeLabel={l.close} aria-label={title}>
          {sheetRow ? (
            <SheetSummary
              series={rows.map((r, i) => ({ id: r.key, label: r.label, color: rowColor(r, i) }))}
              activeId={sheetRow.key}
              onChange={setSheet}
              title={sheetRow.label}
              stats={[
                { id: 'v', label: l.value, value: value(sheetRow.value), hint: l.ofTotal(value(total)) },
                { id: 's', label: l.share, value: formatShare(fmt, total > 0 ? sheetRow.value / total : Number.NaN) },
              ]}
            />
          ) : null}
        </BottomSheet>
      ) : null}
      {description ? <VisuallyHidden>{description}</VisuallyHidden> : null}
      <ChartDataTable
        caption={title}
        columns={[locale.strings.legend, locale.strings.total, '%']}
        rows={rows.map((r) => [r.label, value(r.value), formatShare(fmt, total > 0 ? r.value / total : Number.NaN)])}
      />
    </div>
  );
}
