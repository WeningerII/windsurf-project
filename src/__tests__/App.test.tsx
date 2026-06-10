import '@testing-library/jest-dom';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import { PWA_INSTALL_DISMISSED_STORAGE_KEY } from '../hooks/usePwaInstallPrompt';
import { getPendingSyncCount } from '../utils/syncStatus';

// Wrap the real implementation in a spy so tests can count how often the
// pending-sync queues are re-read (they re-parse full snapshots and must not
// run per keystroke).
vi.mock('../utils/syncStatus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/syncStatus')>();
  return {
    ...actual,
    getPendingSyncCount: vi.fn(actual.getPendingSyncCount),
  };
});

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

  it(
    'ignores Ctrl+Z typed inside an input but undoes the document from outside',
    async () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
      fireEvent.click(screen.getByRole('button', { name: /create new character/i }));

      const nameInput = await screen.findByTitle(
        'Character name',
        {},
        { timeout: SHEET_LOAD_TIMEOUT_MS }
      );
      fireEvent.change(nameInput, { target: { value: 'Renamed Hero' } });
      await waitFor(() => {
        expect(screen.getByTitle('Character name')).toHaveValue('Renamed Hero');
      });

      // Ctrl+Z while the text field is focused must stay the native text
      // undo — it must NOT revert the whole document collection.
      nameInput.focus();
      fireEvent.keyDown(nameInput, { key: 'z', ctrlKey: true });
      expect(screen.getByTitle('Character name')).toHaveValue('Renamed Hero');

      // The same shortcut outside an editable element performs the app undo.
      fireEvent.keyDown(document.body, { key: 'z', ctrlKey: true });
      await waitFor(() => {
        expect(screen.getByTitle('Character name')).toHaveValue('New Character');
      });
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it(
    'creates a new character via the Alt+N shortcut',
    async () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
      fireEvent.keyDown(document.body, { key: 'n', altKey: true });

      expect(
        await screen.findByTitle('Character name', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
      ).toHaveValue('New Character');
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it(
    'debounces the pending-sync-count read instead of running it per keystroke',
    async () => {
      const pendingSpy = vi.mocked(getPendingSyncCount);
      render(<App />);

      // Campaign notes update per keystroke, which used to re-read the sync
      // queues on every change.
      fireEvent.click(screen.getByRole('button', { name: /new campaign/i }));
      fireEvent.change(screen.getByPlaceholderText('Campaign name...'), {
        target: { value: 'Debounce Camp' },
      });
      fireEvent.keyDown(screen.getByPlaceholderText('Campaign name...'), { key: 'Enter' });

      const notes = await screen.findByPlaceholderText(
        'Session notes, house rules, quest tracker...'
      );

      const callsBefore = pendingSpy.mock.calls.length;
      for (let i = 1; i <= 10; i += 1) {
        fireEvent.change(notes, { target: { value: 'session '.repeat(i) } });
      }

      // No synchronous per-keystroke reads of the sync queues.
      expect(pendingSpy.mock.calls.length).toBe(callsBefore);

      // A single trailing read fires once the 2 s debounce elapses.
      await waitFor(() => {
        expect(pendingSpy.mock.calls.length).toBeGreaterThan(callsBefore);
      });
      expect(pendingSpy.mock.calls.length - callsBefore).toBeLessThanOrEqual(2);
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
