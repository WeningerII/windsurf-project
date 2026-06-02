import { describe, it, expect } from 'vitest';

import {
  executeTacticalTurn,
  makeEffectId,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * The auto-round won't waste a turn firing at a foe it can't see: a target in
 * total cover is skipped in favor of one with a line of sight, even if the
 * covered foe scores higher (e.g. is more wounded).
 */

function atk(bonus: number): EffectInstance {
  return {
    id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack',
  };
}

describe('executeTacticalTurn — line of sight', () => {
  // A ranged attacker (no reach limit) can reach both foes; only line of sight
  // differs. A wall at (2,0) totally covers the foe at (4,0).
  const archer: TacticalActor = {
    tokenId: 'archer',
    faction: 'party',
    position: { x: 0, y: 0 },
    attackEffects: [atk(8)],
    damageEffects: [],
  };
  const covered: TacticalTarget = {
    tokenId: 'covered',
    faction: 'monsters',
    position: { x: 4, y: 0 },
    armorClass: 12,
    hp: { current: 1, max: 10 }, // wounded → scores higher
  };
  const visible: TacticalTarget = {
    tokenId: 'visible',
    faction: 'monsters',
    position: { x: 0, y: 4 },
    armorClass: 12,
    hp: { current: 10, max: 10 },
  };

  it('attacks the visible foe even though the covered one scores higher', () => {
    const turn = executeTacticalTurn({
      actor: archer,
      targets: [covered, visible],
      seed: 'los',
      systemId: 'dnd-5e-2014',
      isBlocked: (c) => c.x === 2 && c.y === 0,
    });
    // The covered foe topped the score sheet…
    expect(turn.scored[0].tokenId).toBe('covered');
    // …but the actor chose the foe it can actually hit.
    expect(turn.decision).toBe('attack');
    expect(turn.chosenTargetId).toBe('visible');
  });

  it('with no walls, the higher-scored foe is chosen normally', () => {
    const turn = executeTacticalTurn({
      actor: archer,
      targets: [covered, visible],
      seed: 'los',
      systemId: 'dnd-5e-2014',
    });
    expect(turn.chosenTargetId).toBe('covered');
  });
});
