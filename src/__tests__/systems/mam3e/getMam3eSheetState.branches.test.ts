import { describe, expect, it } from 'vitest';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../../systems/mam3e/data-model';
import { getMam3eSheetState } from '../../../systems/mam3e/getMam3eSheetState';
import { createEmptyMam3eConditionTrack } from '../../../systems/mam3e/mam3eSheetShared';

function makeArchetype(id: string, name: string): Mam3eArchetype {
  return {
    id,
    name,
    system: 'mam3e',
    source: "Hero's Handbook",
    features: [],
    description: `${name} archetype`,
  };
}

function dataWith(overrides: Partial<Mam3eDataModel> = {}): Mam3eDataModel {
  return { ...createDefaultMam3eData(), ...overrides };
}

/**
 * Branch coverage for getMam3eSheetState's normalization paths: the
 * `selectedArchetypeIds ?? []` nullish fallback and uniqueNonEmptyStrings'
 * trim/empty/dedupe guards.
 */
describe('getMam3eSheetState normalization branches', () => {
  it('treats an absent selectedArchetypeIds as an empty pin list (?? [] fallback)', () => {
    const data = dataWith();
    delete (data as { selectedArchetypeIds?: string[] }).selectedArchetypeIds;

    const state = getMam3eSheetState({
      data,
      archetypes: [makeArchetype('mam3e-battlesuit', 'Battlesuit')],
      modifierCatalog: [],
    });

    expect(state.pinnedArchetypeIds).toEqual([]);
    expect(state.pinnedArchetypes).toEqual([]);
  });

  it('drops empty, whitespace-only, and duplicate archetype ids when deriving pins', () => {
    const state = getMam3eSheetState({
      // '' and '   ' are skipped; the second 'mam3e-battlesuit' is de-duped.
      data: dataWith({
        selectedArchetypeIds: [
          'mam3e-battlesuit',
          '',
          '   ',
          'mam3e-battlesuit',
          'mam3e-speedster',
        ],
      }),
      archetypes: [
        makeArchetype('mam3e-battlesuit', 'Battlesuit'),
        makeArchetype('mam3e-speedster', 'Speedster'),
      ],
      modifierCatalog: [],
    });

    expect(state.pinnedArchetypeIds).toEqual(['mam3e-battlesuit', 'mam3e-speedster']);
    expect(state.pinnedArchetypes.map((entry) => entry.id)).toEqual([
      'mam3e-battlesuit',
      'mam3e-speedster',
    ]);
  });

  it('skips complications without an id and de-dupes repeated complication ids', () => {
    const state = getMam3eSheetState({
      data: dataWith({
        complications: [
          { id: 'accident', name: 'Accident', description: 'a' },
          // No id -> normalized to undefined -> skipped.
          { name: 'Motivation', description: 'b' } as Mam3eDataModel['complications'][number],
          { id: 'accident', name: 'Accident (dupe)', description: 'c' },
        ],
      }),
      archetypes: [],
      modifierCatalog: [],
    });

    expect(state.insertedComplicationIds).toEqual(['accident']);
  });

  it('reports ppOver=false when spend exactly equals the budget (boundary)', () => {
    // ppOver is strict greater-than, so spend == total is in-budget.
    const state = getMam3eSheetState({
      data: dataWith({
        powerPoints: {
          total: 30,
          spent: { abilities: 10, defenses: 5, powers: 10, advantages: 3, skills: 2 },
        },
      }),
      archetypes: [],
      modifierCatalog: [],
    });

    expect(state.ppSpent).toBe(30);
    expect(state.ppOver).toBe(false);
  });

  it('falls back to an empty condition track when the document has none', () => {
    const data = dataWith();
    delete (data as { conditionTrack?: Mam3eDataModel['conditionTrack'] }).conditionTrack;

    const state = getMam3eSheetState({ data, archetypes: [], modifierCatalog: [] });

    expect(state.conditionTrack).toEqual(createEmptyMam3eConditionTrack());
  });
});
