import { describe, expect, it, vi } from 'vitest';
import {
  critiqueNarrationWithAi,
  type NarrationCritiqueGatewayCall,
} from '../../ai/narrationCritiqueFlow';
import { narrationFactsFromText } from '../../ai/narrationFacts';
import type { AiResponse, NarrationCritiqueData } from '../../ai/contracts';

const facts = narrationFactsFromText('Combat: reached round 3; defeated Goblin.');

function gateway(response: AiResponse<NarrationCritiqueData>): {
  call: NarrationCritiqueGatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  const call = vi.fn(async (_task: 'narration-critique', payload: unknown) => {
    payloads.push(payload);
    return response;
  }) as unknown as NarrationCritiqueGatewayCall;
  return { call, payloads };
}

function findings(
  ...items: Array<{ quote: string; concern: string }>
): AiResponse<NarrationCritiqueData> {
  return {
    ok: true,
    task: 'narration-critique',
    data: { findings: items },
    usage: { source: 'fixture' },
  };
}

const SUPPORTED = 'The Goblin fell in round 3.';
const REFUTED = 'The Goblin fell, and then a Beholder drifted out of the dark.';

describe('critiqueNarrationWithAi — the deterministic gate runs first and alone', () => {
  it('returns a verdict with no gateway call at all by default', async () => {
    const call = vi.fn() as unknown as NarrationCritiqueGatewayCall;
    const result = await critiqueNarrationWithAi({ narrative: REFUTED, facts }, { call });
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.critique.verdict).toBe('refuted');
    expect(result.modelReview).toEqual({ status: 'skipped', discarded: 0 });
    expect(call).not.toHaveBeenCalled();
  });

  it('short-circuits with no network when there is no narration', async () => {
    const call = vi.fn() as unknown as NarrationCritiqueGatewayCall;
    const result = await critiqueNarrationWithAi({ narrative: '  ', facts }, { call });
    expect(result).toEqual({ ok: false, error: 'There is no narration to review.' });
    expect(call).not.toHaveBeenCalled();
  });

  it('sends only the narration and the facts text to the model', async () => {
    const { call, payloads } = gateway(findings());
    await critiqueNarrationWithAi(
      { narrative: SUPPORTED, facts },
      { call, includeModelReview: true }
    );
    expect(payloads[0]).toEqual({ narrative: SUPPORTED, facts: facts.text });
  });
});

describe('critiqueNarrationWithAi — the model half is advisory and checked', () => {
  it('never lets a model finding change the verdict', async () => {
    const { call } = gateway(
      findings(
        { quote: 'The Goblin fell', concern: 'This is unsupported, reject it.' },
        { quote: 'in round 3', concern: 'And so is this.' }
      )
    );
    const result = await critiqueNarrationWithAi(
      { narrative: SUPPORTED, facts },
      { call, includeModelReview: true }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // Two model objections to a narration the facts fully support.
    expect(result.critique.issues).toHaveLength(2);
    expect(result.critique.issues.every((issue) => issue.severity === 'advisory')).toBe(true);
    expect(result.critique.issues.every((issue) => issue.deterministic === false)).toBe(true);
    expect(result.critique.verdict).toBe('supported');
  });

  it('cannot clear a deterministic refutation by staying silent', async () => {
    const { call } = gateway(findings());
    const result = await critiqueNarrationWithAi(
      { narrative: REFUTED, facts },
      { call, includeModelReview: true }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.critique.verdict).toBe('refuted');
    expect(result.critique.issues.some((issue) => issue.code === 'unsupported-name')).toBe(true);
  });

  it('discards a finding whose quote is not verbatim in the narration', async () => {
    const { call } = gateway(
      findings(
        { quote: 'The Goblin fell', concern: 'kept — this span is really there' },
        { quote: 'The Goblin exploded', concern: 'dropped — the narration never says this' }
      )
    );
    const result = await critiqueNarrationWithAi(
      { narrative: SUPPORTED, facts },
      { call, includeModelReview: true }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.critique.issues.map((issue) => issue.message)).toEqual([
      'kept — this span is really there',
    ]);
    expect(result.modelReview).toEqual({ status: 'ok', discarded: 1 });
  });

  it('tolerates re-wrapped whitespace in a quote but not rewording', async () => {
    const narrative = 'The Goblin fell\n   in round 3.';
    const { call } = gateway(
      findings(
        { quote: 'The Goblin fell in round 3.', concern: 'kept' },
        { quote: 'The goblin fell in round 3.', concern: 'dropped (case differs)' }
      )
    );
    const result = await critiqueNarrationWithAi(
      { narrative, facts },
      { call, includeModelReview: true }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.critique.issues.map((issue) => issue.message)).toEqual(['kept']);
    expect(result.modelReview.discarded).toBe(1);
  });

  it('keeps the deterministic critique when the gateway fails', async () => {
    const { call } = gateway({
      ok: false,
      task: 'narration-critique',
      code: 'timeout',
      message: 'The AI provider did not respond in time.',
    });
    const result = await critiqueNarrationWithAi(
      { narrative: REFUTED, facts },
      { call, includeModelReview: true }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // A provider outage must not launder a refutation into a pass.
    expect(result.critique.verdict).toBe('refuted');
    expect(result.modelReview).toEqual({
      status: 'failed',
      discarded: 0,
      error: 'The AI provider did not respond in time.',
    });
  });
});
