import { describe, it, expect } from 'vitest';

import { dnd5e2024MonstersById } from '../../data/dnd/5e-2024/monsters';
import {
  executeTacticalTurn,
  monsterSaveActions,
  runCombatRound,
  type RoundCombatant,
  type SceneAreaAction,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * The tactical AI chooses area actions: it unleashes a breath / spell when it
 * catches enough foes (and not too many friends), aims to maximize net enemies,
 * respects line of effect, and otherwise falls back to a single attack.
 */

const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
const breath = monsterSaveActions(dragon).find((s) => /breath/i.test(s.name))!; // 15-ft cone

function actorWith(area: SceneAreaAction[]): TacticalActor {
  return {
    tokenId: 'dragon',
    faction: 'monsters',
    position: { x: 0, y: 0 },
    attackEffects: [],
    damageEffects: [],
    reach: 1,
    areaActions: area,
  };
}

function target(id: string, x: number, y: number, faction = 'party'): TacticalTarget {
  return {
    tokenId: id,
    faction,
    position: { x, y },
    armorClass: 10,
    hp: { current: 20, max: 20 },
    saveBonus: () => -100, // always fails → deterministic full damage
  };
}

describe('executeTacticalTurn — area action selection', () => {
  it('unleashes an AoE when it catches 2+ net enemies', () => {
    const turn = executeTacticalTurn({
      actor: actorWith([breath]),
      targets: [target('a', 1, 0), target('b', 2, 0), target('c', 2, 1)], // all in the cone
      seed: 's',
    });
    expect(turn.decision).toBe('area-effect');
    expect(turn.chosenAreaActionName).toBe(breath.name);
    expect(turn.areaCaughtIds?.sort()).toEqual(['a', 'b', 'c']);
    expect(turn.intent?.type).toBe('apply-damage');
  });

  it('falls back to a single attack against a lone enemy', () => {
    const turn = executeTacticalTurn({
      actor: actorWith([breath]),
      targets: [target('a', 1, 0)], // one foe, adjacent
      seed: 's',
    });
    expect(turn.decision).toBe('attack');
    expect(turn.chosenTargetId).toBe('a');
  });

  it('accepts friendly fire when the net gain clears the bar (3 enemies, 1 ally)', () => {
    const turn = executeTacticalTurn({
      actor: actorWith([breath]),
      targets: [
        target('a', 1, 0),
        target('b', 2, 0),
        target('c', 3, 0),
        target('ally', 2, 1, 'monsters'), // same faction as the dragon, in the blast
      ],
      seed: 's',
    });
    expect(turn.decision).toBe('area-effect'); // net = 3 enemies − 1 ally = 2
    expect(turn.areaCaughtIds).toContain('ally'); // RAW: the blast is indiscriminate
  });

  it('declines the AoE when it cannot beat one ally with two enemies (net 1)', () => {
    const turn = executeTacticalTurn({
      actor: actorWith([breath]),
      targets: [target('a', 1, 0), target('b', 2, 0), target('ally', 2, 1, 'monsters')],
      seed: 's',
    });
    expect(turn.decision).not.toBe('area-effect'); // net = 2 − 1 = 1, below the bar
  });

  it('respects line of effect: a wall between two foes can defeat the AoE', () => {
    // Two foes 4 cells apart; only an aim that catches BOTH clears the net bar.
    const sphere: SceneAreaAction = { ...breath, area: { type: 'sphere', radius: 30 } };
    const targets = [target('a', 5, 0), target('b', 9, 0)];

    const clear = executeTacticalTurn({ actor: actorWith([sphere]), targets, seed: 's' });
    expect(clear.decision).toBe('area-effect'); // one blast catches both → net 2
    expect(clear.areaCaughtIds?.sort()).toEqual(['a', 'b']);

    // A wall between them severs line of effect for any aim that would catch both.
    const walled = executeTacticalTurn({
      actor: actorWith([sphere]),
      targets,
      seed: 's',
      isBlocked: (c) => c.x === 7 && c.y === 0,
    });
    expect(walled.decision).not.toBe('area-effect'); // no aim nets 2 → falls back
  });
});

describe('runCombatRound — the auto-round uses AoE', () => {
  function combatant(
    tokenId: string,
    x: number,
    y: number,
    faction: string,
    areaActions?: SceneAreaAction[]
  ): RoundCombatant {
    return {
      tokenId,
      faction,
      position: { x, y },
      armorClass: 10,
      hp: { current: 25, max: 25 },
      attackEffects: [],
      damageEffects: [],
      reach: 1,
      areaActions,
      saveBonus: () => -100,
    };
  }

  it('a breathing dragon AoEs the clustered party on its turn', () => {
    const result = runCombatRound({
      order: [
        combatant('dragon', 0, 0, 'monsters', [breath]),
        combatant('p1', 1, 0, 'party'),
        combatant('p2', 2, 0, 'party'),
        combatant('p3', 2, 1, 'party'),
      ],
      seed: 'round',
      round: 1,
    });
    const dragonTurn = result.turns.find((t) => t.tokenId === 'dragon')!;
    expect(dragonTurn.turn.decision).toBe('area-effect');
    expect(dragonTurn.turn.areaCaughtIds?.length).toBe(3);
    // The shared blast damaged multiple party members in one intent.
    const dmg =
      dragonTurn.intent && 'damages' in dragonTurn.intent ? dragonTurn.intent.damages : [];
    expect(dmg.length).toBe(3);
  });
});
