import type { Meta, StoryObj } from '@storybook/react';

import { useLocale, Veil } from '..';

import './veil.stories.css';

const meta: Meta = { title: 'Core/Veil' };
export default meta;

const RU = { label: 'Скрыто: нет доступа к финансовой отчётности', badge: 'Нет доступа к финансам' };
const EN = { label: 'Hidden: no access to financial reports', badge: 'No access to finances' };

function Demo() {
  const locale = useLocale();
  const t = locale.code.startsWith('ru') ? RU : EN;
  return (
    <div className="sb-veil">
      <Veil label={t.label} badge={t.badge} cover={<span className="sb-veil__dust" />}>
        <dl className="sb-veil__rows">
          {[
            ['Dance floor', '412 000 ₽'],
            ['Balcony', '198 000 ₽'],
            ['VIP', '126 000 ₽'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Veil>
    </div>
  );
}

/** A block hidden from viewers without access: the cover is the consumer's (particles, a spoiler). */
export const NoAccess: StoryObj = { render: () => <Demo /> };
