import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStableListKeys } from '../../../systems/daggerheart/useStableListKeys';

describe('useStableListKeys', () => {
  it('keeps existing keys stable when the list grows', () => {
    const { result, rerender } = renderHook(({ length }) => useStableListKeys(length), {
      initialProps: { length: 2 },
    });
    const [first, second] = result.current.keys;

    rerender({ length: 3 });

    expect(result.current.keys).toHaveLength(3);
    expect(result.current.keys[0]).toBe(first);
    expect(result.current.keys[1]).toBe(second);
    expect(new Set(result.current.keys).size).toBe(3);
  });

  it('removes the key for the deleted row so later rows keep their identity', () => {
    const { result, rerender } = renderHook(({ length }) => useStableListKeys(length), {
      initialProps: { length: 3 },
    });
    const [, , third] = result.current.keys;

    // Simulate the remove handler: drop the key for row 1, then the list
    // shrinks on the next render.
    result.current.removeKeyAt(1);
    rerender({ length: 2 });

    expect(result.current.keys).toHaveLength(2);
    // Row that was index 2 keeps its key at index 1 — index keys would have
    // reused the deleted row's DOM node instead.
    expect(result.current.keys[1]).toBe(third);
  });

  it('truncates extra keys when the list shrinks externally', () => {
    const { result, rerender } = renderHook(({ length }) => useStableListKeys(length), {
      initialProps: { length: 3 },
    });
    const [first] = result.current.keys;

    rerender({ length: 1 });

    expect(result.current.keys).toHaveLength(1);
    expect(result.current.keys[0]).toBe(first);
  });
});
