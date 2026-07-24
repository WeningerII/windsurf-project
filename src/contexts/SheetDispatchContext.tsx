import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  SheetDispatchContext,
  type SheetAddHandlers,
  type SheetDispatchContextValue,
} from './sheet-dispatch-context';

/**
 * Provider for the Phase-3 inverted-control sheet-dispatch registry. Holds the
 * currently-published active-document id + its add-handlers and exposes
 * register/unregister. Mounted once at the App shell level so the active sheet
 * (inside SurfaceStage) and the shared Dock (rendered at the shell root) share
 * one registry — see `sheet-dispatch-context.ts` for the full rationale.
 *
 * The provider component lives alone in this `.tsx` (the context object + hooks
 * are in the non-JSX `sheet-dispatch-context.ts`) so the react-refresh
 * only-export-components lint stays green.
 */
export function SheetDispatchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ activeDocId: string | null; handlers: SheetAddHandlers }>({
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

  const value = useMemo<SheetDispatchContextValue>(
    () => ({
      activeDocId: state.activeDocId,
      handlers: state.handlers,
      register,
      unregister,
    }),
    [state.activeDocId, state.handlers, register, unregister]
  );

  return <SheetDispatchContext.Provider value={value}>{children}</SheetDispatchContext.Provider>;
}
