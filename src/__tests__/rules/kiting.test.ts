import { describe, it, expect } from 'vitest';

import {
  buildThreatMap,
  influenceAt,
  reachableCells,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';

/**
 * Kiting: a ranged attacker standing in a threatened cell repositions to the
 * safest reachable cell that still has a shot, instead of trading blows toe to
 * toe with a melee foe. Built on the reachableCells flood + the threat field.
 */

describe('reachableCells', () => {
  it('floods every cell within the movement budget, with min cost', () => {
    const cells = reachableCells({ from: { x: 5, y: 5 }, speed: 2 });
    expect(cells).toHaveLength(25); // a 5×5 Chebyshev disc
    expect(cells.find((c) => c.cell.x === 5 && c.cell.y === 5)?.cost).toBe(0); // origin
    expect(cells.find((c) => c.cell.x === 7 && c.cell.y === 5)?.cost).toBe(2); // edge
    expect(cells.some((c) => c.cell.x === 8 && c.cell.y === 5)).toBe(false); // out of budget
  });

  it('routes around blocked cells', () => {
    const wall = (c: { x: number; y: number }) => c.x === 6; // a vertical wall east
    const cells = reachableCells({ from: { x: 5, y: 5 }, speed: 2, isBlocked: wall });
    expect(cells.some((c) => c.cell.x === 6)).toBe(false); // never enters the wall
    expect(cells.some((c) => c.cell.x === 7)).toBe(false); // and cannot reach past it
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

describe('kiting in the auto-round', () => {
  it('a threatened ranged attacker steps to safety and still shoots', () => {
    const archer: RoundCombatant = {
      tokenId: 'archer',
      faction: 'party',
      position: { x: 5, y: 5 },
      armorClass: 16,
      hp: { current: 50, max: 50 },
      attackEffects: [eff('attack', 'add', 20)],
      damageEffects: [eff('damage', 'add', 10)],
      // No reach → ranged: it can shoot from anywhere with a line of sight.
      speed: 6,
    };
    // A stationary melee brute right next to the archer (reach 1, can't move) — so
    // a couple of cells of distance escapes its threat entirely.
    const brute: RoundCombatant = {
      tokenId: 'brute',
      faction: 'monsters',
      position: { x: 6, y: 5 },
      armorClass: 12,
      hp: { current: 40, max: 40 },
      attackEffects: [eff('attack', 'add', 20)],
      damageEffects: [eff('damage', 'add', 8)],
      reach: 1,
      speed: 0,
    };
    const result = runCombatRound({
      order: [archer, brute],
      seed: 'kite',
      round: 1,
      systemId: 'dnd-5e-2014',
      gridWidth: 20,
      gridHeight: 20,
    });

    const archerTurn = result.turns.find((t) => t.tokenId === 'archer')!;
    expect(archerTurn.turn.moveTo).toBeDefined(); // it repositioned
    expect(archerTurn.turn.decision).toBe('attack'); // and still attacked
    expect(archerTurn.turn.chosenTargetId).toBe('brute');
    // It ended outside the brute's reach — the threat there is zero.
    const bruteThreat = buildThreatMap({
      sources: [{ position: { x: 6, y: 5 }, reach: 1, speed: 0, threat: 8 }],
      width: 20,
      height: 20,
    });
    expect(influenceAt(bruteThreat, archerTurn.turn.moveTo!)).toBe(0);
  });
});
