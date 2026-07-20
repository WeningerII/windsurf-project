import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LibraryBestiaryView } from '../../components/LibraryBestiaryView';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { Monster } from '../../types/creatures/monsters';

// The view consumes the shared loader read-only; the mock lets each test decide
// what catalog (or empty result) the selected system returns.
const loadMonstersForSystemMock = vi.hoisted(() => vi.fn());
vi.mock('../../utils/dataLoader', () => ({
  loadMonstersForSystem: loadMonstersForSystemMock,
}));

const goblin: Monster = {
  id: 'goblin',
  name: 'Goblin',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  size: 'small',
  type: 'humanoid',
  alignment: 'neutral evil',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 15,
  hitPoints: { count: 2, die: 'd6', notation: '2d6' },
  speed: { walk: 30 },
  abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
  senses: ['darkvision 60 ft.'],
  languages: ['Common', 'Goblin'],
  specialAbilities: [
    { name: 'Nimble Escape', description: 'Can Disengage or Hide as a bonus action.' },
  ],
  actions: [{ name: 'Scimitar', description: 'Melee weapon attack.' }],
} as Monster;

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

beforeEach(() => {
  loadMonstersForSystemMock.mockReset();
});

describe('LibraryBestiaryView', () => {
  it('loads and renders the monster catalog for the default system', async () => {
    loadMonstersForSystemMock.mockResolvedValue([goblin]);

    render(<LibraryBestiaryView />);

    // The list body is lazy-loaded, so wait for it to resolve.
    expect(await screen.findByText('Showing 1 of 1 monsters')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Goblin' })).toBeInTheDocument();
    expect(loadMonstersForSystemMock).toHaveBeenCalled();
  });

  it('shows the empty state when the loader returns no monsters (not-yet-shipped system)', async () => {
    loadMonstersForSystemMock.mockResolvedValue([]);

    render(<LibraryBestiaryView />);

    expect(
      await screen.findByText(/No monster dataset is currently available/i)
    ).toBeInTheDocument();
    // The catalog body must not render for an empty dataset.
    expect(screen.queryByText(/Showing .* monsters/i)).not.toBeInTheDocument();
  });

  it('offers every monster-bearing system as a peer and reloads on switch', async () => {
    loadMonstersForSystemMock.mockResolvedValue([]);

    render(<LibraryBestiaryView />);
    await screen.findByText(/No monster dataset is currently available/i);

    const selector = screen.getByRole('combobox', { name: /select game system/i });
    // Every registered/known system is selectable — none is privileged.
    const optionValues = Array.from(
      selector.querySelectorAll('option'),
      (option) => (option as HTMLOptionElement).value
    );
    expect(optionValues).toContain('pf2e');
    expect(optionValues.length).toBeGreaterThan(1);

    loadMonstersForSystemMock.mockClear();
    await userEvent.selectOptions(selector, 'pf2e');

    await waitFor(() => {
      expect(loadMonstersForSystemMock).toHaveBeenCalledWith('pf2e');
    });
  });
});
