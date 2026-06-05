import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import { Mam3eEngine } from './engine';
import type { Mam3eDataModel } from './data-model';

/**
 * M&M 3e legality gate (Hero's Handbook, "Power Level" pp.24–25).
 *
 * The engine already derives the hard trait caps (combined attack/effect,
 * Dodge+Toughness, Parry+Toughness, Fortitude+Will, Perception effect) and the
 * power-point ledger during `prepareData`. This validator turns those derived
 * facts into structured, blocking issues so guided creation and AI drafts go
 * through the same legality gate as the sheet — "AI proposes, the rules decide."
 *
 * Standard starting budget is 15 power points per power level. A GM can grant
 * more, so a non-standard total is advisory (warning), but spending past the
 * total or breaking a PL trait cap is illegal (error).
 */

/** Standard build budget: 15 power points per power level (Hero's Handbook p.24). */
const STANDARD_PP_PER_PL = 15;

/** A skill's check bonus (ability + ranks) may not exceed PL + 10 (Hero's Handbook p.24). */
const SKILL_BONUS_OVER_PL = 10;

const ABILITY_IDS: Array<keyof Mam3eDataModel['abilities']> = [
  'str',
  'sta',
  'agi',
  'dex',
  'fgt',
  'int',
  'awe',
  'pre',
];

export function createMam3eValidator(): SystemValidator<Mam3eDataModel> {
  const engine = new Mam3eEngine();
  return {
    validateDocument: (document, context) => validateMam3eDocument(engine, document, context),
  };
}

function validateMam3eDocument(
  engine: Mam3eEngine,
  document: CharacterDocument<Mam3eDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];

  if (document.systemId !== 'mam3e') {
    addIssue(issues, context, {
      code: 'mam3e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected mam3e but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  // Re-derive through the engine so the gate sees the same numbers the sheet
  // shows — never trusting stale `spent`/`plViolations` carried on the document.
  const prepared = engine.prepareData(document);
  const data = prepared.system;

  const powerLevel = validatePowerLevel(issues, context, data.powerLevel);
  validateAbilities(issues, context, data.abilities);
  validatePowerPointBudget(issues, context, data, powerLevel);
  validatePlTraitCaps(issues, context, data);
  validateSkillCaps(issues, context, data, powerLevel);

  return { issues };
}

function validatePowerLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  powerLevel: number
): number {
  if (!Number.isInteger(powerLevel) || powerLevel < 1) {
    addIssue(issues, context, {
      code: 'mam3e-invalid-power-level',
      severity: 'error',
      path: 'system.powerLevel',
      message: 'Power Level must be an integer of at least 1.',
      recoverable: true,
      details: { value: powerLevel },
    });
    // Fall back to a sane PL so downstream cap checks stay meaningful.
    return Number.isFinite(powerLevel) && powerLevel >= 1 ? Math.floor(powerLevel) : 1;
  }
  return powerLevel;
}

function validateAbilities(
  issues: ValidationIssue[],
  context: ValidationContext,
  abilities: Mam3eDataModel['abilities']
) {
  ABILITY_IDS.forEach((abilityId) => {
    const rank = abilities[abilityId];
    if (!Number.isInteger(rank)) {
      addIssue(issues, context, {
        code: 'mam3e-invalid-ability-rank',
        severity: 'error',
        path: `system.abilities.${abilityId}`,
        message: `${abilityId.toUpperCase()} rank must be an integer.`,
        recoverable: true,
        details: { abilityId, value: rank },
      });
    }
  });
}

function validatePowerPointBudget(
  issues: ValidationIssue[],
  context: ValidationContext,
  data: Mam3eDataModel,
  powerLevel: number
) {
  const spent = totalPowerPointsSpent(data);
  const total = data.powerPoints.total;
  const expected = powerLevel * STANDARD_PP_PER_PL;

  if (!Number.isFinite(total) || total < 0) {
    addIssue(issues, context, {
      code: 'mam3e-invalid-pp-total',
      severity: 'error',
      path: 'system.powerPoints.total',
      message: 'Total power points must be a non-negative number.',
      recoverable: true,
      details: { value: total },
    });
    return;
  }

  if (spent > total) {
    addIssue(issues, context, {
      code: 'mam3e-pp-over-budget',
      severity: 'error',
      path: 'system.powerPoints',
      message: `Spent ${spent} power points but only ${total} are available (over by ${spent - total}).`,
      recoverable: true,
      details: { spent, total, over: spent - total },
    });
  }

  if (total !== expected) {
    addIssue(issues, context, {
      code: 'mam3e-nonstandard-budget',
      severity: 'warning',
      path: 'system.powerPoints.total',
      message: `Total of ${total} PP differs from the standard ${expected} (15 × PL ${powerLevel}).`,
      recoverable: true,
      details: { total, expected, powerLevel },
    });
  }
}

function validatePlTraitCaps(
  issues: ValidationIssue[],
  context: ValidationContext,
  data: Mam3eDataModel
) {
  (data.plViolations ?? []).forEach((violation) => {
    addIssue(issues, context, {
      code: 'mam3e-pl-cap-exceeded',
      severity: 'error',
      path: 'system',
      message: `${violation.label} totals ${violation.value}, exceeding the Power Level cap of ${violation.limit}.`,
      recoverable: true,
      details: { ...violation },
    });
  });
}

function validateSkillCaps(
  issues: ValidationIssue[],
  context: ValidationContext,
  data: Mam3eDataModel,
  powerLevel: number
) {
  const cap = powerLevel + SKILL_BONUS_OVER_PL;
  Object.entries(data.skills).forEach(([skillId, skill]) => {
    if (skill.total > cap) {
      addIssue(issues, context, {
        code: 'mam3e-skill-cap-exceeded',
        severity: 'error',
        path: `system.skills.${skillId}`,
        message: `${skillId} bonus ${skill.total} exceeds the Power Level skill cap of ${cap} (PL + 10).`,
        recoverable: true,
        details: { skillId, value: skill.total, limit: cap },
      });
    }
  });
}

function totalPowerPointsSpent(data: Mam3eDataModel): number {
  const spent = data.powerPoints.spent;
  return spent.abilities + spent.defenses + spent.powers + spent.advantages + spent.skills;
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}
