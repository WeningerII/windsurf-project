import '@testing-library/jest-dom';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';

vi.mock('../components/GameSystemSelector', () => ({
  GameSystemSelector: ({
    selectedSystem,
    onSelect,
  }: {
    selectedSystem: string | null;
    onSelect: (systemId: 'dnd-5e-2024') => void;
  }) => (
    <div>
      <button
        type="button"
        aria-pressed={selectedSystem === 'dnd-5e-2024'}
        onClick={() => onSelect('dnd-5e-2024')}
      >
        D&amp;D 5e (2024)
      </button>
    </div>
  ),
}));

vi.mock('../components/SystemStatusDashboard', () => ({
  SystemStatusDashboard: () => null,
}));

vi.mock('../utils/systemCatalog', () => ({
  loadAllSystemCatalogSummaries: () => Promise.resolve({}),
}));

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
});
