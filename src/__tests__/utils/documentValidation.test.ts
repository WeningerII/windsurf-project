import { describe, expect, it } from 'vitest';
import { parseCharacterDocument } from '../../utils/documentValidation';
import { importDocuments } from '../../utils/documentStorage';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const NOW = new Date('2026-05-30T00:00:00.000Z');

function validInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
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

describe('parseCharacterDocument', () => {
  it('accepts a well-formed envelope and coerces ISO timestamps to Date', () => {
    const result = parseCharacterDocument(validInput(), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.id).toBe('doc-1');
    expect(result.value.systemId).toBe('dnd-5e-2024');
    expect(result.value.system).toEqual({ level: 3 });
    expect(result.value.createdAt).toBeInstanceOf(Date);
    expect(result.value.createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('defaults missing or invalid timestamps to the provided now', () => {
    const result = parseCharacterDocument(
      validInput({ createdAt: undefined, updatedAt: 'nonsense' }),
      NOW
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.createdAt).toEqual(NOW);
    expect(result.value.updatedAt).toEqual(NOW);
  });

  it('preserves optional img and version when well-typed', () => {
    const result = parseCharacterDocument(validInput({ img: 'avatar.png', version: 2 }), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.img).toBe('avatar.png');
    expect(result.value.version).toBe(2);
  });

  it.each([null, undefined, 42, 'str', []])('rejects non-object input (%s)', (input) => {
    const result = parseCharacterDocument(input, NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues[0].code).toBe('document-not-object');
  });

  it('reports each malformed envelope field as an error issue', () => {
    const result = parseCharacterDocument({ id: '', name: 5, systemId: '  ', system: [] }, NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const codes = result.issues.map((issue) => issue.code);
    expect(codes).toEqual(
      expect.arrayContaining([
        'document-invalid-id',
        'document-invalid-name',
        'document-invalid-system-id',
        'document-invalid-system',
      ])
    );
    expect(result.issues.every((issue) => issue.severity === 'error')).toBe(true);
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
    expect(imported[0]?.createdAt).toBeInstanceOf(Date);
  });

  it('still throws on structurally invalid payloads', () => {
    expect(() => importDocuments('{"version":"2.0"}')).toThrow(
      'Failed to import documents. Invalid JSON format.'
    );
    expect(() => importDocuments('not json at all')).toThrow(
      'Failed to import documents. Invalid JSON format.'
    );
  });
});
