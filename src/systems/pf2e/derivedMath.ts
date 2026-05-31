/**
 * Pathfinder 2e derived survival and encounter math, cited against the Core
 * Rulebook (OGC). Fills two layers the compute register did not yet cover:
 * the dying / wounded / recovery death track (L8 — Hit Points, Healing, and
 * Dying) and the encounter-building XP math (L10 — Building Encounters). Pure
 * functions so the math is available to the engine, sheet, and future
 * encounter/economy calculators alike. Pinned by
 * src/__tests__/pf2eEngineMath.test.ts.
 */

/** PF2e four-step check outcome (matches the engine's RollResult degree). */
export type Pf2eDegree = 'critical-success' | 'success' | 'failure' | 'critical-failure';

// ── L8: Dying / Wounded / Recovery (CRB: Hit Points, Healing, and Dying) ─────

/**
 * Dying value gained on being knocked out (reduced to 0 HP). Base is 1, or 2 if
 * the triggering blow was a critical hit (or a critical failure on a save). The
 * character's current wounded value is added on top each time dying is gained.
 */
export function pf2eInitialDying(fromCriticalHit: boolean, wounded = 0): number {
  return (fromCriticalHit ? 2 : 1) + Math.max(0, Math.floor(wounded));
}

/** Recovery-check flat DC while dying: 10 + current dying value (CRB: Dying). */
export function pf2eRecoveryCheckDC(dying: number): number {
  return 10 + Math.max(0, Math.floor(dying));
}

/**
 * New dying value after a recovery check by degree of success: critical success
 * −2, success −1, failure +1, critical failure +2 (CRB: Dying). Floored at 0
 * (reaching 0 ends the dying condition).
 */
export function pf2eDyingAfterRecovery(dying: number, degree: Pf2eDegree): number {
  const delta =
    degree === 'critical-success' ? -2 : degree === 'success' ? -1 : degree === 'failure' ? 1 : 2;
  return Math.max(0, Math.floor(dying) + delta);
}

/** A creature dies when its dying value reaches the dying maximum (default 4). */
export function pf2eIsDead(dying: number, dyingMax = 4): boolean {
  return dying >= dyingMax;
}

/**
 * Wounded value after recovering from the dying condition (reaching dying 0):
 * wounded increases by 1 each time (CRB: Wounded).
 */
export function pf2eWoundedAfterRecovery(wounded: number): number {
  return Math.max(0, Math.floor(wounded)) + 1;
}

// ── L10: Encounter building (CRB: Building Encounters) ───────────────────────

/**
 * XP value of a single creature by its level relative to the party level (CRB
 * Table: XP Awards). Defined for −4..+4; below −4 a creature is too weak to
 * count toward the budget (0), and inputs above +4 clamp to the +4 value (the
 * table's maximum). Values verified against the open-content implementation.
 */
const CREATURE_XP_BY_LEVEL_DIFF = new Map<number, number>([
  [-4, 10],
  [-3, 15],
  [-2, 20],
  [-1, 30],
  [0, 40],
  [1, 60],
  [2, 80],
  [3, 120],
  [4, 160],
]);

export function pf2eCreatureXP(levelDifference: number): number {
  const diff = Math.trunc(levelDifference);
  if (diff < -4) return 0;
  if (diff > 4) return CREATURE_XP_BY_LEVEL_DIFF.get(4) ?? 0;
  return CREATURE_XP_BY_LEVEL_DIFF.get(diff) ?? 0;
}

// ── L3: attack rolls and Shield Block ───────────────────────────────────────

/**
 * Strike / spell attack roll modifier (CRB: Attack Rolls; Spell Attacks) — the
 * relevant ability modifier + proficiency total (level + tier) + any item bonus.
 * Pass the already-computed proficiency total (see profTotal); the multiple
 * attack penalty (pf2eMultipleAttackPenalty) is applied separately.
 */
export function pf2eAttackModifier(abilityMod: number, proficiency: number, itemBonus = 0): number {
  return abilityMod + proficiency + itemBonus;
}

/**
 * Damage taken after a Shield Block reaction (CRB: Raise a Shield / Shield
 * Block): reduce the incoming damage by the shield's Hardness, to a minimum of
 * 0. (The shield itself takes the remaining damage against its own HP.)
 */
export function pf2eShieldBlockDamage(damage: number, hardness: number): number {
  return Math.max(0, damage - Math.max(0, hardness));
}

/**
 * Hero Points a character has at the start of a session (CRB: Hero Points) — 1,
 * up to a maximum of 3 held at once.
 */
export const PF2E_HERO_POINTS_AT_SESSION_START = 1;
export const PF2E_HERO_POINTS_MAX = 3;

export type Pf2eThreat = 'trivial' | 'low' | 'moderate' | 'severe' | 'extreme';

const THREAT_MULTIPLIER: Readonly<Record<Pf2eThreat, number>> = {
  trivial: 0.5,
  low: 0.75,
  moderate: 1,
  severe: 1.5,
  extreme: 2,
};

/**
 * Encounter XP budget for a threat level and party size (CRB: Building
 * Encounters). The base budget is 20 XP per character (so 80 for the standard
 * four-character party), scaled by the threat multiplier and floored. At party
 * size 4 this reproduces the printed Table 10-1 budgets exactly: trivial 40,
 * low 60, moderate 80, severe 120, extreme 160.
 */
export function pf2eEncounterBudget(threat: Pf2eThreat, partySize = 4): number {
  const base = Math.max(0, Math.floor(partySize)) * 20;
  return Math.floor(base * THREAT_MULTIPLIER[threat]);
}
