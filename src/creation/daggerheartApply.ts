/**
 * Daggerheart creation "apply a choice + validate" core — the applicator-dependent
 * half of the Daggerheart orchestrator, split out so the heavy templates stay OUT
 * of the eager first-paint shell (the registry-reachable `daggerheartCreation.ts`
 * `import()`s this only when the user applies a choice). Mirrors the other
 * `*Apply.ts` cores.
 *
 * It reuses the EXACT applicators manual sheet editing uses
 * (`applyDaggerheartClassTemplate` / `applyDaggerheartAncestryTemplate` /
 * `applyDaggerheartCommunityTemplate`) — no parallel creation rules. Daggerheart's
 * class and ancestry interact (starting Evasion/HP combine class base + ancestry
 * adjustments), so each apply passes the currently-selected counterpart so the
 * derived values stay correct regardless of pick order. Loaders/validator are
 * injectable for testing.
 */
import type {
  DaggerheartAncestry,
  DaggerheartClass,
  DaggerheartCommunity,
} from '../types/daggerheart';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import type { ValidationIssue, ValidationResult } from '../registry/types';
import type { DaggerheartDataModel } from '../systems/daggerheart/data-model';
import { systemRegistry } from '../registry';
import {
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
} from '../utils/dataLoader';
import {
  applyDaggerheartAncestryTemplate,
  applyDaggerheartClassTemplate,
  applyDaggerheartCommunityTemplate,
} from '../utils/daggerheartTemplate';
import { setSelection, withResolvedSystem, type CreationDraft } from './creationDraft';

export type DaggerheartCreationSelection =
  | { kind: 'class'; classId: string }
  | { kind: 'ancestry'; ancestryId: string }
  | { kind: 'community'; communityId: string };

/** Injectable data/validation dependencies (real ones by default). */
export interface DaggerheartCreationDeps {
  loadClasses: (systemId: string) => Promise<DaggerheartClass[]>;
  loadAncestries: (systemId: string) => Promise<DaggerheartAncestry[]>;
  loadCommunities: (systemId: string) => Promise<DaggerheartCommunity[]>;
  validate: (document: CharacterDocument) => Promise<ValidationResult>;
}

export const defaultDaggerheartCreationDeps: DaggerheartCreationDeps = {
  // The draft carries a generic `string` systemId while the loaders are typed to
  // the `GameSystemId` union; bridge the two here (an unregistered id degrades to
  // an empty catalog, so the orchestrator reports it as an unknown-choice issue).
  loadClasses: (systemId) => loadDaggerheartClassesForSystem(systemId as GameSystemId),
  loadAncestries: (systemId) => loadDaggerheartAncestriesForSystem(systemId as GameSystemId),
  loadCommunities: (systemId) => loadDaggerheartCommunitiesForSystem(systemId as GameSystemId),
  validate: (document) => systemRegistry.validateDocument(document, { reason: 'creation' }),
};

/** Wrap a draft's working system data in a CharacterDocument the applicators accept. */
function draftDocument(draft: CreationDraft): CharacterDocument<DaggerheartDataModel> {
  return {
    id: draft.id,
    name: draft.name,
    systemId: draft.systemId,
    system: draft.system as DaggerheartDataModel,
    createdAt: new Date(draft.createdAt),
    updatedAt: new Date(draft.createdAt),
  };
}

function unknownIdIssue(message: string): ValidationIssue {
  return { code: 'creation-unknown-choice', message, severity: 'error', recoverable: true };
}

/**
 * Apply one Daggerheart creation selection onto the draft and validate the result.
 * An id not in the candidate pool is reported as an error issue WITHOUT mutating
 * the draft (so the creator can re-prompt); a valid choice applies through the
 * shared template applicators and the draft absorbs the new system data + issues.
 */
export async function applyDaggerheartCreationSelection(
  draft: CreationDraft,
  selection: DaggerheartCreationSelection,
  deps: DaggerheartCreationDeps = defaultDaggerheartCreationDeps
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
    const previousClass = classes.find((entry) => entry.id === draft.selections.classId);
    // The chosen ancestry feeds the class's starting Evasion/HP (if already picked).
    const ancestries = await deps.loadAncestries(draft.systemId);
    const ancestry = ancestries.find((entry) => entry.id === draft.selections.ancestryId);
    const next = applyDaggerheartClassTemplate(document, classData, { previousClass, ancestry });
    return recordAndValidate(
      draft,
      next.system,
      { classId: selection.classId, className: classData.name },
      deps
    );
  }

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
    const previousAncestry = ancestries.find((entry) => entry.id === draft.selections.ancestryId);
    // The chosen class feeds the ancestry's Evasion/HP recompute (if already picked).
    const classes = await deps.loadClasses(draft.systemId);
    const classData = classes.find((entry) => entry.id === draft.selections.classId);
    const next = applyDaggerheartAncestryTemplate(document, ancestry, {
      previousAncestry,
      classData,
    });
    return recordAndValidate(
      draft,
      next.system,
      { ancestryId: selection.ancestryId, ancestryName: ancestry.name },
      deps
    );
  }

  const communities = await deps.loadCommunities(draft.systemId);
  const community = communities.find((entry) => entry.id === selection.communityId);
  if (!community) {
    return withResolvedSystem(draft, draft.system, [
      unknownIdIssue(
        `Community '${selection.communityId}' is not in the ${draft.systemId} catalog.`
      ),
    ]);
  }
  const next = applyDaggerheartCommunityTemplate(document, community);
  return recordAndValidate(
    draft,
    next.system,
    { communityId: selection.communityId, communityName: community.name },
    deps
  );
}

async function recordAndValidate(
  draft: CreationDraft,
  system: DaggerheartDataModel,
  selections: Record<string, unknown>,
  deps: DaggerheartCreationDeps
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
