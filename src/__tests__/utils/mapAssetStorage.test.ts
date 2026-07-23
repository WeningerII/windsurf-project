import { beforeEach, describe, expect, it } from 'vitest';
import {
  MAX_MAP_ASSET_DATA_URL_LENGTH,
  clearMapAssetStorage,
  createMapAsset,
  deleteMapAsset,
  isMapAssetShape,
  loadMapAsset,
  saveMapAsset,
  sha256HexOfText,
  verifyMapAssetHash,
  type SceneMapAsset,
} from '../../utils/mapAssetStorage';

const DATA_URL = 'data:image/png;base64,aGVsbG8tbWFw';

async function makeAsset(dataUrl = DATA_URL): Promise<SceneMapAsset> {
  return { hash: await sha256HexOfText(dataUrl), mime: 'image/png', dataUrl };
}

describe('mapAssetStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('hash stability', () => {
    it('matches the published SHA-256 test vector for "abc"', async () => {
      // FIPS 180-2 test vector — locks the digest algorithm and hex encoding,
      // so hashes written today keep addressing the same assets forever.
      expect(await sha256HexOfText('abc')).toBe(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
      );
    });

    it('is deterministic for equal input and distinct for different input', async () => {
      expect(await sha256HexOfText(DATA_URL)).toBe(await sha256HexOfText(DATA_URL));
      expect(await sha256HexOfText(DATA_URL)).not.toBe(await sha256HexOfText(`${DATA_URL}x`));
    });

    it('verifyMapAssetHash accepts a true hash and rejects a mismatch', async () => {
      const asset = await makeAsset();
      expect(await verifyMapAssetHash(asset)).toBe(true);
      expect(await verifyMapAssetHash({ ...asset, dataUrl: `${DATA_URL}tampered` })).toBe(false);
    });
  });

  describe('storage round-trip', () => {
    it('createMapAsset stores the image retrievable by its hash', async () => {
      const result = await createMapAsset('image/png', DATA_URL);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(loadMapAsset(result.asset.hash)).toEqual({
        hash: result.asset.hash,
        mime: 'image/png',
        dataUrl: DATA_URL,
      });
      expect(await verifyMapAssetHash(result.asset)).toBe(true);
    });

    it('is idempotent for the same content (content-addressed)', async () => {
      const first = await createMapAsset('image/png', DATA_URL);
      const second = await createMapAsset('image/png', DATA_URL);
      expect(first.ok && second.ok).toBe(true);
      if (!first.ok || !second.ok) return;
      expect(second.asset.hash).toBe(first.asset.hash);
      expect(loadMapAsset(first.asset.hash)?.dataUrl).toBe(DATA_URL);
    });

    it('rejects non-image mimes, non-data URLs, and oversized images with clear errors', async () => {
      const notImage = await createMapAsset('text/html', DATA_URL);
      expect(notImage).toEqual({ ok: false, error: expect.stringMatching(/image/i) });

      const notDataUrl = await createMapAsset('image/png', 'https://example.com/map.png');
      expect(notDataUrl.ok).toBe(false);

      const oversized = await createMapAsset(
        'image/png',
        `data:image/png;base64,${'A'.repeat(MAX_MAP_ASSET_DATA_URL_LENGTH)}`
      );
      expect(oversized).toEqual({ ok: false, error: expect.stringMatching(/too large/i) });
    });

    it('saveMapAsset refuses malformed shapes and never throws', async () => {
      expect(saveMapAsset({ hash: 'not-hex', mime: 'image/png', dataUrl: DATA_URL })).toBe(false);
      const asset = await makeAsset();
      expect(saveMapAsset({ ...asset, mime: 'text/plain' })).toBe(false);
      expect(saveMapAsset({ ...asset, dataUrl: 'nope' })).toBe(false);
      expect(isMapAssetShape(asset)).toBe(true);
    });

    it('deletes one asset and clears the store', async () => {
      const asset = await makeAsset();
      expect(saveMapAsset(asset)).toBe(true);

      deleteMapAsset(asset.hash);
      expect(loadMapAsset(asset.hash)).toBeUndefined();

      expect(saveMapAsset(asset)).toBe(true);
      clearMapAssetStorage();
      expect(loadMapAsset(asset.hash)).toBeUndefined();
    });

    it('degrades corrupt storage to a missing asset, never a crash', async () => {
      localStorage.setItem('rpg-map-assets-v1', '{not json');
      const asset = await makeAsset();
      expect(loadMapAsset(asset.hash)).toBeUndefined();
      // A malformed record and a record filed under the wrong key are dropped.
      localStorage.setItem(
        'rpg-map-assets-v1',
        JSON.stringify({
          version: '1.0',
          assets: {
            [asset.hash]: { hash: asset.hash, mime: 'image/png' }, // no dataUrl
            ['0'.repeat(64)]: asset, // filed under a key that is not its hash
          },
          lastModified: new Date().toISOString(),
        })
      );
      expect(loadMapAsset(asset.hash)).toBeUndefined();
      expect(loadMapAsset('0'.repeat(64))).toBeUndefined();
    });
  });
});
