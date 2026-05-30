import { buildDnd5eContributionLedger } from '../systems/dnd5e/shared/contributionLedger';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createDocument(system: Dnd5eDataModel): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-ledger-test',
    name: 'Ledger Test Character',
    systemId: 'dnd-5e-2014',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('D&D 5e contribution ledger', () => {
  it('explains armor class, template proficiencies, feat automation, and spell grants', async () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      level: 1,
      baseAttributes: {
        str: 10,
        dex: 14,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      classLevels: [{ classId: 'cleric', subclassId: 'life-domain', level: 1, hitDieRolls: [] }],
      equipment: [
        {
          itemId: 'leather-armor',
          slot: 'chest',
          attuned: false,
          armorClass: 11,
          armorType: 'light',
        },
        {
          itemId: 'shield',
          slot: 'offHand',
          attuned: false,
          shieldBonus: 2,
        },
      ],
      templateState: {
        classDerivedProficiencies: {
          armor: ['light', 'medium'],
          weapons: ['simple'],
          tools: [],
          savingThrows: ['wis', 'cha'],
        },
        backgroundDerived: {
          tools: ['herbalism-kit'],
          languages: ['celestial'],
        },
        featDerivedAutomation: {
          abilityScores: { wis: 1 },
          armor: ['heavy'],
          weapons: [],
          tools: [],
          languages: [],
          savingThrows: [],
        },
      },
    };
    const document = createDocument(system);
    const serializedBeforeLedger = JSON.stringify(document);

    const ledger = await buildDnd5eContributionLedger(document, 'dnd-5e-2014');

    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({ kind: 'item', id: 'leather-armor' }),
          operation: 'set',
          value: 11,
          category: 'defense',
        }),
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({ id: 'dexterity-modifier' }),
          operation: 'add',
          value: 2,
          category: 'defense',
        }),
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({ kind: 'item', id: 'shield' }),
          operation: 'add',
          value: 2,
          category: 'defense',
        }),
        expect.objectContaining({
          target: 'proficiencies.armor',
          source: expect.objectContaining({ kind: 'class' }),
          value: ['light', 'medium'],
          category: 'proficiency',
        }),
        expect.objectContaining({
          target: 'baseAttributes.wis',
          source: expect.objectContaining({ kind: 'feat' }),
          value: 1,
          category: 'ability',
        }),
        expect.objectContaining({
          target: 'spellcasting.alwaysPreparedSpellIds',
          source: expect.objectContaining({ label: 'Life Domain Spells' }),
          value: 'bless',
          category: 'spell',
        }),
      ])
    );
    expect(JSON.stringify(document)).toBe(serializedBeforeLedger);
  });

  it('uses unarmored base AC when no armor is equipped', async () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      baseAttributes: {
        str: 10,
        dex: 8,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
    };

    const ledger = await buildDnd5eContributionLedger(createDocument(system), 'dnd-5e-2014');

    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({ id: 'unarmored-base-ac' }),
          operation: 'set',
          value: 10,
        }),
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({ id: 'dexterity-modifier' }),
          operation: 'add',
          value: -1,
        }),
      ])
    );
  });
});
