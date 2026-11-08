import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { RollingNumber } from '../ui/rolling-number';
import { useFormat } from '../theme/provider';

import './rolling-number.stories.css';

function RollingDemo({ step, every }: { readonly step: number; readonly every: number }) {
  const fmt = useFormat();
  const [n, setN] = useState(12840);
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + Math.round(step * (0.5 + Math.random()))), every);
    return () => clearInterval(id);
  }, [step, every]);
  return (
    <div className="sb-rolling">
      <span>
        <RollingNumber value={n} />
      </span>
      <span>
        <RollingNumber value={`${fmt.number(n * 37)} ₽`} />
      </span>
      <span>
        <RollingNumber value={fmt.percent((n % 1000) / 10, 1)} />
      </span>
    </div>
  );
}

const meta = {
  title: 'Core/RollingNumber',
  component: RollingDemo,
  args: { step: 7, every: 2200 },
} satisfies Meta<typeof RollingDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A number rolls on digit wheels; a ready string slides in only the changed characters. Reduced motion: instant. */
export const Live: Story = {};
