import { type ReactNode, useCallback } from 'react';

import { cx } from './cx';

export interface VeilProps {
  /** Accessible name of the hidden block: what is hidden and why. */
  readonly label: string;
  /** Layer drawn over the blurred content: particles, a spoiler, a pattern. Fills the block. */
  readonly cover?: ReactNode;
  /** Short note in a pill in the middle: "No access to finances". */
  readonly badge?: ReactNode;
  /** The real content; shown blurred, hidden from assistive tech and not focusable. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Hides a block the viewer may not see (amounts without finance access) while keeping its shape:
 * the content is blurred and inert, `cover` lies on top, `badge` explains why.
 */
export function Veil({ label, cover, badge, children, className }: VeilProps) {
  const inert = useCallback((el: HTMLDivElement | null) => {
    el?.setAttribute('inert', '');
  }, []);
  return (
    <div className={cx('vl-veil', className)} role="img" aria-label={label}>
      <div ref={inert} className="vl-veil__content" aria-hidden="true">
        {children}
      </div>
      <div className="vl-veil__cover">
        {cover ? <div className="vl-veil__layer">{cover}</div> : null}
        {badge ? (
          <span className="vl-veil__badge">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}
