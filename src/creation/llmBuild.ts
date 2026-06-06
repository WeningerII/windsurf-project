/**
 * LLM build gateway — the keyed "author" half of prompt-driven creation.
 *
 * RFC 002: the LLM proposes, the deterministic rules decide. This module lets
 * the model author a FULL build as one structured JSON object: given a target
 * system, the prompt, and a compact machine-readable options manifest (the real
 * catalog names + the system's structural rules), it returns a `BuildSpec` — the
 * actual selections (class, ancestry, ability allocation, spells, …). Those
 * selections are then re-validated against the real catalogs by the per-system
 * creator and run through the engine + validator, so the model can never produce
 * an illegal sheet, and anything it leaves out or gets wrong falls back to the
 * deterministic creator per field.
 *
 * Three layers mirror the narration/intent gateways, each independently testable:
 *   - `buildSpecRequest`   — pure: input + manifest → Claude Messages body.
 *   - `draftBuildWithClaude` — server-side: POST with the secret key.
 *   - `requestBuild`       — browser-safe: POST to our gateway, returning a spec
 *                            or `undefined` (→ deterministic creation).
 *
 * The key never reaches the browser; the model id comes from operator env config.
 */

import { ANTHROPIC_BASE_URL, ANTHROPIC_VERSION, type FetchLike } from '../rules/ai/llmNarration';

/** The untrusted input a browser sends to the build gateway. */
export interface BuildPromptInput {
  systemId: string;
  prompt: string;
  /** Machine-readable options manifest (catalog names + rules) for the system. */
  manifest: unknown;
}

/**
 * A model-authored build: a name, a level, and a loose, system-specific bag of
 * selections (e.g. `{ class, ancestry, abilities, spells }`). The per-system
 * creator validates each field against the real catalog before using it.
 */
export interface BuildSpec {
  name?: string;
  level?: number;
  selections: Record<string, unknown>;
}

/** Size caps so an oversized prompt/manifest can't inflate token cost or latency. */
export const MAX_PROMPT_LENGTH = 1000;
export const MAX_MANIFEST_LENGTH = 24000;
export const MAX_SELECTIONS_LENGTH = 8000;
export const MAX_NAME_LENGTH = 40;
const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

/** A full build needs more headroom than a hint, but stays bounded. */
export const DEFAULT_BUILD_MAX_TOKENS = 1200;
export const DEFAULT_BUILD_TIMEOUT_MS = 20000;
export const BUILD_ENDPOINT = '/.netlify/functions/ai-build-character';

/** Validate untrusted input as a {@link BuildPromptInput} within size limits. */
export function isValidBuildInput(value: unknown): value is BuildPromptInput {
  const input = value as Partial<BuildPromptInput> | null;
  if (
    !input ||
    typeof input.systemId !== 'string' ||
    input.systemId.length === 0 ||
    input.systemId.length > 64 ||
    typeof input.prompt !== 'string' ||
    input.prompt.trim().length === 0 ||
    input.prompt.length > MAX_PROMPT_LENGTH ||
    input.manifest == null
  ) {
    return false;
  }
  // Bound the manifest's serialized size.
  try {
    return JSON.stringify(input.manifest).length <= MAX_MANIFEST_LENGTH;
  } catch {
    return false;
  }
}

/** One Anthropic system block; the stable prefix carries a cache breakpoint. */
export interface BuildSystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

/** A Messages API body minus `model` (the server adds it from config). */
export interface BuildRequestBody {
  max_tokens: number;
  system: BuildSystemBlock[];
  messages: Array<{ role: 'user'; content: string }>;
}

/**
 * The author's brief: choose a complete, legal build and return it as strict
 * JSON. It must pick only from the supplied manifest's options; the deterministic
 * layer re-checks everything, so the model's job is good *choices*, not legality.
 */
export const BUILD_SYSTEM_PROMPT = [
  'You are a master tabletop RPG character builder. Given a target game system, a',
  "free-text concept, and a JSON manifest of that system's legal options and",
  'rules, design the character that best realizes the concept within those rules.',
  '',
  'Return ONLY a strict JSON object, no prose:',
  '  {',
  '    "name": string,            // a fitting character name',
  '    "level": number,           // integer within the manifest\'s level range',
  '    "selections": { ... }      // keys exactly as described by the manifest',
  '  }',
  '',
  'Rules:',
  '- Choose only values that appear in the manifest (class names, ancestry names,',
  '  etc.). For spells/cards/feats, use names from the system; unknown names are',
  '  dropped and back-filled deterministically, so prefer iconic, on-theme picks.',
  "- Honor the manifest's ability-generation method exactly (e.g. a fixed array,",
  '  point buy, or boosts) and the level/power-level bounds.',
  '- Capture the concept faithfully: a "Batman" should be a stealthy, skilled,',
  '  gadget-or-martial build, not a spellcaster, regardless of system.',
  '- Output must be valid JSON parseable as-is.',
].join('\n');

/** Render the input + manifest into the user turn the model designs against. */
function formatInput(input: BuildPromptInput): string {
  return [
    `System: ${input.systemId}`,
    `Concept: ${input.prompt.trim()}`,
    'Options manifest (choose only from these):',
    JSON.stringify(input.manifest),
  ].join('\n');
}

/**
 * Build the Claude Messages request body for a full build. Pure: no network, no
 * secrets, no model id. The system block carries an ephemeral cache breakpoint.
 */
export function buildSpecRequest(
  input: BuildPromptInput,
  maxTokens: number = DEFAULT_BUILD_MAX_TOKENS
): BuildRequestBody {
  return {
    max_tokens: maxTokens,
    system: [{ type: 'text', text: BUILD_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
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
  const braced = candidate.startsWith('{') ? candidate : candidate.match(/\{[\s\S]*\}/)?.[0];
  if (!braced) return undefined;
  try {
    const parsed = JSON.parse(braced);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

/** Coerce an untrusted parsed object into a bounded {@link BuildSpec}. */
export function sanitizeBuildSpec(raw: unknown): BuildSpec {
  const object = (raw ?? {}) as Record<string, unknown>;

  const name =
    typeof object.name === 'string' && object.name.trim().length > 0
      ? object.name.trim().slice(0, MAX_NAME_LENGTH)
      : undefined;

  const levelRaw = typeof object.level === 'number' ? object.level : undefined;
  const level =
    levelRaw !== undefined && Number.isFinite(levelRaw)
      ? Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.floor(levelRaw)))
      : undefined;

  // Selections must be a plain object within a size bound; otherwise drop it
  // (the creator then falls back to fully deterministic selection).
  let selections: Record<string, unknown> = {};
  if (
    object.selections &&
    typeof object.selections === 'object' &&
    !Array.isArray(object.selections)
  ) {
    try {
      if (JSON.stringify(object.selections).length <= MAX_SELECTIONS_LENGTH) {
        selections = object.selections as Record<string, unknown>;
      }
    } catch {
      selections = {};
    }
  }

  return { selections, ...(name ? { name } : {}), ...(level !== undefined ? { level } : {}) };
}

/** Server-side dependencies for a real Claude call. */
export interface ClaudeBuildDeps {
  /** Anthropic API key. SERVER-ONLY — never expose this to the browser. */
  apiKey: string;
  /** A current Claude model id, supplied by the operator (never hardcoded here). */
  model: string;
  fetch?: FetchLike;
  baseUrl?: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * Call the Claude Messages API to author a build. Runs ONLY on the server (it
 * carries the secret key). Returns a sanitized {@link BuildSpec}; throws on a
 * non-2xx response or an unparseable body so the caller can decide how to degrade.
 */
export async function draftBuildWithClaude(
  input: BuildPromptInput,
  deps: ClaudeBuildDeps
): Promise<BuildSpec> {
  const doFetch: FetchLike = deps.fetch ?? fetch;
  const baseUrl = deps.baseUrl ?? ANTHROPIC_BASE_URL;
  const body = { model: deps.model, ...buildSpecRequest(input, deps.maxTokens) };

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
    throw new Error(`Claude build failed: HTTP ${response.status}`);
  }
  const text = extractText(await response.json());
  const parsed = text ? parseJsonObject(text) : undefined;
  if (!parsed) {
    throw new Error('Claude build returned no parseable JSON.');
  }
  return sanitizeBuildSpec(parsed);
}

/** Browser-side dependencies for talking to our own build gateway. */
export interface GatewayBuildDeps {
  endpoint?: string;
  fetch?: FetchLike;
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Browser-safe build request: POST the prompt + manifest to our gateway (which
 * holds the key) and return the authored spec. Any failure — no gateway, network
 * error, non-2xx, unparseable body, or timeout — resolves to `undefined`, the
 * signal to fall back to deterministic creation. Never throws.
 */
export async function requestBuild(
  input: BuildPromptInput,
  deps: GatewayBuildDeps = {}
): Promise<BuildSpec | undefined> {
  if (!isValidBuildInput(input)) return undefined;
  const doFetch: FetchLike = deps.fetch ?? fetch;
  const endpoint = deps.endpoint ?? BUILD_ENDPOINT;
  const timeoutMs = deps.timeoutMs ?? DEFAULT_BUILD_TIMEOUT_MS;

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
    const payload = (await response.json()) as { spec?: unknown };
    if (!payload || typeof payload !== 'object' || !('spec' in payload)) return undefined;
    return sanitizeBuildSpec((payload as { spec: unknown }).spec);
  } catch {
    return undefined;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
