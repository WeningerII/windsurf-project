import { describe, it, expect } from 'vitest';

import {
  executeTacticalTurn,
  makeEffectId,
  pf2eMapPenalty,
  resolveStrike,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';
import { createSeededRng } from '../../scene/seededRng';

/**
 * PF2e's three-action economy: a creature Strikes twice by default, the second
 * at the multiple attack penalty (−5; −10 on a third). Other systems make one
 * attack unless they carry an explicit count, and take no MAP.
 */

const atk = (bonus: number): EffectInstance => ({
  id: makeEffectId('pf2e', 'attack', 'base', bonus),
  systemId: 'pf2e',
  target: 'attack',
  operation: 'add',
  value: bonus,
  stackPolicy: 'sum',
  source: { kind: 'system', label: 'attack' },
  label: 'attack',
});

const actor = (systemId: string): TacticalActor => ({
  tokenId: 'A',
  faction: 'party',
  position: { x: 0, y: 0 },
  attackEffects: [atk(10)],
  damageEffects: [],
  reach: 1,
});

const foe: TacticalTarget = {
  tokenId: 'T',
  faction: 'monsters',
  position: { x: 1, y: 0 },
  armorClass: 18,
  hp: { current: 20, max: 20 },
};

describe('pf2eMapPenalty', () => {
  it('is 0 / 5 / 10 across the first three attacks', () => {
    expect(pf2eMapPenalty(0)).toBe(0);
    expect(pf2eMapPenalty(1)).toBe(5);
    expect(pf2eMapPenalty(2)).toBe(10);
    expect(pf2eMapPenalty(3)).toBe(10);
  });
});

describe('resolveStrike — to-hit penalty raises the effective defense', () => {
  it('a +5 penalty is folded into the target value (PF2e MAP)', () => {
    const input = { actor: actor('pf2e'), targets: [], seed: 's', systemId: 'pf2e' as const };
    const full = resolveStrike(input, foe, createSeededRng('a'), 0);
    const mapped = resolveStrike(input, foe, createSeededRng('a'), 5);
    expect(full.resolution?.targetValue).toBe(18);
    expect(mapped.resolution?.targetValue).toBe(23); // 18 + 5 MAP
  });
});

describe('the auto-round Strikes twice in PF2e', () => {
  it('a PF2e combatant makes two Strikes by default', () => {
    const turn = executeTacticalTurn({
      actor: actor('pf2e'),
      targets: [foe],
      seed: 'map',
      systemId: 'pf2e',
    });
    expect(turn.decision).toBe('attack');
    expect(turn.attacks).toBe(2);
  });

  it('a 5e combatant still makes a single attack', () => {
    const turn = executeTacticalTurn({
      actor: actor('dnd-5e-2014'),
      targets: [foe],
      seed: 'map',
      systemId: 'dnd-5e-2014',
    });
    expect(turn.attacks ?? 1).toBe(1);
  });
});
