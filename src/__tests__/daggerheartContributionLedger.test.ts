import { buildDaggerheartContributionLedger } from '../systems/daggerheart/contributionLedger';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createDocument(system: DaggerheartDataModel): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'daggerheart-ledger-test',
    name: 'Ledger Test Character',
    systemId: 'daggerheart',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('Daggerheart contribution ledger', () => {
  it('explains passive armor bonuses and active passive domain-card bonuses', () => {
    const system: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      armorId: 'daggerheart-armor-gambeson-armor-tier-1',
      domainCards: [
        {
          id: 'blade-fortified-armor',
          name: 'Fortified Armor',
          domain: 'blade',
          level: 2,
          location: 'loadout',
          description: '',
        },
      ],
    };
    const document = createDocument(system);
    const serializedBeforeLedger = JSON.stringify(document);

    const ledger = buildDaggerheartContributionLedger(document);

    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'evasion',
          source: expect.objectContaining({
            kind: 'item',
            id: 'daggerheart-armor-gambeson-armor-tier-1',
          }),
          operation: 'add',
          value: 1,
          category: 'defense',
        }),
        expect.objectContaining({
          target: 'majorThreshold',
          source: expect.objectContaining({
            kind: 'domain-card',
            id: 'blade-fortified-armor',
          }),
          value: 2,
          manualBoundary: expect.objectContaining({ kind: 'partial' }),
        }),
        expect.objectContaining({
          target: 'severeThreshold',
          source: expect.objectContaining({
            kind: 'domain-card',
            id: 'blade-fortified-armor',
          }),
          value: 2,
        }),
      ])
    );
    expect(JSON.stringify(document)).toBe(serializedBeforeLedger);
  });

  it('explains derived passive bonuses and ignores vault cards', () => {
    const system: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      attributes: {
        agility: 3,
        strength: 0,
        finesse: 0,
        instinct: 0,
        presence: 0,
        knowledge: 0,
      },
      domainCards: [
        {
          id: 'bone-i-see-it-coming',
          name: 'I See It Coming',
          domain: 'bone',
          level: 1,
          location: 'loadout',
          description: '',
        },
        {
          id: 'blade-fortified-armor',
          name: 'Fortified Armor',
          domain: 'blade',
          level: 2,
          location: 'vault',
          description: '',
        },
      ],
    };

    const ledger = buildDaggerheartContributionLedger(createDocument(system));

    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'evasion',
          source: expect.objectContaining({ id: 'bone-i-see-it-coming' }),
          label: 'Derived Evasion passive bonus',
          operation: 'add',
          value: 1,
          details: expect.objectContaining({
            derivedKind: 'evasion-half-trait',
            trait: 'agility',
          }),
        }),
      ])
    );
    expect(ledger.entries).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: expect.objectContaining({ id: 'blade-fortified-armor' }),
        }),
      ])
    );
  });
});
