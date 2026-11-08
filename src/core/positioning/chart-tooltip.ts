/**
 * Placement of a tooltip inside a chart container (no portal): beside the anchor point,
 * flipped to the other side when it does not fit, clamped to the container. On narrow
 * containers (phones) it docks above the plot so it never covers the finger.
 */

export interface ChartTooltipInput {
  /**
   * Anchor in container coordinates, px: `y` is its top. `width` — a band (bar) the bubble must
   * not cover; `height` — how tall the anchor is, so a bubble flipped below clears all of it.
   */
  readonly anchor: { readonly x: number; readonly y: number; readonly width?: number; readonly height?: number };
  readonly size: { readonly width: number; readonly height: number };
  readonly bounds: { readonly width: number; readonly height: number };
  /** Preferred side. `auto`: right of the anchor, left near the right edge. */
  readonly prefer?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  readonly gap?: number;
  /** Container width below which the tooltip docks to the top edge. */
  readonly dockBelow?: number;
  /** Extra room outside the container on each side, px (the page around the chart). Default 0. */
  readonly room?: { readonly top: number; readonly right: number; readonly bottom: number; readonly left: number };
}

export interface ChartTooltipPosition {
  readonly x: number;
  readonly y: number;
  readonly side: 'top' | 'bottom' | 'left' | 'right' | 'dock';
}

const NO_ROOM = { top: 0, right: 0, bottom: 0, left: 0 } as const;

const clampTo = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function placeChartTooltip({
  anchor,
  size,
  bounds,
  prefer = 'auto',
  gap = 12,
  dockBelow = 0,
  room = NO_ROOM,
}: ChartTooltipInput): ChartTooltipPosition {
  const half = (anchor.width ?? 0) / 2;
  const minX = -room.left;
  const minY = -room.top;
  const maxX = Math.max(minX, bounds.width + room.right - size.width);
  const maxY = Math.max(minY, bounds.height + room.bottom - size.height);
  if (bounds.width < dockBelow) {
    return { x: clampTo(anchor.x - size.width / 2, 0, Math.max(0, bounds.width - size.width)), y: -size.height - gap / 2, side: 'dock' };
  }
  const right = anchor.x + half + gap;
  const left = anchor.x - half - gap - size.width;
  const top = anchor.y - gap - size.height;
  const bottom = anchor.y + (anchor.height ?? 0) + gap;
  const midY = clampTo(anchor.y - size.height / 2, minY, maxY);
  const midX = clampTo(anchor.x - size.width / 2, minX, maxX);
  const fitsRight = right + size.width <= bounds.width + room.right;
  const fitsLeft = left >= minX;
  switch (prefer) {
    case 'top':
      return top >= minY ? { x: midX, y: top, side: 'top' } : { x: midX, y: clampTo(bottom, minY, maxY), side: 'bottom' };
    case 'bottom':
      return bottom + size.height <= bounds.height + room.bottom
        ? { x: midX, y: bottom, side: 'bottom' }
        : { x: midX, y: clampTo(top, minY, maxY), side: 'top' };
    case 'left':
      return fitsLeft ? { x: left, y: midY, side: 'left' } : { x: clampTo(right, minX, maxX), y: midY, side: 'right' };
    default:
      if (fitsRight) return { x: right, y: midY, side: 'right' };
      if (fitsLeft) return { x: left, y: midY, side: 'left' };
      return top >= minY ? { x: midX, y: top, side: 'top' } : { x: midX, y: clampTo(bottom, minY, maxY), side: 'bottom' };
  }
}
