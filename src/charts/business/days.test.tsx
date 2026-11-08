import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { VizProvider } from '../../core';
import { CountdownChart } from './countdown-chart';
import { demoCountdown, demoRateDays } from './demo-days';
import { RateColumnsChart } from './rate-columns-chart';

const rect = (left: number, width: number) =>
  ({ width, height: 200, top: 0, left, right: left + width, bottom: 200, x: left, y: 0, toJSON: () => ({}) }) as DOMRect;

beforeAll(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => rect(0, 210));
});
afterAll(() => {
  vi.restoreAllMocks();
});

const { days, events } = demoRateDays();

describe('demo data', () => {
  it('keeps the totals of the rate days', () => {
    expect(days).toHaveLength(45);
    expect(days.reduce((a, d) => a + d.base, 0)).toBeGreaterThan(36300);
    expect(days.reduce((a, d) => a + d.count, 0)).toBeGreaterThan(560);
    expect(days[44]?.label).toBe('30 Oct');
  });
  it('splits countdown requests into parts', () => {
    const { columns } = demoCountdown({ n: 19, sum: 57880, no: 4, wait: 2 });
    const sum = (k: string) => columns.reduce((a, c) => a + (c.parts[k] ?? 0), 0);
    expect(columns).toHaveLength(31);
    expect(sum('ok') + sum('no') + sum('wait')).toBe(19);
    expect(sum('no')).toBe(4);
    expect(sum('wait')).toBe(2);
    // Declines go to the last days.
    expect(columns.filter((c) => (c.parts['no'] ?? 0) > 0).every((c) => c.offset < 3)).toBe(true);
  });
});

describe('RateColumnsChart', () => {
  it('shows the last 21 days and their average rate', () => {
    const { container } = render(<RateColumnsChart title="Conversion" days={days} events={events} />);
    expect(container.querySelectorAll('.vl-rate-days__col')).toHaveLength(21);
    const win = days.slice(24);
    const avg = win.reduce((a, d) => a + d.count, 0) / win.reduce((a, d) => a + d.base, 0);
    expect(container.querySelector('.vl-rate-days__value')?.textContent).toBe(`${(avg * 100).toFixed(1)}%`);
    expect(container.querySelector('.vl-rate-days__sub')?.textContent).toBe(`average conversion · ${days[24]?.label} — ${days[44]?.label}`);
  });
  it('marks the best and the worst day of the window', () => {
    const { container } = render(<RateColumnsChart title="Conversion" days={days} />);
    expect(container.querySelectorAll('[data-best]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-worst]')).toHaveLength(1);
  });
  it('draws event markers with a count of extra events', () => {
    render(<RateColumnsChart title="Conversion" days={days} events={events} />);
    const marker = screen.getByRole('button', { name: /Artist post, Social ads, Promo code FRIENDS20/ });
    expect(marker.textContent).toContain('3');
  });
  it('moves the window from the keyboard', () => {
    const { container } = render(<RateColumnsChart title="Conversion" days={days} />);
    const slider = screen.getByRole('slider', { name: 'Period on the chart' });
    expect(slider).toHaveAttribute('aria-valuenow', '24');
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toHaveAttribute('aria-valuenow', '23');
    expect(container.querySelectorAll('.vl-rate-days__col')).toHaveLength(21);
  });
  it('zooms to the days selected with the mouse (at least five)', () => {
    const { container } = render(<RateColumnsChart title="Conversion" days={days} />);
    const plot = container.querySelector('.vl-rate-days__plot') as HTMLElement;
    // 21 columns over 210 px: 10 px each. Select columns 2..3 → grows to 5 days.
    fireEvent(plot, new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 25 }));
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 35 }));
      window.dispatchEvent(new MouseEvent('pointerup', { clientX: 35 }));
    });
    expect(container.querySelectorAll('.vl-rate-days__col')).toHaveLength(5);
  });
  it('shows a tooltip with the day rows on hover', () => {
    const { container } = render(<RateColumnsChart title="Conversion" days={days} />);
    const col = container.querySelectorAll('.vl-rate-days__col')[3] as HTMLElement;
    fireEvent.pointerEnter(col, { pointerType: 'mouse' });
    const tip = container.querySelector('.vl-tooltip');
    expect(tip?.textContent).toContain(days[27]?.label);
    expect(tip?.textContent).toContain('Visitors');
  });
  it('speaks Russian with the provider locale', () => {
    render(
      <VizProvider locale="ru">
        <RateColumnsChart title="Конверсия" days={days} />
      </VizProvider>,
    );
    expect(screen.getByText(/средняя конверсия/)).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Период на графике' })).toBeInTheDocument();
  });
  it('covers the plot with a state', () => {
    render(<RateColumnsChart title="Conversion" days={[]} state={{ status: 'empty' }} />);
    expect(document.querySelector('.vl-biz__overlay')).not.toBeNull();
  });
});

describe('CountdownChart', () => {
  const data = demoCountdown();
  const parts = [
    { id: 'ok', label: 'Refunded', color: 'green' },
    { id: 'no', label: 'Declined', color: 'grey' },
    { id: 'wait', label: 'Pending', color: 'purple' },
  ];
  it('draws one column per day left, from 30 to 0, with ticks', () => {
    const { container } = render(<CountdownChart title="Requests" columns={data.columns} parts={parts} zones={data.zones} />);
    const cols = container.querySelectorAll('.vl-countdown__col');
    expect(cols).toHaveLength(31);
    expect([...container.querySelectorAll('.vl-countdown__tick')].map((t) => t.textContent)).toEqual(['30', '20', '10', '5', '3', '0']);
    expect(container.querySelectorAll('.vl-countdown__zone')).toHaveLength(4);
    expect(container.querySelector('[data-shaded]')?.textContent).toBe('0%');
  });
  it('stacks parts in the column', () => {
    const { container } = render(<CountdownChart title="Requests" columns={data.columns} parts={parts} />);
    const last = container.querySelectorAll('.vl-countdown__col')[30] as HTMLElement;
    expect(last.querySelector('[data-part="no"]')).not.toBeNull();
  });
  it('switches the metric and the headline', () => {
    render(
      <CountdownChart
        title="Requests"
        columns={data.columns}
        parts={parts}
        metrics={[
          { id: 'n', label: 'Requests' },
          {
            id: 'sum',
            label: 'Amount',
            value: (c) => Object.values(c.parts).reduce((a, b) => a + b, 0) * 100,
            lead: (t) => `${t} asked back`,
          },
        ]}
      />,
    );
    expect(document.querySelector('.vl-countdown__lead')?.textContent).toBe('19 Requests');
    fireEvent.click(screen.getByRole('radio', { name: 'Amount' }));
    expect(screen.getByText('1,900 asked back')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Amount' })).toHaveAttribute('aria-checked', 'true');
  });
  it('zooms by selection and resets to the whole period', () => {
    const { container } = render(<CountdownChart title="Requests" columns={data.columns} parts={parts} />);
    const scroll = container.querySelector('.vl-countdown__scroll') as HTMLElement;
    // 31 columns over 210 px. Select two columns → five days forward.
    fireEvent(scroll, new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 3 }));
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10 }));
      window.dispatchEvent(new MouseEvent('pointerup', { clientX: 10 }));
    });
    expect(container.querySelectorAll('.vl-countdown__col')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Whole period' }));
    expect(container.querySelectorAll('.vl-countdown__col')).toHaveLength(31);
  });
  it('titles a day tooltip by days left', () => {
    const { container } = render(<CountdownChart title="Requests" columns={data.columns} parts={parts} />);
    const bar = container.querySelectorAll('.vl-countdown__bar')[28] as HTMLElement;
    fireEvent.pointerEnter(bar);
    expect(container.querySelector('.vl-tooltip')?.textContent).toContain('2 days before the event');
  });
});
