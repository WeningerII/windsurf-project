/**
 * The lazy drag provider (Phase 4). Loaded ONLY when `VITE_SCENE_DRAG_ENABLED`
 * is on (via `DragRoot`), so none of this — nor `pointerEngine` / `DragLayer` —
 * ever enters the eager index chunk.
 *
 * It owns the live drag: a drop-target registry (a ref Map, never React state)
 * and the source-handler factory. On pointerdown it starts a `createDragGesture`
 * FSM, captures the pointer on activation, moves the ghost by direct ref
 * transform, and on release hit-tests the registered targets via
 * `elementFromPoint` and fires the winning target's `onDrop`. It publishes only
 * `SceneActionIntent`-agnostic seams (payload ids + a coordinate) — it never
 * imports `src/systems/**` or `runtime.ts`.
 */
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { DragContext } from './dragContext';
import { createDragGesture, type PointerSample } from './pointerEngine';
import type { DragPayload, DropTargetRegistration, MakeDragSource } from './dragTypes';
import { DragLayer } from './DragLayer';

function toSample(event: PointerEvent | ReactPointerEvent): PointerSample {
  return {
    x: event.clientX,
    y: event.clientY,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    time: typeof performance !== 'undefined' ? performance.now() : Date.now(),
  };
}

export function DragProvider({ children }: { children: ReactNode }) {
  const targets = useRef(new Map<string, DropTargetRegistration>());
  const ghostRef = useRef<HTMLDivElement>(null);
  const [dragLabel, setDragLabel] = useState<string | null>(null);

  const registerDropTarget = useCallback((id: string, registration: DropTargetRegistration) => {
    targets.current.set(id, registration);
    return () => {
      targets.current.delete(id);
    };
  }, []);

  const positionGhost = useCallback((x: number, y: number) => {
    const el = ghostRef.current;
    if (el) el.style.transform = `translate(${x + 12}px, ${y + 12}px)`;
  }, []);

  const dispatchDrop = useCallback((payload: DragPayload, x: number, y: number) => {
    for (const registration of targets.current.values()) {
      const coordinate = registration.resolver(x, y);
      if (coordinate) {
        registration.onDrop(payload, coordinate);
        return;
      }
    }
    // No target under the release point → the ghost simply vanishes (snap-back);
    // an accepted-but-rejected intent surfaces its own toast downstream.
  }, []);

  const makeSourceHandlers = useCallback<MakeDragSource>(
    (payload: DragPayload) => ({
      onPointerDown: (event: ReactPointerEvent) => {
        // Primary button / touch / pen only; ignore secondary mouse buttons.
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const source = event.currentTarget as HTMLElement;

        function detach(): void {
          window.removeEventListener('pointermove', onWindowMove);
          window.removeEventListener('pointerup', onWindowUp);
          window.removeEventListener('pointercancel', onWindowCancel);
        }

        const gesture = createDragGesture({
          onActivate: (sample) => {
            try {
              source.setPointerCapture?.(sample.pointerId);
            } catch {
              /* jsdom / unsupported — capture is a progressive enhancement */
            }
            setDragLabel(payload.label);
            positionGhost(sample.x, sample.y);
          },
          onMove: (sample) => positionGhost(sample.x, sample.y),
          onEnd: (sample, activated) => {
            detach();
            if (activated) dispatchDrop(payload, sample.x, sample.y);
            setDragLabel(null);
          },
        });

        function onWindowMove(e: PointerEvent): void {
          gesture.move(toSample(e));
        }
        function onWindowUp(e: PointerEvent): void {
          gesture.up(toSample(e));
        }
        function onWindowCancel(e: PointerEvent): void {
          gesture.cancel(toSample(e));
        }

        window.addEventListener('pointermove', onWindowMove);
        window.addEventListener('pointerup', onWindowUp);
        window.addEventListener('pointercancel', onWindowCancel);
        gesture.down(toSample(event));
      },
    }),
    [dispatchDrop, positionGhost]
  );

  const value = useMemo(
    () => ({ makeSourceHandlers, registerDropTarget }),
    [makeSourceHandlers, registerDropTarget]
  );

  return (
    <DragContext.Provider value={value}>
      {children}
      {dragLabel !== null && <DragLayer ref={ghostRef} label={dragLabel} />}
    </DragContext.Provider>
  );
}

export default DragProvider;
