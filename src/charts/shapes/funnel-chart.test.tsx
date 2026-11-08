import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { VizProvider } from '../../core';
import { FUNNEL_VARIANT, FunnelChart, type FunnelVariant } from './funnel-chart';

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

const steps = [
  { id: 'visit', label: 'Event page', value: 10000 },
  { id: 'select', label: 'Choose tickets', value: 3000 },
  { id: 'checkout', label: 'Checkout', value: 1200 },
  { id: 'paid', label: 'Paid', value: 900 },
];

describe('FunnelChart', () => {
  it('headline: total conversion and the biggest drop', () => {
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} />);
    expect(container.querySelector('.vl-funnel__total')?.textContent).toBe('9%');
    expect(container.querySelector('.vl-funnel__worst')?.textContent).toContain('Choose tickets');
    expect(container.querySelector('.vl-funnel__worst')?.textContent).toContain('70%');
  });

  it.each(Object.values(FUNNEL_VARIANT) as FunnelVariant[])('renders every step in the %s variant', async (variant) => {
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} variant={variant} animate={false} />);
    await screen.findByRole('table', { name: /Sales funnel/ });
    // SVG variants need a measured width; jsdom has none, so only the DOM rows render there.
    if (variant === 'funnel' || variant === 'dropoff') expect(container.querySelectorAll('[data-step]')).toHaveLength(4);
    expect(container.querySelector('.vl-funnel')).toHaveClass(`vl-funnel--${variant}`);
  });

  it('screen-reader table has conversion from start and from previous', () => {
    render(<FunnelChart title="Sales funnel" steps={steps} animate={false} />);
    const rows = screen.getByRole('table').querySelectorAll('tbody tr');
    expect(rows).toHaveLength(4);
    expect(rows[1]).toHaveTextContent('30%');
    expect(rows[2]).toHaveTextContent('40%');
  });

  it('marks the drop-off step and shows a tooltip on focus', () => {
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} />);
    expect(container.querySelector('[data-step="1"]')).toHaveAttribute('data-worst');
    act(() => container.querySelector<HTMLElement>('[data-step="2"]')?.focus());
    expect(screen.getByRole('tooltip')).toHaveTextContent('Checkout');
    expect(container.querySelector('[data-step="0"]')).toHaveAttribute('data-state', 'dim');
  });

  it('keyboard: arrows move between steps, Enter selects', () => {
    const onSelect = vi.fn();
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} onSelect={onSelect} />);
    const items = container.querySelectorAll<HTMLElement>('[data-step]');
    act(() => items[0].focus());
    fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1], { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(1, null);
  });

  it('a step without data is "No data", not zero; the next step counts from the last known one', () => {
    const gappy = [steps[0], { id: 'select', label: 'Choose tickets', value: Number.NaN }, steps[2]];
    const { container } = render(<FunnelChart title="Gap" steps={gappy} animate={false} />);
    expect(container.querySelector('[data-step="1"]')).toHaveTextContent('No data');
    expect(container.querySelector('[data-step="2"]')).toHaveTextContent('12% of start');
  });

  it('a step bigger than the previous is flagged, not 100%', () => {
    const odd = [steps[0], { id: 'x', label: 'Direct link', value: 12000 }];
    const { container } = render(<FunnelChart title="Odd" steps={odd} animate={false} />);
    expect(container.querySelector('[data-step="1"] [data-skipped]')).not.toBeNull();
  });

  it('empty, loading and error states', () => {
    const empty = render(<FunnelChart title="Empty" steps={[]} />);
    expect(empty.container.querySelector('.vl-state--empty')).not.toBeNull();
    empty.unmount();
    const loading = render(<FunnelChart title="Loading" steps={steps} state={{ status: 'loading' }} />);
    expect(loading.container.querySelector('.vl-state--loading')).not.toBeNull();
    loading.unmount();
    render(<FunnelChart title="Err" steps={steps} state={{ status: 'error' }} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('FunnelChart on a phone', () => {
  let restore: () => void;
  beforeEach(() => {
    restore = emulatePhone();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    restore();
  });

  it('a tap opens the bottom sheet with the summary of the step, not a tooltip', () => {
    const onSelect = vi.fn();
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} onSelect={onSelect} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(container.querySelector('[data-step="2"]') as Element);
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveTextContent('Checkout');
    expect(sheet).toHaveTextContent('step 3 of 4');
    expect(sheet).toHaveTextContent('At this step');
    expect(sheet).toHaveTextContent('1,200');
    expect(sheet).toHaveTextContent('12% of start');
    expect(sheet).toHaveTextContent('Passed on');
    expect(sheet).toHaveTextContent('Left after the step');
    expect(sheet.querySelector('.vl-funnel-side')).not.toBeNull();
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(onSelect).toHaveBeenCalledWith(2, null);
  });

  it('tapping a band of the silhouette moves the sheet to that step', () => {
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} />);
    fireEvent.click(container.querySelector('[data-step="0"]') as Element);
    expect(screen.getByRole('dialog')).toHaveTextContent('funnel start');
    fireEvent.click(screen.getByRole('dialog').querySelectorAll('.vl-funnel-side__step')[3] as Element);
    expect(screen.getByRole('dialog')).toHaveTextContent('step 4 of 4');
    expect(screen.getByRole('dialog')).toHaveTextContent('last step');
  });

  it('hold and drag reads the steps one by one, and the lifted finger does not tap', () => {
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} />);
    const steps$ = container.querySelectorAll('[data-step]');
    const area = container.querySelector('.vl-funnel__plot') as Element;
    const release = holdAndDrag(area, [steps$[0], steps$[1], steps$[3]]);
    expect(steps$[3]).toHaveAttribute('data-state', 'on');
    expect(steps$[1]).toHaveAttribute('data-state', 'dim');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Paid');
    release();
    expect(steps$[3]).not.toHaveAttribute('data-state');
    fireEvent.click(steps$[3]);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('FunnelChart words', () => {
  it('speaks Russian with the provider locale and `labels` still override', () => {
    const { container } = render(
      <VizProvider locale="ru">
        <FunnelChart title="Воронка" steps={steps} animate={false} labels={{ reached: 'Добрались' }} />
      </VizProvider>,
    );
    expect(container.querySelector('.vl-funnel__worst')?.textContent).toContain('Больше всего уходят перед шагом «Choose tickets»');
    expect(screen.getByRole('table')).toHaveTextContent('Добрались');
    expect(screen.getByRole('table')).toHaveTextContent('от прошлого шага');
  });

  it('stays English without a locale', () => {
    const { container } = render(<FunnelChart title="Sales funnel" steps={steps} animate={false} />);
    expect(container.querySelector('.vl-funnel__worst')?.textContent).toContain('Biggest drop');
  });
});
