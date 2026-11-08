import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  type BaseChartProps,
  type BlockState,
  type ChartEvents,
  ChartDataTable,
  ChartTooltip,
  cx,
  DURATION,
  type HourlySeries,
  type Locale,
  Skeleton,
  StateView,
  TooltipContent,
  type TooltipContext,
  type TooltipOptions,
  type TooltipRow,
  type TimeRange,
  type TimeZone,
  UNIT_COUNT,
  useElementSize,
  useFormat,
  useLocale,
  useTweenedValues,
  useVizConfig,
  VisuallyHidden,
} from '../../core';
import { DAY_HOURS, groupHours, heatmapStats, type HeatmapStats, WEEK_DAYS, type WeekHourGrid, weekHourGrid } from '../model/heatmap';
import { BottomSheet } from '../shared/bottom-sheet';
import { useIsPhone, useScrub } from '../shared/hooks';
import { type SheetNote, type SheetStat, SheetSummary } from '../shared/sheet-summary';
import { TimelineStrip } from '../shared/timeline-strip';
import { anchorOf, elementAt, formatShare, isMouse, type TooltipAnchor, VarBox } from './common';
import { HEATMAP_LABELS_RU, isRu } from './labels';

/** Copy of the heatmap. Defaults are English; weekday names come from the locale. */
export interface HeatmapLabels {
  readonly value: string;
  readonly ofWeek: string;
  readonly vsUsual: string;
  readonly dayTotal: string;
  readonly noData: string;
  readonly few: string;
  readonly many: string;
  readonly perDay: string;
  readonly perHour: string;
  /** "Peak: Fri 20:00 · 142". */
  readonly peak: (slot: string, value: string) => string;
  /** Headline next to the big peak slot: "peak · 142". Without it the headline is the one `peak` line. */
  readonly hot?: (value: string) => string;
  /** "Strongest day: Fri — 21% of the week". */
  readonly bestDay: (day: string, share: string) => string;
  readonly day: string;
  readonly total: string;
  /** Phone sheet: "Share of the week". */
  readonly sheetShare: string;
  /** "from 20:00 to 21:00". */
  readonly hoursHint: (from: string, to: string) => string;
  /** "of 1,240 for the week". */
  readonly weekTotal: (total: string) => string;
  /** "21% of the week". */
  readonly dayShare: (share: string) => string;
  /** "usually 7 per hour"; `step` is hours per column. */
  readonly meanHint: (mean: string, step: number) => string;
  /** Verdicts about the slot. */
  readonly topSlot: string;
  readonly hotSlot: string;
  readonly aboveSlot: string;
  readonly usualSlot: string;
  readonly quietSlot: string;
  readonly emptySlot: string;
  readonly topDetail: string;
  /** "Peak of the day — 20:00–21:00 · 40". */
  readonly dayPeak: (slot: string, value: string) => string;
  readonly isDayPeak: string;
  /** Hint under the strip of bars; `step` is hours per column. */
  readonly timelineHint: (step: number) => string;
  /** Accessible name of the sheet's close button. */
  readonly close: string;
}

/** English copy; `HeatmapChart` picks Russian for a Russian locale. */
export const DEFAULT_HEATMAP_LABELS: HeatmapLabels = {
  value: 'Sales',
  ofWeek: 'of the week',
  vsUsual: 'vs. an average slot',
  dayTotal: 'Whole day',
  noData: 'No data for this slot',
  few: 'less',
  many: 'more',
  perDay: 'per day',
  perHour: 'per hour',
  peak: (slot, value) => `Peak: ${slot} · ${value}`,
  hot: (value) => `peak · ${value}`,
  bestDay: (day, share) => `Strongest day: ${day} — ${share} of the week`,
  day: 'Day',
  total: 'Total',
  sheetShare: 'Share of the week',
  hoursHint: (from, to) => `from ${from} to ${to}`,
  weekTotal: (total) => `of ${total} for the week`,
  dayShare: (share) => `${share} of the week`,
  meanHint: (mean, step) => `usually ${mean} per ${step === 1 ? 'hour' : `${step} hours`}`,
  topSlot: 'Peak of the week',
  hotSlot: 'Lots of purchases',
  aboveSlot: 'Above usual',
  usualSlot: 'As usual',
  quietSlot: 'Below usual',
  emptySlot: 'No purchases',
  topDetail: 'Most purchases of the week',
  dayPeak: (slot, value) => `Peak of the day — ${slot} · ${value}`,
  isDayPeak: 'This is the peak of the day',
  timelineHint: (step) => `A bar is sales per ${step === 1 ? 'hour' : `${step} hours`}. Scroll the strip to see neighbouring hours.`,
  close: 'Close',
};

/** Words of the heatmap for a locale: Russian for `ru`, English otherwise. `labels` overrides any. */
export const heatmapLabels = (locale: Locale): HeatmapLabels => (isRu(locale) ? HEATMAP_LABELS_RU : DEFAULT_HEATMAP_LABELS);

interface HeatmapCommon extends BaseChartProps, TooltipOptions, ChartEvents {
  /** Row and column totals along the edges. Default true. */
  readonly totals?: boolean;
  /** Headline: the peak slot and the strongest day. Default true. */
  readonly summary?: boolean;
  /** Colour legend ("less … more") under the grid. Default true. */
  readonly scale?: boolean;
  /** Overrides the words; defaults follow the locale of `VizProvider` (English or Russian). */
  readonly labels?: Partial<HeatmapLabels>;
}

export interface HeatmapChartProps extends HeatmapCommon {
  /** `grid[day][hour]`, day 0 is Monday, 24 hours (`weekHourGrid`). `NaN` — no data, `0` — nothing sold. */
  readonly grid?: WeekHourGrid;
  /** Alternative to `grid`: an hourly series (UTC), folded into weekday x hour in the provider's time zone. */
  readonly hourly?: HourlySeries;
  /** With `hourly`: which series to add up. Default: all. */
  readonly ids?: readonly string[];
  readonly range?: TimeRange;
  /** Overrides the zone of `VizProvider`. */
  readonly zone?: TimeZone;
}

/** Cell colour mix: the share of the dark end of the ramp; empty-but-known slots stay at the light end. */
export const ALPHA_BASE = 0.14;
export const ALPHA_RANGE = 0.86;
export const ALPHA_GAMMA = 0.8;

/** How strongly a cell is coloured, 0…1: `.14 + .86 · (v / max)^.8`; zero and unknown are 0. */
export function cellAlpha(value: number, max: number): number {
  if (!(value > 0) || !(max > 0)) return 0;
  return ALPHA_BASE + ALPHA_RANGE * Math.min(1, value / max) ** ALPHA_GAMMA;
}

/** Hours per column so that a cell stays at least ~16 px wide. */
export function pickHourStep(plotWidth: number): 1 | 2 | 3 | 4 {
  for (const step of [1, 2, 3] as const) if (plotWidth / (DAY_HOURS / step) >= 16) return step;
  return 4;
}

const pad2 = (n: number): string => String(n).padStart(2, '0');
const capital = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
const DAY_LABEL_W = 30;
const TOTAL_W = 62;

/**
 * Weekday × hour heatmap: when people buy. One hue from "less" to "more"; totals at the edges; hover
 * or keyboard focus on a cell shows its value, share of the week and how it compares to an average slot.
 * Narrow screens merge hours into 2–3 hour columns. Hours are read in the time zone of `VizProvider`.
 */
export function HeatmapChart(props: HeatmapChartProps) {
  const { state, className } = props;
  const zone = useVizConfig().zone;
  const grid = useMemo<WeekHourGrid>(() => {
    if (props.grid) return props.grid;
    if (!props.hourly) throw new Error('HeatmapChart needs either `grid` or `hourly`');
    return weekHourGrid(props.hourly, { ids: props.ids, range: props.range, zone: props.zone ?? zone });
  }, [props.grid, props.hourly, props.ids, props.range, props.zone, zone]);
  const stats = useMemo(() => heatmapStats(grid), [grid]);
  let effective: BlockState = state ?? { status: 'ready' };
  if (effective.status === 'ready' && stats.max <= 0) effective = { status: 'empty' };
  const skeleton = (
    <div className="vl-heatmap__skeleton">
      {Array.from({ length: WEEK_DAYS * 12 }, (_, i) => (
        <Skeleton key={i} shape="rect" />
      ))}
    </div>
  );
  return (
    <div className={cx('vl-heatmap', className)} data-testid={props['data-testid']}>
      <StateView state={effective} skeleton={skeleton}>
        <HeatmapBody {...props} grid={grid} />
      </StateView>
    </div>
  );
}

function HeatmapBody({
  grid,
  title,
  description,
  unit = UNIT_COUNT,
  formatValue,
  animate = true,
  tooltip = true,
  totals = true,
  summary = true,
  scale: showScale = true,
  labels,
  onHover,
  onSelect,
}: HeatmapChartProps & { readonly grid: WeekHourGrid }) {
  const fmt = useFormat();
  const locale = useLocale();
  const phone = useIsPhone();
  const l = { ...heatmapLabels(locale), ...labels };
  const [boxRef, boxSize] = useElementSize<HTMLDivElement>();
  const plotWidth = Math.max(0, boxSize.width - DAY_LABEL_W - (totals ? TOTAL_W : 0));
  // Before the first measurement (and on the server) draw the full 24 columns.
  const step = boxSize.width > 0 ? pickHourStep(plotWidth) : 1;
  const cells = useMemo(() => (step > 1 ? groupHours(grid, step) : grid.map((row) => [...row])), [grid, step]);
  const stats = useMemo(() => heatmapStats(cells), [cells]);
  const cols = cells[0]?.length ?? DAY_HOURS;
  const value = (v: number) => (formatValue ? formatValue(v) : fmt.value(v, unit, true));

  const flat = useMemo(() => cells.flat(), [cells]);
  const tweened = useTweenedValues(
    flat.map((v) => (v === v ? v : 0)),
    { duration: DURATION.data },
  );
  const tweenedMax = useTweenedValues([stats.max], { duration: DURATION.data, initial: [stats.max] })[0];
  const shown = animate ? tweened : flat.map((v) => (v === v ? v : 0));
  const max = (animate ? tweenedMax : stats.max) || 1;

  const dayName = (d: number) => capital(locale.weekdaysShort[(d + 1) % 7]);
  const dayLong = (d: number) => locale.weekdaysLong[(d + 1) % 7];
  const slotRange = (col: number) => `${pad2(col * step)}:00–${pad2((col * step + step) % 24)}:00`;

  const [focusCell, setFocusCell] = useState<{ day: number; col: number }>({ day: 0, col: 0 });
  const [active, setActive] = useState<{ day: number; col: number } | null>(null);
  /** Cell opened in the phone sheet. */
  const [sheet, setSheet] = useState<{ day: number; col: number } | null>(null);
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const held = useRef<{ day: number; col: number } | null>(null);
  if (active) held.current = active;
  // The cell the drawing highlights: the one in the sheet while it is open, else the hovered one.
  const current = sheet ?? active;
  useEffect(() => setSheet(null), [grid, step]);

  // Hold and drag on a phone: the finger reads the cells one by one.
  const scrub = useScrub<HTMLDivElement>({
    enabled: phone,
    onMove: (x, y) => {
      const hit = elementAt(plotRef.current, x, y, '[data-cell]');
      const [day, col] = (hit?.dataset['cell'] ?? '').split(':').map(Number);
      if (hit && day !== undefined && col !== undefined) enter(day, col, hit);
    },
    onEnd: () => leave(),
  });
  const attachGrid = useCallback(
    (node: HTMLDivElement | null) => {
      plotRef.current = node;
      scrub.ref(node);
    },
    // `scrub.ref` is a stable setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrub.ref],
  );

  function enter(day: number, col: number, el: Element) {
    setActive({ day, col });
    setFocusCell({ day, col });
    onHover?.(day * cols + col, null);
    if (plotRef.current) setAnchor(anchorOf(el, plotRef.current));
  }
  function leave() {
    setActive(null);
    setAnchor(null);
    onHover?.(null);
  }

  function onKey(event: KeyboardEvent<HTMLElement>, day: number, col: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(day * cols + col, null);
      return;
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
      return;
    }
    let d = day;
    let c = col;
    if (event.key === 'ArrowRight') c = Math.min(cols - 1, col + 1);
    else if (event.key === 'ArrowLeft') c = Math.max(0, col - 1);
    else if (event.key === 'ArrowDown') d = Math.min(WEEK_DAYS - 1, day + 1);
    else if (event.key === 'ArrowUp') d = Math.max(0, day - 1);
    else if (event.key === 'Home') c = 0;
    else if (event.key === 'End') c = cols - 1;
    else return;
    event.preventDefault();
    plotRef.current?.querySelector<HTMLElement>(`[data-cell="${d}:${c}"]`)?.focus();
  }

  function describe(day: number, col: number): string {
    const v = cells[day][col];
    const slot = `${dayLong(day)}, ${slotRange(col)}`;
    return v === v ? `${slot}: ${value(v)}` : `${slot}: ${l.noData}`;
  }

  function context(day: number, col: number): TooltipContext {
    const v = cells[day][col];
    const rows: TooltipRow[] = [];
    if (v !== v) {
      rows.push({ id: 'none', label: l.noData, value: '—', muted: true });
    } else {
      rows.push({ id: 'value', label: l.value, value: value(v), strong: true });
      rows.push({ id: 'share', label: l.ofWeek, value: formatShare(fmt, stats.total > 0 ? v / stats.total : Number.NaN) });
      if (stats.mean > 0) rows.push({ id: 'usual', label: l.vsUsual, value: `×${fmt.number(v / stats.mean, 1)}` });
      const dayTotal = stats.dayTotals[day];
      rows.push({ id: 'day', label: l.dayTotal, value: dayTotal === dayTotal ? value(dayTotal) : '—', muted: true });
    }
    return { title: `${dayLong(day)}, ${slotRange(col)}`, rows, index: day * cols + col, values: { value: v } };
  }

  const shownCell = active ?? held.current;
  let tipBody: ReactNode = null;
  if (shownCell) {
    const ctx = context(shownCell.day, shownCell.col);
    tipBody = typeof tooltip === 'function' ? tooltip(ctx) : <TooltipContent title={ctx.title} rows={ctx.rows} />;
  }

  const labelEvery = step === 1 ? 3 : 6;
  const maxDayTotal = Math.max(0, ...stats.dayTotals.filter((v) => v === v));
  const maxColTotal = Math.max(0, ...stats.colTotals.filter((v) => v === v));
  const hot = stats.hot;
  const best = stats.bestDay;

  return (
    <div className="vl-heatmap__body" onPointerLeave={() => !scrub.scrubbing && leave()}>
      {summary && hot ? (
        <div className="vl-heatmap__summary">
          {l.hot && !labels?.peak ? (
            <div className="vl-heatmap__headline">
              <b className="vl-heatmap__peak">{`${dayName(hot.day)} ${pad2(hot.col * step)}:00`}</b>
              <span>{l.hot(value(hot.value))}</span>
            </div>
          ) : (
            <div className="vl-heatmap__peak">{l.peak(`${dayName(hot.day)} ${pad2(hot.col * step)}:00`, value(hot.value))}</div>
          )}
          {best >= 0 ? (
            <div className="vl-heatmap__best">
              {l.bestDay(dayLong(best), formatShare(fmt, stats.total > 0 ? stats.dayTotals[best] / stats.total : Number.NaN))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div ref={boxRef} className="vl-heatmap__plot-box">
        <VarBox
          vars={{ '--vl-heat-cols': cols, '--vl-heat-day-w': `${DAY_LABEL_W}px`, '--vl-heat-total-w': totals ? `${TOTAL_W}px` : '0px' }}
          className="vl-heatmap__plot"
          data-totals={totals || undefined}
        >
          <div
            ref={attachGrid}
            className="vl-heatmap__grid vl-scrub-area"
            role="grid"
            aria-label={title}
            aria-readonly="true"
            data-step={step}
          >
            {totals ? (
              <span className="vl-heatmap__caption vl-heatmap__caption--day" aria-hidden="true">
                {l.perDay}
              </span>
            ) : null}
            {cells.map((row, day) => (
              <div key={day} className="vl-heatmap__row" role="row">
                <span className="vl-heatmap__day" data-on={day === current?.day || undefined} role="rowheader">
                  {dayName(day)}
                </span>
                <div className="vl-heatmap__cells">
                  {row.map((v, col) => {
                    const known = v === v;
                    const t = cellAlpha(shown[day * cols + col], max);
                    const isActive = current?.day === day && current.col === col;
                    let dim: 'near' | 'far' | undefined;
                    if (current && !isActive) dim = current.day === day || current.col === col ? 'near' : 'far';
                    return (
                      <VarBox
                        key={col}
                        vars={{ '--vl-t': t }}
                        className="vl-heatmap__cell"
                        role="gridcell"
                        data-cell={`${day}:${col}`}
                        data-known={known}
                        data-zero={(known && v === 0) || undefined}
                        data-active={isActive || undefined}
                        data-dim={dim}
                        data-hot={(hot?.day === day && hot.col === col) || undefined}
                        tabIndex={focusCell.day === day && focusCell.col === col ? 0 : -1}
                        aria-label={describe(day, col)}
                        onPointerEnter={(e) => isMouse(e) && enter(day, col, e.currentTarget)}
                        onFocus={(e) => enter(day, col, e.currentTarget)}
                        onBlur={leave}
                        onKeyDown={(e) => onKey(e, day, col)}
                        onClick={() => {
                          if (phone && scrub.swallowClick()) return;
                          if (phone) {
                            leave();
                            setSheet({ day, col });
                          }
                          onSelect?.(day * cols + col, null);
                        }}
                      />
                    );
                  })}
                </div>
                {totals ? (
                  <span className="vl-heatmap__total" aria-hidden="true">
                    <VarBox
                      vars={{
                        '--vl-w': maxDayTotal > 0 && stats.dayTotals[day] === stats.dayTotals[day] ? stats.dayTotals[day] / maxDayTotal : 0,
                      }}
                      as="span"
                      className="vl-heatmap__total-bar"
                      data-on={current?.day === day || day === best || undefined}
                    />
                  </span>
                ) : null}
              </div>
            ))}
            {totals ? (
              <div className="vl-heatmap__foot" aria-hidden="true">
                <div className="vl-heatmap__col-totals">
                  {stats.colTotals.map((v, c) => (
                    <VarBox
                      key={c}
                      vars={{ '--vl-h': maxColTotal > 0 && v === v ? v / maxColTotal : 0 }}
                      className="vl-heatmap__col-total"
                      data-on={c === current?.col || undefined}
                    />
                  ))}
                </div>
                <span className="vl-heatmap__caption">{l.perHour}</span>
              </div>
            ) : null}
            <div className="vl-heatmap__hours" aria-hidden="true">
              {Array.from({ length: cols }, (_, c) => {
                const hour = c * step;
                const on = c === current?.col;
                return (
                  <span key={c} className="vl-heatmap__hour" data-on={on || undefined}>
                    {hour % labelEvery === 0 ? `${pad2(hour)}:00` : ''}
                  </span>
                );
              })}
            </div>
          </div>
          {showScale ? (
            <div className="vl-heatmap__scale" aria-hidden="true">
              <span>{l.few}</span>
              <span className="vl-heatmap__ramp">
                <span className="vl-heatmap__end vl-heatmap__end--min">0</span>
                <span className="vl-heatmap__end vl-heatmap__end--max">{fmt.number(stats.max)}</span>
              </span>
              <span>{l.many}</span>
            </div>
          ) : null}
          {tooltip !== false ? (
            <ChartTooltip
              open={active !== null && anchor !== null && (!phone || scrub.scrubbing)}
              anchor={anchor}
              bounds={boxSize}
              prefer="top"
              aria-label={title}
            >
              {tipBody}
            </ChartTooltip>
          ) : null}
        </VarBox>
      </div>
      {phone ? (
        <BottomSheet open={sheet !== null} onClose={() => setSheet(null)} closeLabel={l.close} aria-label={title}>
          {sheet ? (
            <SheetSummary
              color="var(--vl-heat-color, var(--vl-cat-1))"
              title={`${dayName(sheet.day)}, ${slotRange(sheet.col)}`}
              subtitle={dayLong(sheet.day)}
              note={sheetNote(cells, stats, sheet.day, sheet.col, l, (v) => value(v), slotRange)}
              previewHint={l.timelineHint(step)}
              preview={
                <TimelineStrip
                  items={cells.flatMap((row, d) =>
                    row.map((v, c) => ({
                      value: v,
                      major: c === 0 ? dayName(d) : undefined,
                      minor: c > 0 && (c * step) % 6 === 0 ? pad2(c * step) : undefined,
                    })),
                  )}
                  index={sheet.day * cols + sheet.col}
                  onChange={(i) => setSheet({ day: Math.floor(i / cols), col: i % cols })}
                  onScrub={(i) => setSheet({ day: Math.floor(i / cols), col: i % cols })}
                  color="var(--vl-heat-color, var(--vl-cat-1))"
                  loop
                  aria-label={title}
                />
              }
              stats={sheetStats(cells, stats, sheet.day, sheet.col, step, l, {
                value,
                share: (v) => formatShare(fmt, v),
                number: (v, digits) => fmt.number(v, digits),
                slotRange,
              })}
            />
          ) : null}
        </BottomSheet>
      ) : null}
      {description ? <VisuallyHidden>{description}</VisuallyHidden> : null}
      <ChartDataTable
        caption={title}
        columns={[l.day, ...Array.from({ length: DAY_HOURS }, (_, h) => `${pad2(h)}:00`), l.total]}
        rows={grid.map((row, day) => [
          dayLong(day),
          ...row.map((v) => (v === v ? value(v) : '—')),
          stats.dayTotals[day] === stats.dayTotals[day] ? value(stats.dayTotals[day]) : '—',
        ])}
      />
    </div>
  );
}

const isKnown = (v: number | undefined): v is number => v !== undefined && v === v;

/** Verdict of the phone sheet: how the slot ranks in the week and where the peak of its day is. */
function sheetNote(
  cells: WeekHourGrid,
  stats: HeatmapStats,
  day: number,
  col: number,
  l: HeatmapLabels,
  value: (v: number) => string,
  slotRange: (col: number) => string,
): SheetNote {
  const v = cells[day]?.[col];
  const row = cells[day] ?? [];
  let peakCol = 0;
  row.forEach((x, c) => {
    const best = row[peakCol];
    if (isKnown(x) && x > (isKnown(best) ? best : -1)) peakCol = c;
  });
  const peak = row[peakCol];
  const detail = isKnown(peak) && peak > 0 ? l.dayPeak(slotRange(peakCol), value(peak)) : l.noData;
  if (!isKnown(v)) return { title: l.noData, detail };
  if (v <= 0) return { title: l.emptySlot, detail };
  const rank = cells.flat().filter((x) => isKnown(x) && x > v).length + 1;
  const ratio = stats.mean > 0 ? v / stats.mean : 1;
  if (rank === 1) return { title: l.topSlot, detail: l.topDetail };
  const verdict = slotVerdict(ratio, l);
  return { title: verdict, detail: peakCol === col ? l.isDayPeak : detail };
}

function slotVerdict(ratio: number, l: HeatmapLabels): string {
  if (ratio >= 1.5) return l.hotSlot;
  if (ratio > 1.25) return l.aboveSlot;
  if (ratio < 0.75) return l.quietSlot;
  return l.usualSlot;
}

/** Stats of the phone sheet: sold, share of the week, the whole day and the multiple of the average slot. */
function sheetStats(
  cells: WeekHourGrid,
  stats: HeatmapStats,
  day: number,
  col: number,
  step: number,
  l: HeatmapLabels,
  fmt: {
    readonly value: (v: number) => string;
    readonly share: (v: number) => string;
    readonly number: (v: number, digits?: number) => string;
    readonly slotRange: (col: number) => string;
  },
): SheetStat[] {
  const v = cells[day]?.[col];
  const [from = '', to = ''] = fmt.slotRange(col).split('–');
  if (!isKnown(v)) {
    return [
      { id: 'v', label: l.value, value: '—', hint: l.noData },
      { id: 's', label: l.sheetShare, value: '—' },
      { id: 'd', label: l.dayTotal, value: '—' },
      { id: 'm', label: l.vsUsual, value: '—' },
    ];
  }
  const dayTotal = stats.dayTotals[day];
  const share = stats.total > 0 ? fmt.share(v / stats.total) : '—';
  const dayShare = stats.total > 0 && isKnown(dayTotal) ? fmt.share(dayTotal / stats.total) : '—';
  return [
    { id: 'v', label: l.value, value: fmt.value(v), hint: l.hoursHint(from, to) },
    { id: 's', label: l.sheetShare, value: share, hint: l.weekTotal(fmt.number(stats.total)) },
    { id: 'd', label: l.dayTotal, value: isKnown(dayTotal) ? fmt.value(dayTotal) : '—', hint: l.dayShare(dayShare) },
    {
      id: 'm',
      label: l.vsUsual,
      value: stats.mean > 0 ? `×${fmt.number(v / stats.mean, 1)}` : '—',
      hint: l.meanHint(fmt.number(stats.mean), step),
    },
  ];
}
