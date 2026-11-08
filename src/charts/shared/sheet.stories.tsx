import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { seriesColor, useFormat } from '../../core';
import { SheetSummary } from './sheet-summary';
import { type TimelineItem, TimelineStrip } from './timeline-strip';

import './stories.css';

const SERIES = [
  { id: 'floor', label: 'Dance floor', color: seriesColor(0) },
  { id: 'balcony', label: 'Balcony', color: seriesColor(1) },
  { id: 'vip', label: 'VIP', color: seriesColor(2) },
];

const days = (seed: number): number[] =>
  Array.from({ length: 42 }, (_, i) => Math.max(0, Math.round(40 + 30 * Math.sin((i + seed) / 3) + ((i * 7 + seed) % 11))));

function SheetDemo({ withNote }: { readonly withNote: boolean }) {
  const fmt = useFormat();
  const [id, setId] = useState('floor');
  const [k, setK] = useState(30);
  const s = SERIES.findIndex((x) => x.id === id);
  const values = days(s * 5);
  const items: TimelineItem[] = values.map((v, i) => ({
    value: i === 12 ? Number.NaN : v,
    major: i % 7 === 0 ? `${i + 1} Oct` : undefined,
  }));
  const v = values[k] ?? 0;
  const prev = values[k - 7] ?? v;
  return (
    <div className="sb-sheet-frame">
      <SheetSummary
        series={SERIES}
        activeId={id}
        onChange={setId}
        title={`${k + 1} Oct`}
        subtitle={`${SERIES[s]?.label} · day ${k + 1} of 42`}
        note={withNote ? { title: 'Best day of the week', badge: '×1.4', detail: 'usually 38 a day' } : undefined}
        preview={
          <TimelineStrip items={items} index={k} onChange={setK} onScrub={setK} color={SERIES[s]?.color} aria-label="Sales by day" />
        }
        previewHint="Scroll the strip — the summary follows the day"
        stats={[
          { id: 'sold', label: 'Sold that day', value: `${fmt.number(v)} pcs`, deltaPct: ((v - prev) / Math.max(1, prev)) * 100 },
          { id: 'rev', label: 'Revenue', value: `${fmt.number(v * 2500)} $`, hint: 'after refunds' },
          { id: 'share', label: 'Share of the week', value: fmt.percent(18.4, 1), deltaPct: -3.2 },
        ]}
        actions={[{ id: 'zoom', label: 'Open by hour', onClick: () => undefined }]}
      />
    </div>
  );
}

function StripDemo({ loop }: { readonly loop: boolean }) {
  const [k, setK] = useState(5);
  const items: TimelineItem[] = Array.from({ length: 7 * 12 }, (_, i) => ({
    value: Math.round(10 + 40 * Math.abs(Math.sin(i / 5))),
    major: i % 12 === 0 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i / 12] : undefined,
    minor: i % 12 !== 0 && i % 3 === 0 ? String((i % 12) * 2).padStart(2, '0') : undefined,
  }));
  return (
    <div className="sb-sheet-frame sb-sheet-frame--plain">
      <TimelineStrip items={items} index={k} onChange={setK} onScrub={setK} loop={loop} aria-label="Week by hours" />
      <p>Item {k}</p>
    </div>
  );
}

const meta = {
  title: 'Charts/Shared/Phone sheet',
  component: SheetDemo,
  args: { withNote: true },
} satisfies Meta<typeof SheetDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Body of a phone bottom sheet: swipe the page or the chips to change series, scroll the timeline to change the day. */
export const Summary: Story = { parameters: { viewport: { defaultViewport: 'phone' } } };

/** The strip alone; `loop` joins the ends (a week of hours). */
export const Timeline: Story = { render: () => <StripDemo loop /> };
