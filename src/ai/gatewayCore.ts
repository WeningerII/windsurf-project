/**
 * Provider-agnostic gateway core. Pure orchestration: validate the request,
 * route to a fixture (CI/offline) or an injected provider adapter, validate the
 * structured output, and normalize every error into a typed {@link AiFailure}.
 * No provider SDK and no secrets live here — the adapter is injected by the
 * server entry point, so this is unit-testable end-to-end without a network or
 * an API key (the RFC 002 acceptance bar: "CI must run without live calls").
 */
import {
  AI_TASK_CLASS,
  AI_TASK_UNIT_COST,
  aiFailure,
  parseAiRequest,
  parseTaskData,
  type AiResponse,
  type AiTask,
  type AiTaskClass,
} from './contracts';
import { buildGatewayLogRecord, newTraceId, type GatewayLogSink } from './gatewayLog';
import { promptVersionForTask } from './prompts';
import type { RateLimiter } from '../utils/rateLimit';

/**
 * The seam where a real provider lives. `generate` takes a validated request
 * and returns the raw structured output (still untrusted — the core validates
 * its shape). It throws on a provider/transport error; the core normalizes it.
 */
export interface AiProviderAdapter {
  readonly id: string;
  readonly model: string;
  /**
   * The model that actually serves `task`, when it differs from {@link model}
   * (e.g. an image-generation model for image tasks). Metadata normalization
   * (Phase 14): the core stamps `usage.model` and the trace log with this, so
   * traces name the model that really ran, not just the adapter's default.
   */
  modelFor?(task: AiTask): string;
  generate(task: AiTask, payload: unknown): Promise<unknown>;
}

/** The normalized model id for a task: the per-task override, else the default. */
function modelForTask(adapter: AiProviderAdapter, task: AiTask): string {
  return adapter.modelFor?.(task) ?? adapter.model;
}

/** Verdict from charging a session's cost budget (post-charge accounting). */
export interface SessionBudgetVerdict {
  ok: boolean;
  /** Units left before the cap, floored at 0. */
  remainingUnits: number;
  /** Epoch ms when the session's budget window resets. */
  resetAt: number;
}

/**
 * The session cost-cap seam (Phase 14). `charge` counts `units` against `key`'s
 * budget and reports whether the cumulative spend is still within the cap.
 * Synchronous and pure-consumable like {@link RateLimiter}; the server adapts a
 * durable-capable store into it (`sessionBudgetFromStore` in
 * `netlify/functions/rateLimitStore.mts`).
 */
export interface SessionBudget {
  charge(key: string, units: number): SessionBudgetVerdict;
}

/**
 * Default per-task-class latency budgets (ms). The budget is BOTH the hard cap
 * handed to `withTimeout` for the provider call and the threshold for the
 * `latencyBudgetExceeded` log flag. `GatewayContext.timeoutMs`, when set,
 * overrides every class (back-compat with the single-knob timeout).
 */
export const DEFAULT_LATENCY_BUDGET_MS: Record<AiTaskClass, number> = {
  text: 10_000,
  vision: 15_000,
  image: 25_000,
};

export interface GatewayContext {
  /** The provider adapter, or undefined when no key is configured. */
  adapter?: AiProviderAdapter;
  /**
   * Recorded outputs keyed by task, used in CI/offline. When a fixture exists
   * for the requested task it is returned instead of calling the adapter, so
   * tests and key-less environments still exercise the full validation path.
   */
  fixtures?: Partial<Record<AiTask, unknown>>;
  /**
   * Single-knob override for the provider-call time cap (ms). When unset, the
   * per-task-class latency budget applies ({@link DEFAULT_LATENCY_BUDGET_MS},
   * overridable via `latencyBudgets`).
   */
  timeoutMs?: number;
  /**
   * Optional per-key request limiter, checked JUST BEFORE the adapter call.
   * Exhaustion degrades to `over-budget` (mapped to HTTP 429), never a throw.
   */
  rateLimiter?: RateLimiter;
  /** The key the limiter buckets on (e.g. a client ip). Defaults to 'global'. */
  rateLimitKey?: string;
  /**
   * Optional session cost cap, charged JUST BEFORE the adapter call with the
   * task's deterministic unit cost ({@link AI_TASK_UNIT_COST}). Exhaustion
   * degrades to the typed `budget-exceeded` failure (HTTP 429), never a throw.
   * Fixture replay is never charged — it costs no provider spend.
   */
  sessionBudget?: SessionBudget;
  /**
   * The key the session budget buckets on — the authenticated user id when the
   * JWT authorizer supplied one (see `gatewayHttp.ts`), else e.g. a client ip.
   * Defaults to 'global'.
   */
  sessionKey?: string;
  /**
   * Per-task-class latency budgets (ms), overriding
   * {@link DEFAULT_LATENCY_BUDGET_MS} per class. `timeoutMs` overrides both.
   */
  latencyBudgets?: Partial<Record<AiTaskClass, number>>;
  /**
   * Injectable trace-id factory for deterministic golden trace tests.
   * Defaults to {@link newTraceId}.
   */
  traceIdFactory?: () => string;
  /**
   * Optional structured-log sink, called once at each terminal branch. Injected
   * so tests assert on records without stdout noise (see {@link GatewayLogSink}).
   */
  log?: GatewayLogSink;
  /** Injectable clock (ms) for latency measurement. Defaults to `Date.now`. */
  now?: () => number;
}

/** Count of prior validation issues a request carried in for a bounded repair. */
function repairCountOf(payload: unknown): number {
  if (payload && typeof payload === 'object' && 'repairIssues' in payload) {
    const issues = (payload as { repairIssues?: unknown }).repairIssues;
    if (Array.isArray(issues)) return issues.length;
  }
  return 0;
}

/**
 * The effective latency budget for a task (ms): the single-knob `timeoutMs`
 * override when set, else the task-class budget from context, else the default
 * class budget. Doubles as the hard `withTimeout` cap for the provider call.
 */
function latencyBudgetFor(task: AiTask, ctx: GatewayContext): number {
  const taskClass = AI_TASK_CLASS[task];
  return ctx.timeoutMs ?? ctx.latencyBudgets?.[taskClass] ?? DEFAULT_LATENCY_BUDGET_MS[taskClass];
}

export async function handleAiRequest(raw: unknown, ctx: GatewayContext): Promise<AiResponse> {
  const now = ctx.now ?? Date.now;
  const startedAt = now();
  const traceId = (ctx.traceIdFactory ?? newTraceId)();

  // Stamp trace + prompt-version metadata and emit a structured record (if a
  // sink is wired). Called at every terminal branch so observability is
  // complete and consistent, and the trace id connects the log record to the
  // response the user sees.
  const emit = (response: AiResponse, repairCount = 0): AiResponse => {
    const promptVersion = response.task ? promptVersionForTask(response.task) : undefined;
    const stamped: AiResponse = response.ok
      ? {
          ...response,
          traceId,
          usage: { ...response.usage, ...(promptVersion ? { promptVersion } : {}) },
        }
      : { ...response, traceId };
    ctx.log?.(
      buildGatewayLogRecord({
        response: stamped,
        traceId,
        latencyMs: now() - startedAt,
        repairCount,
        adapterId: ctx.adapter?.id,
        ...(promptVersion ? { promptVersion } : {}),
        ...(response.task ? { latencyBudgetMs: latencyBudgetFor(response.task, ctx) } : {}),
      })
    );
    return stamped;
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

  // Session cost cap: charge the task's deterministic unit cost before spending
  // provider money. A tripped cap degrades to the typed `budget-exceeded`
  // failure (429) so the client falls back to the manual tools; the crossing
  // request's units stay counted, so the cap stays tripped until the window
  // resets.
  if (ctx.sessionBudget) {
    const verdict = ctx.sessionBudget.charge(ctx.sessionKey ?? 'global', AI_TASK_UNIT_COST[task]);
    if (!verdict.ok) {
      return emit(
        aiFailure(
          'budget-exceeded',
          'The AI budget for this session is used up. Use the manual tools instead.',
          task
        ),
        repairCount
      );
    }
  }

  let output: unknown;
  try {
    output = await withTimeout(ctx.adapter.generate(task, payload), latencyBudgetFor(task, ctx));
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
      usage: {
        source: 'provider',
        provider: ctx.adapter.id,
        model: modelForTask(ctx.adapter, task),
      },
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
