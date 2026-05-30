import { Dnd5eEngine } from '../systems/dnd5e/engine';
import {
  buildDnd5eActivityDefinitions,
  executeDnd5eActivity,
} from '../systems/dnd5e/shared/activities';
import { buildDnd5eContributionLedger } from '../systems/dnd5e/shared/contributionLedger';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { SpellSlots } from '../types/core/character';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createDocument(system: Dnd5eDataModel): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-activity-test',
    name: 'Activity Test Character',
    systemId: 'dnd-5e-2014',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function createEmptySpellSlots(): SpellSlots {
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

describe('D&D 5e activity pilot', () => {
  it('applies and explains Defense Fighting Style AC when armor is equipped', async () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      level: 2,
      baseAttributes: {
        str: 10,
        dex: 14,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [6] }],
      featureOptionSelections: [{ group: 'fighting-styles', id: 'defense' }],
      equipment: [
        {
          itemId: 'leather-armor',
          slot: 'chest',
          attuned: false,
          armorClass: 11,
          armorType: 'light',
        },
      ],
    };
    const document = createDocument(system);

    const prepared = new Dnd5eEngine().prepareData(document);
    const activities = buildDnd5eActivityDefinitions(prepared);
    const ledger = await buildDnd5eContributionLedger(prepared, 'dnd-5e-2014');

    expect(prepared.system.armorClass).toBe(14);
    expect(activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dnd5e-2014.feature-option.fighting-styles.defense.ac',
          kind: 'passive',
          eligibility: { eligible: true, reasons: [] },
          outputs: [
            expect.objectContaining({
              target: 'armorClass',
              operation: 'add',
              value: 1,
            }),
          ],
        }),
      ])
    );
    expect(ledger.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: 'armorClass',
          source: expect.objectContaining({
            kind: 'feature-option',
            id: 'fighting-styles:defense',
          }),
          label: 'Defense Fighting Style AC bonus',
          value: 1,
        }),
      ])
    );
  });

  it('executes a selected Divine Smite by consuming the matching spell slot only', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      level: 5,
      classLevels: [{ classId: 'paladin', level: 5, hitDieRolls: [6, 6, 6, 6] }],
      featureOptionSelections: [{ group: 'smites', id: 'divine-smite-2nd' }],
      spellcasting: {
        classes: [{ classId: 'paladin', ability: 'cha', spellcastingLevel: 3 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: {
          ...createEmptySpellSlots(),
          2: { max: 1, used: 0 },
        },
      },
    };
    const document = createDocument(system);
    const serializedBeforeExecution = JSON.stringify(document);

    const activities = buildDnd5eActivityDefinitions(document);
    const result = executeDnd5eActivity(
      document,
      'dnd5e-2014.feature-option.smites.divine-smite-2nd'
    );

    expect(activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dnd5e-2014.feature-option.smites.divine-smite-2nd',
          kind: 'action',
          eligibility: { eligible: true, reasons: [] },
          costs: [
            expect.objectContaining({
              kind: 'spell-slot',
              available: true,
              details: expect.objectContaining({ slotLevel: 2, max: 1, used: 0 }),
            }),
          ],
          outputs: expect.arrayContaining([
            expect.objectContaining({
              target: 'spellcasting.spellSlots.2.used',
              value: 1,
            }),
            expect.objectContaining({
              target: 'damage.radiant',
              value: '2d8',
            }),
          ]),
          manualBoundary: expect.objectContaining({ kind: 'partial' }),
        }),
      ])
    );
    expect(result.issues).toEqual([]);
    expect(result.document.system.spellcasting?.spellSlots[2]).toEqual({ max: 1, used: 1 });
    expect(JSON.stringify(document)).toBe(serializedBeforeExecution);
  });

  it('returns structured errors when a Divine Smite spell-slot cost is unavailable', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      level: 5,
      classLevels: [{ classId: 'paladin', level: 5, hitDieRolls: [6, 6, 6, 6] }],
      featureOptionSelections: [{ group: 'smites', id: 'divine-smite-2nd' }],
      spellcasting: {
        classes: [{ classId: 'paladin', ability: 'cha', spellcastingLevel: 3 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: {
          ...createEmptySpellSlots(),
          2: { max: 1, used: 1 },
        },
      },
    };
    const document = createDocument(system);

    const result = executeDnd5eActivity(
      document,
      'dnd5e-2014.feature-option.smites.divine-smite-2nd'
    );

    expect(result.issues).toEqual([
      expect.objectContaining({
        code: 'dnd5e-activity-ineligible',
        severity: 'error',
        message: 'No available level 2 spell slot remains.',
      }),
    ]);
    expect(result.document).toBe(document);
  });
});
