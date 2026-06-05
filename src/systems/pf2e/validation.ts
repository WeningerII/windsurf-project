import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { Species, Subrace } from '../../types/character-options/species';
import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadPf2eBackgroundsForSystem,
} from '../../utils/dataLoader';
import type {
  Pf2eDataModel,
  Pf2eProficiency,
  Pf2eProficiencyTier,
  Pf2eSpellcasting,
} from './data-model';

/**
 * Pathfinder 2e legality gate.
 *
 * Mirrors the D&D 5e validator: it loads the loader-backed catalogs, confirms
 * the build's choices exist and fit together, and checks the structural
 * invariants the engine relies on (proficiency tiers, HP/AC sanity, spell
 * slots). It is the deterministic "rules decide" half of guided creation and AI
 * draft review — it reports issues but never mutates the document.
 */

const PF2E_ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
const VALID_TIERS: ReadonlySet<Pf2eProficiencyTier> = new Set([
  'untrained',
  'trained',
  'expert',
  'master',
  'legendary',
]);
const VALID_TRADITIONS: ReadonlySet<Pf2eSpellcasting['tradition']> = new Set([
  'arcane',
  'divine',
  'occult',
  'primal',
]);
const VALID_CASTING_TYPES: ReadonlySet<Pf2eSpellcasting['type']> = new Set([
  'prepared',
  'spontaneous',
  'innate',
]);
const MIN_LEVEL = 1;
const MAX_LEVEL = 20;
const MIN_ABILITY = 1;
const MAX_ABILITY = 30;

export function createPf2eValidator(): SystemValidator<Pf2eDataModel> {
  return {
    validateDocument: (document, context) => validatePf2eDocument(document, context),
  };
}

async function validatePf2eDocument(
  document: CharacterDocument<Pf2eDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const system = document.system;

  if (document.systemId !== 'pf2e') {
    addIssue(issues, context, {
      code: 'pf2e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected pf2e but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const [classes, ancestries, backgrounds] = await Promise.all([
    loadClassesForSystem('pf2e'),
    loadSpeciesForSystem('pf2e'),
    loadPf2eBackgroundsForSystem('pf2e'),
  ]);

  validateLevel(issues, context, system.level);
  validateBuildChoices(issues, context, system, {
    classIds: toIdSet(classes),
    ancestriesById: new Map(ancestries.map((ancestry) => [ancestry.id, ancestry])),
    backgroundIds: toIdSet(backgrounds),
  });
  validateAbilityScores(issues, context, system.baseAttributes);
  validateAbilityBoostSelections(issues, context, system);
  validateProficiencies(issues, context, system);
  validateVitals(issues, context, system);
  validateSpellcasting(issues, context, system.spellcasting);

  return { issues };
}

function validateLevel(issues: ValidationIssue[], context: ValidationContext, level: number) {
  if (!isIntegerInRange(level, MIN_LEVEL, MAX_LEVEL)) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-level',
      severity: 'error',
      path: 'system.level',
      message: 'Character level must be an integer from 1 through 20.',
      recoverable: true,
      details: { value: level },
    });
  }
}

function validateBuildChoices(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  catalog: {
    classIds: Set<string>;
    ancestriesById: Map<string, Species>;
    backgroundIds: Set<string>;
  }
) {
  // Creation completeness: the four core choices a PF2e build needs.
  requireChoice(issues, context, system.classId, 'system.classId', 'class', 'pf2e-missing-class');
  requireChoice(
    issues,
    context,
    system.ancestryId,
    'system.ancestryId',
    'ancestry',
    'pf2e-missing-ancestry'
  );
  requireChoice(
    issues,
    context,
    system.backgroundId,
    'system.backgroundId',
    'background',
    'pf2e-missing-background'
  );

  if (system.classId && !catalog.classIds.has(system.classId)) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-class',
      severity: 'error',
      path: 'system.classId',
      message: `Class '${system.classId}' is not in the loader-backed class catalog.`,
      recoverable: true,
      details: { classId: system.classId },
    });
  }

  if (system.backgroundId && !catalog.backgroundIds.has(system.backgroundId)) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-background',
      severity: 'error',
      path: 'system.backgroundId',
      message: `Background '${system.backgroundId}' is not in the loader-backed background catalog.`,
      recoverable: true,
      details: { backgroundId: system.backgroundId },
    });
  }

  if (!system.ancestryId) {
    return;
  }

  const ancestry = catalog.ancestriesById.get(system.ancestryId);
  if (!ancestry) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-ancestry',
      severity: 'error',
      path: 'system.ancestryId',
      message: `Ancestry '${system.ancestryId}' is not in the loader-backed ancestry catalog.`,
      recoverable: true,
      details: { ancestryId: system.ancestryId },
    });
    return;
  }

  validateHeritage(issues, context, system.heritageId, ancestry);
}

function validateHeritage(
  issues: ValidationIssue[],
  context: ValidationContext,
  heritageId: string | undefined,
  ancestry: Species
) {
  if (!heritageId) {
    return;
  }

  const heritages: Subrace[] = ancestry.subraces ?? [];
  if (!heritages.some((heritage) => heritage.id === heritageId)) {
    addIssue(issues, context, {
      code: 'pf2e-heritage-ancestry-mismatch',
      severity: 'error',
      path: 'system.heritageId',
      message: `Heritage '${heritageId}' does not belong to ancestry '${ancestry.id}'.`,
      recoverable: true,
      details: { heritageId, ancestryId: ancestry.id },
    });
  }
}

function validateAbilityScores(
  issues: ValidationIssue[],
  context: ValidationContext,
  baseAttributes: Record<string, number>
) {
  PF2E_ABILITY_IDS.forEach((abilityId) => {
    const value = baseAttributes[abilityId];
    if (!isIntegerInRange(value, MIN_ABILITY, MAX_ABILITY)) {
      addIssue(issues, context, {
        code: 'pf2e-invalid-ability-score',
        severity: 'error',
        path: `system.baseAttributes.${abilityId}`,
        message: `${abilityId.toUpperCase()} must be an integer from ${MIN_ABILITY} through ${MAX_ABILITY}.`,
        recoverable: true,
        details: { abilityId, value },
      });
    }
  });
}

function validateAbilityBoostSelections(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel
) {
  validateBoostAbilityIds(
    issues,
    context,
    system.ancestryAbilityBoostSelections,
    'system.ancestryAbilityBoostSelections'
  );
  validateBoostAbilityIds(
    issues,
    context,
    system.backgroundAbilityBoostSelections,
    'system.backgroundAbilityBoostSelections'
  );
}

function validateBoostAbilityIds(
  issues: ValidationIssue[],
  context: ValidationContext,
  selections: string[] | undefined,
  path: string
) {
  (selections ?? []).forEach((selection, index) => {
    // Empty strings are the "not yet chosen" sentinel — legal mid-build.
    if (selection === '') {
      return;
    }
    if (!PF2E_ABILITY_IDS.includes(selection as (typeof PF2E_ABILITY_IDS)[number])) {
      addIssue(issues, context, {
        code: 'pf2e-invalid-boost-ability',
        severity: 'error',
        path: `${path}.${index}`,
        message: `Ability boost '${selection}' is not a valid ability id.`,
        recoverable: true,
        details: { value: selection },
      });
    }
  });
}

function validateProficiencies(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel
) {
  const groups: Array<[string, Record<string, Pf2eProficiency>]> = [
    ['skillProficiencies', system.skillProficiencies],
    ['loreProficiencies', system.loreProficiencies],
    ['armorProficiencies', system.armorProficiencies],
    ['weaponProficiencies', system.weaponProficiencies],
  ];

  groups.forEach(([group, record]) => {
    Object.entries(record ?? {}).forEach(([key, prof]) => {
      checkTier(issues, context, prof?.tier, `system.${group}.${key}.tier`);
    });
  });

  (['fortitude', 'reflex', 'will'] as const).forEach((save) => {
    checkTier(
      issues,
      context,
      system.saveProficiencies?.[save]?.tier,
      `system.saveProficiencies.${save}.tier`
    );
  });
  checkTier(
    issues,
    context,
    system.perceptionProficiency?.tier,
    'system.perceptionProficiency.tier'
  );
}

function checkTier(
  issues: ValidationIssue[],
  context: ValidationContext,
  tier: Pf2eProficiencyTier | undefined,
  path: string
) {
  if (tier === undefined) {
    return;
  }
  if (!VALID_TIERS.has(tier)) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-proficiency-tier',
      severity: 'error',
      path,
      message: `Proficiency tier '${tier}' is not one of untrained/trained/expert/master/legendary.`,
      recoverable: true,
      details: { tier },
    });
  }
}

function validateVitals(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel
) {
  const hp = system.hitPoints;
  if (!hp || !Number.isFinite(hp.max) || hp.max < 1) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-hp',
      severity: 'error',
      path: 'system.hitPoints.max',
      message: 'Maximum hit points must be a positive number.',
      recoverable: true,
      details: { value: hp?.max },
    });
  } else if (hp.current > hp.max || hp.current < 0 || hp.temp < 0) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-hp',
      severity: 'warning',
      path: 'system.hitPoints',
      message: 'Current/temporary hit points are out of the valid range.',
      recoverable: true,
      details: { ...hp },
    });
  }

  if (!Number.isFinite(system.armorClass) || system.armorClass < 0) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-ac',
      severity: 'error',
      path: 'system.armorClass',
      message: 'Armor Class must be a non-negative number.',
      recoverable: true,
      details: { value: system.armorClass },
    });
  }
}

function validateSpellcasting(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellcasting: Pf2eSpellcasting | undefined
) {
  if (!spellcasting) {
    return;
  }

  if (!VALID_TRADITIONS.has(spellcasting.tradition)) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-tradition',
      severity: 'error',
      path: 'system.spellcasting.tradition',
      message: `Spell tradition '${spellcasting.tradition}' is not arcane/divine/occult/primal.`,
      recoverable: true,
      details: { tradition: spellcasting.tradition },
    });
  }

  if (!VALID_CASTING_TYPES.has(spellcasting.type)) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-casting-type',
      severity: 'error',
      path: 'system.spellcasting.type',
      message: `Casting type '${spellcasting.type}' is not prepared/spontaneous/innate.`,
      recoverable: true,
      details: { type: spellcasting.type },
    });
  }

  const focus = spellcasting.focusPoints;
  if (focus && (focus.current < 0 || focus.max < 0 || focus.current > focus.max || focus.max > 3)) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-focus-points',
      severity: 'warning',
      path: 'system.spellcasting.focusPoints',
      message: 'Focus points must be within 0 and the focus pool maximum (max 3).',
      recoverable: true,
      details: { ...focus },
    });
  }

  Object.entries(spellcasting.spellSlots ?? {}).forEach(([rank, slot]) => {
    if (!slot || slot.max < 0 || slot.used < 0 || slot.used > slot.max) {
      addIssue(issues, context, {
        code: 'pf2e-invalid-spell-slot',
        severity: 'error',
        path: `system.spellcasting.spellSlots.${rank}`,
        message: `Spell slots at rank ${rank} must be non-negative with used not exceeding max.`,
        recoverable: true,
        details: { rank, ...slot },
      });
    }
  });
}

function requireChoice(
  issues: ValidationIssue[],
  context: ValidationContext,
  value: string | undefined,
  path: string,
  label: string,
  code: string
) {
  if (!value) {
    addIssue(issues, context, {
      code,
      severity: 'warning',
      path,
      message: `No ${label} is selected yet.`,
      recoverable: true,
    });
  }
}

function toIdSet(items: Array<{ id: string }>): Set<string> {
  return new Set(items.map((item) => item.id));
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
