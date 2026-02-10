import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

function getStoredCharacters(): Array<Record<string, unknown>> {
  const raw = localStorage.getItem('rpg-characters');
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { characters?: Array<Record<string, unknown>> };
  return parsed.characters || [];
}

async function selectSystemAndStartCreation(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
  await user.click(screen.getByRole('button', { name: /create new character/i }));
  expect(await screen.findByText('Basic Information')).toBeInTheDocument();
}

async function createCharacter(user: ReturnType<typeof userEvent.setup>, name: string) {
  fireEvent.change(screen.getByPlaceholderText('Enter character name'), {
    target: { value: name },
  });
  for (let i = 0; i < 6; i += 1) {
    await user.click(screen.getByRole('button', { name: /next/i }));
  }
  await user.click(screen.getByRole('button', { name: /create character/i }));
  expect(await screen.findByText('Character Information')).toBeInTheDocument();
}

async function returnToList(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^back$/i }));
  expect(await screen.findByText('Choose a Game System')).toBeInTheDocument();
}

describe('Character Management Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('rehydrates saved characters from localStorage on app mount', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Persisted Hero');
    await returnToList(user);

    unmount();
    render(<App />);
    expect(await screen.findByText('Your Characters')).toBeInTheDocument();
    expect(screen.getByText('Persisted Hero')).toBeInTheDocument();
  });

  it('clears all characters when confirmation is accepted', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('confirm', vi.fn(() => true));
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Clearable Hero');
    await returnToList(user);

    await user.click(screen.getByRole('button', { name: /clear all data/i }));

    expect(getStoredCharacters()).toHaveLength(0);
    expect(screen.queryByText('Your Characters')).not.toBeInTheDocument();
  });

  it('does not clear characters when confirmation is rejected', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('confirm', vi.fn(() => false));
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Protected Hero');
    await returnToList(user);

    await user.click(screen.getByRole('button', { name: /clear all data/i }));

    expect(getStoredCharacters()).toHaveLength(1);
    expect(screen.getByText('Protected Hero')).toBeInTheDocument();
  });

  it('deletes the current character from the header action', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Delete Me');

    await user.click(screen.getByTitle('Delete character'));

    expect(await screen.findByText('Choose a Game System')).toBeInTheDocument();
    expect(getStoredCharacters()).toHaveLength(0);
  });

  it('exports then re-imports characters through Data Management', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('confirm', vi.fn(() => true));
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Importable Hero');
    const exported = localStorage.getItem('rpg-characters');
    expect(exported).toBeTruthy();

    await returnToList(user);
    await user.click(screen.getByRole('button', { name: /clear all data/i }));
    expect(getStoredCharacters()).toHaveLength(0);

    const fileInput = screen.getByLabelText('Import character file') as HTMLInputElement;
    const file = new File([exported as string], 'characters.json', {
      type: 'application/json',
    });
    await user.upload(fileInput, file);

    expect(await screen.findByText('Character Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Character Name')).toHaveValue('Importable Hero');
    expect(getStoredCharacters()).toHaveLength(1);
  });
});
