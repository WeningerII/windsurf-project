/**
 * PF2e degree of success (CRB p.445), shared between the sheet engine and the
 * grid-combat attack resolver: beat the DC by 10+ for a critical success,
 * miss it by 10+ for a critical failure, then a natural 20 upgrades the
 * degree one step and a natural 1 downgrades it one step.
 */

export type Pf2eDegreeOfSuccess = 'critical-failure' | 'failure' | 'success' | 'critical-success';

const DEGREE_ORDER: Pf2eDegreeOfSuccess[] = [
  'critical-failure',
  'failure',
  'success',
  'critical-success',
];

export function pf2eDegreeOfSuccess(total: number, dc: number, d20: number): Pf2eDegreeOfSuccess {
  let idx: number;
  if (total >= dc + 10) {
    idx = 3; // critical success
  } else if (total >= dc) {
    idx = 2; // success
  } else if (total <= dc - 10) {
    idx = 0; // critical failure
  } else {
    idx = 1; // failure
  }

  if (d20 === 20) idx = Math.min(3, idx + 1);
  else if (d20 === 1) idx = Math.max(0, idx - 1);

  return DEGREE_ORDER[idx];
}
