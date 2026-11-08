import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Veil } from '../ui/veil';

describe('Veil', () => {
  it('hides the content behind an accessible name and makes it inert', () => {
    render(
      <Veil label="Hidden: no access to finances" badge="No access to finances" cover={<span data-testid="dust" />}>
        <button type="button">Revenue 120 000</button>
      </Veil>,
    );
    const veil = screen.getByRole('img', { name: 'Hidden: no access to finances' });
    const content = veil.querySelector('.vl-veil__content');
    expect(content).toHaveAttribute('aria-hidden', 'true');
    expect(content).toHaveAttribute('inert');
    expect(screen.getByTestId('dust')).toBeInTheDocument();
    expect(veil).toHaveTextContent('No access to finances');
  });
});
