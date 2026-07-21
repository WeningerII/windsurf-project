/**
 * HTTP mapping for the gateway, kept pure (no SDK, no Netlify types) so it is
 * unit-testable and the Netlify entry point stays a thin wrapper. It enforces
 * POST, runs an optional injected authorizer (the Supabase-JWT check on real
 * deploys — see `netlify/functions/supabaseJwt.mts`), parses the JSON body,
 * delegates to the provider-agnostic core, and maps the typed response to a
 * sensible HTTP status.
 */
import { aiFailure, type AiResponse } from './contracts';
import { handleAiRequest, type GatewayContext } from './gatewayCore';

export interface GatewayHttpResult {
  status: number;
  body: AiResponse;
}

/**
 * Outcome of the injected request authorizer (verdict only; no throw). On
 * success it may carry the authenticated `subject` (the JWT `sub` claim), which
 * becomes the session-budget key — a stable per-user identity beats a client ip.
 */
export type GatewayAuthVerdict = { ok: true; subject?: string } | { ok: false; message: string };

/**
 * The auth seam. The Netlify entry injects a closure over the request's
 * `Authorization` header (Supabase-JWT verification, Node crypto) ONLY when
 * auth is configured AND a real provider is wired; when absent, requests flow
 * exactly as before — the local-first / key-less deploy stays untouched.
 */
export type GatewayAuthorizer = () => GatewayAuthVerdict;

/**
 * Hard ceiling on the request body, kept below the host's synchronous-function
 * payload limit (Netlify allows ~6 MiB). The image-input cap in `contracts.ts`
 * is sized so a base64 image plus its envelope stays under this.
 */
export const MAX_GATEWAY_REQUEST_BYTES = 6_000_000;

export async function processGatewayHttp(
  method: string,
  rawBody: string,
  ctx: GatewayContext,
  authorize?: GatewayAuthorizer
): Promise<GatewayHttpResult> {
  if (method.toUpperCase() !== 'POST') {
    return { status: 405, body: aiFailure('invalid-request', 'The AI gateway only accepts POST.') };
  }

  // Auth runs before any body handling: an unauthenticated caller learns
  // nothing about payload validation, and we do no parsing work for them.
  // A verified subject (JWT `sub`) upgrades the session-budget key from the
  // caller-supplied default (typically a client ip) to a per-user identity.
  let effectiveCtx = ctx;
  if (authorize) {
    const verdict = authorize();
    if (!verdict.ok) {
      return { status: 401, body: aiFailure('unauthorized', verdict.message) };
    }
    if (verdict.subject) {
      effectiveCtx = { ...ctx, sessionKey: verdict.subject };
    }
  }

  if (rawBody.length > MAX_GATEWAY_REQUEST_BYTES) {
    return {
      status: 413,
      body: aiFailure('invalid-request', 'Request is too large; use a smaller image or prompt.'),
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody || 'null');
  } catch {
    return { status: 400, body: aiFailure('invalid-request', 'Request body must be valid JSON.') };
  }

  const response = await handleAiRequest(parsed, effectiveCtx);
  return { status: statusForResponse(response), body: response };
}

function statusForResponse(response: AiResponse): number {
  if (response.ok) return 200;
  switch (response.code) {
    case 'unsupported-task':
    case 'invalid-request':
      return 400;
    case 'unauthorized':
      return 401;
    case 'over-budget':
    case 'budget-exceeded':
      return 429;
    case 'provider-not-configured':
      return 503;
    case 'timeout':
      return 504;
    case 'provider-error':
    case 'invalid-provider-output':
    default:
      return 502;
  }
}
