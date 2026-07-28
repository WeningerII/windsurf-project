import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSceneDocument } from '../../scene/runtime';
import { idbLoadScenes, idbSaveScenes } from '../../utils/indexedDBAdapter';
import * as notifications from '../../utils/notifications';
import {
  clearSceneStorage,
  loadScenes,
  loadScenesFromLocalStorage,
  resetSceneStorageDiagnosticsForTests,
  saveScenes,
  SCENES_STORAGE_KEY,
} from '../../utils/sceneStorage';
import type { SceneDocument, SceneEvent } from '../../types/core/scene';

const NOW = new Date('2026-05-01T12:00:00.000Z');

/**
 * The practical localStorage ceiling browsers enforce per origin. happy-dom
 * has no quota, so the oversized-payload test installs this one to reproduce
 * the failure a real long-running campaign hits.
 */
const LOCAL_STORAGE_CEILING_BYTES = 5 * 1024 * 1024;

function makeScene(id: string, overrides: Partial<SceneDocument> = {}): SceneDocument {
  return {
    ...createSceneDocument({
      id,
      name: `Scene ${id}`,
      systemId: 'dnd-5e-2024',
      now: NOW,
    }),
    ...overrides,
  };
}

/** A scene whose event log is deliberately bulky — a multi-year campaign. */
function makeHeavyScene(id: string, eventCount: number, filler: string): SceneDocument {
  const events: SceneEvent[] = Array.from({ length: eventCount }, (_, index) => ({
    id: `${id}-event-${index}`,
    type: 'token.damaged',
    sequence: index + 1,
    createdAt: NOW,
    payload: { damages: [{ tokenId: 'hero', amount: 1 }], cause: filler },
  }));
  return makeScene(id, { events });
}

function seedLocalStorage(scenes: SceneDocument[]): void {
  localStorage.setItem(
    SCENES_STORAGE_KEY,
    JSON.stringify({ version: '1.0', scenes, lastModified: NOW.toISOString() })
  );
}

function deleteDatabase(): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase('rpg-character-sheet');
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });
}

/** Run `body` with IndexedDB removed from the global, as in private browsing. */
async function withoutIndexedDB(body: () => Promise<void>): Promise<void> {
  const original = globalThis.indexedDB;
  Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined });
  try {
    await body();
  } finally {
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: original });
  }
}

/**
 * Make `localStorage.setItem` reject anything over `limit` bytes.
 *
 * Installed with `defineProperty` and restored the same way: happy-dom's
 * Storage is a Proxy, so plain assignment writes a storage ENTRY named
 * "setItem" instead of overriding the method, and `vi.restoreAllMocks` leaves
 * a `vi.spyOn` patch behind. Either failure mode leaks into later tests and
 * looks like a production bug.
 */
let restoreLocalStorageQuota: (() => void) | null = null;

function defineSetItem(impl: (key: string, value: string) => void): void {
  Object.defineProperty(localStorage, 'setItem', {
    configurable: true,
    writable: true,
    value: impl,
  });
}

function installLocalStorageQuota(limit: number): void {
  const real = localStorage.setItem.bind(localStorage) as (key: string, value: string) => void;
  defineSetItem((key, value) => {
    if (value.length > limit) {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
    }
    real(key, value);
  });
  restoreLocalStorageQuota = () => defineSetItem(real);
}

describe('sceneStorage IndexedDB tier', () => {
  beforeEach(async () => {
    localStorage.clear();
    resetSceneStorageDiagnosticsForTests();
    await deleteDatabase();
  });

  afterEach(() => {
    restoreLocalStorageQuota?.();
    restoreLocalStorageQuota = null;
    vi.restoreAllMocks();
  });

  it('writes both tiers and reads the collection back', async () => {
    const result = await saveScenes([makeScene('scene-1')]);

    expect(result).toMatchObject({ ok: true, localStorage: true, indexedDB: true });
    expect(localStorage.getItem(SCENES_STORAGE_KEY)).toBeTruthy();
    expect(await idbLoadScenes()).toHaveLength(1);

    const loaded = await loadScenes();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('scene-1');
    expect(loaded[0].createdAt).toBeInstanceOf(Date);
  });

  it('merges the two tiers by updatedAt, keeping scenes present on only one side', async () => {
    // IndexedDB holds the durable copy plus a scene localStorage never had.
    await idbSaveScenes([
      makeScene('shared', { name: 'Stale', updatedAt: new Date('2026-05-01T12:00:00.000Z') }),
      makeScene('idb-only'),
    ]);
    // localStorage committed a newer edit to the shared scene, plus its own.
    seedLocalStorage([
      makeScene('shared', { name: 'Fresh', updatedAt: new Date('2026-05-02T12:00:00.000Z') }),
      makeScene('local-only'),
    ]);

    const loaded = await loadScenes();
    const byId = new Map(loaded.map((scene) => [scene.id, scene]));

    expect(loaded).toHaveLength(3);
    expect(byId.get('shared')?.name).toBe('Fresh');
    expect(byId.get('idb-only')).toBeDefined();
    expect(byId.get('local-only')).toBeDefined();
  });

  describe('migration from localStorage', () => {
    it('promotes an existing localStorage collection into IndexedDB on first load', async () => {
      seedLocalStorage([makeScene('legacy-1'), makeScene('legacy-2')]);
      expect(await idbLoadScenes()).toBeNull();

      const loaded = await loadScenes();

      expect(loaded.map((scene) => scene.id)).toEqual(['legacy-1', 'legacy-2']);
      expect(await idbLoadScenes()).toHaveLength(2);
    });

    it('is idempotent: running the load twice neither duplicates nor drops scenes', async () => {
      seedLocalStorage([makeScene('legacy-1'), makeScene('legacy-2')]);

      const first = await loadScenes();
      const second = await loadScenes();
      const third = await loadScenes();

      expect(first).toHaveLength(2);
      expect(second).toHaveLength(2);
      expect(third).toHaveLength(2);
      expect(await idbLoadScenes()).toHaveLength(2);
      expect(second.map((scene) => scene.id).sort()).toEqual(['legacy-1', 'legacy-2']);
    });

    it('stays idempotent when the migration marker is lost and the copy runs again', async () => {
      const scenes = [makeScene('legacy-1'), makeScene('legacy-2')];
      seedLocalStorage(scenes);

      await loadScenes();
      // Simulate the marker being wiped (e.g. an account-switch clear that
      // left the localStorage snapshot in place) by re-running the copy: the
      // store is keyed by scene id, so a repeat is a replace, not an append.
      await idbSaveScenes(scenes);
      await idbSaveScenes(scenes);

      expect(await idbLoadScenes()).toHaveLength(2);
      expect(await loadScenes()).toHaveLength(2);
    });

    it('does not migrate an empty localStorage collection', async () => {
      expect(await loadScenes()).toEqual([]);
      expect(await idbLoadScenes()).toBeNull();
    });
  });

  describe('localStorage fallback when IndexedDB is unavailable', () => {
    it('saves and loads through localStorage alone', async () => {
      await withoutIndexedDB(async () => {
        const result = await saveScenes([makeScene('fallback-1')]);
        expect(result).toMatchObject({ ok: true, localStorage: true, indexedDB: false });

        const loaded = await loadScenes();
        expect(loaded).toHaveLength(1);
        expect(loaded[0].id).toBe('fallback-1');
      });
    });

    it('preserves the quota guard: a rejected write reports a visible failure, never throws', async () => {
      installLocalStorageQuota(64);

      await withoutIndexedDB(async () => {
        const result = await saveScenes([makeScene('too-big-for-fallback')]);

        expect(result.ok).toBe(false);
        expect(result.localStorage).toBe(false);
        expect(result.indexedDB).toBe(false);
        expect(result.error).toMatch(/could not be saved/i);
      });
    });

    it('clearSceneStorage still empties the fallback tier', async () => {
      await withoutIndexedDB(async () => {
        await saveScenes([makeScene('fallback-clear')]);
        await clearSceneStorage();
        expect(await loadScenes()).toEqual([]);
      });
    });
  });

  describe('payloads beyond the localStorage ceiling', () => {
    it('round-trips a collection larger than 5 MB through IndexedDB', async () => {
      const filler = 'x'.repeat(4096);
      // ~1,400 combat events across two scenes: a couple of campaign-years of
      // logged history, and comfortably past the localStorage ceiling.
      const scenes = [
        makeHeavyScene('campaign-a', 700, filler),
        makeHeavyScene('campaign-b', 700, filler),
      ];
      const payloadBytes = JSON.stringify(scenes).length;
      expect(payloadBytes).toBeGreaterThan(LOCAL_STORAGE_CEILING_BYTES);

      installLocalStorageQuota(LOCAL_STORAGE_CEILING_BYTES);

      const result = await saveScenes(scenes);
      expect(result).toMatchObject({ ok: true, localStorage: false, indexedDB: true });

      // The fallback tier legitimately holds nothing; the durable tier holds
      // everything, and loadScenes returns the whole collection.
      expect(loadScenesFromLocalStorage()).toEqual([]);

      const loaded = await loadScenes();
      expect(loaded).toHaveLength(2);
      expect(loaded.map((scene) => scene.id).sort()).toEqual(['campaign-a', 'campaign-b']);
      expect(loaded[0].events).toHaveLength(700);
      expect(loaded[0].events[0].createdAt).toBeInstanceOf(Date);
      expect(JSON.stringify(loaded).length).toBeGreaterThan(LOCAL_STORAGE_CEILING_BYTES);
    });

    it('warns once per streak that scenes are saving to IndexedDB only', async () => {
      const toast = vi.spyOn(notifications, 'emitToast').mockImplementation(() => undefined);
      const filler = 'x'.repeat(4096);
      const scenes = [makeHeavyScene('campaign-a', 1400, filler)];
      installLocalStorageQuota(LOCAL_STORAGE_CEILING_BYTES);

      await saveScenes(scenes);
      await saveScenes(scenes);
      await saveScenes(scenes);

      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenCalledWith(
        'Browser storage is full. Scenes are saving to larger storage (IndexedDB) only.',
        'warning'
      );
    });

    it('drops the stale localStorage snapshot a rejected write left behind', async () => {
      // A save that fits, then one that does not: setItem leaving the OLD
      // payload in place is what made the collection silently revert on
      // reload, so the oversized save must remove it.
      await saveScenes([makeScene('small-1')]);
      expect(localStorage.getItem(SCENES_STORAGE_KEY)).toBeTruthy();

      const filler = 'x'.repeat(4096);
      installLocalStorageQuota(LOCAL_STORAGE_CEILING_BYTES);
      await saveScenes([makeScene('small-1'), makeHeavyScene('campaign-a', 1400, filler)]);

      expect(localStorage.getItem(SCENES_STORAGE_KEY)).toBeNull();
      const loaded = await loadScenes();
      expect(loaded.map((scene) => scene.id).sort()).toEqual(['campaign-a', 'small-1']);
    });
  });
});
