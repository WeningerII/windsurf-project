import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SurfaceStage } from '../../components/SurfaceStage';
import { ShellProvider } from '../../contexts/ShellContext';
import { useAppNav } from '../../hooks/useAppNav';

/**
 * Phase-2 keepalive contract (build-specs task 8 + the state-preserving
 * Playwright gate's unit-level counterpart): surfaces mount on first visit,
 * then stay in the DOM hidden via visibility:hidden + off-screen transform —
 * never display:none — so transient state and layout survive surface
 * switches. Playwright covers the real SceneManager round-trip end to end;
 * this suite pins the stage mechanism itself.
 */

/** The exact Phase-1 hide mechanism SurfaceStage must carry forward. */
const HIDDEN_CLASSES =
  'invisible absolute inset-x-0 top-0 -translate-x-[200vw] pointer-events-none';

/** Drives the real ShellContext exactly like App's writers do. */
function NavControls() {
  const { openSheet, closeSheet, setSurface } = useAppNav();
  return (
    <div>
      <button onClick={() => setSurface('library')}>go-library</button>
      <button onClick={() => setSurface('scene')}>go-scene</button>
      <button onClick={() => setSurface('sheet')}>go-sheet</button>
      <button onClick={() => openSheet('doc-1')}>open-sheet</button>
      <button onClick={closeSheet}>close-sheet</button>
    </div>
  );
}

/** Mirrors App's slot wiring: the sheet slot is null until a doc is open. */
function Harness() {
  const { nav } = useAppNav();
  return (
    <>
      <NavControls />
      <SurfaceStage
        library={<div>Library body</div>}
        sheet={nav.sheetDocId !== null ? <div>Sheet body</div> : null}
        scene={<div>Scene body</div>}
      />
    </>
  );
}

function renderStage() {
  return render(
    <ShellProvider>
      <Harness />
    </ShellProvider>
  );
}

function surfaceWrapper(surface: string): HTMLElement | null {
  return document.querySelector(`[data-surface="${surface}"]`);
}

describe('SurfaceStage', () => {
  it('mounts only the Library at boot — Sheet and Scene wait for a first visit', () => {
    renderStage();
    const library = surfaceWrapper('library');
    expect(library).not.toBeNull();
    expect(library).toHaveAttribute('aria-hidden', 'false');
    expect(library?.className).toBe('');
    expect(surfaceWrapper('sheet')).toBeNull();
    expect(surfaceWrapper('scene')).toBeNull();
    expect(screen.queryByText('Scene body')).not.toBeInTheDocument();
  });

  it('keepalives a visited Scene: hidden via visibility+off-screen, never unmounted', async () => {
    const user = userEvent.setup();
    renderStage();

    await user.click(screen.getByRole('button', { name: 'go-scene' }));
    expect(surfaceWrapper('scene')).toHaveAttribute('aria-hidden', 'false');
    // The now-hidden Library stays mounted with the exact Phase-1 mechanism.
    const library = surfaceWrapper('library');
    expect(library).toHaveAttribute('aria-hidden', 'true');
    expect(library?.className).toBe(HIDDEN_CLASSES);
    expect(library?.className).not.toContain('hidden'); // no display:none utility
    expect(screen.getByText('Library body')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'go-library' }));
    // Round-trip: the Scene is hidden, NOT unmounted (transient state lives).
    const scene = surfaceWrapper('scene');
    expect(scene).not.toBeNull();
    expect(scene).toHaveAttribute('aria-hidden', 'true');
    expect(scene?.className).toBe(HIDDEN_CLASSES);
    expect(screen.getByText('Scene body')).toBeInTheDocument();
    expect(surfaceWrapper('library')).toHaveAttribute('aria-hidden', 'false');
  });

  it('promotes an open Sheet to a keepalive peer until the document closes', async () => {
    const user = userEvent.setup();
    renderStage();

    await user.click(screen.getByRole('button', { name: 'open-sheet' }));
    expect(surfaceWrapper('sheet')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('Sheet body')).toBeInTheDocument();

    // Switching away hides the sheet but keeps it mounted (Phase 2's change
    // over Phase 1, where leaving the sheet surface unmounted the sheet).
    await user.click(screen.getByRole('button', { name: 'go-library' }));
    const sheet = surfaceWrapper('sheet');
    expect(sheet).toHaveAttribute('aria-hidden', 'true');
    expect(sheet?.className).toBe(HIDDEN_CLASSES);

    // closeSheet clears the open doc -> the slot is null -> fully unmounted.
    await user.click(screen.getByRole('button', { name: 'go-sheet' }));
    await user.click(screen.getByRole('button', { name: 'close-sheet' }));
    expect(surfaceWrapper('sheet')).toBeNull();
    expect(screen.queryByText('Sheet body')).not.toBeInTheDocument();
  });

  it('falls back to the Library when the surface is sheet but no document is open', async () => {
    const user = userEvent.setup();
    renderStage();

    await user.click(screen.getByRole('button', { name: 'go-sheet' }));
    // nav.surface === 'sheet' with a null sheet slot: Library renders active,
    // mirroring the Phase-1 `isSheet && currentDoc` conditional's fallback.
    expect(surfaceWrapper('sheet')).toBeNull();
    expect(surfaceWrapper('library')).toHaveAttribute('aria-hidden', 'false');
  });

  it('keeps all three surfaces alive across a Library -> Sheet -> Scene tour', async () => {
    const user = userEvent.setup();
    renderStage();

    await user.click(screen.getByRole('button', { name: 'open-sheet' }));
    await user.click(screen.getByRole('button', { name: 'go-scene' }));
    await user.click(screen.getByRole('button', { name: 'go-library' }));

    // Every visited surface is mounted; exactly one is visible.
    expect(screen.getByText('Library body')).toBeInTheDocument();
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
    expect(screen.getByText('Scene body')).toBeInTheDocument();
    expect(surfaceWrapper('library')).toHaveAttribute('aria-hidden', 'false');
    expect(surfaceWrapper('sheet')).toHaveAttribute('aria-hidden', 'true');
    expect(surfaceWrapper('scene')).toHaveAttribute('aria-hidden', 'true');
  });
});
