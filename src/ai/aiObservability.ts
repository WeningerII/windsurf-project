/**
 * AI observability + cost controls (RFC 002 / MASTER_PLAN Phase 14).
 *
 * A repo-native (no new dependency) telemetry and budget layer for the gateway
 * client. It does three honest, deterministic things:
 *
 *  - **Cost/session caps**: a per-session tally of calls and estimated units;
 *    when a configured ceiling would be exceeded the client short-circuits to a
 *    typed `over-budget` failure WITHOUT a network call. Caps are read from the
 *    environment (opt-in), so the deterministic baseline is unchanged until an
 *    operator sets them; given the same requests the tally — and the point at
 *    which it trips — is identical every run.
 *  - **Trace records**: every call produces an {@link AiTrace} linking a trace id
 *    to its task, prompt-template version, estimated units, provider/model, and
 *    latency, plus whether it succeeded. The client keeps a bounded ring of
 *    recent traces so the prompt → response → user-visible result can be
 *    correlated by id.
 *  - **Unit estimation**: a deterministic size estimate (≈ chars / 4, with image
 *    data URLs counted as a flat cost rather than their raw base64 length) so the
 *    caps mean something without pinning any provider's token math or prices.
 *
 * Pure helpers here; the small mutable session state is a deliberate, resettable
 * module singleton (one browser tab = one session).
 */
import type { AiResponse, AiTask } from './contracts';
import { PROMPT_TEMPLATE_VERSION } from './prompts';

export interface BudgetCaps {
  /** Max gateway calls per session (Infinity disables the cap). */
  maxCalls: number;
  /** Max estimated units per session (Infinity disables the cap). */
  maxUnits: number;
}

export interface SessionUsage {
  calls: number;
  units: number;
}

export interface AiTrace {
  traceId: string;
  task: AiTask;
  promptVersion: string;
  estimatedUnits: number;
  /** Whether the gateway call succeeded. */
  ok: boolean;
  /** Failure code when `ok` is false. */
  code?: string;
  /** Provenance of a successful result (provider vs recorded fixture). */
  source?: 'provider' | 'fixture';
  provider?: string;
  model?: string;
  /** Wall-clock duration of the call in milliseconds. */
  latencyMs: number;
}

/** Default ceilings when the environment does not configure them — generous but
 * finite, so an enabled session is protected without disturbing normal use. */
export const DEFAULT_BUDGET_CAPS: BudgetCaps = { maxCalls: 100, maxUnits: 2_000_000 };

/** How many recent traces to retain for correlation/inspection. */
const MAX_TRACE_RING = 50;

function parsePositive(value: unknown, fallback: number): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** Resolve the session caps from the environment (opt-in overrides of the defaults). */
export function readBudgetCaps(): BudgetCaps {
  const env = import.meta.env;
  return {
    maxCalls: parsePositive(env.VITE_AI_MAX_CALLS, DEFAULT_BUDGET_CAPS.maxCalls),
    maxUnits: parsePositive(env.VITE_AI_MAX_UNITS, DEFAULT_BUDGET_CAPS.maxUnits),
  };
}

/** Replace base64 image data URLs with a short marker so a megabyte of image
 * does not count as a megabyte of text. */
function deImage(serialized: string): { text: string; images: number } {
  let images = 0;
  const text = serialized.replace(/data:[\w./+-]+;base64,[A-Za-z0-9+/=]+/g, () => {
    images += 1;
    return 'data:image';
  });
  return { text, images };
}

/** Flat unit cost charged per image part (input or output). */
export const IMAGE_UNIT_COST = 1000;

/**
 * Deterministic size estimate for a request: roughly one unit per four
 * characters of the (de-imaged) payload, plus a flat cost per image. Same
 * payload → same estimate, with no provider-specific token tables or prices.
 */
export function estimateUnits(payload: unknown): number {
  const serialized = (() => {
    try {
      return JSON.stringify(payload) ?? '';
    } catch {
      return '';
    }
  })();
  const { text, images } = deImage(serialized);
  return Math.ceil(text.length / 4) + images * IMAGE_UNIT_COST;
}

/** Whether adding `units`/one more call to `usage` would breach `caps`. */
export function wouldExceedBudget(usage: SessionUsage, caps: BudgetCaps, units: number): boolean {
  return usage.calls + 1 > caps.maxCalls || usage.units + units > caps.maxUnits;
}

/** Build a trace record from a completed call. Pure. */
export function buildTrace(params: {
  traceId: string;
  task: AiTask;
  estimatedUnits: number;
  latencyMs: number;
  response: AiResponse;
  promptVersion?: string;
}): AiTrace {
  const { response } = params;
  return {
    traceId: params.traceId,
    task: params.task,
    promptVersion: params.promptVersion ?? PROMPT_TEMPLATE_VERSION,
    estimatedUnits: params.estimatedUnits,
    latencyMs: params.latencyMs,
    ok: response.ok,
    ...(response.ok
      ? {
          source: response.usage.source,
          ...(response.usage.provider ? { provider: response.usage.provider } : {}),
          ...(response.usage.model ? { model: response.usage.model } : {}),
        }
      : { code: response.code }),
  };
}

// --- Session singleton (one tab = one session) -----------------------------

const usage: SessionUsage = { calls: 0, units: 0 };
const traces: AiTrace[] = [];

/** Current session usage (a copy). */
export function getSessionUsage(): SessionUsage {
  return { ...usage };
}

/** Recent traces, newest last (a copy). */
export function getRecentAiTraces(): AiTrace[] {
  return traces.map((trace) => ({ ...trace }));
}

/** Add a trace to the bounded ring (every attempt, executed or rejected). */
export function noteTrace(trace: AiTrace): void {
  traces.push(trace);
  if (traces.length > MAX_TRACE_RING) traces.shift();
}

/** Charge an executed call against the session tally (a rejected over-budget
 * attempt is traced but never charged, so the tally counts only real spend). */
export function chargeUsage(units: number): void {
  usage.calls += 1;
  usage.units += units;
}

/** Reset the session (new tab, or test isolation). */
export function resetAiSession(): void {
  usage.calls = 0;
  usage.units = 0;
  traces.length = 0;
}
