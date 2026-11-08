import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';

import { useFormat } from '../../core';
import { CountdownChart } from './countdown-chart';
import { demoCountdown, type DemoEventKind, demoRateDays } from './demo-days';
import { DEMO_EVENT_LABELS, DemoEventIcon } from './demo-icons';
import { RateColumnsChart } from './rate-columns-chart';

import './stories.css';

type Status = 'ready' | 'loading' | 'error' | 'empty' | 'no-access';

interface DaysDemoProps {
  readonly width: 'card' | 'phone';
  readonly status: Status;
  readonly events: boolean;
}

function ruRequests(v: number): string {
  if (v % 10 === 1 && v % 100 !== 11) return 'заявка';
  if (v % 10 >= 2 && v % 10 <= 4 && (v % 100 < 10 || v % 100 >= 20)) return 'заявки';
  return 'заявок';
}

function useLang(): 'en' | 'ru' {
  return useFormat().locale.code.startsWith('ru') ? 'ru' : 'en';
}

function RateDemo({ width, status, events }: DaysDemoProps) {
  const fmt = useFormat();
  const lang = useLang();
  const data = useMemo(() => demoRateDays(36400, 573, fmt.locale.monthsShort, new Date(2026, 9, 30), lang), [fmt.locale.monthsShort, lang]);
  return (
    <div className={`sb-days-frame sb-days-frame--${width}`}>
      <RateColumnsChart<DemoEventKind>
        title={lang === 'ru' ? 'Конверсия по дням' : 'Conversion by day'}
        days={data.days}
        events={events ? data.events : []}
        renderEventIcon={(e) => <DemoEventIcon kind={e.kind} />}
        eventKindLabel={(k) => DEMO_EVENT_LABELS[lang][k]}
        state={status === 'ready' ? undefined : { status }}
      />
    </div>
  );
}

function CountdownDemo({ width, status, events }: DaysDemoProps) {
  const fmt = useFormat();
  const lang = useLang();
  const ru = lang === 'ru';
  const data = useMemo(() => demoCountdown(undefined, lang), [lang]);
  const money = (v: number) => `${fmt.number(v)} ${ru ? '₽' : '$'}`;
  const law = (d: number) => {
    if (d > 10) return 100;
    if (d >= 5) return 50;
    return d >= 3 ? 30 : 0;
  };
  return (
    <div className={`sb-days-frame sb-days-frame--${width}`}>
      <CountdownChart<DemoEventKind>
        title={ru ? 'Заявки на возврат по дням' : 'Refund requests by day'}
        columns={data.columns}
        parts={[
          { id: 'ok', label: ru ? 'Вернули' : 'Refunded', color: 'var(--vl-positive)' },
          { id: 'no', label: ru ? 'Отказали' : 'Declined', color: 'color-mix(in oklab, var(--vl-text-muted) 70%, transparent)' },
          { id: 'wait', label: ru ? 'Ждут решения' : 'Pending', color: 'var(--vl-accent)' },
        ]}
        zones={data.zones}
        events={events ? data.events : []}
        renderEventIcon={(e) => <DemoEventIcon kind={e.kind} />}
        eventKindLabel={(k) => DEMO_EVENT_LABELS[lang][k]}
        metrics={[
          {
            id: 'n',
            label: ru ? 'Заявки' : 'Requests',
            lead: (total, v) => (
              <>
                <b>{total}</b> {ru ? `${ruRequests(v)} на возврат` : 'refund requests'}
              </>
            ),
          },
          {
            id: 'sum',
            label: ru ? 'Сумма' : 'Amount',
            value: (c) => Math.round(Object.values(c.parts).reduce((a, b) => a + b, 0) * data.average),
            format: money,
            lead: (total) => (
              <>
                <b>{total}</b> {ru ? 'просили вернуть' : 'asked back'}
              </>
            ),
          },
        ]}
        tooltipRows={(c) => {
          const n = Object.values(c.parts).reduce((a, b) => a + b, 0);
          return [
            { id: 'sum', label: ru ? 'Просили' : 'Asked', value: money(Math.round(n * data.average)) },
            { id: 'law', label: ru ? 'По закону' : 'By law', value: `${law(c.offset)}%` },
          ];
        }}
        state={status === 'ready' ? undefined : { status }}
      />
    </div>
  );
}

const meta = {
  title: 'Charts/Business/Day charts',
  component: RateDemo,
  args: { width: 'card', status: 'ready', events: true },
  argTypes: {
    width: { control: 'inline-radio', options: ['card', 'phone'] },
    status: { control: 'select', options: ['ready', 'loading', 'error', 'empty', 'no-access'] },
  },
} satisfies Meta<typeof RateDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Daily rate: grey columns are visitors, the line is conversion; drag the navigator window, select days with the mouse. */
export const RateColumns: Story = {};

export const RateColumnsPhone: Story = {
  args: { width: 'phone' },
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
};

export const RateColumnsNoEvents: Story = { args: { events: false } };

export const RateColumnsLoading: Story = { args: { status: 'loading' } };

/** Countdown: refund requests by days before the event, stacked by status, with the zones of what is due back. */
export const Countdown: Story = { render: (args) => <CountdownDemo {...args} /> };

export const CountdownPhone: Story = {
  args: { width: 'phone' },
  render: (args) => <CountdownDemo {...args} />,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'phone' } },
};

export const CountdownEmpty: Story = { args: { status: 'empty' }, render: (args) => <CountdownDemo {...args} /> };
