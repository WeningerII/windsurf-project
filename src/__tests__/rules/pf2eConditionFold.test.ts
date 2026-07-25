import { describe, expect, it } from 'vitest';

import { Pf2eEngine } from '../../systems/pf2e/engine';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import {
  collectPf2eCheckConditionEffects,
  getPf2eConditionStatusPenalty,
  resolvePf2eCheckPenalty,
  type Pf2eConditionLike,
} from '../../rules/conditions/pf2eConditions';
import { resolveCharacterEffects } from '../../rules';
import type { CharacterDocument } from '../../types/core/document';

/**
 * W5 differential (RFC 003): the PF2e engine routes its condition math through
 * `resolveCharacterEffects(...conditions...).bonus('check')` instead of
 * subtracting `getPf2eConditionStatusPenalty` directly — the same fold the
 * 3.5e/PF1e engines already use (see d20LegacyConditionFold.test.ts), so all
 * seven systems now resolve conditions the same way.
 *
 * This pins BYTE-IDENTITY: for EVERY value-bearing catalog condition, at every
 * magnitude, and for every ability scope, the folded penalty equals the
 * closed-form selector exactly. The "worst wins, never stacks" rule is the
 * strongest part of the differential — a naive fold that split conditions across
 * `check` and `check.<ability>` would SUM them and fail here.
 */

const DATE = new Date('2026-05-01T00:00:00.000Z');
const VALUED = ['frightened', 'sickened', 'clumsy', 'enfeebled', 'drained', 'stupefied'] as const;
const ABILITIES = [undefined, 'str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

function doc(system: unknown): CharacterDocument<never> {
  return {
    id: 'pf2e-fold',
    name: 'PF2e Fold',
    systemId: 'pf2e',
    system,
    createdAt: DATE,
    updatedAt: DATE,
  } as never;
}

/** Every single condition at three magnitudes, plus the stacking combinations. */
const CONDITION_SETS: Pf2eConditionLike[][] = [
  [],
  ...VALUED.flatMap((name) => [1, 2, 4].map((value) => [{ name, value }])),
  ...VALUED.map((name) => [{ name }]), // no explicit value ⇒ magnitude 1
  [
    { name: 'frightened', value: 2 },
    { name: 'clumsy', value: 3 },
  ],
  [
    { name: 'sickened', value: 1 },
    { name: 'stupefied', value: 4 },
    { name: 'enfeebled', value: 2 },
  ],
  [
    { name: 'drained', value: 3 },
    { name: 'clumsy', value: 1 },
    { name: 'frightened', value: 1 },
  ],
  // Duplicates of the same condition: the HIGHEST value wins, not the sum.
  [
    { name: 'frightened', value: 1 },
    { name: 'frightened', value: 3 },
  ],
];

describe('PF2e conditions fold through the shared resolver (RFC 003 W5)', () => {
  it('the folded penalty equals the closed-form selector for every condition and scope', () => {
    for (const conditions of CONDITION_SETS) {
      for (const ability of ABILITIES) {
        expect(resolvePf2eCheckPenalty(conditions, ability)).toBe(
          getPf2eConditionStatusPenalty(conditions, ability)
        );
      }
    }
  });

  it('status penalties never stack: two conditions fold to the WORSE one, not the sum', () => {
    const conditions: Pf2eConditionLike[] = [
      { name: 'frightened', value: 2 },
      { name: 'sickened', value: 3 },
    ];
    const folded = resolvePf2eCheckPenalty(conditions);

    expect(folded).toBe(3);
    expect(folded).not.toBe(5);
  });

  it('every folded effect reaches the ledger as first-class provenance', () => {
    const conditions: Pf2eConditionLike[] = [
      { name: 'frightened', value: 2 },
      { name: 'clumsy', value: 3 },
    ];
    const { ledger } = resolveCharacterEffects('pf2e', {
      conditions: collectPf2eCheckConditionEffects(conditions, 'dex'),
    }).result;

    expect(ledger.length).toBe(2);
    expect(ledger.every((effect) => effect.source.kind === 'condition')).toBe(true);
    expect(ledger.map((effect) => effect.source.id).sort()).toEqual(['clumsy', 'frightened']);
  });

  it('engine rollCheck formulas match the closed-form penalty for every scope', async () => {
    const engine = new Pf2eEngine();
    const checks: Array<[string, string]> = [
      ['perception', 'wis'],
      ['acrobatics', 'dex'],
      ['athletics', 'str'],
      ['arcana', 'int'],
      ['fortitude', 'con'],
      ['will', 'wis'],
    ];

    for (const conditions of CONDITION_SETS) {
      const system = {
        ...createDefaultPf2eData(),
        level: 7,
        conditions: conditions.map((condition) => ({ id: condition.name, ...condition })),
      };
      const prepared = engine.prepareData(doc(system) as never);

      for (const [checkId, ability] of checks) {
        const roll = await engine.rollCheck(prepared as never, checkId);
        const expected = getPf2eConditionStatusPenalty(conditions, ability);
        const shown = /- (\d+)$/.exec(roll.formula);

        expect(Number(shown?.[1] ?? 0)).toBe(expected);
      }
    }
  });

  it('additive principle: no conditions resolves identically to an empty fold', () => {
    const withNone = resolveCharacterEffects('pf2e', {
      conditions: collectPf2eCheckConditionEffects([], 'dex'),
    });
    const withEmpty = resolveCharacterEffects('pf2e', { conditions: [] });

    expect(JSON.stringify(withNone.result)).toBe(JSON.stringify(withEmpty.result));
  });
});
