import { describe, expect, it } from 'vitest';
import type { CharacterDocument } from '../types/core/document';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { createDefaultPf1eData, type Pf1eDataModel } from '../systems/pf1e/data-model';
import { Pf1eEngine } from '../systems/pf1e/engine';
import {
  resetD20LegacySpellSlots,
  setD20LegacyPreparedSpell,
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
