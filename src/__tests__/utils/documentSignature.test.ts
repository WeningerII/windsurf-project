import { describe, expect, it } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { sameDocumentSignatures } from '../../utils/documentSignature';

function makeDoc(
  id: string,
  overrides: Partial<CharacterDocument<SystemDataModel>> = {}
): CharacterDocument<SystemDataModel> {
  return {
    id,
    name: `Document ${id}`,
    systemId: 'dnd-5e-2024',
    system: { hp: 10 },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    version: 1,
    ...overrides,
  };
}

describe('sameDocumentSignatures', () => {
  it('returns true for identical array references', () => {
    const docs = [makeDoc('a'), makeDoc('b')];
    expect(sameDocumentSignatures(docs, docs)).toBe(true);
  });

  it('returns true when ids, versions, and updatedAt all match', () => {
    const a = [makeDoc('a'), makeDoc('b')];
    const b = [makeDoc('a'), makeDoc('b')];
    expect(sameDocumentSignatures(a, b)).toBe(true);
  });

  it('returns true when field values differ but the signature triple is preserved', () => {
    // Intentional: engine-preparation may derive in-place without bumping
    // updatedAt, and the mutation-hot-path compare is designed NOT to see it.
    const a = [makeDoc('a', { name: 'Before' })];
    const b = [makeDoc('a', { name: 'After' })];
    expect(sameDocumentSignatures(a, b)).toBe(true);
  });

  it('returns false when lengths differ', () => {
    const a = [makeDoc('a'), makeDoc('b')];
    const b = [makeDoc('a')];
    expect(sameDocumentSignatures(a, b)).toBe(false);
  });

  it('returns false when a document version changes', () => {
    const a = [makeDoc('a', { version: 1 })];
    const b = [makeDoc('a', { version: 2 })];
    expect(sameDocumentSignatures(a, b)).toBe(false);
  });

  it('returns false when a document updatedAt changes', () => {
    const a = [makeDoc('a', { updatedAt: new Date('2026-01-02T00:00:00.000Z') })];
    const b = [makeDoc('a', { updatedAt: new Date('2026-01-03T00:00:00.000Z') })];
    expect(sameDocumentSignatures(a, b)).toBe(false);
  });

  it('returns false when an id is swapped for a different one at the same length', () => {
    const a = [makeDoc('a'), makeDoc('b')];
    const b = [makeDoc('a'), makeDoc('c')];
    expect(sameDocumentSignatures(a, b)).toBe(false);
  });

  it('treats missing version as 1 for signature purposes', () => {
    const a = [makeDoc('a', { version: undefined })];
    const b = [makeDoc('a', { version: 1 })];
    expect(sameDocumentSignatures(a, b)).toBe(true);
  });

  it('tolerates updatedAt supplied as an ISO string', () => {
    const a = [makeDoc('a', { updatedAt: new Date('2026-01-02T00:00:00.000Z') })];
    const b = [
      makeDoc('a', {
        updatedAt: '2026-01-02T00:00:00.000Z' as unknown as Date,
      }),
    ];
    expect(sameDocumentSignatures(a, b)).toBe(true);
  });

  it('returns true for two empty arrays', () => {
    expect(sameDocumentSignatures([], [])).toBe(true);
  });
});
