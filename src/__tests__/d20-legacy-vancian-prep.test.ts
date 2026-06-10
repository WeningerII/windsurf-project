import { describe, expect, it } from 'vitest';
import type { CharacterDocument } from '../types/core/document';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { createDefaultPf1eData, type Pf1eDataModel } from '../systems/pf1e/data-model';
import { Pf1eEngine } from '../systems/pf1e/engine';
import {
  resetD20LegacySpellSlots,
  setD20LegacyPreparedSpell,
  setD20LegacySpellSlotTotal,
  spendD20LegacySpellSlot,
  type D20LegacyData,
} from '../systems/d20-legacy/d20LegacySheetShared';
import { D20_LEGACY_MANUAL_NOTES } from '../utils/documentationCopy';
import { exportDocuments, importDocuments } from '../utils/documentStorage';

function makeDnd35eClericDoc(
  overrides: Partial<Dnd35eDataModel> = {}
): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'dnd35e-vancian',
    name: '3.5e Cleric',
    systemId: 'dnd-3.5e',
    system: {
      ...createDefaultDnd35eData(),
      classLevels: [
        {
          classId: 'cleric',
          level: 3,
          hitDieRolls: [8, 5, 5],
          bab: 'three-quarter',
          fortSave: 'good',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
        },
      ],
      ...overrides,
    },
    createdAt: new Date('2026-03-08T00:00:00.000Z'),
    updatedAt: new Date('2026-03-08T00:00:00.000Z'),
  };
}

function makePf1eClericDoc(
  overrides: Partial<Pf1eDataModel> = {}
): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'pf1e-vancian',
    name: 'PF1e Cleric',
    systemId: 'pf1e',
    system: {
      ...createDefaultPf1eData(),
      classLevels: [
        {
          classId: 'cleric',
          level: 3,
          hitDieRolls: [8, 5, 5],
          bab: 'three-quarter',
          fortSave: 'good',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
          favoredClassBonus: 'hp',
        },
      ],
      ...overrides,
    },
    createdAt: new Date('2026-03-08T00:00:00.000Z'),
    updatedAt: new Date('2026-03-08T00:00:00.000Z'),
  };
}

function runVancianCycle<T extends D20LegacyData>(params: {
  engine: { prepareData(document: CharacterDocument<T>): CharacterDocument<T> };
  document: CharacterDocument<T>;
  preparedSpellId: string;
  spontaneousSpellIds: string[];
}) {
  const { engine, document, preparedSpellId, spontaneousSpellIds } = params;
  const preparedSpellsByLevel = setD20LegacyPreparedSpell(undefined, 1, 0, preparedSpellId);

  expect(preparedSpellsByLevel).toEqual({ 1: [preparedSpellId] });

  const prepared = engine.prepareData({
    ...document,
    system: {
      ...document.system,
      spellsKnown: [preparedSpellId, ...spontaneousSpellIds],
      preparedSpellsByLevel,
    },
  });
  const levelOneSlots = prepared.system.spellsPerDay?.[1];
  expect(levelOneSlots?.total).toBeGreaterThan(0);

  const spentSlots = spendD20LegacySpellSlot(prepared.system.spellsPerDay, 1);
  const cast = {
    ...prepared,
    system: {
      ...prepared.system,
      spellsPerDay: spentSlots,
    },
  };

  expect(cast.system.spellsPerDay?.[1]).toEqual({
    total: levelOneSlots!.total,
    used: 1,
  });

  const rested = engine.prepareData({
    ...cast,
    system: {
      ...cast.system,
      spellsPerDay: resetD20LegacySpellSlots(cast.system.spellsPerDay),
    },
  });

  expect(rested.system.spellsPerDay?.[1]).toEqual({
    total: levelOneSlots!.total,
    used: 0,
  });
  expect(rested.system.preparedSpellsByLevel?.[1]).toEqual([preparedSpellId]);
  spontaneousSpellIds.forEach((spellId) => {
    expect(rested.system.preparedSpellsByLevel?.[1]).not.toContain(spellId);
  });
  expect(D20_LEGACY_MANUAL_NOTES).toContain(
    'Spontaneous cure/inflict conversion is applied manually.'
  );

  const [hydrated] = importDocuments(exportDocuments([rested]));
  const hydratedSystem = (hydrated as CharacterDocument<T>).system;

  expect(hydratedSystem.spellsKnown).toEqual([preparedSpellId, ...spontaneousSpellIds]);
  expect(hydratedSystem.preparedSpellsByLevel?.[1]).toEqual([preparedSpellId]);
  expect(hydratedSystem.spellsPerDay?.[1]).toEqual({
    total: levelOneSlots!.total,
    used: 0,
  });
}

describe('d20 legacy Vancian preparation', () => {
  it('tracks 3.5e prepared slots through prepare, cast, rest, and persistence', () => {
    runVancianCycle({
      engine: new Dnd35eEngine(),
      document: makeDnd35eClericDoc(),
      preparedSpellId: 'bless-cleric-35e',
      spontaneousSpellIds: ['cure-light-wounds-cleric-35e', 'inflict-light-wounds-cleric-35e'],
    });
  });

  it('tracks PF1e prepared slots through prepare, cast, rest, and persistence', () => {
    runVancianCycle({
      engine: new Pf1eEngine(),
      document: makePf1eClericDoc(),
      preparedSpellId: 'pf1e-bless',
      spontaneousSpellIds: ['pf1e-cure-light-wounds'],
    });
  });
});

describe('d20 legacy manual spell-slot totals (regression: prepareData reverted edits)', () => {
  it('keeps a manually raised total across repeated prepares', () => {
    const engine = new Pf1eEngine();
    const prepared = engine.prepareData(makePf1eClericDoc());
    // Cleric 3 table baseline at 1st level is 2 (Wis 10 → no bonus spells).
    expect(prepared.system.spellsPerDay?.[1]).toMatchObject({ total: 2 });

    // The sheet's slot editor raises the 1st-level total to 5 (e.g. a house
    // bonus); the edit is recorded as a +3 delta over the automated baseline.
    const edited = {
      ...prepared,
      system: {
        ...prepared.system,
        spellsPerDay: setD20LegacySpellSlotTotal(prepared.system.spellsPerDay, 1, 5),
      },
    };
    expect(edited.system.spellsPerDay?.[1]).toEqual({ total: 5, used: 0, manualBonus: 3 });

    const reprepared = engine.prepareData(engine.prepareData(edited));
    expect(reprepared.system.spellsPerDay?.[1]).toEqual({ total: 5, used: 0, manualBonus: 3 });
  });

  it('survives level-down sanely: baseline shrinks, the manual delta is kept, totals floor at 0', () => {
    const engine = new Pf1eEngine();
    const doc = makePf1eClericDoc();
    const prepared = engine.prepareData(doc);
    const edited = {
      ...prepared,
      system: {
        ...prepared.system,
        spellsPerDay: setD20LegacySpellSlotTotal(prepared.system.spellsPerDay, 1, 3), // +1 over baseline 2
      },
    };

    // Level the cleric down to 1: table baseline drops to 1, manual +1 stays.
    const leveledDown = engine.prepareData({
      ...edited,
      system: {
        ...edited.system,
        classLevels: edited.system.classLevels.map((classLevel) => ({
          ...classLevel,
          level: 1,
          hitDieRolls: [8],
        })),
      },
    });
    expect(leveledDown.system.spellsPerDay?.[1]).toEqual({ total: 2, used: 0, manualBonus: 1 });

    // A manual reduction below the automated baseline floors at 0 after a
    // level-down rather than going negative.
    const reduced = {
      ...prepared,
      system: {
        ...prepared.system,
        spellsPerDay: setD20LegacySpellSlotTotal(prepared.system.spellsPerDay, 1, 0), // −2 under baseline
      },
    };
    const reducedDown = engine.prepareData({
      ...reduced,
      system: {
        ...reduced.system,
        classLevels: reduced.system.classLevels.map((classLevel) => ({
          ...classLevel,
          level: 1,
          hitDieRolls: [8],
        })),
      },
    });
    expect(reducedDown.system.spellsPerDay?.[1]).toEqual({ total: 0, used: 0, manualBonus: -2 });
  });

  it('keeps rows added via "Add Level" (whole total recorded as manualBonus) across prepares', () => {
    const engine = new Dnd35eEngine();
    const doc = makeDnd35eClericDoc({
      // Shape written by addSpellLevel for a level the class table lacks.
      spellsPerDay: { 9: { total: 1, used: 0, manualBonus: 1 } },
    });

    const prepared = engine.prepareData(doc);
    expect(prepared.system.spellsPerDay?.[9]).toEqual({ total: 1, used: 0, manualBonus: 1 });
  });
});
