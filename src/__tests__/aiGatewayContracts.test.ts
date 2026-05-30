import {
  AI_GATEWAY_SCHEMA_VERSION,
  type AiGatewayResponse,
  isAiGatewayResponse,
  isSupportedAiGatewayTask,
} from '../ai';

describe('AI gateway contracts', () => {
  it('recognizes the currently implemented task allowlist', () => {
    expect(isSupportedAiGatewayTask('character-concept-draft')).toBe(true);
    expect(isSupportedAiGatewayTask('character-draft-repair')).toBe(true);
    expect(isSupportedAiGatewayTask('open-ended-chat')).toBe(false);
  });

  it('accepts a structured gateway success response', () => {
    const response: AiGatewayResponse = {
      ok: true,
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'character-concept-draft',
      traceId: 'trace-1',
      data: {
        systemId: 'dnd-5e-2024',
        conceptSummary: 'A careful defender.',
        choices: [{ categoryId: 'class', candidateId: 'fighter' }],
      },
    };

    expect(isAiGatewayResponse(response)).toBe(true);
  });

  it('rejects malformed gateway responses', () => {
    expect(
      isAiGatewayResponse({
        ok: true,
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'open-ended-chat',
        traceId: 'trace-1',
        data: {},
      })
    ).toBe(false);

    expect(
      isAiGatewayResponse({
        ok: false,
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        traceId: 'trace-1',
        error: { code: 'provider-error', message: 'failed' },
      })
    ).toBe(false);
  });
});
