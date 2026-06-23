/**
 * d20 legacy (D&D 3.5e + Pathfinder 1e) creation "apply a choice + validate"
 * core — the applicator-dependent half of the shared d20-legacy orchestrator,
 * split out so the heavy templates stay OUT of the eager first-paint shell (the
 * registry-reachable `d20LegacyCreation.ts` `import()`s this only when the user
 * applies a choice). Mirrors `dnd5eApply.ts` / `pf2eApply.ts`.
 *
 * One flow serves both 3.5e and PF1e (they share `classLevels` + `speciesId` and
 * the same applicators), exactly as the 5e flow serves 2014 + 2024. The d20-legacy
 * applicators are typed as concrete overloads (3.5e / PF1e) rather than a public
 * union generic, so the working document is carried as the structurally-shared
 * `Dnd35eDataModel`; the applicator impl is generic and keys off `document.systemId`
 * at runtime, so this is sound for PF1e drafts too.
 *
 * It reuses the EXACT applicators manual sheet editing uses
 * (`applyD20LegacyRaceTemplate` / `applyD20LegacyClassTemplate`) — no parallel
 * creation rules. A selection is loaded from the candidate pool, applied onto the
 * draft's working document (un-applying the prior choice of that kind first), and
 * the result is validated; the new system data + issues fold back into the draft
 * via `withResolvedSystem`. Loaders and the validator are injectable for testing.
 */
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import type { ValidationIssue, ValidationResult } from '../registry/types';
import type { Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { systemRegistry } from '../registry';
import { loadClassesForSystem, loadSpeciesForSystem } from '../utils/dataLoader';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
  removeD20LegacyClassTemplate,
} from '../utils/d20LegacyTemplate';
import { setSelection, withResolvedSystem, type CreationDraft } from './creationDraft';

export type D20LegacyCreationSelection =
  | { kind: 'race'; raceId: string }
  | { kind: 'class'; classId: string; level: number };

/** Injectable data/validation dependencies (real ones by default). */
export interface D20LegacyCreationDeps {
  loadRaces: (systemId: string) => Promise<Species[]>;
  loadClasses: (systemId: string) => Promise<CharacterClass[]>;
  validate: (document: CharacterDocument) => Promise<ValidationResult>;
}

export const defaultD20LegacyCreationDeps: D20LegacyCreationDeps = {
  // The draft carries a generic `string` systemId while the loaders are typed to
  // the `GameSystemId` union; bridge the two here (an unregistered id degrades to
  // an empty catalog, so the orchestrator reports it as an unknown-choice issue).
  loadRaces: (systemId) => loadSpeciesForSystem(systemId as GameSystemId),
  loadClasses: (systemId) => loadClassesForSystem(systemId as GameSystemId),
  validate: (document) => systemRegistry.validateDocument(document, { reason: 'creation' }),
};

/** Wrap a draft's working system data in a CharacterDocument the applicators accept. */
function draftDocument(draft: CreationDraft): CharacterDocument<Dnd35eDataModel> {
  return {
    id: draft.id,
    name: draft.name,
    systemId: draft.systemId,
    system: draft.system as Dnd35eDataModel,
    createdAt: new Date(draft.createdAt),
    updatedAt: new Date(draft.createdAt),
  };
}

function unknownIdIssue(message: string): ValidationIssue {
  return { code: 'creation-unknown-choice', message, severity: 'error', recoverable: true };
}

/**
 * Apply one d20-legacy creation selection onto the draft and validate the result.
 * An id not in the candidate pool is reported as an error issue WITHOUT mutating
 * the draft (so the creator can re-prompt); a valid choice applies through the
 * shared template applicators and the draft absorbs the new system data + issues.
 */
export async function applyD20LegacyCreationSelection(
  draft: CreationDraft,
  selection: D20LegacyCreationSelection,
  deps: D20LegacyCreationDeps = defaultD20LegacyCreationDeps
): Promise<CreationDraft> {
  const document = draftDocument(draft);

  if (selection.kind === 'race') {
    const races = await deps.loadRaces(draft.systemId);
    const race = races.find((entry) => entry.id === selection.raceId);
    if (!race) {
      return withResolvedSystem(draft, draft.system, [
        unknownIdIssue(`Race '${selection.raceId}' is not in the ${draft.systemId} catalog.`),
      ]);
    }
    const previous = races.find((entry) => entry.id === draft.selections.speciesId);
    const next = applyD20LegacyRaceTemplate(document, race, previous);
    return recordAndValidate(
      draft,
      next.system,
      { speciesId: selection.raceId, speciesName: race.name },
      deps
    );
  }

  const classes = await deps.loadClasses(draft.systemId);
  const classData = classes.find((entry) => entry.id === selection.classId);
  if (!classData) {
    return withResolvedSystem(draft, draft.system, [
      unknownIdIssue(`Class '${selection.classId}' is not in the ${draft.systemId} catalog.`),
    ]);
  }
  const previousClassId =
    typeof draft.selections.classId === 'string' ? draft.selections.classId : undefined;
  let next = document;
  // Replace the prior class wholesale so re-picking yields a single clean class.
  if (previousClassId && previousClassId !== selection.classId) {
    next = removeD20LegacyClassTemplate(next, previousClassId);
  }
  next = applyD20LegacyClassTemplate(
    next,
    classData,
    selection.level,
    previousClassId === selection.classId
      ? { mode: 'replace', targetClassId: selection.classId }
      : { mode: 'add' }
  );
  return recordAndValidate(
    draft,
    next.system,
    { classId: selection.classId, classLevel: selection.level, className: classData.name },
    deps
  );
}

async function recordAndValidate(
  draft: CreationDraft,
  system: Dnd35eDataModel,
  selections: Record<string, unknown>,
  deps: D20LegacyCreationDeps
): Promise<CreationDraft> {
  let next = draft;
  for (const [key, value] of Object.entries(selections)) {
    next = setSelection(next, key, value);
  }
  const document: CharacterDocument = {
    id: next.id,
    name: next.name,
    systemId: next.systemId,
    system: system as SystemDataModel,
    createdAt: new Date(next.createdAt),
    updatedAt: new Date(next.createdAt),
  };
  const validation = await deps.validate(document);
  return withResolvedSystem(next, system, validation.issues);
}
