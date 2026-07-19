/**
 * Level-scaling shapes — the shared `compute` building blocks for derived
 * quantities that grow with level.
 *
 * A survey of the seven systems found scaling is NOT one shape: it comes in
 * (at least) three genuinely different forms, so this is a small library of
 * shapes rather than one primitive — deduping within a shape while keeping the
 * per-system divergence first-class (a PF2e `level + const` must never be forced
 * into a 3.5e `floor(level × ¾)` mould):
 *
 *   - breakpoints  — piecewise-constant, stepping up at level thresholds
 *                    (Daggerheart tier 2/5/8; 5e cantrip dice 5/11/17).
 *   - linearRate   — `floor(level × numerator / denominator) + offset`
 *                    (3.5e/PF1e BAB full/¾/half and good/poor saves).
 *   - levelPlus    — `level + bonus` (PF2e proficiency = level + rank bonus).
 *
 * Each is cited where it is consumed. Formulas here are RAW arithmetic; the
 * system-specific thresholds/rates live at the call site as data.
 */

/**
 * Piecewise-constant step. Starts at `base` and, walking the ascending
 * `[minLevel, value]` table, adopts each entry's value once `level` reaches its
 * `minLevel` (later entries win). E.g. Daggerheart tier:
 * `breakpoints(level, [[2, 2], [5, 3], [8, 4]], 1)`.
 */
export function breakpoints(
  level: number,
  table: ReadonlyArray<readonly [minLevel: number, value: number]>,
  base: number
): number {
  let result = base;
  for (const [minLevel, value] of table) {
    if (level >= minLevel) {
      result = value;
    }
  }
  return result;
}

/**
 * Linear rate: `floor(level × numerator / denominator) + offset`. Covers d20
 * BAB (full = 1/1, three-quarter = 3/4, half = 1/2, offset 0) and base saves
 * (good = 1/2 offset 2, poor = 1/3 offset 0).
 */
export function linearRate(
  level: number,
  numerator: number,
  denominator: number,
  offset = 0
): number {
  return Math.floor((level * numerator) / denominator) + offset;
}

/**
 * Level-additive scaling: `level + bonus`. PF2e's signature shape — a trained+
 * proficiency total is the character's level plus the rank's flat bonus.
 */
export function levelPlus(level: number, bonus: number): number {
  return level + bonus;
}
