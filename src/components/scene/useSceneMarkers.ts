/**
 * Marker controller for SceneManager: the terrain/hazard draft a click-to-place
 * authors, and the removal verb — i.e. everything behind the MarkerPanel's prop
 * surface. Extracted verbatim from SceneManager; the host destructures the
 * return into the same names it used inline, so behavior is unchanged.
 *
 * The draft is inert: `buildMarkerAt` only shapes a `SceneMarker`, and the host
 * hands it to `emitSceneAction` — so placement stays on the one resolve-then-
 * append route (RFC 006) and nothing here writes scene state.
 */
import { useCallback, useState } from 'react';
import { positiveIntegerOrDefault } from '../../scene/runtime';
import { generateUUID } from '../../utils/browserCompat';
import { terrainEffectsForPreset, type MarkerEffectPreset } from './markerEffects';
import type { EmitSceneAction } from './useSceneActions';
import type {
  SceneCoordinate,
  SceneDocument,
  SceneMarker,
  SceneMarkerKind,
} from '../../types/core/scene';

export interface UseSceneMarkersParams {
  selectedScene: SceneDocument | undefined;
  emitSceneAction: EmitSceneAction;
}

export function useSceneMarkers({ selectedScene, emitSceneAction }: UseSceneMarkersParams) {
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerKind, setMarkerKind] = useState<SceneMarkerKind>('hazard');
  const [markerWidth, setMarkerWidth] = useState('1');
  const [markerHeight, setMarkerHeight] = useState('1');
  // Optional functional-terrain preset authored for the next placed marker; 'none'
  // leaves the marker's `effects` absent so placement stays strictly additive.
  const [markerEffect, setMarkerEffect] = useState<MarkerEffectPreset>('none');

  const buildMarkerAt = useCallback(
    (position: SceneCoordinate): SceneMarker | null => {
      const label = markerLabel.trim();
      if (!label) return null;

      // 'none' → undefined, so a marker authored without terrain omits `effects`
      // entirely and resolves exactly as before (strict-additive).
      const effects = terrainEffectsForPreset(markerEffect);

      return {
        id: generateUUID(),
        kind: markerKind,
        label,
        position,
        width: positiveIntegerOrDefault(markerWidth, 1),
        height: positiveIntegerOrDefault(markerHeight, 1),
        ...(effects ? { effects } : {}),
      };
    },
    [markerLabel, markerKind, markerWidth, markerHeight, markerEffect]
  );

  /** Clear the draft after a placement actually landed (never before). */
  const clearMarkerDraft = useCallback(() => {
    setMarkerLabel('');
    setMarkerEffect('none');
  }, []);

  const handleDeleteMarker = (markerId: string) => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, {
      type: 'remove-marker',
      markerId,
    });
  };

  return {
    markerLabel,
    setMarkerLabel,
    markerKind,
    setMarkerKind,
    markerWidth,
    setMarkerWidth,
    markerHeight,
    setMarkerHeight,
    markerEffect,
    setMarkerEffect,
    buildMarkerAt,
    clearMarkerDraft,
    handleDeleteMarker,
  };
}
