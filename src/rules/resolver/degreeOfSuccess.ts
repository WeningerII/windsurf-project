/**
 * PF2e's universal degree-of-success engine.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). Pathfinder 2e resolves
 * attacks, saving throws, AND skill checks with one rule (CRB p.445): roll d20 +
 * bonus, compare the total to the DC for a degree, then a natural 20 steps the
 * result one degree better and a natural 1 steps it one degree worse. Extracting
 * it here lets the attack, save, and check resolvers share the exact same math
 * without an import cycle (this module depends on nothing else in the resolver).
 */

/** The four PF2e degrees of success, best to worst when indexed by step 3→0. */
export type DegreeOfSuccess = 'critical-success' | 'success' | 'failure' | 'critical-failure';

const STEP_TO_DEGREE: readonly DegreeOfSuccess[] = [
  'critical-failure',
  'failure',
  'success',
  'critical-success',
];

/**
 * PF2e degree of success (CRB p.445): beat the DC by 10+ → critical success;
 * meet the DC → success; miss by ≤9 → failure; miss by 10+ → critical failure.
 * A natural 20 improves the result one degree, a natural 1 worsens it one degree.
 */
export function pf2eDegreeOfSuccess(roll: number, total: number, dc: number): DegreeOfSuccess {
  let step = total >= dc + 10 ? 3 : total >= dc ? 2 : total <= dc - 10 ? 0 : 1;
  if (roll === 20) step = Math.min(3, step + 1);
  else if (roll === 1) step = Math.max(0, step - 1);
  return STEP_TO_DEGREE[step]!; // step is clamped to 0..3
}
