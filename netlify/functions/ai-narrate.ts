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
 *   ALLOWED_ORIGIN     — optional; when set, only requests with a matching
 *                        `Origin` header are served (blocks cross-site browser abuse).
 *
 * Abuse hardening: every valid POST triggers a paid Claude call, so the input is
 * size-capped (`isValidSummary`) and an optional origin allowlist is enforced.
 * RATE LIMITING is intentionally NOT done in-process — serverless instances don't
 * share memory, so an in-memory limiter is security theater. Enable Netlify's
 * built-in rate limiting (or a gateway/WAF rule) in front of this function for a
 * real per-IP cap. The mechanics never run here; only the resolved outcome is narrated.
 */

import { isValidSummary, narrateWithClaude } from '../../src/rules/ai/llmNarration';

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  // Optional origin allowlist: when configured, reject requests whose Origin
  // doesn't match (defeats casual cross-site browser abuse of the paid endpoint).
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (allowedOrigin) {
    const origin = request.headers.get('origin');
    if (origin && origin !== allowedOrigin) {
      return json(403, { error: 'Origin not allowed.' });
    }
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
  // Validate shape AND bound the size (beat count + length) so a huge payload
  // can't inflate token cost / latency.
  if (!isValidSummary(payload)) {
    return json(400, { error: 'Body must be a round summary within size limits.' });
  }

  try {
    const narration = await narrateWithClaude(payload, { apiKey, model });
    return json(200, { narration });
  } catch {
    return json(502, { error: 'Upstream narration failed.' });
  }
}
