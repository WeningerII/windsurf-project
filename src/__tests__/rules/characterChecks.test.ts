import { describe, it, expect } from 'vitest';

import { characterCheckModifier } from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

/**
 * Sheet-derived check modifiers: a 5e character's actual ability/skill bonus,
 * pulled off its sheet for the conversation and skill-challenge panels.
 */

function hero(
  systemId: CharacterDocument<SystemDataModel>['systemId']
): CharacterDocument<SystemDataModel> {
  return {
    id: 'hero',
    name: 'Hero',
    systemId,
    system: {
      level: 5, // proficiency bonus +3
      baseAttributes: { cha: 16, wis: 14, str: 10 }, // +3 / +2 / +0
      skillProficiencies: {
        persuasion: { level: 'proficient' },
        survival: { level: 'expertise' },
        arcana: { level: 'half' },
      },
    },
  } as unknown as CharacterDocument<SystemDataModel>;
}

describe('characterCheckModifier (D&D 5e)', () => {
  const doc = hero('dnd-5e-2024');

  it('a proficient skill adds the proficiency bonus to the ability modifier', () => {
    expect(characterCheckModifier(doc, 'persuasion', 'dnd-5e-2024')).toBe(6); // +3 CHA +3 prof
  });

  it('expertise doubles proficiency', () => {
    expect(characterCheckModifier(doc, 'survival', 'dnd-5e-2024')).toBe(8); // +2 WIS +6
  });

  it('half proficiency rounds down on the governing ability', () => {
    // Arcana is INT (absent → 10 → +0), half of +3 prof = +1.
    expect(characterCheckModifier(doc, 'arcana', 'dnd-5e-2024')).toBe(1);
  });

  it('a non-proficient skill is just the ability modifier', () => {
    expect(characterCheckModifier(doc, 'deception', 'dnd-5e-2024')).toBe(3); // +3 CHA, no prof
  });

  it('a raw ability check returns the ability modifier', () => {
    expect(characterCheckModifier(doc, 'cha', 'dnd-5e-2024')).toBe(3);
  });

  it('returns undefined for an unknown check id (caller uses a manual modifier)', () => {
    expect(characterCheckModifier(doc, 'underwater-basketweaving', 'dnd-5e-2024')).toBeUndefined();
  });

  it('returns undefined for non-5e systems (pending their sheet math)', () => {
    expect(characterCheckModifier(hero('pf2e'), 'persuasion', 'pf2e')).toBeUndefined();
    expect(characterCheckModifier(hero('daggerheart'), 'cha', 'daggerheart')).toBeUndefined();
  });
});
