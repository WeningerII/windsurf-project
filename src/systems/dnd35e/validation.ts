/**
 * D&D 3.5e SystemValidator (registry opt-in, RFC 002 "model proposes,
 * validators decide" surface).
 *
 * Checks are derived from 3.5e's OWN loader-backed data and SRD 3.5 rules
 * text — not copied from the 5e validator's check list:
 *
 *   - class/prestige-class ids must exist in the loader catalog
 *     (`loadClassesForSystem('dnd-3.5e')` = 11 base classes + the product
 *     prestige catalog);
 *   - prestige-class structure: SRD 3.5 prestige classes are 10-level
 *     progressions, and their entry requirements (min skill ranks, BAB,
 *     casting ability) can never be met at character level 1, so prestige
 *     levels without any base-class level are flagged;
 *   - level bounds (the non-epic SRD tables cover levels 1-20) and hit-die
 *     rolls vs the class's own hit die;
 *   - spell ids must resolve in the canonical 610-spell catalog, honoring
 *     the catalog's alias table (class-stub variants like
 *     'dispel-magic-druid-35e' resolve to their canonical entry);
 *   - skill ranks must be non-negative half-rank increments (SRD 3.5 Skills:
 *     cross-class skills accrue ranks in halves);
 *   - ability scores are integers >= 1 (SRD 3.5 has no upper cap; 0 is not a
 *     legal build value);
 *   - Vancian slot totals are numerically sane (used <= total);
 *   - wizard specialty school must be one of the eight SRD arcane schools;
 *   - document-carried feat provenance is checked against the strict
 *     open-content policy ('SRD 3.5' only) and the loader feat catalog.
 *
 * Build-legality caps (max skill ranks class/cross-class, class-level sum)
 * are NOT reimplemented here: they come from the mutation-proven
 * `validateDnd35eBuild` (src/rules/legality/dnd35e.ts), surfaced as
 * warning-severity issues.
 *
 * Deliberately NOT validated (accepted manual boundaries, see docs/STATUS.md):
 * Vancian prepared-slot assignment (which spells fill which slots) and
 * spontaneous cure/inflict conversion.
 *
 * Validators annotate; they never mutate documents or block edits.
 */
import { isDnd35eProductPrestigeClassId } from '../../data/dnd/3.5e/prestige-classes/productCatalog';
import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import { validateDnd35eBuild } from '../../rules/legality/dnd35e';
import type { CharacterClass } from '../../types/character-options/classes';
import type { CharacterDocument } from '../../types/core/document';
import {
  loadClassesForSystem,
  loadFeatsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { isOpenContentCompliant } from '../../utils/openContentPolicy';
import { resolveSpellIdAlias } from '../../utils/spellCatalog';
import { D20_ARCANE_SCHOOLS } from '../shared/d20LegacySpellcasting';
import type { Dnd35eClassLevel, Dnd35eDataModel, Dnd35eFeat } from './data-model';

const DND35E_SYSTEM_ID = 'dnd-3.5e';
const MIN_CHARACTER_LEVEL = 1;
const MAX_CHARACTER_LEVEL = 20;

type Dnd35eValidationData = {
  classesById: Map<string, CharacterClass>;
  speciesIds: Set<string>;
  featIds: Set<string>;
  spellIds: Set<string>;
  spellIdAliases: Record<string, string>;
};

export function createDnd35eValidator(): SystemValidator<Dnd35eDataModel> {
  return {
    validateDocument: (document, context) => validateDnd35eDocument(document, context),
  };
}

async function validateDnd35eDocument(
  document: CharacterDocument<Dnd35eDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const validationData = await loadValidationData();
  const system = document.system;

  if (document.systemId !== DND35E_SYSTEM_ID) {
    addIssue(issues, context, {
      code: 'dnd35e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${DND35E_SYSTEM_ID} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  validateCharacterLevel(issues, context, system.level);
  validateClassLevels(issues, context, system, validationData);
  validateSpecies(issues, context, system, validationData);
  validateAbilityScores(issues, context, system.baseAttributes);
  validateSkillRanks(issues, context, system.skillRanks);
  validateFeats(issues, context, system.feats, validationData);
  validateSpellcasting(issues, context, system, validationData);
  appendBuildLegalityIssues(issues, context, system);

  return { issues };
}

async function loadValidationData(): Promise<Dnd35eValidationData> {
  const [classes, species, feats, spells, spellModule] = await Promise.all([
    loadClassesForSystem(DND35E_SYSTEM_ID),
    loadSpeciesForSystem(DND35E_SYSTEM_ID),
    loadFeatsForSystem(DND35E_SYSTEM_ID),
    loadSpellsForSystem(DND35E_SYSTEM_ID),
    // The alias table is a catalog artifact (class-stub duplicate collapse),
    // exported alongside the spell data rather than through a loader.
    import('../../data/dnd/3.5e/spells'),
  ]);

  return {
    classesById: new Map(classes.map((classData) => [classData.id, classData])),
    speciesIds: new Set(species.map((entry) => entry.id)),
    featIds: new Set(feats.map((entry) => entry.id)),
    spellIds: new Set(spells.map((entry) => entry.id)),
    spellIdAliases: spellModule.spellIdAliases,
  };
}

function validateCharacterLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  level: number
) {
  // SRD 3.5 character advancement tables cover levels 1-20; the epic SRD
  // (level 21+) is outside the product's shipped data.
  if (!isIntegerInRange(level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
    addIssue(issues, context, {
      code: 'dnd35e-invalid-level',
      severity: 'error',
      path: 'system.level',
      message: 'Character level must be an integer from 1 through 20 (non-epic SRD 3.5).',
      recoverable: true,
      details: { value: level },
    });
  }
}

function validateClassLevels(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Dnd35eDataModel,
  validationData: Dnd35eValidationData
) {
  const classLevels = system.classLevels;

  if (!Array.isArray(classLevels) || classLevels.length === 0) {
    addIssue(issues, context, {
      code: 'dnd35e-no-class-levels',
      severity: 'warning',
      path: 'system.classLevels',
      message: 'No class levels are selected yet.',
      recoverable: true,
    });
    return;
  }

  let totalClassLevel = 0;
  let hasBaseClassLevel = false;
  let hasPrestigeClassLevel = false;
  const seenClassIds = new Set<string>();

  classLevels.forEach((classLevel, index) => {
    const path = `system.classLevels.${index}`;
    const classData = validationData.classesById.get(classLevel.classId);
    const isPrestige = isDnd35eProductPrestigeClassId(classLevel.classId);

    if (!classData) {
      addIssue(issues, context, {
        code: 'dnd35e-unknown-class',
        severity: 'error',
        path: `${path}.classId`,
        message: `Class '${classLevel.classId}' is not in the loader-backed 3.5e class catalog (base classes + SRD prestige classes).`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }

    if (seenClassIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'dnd35e-duplicate-class',
        severity: 'warning',
        path: `${path}.classId`,
        message: `Class '${classLevel.classId}' appears more than once.`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }
    seenClassIds.add(classLevel.classId);

    if (!isIntegerInRange(classLevel.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
      addIssue(issues, context, {
        code: 'dnd35e-invalid-class-level',
        severity: 'error',
        path: `${path}.level`,
        message: 'Class level must be an integer from 1 through 20.',
        recoverable: true,
        details: { value: classLevel.level },
      });
    } else {
      totalClassLevel += classLevel.level;
      if (classData) {
        if (isPrestige) {
          hasPrestigeClassLevel = true;
          validatePrestigeLevelCap(issues, context, classLevel, classData, path);
        } else {
          hasBaseClassLevel = true;
        }
      }
    }

    validateHitDieRolls(issues, context, classLevel, classData, path);
  });

  // SRD 3.5 (Prestige Classes): a character must meet a prestige class's
  // requirements before taking its first level. Every SRD prestige class
  // requires skill ranks, BAB, or caster levels no 1st-level character can
  // have, so prestige levels always follow at least one base-class level.
  if (hasPrestigeClassLevel && !hasBaseClassLevel) {
    addIssue(issues, context, {
      code: 'dnd35e-prestige-without-base-class',
      severity: 'warning',
      path: 'system.classLevels',
      message:
        'Prestige class levels are present without any base-class level; SRD 3.5 prestige requirements cannot be met by a 1st-level character.',
      recoverable: true,
    });
  }

  // Under-assignment only: over-assignment (sum > character level) is the
  // legality layer's dnd35e.L9.class-level-sum rule, consumed below.
  if (
    isIntegerInRange(system.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL) &&
    totalClassLevel < system.level
  ) {
    addIssue(issues, context, {
      code: 'dnd35e-class-levels-incomplete',
      severity: 'warning',
      path: 'system.classLevels',
      message: `Class levels total ${totalClassLevel}, but character level is ${system.level}.`,
      recoverable: true,
      details: { totalClassLevel, characterLevel: system.level },
    });
  }
}

function validatePrestigeLevelCap(
  issues: ValidationIssue[],
  context: ValidationContext,
  classLevel: Dnd35eClassLevel,
  classData: CharacterClass,
  path: string
) {
  // SRD 3.5 prestige classes are 10-level progressions; the cap is read from
  // the class's own feature table rather than hardcoded.
  const maxPrestigeLevel = classData.features.reduce(
    (max, progression) => Math.max(max, progression.level),
    0
  );

  if (maxPrestigeLevel > 0 && classLevel.level > maxPrestigeLevel) {
    addIssue(issues, context, {
      code: 'dnd35e-prestige-level-cap',
      severity: 'warning',
      path: `${path}.level`,
      message: `${classData.name} is a ${maxPrestigeLevel}-level prestige class (SRD 3.5), but level ${classLevel.level} is recorded.`,
      recoverable: true,
      details: { classId: classLevel.classId, level: classLevel.level, maxPrestigeLevel },
    });
  }
}

function validateHitDieRolls(
  issues: ValidationIssue[],
  context: ValidationContext,
  classLevel: Dnd35eClassLevel,
  classData: CharacterClass | undefined,
  path: string
) {
  if (!Array.isArray(classLevel.hitDieRolls)) {
    addIssue(issues, context, {
      code: 'dnd35e-invalid-hit-die-rolls',
      severity: 'error',
      path: `${path}.hitDieRolls`,
      message: 'Hit die rolls must be stored as an array.',
      recoverable: true,
    });
    return;
  }

  if (
    isIntegerInRange(classLevel.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL) &&
    classLevel.hitDieRolls.length > classLevel.level
  ) {
    addIssue(issues, context, {
      code: 'dnd35e-hit-die-roll-count-mismatch',
      severity: 'warning',
      path: `${path}.hitDieRolls`,
      message: 'Hit die rolls should not outnumber the stored class level.',
      recoverable: true,
      details: { rollCount: classLevel.hitDieRolls.length, classLevel: classLevel.level },
    });
  }

  const hitDieSize = classData ? Number(String(classData.hitDie).replace(/^d/i, '')) : NaN;

  classLevel.hitDieRolls.forEach((roll, rollIndex) => {
    if (!Number.isFinite(roll) || roll < 1) {
      addIssue(issues, context, {
        code: 'dnd35e-invalid-hit-die-roll',
        severity: 'warning',
        path: `${path}.hitDieRolls.${rollIndex}`,
        message: 'Hit die rolls should be positive numbers.',
        recoverable: true,
        details: { value: roll },
      });
    } else if (Number.isFinite(hitDieSize) && roll > hitDieSize) {
      addIssue(issues, context, {
        code: 'dnd35e-hit-die-roll-out-of-range',
        severity: 'warning',
        path: `${path}.hitDieRolls.${rollIndex}`,
        message: `Hit die roll ${roll} exceeds the class's d${hitDieSize} hit die.`,
        recoverable: true,
        details: { value: roll, hitDieSize },
      });
    }
  });
}

function validateSpecies(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Dnd35eDataModel,
  validationData: Dnd35eValidationData
) {
  if (system.speciesId && !validationData.speciesIds.has(system.speciesId)) {
    addIssue(issues, context, {
      code: 'dnd35e-unknown-species',
      severity: 'error',
      path: 'system.speciesId',
      message: `Race '${system.speciesId}' is not in the loader-backed 3.5e race catalog.`,
      recoverable: true,
      details: { speciesId: system.speciesId },
    });
  }
}

function validateAbilityScores(
  issues: ValidationIssue[],
  context: ValidationContext,
  baseAttributes: Record<string, number>
) {
  const abilityScoreIds = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

  abilityScoreIds.forEach((abilityId) => {
    const value = baseAttributes[abilityId];

    // SRD 3.5 (Ability Scores): scores have no upper cap; 0 is auto-failure /
    // helplessness, not a legal recorded build value.
    if (!Number.isInteger(value) || value < 1) {
      addIssue(issues, context, {
        code: 'dnd35e-invalid-ability-score',
        severity: 'error',
        path: `system.baseAttributes.${abilityId}`,
        message: `${abilityId.toUpperCase()} must be an integer of at least 1 (SRD 3.5 has no upper cap).`,
        recoverable: true,
        details: { abilityId, value },
      });
    }
  });
}

function validateSkillRanks(
  issues: ValidationIssue[],
  context: ValidationContext,
  skillRanks: Record<string, number>
) {
  Object.entries(skillRanks).forEach(([skillId, ranks]) => {
    // SRD 3.5 (Skills): ranks accrue in half-rank increments (cross-class
    // skills buy 1/2 rank per skill point) and can never be negative. The
    // class/cross-class max-rank caps are the legality layer's rule.
    const isHalfRankIncrement = Number.isFinite(ranks) && Number.isInteger(ranks * 2);
    if (!isHalfRankIncrement || ranks < 0) {
      addIssue(issues, context, {
        code: 'dnd35e-invalid-skill-ranks',
        severity: 'error',
        path: `system.skillRanks.${skillId}`,
        message: `Skill ranks for '${skillId}' must be a non-negative half-rank increment (SRD 3.5 Skills).`,
        recoverable: true,
        details: { skillId, value: ranks },
      });
    }
  });
}

function validateFeats(
  issues: ValidationIssue[],
  context: ValidationContext,
  feats: Dnd35eFeat[],
  validationData: Dnd35eValidationData
) {
  feats.forEach((feat, index) => {
    const path = `system.feats.${index}`;

    // 3.5e feats are self-describing records (name/description travel with the
    // document), so an off-catalog id is advisory, not an error.
    if (!validationData.featIds.has(feat.id)) {
      addIssue(issues, context, {
        code: 'dnd35e-unknown-feat',
        severity: 'warning',
        path: `${path}.id`,
        message: `Feat '${feat.id}' is not in the loader-backed SRD 3.5 feat catalog.`,
        recoverable: true,
        details: { featId: feat.id },
      });
    }

    // Strict open-content policy: only 'SRD 3.5' is open-content provenance
    // for this system (src/utils/openContentPolicy.ts); closed-book citations
    // are annotated so they are never silently redistributed.
    if (!isOpenContentCompliant(DND35E_SYSTEM_ID, 'feats', feat)) {
      addIssue(issues, context, {
        code: 'dnd35e-closed-content-source',
        severity: 'warning',
        path: `${path}.source`,
        message: `Feat '${feat.name}' cites '${feat.source || '(missing source)'}', which is not open-content provenance for D&D 3.5e (allowed: SRD 3.5).`,
        recoverable: true,
        details: { featId: feat.id, source: feat.source },
      });
    }
  });
}

function validateSpellcasting(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Dnd35eDataModel,
  validationData: Dnd35eValidationData
) {
  const isKnownSpellId = (spellId: string): boolean =>
    validationData.spellIds.has(spellId) ||
    validationData.spellIds.has(resolveSpellIdAlias(spellId, validationData.spellIdAliases));

  const reportUnknownSpell = (spellId: string, path: string) => {
    addIssue(issues, context, {
      code: 'dnd35e-unknown-spell',
      severity: 'error',
      path,
      message: `Spell '${spellId}' does not resolve in the canonical 3.5e spell catalog (aliases included).`,
      recoverable: true,
      details: { spellId },
    });
  };

  (system.spellsKnown ?? []).forEach((spellId, index) => {
    if (!isKnownSpellId(spellId)) {
      reportUnknownSpell(spellId, `system.spellsKnown.${index}`);
    }
  });

  (system.alwaysPreparedSpellIds ?? []).forEach((spellId, index) => {
    if (!isKnownSpellId(spellId)) {
      reportUnknownSpell(spellId, `system.alwaysPreparedSpellIds.${index}`);
    }
  });

  // Prepared spells are only checked for catalog resolution. WHICH slots they
  // occupy — and spontaneous cure/inflict conversion — are accepted manual
  // boundaries and never validation issues.
  Object.entries(system.preparedSpellsByLevel ?? {}).forEach(([slotLevel, spellIds]) => {
    (spellIds ?? []).forEach((spellId, index) => {
      if (!isKnownSpellId(spellId)) {
        reportUnknownSpell(spellId, `system.preparedSpellsByLevel.${slotLevel}.${index}`);
      }
    });
  });

  Object.entries(system.spellsPerDay ?? {}).forEach(([slotLevel, slot]) => {
    const path = `system.spellsPerDay.${slotLevel}`;

    if (
      !slot ||
      !Number.isFinite(slot.total) ||
      !Number.isFinite(slot.used) ||
      slot.total < 0 ||
      slot.used < 0 ||
      slot.used > slot.total
    ) {
      addIssue(issues, context, {
        code: 'dnd35e-invalid-spells-per-day',
        severity: 'error',
        path,
        message: `Spells per day for level ${slotLevel} must have non-negative totals with used <= total.`,
        recoverable: true,
        details: { slotLevel, ...slot },
      });
    }
  });

  // SRD 3.5 (Wizard): a specialist chooses one of the eight schools of magic.
  if (
    system.arcaneSpecialtySchool !== undefined &&
    !(D20_ARCANE_SCHOOLS as readonly string[]).includes(system.arcaneSpecialtySchool)
  ) {
    addIssue(issues, context, {
      code: 'dnd35e-unknown-specialty-school',
      severity: 'warning',
      path: 'system.arcaneSpecialtySchool',
      message: `'${system.arcaneSpecialtySchool}' is not one of the eight SRD 3.5 arcane schools.`,
      recoverable: true,
      details: { value: system.arcaneSpecialtySchool, schools: [...D20_ARCANE_SCHOOLS] },
    });
  }
}

/**
 * Surface the mutation-proven build-legality caps (src/rules/legality/dnd35e)
 * as warning-severity issues: max skill ranks (class level + 3 for class
 * skills, half that for cross-class — SRD 3.5 Skills) and the class-level sum
 * cap (sum of class levels may not exceed character level).
 */
function appendBuildLegalityIssues(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Dnd35eDataModel
) {
  const legality = validateDnd35eBuild(system, DND35E_SYSTEM_ID);

  legality.violations.forEach((violation) => {
    addIssue(issues, context, {
      code: 'dnd35e-build-legality',
      severity: 'warning',
      path: violation.rule.endsWith('skill-max-ranks') ? 'system.skillRanks' : 'system.classLevels',
      message: `${violation.label} is ${violation.value}, above the SRD 3.5 limit of ${violation.limit}.`,
      recoverable: true,
      details: { ...violation },
    });
  });
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;

  issues.push(source ? { ...issue, source } : issue);
}
