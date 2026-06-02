import { describe, it, expect } from 'vitest';

import {
  executeTacticalTurn,
  runCombatRound,
  type RoundCombatant,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * Movement: `move-to-engage` is no longer a stub — a combatant out of reach
 * actually closes distance (around walls), and reaches into melee to strike when
 * its speed allows.
 */

function actor(x: number, y: number, speed: number, reach = 1): TacticalActor {
  return {
    tokenId: 'goblin',
    faction: 'monsters',
    position: { x, y },
    attackEffects: [],
    damageEffects: [],
    reach,
    speed,
  };
}

function foe(id: string, x: number, y: number): TacticalTarget {
  return {
    tokenId: id,
    faction: 'party',
    position: { x, y },
    armorClass: 10,
    hp: { current: 20, max: 20 },
  };
}

describe('executeTacticalTurn — movement', () => {
  it('moves in and strikes when speed closes the gap', () => {
    const turn = executeTacticalTurn({
      actor: actor(0, 0, 6),
      targets: [foe('hero', 4, 0)], // 4 away, speed 6, reach 1
      seed: 's',
    });
    expect(turn.decision).toBe('attack');
    expect(turn.moveTo).toBeDefined();
    // Ended adjacent to the foe, not on it.
    expect(turn.moveTo).not.toEqual({ x: 4, y: 0 });
    expect(Math.max(Math.abs(turn.moveTo!.x - 4), Math.abs(turn.moveTo!.y))).toBeLessThanOrEqual(1);
  });

  it('moves partway and stays out of reach when speed is short', () => {
    const turn = executeTacticalTurn({
      actor: actor(0, 0, 3),
      targets: [foe('hero', 10, 0)], // 10 away, only 3 speed
      seed: 's',
    });
    expect(turn.decision).toBe('move-to-engage');
    expect(turn.moveTo).toBeDefined();
    expect(turn.moveTo!.x).toBeGreaterThan(0); // it actually advanced
    expect(turn.moveTo!.x).toBeLessThanOrEqual(3);
  });

  it('attacks from where it stands when already in reach (no move)', () => {
    const turn = executeTacticalTurn({
      actor: actor(0, 0, 6),
      targets: [foe('hero', 1, 0)],
      seed: 's',
    });
    expect(turn.decision).toBe('attack');
    expect(turn.moveTo).toBeUndefined();
  });

  it('routes around a wall to reach the foe', () => {
    const wall = (c: { x: number; y: number }): boolean => c.x === 2 && c.y >= -2 && c.y <= 2;
    const turn = executeTacticalTurn({
      actor: actor(0, 0, 20),
      targets: [foe('hero', 5, 0)],
      seed: 's',
      isBlocked: wall,
    });
    expect(turn.decision).toBe('attack');
    expect(turn.moveTo).toBeDefined();
    expect(wall(turn.moveTo!)).toBe(false); // never ends in the wall
  });
});

describe('runCombatRound — movement is applied', () => {
  function combatant(id: string, x: number, faction: string, speed: number): RoundCombatant {
    return {
      tokenId: id,
      faction,
      position: { x, y: 0 },
      armorClass: 10,
      hp: { current: 20, max: 20 },
      attackEffects: [],
      damageEffects: [],
      reach: 1,
      speed,
    };
  }

  it('an out-of-reach combatant closes and the round emits its move', () => {
    const result = runCombatRound({
      order: [combatant('goblin', 0, 'monsters', 6), combatant('hero', 4, 'party', 6)],
      seed: 'round',
      round: 1,
    });
    const goblinTurn = result.turns.find((t) => t.tokenId === 'goblin')!;
    expect(goblinTurn.turn.moveTo).toBeDefined();
    // The round's intents include the goblin's movement.
    const moves = result.intents.filter((i) => i.type === 'move-token');
    expect(moves.some((m) => 'tokenId' in m && m.tokenId === 'goblin')).toBe(true);
  });
});
