import '@testing-library/jest-dom';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import { PWA_INSTALL_DISMISSED_STORAGE_KEY } from '../hooks/usePwaInstallPrompt';

const SHEET_LOAD_TIMEOUT_MS = 15000;
const FLOW_TEST_TIMEOUT_MS = 20000;

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

interface MockBeforeInstallPromptEvent extends Event {
  prompt: ReturnType<typeof vi.fn>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

async function dispatchBeforeInstallPrompt(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const prompt = vi.fn().mockResolvedValue(undefined);
  const event = new Event('beforeinstallprompt', {
    cancelable: true,
  }) as MockBeforeInstallPromptEvent;

  Object.defineProperty(event, 'prompt', {
    configurable: true,
    value: prompt,
  });
  Object.defineProperty(event, 'userChoice', {
    configurable: true,
    value: Promise.resolve({ outcome, platform: 'web' }),
  });

  await act(async () => {
    window.dispatchEvent(event);
  });

  return { event, prompt };
}

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

  it(
    'persists documents to v2 localStorage',
    async () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
      fireEvent.click(screen.getByRole('button', { name: /create new character/i }));

      expect(
        await screen.findByTitle('Character name', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
      ).toHaveValue('New Character');
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
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it('persists install prompt dismissal across app mounts', async () => {
    const { unmount } = render(<App />);

    const { event } = await dispatchBeforeInstallPrompt();
    expect(event.defaultPrevented).toBe(true);
    expect(await screen.findByText('Install the app')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Not now/i }));

    await waitFor(() => {
      expect(localStorage.getItem(PWA_INSTALL_DISMISSED_STORAGE_KEY)).toBe('true');
    });
    expect(screen.queryByText('Install the app')).not.toBeInTheDocument();

    unmount();
    render(<App />);

    await dispatchBeforeInstallPrompt();

    expect(screen.queryByText('Install the app')).not.toBeInTheDocument();
  });

  it('opens the install prompt and toasts after appinstalled', async () => {
    render(<App />);

    const { prompt } = await dispatchBeforeInstallPrompt();
    fireEvent.click(await screen.findByRole('button', { name: /Install App/i }));

    await waitFor(() => {
      expect(prompt).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(
      await screen.findByText('App installed for offline-friendly access.')
    ).toBeInTheDocument();
    expect(localStorage.getItem(PWA_INSTALL_DISMISSED_STORAGE_KEY)).toBeNull();
  });
});
