import type { SceneDocument, SceneEvent } from '../types/core/scene';
import { parseSceneDocument } from './boundaryValidation';
import { ErrorCategory, ErrorSeverity, errorLogger } from './errorLogger';
import {
  idbClearScenes,
  idbHasMigratedScenes,
  idbLoadScenes,
  idbSaveScenes,
  idbSetScenesMigrated,
  isIndexedDBAvailable,
} from './indexedDBAdapter';
import {
  isMapAssetShape,
  loadMapAsset,
  saveMapAsset,
  verifyMapAssetHash,
  type SceneMapAsset,
} from './mapAssetStorage';
import { emitToast } from './notifications';
import { canUseLocalStorage } from './safeStorage';

const STORAGE_KEY = 'rpg-scenes-v1';
/** Exported for cross-tab `storage` event filtering in useScenes. */
export const SCENES_STORAGE_KEY = STORAGE_KEY;
const STORAGE_VERSION = '1.0';

const LOCAL_STORAGE_ONLY_MESSAGE =
  'Browser storage is full. Scenes are saving to larger storage (IndexedDB) only.';
const IDB_ONLY_FAILURE_MESSAGE =
  'Larger storage (IndexedDB) is unavailable. Scenes are saving to browser storage only, which is limited.';
const BOTH_STORES_FAILED_MESSAGE =
  'Browser storage is full and IndexedDB is unavailable. Recent scene changes could not be saved.';

let hasShownLocalStorageOnlyWarning = false;
let hasShownIdbOnlyWarning = false;
let hasShownBothStoresFailedWarning = false;

/** Reset the once-per-streak warning latches (tests only). */
export function resetSceneStorageDiagnosticsForTests(): void {
  hasShownLocalStorageOnlyWarning = false;
  hasShownIdbOnlyWarning = false;
  hasShownBothStoresFailedWarning = false;
}

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

/**
 * The synchronous localStorage snapshot — the fallback tier, and the fast path
 * that paints before the IndexedDB read resolves.
 *
 * This is NOT the whole collection once a campaign has outgrown the ~5 MB
 * localStorage quota: past that point `saveScenes` drops this key and
 * IndexedDB becomes the sole store, so this returns `[]` while
 * {@link loadScenes} still returns everything. Named for what it actually
 * reads so no caller mistakes it for "all scenes".
 */
export function loadScenesFromLocalStorage(): SceneDocument[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) {
    return [];
  }

  return parseScenesSnapshot(raw) ?? [];
}

/**
 * `updatedAt`-aware union of two scene collections. Scenes carry a fixed
 * `version: 1` (the event log, not the document, is the history), so
 * `updatedAt` is the only ordering signal. `incoming` wins exact ties, which is
 * why the caller passes localStorage as `incoming`: on identical timestamps
 * prefer the synchronously-committed store over the async mirror.
 *
 * Scenes present on only one side are kept. That means a scene deleted while
 * one tier was unwritable can reappear — the same trade `documentStorage`
 * makes, and the reason `saveScenes` drops a snapshot it can no longer keep
 * current instead of leaving a stale one behind.
 */
function mergeSceneCollections(
  current: SceneDocument[],
  incoming: SceneDocument[]
): SceneDocument[] {
  const merged = new Map<string, SceneDocument>();
  current.forEach((scene) => merged.set(scene.id, scene));
  incoming.forEach((scene) => {
    const existing = merged.get(scene.id);
    if (!existing || scene.updatedAt >= existing.updatedAt) {
      merged.set(scene.id, scene);
    }
  });
  return Array.from(merged.values());
}

/**
 * Promote a localStorage-only collection into IndexedDB on first contact.
 *
 * Idempotent twice over: the `scenes-migrated-from-localstorage` meta flag
 * short-circuits repeat runs, and `idbSaveScenes` is a full replace into a
 * store keyed by scene `id`, so even a migration that runs again (flag lost,
 * concurrent tabs) overwrites rather than duplicates.
 */
async function migrateLocalScenesToIdb(localScenes: SceneDocument[]): Promise<void> {
  if (localScenes.length === 0) return;
  try {
    if (await idbHasMigratedScenes()) return;
    await idbSaveScenes(localScenes);
    await idbSetScenesMigrated();
  } catch (error) {
    // Migration failed; localStorage remains authoritative and the next load
    // tries again.
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.LOW,
      'Scene migration from localStorage to IndexedDB failed; retrying on next load',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Load the scene collection from both tiers.
 *
 * IndexedDB is the durable tier (quota measured in hundreds of MB, not ~5 MB);
 * localStorage is the fallback and the cross-tab channel. Both are read and
 * merged by `updatedAt` because they routinely diverge: the unload-time flush
 * commits localStorage synchronously while its IndexedDB write may never land,
 * and an oversized collection lives only in IndexedDB.
 */
export async function loadScenes(): Promise<SceneDocument[]> {
  const localScenes = loadScenesFromLocalStorage();

  if (!isIndexedDBAvailable()) {
    return localScenes;
  }

  let idbRecords: unknown[] | null = null;
  try {
    idbRecords = await idbLoadScenes();
  } catch {
    idbRecords = null;
  }

  // Parse, don't cast — the IndexedDB tier gets the same validation as the
  // localStorage one, so one malformed record cannot poison a load.
  const idbScenes = idbRecords === null ? [] : collectValidScenes(idbRecords);

  if (idbScenes.length === 0) {
    await migrateLocalScenesToIdb(localScenes);
    return localScenes;
  }

  if (localScenes.length === 0) {
    return idbScenes;
  }

  return mergeSceneCollections(idbScenes, localScenes);
}

/** Which stores hold the collection after a {@link saveScenes} call. */
export interface SaveScenesResult {
  /** True when the collection landed in at least one store. */
  ok: boolean;
  /** The localStorage snapshot is current. */
  localStorage: boolean;
  /** The IndexedDB tier is current. */
  indexedDB: boolean;
  /** User-facing explanation when `ok` is false. */
  error?: string;
}

function writeLocalSnapshot(scenes: SceneDocument[]): boolean {
  if (!canUseLocalStorage()) return false;
  const payload: SceneStorageData = {
    version: STORAGE_VERSION,
    scenes,
    lastModified: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // Quota exceeded, or a hostile storage environment. Never throw: the
    // caller decides what a localStorage miss means based on the other tier.
    return false;
  }
}

/**
 * A rejected `setItem` leaves the PREVIOUS payload in place, so the snapshot
 * silently becomes a stale older version of the collection. Once IndexedDB has
 * the current one, drop the stale key rather than let the next load merge an
 * old scene list (or resurrect deleted scenes) over the durable tier.
 */
function dropStaleLocalSnapshot(): void {
  if (!canUseLocalStorage()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing more to do; the merge in loadScenes prefers whichever copy is
    // newer by updatedAt.
  }
}

function warnOnce(shown: boolean, message: string): boolean {
  if (!shown) emitToast(message, 'warning');
  return true;
}

/**
 * Persist the whole scene collection.
 *
 * Writes localStorage FIRST and synchronously — before the first `await` — so
 * a debounced flush racing page unload still commits there, then mirrors to
 * IndexedDB. Resolves with which tiers are current; never throws, so a full
 * disk surfaces as a visible, describable failure instead of an exception in a
 * React state updater.
 */
export async function saveScenes(scenes: SceneDocument[]): Promise<SaveScenesResult> {
  const localOk = writeLocalSnapshot(scenes);

  if (!isIndexedDBAvailable()) {
    if (localOk) {
      hasShownLocalStorageOnlyWarning = false;
      return { ok: true, localStorage: true, indexedDB: false };
    }
    // The fallback path with no fallback left: this is the quota guard's case.
    hasShownBothStoresFailedWarning = warnOnce(
      hasShownBothStoresFailedWarning,
      BOTH_STORES_FAILED_MESSAGE
    );
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.HIGH,
      'Scene save failed: localStorage rejected the write and IndexedDB is unavailable',
      undefined,
      { sceneCount: scenes.length }
    );
    return {
      ok: false,
      localStorage: false,
      indexedDB: false,
      error: BOTH_STORES_FAILED_MESSAGE,
    };
  }

  try {
    await idbSaveScenes(scenes);
  } catch (idbError) {
    errorLogger.log(
      ErrorCategory.STORAGE,
      localOk ? ErrorSeverity.MEDIUM : ErrorSeverity.HIGH,
      'Scene save to IndexedDB failed',
      idbError instanceof Error ? idbError : undefined,
      { localStorageOk: localOk, sceneCount: scenes.length }
    );
    if (localOk) {
      hasShownIdbOnlyWarning = warnOnce(hasShownIdbOnlyWarning, IDB_ONLY_FAILURE_MESSAGE);
      return { ok: true, localStorage: true, indexedDB: false };
    }
    hasShownBothStoresFailedWarning = warnOnce(
      hasShownBothStoresFailedWarning,
      BOTH_STORES_FAILED_MESSAGE
    );
    return {
      ok: false,
      localStorage: false,
      indexedDB: false,
      error: BOTH_STORES_FAILED_MESSAGE,
    };
  }

  hasShownIdbOnlyWarning = false;
  hasShownBothStoresFailedWarning = false;

  if (!localOk) {
    dropStaleLocalSnapshot();
    hasShownLocalStorageOnlyWarning = warnOnce(
      hasShownLocalStorageOnlyWarning,
      LOCAL_STORAGE_ONLY_MESSAGE
    );
    return { ok: true, localStorage: false, indexedDB: true };
  }

  hasShownLocalStorageOnlyWarning = false;
  return { ok: true, localStorage: true, indexedDB: true };
}

export async function loadScene(id: string): Promise<SceneDocument | undefined> {
  return (await loadScenes()).find((scene) => scene.id === id);
}

export async function upsertScene(scene: SceneDocument): Promise<SceneDocument[]> {
  const scenes = await loadScenes();
  const nextScene = hydrateScene(scene);
  const existingIndex = scenes.findIndex((entry) => entry.id === scene.id);
  const nextScenes =
    existingIndex >= 0
      ? scenes.map((entry, index) => (index === existingIndex ? nextScene : entry))
      : [...scenes, nextScene];

  await saveScenes(nextScenes);
  return nextScenes;
}

export async function deleteScene(id: string): Promise<SceneDocument[]> {
  const nextScenes = (await loadScenes()).filter((scene) => scene.id !== id);
  await saveScenes(nextScenes);
  return nextScenes;
}

/**
 * Drop both tiers. The localStorage key goes synchronously (so a caller that
 * does not await still gets the fast path cleared); the IndexedDB clear is
 * awaited and its failure propagates, because a swallowed failure would let
 * the next load resurrect a collection the user deleted — including on the
 * account-switch privacy wipe.
 */
export async function clearSceneStorage(): Promise<void> {
  if (canUseLocalStorage()) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Unreachable storage has nothing to remove.
    }
  }

  if (isIndexedDBAvailable()) {
    await idbClearScenes();
  }
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
