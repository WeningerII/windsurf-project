/**
 * Pathfinder 2e build-legality validator.
 *
 * Pure + synchronous: reads only fields already present on a prepared
 * `Pf2eDataModel` (baseAttributes, level, and the proficiency maps). Encodes
 * two OGC-citable build caps as one-directional flags, mirroring the mam3e
 * PL-cap idiom (compute value → compare to limit → push a violation).
 *
 * Rules:
 *   - Ability score creation cap (PF2e CRB, Character Creation — Ability
 *     Scores): at 1st level a starting ability score cannot exceed 18. The cap
 *     is checked only at level 1, because later ability boosts legitimately
 *     carry scores past 18.
 *   - Proficiency total budget (PF2e CRB, Proficiency): a proficiency bonus is
 *     `level + tier bonus` (0 for untrained), so no proficiency's total may
 *     exceed `level + tier bonus`. This level-plus-tier budget is the PF2e
 *     defining rule and has no analogue in the flat-BAB d20 systems.
 */
import type {
  Pf2eDataModel,
  Pf2eProficiency,
  Pf2eProficiencyTier,
} from '../../systems/pf2e/data-model';
import type { BuildLegalityResult, BuildViolation } from './types';

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

/** PF2e CRB: starting ability scores cannot exceed 18 at 1st level. */
const PF2E_LEVEL1_ABILITY_MAX = 18;

/** PF2e CRB: proficiency tier bonuses (untrained adds no level). */
const TIER_BONUS: Record<Pf2eProficiencyTier, number> = {
  untrained: 0,
  trained: 2,
  expert: 4,
  master: 6,
  legendary: 8,
};

export function validatePf2eBuild(system: Pf2eDataModel, _systemId?: string): BuildLegalityResult {
  const violations: BuildViolation[] = [];
  const characterLevel = system.level;

  // --- Ability score creation cap (≤ 18 at level 1) ---
  if (characterLevel <= 1) {
    const abilityScoreCap = PF2E_LEVEL1_ABILITY_MAX;
    for (const key of ABILITY_KEYS) {
      const abilityScoreValue = system.baseAttributes[key] ?? 10;
      if (abilityScoreValue > abilityScoreCap) {
        violations.push({
          rule: 'pf2e.L9.ability-score-cap',
          label: `Ability score (${key})`,
          value: abilityScoreValue,
          limit: abilityScoreCap,
        });
      }
    }
  }

  // --- Proficiency total budget (≤ level + tier bonus; untrained budget 0) ---
  const proficiencies: Array<{ label: string; prof: Pf2eProficiency }> = [];
  for (const [id, prof] of Object.entries(system.skillProficiencies)) {
    proficiencies.push({ label: `Skill (${id})`, prof });
  }
  for (const [id, prof] of Object.entries(system.loreProficiencies)) {
    proficiencies.push({ label: `Lore (${id})`, prof });
  }
  proficiencies.push({ label: 'Fortitude', prof: system.saveProficiencies.fortitude });
  proficiencies.push({ label: 'Reflex', prof: system.saveProficiencies.reflex });
  proficiencies.push({ label: 'Will', prof: system.saveProficiencies.will });
  proficiencies.push({ label: 'Perception', prof: system.perceptionProficiency });
  if (system.classDcProficiency) {
    proficiencies.push({ label: 'Class DC', prof: system.classDcProficiency });
  }
  for (const [id, prof] of Object.entries(system.armorProficiencies)) {
    proficiencies.push({ label: `Armor (${id})`, prof });
  }
  for (const [id, prof] of Object.entries(system.weaponProficiencies)) {
    proficiencies.push({ label: `Weapon (${id})`, prof });
  }

  for (const { label, prof } of proficiencies) {
    const proficiencyBudget =
      prof.tier === 'untrained' ? 0 : characterLevel + TIER_BONUS[prof.tier];
    const proficiencyTotalValue = prof.total;
    if (proficiencyTotalValue > proficiencyBudget) {
      violations.push({
        rule: 'pf2e.L9.proficiency-budget',
        label: `Proficiency ${label}`,
        value: prof.total,
        limit: proficiencyBudget,
      });
    }
  }

  return { legal: violations.length === 0, violations };
}
