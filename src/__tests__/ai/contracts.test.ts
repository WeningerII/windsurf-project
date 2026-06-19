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

describe('isAiTask / isAiResponse', () => {
  it('recognizes the task allowlist', () => {
    expect(isAiTask('encounter-draft')).toBe(true);
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
