import { describe, it, expect } from 'vitest';

import { createSceneDocument, foldSceneEvents } from '../../scene/runtime';
import {
  collectTerrainEffectsAt,
  markerCoversCell,
  markerToEffects,
  resolveEffects,
} from '../../rules';
import type { SceneMarker, SceneState } from '../../types/core/scene';

/**
 * PHASE 4 (RFC 003): functional terrain. Scene markers carry IR effects; a cell
 * covered by a marker contributes those effects to resolution. "The map and the
 * rules are the same object."
 */

function deepWater(): SceneMarker {
  return {
    id: 'water-1',
    kind: 'terrain',
    label: 'Deep Water',
    position: { x: 2, y: 2 },
    width: 3,
    height: 3,
    effects: [
      {
        target: 'damage.fire',
        operation: 'multiply',
        value: 0.5,
        label: 'Deep water halves fire damage',
      },
      {
        target: 'movement-cost',
        operation: 'add',
        value: 1,
        label: 'Deep water costs extra movement',
      },
    ],
  };
}

function plainMarker(): SceneMarker {
  return {
    id: 'rock-1',
    kind: 'terrain',
    label: 'Boulder',
    position: { x: 0, y: 0 },
    width: 1,
    height: 1,
  };
}

function stateWithMarkers(...markers: SceneMarker[]): SceneState {
  const scene = createSceneDocument({ id: 'scene-1', name: 'Test', systemId: 'dnd-5e-2014' });
  const state = foldSceneEvents(scene).state;
  for (const marker of markers) {
    state.markers[marker.id] = marker;
  }
  return state;
}

describe('markerCoversCell — geometry', () => {
  it('covers cells within the rectangular footprint', () => {
    const marker = deepWater();
    expect(markerCoversCell(marker, { x: 2, y: 2 })).toBe(true);
    expect(markerCoversCell(marker, { x: 4, y: 4 })).toBe(true);
    expect(markerCoversCell(marker, { x: 5, y: 4 })).toBe(false); // x past width
    expect(markerCoversCell(marker, { x: 1, y: 2 })).toBe(false); // x before origin
  });
});

describe('markerToEffects — mapping stored terrain to IR', () => {
  it('maps each effect, tagging the source as terrain', () => {
    const effects = markerToEffects(deepWater(), 'dnd-5e-2014');
    expect(effects).toHaveLength(2);
    expect(effects[0].source.kind).toBe('terrain');
    expect(effects[0].source.id).toBe('water-1');
    expect(effects[0].target).toBe('damage.fire');
    expect(effects[0].operation).toBe('multiply');
  });

  it('a marker without effects yields nothing (additive: existing markers unaffected)', () => {
    expect(markerToEffects(plainMarker(), 'dnd-5e-2014')).toHaveLength(0);
  });

  it('skips unknown operations rather than fabricating behavior', () => {
    const marker: SceneMarker = {
      ...plainMarker(),
      effects: [{ target: 'x', operation: 'teleport', value: 1, label: 'bogus' }],
    };
    expect(markerToEffects(marker, 'dnd-5e-2014')).toHaveLength(0);
  });
});

describe('collectTerrainEffectsAt — cell resolution', () => {
  it('collects effects from markers covering the cell', () => {
    const state = stateWithMarkers(deepWater());
    const effects = collectTerrainEffectsAt(state, { x: 3, y: 3 });
    expect(effects).toHaveLength(2);
  });

  it('returns nothing for a cell with no functional terrain', () => {
    const state = stateWithMarkers(deepWater());
    expect(collectTerrainEffectsAt(state, { x: 10, y: 10 })).toHaveLength(0);
  });

  it('deep water halves fire damage when resolved at that cell', () => {
    const state = stateWithMarkers(deepWater());
    const terrain = collectTerrainEffectsAt(state, { x: 3, y: 3 });
    const fireDamage = [
      {
        id: 'fb',
        systemId: 'dnd-5e-2014' as const,
        target: 'damage.fire',
        operation: 'set' as const,
        value: 24,
        stackPolicy: 'sum' as const,
        source: { kind: 'spell' as const, label: 'Fireball' },
        label: 'Fireball',
      },
      ...terrain,
    ];
    const result = resolveEffects(fireDamage);
    // 24 fire damage halved by deep water = 12.
    expect(result.byTarget['damage.fire'].total).toBe(12);
  });

  it('stacks effects from overlapping markers deterministically', () => {
    const a = deepWater();
    const b: SceneMarker = {
      id: 'fog-1',
      kind: 'hazard',
      label: 'Choking Fog',
      position: { x: 3, y: 3 },
      width: 2,
      height: 2,
      effects: [
        { target: 'movement-cost', operation: 'add', value: 1, label: 'Fog slows movement' },
      ],
    };
    const state = stateWithMarkers(a, b);
    // Cell (3,3) is covered by both: water movement +1 and fog movement +1.
    const result = resolveEffects(collectTerrainEffectsAt(state, { x: 3, y: 3 }));
    expect(result.byTarget['movement-cost'].total).toBe(2);
  });
});
