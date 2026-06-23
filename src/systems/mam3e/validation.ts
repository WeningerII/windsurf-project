/**
 * Mutants & Masterminds 3e validator (registry `SystemValidator`).
 *
 * M&M is point-buy on a Power Level budget, so legality is a math check, not a
 * catalog-id check. Rather than re-deriving the rules, this surfaces the EXACT
 * quantities the engine already computes in `prepareData`: the Power Level
 * trade-off caps (`plViolations`) and the power-point budget. Single source of
 * truth — the engine owns the math, the validator reports it through the registry
 * contract (import, sync, edit, AI-draft review).
 *
 * Note: the engine's PL-cap pass is deliberately PARTIAL (see `engine.ts` — skill
 * caps and attack-advantage/modifier contributions are not folded in). This
 * validator inherits that coverage exactly; completing the caps is an engine
 * change (one place), not a parallel rule here.
 */
import type {
  SystemValidator,
  ValidationContext,
  ValidationIssue,
  ValidationResult,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { Mam3eDataModel } from './data-model';
import { Mam3eEngine } from './engine';
import { sumMam3ePointsSpent } from './powerMath';

const MAM3E_SYSTEM_ID = 'mam3e';

function addIssue(issues: ValidationIssue[], context: ValidationContext, issue: ValidationIssue) {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}

export function createMam3eValidator(): SystemValidator<Mam3eDataModel> {
  return {
    validateDocument: (document, context) => validateMam3eDocument(document, context),
  };
}

function validateMam3eDocument(
  document: CharacterDocument<Mam3eDataModel>,
  context: ValidationContext
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (document.systemId !== MAM3E_SYSTEM_ID) {
    addIssue(issues, context, {
      code: 'mam3e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${MAM3E_SYSTEM_ID} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const { powerLevel } = document.system;
  if (!Number.isInteger(powerLevel) || powerLevel < 1) {
    addIssue(issues, context, {
      code: 'mam3e-invalid-power-level',
      severity: 'error',
      path: 'powerLevel',
      message: `Power Level must be a whole number of at least 1 (got ${powerLevel}).`,
      recoverable: true,
    });
  }

  // Reuse the engine's exact derived math: prepareData writes plViolations from
  // the derived defense/skill/effect totals, and recomputes spent power points.
  const prepared = new Mam3eEngine().prepareData(document).system;

  for (const violation of prepared.plViolations ?? []) {
    addIssue(issues, context, {
      code: 'mam3e-pl-cap',
      severity: 'error',
      path: 'defenses',
      message: `${violation.label} (${violation.value}) exceeds the Power Level cap of ${violation.limit}.`,
      recoverable: true,
      details: { label: violation.label, value: violation.value, limit: violation.limit },
    });
  }

  const spent = sumMam3ePointsSpent(prepared.powerPoints.spent);
  if (spent > prepared.powerPoints.total) {
    addIssue(issues, context, {
      code: 'mam3e-over-budget',
      severity: 'error',
      path: 'powerPoints',
      message: `Spent ${spent} power points exceeds the ${prepared.powerPoints.total}-point budget (${spent - prepared.powerPoints.total} over).`,
      recoverable: true,
      details: { spent, total: prepared.powerPoints.total },
    });
  }

  return { issues };
}
