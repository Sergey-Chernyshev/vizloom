import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cx } from '../../core';

export interface TimelineItem {
  /** Bar height relative to the largest item; `NaN` — no data (a flat gap mark). */
  readonly value: number;
  /** Label above the bar with a divider line: day, week or month start. */
  readonly major?: string;
  /** Small label under the bar: hour ticks. */
  readonly minor?: string;
}

export interface TimelineStripProps {
  readonly items: readonly TimelineItem[];
  /** Selected item (controlled). */
  readonly index: number;
  /** Settled choice: after the strip stops scrolling, an arrow key or a tap. */
  readonly onChange: (index: number) => void;
  /** Every item that passes the centre marker while the finger scrolls. */
  readonly onScrub?: (index: number) => void;
  /** Bar colour. Default: the accent. */
  readonly color?: string;
  /** Endless strip: the ends join (a week of hours, a ring of days). */
  readonly loop?: boolean;
  readonly className?: string;
  readonly 'aria-label'?: string;
}

/** Width of one item, px (1.375rem). */
export const TIMELINE_ITEM_WIDTH = 22;
/** Copies of the items rendered in loop mode: the middle one is "home". */
const LOOP_COPIES = 3;
/** The strip has stopped: commit the item under the marker, ms. */
const SETTLE_MS = 120;

/**
 * Scrubbable strip of mini bars under a fixed centre marker (phone sheets): swipe it and the item
 * under the marker becomes current; scroll-snap settles on a bar, arrows step from the keyboard,
 * `loop` joins the ends. Bars are scaled to the largest item; missing values show a flat gap.
 */
export function TimelineStrip({
  items,
  index,
  onChange,
  onScrub,
  color = 'var(--vl-accent)',
  loop = false,
  className,
  'aria-label': ariaLabel,
}: TimelineStripProps) {
  const track = useRef<HTMLDivElement | null>(null);
  const n = items.length;
  const copies = loop ? LOOP_COPIES : 1;
  const max = Math.max(1, ...items.map((it) => (it.value === it.value ? it.value : 0)));
  const [current, setCurrent] = useState(index);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fromScroll = useRef(false);
  const latest = useRef({ index, onChange, onScrub });
  latest.current = { index, onChange, onScrub };
  const leftOf = useCallback((i: number) => (loop ? n + i : i) * TIMELINE_ITEM_WIDTH, [loop, n]);

  useLayoutEffect(() => {
    const el = track.current;
    if (el) el.scrollLeft = leftOf(index);
    // Only when the set of items changes: later moves animate in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, loop]);

  useEffect(() => {
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    const el = track.current;
    if (!el || n === 0) return;
    const at = Math.round(el.scrollLeft / TIMELINE_ITEM_WIDTH);
    let target = leftOf(index) / TIMELINE_ITEM_WIDTH;
    if (loop) for (const shift of [-n, n]) if (Math.abs(target + shift - at) < Math.abs(target - at)) target += shift;
    if (typeof el.scrollTo === 'function') el.scrollTo({ left: target * TIMELINE_ITEM_WIDTH, behavior: 'smooth' });
    else el.scrollLeft = target * TIMELINE_ITEM_WIDTH;
    setCurrent(index);
  }, [index, loop, n, leftOf]);

  useEffect(
    () => () => {
      if (settle.current) clearTimeout(settle.current);
    },
    [],
  );

  const onScroll = () => {
    const el = track.current;
    if (!el || n === 0) return;
    let at = Math.round(el.scrollLeft / TIMELINE_ITEM_WIDTH);
    if (loop) {
      if (at < n * 0.5) {
        el.scrollLeft += n * TIMELINE_ITEM_WIDTH;
        at += n;
      } else if (at > n * 2.5) {
        el.scrollLeft -= n * TIMELINE_ITEM_WIDTH;
        at -= n;
      }
    }
    const i = ((at % n) + n) % n;
    if (i !== current) {
      setCurrent(i);
      if (latest.current.onScrub) {
        fromScroll.current = true;
        latest.current.onScrub(i);
      }
    }
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (i !== latest.current.index) {
        fromScroll.current = true;
        latest.current.onChange(i);
      }
    }, SETTLE_MS);
  };

  const step = (d: number) => onChange(loop ? (((current + d) % n) + n) % n : Math.min(n - 1, Math.max(0, current + d)));

  return (
    <div className={cx('vl-timeline', className)}>
      <div
        ref={track}
        className="vl-timeline__track"
        onScroll={onScroll}
        tabIndex={0}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={Math.max(0, n - 1)}
        aria-valuenow={current}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          }
        }}
      >
        {Array.from({ length: n * copies }, (_, k) => {
          const i = k % n;
          const it = items[i] as TimelineItem;
          const known = it.value === it.value;
          const h = known ? Math.max(2, (it.value / max) * 100) : 0;
          return (
            <div key={k} className="vl-timeline__item" data-active={i === current || undefined} data-major={it.major ? 'true' : undefined}>
              {it.major ? <span className="vl-timeline__major">{it.major}</span> : null}
              <svg className="vl-timeline__bar" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true">
                {known ? (
                  <rect x="1.5" y={100 - h} width="7" height={h} rx="1.5" fill={color} />
                ) : (
                  <rect x="1.5" y="96" width="7" height="4" rx="1" className="vl-timeline__gap" />
                )}
              </svg>
              {it.minor ? <span className="vl-timeline__minor">{it.minor}</span> : null}
            </div>
          );
        })}
      </div>
      <span className="vl-timeline__marker" aria-hidden="true" />
    </div>
  );
}
