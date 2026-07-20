/**
 * Turn declared quantities + their computed values into render-ready rows for a
 * generic sheet section. UI-agnostic: returns an `icon` NAME (resolved by the
 * sheet layer) and pre-formatted text, so the rules layer imports no components.
 */
import type { DerivedQuantitySpec } from './types';

export interface PresentedDerivedQuantity {
  id: string;
  label: string;
  /** Icon name for the sheet layer to resolve (e.g. a lucide-react export). */
  icon?: string;
  /** Formatted value text (spec `format` applied, else the raw number). */
  text: string;
  hint?: string;
}

/**
 * Select the quantities that declare a `display` and (when a `visible`
 * predicate is present) currently apply, formatting each value. Falls back to
 * recomputing from `system` when an id is absent from the stored `derived` map
 * (e.g. a legacy document prepared before the quantity existed).
 */
export function presentDerivedQuantities<TSystem>(
  specs: ReadonlyArray<DerivedQuantitySpec<TSystem>>,
  system: TSystem,
  derived: Record<string, number> | undefined
): PresentedDerivedQuantity[] {
  const rows: PresentedDerivedQuantity[] = [];
  for (const spec of specs) {
    const display = spec.display;
    if (!display) continue;
    if (display.visible && !display.visible(system)) continue;
    const value = derived?.[spec.id] ?? spec.compute(system);
    rows.push({
      id: spec.id,
      label: display.label,
      icon: display.icon,
      text: display.format ? display.format(value) : String(value),
      hint: display.hint,
    });
  }
  return rows;
}
