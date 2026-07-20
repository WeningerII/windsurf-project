/**
 * Browser-side AI gateway client. Talks to the same-origin Netlify function
 * over HTTP and never imports a provider SDK or holds a key — secrets live only
 * in the server function's environment. Every transport failure is normalized
 * to a typed {@link AiFailure} so callers degrade to the manual tools rather
 * than throwing.
 */
import {
  AI_GATEWAY_ENDPOINT,
  AI_GATEWAY_SCHEMA_VERSION,
  aiFailure,
  isAiResponse,
  type AiRequest,
  type AiResponse,
  type AiTask,
} from './contracts';
import { isFeatureEnabled } from '../config/featureFlags';

/**
 * Whether AI affordances should render at all. Build-time, default OFF, so the
 * app's shipped behavior is unchanged until AI is explicitly turned on — and
 * even when on, the gateway still degrades server-side if no key is set.
 */
export function isAiEnabled(): boolean {
  return isFeatureEnabled('ai');
}

export async function callAiGateway<TData>(
  task: AiTask,
  payload: unknown,
  signal?: AbortSignal
): Promise<AiResponse<TData>> {
  if (!isAiEnabled()) {
    return aiFailure('provider-not-configured', 'AI features are turned off.', task);
  }
  const request: AiRequest = { schemaVersion: AI_GATEWAY_SCHEMA_VERSION, task, payload };
  let response: Response;
  try {
    response = await fetch(AI_GATEWAY_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    });
  } catch {
    return aiFailure('provider-error', 'Could not reach the AI gateway.', task);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return aiFailure('provider-error', 'The AI gateway returned an unreadable response.', task);
  }

  if (!isAiResponse(json)) {
    return aiFailure('provider-error', 'The AI gateway returned an unexpected response.', task);
  }
  return json as AiResponse<TData>;
}
