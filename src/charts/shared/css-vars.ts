/** CSS custom properties keyed by name: `{ '--vl-col': 3 }`. */
export type CssVarValues = Readonly<Record<`--${string}`, string | number>>;

/** A callback ref writing CSS custom properties on its element, in place of inline style objects. */
export function cssVars(vars: CssVarValues) {
  return (el: HTMLElement | SVGElement | null): void => {
    if (!el) return;
    for (const [name, value] of Object.entries(vars)) el.style.setProperty(name, String(value));
  };
}
