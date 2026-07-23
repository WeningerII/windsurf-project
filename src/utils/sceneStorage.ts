import type { SceneDocument, SceneEvent } from '../types/core/scene';
import { parseSceneDocument } from './boundaryValidation';
import {
  isMapAssetShape,
  loadMapAsset,
  saveMapAsset,
  verifyMapAssetHash,
  type SceneMapAsset,
} from './mapAssetStorage';
import { canUseLocalStorage } from './safeStorage';

const STORAGE_KEY = 'rpg-scenes-v1';
/** Exported for cross-tab `storage` event filtering in useScenes. */
export const SCENES_STORAGE_KEY = STORAGE_KEY;
const STORAGE_VERSION = '1.0';

interface SceneStorageData {
  version: typeof STORAGE_VERSION;
  scenes: SceneDocument[];
  lastModified: string;
}

/**
 * The export envelope: the storage payload plus, when any exported scene
 * references a map image, that asset carried **by value** so the scene
 * round-trips on another machine. Additive — importers that predate `assets`
 * (and `importScenesWithReport` itself) read only `scenes` and are unaffected.
 */
interface SceneExportData extends SceneStorageData {
  assets?: Record<string, SceneMapAsset>;
}

function readScenesField(raw: string): unknown[] | null {
  const parsed: unknown = JSON.parse(raw);
  const scenesField =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as { scenes?: unknown }).scenes
      : undefined;
  return Array.isArray(scenesField) ? scenesField : null;
}

// Parse, don't cast: validate each candidate scene and drop structurally
// invalid ones, so a single malformed record can neither crash hydration nor
// masquerade as a scene.
function collectValidScenes(candidates: unknown[]): SceneDocument[] {
  const now = new Date();
  const scenes: SceneDocument[] = [];
  for (const candidate of candidates) {
    const result = parseSceneDocument(candidate, now);
    if (result.ok) {
      scenes.push(hydrateScene(result.value));
    }
  }
  return scenes;
}

/**
 * Parse a raw scenes payload (e.g. a cross-tab `storage` event value).
 * Returns null when the payload is not a structurally valid snapshot.
 */
export function parseScenesSnapshot(raw: string): SceneDocument[] | null {
  try {
    const scenesField = readScenesField(raw);
    if (scenesField === null) {
      return null;
    }
    return collectValidScenes(scenesField);
  } catch {
    return null;
  }
}

export function loadScenes(): SceneDocument[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  return parseScenesSnapshot(raw) ?? [];
}

export function saveScenes(scenes: SceneDocument[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  const payload: SceneStorageData = {
    version: STORAGE_VERSION,
    scenes,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadScene(id: string): SceneDocument | undefined {
  return loadScenes().find((scene) => scene.id === id);
}

export function upsertScene(scene: SceneDocument): SceneDocument[] {
  const scenes = loadScenes();
  const nextScene = hydrateScene(scene);
  const existingIndex = scenes.findIndex((entry) => entry.id === scene.id);
  const nextScenes =
    existingIndex >= 0
      ? scenes.map((entry, index) => (index === existingIndex ? nextScene : entry))
      : [...scenes, nextScene];

  saveScenes(nextScenes);
  return nextScenes;
}

export function deleteScene(id: string): SceneDocument[] {
  const nextScenes = loadScenes().filter((scene) => scene.id !== id);
  saveScenes(nextScenes);
  return nextScenes;
}

export function clearSceneStorage(): void {
  if (!canUseLocalStorage()) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

export function exportScenes(scenes: SceneDocument[]): string {
  // Carry each referenced map asset by value (deduplicated by hash). A
  // reference whose asset is not on this device exports without it — the
  // receiving end renders the bare grid, exactly like this one does.
  const assets: Record<string, SceneMapAsset> = {};
  for (const scene of scenes) {
    const hash = scene.map?.assetHash;
    if (!hash || assets[hash]) continue;
    const asset = loadMapAsset(hash);
    if (asset) assets[hash] = asset;
  }
  const payload: SceneExportData = {
    version: STORAGE_VERSION,
    scenes,
    lastModified: new Date().toISOString(),
    ...(Object.keys(assets).length > 0 ? { assets } : {}),
  };
  return JSON.stringify(payload, null, 2);
}

export interface ImportMapAssetsResult {
  /** Assets stored (or already present) after passing shape + hash checks. */
  storedCount: number;
  /** Candidates rejected by validation or hash mismatch. */
  droppedCount: number;
}

/**
 * Store the map assets carried by a scene export, verifying each declared
 * hash against the actual digest of its data URL — a tampered or corrupted
 * image is dropped (its scene still imports and renders the bare grid).
 * Async because hashing is; scene import itself stays synchronous.
 */
export async function importMapAssetsFromPayload(
  jsonString: string
): Promise<ImportMapAssetsResult> {
  let assetsField: unknown;
  try {
    const parsed: unknown = JSON.parse(jsonString);
    assetsField =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as { assets?: unknown }).assets
        : undefined;
  } catch {
    return { storedCount: 0, droppedCount: 0 };
  }
  if (!assetsField || typeof assetsField !== 'object' || Array.isArray(assetsField)) {
    return { storedCount: 0, droppedCount: 0 };
  }

  let storedCount = 0;
  let droppedCount = 0;
  for (const candidate of Object.values(assetsField)) {
    if (!isMapAssetShape(candidate) || !(await verifyMapAssetHash(candidate))) {
      droppedCount += 1;
      continue;
    }
    if (saveMapAsset(candidate)) {
      storedCount += 1;
    } else {
      droppedCount += 1; // over the size cap or storage full
    }
  }
  return { storedCount, droppedCount };
}

export interface ImportScenesResult {
  scenes: SceneDocument[];
  /** How many array entries were dropped by validation (partial import). */
  droppedCount: number;
}

/**
 * Import scenes from an export payload, reporting how many records were dropped
 * by validation so callers can tell a partial (or empty) import apart from a
 * clean one. Throws on a structurally invalid payload.
 */
export function importScenesWithReport(jsonString: string): ImportScenesResult {
  let scenesField: unknown[] | null;
  try {
    scenesField = readScenesField(jsonString);
  } catch {
    throw new Error('Failed to import scenes. Invalid JSON format.');
  }
  if (scenesField === null) {
    throw new Error('Failed to import scenes. Invalid JSON format.');
  }
  const scenes = collectValidScenes(scenesField);
  return { scenes, droppedCount: scenesField.length - scenes.length };
}

/** Backward-compatible wrapper around {@link importScenesWithReport}. */
export function importScenes(jsonString: string): SceneDocument[] {
  return importScenesWithReport(jsonString).scenes;
}

function hydrateScene(scene: SceneDocument): SceneDocument {
  return {
    ...scene,
    createdAt: new Date(scene.createdAt),
    updatedAt: new Date(scene.updatedAt),
    initialState: {
      ...scene.initialState,
      grid: { ...scene.initialState.grid },
      tokens: { ...scene.initialState.tokens },
      markers: { ...scene.initialState.markers },
      initiative: scene.initialState.initiative.map((entry) => ({ ...entry })),
    },
    events: scene.events.map(hydrateSceneEvent),
    version: 1,
  };
}

function hydrateSceneEvent(event: SceneEvent): SceneEvent {
  return {
    ...event,
    createdAt: new Date(event.createdAt),
  } as SceneEvent;
}
