import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  SceneDispatchContext,
  useSceneDispatch,
  type SceneEmit,
} from '../../contexts/scene-dispatch-context';
import type { SceneActionIntent } from '../../types/core/scene';

const intent: SceneActionIntent = {
  type: 'place-token',
  token: { id: 't1', name: 'Aria', kind: 'character', position: { x: 1, y: 2 }, size: 1 },
};

function Consumer({ onResult }: { onResult: (value: boolean) => void }) {
  const emit = useSceneDispatch();
  onResult(emit(intent));
  return null;
}

describe('SceneDispatchContext (zero-arg bound emit seam)', () => {
  it('forwards the intent to the published emit and returns its boolean', () => {
    const bound: SceneEmit = vi.fn(() => true);
    const onResult = vi.fn();
    render(
      <SceneDispatchContext.Provider value={bound}>
        <Consumer onResult={onResult} />
      </SceneDispatchContext.Provider>
    );
    expect(bound).toHaveBeenCalledWith(intent);
    expect(onResult).toHaveBeenCalledWith(true);
  });

  it('propagates a false result (e.g. a rejected / stale-scene emit)', () => {
    const bound: SceneEmit = vi.fn(() => false);
    const onResult = vi.fn();
    render(
      <SceneDispatchContext.Provider value={bound}>
        <Consumer onResult={onResult} />
      </SceneDispatchContext.Provider>
    );
    expect(onResult).toHaveBeenCalledWith(false);
  });

  it('is a no-op returning false with no provider (never targets a stale scene)', () => {
    const onResult = vi.fn();
    render(<Consumer onResult={onResult} />);
    expect(onResult).toHaveBeenCalledWith(false);
  });
});
