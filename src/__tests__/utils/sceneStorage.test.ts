import { beforeEach, describe, expect, it } from 'vitest';
import { appendSceneEvent, createSceneDocument, resolveSceneAction } from '../../scene/runtime';
import {
  clearSceneStorage,
  deleteScene,
  exportScenes,
  importScenes,
  importScenesWithReport,
  loadScene,
  loadScenes,
  saveScenes,
  upsertScene,
} from '../../utils/sceneStorage';

const NOW = new Date('2026-05-01T12:00:00.000Z');

describe('sceneStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves, loads, updates, and deletes scene documents', () => {
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

    saveScenes([scene]);

    const loaded = loadScene('scene-1');
    expect(loaded?.createdAt).toBeInstanceOf(Date);
    expect(loaded?.events[0].createdAt).toBeInstanceOf(Date);
    expect(loaded?.events).toHaveLength(1);

    const renamed = { ...scene, name: 'Renamed Scene', updatedAt: new Date(NOW.getTime() + 1) };
    upsertScene(renamed);
    expect(loadScene('scene-1')?.name).toBe('Renamed Scene');

    deleteScene('scene-1');
    expect(loadScenes()).toEqual([]);
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

  it('clears scene storage', () => {
    const scene = createSceneDocument({
      id: 'scene-3',
      name: 'Temporary Scene',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    saveScenes([scene]);

    clearSceneStorage();

    expect(loadScenes()).toEqual([]);
  });
});
