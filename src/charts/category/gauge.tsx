import { type ReactNode } from 'react';

import { cx, type ValueUnit, useFormat, useTweenedValues } from '../../core';

export interface GaugeThreshold {
  /** Upper bound of the band, in value units. */
  readonly to: number;
  readonly tone: 'positive' | 'warning' | 'negative' | 'accent' | 'neutral';
}

export interface GaugeProps {
  readonly value: number;
  readonly max: number;
  readonly min?: number;
  /** Accessible name. */
  readonly title: string;
  /** Marker on the arc: a target or the "usual" value. */
  readonly target?: number;
  readonly targetLabel?: string;
  /** Colour bands: the arc takes the tone of the band containing the value. */
  readonly thresholds?: readonly GaugeThreshold[];
  readonly unit?: ValueUnit;
  readonly formatValue?: (v: number) => string;
  /** Big text in the centre; default — percent of max. */
  readonly label?: ReactNode;
  /** Small text under the label. */
  readonly sublabel?: ReactNode;
  /** `semi` (180°, default) or `arc` (270°). */
  readonly shape?: 'semi' | 'arc';
  /** Width of the drawing, px. Default 200 (`semi`) or 220 (`arc`). */
  readonly size?: number;
  readonly thickness?: number;
  readonly animate?: boolean;
  readonly className?: string;
}

const TAU = Math.PI * 2;

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0.toFixed(2)},${y0.toFixed(2)}A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

/** Speedometer: progress towards a maximum (sell-out, capacity, check-in) with target and bands. */
export function Gauge({
  value,
  max,
  min = 0,
  title,
  target,
  targetLabel,
  thresholds,
  unit,
  formatValue,
  label,
  sublabel,
  shape = 'semi',
  size: sizeProp,
  thickness = 14,
  animate = true,
  className,
}: GaugeProps) {
  const format = useFormat();
  const [shown] = useTweenedValues([value], { duration: animate ? 900 : 0 });
  const span = Math.max(1e-9, max - min);
  const ratio = (v: number) => Math.max(0, Math.min(1, (v - min) / span));
  const sweep = shape === 'semi' ? Math.PI : TAU * 0.75;
  const start = shape === 'semi' ? Math.PI : Math.PI * 0.75;
  const size = sizeProp ?? (shape === 'semi' ? 200 : 220);
  const c = size / 2;
  // The 270° dial leaves room for the target tick and the captions under the arc.
  const r = shape === 'semi' ? (size - thickness) / 2 : c - thickness / 2 - 17;
  const height = shape === 'semi' ? c + thickness / 2 + 2 : size - 24;
  const tick = shape === 'semi' ? thickness / 2 + 2 : 13;
  const tone = thresholds?.find((t) => value <= t.to)?.tone ?? 'accent';
  const fmt = formatValue ?? ((v: number) => (unit ? format.value(v, unit, true) : format.number(v)));
  const pct = ratio(value) * 100;
  const aEnd = start + sweep * ratio(shown);
  const targetAngle = target !== undefined ? start + sweep * ratio(target) : null;
  return (
    <figure className={cx('vl-gauge', `vl-gauge--${shape}`, className)} data-tone={tone}>
      <svg
        className="vl-gauge__svg"
        viewBox={`0 0 ${size} ${height}`}
        role="meter"
        aria-label={title}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${fmt(value)} · ${format.percent(pct, 0)}`}
      >
        <path className="vl-gauge__track" d={arcPath(c, c, r, start, start + sweep)} strokeWidth={thickness} />
        {thresholds?.map((t, i) => {
          const from = i === 0 ? min : thresholds[i - 1].to;
          return (
            <path
              key={i}
              className="vl-gauge__band"
              data-tone={t.tone}
              d={arcPath(c, c, r + thickness / 2 + 3, start + sweep * ratio(from), start + sweep * ratio(t.to))}
              strokeWidth={2}
            />
          );
        })}
        {ratio(shown) > 0.001 ? <path className="vl-gauge__value" d={arcPath(c, c, r, start, aEnd)} strokeWidth={thickness} /> : null}
        {targetAngle !== null ? (
          <line
            className="vl-gauge__target"
            x1={c + (r - tick) * Math.cos(targetAngle)}
            y1={c + (r - tick) * Math.sin(targetAngle)}
            x2={c + (r + tick) * Math.cos(targetAngle)}
            y2={c + (r + tick) * Math.sin(targetAngle)}
          >
            {targetLabel ? <title>{targetLabel}</title> : null}
          </line>
        ) : null}
      </svg>
      <figcaption className="vl-gauge__caption">
        <span className="vl-gauge__label">{label ?? format.percent(ratio(shown) * 100, 0)}</span>
        {sublabel ? (
          <span className="vl-gauge__sublabel">{sublabel}</span>
        ) : (
          <span className="vl-gauge__sublabel">{`${fmt(value)} / ${fmt(max)}`}</span>
        )}
        {target !== undefined && targetLabel ? <span className="vl-gauge__target-label">{targetLabel}</span> : null}
      </figcaption>
    </figure>
  );
}
