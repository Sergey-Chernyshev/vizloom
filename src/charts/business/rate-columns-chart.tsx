import { Fragment, type PointerEvent as ReactPointerEvent, type ReactNode, useMemo, useRef, useState } from 'react';

import { type BlockState, ChartDataTable, ChartTooltip, cx, type TooltipRow, TooltipContent, useElementSize, useFormat } from '../../core';
import { cssVars } from '../shared/css-vars';
import { type DayWindow, isTouch, startDaySelection, useDayWindowGestures } from './day-zoom';
import { type RateColumnsLabels, rateColumnsLabels } from './labels';
import { StateOverlay } from './parts';

/** Ticks at the plot edges align to them instead of centring on their column. */
function tickEdge(position: number, last: boolean): 'start' | 'end' | undefined {
  if (position === 0) return 'start';
  if (last) return 'end';
  return undefined;
}

export interface RateDay {
  /** Axis and tooltip label of the day: `'12 Oct'`. */
  readonly label: string;
  /** The base of the rate: visitors, sessions, leads. Drawn as the grey column. */
  readonly base: number;
  /** How many of the base converted: buyers, sign-ups. `count / base` is the line. */
  readonly count: number;
}

export interface DayEvent<Kind extends string = string> {
  /** Index of the day in `days`. */
  readonly index: number;
  readonly kind: Kind;
  readonly label: string;
}

export interface RateColumnsChartProps<Kind extends string = string> {
  /** Accessible name of the chart and caption of its data table. */
  readonly title: string;
  readonly days: readonly RateDay[];
  /** Events on days: a marker above the column with a dashed line down, and rows in the tooltip. */
  readonly events?: readonly DayEvent<Kind>[];
  /** Icon of an event marker by kind. Default: a small ring. */
  readonly renderEventIcon?: (event: { readonly kind: Kind }) => ReactNode;
  /** Tooltip row label of an event kind: `'Mailing'`. Default: the kind itself. */
  readonly eventKindLabel?: (kind: Kind) => string;
  /** Days shown at first, counted back from the last day. Default 21. */
  readonly initialDays?: number;
  /** Narrowest zoom, days. Default 5. */
  readonly minDays?: number;
  /** Rate format. Default: percent with one decimal. */
  readonly formatRate?: (rate: number) => string;
  /** Count format (base and converted). Default: integer in the provider locale. */
  readonly formatCount?: (value: number) => string;
  readonly labels?: Partial<RateColumnsLabels>;
  readonly state?: BlockState;
  readonly className?: string;
  readonly 'data-testid'?: string;
}

interface Hover {
  readonly index: number;
  readonly event: boolean;
}

function Ring() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function tickStep(n: number): number {
  if (n <= 10) return 1;
  if (n <= 21) return 3;
  return 7;
}

/**
 * Daily rate over its base: grey columns are the base (visitors), the line is the rate
 * (bought ÷ visitors) with the best and the worst day dotted, event markers sit above their days.
 * The headline is the average rate of the visible days. Below, a navigator of the whole period:
 * drag the window or its handles; select days with the mouse, ctrl + wheel, pinch or a horizontal
 * swipe zoom and pan the plot.
 */
export function RateColumnsChart<Kind extends string = string>({
  title,
  days,
  events = [],
  renderEventIcon,
  eventKindLabel,
  initialDays = 21,
  minDays = 5,
  formatRate,
  formatCount,
  labels: labelsProp,
  state,
  className,
  'data-testid': testId,
}: RateColumnsChartProps<Kind>) {
  const fmt = useFormat();
  const l = useMemo(() => ({ ...rateColumnsLabels(fmt.locale), ...labelsProp }), [fmt.locale, labelsProp]);
  const rate = formatRate ?? ((v: number) => fmt.percent(v * 100, 1));
  const count = formatCount ?? ((v: number) => fmt.number(v));
  const kindLabel = eventKindLabel ?? ((k: Kind) => k);
  const icon = renderEventIcon ?? (() => <Ring />);
  const total = days.length;
  const status = state?.status ?? 'ready';
  const blocked = status === 'error' || status === 'empty' || status === 'no-access' || status === 'loading';

  const startWindow = (): DayWindow => [Math.max(0, total - Math.max(1, initialDays)), Math.max(0, total - 1)];
  const [win, setWin] = useState<DayWindow>(startWindow);
  const [lastTotal, setLastTotal] = useState(total);
  if (lastTotal !== total) {
    setLastTotal(total);
    setWin(startWindow());
  }
  const winRef = useRef<DayWindow>(win);
  winRef.current = win;
  const [sel, setSel] = useState<DayWindow | null>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [measure, size] = useElementSize<HTMLDivElement>();

  const byDay = useMemo(() => {
    const m = new Map<number, DayEvent<Kind>[]>();
    for (const e of events) m.set(e.index, [...(m.get(e.index) ?? []), e]);
    return m;
  }, [events]);
  const rates = useMemo(() => days.map((d) => d.count / Math.max(1, d.base)), [days]);

  useDayWindowGestures(plotRef, winRef, setWin, total, Math.min(minDays, total));

  const [r0, r1] = win;
  const idx = total ? Array.from({ length: r1 - r0 + 1 }, (_, k) => r0 + k) : [];
  const n = idx.length;
  const maxBase = Math.max(1, ...idx.map((i) => days[i]?.base ?? 0));
  const maxRate = Math.max(...idx.map((i) => rates[i] ?? 0)) * 1.15 || 1;
  const best = idx.reduce((p, q) => ((rates[q] ?? 0) > (rates[p] ?? 0) ? q : p), r0);
  const worst = idx.reduce((p, q) => ((rates[q] ?? 0) < (rates[p] ?? 0) ? q : p), r0);
  const points = idx.map((q, k) => `${((k + 0.5) / n) * 100},${100 - ((rates[q] ?? 0) / maxRate) * 100}`).join(' ');
  const navMax = Math.max(...rates) * 1.1 || 1;
  const navPoints = rates.map((v, q) => `${((q + 0.5) / total) * 100},${100 - (v / navMax) * 100}`).join(' ');
  const step = tickStep(n);
  const sumCount = idx.reduce((p, q) => p + (days[q]?.count ?? 0), 0);
  const sumBase = idx.reduce((p, q) => p + (days[q]?.base ?? 0), 0);
  const label = (i: number) => days[i]?.label ?? '';

  const dragNav = (mode: 'l' | 'r' | 'm') => (ev: ReactPointerEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    const el = navRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    const x0 = ev.clientX;
    const [a0, b0] = winRef.current;
    const span = Math.min(minDays, total) - 1;
    const onMove = (e: PointerEvent) => {
      const d = Math.round(((e.clientX - x0) / Math.max(1, w)) * total);
      if (mode === 'l') setWin([Math.min(Math.max(0, a0 + d), b0 - span), b0]);
      else if (mode === 'r') setWin([a0, Math.max(Math.min(total - 1, b0 + d), a0 + span)]);
      else {
        const width = b0 - a0;
        const na = Math.min(Math.max(0, a0 + d), total - 1 - width);
        setWin([na, na + width]);
      }
    };
    const onUp = () => {
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
    };
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
  };

  // Tooltip anchor: top centre of the hovered column, relative to the root.
  const hovered = hover && hover.index >= r0 && hover.index <= r1 ? hover : null;
  const anchor = (() => {
    if (!hovered || !plotRef.current) return null;
    const root = plotRef.current.closest('.vl-rate-days');
    const col = plotRef.current.querySelector<HTMLElement>(
      `[data-day="${hovered.index}"]${hovered.event ? '.vl-rate-days__ev' : '.vl-rate-days__col'}`,
    );
    if (!root || !col) return null;
    const rr = root.getBoundingClientRect();
    const cr = col.getBoundingClientRect();
    return { x: cr.left - rr.left + cr.width / 2, y: cr.top - rr.top, width: cr.width, height: cr.height };
  })();
  const tipRows = (i: number, onlyEvents: boolean): TooltipRow[] => {
    const evs = (byDay.get(i) ?? []).map((e, k) => ({ id: `e${k}`, label: kindLabel(e.kind), value: e.label }));
    if (onlyEvents) return evs;
    const d = days[i];
    return [
      { id: 'rate', label: l.rate, value: rate(rates[i] ?? 0) },
      { id: 'base', label: l.base, value: count(d?.base ?? 0) },
      { id: 'count', label: l.count, value: count(d?.count ?? 0) },
      ...evs,
    ];
  };

  return (
    <div ref={measure} className={cx('vl-rate-days', className)} data-testid={testId} data-blocked={blocked || undefined}>
      <div className="vl-rate-days__big">
        <span className="vl-rate-days__value">{n ? rate(sumCount / Math.max(1, sumBase)) : '—'}</span>
        <span className="vl-rate-days__sub">{n ? l.average(label(r0), label(r1)) : l.average('', '')}</span>
      </div>
      <div
        ref={(el) => {
          plotRef.current = el;
          cssVars({ '--n': Math.max(1, n) })(el);
        }}
        className="vl-rate-days__plot vl-gesture-surface"
        onPointerDown={(e) => {
          const plot = plotRef.current;
          if (!plot || blocked) return;
          startDaySelection(e, plot, {
            columns: n,
            offset: r0,
            total,
            minDays: Math.min(minDays, total),
            ignore: '.vl-rate-days__ev',
            grow: 'centre',
            onSelecting: setSel,
            onSelect: setWin,
          });
        }}
      >
        {sel && sel[0] !== sel[1] ? (
          <span className="vl-rate-days__sel" ref={cssVars({ '--vl-col': `${Math.min(...sel) + 1} / ${Math.max(...sel) + 2}` })} />
        ) : null}
        <svg className="vl-rate-days__line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        {idx.map((i, k) => {
          const evs = byDay.get(i);
          const d = days[i] as RateDay;
          return (
            <Fragment key={i}>
              {evs ? (
                <button
                  type="button"
                  className="vl-rate-days__ev"
                  data-day={i}
                  data-kind={evs[0]?.kind}
                  aria-label={`${d.label}: ${evs.map((e) => e.label).join(', ')}`}
                  ref={cssVars({ '--vl-col': k + 1 })}
                  onPointerEnter={() => setHover({ index: i, event: true })}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover({ index: i, event: true })}
                  onBlur={() => setHover(null)}
                >
                  {icon(evs[0] as DayEvent<Kind>)}
                  <span className="vl-rate-days__ev-more">{evs.length > 1 ? evs.length : ''}</span>
                </button>
              ) : null}
              <div
                className="vl-rate-days__col"
                data-day={i}
                data-mark={evs ? true : undefined}
                data-best={i === best || undefined}
                data-worst={i === worst || undefined}
                data-active={hovered && !hovered.event && hovered.index === i ? true : undefined}
                ref={cssVars({ '--vl-col': k + 1 })}
                onPointerEnter={(e) => !isTouch(e.pointerType) && setHover({ index: i, event: false })}
                onPointerLeave={() => setHover(null)}
                onClick={() => setHover({ index: i, event: false })}
              >
                <span className="vl-rate-days__bar" ref={cssVars({ '--vl-size': `${(d.base / maxBase) * 100}%` })} />
                <span className="vl-rate-days__dot" ref={cssVars({ '--vl-ratio': ((rates[i] ?? 0) / maxRate).toFixed(4) })} />
              </div>
            </Fragment>
          );
        })}
        {idx.map((i, k) =>
          (r1 - i) % step === 0 ? (
            <span key={`t${i}`} className="vl-rate-days__tick" data-edge={tickEdge(k, i === r1)} ref={cssVars({ '--vl-col': k + 1 })}>
              {label(i)}
            </span>
          ) : null,
        )}
      </div>
      <div ref={navRef} className="vl-rate-days__nav vl-gesture-surface">
        <svg className="vl-rate-days__nav-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={navPoints} fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        {[...byDay.keys()].map((q) => (
          <span key={`e${q}`} className="vl-rate-days__nav-ev" ref={cssVars({ '--vl-x': `${((q + 0.5) / Math.max(1, total)) * 100}%` })} />
        ))}
        {total ? (
          <div
            className="vl-rate-days__win"
            role="slider"
            aria-label={l.window}
            aria-valuemin={0}
            aria-valuemax={total - 1}
            aria-valuenow={r0}
            aria-valuetext={`${label(r0)} — ${label(r1)}`}
            tabIndex={0}
            ref={cssVars({ '--vl-x': `${(r0 / total) * 100}%`, '--vl-size': `${(n / total) * 100}%` })}
            onPointerDown={dragNav('m')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' && r0 > 0) {
                e.preventDefault();
                setWin([r0 - 1, r1 - 1]);
              } else if (e.key === 'ArrowRight' && r1 < total - 1) {
                e.preventDefault();
                setWin([r0 + 1, r1 + 1]);
              }
            }}
          >
            <span className="vl-rate-days__handle vl-rate-days__handle--l" onPointerDown={dragNav('l')} />
            <span className="vl-rate-days__handle vl-rate-days__handle--r" onPointerDown={dragNav('r')} />
          </div>
        ) : null}
      </div>
      <div className="vl-rate-days__dates" aria-hidden="true">
        <span>{label(0)}</span>
        <span>{label(total - 1)}</span>
      </div>
      <div className="vl-rate-days__foot">
        <ul className="vl-rate-days__legend">
          <li>
            <span className="vl-rate-days__key vl-rate-days__key--line" />
            {l.legendRate}
          </li>
          <li>
            <span className="vl-rate-days__key" />
            {l.legendBase}
          </li>
          {events.length ? (
            <li className="vl-rate-days__evkey">
              {icon(events[0] as DayEvent<Kind>)}
              {l.legendEvents}
            </li>
          ) : null}
        </ul>
        <span className="vl-rate-days__hint">
          <span className="vl-hint-fine">{l.hintFine}</span>
          <span className="vl-hint-touch">{l.hintTouch}</span>
        </span>
      </div>
      <ChartTooltip open={!!hovered && !!anchor} anchor={anchor} bounds={size} prefer="top" dockBelow={0} overflow="viewport">
        {hovered ? (
          <TooltipContent
            className="vl-tooltip__content--table"
            title={label(hovered.index)}
            rows={tipRows(hovered.index, hovered.event)}
          />
        ) : null}
      </ChartTooltip>
      <ChartDataTable
        caption={title}
        columns={['', l.base, l.count, l.rate]}
        rows={days.map((d, i) => [d.label, count(d.base), count(d.count), rate(rates[i] ?? 0)])}
      />
      {state ? <StateOverlay state={state} /> : null}
    </div>
  );
}
