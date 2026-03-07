import { describe, expect, it } from 'vitest';
import { applyDnd5eLongRest, applyDnd5eShortRest } from '../utils/dnd5eRest';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';

describe('dnd5e rest helpers', () => {
  it('short rest recovers short-rest features only', () => {
    const state = createDefaultDnd5eData();
    state.features = [
      {
        id: 'action-surge',
        name: 'Action Surge',
        source: 'fighter',
        description: 'test',
        uses: { current: 0, max: 1, recoveryType: 'short-rest' },
      },
      {
        id: 'inspiration',
        name: 'Inspiration',
        source: 'bard',
        description: 'test',
        uses: { current: 0, max: 1, recoveryType: 'long-rest' },
      },
    ];

    const next = applyDnd5eShortRest(state);
    expect(next.features[0].uses?.current).toBe(1);
    expect(next.features[1].uses?.current).toBe(0);
  });

  it('long rest resets hp, spell slots, death saves, and recovers hit dice', () => {
    const state = createDefaultDnd5eData();
    state.hitPoints = { current: 2, max: 18, temp: 4 };
    state.hitDice = [
      { die: 'd10', total: 4, remaining: 1 },
      { die: 'd6', total: 2, remaining: 0 },
    ];
    state.deathSaves = { successes: 2, failures: 2 };
    state.exhaustionLevel = 2;
    state.features = [
      {
        id: 'second-wind',
        name: 'Second Wind',
        source: 'fighter',
        description: 'test',
        uses: { current: 0, max: 1, recoveryType: 'short-rest' },
      },
    ];
    state.spellcasting = {
      classes: [],
      spellsKnown: [],
      spellsPrepared: [],
      spellSlots: {
        1: { max: 4, used: 2 },
        2: { max: 2, used: 1 },
        3: { max: 0, used: 0 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
      },
    };

    const next = applyDnd5eLongRest(state);
    expect(next.hitPoints).toEqual({ current: 18, max: 18, temp: 0 });
    expect(next.spellcasting?.spellSlots[1].used).toBe(0);
    expect(next.spellcasting?.spellSlots[2].used).toBe(0);
    expect(next.deathSaves).toEqual({ successes: 0, failures: 0 });
    expect(next.exhaustionLevel).toBe(1);
    expect(next.hitDice[0].remaining).toBe(4);
    expect(next.hitDice[1].remaining).toBe(0);
  });

  it('long rest also recovers long-rest features and stops when all hit dice are already full', () => {
    const state = createDefaultDnd5eData();
    state.hitDice = [{ die: 'd8', total: 2, remaining: 2 }];
    state.features = [
      {
        id: 'arcane-recovery',
        name: 'Arcane Recovery',
        source: 'wizard',
        description: 'test',
        uses: { current: 0, max: 1, recoveryType: 'long-rest' },
      },
    ];

    const next = applyDnd5eLongRest(state);

    expect(next.features[0].uses?.current).toBe(1);
    expect(next.hitDice).toEqual([{ die: 'd8', total: 2, remaining: 2 }]);
  });

  it('handles empty hit dice, missing spellcasting, and passive features during long rests', () => {
    const state = createDefaultDnd5eData();
    state.features = [
      {
        id: 'darkvision',
        name: 'Darkvision',
        source: 'species',
        description: 'Always on.',
      },
    ];

    const next = applyDnd5eLongRest(state);

    expect(next.hitDice).toEqual([]);
    expect(next.spellcasting).toBeUndefined();
    expect(next.features).toEqual(state.features);
    expect(next.exhaustionLevel).toBe(0);
  });
});
