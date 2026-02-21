import '@testing-library/jest-dom';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import type { Character } from '../types/game-systems';

function setLegacyCharacters(characters: Character[]) {
  localStorage.setItem(
    'rpg-characters',
    JSON.stringify({
      version: '1.0',
      characters: characters.map(char => ({
        ...char,
        createdAt: char.createdAt.toISOString(),
        updatedAt: char.updatedAt.toISOString(),
      })),
      lastModified: new Date('2026-02-18T00:00:00.000Z').toISOString(),
    })
  );
}

const legacyBaseCharacter: Character = {
  id: 'legacy-app-char-1',
  name: 'Legacy App Hero',
  system: 'dnd-5e-2014',
  level: 2,
  experiencePoints: 350,
  classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [8, 6] }],
  baseAttributes: { str: 14, dex: 12, con: 13, int: 10, wis: 10, cha: 8 },
  skillProficiencies: {},
  hitPoints: { current: 18, max: 18, temp: 0 },
  hitDice: [{ die: 'd10', total: 2, remaining: 2 }],
  armorClass: 15,
  initiative: 1,
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
  currency: { copper: 0, silver: 0, electrum: 0, gold: 10, platinum: 0 },
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
};

describe('App', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the application header', () => {
    render(<App />);
    expect(screen.getByText('RPG Character Sheet')).toBeInTheDocument();
    expect(screen.getByText('Multi-system tabletop character manager')).toBeInTheDocument();
  });

  it('displays system selector on initial load', () => {
    render(<App />);
    expect(screen.getByText('Choose a Game System')).toBeInTheDocument();
  });

  it('shows create character button when system is selected', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
    expect(screen.getByText('Create New Character')).toBeInTheDocument();
  });

  it('persists documents to v2 localStorage', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
    fireEvent.click(screen.getByRole('button', { name: /create new character/i }));

    expect(await screen.findByDisplayValue('New Character')).toBeInTheDocument();
    fireEvent.change(screen.getByTitle('Character name'), {
      target: { value: 'New Character' },
    });

    await waitFor(() => {
      const savedData = localStorage.getItem('rpg-documents-v2');
      expect(savedData).toBeTruthy();

      const stored = JSON.parse(savedData as string) as {
        documents?: Array<{ name?: string; systemId?: string }>;
      };
      expect(Array.isArray(stored.documents)).toBe(true);
      expect(stored.documents?.length).toBe(1);
      expect(stored.documents?.[0].name).toBe('New Character');
      expect(stored.documents?.[0].systemId).toBe('dnd-5e-2024');
    });
  });

  it('migrates legacy storage into V2 documents on mount', async () => {
    setLegacyCharacters([legacyBaseCharacter]);

    render(<App />);
    expect(await screen.findByText('Your Characters')).toBeInTheDocument();
    expect(screen.getByText('Legacy App Hero')).toBeInTheDocument();

    const v2Raw = localStorage.getItem('rpg-documents-v2');
    expect(v2Raw).toBeTruthy();

    const stored = JSON.parse(v2Raw as string) as {
      documents?: Array<{ id?: string; name?: string; systemId?: string }>;
    };
    expect(stored.documents).toHaveLength(1);
    expect(stored.documents?.[0]?.id).toBe('legacy-app-char-1');
    expect(stored.documents?.[0]?.name).toBe('Legacy App Hero');
    expect(stored.documents?.[0]?.systemId).toBe('dnd-5e-2014');
  });

  it('does not duplicate migrated records across remounts', async () => {
    setLegacyCharacters([legacyBaseCharacter]);

    const { unmount } = render(<App />);
    expect(await screen.findByText('Legacy App Hero')).toBeInTheDocument();
    unmount();

    render(<App />);
    expect(await screen.findByText('Legacy App Hero')).toBeInTheDocument();

    const v2Raw = localStorage.getItem('rpg-documents-v2');
    const stored = JSON.parse(v2Raw as string) as {
      documents?: Array<{ id?: string }>;
    };
    expect(stored.documents).toHaveLength(1);
    expect(stored.documents?.[0]?.id).toBe('legacy-app-char-1');
  });
});
