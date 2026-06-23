/**
 * Daggerheart validator (registry `SystemValidator`).
 *
 * Daggerheart keys its build by name (class / heritage / community) and assigns a
 * fixed trait array at creation, so legality is a mix of catalog resolution and
 * the creation array — both reused from `daggerheartDerived` so the validator
 * never re-states a rule the rest of the system already owns:
 *   - class is required and must resolve to a real class; heritage/community are
 *     encouraged (warning) and, when set, heritage must resolve;
 *   - at level 1 the six traits must be the SRD creation array (+2,+1,+1,0,0,−1) —
 *     all-zero (untouched) is a "not yet assigned" warning, any other mismatch is
 *     an illegal-array error; above level 1 traits may have advanced, so the strict
 *     array check is skipped;
 *   - Hope stays within 0…max.
 *
 * Surfaced through the registry contract (import, sync, edit) and, because
 * Daggerheart has a creation orchestrator, live in the shared creator too. Trait
 * assignment itself happens on the sheet, so an unassigned array warns rather than
 * blocks — matching the "warn/annotate, don't globally block" validator stance.
 */
import type {
  SystemValidator,
  ValidationContext,
  ValidationIssue,
  ValidationResult,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { DaggerheartDataModel } from './data-model';
import {
  DAGGERHEART_MAX_HOPE,
  getDaggerheartStartingTraitArray,
  getSelectedDaggerheartAncestry,
  getSelectedDaggerheartClass,
} from '../../utils/daggerheartDerived';

const DAGGERHEART_SYSTEM_ID = 'daggerheart';

const DAGGERHEART_TRAITS = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
] as const;

function addIssue(issues: ValidationIssue[], context: ValidationContext, issue: ValidationIssue) {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}

function sortedNumbers(values: number[]): number[] {
  return [...values].sort((left, right) => left - right);
}

function arraysEqual(left: number[], right: number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function createDaggerheartValidator(): SystemValidator<DaggerheartDataModel> {
  return {
    validateDocument: (document, context) => validateDaggerheartDocument(document, context),
  };
}

function validateDaggerheartDocument(
  document: CharacterDocument<DaggerheartDataModel>,
  context: ValidationContext
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (document.systemId !== DAGGERHEART_SYSTEM_ID) {
    addIssue(issues, context, {
      code: 'daggerheart-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${DAGGERHEART_SYSTEM_ID} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const system = document.system;

  // Class — required, and must resolve to a real class (stored by name).
  if (!system.class?.trim()) {
    addIssue(issues, context, {
      code: 'daggerheart-missing-class',
      severity: 'error',
      path: 'class',
      message: 'Choose a class.',
      recoverable: true,
    });
  } else if (!getSelectedDaggerheartClass(system)) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-class',
      severity: 'error',
      path: 'class',
      message: `Class '${system.class}' is not a recognised Daggerheart class.`,
      recoverable: true,
    });
  }

  // Heritage (ancestry) — encouraged; when set, must resolve.
  if (!system.heritage?.trim()) {
    addIssue(issues, context, {
      code: 'daggerheart-missing-ancestry',
      severity: 'warning',
      path: 'heritage',
      message: 'Choose an ancestry.',
      recoverable: true,
    });
  } else if (!getSelectedDaggerheartAncestry(system)) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-ancestry',
      severity: 'error',
      path: 'heritage',
      message: `Ancestry '${system.heritage}' is not a recognised Daggerheart ancestry.`,
      recoverable: true,
    });
  }

  // Community — encouraged.
  if (!system.community?.trim()) {
    addIssue(issues, context, {
      code: 'daggerheart-missing-community',
      severity: 'warning',
      path: 'community',
      message: 'Choose a community.',
      recoverable: true,
    });
  }

  // Trait array at creation (level 1): must be the SRD array, in any order.
  if (system.level === 1) {
    const values = DAGGERHEART_TRAITS.map((trait) => system.attributes[trait] ?? 0);
    const expected = getDaggerheartStartingTraitArray();
    if (!arraysEqual(sortedNumbers(values), sortedNumbers(expected))) {
      const untouched = values.every((value) => value === 0);
      addIssue(issues, context, {
        code: untouched ? 'daggerheart-traits-unassigned' : 'daggerheart-illegal-trait-array',
        severity: untouched ? 'warning' : 'error',
        path: 'attributes',
        message: untouched
          ? 'Assign your starting traits (+2, +1, +1, 0, 0, −1) on the sheet.'
          : `Starting traits must be +2, +1, +1, 0, 0, −1 in some order (got ${sortedNumbers(values)
              .reverse()
              .join(', ')}).`,
        recoverable: true,
      });
    }
  }

  // Hope within bounds.
  if (system.hope < 0 || system.hope > DAGGERHEART_MAX_HOPE) {
    addIssue(issues, context, {
      code: 'daggerheart-hope-range',
      severity: 'error',
      path: 'hope',
      message: `Hope must be between 0 and ${DAGGERHEART_MAX_HOPE} (got ${system.hope}).`,
      recoverable: true,
    });
  }

  return { issues };
}
