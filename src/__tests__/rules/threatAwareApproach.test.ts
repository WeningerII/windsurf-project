import { describe, it, expect } from 'vitest';

import {
  buildThreatMap,
  influenceAt,
  gridDistance,
  moveToward,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';
import type { SceneCoordinate } from '../../types/core/scene';

/**
 * Threat-aware approach: movement still closes on a target (you must engage), but
 * among equally-close cells it ends on the least-exposed one — driven by the
 * threat field built from the actor's living melee enemies.
 */

const at = (x: number, y: number, z?: number): SceneCoordinate => ({ x, y, z });

describe('moveToward — tactical penalty', () => {
  it('breaks ties toward the safest of equally-close cells', () => {
    const dangerNorth = (c: SceneCoordinate) => (c.y >= 0 ? 100 : 0);
    const north = moveToward({
      from: at(0, 0),
      target: at(4, 0),
      speed: 6,
      reach: 1,
      cellPenalty: dangerNorth,
    });
    expect(north.inReach).toBe(true);
    expect(dangerNorth(north.destination)).toBe(0); // ended on a safe cell
    expect(north.destination.y).toBeLessThan(0);

    // Flip which side is dangerous → it ends on the other side.
    const dangerSouth = (c: SceneCoordinate) => (c.y <= 0 ? 100 : 0);
    const south = moveToward({
      from: at(0, 0),
      target: at(4, 0),
      speed: 6,
      reach: 1,
      cellPenalty: dangerSouth,
    });
    expect(south.destination.y).toBeGreaterThan(0);
  });

  it('never refuses to advance — closing distance still dominates', () => {
    // Everything is dangerous; the mover must still press toward the target.
    const move = moveToward({
      from: at(0, 0),
      target: at(8, 0),
      speed: 4,
      reach: 1,
      cellPenalty: () => 50,
    });
    expect(move.cost).toBeGreaterThan(0);
    expect(gridDistance(move.destination, at(8, 0))).toBeLessThan(8);
  });
});

let seq = 0;
const eff = (
  target: 'attack' | 'damage',
  op: 'add' | 'add-die',
  value: number
): EffectInstance => ({
  id: `${target}-${op}-${value}-${seq++}`,
  systemId: 'dnd-5e-2014',
  target,
  operation: op,
  value,
  stackPolicy: 'sum',
  source: { kind: 'custom', id: 'x', label: 'x' },
  label: target,
  category: 'other',
});

describe('threat-aware approach in the auto-round', () => {
  it('engages the target from a cell a nearby brute does not threaten', () => {
    const hero: RoundCombatant = {
      tokenId: 'hero',
      faction: 'party',
      position: { x: 0, y: 5 },
      armorClass: 16,
      hp: { current: 30, max: 30 },
      attackEffects: [eff('attack', 'add', 20)],
      damageEffects: [eff('damage', 'add', 8)],
      reach: 1,
      speed: 6,
    };
    // The wounded target scores highest, so the hero closes on it.
    const target: RoundCombatant = {
      tokenId: 'target',
      faction: 'monsters',
      position: { x: 5, y: 5 },
      armorClass: 5,
      hp: { current: 1, max: 30 },
      attackEffects: [eff('attack', 'add', 0)],
      damageEffects: [eff('damage', 'add-die', 4)],
      reach: 1,
      speed: 0,
    };
    // A slow brute just north of the target threatens the target's north-side
    // approach cells (envelope = speed 1 + reach 1 = 2), but not the south.
    const brute: RoundCombatant = {
      tokenId: 'brute',
      faction: 'monsters',
      position: { x: 5, y: 3 },
      armorClass: 16,
      hp: { current: 40, max: 40 },
      attackEffects: [eff('attack', 'add', 0)],
      damageEffects: [eff('damage', 'add', 20)], // a big hitter → high threat
      reach: 1,
      speed: 1,
    };
    const result = runCombatRound({
      order: [hero, target, brute],
      seed: 'approach',
      round: 1,
      systemId: 'dnd-5e-2014',
      gridWidth: 20,
      gridHeight: 20,
    });

    const heroTurn = result.turns.find((t) => t.tokenId === 'hero')!;
    expect(heroTurn.turn.moveTo).toBeDefined(); // it moved to engage
    // It still reached the target (adjacent), but ended where the brute can't hit.
    expect(gridDistance(heroTurn.turn.moveTo!, { x: 5, y: 5 })).toBeLessThanOrEqual(1);
    const bruteThreat = buildThreatMap({
      sources: [{ position: { x: 5, y: 3 }, reach: 1, speed: 1, threat: 20 }],
      width: 20,
      height: 20,
    });
    expect(influenceAt(bruteThreat, heroTurn.turn.moveTo!)).toBe(0);
  });
});
