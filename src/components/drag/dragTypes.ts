/**
 * Shared drag types for the Phase-4 pointer-drag keystone.
 *
 * TYPE-ONLY at runtime (erased by the compiler), so importing this from the
 * eager Dock adds no bytes to the index chunk. The payload carries only opaque
 * string ids (documentId / monsterId) and a label — never a `src/systems/**`
 * value — so the drag machinery stays inside the lint-enforced layer boundary.
 */
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { SceneCoordinate } from '../../types/core/scene';

/**
 * What is being dragged. Discriminated by `kind`:
 * - `character` → a party character document (the 3b-i 1-choice auto-apply path)
 * - `monster` → a bestiary statblock (the 3b-ii allegiance-chip path)
 */
export type DragPayload =
  | { kind: 'character'; documentId: string; label: string }
  | { kind: 'monster'; monsterId: string; label: string };

/** Pointer handlers a drag SOURCE spreads onto its element. Empty = no drag. */
export interface DragSourceHandlers {
  onPointerDown?: (event: ReactPointerEvent) => void;
}

/** A factory that turns a payload into source handlers (avoids per-row hooks). */
export type MakeDragSource = (payload: DragPayload) => DragSourceHandlers;

/** Maps a viewport point to a scene cell, or null for an off-target drop. */
export type DropResolver = (clientX: number, clientY: number) => SceneCoordinate | null;

/** Called on a successful drop over a registered target. */
export type DropHandler = (payload: DragPayload, coordinate: SceneCoordinate) => void;

export interface DropTargetRegistration {
  element: HTMLElement;
  resolver: DropResolver;
  onDrop: DropHandler;
}

/** The value the DragProvider publishes; null outside a provider (flag off). */
export interface DragContextValue {
  makeSourceHandlers: MakeDragSource;
  registerDropTarget: (id: string, registration: DropTargetRegistration) => () => void;
}
