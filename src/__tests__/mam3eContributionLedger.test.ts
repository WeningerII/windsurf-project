import {
  buildMam3eContributionLedger,
  buildMam3ePowerCostLedgerEntries,
} from '../systems/mam3e/contributionLedger';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { Power } from '../types/mam/powers';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createDamagePower(overrides: Partial<Power> = {}): Power {
  return {
    id: 'damage',
    name: 'Damage',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    rank: 5,
    description: 'Damage effect.',
    effects: ['Damage'],
    ...overrides,
  };
}

describe('M&M 3e contribution ledger', () => {
  it('explains power cost math with extras, flaws, and final totals', () => {
    const power = createDamagePower({
      extras: ['area'],
      flaws: ['limited'],
      modifierRanks: {
        area: 2,
        limited: 1,
      },
    });

    const entries = buildMam3ePowerCostLedgerEntries(power);

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'powers.0.costPerRank',
          source: expect.objectContaining({ kind: 'power', id: 'damage' }),
          label: 'Base cost per rank',
          value: 1,
          category: 'cost',
        }),
        expect.objectContaining({
          target: 'powers.0.costPerRank',
          source: expect.objectContaining({ kind: 'power-modifier', id: 'area' }),
          label: 'Area per-rank cost',
          value: 2,
        }),
        expect.objectContaining({
          target: 'powers.0.costPerRank',
          source: expect.objectContaining({ kind: 'power-modifier', id: 'limited' }),
          label: 'Limited per-rank cost',
          value: -1,
        }),
        expect.objectContaining({
          target: 'powers.0.totalCost',
          operation: 'set',
          value: 10,
          details: expect.objectContaining({ rank: 5, costPerRank: 2, flatCost: 0 }),
        }),
      ])
    );
  });

  it('returns document-level power entries without mutating the character', () => {
    const document: CharacterDocument<Mam3eDataModel> = {
      id: 'mam-ledger-test',
      name: 'Ledger Test Hero',
      systemId: 'mam3e',
      system: {
        ...createDefaultMam3eData(),
        powers: [createDamagePower({ extras: ['alternate-effect'] })],
      },
      createdAt: TEST_DATE,
      updatedAt: TEST_DATE,
    };
    const serializedBeforeLedger = JSON.stringify(document);

    const ledger = buildMam3eContributionLedger(document);

    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'powers.0.flatCost',
          source: expect.objectContaining({ id: 'alternate-effect' }),
          value: 1,
        }),
        expect.objectContaining({
          target: 'powers.0.totalCost',
          value: 6,
        }),
      ])
    );
    expect(JSON.stringify(document)).toBe(serializedBeforeLedger);
  });

  it('surfaces unsupported modifier ids as manual-boundary ledger rows', () => {
    const entries = buildMam3ePowerCostLedgerEntries(
      createDamagePower({ extras: ['invented-extra'] })
    );

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Unknown power modifier ignored',
          source: expect.objectContaining({ id: 'invented-extra' }),
          manualBoundary: expect.objectContaining({ kind: 'unsupported' }),
        }),
      ])
    );
  });
});
