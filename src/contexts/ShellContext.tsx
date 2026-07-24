import { useCallback, useMemo, useReducer, type ReactNode } from 'react';
import {
  INITIAL_NAV_STATE,
  ShellContext,
  shellReducer,
  type LibrarySegment,
  type Overlay,
  type ShellContextValue,
  type ShellNavState,
  type Surface,
} from './shell-context';

interface ShellProviderProps {
  children: ReactNode;
  /** Test seam: start the shell somewhere other than Library/Characters. */
  initialState?: ShellNavState;
}

/**
 * Provider component for the shell navigation reducer (Phase 2). Mirrors the
 * `AuthContext.tsx` half of the two-file context split: this is the ONLY file
 * of the pair that exports a component. Holds the `useReducer(shellReducer)`
 * state that Phase 1 kept inside `useAppNav`, and memoizes the named action
 * creators so consumers' effect dependencies stay referentially stable.
 */
export function ShellProvider({ children, initialState = INITIAL_NAV_STATE }: ShellProviderProps) {
  const [nav, dispatch] = useReducer(shellReducer, initialState);

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
