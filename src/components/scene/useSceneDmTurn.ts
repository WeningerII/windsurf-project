/**
 * AI-DM controller for SceneManager (RFC 007, WORK_PLAN §5.6). Owns which token
 * the AI-DM would act for, the closure that runs `runDmTurn` over the current
 * scene, and the guarded apply — i.e. everything behind `DmTurnPanel`'s prop
 * surface.
 *
 * The one thing here that is not plumbing is the STALENESS GUARD, and it exists
 * because of how the events are made. `runDmTurn` resolves its intents through
 * `applySceneIntents`, which stamps `sequence: scene.events.length + 1` at
 * RESOLVE time (`src/scene/runtime.ts`). The whole point of this surface is that
 * a human reads those events before they are appended, so an arbitrary amount of
 * play can happen in between — and `appendSceneEvent` does not reject a
 * duplicate sequence (`pushSequenceIssue` only requires a positive integer). A
 * proposal applied after the scene moved on would therefore land with a sequence
 * another event already owns, and `compareSceneEvents` would fold it into the
 * wrong place in the log. So the proposal is pinned to the scene id and event
 * count it was resolved against, and applying against anything else is refused
 * with a message rather than silently corrupting the order.
 */
import { useCallback, useRef } from 'react';
import { runDmTurn, type DmTurnResult } from '../../ai/dmTurnFlow';
import type { DmTurnRequest } from './DmTurnPanel';
import type { SceneDocument, SceneEvent, SceneState } from '../../types/core/scene';

/** Refusal shown when the scene moved on between proposing and applying. */
export const DM_TURN_STALE_MESSAGE =
  'The scene changed since this turn was proposed, so applying it would put its events out of order. Propose the turn again.';

export interface UseSceneDmTurnParams {
  selectedScene: SceneDocument | undefined;
  state: SceneState | undefined;
  /** The grid selection, used only when no initiative order names an actor. */
  selectedTokenId: string | undefined;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
}

export function useSceneDmTurn({
  selectedScene,
  state,
  selectedTokenId,
  onAppendSceneEvent,
}: UseSceneDmTurnParams) {
  // What the last proposal was resolved against. A ref, not state: it is read
  // inside the apply callback and must never cause a re-render of its own.
  const proposedAgainst = useRef<{ sceneId: string; eventCount: number } | null>(null);

  // Whose turn the AI-DM would run. The runtime's own turn order wins; the grid
  // selection is the fallback for a scene with no initiative set, which is the
  // only case `runDmTurn` lets any token act.
  const actorTokenId = state?.activeTokenId ?? selectedTokenId;
  const actorToken = actorTokenId ? state?.tokens[actorTokenId] : undefined;
  const dmTurnActor = actorToken ? { id: actorToken.id, name: actorToken.name } : undefined;

  const handleRunDmTurn = useCallback(
    async (request: DmTurnRequest): Promise<DmTurnResult> => {
      // Guarded by the same condition that decides whether to pass this down.
      const scene = selectedScene!;
      const tokenId = actorTokenId!;
      proposedAgainst.current = { sceneId: scene.id, eventCount: scene.events.length };
      return runDmTurn(scene, {
        actorTokenId: tokenId,
        moveDistance: request.moveDistance,
        ...(request.check ? { checks: [request.check] } : {}),
      });
    },
    [selectedScene, actorTokenId]
  );

  /**
   * Append an ACCEPTED turn. Returns a message when it is refused, so the panel
   * shows the refusal beside the proposal instead of the host's banner claiming
   * something unrelated happened.
   */
  const handleApplyDmTurn = useCallback(
    (events: SceneEvent[]): string | null => {
      const pinned = proposedAgainst.current;
      if (
        !selectedScene ||
        !pinned ||
        pinned.sceneId !== selectedScene.id ||
        pinned.eventCount !== selectedScene.events.length
      ) {
        return DM_TURN_STALE_MESSAGE;
      }
      events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
      proposedAgainst.current = null;
      return null;
    },
    [selectedScene, onAppendSceneEvent]
  );

  return { dmTurnActor, handleRunDmTurn, handleApplyDmTurn };
}
