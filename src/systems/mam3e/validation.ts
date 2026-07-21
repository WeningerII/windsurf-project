/**
 * Mutants & Masterminds 3e document validator (registry `SystemValidator`).
 *
 * The first non-d20 validator: every check derives from M&M's own point-buy
 * rules (Hero's Handbook, DHH open content) via the engine math that already
 * computes them — nothing here assumes classes, levels, spell slots, or any
 * other d20 shape. Checks are cited against the mam3e compute register
 * (docs/compute-register/mam3e.ts):
 *
 * - PL caps (`mam3e.L9.pl-cap-*`): the engine's prepareData already computes
 *   attack+effect and defense trade-off violations; they surface here as
 *   issues.
 * - Point totals (`mam3e.L9.pp-budget-conservation`, `mam3e.L7.
 *   starting-power-points`): spent vs. total budget, and total vs. 15 × PL.
 * - Cost arithmetic (`mam3e.L9.cost-*`, `mam3e.L9.power-cost`): stored spent
 *   buckets vs. the engine's recomputed ability/defense/skill/advantage/power
 *   costs.
 * - Catalog references: advantage and power ids must exist in the
 *   loader-backed catalogs; power extras/flaws must be known modifiers.
 * - Complication floor: heroes need complications (Hero's Handbook,
 *   Complications — a motivation plus at least one more). Warning only.
 * - Open-content source compliance: declared `source` strings on embedded
 *   powers/complications must pass `strictOpenContentPolicy.mam3e`.
 *
 * Deliberate accepted boundaries (never issues):
 * - Power DESCRIPTORS are freeform by RAW (Hero's Handbook, Powers —
 *   Descriptors): any string is legal flavor and is never validated.
 * - Pinned reference archetypes (`selectedArchetypeIds`) are browse aids
 *   only; an archetype's own powers/advantages are NEVER validated as if the
 *   character had bought them. At most an unknown pinned id gets an `info`
 *   annotation.
 *
 * Severity policy: this validator warns and annotates, it never blocks — the
 * maximum severity emitted is 'warning' (GM-granted extra points, house
 * rules, and in-progress builds are all normal M&M play).
 */
import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { Advantage } from '../../types/mam/advantages';
import {
  loadAdvantagesForSystem,
  loadMam3eArchetypesForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { isOpenContentCompliant } from '../../utils/openContentPolicy';
import type { Mam3eDataModel } from './data-model';
import { Mam3eEngine } from './engine';
import { mam3eStartingPowerPoints } from './derivedMath';
import { MAM3E_MODIFIER_BY_ID, sumMam3ePointsSpent } from './powerMath';

const MAM3E_SYSTEM_ID = 'mam3e';

/**
 * Hero's Handbook, Complications: heroes have a motivation plus at least one
 * more complication. Missing them entirely is a warning; having only one is
 * an informational nudge.
 */
const RAW_COMPLICATION_FLOOR = 2;

const SPENT_BUCKETS = ['abilities', 'powers', 'advantages', 'skills', 'defenses'] as const;

type Mam3eValidationData = {
  powerIds: Set<string>;
  advantagesById: Map<string, Advantage>;
  archetypeIds: Set<string>;
};

// The engine is the single source of point-buy truth; the validator reuses its
// prepareData (pure — it clones and never mutates its input) to recompute
// costs and PL-cap violations.
const engine = new Mam3eEngine();

export function createMam3eValidator(): SystemValidator<Mam3eDataModel> {
  return {
    validateDocument: (document, context) => validateMam3eDocument(document, context),
  };
}

async function validateMam3eDocument(
  document: CharacterDocument<Mam3eDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const validationData = await loadValidationData();
  const system = document.system;

  if (document.systemId !== MAM3E_SYSTEM_ID) {
    addIssue(issues, context, {
      code: 'mam3e-system-mismatch',
      severity: 'warning',
      path: 'systemId',
      message: `Expected ${MAM3E_SYSTEM_ID} but document is '${document.systemId}'.`,
      recoverable: true,
    });
  }

  const prepared = engine.prepareData(document).system;

  validatePowerLevel(issues, context, system.powerLevel);
  validatePlCaps(issues, context, system, prepared);
  validatePointTotals(issues, context, system, prepared);
  validateSpentArithmetic(issues, context, system, prepared);
  validatePurchasedRanks(issues, context, system);
  validatePowers(issues, context, system, validationData);
  validateAdvantages(issues, context, system, validationData);
  validateComplications(issues, context, system);
  validateArchetypePins(issues, context, system, validationData);

  return { issues };
}

async function loadValidationData(): Promise<Mam3eValidationData> {
  // M&M powers ship through the shared spells loader (see dataLoader's
  // `loadSpellsForSystem` mam3e branch); loaders already filter to
  // open-content-compliant entries, so catalog membership implies compliant
  // provenance.
  const [powers, advantages, archetypes] = await Promise.all([
    loadSpellsForSystem(MAM3E_SYSTEM_ID),
    loadAdvantagesForSystem(MAM3E_SYSTEM_ID),
    loadMam3eArchetypesForSystem(MAM3E_SYSTEM_ID),
  ]);

  return {
    powerIds: new Set(powers.map((power) => power.id)),
    advantagesById: new Map(advantages.map((advantage) => [advantage.id, advantage])),
    archetypeIds: new Set(archetypes.map((archetype) => archetype.id)),
  };
}

function validatePowerLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  powerLevel: number
) {
  if (!Number.isInteger(powerLevel) || powerLevel < 1) {
    addIssue(issues, context, {
      code: 'mam3e-invalid-power-level',
      severity: 'warning',
      path: 'system.powerLevel',
      message: 'Power level should be a positive integer (campaign standard is PL 10).',
      recoverable: true,
      details: { value: powerLevel },
    });
  }
}

/**
 * Surface the engine's PL-cap violations (compute register
 * `mam3e.L9.pl-cap-dodge-toughness` / `-parry-toughness` / `-fortitude-will` /
 * `-close-attack` / `-ranged-attack` / `-perception`). Coverage is the
 * engine's: partial by design — see the data model's `plViolations` note.
 */
function validatePlCaps(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel,
  prepared: Mam3eDataModel
) {
  (prepared.plViolations ?? []).forEach((violation) => {
    addIssue(issues, context, {
      code: 'mam3e-pl-cap-exceeded',
      severity: 'warning',
      path: 'system.plViolations',
      message: `${violation.label} is ${violation.value}, above the PL ${system.powerLevel} cap of ${violation.limit}.`,
      recoverable: true,
      details: { ...violation, powerLevel: system.powerLevel },
    });
  });
}

/**
 * Point-total checks (compute register `mam3e.L9.pp-budget-conservation` and
 * `mam3e.L7.starting-power-points`): spending more than the budget is a
 * warning; a budget that differs from 15 × PL is only an annotation, since
 * GM-awarded earned power points legitimately raise the total.
 */
function validatePointTotals(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel,
  prepared: Mam3eDataModel
) {
  const total = system.powerPoints.total;
  const computedSpent = sumMam3ePointsSpent(prepared.powerPoints.spent);

  if (computedSpent > total) {
    addIssue(issues, context, {
      code: 'mam3e-points-over-budget',
      severity: 'warning',
      path: 'system.powerPoints',
      message: `Build spends ${computedSpent} power points but the budget is ${total}.`,
      recoverable: true,
      details: { spent: computedSpent, total, remaining: total - computedSpent },
    });
  }

  const startingBudget = mam3eStartingPowerPoints(system.powerLevel);
  if (Number.isInteger(system.powerLevel) && system.powerLevel >= 1 && total !== startingBudget) {
    addIssue(issues, context, {
      code: 'mam3e-nonstandard-budget',
      severity: 'info',
      path: 'system.powerPoints.total',
      message: `Budget is ${total} PP; a starting PL ${system.powerLevel} hero gets ${startingBudget} PP (15 × PL). Earned power points are the usual reason.`,
      recoverable: true,
      details: { total, startingBudget, powerLevel: system.powerLevel },
    });
  }
}

/**
 * Cost-arithmetic consistency (compute register `mam3e.L9.cost-abilities`,
 * `cost-defenses`, `cost-skills`, `cost-advantages`, `power-cost`): the stored
 * spent buckets must match what the engine recomputes from ranks and powers.
 */
function validateSpentArithmetic(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel,
  prepared: Mam3eDataModel
) {
  SPENT_BUCKETS.forEach((bucket) => {
    const stored = system.powerPoints.spent[bucket];
    const computed = prepared.powerPoints.spent[bucket];
    if (stored !== computed) {
      addIssue(issues, context, {
        code: 'mam3e-spent-mismatch',
        severity: 'warning',
        path: `system.powerPoints.spent.${bucket}`,
        message: `Stored ${bucket} cost is ${stored} PP, but the point-buy math gives ${computed} PP.`,
        recoverable: true,
        details: { bucket, stored, computed },
      });
    }
  });
}

/**
 * Negative ability ranks are legal in M&M 3e; negative PURCHASED defense or
 * skill ranks are not — they would refund points (the engine clamps them when
 * computing, so flag the stored data).
 */
function validatePurchasedRanks(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel
) {
  (Object.keys(system.defenses) as Array<keyof Mam3eDataModel['defenses']>).forEach((defense) => {
    if (system.defenses[defense].rank < 0) {
      addIssue(issues, context, {
        code: 'mam3e-negative-purchased-rank',
        severity: 'warning',
        path: `system.defenses.${defense}.rank`,
        message: `Purchased ${defense} rank is negative; bought ranks cannot go below 0.`,
        recoverable: true,
        details: { trait: defense, rank: system.defenses[defense].rank },
      });
    }
  });

  Object.entries(system.skills).forEach(([skillId, skill]) => {
    if (skill.rank < 0) {
      addIssue(issues, context, {
        code: 'mam3e-negative-purchased-rank',
        severity: 'warning',
        path: `system.skills.${skillId}.rank`,
        message: `Purchased ${skillId} rank is negative; bought ranks cannot go below 0.`,
        recoverable: true,
        details: { trait: skillId, rank: skill.rank },
      });
    }
  });
}

function validatePowers(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel,
  validationData: Mam3eValidationData
) {
  system.powers.forEach((power, index) => {
    const path = `system.powers.${index}`;

    if (!validationData.powerIds.has(power.id)) {
      addIssue(issues, context, {
        code: 'mam3e-unknown-power',
        severity: 'warning',
        path: `${path}.id`,
        message: `Power effect '${power.id}' is not in the loader-backed powers catalog.`,
        recoverable: true,
        details: { powerId: power.id },
      });
    }

    [...(power.extras ?? []), ...(power.flaws ?? [])].forEach((modifierId) => {
      if (!MAM3E_MODIFIER_BY_ID.has(modifierId)) {
        addIssue(issues, context, {
          code: 'mam3e-unknown-power-modifier',
          severity: 'warning',
          path: `${path}.modifiers`,
          message: `Modifier '${modifierId}' on '${power.name}' is not a known extra or flaw; it is ignored by the cost math.`,
          recoverable: true,
          details: { powerId: power.id, modifierId },
        });
      }
    });

    // power.descriptors is deliberately NOT validated: descriptors are
    // freeform by RAW (any flavor string is legal) — an enumerated accepted
    // boundary, never an issue.

    validateOpenContentSource(issues, context, 'powers', power, power.name, `${path}.source`);
  });
}

function validateAdvantages(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel,
  validationData: Mam3eValidationData
) {
  system.advantages.forEach((advantage, index) => {
    const path = `system.advantages.${index}`;
    const definition = validationData.advantagesById.get(advantage.id);

    if (!definition) {
      addIssue(issues, context, {
        code: 'mam3e-unknown-advantage',
        severity: 'warning',
        path: `${path}.id`,
        message: `Advantage '${advantage.id}' is not in the loader-backed advantages catalog.`,
        recoverable: true,
        details: { advantageId: advantage.id },
      });
      return;
    }

    const rank = advantage.rank ?? 1;
    if (!definition.ranked && rank > 1) {
      addIssue(issues, context, {
        code: 'mam3e-advantage-rank',
        severity: 'warning',
        path: `${path}.rank`,
        message: `${definition.name} is not a ranked advantage; rank ${rank} has no effect beyond 1.`,
        recoverable: true,
        details: { advantageId: advantage.id, rank },
      });
    } else if (definition.maxRanks != null && rank > definition.maxRanks) {
      addIssue(issues, context, {
        code: 'mam3e-advantage-rank',
        severity: 'warning',
        path: `${path}.rank`,
        message: `${definition.name} caps at ${definition.maxRanks} ranks; build has ${rank}.`,
        recoverable: true,
        details: { advantageId: advantage.id, rank, maxRanks: definition.maxRanks },
      });
    }
  });
}

function validateComplications(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel
) {
  const count = system.complications.length;

  if (count < RAW_COMPLICATION_FLOOR) {
    addIssue(issues, context, {
      code: 'mam3e-complication-floor',
      severity: count === 0 ? 'warning' : 'info',
      path: 'system.complications',
      message:
        count === 0
          ? 'Heroes need complications: a motivation plus at least one more (they also earn hero points).'
          : 'Heroes usually have at least two complications: a motivation plus one more.',
      recoverable: true,
      details: { count, floor: RAW_COMPLICATION_FLOOR },
    });
  }

  system.complications.forEach((complication, index) => {
    validateOpenContentSource(
      issues,
      context,
      'complications',
      complication,
      complication.name,
      `system.complications.${index}.source`
    );
  });
}

/**
 * Pinned archetypes are reference-only browse aids: their contents are NEVER
 * validated as unbuilt character content. The only annotation is an `info`
 * when a pinned id is not in the archetype catalog.
 */
function validateArchetypePins(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Mam3eDataModel,
  validationData: Mam3eValidationData
) {
  (system.selectedArchetypeIds ?? []).forEach((archetypeId, index) => {
    if (!validationData.archetypeIds.has(archetypeId)) {
      addIssue(issues, context, {
        code: 'mam3e-unknown-archetype',
        severity: 'info',
        path: `system.selectedArchetypeIds.${index}`,
        message: `Pinned archetype '${archetypeId}' is not in the loader-backed archetype catalog.`,
        recoverable: true,
        details: { archetypeId },
      });
    }
  });
}

/**
 * Open-content compliance for embedded items that declare a source: a declared
 * source must pass `strictOpenContentPolicy.mam3e`. Items with no declared
 * source are treated as user-authored homebrew and left alone.
 */
function validateOpenContentSource(
  issues: ValidationIssue[],
  context: ValidationContext,
  category: 'powers' | 'complications',
  item: { source?: string },
  itemName: string,
  path: string
) {
  const source = item.source?.trim();
  if (!source) return;

  if (!isOpenContentCompliant(MAM3E_SYSTEM_ID, category, item)) {
    addIssue(issues, context, {
      code: 'mam3e-closed-content-source',
      severity: 'warning',
      path,
      message: `'${itemName}' cites source '${source}', which is not in the mam3e open-content allowlist.`,
      recoverable: true,
      details: { category, source },
    });
  }
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;

  issues.push(source ? { ...issue, source } : issue);
}
