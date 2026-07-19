/**
 * Canonical RAW formulas for caster/derived quantities that the per-system
 * engines did not previously compute. These are pure, system-tagged functions
 * (the same pattern as compute5eAC / baseSave / classBAB) so each derived
 * quantity has one verified implementation. Formulas are SRD/OGC RAW.
 */
import { breakpoints } from './scaling';

// ─── D&D 5e (SRD 5.1 / 5.2) ───────────────────────────────────────────────

/** Spell save DC = 8 + proficiency bonus + spellcasting ability modifier. */
export function dnd5eSpellSaveDC(proficiencyBonus: number, abilityMod: number): number {
  return 8 + proficiencyBonus + abilityMod;
}

/** Spell attack bonus = proficiency bonus + spellcasting ability modifier. */
export function dnd5eSpellAttackBonus(proficiencyBonus: number, abilityMod: number): number {
  return proficiencyBonus + abilityMod;
}

/** Concentration save DC = max(10, floor(damage / 2)). */
export function dnd5eConcentrationDC(damageTaken: number): number {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export type Dnd5eSkillProficiency = 'none' | 'proficient' | 'expertise';

/** Passive Perception = 10 + Wis(Perception) modifier (proficiency/expertise applied). */
export function dnd5ePassivePerception(
  wisMod: number,
  proficiencyBonus: number,
  proficiency: Dnd5eSkillProficiency
): number {
  const profPart =
    proficiency === 'expertise'
      ? proficiencyBonus * 2
      : proficiency === 'proficient'
        ? proficiencyBonus
        : 0;
  return 10 + wisMod + profPart;
}

/** Cantrip damage-dice tier: increases at character levels 5, 11, and 17. */
const DND5E_CANTRIP_SCALE_BREAKPOINTS = [
  [5, 2],
  [11, 3],
  [17, 4],
] as const;
export function dnd5eCantripScaleTier(characterLevel: number): 1 | 2 | 3 | 4 {
  return breakpoints(characterLevel, DND5E_CANTRIP_SCALE_BREAKPOINTS, 1) as 1 | 2 | 3 | 4;
}

// ─── D&D 3.5e / Pathfinder 1e (d20 legacy) ────────────────────────────────

/** Spell save DC = 10 + spell level + casting ability modifier. */
export function d20LegacySpellSaveDC(spellLevel: number, abilityMod: number): number {
  return 10 + spellLevel + abilityMod;
}

// ─── Pathfinder 2e ────────────────────────────────────────────────────────

/**
 * Class DC / Spell DC = 10 + proficiency total + key/spell ability modifier,
 * where the proficiency total already folds in level + tier (see profTotal).
 */
export function pf2eClassOrSpellDC(proficiencyTotal: number, abilityMod: number): number {
  return 10 + proficiencyTotal + abilityMod;
}
