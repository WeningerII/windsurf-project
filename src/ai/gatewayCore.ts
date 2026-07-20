/**
 * Provider-agnostic gateway core. Pure orchestration: validate the request,
 * route to a fixture (CI/offline) or an injected provider adapter, validate the
 * structured output, and normalize every error into a typed {@link AiFailure}.
 * No provider SDK and no secrets live here — the adapter is injected by the
 * server entry point, so this is unit-testable end-to-end without a network or
 * an API key (the RFC 002 acceptance bar: "CI must run without live calls").
 */
import {
  aiFailure,
  parseAiRequest,
  parseTaskData,
  type AiResponse,
  type AiTask,
} from './contracts';
import { buildGatewayLogRecord, newTraceId, type GatewayLogSink } from './gatewayLog';
import type { RateLimiter } from '../utils/rateLimit';

/**
 * The seam where a real provider lives. `generate` takes a validated request
 * and returns the raw structured output (still untrusted — the core validates
 * its shape). It throws on a provider/transport error; the core normalizes it.
 */
export interface AiProviderAdapter {
  readonly id: string;
  readonly model: string;
  generate(task: AiTask, payload: unknown): Promise<unknown>;
}

export interface GatewayContext {
  /** The provider adapter, or undefined when no key is configured. */
  adapter?: AiProviderAdapter;
  /**
   * Recorded outputs keyed by task, used in CI/offline. When a fixture exists
   * for the requested task it is returned instead of calling the adapter, so
   * tests and key-less environments still exercise the full validation path.
   */
  fixtures?: Partial<Record<AiTask, unknown>>;
  /** Caps the time a single provider call may take (ms). */
  timeoutMs?: number;
  /**
   * Optional per-key request limiter, checked JUST BEFORE the adapter call.
   * Exhaustion degrades to `over-budget` (mapped to HTTP 429), never a throw.
   */
  rateLimiter?: RateLimiter;
  /** The key the limiter buckets on (e.g. a client ip). Defaults to 'global'. */
  rateLimitKey?: string;
  /**
   * Optional structured-log sink, called once at each terminal branch. Injected
   * so tests assert on records without stdout noise (see {@link GatewayLogSink}).
   */
  log?: GatewayLogSink;
  /** Injectable clock (ms) for latency measurement. Defaults to `Date.now`. */
  now?: () => number;
}

const DEFAULT_TIMEOUT_MS = 20_000;

/** Count of prior validation issues a request carried in for a bounded repair. */
function repairCountOf(payload: unknown): number {
  if (payload && typeof payload === 'object' && 'repairIssues' in payload) {
    const issues = (payload as { repairIssues?: unknown }).repairIssues;
    if (Array.isArray(issues)) return issues.length;
  }
  return 0;
}

export async function handleAiRequest(raw: unknown, ctx: GatewayContext): Promise<AiResponse> {
  const now = ctx.now ?? Date.now;
  const startedAt = now();
  const traceId = newTraceId();

  // Emit a structured record (if a sink is wired) and return the response. Called
  // at every terminal branch so observability is complete and consistent.
  const emit = (response: AiResponse, repairCount = 0): AiResponse => {
    ctx.log?.(
      buildGatewayLogRecord({
        response,
        traceId,
        latencyMs: now() - startedAt,
        repairCount,
        adapterId: ctx.adapter?.id,
      })
    );
    return response;
  };

  const parsed = parseAiRequest(raw);
  if (!parsed.ok) {
    // An unknown task is a distinct, more specific failure than a bad payload.
    const code = /unsupported task/i.test(parsed.message) ? 'unsupported-task' : 'invalid-request';
    return emit(aiFailure(code, parsed.message));
  }
  const { task, payload } = parsed.value;
  const repairCount = repairCountOf(payload);

  // Fixture mode: deterministic replay, no provider needed (and not rate-limited —
  // fixtures are the CI/offline path).
  const fixture = ctx.fixtures?.[task];
  if (fixture !== undefined) {
    const validated = parseTaskData(task, fixture);
    if (!validated.ok) {
      return emit(
        aiFailure('invalid-provider-output', `Fixture for '${task}': ${validated.message}`, task),
        repairCount
      );
    }
    return emit(
      { ok: true, task, data: validated.value, usage: { source: 'fixture' } },
      repairCount
    );
  }

  if (!ctx.adapter) {
    return emit(
      aiFailure(
        'provider-not-configured',
        'No AI provider is configured. Use the manual tools instead.',
        task
      ),
      repairCount
    );
  }

  // Rate limit the live provider call. Exhaustion degrades gracefully to
  // over-budget (429) so the client falls back to the manual tools.
  if (ctx.rateLimiter) {
    const verdict = ctx.rateLimiter.check(ctx.rateLimitKey ?? 'global');
    if (!verdict.ok) {
      return emit(
        aiFailure(
          'over-budget',
          'AI request rate limit reached. Use the manual tools for now.',
          task
        ),
        repairCount
      );
    }
  }

  let output: unknown;
  try {
    output = await withTimeout(
      ctx.adapter.generate(task, payload),
      ctx.timeoutMs ?? DEFAULT_TIMEOUT_MS
    );
  } catch (error) {
    if (error instanceof GatewayTimeoutError) {
      return emit(
        aiFailure('timeout', 'The AI provider did not respond in time.', task),
        repairCount
      );
    }
    const message = error instanceof Error ? error.message : 'The AI provider call failed.';
    return emit(aiFailure('provider-error', message, task), repairCount);
  }

  const validated = parseTaskData(task, output);
  if (!validated.ok) {
    return emit(aiFailure('invalid-provider-output', validated.message, task), repairCount);
  }
  return emit(
    {
      ok: true,
      task,
      data: validated.value,
      usage: { source: 'provider', provider: ctx.adapter.id, model: ctx.adapter.model },
    },
    repairCount
  );
}

class GatewayTimeoutError extends Error {}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new GatewayTimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
