/**
 * D&D 5e creation "apply a choice + validate" core — the applicator-dependent
 * half of the 5e orchestrator, split out so it stays OUT of the eager first-paint
 * shell. The registry-reachable `dnd5eCreation.ts` (imported eagerly by the 5e
 * `SystemDefinition`) only `import()`s this module when the user actually applies
 * a choice in the lazily-loaded creator, so the heavy template applicators never
 * land in the index chunk.
 *
 * It reuses the EXACT applicators manual sheet editing uses
 * (`applyDnd5eClassTemplate` / `applyDnd5eSpeciesTemplate` /
 * `applyDnd5eBackgroundTemplate`) and the registry's 5e validator — no parallel
 * creation rules. A selection is loaded from the candidate pool, applied onto the
 * draft's working document (un-applying the prior choice of that kind first), and
 * the result is validated; the new system data + issues are folded back into the
 * draft via `withResolvedSystem`. Loaders and the validator are injectable so the
 * core is unit-testable without real catalog I/O.
 */
import type { Background } from '../types/character-options/backgrounds';
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import type { ValidationIssue, ValidationResult } from '../registry/types';
import { systemRegistry } from '../registry';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
} from '../utils/dataLoader';
import { applyDnd5eBackgroundTemplate } from '../utils/backgroundTemplate';
import { applyDnd5eClassTemplate, removeDnd5eClassTemplate } from '../utils/classTemplate';
import { applyDnd5eSpeciesTemplate } from '../utils/speciesTemplate';
import type { Dnd5eLikeDataModel } from '../systems/dnd5e/shared/dnd5eSheetShared';
import { setSelection, withResolvedSystem, type CreationDraft } from './creationDraft';

export type Dnd5eCreationSelection =
  | { kind: 'class'; classId: string; level: number }
  | { kind: 'species'; speciesId: string }
  | { kind: 'background'; backgroundId: string };

/** Injectable data/validation dependencies (real ones by default). */
export interface Dnd5eCreationDeps {
  loadClasses: (systemId: string) => Promise<CharacterClass[]>;
  loadSpecies: (systemId: string) => Promise<Species[]>;
  loadBackgrounds: (systemId: string) => Promise<Background[]>;
  validate: (document: CharacterDocument) => Promise<ValidationResult>;
}

export const defaultDnd5eCreationDeps: Dnd5eCreationDeps = {
  // The draft carries a generic `string` systemId while the loaders are typed to
  // the `GameSystemId` union; bridge the two here (an unregistered id degrades to
  // an empty catalog, so the orchestrator reports it as an unknown-choice issue).
  loadClasses: (systemId) => loadClassesForSystem(systemId as GameSystemId),
  loadSpecies: (systemId) => loadSpeciesForSystem(systemId as GameSystemId),
  loadBackgrounds: (systemId) => loadBackgroundsForSystem(systemId as GameSystemId),
  validate: (document) => systemRegistry.validateDocument(document, { reason: 'creation' }),
};

/** Wrap a draft's working system data in a CharacterDocument the applicators accept. */
function draftDocument(draft: CreationDraft): CharacterDocument<Dnd5eLikeDataModel> {
  return {
    id: draft.id,
    name: draft.name,
    systemId: draft.systemId,
    system: draft.system as Dnd5eLikeDataModel,
    createdAt: new Date(draft.createdAt),
    updatedAt: new Date(draft.createdAt),
  };
}

function unknownIdIssue(message: string): ValidationIssue {
  return { code: 'creation-unknown-choice', message, severity: 'error', recoverable: true };
}

/**
 * Apply one creation selection onto the draft and validate the result. An id not
 * in the candidate pool is reported as an error issue WITHOUT mutating the draft
 * (so the creator can re-prompt); a valid choice applies through the shared
 * template applicators and the draft absorbs the new system data + issues.
 */
export async function applyDnd5eCreationSelection(
  draft: CreationDraft,
  selection: Dnd5eCreationSelection,
  deps: Dnd5eCreationDeps = defaultDnd5eCreationDeps
): Promise<CreationDraft> {
  const document = draftDocument(draft);

  if (selection.kind === 'class') {
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
      next = removeDnd5eClassTemplate(next, previousClassId);
    }
    next = applyDnd5eClassTemplate(
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

  if (selection.kind === 'species') {
    const speciesList = await deps.loadSpecies(draft.systemId);
    const speciesData = speciesList.find((entry) => entry.id === selection.speciesId);
    if (!speciesData) {
      return withResolvedSystem(draft, draft.system, [
        unknownIdIssue(`Species '${selection.speciesId}' is not in the ${draft.systemId} catalog.`),
      ]);
    }
    const previous = speciesList.find((entry) => entry.id === draft.selections.speciesId);
    const next = applyDnd5eSpeciesTemplate(document, speciesData, previous);
    return recordAndValidate(
      draft,
      next.system,
      { speciesId: selection.speciesId, speciesName: speciesData.name },
      deps
    );
  }

  const backgrounds = await deps.loadBackgrounds(draft.systemId);
  const background = backgrounds.find((entry) => entry.id === selection.backgroundId);
  if (!background) {
    return withResolvedSystem(draft, draft.system, [
      unknownIdIssue(
        `Background '${selection.backgroundId}' is not in the ${draft.systemId} catalog.`
      ),
    ]);
  }
  const previousBackground = backgrounds.find(
    (entry) => entry.id === draft.selections.backgroundId
  );
  const next = applyDnd5eBackgroundTemplate(document, background, previousBackground);
  return recordAndValidate(
    draft,
    next.system,
    { backgroundId: selection.backgroundId, backgroundName: background.name },
    deps
  );
}

async function recordAndValidate(
  draft: CreationDraft,
  system: Dnd5eLikeDataModel,
  selections: Record<string, unknown>,
  deps: Dnd5eCreationDeps
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
