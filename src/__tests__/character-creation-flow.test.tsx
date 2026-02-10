import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

type CreationOptions = {
  name: string;
  level?: string;
  selectClass?: boolean;
  selectSpecies?: boolean;
};

function getStoredCharacters(): Array<Record<string, unknown>> {
  const raw = localStorage.getItem('rpg-characters');
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { characters?: Array<Record<string, unknown>> };
  return parsed.characters || [];
}

async function selectSystem(user: ReturnType<typeof userEvent.setup>, systemName: string) {
  const escaped = systemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await user.click(screen.getByRole('button', { name: new RegExp(escaped, 'i') }));
}

async function startCreation(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /create new character/i }));
  expect(await screen.findByText('Basic Information')).toBeInTheDocument();
}

async function clickNext(user: ReturnType<typeof userEvent.setup>, count = 1) {
  for (let i = 0; i < count; i += 1) {
    await user.click(screen.getByRole('button', { name: /next/i }));
  }
}

async function createCharacter(
  user: ReturnType<typeof userEvent.setup>,
  {
    name,
    level = '1',
    selectClass = true,
    selectSpecies = true,
  }: CreationOptions
) {
  fireEvent.change(screen.getByPlaceholderText('Enter character name'), {
    target: { value: name },
  });
  fireEvent.change(screen.getByRole('spinbutton'), {
    target: { value: level },
  });

  await clickNext(user); // class step
  if (selectClass) {
    await user.click(
      await screen.findByRole('button', { name: /fighter/i }, { timeout: 5000 })
    );
  }

  await clickNext(user); // species step
  if (selectSpecies) {
    await user.click(
      await screen.findByRole('button', { name: /human/i }, { timeout: 5000 })
    );
  }

  await clickNext(user, 4); // ability -> skills -> equipment -> review
  await user.click(screen.getByRole('button', { name: /create character/i }));
  expect(await screen.findByText('Character Information')).toBeInTheDocument();
}

describe('Character Creation Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a D&D 5e-2024 fighter and lands on the character sheet', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter(user, { name: 'Phase3 Hero', level: '3' });

    expect(screen.getByLabelText('Character Name')).toHaveValue('Phase3 Hero');
    expect(screen.getByLabelText('Class')).toHaveValue('fighter');
    expect(screen.getByLabelText('Species/Race')).toHaveValue('human');
    expect(screen.getByLabelText('Level')).toHaveValue(3);
  });

  it('persists class/species/system in localStorage after creation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter(user, { name: 'Persisted Build', level: '4' });

    const stored = getStoredCharacters();
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Persisted Build');
    expect(stored[0].system).toBe('dnd-5e-2024');
    expect(stored[0].speciesId).toBe('human');
    expect((stored[0].classLevels as Array<{ classId: string }>)[0].classId).toBe('fighter');
  });

  it('returns to selector when creation is canceled', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await user.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(screen.getByText('Choose a Game System')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create new character/i })).toBeInTheDocument();
  });

  it('navigates back to list and can reopen the created character', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter(user, { name: 'Reopen Hero' });

    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(screen.getByText('Your Characters')).toBeInTheDocument();
    expect(screen.getByText('Reopen Hero')).toBeInTheDocument();

    await user.click(screen.getByText('Reopen Hero'));
    expect(await screen.findByText('Character Information')).toBeInTheDocument();
  });

  it('creates a character even when class/species are skipped', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter(user, {
      name: 'No Selection Hero',
      selectClass: false,
      selectSpecies: false,
    });

    const stored = getStoredCharacters();
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('No Selection Hero');
    expect(stored[0].classLevels).toEqual([]);
    expect(stored[0].speciesId).toBeUndefined();
  });
});
