/**
 * Structured observability for the AI gateway (RFC 002 — observability layer).
 *
 * Pure and SDK-free: it turns a terminal gateway {@link AiResponse} into a flat
 * record (task, traceId, provider/adapter id, latency, failure kind, repair
 * count) and hands it to an injectable sink. The core calls the sink once at
 * every terminal branch, so tests assert on emitted records without stdout
 * noise, and production wires a console sink that respects the `no-console`
 * rule (warn/error only).
 */
import type { AiFailureCode, AiResponse, AiTask } from './contracts';

/** One structured observation of a completed gateway request. */
export interface GatewayLogRecord {
  event: 'ai-gateway';
  /** Correlates this request across logs. */
  traceId: string;
  /** The task, when the request parsed far enough to know it. */
  task?: AiTask;
  outcome: 'success' | 'failure';
  /** Where a successful result came from. */
  source?: 'provider' | 'fixture';
  /** The adapter id that served or was attempted (e.g. 'google', 'mock'). */
  provider?: string;
  /** The model id, when a provider served the request. */
  model?: string;
  /** Normalized failure reason, on the failure path. */
  failureCode?: AiFailureCode;
  /** The prompt-template version for the task, when the task is known. */
  promptVersion?: string;
  /** Wall-clock time spent handling the request (ms). */
  latencyMs: number;
  /** The task-class latency budget in effect (ms), when the task is known. */
  latencyBudgetMs?: number;
  /** Whether `latencyMs` exceeded `latencyBudgetMs` (present iff a budget was). */
  latencyBudgetExceeded?: boolean;
  /** How many prior validation issues this request carried in for repair. */
  repairCount: number;
}

/** The seam a caller injects to receive log records (default: a console sink). */
export type GatewayLogSink = (record: GatewayLogRecord) => void;

export interface BuildGatewayLogRecordInput {
  response: AiResponse;
  traceId: string;
  latencyMs: number;
  repairCount?: number;
  /** The adapter attempted, so failures still record which provider was tried. */
  adapterId?: string;
  /** The prompt-template version for the task, when known. */
  promptVersion?: string;
  /** The task-class latency budget in effect; enables the exceedance flag. */
  latencyBudgetMs?: number;
}

/** Flatten a terminal gateway response into a {@link GatewayLogRecord}. */
export function buildGatewayLogRecord(input: BuildGatewayLogRecordInput): GatewayLogRecord {
  const { response, traceId, latencyMs } = input;
  const base: GatewayLogRecord = {
    event: 'ai-gateway',
    traceId,
    outcome: response.ok ? 'success' : 'failure',
    latencyMs,
    repairCount: input.repairCount ?? 0,
    ...(response.task ? { task: response.task } : {}),
    ...(input.promptVersion ? { promptVersion: input.promptVersion } : {}),
    ...(input.latencyBudgetMs !== undefined
      ? {
          latencyBudgetMs: input.latencyBudgetMs,
          latencyBudgetExceeded: latencyMs > input.latencyBudgetMs,
        }
      : {}),
  };

  if (response.ok) {
    return {
      ...base,
      source: response.usage.source,
      ...(response.usage.provider ? { provider: response.usage.provider } : {}),
      ...(response.usage.model ? { model: response.usage.model } : {}),
    };
  }

  return {
    ...base,
    failureCode: response.code,
    ...(input.adapterId ? { provider: input.adapterId } : {}),
  };
}

/**
 * A short, low-collision trace id. `rand` is injectable so tests get stable
 * ids; production uses `Math.random`. Not security-sensitive — correlation only.
 */
export function newTraceId(rand: () => number = Math.random): string {
  const part = () =>
    Math.floor(rand() * 0xffffffff)
      .toString(36)
      .padStart(6, '0');
  return `ai-${part()}${part()}`;
}

/**
 * Default sink for production: a single structured line per request. Uses
 * `console.error` for failures and `console.warn` for successes, the only
 * console methods the lint rule permits.
 */
export function createConsoleLogSink(): GatewayLogSink {
  return (record: GatewayLogRecord): void => {
    const line = JSON.stringify(record);
    if (record.outcome === 'failure') {
      console.error(line);
    } else {
      console.warn(line);
    }
  };
}
