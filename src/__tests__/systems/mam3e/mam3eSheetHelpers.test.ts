import { describe, expect, it } from 'vitest';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';
import type { PowerModifier } from '../../../data/mutants-and-masterminds/3e/modifiers/extras';
import { createDefaultMam3eData } from '../../../systems/mam3e/data-model';
import { getMam3eSheetState } from '../../../systems/mam3e/getMam3eSheetState';
import {
  createEmptyMam3eConditionTrack,
  createEmptyMam3ePower,
} from '../../../systems/mam3e/mam3eSheetShared';

function makeArchetype(id: string, name: string): Mam3eArchetype {
  // Reference-only shape (review H-5): no fabricated hit dice/saves/wealth.
  return {
    id,
    name,
    system: 'mam3e',
    source: "Hero's Handbook",
    features: [],
    description: `${name} archetype`,
  };
}

describe('M&M 3e sheet helpers', () => {
  it('derives pinned archetypes, complication ids, and modifier catalogs from sheet state', () => {
    const data = {
      ...createDefaultMam3eData(),
      powerPoints: {
        total: 40,
        spent: {
          abilities: 10,
          defenses: 8,
          powers: 12,
          advantages: 7,
          skills: 5,
        },
      },
      selectedArchetypeIds: ['mystic-sentinel'],
      complications: [
        {
          id: 'secret-identity',
          name: 'Secret Identity',
          description: 'Keeps a civilian cover.',
        },
        {
          name: 'Motivation',
          description: 'Protect the city.',
        },
      ],
      conditionTrack: undefined as never,
    };
    const archetypes = [
      makeArchetype('mystic-sentinel', 'Mystic Sentinel'),
      makeArchetype('speedster', 'Speedster'),
    ];
    const modifierCatalog: PowerModifier[] = [
      {
        id: 'subtle',
        name: 'Subtle',
        system: 'mam3e',
        source: "Hero's Handbook",
        type: 'extra',
        costPerRank: 1,
        description: 'Your effect is harder to notice.',
        effects: [],
      },
      {
        id: 'activation',
        name: 'Activation',
        system: 'mam3e',
        source: "Hero's Handbook",
        type: 'flaw',
        costPerRank: -1,
        description: 'The effect needs setup before use.',
        effects: [],
      },
      {
        id: 'accurate',
        name: 'Accurate',
        system: 'mam3e',
        source: "Hero's Handbook",
        type: 'extra',
        costPerRank: 1,
        description: 'The effect is more accurate.',
        effects: [],
      },
    ];

    const state = getMam3eSheetState({
      data,
      archetypes,
      modifierCatalog,
    });

    expect(state.conditionTrack).toEqual(createEmptyMam3eConditionTrack());
    expect(state.ppSpent).toBe(42);
    expect(state.ppOver).toBe(true);
    expect(state.pinnedArchetypeIds).toEqual(['mystic-sentinel']);
    expect(state.pinnedArchetypes.map((entry) => entry.id)).toEqual(['mystic-sentinel']);
    expect(state.insertedComplicationIds).toEqual(['secret-identity']);
    expect(state.extraModifiers.map((entry) => entry.id)).toEqual(['accurate', 'subtle']);
    expect(state.flawModifiers.map((entry) => entry.id)).toEqual(['activation']);
    expect(state.modifierById.get('activation')?.name).toBe('Activation');
  });

  it('creates empty custom powers with stable default fields', () => {
    expect(createEmptyMam3ePower('power-1')).toEqual({
      id: 'power-1',
      name: 'New Power',
      system: 'mam3e',
      source: 'Custom',
      type: 'attack',
      action: 'standard',
      range: 'close',
      duration: 'instant',
      baseCost: 1,
      perRank: true,
      rank: 1,
      extras: [],
      flaws: [],
      modifierRanks: {},
      description: '',
      effects: [],
    });
  });

  it('keeps pinned archetype ids stable while only resolving archetypes still present in the catalog', () => {
    const state = getMam3eSheetState({
      data: {
        ...createDefaultMam3eData(),
        selectedArchetypeIds: ['mystic-sentinel', 'missing-archetype', 'speedster'],
      },
      archetypes: [
        makeArchetype('speedster', 'Speedster'),
        makeArchetype('mystic-sentinel', 'Mystic Sentinel'),
      ],
      modifierCatalog: [],
    });

    expect(state.pinnedArchetypeIds).toEqual(['mystic-sentinel', 'missing-archetype', 'speedster']);
    expect(state.pinnedArchetypes.map((entry) => entry.id)).toEqual([
      'speedster',
      'mystic-sentinel',
    ]);
  });
});
