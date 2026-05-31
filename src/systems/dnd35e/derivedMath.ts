/**
 * D&D 3.5e derived progression and survival math, cited against SRD 3.5. Covers
 * quantities the shared d20 helpers don't: the XP-to-level table, the
 * massive-damage save, and the disabled/dying/dead Hit-Point track. These are
 * 3.5e-specific (Pathfinder 1e uses a different XP table and a −Con death
 * threshold), so they live apart from src/systems/shared/d20-helpers.ts. Pure
 * functions; pinned by src/__tests__/d20LegacyEngineMath.test.ts.
 */

/**
 * Total XP required to attain a character level (SRD 3.5: Character Advancement):
 * 500 × level × (level − 1), i.e. 1000 × the (level−1)th triangular number.
 * Level 1 = 0; level 2 = 1,000; level 5 = 10,000; level 20 = 190,000.
 */
export function dnd35eXpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 500 * l * (l - 1);
}

/**
 * Massive damage (SRD 3.5: Injury and Death): a single source dealing 50 or more
 * damage forces a DC 15 Fortitude save, on a failure of which the creature dies
 * regardless of its current hit points.
 */
export const DND35E_MASSIVE_DAMAGE_THRESHOLD = 50;
export const DND35E_MASSIVE_DAMAGE_SAVE_DC = 15;

export function dnd35eTriggersMassiveDamage(damage: number): boolean {
  return damage >= DND35E_MASSIVE_DAMAGE_THRESHOLD;
}

export type Dnd35eHpState = 'healthy' | 'disabled' | 'dying' | 'dead';

/**
 * Hit-point state (SRD 3.5: Injury and Death): above 0 is healthy; exactly 0 is
 * disabled (can take a single move or standard action); −1 to −9 is dying
 * (unconscious and losing 1 HP/round until stable); −10 or lower is dead.
 */
export function dnd35eHpState(currentHp: number): Dnd35eHpState {
  if (currentHp <= -10) return 'dead';
  if (currentHp < 0) return 'dying';
  if (currentHp === 0) return 'disabled';
  return 'healthy';
}
