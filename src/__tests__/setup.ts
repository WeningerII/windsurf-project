import { expect, afterEach, vi } from 'vitest';
import { cleanup, configure } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
// Keep waitFor's timeout comfortably below vitest's testTimeout (10s/15s in
// vitest.config.ts) so a hanging waitFor fails with its own diagnostics
// (last error + DOM dump) instead of an opaque test-timeout.
configure({ asyncUtilTimeout: 5000 });

afterEach(() => {
  cleanup();
  // Restore spies created with vi.spyOn (e.g. Math.random pins) even when a
  // test fails mid-body — a leaked spy otherwise cascades misleading failures
  // through the rest of the file. restoreAllMocks does not touch vi.fn()
  // module mocks, so clearAllMocks still runs to clear their call history.
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
