import { describe, it, expect } from 'vitest';

import {
  monsterAttacksPerTurn,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';
import { dnd5eMonstersById } from '../../data/dnd/5e-2014/monsters';
import type { Monster } from '../../types/creatures/monsters';

/**
 * Action economy: a creature with a "Multiattack" makes all its swings, not
 * one. The honest baseline reads the swing COUNT from the statblock prose and
 * repeats the primary attack that many times, folding the swings into a single
 * apply-damage so the round driver applies the turn once.
 */

function multiattack(description: string | undefined): Monster {
  return {
    actions: description === undefined ? [] : [{ name: 'Multiattack', description }],
  } as unknown as Monster;
}

describe('monsterAttacksPerTurn — swing count from the statblock', () => {
  it('reads "makes N attacks" prose (words and digits)', () => {
    expect(monsterAttacksPerTurn(multiattack('The ogre makes two melee attacks.'))).toBe(2);
    expect(monsterAttacksPerTurn(multiattack('The knight makes three attacks.'))).toBe(3);
    expect(monsterAttacksPerTurn(multiattack('Makes 4 attacks with its tentacles.'))).toBe(4);
  });

  it('handles the "makes N attacks: one with X and one with Y" form', () => {
    expect(
      monsterAttacksPerTurn(
        multiattack('The owlbear makes two attacks: one with its beak and one with its claws.')
      )
    ).toBe(2);
  });

  it('defaults to 1 with no Multiattack or no parseable count', () => {
    expect(monsterAttacksPerTurn(multiattack(undefined))).toBe(1);
    expect(
      monsterAttacksPerTurn(multiattack('The hydra makes as many bite attacks as it has heads.'))
    ).toBe(1);
  });

  it('clamps an implausible count to a sane ceiling', () => {
    expect(monsterAttacksPerTurn(multiattack('Makes 99 attacks.'))).toBe(8);
  });

  it('reads a real shipped statblock (owlbear → 2)', () => {
    expect(monsterAttacksPerTurn(dnd5eMonstersById.owlbear)).toBe(2);
  });
});

describe('the auto-round makes every swing of a Multiattack', () => {
  const atk = (value: number): EffectInstance => ({
    id: `atk-${value}`,
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'atk',
    category: 'other',
  });
  const dmg: EffectInstance[] = [
    {
      id: 'd-die',
      systemId: 'dnd-5e-2014',
      target: 'damage',
      operation: 'add-die',
      value: 6,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: 'x', label: 'x' },
      label: 'd6',
      category: 'other',
    },
    {
      id: 'd-flat',
      systemId: 'dnd-5e-2014',
      target: 'damage',
      operation: 'add',
      value: 4,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: 'x', label: 'x' },
      label: '+4',
      category: 'other',
    },
  ];

  function combatant(attacksPerTurn: number): RoundCombatant[] {
    return [
      {
        tokenId: 'hero',
        faction: 'party',
        position: { x: 0, y: 0 },
        armorClass: 10,
        hp: { current: 30, max: 30 },
        attackEffects: [atk(20)], // high bonus → both swings hit AC 1
        damageEffects: dmg,
        reach: 1,
        attacksPerTurn,
      },
      {
        tokenId: 'foe',
        faction: 'monsters',
        position: { x: 1, y: 0 },
        armorClass: 1,
        hp: { current: 100, max: 100 }, // survives a full multiattack so it isn't skipped
        attackEffects: [atk(0)],
        damageEffects: dmg,
        reach: 1,
      },
    ];
  }

  it('a 2-attack creature swings twice, folding damage into one intent', () => {
    const result = runCombatRound({
      order: combatant(2),
      seed: 'multi',
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    const hero = result.turns.find((t) => t.tokenId === 'hero')!;
    expect(hero.turn.attacks).toBe(2);
    expect(hero.turn.hits).toBe(2);
    const damages = hero.intent && hero.intent.type === 'apply-damage' ? hero.intent.damages : [];
    expect(damages).toHaveLength(1); // one folded intent for the target
    const total = damages[0].amount;

    // The single-attack version shares the first swing's seed, so the second
    // swing is pure additional damage: multi > single by one positive swing.
    const single = runCombatRound({
      order: combatant(1),
      seed: 'multi',
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    const singleHero = single.turns.find((t) => t.tokenId === 'hero')!;
    const singleDamage =
      singleHero.intent && singleHero.intent.type === 'apply-damage'
        ? singleHero.intent.damages[0].amount
        : 0;
    expect(singleHero.turn.attacks ?? 1).toBe(1);
    expect(total).toBeGreaterThan(singleDamage);
    expect(total - singleDamage).toBeGreaterThanOrEqual(5); // a 1d6+4 second swing ≥ 5
  });
});
