import { describe, it, expect, vi } from 'vitest';
import { createDragGesture, type PointerSample } from '../../components/drag/pointerEngine';

function sample(over: Partial<PointerSample> = {}): PointerSample {
  return { x: 0, y: 0, pointerId: 1, pointerType: 'mouse', time: 0, ...over };
}

describe('createDragGesture (scroll-vs-drag disambiguation)', () => {
  it('does NOT activate on a below-tolerance move', () => {
    const onActivate = vi.fn();
    const onMove = vi.fn();
    const gesture = createDragGesture({
      activationDistance: 6,
      onActivate,
      onMove,
      onEnd: vi.fn(),
    });
    gesture.down(sample({ x: 100, y: 100 }));
    const active = gesture.move(sample({ x: 103, y: 101 })); // ~3.16px < 6
    expect(active).toBe(false);
    expect(gesture.active).toBe(false);
    expect(onActivate).not.toHaveBeenCalled();
    expect(onMove).not.toHaveBeenCalled();
  });

  it('activates on an above-tolerance mouse move and then streams moves', () => {
    const onActivate = vi.fn();
    const onMove = vi.fn();
    const gesture = createDragGesture({
      activationDistance: 6,
      onActivate,
      onMove,
      onEnd: vi.fn(),
    });
    gesture.down(sample({ x: 100, y: 100 }));
    expect(gesture.move(sample({ x: 110, y: 100 }))).toBe(true); // 10px >= 6
    expect(onActivate).toHaveBeenCalledTimes(1);
    // Subsequent moves stream, activation fires only once.
    gesture.move(sample({ x: 120, y: 105 }));
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('treats a fast touch move (before the dwell) as a scroll and rejects the gesture', () => {
    const onActivate = vi.fn();
    const gesture = createDragGesture({
      activationDistance: 6,
      touchActivationDelayMs: 120,
      onActivate,
      onMove: vi.fn(),
      onEnd: vi.fn(),
    });
    gesture.down(sample({ x: 0, y: 0, pointerType: 'touch', time: 0 }));
    // Big move only 20ms in — that is a scroll.
    expect(gesture.move(sample({ x: 40, y: 0, pointerType: 'touch', time: 20 }))).toBe(false);
    expect(onActivate).not.toHaveBeenCalled();
    // Even a later, past-dwell move stays rejected (scroll won).
    expect(gesture.move(sample({ x: 80, y: 0, pointerType: 'touch', time: 300 }))).toBe(false);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('activates a touch drag when the move comes after the dwell', () => {
    const onActivate = vi.fn();
    const gesture = createDragGesture({
      activationDistance: 6,
      touchActivationDelayMs: 120,
      onActivate,
      onMove: vi.fn(),
      onEnd: vi.fn(),
    });
    gesture.down(sample({ x: 0, y: 0, pointerType: 'touch', time: 0 }));
    // Small move before the dwell keeps it undecided (not rejected, not active).
    expect(gesture.move(sample({ x: 2, y: 0, pointerType: 'touch', time: 50 }))).toBe(false);
    // A past-dwell move past tolerance activates.
    expect(gesture.move(sample({ x: 20, y: 0, pointerType: 'touch', time: 300 }))).toBe(true);
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('emits end with activated=true after a drag and false for a plain click', () => {
    const onEndDrag = vi.fn();
    const drag = createDragGesture({
      activationDistance: 6,
      onActivate: vi.fn(),
      onMove: vi.fn(),
      onEnd: onEndDrag,
    });
    drag.down(sample({ x: 0, y: 0 }));
    drag.move(sample({ x: 20, y: 0 }));
    drag.up(sample({ x: 20, y: 0 }));
    expect(onEndDrag).toHaveBeenCalledWith(expect.objectContaining({ x: 20 }), true);

    const onEndClick = vi.fn();
    const click = createDragGesture({
      activationDistance: 6,
      onActivate: vi.fn(),
      onMove: vi.fn(),
      onEnd: onEndClick,
    });
    click.down(sample({ x: 0, y: 0 }));
    click.up(sample({ x: 1, y: 0 }));
    expect(onEndClick).toHaveBeenCalledWith(expect.anything(), false);
  });

  it('cancel ends the gesture and resets state', () => {
    const onEnd = vi.fn();
    const gesture = createDragGesture({
      activationDistance: 6,
      onActivate: vi.fn(),
      onMove: vi.fn(),
      onEnd,
    });
    gesture.down(sample({ x: 0, y: 0 }));
    gesture.move(sample({ x: 20, y: 0 }));
    gesture.cancel(sample({ x: 20, y: 0 }));
    expect(onEnd).toHaveBeenCalledWith(expect.anything(), true);
    expect(gesture.active).toBe(false);
    // After cancel a stray move is ignored (no start).
    expect(gesture.move(sample({ x: 999, y: 0 }))).toBe(false);
  });
});
