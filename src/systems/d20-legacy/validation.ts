/**
 * d20 legacy (D&D 3.5e + Pathfinder 1e) validator (registry `SystemValidator`).
 *
 * One validator for both systems (they share the d20-legacy data model), mirroring
 * the shared engine/creation orchestrator. Checks the structural legality a build
 * must satisfy: character level bounds, race + class ids resolve against the
 * loader-backed catalog, per-class level bounds, and that the class levels sum to
 * the character level (the d20 multiclass rule). Catalog ids come from the same
 * loaders the rest of the system uses — no parallel content list.
 *
 * Like 5e, this warns/annotates rather than globally blocking: a missing class is
 * a recoverable warning (an in-progress build), while an id that does not exist or
 * an out-of-range level is an error.
 */
import type {
  SystemValidator,
  ValidationContext,
  ValidationIssue,
  ValidationResult,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { loadClassesForSystem, loadSpeciesForSystem } from '../../utils/dataLoader';
import type { Dnd35eDataModel } from '../dnd35e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';

type D20LegacyValidationModel = Dnd35eDataModel | Pf1eDataModel;

const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

function addIssue(issues: ValidationIssue[], context: ValidationContext, issue: ValidationIssue) {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}

export function createD20LegacyValidator<T extends D20LegacyValidationModel>(
  systemId: 'dnd-3.5e' | 'pf1e'
): SystemValidator<T> {
  return {
    validateDocument: (document, context) => validateD20LegacyDocument(document, systemId, context),
  };
}

async function validateD20LegacyDocument<T extends D20LegacyValidationModel>(
  document: CharacterDocument<T>,
  expectedSystemId: 'dnd-3.5e' | 'pf1e',
  context: ValidationContext
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  if (document.systemId !== expectedSystemId) {
    addIssue(issues, context, {
      code: 'd20-legacy-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${expectedSystemId} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const [classes, species] = await Promise.all([
    loadClassesForSystem(expectedSystemId as GameSystemId),
    loadSpeciesForSystem(expectedSystemId as GameSystemId),
  ]);
  const classIds = new Set(classes.map((entry) => entry.id));
  const speciesIds = new Set(species.map((entry) => entry.id));
  const system = document.system;

  if (!Number.isInteger(system.level) || system.level < MIN_LEVEL || system.level > MAX_LEVEL) {
    addIssue(issues, context, {
      code: 'd20-legacy-invalid-level',
      severity: 'error',
      path: 'level',
      message: `Character level must be a whole number between ${MIN_LEVEL} and ${MAX_LEVEL} (got ${system.level}).`,
      recoverable: true,
    });
  }

  if (system.speciesId && !speciesIds.has(system.speciesId)) {
    addIssue(issues, context, {
      code: 'd20-legacy-unknown-race',
      severity: 'error',
      path: 'speciesId',
      message: `Race '${system.speciesId}' is not in the ${expectedSystemId} catalog.`,
      recoverable: true,
    });
  }

  const classLevels = system.classLevels ?? [];
  if (classLevels.length === 0) {
    addIssue(issues, context, {
      code: 'd20-legacy-missing-class',
      severity: 'warning',
      path: 'classLevels',
      message: 'Add at least one class.',
      recoverable: true,
    });
  }

  let levelSum = 0;
  classLevels.forEach((classLevel, index) => {
    levelSum += classLevel.level;
    if (!classIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'd20-legacy-unknown-class',
        severity: 'error',
        path: `classLevels.${index}.classId`,
        message: `Class '${classLevel.classId}' is not in the ${expectedSystemId} catalog.`,
        recoverable: true,
      });
    }
    if (
      !Number.isInteger(classLevel.level) ||
      classLevel.level < MIN_LEVEL ||
      classLevel.level > MAX_LEVEL
    ) {
      addIssue(issues, context, {
        code: 'd20-legacy-invalid-class-level',
        severity: 'error',
        path: `classLevels.${index}.level`,
        message: `Class '${classLevel.classId}' level must be between ${MIN_LEVEL} and ${MAX_LEVEL} (got ${classLevel.level}).`,
        recoverable: true,
      });
    }
  });

  // d20 multiclass: the character level is the sum of class levels.
  if (classLevels.length > 0 && levelSum !== system.level) {
    addIssue(issues, context, {
      code: 'd20-legacy-level-sum-mismatch',
      severity: 'warning',
      path: 'classLevels',
      message: `Class levels total ${levelSum} but character level is ${system.level}.`,
      recoverable: true,
      details: { levelSum, characterLevel: system.level },
    });
  }

  return { issues };
}
