import { Fragment, type ReactNode, useMemo, useRef, useState } from 'react';

import { type BlockState, ChartDataTable, ChartTooltip, cx, type TooltipRow, TooltipContent, useElementSize, useFormat } from '../../core';
import { cssVars } from '../shared/css-vars';
import { type DayWindow, startDaySelection, useDayWindowGestures } from './day-zoom';
import { type CountdownLabels, countdownLabels } from './labels';
import { StateOverlay } from './parts';
import type { DayEvent } from './rate-columns-chart';

/** Every how many days a tick is drawn; `null` — only at the listed offsets. */
function tickEvery(n: number): number | null {
  if (n > 20) return null;
  if (n > 10) return 2;
  return 1;
}

export interface CountdownColumn {
  /** Days left until the date: 0 is the day itself. */
  readonly offset: number;
  /** Count of each part on that day, by `CountdownPart.id`. */
  readonly parts: Readonly<Record<string, number>>;
}

export interface CountdownPart {
  readonly id: string;
  readonly label: string;
  /** Segment colour. */
  readonly color: string;
}

export interface CountdownZone {
  /** Most days left in the zone (inclusive). */
  readonly from: number;
  /** Fewest days left in the zone (inclusive). */
  readonly to: number;
  /** Short label at the top of the zone: `'50%'`. */
  readonly label: string;
  /** Words before the label, hidden on narrow screens: `'5–10 days · '`. */
  readonly detail?: string;
  /** Shade the zone (the last, "nothing back" days). */
  readonly shaded?: boolean;
}

export interface CountdownMetric {
  readonly id: string;
  /** Name in the switch: `'Requests'`, `'Amount'`. */
  readonly label: string;
  /** Column height of a day. Default: the sum of its parts. */
  readonly value?: (column: CountdownColumn) => number;
  readonly format?: (value: number) => string;
  /** Headline of the whole period by this metric. Default: the formatted total in bold and the label. */
  readonly lead?: (total: string, value: number) => ReactNode;
}

export interface CountdownChartProps<Kind extends string = string> {
  /** Accessible name of the chart and caption of its data table. */
  readonly title: string;
  /** One column per day left, any order; drawn from the most days left to the day itself. */
  readonly columns: readonly CountdownColumn[];
  /** Stacked parts from the bottom up. */
  readonly parts: readonly CountdownPart[];
  /** Bands over the columns with a label on top (e.g. what share is due back). */
  readonly zones?: readonly CountdownZone[];
  /** Events by days left (`index` is the offset). */
  readonly events?: readonly DayEvent<Kind>[];
  readonly renderEventIcon?: (event: { readonly kind: Kind }) => ReactNode;
  readonly eventKindLabel?: (kind: Kind) => string;
  /** Switchable measures of a column; the first is the default. Default: the count of parts. */
  readonly metrics?: readonly CountdownMetric[];
  /** Controlled metric. */
  readonly metric?: string;
  readonly onMetricChange?: (id: string) => void;
  /** Labelled ticks under the axis while every day is shown. Default `[30, 20, 10, 5, 3, 0]`. */
  readonly ticks?: readonly number[];
  /** More tooltip rows of a day, after the parts. */
  readonly tooltipRows?: (column: CountdownColumn) => readonly TooltipRow[];
  /** Narrowest zoom, days. Default 5. */
  readonly minDays?: number;
  readonly labels?: Partial<CountdownLabels>;
  readonly state?: BlockState;
  readonly className?: string;
  readonly 'data-testid'?: string;
}

const sumParts = (c: CountdownColumn) => Object.values(c.parts).reduce((a, b) => a + b, 0);

function Ring() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Stacked day columns counted down to a date: each column is one day left, split into parts
 * (e.g. approved / declined / pending), with zones over the days (what applies then) and event
 * markers. A switch changes the measure (count or amount); the headline sums the whole period.
 * Select days with the mouse, ctrl + wheel, pinch or a horizontal swipe to zoom; "whole period" resets.
 */
export function CountdownChart<Kind extends string = string>({
  title,
  columns: input,
  parts,
  zones = [],
  events = [],
  renderEventIcon,
  eventKindLabel,
  metrics: metricsProp,
  metric: metricProp,
  onMetricChange,
  ticks = [30, 20, 10, 5, 3, 0],
  tooltipRows,
  minDays = 5,
  labels: labelsProp,
  state,
  className,
  'data-testid': testId,
}: CountdownChartProps<Kind>) {
  const fmt = useFormat();
  const l = useMemo(() => ({ ...countdownLabels(fmt.locale), ...labelsProp }), [fmt.locale, labelsProp]);
  const kindLabel = eventKindLabel ?? ((k: Kind) => k);
  const icon = renderEventIcon ?? (() => <Ring />);
  const status = state?.status ?? 'ready';
  const blocked = status === 'error' || status === 'empty' || status === 'no-access' || status === 'loading';

  const cols = useMemo(() => [...input].sort((a, b) => b.offset - a.offset), [input]);
  const total = cols.length;
  const metrics = metricsProp?.length ? metricsProp : [{ id: 'count', label: l.count } satisfies CountdownMetric];
  const [ownMetric, setOwnMetric] = useState(metrics[0]?.id ?? 'count');
  const metricId = metricProp ?? ownMetric;
  const metric = metrics.find((m) => m.id === metricId) ?? (metrics[0] as CountdownMetric);
  const valueOf = metric.value ?? sumParts;
  const format = metric.format ?? ((v: number) => fmt.number(v));
  const setMetric = (id: string) => {
    if (metricProp === undefined) setOwnMetric(id);
    onMetricChange?.(id);
  };

  const [win, setWin] = useState<DayWindow>([0, Math.max(0, total - 1)]);
  const [lastTotal, setLastTotal] = useState(total);
  if (lastTotal !== total) {
    setLastTotal(total);
    setWin([0, Math.max(0, total - 1)]);
  }
  const winRef = useRef<DayWindow>(win);
  winRef.current = win;
  const [sel, setSel] = useState<DayWindow | null>(null);
  const [hover, setHover] = useState<{ index: number; event: boolean } | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [measure, size] = useElementSize<HTMLDivElement>();
  useDayWindowGestures(plotRef, winRef, setWin, total, Math.min(minDays, total));

  const byOffset = useMemo(() => {
    const m = new Map<number, DayEvent<Kind>[]>();
    for (const e of events) m.set(e.index, [...(m.get(e.index) ?? []), e]);
    return m;
  }, [events]);

  const [r0, r1] = win;
  const vis = cols.slice(r0, r1 + 1);
  const n = vis.length;
  const max = Math.max(1, ...vis.map(valueOf));
  const whole = cols.reduce((a, c) => a + valueOf(c), 0);
  const first = cols[0]?.offset ?? 0;
  const indexOf = (offset: number) => first - offset;
  const shownZones = zones
    .map((z, k) => {
      const a = indexOf(z.from) + 1;
      const b = indexOf(z.to) + 2;
      return { ...z, k, s: Math.max(a, r0 + 1) - r0, e: Math.min(b, r1 + 2) - r0, narrow: b - a <= 3 };
    })
    .filter((z) => z.e > z.s);
  const every = tickEvery(n);
  const tickCols = vis.filter((c) => (every ? c.offset % every === 0 : ticks.includes(c.offset)));
  const dayTitle = (d: number) => l.dayTitle(d);

  const hovered = hover && hover.index >= r0 && hover.index <= r1 ? hover : null;
  const anchor = (() => {
    if (!hovered || !plotRef.current) return null;
    const root = plotRef.current.closest('.vl-countdown');
    const target = plotRef.current.querySelector<HTMLElement>(
      hovered.event
        ? `.vl-countdown__ev[data-day="${hovered.index}"]`
        : `.vl-countdown__col[data-day="${hovered.index}"] .vl-countdown__bar`,
    );
    if (!root || !target) return null;
    const rr = root.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    return { x: tr.left - rr.left + tr.width / 2, y: tr.top - rr.top, width: tr.width, height: tr.height };
  })();
  const rowsOf = (c: CountdownColumn, onlyEvents: boolean): TooltipRow[] => {
    const evs = (byOffset.get(c.offset) ?? []).map((e, k) => ({ id: `e${k}`, label: kindLabel(e.kind), value: e.label }));
    if (onlyEvents) return evs;
    return [
      { id: 'all', label: l.total, value: fmt.number(sumParts(c)) },
      ...parts.map((p) => ({ id: p.id, label: p.label, value: fmt.number(c.parts[p.id] ?? 0) })),
      ...(tooltipRows?.(c) ?? []),
      ...evs,
    ];
  };

  return (
    <div ref={measure} className={cx('vl-countdown', className)} data-testid={testId} data-blocked={blocked || undefined}>
      <div className="vl-countdown__head">
        <p className="vl-countdown__lead">
          {metric.lead ? (
            metric.lead(format(whole), whole)
          ) : (
            <>
              <b>{format(whole)}</b> {metric.label}
            </>
          )}
        </p>
        {metrics.length > 1 ? (
          <span className="vl-countdown__metric" role="radiogroup" aria-label={l.metric}>
            {metrics.map((m, i) => (
              <Fragment key={m.id}>
                {i > 0 ? (
                  <span className="vl-countdown__metric-sep" aria-hidden="true">
                    /
                  </span>
                ) : null}
                <button
                  type="button"
                  role="radio"
                  aria-checked={m.id === metric.id}
                  data-on={m.id === metric.id || undefined}
                  onClick={() => setMetric(m.id)}
                >
                  {m.label}
                </button>
              </Fragment>
            ))}
          </span>
        ) : null}
      </div>
      <div
        ref={plotRef}
        className="vl-countdown__scroll vl-gesture-surface"
        onPointerDown={(e) => {
          const plot = plotRef.current;
          if (!plot || blocked) return;
          startDaySelection(e, plot, {
            columns: n,
            offset: r0,
            total,
            minDays: Math.min(minDays, total),
            ignore: '.vl-countdown__ev',
            grow: 'forward',
            onSelecting: setSel,
            onSelect: setWin,
          });
        }}
      >
        <div className="vl-countdown__plot" ref={cssVars({ '--n': Math.max(1, n) })}>
          {sel && sel[0] !== sel[1] ? (
            <span className="vl-countdown__sel" ref={cssVars({ '--vl-col': `${Math.min(...sel) + 1} / ${Math.max(...sel) + 2}` })} />
          ) : null}
          {vis.map((c, i) => {
            const evs = byOffset.get(c.offset);
            if (!evs) return null;
            return (
              <button
                key={`e${c.offset}`}
                type="button"
                className="vl-countdown__ev"
                data-day={r0 + i}
                data-kind={evs[0]?.kind}
                aria-label={`${dayTitle(c.offset)}: ${evs.map((e) => e.label).join(', ')}`}
                ref={cssVars({ '--vl-col': i + 1 })}
                onPointerEnter={() => setHover({ index: r0 + i, event: true })}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover({ index: r0 + i, event: true })}
                onBlur={() => setHover(null)}
              >
                {icon(evs[0] as DayEvent<Kind>)}
                <span className="vl-rate-days__ev-more">{evs.length > 1 ? evs.length : ''}</span>
              </button>
            );
          })}
          {shownZones.map((z) => (
            <div
              key={`z${z.k}`}
              className="vl-countdown__zone"
              data-first={z.k === 0 || undefined}
              data-narrow={z.narrow || undefined}
              data-shaded={z.shaded || undefined}
              ref={cssVars({ '--vl-col': `${z.s} / ${z.e}` })}
            >
              <span className="vl-countdown__zl">
                {z.detail ? <span className="vl-countdown__zd">{z.detail}</span> : null}
                {z.label}
              </span>
            </div>
          ))}
          {vis.map((c, i) => {
            const count = sumParts(c);
            const v = valueOf(c);
            const evs = byOffset.get(c.offset);
            return (
              <div
                key={c.offset}
                className="vl-countdown__col"
                data-day={r0 + i}
                data-empty={count ? undefined : true}
                data-mark={evs ? true : undefined}
                data-active={hovered && !hovered.event && hovered.index === r0 + i ? true : undefined}
                ref={cssVars({ '--vl-col': i + 1 })}
              >
                <span
                  className="vl-countdown__bar"
                  ref={cssVars({ '--vl-size': `${(v / max) * 100}%` })}
                  onPointerEnter={() => count && setHover({ index: r0 + i, event: false })}
                  onPointerLeave={() => setHover(null)}
                  onClick={() => count && setHover({ index: r0 + i, event: false })}
                >
                  {parts
                    .filter((p) => (c.parts[p.id] ?? 0) > 0)
                    .map((p) => (
                      <span
                        key={p.id}
                        className="vl-countdown__seg"
                        data-part={p.id}
                        ref={cssVars({ '--vl-grow': c.parts[p.id] ?? 0, '--vl-color': p.color })}
                      />
                    ))}
                </span>
              </div>
            );
          })}
          {tickCols.map((c, k) => (
            <span
              key={`t${c.offset}`}
              className="vl-countdown__tick"
              data-edge={k === 0 ? 'start' : undefined}
              ref={cssVars({ '--vl-col': first - c.offset - r0 + 1 })}
            >
              {c.offset}
            </span>
          ))}
        </div>
      </div>
      <div className="vl-countdown__foot">
        <span className="vl-countdown__axis">
          {l.axis}
          {n < total ? (
            <>
              {' · '}
              <button type="button" className="vl-countdown__reset" onClick={() => setWin([0, total - 1])}>
                {l.reset}
              </button>
            </>
          ) : (
            <>
              {' · '}
              <span className="vl-hint-fine">{l.hintFine}</span>
              <span className="vl-hint-touch">{l.hintTouch}</span>
            </>
          )}
        </span>
        <ul className="vl-countdown__legend">
          {parts.map((p) => (
            <li key={p.id}>
              <span className="vl-countdown__dot" ref={cssVars({ '--vl-color': p.color })} />
              {p.label}
            </li>
          ))}
        </ul>
      </div>
      <ChartTooltip open={!!hovered && !!anchor} anchor={anchor} bounds={size} prefer="top" dockBelow={0} overflow="viewport">
        {hovered && cols[hovered.index] ? (
          <TooltipContent
            className="vl-tooltip__content--table"
            title={dayTitle((cols[hovered.index] as CountdownColumn).offset)}
            rows={rowsOf(cols[hovered.index] as CountdownColumn, hovered.event)}
          />
        ) : null}
      </ChartTooltip>
      <ChartDataTable
        caption={title}
        columns={[l.axis, ...parts.map((p) => p.label), metric.label]}
        rows={cols.map((c) => [c.offset, ...parts.map((p) => c.parts[p.id] ?? 0), format(valueOf(c))])}
      />
      {state ? <StateOverlay state={state} /> : null}
    </div>
  );
}
