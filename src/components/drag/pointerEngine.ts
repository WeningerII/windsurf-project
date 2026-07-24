/**
 * Greenfield pointer-drag gesture FSM (Phase 4) — no DnD library.
 *
 * A PURE state machine: it takes pointer samples and decides when a press
 * becomes a drag, disambiguating a scroll from a drag. It touches no DOM and
 * holds no React state, so it is exhaustively unit-testable; the React glue
 * (window listeners + `setPointerCapture` + the ref-transform ghost) lives in
 * `DragProvider.tsx`, which drives this machine.
 *
 * Disambiguation:
 * - mouse / pen: any movement past `activationDistance` starts the drag.
 * - touch: a move past the tolerance BEFORE `touchActivationDelayMs` is read as
 *   a SCROLL and permanently rejects the gesture (the list keeps scrolling); a
 *   move past the tolerance AFTER the dwell starts the drag. This lets a flick
 *   scroll and a deliberate press-then-move drag.
 */

export interface PointerSample {
  x: number;
  y: number;
  pointerId: number;
  pointerType: string;
  /** Monotonic timestamp (ms), e.g. performance.now(). */
  time: number;
}

export interface DragGestureOptions {
  /** Movement (px) required to treat a press as a drag. Default 6. */
  activationDistance?: number;
  /** Touch dwell (ms) required before a move can activate a drag. Default 120. */
  touchActivationDelayMs?: number;
  /** Fired once, when the gesture crosses into an active drag. */
  onActivate: (sample: PointerSample) => void;
  /** Fired for every move while the drag is active. */
  onMove: (sample: PointerSample) => void;
  /** Fired on up/cancel; `activated` says whether a drag was in progress. */
  onEnd: (sample: PointerSample, activated: boolean) => void;
}

export interface DragGesture {
  down: (sample: PointerSample) => void;
  /** Returns true once the drag is (or has become) active. */
  move: (sample: PointerSample) => boolean;
  up: (sample: PointerSample) => void;
  cancel: (sample?: PointerSample) => void;
  readonly active: boolean;
}

const DEFAULT_ACTIVATION_DISTANCE = 6;
const DEFAULT_TOUCH_ACTIVATION_DELAY_MS = 120;

function distance(a: PointerSample, b: PointerSample): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function createDragGesture(options: DragGestureOptions): DragGesture {
  const activationDistance = options.activationDistance ?? DEFAULT_ACTIVATION_DISTANCE;
  const touchDelay = options.touchActivationDelayMs ?? DEFAULT_TOUCH_ACTIVATION_DELAY_MS;

  let start: PointerSample | null = null;
  let active = false;
  // A touch that moved past tolerance before the dwell — read as a scroll and
  // never allowed to become a drag for the life of this gesture.
  let rejected = false;

  function reset(): void {
    start = null;
    active = false;
    rejected = false;
  }

  return {
    get active() {
      return active;
    },
    down(sample) {
      start = sample;
      active = false;
      rejected = false;
    },
    move(sample) {
      if (!start || rejected) return active;
      if (active) {
        options.onMove(sample);
        return true;
      }
      const moved = distance(start, sample);
      if (moved < activationDistance) return false;

      const isTouch = start.pointerType === 'touch';
      if (isTouch) {
        const elapsed = sample.time - start.time;
        if (elapsed < touchDelay) {
          // Fast move on a touch surface: this is a scroll, not a drag.
          rejected = true;
          return false;
        }
      }
      active = true;
      options.onActivate(sample);
      return true;
    },
    up(sample) {
      const wasActive = active;
      const from = start;
      options.onEnd(sample ?? from ?? sample, wasActive);
      reset();
    },
    cancel(sample) {
      const wasActive = active;
      const fallback = sample ?? start;
      if (fallback) options.onEnd(fallback, wasActive);
      reset();
    },
  };
}
