import { describe, it, expect } from 'vitest';

import { isRoundConclusive, runCombatRound, type RoundCombatant } from '../../rules';
import type { EffectInstance } from '../../rules';

/**
 * Capstone: a full auto-combat encounter runs round after round to a decisive
 * end — the N-participant loop re-deriving the living set each round, folding
 * damage into working HP, skipping the downed, and terminating when one faction
 * remains. Deterministic from the seed.
 */

let effectSeq = 0;
function effect(target: 'attack' | 'damage', op: 'add' | 'add-die', value: number): EffectInstance {
  return {
    id: `${target}-${op}-${value}-${effectSeq++}`,
    systemId: 'dnd-5e-2014',
    target,
    operation: op,
    value,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: `${target}`,
    category: 'other',
  };
}

function combatant(
  id: string,
  faction: string,
  x: number,
  y: number,
  opts: { ac: number; hp: number; attack: number; dmgDie: number; dmgFlat: number }
): RoundCombatant {
  return {
    tokenId: id,
    faction,
    position: { x, y },
    armorClass: opts.ac,
    hp: { current: opts.hp, max: opts.hp },
    attackEffects: [effect('attack', 'add', opts.attack)],
    damageEffects: [
      effect('damage', 'add-die', opts.dmgDie),
      effect('damage', 'add', opts.dmgFlat),
    ],
    reach: 1,
  };
}

describe('a full auto-combat encounter resolves to one faction', () => {
  it('the stronger party wins, downed foes are skipped, and the loop terminates', () => {
    // Two seasoned fighters vs two goblins, toe to toe.
    const initial: RoundCombatant[] = [
      combatant('fighter-1', 'party', 0, 0, { ac: 16, hp: 30, attack: 8, dmgDie: 8, dmgFlat: 4 }),
      combatant('goblin-1', 'monsters', 1, 0, { ac: 13, hp: 7, attack: 4, dmgDie: 6, dmgFlat: 2 }),
      combatant('fighter-2', 'party', 0, 1, { ac: 16, hp: 30, attack: 8, dmgDie: 8, dmgFlat: 4 }),
      combatant('goblin-2', 'monsters', 1, 1, { ac: 13, hp: 7, attack: 4, dmgDie: 6, dmgFlat: 2 }),
    ];

    // Working HP carried across rounds; the order/positions stay fixed.
    const hp: Record<string, number> = Object.fromEntries(
      initial.map((c) => [c.tokenId, c.hp.current])
    );
    let sawSkippedDown = false;
    let concluded = false;
    let round = 1;

    for (; round <= 30; round += 1) {
      const order = initial.map((c) => ({ ...c, hp: { current: hp[c.tokenId], max: c.hp.max } }));
      if (isRoundConclusive(order, hp)) {
        concluded = true;
        break;
      }
      const result = runCombatRound({ order, seed: 'encounter', round, systemId: 'dnd-5e-2014' });
      for (const [id, value] of Object.entries(result.finalHp)) hp[id] = value;
      // Once a combatant is at 0, a later turn that round (or the next) skips it.
      if (result.turns.some((t) => t.skipped)) sawSkippedDown = true;
    }

    expect(concluded).toBe(true);
    // The party (far stronger) is the faction left standing.
    const livingFactions = new Set(initial.filter((c) => hp[c.tokenId] > 0).map((c) => c.faction));
    expect(livingFactions).toEqual(new Set(['party']));
    // Both goblins fell.
    expect(hp['goblin-1']).toBe(0);
    expect(hp['goblin-2']).toBe(0);
    // The loop genuinely re-derived the participant set (a downed combatant was skipped).
    expect(sawSkippedDown).toBe(true);
  });
});
