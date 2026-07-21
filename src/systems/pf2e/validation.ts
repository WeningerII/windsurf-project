import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { Archetype } from '../../types/character-options/archetypes';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Pf2eBackgroundDefinition } from '../../types/character-options/pf2eBackgrounds';
import type { Species } from '../../types/character-options/species';
import type { CharacterDocument } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import { validatePf2eBuild } from '../../rules/legality/pf2e';
import {
  loadArchetypesForSystem,
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { isOpenContentCompliant } from '../../utils/openContentPolicy';
import type { Pf2eDataModel, Pf2eSpellcasting } from './data-model';
import { getPf2eBulkState } from './pf2eSheetShared';

/**
 * Pathfinder 2e registered SystemValidator (registry/types.ts contract).
 *
 * Mirrors the D&D 5e validator's SHAPE (src/systems/dnd5e/shared/validation.ts)
 * but derives every check from PF2e's OWN loader-backed catalogs and rules:
 *   - option ids (ancestry/heritage/background/class/archetype) against the
 *     same loaders the sheet and templates consume (src/utils/dataLoader.ts),
 *     which already apply the strict open-content policy;
 *   - spell ids against the PF2e spell catalog with its raw `traditions`
 *     arrays and rank bounds (rank 10 is legal — CRB 10th-rank spells);
 *   - prepared-slot ranks against the class's own slot progression;
 *   - level-1 ability boost selections against the ancestry/background choice
 *     definitions the template pipeline sanitizes with;
 *   - Bulk state via the CRB Bulk-limit helper (warnings only);
 *   - open-content provenance of hand-entered feats via openContentPolicy;
 *   - build-legality caps via src/rules/legality/pf2e.ts, surfaced as
 *     warning-severity issues (first runtime caller of BuildLegalityResult).
 *
 * Focus-spell surfaces stay manual: `focusSpells` entries are intentionally
 * NOT checked against the spell catalog (the product has no focus-spell
 * automation); the validator only annotates that fact with an info issue.
 *
 * Validators annotate — they never mutate, persist, or block. Callers decide
 * how to display the issue list (registry contract, src/registry/index.ts).
 */

const PF2E_SYSTEM_ID = 'pf2e';
const MIN_CHARACTER_LEVEL = 1;
const MAX_CHARACTER_LEVEL = 20;
/** CRB: spell ranks run 0 (cantrips) through 10 — rank 10 is a legal rank. */
const MAX_SPELL_RANK = 10;
/**
 * Class SpellSlotProgression tables only cover ranks 1-9; rank-10 slots come
 * from 10th-rank class features (e.g. Archwizard's Spellcraft) and stay a
 * manual surface, so rank 10 is exempt from class-progression consistency.
 */
const CLASS_PROGRESSION_RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const PF2E_ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
/** CRB (Focus Spells): a focus pool can never hold more than 3 Focus Points. */
const FOCUS_POOL_MAX = 3;

type Pf2eValidationData = {
  classesById: Map<string, CharacterClass>;
  ancestriesById: Map<string, Species>;
  backgroundsById: Map<string, Pf2eBackgroundDefinition>;
  archetypeIds: Set<string>;
  spellsById: Map<string, Spell>;
  /**
   * Names the template pipeline records as `source` on granted feats (e.g. a
   * background's name via backgroundFeat in pf2eTemplate.ts). These are
   * provenance labels, not book citations, so they are exempt from the
   * open-content source check.
   */
  templateProvenanceLabels: Set<string>;
};

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
  const validationData = await loadValidationData();
  const system = document.system;

  if (document.systemId !== PF2E_SYSTEM_ID) {
    addIssue(issues, context, {
      code: 'pf2e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${PF2E_SYSTEM_ID} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  validateCharacterLevel(issues, context, system.level);
  validateCharacterOptions(issues, context, system, validationData);
  validateAncestryBoosts(issues, context, system, validationData);
  validateBackgroundBoosts(issues, context, system, validationData);
  validateSpellcasting(issues, context, system, validationData);
  validateBulk(issues, context, system);
  validateFeatOpenContent(issues, context, system, validationData);
  validateBuildLegality(issues, context, system);

  return { issues };
}

async function loadValidationData(): Promise<Pf2eValidationData> {
  const [classes, ancestries, backgrounds, archetypes, spells] = await Promise.all([
    loadClassesForSystem(PF2E_SYSTEM_ID),
    loadSpeciesForSystem(PF2E_SYSTEM_ID),
    loadPf2eBackgroundsForSystem(PF2E_SYSTEM_ID),
    loadArchetypesForSystem(PF2E_SYSTEM_ID),
    loadSpellsForSystem(PF2E_SYSTEM_ID),
  ]);

  return {
    classesById: toIdMap(classes),
    ancestriesById: toIdMap(ancestries),
    backgroundsById: toIdMap(backgrounds),
    archetypeIds: new Set(archetypes.map((archetype: Archetype) => archetype.id)),
    spellsById: toIdMap(spells),
    templateProvenanceLabels: new Set([
      ...backgrounds.map((background) => background.name),
      ...ancestries.map((ancestry) => ancestry.name),
      ...classes.map((classDefinition) => classDefinition.name),
      ...archetypes.map((archetype) => archetype.name),
    ]),
  };
}

function validateCharacterLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  level: number
) {
  if (!isIntegerInRange(level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
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

function validateCharacterOptions(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  validationData: Pf2eValidationData
) {
  if (system.ancestryId && !validationData.ancestriesById.has(system.ancestryId)) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-ancestry',
      severity: 'error',
      path: 'system.ancestryId',
      message: `Ancestry '${system.ancestryId}' is not in the loader-backed ancestry catalog.`,
      recoverable: true,
      details: { ancestryId: system.ancestryId },
    });
  }

  validateHeritage(issues, context, system, validationData);

  if (system.backgroundId && !validationData.backgroundsById.has(system.backgroundId)) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-background',
      severity: 'error',
      path: 'system.backgroundId',
      message: `Background '${system.backgroundId}' is not in the loader-backed background catalog.`,
      recoverable: true,
      details: { backgroundId: system.backgroundId },
    });
  }

  if (system.classId && !validationData.classesById.has(system.classId)) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-class',
      severity: 'error',
      path: 'system.classId',
      message: `Class '${system.classId}' is not in the loader-backed class catalog.`,
      recoverable: true,
      details: { classId: system.classId },
    });
  }

  const seenArchetypeIds = new Set<string>();
  (system.selectedArchetypeIds ?? []).forEach((archetypeId, index) => {
    const path = `system.selectedArchetypeIds.${index}`;

    if (!validationData.archetypeIds.has(archetypeId)) {
      addIssue(issues, context, {
        code: 'pf2e-unknown-archetype',
        severity: 'error',
        path,
        message: `Archetype '${archetypeId}' is not in the loader-backed archetype catalog.`,
        recoverable: true,
        details: { archetypeId },
      });
    }

    if (seenArchetypeIds.has(archetypeId)) {
      addIssue(issues, context, {
        code: 'pf2e-duplicate-archetype',
        severity: 'warning',
        path,
        message: `Archetype '${archetypeId}' is selected more than once.`,
        recoverable: true,
        details: { archetypeId },
      });
    }
    seenArchetypeIds.add(archetypeId);
  });
}

function validateHeritage(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  validationData: Pf2eValidationData
) {
  if (!system.heritageId) {
    return;
  }

  if (!system.ancestryId) {
    addIssue(issues, context, {
      code: 'pf2e-heritage-without-ancestry',
      severity: 'warning',
      path: 'system.heritageId',
      message: `Heritage '${system.heritageId}' is selected without an ancestry.`,
      recoverable: true,
      details: { heritageId: system.heritageId },
    });
    return;
  }

  const ancestry = validationData.ancestriesById.get(system.ancestryId);
  if (!ancestry) {
    // Unknown ancestry is already reported; the heritage cannot be judged.
    return;
  }

  const heritageKnown = (ancestry.subraces ?? []).some(
    (heritage) => heritage.id === system.heritageId
  );
  if (!heritageKnown) {
    addIssue(issues, context, {
      code: 'pf2e-unknown-heritage',
      severity: 'error',
      path: 'system.heritageId',
      message: `Heritage '${system.heritageId}' is not available for ${ancestry.name}.`,
      recoverable: true,
      details: { ancestryId: system.ancestryId, heritageId: system.heritageId },
    });
  }
}

/**
 * Ancestry ability-boost selections must fit the ancestry's choice definitions:
 * same option lists and per-group caps the template pipeline sanitizes with
 * (sanitizeChoiceAbilitySelections in pf2eTemplate.ts). The template silently
 * drops bad entries, so persisted violations are consistency warnings.
 */
function validateAncestryBoosts(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  validationData: Pf2eValidationData
) {
  const selections = system.ancestryAbilityBoostSelections ?? [];
  if (selections.length === 0 || !system.ancestryId) {
    return;
  }

  const ancestry = validationData.ancestriesById.get(system.ancestryId);
  if (!ancestry) {
    return;
  }

  let offset = 0;
  ancestry.abilityScoreIncrease.forEach((increase) => {
    if (increase.type !== 'choice' || !increase.choice) {
      return;
    }

    const used = new Set<string>();
    for (let index = 0; index < increase.choice.count; index += 1) {
      const selection = selections[offset + index];
      if (!selection) {
        continue;
      }

      if (!increase.choice.options.includes(selection) || used.has(selection)) {
        addIssue(issues, context, {
          code: 'pf2e-invalid-ancestry-boost',
          severity: 'warning',
          path: `system.ancestryAbilityBoostSelections.${offset + index}`,
          message: `Ancestry boost '${selection}' is not a legal (or is a duplicate) choice for ${ancestry.name}.`,
          recoverable: true,
          details: { selection, options: increase.choice.options },
        });
        continue;
      }
      used.add(selection);
    }

    offset += increase.choice.count;
  });

  if (selections.filter((selection) => selection !== '').length > offset) {
    addIssue(issues, context, {
      code: 'pf2e-ancestry-boost-overflow',
      severity: 'warning',
      path: 'system.ancestryAbilityBoostSelections',
      message: `${ancestry.name} grants ${offset} chosen boost(s), but more selections are stored.`,
      recoverable: true,
      details: { allowed: offset, stored: selections.length },
    });
  }
}

/**
 * Background boosts are `[restricted, free]` (CRB: one limited boost from the
 * background's pair, one free boost) — the exact shape
 * sanitizeBackgroundAbilityBoostSelections enforces in pf2eTemplate.ts.
 */
function validateBackgroundBoosts(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  validationData: Pf2eValidationData
) {
  const selections = system.backgroundAbilityBoostSelections ?? [];
  if (selections.length === 0 || !system.backgroundId) {
    return;
  }

  const background = validationData.backgroundsById.get(system.backgroundId);
  if (!background) {
    return;
  }

  const [restricted, free] = selections;

  if (restricted && !background.abilityBoosts.options.includes(restricted)) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-background-boost',
      severity: 'warning',
      path: 'system.backgroundAbilityBoostSelections.0',
      message: `Background boost '${restricted}' is not one of ${background.name}'s options.`,
      recoverable: true,
      details: { selection: restricted, options: background.abilityBoosts.options },
    });
  }

  if (
    free &&
    (!PF2E_ABILITY_IDS.includes(free as (typeof PF2E_ABILITY_IDS)[number]) || free === restricted)
  ) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-background-boost',
      severity: 'warning',
      path: 'system.backgroundAbilityBoostSelections.1',
      message: `Free background boost '${free}' must be a distinct ability score.`,
      recoverable: true,
      details: { selection: free, restricted },
    });
  }

  if (selections.filter((selection) => selection !== '').length > 2) {
    addIssue(issues, context, {
      code: 'pf2e-background-boost-overflow',
      severity: 'warning',
      path: 'system.backgroundAbilityBoostSelections',
      message: `${background.name} grants two boosts (one restricted, one free), but more selections are stored.`,
      recoverable: true,
      details: { stored: selections.length },
    });
  }
}

function validateSpellcasting(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  validationData: Pf2eValidationData
) {
  const spellcasting = system.spellcasting;
  if (!spellcasting) {
    return;
  }

  validateSpellIds(
    issues,
    context,
    spellcasting.spellsKnown ?? [],
    spellcasting,
    validationData,
    'system.spellcasting.spellsKnown'
  );
  validateSpellIds(
    issues,
    context,
    spellcasting.alwaysPreparedSpellIds ?? [],
    spellcasting,
    validationData,
    'system.spellcasting.alwaysPreparedSpellIds'
  );

  validatePreparedRanks(issues, context, spellcasting, validationData);
  validateSpellSlots(issues, context, spellcasting);
  validateClassSlotConsistency(issues, context, system, spellcasting, validationData);
  validateFocusSurfaces(issues, context, spellcasting);
}

function validateSpellIds(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellIds: string[],
  spellcasting: Pf2eSpellcasting,
  validationData: Pf2eValidationData,
  path: string
) {
  spellIds.forEach((spellId, index) => {
    const spell = validationData.spellsById.get(spellId);

    if (!spell) {
      addIssue(issues, context, {
        code: 'pf2e-unknown-spell',
        severity: 'error',
        path: `${path}.${index}`,
        message: `Spell '${spellId}' is not in the loader-backed PF2e spell catalog.`,
        recoverable: true,
        details: { spellId },
      });
      return;
    }

    validateSpellTradition(issues, context, spell, spellcasting, `${path}.${index}`);
  });
}

/**
 * The PF2e catalog stores each spell's raw `traditions` array; a spell outside
 * the caster's tradition is annotated, not rejected (uncommon access, scrolls,
 * and archetype grants are legitimate table-level calls).
 */
function validateSpellTradition(
  issues: ValidationIssue[],
  context: ValidationContext,
  spell: Spell,
  spellcasting: Pf2eSpellcasting,
  path: string
) {
  const traditions = spell.traditions ?? [];
  if (traditions.length > 0 && !traditions.includes(spellcasting.tradition)) {
    addIssue(issues, context, {
      code: 'pf2e-spell-tradition-mismatch',
      severity: 'warning',
      path,
      message: `${spell.name} is not on the ${spellcasting.tradition} tradition list (${traditions.join(', ')}).`,
      recoverable: true,
      details: { spellId: spell.id, tradition: spellcasting.tradition, traditions },
    });
  }
}

function validatePreparedRanks(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellcasting: Pf2eSpellcasting,
  validationData: Pf2eValidationData
) {
  Object.entries(spellcasting.preparedSpellsByRank ?? {}).forEach(([rankKey, spellIds]) => {
    const rank = Number(rankKey);
    const path = `system.spellcasting.preparedSpellsByRank.${rankKey}`;

    // Ranks 0 (cantrips) through 10 are all legal spell ranks.
    if (!isIntegerInRange(rank, 0, MAX_SPELL_RANK)) {
      addIssue(issues, context, {
        code: 'pf2e-invalid-prepared-rank',
        severity: 'error',
        path,
        message: `Prepared spell rank must be an integer from 0 through ${MAX_SPELL_RANK}.`,
        recoverable: true,
        details: { rank: rankKey },
      });
      return;
    }

    (spellIds ?? []).forEach((spellId, index) => {
      const spell = validationData.spellsById.get(spellId);

      if (!spell) {
        addIssue(issues, context, {
          code: 'pf2e-unknown-spell',
          severity: 'error',
          path: `${path}.${index}`,
          message: `Spell '${spellId}' is not in the loader-backed PF2e spell catalog.`,
          recoverable: true,
          details: { spellId },
        });
        return;
      }

      // CRB (Heightened Spells): a spell occupies a slot of its rank or
      // higher — it can never be prepared below its base rank.
      if (spell.level > rank) {
        addIssue(issues, context, {
          code: 'pf2e-prepared-rank-below-spell-rank',
          severity: 'warning',
          path: `${path}.${index}`,
          message: `${spell.name} is rank ${spell.level} and cannot be prepared in a rank-${rank} slot.`,
          recoverable: true,
          details: { spellId, spellRank: spell.level, preparedRank: rank },
        });
      }

      validateSpellTradition(issues, context, spell, spellcasting, `${path}.${index}`);
    });
  });
}

function validateSpellSlots(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellcasting: Pf2eSpellcasting
) {
  Object.entries(spellcasting.spellSlots ?? {}).forEach(([rankKey, slot]) => {
    const rank = Number(rankKey);
    const path = `system.spellcasting.spellSlots.${rankKey}`;

    if (!isIntegerInRange(rank, 1, MAX_SPELL_RANK)) {
      addIssue(issues, context, {
        code: 'pf2e-invalid-spell-slot',
        severity: 'error',
        path,
        message: `Spell slot rank must be an integer from 1 through ${MAX_SPELL_RANK}.`,
        recoverable: true,
        details: { rank: rankKey },
      });
      return;
    }

    if (
      !slot ||
      !Number.isFinite(slot.max) ||
      !Number.isFinite(slot.used) ||
      slot.max < 0 ||
      slot.used < 0 ||
      slot.used > slot.max
    ) {
      addIssue(issues, context, {
        code: 'pf2e-invalid-spell-slot',
        severity: 'error',
        path,
        message: `Spell slot rank ${rank} must have non-negative numeric max/used with used ≤ max.`,
        recoverable: true,
        details: { rank, ...(slot ?? {}) },
      });
    }
  });
}

/**
 * Prepared-slot ranks must be consistent with the class's own slot
 * progression (ranks 1-9; rank 10 stays a manual class-feature surface).
 */
function validateClassSlotConsistency(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  spellcasting: Pf2eSpellcasting,
  validationData: Pf2eValidationData
) {
  const classData = system.classId ? validationData.classesById.get(system.classId) : undefined;
  const progression = classData?.spellcasting?.spellSlots;
  const levelIndex =
    Math.min(Math.max(Math.trunc(system.level), MIN_CHARACTER_LEVEL), MAX_CHARACTER_LEVEL) - 1;

  if (progression) {
    CLASS_PROGRESSION_RANKS.forEach((rank) => {
      const slot = spellcasting.spellSlots?.[rank];
      const classMax = progression[rank]?.[levelIndex] ?? 0;

      if (slot && Number.isFinite(slot.max) && slot.max > 0 && classMax === 0) {
        addIssue(issues, context, {
          code: 'pf2e-slot-rank-above-class',
          severity: 'warning',
          path: `system.spellcasting.spellSlots.${rank}`,
          message: `${classData?.name ?? system.classId} grants no rank-${rank} slots at level ${system.level}.`,
          recoverable: true,
          details: { rank, slotMax: slot.max, classMax, level: system.level },
        });
      }
    });
  }

  // Prepared casters cannot prepare more spells in a rank than they have
  // slots of that rank (cantrip prep at rank 0 has no slot pool to check).
  if (spellcasting.type === 'prepared') {
    Object.entries(spellcasting.preparedSpellsByRank ?? {}).forEach(([rankKey, spellIds]) => {
      const rank = Number(rankKey);
      if (!isIntegerInRange(rank, 1, MAX_SPELL_RANK)) {
        return;
      }

      const slotMax = spellcasting.spellSlots?.[rank]?.max ?? 0;
      const preparedCount = (spellIds ?? []).length;
      if (preparedCount > slotMax) {
        addIssue(issues, context, {
          code: 'pf2e-prepared-over-slot-capacity',
          severity: 'warning',
          path: `system.spellcasting.preparedSpellsByRank.${rankKey}`,
          message: `${preparedCount} spell(s) are prepared at rank ${rank}, but only ${slotMax} slot(s) exist.`,
          recoverable: true,
          details: { rank, preparedCount, slotMax },
        });
      }
    });
  }
}

/**
 * Focus spells have no catalog automation in this product — the list is a
 * manual surface, so its ids are deliberately NOT validated. Only the focus
 * pool bounds (CRB: at most 3 Focus Points) are checked.
 */
function validateFocusSurfaces(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellcasting: Pf2eSpellcasting
) {
  const focusPoints = spellcasting.focusPoints;
  if (
    focusPoints &&
    (!Number.isFinite(focusPoints.current) ||
      !Number.isFinite(focusPoints.max) ||
      focusPoints.current < 0 ||
      focusPoints.max < 0 ||
      focusPoints.current > focusPoints.max ||
      focusPoints.max > FOCUS_POOL_MAX)
  ) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-focus-points',
      severity: 'warning',
      path: 'system.spellcasting.focusPoints',
      message: `Focus pool must satisfy 0 ≤ current ≤ max ≤ ${FOCUS_POOL_MAX}.`,
      recoverable: true,
      details: { ...focusPoints },
    });
  }

  if ((spellcasting.focusSpells ?? []).length > 0) {
    addIssue(issues, context, {
      code: 'pf2e-focus-spells-manual',
      severity: 'info',
      path: 'system.spellcasting.focusSpells',
      message: 'Focus spells are a manual surface and are not checked against the spell catalog.',
      recoverable: true,
      details: { count: spellcasting.focusSpells.length },
    });
  }
}

/**
 * Bulk state consistency — warnings only. Totals use the same CRB Bulk-limit
 * math the sheet renders (getPf2eBulkState, CRB p.272).
 */
function validateBulk(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel
) {
  let totalBulk = 0;
  let entriesValid = true;

  (system.equipment ?? []).forEach((item, index) => {
    if (!Number.isFinite(item.bulk) || item.bulk < 0) {
      entriesValid = false;
      addIssue(issues, context, {
        code: 'pf2e-invalid-bulk-entry',
        severity: 'warning',
        path: `system.equipment.${index}.bulk`,
        message: `Equipment '${item.name}' has a negative or non-numeric Bulk value.`,
        recoverable: true,
        details: { itemId: item.itemId, bulk: item.bulk },
      });
      return;
    }
    totalBulk += item.bulk;
  });

  (system.inventory ?? []).forEach((item, index) => {
    if (
      !Number.isFinite(item.bulk) ||
      item.bulk < 0 ||
      !Number.isFinite(item.quantity) ||
      item.quantity < 0
    ) {
      entriesValid = false;
      addIssue(issues, context, {
        code: 'pf2e-invalid-bulk-entry',
        severity: 'warning',
        path: `system.inventory.${index}`,
        message: `Inventory item '${item.name}' has a negative or non-numeric Bulk/quantity.`,
        recoverable: true,
        details: { itemId: item.itemId, bulk: item.bulk, quantity: item.quantity },
      });
      return;
    }
    totalBulk += item.bulk * item.quantity;
  });

  if (!entriesValid) {
    return;
  }

  const strengthScore = system.baseAttributes?.str ?? 10;
  const strengthModifier = Math.floor((strengthScore - 10) / 2);
  const bulkState = getPf2eBulkState(totalBulk, strengthModifier);

  if (bulkState.isOverloaded) {
    addIssue(issues, context, {
      code: 'pf2e-bulk-overloaded',
      severity: 'warning',
      path: 'system.inventory',
      message: `Carried Bulk ${totalBulk} exceeds the maximum of ${bulkState.maxBulk} (10 + Str modifier).`,
      recoverable: true,
      details: { totalBulk, maxBulk: bulkState.maxBulk },
    });
  } else if (bulkState.isEncumbered) {
    addIssue(issues, context, {
      code: 'pf2e-bulk-encumbered',
      severity: 'info',
      path: 'system.inventory',
      message: `Carried Bulk ${totalBulk} exceeds the encumbered threshold of ${bulkState.encumbered} (5 + Str modifier).`,
      recoverable: true,
      details: { totalBulk, encumbered: bulkState.encumbered },
    });
  }
}

/**
 * Open-content source compliance (openContentPolicy): a feat's `source` must
 * either pass the strict PF2e open-content whitelist or be a template
 * provenance label (the granting background/ancestry/class/archetype name the
 * template pipeline records). Anything else is annotated, never blocked.
 */
function validateFeatOpenContent(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel,
  validationData: Pf2eValidationData
) {
  (system.feats ?? []).forEach((feat, index) => {
    if (validationData.templateProvenanceLabels.has(feat.source)) {
      return;
    }

    if (!isOpenContentCompliant(PF2E_SYSTEM_ID, 'feats', feat)) {
      addIssue(issues, context, {
        code: 'pf2e-feat-source-not-open-content',
        severity: 'warning',
        path: `system.feats.${index}.source`,
        message: `Feat '${feat.name}' cites '${feat.source || '(none)'}', which is not a recognized open-content source.`,
        recoverable: true,
        details: { featId: feat.id, source: feat.source },
      });
    }
  });
}

/**
 * First runtime caller of the PF2e build-legality validator
 * (src/rules/legality/pf2e.ts): every BuildViolation (level-1 ability ≤ 18,
 * level + tier proficiency budget) surfaces as a warning-severity issue.
 */
function validateBuildLegality(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Pf2eDataModel
) {
  const legality = validatePf2eBuild(system, PF2E_SYSTEM_ID);
  if (legality.legal) {
    return;
  }

  legality.violations.forEach((violation) => {
    addIssue(issues, context, {
      code: 'pf2e-build-legality',
      severity: 'warning',
      path: 'system',
      message: `${violation.label}: ${violation.value} exceeds the legal limit of ${violation.limit} (${violation.rule}).`,
      recoverable: true,
      details: { ...violation },
    });
  });
}

function toIdMap<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
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
