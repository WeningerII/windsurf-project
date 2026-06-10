import { describe, expect, it } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Campaign } from '../../types/core/campaign';
import { createSceneDocument } from '../../scene/runtime';
import type { SceneEvent } from '../../types/core/scene';
import {
  sameCampaignSignatures,
  sameDocumentSignatures,
  sameSceneSignatures,
} from '../../utils/documentSignature';

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

  // L6: comparison must be multiplicity-aware — equal-length collections that
  // only differ in how often a duplicated id occurs are NOT equal.
  it('distinguishes collections that differ only in duplicate multiplicity', () => {
    const a = [makeDoc('a'), makeDoc('a'), makeDoc('b')];
    const b = [makeDoc('a'), makeDoc('b'), makeDoc('b')];
    expect(sameDocumentSignatures(a, b)).toBe(false);
    expect(sameDocumentSignatures(b, a)).toBe(false);
  });

  it('treats collections with identical duplicates as equal', () => {
    const a = [makeDoc('a'), makeDoc('a'), makeDoc('b')];
    const b = [makeDoc('b'), makeDoc('a'), makeDoc('a')];
    expect(sameDocumentSignatures(a, b)).toBe(true);
  });
});

function makeCampaign(id: string, overrides: Partial<Campaign> = {}): Campaign {
  return {
    id,
    name: `Campaign ${id}`,
    systemId: 'dnd-5e-2024',
    notes: '',
    characterIds: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    ...overrides,
  };
}

describe('sameCampaignSignatures', () => {
  it('returns true for identical array references', () => {
    const campaigns = [makeCampaign('a'), makeCampaign('b')];
    expect(sameCampaignSignatures(campaigns, campaigns)).toBe(true);
  });

  it('returns true when ids, updatedAt, and member lists all match', () => {
    const a = [makeCampaign('a', { characterIds: ['x', 'y'] })];
    const b = [makeCampaign('a', { characterIds: ['x', 'y'] })];
    expect(sameCampaignSignatures(a, b)).toBe(true);
  });

  it('treats member-list reordering as equivalent (sorted before compare)', () => {
    const a = [makeCampaign('a', { characterIds: ['x', 'y', 'z'] })];
    const b = [makeCampaign('a', { characterIds: ['z', 'x', 'y'] })];
    expect(sameCampaignSignatures(a, b)).toBe(true);
  });

  it('returns false when a member is added', () => {
    const a = [makeCampaign('a', { characterIds: ['x', 'y'] })];
    const b = [makeCampaign('a', { characterIds: ['x', 'y', 'z'] })];
    expect(sameCampaignSignatures(a, b)).toBe(false);
  });

  it('returns false when updatedAt changes', () => {
    const a = [makeCampaign('a', { updatedAt: new Date('2026-01-02T00:00:00.000Z') })];
    const b = [makeCampaign('a', { updatedAt: new Date('2026-01-03T00:00:00.000Z') })];
    expect(sameCampaignSignatures(a, b)).toBe(false);
  });

  it('returns false when lengths differ', () => {
    const a = [makeCampaign('a'), makeCampaign('b')];
    const b = [makeCampaign('a')];
    expect(sameCampaignSignatures(a, b)).toBe(false);
  });

  it('returns true for two empty arrays', () => {
    expect(sameCampaignSignatures([], [])).toBe(true);
  });

  // L6: multiplicity-aware comparison for campaigns too.
  it('distinguishes campaign collections that differ only in duplicate multiplicity', () => {
    const a = [makeCampaign('a'), makeCampaign('a'), makeCampaign('b')];
    const b = [makeCampaign('a'), makeCampaign('b'), makeCampaign('b')];
    expect(sameCampaignSignatures(a, b)).toBe(false);
  });
});

function makeScene(id: string, overrides: { updatedAt?: Date; events?: SceneEvent[] } = {}) {
  const scene = createSceneDocument({
    id,
    name: `Scene ${id}`,
    systemId: 'dnd-5e-2024',
    now: new Date('2026-01-02T00:00:00.000Z'),
  });
  return {
    ...scene,
    ...(overrides.updatedAt ? { updatedAt: overrides.updatedAt } : {}),
    ...(overrides.events ? { events: overrides.events } : {}),
  };
}

function makeSceneEvent(id: string): SceneEvent {
  return {
    id,
    type: 'token.removed',
    sequence: 1,
    createdAt: new Date('2026-01-02T00:00:00.000Z'),
    payload: { tokenId: 'token-1' },
  };
}

describe('sameSceneSignatures', () => {
  it('returns true for identical scene collections', () => {
    expect(sameSceneSignatures([makeScene('a')], [makeScene('a')])).toBe(true);
  });

  it('returns false when updatedAt changes', () => {
    const a = [makeScene('a')];
    const b = [makeScene('a', { updatedAt: new Date('2026-01-03T00:00:00.000Z') })];
    expect(sameSceneSignatures(a, b)).toBe(false);
  });

  it('returns false when the event count changes even at the same updatedAt', () => {
    // appendSceneEvent stamps updatedAt from the event's createdAt, so two
    // appends sharing a timestamp are only visible through the event count.
    const a = [makeScene('a')];
    const b = [makeScene('a', { events: [makeSceneEvent('evt-1')] })];
    expect(sameSceneSignatures(a, b)).toBe(false);
  });

  it('returns false when lengths differ', () => {
    expect(sameSceneSignatures([makeScene('a')], [])).toBe(false);
  });

  it('is multiplicity-aware for duplicated scene ids', () => {
    const a = [makeScene('a'), makeScene('a'), makeScene('b')];
    const b = [makeScene('a'), makeScene('b'), makeScene('b')];
    expect(sameSceneSignatures(a, b)).toBe(false);
  });
});
