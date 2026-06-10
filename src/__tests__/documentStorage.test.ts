import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearDocumentStorage,
  exportDocuments,
  importDocuments,
  importDocumentsWithReport,
  loadDocuments,
  resetDocumentStorageDiagnosticsForTests,
  saveDocuments,
} from '../utils/documentStorage';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import * as indexedDBAdapter from '../utils/indexedDBAdapter';
import * as notifications from '../utils/notifications';
import { errorLogger } from '../utils/errorLogger';
import { createDefaultDaggerheartData } from '../systems/daggerheart/data-model';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';
import { createDefaultPf2eData } from '../systems/pf2e/data-model';
import { createDefaultDnd35eData } from '../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../systems/pf1e/data-model';
import { createDefaultMam3eData } from '../systems/mam3e/data-model';

const V2_KEY = 'rpg-documents-v2';

const baseV2Document: CharacterDocument<SystemDataModel> = {
  id: 'doc-v2-1',
  name: 'V2 Test Hero',
  systemId: 'dnd-5e-2024',
  system: { level: 5 },
  createdAt: new Date('2026-02-18T10:00:00.000Z'),
  updatedAt: new Date('2026-02-18T10:30:00.000Z'),
};

function setV2Documents(documents: CharacterDocument<SystemDataModel>[]) {
  localStorage.setItem(
    V2_KEY,
    JSON.stringify({
      version: '2.0',
      documents: documents.map((doc) => ({
        ...doc,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      })),
      lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
    })
  );
}

describe('documentStorage behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    resetDocumentStorageDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it('prefers valid V2 documents', () => {
    const v2Doc: CharacterDocument<SystemDataModel> = {
      id: 'v2-doc-1',
      name: 'V2 Hero',
      systemId: 'dnd-5e-2024',
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      system: { level: 1 },
    };

    setV2Documents([v2Doc]);

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

  it('returns empty array when no valid V2 exists', () => {
    expect(loadDocuments()).toEqual([]);
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
    expect(warnSpy).toHaveBeenCalledWith(
      'Document storage version mismatch, attempting migration...'
    );
  });

  it('throws a descriptive error when localStorage fails and IndexedDB is unavailable', () => {
    vi.spyOn(indexedDBAdapter, 'isIndexedDBAvailable').mockReturnValue(false);
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

  it('supports export/import helpers and clearDocumentStorage', async () => {
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
    await clearDocumentStorage();
    expect(localStorage.getItem(V2_KEY)).toBeNull();
  });

  it('roundtrips Daggerheart loadout, vault, and inventory state through export/import', () => {
    const daggerheartDoc: CharacterDocument<SystemDataModel> = {
      id: 'daggerheart-export-1',
      name: 'Roundtrip Hopebound',
      systemId: 'daggerheart',
      system: {
        ...createDefaultDaggerheartData(),
        class: 'Bard',
        subclass: 'Troubadour',
        heritage: 'Human',
        community: 'Wanderborne',
        inventory: [
          {
            itemId: 'daggerheart-loot-stride-relic',
            name: 'Stride Relic',
            quantity: 1,
            description: '',
          },
        ],
        domainCards: [
          {
            id: 'owned-inspirational-words',
            cardId: 'grace-inspirational-words',
            name: 'Inspirational Words',
            domain: 'grace',
            level: 1,
            type: 'ability',
            recallCost: 1,
            location: 'loadout',
            description: '',
          },
          {
            id: 'owned-book-of-ava',
            cardId: 'codex-book-of-ava',
            name: 'Book of Ava',
            domain: 'codex',
            level: 1,
            type: 'grimoire',
            recallCost: 0,
            location: 'vault',
            description: '',
          },
        ],
      },
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-02T00:00:00.000Z'),
    };

    const json = exportDocuments([daggerheartDoc]);
    const imported = importDocuments(json);

    expect(imported).toHaveLength(1);
    expect(imported[0]?.systemId).toBe('daggerheart');
    expect(imported[0]?.system).toMatchObject({
      class: 'Bard',
      subclass: 'Troubadour',
      heritage: 'Human',
      community: 'Wanderborne',
      inventory: [
        {
          itemId: 'daggerheart-loot-stride-relic',
          name: 'Stride Relic',
          quantity: 1,
        },
      ],
      domainCards: [
        {
          cardId: 'grace-inspirational-words',
          location: 'loadout',
        },
        {
          cardId: 'codex-book-of-ava',
          location: 'vault',
        },
      ],
    });
  });

  it('preserves unresolved Daggerheart identity selections through export/import', () => {
    const daggerheartDoc: CharacterDocument<SystemDataModel> = {
      id: 'daggerheart-export-manual',
      name: 'Fallback Hopebound',
      systemId: 'daggerheart',
      system: {
        ...createDefaultDaggerheartData(),
        class: 'Custom Virtuoso',
        subclass: 'Mystery Path',
        heritage: 'Ashfolk',
        community: 'Sky Market',
      },
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-02T00:00:00.000Z'),
    };

    const json = exportDocuments([daggerheartDoc]);
    const imported = importDocuments(json);

    expect(imported).toHaveLength(1);
    expect(imported[0]?.systemId).toBe('daggerheart');
    expect(imported[0]?.system).toMatchObject({
      class: 'Custom Virtuoso',
      subclass: 'Mystery Path',
      heritage: 'Ashfolk',
      community: 'Sky Market',
    });
  });

  it('roundtrips spell-preparation fields across 5e, PF2e, and legacy d20 documents', () => {
    const docs: CharacterDocument<SystemDataModel>[] = [
      {
        id: 'spell-prep-5e',
        name: 'Prepared Cleric',
        systemId: 'dnd-5e-2014',
        system: {
          ...createDefaultDnd5eData(),
          spellcasting: {
            classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: 3 }],
            spellsKnown: ['healing-word'],
            spellsPrepared: ['healing-word'],
            alwaysPreparedSpellIds: ['bless', 'cure-wounds'],
            spellSlots: {
              1: { max: 4, used: 1 },
              2: { max: 2, used: 0 },
              3: { max: 0, used: 0 },
              4: { max: 0, used: 0 },
              5: { max: 0, used: 0 },
              6: { max: 0, used: 0 },
              7: { max: 0, used: 0 },
              8: { max: 0, used: 0 },
              9: { max: 0, used: 0 },
            },
          },
        },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
      {
        id: 'spell-prep-pf2e',
        name: 'Prepared Wizard',
        systemId: 'pf2e',
        system: {
          ...createDefaultPf2eData(),
          classId: 'wizard',
          spellcasting: {
            tradition: 'arcane',
            type: 'prepared',
            proficiency: { tier: 'trained', total: 3 },
            spellSlots: { 1: { max: 2, used: 0 } },
            spellsKnown: ['magic-missile-pf2e'],
            alwaysPreparedSpellIds: ['mage-armor-pf2e'],
            preparedSpellsByRank: { 1: ['magic-missile-pf2e'] },
            focusPoints: { current: 1, max: 1 },
          },
        },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
      {
        id: 'spell-prep-35e',
        name: 'Legacy Wizard',
        systemId: 'dnd-3.5e',
        system: {
          ...createDefaultDnd35eData(),
          spellsKnown: ['magic-missile'],
          preparedSpellsByLevel: {
            1: ['magic-missile', 'magic-missile'],
          },
          alwaysPreparedSpellIds: ['detect-magic'],
        },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
      {
        id: 'spell-prep-pf1e',
        name: 'Mystic Theurge',
        systemId: 'pf1e',
        system: {
          ...createDefaultPf1eData(),
          classLevels: [
            {
              classId: 'wizard',
              level: 3,
              hitDieRolls: [4, 3, 2],
              bab: 'half',
              fortSave: 'poor',
              refSave: 'poor',
              willSave: 'good',
              skillPointsPerLevel: 2,
              favoredClassBonus: 'skill',
            },
            {
              classId: 'cleric',
              level: 3,
              hitDieRolls: [8, 6, 5],
              bab: 'three-quarter',
              fortSave: 'good',
              refSave: 'poor',
              willSave: 'good',
              skillPointsPerLevel: 2,
              favoredClassBonus: 'hp',
            },
            {
              classId: 'mystic-theurge',
              level: 2,
              hitDieRolls: [4, 3],
              spellcastingSelections: ['wizard', 'cleric'],
              bab: 'half',
              fortSave: 'poor',
              refSave: 'poor',
              willSave: 'good',
              skillPointsPerLevel: 2,
              favoredClassBonus: 'other',
            },
          ],
          spellsKnown: ['magic-missile', 'bless'],
          preparedSpellsByLevel: {
            1: ['magic-missile', 'bless'],
          },
          alwaysPreparedSpellIds: ['detect-magic'],
        },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
    ];

    const imported = importDocuments(exportDocuments(docs));

    expect(imported).toHaveLength(4);
    expect(imported[0]?.system).toMatchObject({
      spellcasting: {
        spellsPrepared: ['healing-word'],
        alwaysPreparedSpellIds: ['bless', 'cure-wounds'],
      },
    });
    expect(imported[1]?.system).toMatchObject({
      spellcasting: {
        alwaysPreparedSpellIds: ['mage-armor-pf2e'],
        preparedSpellsByRank: { 1: ['magic-missile-pf2e'] },
      },
    });
    expect(imported[2]?.system).toMatchObject({
      spellsKnown: ['magic-missile'],
      preparedSpellsByLevel: { 1: ['magic-missile', 'magic-missile'] },
      alwaysPreparedSpellIds: ['detect-magic'],
    });
    expect(imported[3]?.system).toMatchObject({
      spellsKnown: ['magic-missile', 'bless'],
      preparedSpellsByLevel: { 1: ['magic-missile', 'bless'] },
      alwaysPreparedSpellIds: ['detect-magic'],
      classLevels: expect.arrayContaining([
        expect.objectContaining({
          classId: 'mystic-theurge',
          spellcastingSelections: ['wizard', 'cleric'],
        }),
      ]),
    });
  });

  it('roundtrips PF2e and M&M selected archetype state through export/import', () => {
    const docs: CharacterDocument<SystemDataModel>[] = [
      {
        id: 'pf2e-archetype-export',
        name: 'Dedication Adept',
        systemId: 'pf2e',
        system: {
          ...createDefaultPf2eData(),
          ancestryId: 'human',
          classId: 'wizard',
          selectedArchetypeIds: ['wizard-dedication', 'acrobat-dedication'],
        },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
      {
        id: 'mam3e-archetype-export',
        name: 'Pinned Battlesuit',
        systemId: 'mam3e',
        system: {
          ...createDefaultMam3eData(),
          selectedArchetypeIds: ['mam3e-battlesuit'],
          complications: [
            {
              id: 'accident',
              name: 'Accident',
              description: 'A mishap waiting to happen.',
              source: "Mutants & Masterminds Deluxe Hero's Handbook",
            },
          ],
        },
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
    ];

    const imported = importDocuments(exportDocuments(docs));

    expect(imported).toHaveLength(2);
    expect(imported[0]?.system).toMatchObject({
      ancestryId: 'human',
      classId: 'wizard',
      selectedArchetypeIds: ['wizard-dedication', 'acrobat-dedication'],
    });
    expect(imported[1]?.system).toMatchObject({
      selectedArchetypeIds: ['mam3e-battlesuit'],
      complications: [
        expect.objectContaining({
          id: 'accident',
          name: 'Accident',
        }),
      ],
    });
  });

  it('shows a warning toast after 3 consecutive IndexedDB save failures', async () => {
    vi.spyOn(indexedDBAdapter, 'isIndexedDBAvailable').mockReturnValue(true);
    vi.spyOn(indexedDBAdapter, 'idbSaveDocuments').mockRejectedValue(new Error('IndexedDB down'));
    const toastSpy = vi.spyOn(notifications, 'emitToast').mockImplementation(() => {});

    saveDocuments([baseV2Document]);
    saveDocuments([baseV2Document]);
    saveDocuments([baseV2Document]);

    await Promise.resolve();
    await Promise.resolve();

    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith(
      'Changes are saving to browser storage only. Larger storage (IndexedDB) is unavailable.',
      'warning'
    );
  });

  // M1: a localStorage quota failure must not abort the IndexedDB write.
  it('still writes to IndexedDB when localStorage fails, downgrading to a one-time warning', async () => {
    vi.spyOn(indexedDBAdapter, 'isIndexedDBAvailable').mockReturnValue(true);
    const idbSpy = vi.spyOn(indexedDBAdapter, 'idbSaveDocuments').mockResolvedValue(undefined);
    const toastSpy = vi.spyOn(notifications, 'emitToast').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually.
    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => saveDocuments([baseV2Document])).not.toThrow();
    expect(idbSpy).toHaveBeenCalledTimes(1);
    expect(idbSpy).toHaveBeenCalledWith([baseV2Document]);

    await Promise.resolve();
    await Promise.resolve();

    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith(
      'Browser storage is full. Changes are saving to larger storage (IndexedDB) only.',
      'warning'
    );

    // Second failing save: data is still landing in IndexedDB, do not re-toast.
    expect(() => saveDocuments([baseV2Document])).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();
    expect(toastSpy).toHaveBeenCalledTimes(1);

    setItemSpy.mockRestore();
  });

  // M1: an error is surfaced only when BOTH stores fail.
  it('surfaces a loud error when both localStorage and IndexedDB fail', async () => {
    vi.spyOn(indexedDBAdapter, 'isIndexedDBAvailable').mockReturnValue(true);
    vi.spyOn(indexedDBAdapter, 'idbSaveDocuments').mockRejectedValue(new Error('idb down'));
    const toastSpy = vi.spyOn(notifications, 'emitToast').mockImplementation(() => {});
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually.
    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => saveDocuments([baseV2Document])).not.toThrow();

    await Promise.resolve();
    await Promise.resolve();

    expect(toastSpy).toHaveBeenCalledWith(
      'Saving failed: both browser storage and IndexedDB are unavailable. Recent changes may be lost.',
      'error'
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'Document save failed in both localStorage and IndexedDB',
      expect.any(Error),
      expect.objectContaining({ idbError: 'idb down' })
    );

    setItemSpy.mockRestore();
  });

  // M2: clear-all must not swallow an IndexedDB clear failure.
  it('clearDocumentStorage propagates an IndexedDB clear failure', async () => {
    vi.spyOn(indexedDBAdapter, 'isIndexedDBAvailable').mockReturnValue(true);
    vi.spyOn(indexedDBAdapter, 'idbClearDocuments').mockRejectedValue(new Error('clear failed'));
    setV2Documents([baseV2Document]);

    await expect(clearDocumentStorage()).rejects.toThrow('clear failed');
    // The synchronous localStorage removal still happened.
    expect(localStorage.getItem(V2_KEY)).toBeNull();
  });

  it('clearDocumentStorage also removes the corrupt-payload backup (privacy wipe)', async () => {
    vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    localStorage.setItem(V2_KEY, '{corrupt');
    expect(() => loadDocuments()).toThrow();
    expect(localStorage.getItem(`${V2_KEY}.corrupt`)).toBe('{corrupt');

    await clearDocumentStorage();

    expect(localStorage.getItem(V2_KEY)).toBeNull();
    expect(localStorage.getItem(`${V2_KEY}.corrupt`)).toBeNull();
  });

  // M8: a corrupt payload is preserved before any save can overwrite it, and
  // the failure is loud instead of a silent empty collection.
  it('stashes a corrupt payload under .corrupt and throws a descriptive error', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    localStorage.setItem(V2_KEY, '{definitely not json');

    expect(() => loadDocuments()).toThrow(/could not be read/);
    expect(localStorage.getItem(`${V2_KEY}.corrupt`)).toBe('{definitely not json');
    expect(logSpy).toHaveBeenCalledTimes(1);

    // Re-loading the same corrupt payload does not re-stash or re-log.
    expect(() => loadDocuments()).toThrow(/could not be read/);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('treats a structurally invalid payload (missing documents[]) as corrupt', () => {
    vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const payload = JSON.stringify({ version: '2.0', nope: true });
    localStorage.setItem(V2_KEY, payload);

    expect(() => loadDocuments()).toThrow(/could not be read/);
    expect(localStorage.getItem(`${V2_KEY}.corrupt`)).toBe(payload);
  });

  // L4: import reports how many records were dropped by validation.
  it('importDocumentsWithReport counts dropped invalid records', () => {
    const payload = JSON.stringify({
      version: '2.0',
      documents: [
        {
          ...baseV2Document,
          createdAt: baseV2Document.createdAt.toISOString(),
          updatedAt: baseV2Document.updatedAt.toISOString(),
        },
        { junk: true },
        42,
      ],
      lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
    });

    const result = importDocumentsWithReport(payload);
    expect(result.documents).toHaveLength(1);
    expect(result.documents[0]?.name).toBe('V2 Test Hero');
    expect(result.droppedCount).toBe(2);
  });

  it('importDocumentsWithReport reports an all-invalid import', () => {
    const payload = JSON.stringify({
      version: '2.0',
      documents: [{ junk: true }, null],
      lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
    });

    const result = importDocumentsWithReport(payload);
    expect(result.documents).toHaveLength(0);
    expect(result.droppedCount).toBe(2);
  });
});
