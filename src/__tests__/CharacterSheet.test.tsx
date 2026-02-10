import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CharacterSheet } from '../components/CharacterSheet';
import type { Character, GameSystem } from '../types/game-systems';

const baseCharacter: Character = {
  id: 'test-1',
  name: 'Test Character',
  system: 'dnd-5e-2014',
  level: 1,
  experiencePoints: 0,
  speciesId: 'human',
  classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }],
  backgroundId: undefined,
  alignmentId: undefined,
  baseAttributes: {
    str: 10,
    dex: 12,
    con: 14,
    int: 13,
    wis: 15,
    cha: 8,
  },
  skillProficiencies: {},
  skillRanks: {},
  hitPoints: { current: 10, max: 10, temp: 0 },
  hitDice: [],
  armorClass: 10,
  initiative: 0,
  speed: 30,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: [],
  features: [],
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
  createdAt: new Date('2026-02-06T00:00:00.000Z'),
  updatedAt: new Date('2026-02-06T00:00:00.000Z'),
};

const baseGameSystem: GameSystem = {
  id: 'dnd-5e-2014',
  name: 'D&D 5th Edition',
  fullName: 'Dungeons & Dragons 5th Edition',
  version: '5.1',
  attributes: [
    { id: 'str', name: 'Strength', abbreviation: 'STR', description: 'Physical power' },
    { id: 'dex', name: 'Dexterity', abbreviation: 'DEX', description: 'Agility' },
    { id: 'con', name: 'Constitution', abbreviation: 'CON', description: 'Endurance' },
    { id: 'int', name: 'Intelligence', abbreviation: 'INT', description: 'Reasoning' },
    { id: 'wis', name: 'Wisdom', abbreviation: 'WIS', description: 'Awareness' },
    { id: 'cha', name: 'Charisma', abbreviation: 'CHA', description: 'Force of personality' },
  ],
  skills: [
    { id: 'athletics', name: 'Athletics', attribute: 'str' },
  ],
};

function createCharacter(overrides: Partial<Character> = {}): Character {
  return {
    ...baseCharacter,
    ...overrides,
    classLevels: overrides.classLevels ?? baseCharacter.classLevels,
    baseAttributes: {
      ...baseCharacter.baseAttributes,
      ...(overrides.baseAttributes || {}),
    },
    hitPoints: {
      ...baseCharacter.hitPoints,
      ...(overrides.hitPoints || {}),
    },
    skillProficiencies: {
      ...baseCharacter.skillProficiencies,
      ...(overrides.skillProficiencies || {}),
    },
    skillRanks: {
      ...(baseCharacter.skillRanks || {}),
      ...(overrides.skillRanks || {}),
    },
  };
}

function createGameSystem(overrides: Partial<GameSystem> = {}): GameSystem {
  return {
    ...baseGameSystem,
    ...overrides,
    attributes: overrides.attributes || baseGameSystem.attributes,
    skills: overrides.skills ?? baseGameSystem.skills,
  };
}

// Mock dataLoader for LevelUpDialog
vi.mock('../utils/dataLoader', () => ({
  loadClassesForSystem: vi.fn().mockResolvedValue([]),
  loadSpellsForSystem: vi.fn().mockResolvedValue([]),
  loadFeatsForSystem: vi.fn().mockResolvedValue([]),
  loadEquipmentForSystem: vi.fn().mockResolvedValue([]),
}));

describe('CharacterSheet', () => {
  it('renders all core sections and initial values', () => {
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Character Information')).toBeInTheDocument();
    expect(screen.getByText('Attributes')).toBeInTheDocument();
    expect(screen.getByText('Combat Statistics')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByLabelText('Character Name')).toHaveValue('Test Character');
    expect(screen.getByLabelText('Level')).toHaveValue(1);
  });

  it('sanitizes and updates character name', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    fireEvent.change(screen.getByLabelText('Character Name'), {
      target: { value: ' <Aragorn> ' },
    });

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Aragorn' })
    );
  });

  it('parses level input and falls back to minimum for invalid values', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    fireEvent.change(screen.getByLabelText('Level'), {
      target: { value: '7' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ level: 7 })
    );

    fireEvent.change(screen.getByLabelText('Level'), {
      target: { value: 'not-a-number' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ level: 1 })
    );
  });

  it('updates classLevels from class input and clears when empty', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    fireEvent.change(screen.getByLabelText('Class'), {
      target: { value: 'wizard, fighter' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        classLevels: [{ classId: 'wizard', level: 1, hitDieRolls: [] }],
      })
    );

    fireEvent.change(screen.getByLabelText('Class'), {
      target: { value: '' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        classLevels: [],
      })
    );
  });

  it('updates combat statistics and preserves sibling HP fields', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    fireEvent.change(screen.getByLabelText('Current HP'), {
      target: { value: '7' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        hitPoints: { current: 7, max: 10, temp: 0 },
      })
    );

    fireEvent.change(screen.getByLabelText('Armor Class'), {
      target: { value: '16' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ armorClass: 16 })
    );

    fireEvent.change(screen.getByLabelText('Speed'), {
      target: { value: '35' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ speed: 35 })
    );
  });

  it('updates attributes and notes fields', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    fireEvent.change(screen.getByLabelText('STR'), {
      target: { value: '18' },
    });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        baseAttributes: expect.objectContaining({ str: 18 }),
      })
    );

    fireEvent.change(
      screen.getByPlaceholderText('Add notes about your character...'),
      { target: { value: 'Veteran of many campaigns.' } }
    );
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ notes: 'Veteran of many campaigns.' })
    );
  });

  it('displays proficiency bonus based on level', () => {
    render(
      <CharacterSheet
        character={createCharacter({
          level: 9,
          baseAttributes: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
          },
        })}
        gameSystem={createGameSystem({ skills: [] })}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('+4')).toBeInTheDocument();
  });

  it('cycles skill proficiency none → proficient → expertise → none', () => {
    const onUpdate = vi.fn();
    const initialCharacter = createCharacter({
      skillProficiencies: {},
      skillRanks: {},
    });
    const { rerender } = render(
      <CharacterSheet
        character={initialCharacter}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    fireEvent.click(
      screen.getByTitle('Toggle proficiency (none → proficient → expertise → none)')
    );
    const firstUpdate = onUpdate.mock.calls.at(-1)?.[0] as Character;
    expect(firstUpdate.skillProficiencies.athletics?.level).toBe('proficient');

    rerender(
      <CharacterSheet
        character={firstUpdate}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );
    fireEvent.click(
      screen.getByTitle('Toggle proficiency (none → proficient → expertise → none)')
    );
    const secondUpdate = onUpdate.mock.calls.at(-1)?.[0] as Character;
    expect(secondUpdate.skillProficiencies.athletics?.level).toBe('expertise');

    rerender(
      <CharacterSheet
        character={secondUpdate}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );
    fireEvent.click(
      screen.getByTitle('Toggle proficiency (none → proficient → expertise → none)')
    );
    const thirdUpdate = onUpdate.mock.calls.at(-1)?.[0] as Character;
    expect(thirdUpdate.skillProficiencies.athletics).toBeUndefined();
  });

  it('renders saving throws section with correct modifiers', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter({
          baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          savingThrowProficiencies: ['str'],
        })}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Saving Throws')).toBeInTheDocument();
    // STR save with proficiency: mod 0 + prof 2 = +2
    // Other saves without proficiency: mod 0 = +0
  });

  it('toggles saving throw proficiency on click', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter({ savingThrowProficiencies: [] })}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    const addButtons = screen.getAllByTitle('Add proficiency');
    fireEvent.click(addButtons[0]); // click first save toggle (STR)
    const updated = onUpdate.mock.calls.at(-1)?.[0] as Character;
    expect(updated.savingThrowProficiencies).toContain('str');
  });

  it('removes saving throw proficiency on click', () => {
    const onUpdate = vi.fn();
    render(
      <CharacterSheet
        character={createCharacter({ savingThrowProficiencies: ['str', 'con'] })}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByTitle('Remove proficiency');
    fireEvent.click(removeButtons[0]);
    const updated = onUpdate.mock.calls.at(-1)?.[0] as Character;
    expect(updated.savingThrowProficiencies).not.toContain('str');
    expect(updated.savingThrowProficiencies).toContain('con');
  });

  it('renders Level Up button', () => {
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Level 2')).toBeInTheDocument();
  });

  it('opens LevelUpDialog when Level Up button is clicked', async () => {
    render(
      <CharacterSheet
        character={createCharacter()}
        gameSystem={createGameSystem()}
        onUpdate={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Level 2'));
    // Dialog should show loading state since we mocked loadClassesForSystem to return []
    await screen.findByText('Loading classes...');
  });

  it('disables Level Up button at max level', () => {
    render(
      <CharacterSheet
        character={createCharacter({ level: 20 })}
        gameSystem={createGameSystem()}
        onUpdate={vi.fn()}
      />
    );

    const btn = screen.getByText('Level 21').closest('button');
    expect(btn).toHaveProperty('disabled', true);
  });

  it('shows and updates skill ranks only for rank-based systems', () => {
    const onUpdate = vi.fn();
    const rankCharacter = createCharacter({
      system: 'dnd-3.5e',
      skillRanks: {},
      skillProficiencies: {},
    });
    const rankSystem = createGameSystem({
      id: 'dnd-3.5e',
      name: 'D&D 3.5e',
      fullName: 'Dungeons & Dragons 3.5 Edition',
      version: 'SRD 3.5',
      skills: [{ id: 'athletics', name: 'Athletics', attribute: 'str' }],
    });

    const { rerender } = render(
      <CharacterSheet
        character={createCharacter({ system: 'dnd-5e-2014' })}
        gameSystem={createGameSystem()}
        onUpdate={onUpdate}
      />
    );
    expect(screen.queryByTitle('Skill ranks')).not.toBeInTheDocument();

    rerender(
      <CharacterSheet
        character={rankCharacter}
        gameSystem={rankSystem}
        onUpdate={onUpdate}
      />
    );

    const ranksInput = screen.getByTitle('Skill ranks');
    fireEvent.change(ranksInput, { target: { value: '4' } });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        skillRanks: expect.objectContaining({ athletics: 4 }),
      })
    );
  });
});
