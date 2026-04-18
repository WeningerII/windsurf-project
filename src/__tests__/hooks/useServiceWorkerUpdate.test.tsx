import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useServiceWorkerUpdate } from '../../hooks/useServiceWorkerUpdate';

/**
 * These tests cover the deterministic, synchronous parts of the hook:
 *   - it is a no-op in environments without serviceWorker support
 *   - applyUpdate is a safe no-op when no worker is waiting
 *
 * The full async state machine (registering, `updatefound`, `statechange`,
 * `controllerchange`, reload) is intentionally not unit-tested.  That flow
 * spans a real browser's SW lifecycle and can only be exercised reliably
 * end-to-end.  Unit tests that drive it via synthesized events against a
 * DOM mock add flakiness (pending Promise continuations firing into torn-
 * down React roots) without meaningfully validating the contract.
 */

let savedServiceWorker: PropertyDescriptor | undefined;
let hadOwnServiceWorker = false;

afterEach(() => {
  if (hadOwnServiceWorker && savedServiceWorker !== undefined) {
    Object.defineProperty(navigator, 'serviceWorker', savedServiceWorker);
  }
  savedServiceWorker = undefined;
  hadOwnServiceWorker = false;
});

function removeServiceWorkerSupport(): void {
  hadOwnServiceWorker = Object.prototype.hasOwnProperty.call(navigator, 'serviceWorker');
  savedServiceWorker = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
  // Reflect.deleteProperty avoids the TS "operand of delete must be
  // optional" constraint and reliably drops the key so that
  // `'serviceWorker' in navigator` evaluates to false.
  Reflect.deleteProperty(navigator, 'serviceWorker');
}

describe('useServiceWorkerUpdate', () => {
  it('is a no-op when serviceWorker is unsupported', () => {
    removeServiceWorkerSupport();
    const { result } = renderHook(() => useServiceWorkerUpdate());
    expect(result.current.updateAvailable).toBe(false);
  });

  it('applyUpdate is a safe no-op when no worker is waiting', () => {
    removeServiceWorkerSupport();
    const { result } = renderHook(() => useServiceWorkerUpdate());
    expect(() => result.current.applyUpdate()).not.toThrow();
    expect(result.current.updateAvailable).toBe(false);
  });
});
