/**
 * AI character-build gateway — the server side of LLM-authored creation.
 *
 * This is the ONLY place the Anthropic API key is read for build authoring. The
 * browser POSTs `{ systemId, prompt, manifest }`; this adapter calls Claude with
 * the secret key and returns the authored `BuildSpec`. With no key (or no model)
 * it answers 503 and the client degrades to deterministic creation. See
 * `docs/rfc/002-ai-control-plane.md` and `src/creation/llmBuild.ts`.
 *
 * Configuration (Netlify environment, server-only — never `VITE_`-prefixed):
 *   ANTHROPIC_API_KEY  — the secret key (never sent to the browser).
 *   ANTHROPIC_MODEL    — a current Claude model id, chosen by the operator.
 *   ALLOWED_ORIGIN     — optional; only matching-Origin requests are served.
 *
 * Abuse hardening: every valid POST triggers a paid Claude call, so the prompt
 * and manifest are size-capped (`isValidBuildInput`) and an optional origin
 * allowlist is enforced. Rate limiting belongs in front of this function. The
 * model only proposes selections; the deterministic layer re-validates and
 * derives, so it can never author an illegal sheet.
 */

import { draftBuildWithClaude, isValidBuildInput } from '../../src/creation/llmBuild';

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
  if (!apiKey || !model) {
    return json(503, { error: 'Character build authoring is not configured.' });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Request body must be JSON.' });
  }
  if (!isValidBuildInput(payload)) {
    return json(400, {
      error: 'Body must be a { systemId, prompt, manifest } within size limits.',
    });
  }

  try {
    const spec = await draftBuildWithClaude(payload, { apiKey, model });
    return json(200, { spec });
  } catch {
    return json(502, { error: 'Upstream build authoring failed.' });
  }
}
