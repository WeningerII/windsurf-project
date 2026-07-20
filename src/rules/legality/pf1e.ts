/**
 * Pathfinder 1e build-legality validator.
 *
 * Pure + synchronous: reads only fields already present on a prepared
 * `Pf1eDataModel` (skillRanks, classLevels, level). Encodes two OGC-citable
 * build caps as one-directional flags, mirroring the mam3e PL-cap idiom
 * (compute value → compare to limit → push a violation).
 *
 * Rules:
 *   - Maximum skill ranks (PF1e CRB, Skills — Ranks): the rank cap for *every*
 *     skill is the character's level. Class skills add +3 to the bonus, not to
 *     the cap. This flat cap is the PF1e-specific rule and deliberately differs
 *     from the 3.5e class/cross-class split (see legality/dnd35e.ts).
 *   - Class-level accounting (PF1e CRB, Character Advancement): the sum of
 *     class levels can never exceed the character's level.
 */
import type { Pf1eDataModel } from '../../systems/pf1e/data-model';
import type { BuildLegalityResult, BuildViolation } from './types';

export function validatePf1eBuild(system: Pf1eDataModel, _systemId?: string): BuildLegalityResult {
  const violations: BuildViolation[] = [];
  const characterLevel = system.level;

  // PF1e CRB (Skills — Ranks): max ranks in any skill = character level.
  const skillRankLimit = characterLevel;

  // --- Maximum skill ranks (≤ character level) ---
  for (const [skillId, ranks] of Object.entries(system.skillRanks)) {
    const skillRankValue = ranks;
    if (skillRankValue > skillRankLimit) {
      violations.push({
        rule: 'pf1e.L9.skill-max-ranks',
        label: `Skill ranks (${skillId})`,
        value: ranks,
        limit: skillRankLimit,
      });
    }
  }

  // --- Class levels sum to character level (may not exceed it) ---
  let classLevelSum = 0;
  for (const cl of system.classLevels) {
    classLevelSum += cl.level;
  }
  const classLevelSumValue = classLevelSum;
  const characterLevelValue = characterLevel;
  if (classLevelSumValue > characterLevelValue) {
    violations.push({
      rule: 'pf1e.L9.class-level-sum',
      label: 'Sum of class levels',
      value: classLevelSum,
      limit: characterLevel,
    });
  }

  return { legal: violations.length === 0, violations };
}
