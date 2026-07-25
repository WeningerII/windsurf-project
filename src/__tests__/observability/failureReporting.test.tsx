/**
 * Observability gate: the two failure paths that are supposed to reach
 * production monitoring actually report.
 *
 * `docs/runbooks/sentry-alerts.md` defines alert rules (b) "AI-gateway failure"
 * and (c) "Supabase sync failures". Both were listed as DORMANT because the
 * code swallowed those failures — the sync hook caught into `syncState:'error'`
 * and the gateway client degraded silently, so nothing ever reached Sentry.
 * These tests are what keep the seams wired: delete either `errorLogger.log`
 * call and the corresponding alert rule goes back to being decorative, and this
 * suite goes red.
 *
 * They also pin the NEGATIVE half, which matters just as much: by-design
 * outcomes (rate-limit/budget 429s, auth, an unconfigured provider) must NOT be
 * reported, or the alert drowns in intended behaviour.
 */
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../../contexts/auth-context';
import { useEntitySync, type EntitySyncAdapter } from '../../hooks/useEntitySync';
import { callAiGateway } from '../../ai/gatewayClient';
import { ErrorCategory, errorLogger, ErrorSeverity } from '../../utils/errorLogger';

vi.mock('../../utils/supabaseClient', () => ({
  getSupabaseClient: vi.fn(() => null),
}));

type Entity = { id: string };

const authValue: AuthContextValue = {
  session: null,
  user: { id: 'user-1' } as AuthContextValue['user'],
  isLoading: false,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => {},
  isConfigured: true,
};

function Wrapper({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

function makeAdapter(
  overrides: Partial<EntitySyncAdapter<Entity>> = {}
): EntitySyncAdapter<Entity> {
  return {
    sameSignatures: () => true,
    merge: (local) => local,
    fetchRemote: async () => ({ entities: [], tombstones: [] }),
    push: async () => {},
    deleteRemote: async () => {},
    restoreRemote: async () => {},
    subscribeToRemote: () => undefined,
    queueSnapshot: () => {},
    clearQueuedSnapshot: () => {},
    getQueuedSnapshot: () => [],
    queueDeletedIds: () => {},
    clearQueuedDeletedIds: () => {},
    getQueuedDeletedIds: () => [],
    recordTombstones: () => {},
    getTombstonedIds: () => [],
    removeTombstones: () => {},
    ...overrides,
  };
}

type LogArgs = Parameters<typeof errorLogger.log>;

let logSpy: ReturnType<typeof vi.spyOn>;

/** The recorded `errorLogger.log` calls, typed as the method's own parameters. */
function logCalls(): LogArgs[] {
  return logSpy.mock.calls as unknown as LogArgs[];
}

beforeEach(() => {
  // Spy on the funnel, not on Sentry: `errorLogger.log` is the single seam the
  // runbook's rules key off (severity HIGH/CRITICAL is what it forwards).
  logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function reportedContexts(): Record<string, unknown>[] {
  return logCalls()
    .filter((call) => call[0] === ErrorCategory.NETWORK && call[1] === ErrorSeverity.HIGH)
    .map((call) => (call[4] ?? {}) as Record<string, unknown>);
}

// Stable identities: `useEntitySync` keys its effects off `entities`, `onMerge`,
// and `adapter`, so inline literals would re-run the initial sync every render
// and never settle.
const NO_ENTITIES: Entity[] = [];

describe('sync failures reach monitoring (sentry-alerts.md rule c)', () => {
  it('reports when the initial sync throws', async () => {
    const onMerge = vi.fn();
    const adapter = makeAdapter({
      fetchRemote: async () => {
        throw new Error('supabase unreachable');
      },
    });

    const { result } = renderHook(
      () => useEntitySync<Entity>({ entities: NO_ENTITIES, onMerge, adapter }),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.syncState).toBe('error'));
    await waitFor(() =>
      expect(reportedContexts()).toContainEqual({ surface: 'sync', stage: 'sync' })
    );

    // The failure is still swallowed into the state machine — reporting is
    // additive and must not change local-first behaviour.
    expect(result.current.syncState).toBe('error');
  });

  it('reports the failure with the thrown Error, not user content', async () => {
    const thrown = new Error('supabase unreachable');
    const onMerge = vi.fn();
    const adapter = makeAdapter({
      fetchRemote: async () => {
        throw thrown;
      },
    });

    renderHook(() => useEntitySync<Entity>({ entities: NO_ENTITIES, onMerge, adapter }), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(logSpy).toHaveBeenCalled());

    const call = logCalls().find((entry) => entry[0] === ErrorCategory.NETWORK);
    expect(call?.[2]).toBe('sync failed');
    expect(call?.[3]).toBe(thrown);
    // No entities, names, or notes may ride along to Sentry.
    expect(call?.[4]).toEqual({ surface: 'sync', stage: 'sync' });
  });

  it('does not report when sync succeeds', async () => {
    const onMerge = vi.fn();
    const adapter = makeAdapter();
    const { result } = renderHook(
      () => useEntitySync<Entity>({ entities: NO_ENTITIES, onMerge, adapter }),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.syncState).toBe('idle'));
    expect(reportedContexts()).toHaveLength(0);
  });
});

describe('AI gateway failures reach monitoring (sentry-alerts.md rule b)', () => {
  const payload = { systemId: 'dnd-5e-2024', prompt: 'x' };

  function jsonResponse(body: unknown): Response {
    return { json: async () => body } as Response;
  }

  it('reports a transport failure', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      })
    );

    const res = await callAiGateway('encounter-draft', payload);

    expect(res).toMatchObject({ ok: false, code: 'provider-error' });
    expect(reportedContexts()).toContainEqual({
      surface: 'ai',
      task: 'encounter-draft',
      code: 'transport-error',
    });
  });

  it('reports a malformed gateway response', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ nonsense: true }))
    );

    await callAiGateway('encounter-draft', payload);

    expect(reportedContexts()).toContainEqual({
      surface: 'ai',
      task: 'encounter-draft',
      code: 'malformed-response',
    });
  });

  it('reports a server-side provider failure and carries the traceId for correlation', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({
          ok: false,
          task: 'encounter-draft',
          code: 'provider-error',
          message: 'upstream 500',
          traceId: 'ai-abc123',
        })
      )
    );

    await callAiGateway('encounter-draft', payload);

    // traceId is the join key to the function's own structured record
    // (src/ai/gatewayLog.ts), which is how an alert becomes debuggable.
    expect(reportedContexts()).toContainEqual({
      surface: 'ai',
      task: 'encounter-draft',
      code: 'provider-error',
      traceId: 'ai-abc123',
    });
  });

  it.each([
    'over-budget',
    'budget-exceeded',
    'unauthorized',
    'provider-not-configured',
    'invalid-request',
    'unsupported-task',
  ])('does NOT report %s — that is the gateway working as designed', async (code) => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ ok: false, task: 'encounter-draft', code, message: 'no' }))
    );

    await callAiGateway('encounter-draft', payload);

    expect(reportedContexts()).toHaveLength(0);
  });

  it('does not report a successful call', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({
          ok: true,
          task: 'encounter-draft',
          data: { selections: [] },
          usage: { source: 'fixture' },
        })
      )
    );

    await callAiGateway('encounter-draft', payload);

    expect(reportedContexts()).toHaveLength(0);
  });

  it('does not report when AI is turned off (no call is made at all)', async () => {
    vi.stubEnv('VITE_AI_ENABLED', '');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    await callAiGateway('encounter-draft', payload);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(reportedContexts()).toHaveLength(0);
  });
});
