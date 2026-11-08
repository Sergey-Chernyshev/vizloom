import { type MutableRefObject, type RefObject, useEffect } from 'react';

/** Inclusive window of day indexes `[from, to]`. */
export type DayWindow = readonly [number, number];

/** Fingers and pens zoom and pan; anything else (mouse) selects. */
export const isTouch = (pointerType: string | undefined) => pointerType === 'touch' || pointerType === 'pen';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Wheel and touch zoom of a day window over a DOM plot: ctrl/⌘ + wheel (trackpad pinch) zooms
 * around the pointer, a horizontal wheel pans, one finger pans, two fingers pinch. Mouse drags
 * are left to the caller (range selection).
 */
export function useDayWindowGestures(
  ref: RefObject<HTMLElement | null>,
  windowRef: MutableRefObject<DayWindow>,
  setWindow: (w: DayWindow) => void,
  total: number,
  minDays: number,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let accX = 0;
    let accZ = 0;
    const touches = new Map<number, number>();
    let g:
      | { m: 'pan'; x0: number; a0: number; b0: number; moved: boolean }
      | { m: 'pinch'; d0: number; c0: number; a0: number; b0: number }
      | null = null;
    const wheel = (e: WheelEvent) => {
      const [a0, b0] = windowRef.current;
      const w = b0 - a0 + 1;
      const rect = el.getBoundingClientRect();
      const fx = clamp((e.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        accZ += e.deltaY;
        let nw = Math.round(w * Math.exp(accZ * 0.01));
        if (nw === w) return;
        accZ = 0;
        nw = clamp(nw, minDays, total);
        const na = clamp(Math.round(a0 + fx * w - fx * nw), 0, total - nw);
        setWindow([na, na + nw - 1]);
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        accX += e.deltaX;
        const px = rect.width / w;
        const d = Math.trunc(accX / px);
        if (!d) return;
        accX -= d * px;
        const na = clamp(a0 + d, 0, total - w);
        setWindow([na, na + w - 1]);
      }
    };
    const down = (e: PointerEvent) => {
      if (!isTouch(e.pointerType)) return;
      touches.set(e.pointerId, e.clientX);
      const [a0, b0] = windowRef.current;
      const xs = [...touches.values()];
      g =
        touches.size === 1
          ? { m: 'pan', x0: xs[0] as number, a0, b0, moved: false }
          : {
              m: 'pinch',
              d0: Math.abs((xs[0] as number) - (xs[1] as number)) || 1,
              c0: ((xs[0] as number) + (xs[1] as number)) / 2,
              a0,
              b0,
            };
    };
    const move = (e: PointerEvent) => {
      if (!g || !touches.has(e.pointerId)) return;
      touches.set(e.pointerId, e.clientX);
      const rect = el.getBoundingClientRect();
      const xs = [...touches.values()];
      const w0 = g.b0 - g.a0 + 1;
      if (g.m === 'pan' && touches.size === 1) {
        const dx = (xs[0] as number) - g.x0;
        if (!g.moved && Math.abs(dx) < 8) return;
        g.moved = true;
        const na = clamp(g.a0 + Math.round((-dx / Math.max(1, rect.width)) * w0), 0, total - w0);
        setWindow([na, na + w0 - 1]);
      } else if (g.m === 'pinch' && touches.size >= 2) {
        const d = Math.abs((xs[0] as number) - (xs[1] as number)) || 1;
        const nw = clamp(Math.round((w0 * g.d0) / d), minDays, total);
        const fx = clamp((g.c0 - rect.left) / Math.max(1, rect.width), 0, 1);
        const na = clamp(Math.round(g.a0 + fx * w0 - fx * nw), 0, total - nw);
        setWindow([na, na + nw - 1]);
      }
    };
    const up = (e: PointerEvent) => {
      touches.delete(e.pointerId);
      if (!touches.size) {
        g = null;
        return;
      }
      const [a0, b0] = windowRef.current;
      g = { m: 'pan', x0: [...touches.values()][0] as number, a0, b0, moved: true };
    };
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [ref, windowRef, setWindow, total, minDays]);
}

/**
 * Mouse drag over the plot selects days; on release the selection becomes the window (at least
 * `minDays`). Returns the pointer-down handler; `onSelecting` reports the live selection in
 * visible-column indexes (`null` when done).
 */
export function startDaySelection(
  e: { pointerType: string; button: number; clientX: number; target: EventTarget | null },
  plot: HTMLElement,
  options: {
    readonly columns: number;
    readonly offset: number;
    readonly total: number;
    readonly minDays: number;
    /** Ignore presses on these elements (event markers). */
    readonly ignore?: string;
    /** How a too-narrow selection grows: around its start (`'centre'`) or forward from it (`'forward'`). */
    readonly grow?: 'centre' | 'forward';
    readonly onSelecting: (sel: DayWindow | null) => void;
    readonly onSelect: (w: DayWindow) => void;
  },
): void {
  if (isTouch(e.pointerType) || e.button !== 0) return;
  if (options.ignore && e.target instanceof Element && e.target.closest(options.ignore)) return;
  const rect = plot.getBoundingClientRect();
  const n = options.columns;
  const at = (x: number) => Math.min(n - 1, Math.max(0, Math.floor(((x - rect.left) / Math.max(1, rect.width)) * n)));
  const s0 = at(e.clientX);
  let cur: DayWindow = [s0, s0];
  options.onSelecting(cur);
  const onMove = (ev: PointerEvent) => {
    cur = [s0, at(ev.clientX)];
    options.onSelecting(cur);
  };
  const onUp = () => {
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerup', onUp);
    options.onSelecting(null);
    const a = Math.min(cur[0], cur[1]);
    const b = Math.max(cur[0], cur[1]);
    if (a === b) return;
    let g0 = options.offset + a;
    let g1 = options.offset + b;
    const span = options.minDays - 1;
    if (g1 - g0 < span) {
      if (options.grow === 'forward') {
        g1 = Math.min(options.total - 1, g0 + span);
        g0 = g1 - span;
      } else {
        const need = span - (g1 - g0);
        g0 = Math.max(0, g0 - Math.ceil(need / 2));
        g1 = Math.min(options.total - 1, g0 + span);
        g0 = g1 - span;
      }
    }
    options.onSelect([g0, g1]);
  };
  addEventListener('pointermove', onMove);
  addEventListener('pointerup', onUp);
}
