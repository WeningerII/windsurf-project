/**
 * D&D 5e build-legality validator (covers BOTH the 2014 and 2024 editions).
 *
 * Pure + synchronous: reads only fields already present on a prepared
 * `Dnd5eDataModel` (baseAttributes, classLevels, level). Encodes two
 * SRD-citable build caps as one-directional flags, mirroring the mam3e
 * PL-cap idiom (compute value → compare to limit → push a violation).
 *
 * Rules (both editions):
 *   - Ability score cap: an Ability Score Improvement can never raise a score
 *     above 20 (SRD 5.1 & SRD 5.2, Ability Scores).
 *   - Class-level accounting: the sum of class levels can never exceed the
 *     character's level (SRD Multiclassing / advancement).
 *
 * The `systemId` selects the edition so each edition's compute-register L9 row
 * anchors a distinct comparison line; the caps happen to be identical across
 * the two editions (both keep the maximum at 20), which is a real edition
 * parity rather than a templated one.
 */
import type { Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import type { BuildLegalityResult, BuildViolation } from './types';

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

/** SRD 5.1 / SRD 5.2: an ability score cannot be raised above 20. */
const DND5E_ABILITY_SCORE_MAX = 20;

export function validateDnd5eBuild(system: Dnd5eDataModel, systemId?: string): BuildLegalityResult {
  const violations: BuildViolation[] = [];
  const is2024 = systemId === 'dnd-5e-2024' || systemId === 'dnd5e-2024';

  const abilityCap = DND5E_ABILITY_SCORE_MAX;
  const characterLevel = system.level;

  let classLevelSum = 0;
  for (const cl of system.classLevels) {
    classLevelSum += cl.level;
  }

  // --- Ability score cap (≤ 20) ---
  for (const key of ABILITY_KEYS) {
    const score = system.baseAttributes[key] ?? 10;
    if (is2024) {
      const abilityScoreValue2024 = score;
      const abilityScoreCap2024 = abilityCap;
      if (abilityScoreValue2024 > abilityScoreCap2024) {
        violations.push({
          rule: 'dnd5e2024.L9.ability-score-cap',
          label: `Ability score (${key})`,
          value: score,
          limit: abilityCap,
        });
      }
    } else {
      const abilityScoreValue2014 = score;
      const abilityScoreCap2014 = abilityCap;
      if (abilityScoreValue2014 > abilityScoreCap2014) {
        violations.push({
          rule: 'dnd5e2014.L9.ability-score-cap',
          label: `Ability score (${key})`,
          value: score,
          limit: abilityCap,
        });
      }
    }
  }

  // --- Class levels sum to character level (may not exceed it) ---
  if (is2024) {
    const classLevelSumValue2024 = classLevelSum;
    const characterLevelValue2024 = characterLevel;
    if (classLevelSumValue2024 > characterLevelValue2024) {
      violations.push({
        rule: 'dnd5e2024.L9.class-level-sum',
        label: 'Sum of class levels',
        value: classLevelSum,
        limit: characterLevel,
      });
    }
  } else {
    const classLevelSumValue2014 = classLevelSum;
    const characterLevelValue2014 = characterLevel;
    if (classLevelSumValue2014 > characterLevelValue2014) {
      violations.push({
        rule: 'dnd5e2014.L9.class-level-sum',
        label: 'Sum of class levels',
        value: classLevelSum,
        limit: characterLevel,
      });
    }
  }

  return { legal: violations.length === 0, violations };
}
