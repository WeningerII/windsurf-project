/**
 * AI character-drafting gateway — the server side of prompt-driven creation.
 *
 * This is the ONLY place the Anthropic API key is read for drafting. The browser
 * POSTs a `{ systemId, prompt }` here; this adapter calls Claude with the secret
 * key and returns structured creation *hints*. With no key (or no model) it
 * answers 503 and the browser client degrades to its deterministic keyword
 * parser. See `docs/rfc/002-ai-control-plane.md` and `src/creation/llmIntent.ts`.
 *
 * Configuration (Netlify environment, server-only — never `VITE_`-prefixed):
 *   ANTHROPIC_API_KEY  — the secret key (never sent to the browser).
 *   ANTHROPIC_MODEL    — a current Claude model id, chosen by the operator.
 *   ALLOWED_ORIGIN     — optional; when set, only requests with a matching
 *                        `Origin` header are served (blocks cross-site abuse).
 *
 * Abuse hardening: every valid POST triggers a paid Claude call, so the input is
 * size-capped (`isValidPromptInput`) and an optional origin allowlist is enforced.
 * Rate limiting belongs in front of this function (Netlify/WAF), not in-process —
 * serverless instances don't share memory. The model never writes mechanics; it
 * only emits archetype hints the deterministic creator resolves against catalogs.
 */

import { draftHintsWithClaude, isValidPromptInput } from '../../src/creation/llmIntent';

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

  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (allowedOrigin) {
    const origin = request.headers.get('origin');
    if (origin && origin !== allowedOrigin) {
      return json(403, { error: 'Origin not allowed.' });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  // No key or no model → drafting is not configured. The client falls back to its
  // deterministic parser. The model id is supplied by the operator via env.
  if (!apiKey || !model) {
    return json(503, { error: 'Character drafting is not configured.' });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Request body must be JSON.' });
  }
  if (!isValidPromptInput(payload)) {
    return json(400, { error: 'Body must be a { systemId, prompt } within size limits.' });
  }

  try {
    const hints = await draftHintsWithClaude(payload, { apiKey, model });
    return json(200, { hints });
  } catch {
    return json(502, { error: 'Upstream drafting failed.' });
  }
}
