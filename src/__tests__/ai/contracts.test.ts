import { describe, expect, it } from 'vitest';
import {
  AI_GATEWAY_SCHEMA_VERSION,
  isAiResponse,
  isAiTask,
  parseAiRequest,
  parseTaskData,
} from '../../ai/contracts';

const validPayload = {
  systemId: 'dnd-5e-2024',
  partyLevels: [3, 3, 3, 3],
  difficulty: 'moderate',
  prompt: 'a goblin ambush',
  candidates: [{ id: 'goblin', name: 'Goblin', challengeRating: 0.25 }],
};

function validRequest() {
  return {
    schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
    task: 'encounter-draft',
    payload: validPayload,
  };
}

describe('parseAiRequest', () => {
  it('accepts a well-formed encounter-draft request', () => {
    const result = parseAiRequest(validRequest());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.task).toBe('encounter-draft');
  });

  it('rejects a bad schema version', () => {
    const result = parseAiRequest({ ...validRequest(), schemaVersion: 'nope' });
    expect(result).toMatchObject({ ok: false });
  });

  it('rejects an unknown task (message marks it unsupported)', () => {
    const result = parseAiRequest({ ...validRequest(), task: 'mind-control' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/unsupported task/i);
  });

  it('rejects a payload missing required fields', () => {
    const result = parseAiRequest({
      ...validRequest(),
      payload: { ...validPayload, candidates: [] },
    });
    expect(result).toMatchObject({ ok: false });
  });
});

describe('parseTaskData (encounter-draft output)', () => {
  it('accepts valid selections', () => {
    const result = parseTaskData('encounter-draft', {
      selections: [{ monsterId: 'goblin', count: 3 }],
      rationale: 'a patrol',
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.value).toEqual({
        selections: [{ monsterId: 'goblin', count: 3 }],
        rationale: 'a patrol',
      });
  });

  it('rejects a non-positive or non-integer count', () => {
    expect(
      parseTaskData('encounter-draft', { selections: [{ monsterId: 'g', count: 0 }] }).ok
    ).toBe(false);
    expect(
      parseTaskData('encounter-draft', { selections: [{ monsterId: 'g', count: 1.5 }] }).ok
    ).toBe(false);
  });
});

describe('scene-narration request/output', () => {
  it('accepts a well-formed narration request with optional tone', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'scene-narration',
      payload: { facts: 'Combat: defeated the ogre.', tone: 'gritty' },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.value.payload).toEqual({
        facts: 'Combat: defeated the ogre.',
        tone: 'gritty',
      });
  });

  it('rejects empty/whitespace facts', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'scene-narration',
      payload: { facts: '   ' },
    });
    expect(result).toMatchObject({ ok: false });
  });

  it('accepts a non-empty narrative and rejects an empty one', () => {
    expect(parseTaskData('scene-narration', { narrative: 'The ogre fell.' }).ok).toBe(true);
    expect(parseTaskData('scene-narration', { narrative: '   ' }).ok).toBe(false);
    expect(parseTaskData('scene-narration', {}).ok).toBe(false);
  });
});

describe('identify-creature request/output', () => {
  const image = { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' };

  it('accepts a well-formed identify request', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'identify-creature',
      payload: { systemId: 'dnd-5e-2024', candidates: [{ id: 'goblin', name: 'Goblin' }], image },
    });
    expect(result.ok).toBe(true);
  });

  it('rejects a non-image data URL', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'identify-creature',
      payload: {
        systemId: 'dnd-5e-2024',
        candidates: [{ id: 'goblin', name: 'Goblin' }],
        image: { dataUrl: 'data:text/plain;base64,AAAA', mediaType: 'text/plain' },
      },
    });
    expect(result).toMatchObject({ ok: false });
  });

  it('clamps confidence into 0..1 and requires a monsterId', () => {
    const high = parseTaskData('identify-creature', { monsterId: 'goblin', confidence: 5 });
    expect(high.ok).toBe(true);
    if (high.ok) expect((high.value as { confidence: number }).confidence).toBe(1);

    const low = parseTaskData('identify-creature', { monsterId: 'goblin', confidence: -2 });
    if (low.ok) expect((low.value as { confidence: number }).confidence).toBe(0);

    expect(parseTaskData('identify-creature', { confidence: 0.5 }).ok).toBe(false);
  });
});

describe('isAiTask / isAiResponse', () => {
  it('recognizes the task allowlist', () => {
    expect(isAiTask('encounter-draft')).toBe(true);
    expect(isAiTask('scene-narration')).toBe(true);
    expect(isAiTask('identify-creature')).toBe(true);
    expect(isAiTask('something-else')).toBe(false);
  });

  it('recognizes success and failure envelopes', () => {
    expect(
      isAiResponse({ ok: true, task: 'encounter-draft', data: {}, usage: { source: 'fixture' } })
    ).toBe(true);
    expect(isAiResponse({ ok: false, code: 'timeout', message: 'slow' })).toBe(true);
    expect(isAiResponse({ ok: true, task: 'bogus', data: {}, usage: {} })).toBe(false);
    expect(isAiResponse(42)).toBe(false);
  });
});
