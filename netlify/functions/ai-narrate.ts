/**
 * AI narration gateway — the server side of the resolution / narration split.
 *
 * This is the ONLY place the Anthropic API key is read. The browser POSTs a
 * resolved-round summary here; this adapter calls Claude with the secret key and
 * returns prose. With no key (or no model) configured it answers 503, and the
 * browser client degrades to its deterministic narrator. See
 * `docs/rfc/003-rules-ir-and-effects.md` and `src/rules/ai/llmNarration.ts`.
 *
 * Configuration (Netlify environment, server-only — never `VITE_`-prefixed):
 *   ANTHROPIC_API_KEY  — the secret key (never sent to the browser).
 *   ANTHROPIC_MODEL    — a current Claude model id, chosen by the operator.
 *
 * The mechanics never run here; only the resolved outcome is narrated.
 */

import { narrateWithClaude, type RoundNarrationSummary } from '../../src/rules/ai/llmNarration';

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isSummary(value: unknown): value is RoundNarrationSummary {
  const candidate = value as Partial<RoundNarrationSummary> | null;
  return (
    !!candidate &&
    typeof candidate.systemId === 'string' &&
    typeof candidate.round === 'number' &&
    Array.isArray(candidate.beats) &&
    candidate.beats.length > 0 &&
    candidate.beats.every((beat) => typeof beat === 'string')
  );
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  // No key or no model → narration is not configured. The client falls back to
  // its deterministic narrator. The model id is intentionally supplied by the
  // operator via env, never baked into the build.
  if (!apiKey || !model) {
    return json(503, { error: 'Narration is not configured.' });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Request body must be JSON.' });
  }
  if (!isSummary(payload)) {
    return json(400, { error: 'Body must be a round summary with at least one beat.' });
  }

  try {
    const narration = await narrateWithClaude(payload, { apiKey, model });
    return json(200, { narration });
  } catch {
    return json(502, { error: 'Upstream narration failed.' });
  }
}
