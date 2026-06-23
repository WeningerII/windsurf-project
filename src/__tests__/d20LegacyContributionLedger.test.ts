import { describe, expect, it } from 'vitest';

import { buildD20LegacyContributionLedger } from '../systems/d20-legacy/contributionLedger';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { Pf1eEngine } from '../systems/pf1e/engine';
import { createDefaultPf1eData, type Pf1eDataModel } from '../systems/pf1e/data-model';
import type { CharacterDocument } from '../types/core/document';
import { entriesForTarget, foldContributionTotal } from '../utils/contributionBreakdown';

describe('d20-legacy contribution ledger', () => {
  it('folds to the engine-computed total AC for D&D 3.5e (armor, shield, Dex cap, size)', () => {
    const engine = new Dnd35eEngine();
    const doc: CharacterDocument<Dnd35eDataModel> = {
      id: 'dnd35e-ledger',
      name: 'Ledger Test',
      systemId: 'dnd-3.5e',
      system: {
        ...createDefaultDnd35eData(),
        sizeCategory: 'small',
        baseAttributes: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
        equipment: [
          {
            itemId: 'breastplate',
            name: 'Breastplate',
            equipped: true,
            armorClass: 6,
            armorType: 'medium',
            dexBonusMax: 1,
          },
          { itemId: 'heavy-shield', name: 'Heavy Shield', equipped: true, shieldBonus: 2 },
        ],
      },
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
      updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    };

    const prepared = engine.prepareData(doc);
    const entries = entriesForTarget(
      buildD20LegacyContributionLedger(prepared, 'dnd-3.5e').entries,
      'armorClass.total'
    );

    // base 10 + armor 6 + shield 2 + dex(capped to 1) + size(small +1) = 20.
    expect(foldContributionTotal(entries)).toBe(prepared.system.armorClass.total);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ operation: 'set', value: 10 }),
        expect.objectContaining({
          source: expect.objectContaining({ id: 'breastplate' }),
          value: 6,
        }),
        expect.objectContaining({
          source: expect.objectContaining({ id: 'heavy-shield' }),
          value: 2,
        }),
        expect.objectContaining({ label: 'Size modifier', value: 1 }),
      ])
    );
  });

  it('folds to the engine-computed total AC for Pathfinder 1e and is non-mutating', () => {
    const engine = new Pf1eEngine();
    const doc: CharacterDocument<Pf1eDataModel> = {
      id: 'pf1e-ledger',
      name: 'Ledger Test',
      systemId: 'pf1e',
      system: {
        ...createDefaultPf1eData(),
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        equipment: [
          {
            itemId: 'chain-shirt',
            name: 'Chain Shirt',
            equipped: true,
            armorClass: 4,
            armorType: 'light',
            dexBonusMax: 4,
          },
        ],
      },
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
      updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    };

    const prepared = engine.prepareData(doc);
    const serialized = JSON.stringify(prepared);
    const entries = entriesForTarget(
      buildD20LegacyContributionLedger(prepared, 'pf1e').entries,
      'armorClass.total'
    );

    expect(foldContributionTotal(entries)).toBe(prepared.system.armorClass.total);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: expect.objectContaining({ id: 'chain-shirt' }),
          value: 4,
        }),
        expect.objectContaining({ label: 'Dexterity modifier', value: 2 }),
      ])
    );
    // Building the ledger is a read-only projection.
    expect(JSON.stringify(prepared)).toBe(serialized);
  });
});
