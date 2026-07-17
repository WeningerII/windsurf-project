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
 * Inverse of {@link dnd35eXpForLevel}: the highest character level (1–20) whose
 * XP threshold the given total XP has reached, i.e. the largest L with
 * dnd35eXpForLevel(L) ≤ xp. Level 1 costs 0 XP, so any non-negative total is at
 * least level 1; the result is capped at the 20th-level table entry. Because the
 * XP table is monotonic, a linear scan suffices. 3.5e-specific — Pathfinder 1e
 * uses a different XP track, so this must not drive a PF1e sheet.
 */
export function dnd35eLevelForXp(xp: number): number {
  let level = 1;
  for (let l = 2; l <= 20; l += 1) {
    if (dnd35eXpForLevel(l) <= xp) {
      level = l;
    } else {
      break;
    }
  }
  return level;
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

/**
 * Concentration check DC to cast defensively (SRD 3.5: Concentration skill) —
 * 15 + the spell's level. The check is a Concentration skill check (d20 + ranks
 * + Con mod). (Distinct from PF1e's 15 + 2 × level.)
 */
export function dnd35eConcentrationDCDefensive(spellLevel: number): number {
  return 15 + spellLevel;
}

/**
 * Concentration check DC to keep a spell while taking damage (SRD 3.5) —
 * 10 + damage dealt + the spell's level.
 */
export function dnd35eConcentrationDCDamage(damageTaken: number, spellLevel: number): number {
  return 10 + Math.max(0, damageTaken) + spellLevel;
}

/**
 * Feats gained from level (SRD 3.5: Character Advancement) — one at 1st level
 * and one at every third level thereafter (1st, 3rd, 6th, 9th, …) = 1 +
 * floor(level / 3). Racial and class bonus feats are added separately.
 */
export function dnd35eFeatsFromLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 1 + Math.floor(l / 3);
}

/**
 * Ability score increases gained from level (SRD 3.5: Character Advancement) —
 * +1 to one ability at every fourth level (4th, 8th, 12th, …) = floor(level / 4).
 */
export function dnd35eAbilityIncreases(level: number): number {
  return Math.floor(Math.max(0, level) / 4);
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
