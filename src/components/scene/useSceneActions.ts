/**
 * The scene surface's single mutation seam (RFC 006). Every state change a
 * panel authors is resolved by `resolveSceneAction` and appended as an event —
 * nothing here computes scene state, so replay stays byte-identical.
 *
 * It also owns the `actionIssues` banner, because "what the runtime rejected"
 * is produced by the same call that appends: the sibling controllers report
 * their own validation messages through the returned setter (`onIssues`).
 * Extracted verbatim from SceneManager; the host destructures the return into
 * the same names it used inline, so behavior is unchanged.
 */
import { useCallback, useState } from 'react';
import { resolveSceneAction } from '../../scene/runtime';
import { generateUUID } from '../../utils/browserCompat';
import { guardSync, ErrorCategory } from '../../utils/errorLogger';
import type { SceneActionIntent, SceneDocument, SceneEvent } from '../../types/core/scene';

/** Shown when a guarded engine call throws (the failure is logged to Sentry). */
export const ENGINE_FAILURE_ISSUE = 'This action could not be applied. The error was logged.';

export interface UseSceneActionsParams {
  /** The shell-selected scene; the bound emit is a no-op when none resolves. */
  selectedScene: SceneDocument | undefined;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
}

export function useSceneActions({ selectedScene, onAppendSceneEvent }: UseSceneActionsParams) {
  const [actionIssues, setActionIssues] = useState<string[]>([]);

  const emitSceneAction = useCallback(
    (scene: SceneDocument, intent: SceneActionIntent) => {
      // resolveSceneAction returns `issues` for EXPECTED invalid input; the
      // guard only catches an UNEXPECTED throw in the fold, so a bug there is a
      // monitored signal that degrades to "action rejected" instead of an
      // unhandled error in whichever handler emitted it.
      const result = guardSync(
        () =>
          resolveSceneAction(scene, intent, {
            eventId: generateUUID(),
            createdAt: new Date(),
          }),
        {
          fallback: undefined,
          category: ErrorCategory.USER_ACTION,
          message: 'Scene action failed',
          context: { intentType: intent.type },
        }
      );

      if (!result) {
        setActionIssues([ENGINE_FAILURE_ISSUE]);
        return false;
      }

      if (!result.event) {
        setActionIssues(result.issues.map((issue) => issue.message));
        return false;
      }

      onAppendSceneEvent(scene.id, result.event);
      setActionIssues(result.issues.map((issue) => issue.message));
      return true;
    },
    [onAppendSceneEvent]
  );

  // The zero-arg bound emit seam (Phase 4): a shared-layer drop handler emits an
  // EXISTING intent through this without knowing about scene resolution. Bound to
  // the shell-resolved selectedScene; a no-op returning false when none resolves,
  // so a drop never targets a stale scene. runtime.ts + the 12 intents untouched.
  const emitBoundSceneAction = useCallback(
    (intent: SceneActionIntent): boolean =>
      selectedScene ? emitSceneAction(selectedScene, intent) : false,
    [selectedScene, emitSceneAction]
  );

  return { actionIssues, setActionIssues, emitSceneAction, emitBoundSceneAction };
}

export type EmitSceneAction = ReturnType<typeof useSceneActions>['emitSceneAction'];
