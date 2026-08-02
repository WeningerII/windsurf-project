/**
 * Initiative controller for SceneManager: the per-token edit buffer the
 * InitiativeTracker binds to, plus the set-order and advance-turn verbs.
 * Extracted verbatim from SceneManager; the host destructures the return into
 * the same names it used inline, so behavior is unchanged.
 *
 * The buffer is UI state only — the order that counts is whatever the
 * `set-initiative` event folded to, so this hook seeds from `state` and hands
 * every change back through `emitSceneAction` (RFC 006).
 */
import { useEffect, useState } from 'react';
import type { EmitSceneAction } from './useSceneActions';
import type { SceneDocument, SceneState } from '../../types/core/scene';

export interface UseSceneInitiativeParams {
  selectedScene: SceneDocument | undefined;
  state: SceneState | undefined;
  emitSceneAction: EmitSceneAction;
  /** Surface the kept-previous-value notice on the host (its actionIssues banner). */
  onIssues: (issues: string[]) => void;
}

export function useSceneInitiative({
  selectedScene,
  state,
  emitSceneAction,
  onIssues,
}: UseSceneInitiativeParams) {
  const [initiativeValues, setInitiativeValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!state) return;

    // The inputs are an edit buffer: seed defaults only for tokens we have no
    // buffered value for, and drop removed tokens. Never overwrite a value the
    // user may be editing (every appended event re-runs this effect).
    setInitiativeValues((current) => {
      const next = { ...current };
      state.initiative.forEach((entry) => {
        next[entry.tokenId] ??= String(entry.value);
      });
      Object.keys(state.tokens).forEach((tokenId) => {
        next[tokenId] ??= '10';
      });
      Object.keys(next).forEach((tokenId) => {
        if (!state.tokens[tokenId]) {
          delete next[tokenId];
        }
      });
      return next;
    });
  }, [state]);

  const handleInitiativeChange = (tokenId: string, value: string) => {
    setInitiativeValues((current) => ({ ...current, [tokenId]: value }));
  };

  const handleSetInitiative = () => {
    if (!selectedScene || !state) return;

    // An empty/invalid input keeps the token's previous initiative (or the
    // default 10) instead of silently dropping it from the order.
    const existingByTokenId = new Map(
      state.initiative.map((entry) => [entry.tokenId, entry.value])
    );
    const keptTokens: Array<{ name: string; tokenId: string; value: number }> = [];
    const entries = Object.values(state.tokens)
      .map((token) => {
        const parsed = Number.parseFloat(initiativeValues[token.id] ?? '10');
        if (Number.isFinite(parsed)) {
          return { tokenId: token.id, value: parsed };
        }
        const fallback = existingByTokenId.get(token.id) ?? 10;
        keptTokens.push({ name: token.name, tokenId: token.id, value: fallback });
        return { tokenId: token.id, value: fallback };
      })
      .sort((a, b) => b.value - a.value);

    const emitted = emitSceneAction(selectedScene, {
      type: 'set-initiative',
      entries,
      activeTokenId: entries[0]?.tokenId,
    });

    if (emitted && keptTokens.length > 0) {
      // Resync the cleared inputs to the value that was actually set, and say so.
      setInitiativeValues((current) => {
        const next = { ...current };
        keptTokens.forEach((kept) => {
          next[kept.tokenId] = String(kept.value);
        });
        return next;
      });
      onIssues([
        `Invalid initiative for ${keptTokens.map((kept) => kept.name).join(', ')} — kept the previous value.`,
      ]);
    }
  };

  const handleAdvanceTurn = () => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, { type: 'advance-turn' });
  };

  return { initiativeValues, handleInitiativeChange, handleSetInitiative, handleAdvanceTurn };
}
