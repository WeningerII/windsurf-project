import type {
  CreationDraft,
  CreationDraftCompletion,
  CreationDraftStepState,
} from '../types/core/creationDraft';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';
import { generateUUID } from './browserCompat';

/**
 * Local-first storage and pure-transition helpers for resumable character
 * creation drafts.
 *
 * Drafts never depend on Supabase: they round-trip through `localStorage` so a
 * guided-creation flow can be paused and resumed entirely in the browser. The
 * persistence helpers (`load`/`upsert`/`delete`/`clear`) own the storage key;
 * the transition helpers (`create`/`updateStep`/`setValidationIssues`/
 * `finalize`) are pure so callers decide when to persist.
 */

const STORAGE_KEY = 'rpg-creation-drafts-v1';

interface CreationDraftStorageData {
  version: string;
  drafts: CreationDraft[];
  lastModified: string;
}

function hydrateDrafts(drafts: CreationDraft[]): CreationDraft[] {
  return drafts.map((draft) => ({
    ...draft,
    createdAt: new Date(draft.createdAt),
    updatedAt: new Date(draft.updatedAt),
  }));
}

function persist(drafts: CreationDraft[]): CreationDraft[] {
  const data: CreationDraftStorageData = {
    version: '1.0',
    drafts,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return drafts;
}

export function loadCreationDrafts(): CreationDraft[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const data: CreationDraftStorageData = JSON.parse(stored);
    if (!Array.isArray(data.drafts)) return [];
    return hydrateDrafts(data.drafts);
  } catch {
    return [];
  }
}

export function loadCreationDraft(id: string): CreationDraft | undefined {
  return loadCreationDrafts().find((draft) => draft.id === id);
}

export function upsertCreationDraft(draft: CreationDraft): CreationDraft[] {
  const drafts = loadCreationDrafts();
  const index = drafts.findIndex((existing) => existing.id === draft.id);
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.push(draft);
  }
  return persist(drafts);
}

export function deleteCreationDraft(id: string): CreationDraft[] {
  return persist(loadCreationDrafts().filter((draft) => draft.id !== id));
}

export function clearCreationDrafts(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export interface CreateCreationDraftParams<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  id?: string;
  systemId: string;
  name?: string;
  steps: Array<{ id: string; label: string }>;
  data?: TData;
  now?: Date;
}

export function createCreationDraft<
  TData extends Record<string, unknown> = Record<string, unknown>,
>(params: CreateCreationDraftParams<TData>): CreationDraft<TData> {
  const now = params.now ?? new Date();
  const steps: CreationDraftStepState[] = params.steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    status: index === 0 ? 'active' : 'pending',
    data: undefined,
    issues: undefined,
  }));

  return {
    id: params.id ?? generateUUID(),
    systemId: params.systemId,
    name: params.name ?? '',
    status: 'draft',
    currentStepId: steps[0]?.id ?? '',
    steps,
    data: params.data ?? ({} as TData),
    validationIssues: [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function updateCreationDraftStep<TData extends Record<string, unknown>>(
  draft: CreationDraft<TData>,
  stepId: string,
  patch: Partial<Omit<CreationDraftStepState, 'id'>>,
  now: Date = new Date()
): CreationDraft<TData> {
  return {
    ...draft,
    currentStepId: stepId,
    steps: draft.steps.map((step) => (step.id === stepId ? { ...step, ...patch } : step)),
    updatedAt: now,
  };
}

export function setCreationDraftValidationIssues<TData extends Record<string, unknown>>(
  draft: CreationDraft<TData>,
  issues: ValidationIssue[],
  now: Date = new Date()
): CreationDraft<TData> {
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'error');
  return {
    ...draft,
    validationIssues: issues,
    status: hasBlockingIssue ? 'draft' : 'ready',
    updatedAt: now,
  };
}

export function finalizeCreationDraft<
  TData extends Record<string, unknown>,
  TSystem extends SystemDataModel,
>(
  draft: CreationDraft<TData>,
  document: CharacterDocument<TSystem>,
  now: Date = new Date()
): CreationDraftCompletion<TData, TSystem> {
  if (draft.systemId !== document.systemId) {
    throw new Error(
      `Creation draft system '${draft.systemId}' does not match document system '${document.systemId}'.`
    );
  }

  return {
    draft: {
      ...draft,
      status: 'completed',
      finalDocumentId: document.id,
      updatedAt: now,
    },
    document,
  };
}
