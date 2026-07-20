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
