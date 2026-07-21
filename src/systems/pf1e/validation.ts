import { isPf1eProductPrestigeClassId } from '../../data/pathfinder/1e/prestige-classes/productCatalog';
import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import { validatePf1eBuild } from '../../rules/legality/pf1e';
import type { CharacterDocument } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import {
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
  loadTraitsForSystem,
} from '../../utils/dataLoader';
import { isOpenContentCompliant } from '../../utils/openContentPolicy';
import type { Pf1eDataModel } from './data-model';

/**
 * Pathfinder 1e document validator (registry `SystemValidator`).
 *
 * Annotate, never block: every check reports a `warning` issue (the sole
 * `error` is a document that claims to be another system entirely) and all
 * issues are `recoverable`. Callers decide how to surface them; the validator
 * never mutates or drops documents.
 *
 * Every check is grounded in PF1e's own loaders and rules — none of it is
 * inherited from the 5e validator's check list:
 *   - class/race/feat/trait/spell/equipment ids resolve against the
 *     open-content-filtered PF1e loaders (src/utils/dataLoader), where the
 *     hand-authored entry wins on id collision;
 *   - prestige checks use the vetted CRB prestige catalog
 *     (src/data/pathfinder/1e/prestige-classes/productCatalog.ts);
 *   - prepared-spell levels respect each spell's raw `levelsByClass` (a spell
 *     may sit at different levels on different class lists — PF1e CRB spell
 *     lists);
 *   - the flat skill-rank cap and class-level accounting come from the shared
 *     build-legality validator (src/rules/legality/pf1e.ts), consumed here as
 *     warning-severity issues;
 *   - feat/trait source citations are checked against the strict PF1e
 *     open-content whitelist (src/utils/openContentPolicy.ts).
 *
 * Accepted manual boundaries (never issues): Vancian prepared-slot assignment
 * (which prepared spell occupies which `spellsPerDay` slot, incl. metamagic
 * preparing a spell in a higher-level slot) and spontaneous cure/inflict
 * conversion (`manualSpellcastingExtras.spontaneousConversionReference`).
 */

const ABILITY_SCORE_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
// PF1e CRB, Character Advancement: the advancement table runs level 1–20.
const MIN_CHARACTER_LEVEL = 1;
const MAX_CHARACTER_LEVEL = 20;
// PF1e CRB, Prestige Classes: every Core Rulebook prestige class is a
// ten-level progression.
const PRESTIGE_CLASS_MAX_LEVEL = 10;

type Pf1eValidationData = {
  classIds: Set<string>;
  raceIds: Set<string>;
  featIds: Set<string>;
  traitIds: Set<string>;
  itemIds: Set<string>;
  spellsById: Map<string, Spell>;
};

export const pf1eValidator: SystemValidator<Pf1eDataModel> = {
  validateDocument: (document, context) => validatePf1eDocument(document, context),
};

async function validatePf1eDocument(
  document: CharacterDocument<Pf1eDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const validationData = await loadValidationData();
  const system = document.system;

  if (document.systemId !== 'pf1e') {
    addIssue(issues, context, {
      code: 'pf1e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected pf1e but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  validateCharacterLevel(issues, context, system.level);
  validateClassLevels(issues, context, system, validationData);
  validateRace(issues, context, system, validationData);
  validateAbilityScores(issues, context, system.baseAttributes);
  validateFeats(issues, context, system, validationData);
  validateTraits(issues, context, system, validationData);
  validateEquipment(issues, context, system, validationData);
  validateSpells(issues, context, system, validationData);
  consumeBuildLegality(issues, context, system);

  return { issues };
}

async function loadValidationData(): Promise<Pf1eValidationData> {
  const [classes, races, feats, traits, items, spells] = await Promise.all([
    loadClassesForSystem('pf1e'),
    loadSpeciesForSystem('pf1e'),
    loadFeatsForSystem('pf1e'),
    loadTraitsForSystem('pf1e'),
    loadEquipmentForSystem('pf1e'),
    loadSpellsForSystem('pf1e'),
  ]);

  return {
    classIds: toIdSet(classes),
    raceIds: toIdSet(races),
    featIds: toIdSet(feats),
    traitIds: toIdSet(traits),
    itemIds: toIdSet(items),
    spellsById: new Map(spells.map((spell) => [spell.id, spell])),
  };
}

function validateCharacterLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  level: number
) {
  if (!isIntegerInRange(level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
    addIssue(issues, context, {
      code: 'pf1e-invalid-level',
      severity: 'warning',
      path: 'system.level',
      message: 'Character level should be an integer from 1 through 20 (CRB advancement table).',
      recoverable: true,
      details: { value: level },
    });
  }
}

function validateClassLevels(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel,
  validationData: Pf1eValidationData
) {
  const classLevels = system.classLevels;

  if (!Array.isArray(classLevels) || classLevels.length === 0) {
    addIssue(issues, context, {
      code: 'pf1e-no-class-levels',
      severity: 'warning',
      path: 'system.classLevels',
      message: 'No class levels are selected yet.',
      recoverable: true,
    });
    return;
  }

  const seenClassIds = new Set<string>();
  let totalClassLevel = 0;
  const hasBaseClassLevel = classLevels.some(
    (classLevel) =>
      validationData.classIds.has(classLevel.classId) &&
      !isPf1eProductPrestigeClassId(classLevel.classId)
  );

  classLevels.forEach((classLevel, index) => {
    const path = `system.classLevels.${index}`;
    const isPrestige = isPf1eProductPrestigeClassId(classLevel.classId);

    if (!validationData.classIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'pf1e-unknown-class',
        severity: 'warning',
        path: `${path}.classId`,
        message: `Class '${classLevel.classId}' is not in the PF1e class catalog (base classes + vetted CRB prestige classes).`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }

    if (seenClassIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'pf1e-duplicate-class',
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
        code: 'pf1e-invalid-class-level',
        severity: 'warning',
        path: `${path}.level`,
        message: 'Class level should be an integer from 1 through 20.',
        recoverable: true,
        details: { value: classLevel.level },
      });
    } else {
      totalClassLevel += classLevel.level;

      if (isPrestige && classLevel.level > PRESTIGE_CLASS_MAX_LEVEL) {
        addIssue(issues, context, {
          code: 'pf1e-prestige-level-cap',
          severity: 'warning',
          path: `${path}.level`,
          message: `'${classLevel.classId}' is a ten-level CRB prestige class; level ${classLevel.level} exceeds its cap.`,
          recoverable: true,
          details: { classId: classLevel.classId, value: classLevel.level, limit: 10 },
        });
      }
    }

    if (isPrestige && !hasBaseClassLevel) {
      addIssue(issues, context, {
        code: 'pf1e-prestige-without-base-class',
        severity: 'warning',
        path: `${path}.classId`,
        message: `Prestige class '${classLevel.classId}' has CRB entry prerequisites and cannot be a character's only class.`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }
  });

  // Only annotate the shortfall direction here: the exceed direction is the
  // build-legality rule pf1e.L9.class-level-sum, consumed in
  // consumeBuildLegality, and double-reporting it would be noise.
  if (
    isIntegerInRange(system.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL) &&
    totalClassLevel < system.level
  ) {
    addIssue(issues, context, {
      code: 'pf1e-class-total-shortfall',
      severity: 'warning',
      path: 'system.classLevels',
      message: `Class levels total ${totalClassLevel}, but character level is ${system.level}.`,
      recoverable: true,
      details: { totalClassLevel, characterLevel: system.level },
    });
  }
}

function validateRace(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel,
  validationData: Pf1eValidationData
) {
  if (system.speciesId && !validationData.raceIds.has(system.speciesId)) {
    addIssue(issues, context, {
      code: 'pf1e-unknown-race',
      severity: 'warning',
      path: 'system.speciesId',
      message: `Race '${system.speciesId}' is not in the loader-backed PF1e race catalog.`,
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
  ABILITY_SCORE_IDS.forEach((abilityId) => {
    const value = baseAttributes[abilityId];

    // PF1e has no hard upper bound on ability scores, but a base score below 1
    // (or a non-integer) is not a purchasable/rollable value.
    if (!Number.isInteger(value) || value < 1) {
      addIssue(issues, context, {
        code: 'pf1e-invalid-ability-score',
        severity: 'warning',
        path: `system.baseAttributes.${abilityId}`,
        message: `${abilityId.toUpperCase()} should be an integer of at least 1.`,
        recoverable: true,
        details: { abilityId, value },
      });
    }
  });
}

function validateFeats(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel,
  validationData: Pf1eValidationData
) {
  system.feats.forEach((feat, index) => {
    if (!validationData.featIds.has(feat.id)) {
      addIssue(issues, context, {
        code: 'pf1e-unknown-feat',
        severity: 'warning',
        path: `system.feats.${index}.id`,
        message: `Feat '${feat.id}' is not in the loader-backed PF1e feat catalog.`,
        recoverable: true,
        details: { featId: feat.id },
      });
    }

    if (!isOpenContentCompliant('pf1e', 'feats', feat)) {
      addNonOpenSourceIssue(issues, context, `system.feats.${index}.source`, feat.id, feat.source);
    }
  });
}

function validateTraits(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel,
  validationData: Pf1eValidationData
) {
  system.traits.forEach((trait, index) => {
    if (!validationData.traitIds.has(trait.id)) {
      addIssue(issues, context, {
        code: 'pf1e-unknown-trait',
        severity: 'warning',
        path: `system.traits.${index}.id`,
        message: `Trait '${trait.id}' is not in the loader-backed PF1e trait catalog.`,
        recoverable: true,
        details: { traitId: trait.id },
      });
    }

    if (!isOpenContentCompliant('pf1e', 'traits', trait)) {
      addNonOpenSourceIssue(
        issues,
        context,
        `system.traits.${index}.source`,
        trait.id,
        trait.source
      );
    }
  });
}

function validateEquipment(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel,
  validationData: Pf1eValidationData
) {
  system.equipment.forEach((entry, index) => {
    reportUnknownItem(issues, context, entry.itemId, `system.equipment.${index}.itemId`, {
      itemIds: validationData.itemIds,
    });
  });

  system.inventory.forEach((entry, index) => {
    reportUnknownItem(issues, context, entry.itemId, `system.inventory.${index}.itemId`, {
      itemIds: validationData.itemIds,
    });
  });
}

function reportUnknownItem(
  issues: ValidationIssue[],
  context: ValidationContext,
  itemId: string,
  path: string,
  validationData: { itemIds: Set<string> }
) {
  if (!itemId || validationData.itemIds.has(itemId)) {
    return;
  }

  addIssue(issues, context, {
    code: 'pf1e-unknown-item',
    severity: 'warning',
    path,
    message: `Item '${itemId}' is not in the loader-backed PF1e equipment catalog (hand-authored entries win on id).`,
    recoverable: true,
    details: { itemId },
  });
}

function validateSpells(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel,
  validationData: Pf1eValidationData
) {
  const classIds = new Set(system.classLevels.map((classLevel) => classLevel.classId));

  (system.spellsKnown ?? []).forEach((spellId, index) => {
    reportUnknownSpell(issues, context, validationData, spellId, `system.spellsKnown.${index}`);
  });

  (system.alwaysPreparedSpellIds ?? []).forEach((spellId, index) => {
    reportUnknownSpell(
      issues,
      context,
      validationData,
      spellId,
      `system.alwaysPreparedSpellIds.${index}`
    );
  });

  Object.entries(system.preparedSpellsByLevel ?? {}).forEach(([levelKey, spellIds]) => {
    const preparedLevel = Number(levelKey);

    (spellIds ?? []).forEach((spellId, index) => {
      const path = `system.preparedSpellsByLevel.${levelKey}.${index}`;
      const spell = validationData.spellsById.get(spellId);

      if (!spell) {
        reportUnknownSpell(issues, context, validationData, spellId, path);
        return;
      }

      // Respect the raw per-class spell levels: a spell may sit at different
      // levels on different class lists (CRB spell lists), so the minimum
      // qualifying level is taken from `levelsByClass` for the classes the
      // character actually has, falling back to every list the spell appears
      // on. Only a level BELOW the minimum is flagged — preparing in a
      // higher-level slot is legal (e.g. metamagic) and slot assignment is an
      // accepted manual boundary.
      const minLevel = minimumSpellLevel(spell, classIds);

      if (Number.isInteger(preparedLevel) && preparedLevel < minLevel) {
        addIssue(issues, context, {
          code: 'pf1e-prepared-spell-below-level',
          severity: 'warning',
          path,
          message: `'${spellId}' is prepared at level ${preparedLevel}, below its minimum spell level ${minLevel} for this character's classes.`,
          recoverable: true,
          details: { spellId, preparedLevel, minLevel },
        });
      }
    });
  });
}

function minimumSpellLevel(spell: Spell, classIds: Set<string>): number {
  const levelsByClass = spell.levelsByClass ?? {};
  const relevantLevels = Object.entries(levelsByClass)
    .filter(([classId]) => classIds.has(classId))
    .map(([, level]) => level);

  if (relevantLevels.length > 0) {
    return Math.min(...relevantLevels);
  }

  const allLevels = Object.values(levelsByClass);
  return Math.min(spell.level, ...allLevels);
}

function reportUnknownSpell(
  issues: ValidationIssue[],
  context: ValidationContext,
  validationData: Pf1eValidationData,
  spellId: string,
  path: string
) {
  if (validationData.spellsById.has(spellId)) {
    return;
  }

  addIssue(issues, context, {
    code: 'pf1e-unknown-spell',
    severity: 'warning',
    path,
    message: `Spell '${spellId}' is not in the loader-backed PF1e spell catalog.`,
    recoverable: true,
    details: { spellId },
  });
}

/**
 * Bridge the shared build-legality validator (src/rules/legality/pf1e.ts) into
 * registry issues. Each violation keeps its stable compute-register rule id as
 * the issue code and is reported at warning severity — legality findings
 * annotate, they never block.
 */
function consumeBuildLegality(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf1eDataModel
) {
  const legality = validatePf1eBuild(system, 'pf1e');

  legality.violations.forEach((violation) => {
    addIssue(issues, context, {
      code: violation.rule,
      severity: 'warning',
      path: legalityRulePath(violation.rule),
      message: `${violation.label} is ${violation.value}, above the legal limit of ${violation.limit}.`,
      recoverable: true,
      details: { rule: violation.rule, value: violation.value, limit: violation.limit },
    });
  });
}

function legalityRulePath(rule: string): string {
  switch (rule) {
    case 'pf1e.L9.skill-max-ranks':
      return 'system.skillRanks';
    case 'pf1e.L9.class-level-sum':
      return 'system.classLevels';
    default:
      return 'system';
  }
}

function toIdSet(items: Array<{ id: string }>): Set<string> {
  return new Set(items.map((item) => item.id));
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function addNonOpenSourceIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  path: string,
  entryId: string,
  source: string | undefined
) {
  addIssue(issues, context, {
    code: 'pf1e-non-open-source',
    severity: 'warning',
    path,
    message: `'${entryId}' cites source '${source ?? '(none)'}', which is not in the PF1e open-content whitelist.`,
    recoverable: true,
    details: { entryId, source: source ?? null },
  });
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;

  issues.push(source ? { ...issue, source } : issue);
}
