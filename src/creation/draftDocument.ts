import { generateUUID } from '../utils/browserCompat';
import { CURRENT_DOCUMENT_VERSION } from '../utils/documentMigrations';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { CreationDraftState, CreationPlan, CreationStep } from './types';

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

/** What a plan could and could not do with a supplied set of option ids. */
export interface PlanIdRouting {
  /** Plan step id -> the supplied ids that step actually offers. */
  choices: Record<string, string[]>;
  /**
   * Supplied ids no choice step in this plan offers. Recorded rather than
   * dropped: a system whose plan has no step for a category (Daggerheart today
   * declares no loader-driven steps; M&M 3e's build is a component step) must
   * report that honestly instead of silently pretending the id applied.
   */
  unrouted: string[];
}

/**
 * Route an unordered set of option ids onto a plan's choice steps by asking each
 * step which options IT offers (`loadOptions`) — never by matching step ids or
 * category names, so no system's step vocabulary is privileged.
 *
 * Steps are consulted in declared order and an id is claimed by the first step
 * that offers it; a step takes at most `maxSelections` (default 1) ids. A step
 * whose `loadOptions` throws claims nothing (deterministic and non-throwing, as
 * the replay in {@link buildWorkingDocument} already is).
 */
export async function routeIdsThroughPlan<T extends SystemDataModel>(
  plan: CreationPlan<T>,
  document: CharacterDocument<T>,
  ids: readonly string[]
): Promise<PlanIdRouting> {
  const choices: Record<string, string[]> = {};
  const unclaimed = ids.filter((id, index) => ids.indexOf(id) === index);

  for (const step of plan.steps) {
    if (step.kind !== 'choice' || unclaimed.length === 0) continue;
    const offered = await loadStepOptionIds(step, document);
    if (offered.size === 0) continue;
    const limit = Math.max(1, Math.trunc(step.maxSelections ?? 1));
    const claimed = unclaimed.filter((id) => offered.has(id)).slice(0, limit);
    if (claimed.length === 0) continue;
    choices[step.id] = claimed;
    for (const id of claimed) unclaimed.splice(unclaimed.indexOf(id), 1);
  }

  return { choices, unrouted: unclaimed };
}

async function loadStepOptionIds<T extends SystemDataModel>(
  step: Extract<CreationStep<T>, { kind: 'choice' }>,
  document: CharacterDocument<T>
): Promise<Set<string>> {
  try {
    const options = await step.loadOptions(document);
    return new Set(options.filter((option) => !option.disabled).map((option) => option.id));
  } catch {
    return new Set();
  }
}

/**
 * Build a `CharacterDocument` from a name plus a set of loader-derived option
 * ids, through the system's OWN guided-creation plan — the same
 * {@link buildWorkingDocument} replay the wizard uses, driven by the same
 * per-system template applicators.
 *
 * This is the system-agnostic "apply the accepted draft" path a drafting flow
 * needs: it contains no per-system branch and imports nothing from
 * `src/systems/**` (the plan carries the system's closures). Ids the plan has no
 * step for come back in `unrouted` so the caller can report them honestly.
 */
export async function buildDocumentFromPlanIds<T extends SystemDataModel>(
  plan: CreationPlan<T>,
  createDefaultData: () => T,
  name: string,
  ids: readonly string[]
): Promise<{ document: CharacterDocument<T>; unrouted: string[] }> {
  const seed = buildWorkingDocumentEnvelope(plan.systemId, createDefaultData(), name);
  const { choices, unrouted } = await routeIdsThroughPlan(plan, seed, ids);
  const document = await buildWorkingDocument(plan, createDefaultData, {
    name,
    stepIndex: 0,
    choices,
    componentData: {},
  });
  return { document, unrouted };
}
