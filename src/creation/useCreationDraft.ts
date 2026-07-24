import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SystemDataModel } from '../types/core/document';
import type { CreationDraftState } from './types';

const DRAFT_KEY_PREFIX = 'rpg-creation-draft-v1:';

function draftKey(systemId: string): string {
  return `${DRAFT_KEY_PREFIX}${systemId}`;
}

function emptyDraft(): CreationDraftState {
  return { name: 'New Character', stepIndex: 0, choices: {}, componentData: {} };
}

/**
 * True when a draft carries no user intent yet (default name, first step, no
 * selections). We never persist these — so opening the wizard writes nothing,
 * and "Start over" genuinely clears storage instead of re-saving an empty draft
 * that would spuriously trigger the resume banner next time.
 */
function isEmptyDraft(draft: CreationDraftState): boolean {
  return (
    draft.name === 'New Character' &&
    draft.stepIndex === 0 &&
    Object.keys(draft.choices).length === 0 &&
    Object.keys(draft.componentData).length === 0
  );
}

function readDraft(systemId: string): CreationDraftState | null {
  try {
    const raw = globalThis.localStorage?.getItem(draftKey(systemId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CreationDraftState>;
    if (typeof parsed !== 'object' || parsed === null) return null;
    return {
      name: typeof parsed.name === 'string' ? parsed.name : 'New Character',
      stepIndex: typeof parsed.stepIndex === 'number' ? parsed.stepIndex : 0,
      choices: parsed.choices && typeof parsed.choices === 'object' ? parsed.choices : {},
      componentData:
        parsed.componentData && typeof parsed.componentData === 'object'
          ? parsed.componentData
          : {},
    };
  } catch {
    return null;
  }
}

function writeDraft(systemId: string, draft: CreationDraftState): void {
  try {
    globalThis.localStorage?.setItem(draftKey(systemId), JSON.stringify(draft));
  } catch {
    // Storage full / unavailable (private mode): the wizard still works in
    // memory; the draft simply won't survive a reload. Non-fatal by design.
  }
}

function clearDraft(systemId: string): void {
  try {
    globalThis.localStorage?.removeItem(draftKey(systemId));
  } catch {
    // ignore
  }
}

export interface UseCreationDraftResult {
  draft: CreationDraftState;
  /** True when a persisted draft existed for this system at mount (resume UX). */
  resumedFromStorage: boolean;
  setName: (name: string) => void;
  setStepIndex: (index: number) => void;
  setChoice: (stepId: string, selectedIds: string[]) => void;
  setComponentData: (stepId: string, system: SystemDataModel) => void;
  /** Reset the in-progress build to an empty draft AND clear its storage. */
  reset: () => void;
  /** Remove the persisted draft (called after a successful create / on cancel). */
  clearStorage: () => void;
}

/**
 * Resumable local draft state for the guided-creation wizard. Draft state is
 * persisted browser-local per system (localStorage), so closing and reopening
 * the wizard resumes exactly where the user left off; `reset` starts over and
 * `clearStorage` discards the draft (used after a successful create or on
 * cancel). No remote schema, no Supabase — purely browser-local.
 */
export function useCreationDraft(systemId: string): UseCreationDraftResult {
  const initialRef = useRef<{ draft: CreationDraftState; resumed: boolean } | null>(null);
  if (initialRef.current === null) {
    const stored = readDraft(systemId);
    initialRef.current = { draft: stored ?? emptyDraft(), resumed: stored !== null };
  }

  const [draft, setDraft] = useState<CreationDraftState>(initialRef.current.draft);
  const resumedFromStorage = initialRef.current.resumed;

  // Persist on every meaningful change; an untouched (empty) draft is cleared
  // rather than written, so opening the wizard leaves no trace and "Start over"
  // truly discards the draft.
  useEffect(() => {
    if (isEmptyDraft(draft)) {
      clearDraft(systemId);
      return;
    }
    writeDraft(systemId, draft);
  }, [systemId, draft]);

  const setName = useCallback((name: string) => {
    setDraft((prev) => ({ ...prev, name }));
  }, []);

  const setStepIndex = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, stepIndex: Math.max(0, index) }));
  }, []);

  const setChoice = useCallback((stepId: string, selectedIds: string[]) => {
    setDraft((prev) => ({
      ...prev,
      choices: { ...prev.choices, [stepId]: selectedIds },
    }));
  }, []);

  const setComponentData = useCallback((stepId: string, system: SystemDataModel) => {
    setDraft((prev) => ({
      ...prev,
      componentData: { ...prev.componentData, [stepId]: system },
    }));
  }, []);

  const reset = useCallback(() => {
    clearDraft(systemId);
    setDraft(emptyDraft());
  }, [systemId]);

  const clearStorage = useCallback(() => {
    clearDraft(systemId);
  }, [systemId]);

  return useMemo(
    () => ({
      draft,
      resumedFromStorage,
      setName,
      setStepIndex,
      setChoice,
      setComponentData,
      reset,
      clearStorage,
    }),
    [
      draft,
      resumedFromStorage,
      setName,
      setStepIndex,
      setChoice,
      setComponentData,
      reset,
      clearStorage,
    ]
  );
}
