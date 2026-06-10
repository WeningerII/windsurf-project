import { describe, it, expect } from 'vitest';

import {
  isRoundConclusive,
  makeEffectId,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';

/**
 * The N-participant loop, end to end: walk initiative, and on each turn the
 * acting combatant considers every OTHER living combatant before acting. A downed
 * foe changes the set the next combatant sees. Deterministic and replayable.
 */

const SID = 'dnd-5e-2014' as const;

const atk = (bonus: number): EffectInstance => ({
  id: makeEffectId(SID, 'attack', bonus),
  systemId: SID,
  target: 'attack',
  operation: 'add',
  value: bonus,
  stackPolicy: 'sum',
  source: { kind: 'system', label: 'atk' },
  label: 'atk',
});

const dmg = (sides: number, flat: number): EffectInstance[] => [
  {
    id: 'die',
    systemId: SID,
    target: 'damage',
    operation: 'add-die',
    value: sides,
    stackPolicy: 'sum',
    source: { kind: 'item', label: 'w' },
    label: 'die',
  },
  {
    id: 'flat',
    systemId: SID,
    target: 'damage',
    operation: 'add',
    value: flat,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'str' },
    label: 'flat',
  },
];

function combatant(
  over: Partial<RoundCombatant> & Pick<RoundCombatant, 'tokenId' | 'faction'>
): RoundCombatant {
  return {
    position: { x: 0, y: 0 },
    armorClass: 10,
    hp: { current: 20, max: 20 },
    attackEffects: [atk(8)],
    damageEffects: dmg(8, 3),
    reach: 10, // generous reach so everyone is engageable in these unit tests
    ...over,
  };
}

describe('runCombatRound — the N-participant loop', () => {
  it('every non-downed combatant takes a turn, in initiative order', () => {
    const result = runCombatRound({
      seed: 's',
      round: 1,
      order: [
        combatant({ tokenId: 'a', faction: 'party' }),
        combatant({ tokenId: 'b', faction: 'monsters' }),
        combatant({ tokenId: 'c', faction: 'monsters' }),
      ],
    });
    expect(result.turns.map((t) => t.tokenId)).toEqual(['a', 'b', 'c']);
  });

  it('each actor considers every OTHER living combatant as a candidate', () => {
    const result = runCombatRound({
      seed: 's',
      round: 1,
      order: [
        combatant({ tokenId: 'hero', faction: 'party' }),
        combatant({ tokenId: 'orc1', faction: 'monsters' }),
        combatant({ tokenId: 'orc2', faction: 'monsters' }),
      ],
    });
    // The hero's turn scored BOTH orcs (N participants, not just one).
    const heroTurn = result.turns[0].turn;
    expect(new Set(heroTurn.scored.map((s) => s.tokenId))).toEqual(new Set(['orc1', 'orc2']));
  });

  it('does not target allies — only hostile factions are scored', () => {
    const result = runCombatRound({
      seed: 's',
      round: 1,
      order: [
        combatant({ tokenId: 'a', faction: 'party' }),
        combatant({ tokenId: 'b', faction: 'party' }),
        combatant({ tokenId: 'enemy', faction: 'monsters' }),
      ],
    });
    // a and b are allies; each should only ever score 'enemy'.
    expect(result.turns[0].turn.scored.map((s) => s.tokenId)).toEqual(['enemy']);
    expect(result.turns[1].turn.scored.map((s) => s.tokenId)).toEqual(['enemy']);
  });

  it("a downed combatant's turn is skipped, and it stops being a target", () => {
    // Glass cannon vs a fragile foe: big hitter guaranteed to drop the 1-HP target.
    const result = runCombatRound({
      seed: 's',
      round: 1,
      order: [
        combatant({
          tokenId: 'slayer',
          faction: 'party',
          attackEffects: [atk(50)],
          damageEffects: dmg(12, 10),
        }),
        combatant({ tokenId: 'mook', faction: 'monsters', hp: { current: 1, max: 1 } }),
      ],
    });
    // slayer drops mook; mook's later turn is skipped.
    expect(result.finalHp.mook).toBe(0);
    const mookTurn = result.turns.find((t) => t.tokenId === 'mook')!;
    expect(mookTurn.skipped).toBe(true);
  });

  it('damage folds within the round: a later attacker sees the updated HP', () => {
    const result = runCombatRound({
      seed: 'fold',
      round: 1,
      order: [
        combatant({
          tokenId: 'a',
          faction: 'party',
          attackEffects: [atk(50)],
          damageEffects: dmg(6, 4),
        }),
        combatant({
          tokenId: 'b',
          faction: 'party',
          attackEffects: [atk(50)],
          damageEffects: dmg(6, 4),
        }),
        combatant({ tokenId: 'foe', faction: 'monsters', hp: { current: 100, max: 100 } }),
      ],
    });
    // Two allies both hit 'foe'; final HP reflects BOTH hits accumulated.
    const aDmg =
      result.turns[0].intent?.type === 'apply-damage'
        ? result.turns[0].intent.damages[0].amount
        : 0;
    const bDmg =
      result.turns[1].intent?.type === 'apply-damage'
        ? result.turns[1].intent.damages[0].amount
        : 0;
    expect(result.finalHp.foe).toBe(100 - aDmg - bDmg);
  });

  it('is deterministic: same seed + order replays byte-identically', () => {
    const order = [
      combatant({ tokenId: 'a', faction: 'party' }),
      combatant({ tokenId: 'b', faction: 'monsters' }),
    ];
    const a = runCombatRound({ seed: 'x', round: 2, order });
    const b = runCombatRound({ seed: 'x', round: 2, order });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('exposes the ordered damage intents for scene application', () => {
    const result = runCombatRound({
      seed: 's',
      round: 1,
      order: [
        combatant({ tokenId: 'a', faction: 'party', attackEffects: [atk(50)] }),
        combatant({ tokenId: 'foe', faction: 'monsters', hp: { current: 100, max: 100 } }),
      ],
    });
    expect(result.intents.length).toBeGreaterThanOrEqual(1);
    expect(result.intents.every((i) => i.type === 'apply-damage')).toBe(true);
  });
});

describe('isRoundConclusive — combat end detection', () => {
  it('is conclusive when only one faction has living members', () => {
    const order = [
      combatant({ tokenId: 'hero', faction: 'party' }),
      combatant({ tokenId: 'foe', faction: 'monsters' }),
    ];
    expect(isRoundConclusive(order, { hero: 20, foe: 0 })).toBe(true);
    expect(isRoundConclusive(order, { hero: 20, foe: 5 })).toBe(false);
  });

  it('REGRESSION (L-L1): a mutual KO (every faction at 0) is conclusive', () => {
    // Kills the `<= 1` -> `=== 1` mutant: zero living factions still ends
    // combat (e.g. an AoE drops the last member of both sides).
    const order = [
      combatant({ tokenId: 'hero', faction: 'party' }),
      combatant({ tokenId: 'foe', faction: 'monsters' }),
    ];
    expect(isRoundConclusive(order, { hero: 0, foe: 0 })).toBe(true);
  });
});
