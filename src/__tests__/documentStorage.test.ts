import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearDocumentStorage,
  exportDocuments,
  importDocuments,
  loadDocuments,
  resetDocumentStorageDiagnosticsForTests,
  saveDocuments,
} from '../utils/documentStorage';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import * as indexedDBAdapter from '../utils/indexedDBAdapter';
import * as notifications from '../utils/notifications';

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
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    localStorage.clear();
    resetDocumentStorageDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
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
});
