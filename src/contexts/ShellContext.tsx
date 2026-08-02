import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import {
  decodeShellNav,
  encodeShellNav,
  INITIAL_NAV_STATE,
  ShellContext,
  shellReducer,
  type LibrarySegment,
  type Overlay,
  type ShellContextValue,
  type ShellNavState,
  type Surface,
} from './shell-context';

/** Coalesce rapid nav changes into one history write. */
const HASH_WRITE_DEBOUNCE_MS = 150;

interface ShellProviderProps {
  children: ReactNode;
  /** Test seam: start the shell somewhere other than Library/Characters. */
  initialState?: ShellNavState;
  /**
   * Opt OUT of reading and writing `location.hash` (Phase 7 tasks 1-2).
   *
   * Defaults to ON. Tests that assert a specific `initialState` pass `false`,
   * because seeding from the hash would otherwise let one test's URL leak into
   * the next — jsdom shares a `location` across a file.
   */
  syncHash?: boolean;
}

/** Seed from the hash when enabled, else honour the explicit initial state. */
function resolveInitialState(initialState: ShellNavState, syncHash: boolean): ShellNavState {
  if (!syncHash || typeof window === 'undefined') return initialState;
  return decodeShellNav(window.location.hash);
}

/**
 * Provider component for the shell navigation reducer (Phase 2). Mirrors the
 * `AuthContext.tsx` half of the two-file context split: this is the ONLY file
 * of the pair that exports a component. Holds the `useReducer(shellReducer)`
 * state that Phase 1 kept inside `useAppNav`, and memoizes the named action
 * creators so consumers' effect dependencies stay referentially stable.
 */
export function ShellProvider({
  children,
  initialState = INITIAL_NAV_STATE,
  syncHash = true,
}: ShellProviderProps) {
  const [nav, dispatch] = useReducer(shellReducer, resolveInitialState(initialState, syncHash));
  const hashWriteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirror nav state into the URL hash, debounced.
  //
  // `replaceState`, NOT `pushState`: the Phase-1 "deferred router / no
  // deep-linking" decision means a surface switch must not grow the history
  // stack, or Back becomes a per-tab-click undo the shell does not model.
  //
  // Writing only on CHANGE (and only when the encoding actually differs) keeps
  // a re-render from touching history at all.
  useEffect(() => {
    if (!syncHash || typeof window === 'undefined') return;

    const next = encodeShellNav(nav);
    const current = window.location.hash;
    if (next === current || (next === '' && current === '')) return;

    if (hashWriteTimer.current !== null) clearTimeout(hashWriteTimer.current);
    hashWriteTimer.current = setTimeout(() => {
      hashWriteTimer.current = null;
      const url = `${window.location.pathname}${window.location.search}${next}`;
      window.history.replaceState(window.history.state, '', url);
    }, HASH_WRITE_DEBOUNCE_MS);

    return () => {
      if (hashWriteTimer.current !== null) {
        clearTimeout(hashWriteTimer.current);
        hashWriteTimer.current = null;
      }
    };
  }, [nav, syncHash]);

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

  const value = useMemo<ShellContextValue>(
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

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
