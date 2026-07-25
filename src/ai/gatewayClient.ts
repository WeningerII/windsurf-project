/**
 * Browser-side AI gateway client. Talks to the same-origin Netlify function
 * over HTTP and never imports a provider SDK or holds a key — secrets live only
 * in the server function's environment. Every transport failure is normalized
 * to a typed {@link AiFailure} so callers degrade to the manual tools rather
 * than throwing.
 *
 * When the user is signed in (Supabase configured + active session), each call
 * carries the session's access token as `Authorization: Bearer ...` so a
 * gateway deployed with `SUPABASE_JWT_SECRET` can authenticate it. Signed-out
 * or Supabase-less setups simply send no header — on a local-first deploy the
 * gateway accepts that; on an auth-enforcing deploy it answers 401
 * (`unauthorized`) and callers fall back to the manual tools as usual.
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
import { getSupabaseClient } from '../utils/supabaseClient';
import { ErrorCategory, errorLogger, ErrorSeverity } from '../utils/errorLogger';

/**
 * Failure codes that are the gateway working AS DESIGNED, not a health signal:
 * cost controls tripping, auth doing its job, a key-less local-first deploy, and
 * a request the allowlist rejects. Reporting these would drown rule (b) in
 * intended behaviour — `docs/runbooks/sentry-alerts.md` calls out the 429 case
 * explicitly. Everything else is provider/transport trouble worth an alert.
 */
const BY_DESIGN_FAILURE_CODES: ReadonlySet<string> = new Set([
  'over-budget',
  'budget-exceeded',
  'unauthorized',
  'provider-not-configured',
  'invalid-request',
  'unsupported-task',
]);

/**
 * Surface an unhealthy gateway outcome to production monitoring
 * (`docs/runbooks/sentry-alerts.md` rule (b) — dormant until now because the
 * browser client degraded every failure silently and the Netlify Function's
 * structured trace log, `src/ai/gatewayLog.ts`, only reaches the function log).
 *
 * Observability only: the typed failure is still returned and callers still
 * degrade to the manual tools. The payload carries NO prompt, payload, or
 * response content — only the task, the normalized failure code, the gateway's
 * own `traceId` (which correlates with the server record), and a `surface: 'ai'`
 * tag. `errorLogger` forwards nothing unless a Sentry DSN is configured.
 */
function reportGatewayFailure(task: AiTask, code: string, traceId?: string): void {
  if (BY_DESIGN_FAILURE_CODES.has(code)) return;
  errorLogger.log(ErrorCategory.NETWORK, ErrorSeverity.HIGH, 'ai gateway call failed', undefined, {
    surface: 'ai',
    task,
    code,
    ...(traceId ? { traceId } : {}),
  });
}

/**
 * Whether AI affordances should render at all. Build-time, default OFF, so the
 * app's shipped behavior is unchanged until AI is explicitly turned on — and
 * even when on, the gateway still degrades server-side if no key is set.
 */
export function isAiEnabled(): boolean {
  return isFeatureEnabled('ai');
}

/**
 * The signed-in user's Supabase access token, or undefined when Supabase is
 * not configured, no session exists, or the lookup fails — auth is best-effort
 * on the client; the gateway is where it is (conditionally) enforced.
 */
async function sessionAccessToken(): Promise<string | undefined> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return undefined;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || undefined;
  } catch {
    return undefined;
  }
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
  const accessToken = await sessionAccessToken();
  let response: Response;
  try {
    response = await fetch(AI_GATEWAY_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(request),
      signal,
    });
  } catch {
    reportGatewayFailure(task, 'transport-error');
    return aiFailure('provider-error', 'Could not reach the AI gateway.', task);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    reportGatewayFailure(task, 'unreadable-response');
    return aiFailure('provider-error', 'The AI gateway returned an unreadable response.', task);
  }

  if (!isAiResponse(json)) {
    reportGatewayFailure(task, 'malformed-response');
    return aiFailure('provider-error', 'The AI gateway returned an unexpected response.', task);
  }

  const parsed = json as AiResponse<TData>;
  if (!parsed.ok) {
    reportGatewayFailure(task, parsed.code, parsed.traceId);
  }
  return parsed;
}
