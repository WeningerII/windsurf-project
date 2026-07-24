import { describe, expect, it } from 'vitest';
import {
  INITIAL_NAV_STATE,
  LIBRARY_SEGMENTS,
  librarySegmentLabel,
  shellReducer,
  surfaceLabel,
  type ShellAction,
  type ShellNavState,
} from '../../contexts/shell-context';

/**
 * Phase-2 coverage counterweight (build-specs task 11c): the nav logic moved
 * out of the hook into the instrumented `shell-context.ts`, so the reducer
 * carries its own pure unit tests — behavior-identical to the Phase-1
 * `useAppNav` transitions.
 */

function reduce(state: ShellNavState, ...actions: ShellAction[]): ShellNavState {
  return actions.reduce(shellReducer, state);
}

describe('shellReducer', () => {
  it('starts on the Library/Characters surface with nothing open', () => {
    expect(INITIAL_NAV_STATE).toEqual({
      surface: 'library',
      librarySegment: 'characters',
      sheetDocId: null,
      sceneId: null,
      overlay: null,
    });
  });

  it('openSheet is compound: sets the doc AND switches to the sheet surface', () => {
    // Simulates the cross-segment CampaignManager.onOpenCharacter writer.
    const state = reduce(
      INITIAL_NAV_STATE,
      { type: 'setLibrarySegment', segment: 'campaigns' },
      { type: 'openSheet', docId: 'doc-1' }
    );
    expect(state.surface).toBe('sheet');
    expect(state.sheetDocId).toBe('doc-1');
  });

  it('closeSheet returns to Library/Characters and clears the open sheet', () => {
    const state = reduce(
      INITIAL_NAV_STATE,
      { type: 'setLibrarySegment', segment: 'campaigns' },
      { type: 'openSheet', docId: 'doc-1' },
      { type: 'closeSheet' }
    );
    expect(state.surface).toBe('library');
    expect(state.librarySegment).toBe('characters');
    expect(state.sheetDocId).toBeNull();
  });

  it('selectScene(id) is the compound five-writer seam: selects AND flips to Scene', () => {
    const state = reduce(INITIAL_NAV_STATE, { type: 'selectScene', sceneId: 'scene-9' });
    expect(state.sceneId).toBe('scene-9');
    expect(state.surface).toBe('scene');
  });

  it('selectScene(null) clears the scene without changing surface', () => {
    const state = reduce(
      INITIAL_NAV_STATE,
      { type: 'setLibrarySegment', segment: 'scenes' },
      { type: 'selectScene', sceneId: null }
    );
    expect(state.sceneId).toBeNull();
    expect(state.surface).toBe('library');
    expect(state.librarySegment).toBe('scenes');
  });

  it('setSurface and setLibrarySegment round-trip', () => {
    const inContent = reduce(INITIAL_NAV_STATE, {
      type: 'setLibrarySegment',
      segment: 'content',
    });
    expect(inContent.surface).toBe('library');
    expect(inContent.librarySegment).toBe('content');
    const onScene = reduce(inContent, { type: 'setSurface', surface: 'scene' });
    expect(onScene.surface).toBe('scene');
    expect(onScene.librarySegment).toBe('content');
  });

  it('overlay opens and closes independently of the surface', () => {
    const open = reduce(
      INITIAL_NAV_STATE,
      { type: 'openSheet', docId: 'doc-1' },
      { type: 'openOverlay', overlay: 'legal' }
    );
    expect(open.overlay).toBe('legal');
    expect(open.surface).toBe('sheet');
    const closed = reduce(open, { type: 'closeOverlay' });
    expect(closed.overlay).toBeNull();
    expect(closed.surface).toBe('sheet');
  });

  it('opening a sheet dismisses any open overlay', () => {
    const state = reduce(
      INITIAL_NAV_STATE,
      { type: 'openOverlay', overlay: 'legal' },
      { type: 'openSheet', docId: 'doc-2' }
    );
    expect(state.overlay).toBeNull();
    expect(state.sheetDocId).toBe('doc-2');
  });

  it('is pure: never mutates the input state', () => {
    const before = { ...INITIAL_NAV_STATE };
    shellReducer(INITIAL_NAV_STATE, { type: 'openSheet', docId: 'doc-1' });
    expect(INITIAL_NAV_STATE).toEqual(before);
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

  it('rejects out-of-union values at compile time (assertNever exhaustiveness)', () => {
    // Type-level assertions: the union is TOTAL, so out-of-union inputs must
    // fail typecheck (mirrors the Phase-1 @ts-expect-error acceptance test).
    // @ts-expect-error - unknown action type is not a ShellAction
    const badAction: ShellAction = { type: 'teleport' };
    // @ts-expect-error - unknown surface is not in the Surface union
    const badLabel = () => surfaceLabel('dungeon');
    // @ts-expect-error - unknown segment is not in the LibrarySegment union
    const badSegment = () => librarySegmentLabel('maps');
    expect([badAction, badLabel, badSegment]).toBeDefined();
  });
});
