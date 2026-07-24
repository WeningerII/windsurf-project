import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import {
  useAppNav,
  INITIAL_NAV_STATE,
  LIBRARY_SEGMENTS,
  librarySegmentLabel,
  surfaceLabel,
} from '../../hooks/useAppNav';
import { ShellProvider } from '../../contexts/ShellContext';

// Phase 2: the hook is a thin consumer of ShellContext, so every renderHook
// mounts under the provider. The assertions below are unchanged from Phase 1
// — the point of the swap is that the hook's public behavior is identical.
function wrapper({ children }: { children: ReactNode }) {
  return createElement(ShellProvider, null, children);
}

function renderNav() {
  return renderHook(() => useAppNav(), { wrapper });
}

describe('useAppNav', () => {
  it('throws a loud error when mounted without a ShellProvider', () => {
    expect(() => renderHook(() => useAppNav())).toThrowError(/ShellProvider/);
  });
  it('starts on the Library/Characters surface with nothing open', () => {
    const { result } = renderNav();
    expect(result.current.nav).toEqual(INITIAL_NAV_STATE);
    expect(result.current.nav).toEqual({
      surface: 'library',
      librarySegment: 'characters',
      sheetDocId: null,
      sceneId: null,
      overlay: null,
    });
  });

  it('openSheet is compound: sets the doc AND switches to the sheet surface', () => {
    const { result } = renderNav();
    act(() => result.current.setLibrarySegment('campaigns'));
    // Simulates the cross-segment CampaignManager.onOpenCharacter writer.
    act(() => result.current.openSheet('doc-1'));
    expect(result.current.nav.surface).toBe('sheet');
    expect(result.current.nav.sheetDocId).toBe('doc-1');
  });

  it('closeSheet returns to Library/Characters and clears the open sheet', () => {
    const { result } = renderNav();
    act(() => result.current.openSheet('doc-1'));
    act(() => result.current.closeSheet());
    expect(result.current.nav.surface).toBe('library');
    expect(result.current.nav.librarySegment).toBe('characters');
    expect(result.current.nav.sheetDocId).toBeNull();
  });

  it('selectScene(id) selects the scene AND switches to the Scene surface', () => {
    const { result } = renderNav();
    act(() => result.current.selectScene('scene-9'));
    expect(result.current.nav.sceneId).toBe('scene-9');
    expect(result.current.nav.surface).toBe('scene');
  });

  it('selectScene(null) clears the scene without changing surface', () => {
    const { result } = renderNav();
    act(() => result.current.setLibrarySegment('scenes'));
    act(() => result.current.selectScene(null));
    expect(result.current.nav.sceneId).toBeNull();
    expect(result.current.nav.surface).toBe('library');
  });

  it('setSurface and setLibrarySegment round-trip', () => {
    const { result } = renderNav();
    act(() => result.current.setLibrarySegment('content'));
    expect(result.current.nav.surface).toBe('library');
    expect(result.current.nav.librarySegment).toBe('content');
    act(() => result.current.setSurface('scene'));
    expect(result.current.nav.surface).toBe('scene');
  });

  it('overlay opens and closes independently of the surface', () => {
    const { result } = renderNav();
    act(() => result.current.openSheet('doc-1'));
    act(() => result.current.openOverlay('legal'));
    expect(result.current.nav.overlay).toBe('legal');
    expect(result.current.nav.surface).toBe('sheet');
    act(() => result.current.closeOverlay());
    expect(result.current.nav.overlay).toBeNull();
  });

  it('opening a sheet dismisses any open overlay', () => {
    const { result } = renderNav();
    act(() => result.current.openOverlay('legal'));
    act(() => result.current.openSheet('doc-2'));
    expect(result.current.nav.overlay).toBeNull();
    expect(result.current.nav.sheetDocId).toBe('doc-2');
  });

  it('exposes exhaustive labels for every discriminant', () => {
    expect(surfaceLabel('library')).toBe('Library');
    expect(surfaceLabel('sheet')).toBe('Character sheet');
    expect(surfaceLabel('scene')).toBe('Scene');
    expect(LIBRARY_SEGMENTS.map(librarySegmentLabel)).toEqual([
      'Characters',
      'Campaigns',
      'Scenes',
      'Bestiary',
      'Library',
    ]);
  });
});
