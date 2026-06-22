import { describe, expect, it, vi } from 'vitest';

import { analyzeMapWithAi, type AnalyzeMapParams, type GatewayCall } from '../../ai/analyzeMapFlow';
import type { AiResponse, AnalyzeMapData } from '../../ai/contracts';

/**
 * PHASE 10 (RFC 006): the map-analysis flow. The model proposes a grid + region
 * boxes; the deterministic geometry validator decides; one bounded repair, then
 * the GM falls back to manual registration.
 */

const params: AnalyzeMapParams = {
  image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
  imageWidth: 700,
  imageHeight: 700,
  gridWidth: 10,
  gridHeight: 10,
};

const valid: AnalyzeMapData = {
  pixelsPerCell: 70,
  offsetX: 0,
  offsetY: 0,
  regions: [{ kind: 'hazard', label: 'Lava', x: 1, y: 1, width: 2, height: 2 }],
};

// A grid that runs off the image (10 x 80 = 800 > 700) — rejected by the validator.
const offGrid: AnalyzeMapData = { ...valid, pixelsPerCell: 80 };

function success(data: AnalyzeMapData): AiResponse<AnalyzeMapData> {
  return { ok: true, task: 'analyze-map', data, usage: { source: 'fixture' } };
}

function scripted(responses: AiResponse<AnalyzeMapData>[]): {
  call: GatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  let index = 0;
  const call = vi.fn(async (_task: 'analyze-map', payload: unknown) => {
    payloads.push(payload);
    return responses[Math.min(index++, responses.length - 1)];
  }) as unknown as GatewayCall;
  return { call, payloads };
}

describe('analyzeMapWithAi', () => {
  it('returns a proposal that passes the geometry validator', async () => {
    const { call } = scripted([success(valid)]);
    const result = await analyzeMapWithAi(params, { call });
    expect(result).toEqual({ ok: true, analysis: valid });
  });

  it('repairs once: a rejected proposal, then a valid one', async () => {
    const { call, payloads } = scripted([success(offGrid), success(valid)]);
    const result = await analyzeMapWithAi(params, { call });
    expect(result.ok).toBe(true);
    expect(payloads).toHaveLength(2);
    // The repair attempt carries the validator's coded issues.
    expect(payloads[1]).toMatchObject({
      repairIssues: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('gives up after the repair budget so the GM registers manually', async () => {
    const { call, payloads } = scripted([success(offGrid)]);
    const result = await analyzeMapWithAi(params, { call });
    expect(result).toEqual({
      ok: false,
      error: 'The AI could not produce a usable map analysis. Register the grid manually instead.',
    });
    expect(payloads).toHaveLength(2); // initial + one repair
  });

  it('passes a gateway failure through as an error', async () => {
    const { call } = scripted([
      { ok: false, task: 'analyze-map', code: 'provider-not-configured', message: 'AI is off.' },
    ]);
    expect(await analyzeMapWithAi(params, { call })).toEqual({ ok: false, error: 'AI is off.' });
  });
});
