import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../../contexts/auth-context';
import { useEntitySync, type EntitySyncAdapter } from '../../hooks/useEntitySync';
import type { RemoteFetchResult } from '../../utils/syncEngine';

/**
 * Direct coverage for the Phase-2 `active` pause/resume-WITH-RECONCILE knob on
 * the generic sync engine. Before Phase 2 these branches did not exist; the
 * subscription-gate and the false->true reconcile are exercised here against a
 * fully faked adapter so the behaviour is asserted independently of the
 * document/campaign adapters that thread `active` through.
 */

interface Item {
  id: string;
  updatedAt: Date;
}

function makeItem(id: string, updatedAt = new Date('2026-01-02T00:00:00.000Z')): Item {
  return { id, updatedAt };
}

/** A stable, fully-stubbed adapter — every member is a vi.fn or pure helper. */
function makeAdapter(overrides: Partial<EntitySyncAdapter<Item>> = {}): EntitySyncAdapter<Item> {
  return {
    sameSignatures: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.updatedAt.getTime() === b[index]?.updatedAt.getTime()
      ),
    merge: (local, remote) => {
      const merged = new Map<string, Item>();
      [...remote, ...local].forEach((item) => merged.set(item.id, item));
      return Array.from(merged.values());
    },
    fetchRemote: vi.fn<() => Promise<RemoteFetchResult<Item>>>().mockResolvedValue({
      entities: [],
      tombstones: [],
    }),
    push: vi.fn().mockResolvedValue(undefined),
    deleteRemote: vi.fn().mockResolvedValue(undefined),
    restoreRemote: vi.fn().mockResolvedValue(undefined),
    subscribeToRemote: vi.fn().mockReturnValue(vi.fn()),
    queueSnapshot: vi.fn(),
    clearQueuedSnapshot: vi.fn(),
    getQueuedSnapshot: vi.fn().mockReturnValue([]),
    queueDeletedIds: vi.fn(),
    clearQueuedDeletedIds: vi.fn(),
    getQueuedDeletedIds: vi.fn().mockReturnValue([]),
    recordTombstones: vi.fn(),
    getTombstonedIds: vi.fn().mockReturnValue([]),
    removeTombstones: vi.fn(),
    ...overrides,
  };
}

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, value });
}

const baseAuthValue: AuthContextValue = {
  session: null,
  user: { id: 'user-1' } as AuthContextValue['user'],
  isLoading: false,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => {},
  isConfigured: true,
};

function createWrapper(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = { ...baseAuthValue, ...overrides };
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
}

describe('useEntitySync active pause/resume-with-reconcile', () => {
  beforeEach(() => {
    setNavigatorOnline(true);
  });

  it('does NOT open a realtime subscription while active is false', async () => {
    const adapter = makeAdapter();
    const onMerge = vi.fn();

    renderHook(
      () => useEntitySync({ entities: [makeItem('a')], onMerge, adapter, active: false }),
      { wrapper: createWrapper() }
    );

    // The initial sign-in sync still runs (it is not gated), but the
    // subscription — the ONLY thing `active` gates — must be skipped.
    await waitFor(() => {
      expect(adapter.fetchRemote).toHaveBeenCalledTimes(1);
    });
    expect(adapter.subscribeToRemote).not.toHaveBeenCalled();
  });

  it('subscribes and does NOT double-fire the initial sync when active is true on mount', async () => {
    const adapter = makeAdapter();
    const onMerge = vi.fn();

    renderHook(() => useEntitySync({ entities: [makeItem('a')], onMerge, adapter, active: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(adapter.subscribeToRemote).toHaveBeenCalledTimes(1);
    });
    // A true->true "transition" is a no-op: only the initial-sync effect ran.
    expect(adapter.fetchRemote).toHaveBeenCalledTimes(1);
  });

  it('runs exactly one reconciling sync and re-subscribes on a false->true flip', async () => {
    const adapter = makeAdapter();
    const onMerge = vi.fn();

    const { rerender } = renderHook(
      ({ active }) => useEntitySync({ entities: [makeItem('a')], onMerge, adapter, active }),
      { initialProps: { active: false }, wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(adapter.fetchRemote).toHaveBeenCalledTimes(1);
    });
    expect(adapter.subscribeToRemote).not.toHaveBeenCalled();

    act(() => {
      rerender({ active: true });
    });

    // Resume: the reconcile fires exactly one more sync (fetch #2) AND the
    // subscription is now (re-)opened.
    await waitFor(() => {
      expect(adapter.fetchRemote).toHaveBeenCalledTimes(2);
      expect(adapter.subscribeToRemote).toHaveBeenCalledTimes(1);
    });
  });

  it('still pushes local edits while active is false (the push is never gated)', async () => {
    const adapter = makeAdapter();
    const onMerge = vi.fn();

    const { rerender } = renderHook(
      ({ entities }) => useEntitySync({ entities, onMerge, adapter, active: false }),
      {
        initialProps: { entities: [makeItem('a', new Date('2026-01-02T00:00:00.000Z'))] },
        wrapper: createWrapper(),
      }
    );

    // Wait for the initial sync so the change-detection effect is armed.
    await waitFor(() => {
      expect(adapter.fetchRemote).toHaveBeenCalledTimes(1);
    });

    act(() => {
      rerender({ entities: [makeItem('a', new Date('2026-01-03T00:00:00.000Z'))] });
    });

    // Debounced push (300ms) fires despite the surface being paused.
    await waitFor(() => {
      expect(adapter.push).toHaveBeenCalled();
    });
  });

  it('defers a reconcile that races an in-flight sync, then re-runs it once', async () => {
    let resolveFirstFetch: ((value: RemoteFetchResult<Item>) => void) | undefined;
    const fetchRemote = vi
      .fn<() => Promise<RemoteFetchResult<Item>>>()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirstFetch = resolve;
          })
      )
      .mockResolvedValue({ entities: [], tombstones: [] });
    const adapter = makeAdapter({ fetchRemote });
    const onMerge = vi.fn();

    const { rerender } = renderHook(
      ({ active }) => useEntitySync({ entities: [makeItem('a')], onMerge, adapter, active }),
      { initialProps: { active: false }, wrapper: createWrapper() }
    );

    // The mount initial sync is in flight (its fetch is unresolved).
    await waitFor(() => {
      expect(fetchRemote).toHaveBeenCalledTimes(1);
    });

    // Resume mid-flight: the reconcile must NOT start a parallel sync.
    act(() => {
      rerender({ active: true });
    });
    expect(fetchRemote).toHaveBeenCalledTimes(1);

    // Let the first sync settle: its finally re-runs the deferred reconcile.
    await act(async () => {
      resolveFirstFetch?.({ entities: [], tombstones: [] });
    });

    await waitFor(() => {
      expect(fetchRemote).toHaveBeenCalledTimes(2);
    });
  });
});
