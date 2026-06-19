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
}

const DEFAULT_TIMEOUT_MS = 20_000;

export async function handleAiRequest(raw: unknown, ctx: GatewayContext): Promise<AiResponse> {
  const parsed = parseAiRequest(raw);
  if (!parsed.ok) {
    // An unknown task is a distinct, more specific failure than a bad payload.
    const code = /unsupported task/i.test(parsed.message) ? 'unsupported-task' : 'invalid-request';
    return aiFailure(code, parsed.message);
  }
  const { task, payload } = parsed.value;

  // Fixture mode: deterministic replay, no provider needed.
  const fixture = ctx.fixtures?.[task];
  if (fixture !== undefined) {
    const validated = parseTaskData(task, fixture);
    if (!validated.ok) {
      return aiFailure(
        'invalid-provider-output',
        `Fixture for '${task}': ${validated.message}`,
        task
      );
    }
    return { ok: true, task, data: validated.value, usage: { source: 'fixture' } };
  }

  if (!ctx.adapter) {
    return aiFailure(
      'provider-not-configured',
      'No AI provider is configured. Use the manual tools instead.',
      task
    );
  }

  let output: unknown;
  try {
    output = await withTimeout(
      ctx.adapter.generate(task, payload),
      ctx.timeoutMs ?? DEFAULT_TIMEOUT_MS
    );
  } catch (error) {
    if (error instanceof GatewayTimeoutError) {
      return aiFailure('timeout', 'The AI provider did not respond in time.', task);
    }
    const message = error instanceof Error ? error.message : 'The AI provider call failed.';
    return aiFailure('provider-error', message, task);
  }

  const validated = parseTaskData(task, output);
  if (!validated.ok) {
    return aiFailure('invalid-provider-output', validated.message, task);
  }
  return {
    ok: true,
    task,
    data: validated.value,
    usage: { source: 'provider', provider: ctx.adapter.id, model: ctx.adapter.model },
  };
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
