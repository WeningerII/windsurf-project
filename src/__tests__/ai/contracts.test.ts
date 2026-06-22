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

  it('carries the optional critique (rewrite guidance) through, dropping non-strings', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'scene-narration',
      payload: { facts: 'Combat: defeated Goblin.', critique: ['ungrounded "42"', 7] },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.value.payload as { critique: string[] }).critique).toEqual([
        'ungrounded "42"',
      ]);
    }
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

describe('illustrate-scene request/output', () => {
  it('accepts a prompt (with optional style) and rejects an empty one', () => {
    const ok = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'illustrate-scene',
      payload: { prompt: 'a torchlit crypt', style: 'painterly' },
    });
    expect(ok.ok).toBe(true);

    const empty = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'illustrate-scene',
      payload: { prompt: '   ' },
    });
    expect(empty).toMatchObject({ ok: false });
  });

  it('validates the generated-image envelope', () => {
    expect(
      parseTaskData('illustrate-scene', {
        dataUrl: 'data:image/png;base64,AAAA',
        mediaType: 'image/png',
      }).ok
    ).toBe(true);
    expect(
      parseTaskData('illustrate-scene', { dataUrl: 'not-an-image', mediaType: 'image/png' }).ok
    ).toBe(false);
  });
});

describe('isAiTask / isAiResponse', () => {
  it('recognizes the task allowlist', () => {
    expect(isAiTask('encounter-draft')).toBe(true);
    expect(isAiTask('scene-narration')).toBe(true);
    expect(isAiTask('identify-creature')).toBe(true);
    expect(isAiTask('illustrate-scene')).toBe(true);
    expect(isAiTask('strategy-hints')).toBe(true);
    expect(isAiTask('analyze-map')).toBe(true);
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

describe('analyze-map contract', () => {
  const image = { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' };

  it('accepts a well-formed request and rejects non-positive dimensions', () => {
    const ok = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'analyze-map',
      payload: { image, imageWidth: 700, imageHeight: 700, gridWidth: 10, gridHeight: 10 },
    });
    expect(ok.ok).toBe(true);

    const bad = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'analyze-map',
      payload: { image, imageWidth: 0, imageHeight: 700, gridWidth: 10, gridHeight: 10 },
    });
    expect(bad).toMatchObject({ ok: false });
  });

  it('accepts valid analysis output and rejects an unknown region kind', () => {
    expect(
      parseTaskData('analyze-map', {
        pixelsPerCell: 70,
        offsetX: 0,
        offsetY: 0,
        regions: [{ kind: 'terrain', label: 'Brush', x: 0, y: 0, width: 1, height: 1 }],
      }).ok
    ).toBe(true);
    expect(
      parseTaskData('analyze-map', {
        pixelsPerCell: 70,
        offsetX: 0,
        offsetY: 0,
        regions: [{ kind: 'portal', label: 'X', x: 0, y: 0, width: 1, height: 1 }],
      }).ok
    ).toBe(false);
    expect(parseTaskData('analyze-map', { pixelsPerCell: 70, offsetX: 0, offsetY: 0 }).ok).toBe(
      false
    );
  });
});

describe('strategy-hints contract', () => {
  const payload = {
    round: 1,
    side: 'hostile',
    combatants: [
      { tokenId: 'orc', name: 'Orc', faction: 'hostile', hpFraction: 1 },
      { tokenId: 'wizard', name: 'Wizard', faction: 'party', hpFraction: 0.4 },
    ],
  };

  it('accepts a well-formed request and clamps hpFraction', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'strategy-hints',
      payload: {
        ...payload,
        combatants: [{ tokenId: 'orc', name: 'Orc', faction: 'hostile', hpFraction: 5 }],
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const parsed = result.value.payload as typeof payload;
      expect(parsed.combatants[0].hpFraction).toBe(1); // clamped from 5
    }
  });

  it('rejects a request with no combatants', () => {
    const result = parseAiRequest({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'strategy-hints',
      payload: { ...payload, combatants: [] },
    });
    expect(result).toMatchObject({ ok: false });
  });

  it('accepts valid hint output, including an empty list', () => {
    expect(parseTaskData('strategy-hints', { hints: [] }).ok).toBe(true);
    const result = parseTaskData('strategy-hints', {
      hints: [{ actorId: 'orc', targetId: 'wizard', bias: 50, reason: 'focus' }],
    });
    expect(result.ok).toBe(true);
  });

  it('rejects hint output with a non-finite bias or missing ids', () => {
    expect(
      parseTaskData('strategy-hints', { hints: [{ actorId: 'orc', targetId: 'wizard' }] }).ok
    ).toBe(false);
    expect(
      parseTaskData('strategy-hints', {
        hints: [{ actorId: 'orc', targetId: 'wizard', bias: Number.NaN }],
      }).ok
    ).toBe(false);
    expect(parseTaskData('strategy-hints', {}).ok).toBe(false);
  });
});
