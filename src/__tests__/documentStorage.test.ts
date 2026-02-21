import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearDocumentStorage,
  exportDocuments,
  importDocuments,
  loadDocuments,
  saveDocuments,
} from '../utils/documentStorage';
import type { Character } from '../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

const V2_KEY = 'rpg-documents-v2';
const LEGACY_KEY = 'rpg-characters';

const baseLegacyCharacter: Character = {
  id: 'legacy-char-1',
  name: 'Legacy Hero',
  system: 'dnd-5e-2014',
  level: 3,
  experiencePoints: 900,
  classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [8, 7, 6] }],
  baseAttributes: { str: 14, dex: 12, con: 13, int: 10, wis: 10, cha: 8 },
  skillProficiencies: {},
  hitPoints: { current: 24, max: 24, temp: 0 },
  hitDice: [{ die: 'd10', total: 3, remaining: 3 }],
  armorClass: 15,
  initiative: 1,
  speed: 30,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: ['str', 'con'],
  features: [],
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 25, platinum: 0 },
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
};

function setLegacyCharacters(characters: Character[]) {
  localStorage.setItem(
    LEGACY_KEY,
    JSON.stringify({
      version: '1.0',
      characters: characters.map(char => ({
        ...char,
        createdAt: char.createdAt.toISOString(),
        updatedAt: char.updatedAt.toISOString(),
      })),
      lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
    })
  );
}

function setV2Documents(documents: CharacterDocument<SystemDataModel>[]) {
  localStorage.setItem(
    V2_KEY,
    JSON.stringify({
      version: '2.0',
      documents: documents.map(doc => ({
        ...doc,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      })),
      lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
    })
  );
}

describe('documentStorage legacy migration behavior', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('prefers valid V2 documents when both V2 and legacy keys exist', () => {
    const v2Doc: CharacterDocument<SystemDataModel> = {
      id: 'v2-doc-1',
      name: 'V2 Hero',
      systemId: 'dnd-5e-2024',
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      system: { level: 1 },
    };

    setV2Documents([v2Doc]);
    setLegacyCharacters([{ ...baseLegacyCharacter, name: 'Legacy Should Not Win' }]);

    const loaded = loadDocuments();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.name).toBe('V2 Hero');
    expect(loaded[0]?.systemId).toBe('dnd-5e-2024');

    const persistedV2 = JSON.parse(localStorage.getItem(V2_KEY) ?? '{}') as {
      documents?: Array<{ name?: string }>;
    };
    expect(persistedV2.documents).toHaveLength(1);
    expect(persistedV2.documents?.[0]?.name).toBe('V2 Hero');
  });

  it('migrates legacy V1 payload when V2 is missing', () => {
    setLegacyCharacters([baseLegacyCharacter]);

    const loaded = loadDocuments();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe(baseLegacyCharacter.id);
    expect(loaded[0]?.name).toBe(baseLegacyCharacter.name);
    expect(loaded[0]?.systemId).toBe(baseLegacyCharacter.system);
    expect(loaded[0]?.createdAt).toBeInstanceOf(Date);
    expect(loaded[0]?.updatedAt).toBeInstanceOf(Date);

    const persistedV2 = JSON.parse(localStorage.getItem(V2_KEY) ?? '{}') as {
      version?: string;
      documents?: Array<{ id?: string; systemId?: string }>;
    };
    expect(persistedV2.version).toBe('2.0');
    expect(persistedV2.documents).toHaveLength(1);
    expect(persistedV2.documents?.[0]?.id).toBe(baseLegacyCharacter.id);
    expect(persistedV2.documents?.[0]?.systemId).toBe(baseLegacyCharacter.system);
  });

  it('falls back to legacy migration when V2 payload is malformed', () => {
    localStorage.setItem(V2_KEY, 'not-json');
    setLegacyCharacters([baseLegacyCharacter]);

    const loaded = loadDocuments();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.name).toBe(baseLegacyCharacter.name);

    const persistedV2 = JSON.parse(localStorage.getItem(V2_KEY) ?? '{}') as {
      documents?: Array<{ id?: string }>;
    };
    expect(persistedV2.documents).toHaveLength(1);
    expect(persistedV2.documents?.[0]?.id).toBe(baseLegacyCharacter.id);
  });

  it('returns empty array when legacy payload is malformed and no valid V2 exists', () => {
    localStorage.setItem(LEGACY_KEY, 'not-json');

    expect(loadDocuments()).toEqual([]);
    expect(localStorage.getItem(V2_KEY)).toBeNull();
  });

  it('does not duplicate migrated records on repeated loads', () => {
    setLegacyCharacters([baseLegacyCharacter]);

    const first = loadDocuments();
    const second = loadDocuments();

    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(second[0]?.id).toBe(first[0]?.id);

    const persistedV2 = JSON.parse(localStorage.getItem(V2_KEY) ?? '{}') as {
      documents?: Array<{ id?: string }>;
    };
    expect(persistedV2.documents).toHaveLength(1);
    expect(persistedV2.documents?.[0]?.id).toBe(baseLegacyCharacter.id);
  });

  it('hydrates stored V2 documents even when version differs', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      V2_KEY,
      JSON.stringify({
        version: '1.5',
        documents: [
          {
            id: 'v2-doc-legacy-version',
            name: 'Versioned Hero',
            systemId: 'dnd-5e-2024',
            system: { level: 2 },
            createdAt: '2026-02-01T00:00:00.000Z',
            updatedAt: '2026-02-02T00:00:00.000Z',
          },
        ],
        lastModified: '2026-02-03T00:00:00.000Z',
      })
    );

    const loaded = loadDocuments();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.createdAt).toBeInstanceOf(Date);
    expect(loaded[0]?.updatedAt).toBeInstanceOf(Date);
    expect(warnSpy).toHaveBeenCalledWith('Document storage version mismatch, attempting migration...');
  });

  it('returns an empty array when migration write fails', () => {
    setLegacyCharacters([baseLegacyCharacter]);
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const setItemSpy = vi
      .spyOn(localStorage, 'setItem')
      .mockImplementation((key: string, value: string) => {
        if (key === V2_KEY) {
          throw new Error('quota exceeded');
        }
        return originalSetItem(key, value);
      });

    const loaded = loadDocuments();

    expect(loaded).toEqual([]);
    setItemSpy.mockRestore();
  });

  it('throws a descriptive error when saveDocuments fails', () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('cannot write');
    });

    expect(() =>
      saveDocuments([
        {
          id: 'doc-save-fail',
          name: 'Cannot Save',
          systemId: 'dnd-5e-2024',
          system: { level: 1 },
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          updatedAt: new Date('2026-02-02T00:00:00.000Z'),
        },
      ])
    ).toThrow('Failed to save document data. Storage may be full.');

    setItemSpy.mockRestore();
  });

  it('supports export/import helpers and clearDocumentStorage', () => {
    const json = exportDocuments([
      {
        id: 'doc-export-1',
        name: 'Export Hero',
        systemId: 'dnd-5e-2024',
        system: { level: 4 },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
    ]);

    const imported = importDocuments(json);
    expect(imported).toHaveLength(1);
    expect(imported[0]?.createdAt).toBeInstanceOf(Date);
    expect(imported[0]?.updatedAt).toBeInstanceOf(Date);

    expect(() => importDocuments('{"version":"2.0"}')).toThrow(
      'Failed to import documents. Invalid JSON format.'
    );

    localStorage.setItem(V2_KEY, json);
    clearDocumentStorage();
    expect(localStorage.getItem(V2_KEY)).toBeNull();
  });
});
