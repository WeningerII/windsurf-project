import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  SheetDispatchRegistryContext,
  SheetDispatchStateContext,
  type SheetAddHandlers,
  type SheetDispatchRegistry,
  type SheetDispatchState,
} from './sheet-dispatch-context';

/**
 * Provider for the Phase-3 inverted-control sheet-dispatch registry. Holds the
 * currently-published active-document id + its add-handlers and exposes
 * register/unregister. Mounted once at the App shell level so the active sheet
 * (inside SurfaceStage) and the shared Dock (rendered at the shell root) share
 * one registry — see `sheet-dispatch-context.ts` for the full rationale.
 *
 * The registry ({register, unregister}) and the volatile state
 * ({activeDocId, handlers}) are published through SEPARATE contexts: the
 * registry object is referentially stable (its `register`/`unregister` are
 * stable callbacks), so a registering sheet — which consumes only the registry
 * context — never re-renders when the volatile state changes. That is what
 * keeps `register()` from re-rendering the very sheet that called it, closing
 * off the register → setState → re-render → register loop.
 *
 * The provider component lives alone in this `.tsx` (the context objects + hooks
 * are in the non-JSX `sheet-dispatch-context.ts`) so the react-refresh
 * only-export-components lint stays green.
 */
export function SheetDispatchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SheetDispatchState>({
    activeDocId: null,
    handlers: {},
  });

  const register = useCallback((docId: string | null, handlers: SheetAddHandlers) => {
    setState({ activeDocId: docId, handlers: docId ? handlers : {} });
  }, []);

  const unregister = useCallback((docId: string) => {
    // Only the sheet that currently owns the registry may clear it — a late
    // teardown from a previously-active sheet must not wipe the new one.
    setState((prev) => (prev.activeDocId === docId ? { activeDocId: null, handlers: {} } : prev));
  }, []);

  // Stable across the provider's whole lifetime (register/unregister never
  // change identity), so the registry context value never changes — registrant
  // sheets consuming it never re-render on registry state churn.
  const registry = useMemo<SheetDispatchRegistry>(
    () => ({ register, unregister }),
    [register, unregister]
  );

  return (
    <SheetDispatchRegistryContext.Provider value={registry}>
      <SheetDispatchStateContext.Provider value={state}>
        {children}
      </SheetDispatchStateContext.Provider>
    </SheetDispatchRegistryContext.Provider>
  );
}
