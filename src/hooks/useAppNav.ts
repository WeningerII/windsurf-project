import { useContext } from 'react';
import { ShellContext, type ShellContextValue } from '../contexts/shell-context';

/**
 * Total shell-navigation hook (Phase 1 seam, Phase 2 internals).
 *
 * Phase 1 backed this hook with its own `useReducer`; Phase 2 relocated that
 * reducer into `src/contexts/shell-context.ts` (with the provider in
 * `src/contexts/ShellContext.tsx`) and made this a thin `useContext`
 * consumer. The public API — the `nav` union plus the compound `openSheet` /
 * `closeSheet` / `selectScene` action creators — is unchanged, so no view
 * component changed in the swap.
 */

// The nav union and its helpers live with the reducer now; re-exported here
// so Phase-1 consumers (AppHeader tab labels, tests, metrics) keep their
// import paths.
export {
  INITIAL_NAV_STATE,
  LIBRARY_SEGMENTS,
  librarySegmentLabel,
  surfaceLabel,
} from '../contexts/shell-context';
export type { LibrarySegment, Overlay, ShellNavState, Surface } from '../contexts/shell-context';

/** The hook's return shape — identical to the Phase-1 `UseAppNav` surface. */
export type UseAppNav = ShellContextValue;

export function useAppNav(): UseAppNav {
  const context = useContext(ShellContext);
  if (context === null) {
    throw new Error('useAppNav must be used within a <ShellProvider>');
  }
  return context;
}
