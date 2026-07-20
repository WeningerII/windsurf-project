/**
 * AI gateway — Netlify Function entry point. Thin glue: read the provider key
 * from the server environment (never the browser bundle), resolve an adapter via
 * the provider-agnostic registry (`AI_PROVIDER`, default `gemini`; injecting the
 * real Gemini builder), and delegate to the pure, tested HTTP/core logic. With no
 * key and the default provider the core returns `provider-not-configured` and the
 * client falls back to the manual tools — the local-first guarantee.
 *
 * The only provider SDK (`@ai-sdk/google`) is confined to `geminiAdapter.mts`;
 * the registry here merely chooses which adapter to build, keeping `src/ai/**`
 * and the browser bundle SDK-free. Rate limiting goes through a pluggable
 * {@link RateLimitStore} (in-memory by default; durable-ready via
 * `RATE_LIMIT_STORE_URL`) — see `netlify/functions/README.md`.
 */
import { processGatewayHttp } from '../../src/ai/gatewayHttp';
import { createConsoleLogSink } from '../../src/ai/gatewayLog';
import type { RateLimiter } from '../../src/utils/rateLimit';
import { resolveProviderAdapter } from './providerRegistry.mts';
import { rateLimiterFromStore, resolveRateLimitStore } from './rateLimitStore.mts';
import { createGeminiAdapter } from './geminiAdapter.mts';

/**
 * Build a request limiter from env, or `undefined` (no limiting — today's
 * behavior) when `AI_RATE_LIMIT` is unset or non-positive. Counting lives behind
 * a {@link RateLimitStore}: the in-memory default, or a durable backend when one
 * is provisioned (`RATE_LIMIT_STORE_URL` + a wired driver); with neither set this
 * is byte-for-byte the previous in-memory limiter.
 */
function rateLimiterFromEnv(): RateLimiter | undefined {
  const limit = Number(process.env.AI_RATE_LIMIT);
  if (!Number.isFinite(limit) || limit <= 0) return undefined;
  const windowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS);
  // No durable driver is wired in this entry yet, so the resolver returns the
  // in-memory store whether or not RATE_LIMIT_STORE_URL is set. Wire a driver
  // here (second arg) once a backend is provisioned.
  const store = resolveRateLimitStore({ RATE_LIMIT_STORE_URL: process.env.RATE_LIMIT_STORE_URL });
  return rateLimiterFromStore(store, {
    limit,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 60_000,
  });
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

  const rawBody = req.method.toUpperCase() === 'POST' ? await req.text() : '';
  const { status, body } = await processGatewayHttp(req.method, rawBody, {
    adapter,
    rateLimiter: rateLimiterFromEnv(),
    rateLimitKey: clientKey(req),
    log: createConsoleLogSink(),
  });

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
};
