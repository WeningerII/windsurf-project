/**
 * Build-legality (Denominator B, layer L9) shared result types.
 *
 * A build-legality validator is PURE and SYNCHRONOUS: it reads only fields
 * already present on a prepared system data-model (the object produced by
 * `<Sys>Engine.prepareData(...).system`) and reports the character-build caps
 * and budgets it violates. The shape mirrors the in-engine cap idiom used by
 * the M&M 3e power-level checks (src/systems/mam3e/engine.ts): compute a value,
 * compare it to a limit, and push a `{ label, value, limit }` record when the
 * value exceeds the limit — here extended with a stable `rule` id so each
 * violation traces back to exactly one compute-register L9 row.
 */

/** One violated build cap/budget. `value` exceeded `limit` for `rule`. */
export interface BuildViolation {
  /** Stable rule id, e.g. "pf1e.L9.skill-max-ranks". */
  rule: string;
  /** Human-readable subject of the violation, e.g. "Skill ranks (stealth)". */
  label: string;
  /** The computed quantity that broke the cap. */
  value: number;
  /** The legal ceiling the quantity must not exceed. */
  limit: number;
}

/** Result of a build-legality pass. `legal === (violations.length === 0)`. */
export interface BuildLegalityResult {
  legal: boolean;
  violations: BuildViolation[];
}
