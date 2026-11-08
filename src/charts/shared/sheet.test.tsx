import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SheetSummary } from './sheet-summary';
import { TimelineStrip } from './timeline-strip';

const items = Array.from({ length: 10 }, (_, i) => ({ value: i === 4 ? Number.NaN : i + 1, major: i === 0 ? 'Mon' : undefined }));

describe('TimelineStrip', () => {
  it('renders one bar per item, a gap for missing values and the active item', () => {
    const { container } = render(<TimelineStrip items={items} index={2} onChange={() => undefined} aria-label="Days" />);
    expect(container.querySelectorAll('.vl-timeline__item')).toHaveLength(10);
    expect(container.querySelectorAll('.vl-timeline__gap')).toHaveLength(1);
    expect(container.querySelector('[data-active]')).toBe(container.querySelectorAll('.vl-timeline__item')[2]);
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });
  it('triples the items in loop mode', () => {
    const { container } = render(<TimelineStrip items={items} index={0} onChange={() => undefined} loop />);
    expect(container.querySelectorAll('.vl-timeline__item')).toHaveLength(30);
  });
  it('steps with arrows and clamps at the ends', () => {
    const onChange = vi.fn();
    render(<TimelineStrip items={items} index={9} onChange={onChange} aria-label="Days" />);
    const slider = screen.getByRole('slider', { name: 'Days' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(9);
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith(8);
  });
  it('wraps in loop mode', () => {
    const onChange = vi.fn();
    render(<TimelineStrip items={items} index={9} onChange={onChange} loop aria-label="Days" />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Days' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});

describe('SheetSummary', () => {
  const series = [
    { id: 'a', label: 'Alpha', color: 'red' },
    { id: 'b', label: 'Beta', color: 'blue' },
  ];
  it('shows the headline stat with its delta and the rest as rows', () => {
    const { container } = render(
      <SheetSummary
        title="12 Oct"
        stats={[
          { id: 's', label: 'Sold', value: '1,204 pcs', deltaPct: 12 },
          { id: 'r', label: 'Revenue', value: '30,100 $', deltaPct: -4 },
        ]}
      />,
    );
    expect(container.querySelector('.vl-sheet-summary__lead-value')?.textContent).toBe('1,204 pcs');
    expect(container.querySelector('.vl-sheet-summary__unit')?.textContent).toBe('pcs');
    expect(container.querySelector('.vl-sheet-summary__chip')?.textContent).toBe('↑ +12% vs previous');
    expect(container.querySelector('.vl-sheet-summary__row [data-direction="down"]')?.textContent).toBe('↓ −4%');
  });
  it('picks a series from the chips', () => {
    const onChange = vi.fn();
    render(<SheetSummary series={series} activeId="a" onChange={onChange} title="T" stats={[]} />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    // The page slides out first; the change lands after the transition (or its timeout).
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        expect(onChange).toHaveBeenCalledWith('b');
        resolve();
      }, 350),
    );
  });
  it('hides the picker for one series and runs actions', () => {
    const onClick = vi.fn();
    render(
      <SheetSummary
        series={[series[0] as (typeof series)[number]]}
        activeId="a"
        title="T"
        stats={[]}
        actions={[{ id: 'x', label: 'Open', onClick }]}
      />,
    );
    expect(screen.queryByRole('tablist')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onClick).toHaveBeenCalled();
  });
});
