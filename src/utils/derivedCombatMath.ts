/**
 * Canonical RAW formulas for combat / skill / physical derived quantities that
 * the per-system engines did not previously compute. Pure, system-tagged, and
 * test-pinned (same pattern as compute5eAC / baseSave / classBAB).
 */

// ─── D&D 3.5e / Pathfinder 1e ─────────────────────────────────────────────

/** Iterative attack bonuses for a full attack: extra attacks at BAB +6/+11/+16. */
export function iterativeAttackBonuses(bab: number): number[] {
  const bonuses = [bab];
  if (bab >= 6) bonuses.push(bab - 5);
  if (bab >= 11) bonuses.push(bab - 10);
  if (bab >= 16) bonuses.push(bab - 15);
  return bonuses;
}

/** Skill synergy: +2 to a related skill when you have 5+ ranks in the source skill. */
export function dnd35eSynergyBonus(relatedSkillRanks: number): number {
  return relatedSkillRanks >= 5 ? 2 : 0;
}

/**
 * 3.5e skill-synergy targets: each listed source skill grants +2 to the keyed
 * skill at 5+ ranks, and multiple sources stack. Only the SRD's UNCONDITIONAL
 * core synergies are listed — conditional "to do X" synergies (Use Rope → Climb
 * *with a rope*, Spellcraft → Use Magic Device *for scrolls*, Search → Survival
 * *to track*, Bluff → Disguise *to act in character*) stay manual rather than be
 * applied as a flat bonus, per the repo's no-fake-automation rule. Knowledge
 * synergies are omitted because the 3.5e model collapses Knowledge into a single
 * skill, so the granting subtype is unknown.
 */
const DND35E_SYNERGY_SOURCES: Record<string, readonly string[]> = {
  balance: ['tumble'],
  jump: ['tumble'],
  tumble: ['jump'],
  diplomacy: ['bluff', 'sense-motive'],
  intimidate: ['bluff'],
  'sleight-of-hand': ['bluff'],
  ride: ['handle-animal'],
};

/** Total 3.5e synergy bonus to `skillId` from 5+ ranks in its unconditional sources. */
export function dnd35eSkillSynergyTotal(
  skillId: string,
  skillRanks: Record<string, number>
): number {
  const sources = DND35E_SYNERGY_SOURCES[skillId];
  if (!sources) return 0;
  return sources.reduce((sum, sourceId) => sum + dnd35eSynergyBonus(skillRanks[sourceId] ?? 0), 0);
}

/** Max skill ranks: class skill = level + 3; cross-class = floor((level + 3) / 2). */
export function dnd35eMaxSkillRanks(level: number, isClassSkill: boolean): number {
  return isClassSkill ? level + 3 : Math.floor((level + 3) / 2);
}

/** PF1e max skill ranks = character level (class skills add +3 to the bonus, not the cap). */
export function pf1eMaxSkillRanks(level: number): number {
  return level;
}

/** A PF1e combat maneuver succeeds when the CMB check result meets or beats the target CMD. */
export function pf1eManeuverSucceeds(cmbCheckTotal: number, targetCMD: number): boolean {
  return cmbCheckTotal >= targetCMD;
}

/**
 * SRD 3.5e / PF1e critical confirmation: a natural threat is only a critical hit
 * if a second attack roll — the confirmation roll, made with the same attack
 * bonus — also meets or beats the target's AC. Returns whether it confirms.
 * (Unlike 5e, where a natural 20 auto-crits with no confirmation.)
 */
export function d20CriticalConfirmed(confirmationTotal: number, armorClass: number): boolean {
  return confirmationTotal >= armorClass;
}

/**
 * SRD 3.5e / PF1e confirmed-critical damage: the weapon's normal damage is
 * multiplied by its critical multiplier (×2 default; ×3/×4 for some weapons).
 * Extra dice from special abilities (sneak attack, flaming burst, …) are added
 * once and NOT multiplied — they ride through `unmultipliedExtra`.
 */
export function d20CriticalDamage(
  normalDamage: number,
  multiplier: number,
  unmultipliedExtra = 0
): number {
  return normalDamage * Math.max(1, Math.floor(multiplier)) + unmultipliedExtra;
}

// ─── D&D 5e ────────────────────────────────────────────────────────────────

/** Barbarian Unarmored Defense = 10 + Dex mod + Con mod (no armor). */
export function dnd5eUnarmoredDefenseBarbarian(dexMod: number, conMod: number): number {
  return 10 + dexMod + conMod;
}

/** Monk Unarmored Defense = 10 + Dex mod + Wis mod (no armor, no shield). */
export function dnd5eUnarmoredDefenseMonk(dexMod: number, wisMod: number): number {
  return 10 + dexMod + wisMod;
}

// ─── Pathfinder 2e ───────────────────────────────────────────────────────

/** Multiple attack penalty for the n-th attack this turn (agile reduces it). */
export function pf2eMultipleAttackPenalty(attackNumber: number, agile: boolean): number {
  if (attackNumber <= 1) return 0;
  if (attackNumber === 2) return agile ? -4 : -5;
  return agile ? -8 : -10;
}

/** Striking rune weapon damage-dice count: none 1, striking 2, greater 3, major 4. */
export function pf2eStrikingDice(rune: 'none' | 'striking' | 'greater' | 'major'): number {
  return { none: 1, striking: 2, greater: 3, major: 4 }[rune];
}

/** Bulk limits: encumbered above Str mod + 5; maximum at Str mod + 10. */
export function pf2eBulkLimits(strMod: number): { encumbered: number; max: number } {
  return { encumbered: strMod + 5, max: strMod + 10 };
}

/** Cantrips and auto-heightened spells scale to half the caster's level, rounded up. */
export function pf2eAutoHeightenRank(characterLevel: number): number {
  return Math.ceil(characterLevel / 2);
}

// ─── Daggerheart ──────────────────────────────────────────────────────────

/** Weapon damage rolls a number of dice equal to proficiency (the damage-dice multiplier). */
export function daggerheartDamageDiceCount(proficiency: number): number {
  return Math.max(1, proficiency);
}
