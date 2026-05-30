import { AI_GATEWAY_SCHEMA_VERSION, type AiGatewayRequest, callAiGateway } from '../ai';

function buildRequest(): AiGatewayRequest {
  return {
    schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
    task: 'character-concept-draft',
    traceId: 'trace-request',
    payload: {
      systemId: 'dnd-5e-2024',
      prompt: 'Make a sturdy front-line character.',
      candidatePool: {
        systemId: 'dnd-5e-2024',
        categories: [
          {
            id: 'class',
            label: 'Class',
            candidates: [{ id: 'fighter', label: 'Fighter', source: 'SRD 5.2.1' }],
          },
        ],
      },
    },
  };
}

describe('callAiGateway', () => {
  it('posts structured requests to the configured endpoint', async () => {
    const gatewayResponse = {
      ok: true,
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'character-concept-draft',
      traceId: 'trace-response',
      data: {
        systemId: 'dnd-5e-2024',
        conceptSummary: 'A sturdy front-line character.',
        choices: [{ categoryId: 'class', candidateId: 'fighter' }],
      },
    };
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify(gatewayResponse))
    ) as unknown as typeof fetch;

    const response = await callAiGateway(buildRequest(), {
      endpoint: '/test-ai-gateway',
      fetchImpl,
    });

    expect(response).toEqual(gatewayResponse);
    expect(fetchImpl).toHaveBeenCalledWith('/test-ai-gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequest()),
    });
  });

  it('normalizes invalid successful gateway payloads', async () => {
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify({ ok: true }))
    ) as unknown as typeof fetch;

    const response = await callAiGateway(buildRequest(), { fetchImpl });

    expect(response).toMatchObject({
      ok: false,
      task: 'character-concept-draft',
      traceId: 'trace-request',
      error: {
        code: 'invalid-request',
        retryable: false,
      },
    });
  });

  it('normalizes provider configuration failures from HTTP status', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('not configured', { status: 503 })
    ) as unknown as typeof fetch;

    const response = await callAiGateway(buildRequest(), { fetchImpl });

    expect(response).toMatchObject({
      ok: false,
      error: {
        code: 'provider-not-configured',
        retryable: false,
      },
    });
  });
});
