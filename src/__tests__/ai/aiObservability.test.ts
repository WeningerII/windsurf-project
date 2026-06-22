import { describe, expect, it } from 'vitest';

import {
  DEFAULT_BUDGET_CAPS,
  IMAGE_UNIT_COST,
  buildTrace,
  estimateUnits,
  wouldExceedBudget,
} from '../../ai/aiObservability';
import { PROMPT_TEMPLATE_VERSION } from '../../ai/prompts';
import type { AiResponse } from '../../ai/contracts';

/**
 * PHASE 14 (RFC 002): deterministic AI observability + cost controls. Unit
 * estimates and budget checks are pure and replayable; a trace record links a
 * trace id to its task, prompt version, provider/model, units, and latency.
 */

describe('estimateUnits', () => {
  it('estimates ~1 unit per 4 characters of the payload', () => {
    const payload = { prompt: 'x'.repeat(40) };
    // JSON is {"prompt":"xxxx...40..."} → length/4, deterministic for a fixed input.
    expect(estimateUnits(payload)).toBe(Math.ceil(JSON.stringify(payload).length / 4));
  });

  it('counts an image as a flat cost, not its raw base64 length', () => {
    const bigImage = 'data:image/png;base64,' + 'A'.repeat(500_000);
    const withImage = estimateUnits({ image: { dataUrl: bigImage, mediaType: 'image/png' } });
    const withoutImage = estimateUnits({
      image: { dataUrl: 'data:image', mediaType: 'image/png' },
    });
    // The half-megabyte of base64 must not dominate the estimate.
    expect(withImage).toBeLessThan(withoutImage + IMAGE_UNIT_COST + 50);
    expect(withImage).toBeGreaterThanOrEqual(IMAGE_UNIT_COST);
  });

  it('is deterministic', () => {
    const payload = { a: 1, b: 'hello', c: [1, 2, 3] };
    expect(estimateUnits(payload)).toBe(estimateUnits(payload));
  });
});

describe('wouldExceedBudget', () => {
  it('trips on the call ceiling', () => {
    const caps = { maxCalls: 2, maxUnits: Infinity };
    expect(wouldExceedBudget({ calls: 1, units: 0 }, caps, 10)).toBe(false); // 2nd call ok
    expect(wouldExceedBudget({ calls: 2, units: 0 }, caps, 10)).toBe(true); // 3rd over
  });

  it('trips on the unit ceiling', () => {
    const caps = { maxCalls: Infinity, maxUnits: 100 };
    expect(wouldExceedBudget({ calls: 0, units: 90 }, caps, 10)).toBe(false); // exactly 100
    expect(wouldExceedBudget({ calls: 0, units: 91 }, caps, 10)).toBe(true); // 101 over
  });

  it('has finite, generous defaults', () => {
    expect(DEFAULT_BUDGET_CAPS.maxCalls).toBeGreaterThan(0);
    expect(Number.isFinite(DEFAULT_BUDGET_CAPS.maxUnits)).toBe(true);
  });
});

describe('buildTrace', () => {
  it('records provider provenance for a successful call (golden shape)', () => {
    const response: AiResponse = {
      ok: true,
      task: 'encounter-draft',
      data: { selections: [] },
      usage: { source: 'provider', provider: 'google', model: 'gemini-2.0-flash' },
    };
    const trace = buildTrace({
      traceId: 'trace-1',
      task: 'encounter-draft',
      estimatedUnits: 42,
      latencyMs: 123,
      response,
    });
    expect(trace).toEqual({
      traceId: 'trace-1',
      task: 'encounter-draft',
      promptVersion: PROMPT_TEMPLATE_VERSION,
      estimatedUnits: 42,
      latencyMs: 123,
      ok: true,
      source: 'provider',
      provider: 'google',
      model: 'gemini-2.0-flash',
    });
  });

  it('records the failure code for a failed call', () => {
    const response: AiResponse = {
      ok: false,
      task: 'scene-narration',
      code: 'timeout',
      message: 'slow',
    };
    const trace = buildTrace({
      traceId: 'trace-2',
      task: 'scene-narration',
      estimatedUnits: 5,
      latencyMs: 20000,
      response,
    });
    expect(trace).toMatchObject({ traceId: 'trace-2', ok: false, code: 'timeout' });
    expect(trace).not.toHaveProperty('provider');
  });
});
