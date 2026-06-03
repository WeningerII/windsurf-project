import { describe, it, expect } from 'vitest';

import {
  diagonalRuleForSystem,
  isFlanking,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';

/**
 * Move to flank: in systems with flanking (3.5e / PF1e / PF2e), a melee attacker
 * closing on a target prefers the cell that puts an ally on the target's far
 * side, so the resolver grants the flank bonus. 5e has no flanking, so it doesn't
 * chase one.
 */

let seq = 0;
const eff = (
  target: 'attack' | 'damage',
  op: 'add' | 'add-die',
  value: number
): EffectInstance => ({
  id: `${target}-${op}-${value}-${seq++}`,
  systemId: 'pf2e',
  target,
  operation: op,
  value,
  stackPolicy: 'sum',
  source: { kind: 'custom', id: 'x', label: 'x' },
  label: target,
  category: 'other',
});

function setup(systemId: string) {
  const hero: RoundCombatant = {
    tokenId: 'hero',
    faction: 'party',
    position: { x: 0, y: 5 }, // approaches from the west
    armorClass: 16,
    hp: { current: 30, max: 30 },
    attackEffects: [eff('attack', 'add', 10)],
    damageEffects: [eff('damage', 'add', 8)],
    reach: 1,
    speed: 6,
  };
  // An ally already pinning the target from the north → the flank cell is south.
  const ally: RoundCombatant = {
    tokenId: 'ally',
    faction: 'party',
    position: { x: 5, y: 4 },
    armorClass: 16,
    hp: { current: 30, max: 30 },
    attackEffects: [eff('attack', 'add', 10)],
    damageEffects: [eff('damage', 'add', 8)],
    reach: 1,
    speed: 6,
  };
  const target: RoundCombatant = {
    tokenId: 'target',
    faction: 'monsters',
    position: { x: 5, y: 5 },
    armorClass: 14,
    hp: { current: 40, max: 40 },
    attackEffects: [eff('attack', 'add', 0)],
    damageEffects: [eff('damage', 'add-die', 6)],
    reach: 1,
    speed: 0,
  };
  return runCombatRound({
    order: [hero, ally, target],
    seed: 'flank',
    round: 1,
    systemId,
    gridWidth: 20,
    gridHeight: 20,
  });
}

describe('move to flank', () => {
  it('PF2e: the attacker closes onto the cell that flanks the target', () => {
    const result = setup('pf2e');
    const heroTurn = result.turns.find((t) => t.tokenId === 'hero')!;
    const dest = heroTurn.turn.moveTo!;
    expect(dest).toBeDefined();
    expect(
      isFlanking({
        attacker: dest,
        target: { x: 5, y: 5 },
        reach: 1,
        allies: [{ x: 5, y: 4 }],
        rule: diagonalRuleForSystem('pf2e'),
      })
    ).toBe(true);
  });

  it('5e: with no flanking rule, the attacker does not detour to flank', () => {
    const result = setup('dnd-5e-2014');
    const heroTurn = result.turns.find((t) => t.tokenId === 'hero')!;
    const dest = heroTurn.turn.moveTo!;
    // It still engages (adjacent), but takes the straight cheap approach, not the
    // far-side flank cell.
    expect(dest).toBeDefined();
    expect(
      isFlanking({
        attacker: dest,
        target: { x: 5, y: 5 },
        reach: 1,
        allies: [{ x: 5, y: 4 }],
        rule: diagonalRuleForSystem('dnd-5e-2014'),
      })
    ).toBe(false);
  });
});
