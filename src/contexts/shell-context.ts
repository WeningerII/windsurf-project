import { createContext } from 'react';

/**
 * Total shell-navigation model (Phase 2 home of the Phase-1 union).
 *
 * Phase 1 authored this reducer + union inside `src/hooks/useAppNav.ts`;
 * Phase 2 lifts it verbatim into this non-component context file (mirroring
 * the `auth-context.ts` / `AuthContext.tsx` split — no JSX here so the
 * react-refresh only-export-components lint stays green). `useAppNav` is now
 * a thin `useContext(ShellContext)` consumer with an unchanged public API,
 * so no view component changed in the move.
 *
 * `assertNever` is defined locally on purpose: an `assertNever` helper also
 * lives in `src/scene/runtime.ts`, but that file is the frozen deterministic
 * core and the shared layer must not couple to it.
 */

/** Which primary surface is on screen. Exactly one is visible at a time. */
export type Surface = 'library' | 'sheet' | 'scene';

/**
 * Which slice of the Library surface is shown. In Phase 1 these back the
 * header tabs (Characters / Campaigns / Scenes / Library); Phase 2 keeps the
 * same segment set. `content` is the SRD content stats view (was
 * `SystemStatusDashboard`), labelled "Library" in the tab bar.
 */
export type LibrarySegment = 'characters' | 'campaigns' | 'scenes' | 'bestiary' | 'content';

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

export type ShellAction =
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
 * the header tab labels, so `content` reads as "Library".
 */
export function librarySegmentLabel(segment: LibrarySegment): string {
  switch (segment) {
    case 'characters':
      return 'Characters';
    case 'campaigns':
      return 'Campaigns';
    case 'scenes':
      return 'Scenes';
    case 'bestiary':
      return 'Bestiary';
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
  'bestiary',
  'content',
];

/**
 * Pure shell reducer — behavior-identical to the Phase-1 `navReducer` that
 * lived inside `useAppNav`. Exhaustive over the action discriminant via
 * `assertNever`.
 */
export function shellReducer(state: ShellNavState, action: ShellAction): ShellNavState {
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

/** The context value: nav state plus the named compound action creators. */
export interface ShellContextValue {
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
 * Null default on purpose: shell state only exists under a `ShellProvider`,
 * and `useAppNav` turns a missing provider into a loud error instead of a
 * silently inert no-op shell.
 */
export const ShellContext = createContext<ShellContextValue | null>(null);

// --- Hash sync (Phase 7, build-spec tasks 1-3) --------------------------------

/**
 * The shell's nav state as a URL hash, and back.
 *
 * DESIGN, and the parts that are deliberate:
 *
 * - **`replaceState`, never `pushState`.** The Phase-1 decision was "deferred
 *   router / no deep-linking", and honouring it means a surface switch must not
 *   grow the history stack — otherwise Back becomes a per-tab-click undo that
 *   nothing else in the shell models.
 * - **Decoding is TOTAL and lossy-tolerant.** A hash is user-editable and
 *   survives across deploys, so every field is validated against the live union
 *   and anything unrecognised falls back to the Phase-1 default rather than
 *   throwing. A shell that white-screens on a stale bookmark is worse than one
 *   that lands on Characters.
 * - **Ids are NOT validated here.** `decodeShellNav` cannot know which
 *   documents or scenes exist; that is the caller's job (see
 *   `sanitizeRestoredNav`), which keeps this pair pure and unit-testable.
 */
const HASH_KEYS = {
  surface: 's',
  librarySegment: 'l',
  sheetDocId: 'd',
  sceneId: 'c',
  overlay: 'o',
} as const;

const SURFACES: readonly Surface[] = ['library', 'sheet', 'scene'];
const OVERLAYS: readonly Exclude<Overlay, null>[] = ['legal'];

function isSurface(value: string): value is Surface {
  return (SURFACES as readonly string[]).includes(value);
}

function isLibrarySegment(value: string): value is LibrarySegment {
  return (LIBRARY_SEGMENTS as readonly string[]).includes(value);
}

function isOverlay(value: string): value is Exclude<Overlay, null> {
  return (OVERLAYS as readonly string[]).includes(value);
}

/** Serialize nav state to a `#`-prefixed hash. Default state yields `''`. */
export function encodeShellNav(state: ShellNavState): string {
  const parts: string[] = [];
  if (state.surface !== INITIAL_NAV_STATE.surface) {
    parts.push(`${HASH_KEYS.surface}=${state.surface}`);
  }
  if (state.librarySegment !== INITIAL_NAV_STATE.librarySegment) {
    parts.push(`${HASH_KEYS.librarySegment}=${state.librarySegment}`);
  }
  if (state.sheetDocId) {
    parts.push(`${HASH_KEYS.sheetDocId}=${encodeURIComponent(state.sheetDocId)}`);
  }
  if (state.sceneId) {
    parts.push(`${HASH_KEYS.sceneId}=${encodeURIComponent(state.sceneId)}`);
  }
  if (state.overlay) {
    parts.push(`${HASH_KEYS.overlay}=${state.overlay}`);
  }
  // Empty rather than a bare '#': the default shell should leave the URL clean,
  // so a first visit and a return-to-default look identical in the address bar.
  return parts.length === 0 ? '' : `#${parts.join('&')}`;
}

/**
 * Parse a hash into nav state, falling back field-by-field to the Phase-1
 * default. Total: any malformed input yields a usable state.
 */
export function decodeShellNav(hash: string): ShellNavState {
  const state: ShellNavState = { ...INITIAL_NAV_STATE };
  const body = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!body) return state;

  for (const pair of body.split('&')) {
    const separator = pair.indexOf('=');
    if (separator <= 0) continue;
    const key = pair.slice(0, separator);
    const raw = pair.slice(separator + 1);
    let value: string;
    try {
      value = decodeURIComponent(raw);
    } catch {
      // A malformed percent-escape is not worth losing the whole hash over.
      continue;
    }

    switch (key) {
      case HASH_KEYS.surface:
        if (isSurface(value)) state.surface = value;
        break;
      case HASH_KEYS.librarySegment:
        if (isLibrarySegment(value)) state.librarySegment = value;
        break;
      case HASH_KEYS.sheetDocId:
        if (value) state.sheetDocId = value;
        break;
      case HASH_KEYS.sceneId:
        if (value) state.sceneId = value;
        break;
      case HASH_KEYS.overlay:
        if (isOverlay(value)) state.overlay = value;
        break;
      default:
        // Unknown key: ignore rather than reject. A hash written by a newer
        // build must not strand an older one on a blank screen.
        break;
    }
  }

  return state;
}

/**
 * Drop restored ids that no longer resolve (build-spec task 3).
 *
 * A reload can never strand or crash on a deleted document: an unresolvable
 * `sheetDocId` lands on the Library exactly as `closeSheet` does, rather than
 * rendering a sheet surface with nothing to render. An unresolvable `sceneId`
 * is cleared and left for `SceneManager`'s existing `scenes[0]?.id ?? null`
 * auto-reset — deliberately NOT resolved here, so there is one owner of that
 * fallback rather than two that can disagree.
 */
export function sanitizeRestoredNav(
  state: ShellNavState,
  known: { documentIds: readonly string[]; sceneIds: readonly string[] }
): ShellNavState {
  const next = { ...state };

  if (next.sheetDocId && !known.documentIds.includes(next.sheetDocId)) {
    next.sheetDocId = null;
    if (next.surface === 'sheet') {
      next.surface = 'library';
      next.librarySegment = 'characters';
    }
  }

  if (next.sceneId && !known.sceneIds.includes(next.sceneId)) {
    next.sceneId = null;
  }

  return next;
}
