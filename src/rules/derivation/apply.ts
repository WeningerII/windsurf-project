/**
 * Generic consumer of {@link DerivedQuantitySpec}s. One call in a system engine's
 * prepareData computes every declared quantity for that system, so the engine
 * never grows a hand-written line per quantity.
 */
import type { DerivedQuantitySpec } from './types';

/**
 * Compute every spec against the prepared `system` data, returning an id→value
 * map to store on `system.derived`. Pure: it mutates nothing and simply folds
 * each spec's `compute`.
 */
export function applyDerivedQuantities<TSystem>(
  system: TSystem,
  specs: ReadonlyArray<DerivedQuantitySpec<TSystem>>
): Record<string, number> {
  const derived: Record<string, number> = {};
  for (const spec of specs) {
    derived[spec.id] = spec.compute(system);
  }
  return derived;
}
