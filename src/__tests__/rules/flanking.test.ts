import { describe, it, expect } from 'vitest';

import {
  executeTacticalTurn,
  flankToHitBonus,
  isFlanking,
  makeEffectId,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * Flanking: an attacker with an ally on the opposite side of a foe is rewarded
 * in 3.5e/PF1e (+2 to hit) and PF2e (off-guard, −2 AC) — modeled as a −2 to the
 * target's effective defense. 5e has no core flanking.
 */

describe('flankToHitBonus', () => {
  it('is +2 for the d20-legacy systems and Pathfinder, 0 for 5e', () => {
    expect(flankToHitBonus('dnd-3.5e')).toBe(2);
    expect(flankToHitBonus('pf1e')).toBe(2);
    expect(flankToHitBonus('pf2e')).toBe(2);
    expect(flankToHitBonus('dnd-5e-2014')).toBe(0);
    expect(flankToHitBonus('dnd-5e-2024')).toBe(0);
    expect(flankToHitBonus('daggerheart')).toBe(0);
    expect(flankToHitBonus(undefined)).toBe(0);
  });
});

describe('isFlanking', () => {
  const base = { reach: 1 };

  it('true when an ally holds the cell directly opposite (orthogonal)', () => {
    expect(
      isFlanking({
        ...base,
        attacker: { x: 0, y: 1 },
        target: { x: 1, y: 1 },
        allies: [{ x: 2, y: 1 }],
      })
    ).toBe(true);
  });

  it('true on the diagonal opposite', () => {
    expect(
      isFlanking({
        ...base,
        attacker: { x: 0, y: 0 },
        target: { x: 1, y: 1 },
        allies: [{ x: 2, y: 2 }],
      })
    ).toBe(true);
  });

  it('false when the ally is adjacent but not opposite', () => {
    expect(
      isFlanking({
        ...base,
        attacker: { x: 0, y: 1 },
        target: { x: 1, y: 1 },
        allies: [{ x: 1, y: 2 }],
      })
    ).toBe(false);
  });

  it('false when the attacker is out of melee reach', () => {
    expect(
      isFlanking({
        ...base,
        attacker: { x: 0, y: 1 },
        target: { x: 3, y: 1 },
        allies: [{ x: 6, y: 1 }],
      })
    ).toBe(false);
  });

  it('false with no allies', () => {
    expect(
      isFlanking({ ...base, attacker: { x: 0, y: 1 }, target: { x: 1, y: 1 }, allies: [] })
    ).toBe(false);
  });
});

describe('the executor applies flanking to the effective defense', () => {
  const atk = (bonus: number): EffectInstance => ({
    id: makeEffectId('dnd-3.5e', 'attack', 'base', bonus),
    systemId: 'dnd-3.5e',
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
    position: { x: 0, y: 1 },
    attackEffects: [atk(5)],
    damageEffects: [],
    reach: 1,
  };
  // Foe at (1,1); ally at (2,1) is directly opposite A → flanking.
  const foe: TacticalTarget = {
    tokenId: 'T',
    faction: 'monsters',
    position: { x: 1, y: 1 },
    armorClass: 15,
  };
  const ally: TacticalTarget = {
    tokenId: 'B',
    faction: 'party',
    position: { x: 2, y: 1 },
    armorClass: 12,
  };

  it('3.5e: a flanked foe defends at AC − 2', () => {
    const turn = executeTacticalTurn({
      actor,
      targets: [foe, ally],
      seed: 'flank',
      systemId: 'dnd-3.5e',
    });
    expect(turn.chosenTargetId).toBe('T');
    expect(turn.resolution?.targetValue).toBe(13); // 15 − 2 flanking
  });

  it('5e: no flanking, the foe defends at full AC', () => {
    const turn = executeTacticalTurn({
      actor,
      targets: [foe, ally],
      seed: 'flank',
      systemId: 'dnd-5e-2014',
    });
    expect(turn.resolution?.targetValue).toBe(15);
  });

  it('3.5e: no ally opposite means no flanking', () => {
    const loneAlly: TacticalTarget = { ...ally, position: { x: 0, y: 2 } }; // not opposite
    const turn = executeTacticalTurn({
      actor,
      targets: [foe, loneAlly],
      seed: 'flank',
      systemId: 'dnd-3.5e',
    });
    expect(turn.resolution?.targetValue).toBe(15);
  });
});
