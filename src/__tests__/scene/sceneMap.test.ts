import { describe, expect, it } from 'vitest';

import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type { SceneDocument, SceneEvent, SceneMapRegistration } from '../../types/core/scene';

/**
 * PHASE 9 (RFC 006): the map registration is event-sourced. `set-map` /
 * `clear-map` fold deterministically into `state.map`, and an out-of-grid or
 * malformed registration is rejected like any other scene action.
 */

const registration: SceneMapRegistration = {
  assetHash: 'abc123',
  pixelsPerCell: 70,
  offsetX: 4,
  offsetY: -2,
};

function scene(): SceneDocument {
  return createSceneDocument({ id: 'm', name: 'Map', systemId: 'dnd-5e-2014', seed: 'fixed' });
}

describe('set-map / clear-map', () => {
  it('folds a registration into state.map and replays deterministically', () => {
    let doc = scene();
    const set = resolveSceneAction(doc, { type: 'set-map', registration }, { eventId: 'm1' });
    expect(set.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    doc = appendSceneEvent(doc, set.event!);

    expect(foldSceneEvents(doc).state.map).toEqual(registration);
    // Replay is byte-stable.
    expect(JSON.stringify(foldSceneEvents(doc).state.map)).toBe(
      JSON.stringify(foldSceneEvents(doc).state.map)
    );
  });

  it('clears the map back to undefined', () => {
    let doc = scene();
    doc = appendSceneEvent(
      doc,
      resolveSceneAction(doc, { type: 'set-map', registration }, { eventId: 'm1' }).event!
    );
    doc = appendSceneEvent(
      doc,
      resolveSceneAction(doc, { type: 'clear-map' }, { eventId: 'm2' }).event!
    );
    expect(foldSceneEvents(doc).state.map).toBeUndefined();
  });

  it('rejects a registration with no asset hash or a non-positive scale', () => {
    const doc = scene();
    const noAsset = resolveSceneAction(
      doc,
      { type: 'set-map', registration: { ...registration, assetHash: '' } },
      { eventId: 'bad1' }
    );
    expect(noAsset.event).toBeUndefined();
    expect(noAsset.issues.some((i) => i.code === 'scene-map-asset-required')).toBe(true);

    const badScale = resolveSceneAction(
      doc,
      { type: 'set-map', registration: { ...registration, pixelsPerCell: 0 } },
      { eventId: 'bad2' }
    );
    expect(badScale.event).toBeUndefined();
    expect(badScale.issues.some((i) => i.code === 'scene-map-scale-invalid')).toBe(true);
  });

  it('a corrupt persisted map.set event surfaces an issue without crashing the fold', () => {
    const corrupt: SceneEvent = {
      id: 'bad',
      type: 'map.set',
      sequence: 1,
      createdAt: new Date(),
      payload: { registration: { assetHash: '', pixelsPerCell: -1, offsetX: NaN, offsetY: 0 } },
    };
    const doc = { ...scene(), events: [corrupt] };
    const { state, issues } = foldSceneEvents(doc);
    expect(issues.some((i) => i.severity === 'error')).toBe(true);
    expect(state.map).toBeUndefined(); // the bad event was skipped, not applied
  });
});
