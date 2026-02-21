import '@testing-library/jest-dom';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';

type CreationOptions = {
  name: string;
  level?: number;
  classId?: string;
  speciesId?: string;
};

function getStoredDocuments(): Array<Record<string, unknown>> {
  const raw = localStorage.getItem('rpg-documents-v2');
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { documents?: Array<Record<string, unknown>> };
  return parsed.documents || [];
}

async function selectSystem(user: ReturnType<typeof userEvent.setup>, systemName: string) {
  const escaped = systemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await user.click(screen.getByRole('button', { name: new RegExp(escaped, 'i') }));
}

async function startCreation(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /create new character/i }));
  expect(await screen.findByDisplayValue('New Character')).toBeInTheDocument();
}

async function createCharacter(
  {
    name,
    level = 1,
  }: CreationOptions
) {
  fireEvent.change(screen.getByTitle('Character name'), {
    target: { value: name },
  });
  fireEvent.change(screen.getByTitle('Character Level'), {
    target: { value: level },
  });

  await waitFor(() => {
    expect(screen.getByTitle('Character name')).toHaveValue(name);
    expect(screen.getByTitle('Character Level')).toHaveValue(level);
  });
}

async function createCharacterWithoutSelections({
  name,
  level = 1,
}: Pick<CreationOptions, 'name' | 'level'>) {
  fireEvent.change(screen.getByTitle('Character name'), {
    target: { value: name },
  });
  fireEvent.change(screen.getByTitle('Character Level'), {
    target: { value: level },
  });

  await waitFor(() => {
    expect(screen.getByTitle('Character name')).toHaveValue(name);
  });
}

describe('Character Creation Flow', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a D&D 5e-2024 fighter and lands on the character sheet', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter({ name: 'Phase3 Hero', level: 3 });

    expect(screen.getByTitle('Character name')).toHaveValue('Phase3 Hero');
    expect(screen.getByTitle('Character Level')).toHaveValue(3);
  });

  it('persists class/species/system in localStorage after creation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter({ name: 'Persisted Build', level: 4 });

    await waitFor(() => {
      const stored = getStoredDocuments();
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Persisted Build');
      expect(stored[0].systemId).toBe('dnd-5e-2024');
      const system = stored[0].system as {
        level?: number;
      };
      expect(system.level).toBe(4);
    });
  });

  it('returns to selector when user goes back from sheet', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await user.click(screen.getByRole('button', { name: /^back$/i }));

    expect(screen.getByText('Choose a Game System')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create new character/i })).toBeInTheDocument();
  });

  it('navigates back to list and can reopen the created character', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacter({ name: 'Reopen Hero' });

    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(screen.getByText('Your Characters')).toBeInTheDocument();
    expect(screen.getByText('Reopen Hero')).toBeInTheDocument();

    await user.click(screen.getByText('Reopen Hero'));
    expect(await screen.findByDisplayValue('Reopen Hero')).toBeInTheDocument();
  });

  it('creates a character even when class/species are skipped', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'D&D 5e (2024)');
    await startCreation(user);
    await createCharacterWithoutSelections({ name: 'No Selection Hero' });

    await waitFor(() => {
      const stored = getStoredDocuments();
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('No Selection Hero');
      const system = stored[0].system as {
        classLevels?: unknown[];
        speciesId?: string;
      };
      expect(system.classLevels).toEqual([]);
    });
  });
});
