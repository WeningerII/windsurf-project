import { generateUUID } from '../utils/browserCompat';
import { CURRENT_DOCUMENT_VERSION } from '../utils/documentMigrations';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { CreationDraftState, CreationPlan } from './types';

/**
 * Build a throwaway working-document envelope around raw system data. The wizard
 * uses this internally so template applicators + `registry.validateDocument` —
 * both of which operate on a full `CharacterDocument` — can run during editing.
 * The persisted document is built by the app's existing create path from the
 * final `system` data, so the id/date fields here are never persisted.
 */
export function buildWorkingDocumentEnvelope<T extends SystemDataModel>(
  systemId: string,
  system: T,
  name: string
): CharacterDocument<T> {
  const now = new Date();
  return {
    id: generateUUID(),
    name: name.trim() || 'New Character',
    systemId,
    system,
    createdAt: now,
    updatedAt: now,
    version: CURRENT_DOCUMENT_VERSION,
  };
}

/**
 * Deterministically replay a persisted draft through its plan to produce the
 * working document. Starts from the system's default data and folds every
 * choice / component step in declared order via the system's OWN applicators.
 * Replay is the single source of truth for the working document, so a resumed
 * draft can never carry stale derived state.
 */
export async function buildWorkingDocument<T extends SystemDataModel>(
  plan: CreationPlan<T>,
  createDefaultData: () => T,
  draft: CreationDraftState
): Promise<CharacterDocument<T>> {
  let document = buildWorkingDocumentEnvelope(plan.systemId, createDefaultData(), draft.name);

  for (const step of plan.steps) {
    if (step.kind === 'choice') {
      const selectedIds = draft.choices[step.id] ?? [];
      if (selectedIds.length === 0) continue;
      try {
        document = await step.apply(document, selectedIds);
      } catch {
        // A selection the applicator rejects (e.g. an unmet requirement) must
        // never corrupt the working document: skip it and let the live
        // validator surface the gap. Deterministic and non-throwing by design.
      }
    } else if (step.kind === 'component') {
      const produced = draft.componentData[step.id] as T | undefined;
      if (produced) {
        document = { ...document, system: produced };
      }
    }
  }

  // Keep the envelope name in sync with the current draft name (name edits do
  // not go through a step's apply).
  document = { ...document, name: draft.name.trim() || 'New Character' };
  return document;
}
