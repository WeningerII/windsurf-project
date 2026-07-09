import '@testing-library/jest-dom';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import { errorLogger } from '../utils/errorLogger';

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

// Simulate the failure mode of a lazy sheet chunk that cannot load (stale
// deploy, flaky offline cache): the renderer throws during render.
vi.mock('../components/SystemSheetRenderer', () => ({
  SystemSheetRenderer: () => {
    throw new Error('Failed to fetch dynamically imported module: sheet chunk');
  },
}));

async function openBrokenSheet() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /new character/i }));
  fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
  expect(await screen.findByText('This character sheet failed to load')).toBeInTheDocument();
}

describe('App sheet error boundary', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
  });

  it('contains a sheet render failure without taking down the app shell', async () => {
    await openBrokenSheet();

    // The header (app shell) survives the sheet crash.
    expect(screen.getByRole('button', { name: /^back$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload sheet/i })).toBeInTheDocument();
    // The root-level "Something went wrong" screen must NOT appear.
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('returns to the character list from the fallback', async () => {
    await openBrokenSheet();

    fireEvent.click(screen.getByRole('button', { name: /back to list/i }));

    expect(screen.getByText('Your Characters')).toBeInTheDocument();
    expect(screen.queryByText('This character sheet failed to load')).not.toBeInTheDocument();
  });

  it('reloads the page from the fallback to recover the failed chunk', async () => {
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
    await openBrokenSheet();

    fireEvent.click(screen.getByRole('button', { name: /reload sheet/i }));

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
