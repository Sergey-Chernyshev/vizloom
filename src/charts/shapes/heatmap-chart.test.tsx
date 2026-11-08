import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fixedOffsetZone, VizProvider } from '../../core';
import { cellAlpha, HeatmapChart, pickHourStep } from './heatmap-chart';

/** Makes the media query of `useIsPhone` match for the test (a touch phone). */
function emulatePhone(): () => void {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

/** Hold a finger on `area`, then drag it over `targets` one by one; returns the release. */
function holdAndDrag(area: Element, targets: readonly Element[]): () => void {
  const at = document as unknown as { elementFromPoint: (x: number, y: number) => Element | null };
  const original = at.elementFromPoint;
  let current: Element | null = targets[0] ?? null;
  at.elementFromPoint = () => current;
  fireEvent.touchStart(area, { touches: [{ clientX: 10, clientY: 10 }] });
  act(() => {
    vi.advanceTimersByTime(300);
  });
  targets.forEach((target, i) => {
    current = target;
    fireEvent.touchMove(area, { touches: [{ clientX: 10 + i, clientY: 10 }] });
  });
  return () => {
    fireEvent.touchEnd(area);
    at.elementFromPoint = original;
  };
}

/** Tuesday-heavy grid: Mon (day 0) quiet, Tue 20:00 is the peak. */
function makeGrid(): number[][] {
  const grid = Array.from({ length: 7 }, () => new Array<number>(24).fill(1));
  grid[1][20] = 40;
  grid[1][19] = 20;
  grid[3][4] = Number.NaN;
  grid[5][10] = 0;
  return grid;
}

describe('cellAlpha / pickHourStep', () => {
  it('maps value to .14 + .86·(v/max)^.8; zero and unknown stay empty', () => {
    expect(cellAlpha(100, 100)).toBeCloseTo(1);
    expect(cellAlpha(50, 100)).toBeCloseTo(0.14 + 0.86 * 0.5 ** 0.8);
    expect(cellAlpha(0, 100)).toBe(0);
    expect(cellAlpha(Number.NaN, 100)).toBe(0);
    expect(cellAlpha(5, 0)).toBe(0);
  });

  it('merges hours on narrow plots', () => {
    expect(pickHourStep(480)).toBe(1);
    expect(pickHourStep(300)).toBe(2);
    expect(pickHourStep(180)).toBe(3);
    expect(pickHourStep(120)).toBe(4);
  });
});

describe('HeatmapChart', () => {
  it('draws 7 rows and the peak headline', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    expect(container.querySelectorAll('[role="row"]')).toHaveLength(7);
    expect(container.querySelector('.vl-heatmap__peak')?.textContent).toBe('Tue 20:00');
    expect(container.querySelector('.vl-heatmap__best')?.textContent).toContain('Tuesday');
  });

  it('marks unknown and zero cells differently', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    expect(container.querySelector('[data-cell="3:4"]')).toHaveAttribute('data-known', 'false');
    expect(container.querySelector('[data-cell="5:10"]')).toHaveAttribute('data-zero');
    expect(container.querySelector('[data-cell="1:20"]')).toHaveAttribute('data-hot');
  });

  it('screen-reader table lists every day with 24 hours and a total', () => {
    render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    const table = screen.getByRole('table', { name: /Sales by hour/ });
    expect(table.querySelectorAll('tbody tr')).toHaveLength(7);
    expect(table.querySelectorAll('thead th')).toHaveLength(26);
  });

  it('keyboard: roving focus with arrows, tooltip on focus', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    const first = container.querySelector<HTMLElement>('[data-cell="0:0"]');
    expect(first).toHaveAttribute('tabindex', '0');
    expect(container.querySelector('[data-cell="0:1"]')).toHaveAttribute('tabindex', '-1');
    act(() => first?.focus());
    fireEvent.keyDown(first as HTMLElement, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(container.querySelector('[data-cell="1:0"]'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tuesday');
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'End' });
    expect(document.activeElement).toBe(container.querySelector('[data-cell="1:23"]'));
  });

  it('tooltip states value, share of the week and the multiple of an average slot', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    act(() => container.querySelector<HTMLElement>('[data-cell="1:20"]')?.focus());
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Sales');
    expect(tip).toHaveTextContent('40');
    expect(tip).toHaveTextContent('of the week');
    expect(tip).toHaveTextContent('×');
  });

  it('totals can be turned off', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} totals={false} />);
    expect(container.querySelector('.vl-heatmap__total')).toBeNull();
    expect(container.querySelector('.vl-heatmap__col-total')).toBeNull();
  });

  it('folds an hourly series in the provider time zone', () => {
    // 2026-11-02 is a Monday. One sale at 22:00 UTC = 01:00 Tuesday in UTC+3.
    const start = Date.UTC(2026, 10, 2, 0, 0);
    const values = new Array<number>(48).fill(0);
    values[22] = 9;
    const hourly = { start, length: 48, values: { sales: values } };
    const utc = render(<HeatmapChart title="UTC" hourly={hourly} animate={false} />);
    expect(utc.container.querySelector('.vl-heatmap__peak')?.textContent).toBe('Mon 22:00');
    utc.unmount();
    const msk = render(
      <VizProvider zone={fixedOffsetZone(3)}>
        <HeatmapChart title="MSK" hourly={hourly} animate={false} />
      </VizProvider>,
    );
    expect(msk.container.querySelector('.vl-heatmap__peak')?.textContent).toBe('Tue 01:00');
  });

  it('onSelect receives the cell index', () => {
    const onSelect = vi.fn();
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} onSelect={onSelect} />);
    fireEvent.click(container.querySelector('[data-cell="1:20"]') as Element);
    expect(onSelect).toHaveBeenCalledWith(1 * 24 + 20, null);
  });

  it('empty, loading and error states', () => {
    const empty = render(<HeatmapChart title="Empty" grid={Array.from({ length: 7 }, () => new Array<number>(24).fill(Number.NaN))} />);
    expect(empty.container.querySelector('.vl-state--empty')).not.toBeNull();
    empty.unmount();
    const loading = render(<HeatmapChart title="Loading" grid={makeGrid()} state={{ status: 'loading' }} />);
    expect(loading.container.querySelector('.vl-state--loading')).not.toBeNull();
    loading.unmount();
    render(<HeatmapChart title="Err" grid={makeGrid()} state={{ status: 'error' }} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('HeatmapChart on a phone', () => {
  let restore: () => void;
  beforeEach(() => {
    restore = emulatePhone();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    restore();
  });

  it('a tap opens the sheet with the verdict, the strip and the stats of the slot', () => {
    const onSelect = vi.fn();
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} onSelect={onSelect} />);
    fireEvent.click(container.querySelector('[data-cell="1:20"]') as Element);
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveTextContent('Tue, 20:00–21:00');
    expect(sheet).toHaveTextContent('Peak of the week');
    expect(sheet).toHaveTextContent('from 20:00 to 21:00');
    expect(sheet).toHaveTextContent('Share of the week');
    expect(sheet.querySelector('.vl-timeline')).not.toBeNull();
    expect(sheet.querySelectorAll('.vl-timeline__item')).toHaveLength(7 * 24 * 3);
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(container.querySelector('[data-cell="1:20"]')).toHaveAttribute('data-active');
    expect(onSelect).toHaveBeenCalledWith(1 * 24 + 20, null);
  });

  it('a quiet and a missing slot get their own verdicts', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    fireEvent.click(container.querySelector('[data-cell="3:4"]') as Element);
    expect(screen.getByRole('dialog')).toHaveTextContent('No data for this slot');
    fireEvent.click(container.querySelector('[data-cell="5:10"]') as Element);
    expect(screen.getByRole('dialog')).toHaveTextContent('No purchases');
  });

  it('scrubbing the strip moves the sheet to the neighbouring slot', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    fireEvent.click(container.querySelector('[data-cell="1:20"]') as Element);
    const track = screen.getByRole('dialog').querySelector('.vl-timeline__track') as HTMLElement;
    // Loop mode: the middle copy starts at item 168; item 1:21 is 168 + 24 + 21.
    track.scrollLeft = (168 + 24 + 21) * 22;
    fireEvent.scroll(track);
    expect(screen.getByRole('dialog')).toHaveTextContent('Tue, 21:00–22:00');
    expect(container.querySelector('[data-cell="1:21"]')).toHaveAttribute('data-active');
  });

  it('hold and drag reads the cells, the tooltip follows the finger', () => {
    const { container } = render(<HeatmapChart title="Sales by hour" grid={makeGrid()} animate={false} />);
    const area = container.querySelector('.vl-heatmap__grid') as Element;
    const release = holdAndDrag(area, [
      container.querySelector('[data-cell="0:0"]') as Element,
      container.querySelector('[data-cell="1:19"]') as Element,
    ]);
    expect(container.querySelector('[data-cell="1:19"]')).toHaveAttribute('data-active');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tuesday');
    release();
    expect(container.querySelector('[data-cell="1:19"]')).not.toHaveAttribute('data-active');
    fireEvent.click(container.querySelector('[data-cell="1:19"]') as Element);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

let restoreMedia: () => void;

describe('HeatmapChart words', () => {
  it('speaks Russian with the provider locale and `labels` still override', () => {
    const { container } = render(
      <VizProvider locale="ru">
        <HeatmapChart title="Продажи по часам" grid={makeGrid()} animate={false} labels={{ few: 'меньше' }} />
      </VizProvider>,
    );
    expect(container.querySelector('.vl-heatmap__peak')?.textContent).toBe('Вт 20:00');
    expect(container.querySelector('.vl-heatmap__headline')?.textContent).toContain('пик · 40');
    expect(container.querySelector('.vl-heatmap__best')?.textContent).toContain('Сильнее всего вторник');
    expect(container.querySelector('.vl-heatmap__scale')?.textContent).toBe(`меньше0${40}много`);
  });

  it('the Russian sheet uses the words of the mock-up', () => {
    restoreMedia = emulatePhone();
    const { container } = render(
      <VizProvider locale="ru">
        <HeatmapChart title="Продажи по часам" grid={makeGrid()} animate={false} />
      </VizProvider>,
    );
    fireEvent.click(container.querySelector('[data-cell="1:20"]') as Element);
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveTextContent('Вт, 20:00–21:00');
    expect(sheet).toHaveTextContent('Пик недели');
    expect(sheet).toHaveTextContent('с 20:00 до 21:00');
    expect(sheet).toHaveTextContent('Листайте шкалу');
    restoreMedia();
  });
});
