import { describe, expect, it } from 'vitest';
import { mm3eArchetypes } from '../data/mutants-and-masterminds/3e/archetypes';
import { complications } from '../data/mutants-and-masterminds/3e/complications';
import { powerModifiers } from '../data/mutants-and-masterminds/3e/modifiers';
import { powerById } from '../data/mutants-and-masterminds/3e/powers';
import type { CharacterDocument } from '../types/core/document';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import { Mam3eEngine } from '../systems/mam3e/engine';
import { getMam3eSheetState } from '../systems/mam3e/getMam3eSheetState';
import { calculatePowerPointCost } from '../systems/mam3e/powerMath';
import { exportDocuments, importDocuments } from '../utils/documentStorage';

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-reference-surfaces',
    name: 'Reference Surface Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date('2026-03-08T00:00:00.000Z'),
    updatedAt: new Date('2026-03-08T00:00:00.000Z'),
  };
}

describe('M&M 3e reference surface persistence', () => {
  it('round-trips pinned archetype, inserted complication, and power modifier chain independently', () => {
    const engine = new Mam3eEngine();
    const archetypes = Object.values(mm3eArchetypes);
    const archetype = mm3eArchetypes.energyController;
    const complication = complications.find((entry) => entry.id === 'identity');
    const customComplication = {
      id: 'custom-code-of-honor',
      name: 'Code of Honor',
      description: 'Manual custom complication.',
    };
    const basePower = powerById.blast;
    const modifierCatalog = [...powerModifiers.extras, ...powerModifiers.flaws];

    expect(archetype).toBeDefined();
    expect(complication).toBeDefined();
    expect(basePower).toBeDefined();

    const modifiedPower = {
      ...basePower,
      rank: 4,
      extras: ['area', 'accurate'],
      flaws: ['limited', 'activation'],
      modifierRanks: {
        area: 1,
        accurate: 2,
        limited: 1,
        activation: 1,
      },
    };
    const doc = makeDoc({
      selectedArchetypeIds: [archetype.id],
      complications: [
        {
          id: complication!.id,
          name: complication!.name,
          description: complication!.description,
          source: complication!.source,
          category: complication!.category,
        },
        customComplication,
      ],
      powers: [modifiedPower],
    });

    const prepared = engine.prepareData(doc);
    const state = getMam3eSheetState({
      data: prepared.system,
      archetypes,
      modifierCatalog,
    });

    expect(state.pinnedArchetypeIds).toEqual([archetype.id]);
    expect(state.pinnedArchetypes.map((entry) => entry.id)).toEqual([archetype.id]);
    expect(state.insertedComplicationIds).toEqual([complication!.id, customComplication.id]);
    expect(state.modifierById.get('area')?.type).toBe('extra');
    expect(state.modifierById.get('limited')?.type).toBe('flaw');
    expect(prepared.system.powers).toHaveLength(1);
    expect(prepared.system.powers[0].extras).toEqual(['area', 'accurate']);
    expect(prepared.system.powers[0].flaws).toEqual(['limited', 'activation']);
    expect(prepared.system.powers[0].modifierRanks).toEqual(modifiedPower.modifierRanks);
    expect(calculatePowerPointCost(prepared.system.powers[0])).toBe(15);
    expect(prepared.system.powerPoints.spent.powers).toBe(15);

    const imported = importDocuments(exportDocuments([prepared]));
    const hydrated = engine.prepareData(imported[0] as CharacterDocument<Mam3eDataModel>);
    const hydratedState = getMam3eSheetState({
      data: hydrated.system,
      archetypes,
      modifierCatalog,
    });

    expect(hydratedState.pinnedArchetypeIds).toEqual([archetype.id]);
    expect(hydratedState.pinnedArchetypes.map((entry) => entry.id)).toEqual([archetype.id]);
    expect(hydratedState.insertedComplicationIds).toEqual([
      complication!.id,
      customComplication.id,
    ]);
    expect(hydrated.system.complications).toEqual(prepared.system.complications);
    expect(hydrated.system.powers[0]).toMatchObject({
      id: 'blast',
      rank: 4,
      extras: ['area', 'accurate'],
      flaws: ['limited', 'activation'],
      modifierRanks: modifiedPower.modifierRanks,
    });
    expect(hydrated.system.powerPoints.spent.powers).toBe(15);
  });

  it('keeps pinned archetypes reference-only through point totals and PL-cap warnings', () => {
    const engine = new Mam3eEngine();
    const archetypes = Object.values(mm3eArchetypes);
    const modifierCatalog = [...powerModifiers.extras, ...powerModifiers.flaws];
    const archetype = mm3eArchetypes.battlesuit;
    const blast = {
      ...powerById.blast,
      rank: 4,
    };

    const doc = makeDoc({
      powerLevel: 3,
      selectedArchetypeIds: [archetype.id],
      abilities: { ...createDefaultMam3eData().abilities, dex: 4 },
      skills: {
        'ranged-combat': { rank: 4, total: 0 },
      },
      powers: [blast],
    });

    const prepared = engine.prepareData(doc);
    const state = getMam3eSheetState({
      data: prepared.system,
      archetypes,
      modifierCatalog,
    });

    expect(state.pinnedArchetypeIds).toEqual([archetype.id]);
    expect(state.pinnedArchetypes.map((entry) => entry.id)).toEqual([archetype.id]);
    expect(prepared.system.powers).toHaveLength(1);
    expect(prepared.system.powers[0]).toMatchObject({ id: 'blast', rank: 4 });
    expect(prepared.system.advantages).toEqual([]);
    expect(prepared.system.complications).toEqual([]);
    expect(prepared.system.skills['ranged-combat']).toEqual({ rank: 4, total: 8 });
    expect(prepared.system.powerPoints.spent).toMatchObject({
      abilities: 8,
      powers: 8,
      advantages: 0,
      skills: 2,
    });
    expect(prepared.system.plViolations).toEqual([
      { label: 'Ranged Attack + Effect', value: 12, limit: 6 },
    ]);

    const imported = importDocuments(exportDocuments([prepared]));
    const hydrated = engine.prepareData(imported[0] as CharacterDocument<Mam3eDataModel>);

    expect(hydrated.system.selectedArchetypeIds).toEqual([archetype.id]);
    expect(hydrated.system.powers).toHaveLength(1);
    expect(hydrated.system.powers[0]).toMatchObject({ id: 'blast', rank: 4 });
    expect(hydrated.system.advantages).toEqual([]);
    expect(hydrated.system.complications).toEqual([]);
    expect(hydrated.system.skills['ranged-combat']).toEqual({ rank: 4, total: 8 });
    expect(hydrated.system.powerPoints.spent).toMatchObject({
      abilities: 8,
      powers: 8,
      advantages: 0,
      skills: 2,
    });
    expect(hydrated.system.plViolations).toEqual([
      { label: 'Ranged Attack + Effect', value: 12, limit: 6 },
    ]);
  });

  it('normalizes duplicate persisted reference ids without dropping unresolved pins', () => {
    const archetypes = Object.values(mm3eArchetypes);
    const modifierCatalog = [...powerModifiers.extras, ...powerModifiers.flaws];
    const archetype = mm3eArchetypes.battlesuit;
    const complication = complications.find((entry) => entry.id === 'identity');

    expect(archetype).toBeDefined();
    expect(complication).toBeDefined();

    const state = getMam3eSheetState({
      data: makeDoc({
        selectedArchetypeIds: [archetype.id, archetype.id, 'unresolved-archetype', ''],
        complications: [
          {
            id: complication!.id,
            name: complication!.name,
            description: complication!.description,
          },
          {
            id: complication!.id,
            name: 'Identity duplicate',
            description: 'Legacy duplicate entry.',
          },
          {
            id: 'custom-complication',
            name: 'Custom',
            description: 'Manual entry.',
          },
          {
            id: '',
            name: 'Blank legacy row',
            description: 'Ignored for catalog insertion state.',
          },
        ],
      }).system,
      archetypes,
      modifierCatalog,
    });

    expect(state.pinnedArchetypeIds).toEqual([archetype.id, 'unresolved-archetype']);
    expect(state.pinnedArchetypes.map((entry) => entry.id)).toEqual([archetype.id]);
    expect(state.insertedComplicationIds).toEqual([complication!.id, 'custom-complication']);
  });
});
