/**
 * Pathfinder 1e derived progression and survival math, cited against the Core
 * Rulebook (OGC). These quantities differ from D&D 3.5e (which uses a −10 death
 * threshold, a feat every three levels, and a Concentration skill), so they live
 * apart from src/systems/shared/d20-helpers.ts. Pure functions; pinned by
 * src/__tests__/d20LegacyEngineMath.test.ts.
 */

/**
 * Concentration check DC to cast defensively (CRB: Concentration) — 15 + twice
 * the spell's level. The check itself is d20 + caster level + casting-ability
 * modifier.
 */
export function pf1eConcentrationDCDefensive(spellLevel: number): number {
  return 15 + 2 * spellLevel;
}

/**
 * Concentration check DC to keep a spell while taking damage (CRB:
 * Concentration) — 10 + damage taken + the spell's level.
 */
export function pf1eConcentrationDCDamage(damageTaken: number, spellLevel: number): number {
  return 10 + Math.max(0, damageTaken) + spellLevel;
}

export type Pf1eHpState = 'healthy' | 'disabled' | 'dying' | 'dead';

/**
 * Hit-point state (CRB: Injury and Death): above 0 is healthy; exactly 0 is
 * disabled; below 0 but above −Constitution is dying (unconscious); at or below
 * a negative total equal to the creature's Constitution score, it is dead.
 */
export function pf1eHpState(currentHp: number, constitution: number): Pf1eHpState {
  if (currentHp <= -Math.max(0, constitution)) return 'dead';
  if (currentHp < 0) return 'dying';
  if (currentHp === 0) return 'disabled';
  return 'healthy';
}

/**
 * Feats gained from level alone (CRB: Character Advancement) — one at 1st level
 * and one at every odd level thereafter, i.e. ceil(level / 2). Racial and class
 * bonus feats are added separately.
 */
export function pf1eFeatsFromLevel(level: number): number {
  return Math.ceil(Math.max(0, Math.floor(level)) / 2);
}
