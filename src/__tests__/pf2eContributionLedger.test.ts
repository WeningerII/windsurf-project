import { describe, expect, it } from 'vitest';

import { buildPf2eContributionLedger } from '../systems/pf2e/contributionLedger';
import { Pf2eEngine } from '../systems/pf2e/engine';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import type { CharacterDocument } from '../types/core/document';
import { entriesForTarget, foldContributionTotal } from '../utils/contributionBreakdown';

const engine = new Pf2eEngine();

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-ledger-test',
    name: 'Ledger Test',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

/** The displayed AC after the engine prepares the document. */
function preparedAc(doc: CharacterDocument<Pf2eDataModel>): {
  prepared: CharacterDocument<Pf2eDataModel>;
  ac: number;
} {
  const prepared = engine.prepareData(doc);
  return { prepared, ac: prepared.system.armorClass };
}

describe('PF2e contribution ledger', () => {
  it('folds to the displayed AC for an unarmored character', () => {
    const { prepared, ac } = preparedAc(
      makeDoc({ baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 } })
    );

    const entries = entriesForTarget(buildPf2eContributionLedger(prepared).entries, 'armorClass');

    expect(foldContributionTotal(entries)).toBe(ac);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ operation: 'set', value: 10, target: 'armorClass' }),
      ])
    );
  });

  it('decomposes armored AC with a Dex cap, proficiency, and a raised shield', () => {
    const { prepared, ac } = preparedAc(
      makeDoc({
        level: 3,
        baseAttributes: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'trained', total: 0 },
          light: { tier: 'trained', total: 0 },
          medium: { tier: 'trained', total: 0 },
          heavy: { tier: 'untrained', total: 0 },
        },
        equipment: [
          {
            itemId: 'leather',
            name: 'Leather Armor',
            bulk: 1,
            equipped: true,
            armorClass: 1,
            armorType: 'light',
            dexBonusMax: 4,
          },
          {
            itemId: 'steel-shield',
            name: 'Steel Shield',
            bulk: 1,
            equipped: true,
            shieldBonus: 2,
            raised: true,
          },
        ],
      })
    );

    const entries = entriesForTarget(buildPf2eContributionLedger(prepared).entries, 'armorClass');

    // The whole point of surfacing the ledger: it sums to the AC the sheet shows.
    expect(foldContributionTotal(entries)).toBe(ac);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: expect.objectContaining({ id: 'leather' }), value: 1 }),
        expect.objectContaining({
          source: expect.objectContaining({ id: 'steel-shield' }),
          value: 2,
        }),
        expect.objectContaining({ label: 'Armor proficiency bonus' }),
      ])
    );
  });

  it('includes resolver-sourced magic AC and still folds to the displayed AC', () => {
    const { prepared, ac } = preparedAc(
      makeDoc({
        level: 2,
        baseAttributes: { str: 10, dex: 12, con: 10, int: 10, wis: 10, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'trained', total: 0 },
          light: { tier: 'trained', total: 0 },
          medium: { tier: 'trained', total: 0 },
          heavy: { tier: 'untrained', total: 0 },
        },
        equipment: [
          {
            itemId: 'plus-one-leather',
            name: '+1 Leather Armor',
            bulk: 1,
            equipped: true,
            armorClass: 1,
            armorType: 'light',
            dexBonusMax: 4,
            acBonus: 1,
            bonusType: 'enhancement',
            pf2eBucket: 'item',
          },
        ],
      })
    );

    const entries = entriesForTarget(buildPf2eContributionLedger(prepared).entries, 'armorClass');

    // AC includes the +1 item bonus the resolver applied; the fold must too.
    expect(foldContributionTotal(entries)).toBe(ac);
    expect(ac).toBeGreaterThan(13); // 10 + armor 1 + dex 1 + prof (2+2) = 15, +1 item = 16
  });

  it('does not mutate the prepared document', () => {
    const { prepared } = preparedAc(makeDoc());
    const serialized = JSON.stringify(prepared);

    buildPf2eContributionLedger(prepared);

    expect(JSON.stringify(prepared)).toBe(serialized);
  });
});
