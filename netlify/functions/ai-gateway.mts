/**
 * AI gateway — Netlify Function entry point. Thin glue: read the provider key
 * from the server environment (never the browser bundle), select an adapter via
 * the SDK-free provider factory (injecting the real Gemini builder), and delegate
 * to the pure, tested HTTP/core logic. With no key and the default provider the
 * core returns `provider-not-configured` and the client falls back to the manual
 * tools — the local-first guarantee.
 *
 * The only provider SDK (`@ai-sdk/google`) is confined to `geminiAdapter.mts`;
 * the factory here merely chooses which adapter to build, keeping `src/ai/**`
 * and the browser bundle SDK-free.
 */
import { processGatewayHttp } from '../../src/ai/gatewayHttp';
import { selectAiProvider } from '../../src/ai/providerFactory';
import { createConsoleLogSink } from '../../src/ai/gatewayLog';
import { createRateLimiter, type RateLimiter } from '../../src/utils/rateLimit';
import { createGeminiAdapter } from './geminiAdapter.mts';

/**
 * Build a request limiter from env, or `undefined` (no limiting — today's
 * behavior) when `AI_RATE_LIMIT` is unset or non-positive.
 */
function rateLimiterFromEnv(): RateLimiter | undefined {
  const limit = Number(process.env.AI_RATE_LIMIT);
  if (!Number.isFinite(limit) || limit <= 0) return undefined;
  const windowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS);
  return createRateLimiter({
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

  const adapter = selectAiProvider(
    { provider: process.env.AI_PROVIDER, apiKey },
    {
      // Only invoked when the factory selects Google AND a key is present, so the
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
