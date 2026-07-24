import { describe, expect, it } from 'vitest';

import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import {
  collectD20LegacyConditionEffects,
  d20LegacyCheckPenalty,
  D20_LEGACY_CONDITION_IDS,
} from '../../rules/conditions/d20LegacyConditions';
import { resolveCharacterEffects } from '../../rules';

/**
 * W5 differential (RFC 003): the 3.5e/PF1e engines route their condition math
 * through `resolveCharacterEffects(...conditions...).bonus('check')` instead of
 * subtracting `d20LegacyCheckPenalty` directly. This pins BYTE-IDENTITY: for
 * EVERY catalog condition (and combination), the modifier applied to a roll is
 * exactly the pre-fold modifier minus the closed-form check penalty. The
 * attack-only riders (dazzled/entangled/prone) contribute 0 to the check
 * penalty and MUST therefore not change any roll — the strongest form of the
 * differential, since a naive `bonus('attack')` read would fail it.
 */

const SYSTEMS = [
  {
    id: 'dnd-3.5e' as const,
    engine: new Dnd35eEngine(),
    makeData: createDefaultDnd35eData,
    checkIds: ['save-fort', 'save-ref', 'save-will', 'attack', 'grapple', 'str', 'climb'],
  },
  {
    id: 'pf1e' as const,
    engine: new Pf1eEngine(),
    makeData: createDefaultPf1eData,
    checkIds: ['save-fort', 'save-ref', 'save-will', 'attack', 'cmb', 'dex', 'acrobatics'],
  },
];

// Every single catalog condition plus the combinations that exercise fear-track
// dedup and fear+sickened stacking.
const CONDITION_SETS: string[][] = [
  ...D20_LEGACY_CONDITION_IDS.map((id) => [id]),
  ['shaken', 'sickened'],
  ['frightened', 'shaken'],
  ['panicked', 'frightened', 'shaken'],
  ['dazzled', 'shaken', 'sickened'],
  ['prone', 'entangled', 'blinded'],
];

const modifierOf = (formula: string): number => Number(/1d20 \+ (-?\d+)/.exec(formula)?.[1]);

function makeDoc(makeData: () => object, systemId: string, conditionIds: string[]) {
  return {
    id: 'diff',
    name: 'Differential',
    systemId,
    system: {
      ...makeData(),
      conditions: conditionIds.map((id) => ({ id, name: id })),
    },
    createdAt: new Date('2026-07-01T00:00:00.000Z'),
    updatedAt: new Date('2026-07-01T00:00:00.000Z'),
  } as unknown as CharacterDocument<never>;
}

describe('d20-legacy condition fold (byte-identical differential)', () => {
  for (const system of SYSTEMS) {
    describe(system.id, () => {
      it("bonus('check') equals the closed-form d20LegacyCheckPenalty for every catalog condition", () => {
        for (const set of CONDITION_SETS) {
          // `+ 0` normalizes the `-0` that negating a zero bonus produces.
          const folded =
            -resolveCharacterEffects(system.id, {
              conditions: collectD20LegacyConditionEffects(system.id, set),
            }).bonus('check') + 0;
          expect(folded, `check penalty for [${set.join(', ')}]`).toBe(d20LegacyCheckPenalty(set));
        }
      });

      it('rollCheck modifier is baseline minus the check penalty for every condition/check', async () => {
        for (const checkId of system.checkIds) {
          const baseline = modifierOf(
            (await system.engine.rollCheck(makeDoc(system.makeData, system.id, []), checkId))
              .formula
          );
          for (const set of CONDITION_SETS) {
            const conditioned = modifierOf(
              (await system.engine.rollCheck(makeDoc(system.makeData, system.id, set), checkId))
                .formula
            );
            expect(conditioned, `${system.id} ${checkId} with [${set.join(', ')}]`).toBe(
              baseline - d20LegacyCheckPenalty(set)
            );
          }
        }
      });

      it('the folded conditions surface in the resolver ledger for provenance', () => {
        const resolved = resolveCharacterEffects(system.id, {
          conditions: collectD20LegacyConditionEffects(system.id, ['shaken', 'sickened']),
        });
        expect(resolved.result.ledger.length).toBeGreaterThan(0);
        expect(resolved.result.ledger.every((e) => e.source.kind === 'condition')).toBe(true);
      });
    });
  }
});
