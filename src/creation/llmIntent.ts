/**
 * LLM intent gateway — the keyed "drafting" half of prompt-driven creation.
 *
 * RFC 002/003: the LLM runs strictly BEFORE the deterministic core (drafting) or
 * after it (narration); the rules remain the decider. This module is the BEFORE
 * step done for real — it turns a free-text character description into structured
 * creation *hints* (archetype keywords, a name, a level). Those hints only steer
 * which catalog entries the deterministic per-system creator selects; the engine
 * still derives the sheet and the validator still judges its legality. The model
 * never writes mechanics, and with no key every surface degrades to the
 * deterministic keyword parser.
 *
 * Three layers mirror the narration gateway, each independently testable:
 *   - `buildDraftRequest`     — pure: a prompt → Claude Messages body (no model).
 *   - `draftHintsWithClaude`  — server-side: POST that body with the secret key.
 *   - `requestCreationHints`  — browser-safe: POST to our gateway, returning
 *                               hints or `undefined` (→ deterministic parsing).
 *
 * The key never reaches the browser: only the server adapter calls Claude. The
 * model id is supplied by the operator via environment config, never baked in.
 */

import { ANTHROPIC_BASE_URL, ANTHROPIC_VERSION, type FetchLike } from '../rules/ai/llmNarration';
import { parseCreationIntent } from './intent';
import type { CreationIntent } from './types';

/** The untrusted input a browser sends to the drafting gateway. */
export interface CreationPromptInput {
  systemId: string;
  prompt: string;
}

/** Structured hints extracted from a prompt. All fields are advisory. */
export interface CreationHints {
  /** Lowercase archetype/role keywords the creators match against catalogs. */
  keywords: string[];
  /** A character name, if the description implies one. */
  name?: string;
  /** A desired level, if stated. */
  level?: number;
}

/** Size caps — the gateway rejects anything larger so a giant prompt can't
 * inflate token cost or latency, and the model's reply is bounded on the way out. */
export const MAX_PROMPT_LENGTH = 1000;
export const MAX_KEYWORDS = 24;
export const MAX_KEYWORD_LENGTH = 32;
export const MAX_NAME_LENGTH = 40;
const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

/** A tight JSON object needs little headroom. */
export const DEFAULT_DRAFT_MAX_TOKENS = 300;
/** Default ceiling before the client degrades to deterministic parsing. */
export const DEFAULT_DRAFT_TIMEOUT_MS = 8000;
/** Our same-origin gateway path. */
export const DRAFT_ENDPOINT = '/.netlify/functions/ai-draft-character';

/** Validate untrusted input as a {@link CreationPromptInput} within size limits. */
export function isValidPromptInput(value: unknown): value is CreationPromptInput {
  const input = value as Partial<CreationPromptInput> | null;
  return (
    !!input &&
    typeof input.systemId === 'string' &&
    input.systemId.length > 0 &&
    input.systemId.length <= 64 &&
    typeof input.prompt === 'string' &&
    input.prompt.trim().length > 0 &&
    input.prompt.length <= MAX_PROMPT_LENGTH
  );
}

/** One Anthropic system block; the stable prefix carries a cache breakpoint. */
export interface DraftSystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

/** A Messages API body minus `model` (the server adds it from config). */
export interface DraftRequestBody {
  max_tokens: number;
  system: DraftSystemBlock[];
  messages: Array<{ role: 'user'; content: string }>;
}

/**
 * The drafter's brief: extract creation hints as strict JSON. It never picks
 * exact catalog ids — it emits archetype keywords the deterministic creator
 * resolves against each system's own catalogs, so the rules stay the authority.
 */
export const DRAFT_SYSTEM_PROMPT = [
  'You translate a tabletop RPG character description into structured creation hints.',
  'You are given a target game system id and a free-text description.',
  '',
  'Return ONLY a strict JSON object, no prose, with these fields:',
  '  "keywords": string[]  // lowercase single words capturing class/archetype,',
  '                        // ancestry/species/heritage, and role/ability themes',
  '                        // (e.g. "rogue", "elf", "stealthy", "dexterous").',
  '                        // Order by importance; pick words likely to match the',
  "                        // system's classes and ancestries. 1 to 16 entries.",
  '  "name": string        // OPTIONAL: a character name only if the description',
  '                        // implies one; omit otherwise.',
  '  "level": number       // OPTIONAL: an integer 1-20 only if a level is stated.',
  '',
  'Do not invent a name. Do not choose mechanics, numbers, or specific stat blocks.',
  'Output must be valid JSON parseable as-is.',
].join('\n');

/** Render the input into the user turn the model converts to hints. */
function formatInput(input: CreationPromptInput): string {
  return [`System: ${input.systemId}`, `Description: ${input.prompt.trim()}`].join('\n');
}

/**
 * Build the Claude Messages request body for a prompt. Pure: no network, no
 * secrets, no model id. The system block carries an ephemeral cache breakpoint
 * so its stable prefix is reused across many drafts.
 */
export function buildDraftRequest(
  input: CreationPromptInput,
  maxTokens: number = DEFAULT_DRAFT_MAX_TOKENS
): DraftRequestBody {
  return {
    max_tokens: maxTokens,
    system: [{ type: 'text', text: DRAFT_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: formatInput(input) }],
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

/** Parse a model text block as JSON, tolerating ```json code fences. */
function parseJsonObject(text: string): Record<string, unknown> | undefined {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  // Fall back to the first {...} span if there's leading/trailing chatter.
  const braced = candidate.startsWith('{') ? candidate : candidate.match(/\{[\s\S]*\}/)?.[0];
  if (!braced) return undefined;
  try {
    const parsed = JSON.parse(braced);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

/** Coerce an untrusted parsed object into bounded {@link CreationHints}. */
export function sanitizeHints(raw: unknown): CreationHints {
  const object = (raw ?? {}) as Record<string, unknown>;

  const keywords = Array.isArray(object.keywords)
    ? object.keywords
        .filter((entry): entry is string => typeof entry === 'string')
        .map((entry) => entry.toLowerCase().trim().slice(0, MAX_KEYWORD_LENGTH))
        .filter((entry) => entry.length > 0)
        .slice(0, MAX_KEYWORDS)
    : [];

  const name =
    typeof object.name === 'string' && object.name.trim().length > 0
      ? object.name.trim().slice(0, MAX_NAME_LENGTH)
      : undefined;

  const levelRaw = typeof object.level === 'number' ? object.level : undefined;
  const level =
    levelRaw !== undefined && Number.isFinite(levelRaw)
      ? Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.floor(levelRaw)))
      : undefined;

  return { keywords, ...(name ? { name } : {}), ...(level !== undefined ? { level } : {}) };
}

/** Server-side dependencies for a real Claude call. */
export interface ClaudeDraftDeps {
  /** Anthropic API key. SERVER-ONLY — never expose this to the browser. */
  apiKey: string;
  /** A current Claude model id, supplied by the operator (never hardcoded here). */
  model: string;
  /** Injectable fetch (defaults to the platform global) — for tests/runtimes. */
  fetch?: FetchLike;
  /** Override the API origin (tests / regional proxies). */
  baseUrl?: string;
  /** Cap the reply length. */
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * Call the Claude Messages API to draft creation hints. Runs ONLY on the server
 * (it carries the secret key). Returns sanitized hints; throws on a non-2xx
 * response or an unparseable body so the caller can decide how to degrade.
 */
export async function draftHintsWithClaude(
  input: CreationPromptInput,
  deps: ClaudeDraftDeps
): Promise<CreationHints> {
  const doFetch: FetchLike = deps.fetch ?? fetch;
  const baseUrl = deps.baseUrl ?? ANTHROPIC_BASE_URL;
  const body = { model: deps.model, ...buildDraftRequest(input, deps.maxTokens) };

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
    throw new Error(`Claude drafting failed: HTTP ${response.status}`);
  }
  const text = extractText(await response.json());
  const parsed = text ? parseJsonObject(text) : undefined;
  if (!parsed) {
    throw new Error('Claude drafting returned no parseable JSON.');
  }
  return sanitizeHints(parsed);
}

/** Browser-side dependencies for talking to our own drafting gateway. */
export interface GatewayDraftDeps {
  /** Our same-origin gateway path (defaults to {@link DRAFT_ENDPOINT}). */
  endpoint?: string;
  /** Injectable fetch (defaults to the platform global) — for tests. */
  fetch?: FetchLike;
  /**
   * Abort (and fall back to deterministic parsing) after this many ms. Drafting
   * is an enhancement, never a blocker. Defaults to {@link DEFAULT_DRAFT_TIMEOUT_MS};
   * set 0 to disable.
   */
  timeoutMs?: number;
  /** Caller's own abort signal (combined with the timeout). */
  signal?: AbortSignal;
}

/**
 * Browser-safe drafting request: POST the prompt to our own gateway (which holds
 * the key) and return hints. Any failure — no gateway, network error, non-2xx,
 * unparseable body, or timeout — resolves to `undefined`, the signal to fall back
 * to deterministic parsing. Never throws.
 */
export async function requestCreationHints(
  input: CreationPromptInput,
  deps: GatewayDraftDeps = {}
): Promise<CreationHints | undefined> {
  if (!isValidPromptInput(input)) return undefined;
  const doFetch: FetchLike = deps.fetch ?? fetch;
  const endpoint = deps.endpoint ?? DRAFT_ENDPOINT;
  const timeoutMs = deps.timeoutMs ?? DEFAULT_DRAFT_TIMEOUT_MS;

  const controller = timeoutMs > 0 || deps.signal ? new AbortController() : undefined;
  const timer =
    controller && timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
  if (controller && deps.signal) {
    if (deps.signal.aborted) controller.abort();
    else deps.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await doFetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller?.signal ?? deps.signal,
    });
    if (!response.ok) return undefined;
    const payload = (await response.json()) as { hints?: unknown };
    if (!payload || typeof payload !== 'object' || !('hints' in payload)) return undefined;
    return sanitizeHints((payload as { hints: unknown }).hints);
  } catch {
    return undefined;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/**
 * Fold LLM hints into a deterministic {@link CreationIntent}: the prompt is still
 * parsed (so explicit level/name and the original words survive), then the hint
 * keywords are appended to the token set and the hint name/level fill any gaps.
 * The result is consumed by the same per-system creators as the offline path.
 */
export function applyHintsToIntent(prompt: string, hints: CreationHints): CreationIntent {
  const base = parseCreationIntent(prompt, hints.level);
  const tokens = Array.from(new Set([...base.tokens, ...hints.keywords]));
  return {
    ...base,
    tokens,
    name: base.name ?? hints.name,
  };
}
