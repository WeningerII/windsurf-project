import { describe, it, expect } from 'vitest';

import {
  executeTacticalTurn,
  markerMoveCostMultiplier,
  moveToward,
  sceneMoveCost,
  makeEffectId,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';
import type { SceneMarker, SceneState } from '../../types/core/scene';

/**
 * Difficult terrain costs double to cross (5e: each cell of mud/rubble/under-
 * growth costs 2). It feeds the auto-round's movement, so a combatant slogging
 * through it closes less distance.
 */

function dtMarker(value: number | null): SceneMarker {
  return {
    id: 'mud',
    kind: 'terrain',
    label: 'Mud',
    position: { x: 1, y: 0 },
    width: 4,
    height: 4,
    effects: [{ target: 'difficult-terrain', operation: 'set', value, label: 'Mud' }],
  };
}

describe('markerMoveCostMultiplier', () => {
  it('defaults a difficult-terrain flag to ×2 and honors an explicit multiplier', () => {
    expect(markerMoveCostMultiplier(dtMarker(null))).toBe(2);
    expect(markerMoveCostMultiplier(dtMarker(3))).toBe(3);
  });

  it('is 1 for a marker with no movement effect', () => {
    const wall: SceneMarker = {
      id: 'w',
      kind: 'terrain',
      label: 'Wall',
      position: { x: 0, y: 0 },
      width: 1,
      height: 1,
      effects: [{ target: 'cover', operation: 'set', value: 'total', label: 'Wall' }],
    };
    expect(markerMoveCostMultiplier(wall)).toBe(1);
  });
});

describe('sceneMoveCost', () => {
  it('returns the multiplier inside the marker and 1 outside', () => {
    const state = {
      sceneId: 's',
      name: 'S',
      systemId: 'dnd-5e-2014',
      grid: { width: 10, height: 10, cellSize: 5 },
      tokens: {},
      markers: { mud: dtMarker(2) },
      initiative: [],
      round: 1,
      seed: 's',
    } as unknown as SceneState;
    const cost = sceneMoveCost(state);
    expect(cost({ x: 2, y: 1 })).toBe(2); // inside the mud (x 1-4, y 0-3)
    expect(cost({ x: 6, y: 6 })).toBe(1); // open ground
  });
});

describe('moveToward — difficult terrain', () => {
  // A full-height band of difficult terrain in columns 1–4 (no way around).
  const enterCost = (c: { x: number }) => (c.x >= 1 && c.x <= 4 ? 2 : 1);

  it('halves the distance closed for a given budget', () => {
    const open = moveToward({ from: { x: 0, y: 0 }, target: { x: 5, y: 0 }, speed: 4, reach: 1 });
    expect(open.destination.x).toBe(4); // 4 cells of open ground

    const slog = moveToward({
      from: { x: 0, y: 0 },
      target: { x: 5, y: 0 },
      speed: 4,
      reach: 1,
      enterCost,
    });
    expect(slog.destination.x).toBe(2); // each entered cell costs 2 → only 2 cells
  });
});

describe('the auto-round spends extra movement in difficult terrain', () => {
  const atk = (bonus: number): EffectInstance => ({
    id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack',
  });
  const actor: TacticalActor = {
    tokenId: 'A',
    faction: 'party',
    position: { x: 0, y: 0 },
    attackEffects: [atk(5)],
    damageEffects: [],
    reach: 1,
    speed: 4,
  };
  const farFoe: TacticalTarget = {
    tokenId: 'T',
    faction: 'monsters',
    position: { x: 8, y: 0 },
    armorClass: 12,
    hp: { current: 10, max: 10 },
  };

  it('closes fewer cells through the mud', () => {
    const open = executeTacticalTurn({
      actor,
      targets: [farFoe],
      seed: 'm',
      systemId: 'dnd-5e-2014',
    });
    const mud = executeTacticalTurn({
      actor,
      targets: [farFoe],
      seed: 'm',
      systemId: 'dnd-5e-2014',
      enterCost: (c) => (c.x >= 1 && c.x <= 7 ? 2 : 1),
    });
    expect(open.decision).toBe('move-to-engage');
    expect(mud.decision).toBe('move-to-engage');
    expect(mud.moveTo!.x).toBeLessThan(open.moveTo!.x); // the mud slowed the advance
  });
});
