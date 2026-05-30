import { useEffect, useMemo, useRef } from 'react';
import { debounce } from '../utils/performance';

/**
 * Debounced-write machinery shared by the local-first collection hooks
 * (`useDocuments`, `useCampaigns`, `useScenes`). Owns the parts that were
 * copy-pasted across all three:
 *
 *   - A monotonic version token so a stale in-flight write (e.g. from an async
 *     load that resolves after a newer edit) is dropped instead of clobbering
 *     current state.
 *   - A debounced write, guarded by that token.
 *   - Lifecycle flushing: on unmount and on `pagehide` / `beforeunload` /
 *     `visibilitychange→hidden`, so pending edits are not lost when the tab is
 *     backgrounded or closed.
 *
 * The owning hook keeps its own state, load path, and mutators; it only borrows
 * the persistence plumbing here.
 */
export interface DebouncedPersistence<T> {
  /**
   * Start a new write generation and return its token. Call this *outside* the
   * `setState` updater (the updater may run twice under StrictMode, which would
   * otherwise bump the token twice), then pass the token to `persist`.
   */
  beginVersion: () => number;
  /** Schedule a debounced write, dropped if `version` is no longer current. */
  persist: (value: T, version: number) => void;
  /** Flush any pending write immediately. */
  flush: () => void;
  /** Cancel any pending write (e.g. before a hard reset). */
  cancel: () => void;
}

export function useDebouncedPersistence<T>(
  write: (value: T) => void,
  delay = 300
): DebouncedPersistence<T> {
  const versionRef = useRef(0);

  const debounced = useMemo(
    () =>
      debounce((value: T, version: number) => {
        if (version !== versionRef.current) return;
        write(value);
      }, delay),
    [write, delay]
  );

  // Flush on unmount.
  useEffect(() => () => debounced.flush(), [debounced]);

  // Flush when the tab is backgrounded or closed.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const flushPersist = () => {
      debounced.flush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPersist();
      }
    };

    window.addEventListener('pagehide', flushPersist);
    window.addEventListener('beforeunload', flushPersist);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', flushPersist);
      window.removeEventListener('beforeunload', flushPersist);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [debounced]);

  return useMemo(
    () => ({
      beginVersion: () => (versionRef.current += 1),
      persist: (value: T, version: number) => debounced(value, version),
      flush: () => debounced.flush(),
      cancel: () => debounced.cancel(),
    }),
    [debounced]
  );
}
