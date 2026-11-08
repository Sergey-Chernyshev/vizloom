import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { VizProvider } from '../../core';
import { DonutChart } from './donut-chart';

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

const data = [
  { key: 'web', label: 'Web', value: 600 },
  { key: 'app', label: 'App', value: 300 },
  { key: 'box', label: 'Box office', value: 100 },
];

describe('DonutChart', () => {
  it('draws a slice per row, a legend with shares and the total in the centre', () => {
    const { container } = render(<DonutChart title="Sales by channel" data={data} animate={false} />);
    expect(container.querySelectorAll('[data-slice]')).toHaveLength(3);
    expect(container.querySelector('.vl-donut__big')?.textContent).toBe('1,000');
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Total');
    const shares = [...container.querySelectorAll('.vl-donut__share')].map((n) => n.textContent);
    expect(shares).toEqual(['60%', '30%', '10%']);
  });

  it('gives screen readers a data table', () => {
    render(<DonutChart title="Sales by channel" data={data} animate={false} />);
    const table = screen.getByRole('table', { name: /Sales by channel/ });
    expect(table).toBeInTheDocument();
    expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('switches the centre to the focused slice and shows a tooltip', () => {
    const { container } = render(<DonutChart title="Sales" data={data} animate={false} />);
    const slice = container.querySelector<SVGPathElement>('[data-slice="app"]');
    expect(slice).not.toBeNull();
    fireEvent.focus(slice as SVGPathElement);
    expect(container.querySelector('.vl-donut__big')?.textContent).toBe('300');
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('App');
    expect(container.querySelector('.vl-donut__slice[data-state="dim"]')).not.toBeNull();
    expect(screen.getByRole('tooltip')).toHaveTextContent('App');
    fireEvent.blur(slice as SVGPathElement);
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Total');
  });

  it('moves focus with arrow keys and selects with Enter', () => {
    const onSelect = vi.fn();
    const { container } = render(<DonutChart title="Sales" data={data} animate={false} onSelect={onSelect} />);
    const slices = container.querySelectorAll<SVGPathElement>('[data-slice]');
    act(() => slices[0].focus());
    fireEvent.keyDown(slices[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(slices[1]);
    fireEvent.keyDown(slices[1], { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(1, null);
  });

  it('works controlled: highlight from props, changes reported', () => {
    const onHighlight = vi.fn();
    const { container, rerender } = render(
      <DonutChart title="Sales" data={data} animate={false} highlight="box" onHighlight={onHighlight} />,
    );
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Box office');
    fireEvent.pointerEnter(container.querySelector('[data-slice="web"]') as Element, { pointerType: 'mouse' });
    expect(onHighlight).toHaveBeenCalledWith('web');
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Box office');
    rerender(<DonutChart title="Sales" data={data} animate={false} highlight={null} onHighlight={onHighlight} />);
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Total');
  });

  it('merges the tail into "Other" with visibleRows', () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ key: `k${i}`, label: `Item ${i}`, value: 100 - i }));
    const { container } = render(<DonutChart title="Many" data={many} animate={false} visibleRows={5} />);
    expect(container.querySelectorAll('.vl-donut__row')).toHaveLength(6);
    expect(container.querySelector('[data-slice="__other__"]')).not.toBeNull();
    expect(screen.getByRole('table')).toHaveTextContent('Other');
  });

  it('pie has no centre label, semi has one', () => {
    const pie = render(<DonutChart title="Pie" data={data} animate={false} variant="pie" />);
    expect(pie.container.querySelector('.vl-donut__big')).toBeNull();
    pie.unmount();
    const semi = render(<DonutChart title="Semi" data={data} animate={false} variant="semi" />);
    expect(semi.container.querySelector('.vl-donut__big')).not.toBeNull();
  });

  it('shows empty, loading and error states', () => {
    const empty = render(<DonutChart title="Empty" data={[]} />);
    expect(empty.container.querySelector('.vl-state--empty')).not.toBeNull();
    empty.unmount();
    const zero = render(<DonutChart title="Zero" data={[{ key: 'a', label: 'A', value: 0 }]} />);
    expect(zero.container.querySelector('.vl-state--empty')).not.toBeNull();
    zero.unmount();
    const loading = render(<DonutChart title="Loading" data={data} state={{ status: 'loading' }} />);
    expect(loading.container.querySelector('.vl-state--loading')).not.toBeNull();
    loading.unmount();
    const error = render(<DonutChart title="Err" data={data} state={{ status: 'error' }} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    error.unmount();
  });
});

describe('DonutChart on a phone', () => {
  let restore: () => void;
  beforeEach(() => {
    restore = emulatePhone();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    restore();
  });

  it('a tap on a slice opens the sheet with the amount and the share', () => {
    const onSelect = vi.fn();
    const { container } = render(<DonutChart title="Sales" data={data} animate={false} onSelect={onSelect} />);
    fireEvent.click(container.querySelector('[data-slice="app"]') as Element);
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveTextContent('App');
    expect(sheet).toHaveTextContent('Amount');
    expect(sheet).toHaveTextContent('300');
    expect(sheet).toHaveTextContent('of 1,000');
    expect(sheet).toHaveTextContent('30%');
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(onSelect).toHaveBeenCalledWith(1, null);
  });

  it('a tap on a legend row opens the sheet too, and the chips switch the row', () => {
    const { container } = render(<DonutChart title="Sales" data={data} animate={false} />);
    fireEvent.click(container.querySelectorAll('.vl-donut__row')[2] as Element);
    expect(screen.getByRole('dialog')).toHaveTextContent('Box office');
    fireEvent.click(screen.getByRole('tab', { name: 'Web' }));
    // The page slides out before the next row arrives.
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByRole('dialog')).toHaveTextContent('60%');
  });

  it('hold and drag moves the centre from slice to slice, and the lifted finger does not tap', () => {
    const { container } = render(<DonutChart title="Sales" data={data} animate={false} />);
    const area = container.querySelector('.vl-donut__body') as Element;
    const release = holdAndDrag(area, [
      container.querySelector('[data-slice="web"]') as Element,
      container.querySelector('[data-slice="box"]') as Element,
    ]);
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Box office');
    release();
    expect(container.querySelector('.vl-donut__caption')?.textContent).toBe('Total');
    fireEvent.click(container.querySelector('[data-slice="box"]') as Element);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('DonutChart sheet words', () => {
  it('speaks Russian with the provider locale and `labels` still override', () => {
    const restore = emulatePhone();
    const { container } = render(
      <VizProvider locale="ru">
        <DonutChart title="Продажи" data={data} animate={false} labels={{ share: 'Часть' }} />
      </VizProvider>,
    );
    fireEvent.click(container.querySelector('[data-slice="web"]') as Element);
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveTextContent('Количество');
    expect(sheet).toHaveTextContent('из 1 000');
    expect(sheet).toHaveTextContent('Часть');
    restore();
  });
});
