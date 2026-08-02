import { describe, expect, it } from 'vitest';
import { createMockAdapter } from '../../ai/mockAdapter';
import { parseTaskData, type AiTask } from '../../ai/contracts';

const adapter = createMockAdapter();

describe('createMockAdapter', () => {
  it('identifies as the key-less mock provider', () => {
    expect(adapter.id).toBe('mock');
    expect(adapter.model).toBe('mock');
  });

  it('produces encounter-draft output that passes parseTaskData', async () => {
    const out = await adapter.generate('encounter-draft', {
      candidates: [{ id: 'goblin', name: 'Goblin' }],
    });
    const parsed = parseTaskData('encounter-draft', out);
    expect(parsed.ok).toBe(true);
    // Deterministic: it picks the first candidate id.
    expect(out).toMatchObject({ selections: [{ monsterId: 'goblin', count: 1 }] });
  });

  it('produces scene-narration output that passes parseTaskData', async () => {
    const out = await adapter.generate('scene-narration', { facts: 'The party fled.' });
    expect(parseTaskData('scene-narration', out).ok).toBe(true);
  });

  it('produces narration-critique output that passes parseTaskData', async () => {
    const narrative = 'The ogre fell. The party moved on.';
    const out = await adapter.generate('narration-critique', {
      narrative,
      facts: 'Combat: defeated the ogre.',
    });
    expect(parseTaskData('narration-critique', out).ok).toBe(true);
    // The quote must be verbatim in the narration, or the flow discards it.
    const quote = (out as { findings: Array<{ quote: string }> }).findings[0].quote;
    expect(narrative).toContain(quote);
  });

  it('produces dm-turn-intent output that passes parseTaskData and stays in the pool', async () => {
    const options = [
      { id: 'move', verb: 'move', label: 'Move up to 3 squares', maxDistance: 3 },
      { id: 'hold', verb: 'hold', label: 'Do nothing and end the turn' },
    ];
    const out = (await adapter.generate('dm-turn-intent', {
      systemId: 'daggerheart',
      facts: 'Combat: reached round 2.',
      round: 2,
      actor: { id: 'goblin', name: 'Goblin', allegiance: 'hostile', position: { x: 5, y: 5 } },
      tokens: [],
      options,
    })) as { proposals: Array<{ optionId: string; destination?: { x: number; y: number } }> };

    expect(parseTaskData('dm-turn-intent', out).ok).toBe(true);
    // The mock must choose from the OFFERED pool, like the encounter mock does:
    // a mock that reliably fails its own gate teaches nothing about the wiring.
    expect(options.map((option) => option.id)).toContain(out.proposals[0]!.optionId);
    // A move needs a destination one step from the actor, so the reach gate in
    // `dmProposalToIntent` passes and the SCENE decides the rest.
    expect(out.proposals[0]!.destination).toEqual({ x: 4, y: 5 });
  });

  it('produces identify-creature output that passes parseTaskData', async () => {
    const out = await adapter.generate('identify-creature', {
      candidates: [{ id: 'owlbear', name: 'Owlbear' }],
    });
    const parsed = parseTaskData('identify-creature', out);
    expect(parsed.ok).toBe(true);
    expect(out).toMatchObject({ monsterId: 'owlbear' });
  });

  it('produces illustrate-scene output that passes the image-envelope validator', async () => {
    const out = await adapter.generate('illustrate-scene', { prompt: 'a misty ruin' });
    expect(parseTaskData('illustrate-scene', out).ok).toBe(true);
  });

  it('is deterministic across calls with the same input', async () => {
    const a = await adapter.generate('scene-narration', { facts: 'same' });
    const b = await adapter.generate('scene-narration', { facts: 'same' });
    expect(a).toEqual(b);
  });

  it('rejects an unknown task by throwing (normalized by the core)', async () => {
    await expect(adapter.generate('bogus' as AiTask, {})).rejects.toThrow();
  });
});
