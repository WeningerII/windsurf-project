/**
 * Pathfinder 2e creation "apply a choice + validate" core — the applicator-
 * dependent half of the PF2e orchestrator, split out so the heavy templates stay
 * OUT of the eager first-paint shell (the registry-reachable `pf2eCreation.ts`
 * `import()`s this only when the user applies a choice). Mirrors `dnd5eApply.ts`.
 *
 * It reuses the EXACT applicators manual sheet editing uses
 * (`applyPf2eAncestryTemplate` / `applyPf2eBackgroundTemplate` /
 * `applyPf2eClassTemplate`) and the registry's PF2e validator — no parallel
 * creation rules. A selection is loaded from the candidate pool, applied onto the
 * draft's working document (un-applying the prior choice of that kind first), and
 * the result is validated; the new system data + issues fold back into the draft
 * via `withResolvedSystem`. Loaders and the validator are injectable for testing.
 */
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { Pf2eBackgroundDefinition } from '../types/character-options/pf2eBackgrounds';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import type { ValidationIssue, ValidationResult } from '../registry/types';
import type { Pf2eDataModel } from '../systems/pf2e/data-model';
import { systemRegistry } from '../registry';
import {
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
} from '../utils/dataLoader';
import {
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
} from '../utils/pf2eTemplate';
import { setSelection, withResolvedSystem, type CreationDraft } from './creationDraft';

export type Pf2eCreationSelection =
  | { kind: 'ancestry'; ancestryId: string }
  | { kind: 'background'; backgroundId: string }
  | { kind: 'class'; classId: string; level: number };

/** Injectable data/validation dependencies (real ones by default). */
export interface Pf2eCreationDeps {
  loadAncestries: (systemId: string) => Promise<Species[]>;
  loadBackgrounds: (systemId: string) => Promise<Pf2eBackgroundDefinition[]>;
  loadClasses: (systemId: string) => Promise<CharacterClass[]>;
  validate: (document: CharacterDocument) => Promise<ValidationResult>;
}

export const defaultPf2eCreationDeps: Pf2eCreationDeps = {
  // The draft carries a generic `string` systemId while the loaders are typed to
  // the `GameSystemId` union; bridge the two here (an unregistered id degrades to
  // an empty catalog, so the orchestrator reports it as an unknown-choice issue).
  loadAncestries: (systemId) => loadSpeciesForSystem(systemId as GameSystemId),
  loadBackgrounds: (systemId) => loadPf2eBackgroundsForSystem(systemId as GameSystemId),
  loadClasses: (systemId) => loadClassesForSystem(systemId as GameSystemId),
  validate: (document) => systemRegistry.validateDocument(document, { reason: 'creation' }),
};

/** Wrap a draft's working system data in a CharacterDocument the applicators accept. */
function draftDocument(draft: CreationDraft): CharacterDocument<Pf2eDataModel> {
  return {
    id: draft.id,
    name: draft.name,
    systemId: draft.systemId,
    system: draft.system as Pf2eDataModel,
    createdAt: new Date(draft.createdAt),
    updatedAt: new Date(draft.createdAt),
  };
}

function unknownIdIssue(message: string): ValidationIssue {
  return { code: 'creation-unknown-choice', message, severity: 'error', recoverable: true };
}

/**
 * Apply one PF2e creation selection onto the draft and validate the result. An id
 * not in the candidate pool is reported as an error issue WITHOUT mutating the
 * draft (so the creator can re-prompt); a valid choice applies through the shared
 * template applicators and the draft absorbs the new system data + issues.
 */
export async function applyPf2eCreationSelection(
  draft: CreationDraft,
  selection: Pf2eCreationSelection,
  deps: Pf2eCreationDeps = defaultPf2eCreationDeps
): Promise<CreationDraft> {
  const document = draftDocument(draft);

  if (selection.kind === 'ancestry') {
    const ancestries = await deps.loadAncestries(draft.systemId);
    const ancestry = ancestries.find((entry) => entry.id === selection.ancestryId);
    if (!ancestry) {
      return withResolvedSystem(draft, draft.system, [
        unknownIdIssue(
          `Ancestry '${selection.ancestryId}' is not in the ${draft.systemId} catalog.`
        ),
      ]);
    }
    const previous = ancestries.find((entry) => entry.id === draft.selections.ancestryId);
    const next = applyPf2eAncestryTemplate(
      document,
      ancestry,
      undefined,
      previous ? { ancestry: previous } : undefined
    );
    return recordAndValidate(
      draft,
      next.system,
      { ancestryId: selection.ancestryId, ancestryName: ancestry.name },
      deps
    );
  }

  if (selection.kind === 'background') {
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
    const next = applyPf2eBackgroundTemplate(document, background, previousBackground);
    return recordAndValidate(
      draft,
      next.system,
      { backgroundId: selection.backgroundId, backgroundName: background.name },
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
  const previousClass = classes.find((entry) => entry.id === draft.selections.classId);
  const next = applyPf2eClassTemplate(document, classData, selection.level, previousClass);
  return recordAndValidate(
    draft,
    next.system,
    { classId: selection.classId, classLevel: selection.level, className: classData.name },
    deps
  );
}

async function recordAndValidate(
  draft: CreationDraft,
  system: Pf2eDataModel,
  selections: Record<string, unknown>,
  deps: Pf2eCreationDeps
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
