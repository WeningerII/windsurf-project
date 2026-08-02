import { describe, it, expect } from 'vitest';

import { analyzeMapWithAi, type AnalyzeMapGatewayCall } from '../../ai/analyzeMapFlow';
import type { AnalyzeMapData } from '../../ai/contracts';
import { GRID_GEOMETRY_PROPOSAL_VERSION } from '../../scene/gridGeometryProposal';

/**
 * Phase 10's join: the model proposes grid geometry, and the deterministic
 * validator that shipped with `gridGeometryProposal.ts` decides. The tests that
 * matter here are the ones where the model is WRONG — a flow that only works on
 * good output is not a gate.
 */

const IMAGE = { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' } as const;
const SIZE = { widthPx: 1000, heightPx: 800 };

function gatewayReturning(data: AnalyzeMapData): AnalyzeMapGatewayCall {
  return (async () => ({
    ok: true as const,
    task: 'analyze-map' as const,
    data,
    usage: { source: 'fixture' as const },
  })) as unknown as AnalyzeMapGatewayCall;
}

const SOUND: AnalyzeMapData = {
  registration: { offsetX: 0, offsetY: 0, cellSizePx: 50 },
  boxes: [
    { kind: 'spawn', rect: { x: 0, y: 0, width: 100, height: 100 }, label: 'North stair' },
    { kind: 'cover', rect: { x: 200, y: 200, width: 50, height: 50 }, suggestedPreset: 'cover-2' },
  ],
  reason: 'The flagstones are 50px across.',
};

describe('analyzeMapWithAi', () => {
  it('accepts a sound proposal and stamps the pinned envelope version', async () => {
    const result = await analyzeMapWithAi(
      { image: IMAGE, imageSize: SIZE },
      { call: gatewayReturning(SOUND) }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.proposal.version).toBe(GRID_GEOMETRY_PROPOSAL_VERSION);
    expect(result.validation.verdict).toBe('accept');
    expect(result.proposal.registration.cellSizePx).toBe(50);
    expect(result.reason).toBe('The flagstones are 50px across.');
  });

  it('stamps the CLIENT-measured image size, so a lying model cannot smuggle an off-image box', async () => {
    // The box sits at x=4000 — far outside the real 1000px-wide image. A model
    // that also claimed the image were 8000px wide would make it look in-bounds
    // if the proposal took its word for the dimensions. It does not: `image` is
    // stamped from the caller's measurement, so `box-out-of-image` still fires.
    const lying: AnalyzeMapData = {
      registration: { offsetX: 0, offsetY: 0, cellSizePx: 50 },
      boxes: [{ kind: 'spawn', rect: { x: 4000, y: 0, width: 100, height: 100 } }],
      // A model CAN return extra keys; the parser drops them, and the flow
      // never reads them. Pinned here as the shape a lie would arrive in.
      ...({ image: { widthPx: 8000, heightPx: 8000 } } as object),
    };

    const result = await analyzeMapWithAi(
      { image: IMAGE, imageSize: SIZE },
      { call: gatewayReturning(lying) }
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.validation?.issues.some((issue) => issue.code === 'box-out-of-image')).toBe(true);
  });

  it('surfaces manual-correction as a SUCCESS the human can adjust, not an error', async () => {
    // A sub-8px cell is implausible for a battle map: the validator flags it
    // `correction`, which is the whole point of the three-way verdict.
    const tiny: AnalyzeMapData = {
      registration: { offsetX: 0, offsetY: 0, cellSizePx: 4 },
      boxes: [{ kind: 'spawn', rect: { x: 0, y: 0, width: 40, height: 40 } }],
    };

    const result = await analyzeMapWithAi(
      { image: IMAGE, imageSize: SIZE },
      { call: gatewayReturning(tiny) }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.validation.verdict).toBe('manual-correction');
    expect(result.validation.issues.some((issue) => issue.code === 'cell-too-small')).toBe(true);
  });

  it('rejects an unusable registration rather than returning a proposal', async () => {
    const broken: AnalyzeMapData = {
      registration: { offsetX: 0, offsetY: 0, cellSizePx: 0 },
      boxes: [{ kind: 'spawn', rect: { x: 0, y: 0, width: 40, height: 40 } }],
    };

    const result = await analyzeMapWithAi(
      { image: IMAGE, imageSize: SIZE },
      { call: gatewayReturning(broken) }
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('rejected');
  });

  it('refuses to call the gateway at all when the image could not be measured', async () => {
    let called = false;
    const spy = (async () => {
      called = true;
      throw new Error('should never be reached');
    }) as unknown as AnalyzeMapGatewayCall;

    const result = await analyzeMapWithAi(
      { image: IMAGE, imageSize: { widthPx: 0, heightPx: 0 } },
      { call: spy }
    );

    expect(called).toBe(false);
    expect(result.ok).toBe(false);
  });

  it('passes a gateway failure through as the error', async () => {
    const failing = (async () => ({
      ok: false as const,
      code: 'provider-error' as const,
      message: 'The provider is unavailable.',
    })) as unknown as AnalyzeMapGatewayCall;

    const result = await analyzeMapWithAi({ image: IMAGE, imageSize: SIZE }, { call: failing });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe('The provider is unavailable.');
  });
});
