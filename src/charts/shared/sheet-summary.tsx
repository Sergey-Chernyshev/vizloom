import { type ReactNode, useEffect, useLayoutEffect, useRef } from 'react';

import { cx, Swatch, useFormat } from '../../core';

export interface SheetSeries {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
}

export interface SheetStat {
  readonly id: string;
  readonly label: string;
  /** Printed value; a trailing unit (`1 204 ₽`, `12 шт`) is set smaller and muted. */
  readonly value: ReactNode;
  /** Change in percent against the previous period. */
  readonly deltaPct?: number;
  /** Small muted line under the label. */
  readonly hint?: string;
}

export interface SheetNote {
  /** Verdict in bold: "Peak of the week". */
  readonly title: string;
  readonly badge?: string;
  readonly detail?: string;
}

export interface SheetAction {
  readonly id: string;
  readonly label: string;
  readonly onClick: () => void;
}

export interface SheetSummaryProps {
  /** Series to page through by swipe or the picker on top; one series hides the picker. */
  readonly series?: readonly SheetSeries[];
  readonly activeId?: string;
  readonly onChange?: (id: string) => void;
  /** Accent when there are no series. */
  readonly color?: string;
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly note?: SheetNote;
  /** A picture of the moment: usually a `TimelineStrip`. */
  readonly preview?: ReactNode;
  readonly previewHint?: ReactNode;
  /** The first stat is the headline card; the rest are rows. */
  readonly stats: readonly SheetStat[];
  /** Words after the headline delta. Default: "vs previous" in the provider locale. */
  readonly deltaSuffix?: string;
  readonly actions?: readonly SheetAction[];
  /** Accessible name of the series picker. */
  readonly pickerLabel?: string;
  readonly className?: string;
}

/** Settle of the picker after a scroll, ms. */
const PICKER_SETTLE_MS = 140;
/** Wheel gesture is over after this pause, ms. */
const WHEEL_IDLE_MS = 160;
/** After a wheel page turn, ignore the tail of the same gesture, ms. */
const WHEEL_LOCK_MS = 450;
/** Share of the width a swipe must travel to turn the page. */
const TURN_SHARE = 0.22;
const SLIDE = 'transform 240ms cubic-bezier(.2,.8,.2,1), opacity 240ms cubic-bezier(.2,.8,.2,1)';
const VALUE_WITH_UNIT = /^([−+×-]?\d[\d\s\u00a0\u202f.,]*)(\s*[^\d\s.,].*)?$/;

function StatValue({ value }: { readonly value: ReactNode }) {
  if (typeof value !== 'string') return <>{value}</>;
  const m = VALUE_WITH_UNIT.exec(value);
  if (!m || !m[2]) return <>{value}</>;
  return (
    <>
      {m[1]}
      <span className="vl-sheet-summary__unit">{m[2]}</span>
    </>
  );
}

function Delta({ pct, suffix, className }: { readonly pct: number; readonly suffix?: string; readonly className?: string }) {
  const fmt = useFormat();
  const text = `${pct >= 0 ? '↑ +' : '↓ −'}${fmt.number(Math.abs(pct))}%`;
  return (
    <em className={cx('vl-sheet-summary__delta', className)} data-direction={pct >= 0 ? 'up' : 'down'}>
      {text}
      {suffix ? ` ${suffix}` : null}
    </em>
  );
}

const hasDelta = (s: SheetStat) => s.deltaPct !== undefined && Number.isFinite(s.deltaPct);

function SeriesPicker({
  series,
  index,
  onPick,
  label,
}: {
  readonly series: readonly SheetSeries[];
  readonly index: number;
  readonly onPick: (i: number) => void;
  readonly label?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const userScroll = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(index);
  latest.current = index;
  const smooth = useRef(false);
  const chips = () => Array.from(ref.current?.children ?? []) as HTMLElement[];
  const nearest = () => {
    const el = ref.current;
    if (!el) return index;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    chips().forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      const b = chips()[best] as HTMLElement;
      if (d < Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid)) best = i;
    });
    return best;
  };
  const mark = (i: number) => chips().forEach((c, k) => c.toggleAttribute('data-near', i === k));
  const centre = (i: number, animate: boolean) => {
    const el = ref.current;
    const chip = chips()[i];
    if (!el || !chip) return;
    const left = chip.offsetLeft + chip.offsetWidth / 2 - el.clientWidth / 2;
    if (typeof el.scrollTo === 'function') el.scrollTo({ left, behavior: animate ? 'smooth' : 'instant' });
    else el.scrollLeft = left;
  };
  useLayoutEffect(() => {
    mark(index);
    if (!userScroll.current) {
      centre(index, smooth.current);
      smooth.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  useLayoutEffect(() => () => clearTimeout(timer.current), []);
  const touch = () => {
    userScroll.current = true;
  };
  return (
    <div
      ref={ref}
      className="vl-sheet-summary__picker"
      role="tablist"
      aria-label={label}
      onPointerDown={touch}
      onTouchStart={touch}
      onWheel={touch}
      onScroll={() => {
        mark(nearest());
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          if (!userScroll.current) return;
          userScroll.current = false;
          const i = nearest();
          if (i !== latest.current) onPick(i);
          else centre(i, true);
        }, PICKER_SETTLE_MS);
      }}
    >
      {series.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          className="vl-sheet-summary__pick"
          onClick={() => {
            userScroll.current = false;
            if (i !== latest.current) {
              mark(i);
              centre(i, true);
              onPick(i);
            }
          }}
        >
          <Swatch color={s.color ?? 'currentColor'} />
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Body of a phone bottom sheet for one moment of a chart: series picker (swipe the page or the
 * chips to change series), title, verdict note, a preview (usually `TimelineStrip`), a headline
 * stat with its delta on an accent glow, more stats as rows, and action buttons.
 */
export function SheetSummary({
  series = [],
  activeId,
  onChange,
  color,
  title,
  subtitle,
  note,
  preview,
  previewHint,
  stats,
  deltaSuffix,
  actions,
  pickerLabel,
  className,
}: SheetSummaryProps) {
  const fmt = useFormat();
  const index = Math.max(
    0,
    series.findIndex((s) => s.id === activeId),
  );
  const active = series[index];
  const paged = series.length > 1 && !!onChange;
  const page = useRef<HTMLDivElement | null>(null);
  const lead = useRef<HTMLDivElement | null>(null);
  const [first, ...rest] = stats;
  const accent = active?.color ?? color;
  const suffix = deltaSuffix ?? (fmt.locale.code.startsWith('ru') ? 'к прошлому' : 'vs previous');

  useLayoutEffect(() => {
    if (accent) lead.current?.style.setProperty('--vl-sheet-accent', accent);
  }, [accent, first]);

  const drag = useRef<{ x: number; y: number; dx: number; on: boolean; id: number } | null>(null);
  const enterFrom = useRef(0);
  const turning = useRef(false);
  const move = (x: number, opacity: number, animate: boolean) => {
    const el = page.current;
    if (!el) return;
    el.style.transition = animate ? SLIDE : 'none';
    el.style.transform = `translateX(${x.toFixed(1)}px)`;
    el.style.opacity = String(opacity);
  };

  useLayoutEffect(() => {
    const dir = enterFrom.current;
    if (!dir) return;
    enterFrom.current = 0;
    const el = page.current;
    if (!el) return;
    move(dir * el.clientWidth * 0.35, 0, false);
    el.getBoundingClientRect();
    move(0, 1, true);
  }, [activeId]);

  const turn = (to: number) => {
    const el = page.current;
    if (!paged || !el || turning.current) return;
    if (to < 0 || to >= series.length || to === index) {
      move(0, 1, true);
      return;
    }
    const dir = to > index ? 1 : -1;
    turning.current = true;
    move(-dir * el.clientWidth, 0, true);
    const done = () => {
      el.removeEventListener('transitionend', done);
      if (!turning.current) return;
      turning.current = false;
      enterFrom.current = dir;
      const next = series[to];
      if (next) onChange?.(next.id);
    };
    el.addEventListener('transitionend', done);
    setTimeout(done, 300);
  };
  const turnRef = useRef(turn);
  turnRef.current = turn;
  const indexRef = useRef(index);
  indexRef.current = index;

  // Horizontal trackpad swipe turns the page too.
  useEffect(() => {
    const el = page.current;
    if (!el || !paged) return;
    let dx = 0;
    let locked = false;
    let until = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const release = () => {
      const left = until - performance.now();
      if (left > 0) {
        idle = setTimeout(release, left);
        return;
      }
      locked = false;
      if (dx !== 0 && !turning.current) move(0, 1, true);
      dx = 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      if (e.target instanceof Element && e.target.closest('.vl-timeline')) return;
      e.preventDefault();
      clearTimeout(idle);
      idle = setTimeout(release, WHEEL_IDLE_MS);
      if (locked || turning.current) return;
      dx -= e.deltaX;
      const i = indexRef.current;
      const edge = (dx > 0 && i === 0) || (dx < 0 && i === series.length - 1);
      const shown = edge ? dx * 0.3 : dx;
      if (!edge && Math.abs(dx) > el.clientWidth * TURN_SHARE) {
        locked = true;
        until = performance.now() + WHEEL_LOCK_MS;
        dx = 0;
        turnRef.current(shown < 0 ? i + 1 : i - 1);
        return;
      }
      move(shown, 1 - Math.min(0.5, Math.abs(shown) / (el.clientWidth * 1.6)), false);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      clearTimeout(idle);
      el.removeEventListener('wheel', onWheel);
    };
  }, [paged, series.length]);

  return (
    <div className={cx('vl-sheet-summary', className)}>
      {paged ? <SeriesPicker series={series} index={index} onPick={turn} label={pickerLabel} /> : null}
      <div
        ref={page}
        className="vl-sheet-summary__page"
        onPointerDown={(e) => {
          if (!paged || turning.current || (e.target as Element).closest('.vl-timeline, button')) return;
          drag.current = { x: e.clientX, y: e.clientY, dx: 0, on: false, id: e.pointerId };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = page.current;
          if (!d || !el) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          if (!d.on) {
            if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
              drag.current = null;
              return;
            }
            if (Math.abs(dx) < 8) return;
            d.on = true;
            el.setPointerCapture?.(d.id);
          }
          const edge = (dx > 0 && index === 0) || (dx < 0 && index === series.length - 1);
          d.dx = edge ? dx * 0.3 : dx;
          move(d.dx, 1 - Math.min(0.5, Math.abs(d.dx) / (el.clientWidth * 1.6)), false);
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          const el = page.current;
          if (!d || !d.on || !el) return;
          if (Math.abs(d.dx) > el.clientWidth * TURN_SHARE) turn(d.dx < 0 ? index + 1 : index - 1);
          else move(0, 1, true);
        }}
        onPointerCancel={() => {
          drag.current = null;
          move(0, 1, true);
        }}
      >
        <div className="vl-sheet-summary__head">
          {active || color ? <Swatch color={active?.color ?? color ?? 'currentColor'} /> : null}
          <div>
            <div className="vl-sheet-summary__title">{title}</div>
            {subtitle ? <div className="vl-sheet-summary__subtitle">{subtitle}</div> : null}
          </div>
        </div>
        {note ? (
          <div className="vl-sheet-summary__note">
            <div className="vl-sheet-summary__verdict">
              <b>{note.title}</b>
              {note.badge ? <span className="vl-sheet-summary__badge">{note.badge}</span> : null}
            </div>
            {note.detail ? <div className="vl-sheet-summary__detail">{note.detail}</div> : null}
          </div>
        ) : null}
        {preview ? (
          <div className="vl-sheet-summary__preview">
            {preview}
            {previewHint ? <div className="vl-sheet-summary__preview-hint">{previewHint}</div> : null}
          </div>
        ) : null}
        {first ? (
          <div ref={lead} className="vl-sheet-summary__lead">
            <div className="vl-sheet-summary__lead-top">
              <span className="vl-sheet-summary__label">{first.label}</span>
              {hasDelta(first) ? <Delta pct={first.deltaPct as number} suffix={suffix} className="vl-sheet-summary__chip" /> : null}
            </div>
            <b className="vl-sheet-summary__lead-value">
              <StatValue value={first.value} />
            </b>
            {first.hint ? <span className="vl-sheet-summary__stat-hint">{first.hint}</span> : null}
          </div>
        ) : null}
        {rest.length ? (
          <dl className="vl-sheet-summary__rows">
            {rest.map((s) => (
              <div key={s.id} className="vl-sheet-summary__row">
                <dt>
                  <span className="vl-sheet-summary__row-label">{s.label}</span>
                  {s.hint ? <span className="vl-sheet-summary__stat-hint">{s.hint}</span> : null}
                </dt>
                <dd>
                  {hasDelta(s) ? <Delta pct={s.deltaPct as number} /> : null}
                  <b>
                    <StatValue value={s.value} />
                  </b>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {actions?.length ? (
          <div className="vl-sheet-summary__actions">
            {actions.map((a) => (
              <button key={a.id} type="button" className="vl-sheet-summary__action" onClick={a.onClick}>
                {a.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
