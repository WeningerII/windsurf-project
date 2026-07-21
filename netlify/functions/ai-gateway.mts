/**
 * AI gateway — Netlify Function entry point. Thin glue: read the provider key
 * from the server environment (never the browser bundle), resolve an adapter via
 * the provider-agnostic registry (`AI_PROVIDER`, default `gemini`; injecting the
 * real Gemini builder), and delegate to the pure, tested HTTP/core logic. With no
 * key and the default provider the core returns `provider-not-configured` and the
 * client falls back to the manual tools — the local-first guarantee.
 *
 * Cost controls (Phase 14): request rate limiting (`AI_RATE_LIMIT`) and a
 * per-session cost cap (`AI_SESSION_BUDGET_UNITS`) share ONE module-scope
 * counter store, so counters survive warm invocations; per-task-class latency
 * budgets (`AI_LATENCY_BUDGET_*_MS`) cap each provider call and flag slow
 * traces. All are off/inert by default — see `netlify/functions/README.md`.
 *
 * The only provider SDK (`@ai-sdk/google`) is confined to `geminiAdapter.mts`;
 * the registry here merely chooses which adapter to build, keeping `src/ai/**`
 * and the browser bundle SDK-free. Rate limiting goes through a pluggable
 * {@link RateLimitStore} (in-memory by default; durable-ready via
 * `RATE_LIMIT_STORE_URL`) — see `netlify/functions/README.md`.
 *
 * Auth (Phase 5 M2): when a real provider resolved AND `SUPABASE_JWT_SECRET`
 * is set, every request must carry a valid Supabase access token
 * (`Authorization: Bearer ...`, HS256-verified in `supabaseJwt.mts`) or it is
 * rejected 401 before the body is parsed. Without the secret (pure local-first
 * deploys) or without a provider key, nothing changes.
 */
import { DEFAULT_LATENCY_BUDGET_MS, type SessionBudget } from '../../src/ai/gatewayCore';
import { processGatewayHttp } from '../../src/ai/gatewayHttp';
import { createConsoleLogSink } from '../../src/ai/gatewayLog';
import type { AiTaskClass } from '../../src/ai/contracts';
import type { RateLimiter } from '../../src/utils/rateLimit';
import { resolveProviderAdapter } from './providerRegistry.mts';
import {
  rateLimiterFromStore,
  resolveRateLimitStore,
  sessionBudgetFromStore,
} from './rateLimitStore.mts';
import { createGeminiAdapter } from './geminiAdapter.mts';
import { resolveGatewayAuth } from './supabaseJwt.mts';

/** Parse a positive number from env, else the fallback. */
function positiveEnv(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * ONE store instance for the whole function lifetime — counters must survive
 * across requests to mean anything, and Netlify keeps module scope alive
 * between warm invocations. Rate limiting and the session budget share it
 * (budget keys are namespaced), so provisioning a durable backend later
 * (`RATE_LIMIT_STORE_URL` + a wired driver, second arg of the resolver) covers
 * both counters at once.
 */
const counterStore = resolveRateLimitStore({
  RATE_LIMIT_STORE_URL: process.env.RATE_LIMIT_STORE_URL,
});

/**
 * Build a request limiter from env, or `undefined` (no limiting — today's
 * behavior) when `AI_RATE_LIMIT` is unset or non-positive.
 */
function rateLimiterFromEnv(): RateLimiter | undefined {
  const limit = Number(process.env.AI_RATE_LIMIT);
  if (!Number.isFinite(limit) || limit <= 0) return undefined;
  return rateLimiterFromStore(counterStore, {
    limit,
    windowMs: positiveEnv(process.env.AI_RATE_LIMIT_WINDOW_MS, 60_000),
  });
}

/**
 * Build the session cost cap from env, or `undefined` (no cap — prior
 * behavior) when `AI_SESSION_BUDGET_UNITS` is unset or non-positive. Each
 * request is charged its task's deterministic unit cost (`AI_TASK_UNIT_COST`)
 * against the caller's session key — the verified Supabase user id when auth is
 * on, else the client ip — and a tripped cap answers the typed
 * `budget-exceeded` failure (429) until the window resets.
 */
function sessionBudgetFromEnv(): SessionBudget | undefined {
  const maxUnits = Number(process.env.AI_SESSION_BUDGET_UNITS);
  if (!Number.isFinite(maxUnits) || maxUnits <= 0) return undefined;
  return sessionBudgetFromStore(counterStore, {
    maxUnits,
    windowMs: positiveEnv(process.env.AI_SESSION_BUDGET_WINDOW_MS, 21_600_000), // 6 h
  });
}

/**
 * Per-task-class latency budgets: code defaults, individually overridable via
 * env. The budget is the hard cap on the provider call for tasks of that class
 * and the threshold for the `latencyBudgetExceeded` flag in the trace log.
 */
function latencyBudgetsFromEnv(): Record<AiTaskClass, number> {
  return {
    text: positiveEnv(process.env.AI_LATENCY_BUDGET_TEXT_MS, DEFAULT_LATENCY_BUDGET_MS.text),
    vision: positiveEnv(process.env.AI_LATENCY_BUDGET_VISION_MS, DEFAULT_LATENCY_BUDGET_MS.vision),
    image: positiveEnv(process.env.AI_LATENCY_BUDGET_IMAGE_MS, DEFAULT_LATENCY_BUDGET_MS.image),
  };
}

/** Bucket rate limiting on the client connection, falling back to a global key. */
function clientKey(req: Request): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for') ?? 'global'
  );
}

export default async (req: Request): Promise<Response> => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;
  const model = process.env.AI_GATEWAY_MODEL;
  const imageModel = process.env.AI_IMAGE_MODEL;

  const adapter = resolveProviderAdapter(
    { provider: process.env.AI_PROVIDER, apiKey },
    {
      // Only invoked when the registry selects Gemini AND a key is present, so the
      // non-null assertion is safe. Keeps the SDK import confined to the adapter.
      createGoogleAdapter: () =>
        createGeminiAdapter(apiKey as string, model || undefined, imageModel || undefined),
    }
  );

  // The JWT check engages only when there is something to protect (a real
  // adapter) and auth is configured; otherwise the authorizer stays undefined
  // and the request flows exactly as before — key-less degradation unchanged.
  const verifyJwt = resolveGatewayAuth({ SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET });
  const authorize =
    adapter && verifyJwt ? () => verifyJwt(req.headers.get('authorization')) : undefined;

  const rawBody = req.method.toUpperCase() === 'POST' ? await req.text() : '';
  const key = clientKey(req);
  const { status, body } = await processGatewayHttp(
    req.method,
    rawBody,
    {
      adapter,
      rateLimiter: rateLimiterFromEnv(),
      rateLimitKey: key,
      // The client ip is the session key by default; when auth is on, the pure
      // HTTP layer upgrades it to the verified Supabase user id (JWT `sub`).
      sessionBudget: sessionBudgetFromEnv(),
      sessionKey: key,
      latencyBudgets: latencyBudgetsFromEnv(),
      log: createConsoleLogSink(),
    },
    authorize
  );

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
};
