/**
 * Map-asset management for scenes (MASTER_PLAN Phase 9).
 *
 * A background map is a content-addressed image: its `hash` is derived from the
 * image bytes, and scene `map.set` events reference only that hash. The bytes
 * live on the {@link SceneDocument} (`assets`), so they are stored once, dedupe
 * automatically, travel with export/import, and a replay always resolves to the
 * same asset. Pure and deterministic — no storage, no I/O.
 */
import type { SceneDocument, SceneMapAsset } from '../types/core/scene';

/**
 * cyrb53 — a fast, well-distributed non-cryptographic 53-bit hash. We only need
 * a stable content id for local map assets (not a security digest), and this is
 * dependency-free and deterministic across devices replaying the same export.
 */
function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let index = 0; index < str.length; index += 1) {
    const ch = str.charCodeAt(index);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** Stable content hash of an image data URL (14 hex chars). */
export function hashImageContent(dataUrl: string): string {
  return cyrb53(dataUrl).toString(16).padStart(14, '0');
}

/** Build a content-addressed map asset from an image data URL. */
export function createMapAsset(dataUrl: string, mediaType: string): SceneMapAsset {
  return { hash: hashImageContent(dataUrl), mediaType, dataUrl };
}

/** Look up a stored map asset by hash. */
export function getSceneMapAsset(document: SceneDocument, hash: string): SceneMapAsset | undefined {
  return document.assets?.[hash];
}

/**
 * Store a map asset on the document (keyed by its hash). Content-addressed, so
 * adding the same image twice is a no-op that returns the document unchanged.
 */
export function addSceneMapAsset(document: SceneDocument, asset: SceneMapAsset): SceneDocument {
  if (document.assets?.[asset.hash]) return document;
  return {
    ...document,
    assets: { ...(document.assets ?? {}), [asset.hash]: { ...asset } },
  };
}

/**
 * The asset hash the scene's CURRENT map state references — the last `map.set`
 * still in effect after the full event log (or the initial map, or none after a
 * `map.cleared`). Pruning to this keeps export lean: the app always folds to the
 * latest state, so only the active map's bytes are needed, while replacing or
 * clearing a map frees the old art.
 */
export function referencedAssetHashes(document: SceneDocument): Set<string> {
  let activeHash = document.initialState.map?.assetHash;
  for (const event of document.events) {
    if (event.type === 'map.set') activeHash = event.payload.registration.assetHash;
    else if (event.type === 'map.cleared') activeHash = undefined;
  }
  return new Set(activeHash ? [activeHash] : []);
}

/**
 * Drop stored assets no event references (e.g. after a map is replaced or
 * cleared), so an export carries only live art. Returns the document unchanged
 * when nothing is prunable.
 */
export function pruneUnusedAssets(document: SceneDocument): SceneDocument {
  if (!document.assets) return document;
  const referenced = referencedAssetHashes(document);
  const entries = Object.entries(document.assets).filter(([hash]) => referenced.has(hash));
  if (entries.length === Object.keys(document.assets).length) return document;
  return { ...document, assets: Object.fromEntries(entries) };
}
