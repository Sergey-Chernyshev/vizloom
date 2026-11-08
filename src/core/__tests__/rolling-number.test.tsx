import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VizProvider } from '../theme/provider';
import { RollingNumber } from '../ui/rolling-number';

describe('RollingNumber', () => {
  it('prints a number in the provider locale and keeps it for screen readers', () => {
    const { container } = render(
      <VizProvider locale="ru">
        <RollingNumber value={12840} />
      </VizProvider>,
    );
    expect(container.textContent?.replace(/\s/g, ' ')).toBe('12 840');
  });
  it('slides in only the changed characters of a string', () => {
    const { container, rerender } = render(<RollingNumber value="1 204 ₽" />);
    rerender(<RollingNumber value="1 214 ₽" />);
    const rolling = container.querySelectorAll('[data-rolling="true"]');
    expect(rolling).toHaveLength(1);
    expect(rolling[0]?.querySelector('.vl-rolling-number__in')?.textContent).toBe('1');
    expect(rolling[0]?.querySelector('.vl-rolling-number__out')?.textContent).toBe('0');
    expect(container.querySelector('.vl-rolling-number__sr')?.textContent).toBe('1 214 ₽');
  });
  it('orders the slide right to left', () => {
    const { container, rerender } = render(<RollingNumber value="199" />);
    rerender(<RollingNumber value="200" />);
    const order = [...container.querySelectorAll<HTMLElement>('[data-rolling="true"]')].map((el) =>
      el.style.getPropertyValue('--vl-rolling-order'),
    );
    expect(order).toEqual(['2', '1', '0']);
  });
  it('uses a custom label', () => {
    const { container } = render(<RollingNumber value="—" label="hidden" />);
    expect(container.querySelector('.vl-rolling-number__sr')?.textContent).toBe('hidden');
  });
});
