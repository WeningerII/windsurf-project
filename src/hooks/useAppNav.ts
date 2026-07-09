import { useCallback, useMemo, useReducer } from 'react';

/**
 * Total shell-navigation model for the UI redesign (Phase 1).
 *
 * The app previously navigated with three independent `useState` flags in
 * `App.tsx` (currentDocId, selectedSystem, showLegal). This hook replaces that
 * with ONE total discriminated union so every reachable view is a single
 * value, and so the Phase-2 swap to a `ShellContext` reducer is a one-module
 * change behind a stable API rather than an app-wide rewrite.
 *
 * `assertNever` is defined locally on purpose: an `assertNever` helper also
 * lives in `src/scene/runtime.ts`, but that file is the frozen deterministic
 * core and the shared layer must not couple to it.
 */

/** Which primary surface is on screen. Exactly one is visible at a time. */
export type Surface = 'library' | 'sheet' | 'scene';

/**
 * Which slice of the Library surface is shown. In Phase 1 these back the
 * header tabs (Characters / Campaigns / Scenes / Library); Phase 2 collapses
 * them into an internal segment control. `content` is the SRD content stats
 * view (was `SystemStatusDashboard`), labelled "Library" in the tab bar.
 */
export type LibrarySegment = 'characters' | 'campaigns' | 'scenes' | 'content';

/** A modal layer rendered above the active surface. */
export type Overlay = 'legal' | null;

export interface ShellNavState {
  surface: Surface;
  librarySegment: LibrarySegment;
  sheetDocId: string | null;
  sceneId: string | null;
  overlay: Overlay;
}

export const INITIAL_NAV_STATE: ShellNavState = {
  surface: 'library',
  librarySegment: 'characters',
  sheetDocId: null,
  sceneId: null,
  overlay: null,
};

type NavAction =
  | { type: 'openSheet'; docId: string }
  | { type: 'closeSheet' }
  | { type: 'setSurface'; surface: Surface }
  | { type: 'setLibrarySegment'; segment: LibrarySegment }
  | { type: 'selectScene'; sceneId: string | null }
  | { type: 'openOverlay'; overlay: Exclude<Overlay, null> }
  | { type: 'closeOverlay' };

/** Compile-time exhaustiveness guard. Dropping a union case fails typecheck. */
function assertNever(value: never): never {
  throw new Error(`Unhandled discriminant: ${JSON.stringify(value)}`);
}

/** Human label for a surface — exhaustive over the Surface discriminant. */
export function surfaceLabel(surface: Surface): string {
  switch (surface) {
    case 'library':
      return 'Library';
    case 'sheet':
      return 'Character sheet';
    case 'scene':
      return 'Scene';
    default:
      return assertNever(surface);
  }
}

/**
 * Human label for a library segment — exhaustive over LibrarySegment. Drives
 * the Phase-1 header tab labels, so `content` reads as "Library".
 */
export function librarySegmentLabel(segment: LibrarySegment): string {
  switch (segment) {
    case 'characters':
      return 'Characters';
    case 'campaigns':
      return 'Campaigns';
    case 'scenes':
      return 'Scenes';
    case 'content':
      return 'Library';
    default:
      return assertNever(segment);
  }
}

/** The library segments, in header-tab order. */
export const LIBRARY_SEGMENTS: readonly LibrarySegment[] = [
  'characters',
  'campaigns',
  'scenes',
  'content',
];

function navReducer(state: ShellNavState, action: NavAction): ShellNavState {
  switch (action.type) {
    case 'openSheet':
      // Every sheet-open is ALSO the implicit surface switch — a bare
      // sheetDocId set would strand cross-segment callers (clone, import,
      // campaign card) on their current surface.
      return { ...state, surface: 'sheet', sheetDocId: action.docId, overlay: null };
    case 'closeSheet':
      // Return to the Library on the default (Characters) segment, clearing
      // the open sheet — mirrors the old setCurrentDocId(null) behaviour.
      return { ...state, surface: 'library', librarySegment: 'characters', sheetDocId: null };
    case 'setSurface':
      return { ...state, surface: action.surface };
    case 'setLibrarySegment':
      return { ...state, surface: 'library', librarySegment: action.segment };
    case 'selectScene':
      // Selecting/creating/importing a scene sets it AND flips to the canvas
      // (preserves today's "create a scene and you're looking at it"); a null
      // selection clears without changing surface.
      return action.sceneId === null
        ? { ...state, sceneId: null }
        : { ...state, surface: 'scene', sceneId: action.sceneId };
    case 'openOverlay':
      return { ...state, overlay: action.overlay };
    case 'closeOverlay':
      return { ...state, overlay: null };
    default:
      return assertNever(action);
  }
}

export interface UseAppNav {
  nav: ShellNavState;
  /** Open a character sheet (compound: sets the doc AND switches surface). */
  openSheet: (docId: string) => void;
  /** Close the current sheet, returning to the Characters library segment. */
  closeSheet: () => void;
  setSurface: (surface: Surface) => void;
  setLibrarySegment: (segment: LibrarySegment) => void;
  /**
   * Controlled scene selection. Non-null selects the scene AND switches to the
   * Scene surface; null clears the selection without changing surface.
   */
  selectScene: (sceneId: string | null) => void;
  openOverlay: (overlay: Exclude<Overlay, null>) => void;
  closeOverlay: () => void;
}

/**
 * Backed by useReducer today; Phase 2 relocates the reducer into a
 * `ShellContext` provider without changing this hook's return shape.
 */
export function useAppNav(initial: ShellNavState = INITIAL_NAV_STATE): UseAppNav {
  const [nav, dispatch] = useReducer(navReducer, initial);

  const openSheet = useCallback((docId: string) => dispatch({ type: 'openSheet', docId }), []);
  const closeSheet = useCallback(() => dispatch({ type: 'closeSheet' }), []);
  const setSurface = useCallback(
    (surface: Surface) => dispatch({ type: 'setSurface', surface }),
    []
  );
  const setLibrarySegment = useCallback(
    (segment: LibrarySegment) => dispatch({ type: 'setLibrarySegment', segment }),
    []
  );
  const selectScene = useCallback(
    (sceneId: string | null) => dispatch({ type: 'selectScene', sceneId }),
    []
  );
  const openOverlay = useCallback(
    (overlay: Exclude<Overlay, null>) => dispatch({ type: 'openOverlay', overlay }),
    []
  );
  const closeOverlay = useCallback(() => dispatch({ type: 'closeOverlay' }), []);

  return useMemo(
    () => ({
      nav,
      openSheet,
      closeSheet,
      setSurface,
      setLibrarySegment,
      selectScene,
      openOverlay,
      closeOverlay,
    }),
    [
      nav,
      openSheet,
      closeSheet,
      setSurface,
      setLibrarySegment,
      selectScene,
      openOverlay,
      closeOverlay,
    ]
  );
}
