/**
 * Map-backdrop controller for SceneManager (RFC 006 Phase 9). Owns the stored
 * asset lookup, the import / registration / remove handlers, the measured pixel
 * size, and the Phase-10 grid-analysis affordance — i.e. everything behind the
 * MapPanel's prop surface plus the `mapImage` the grid view renders under the
 * tokens. Extracted verbatim from SceneManager; the host destructures the
 * return into the same names it used inline, so behavior is unchanged.
 *
 * The map reference is DOCUMENT-level metadata, so import, registration and
 * removal go through `onUpdateScene` and never touch the event log. The one
 * thing this hook appends is an accepted analysis's markers, and those take the
 * ordinary `applySceneIntents` route every manual marker takes.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { analyzeMapWithAi } from '../../ai/analyzeMapFlow';
import { applySceneIntents } from '../../scene/runtime';
import {
  acceptGridGeometryProposal,
  type GridGeometryProposal,
} from '../../scene/gridGeometryProposal';
import { generateUUID } from '../../utils/browserCompat';
import { readFileAsDataUrl } from '../../utils/fileTransfer';
import { createMapAsset, loadMapAsset } from '../../utils/mapAssetStorage';
import type {
  SceneDocument,
  SceneEvent,
  SceneGridRegistration,
  SceneState,
} from '../../types/core/scene';

/**
 * Decode an image data URL just far enough to read its natural size, for the
 * fit-the-grid default cell registration. Resolves null (never rejects) when
 * decoding is unavailable or fails — the caller falls back to a fixed default.
 */
function measureImageSize(dataUrl: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}

export interface UseSceneMapParams {
  selectedScene: SceneDocument | undefined;
  /** Drives the per-scene notice clear (a previous scene's error must not linger). */
  selectedSceneId: string | null;
  state: SceneState | undefined;
  onUpdateScene: (scene: SceneDocument) => void;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
  /** Surface validation/rejection messages on the host (its actionIssues banner). */
  onIssues: (issues: string[]) => void;
}

export function useSceneMap({
  selectedScene,
  selectedSceneId,
  state,
  onUpdateScene,
  onAppendSceneEvent,
  onIssues,
}: UseSceneMapParams) {
  // Map-image import/storage problem, surfaced inside the Map panel.
  const [mapNotice, setMapNotice] = useState<string | null>(null);

  useEffect(() => {
    setMapNotice(null);
  }, [selectedSceneId]);

  // Storage lookup keyed on the reference object: every map update creates a
  // fresh `map` object, so an import that just stored a new asset re-reads
  // storage through this memo without an extra invalidation signal.
  const sceneMap = selectedScene?.map;
  const mapAsset = useMemo(
    () => (sceneMap ? loadMapAsset(sceneMap.assetHash) : undefined),
    [sceneMap]
  );
  const mapImage =
    sceneMap && mapAsset
      ? { dataUrl: mapAsset.dataUrl, registration: sceneMap.gridRegistration }
      : undefined;

  const handleImportMapImage = useCallback(
    async (file: File) => {
      if (!selectedScene || !state) return;
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const result = await createMapAsset(file.type, dataUrl);
        if (!result.ok) {
          setMapNotice(result.error);
          return;
        }
        setMapNotice(null);
        const existing = selectedScene.map;
        // Same image re-imported: keep the registration the user already
        // dialed in. Otherwise default to fit-the-grid-width (or 50px/cell
        // when the image cannot be decoded here).
        const measured = await measureImageSize(dataUrl);
        const cellSizePx =
          measured && measured.width > 0
            ? Math.max(1, Math.round(measured.width / state.grid.width))
            : 50;
        onUpdateScene({
          ...selectedScene,
          map: {
            assetHash: result.asset.hash,
            gridRegistration:
              existing && existing.assetHash === result.asset.hash
                ? existing.gridRegistration
                : { offsetX: 0, offsetY: 0, cellSizePx },
          },
        });
      } catch {
        setMapNotice('The image could not be read.');
      }
    },
    [selectedScene, state, onUpdateScene]
  );

  const handleChangeMapRegistration = useCallback(
    (gridRegistration: SceneGridRegistration) => {
      if (!selectedScene?.map) return;
      onUpdateScene({
        ...selectedScene,
        map: { ...selectedScene.map, gridRegistration },
      });
    },
    [selectedScene, onUpdateScene]
  );

  // --- Phase 10 (RFC 006 x RFC 002): AI grid detection over the map image. ---
  // The pixel dimensions the validator requires are MEASURED here from the
  // decoded asset, never taken from the model — see analyzeMapFlow's header. A
  // map whose image cannot be decoded yields no measurement, and the affordance
  // is simply absent rather than sending a request that cannot be validated.
  const [mapImageSize, setMapImageSize] = useState<{ widthPx: number; heightPx: number } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    if (!mapAsset) {
      setMapImageSize(null);
      return;
    }
    void measureImageSize(mapAsset.dataUrl).then((measured) => {
      if (cancelled) return;
      setMapImageSize(
        measured && measured.width > 0 && measured.height > 0
          ? { widthPx: measured.width, heightPx: measured.height }
          : null
      );
    });
    return () => {
      cancelled = true;
    };
  }, [mapAsset]);

  const handleAnalyzeGrid = useCallback(
    (hint?: string) => {
      // Guarded by the same condition that decides whether to pass this down.
      const asset = mapAsset!;
      const size = mapImageSize!;
      return analyzeMapWithAi({
        image: { dataUrl: asset.dataUrl, mediaType: asset.mime },
        imageSize: size,
        ...(hint ? { hint } : {}),
      });
    },
    [mapAsset, mapImageSize]
  );

  /**
   * Apply an ACCEPTED proposal. Everything applied here is an artifact the
   * manual path already produces: the registration goes onto the map reference
   * exactly as the three offset inputs write it, and the terrain/cover/hazard
   * boxes become ordinary `add-marker` events through `applySceneIntents` — the
   * same validate-then-append route every manual marker takes, so a rejected
   * intent is surfaced rather than silently applied. Spawn zones are reported,
   * not placed: they are an encounter-builder input, not scene state.
   */
  const handleApplyMapAnalysis = useCallback(
    (proposal: GridGeometryProposal) => {
      if (!selectedScene?.map) return;
      const acceptance = acceptGridGeometryProposal(proposal, { markerIdFactory: generateUUID });
      if (!acceptance.accepted || !acceptance.registration) {
        setMapNotice('That grid proposal could not be applied.');
        return;
      }

      const { offsetXPx, offsetYPx, cellSizePx } = acceptance.registration;
      onUpdateScene({
        ...selectedScene,
        map: {
          ...selectedScene.map,
          gridRegistration: { offsetX: offsetXPx, offsetY: offsetYPx, cellSizePx },
        },
      });

      if (acceptance.intents.length > 0) {
        const { events, rejected } = applySceneIntents(selectedScene, acceptance.intents, {
          eventIdFactory: generateUUID,
        });
        events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
        onIssues(rejected);
      }
      setMapNotice(null);
    },
    [selectedScene, onUpdateScene, onAppendSceneEvent, onIssues]
  );

  const handleRemoveMap = useCallback(() => {
    if (!selectedScene?.map) return;
    // Drop only the reference; the content-addressed asset stays stored (other
    // scenes may share it, and re-adding the same image is then instant).
    const rest = { ...selectedScene };
    delete rest.map;
    onUpdateScene(rest);
    setMapNotice(null);
  }, [selectedScene, onUpdateScene]);

  return {
    mapAsset,
    mapImage,
    mapImageSize,
    mapNotice,
    handleImportMapImage,
    handleChangeMapRegistration,
    handleRemoveMap,
    handleAnalyzeGrid,
    handleApplyMapAnalysis,
  };
}
