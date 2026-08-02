/**
 * Token controller for SceneManager: the draft a click-to-place authors (linked
 * sheet or statblock, name, kind, side) plus the operations that act on the
 * already-selected token — i.e. everything behind the TokenPanel's prop surface.
 * Extracted verbatim from SceneManager; the host destructures the return into
 * the same names it used inline, so behavior is unchanged.
 *
 * The draft is inert: `buildTokenAt` only shapes a `SceneToken`, and the host
 * hands it to `emitSceneAction` — so placement stays on the one resolve-then-
 * append route (RFC 006) and nothing here writes scene state. Selection itself
 * stays with the host, because the grid, combat and check surfaces all read it.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { factionForToken } from '../../rules';
import { generateNpc } from '../../scene/npcGenerator';
import { createSeededRng } from '../../scene/seededRng';
import { buildPlacedToken } from '../../scene/tokenPlacement';
import { generateUUID } from '../../utils/browserCompat';
import type { EmitSceneAction } from './useSceneActions';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Monster } from '../../types/creatures/monsters';
import type {
  SceneAllegiance,
  SceneCoordinate,
  SceneDocument,
  SceneState,
  SceneToken,
  SceneTokenKind,
} from '../../types/core/scene';

export interface UseSceneTokensParams {
  selectedScene: SceneDocument | undefined;
  state: SceneState | undefined;
  documents: CharacterDocument<SystemDataModel>[];
  /** The loaded creature catalog, indexed (statblock-backed NPCs draw from it). */
  monstersById: ReadonlyMap<string, Monster>;
  /** The same catalog in load order — what an NPC is generated from. */
  encounterMonsters: Monster[];
  selectedTokenId: string | undefined;
  emitSceneAction: EmitSceneAction;
  /** Surface validation messages on the host (its actionIssues banner). */
  onIssues: (issues: string[]) => void;
  /** A generated NPC is ready to place: arm the host's placement mode. */
  onNpcDrafted: () => void;
  /** The selected token is gone: clear the host's selection. */
  onTokenDeleted: () => void;
}

export function useSceneTokens({
  selectedScene,
  state,
  documents,
  monstersById,
  encounterMonsters,
  selectedTokenId,
  emitSceneAction,
  onIssues,
  onNpcDrafted,
  onTokenDeleted,
}: UseSceneTokensParams) {
  const [tokenDocumentId, setTokenDocumentId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenKind, setTokenKind] = useState<SceneTokenKind>('character');
  // The side a placed NPC fights on (only used when kind === 'npc'); enemies are
  // the common case for an encounter, allies/bystanders are opt-in.
  const [tokenAllegiance, setTokenAllegiance] = useState<SceneAllegiance>('hostile');
  // A creature statblock backing an NPC (picked or generated); '' = none.
  const [tokenStatblockId, setTokenStatblockId] = useState('');
  // Monotonic nonce so each "Generate NPC" yields a fresh (still seeded) result.
  const npcGenNonce = useRef(0);

  const buildTokenAt = useCallback(
    (position: SceneCoordinate): SceneToken | null => {
      const linkedDoc = documents.find((doc) => doc.id === tokenDocumentId);
      // An NPC may instead be backed by a creature statblock (picked or
      // generated) — mechanically real via the same statblocks monsters use.
      const statblock =
        !linkedDoc && tokenKind === 'npc' && tokenStatblockId
          ? monstersById.get(tokenStatblockId)
          : undefined;
      return buildPlacedToken({
        position,
        linkedDoc,
        statblock,
        nameInput: tokenName,
        tokenKind,
        tokenAllegiance,
        idFactory: generateUUID,
      });
    },
    [
      documents,
      tokenDocumentId,
      tokenKind,
      tokenStatblockId,
      monstersById,
      tokenName,
      tokenAllegiance,
    ]
  );

  /** Clear the draft after a placement actually landed (never before). */
  const clearTokenDraft = useCallback(() => {
    setTokenName('');
    setTokenDocumentId('');
    setTokenStatblockId('');
  }, []);

  const handleGenerateNpc = useCallback(() => {
    npcGenNonce.current += 1;
    const seed = state?.seed ?? selectedScene?.id ?? 'npc';
    const generated = generateNpc(
      encounterMonsters,
      createSeededRng(`${seed}:npc:${npcGenNonce.current}`)
    );
    if (!generated) {
      onIssues(['No creatures are loaded for this system to generate an NPC from.']);
      return;
    }
    setTokenDocumentId('');
    setTokenKind('npc');
    setTokenStatblockId(generated.monster.id);
    setTokenName(generated.name);
    onNpcDrafted();
  }, [encounterMonsters, selectedScene?.id, state?.seed, onIssues, onNpcDrafted]);

  const handleToggleSelectedTokenCondition = useCallback(
    (conditionId: string) => {
      if (!selectedScene || !state || !selectedTokenId) return;
      const token = state.tokens[selectedTokenId];
      if (!token) return;
      const current = token.conditions ?? [];
      const next = current.includes(conditionId)
        ? current.filter((entry) => entry !== conditionId)
        : [...current, conditionId];
      emitSceneAction(selectedScene, {
        type: 'set-token-conditions',
        tokenId: selectedTokenId,
        conditions: next,
      });
    },
    [selectedScene, state, selectedTokenId, emitSceneAction]
  );

  const handleSetSelectedTokenSide = useCallback(
    (allegiance: SceneAllegiance) => {
      if (!selectedScene || !selectedTokenId) return;
      emitSceneAction(selectedScene, {
        type: 'set-token-allegiance',
        tokenId: selectedTokenId,
        allegiance,
      });
    },
    [selectedScene, selectedTokenId, emitSceneAction]
  );

  // The selected token's current side, for the re-side control (objects are
  // permanent non-combatants, so no control is offered for them).
  const selectedTokenSide = useMemo<SceneAllegiance | undefined>(() => {
    const token = selectedTokenId ? state?.tokens[selectedTokenId] : undefined;
    if (!token || token.kind === 'object') return undefined;
    return factionForToken(token);
  }, [selectedTokenId, state]);

  const handleSelectLinkedDocument = (documentId: string) => {
    setTokenDocumentId(documentId);
    const doc = documents.find((entry) => entry.id === documentId);
    if (doc) {
      setTokenStatblockId(''); // a sheet and a statblock are mutually exclusive backings
      setTokenName(doc.name);
      setTokenKind('character');
    }
  };

  const handleSelectStatblock = (statblockId: string) => {
    setTokenStatblockId(statblockId);
    if (!statblockId) return;
    setTokenDocumentId(''); // mutually exclusive with a linked sheet
    setTokenKind('npc');
    const statblock = monstersById.get(statblockId);
    if (statblock) setTokenName(statblock.name);
  };

  const handleDeleteSelectedToken = () => {
    if (!selectedScene || !selectedTokenId) return;
    const removed = emitSceneAction(selectedScene, {
      type: 'remove-token',
      tokenId: selectedTokenId,
    });
    if (removed) onTokenDeleted();
  };

  return {
    tokenDocumentId,
    tokenName,
    setTokenName,
    tokenKind,
    setTokenKind,
    tokenAllegiance,
    setTokenAllegiance,
    tokenStatblockId,
    selectedTokenSide,
    buildTokenAt,
    clearTokenDraft,
    handleSelectLinkedDocument,
    handleSelectStatblock,
    handleGenerateNpc,
    handleDeleteSelectedToken,
    handleToggleSelectedTokenCondition,
    handleSetSelectedTokenSide,
  };
}
