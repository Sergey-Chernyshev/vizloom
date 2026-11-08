import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import {
  type BlockState,
  type ChartEvents,
  ChartDataTable,
  ChartTooltip,
  cx,
  DURATION,
  type BaseChartProps,
  type Locale,
  seriesColor,
  Skeleton,
  StateView,
  TooltipContent,
  type TooltipContext,
  type TooltipOptions,
  type TooltipRow,
  UNIT_COUNT,
  useElementSize,
  useFormat,
  useLocale,
  useTweenedValues,
  VisuallyHidden,
} from '../../core';
import { type FunnelRow, funnelStats, type FunnelStats, type FunnelStatsOptions, type FunnelStep } from '../model/funnel';
import { BottomSheet } from '../shared/bottom-sheet';
import { useIsPhone, useScrub } from '../shared/hooks';
import { type SheetStat, SheetSummary } from '../shared/sheet-summary';
import { anchorOf, elementAt, formatShare, isMouse, markState, type TooltipAnchor, useMounted, VarBox } from './common';
import { FUNNEL_LABELS_RU, isRu } from './labels';

export const FUNNEL_VARIANT = {
  /** Tapered bands, narrowing top to bottom; numbers on the right. */
  funnel: 'funnel',
  /** Columns per step; between them a wedge of the people who left. */
  columns: 'columns',
  /** Full-width rows: reached in colour, lost hatched. */
  dropoff: 'dropoff',
  /** Ribbons of people from step to step; the lost ones stream down. */
  flow: 'flow',
} as const;
export type FunnelVariant = (typeof FUNNEL_VARIANT)[keyof typeof FUNNEL_VARIANT];

/** Copy of the funnel. Defaults are English; pass `labels` to translate. */
export interface FunnelLabels {
  readonly reached: string;
  readonly fromStart: string;
  readonly fromPrevious: string;
  readonly lost: string;
  readonly untracked: string;
  readonly skipped: string;
  /** "reached “Payment”" after the headline conversion. */
  readonly summary: (last: string) => string;
  /** "499 of 10,641". */
  readonly summaryOf: (end: string, start: string) => string;
  /** The biggest drop sentence. */
  readonly worst: (step: string, share: string) => string;
  readonly step: string;
  /** "step 2 of 5": the preview in the phone sheet. */
  readonly stepOf: (n: number, total: number) => string;
  /** Phone sheet: the headline stat. */
  readonly sheetHere: string;
  /** "30% of start". */
  readonly sheetFromStart: (share: string) => string;
  readonly sheetStart: string;
  readonly sheetFromPrevious: string;
  readonly sheetNext: string;
  readonly sheetLostNext: string;
  readonly sheetFirst: string;
  readonly sheetLast: string;
  /** "of 3,090". */
  readonly sheetOf: (value: string) => string;
  /** Accessible name of the sheet's close button. */
  readonly close: string;
}

/** English copy; `FunnelChart` picks Russian for a Russian locale. */
export const DEFAULT_FUNNEL_LABELS: FunnelLabels = {
  reached: 'Reached',
  fromStart: 'of start',
  fromPrevious: 'of previous step',
  lost: 'Lost',
  untracked: 'No data',
  skipped: 'More than the previous step',
  summary: (last) => `reached “${last}”`,
  summaryOf: (end, start) => `${end} of ${start}`,
  worst: (step, share) => `Biggest drop before “${step}”: −${share}`,
  step: 'Step',
  stepOf: (n, total) => `step ${n} of ${total}`,
  sheetHere: 'At this step',
  sheetFromStart: (share) => `${share} of start`,
  sheetStart: 'funnel start',
  sheetFromPrevious: 'From previous step',
  sheetNext: 'Passed on',
  sheetLostNext: 'Left after the step',
  sheetFirst: 'first step',
  sheetLast: 'last step',
  sheetOf: (value) => `of ${value}`,
  close: 'Close',
};

/** Words of the funnel for a locale: Russian for `ru`, English otherwise. `labels` overrides any. */
export const funnelLabels = (locale: Locale): FunnelLabels => (isRu(locale) ? FUNNEL_LABELS_RU : DEFAULT_FUNNEL_LABELS);

export interface FunnelChartProps<Id extends string = string> extends BaseChartProps, TooltipOptions<Id>, ChartEvents<Id> {
  readonly steps: readonly FunnelStep<Id>[];
  /** Default `funnel`. */
  readonly variant?: FunnelVariant;
  /** `zeroIsGap`: a zero in the middle of the funnel is a collection gap, not "nobody". Default true. */
  readonly statsOptions?: FunnelStatsOptions;
  /** Headline above the drawing: total conversion and the biggest drop. Default true. */
  readonly summary?: boolean;
  /** Overrides the words; defaults follow the locale of `VizProvider` (English or Russian). */
  readonly labels?: Partial<FunnelLabels>;
}

/** Palette order of steps: violet → blue → teal → green; the last step must not look like an error. */
const STEP_SLOTS = [0, 4, 2, 5, 1, 3] as const;
const SVG_HEIGHT = 280;
/** Below this width per step the SVG variants scroll sideways instead of squeezing labels. */
const MIN_STEP_WIDTH = 72;
const SKELETON_WIDTHS = [100, 62, 38, 22] as const;

const stepColor = (slot: number | undefined, index: number): string => seriesColor(slot ?? STEP_SLOTS[index % STEP_SLOTS.length]);
/** A label no wider than `px` (about 6.6 px per character at 12 px). */
const fit = (text: string, px: number, char = 6.6): string =>
  text.length * char <= px ? text : `${text.slice(0, Math.max(1, Math.floor(px / char) - 1))}…`;

function nextKnown(rows: readonly FunnelRow[], from: number): number {
  for (let i = from + 1; i < rows.length; i++) if (rows[i].known) return i;
  return -1;
}

/**
 * Sales funnel in four looks. It is honest about data: a step without data is "No data", not zero;
 * percentages go from the last known step; a step bigger than the previous one is flagged instead of
 * becoming "100%".
 */
export function FunnelChart<Id extends string = string>(props: FunnelChartProps<Id>) {
  const { steps, statsOptions, state, className, variant = 'funnel' } = props;
  const stats = useMemo(() => funnelStats(steps, statsOptions), [steps, statsOptions]);
  let effective: BlockState = state ?? { status: 'ready' };
  if (effective.status === 'ready' && (stats.start < 0 || stats.max <= 0)) effective = { status: 'empty' };
  const skeleton =
    variant === 'columns' || variant === 'flow' ? (
      <Skeleton shape="bars" />
    ) : (
      <div className="vl-funnel__skeleton">
        {SKELETON_WIDTHS.map((w) => (
          <VarBox key={w} vars={{ '--vl-w': `${w}%` }} className="vl-funnel__skeleton-bar">
            <Skeleton shape="rect" />
          </VarBox>
        ))}
      </div>
    );
  return (
    <div className={cx('vl-funnel', `vl-funnel--${variant}`, className)} data-testid={props['data-testid']}>
      <StateView state={effective} skeleton={skeleton}>
        <FunnelBody {...props} stats={stats} />
      </StateView>
    </div>
  );
}

interface BodyProps<Id extends string> extends FunnelChartProps<Id> {
  readonly stats: FunnelStats<Id>;
}

function FunnelBody<Id extends string>({
  stats,
  title,
  description,
  variant = 'funnel',
  unit = UNIT_COUNT,
  formatValue,
  animate = true,
  tooltip = true,
  height,
  summary = true,
  labels,
  onHover,
  onSelect,
}: BodyProps<Id>) {
  const fmt = useFormat();
  const phone = useIsPhone();
  const mounted = useMounted();
  const locale = useLocale();
  const l = { ...funnelLabels(locale), ...labels };
  const { rows } = stats;
  const value = (v: number) => (formatValue ? formatValue(v) : fmt.value(v, unit, true));
  /** Exact counts: in a funnel "11k" hides 10,641. Millions stay short. */
  const exact = (v: number): string => {
    if (formatValue) return formatValue(v);
    return Math.abs(v) >= 1e6 ? fmt.value(v, unit) : fmt.number(Math.round(v));
  };

  const tweenedValues = useTweenedValues(
    rows.map((r) => (r.known ? r.value : 0)),
    { duration: DURATION.data },
  );
  const tweenedScale = useTweenedValues([stats.max], { duration: DURATION.data, initial: [stats.max] });
  const shown = animate ? tweenedValues : rows.map((r) => (r.known ? r.value : 0));
  const scale = (animate ? tweenedScale[0] : stats.max) || 1;
  const colors = rows.map((r, i) => stepColor(r.slot as number | undefined, i));

  const [active, setActive] = useState<number | null>(null);
  /** Step opened in the phone sheet. */
  const [sheet, setSheet] = useState<number | null>(null);
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null);
  const [plotRef, plotSize, plotNode] = useElementSize<HTMLDivElement>();
  const activeRow = active === null ? null : rows[active];
  const held = useRef<FunnelRow | null>(null);
  if (activeRow) held.current = activeRow;
  useEffect(() => setSheet(null), [stats]);

  // Hold and drag on a phone: the finger reads the steps one by one.
  const scrub = useScrub<HTMLDivElement>({
    enabled: phone,
    onMove: (x, y) => {
      const hit = elementAt(plotNode, x, y, '[data-step]');
      if (hit) enter(Number(hit.dataset['step']), hit);
    },
    onEnd: () => leave(),
  });
  const attachPlot = useCallback(
    (node: HTMLDivElement | null) => {
      plotRef(node);
      scrub.ref(node);
    },
    // Both setters are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plotRef, scrub.ref],
  );

  function enter(index: number, el: Element) {
    setActive(index);
    onHover?.(index, null);
    const target = el.matches('[data-anchor]') ? el : (el.querySelector('[data-anchor]') ?? el);
    if (plotNode) setAnchor(anchorOf(target, plotNode));
  }
  function leave() {
    setActive(null);
    setAnchor(null);
    onHover?.(null);
  }

  function onKey(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(index, null);
      return;
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
      return;
    }
    let to: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') to = index + 1;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') to = index - 1;
    else if (event.key === 'Home') to = 0;
    else if (event.key === 'End') to = rows.length - 1;
    if (to === null || to < 0 || to >= rows.length) return;
    event.preventDefault();
    plotNode?.querySelectorAll<HTMLElement | SVGElement>('[data-step]')[to]?.focus();
  }

  function describe(row: FunnelRow): string {
    if (!row.known) return `${row.label}: ${l.untracked}`;
    const parts = [`${row.label}: ${exact(row.value)}`, `${formatShare(fmt, row.fromStart)} ${l.fromStart}`];
    if (row.previous >= 0 && !row.skipped) parts.push(`${formatShare(fmt, row.fromPrevious)} ${l.fromPrevious}`);
    return parts.join(', ');
  }

  function context(row: FunnelRow): TooltipContext {
    const color = colors[row.index];
    const out: TooltipRow[] = [];
    if (!row.known) {
      out.push({ id: 'none', label: l.untracked, value: '—', color });
    } else {
      out.push({ id: 'reached', label: l.reached, value: value(row.value), color, strong: true });
      out.push({ id: 'start', label: l.fromStart, value: formatShare(fmt, row.fromStart) });
      if (row.previous >= 0 && row.skipped) out.push({ id: 'skipped', label: l.skipped, value: '—', muted: true });
      if (row.previous >= 0 && !row.skipped) {
        out.push({ id: 'prev', label: l.fromPrevious, value: formatShare(fmt, row.fromPrevious) });
        out.push({ id: 'lost', label: l.lost, value: value(row.lost), muted: true });
      }
    }
    return { title: row.label, rows: out, index: row.index, values: { [row.id]: row.value } };
  }

  const shared: DrawProps = {
    rows,
    shown,
    scale,
    colors,
    active: sheet ?? active,
    worst: stats.worstDrop,
    labels: l,
    fmt: { exact, share: (v) => formatShare(fmt, v) },
    describe,
    enter,
    leave,
    onKey,
    tap: (index) => {
      if (phone && scrub.swallowClick()) return;
      if (phone) {
        leave();
        setSheet(index);
      }
      onSelect?.(index, null);
    },
  };

  let drawing: ReactNode = null;
  if (variant === 'funnel') drawing = <TaperRows {...shared} />;
  else if (variant === 'dropoff') drawing = <DropoffRows {...shared} />;
  else if (mounted && plotSize.width > 0) {
    drawing =
      variant === 'columns' ? (
        <ColumnsSvg {...shared} width={plotSize.width} height={height ?? COLUMNS_HEIGHT} />
      ) : (
        <FlowSvg {...shared} width={plotSize.width} height={height ?? SVG_HEIGHT} />
      );
  }

  const sheetRow = sheet === null ? null : (rows[sheet] ?? null);
  const showTooltip = tooltip !== false;
  const shownRow = activeRow ?? held.current;
  let tipBody: ReactNode = null;
  if (shownRow) {
    const ctx = context(shownRow);
    tipBody = typeof tooltip === 'function' ? tooltip(ctx) : <TooltipContent title={ctx.title} rows={ctx.rows} />;
  }
  const first = stats.start >= 0 ? rows[stats.start] : null;
  const last = stats.end >= 0 ? rows[stats.end] : null;
  const worst = stats.worstDrop >= 0 ? rows[stats.worstDrop] : null;
  const showSummary = summary && first !== null && last !== null && stats.end > stats.start && Number.isFinite(stats.total);

  return (
    <div className="vl-funnel__body" onPointerLeave={() => !scrub.scrubbing && leave()}>
      {showSummary && first && last ? (
        <div className="vl-funnel__summary">
          <div className="vl-funnel__headline">
            <b className="vl-funnel__total">{formatShare(fmt, stats.total)}</b>
            <span>
              {l.summary(last.label)}
              <span className="vl-funnel__of">{` · ${l.summaryOf(exact(last.value), exact(first.value))}`}</span>
            </span>
          </div>
          {worst ? <div className="vl-funnel__worst">{l.worst(worst.label, formatShare(fmt, 1 - worst.fromPrevious))}</div> : null}
        </div>
      ) : null}
      <div ref={attachPlot} className="vl-funnel__plot vl-scrub-area" role="group" aria-label={title}>
        {drawing}
        {showTooltip ? (
          <ChartTooltip
            open={activeRow !== null && anchor !== null && (!phone || scrub.scrubbing)}
            anchor={anchor}
            bounds={plotSize}
            prefer="top"
            aria-label={title}
          >
            {tipBody}
          </ChartTooltip>
        ) : null}
      </div>
      {phone ? (
        <BottomSheet open={sheet !== null} onClose={() => setSheet(null)} closeLabel={l.close} aria-label={title}>
          {sheetRow ? (
            <SheetSummary
              series={rows.map((r) => ({ id: r.id, label: r.label, color: colors[r.index] }))}
              activeId={sheetRow.id}
              onChange={(id) => setSheet(rows.findIndex((r) => r.id === id))}
              title={sheetRow.label}
              subtitle={l.stepOf(sheetRow.index + 1, rows.length)}
              preview={
                <FunnelSide
                  rows={rows}
                  colors={colors}
                  max={stats.max}
                  active={sheetRow.index}
                  labels={l}
                  share={(v) => formatShare(fmt, v)}
                  onSelect={setSheet}
                />
              }
              stats={sheetStats(stats, sheetRow, l, value, (v) => formatShare(fmt, v))}
            />
          ) : null}
        </BottomSheet>
      ) : null}
      {description ? <VisuallyHidden>{description}</VisuallyHidden> : null}
      <ChartDataTable
        caption={title}
        columns={[l.step, l.reached, l.fromStart, l.fromPrevious, l.lost]}
        rows={rows.map((r) => [
          r.label,
          r.known ? exact(r.value) : l.untracked,
          formatShare(fmt, r.fromStart),
          r.skipped ? l.skipped : formatShare(fmt, r.fromPrevious),
          Number.isFinite(r.lost) ? exact(r.lost) : '—',
        ])}
      />
    </div>
  );
}

interface DrawProps {
  readonly rows: readonly FunnelRow[];
  readonly shown: readonly number[];
  readonly scale: number;
  readonly colors: readonly string[];
  readonly active: number | null;
  readonly worst: number;
  readonly labels: FunnelLabels;
  readonly fmt: { readonly exact: (v: number) => string; readonly share: (v: number) => string };
  readonly describe: (row: FunnelRow) => string;
  readonly enter: (index: number, el: Element) => void;
  readonly leave: () => void;
  readonly onKey: (event: KeyboardEvent<HTMLElement>, index: number) => void;
  readonly tap: (index: number) => void;
}

const pct = (v: number, scale: number): number => (scale > 0 ? Math.max(0, Math.min(100, (v / scale) * 100)) : 0);
/** A step with people is at least a sliver wide. */
const visible = (p: number, v: number): number => (v > 0 ? Math.max(p, 1.5) : 0);

function Numbers({ row, labels, fmt, worst }: { row: FunnelRow; labels: FunnelLabels; fmt: DrawProps['fmt']; worst: boolean }) {
  if (!row.known) return <span className="vl-funnel__nums vl-funnel__nums--muted">{labels.untracked}</span>;
  return (
    <span className="vl-funnel__nums">
      <b className="vl-funnel__value">{fmt.exact(row.value)}</b>
      <span className="vl-funnel__sub">{`${fmt.share(row.fromStart)} ${labels.fromStart}`}</span>
      {row.previous >= 0 ? (
        <span className="vl-funnel__step-conv" data-worst={worst || undefined} data-skipped={row.skipped || undefined}>
          {row.skipped ? labels.skipped : `↓ ${fmt.share(row.fromPrevious)}`}
        </span>
      ) : null}
    </span>
  );
}

function RowShell({ p, i, children }: { p: DrawProps; i: number; children: ReactNode }) {
  const row = p.rows[i];
  return (
    <li
      className="vl-funnel__step"
      data-step={i}
      data-state={markState(p.active, i)}
      data-worst={p.worst === i || undefined}
      data-known={row.known}
      tabIndex={0}
      aria-label={p.describe(row)}
      onPointerEnter={(e) => isMouse(e) && p.enter(i, e.currentTarget)}
      onFocus={(e) => p.enter(i, e.currentTarget)}
      onBlur={p.leave}
      onKeyDown={(e) => p.onKey(e, i)}
      onClick={() => p.tap(i)}
    >
      <span className="vl-funnel__name" title={row.label}>
        {row.label}
      </span>
      {children}
      <Numbers row={row} labels={p.labels} fmt={p.fmt} worst={p.worst === i} />
    </li>
  );
}

/** Classic tapered bands: each band narrows to the width of the next known step. */
function TaperRows(p: DrawProps) {
  return (
    <ol className="vl-funnel__rows vl-funnel__rows--taper">
      {p.rows.map((row, i) => {
        const a = visible(pct(p.shown[i], p.scale), p.shown[i]);
        const next = nextKnown(p.rows, i);
        const b = next >= 0 ? visible(pct(p.shown[next], p.scale), p.shown[next]) : a;
        return (
          <RowShell key={row.id} p={p} i={i}>
            <span className="vl-funnel__graphic" data-anchor="">
              {row.known ? (
                <VarBox
                  as="span"
                  className="vl-funnel__shape"
                  vars={{ '--vl-a': `${a}%`, '--vl-b': `${Math.min(a, b)}%`, '--vl-step-color': p.colors[i] }}
                />
              ) : null}
            </span>
          </RowShell>
        );
      })}
    </ol>
  );
}

/** Full-width rows: reached in colour, what was lost since the previous step hatched. */
function DropoffRows(p: DrawProps) {
  return (
    <ol className="vl-funnel__rows vl-funnel__rows--dropoff">
      {p.rows.map((row, i) => {
        const w = visible(pct(p.shown[i], p.scale), p.shown[i]);
        const prev = row.previous >= 0 ? p.shown[row.previous] : 0;
        const lost = row.known && !row.skipped && prev > p.shown[i] ? pct(prev - p.shown[i], p.scale) : 0;
        return (
          <RowShell key={row.id} p={p} i={i}>
            <span className="vl-funnel__graphic" data-anchor="">
              {row.known ? (
                <>
                  <VarBox as="span" className="vl-funnel__reached" vars={{ '--vl-w': `${w}%`, '--vl-step-color': p.colors[i] }} />
                  {lost > 0 ? <VarBox as="span" className="vl-funnel__lost" vars={{ '--vl-x': `${w}%`, '--vl-w': `${lost}%` }} /> : null}
                </>
              ) : null}
            </span>
          </RowShell>
        );
      })}
    </ol>
  );
}

interface SvgProps extends DrawProps {
  readonly width: number;
  readonly height: number;
}

const TOP = 30;
const LABEL_ZONE = 46;

/** Geometry shared by the columns and the flow: where each step stands. */
function layout(p: SvgProps) {
  const n = p.rows.length;
  const width = Math.max(p.width, n * MIN_STEP_WIDTH);
  const slot = width / n;
  const plotH = Math.max(40, p.height - TOP - LABEL_ZONE);
  const base = TOP + plotH;
  return { n, width, slot, plotH, base };
}

function StepLabels({ p, i, slot, cx: x, baseline }: { p: SvgProps; i: number; slot: number; cx: number; baseline: number }) {
  const row = p.rows[i];
  return (
    <g className="vl-funnel__labels" aria-hidden="true">
      <text x={x} y={baseline + 18} textAnchor="middle" className="vl-funnel__svg-name">
        {fit(row.label, slot - 8)}
      </text>
      <text x={x} y={baseline + 34} textAnchor="middle" className="vl-funnel__svg-sub">
        {row.known ? p.fmt.share(row.fromStart) : p.labels.untracked}
      </text>
    </g>
  );
}

function SvgStep({
  p,
  i,
  x,
  w,
  base: baseProp,
  zone = LABEL_ZONE,
  children,
}: {
  p: SvgProps;
  i: number;
  x: number;
  w: number;
  base?: number;
  zone?: number;
  children: ReactNode;
}) {
  const base = baseProp ?? layout(p).base;
  return (
    <g
      className="vl-funnel__svg-step"
      data-step={i}
      data-state={markState(p.active, i)}
      data-worst={p.worst === i || undefined}
      tabIndex={0}
      role="img"
      aria-label={p.describe(p.rows[i])}
      onPointerEnter={(e) => isMouse(e) && p.enter(i, e.currentTarget)}
      onFocus={(e) => p.enter(i, e.currentTarget)}
      onBlur={p.leave}
      onKeyDown={(e) => p.onKey(e as unknown as KeyboardEvent<HTMLElement>, i)}
      onClick={() => p.tap(i)}
    >
      <rect x={x - w / 2} y={0} width={w} height={base + zone} className="vl-funnel__hit" data-anchor="" />
      {children}
    </g>
  );
}

/** Path of a block with rounded top corners (radius `r`, clamped to the block). */
function topRounded(x: number, y: number, w: number, h: number, r: number): string {
  const o = Math.max(0, Math.min(r, w / 2, h));
  return `M ${x} ${y + h} L ${x} ${y + o} Q ${x} ${y} ${x + o} ${y} L ${x + w - o} ${y} Q ${x + w} ${y} ${x + w} ${y + o} L ${x + w} ${y + h} Z`;
}

const COLUMNS_HEIGHT = 320;
const COLUMNS_TOP = 40;
const COLUMNS_LABEL_ZONE = 54;

/** Columns: every step a bar, what was lost since the previous step a hatched ghost above it. */
function ColumnsSvg(p: SvgProps) {
  const id = useId().replace(/:/g, '');
  const n = p.rows.length;
  const width = Math.max(p.width, n * MIN_STEP_WIDTH);
  const slot = width / n;
  const base = p.height - COLUMNS_LABEL_ZONE;
  const plotH = Math.max(40, base - COLUMNS_TOP);
  const colW = Math.min(88, slot * 0.5);
  const scale = p.scale || 1;
  const x = (i: number) => slot * (i + 0.5);
  const heightOf = (i: number) => Math.max(3, (plotH * p.shown[i]) / scale);
  const firstKnown = p.rows.findIndex((r) => r.known);
  const lastKnown = p.rows.reduce((acc, r, i) => (r.known ? i : acc), -1);
  const accentLast = lastKnown > firstKnown;
  return (
    <div className="vl-funnel__scroll">
      <svg className="vl-funnel__svg" width={width} height={p.height} viewBox={`0 0 ${width} ${p.height}`}>
        <defs>
          <pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" className="vl-funnel__hatch-bg" />
            <line x1="0" y1="0" x2="0" y2="6" className="vl-funnel__hatch-line" strokeWidth="2" />
          </pattern>
          {p.colors.map((color, i) => (
            <linearGradient key={i} id={`${id}-g${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="1" />
              <stop offset="1" stopColor={color} stopOpacity="0.72" />
            </linearGradient>
          ))}
        </defs>
        <line x1={0} x2={width} y1={base + 0.5} y2={base + 0.5} className="vl-funnel__axis" />
        {p.rows.map((row, i) => {
          const barH = row.known ? heightOf(i) : plotH * 0.5;
          const prevH = row.known && row.previous >= 0 && !row.skipped ? heightOf(row.previous) : 0;
          const lostH = prevH > barH + 1 ? prevH - barH : 0;
          const valueY = base - barH - 10;
          let dropY = base - prevH - 10;
          if (lostH > 0 && valueY - dropY < 20) dropY = valueY - 20;
          const worst = p.worst === i;
          const left = x(i) - colW / 2;
          return (
            <SvgStep key={row.id} p={p} i={i} x={x(i)} w={slot} base={base} zone={COLUMNS_LABEL_ZONE}>
              {lostH > 0 ? (
                <path
                  d={topRounded(left, base - prevH, colW, lostH + 6, 8)}
                  fill={`url(#${id}-hatch)`}
                  className="vl-funnel__ghost"
                  data-worst={worst || undefined}
                />
              ) : null}
              <path
                d={topRounded(left, base - barH, colW, barH, lostH > 0 ? 0 : 8)}
                fill={row.known ? `url(#${id}-g${i})` : `url(#${id}-hatch)`}
                className="vl-funnel__column"
              />
              <g aria-hidden="true">
                {lostH > 0 && Number.isFinite(row.lost) ? (
                  <text x={x(i)} y={dropY} textAnchor="middle" className="vl-funnel__drop" data-quiet={worst ? undefined : 'true'}>
                    {`−${p.fmt.exact(row.lost)}`}
                  </text>
                ) : null}
                <text
                  x={x(i)}
                  y={valueY}
                  textAnchor="middle"
                  className="vl-funnel__col-value"
                  data-accent={(accentLast && i === lastKnown) || undefined}
                >
                  {row.known ? p.fmt.exact(Math.round(p.shown[i])) : p.labels.untracked}
                </text>
                <text x={x(i)} y={base + 22} textAnchor="middle" className="vl-funnel__col-name">
                  {fit(row.label, slot - 14)}
                </text>
                <text x={x(i)} y={base + 40} textAnchor="middle" className="vl-funnel__col-sub">
                  {row.known && i !== firstKnown ? `${p.fmt.share(row.fromStart)} ${p.labels.fromStart}` : ''}
                </text>
                {row.known && row.previous >= 0 && slot - colW >= 44 ? (
                  <text x={x(i) - slot / 2} y={base - 12} textAnchor="middle" className="vl-funnel__arrow" data-worst={worst || undefined}>
                    {row.skipped ? '→' : `→ ${p.fmt.share(row.fromPrevious)}`}
                  </text>
                ) : null}
              </g>
            </SvgStep>
          );
        })}
      </svg>
    </div>
  );
}

const NODE_W = 14;

function ribbon(x0: number, y0: number, h0: number, x1: number, y1: number, h1: number): string {
  const mid = (x0 + x1) / 2;
  return `M ${x0} ${y0} C ${mid} ${y0}, ${mid} ${y1}, ${x1} ${y1} L ${x1} ${y1 + h1} C ${mid} ${y1 + h1}, ${mid} ${y0 + h0}, ${x0} ${y0 + h0} Z`;
}

function FlowSvg(p: SvgProps) {
  const { width, slot, plotH, base } = layout(p);
  const x = (i: number) => i * slot + slot / 2;
  const h = (i: number) => (pct(p.shown[i], p.scale) / 100) * plotH;
  return (
    <div className="vl-funnel__scroll">
      <svg className="vl-funnel__svg" width={width} height={p.height} viewBox={`0 0 ${width} ${p.height}`}>
        {p.rows.map((row, i) => {
          const j = nextKnown(p.rows, i);
          if (!row.known || j < 0) return null;
          const hi = h(i);
          const hj = Math.min(h(j), hi);
          const worst = p.worst === j;
          const xr = x(i) + NODE_W / 2;
          const xl = x(j) - NODE_W / 2;
          return (
            <g key={`r${row.id}`} aria-hidden="true">
              <path d={ribbon(xr, TOP, hj, xl, TOP, hj)} fill={p.colors[j]} className="vl-funnel__ribbon" />
              {hi - hj > 0.5 ? (
                <path
                  d={ribbon(xr, TOP + hj, hi - hj, xl - (xl - xr) * 0.15, base - 2, 2)}
                  className="vl-funnel__lost-ribbon"
                  data-worst={worst || undefined}
                />
              ) : null}
              <text x={(xr + xl) / 2} y={TOP - 10} textAnchor="middle" className="vl-funnel__pill" data-worst={worst || undefined}>
                {p.rows[j].skipped ? '…' : p.fmt.share(p.rows[j].fromPrevious)}
              </text>
            </g>
          );
        })}
        {p.rows.map((row, i) => (
          <SvgStep key={row.id} p={p} i={i} x={x(i)} w={Math.min(slot - 4, 72)}>
            {row.known ? (
              <>
                <rect
                  x={x(i) - NODE_W / 2}
                  y={TOP}
                  width={NODE_W}
                  height={Math.max(2, h(i))}
                  rx={4}
                  fill={p.colors[i]}
                  className="vl-funnel__column"
                />
                <text x={x(i)} y={TOP + Math.max(2, h(i)) + 16} textAnchor="middle" className="vl-funnel__svg-value" aria-hidden="true">
                  {p.fmt.exact(row.value)}
                </text>
              </>
            ) : null}
            <StepLabels p={p} i={i} slot={slot} cx={x(i)} baseline={base} />
          </SvgStep>
        ))}
      </svg>
    </div>
  );
}

const isNumber = (v: number): boolean => Number.isFinite(v);

/** Stats of the phone sheet: this step, from the previous one, what came next and who left. */
function sheetStats(
  stats: FunnelStats,
  row: FunnelRow,
  l: FunnelLabels,
  value: (v: number) => string,
  share: (v: number) => string,
): SheetStat[] {
  if (!row.known) {
    return [
      { id: 'v', label: l.sheetHere, value: '—', hint: l.untracked },
      { id: 'p', label: l.sheetFromPrevious, value: '—' },
      { id: 'n', label: l.sheetNext, value: '—' },
      { id: 'l', label: l.sheetLostNext, value: '—' },
    ];
  }
  const next = stats.rows.slice(row.index + 1).find((r) => r.known);
  const first = row.index === stats.start;
  const here: SheetStat = {
    id: 'v',
    label: l.sheetHere,
    value: value(row.value),
    hint: first ? l.sheetStart : l.sheetFromStart(share(row.fromStart)),
  };
  let fromPrevious: SheetStat = { id: 'p', label: l.sheetFromPrevious, value: '—', hint: l.sheetFirst };
  if (row.skipped) fromPrevious = { id: 'p', label: l.sheetFromPrevious, value: '↑', hint: l.skipped };
  else if (!first && isNumber(row.fromPrevious)) fromPrevious = { id: 'p', label: l.sheetFromPrevious, value: share(row.fromPrevious) };
  let passed: SheetStat = { id: 'n', label: l.sheetNext, value: '—', hint: l.sheetLast };
  if (next?.skipped) passed = { id: 'n', label: l.sheetNext, value: '↑', hint: l.skipped };
  else if (next && isNumber(next.fromPrevious))
    passed = { id: 'n', label: l.sheetNext, value: share(next.fromPrevious), hint: value(next.value) };
  let left: SheetStat = { id: 'l', label: l.sheetLostNext, value: '—', hint: l.sheetLast };
  if (next && isNumber(next.lost)) left = { id: 'l', label: l.sheetLostNext, value: value(next.lost), hint: l.sheetOf(value(row.value)) };
  return [here, fromPrevious, passed, left];
}

const SIDE_WIDTH = 340;
const SIDE_HEIGHT = 92;
const SIDE_BAND = 72;
const SIDE_GAP = 4;

/** Polygon with rounded corners: each corner is a quadratic curve that starts `radius` before it. */
function roundedPolygon(points: readonly (readonly [number, number])[], radius: number): string {
  const n = points.length;
  const toward = (from: readonly [number, number], to: readonly [number, number]): [number, number] => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(radius, len / 2) / len;
    return [from[0] + dx * k, from[1] + dy * k];
  };
  const parts = points.map((corner, i) => {
    const a = toward(corner, points[(i + n - 1) % n]);
    const b = toward(corner, points[(i + 1) % n]);
    return `${i === 0 ? 'M' : 'L'} ${a[0].toFixed(2)} ${a[1].toFixed(2)} Q ${corner[0].toFixed(2)} ${corner[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
  });
  return `${parts.join(' ')} Z`;
}

/** Side silhouette of the whole funnel for the phone sheet: tap a band to jump to its step. */
function FunnelSide({
  rows,
  colors,
  max,
  active,
  labels,
  share,
  onSelect,
}: {
  readonly rows: readonly FunnelRow[];
  readonly colors: readonly string[];
  readonly max: number;
  readonly active: number;
  readonly labels: FunnelLabels;
  readonly share: (v: number) => string;
  readonly onSelect: (index: number) => void;
}) {
  const hatch = useId().replace(/:/g, '');
  const n = rows.length;
  const scale = max || 1;
  const bandW = (SIDE_WIDTH - SIDE_GAP * (n - 1)) / Math.max(1, n);
  const mid = SIDE_BAND / 2;
  /** Height of a band: unknown steps continue the previous one, a bit narrower. */
  const heightOf = (i: number): number => {
    const row = rows[i];
    if (row?.known) return SIDE_BAND * (0.16 + (0.84 * row.value) / scale);
    return i > 0 ? heightOf(i - 1) * 0.8 : SIDE_BAND;
  };
  return (
    <svg className="vl-funnel-side" viewBox={`0 0 ${SIDE_WIDTH} ${SIDE_HEIGHT}`} role="group" aria-label={labels.stepOf(active + 1, n)}>
      <defs>
        <pattern id={`${hatch}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" className="vl-funnel-side__hatch-bg" />
          <line x1="0" y1="0" x2="0" y2="6" className="vl-funnel-side__hatch-line" strokeWidth="2" />
        </pattern>
      </defs>
      {rows.map((row, i) => {
        const x0 = i * (bandW + SIDE_GAP);
        const x1 = x0 + bandW;
        const h0 = heightOf(i);
        const h1 = i + 1 < n ? heightOf(i + 1) : h0 * 0.86;
        const d = roundedPolygon(
          [
            [x0, mid - h0 / 2],
            [x1, mid - h1 / 2],
            [x1, mid + h1 / 2],
            [x0, mid + h0 / 2],
          ],
          6,
        );
        return (
          <path
            key={row.id}
            d={d}
            fill={row.known ? colors[i] : `url(#${hatch}-hatch)`}
            className="vl-funnel-side__step"
            data-on={i === active || undefined}
            onClick={() => onSelect(i)}
          />
        );
      })}
      {rows.map((row, i) => {
        if (i === 0 || !row.known || row.previous < 0) return null;
        const on = i === active || i - 1 === active;
        return (
          <text
            key={`t${row.id}`}
            x={i * (bandW + SIDE_GAP) - SIDE_GAP / 2}
            y={SIDE_HEIGHT - 6}
            textAnchor="middle"
            className="vl-funnel-side__pct"
            data-on={on || undefined}
          >
            {row.skipped ? '↑' : share(row.fromPrevious)}
          </text>
        );
      })}
    </svg>
  );
}
