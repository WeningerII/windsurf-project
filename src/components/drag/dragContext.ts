/**
 * The eager, minimal drag context surface (Phase 4).
 *
 * This module is imported by the EAGER Dock, so it is deliberately tiny: a
 * React context plus two thin hooks. The heavy machinery — the pointer FSM
 * (`pointerEngine.ts`), the portaled ghost (`DragLayer.tsx`) and the provider
 * (`DragProvider.tsx`) — rides a LAZY chunk fetched only when the
 * `VITE_SCENE_DRAG_ENABLED` flag is on, so the index chunk stays flat.
 *
 * When no provider is mounted (the flag-off production default) the context is
 * null and every hook degrades to a no-op: drag sources spread `{}` and render
 * exactly as before.
 */
import { createContext, useCallback, useContext } from 'react';
import type {
  DragContextValue,
  DragPayload,
  DragSourceHandlers,
  MakeDragSource,
} from './dragTypes';

export const DragContext = createContext<DragContextValue | null>(null);

/** Stable empty handlers so a no-provider source spreads a referentially-stable
 * object (no needless re-renders). */
const NO_HANDLERS: DragSourceHandlers = Object.freeze({});

/**
 * A factory for drag-source handlers. Call ONCE per component, then invoke the
 * returned factory per row with that row's payload — this keeps the hook count
 * stable across a dynamically-filtered list (rules of hooks) while still
 * producing per-item handlers.
 */
export function useDragSource(): MakeDragSource {
  const ctx = useContext(DragContext);
  return useCallback<MakeDragSource>(
    (payload: DragPayload) => (ctx ? ctx.makeSourceHandlers(payload) : NO_HANDLERS),
    [ctx]
  );
}

/** Raw context access for the drop-target hook. Null when the flag is off. */
export function useDragContext(): DragContextValue | null {
  return useContext(DragContext);
}
