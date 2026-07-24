import '@testing-library/jest-dom';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';

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

// The real SceneManager is the heaviest chunk in the app and irrelevant to
// shortcut dispatch — a marker div is enough to observe the surface switch
// and the keepalive wrapper around it.
vi.mock('../components/SceneManager', () => ({
  SceneManager: () => <div data-testid="scene-canvas" />,
}));

/** Nearest keepalive wrapper (App.tsx sets aria-hidden off the Scene surface). */
function sceneCanvasWrapper(): HTMLElement {
  const wrapper = screen.getByTestId('scene-canvas').closest('[aria-hidden]');
  expect(wrapper).not.toBeNull();
  return wrapper as HTMLElement;
}

describe('App surface shortcuts (Alt+1/2/3)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('Alt+3 switches to the Scene surface unguarded; Alt+1 returns to the Library', async () => {
    render(<App />);
    expect(await screen.findByText('No characters yet')).toBeInTheDocument();

    // Alt+3 is deliberately unguarded: the canvas mounts on first visit and
    // shows its empty state when no scene is selected.
    fireEvent.keyDown(document.body, { key: '3', altKey: true });
    await screen.findByTestId('scene-canvas');
    expect(sceneCanvasWrapper()).toHaveAttribute('aria-hidden', 'false');
    // Keepalive: the Library stays mounted but leaves the a11y tree (its
    // SurfaceStage wrapper is aria-hidden), rather than unmounting.
    expect(screen.getByText('No characters yet').closest('[aria-hidden]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );

    // Alt+1 flips back to the Library; the canvas stays mounted (keepalive)
    // but leaves the accessibility tree.
    fireEvent.keyDown(document.body, { key: '1', altKey: true });
    expect(await screen.findByText('No characters yet')).toBeInTheDocument();
    expect(sceneCanvasWrapper()).toHaveAttribute('aria-hidden', 'true');
  });

  it('Alt+2 is a no-op while no sheet has been opened', async () => {
    render(<App />);
    expect(await screen.findByText('No characters yet')).toBeInTheDocument();

    // A bare sheet surface with no document renders nothing, so the guard
    // must keep the shortcut inert until a sheet has been opened.
    fireEvent.keyDown(document.body, { key: '2', altKey: true });
    expect(screen.getByText('No characters yet')).toBeInTheDocument();
  });

  it(
    'Alt+1 leaves an open sheet for the Library and Alt+2 returns to it',
    async () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /new character/i }));
      fireEvent.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
      expect(
        await screen.findByTitle('Character name', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
      ).toBeInTheDocument();

      fireEvent.keyDown(document.body, { key: '1', altKey: true });
      // Keepalive: the open sheet stays mounted (its doc is still set) but its
      // SurfaceStage wrapper goes aria-hidden while the Library is active.
      await waitFor(() => {
        expect(screen.getByTitle('Character name').closest('[aria-hidden]')).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });

      // The sheet doc is still set, so Alt+2 re-shows the same sheet.
      fireEvent.keyDown(document.body, { key: '2', altKey: true });
      expect(
        await screen.findByTitle('Character name', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
      ).toBeInTheDocument();
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it('surface switches emit performance marks and measures', async () => {
    const mark = vi
      .spyOn(performance, 'mark')
      .mockImplementation(() => undefined as unknown as PerformanceMark);
    const measure = vi
      .spyOn(performance, 'measure')
      .mockImplementation(() => undefined as unknown as PerformanceMeasure);

    render(<App />);
    expect(mark).toHaveBeenCalledWith('shell:surface:library');

    fireEvent.keyDown(document.body, { key: '3', altKey: true });
    await screen.findByTestId('scene-canvas');
    expect(mark).toHaveBeenCalledWith('shell:surface:scene');
    expect(measure).toHaveBeenCalledWith(
      'shell:surface-switch:library->scene',
      'shell:surface:library',
      'shell:surface:scene'
    );

    fireEvent.keyDown(document.body, { key: '1', altKey: true });
    await waitFor(() => {
      expect(measure).toHaveBeenCalledWith(
        'shell:surface-switch:scene->library',
        'shell:surface:scene',
        'shell:surface:library'
      );
    });
  });
});
