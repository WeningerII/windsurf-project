/**
 * Mutants & Masterminds 3e derived resolution math, cited against the Hero's
 * Handbook (DHH open content). These are the universal check-resolution
 * quantities the engine's point-buy/PL layer does not yet cover (attack DCs,
 * resistance DCs, the degrees-of-success rule, initiative, starting budget).
 * Pure functions so the math is available to the engine, sheet, and future
 * calculators alike. Pinned by src/__tests__/mam3eEngineMath.test.ts.
 */

/**
 * Universal degrees of success/failure (Hero's Handbook: "The Basics — Degrees
 * of Success and Failure"). A check that meets the DC succeeds by one degree,
 * gaining one further degree for every full 5 points above the DC; a check that
 * misses fails by one degree, losing one further degree for every full 5 points
 * below it. Returned signed: positive = degrees of success, negative = degrees
 * of failure. Drives attack, skill, and resistance resolution alike.
 */
export function mam3eDegreesOfSuccess(checkTotal: number, dc: number): number {
  if (checkTotal >= dc) return 1 + Math.floor((checkTotal - dc) / 5);
  return -(1 + Math.floor((dc - checkTotal) / 5));
}

/**
 * Degrees of FAILURE from a resistance margin (= DC − resistance check total).
 * A non-positive margin is a success (0 degrees of failure); otherwise it is the
 * magnitude of {@link mam3eDegreesOfSuccess}. This is the value that selects the
 * Damage condition band (1°→bruised, 2°→+dazed, 3°→+staggered, 4°→incapacitated)
 * the engine's Toughness track already applies.
 */
export function mam3eDegreesOfFailure(margin: number): number {
  if (margin <= 0) return 0;
  return 1 + Math.floor(margin / 5);
}

/**
 * Difficulty of an attack check (Hero's Handbook: Attack Checks). An attack hits
 * when `d20 + attack bonus` meets `10 + the target's active defense` (Dodge vs
 * ranged, Parry vs close).
 */
export function mam3eAttackDC(activeDefense: number): number {
  return 10 + activeDefense;
}

/** True when an attack check total meets or beats the active-defense DC. */
export function mam3eAttackHits(attackTotal: number, activeDefense: number): boolean {
  return attackTotal >= mam3eAttackDC(activeDefense);
}

/**
 * Toughness resistance DC against the Damage effect (Hero's Handbook: Damage) —
 * 15 + the effect's damage rank. The defender's Toughness check is compared to
 * this; the shortfall feeds {@link mam3eDegreesOfFailure} and the condition track.
 */
export function mam3eDamageResistanceDC(damageRank: number): number {
  return 15 + damageRank;
}

/**
 * Initiative bonus (Hero's Handbook: Initiative) — Agility, plus +4 per rank of
 * the Improved Initiative advantage.
 */
export function mam3eInitiative(agility: number, improvedInitiativeRank = 0): number {
  return agility + 4 * Math.max(0, Math.floor(improvedInitiativeRank));
}

/**
 * Starting power-point budget (Hero's Handbook: Power Level) — 15 × the series
 * power level.
 */
export function mam3eStartingPowerPoints(powerLevel: number): number {
  return 15 * Math.max(0, Math.floor(powerLevel));
}
