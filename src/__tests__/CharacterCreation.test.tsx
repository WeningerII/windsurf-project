import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterCreation } from '../components/CharacterCreation';
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { GameSystemId } from '../types/game-systems';
import { loadClassesForSystem, loadSpeciesForSystem } from '../utils/dataLoader';

vi.mock('../utils/dataLoader', () => ({
  loadClassesForSystem: vi.fn(),
  loadSpeciesForSystem: vi.fn(),
}));

vi.mock('../utils/browserCompat', () => ({
  generateUUID: vi.fn(() => 'test-uuid'),
}));

const mockedLoadClassesForSystem = vi.mocked(loadClassesForSystem);
const mockedLoadSpeciesForSystem = vi.mocked(loadSpeciesForSystem);

const mockClasses: CharacterClass[] = [
  {
    id: 'fighter',
    name: 'Fighter',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    hitDie: 'd10',
  } as CharacterClass,
];

const mockSpecies: Species[] = [
  {
    id: 'human',
    name: 'Human',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    size: 'medium',
    speed: 30,
  } as Species,
];

async function advanceToReview(user: ReturnType<typeof userEvent.setup>) {
  for (let i = 0; i < 6; i += 1) {
    await user.click(screen.getByRole('button', { name: /next/i }));
  }
  expect(screen.getByText('Review Character')).toBeInTheDocument();
}

describe('CharacterCreation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedLoadClassesForSystem.mockImplementation(
      () => new Promise(() => {})
    );
    mockedLoadSpeciesForSystem.mockImplementation(
      () => new Promise(() => {})
    );
  });

  it('renders the initial step with progress', () => {
    render(
      <CharacterCreation
        systemId="dnd-5e-2014"
        onComplete={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('calls onCancel when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <CharacterCreation
        systemId="dnd-5e-2014"
        onComplete={vi.fn()}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('supports moving forwards and backwards between steps', async () => {
    const user = userEvent.setup();

    render(
      <CharacterCreation
        systemId="dnd-5e-2014"
        onComplete={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Select Class')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
  });

  it('creates a character with selected class and species', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    mockedLoadClassesForSystem.mockResolvedValueOnce(mockClasses);
    mockedLoadSpeciesForSystem.mockResolvedValueOnce(mockSpecies);

    render(
      <CharacterCreation
        systemId="dnd-5e-2014"
        onComplete={onComplete}
        onCancel={vi.fn()}
      />
    );

    await user.type(
      screen.getByPlaceholderText('Enter character name'),
      'Aragorn'
    );
    const levelInput = screen.getByRole('spinbutton');
    fireEvent.change(levelInput, { target: { value: '3' } });
    expect(levelInput).toHaveValue(3);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(await screen.findByRole('button', { name: /fighter/i }));

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(await screen.findByRole('button', { name: /human/i }));

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Review Character')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /create character/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-uuid',
        name: 'Aragorn',
        level: 3,
        speciesId: 'human',
        classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [] }],
        speed: 30,
      })
    );
  });

  it('sanitizes text input and clamps numeric values during creation', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <CharacterCreation
        systemId="dnd-5e-2014"
        onComplete={onComplete}
        onCancel={vi.fn()}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter character name');
    await user.type(nameInput, ' <Alice> ');
    expect(nameInput).toHaveValue('Alice');

    const levelInput = screen.getByRole('spinbutton');
    await user.clear(levelInput);
    await user.type(levelInput, '999');
    expect(levelInput).toHaveValue(20);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    const strengthGroup = screen.getByText('Strength').parentElement;
    expect(strengthGroup).not.toBeNull();
    const strengthInput = within(strengthGroup as HTMLElement).getByRole('spinbutton');
    await user.clear(strengthInput);
    await user.type(strengthInput, '999');
    expect(strengthInput).toHaveValue(30);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /create character/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alice',
        level: 20,
        baseAttributes: expect.objectContaining({ str: 30 }),
      })
    );
  });

  it('shows a load error message and still allows completion', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    mockedLoadClassesForSystem.mockRejectedValueOnce(new Error('load failed'));
    mockedLoadSpeciesForSystem.mockResolvedValueOnce([]);

    render(
      <CharacterCreation
        systemId="dnd-5e-2014"
        onComplete={onComplete}
        onCancel={vi.fn()}
      />
    );

    expect(
      await screen.findByText('Failed to load class/species data. You can still proceed.')
    ).toBeInTheDocument();

    await advanceToReview(user);
    await user.click(screen.getByRole('button', { name: /create character/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        classLevels: [],
        speciesId: undefined,
      })
    );
  });

  it('renders fallback UI for unknown systems', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <CharacterCreation
        systemId={'unknown-system' as GameSystemId}
        onComplete={vi.fn()}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Game system not found.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
