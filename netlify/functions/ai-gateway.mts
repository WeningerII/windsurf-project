/**
 * AI gateway — Netlify Function entry point. Thin glue: read the provider key
 * from the server environment (never the browser bundle), build the adapter
 * when a key is present, and delegate to the pure, tested HTTP/core logic. With
 * no key the core returns `provider-not-configured` and the client falls back to
 * the manual tools — the local-first guarantee.
 */
import { processGatewayHttp } from '../../src/ai/gatewayHttp';
import { createGeminiAdapter } from './geminiAdapter.mts';

export default async (req: Request): Promise<Response> => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;
  const model = process.env.AI_GATEWAY_MODEL;
  const adapter = apiKey ? createGeminiAdapter(apiKey, model || undefined) : undefined;

  const rawBody = req.method.toUpperCase() === 'POST' ? await req.text() : '';
  const { status, body } = await processGatewayHttp(req.method, rawBody, { adapter });

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
};
