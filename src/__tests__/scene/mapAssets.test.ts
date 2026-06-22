import { describe, expect, it } from 'vitest';

import {
  addSceneMapAsset,
  createMapAsset,
  getSceneMapAsset,
  hashImageContent,
  pruneUnusedAssets,
  referencedAssetHashes,
} from '../../scene/mapAssets';
import { createSceneDocument } from '../../scene/runtime';
import type { SceneDocument, SceneEvent } from '../../types/core/scene';

/**
 * PHASE 9 (RFC 006): content-addressed map assets. The bytes live on the
 * document and events reference them by hash, so a map is stored once, dedupes,
 * and replays to the same asset.
 */

const PNG = 'data:image/png;base64,AAAA';
const OTHER = 'data:image/png;base64,BBBB';

function mapSetEvent(assetHash: string): SceneEvent {
  return {
    id: `e-${assetHash}`,
    type: 'map.set',
    sequence: 1,
    createdAt: new Date(),
    payload: { registration: { assetHash, pixelsPerCell: 70, offsetX: 0, offsetY: 0 } },
  };
}

describe('hashImageContent', () => {
  it('is deterministic and content-addressed', () => {
    expect(hashImageContent(PNG)).toBe(hashImageContent(PNG));
    expect(hashImageContent(PNG)).not.toBe(hashImageContent(OTHER));
  });

  it('createMapAsset stamps the hash of its content', () => {
    const asset = createMapAsset(PNG, 'image/png');
    expect(asset).toEqual({ hash: hashImageContent(PNG), mediaType: 'image/png', dataUrl: PNG });
  });
});

describe('addSceneMapAsset / getSceneMapAsset', () => {
  const base = createSceneDocument({ id: 's', name: 'S', systemId: 'dnd-5e-2014' });

  it('stores an asset keyed by hash and finds it', () => {
    const asset = createMapAsset(PNG, 'image/png');
    const doc = addSceneMapAsset(base, asset);
    expect(getSceneMapAsset(doc, asset.hash)).toEqual(asset);
  });

  it('dedupes identical content (same hash returns the document unchanged)', () => {
    const asset = createMapAsset(PNG, 'image/png');
    const once = addSceneMapAsset(base, asset);
    const twice = addSceneMapAsset(once, createMapAsset(PNG, 'image/png'));
    expect(twice).toBe(once);
    expect(Object.keys(twice.assets ?? {})).toHaveLength(1);
  });
});

describe('referencedAssetHashes / pruneUnusedAssets', () => {
  function docWith(assets: string[], events: SceneEvent[]): SceneDocument {
    let doc = createSceneDocument({ id: 's', name: 'S', systemId: 'dnd-5e-2014' });
    for (const dataUrl of assets) doc = addSceneMapAsset(doc, createMapAsset(dataUrl, 'image/png'));
    return { ...doc, events };
  }

  it('collects hashes referenced by map.set events', () => {
    const hash = hashImageContent(PNG);
    const doc = docWith([PNG], [mapSetEvent(hash)]);
    expect(referencedAssetHashes(doc).has(hash)).toBe(true);
  });

  it('prunes assets no event references, keeping referenced ones', () => {
    const usedHash = hashImageContent(PNG);
    const doc = docWith([PNG, OTHER], [mapSetEvent(usedHash)]);
    expect(Object.keys(doc.assets ?? {})).toHaveLength(2);

    const pruned = pruneUnusedAssets(doc);
    expect(Object.keys(pruned.assets ?? {})).toEqual([usedHash]);
  });

  it('returns the document unchanged when nothing is prunable', () => {
    const hash = hashImageContent(PNG);
    const doc = docWith([PNG], [mapSetEvent(hash)]);
    expect(pruneUnusedAssets(doc)).toBe(doc);
  });
});
