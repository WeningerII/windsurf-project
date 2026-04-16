import { describe, expect, it } from 'vitest';
import { pf2eBackgrounds } from '../../../data/pathfinder/2e/backgrounds';
import { human } from '../../../data/pathfinder/2e/ancestries/human';
import type { Archetype } from '../../../types/character-options/archetypes';
import { createDefaultPf2eData } from '../../../systems/pf2e/data-model';
import { getPf2eSheetChoiceState } from '../../../systems/pf2e/getPf2eSheetChoiceState';
import {
  countTrainedPf2eSkills,
  longRestPf2eSpellcasting,
  nextPf2eTier,
  shortRestPf2eSpellcasting,
} from '../../../systems/pf2e/pf2eSheetShared';

describe('PF2e sheet helpers', () => {
  it('cycles proficiency tiers in order and wraps back to untrained', () => {
    expect(nextPf2eTier('untrained')).toBe('trained');
    expect(nextPf2eTier('trained')).toBe('expert');
    expect(nextPf2eTier('expert')).toBe('master');
    expect(nextPf2eTier('master')).toBe('legendary');
    expect(nextPf2eTier('legendary')).toBe('untrained');
  });

  it('counts only trained-or-better skill proficiencies', () => {
    expect(
      countTrainedPf2eSkills({
        arcana: { tier: 'trained', total: 3 },
        stealth: { tier: 'expert', total: 5 },
        athletics: { tier: 'untrained', total: 0 },
      })
    ).toBe(2);
  });

  it('recovers PF2e spellcasting resources correctly on short and long rest', () => {
    const spellcasting = {
      tradition: 'arcane' as const,
      type: 'prepared' as const,
      proficiency: { tier: 'trained' as const, total: 3 },
      spellSlots: {
        1: { max: 2, used: 2 },
        2: { max: 1, used: 1 },
      },
      spellsKnown: ['magic-missile'],
      preparedSpellsByRank: { 1: ['magic-missile'] },
      focusPoints: { current: 0, max: 2 },
    };

    expect(shortRestPf2eSpellcasting(spellcasting)?.focusPoints).toEqual({
      current: 1,
      max: 2,
    });
    expect(shortRestPf2eSpellcasting(spellcasting)?.spellSlots).toEqual(spellcasting.spellSlots);

    expect(longRestPf2eSpellcasting(spellcasting)).toEqual({
      ...spellcasting,
      spellSlots: {
        1: { max: 2, used: 0 },
        2: { max: 1, used: 0 },
      },
      focusPoints: { current: 2, max: 2 },
    });
  });

  it('derives ancestry/background choice state and archetype ordering from PF2e sheet data', () => {
    const scholar = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-scholar');

    if (!scholar) {
      throw new Error('Expected Scholar background to exist.');
    }

    const archetypes: Archetype[] = [
      {
        id: 'acrobat-dedication',
        name: 'Acrobat Dedication',
        system: 'pf2e',
        source: 'Core Rulebook',
        parentClassId: 'fighter',
        description: 'A mobile combatant.',
        features: [],
      },
      {
        id: 'wizard-dedication',
        name: 'Wizard Dedication',
        system: 'pf2e',
        source: 'Core Rulebook',
        parentClassId: 'wizard',
        description: 'A spellcasting archetype.',
        features: [],
      },
    ];
    const data = {
      ...createDefaultPf2eData(),
      classId: 'wizard',
      keyAbility: 'int',
      baseAttributes: { str: 10, dex: 14, con: 12, int: 18, wis: 16, cha: 8 },
      loreProficiencies: {
        'academia-lore': { tier: 'trained' as const, total: 3 },
      },
      ancestryAbilityBoostSelections: ['dex', 'wis'],
      backgroundAbilityBoostSelections: ['int', 'dex'],
    };

    const state = getPf2eSheetChoiceState({
      data,
      archetypes,
      selectedArchetypeIds: ['wizard-dedication'],
      selectedAncestry: human,
      selectedBackground: scholar,
    });

    expect(state.heritageOptions).toHaveLength(human.subraces?.length ?? 0);
    expect(state.classDcScore).toBe(18);
    expect(state.loreIds).toEqual(['academia-lore']);
    expect(state.selectedArchetypes.map((entry) => entry.id)).toEqual(['wizard-dedication']);
    expect(state.orderedArchetypes.map((entry) => entry.id)).toEqual([
      'wizard-dedication',
      'acrobat-dedication',
    ]);

    expect(state.ancestryChoiceSlots).toHaveLength(2);
    expect(state.ancestryChoiceSlots[0]).toMatchObject({
      slotIndex: 0,
      value: 'dex',
    });
    expect(state.ancestryChoiceSlots[0].options).toContain('dex');
    expect(state.ancestryChoiceSlots[0].options).not.toContain('wis');
    expect(state.ancestryChoiceSlots[1]).toMatchObject({
      slotIndex: 1,
      value: 'wis',
    });
    expect(state.ancestryChoiceSlots[1].options).toContain('wis');
    expect(state.ancestryChoiceSlots[1].options).not.toContain('dex');

    expect(state.backgroundRestrictedBoost).toBe('int');
    expect(state.backgroundFreeBoost).toBe('dex');
    expect(state.backgroundFreeBoostOptions).toContain('dex');
    expect(state.backgroundFreeBoostOptions).toContain('wis');
    expect(state.backgroundFreeBoostOptions).not.toContain('int');
    expect(state.backgroundSkillChoice?.label).toBe('Arcana, Nature, Occultism, or Religion');
    expect(state.backgroundLoreChoice).toBeUndefined();
  });
});
