import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LevelUpDialog } from '../components/LevelUpDialog';
import type { Character } from '../types/game-systems';
import { GAME_RULES } from '../constants/game-rules';

// Mock dataLoader to avoid actual async imports
vi.mock('../utils/dataLoader', () => ({
  loadClassesForSystem: vi.fn().mockResolvedValue([
    {
      id: 'fighter',
      name: 'Fighter',
      system: 'dnd-5e-2014',
      source: 'SRD 5.1',
      hitDie: 'd10',
      primaryAbility: ['str'],
      savingThrowProficiencies: ['str', 'con'],
      armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
      weaponProficiencies: ['simple', 'martial'],
      toolProficiencies: [],
      skillProficiencies: { choose: 2, from: ['athletics', 'acrobatics'] },
      equipmentChoices: [],
      features: [],
      subclassLevel: 3,
      subclasses: [],
      description: 'A master of martial combat',
    },
    {
      id: 'wizard',
      name: 'Wizard',
      system: 'dnd-5e-2014',
      source: 'SRD 5.1',
      hitDie: 'd6',
      primaryAbility: ['int'],
      savingThrowProficiencies: ['int', 'wis'],
      armorProficiencies: [],
      weaponProficiencies: ['dagger', 'quarterstaff'],
      toolProficiencies: [],
      skillProficiencies: { choose: 2, from: ['arcana', 'history'] },
      equipmentChoices: [],
      features: [],
      subclassLevel: 2,
      subclasses: [],
      description: 'A scholarly magic-user',
    },
  ]),
}));

const baseCharacter: Character = {
  id: 'test-1',
  name: 'Test Hero',
  system: 'dnd-5e-2014',
  level: 1,
  experiencePoints: 0,
  speciesId: 'human',
  classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }],
  backgroundId: undefined,
  alignmentId: undefined,
  baseAttributes: {
    str: 16,
    dex: 14,
    con: 14,
    int: 10,
    wis: 12,
    cha: 8,
  },
  skillProficiencies: {},
  skillRanks: {},
  hitPoints: { current: 12, max: 12, temp: 0 },
  hitDice: [{ die: 'd10', total: 1, remaining: 1 }],
  armorClass: 12,
  initiative: 2,
  speed: 30,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: ['str', 'con'],
  features: [],
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
  createdAt: new Date('2026-02-10T00:00:00.000Z'),
  updatedAt: new Date('2026-02-10T00:00:00.000Z'),
};

describe('LevelUpDialog', () => {
  let onLevelUp: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onLevelUp = vi.fn();
    onClose = vi.fn();
  });

  it('renders loading state initially then shows class selection', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    expect(screen.getByText('Loading classes...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Level Up to 2')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Select class to level up')).toBeInTheDocument();
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
  });

  it('shows max level message when character is at max level', () => {
    const maxLevelChar = { ...baseCharacter, level: GAME_RULES.MAX_CHARACTER_LEVEL };
    render(
      <LevelUpDialog character={maxLevelChar} onLevelUp={onLevelUp} onClose={onClose} />
    );

    expect(screen.getByText('Maximum Level Reached')).toBeInTheDocument();
    expect(screen.getByText(/already at level/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking the backdrop overlay', async () => {
    const { container } = render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Level Up to 2')).toBeInTheDocument();
    });

    // Click the backdrop (outermost div)
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside the dialog', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Level Up to 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Summary'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when Cancel is clicked', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onLevelUp with updated character when Level Up is clicked', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Level Up')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Level Up'));
    expect(onLevelUp).toHaveBeenCalledTimes(1);

    const updated = onLevelUp.mock.calls[0][0] as Character;
    expect(updated.level).toBe(2);
    expect(updated.hitPoints.max).toBeGreaterThan(baseCharacter.hitPoints.max);
  });

  it('allows selecting different HP methods', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Max/)).toBeInTheDocument();
    });

    // Click Max method
    fireEvent.click(screen.getByText(/Max/));
    fireEvent.click(screen.getByText('Level Up'));
    const maxResult = onLevelUp.mock.calls[0][0] as Character;
    // Max for fighter d10 + CON mod 2 = 12 more HP
    expect(maxResult.hitPoints.max).toBe(baseCharacter.hitPoints.max + 12);
  });

  it('shows multiclass indicator when different class is selected', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Select class to level up')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Select class to level up'), {
      target: { value: 'wizard' },
    });

    expect(screen.getByText(/Multiclassing into/)).toBeInTheDocument();
  });

  it('shows Roll option with dice icon', async () => {
    render(
      <LevelUpDialog character={baseCharacter} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Roll')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Roll'));
    expect(screen.getByText(/varies/)).toBeInTheDocument();
  });

  it('handles character with no classLevels gracefully', async () => {
    const noClassChar = { ...baseCharacter, classLevels: [] };
    render(
      <LevelUpDialog character={noClassChar} onLevelUp={onLevelUp} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Level Up to 2')).toBeInTheDocument();
    });
  });
});
