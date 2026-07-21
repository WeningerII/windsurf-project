import { describe, expect, it } from 'vitest';
import {
  parseCampaign,
  parseCharacterDocument,
  parseSceneDocument,
} from '../../utils/boundaryValidation';
import { importDocuments } from '../../utils/documentStorage';
import { importScenes } from '../../utils/sceneStorage';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const NOW = new Date('2026-05-30T00:00:00.000Z');

function validDocInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'doc-1',
    name: 'Hero',
    systemId: 'dnd-5e-2024',
    system: { level: 3 },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    ...overrides,
  };
}

function validSceneInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'scene-1',
    name: 'Ambush',
    systemId: 'dnd-5e-2024',
    initialState: {
      sceneId: 'scene-1',
      name: 'Ambush',
      systemId: 'dnd-5e-2024',
      grid: { type: 'square', width: 10, height: 10, cellSize: 5 },
      tokens: {},
      markers: {},
      initiative: [],
      round: 0,
      seed: 'seed-1',
    },
    events: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    version: 1,
    ...overrides,
  };
}

describe('parseCharacterDocument', () => {
  it('accepts a well-formed envelope and coerces ISO timestamps to Date', () => {
    const result = parseCharacterDocument(validDocInput(), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.systemId).toBe('dnd-5e-2024');
    expect(result.value.createdAt).toBeInstanceOf(Date);
  });

  it('reports each malformed envelope field as an error issue', () => {
    const result = parseCharacterDocument({ id: '', name: 5, systemId: '  ', system: [] }, NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.map((i) => i.code)).toEqual(
      expect.arrayContaining([
        'document-invalid-id',
        'document-invalid-name',
        'document-invalid-system-id',
        'document-invalid-system',
      ])
    );
  });

  // `img` is rendered as <img src>; only https: and data:image/* survive the
  // boundary. A disallowed value drops the field, never the document.
  describe('img allowlist', () => {
    function parseImg(img: unknown) {
      const result = parseCharacterDocument(validDocInput({ img }), NOW);
      expect(result.ok).toBe(true);
      return result.ok ? result.value : undefined;
    }

    it.each([
      ['https URL', 'https://example.com/portrait.png'],
      ['data:image/png payload', 'data:image/png;base64,iVBORw0KGgo='],
      ['data:image/svg+xml payload', 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E'],
      ['uppercase scheme variant', 'HTTPS://example.com/p.png'],
    ])('keeps %s', (_label, img) => {
      expect(parseImg(img)?.img).toBe(img);
    });

    it.each([
      ['javascript: URL', 'javascript:alert(1)'],
      ['javascript: with embedded tab', 'java\tscript:alert(1)'],
      ['vbscript: URL', 'vbscript:msgbox(1)'],
      ['plaintext http: URL', 'http://attacker.example/beacon.png'],
      ['non-image data: payload', 'data:text/html,<script>alert(1)</script>'],
      ['file: URL', 'file:///etc/passwd'],
      ['relative path', 'portraits/hero.png'],
      ['unparseable garbage', '%%%not a url%%%'],
    ])('drops the field for %s but keeps the document', (_label, img) => {
      const doc = parseImg(img);
      expect(doc).toBeDefined();
      expect(doc?.id).toBe('doc-1');
      expect(doc?.img).toBeUndefined();
      expect(doc && 'img' in doc).toBe(false);
    });

    it('omits img when absent or not a string', () => {
      expect(parseImg(undefined)?.img).toBeUndefined();
      expect(parseImg(42)?.img).toBeUndefined();
    });
  });
});

describe('importDocuments boundary parsing', () => {
  it('drops malformed records but keeps valid ones', () => {
    const valid: CharacterDocument<SystemDataModel> = {
      id: 'doc-1',
      name: 'Hero',
      systemId: 'dnd-5e-2024',
      system: { level: 1 },
      createdAt: NOW,
      updatedAt: NOW,
    };
    const json = JSON.stringify({
      version: '2.0',
      documents: [valid, { id: 'broken-no-system' }, null, 'nope'],
      lastModified: NOW.toISOString(),
    });
    const imported = importDocuments(json);
    expect(imported).toHaveLength(1);
    expect(imported[0]?.id).toBe('doc-1');
  });

  it('still throws on structurally invalid payloads', () => {
    expect(() => importDocuments('{"version":"2.0"}')).toThrow(
      'Failed to import documents. Invalid JSON format.'
    );
  });
});

describe('parseCampaign', () => {
  it('accepts a campaign and coerces optional fields to safe defaults', () => {
    const result = parseCampaign(
      { id: 'c-1', name: 'Saltmarsh', createdAt: '2026-01-01T00:00:00.000Z' },
      NOW
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.characterIds).toEqual([]);
    expect(result.value.notes).toBe('');
    expect(result.value.systemId).toBeUndefined();
    expect(result.value.quests).toEqual([]);
    expect(result.value.sessionLog).toEqual([]);
    expect(result.value.updatedAt).toEqual(NOW);
  });

  it('coerces quests: keeps valid ones, drops idless entries, defaults bad status', () => {
    const result = parseCampaign(
      {
        id: 'c-1',
        name: 'C',
        quests: [
          {
            id: 'q1',
            title: 'Find the relic',
            summary: 'in the crypt',
            status: 'completed',
            objectives: [
              { id: 'o1', text: 'descend', done: true },
              { id: 'o2', text: 'fight', done: 'nope' }, // done coerced to false
              { text: 'idless objective' }, // dropped
            ],
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-02T00:00:00.000Z',
          },
          { id: 'q2', status: 'bananas' }, // bad status -> active; missing title -> ''
          { title: 'no id' }, // dropped
          'not an object', // dropped
        ],
      },
      NOW
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.quests).toHaveLength(2);
    const [q1, q2] = result.value.quests;
    expect(q1).toMatchObject({ id: 'q1', title: 'Find the relic', status: 'completed' });
    expect(q1.createdAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    expect(q1.objectives).toEqual([
      { id: 'o1', text: 'descend', done: true },
      { id: 'o2', text: 'fight', done: false },
    ]);
    expect(q2).toMatchObject({ id: 'q2', title: '', status: 'active', objectives: [] });
  });

  it('coerces the session log, dropping entries without an id', () => {
    const result = parseCampaign(
      {
        id: 'c-1',
        name: 'C',
        sessionLog: [
          { id: 's1', title: 'One', body: 'recap', createdAt: '2026-01-01T00:00:00.000Z' },
          { title: 'idless' }, // dropped
          { id: 's2' }, // title/body default to ''
        ],
      },
      NOW
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.sessionLog).toHaveLength(2);
    expect(result.value.sessionLog[0]).toMatchObject({ id: 's1', title: 'One', body: 'recap' });
    expect(result.value.sessionLog[1]).toMatchObject({ id: 's2', title: '', body: '' });
  });

  it('defaults quests/sessionLog to [] when present but not arrays', () => {
    const result = parseCampaign({ id: 'c-1', name: 'C', quests: 'x', sessionLog: 5 }, NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.quests).toEqual([]);
    expect(result.value.sessionLog).toEqual([]);
  });

  it('keeps a present systemId and filters non-string characterIds', () => {
    const result = parseCampaign(
      { id: 'c-1', name: 'C', systemId: 'pf2e', characterIds: ['a', 2, null, 'b'] },
      NOW
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.systemId).toBe('pf2e');
    expect(result.value.characterIds).toEqual(['a', 'b']);
  });

  it('rejects a campaign without a usable id or name', () => {
    const result = parseCampaign({ id: '', name: 7 }, NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.map((i) => i.code)).toEqual(
      expect.arrayContaining(['campaign-invalid-id', 'campaign-invalid-name'])
    );
  });
});

describe('parseSceneDocument', () => {
  it('accepts a structurally valid scene', () => {
    const result = parseSceneDocument(validSceneInput(), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.id).toBe('scene-1');
    expect(result.value.version).toBe(1);
    expect(result.value.createdAt).toBeInstanceOf(Date);
  });

  it('rejects a scene whose initialState is missing grid/tokens/markers/initiative', () => {
    const result = parseSceneDocument(validSceneInput({ initialState: { grid: {} } }), NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.map((i) => i.code)).toContain('scene-invalid-initial-state');
  });

  it('rejects a scene whose events are not an array', () => {
    const result = parseSceneDocument(validSceneInput({ events: 'nope' }), NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.map((i) => i.code)).toContain('scene-invalid-events');
  });

  it('preserves a well-formed map reference', () => {
    const map = {
      assetHash: 'a'.repeat(64),
      gridRegistration: { offsetX: 10, offsetY: -5, cellSizePx: 70 },
    };
    const result = parseSceneDocument(validSceneInput({ map }), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.map).toEqual(map);
  });

  it('drops a malformed map reference without rejecting the scene', () => {
    const malformed: unknown[] = [
      'not an object',
      { assetHash: '' },
      { assetHash: 'a'.repeat(64) }, // no registration
      { assetHash: 'a'.repeat(64), gridRegistration: { offsetX: 0, offsetY: 0, cellSizePx: 0 } },
      { assetHash: 'a'.repeat(64), gridRegistration: { offsetX: 0, offsetY: 0, cellSizePx: -3 } },
      { assetHash: 'a'.repeat(64), gridRegistration: { offsetX: NaN, offsetY: 0, cellSizePx: 5 } },
      { assetHash: 'a'.repeat(64), gridRegistration: { offsetX: 0, offsetY: '2', cellSizePx: 5 } },
    ];
    for (const map of malformed) {
      const result = parseSceneDocument(validSceneInput({ map }), NOW);
      expect(result.ok, `map candidate ${JSON.stringify(map)}`).toBe(true);
      if (!result.ok) continue;
      // The scene imports; its map degrades to absent (bare grid).
      expect(result.value.map, `map candidate ${JSON.stringify(map)}`).toBeUndefined();
    }
  });
});

describe('importScenes boundary parsing', () => {
  it('drops malformed scenes but keeps valid ones without crashing', () => {
    const json = JSON.stringify({
      version: '1.0',
      scenes: [validSceneInput(), { id: 'broken' }, null, { initialState: null }],
      lastModified: NOW.toISOString(),
    });
    const imported = importScenes(json);
    expect(imported).toHaveLength(1);
    expect(imported[0]?.id).toBe('scene-1');
    expect(imported[0]?.createdAt).toBeInstanceOf(Date);
  });

  it('throws on structurally invalid payloads', () => {
    expect(() => importScenes('{"version":"1.0"}')).toThrow(
      'Failed to import scenes. Invalid JSON format.'
    );
    expect(() => importScenes('not json')).toThrow('Failed to import scenes. Invalid JSON format.');
  });
});
