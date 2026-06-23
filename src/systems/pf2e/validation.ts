/**
 * Pathfinder 2e validator (registry `SystemValidator`).
 *
 * Checks the structural legality of a PF2e build: level bounds and that the
 * ancestry, heritage, background, and class ids resolve against the same
 * loader-backed catalogs the creation flow and sheet use (no parallel content
 * list). Heritage is validated within its ancestry's heritage list. Like 5e, it
 * warns on an incomplete-but-in-progress build (a missing core choice) and errors
 * on an id that does not exist.
 *
 * Ability-boost accounting (the deeper PF2e creation rule) is intentionally out of
 * scope here — the catalog-resolution + level checks are the parity baseline, and
 * boosts are completed/edited on the sheet.
 */
import type {
  SystemValidator,
  ValidationContext,
  ValidationIssue,
  ValidationResult,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import {
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
} from '../../utils/dataLoader';
import type { Pf2eDataModel } from './data-model';

const PF2E_SYSTEM_ID = 'pf2e';
const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

function addIssue(issues: ValidationIssue[], context: ValidationContext, issue: ValidationIssue) {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}

export function createPf2eValidator<T extends Pf2eDataModel>(): SystemValidator<T> {
  return {
    validateDocument: (document, context) => validatePf2eDocument(document, context),
  };
}

async function validatePf2eDocument<T extends Pf2eDataModel>(
  document: CharacterDocument<T>,
  context: ValidationContext
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  if (document.systemId !== PF2E_SYSTEM_ID) {
    addIssue(issues, context, {
      code: 'pf2e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${PF2E_SYSTEM_ID} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const [classes, ancestries, backgrounds] = await Promise.all([
    loadClassesForSystem(PF2E_SYSTEM_ID),
    loadSpeciesForSystem(PF2E_SYSTEM_ID),
    loadPf2eBackgroundsForSystem(PF2E_SYSTEM_ID),
  ]);
  const system = document.system;

  if (!Number.isInteger(system.level) || system.level < MIN_LEVEL || system.level > MAX_LEVEL) {
    addIssue(issues, context, {
      code: 'pf2e-invalid-level',
      severity: 'error',
      path: 'level',
      message: `Character level must be a whole number between ${MIN_LEVEL} and ${MAX_LEVEL} (got ${system.level}).`,
      recoverable: true,
    });
  }

  validateChoice(issues, context, {
    value: system.classId,
    valid: new Set(classes.map((entry) => entry.id)),
    path: 'classId',
    label: 'class',
    missingCode: 'pf2e-missing-class',
    unknownCode: 'pf2e-unknown-class',
  });

  const ancestry = ancestries.find((entry) => entry.id === system.ancestryId);
  validateChoice(issues, context, {
    value: system.ancestryId,
    valid: new Set(ancestries.map((entry) => entry.id)),
    path: 'ancestryId',
    label: 'ancestry',
    missingCode: 'pf2e-missing-ancestry',
    unknownCode: 'pf2e-unknown-ancestry',
  });

  validateChoice(issues, context, {
    value: system.backgroundId,
    valid: new Set(backgrounds.map((entry) => entry.id)),
    path: 'backgroundId',
    label: 'background',
    missingCode: 'pf2e-missing-background',
    unknownCode: 'pf2e-unknown-background',
  });

  // Heritage is a choice WITHIN the ancestry, so validate it against that
  // ancestry's heritage list (only meaningful once the ancestry resolves).
  if (system.heritageId) {
    const heritageIds = new Set((ancestry?.subraces ?? []).map((entry) => entry.id));
    if (!ancestry) {
      addIssue(issues, context, {
        code: 'pf2e-heritage-without-ancestry',
        severity: 'warning',
        path: 'heritageId',
        message: 'A heritage is set but its ancestry is not — choose a matching ancestry.',
        recoverable: true,
      });
    } else if (!heritageIds.has(system.heritageId)) {
      addIssue(issues, context, {
        code: 'pf2e-unknown-heritage',
        severity: 'error',
        path: 'heritageId',
        message: `Heritage '${system.heritageId}' is not a heritage of ${ancestry.name}.`,
        recoverable: true,
      });
    }
  }

  return { issues };
}

function validateChoice(
  issues: ValidationIssue[],
  context: ValidationContext,
  options: {
    value: string | undefined;
    valid: Set<string>;
    path: string;
    label: string;
    missingCode: string;
    unknownCode: string;
  }
): void {
  if (!options.value) {
    addIssue(issues, context, {
      code: options.missingCode,
      severity: 'warning',
      path: options.path,
      message: `Choose ${options.label === 'ancestry' ? 'an' : 'a'} ${options.label}.`,
      recoverable: true,
    });
    return;
  }
  if (!options.valid.has(options.value)) {
    addIssue(issues, context, {
      code: options.unknownCode,
      severity: 'error',
      path: options.path,
      message: `${options.label[0].toUpperCase()}${options.label.slice(1)} '${options.value}' is not in the ${PF2E_SYSTEM_ID} catalog.`,
      recoverable: true,
    });
  }
}
