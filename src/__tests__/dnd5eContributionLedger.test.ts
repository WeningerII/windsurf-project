import { buildDnd5eContributionLedger } from '../systems/dnd5e/shared/contributionLedger';
import { applyDnd5eFeatureOptionSelection } from '../systems/dnd5e/shared/dnd5eFeatureOptions';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { SpellSlots } from '../types/core/character';
import type { Dnd5eFeatureOptionDefinition } from '../types/character-options/feature-options';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function emptySpellSlots(): SpellSlots {
  return {
    1: { max: 0, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  };
}

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
        wis: 16,
        cha: 10,
      },
      classLevels: [{ classId: 'cleric', subclassId: 'life-domain', level: 1, hitDieRolls: [] }],
      spellcasting: {
        classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: 1 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: emptySpellSlots(),
      },
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
        // Spell save DC = 8 (base) + 2 (proficiency) + 3 (Wis mod) = 13.
        expect.objectContaining({
          target: 'spellcasting.classes.cleric.spellSaveDc',
          source: expect.objectContaining({ kind: 'system', id: 'spell-save-dc-base' }),
          operation: 'set',
          value: 8,
          category: 'spell',
        }),
        expect.objectContaining({
          target: 'spellcasting.classes.cleric.spellSaveDc',
          source: expect.objectContaining({ kind: 'class', id: 'cleric' }),
          operation: 'add',
          value: 2,
          category: 'spell',
        }),
        expect.objectContaining({
          target: 'spellcasting.classes.cleric.spellSaveDc',
          source: expect.objectContaining({ kind: 'system', id: 'wis-modifier' }),
          operation: 'add',
          value: 3,
          category: 'spell',
        }),
        // Spell attack bonus = 2 (proficiency) + 3 (Wis mod) = 5.
        expect.objectContaining({
          target: 'spellcasting.classes.cleric.spellAttackBonus',
          source: expect.objectContaining({ kind: 'class', id: 'cleric' }),
          operation: 'add',
          value: 2,
          category: 'spell',
        }),
        expect.objectContaining({
          target: 'spellcasting.classes.cleric.spellAttackBonus',
          source: expect.objectContaining({ kind: 'system', id: 'wis-modifier' }),
          operation: 'add',
          value: 3,
          category: 'spell',
        }),
      ])
    );
    // The spell-DC/attack rows must sum to the values the engine computes for
    // data.spellcasting.classes[] (SRD: 8 + prof + mod / prof + mod).
    const spellRowSum = (target: string) =>
      ledger.entries
        .filter((entry) => entry.target === target && typeof entry.value === 'number')
        .reduce(
          (sum, entry) =>
            entry.operation === 'set' ? (entry.value as number) : sum + (entry.value as number),
          0
        );
    expect(spellRowSum('spellcasting.classes.cleric.spellSaveDc')).toBe(13);
    expect(spellRowSum('spellcasting.classes.cleric.spellAttackBonus')).toBe(5);
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
});

describe('feature-option modifier surfacing through the resolver', () => {
  const FEATURE_ID = 'feature-option:fighting-styles:test-boon';

  function optionWithModifiers(
    modifiers: Dnd5eFeatureOptionDefinition['modifiers']
  ): Dnd5eFeatureOptionDefinition {
    return {
      id: 'test-boon',
      group: 'fighting-styles',
      name: 'Test Boon',
      system: 'dnd-5e-2014',
      source: 'Homebrew',
      description: 'A test option that grants a saving throw bonus.',
      classIds: ['fighter'],
      modifiers,
    };
  }

  it('carries an option modifier onto the synthesized feature and resolves it into the ledger', async () => {
    const option = optionWithModifiers([{ value: 1, type: 'saving-throw', source: 'Test Boon' }]);
    const system = applyDnd5eFeatureOptionSelection(createDefaultDnd5eData(), option);

    // The synthesized feature now carries the option's modifiers...
    const feature = system.features.find((entry) => entry.id === FEATURE_ID);
    expect(feature?.modifiers).toEqual([{ value: 1, type: 'saving-throw', source: 'Test Boon' }]);

    // ...so resolveCharacterEffects projects it as a first-class contribution row
    // (target 'save'), the same shared path feats/features already take.
    const ledger = await buildDnd5eContributionLedger(createDocument(system), 'dnd-5e-2014');
    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'save',
          source: expect.objectContaining({ kind: 'feature', id: FEATURE_ID }),
          operation: 'add',
          value: 1,
        }),
      ])
    );
  });

  it('leaves the feature (and resolver) untouched for an option with no modifiers', async () => {
    const option = optionWithModifiers(undefined);
    const system = applyDnd5eFeatureOptionSelection(createDefaultDnd5eData(), option);

    // No modifiers key is added — behavior-preserving for existing options such
    // as the Defense fighting style, whose AC bonus stays on its engine path and
    // is never double-counted through the resolver.
    const feature = system.features.find((entry) => entry.id === FEATURE_ID);
    expect(feature).toBeDefined();
    expect(feature && 'modifiers' in feature).toBe(false);

    const ledger = await buildDnd5eContributionLedger(createDocument(system), 'dnd-5e-2014');
    expect(
      ledger.entries.some((entry) => entry.source.id === FEATURE_ID && entry.target === 'save')
    ).toBe(false);
  });
});
