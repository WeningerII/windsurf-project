/**
 * LLM narration gateway — the keyed half of the resolution / narration split.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted): the LLM lives "behind a
 * server function... with no key, every surface degrades to the deterministic/
 * manual tool. The resolver is the mechanics hot path; the LLM runs strictly
 * before (drafting) or after (narration)." This module is the AFTER step done
 * for real — a server-side call to the Claude Messages API that turns an
 * ALREADY-RESOLVED round into prose, plus a browser-safe client that talks to
 * that server and falls back to the deterministic narrator on any failure.
 *
 * Three layers, each independently testable:
 *   - `buildNarrationRequest` — pure: a resolved-round summary → Messages body.
 *   - `narrateWithClaude`      — server-side: POST that body with the secret key.
 *   - `requestNarration`       — browser-safe: POST the summary to our gateway,
 *                                returning prose or `undefined` (→ deterministic).
 *
 * The key never reaches the browser: only the server adapter calls Claude. The
 * model id is never baked in here — `narrateWithClaude` takes it as a parameter
 * so the operator supplies a current Claude model via environment config. The
 * LLM never authors mechanics: it receives the already-adjudicated beats (rolls,
 * hits, damage) and is instructed only to narrate them, never to change them.
 */

/** Minimal fetch shape — keeps the module browser/server portable and tests light. */
export type FetchLike = (
  url: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body: string;
    signal?: AbortSignal;
  }
) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

/**
 * The authoritative outcome of a resolved round, abstracted from any one system.
 * `beats` are the mechanical truth (e.g. "Aria hits the Goblin for 7 (rolled
 * 18+5 vs AC 14)"); the narrator enriches them but must not alter them.
 */
export interface RoundNarrationSummary {
  /** Game-system id — sets genre/tone context only, never mechanics. */
  systemId: string;
  round: number;
  /** Already-adjudicated beats of the round, in order. The source of truth. */
  beats: string[];
}

/** Caps that bound a narration request's size — the gateway rejects anything larger,
 * so an attacker can't inflate token cost or latency with a giant payload. */
export const MAX_NARRATION_BEATS = 80;
export const MAX_BEAT_LENGTH = 500;

/**
 * Validate an untrusted value as a {@link RoundNarrationSummary} within size
 * limits — the gateway's input guard. Shared with the server adapter so the
 * (untyped, untested) Netlify function and the typed client agree on what's
 * acceptable. Rejects empty, oversized, and malformed payloads.
 */
export function isValidSummary(value: unknown): value is RoundNarrationSummary {
  const s = value as Partial<RoundNarrationSummary> | null;
  return (
    !!s &&
    typeof s.systemId === 'string' &&
    s.systemId.length > 0 &&
    s.systemId.length <= 64 &&
    typeof s.round === 'number' &&
    Number.isFinite(s.round) &&
    Array.isArray(s.beats) &&
    s.beats.length > 0 &&
    s.beats.length <= MAX_NARRATION_BEATS &&
    s.beats.every((beat) => typeof beat === 'string' && beat.length <= MAX_BEAT_LENGTH)
  );
}

/** One Anthropic system block; the stable prefix carries a cache breakpoint. */
export interface NarrationSystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

/** A Messages API body minus `model` (the server adds it from config). */
export interface NarrationRequestBody {
  max_tokens: number;
  system: NarrationSystemBlock[];
  messages: Array<{ role: 'user'; content: string }>;
}

/** Anthropic Messages API version pin. */
export const ANTHROPIC_VERSION = '2023-06-01';
/** Default Anthropic API origin (overridable for tests / proxies). */
export const ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
/** A tight paragraph of narration needs little headroom. */
export const DEFAULT_NARRATION_MAX_TOKENS = 400;

/**
 * The narrator's brief. It is handed the resolved mechanics and must only
 * dress them — the guardrail that keeps the LLM out of the rules entirely.
 */
export const NARRATION_SYSTEM_PROMPT = [
  'You are the narrator for a tabletop roleplaying game combat round.',
  'You are given the ALREADY-RESOLVED, authoritative outcome of one round:',
  'who acted, who hit or missed, and exactly how much damage was dealt.',
  '',
  'Your job is presentation only. Narrate what happened in one vivid, tight',
  'paragraph that a game master could read aloud. Honor the genre and tone of',
  'the named system.',
  '',
  'Strict rules:',
  '- Never invent, omit, or change any hit, miss, death, or number. The damage',
  '  and outcomes you are given are final.',
  '- Do not add actions, creatures, or events that are not in the beats.',
  '- Do not roll dice or decide outcomes; they are already decided.',
  '- Output only the narration paragraph — no preamble, headings, or lists.',
].join('\n');

/** Render the resolved summary into the user turn the model narrates. */
function formatSummary(summary: RoundNarrationSummary): string {
  const beats = summary.beats.map((beat, index) => `${index + 1}. ${beat}`).join('\n');
  return [
    `System: ${summary.systemId}`,
    `Round ${summary.round} — resolved outcome (authoritative; narrate exactly this):`,
    beats,
  ].join('\n');
}

/**
 * Build the Claude Messages request body for a resolved round. Pure: no network,
 * no secrets, no model id. The system block carries an ephemeral cache breakpoint
 * so its stable prefix is reused across the many rounds of a session.
 */
export function buildNarrationRequest(
  summary: RoundNarrationSummary,
  maxTokens: number = DEFAULT_NARRATION_MAX_TOKENS
): NarrationRequestBody {
  return {
    max_tokens: maxTokens,
    system: [{ type: 'text', text: NARRATION_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: formatSummary(summary) }],
  };
}

/** Extract the first text block from a Messages response (skipping any thinking). */
function extractText(payload: unknown): string | undefined {
  const content = (payload as { content?: unknown })?.content;
  if (!Array.isArray(content)) return undefined;
  for (const block of content) {
    if (
      block &&
      typeof block === 'object' &&
      (block as { type?: unknown }).type === 'text' &&
      typeof (block as { text?: unknown }).text === 'string'
    ) {
      const text = (block as { text: string }).text.trim();
      if (text.length > 0) return text;
    }
  }
  return undefined;
}

/** Server-side dependencies for a real Claude call. */
export interface ClaudeNarrationDeps {
  /** Anthropic API key. SERVER-ONLY — never expose this to the browser. */
  apiKey: string;
  /** A current Claude model id, supplied by the operator (never hardcoded here). */
  model: string;
  /** Injectable fetch (defaults to the platform global) — for tests/runtimes. */
  fetch?: FetchLike;
  /** Override the API origin (tests / regional proxies). */
  baseUrl?: string;
  /** Cap the narration length. */
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * Call the Claude Messages API to narrate a resolved round. Runs ONLY on the
 * server (it carries the secret key). Returns the narration prose; throws on a
 * non-2xx response or an empty body so the caller can decide how to degrade.
 */
export async function narrateWithClaude(
  summary: RoundNarrationSummary,
  deps: ClaudeNarrationDeps
): Promise<string> {
  const doFetch: FetchLike = deps.fetch ?? fetch;
  const baseUrl = deps.baseUrl ?? ANTHROPIC_BASE_URL;
  const body = { model: deps.model, ...buildNarrationRequest(summary, deps.maxTokens) };

  const response = await doFetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': deps.apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
    signal: deps.signal,
  });

  if (!response.ok) {
    throw new Error(`Claude narration failed: HTTP ${response.status}`);
  }
  const text = extractText(await response.json());
  if (!text) {
    throw new Error('Claude narration returned no text content.');
  }
  return text;
}

/** Default ceiling on how long the client waits before degrading to deterministic. */
export const DEFAULT_NARRATION_TIMEOUT_MS = 8000;

/** Browser-side dependencies for talking to our own narration gateway. */
export interface GatewayNarrationDeps {
  /** Our same-origin gateway path (e.g. `/.netlify/functions/ai-narrate`). */
  endpoint: string;
  /** Injectable fetch (defaults to the platform global) — for tests. */
  fetch?: FetchLike;
  /**
   * Abort the request (and fall back to deterministic) after this many ms.
   * Narration is an enhancement, never a blocker — a slow gateway must not stall
   * play. Defaults to {@link DEFAULT_NARRATION_TIMEOUT_MS}; set 0 to disable.
   */
  timeoutMs?: number;
  /** Caller's own abort signal (combined with the timeout). */
  signal?: AbortSignal;
}

/**
 * Browser-safe narration request: POST the resolved summary to our own gateway
 * (which holds the key) and return the prose. Any failure — no gateway, network
 * error, non-2xx, empty body, or timeout — resolves to `undefined`, the signal
 * to keep the deterministic narration already on screen. Never throws.
 */
export async function requestNarration(
  summary: RoundNarrationSummary,
  deps: GatewayNarrationDeps
): Promise<string | undefined> {
  const doFetch: FetchLike = deps.fetch ?? fetch;
  const timeoutMs = deps.timeoutMs ?? DEFAULT_NARRATION_TIMEOUT_MS;

  // Bound the wait: a hung or slow gateway must degrade to deterministic within
  // a fixed budget. We own a controller that the timer aborts, and forward the
  // caller's signal into it so either source cancels the request.
  const controller = timeoutMs > 0 || deps.signal ? new AbortController() : undefined;
  const timer =
    controller && timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
  if (controller && deps.signal) {
    if (deps.signal.aborted) controller.abort();
    else deps.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await doFetch(deps.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(summary),
      signal: controller?.signal ?? deps.signal,
    });
    if (!response.ok) return undefined;
    const payload = (await response.json()) as { narration?: unknown };
    return typeof payload.narration === 'string' && payload.narration.trim().length > 0
      ? payload.narration.trim()
      : undefined;
  } catch {
    return undefined;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
