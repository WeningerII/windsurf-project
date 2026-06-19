/**
 * HTTP mapping for the gateway, kept pure (no SDK, no Netlify types) so it is
 * unit-testable and the Netlify entry point stays a thin wrapper. It enforces
 * POST, parses the JSON body, delegates to the provider-agnostic core, and maps
 * the typed response to a sensible HTTP status.
 */
import { aiFailure, type AiResponse } from './contracts';
import { handleAiRequest, type GatewayContext } from './gatewayCore';

export interface GatewayHttpResult {
  status: number;
  body: AiResponse;
}

export async function processGatewayHttp(
  method: string,
  rawBody: string,
  ctx: GatewayContext
): Promise<GatewayHttpResult> {
  if (method.toUpperCase() !== 'POST') {
    return { status: 405, body: aiFailure('invalid-request', 'The AI gateway only accepts POST.') };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody || 'null');
  } catch {
    return { status: 400, body: aiFailure('invalid-request', 'Request body must be valid JSON.') };
  }

  const response = await handleAiRequest(parsed, ctx);
  return { status: statusForResponse(response), body: response };
}

function statusForResponse(response: AiResponse): number {
  if (response.ok) return 200;
  switch (response.code) {
    case 'unsupported-task':
    case 'invalid-request':
      return 400;
    case 'over-budget':
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
