/**
 * D&D 3.5e build-legality validator.
 *
 * Pure + synchronous: reads only fields already present on a prepared
 * `Dnd35eDataModel` (skillRanks, classSkills, classLevels, level). Encodes two
 * SRD 3.5-citable build caps as one-directional flags, mirroring the mam3e
 * PL-cap idiom (compute value → compare to limit → push a violation).
 *
 * Rules:
 *   - Maximum skill ranks (SRD 3.5, Skills): the rank cap in a *class* skill is
 *     `character level + 3`; a *cross-class* skill caps at
 *     `floor((character level + 3) / 2)`. This class/cross-class split is the
 *     3.5e-specific rule (PF1e, by contrast, caps every skill at the character
 *     level — see legality/pf1e.ts).
 *   - Class-level accounting (SRD 3.5, advancement): the sum of class levels
 *     can never exceed the character's level.
 */
import type { Dnd35eDataModel } from '../../systems/dnd35e/data-model';
import type { BuildLegalityResult, BuildViolation } from './types';

export function validateDnd35eBuild(
  system: Dnd35eDataModel,
  _systemId?: string
): BuildLegalityResult {
  const violations: BuildViolation[] = [];
  const characterLevel = system.level;

  // SRD 3.5 (Skills): class skills cap at level + 3, cross-class at half that.
  const classSkillRankMax = characterLevel + 3;
  const crossClassRankMax = Math.floor((characterLevel + 3) / 2);

  // --- Maximum skill ranks (class vs cross-class) ---
  for (const [skillId, ranks] of Object.entries(system.skillRanks)) {
    const isClassSkill = system.classSkills.includes(skillId);
    const skillRankCap = isClassSkill ? classSkillRankMax : crossClassRankMax;
    const skillRankValue = ranks;
    if (skillRankValue > skillRankCap) {
      violations.push({
        rule: 'dnd35e.L9.skill-max-ranks',
        label: `Skill ranks (${skillId})`,
        value: ranks,
        limit: skillRankCap,
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
      rule: 'dnd35e.L9.class-level-sum',
      label: 'Sum of class levels',
      value: classLevelSum,
      limit: characterLevel,
    });
  }

  return { legal: violations.length === 0, violations };
}
