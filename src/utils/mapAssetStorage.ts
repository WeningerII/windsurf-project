/**
 * Browser-local, content-addressed storage for scene map images (the Phase 9
 * map-asset pipeline, RFC 006). A map asset is `{ hash, mime, dataUrl }` keyed
 * by the SHA-256 of its data URL, stored under its own localStorage key beside
 * the scene documents (`sceneStorage.ts` owns `rpg-scenes-v1`; this module owns
 * `rpg-map-assets-v1`). Content addressing makes storage idempotent (re-import
 * of the same image is a no-op), lets many scenes share one image, and gives
 * export/import a machine-checkable integrity contract: an asset carried by
 * value in a scene export is re-hashed on import and dropped on mismatch.
 *
 * Deliberately provider-free and localStorage-backed to match the scene stack
 * (synchronous reads keep `exportScenes` synchronous). localStorage quota is
 * the honest constraint, so oversized images are rejected up front with a
 * clear error instead of a quota throw mid-save; an IndexedDB mirror (like
 * documentStorage's) is the follow-on if maps outgrow this.
 */
import { safeGetItem, safeRemoveItem, safeSetItem } from './safeStorage';

export interface SceneMapAsset {
  /** SHA-256 (lowercase hex) of `dataUrl` — the storage key. */
  hash: string;
  /** Image MIME type, e.g. `image/png`. */
  mime: string;
  /** The full image as a `data:` URL (self-contained, export-safe). */
  dataUrl: string;
}

const STORAGE_KEY = 'rpg-map-assets-v1';
const STORAGE_VERSION = '1.0';

/**
 * Data-URL length cap (~2.2 MB of image bytes after base64 overhead). Keeps a
 * single map from exhausting the shared ~5 MB localStorage quota.
 */
export const MAX_MAP_ASSET_DATA_URL_LENGTH = 3_000_000;

interface MapAssetStorageData {
  version: typeof STORAGE_VERSION;
  assets: Record<string, SceneMapAsset>;
  lastModified: string;
}

/** SHA-256 of a string, as lowercase hex (WebCrypto; available in all targets). */
export async function sha256HexOfText(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Structural check for one stored/imported asset record. Hash *integrity*
 * (recomputing the digest) is separate and async — see
 * {@link verifyMapAssetHash} — because localStorage reads are sync.
 */
export function isMapAssetShape(value: unknown): value is SceneMapAsset {
  if (!isRecord(value)) return false;
  return (
    typeof value.hash === 'string' &&
    /^[0-9a-f]{64}$/.test(value.hash) &&
    typeof value.mime === 'string' &&
    value.mime.startsWith('image/') &&
    typeof value.dataUrl === 'string' &&
    value.dataUrl.startsWith('data:')
  );
}

/** True when the asset's declared hash matches its data URL's actual digest. */
export async function verifyMapAssetHash(asset: SceneMapAsset): Promise<boolean> {
  return (await sha256HexOfText(asset.dataUrl)) === asset.hash;
}

// Parse, don't cast (the sceneStorage convention): drop malformed records and
// records filed under the wrong key, so corruption degrades to a missing map,
// never a crash or a mislabeled image.
function readAssets(): Record<string, SceneMapAsset> {
  const raw = safeGetItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    const assetsField = isRecord(parsed) ? parsed.assets : undefined;
    if (!isRecord(assetsField)) return {};
    const assets: Record<string, SceneMapAsset> = {};
    for (const [key, candidate] of Object.entries(assetsField)) {
      if (isMapAssetShape(candidate) && candidate.hash === key) {
        assets[key] = { hash: candidate.hash, mime: candidate.mime, dataUrl: candidate.dataUrl };
      }
    }
    return assets;
  } catch {
    return {};
  }
}

function writeAssets(assets: Record<string, SceneMapAsset>): boolean {
  const payload: MapAssetStorageData = {
    version: STORAGE_VERSION,
    assets,
    lastModified: new Date().toISOString(),
  };
  return safeSetItem(STORAGE_KEY, JSON.stringify(payload));
}

/** Load one asset by hash; undefined when absent (graceful — grid renders bare). */
export function loadMapAsset(hash: string): SceneMapAsset | undefined {
  return readAssets()[hash];
}

/**
 * Store an asset under its hash. Returns false (never throws) when the asset
 * is malformed, over the size cap, or storage is unavailable/full.
 */
export function saveMapAsset(asset: SceneMapAsset): boolean {
  if (!isMapAssetShape(asset)) return false;
  if (asset.dataUrl.length > MAX_MAP_ASSET_DATA_URL_LENGTH) return false;
  const assets = readAssets();
  if (assets[asset.hash]) return true; // content-addressed: already present
  return writeAssets({ ...assets, [asset.hash]: asset });
}

/** Remove one asset. Scene references are left alone (they degrade gracefully). */
export function deleteMapAsset(hash: string): void {
  const assets = readAssets();
  if (!assets[hash]) return;
  const rest = { ...assets };
  delete rest[hash];
  writeAssets(rest);
}

/** Drop the whole asset store (mirrors `clearSceneStorage`). */
export function clearMapAssetStorage(): void {
  safeRemoveItem(STORAGE_KEY);
}

export type CreateMapAssetResult =
  | { ok: true; asset: SceneMapAsset }
  | { ok: false; error: string };

/**
 * Build and persist an asset from an image data URL (hashes, validates,
 * stores). The single entry point the import UI and the scene-export import
 * path both go through, so every stored asset is hash-consistent by
 * construction.
 */
export async function createMapAsset(mime: string, dataUrl: string): Promise<CreateMapAssetResult> {
  if (!mime.startsWith('image/')) {
    return { ok: false, error: 'Only image files can be used as a scene map.' };
  }
  if (!dataUrl.startsWith('data:')) {
    return { ok: false, error: 'The image could not be read.' };
  }
  if (dataUrl.length > MAX_MAP_ASSET_DATA_URL_LENGTH) {
    return {
      ok: false,
      error: 'That image is too large to store locally (about 2 MB max). Try a smaller export.',
    };
  }
  const asset: SceneMapAsset = { hash: await sha256HexOfText(dataUrl), mime, dataUrl };
  if (!saveMapAsset(asset)) {
    return { ok: false, error: 'The image could not be saved — local storage may be full.' };
  }
  return { ok: true, asset };
}
