import { useEffect, useMemo, useRef, useState } from 'react';

import { useReducedMotion } from '../hooks/hooks';
import { useFormat } from '../theme/provider';
import { cx } from './cx';

/** Callback ref setting one CSS custom property (no inline style objects). */
const setVar = (name: string, value: number) => (el: HTMLElement | null) => {
  el?.style.setProperty(name, String(value));
};

export interface RollingNumberProps {
  /**
   * A number rolls on digit wheels to the new value; a ready string (`'1 204 ₽'`, `'12,4%'`)
   * slides in only the characters that changed, right to left.
   */
  readonly value: number | string;
  /** How to print a number: `Intl.NumberFormat` options or a function. Default: integer in the provider locale. */
  readonly format?: Intl.NumberFormatOptions | ((value: number) => string);
  /** Screen-reader text. Default: the printed value. */
  readonly label?: string;
  readonly className?: string;
}

/** Wheel roll of a number, ms. */
const ROLL_MS = 1500;
/** Safety net: a slide that never reports its end settles after this, ms. */
const SETTLE_MS = 2500;
const SLIDE_IN = 'vl-rolling-number-in';
const STRIP = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'] as const;

interface Glyph {
  readonly position: number;
  readonly char: string;
  readonly previous: string;
  readonly changed: boolean;
  /** Order among the changed characters, right to left: the stagger of the slide. */
  readonly order: number;
}

/** Characters of `next` aligned to `prev` from the right; changed ones get a slide order. */
function rollingGlyphs(next: string, prev: string): Glyph[] {
  const a = Array.from(next);
  const b = Array.from(prev);
  const out: Glyph[] = [];
  let order = 0;
  for (let i = a.length - 1; i >= 0; i -= 1) {
    const position = a.length - 1 - i;
    const char = a[i] ?? '';
    const before = b[b.length - 1 - position] ?? '';
    const changed = char !== before;
    out.push({ position, char, previous: changed ? before : '', changed, order: changed ? order : -1 });
    if (changed) order += 1;
  }
  return out.reverse();
}

/** Wheel offset of a digit place for a value between integers: the carry turns the next wheel smoothly. */
function wheelOffset(value: number, place: number): number {
  const v = Math.abs(value);
  const unit = 10 ** place;
  const digit = Math.floor(v / unit) % 10;
  if (place === 0) return digit + (v - Math.floor(v));
  const rest = v % unit;
  return digit + Math.max(0, rest - (unit - 1));
}

function digitPlaces(text: string): { char: string; place: number | null }[] {
  const chars = Array.from(text);
  const out: { char: string; place: number | null }[] = [];
  let place = 0;
  for (let i = chars.length - 1; i >= 0; i -= 1) {
    const c = chars[i] ?? '';
    if (c >= '0' && c <= '9') {
      out.push({ char: c, place });
      place += 1;
    } else out.push({ char: c, place: null });
  }
  return out.reverse();
}

/** Plain integer formats roll on wheels; percent, units, compact and fractions slide as text. */
function wheelable(options: Intl.NumberFormatOptions | undefined, from: number, to: number): boolean {
  if (!Number.isInteger(from) || !Number.isInteger(to)) return false;
  if (!options) return true;
  return !(
    (options.notation && options.notation !== 'standard') ||
    options.style === 'percent' ||
    options.style === 'unit' ||
    (options.minimumFractionDigits ?? 0) > 0
  );
}

const easeOutQuad = (u: number) => 1 - (1 - u) ** 2;

function useRolledValue(value: number, still: boolean): { value: number; from: number } {
  const [state, setState] = useState({ value, from: value });
  const current = useRef(value);
  useEffect(() => {
    const start = current.current;
    if (still || start === value || typeof requestAnimationFrame !== 'function') {
      current.current = value;
      setState({ value, from: value });
      return;
    }
    const t0 = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const u = Math.min(1, Math.max(0, (now - t0) / ROLL_MS));
      const v = u >= 1 ? value : start + (value - start) * easeOutQuad(u);
      current.current = v;
      setState({ value: v, from: start });
      if (u < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [value, still]);
  return state;
}

/**
 * Odometer number. A number rolls each digit on its own wheel to the new value (the carry turns
 * the next wheel smoothly); a string or a non-integer format slides in only the characters that
 * changed, right to left with a short stagger. Tabular digits keep the width; reduced motion
 * swaps instantly. Screen readers get the final value once.
 */
export function RollingNumber(props: RollingNumberProps) {
  return typeof props.value === 'string' ? (
    <RollingText text={props.value} label={props.label} className={props.className} />
  ) : (
    <RollingValue value={props.value} format={props.format} label={props.label} className={props.className} />
  );
}

function RollingText({ text, label, className }: { readonly text: string; readonly label?: string; readonly className?: string }) {
  const reduced = useReducedMotion();
  const [s, setS] = useState({ text, previous: text, generation: 0, settled: true });
  if (s.text !== text) setS({ text, previous: s.text, generation: s.generation + 1, settled: false });
  const rolling = !reduced && !s.settled;
  const glyphs = rolling ? rollingGlyphs(s.text, s.previous) : [];
  const changed = glyphs.filter((g) => g.changed).length;
  const ref = useRef<HTMLSpanElement | null>(null);
  const generation = s.generation;
  useEffect(() => {
    const el = ref.current;
    if (!rolling || !el) return;
    const settle = () => setS((p) => (p.generation === generation ? { ...p, settled: true } : p));
    let ended = 0;
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName !== SLIDE_IN) return;
      ended += 1;
      if (ended >= changed) settle();
    };
    el.addEventListener('animationend', onEnd);
    const t = setTimeout(settle, SETTLE_MS);
    return () => {
      el.removeEventListener('animationend', onEnd);
      clearTimeout(t);
    };
  }, [rolling, generation, changed]);

  if (!rolling) {
    return label === undefined ? (
      <span className={cx('vl-rolling-number', className)}>{text}</span>
    ) : (
      <span className={cx('vl-rolling-number', className)}>
        <span className="vl-rolling-number__sr">{label}</span>
        <span aria-hidden="true">{text}</span>
      </span>
    );
  }
  return (
    <span className={cx('vl-rolling-number', className)}>
      <span className="vl-rolling-number__sr">{label ?? text}</span>
      <span ref={ref} className="vl-rolling-number__digits" aria-hidden="true">
        {glyphs.map((g) =>
          g.changed ? (
            <span key={g.position} className="vl-rolling-number__slot" data-rolling="true" ref={setVar('--vl-rolling-order', g.order)}>
              <span key={`in-${generation}`} className="vl-rolling-number__in">
                {g.char}
              </span>
              {g.previous ? (
                <span key={`out-${generation}`} className="vl-rolling-number__out">
                  {g.previous}
                </span>
              ) : null}
            </span>
          ) : (
            <span key={g.position} className="vl-rolling-number__slot">
              {g.char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

function RollingValue({
  value,
  format,
  label,
  className,
}: {
  readonly value: number;
  readonly format?: RollingNumberProps['format'];
  readonly label?: string;
  readonly className?: string;
}) {
  const reduced = useReducedMotion();
  const fmt = useFormat();
  const print = useMemo(() => {
    if (typeof format === 'function') return format;
    const nf = new Intl.NumberFormat(fmt.locale.code, format);
    return (v: number) => nf.format(v);
  }, [format, fmt.locale.code]);
  const { value: shown, from } = useRolledValue(value, reduced);
  const text = print(value);
  if (shown === value) return <RollingText text={text} label={label} className={className} />;
  if (typeof format === 'function' || !wheelable(format, from, value)) {
    const ints = Number.isInteger(value) && Number.isInteger(from);
    return <RollingText text={print(ints ? Math.round(shown) : shown)} label={label ?? text} className={className} />;
  }
  return (
    <span className={cx('vl-rolling-number', className)}>
      <span className="vl-rolling-number__sr">{label ?? text}</span>
      <span className="vl-rolling-number__digits" aria-hidden="true">
        {digitPlaces(print(Math.trunc(shown))).map((d, i) =>
          d.place === null ? (
            <span key={`c${i}`}>{d.char}</span>
          ) : (
            <span key={`d${d.place}`} className="vl-rolling-number__wheel" ref={setVar('--vl-rolling-offset', wheelOffset(shown, d.place))}>
              <span className="vl-rolling-number__ghost">{d.char}</span>
              <span className="vl-rolling-number__strip">
                {STRIP.map((c, k) => (
                  <span key={k}>{c}</span>
                ))}
              </span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}
