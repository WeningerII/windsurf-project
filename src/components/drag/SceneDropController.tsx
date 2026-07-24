/**
 * The scene-grid drop consumer (Phase 4). Rides SceneManager's LAZY chunk (not
 * the eager index chunk). It is the seam's consumer: it reads the zero-arg
 * `emit` DOWN (never touching `emitSceneAction` / `selectedScene`) and the drag
 * payload, and on a drop resolves the payload to an EXISTING intent:
 *
 * - 3b-i character → buildPlacedToken(linkedDoc) → emit `place-token` with NO
 *   menu (1-choice auto-apply). The document is resolved against the same
 *   `documents` roster SceneManager already threads.
 * - 3b-ii monster → open the friendly/hostile chip; on choice
 *   buildPlacedToken(statblock, allegiance) → emit `place-token`. The statblock
 *   comes from useSceneEncounter's monster catalog (passed as `resolveStatblock`
 *   — no new loader).
 *
 * Shared-layer-safe: imports only shared scene/types/utils, never
 * `src/systems/**`. An illegal / rejected emit surfaces the runtime's existing
 * `issues` toast inside `emitSceneAction` and the ghost simply snaps back.
 */
import { useCallback, useState, type RefObject } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Monster } from '../../types/creatures/monsters';
import type { SceneAllegiance, SceneCoordinate } from '../../types/core/scene';
import { buildPlacedToken } from '../../scene/tokenPlacement';
import { generateUUID } from '../../utils/browserCompat';
import { useSceneDispatch } from '../../contexts/scene-dispatch-context';
import { useDropTarget } from './useDropTarget';
import type { DragPayload } from './dragTypes';
import { AllegianceChip } from './AllegianceChip';

interface SceneDropControllerProps {
  /** The grid container (role="grid"); its cells carry data-scene-cell. */
  gridRef: RefObject<HTMLElement | null>;
  /** The character roster the payload's documentId resolves against. */
  documents: CharacterDocument<SystemDataModel>[];
  /** Resolve a monster payload's statblock (useSceneEncounter monster catalog). */
  resolveStatblock: (statblockId: string) => Monster | undefined;
}

interface PendingMonster {
  monster: Monster;
  coordinate: SceneCoordinate;
}

export function SceneDropController({
  gridRef,
  documents,
  resolveStatblock,
}: SceneDropControllerProps) {
  const emit = useSceneDispatch();
  const [pending, setPending] = useState<PendingMonster | null>(null);

  const placeCharacter = useCallback(
    (documentId: string, coordinate: SceneCoordinate) => {
      const linkedDoc = documents.find((doc) => doc.id === documentId);
      if (!linkedDoc) return;
      const token = buildPlacedToken({
        position: coordinate,
        linkedDoc,
        nameInput: '',
        tokenKind: 'character',
        // Unused for the resolved 'character' kind (no allegiance attached).
        tokenAllegiance: 'hostile',
        idFactory: generateUUID,
      });
      if (token) emit({ type: 'place-token', token });
    },
    [documents, emit]
  );

  const placeMonster = useCallback(
    (monster: Monster, coordinate: SceneCoordinate, allegiance: SceneAllegiance) => {
      const token = buildPlacedToken({
        position: coordinate,
        statblock: monster,
        nameInput: '',
        tokenKind: 'npc',
        tokenAllegiance: allegiance,
        idFactory: generateUUID,
      });
      if (token) emit({ type: 'place-token', token });
    },
    [emit]
  );

  const handleDrop = useCallback(
    (payload: DragPayload, coordinate: SceneCoordinate) => {
      if (payload.kind === 'character') {
        placeCharacter(payload.documentId, coordinate);
        return;
      }
      const monster = resolveStatblock(payload.monsterId);
      if (!monster) return;
      // 3b-ii: an NPC needs an allegiance — defer the emit to the chip choice.
      setPending({ monster, coordinate });
    },
    [placeCharacter, resolveStatblock]
  );

  useDropTarget('scene-grid', gridRef, handleDrop);

  if (!pending) return null;
  return (
    <AllegianceChip
      name={pending.monster.name}
      onChoose={(allegiance) => {
        placeMonster(pending.monster, pending.coordinate, allegiance);
        setPending(null);
      }}
      onDismiss={() => setPending(null)}
    />
  );
}
