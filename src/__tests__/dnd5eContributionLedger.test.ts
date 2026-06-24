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

describe('ledger/engine AC parity (review M6)', () => {
  // The whole point of the ledger: its armorClass entries must SUM to the AC
  // the engine displays — including resolver-applied magic items (Ring of
  // Protection) and Unarmored Defense, which previously never got entries.
  async function armorClassEntrySum(document: CharacterDocument<Dnd5eDataModel>) {
    const ledger = await buildDnd5eContributionLedger(document, 'dnd-5e-2014');
    // Resolver entries are normalized from the RFC target 'ac' to this
    // ledger's 'armorClass', so one filter sees the whole breakdown.
    const acEntries = ledger.entries.filter(
      (entry) => entry.target === 'armorClass' && typeof entry.value === 'number'
    );
    return acEntries.reduce(
      (sum, entry) =>
        entry.operation === 'set' ? (entry.value as number) : sum + (entry.value as number),
      0
    );
  }

  it('sums to the engine AC with a Ring of Protection equipped', async () => {
    const { Dnd5eEngine } = await import('../systems/dnd5e/engine');
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
      equipment: [
        {
          itemId: 'leather-armor',
          slot: 'chest',
          attuned: false,
          armorClass: 11,
          armorType: 'light',
        },
        { itemId: 'ring-of-protection', slot: 'ring1', attuned: true, acBonus: 1 },
      ],
    };
    const document = createDocument(system);

    const prepared = new Dnd5eEngine().prepareData(document);
    expect(await armorClassEntrySum(document)).toBe(prepared.system.armorClass);
  });

  it('sums to the engine AC for a barbarian with Unarmored Defense and a shield', async () => {
    const { Dnd5eEngine } = await import('../systems/dnd5e/engine');
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      baseAttributes: { str: 16, dex: 14, con: 16, int: 10, wis: 10, cha: 10 },
      features: [
        {
          id: 'unarmored-defense-barbarian',
          name: 'Unarmored Defense',
          source: 'Barbarian 1',
          description: 'AC = 10 + Dex mod + Con mod while not wearing armor.',
        },
      ],
      equipment: [{ itemId: 'shield', slot: 'offHand', attuned: false, shieldBonus: 2 }],
    };
    const document = createDocument(system);

    const prepared = new Dnd5eEngine().prepareData(document);
    // SRD: 10 + Dex 2 + Con 3 + shield 2 = 17.
    expect(prepared.system.armorClass).toBe(17);
    expect(await armorClassEntrySum(document)).toBe(17);
  });

  it('sums to the engine AC for a shieldless monk whose Unarmored Defense wins', async () => {
    const { Dnd5eEngine } = await import('../systems/dnd5e/engine');
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      // Wis modifier is positive so the monk formula (10 + Dex + Wis) beats the
      // plain 10 + Dex and a Monk Unarmored Defense entry is emitted.
      baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 16, cha: 10 },
      features: [
        {
          id: 'unarmored-defense-monk',
          name: 'Unarmored Defense',
          source: 'Monk 1',
          description: 'AC = 10 + Dex mod + Wis mod while unarmored and not using a shield.',
        },
      ],
    };
    const document = createDocument(system);

    const prepared = new Dnd5eEngine().prepareData(document);
    // SRD: 10 + Dex 2 + Wis 3 = 15.
    expect(prepared.system.armorClass).toBe(15);

    const ledger = await buildDnd5eContributionLedger(document, 'dnd-5e-2014');
    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({ kind: 'feature', id: 'unarmored-defense-monk' }),
          label: 'Unarmored Defense AC contribution',
          operation: 'add',
          // Delta over the plain 10 + Dex (12): 15 - 12 = 3.
          value: 3,
        }),
      ])
    );
    expect(await armorClassEntrySum(document)).toBe(15);
  });

  it('picks the higher Unarmored Defense when a character has both barbarian and monk features', async () => {
    const { Dnd5eEngine } = await import('../systems/dnd5e/engine');
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      // Con +1 (12) vs Wis +3 (16): the Monk formula (10 + Dex 2 + Wis 3 = 15)
      // beats the Barbarian formula (10 + Dex 2 + Con 1 = 13), so the ledger
      // must attribute the contribution to the monk feature.
      baseAttributes: { str: 10, dex: 14, con: 12, int: 10, wis: 16, cha: 10 },
      features: [
        {
          id: 'unarmored-defense-barbarian',
          name: 'Unarmored Defense',
          source: 'Barbarian 1',
          description: 'AC = 10 + Dex mod + Con mod while not wearing armor.',
        },
        {
          id: 'unarmored-defense-monk',
          name: 'Unarmored Defense',
          source: 'Monk 1',
          description: 'AC = 10 + Dex mod + Wis mod while unarmored.',
        },
      ],
    };
    const document = createDocument(system);

    const prepared = new Dnd5eEngine().prepareData(document);
    expect(prepared.system.armorClass).toBe(15);

    const ledger = await buildDnd5eContributionLedger(document, 'dnd-5e-2014');
    const udEntry = ledger.entries.find(
      (entry) => entry.label === 'Unarmored Defense AC contribution'
    );
    expect(udEntry?.source).toMatchObject({ id: 'unarmored-defense-monk' });
    expect(await armorClassEntrySum(document)).toBe(15);
  });
});

describe('contribution ledger without template state', () => {
  it('emits no template-proficiency entries when templateState is absent', async () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      templateState: undefined,
    };

    const ledger = await buildDnd5eContributionLedger(createDocument(system), 'dnd-5e-2014');

    // Proficiency entries are sourced entirely from templateState; with none,
    // the ledger still has armor-class entries but no proficiency targets.
    expect(ledger.entries.some((entry) => entry.category === 'proficiency')).toBe(false);
    expect(ledger.entries.some((entry) => entry.target === 'armorClass')).toBe(true);
  });
});
