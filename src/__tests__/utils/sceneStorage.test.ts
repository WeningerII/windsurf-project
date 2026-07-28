import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appendSceneEvent, createSceneDocument, resolveSceneAction } from '../../scene/runtime';
import { ErrorCategory, ErrorSeverity, errorLogger } from '../../utils/errorLogger';
import { createMapAsset, loadMapAsset } from '../../utils/mapAssetStorage';
import * as notifications from '../../utils/notifications';
import {
  clearSceneStorage,
  deleteScene,
  exportScenes,
  importMapAssetsFromPayload,
  importScenes,
  importScenesWithReport,
  loadScene,
  loadScenes,
  saveScenes,
  SCENES_SAVE_FAILED_MESSAGE,
  upsertScene,
} from '../../utils/sceneStorage';
import type { SceneDocument } from '../../types/core/scene';

const NOW = new Date('2026-05-01T12:00:00.000Z');

describe('sceneStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves, loads, updates, and deletes scene documents', async () => {
    let scene = createSceneDocument({
      id: 'scene-1',
      name: 'Stored Scene',
      systemId: 'dnd-5e-2024',
      campaignId: 'campaign-1',
      now: NOW,
    });
    const result = resolveSceneAction(
      scene,
      {
        type: 'place-token',
        token: {
          id: 'hero',
          name: 'Hero',
          kind: 'character',
          position: { x: 1, y: 1 },
          size: 1,
          refId: 'char-1',
        },
      },
      { eventId: 'event-1', createdAt: NOW }
    );
    scene = appendSceneEvent(scene, result.event!);

    await saveScenes([scene]);

    const loaded = await loadScene('scene-1');
    expect(loaded?.createdAt).toBeInstanceOf(Date);
    expect(loaded?.events[0].createdAt).toBeInstanceOf(Date);
    expect(loaded?.events).toHaveLength(1);

    const renamed = { ...scene, name: 'Renamed Scene', updatedAt: new Date(NOW.getTime() + 1) };
    await upsertScene(renamed);
    expect((await loadScene('scene-1'))?.name).toBe('Renamed Scene');

    await deleteScene('scene-1');
    expect(await loadScenes()).toEqual([]);
  });

  it('round-trips scene exports through import', () => {
    const scene = createSceneDocument({
      id: 'scene-2',
      name: 'Exported Scene',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });

    const imported = importScenes(exportScenes([scene]));

    expect(imported).toHaveLength(1);
    expect(imported[0]).toMatchObject({
      id: 'scene-2',
      name: 'Exported Scene',
      systemId: 'dnd-5e-2024',
    });
    expect(imported[0].createdAt).toBeInstanceOf(Date);
  });

  it('importScenesWithReport counts dropped invalid entries', () => {
    const valid = createSceneDocument({
      id: 'scene-ok',
      name: 'OK',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    const payload = JSON.stringify({
      version: '1.0',
      scenes: [valid, { id: 'no-systemId', name: 'broken' }, 'not an object'],
    });

    const { scenes, droppedCount } = importScenesWithReport(payload);
    expect(scenes).toHaveLength(1);
    expect(scenes[0].id).toBe('scene-ok');
    expect(droppedCount).toBe(2);
  });

  it('importScenesWithReport throws on structurally invalid JSON', () => {
    expect(() => importScenesWithReport('{bad json')).toThrow(/invalid json/i);
    expect(() => importScenesWithReport(JSON.stringify({ version: '1.0' }))).toThrow(
      /invalid json/i
    );
  });

  it('clears scene storage', async () => {
    const scene = createSceneDocument({
      id: 'scene-3',
      name: 'Temporary Scene',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    await saveScenes([scene]);

    await clearSceneStorage();

    expect(await loadScenes()).toEqual([]);
  });
});

describe('sceneStorage map assets (RFC 006 Phase 9)', () => {
  const MAP_DATA_URL = 'data:image/png;base64,bWFwLWltYWdl';

  beforeEach(() => {
    localStorage.clear();
  });

  async function makeSceneWithMap(): Promise<SceneDocument> {
    const stored = await createMapAsset('image/png', MAP_DATA_URL);
    if (!stored.ok) throw new Error(stored.error);
    const scene = createSceneDocument({
      id: 'scene-map',
      name: 'Mapped Scene',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    return {
      ...scene,
      map: {
        assetHash: stored.asset.hash,
        gridRegistration: { offsetX: 12, offsetY: -8, cellSizePx: 70 },
      },
    };
  }

  it('exports a referenced map asset by value, deduplicated by hash', async () => {
    const scene = await makeSceneWithMap();
    const twin: SceneDocument = { ...scene, id: 'scene-map-2', map: scene.map };

    const payload: unknown = JSON.parse(exportScenes([scene, twin]));
    expect(payload).toMatchObject({
      assets: {
        [scene.map!.assetHash]: {
          hash: scene.map!.assetHash,
          mime: 'image/png',
          dataUrl: MAP_DATA_URL,
        },
      },
    });
    // One asset entry despite two referencing scenes.
    expect(Object.keys((payload as { assets: object }).assets)).toHaveLength(1);
  });

  it('exports without an assets field when nothing is referenced or the asset is absent', async () => {
    const bare = createSceneDocument({
      id: 'scene-bare',
      name: 'Bare',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    expect(JSON.parse(exportScenes([bare]))).not.toHaveProperty('assets');

    // A reference whose asset is not on this device exports without it.
    const scene = await makeSceneWithMap();
    localStorage.clear();
    expect(JSON.parse(exportScenes([scene]))).not.toHaveProperty('assets');
  });

  it('round-trips a scene and its map image onto a clean device', async () => {
    const scene = await makeSceneWithMap();
    const payload = exportScenes([scene]);
    localStorage.clear(); // "another machine"

    const { scenes, droppedCount } = importScenesWithReport(payload);
    expect(droppedCount).toBe(0);
    expect(scenes[0].map).toEqual(scene.map);

    const report = await importMapAssetsFromPayload(payload);
    expect(report).toEqual({ storedCount: 1, droppedCount: 0 });
    expect(loadMapAsset(scene.map!.assetHash)?.dataUrl).toBe(MAP_DATA_URL);
  });

  it('drops a tampered asset on import but keeps its scene (bare grid)', async () => {
    const scene = await makeSceneWithMap();
    const parsed = JSON.parse(exportScenes([scene])) as {
      assets: Record<string, { dataUrl: string }>;
    };
    parsed.assets[scene.map!.assetHash].dataUrl = 'data:image/png;base64,dGFtcGVyZWQ=';
    const tampered = JSON.stringify(parsed);
    localStorage.clear();

    const report = await importMapAssetsFromPayload(tampered);
    expect(report).toEqual({ storedCount: 0, droppedCount: 1 });
    expect(loadMapAsset(scene.map!.assetHash)).toBeUndefined();

    // The scene itself still imports; its missing image degrades to no map asset.
    const { scenes } = importScenesWithReport(tampered);
    expect(scenes[0].map?.assetHash).toBe(scene.map!.assetHash);
  });

  it('treats payloads without assets (and non-JSON) as a no-op', async () => {
    expect(
      await importMapAssetsFromPayload(JSON.stringify({ version: '1.0', scenes: [] }))
    ).toEqual({ storedCount: 0, droppedCount: 0 });
    expect(await importMapAssetsFromPayload('{bad json')).toEqual({
      storedCount: 0,
      droppedCount: 0,
    });
  });
});

// A years-long campaign accumulates event logs until the whole-collection
// `setItem` meets the ~5 MB quota. That rejection must not escape the save path
// (the callers are a debounced autosave and an unload handler), and it must not
// vanish silently either.
describe('saveScenes under a localStorage quota rejection', () => {
  const makeScene = (id: string): SceneDocument =>
    createSceneDocument({
      id,
      name: `Scene ${id}`,
      systemId: 'dnd-5e-2024',
      campaignId: 'campaign-quota',
      now: NOW,
    });

  beforeEach(() => {
    localStorage.clear();
    // Clear any failure streak left by a previous test: a successful save is
    // what resets the once-per-streak toast latch.
    saveScenes([makeScene('reset')]);
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not throw, reports through the error funnel, and toasts once per streak', () => {
    const toastSpy = vi.spyOn(notifications, 'emitToast').mockImplementation(() => {});
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    // NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually.
    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('exceeded the quota', 'QuotaExceededError');
    });

    const scenes = [makeScene('scene-quota-1')];

    // 1. The rejection never propagates, and the caller learns it failed.
    expect(() => saveScenes(scenes)).not.toThrow();
    expect(saveScenes(scenes)).toBe(false);

    // 2. It is reported, not swallowed: HIGH severity reaches production
    //    monitoring, and the context carries no scene content.
    expect(logSpy).toHaveBeenCalled();
    const [category, severity, message, error, context] = logSpy.mock.calls[0];
    expect(category).toBe(ErrorCategory.STORAGE);
    expect(severity).toBe(ErrorSeverity.HIGH);
    expect(message).toMatch(/scene save failed/i);
    expect((error as Error).name).toBe('QuotaExceededError');
    expect(context).toMatchObject({ key: 'rpg-scenes-v1', sceneCount: 1 });
    expect(JSON.stringify(context)).not.toContain('Scene scene-quota-1');

    // 3. The user is told once, not once per keystroke.
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith(SCENES_SAVE_FAILED_MESSAGE, 'error');

    // 4. Once storage recovers, a later failure is allowed to speak again.
    setItemSpy.mockRestore();
    expect(saveScenes(scenes)).toBe(true);
    const reFailSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('exceeded the quota', 'QuotaExceededError');
    });
    expect(saveScenes(scenes)).toBe(false);
    expect(toastSpy).toHaveBeenCalledTimes(2);
    reFailSpy.mockRestore();
  });

  it('leaves the previously stored collection intact rather than truncating it', () => {
    vi.spyOn(notifications, 'emitToast').mockImplementation(() => {});
    vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    expect(saveScenes([makeScene('durable')])).toBe(true);
    const before = localStorage.getItem('rpg-scenes-v1');

    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('exceeded the quota', 'QuotaExceededError');
    });
    expect(saveScenes([makeScene('durable'), makeScene('too-big')])).toBe(false);
    setItemSpy.mockRestore();

    // setItem is all-or-nothing per key: the stored payload is STALE (the new
    // scene is missing), never a torn half-write.
    expect(localStorage.getItem('rpg-scenes-v1')).toBe(before);
    expect(loadScenes().map((scene) => scene.id)).toEqual(['durable']);
  });
});
