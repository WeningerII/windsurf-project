import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  isIndexedDBAvailable,
  idbLoadDocuments,
  idbSaveDocuments,
  idbClearDocuments,
  idbHasMigrated,
  idbSetMigrated,
} from '../../utils/indexedDBAdapter';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

function makeDoc(id: string, name: string): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: { level: 1 },
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

describe('indexedDBAdapter', () => {
  beforeEach(async () => {
    // Delete the entire database to ensure a fresh schema on each test
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('rpg-character-sheet');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  });

  it('isIndexedDBAvailable returns true in test environment', () => {
    expect(isIndexedDBAvailable()).toBe(true);
  });

  it('returns null when no documents are stored', async () => {
    const result = await idbLoadDocuments();
    expect(result).toBeNull();
  });

  it('saves and loads documents', async () => {
    const docs = [makeDoc('idb-1', 'IndexedDB Hero'), makeDoc('idb-2', 'IndexedDB Villain')];

    await idbSaveDocuments(docs);
    const loaded = await idbLoadDocuments();

    expect(loaded).not.toBeNull();
    expect(loaded).toHaveLength(2);
    expect(loaded![0].name).toBe('IndexedDB Hero');
    expect(loaded![1].name).toBe('IndexedDB Villain');
  });

  it('hydrates date fields on load', async () => {
    await idbSaveDocuments([makeDoc('idb-date', 'Date Test')]);
    const loaded = await idbLoadDocuments();

    expect(loaded![0].createdAt).toBeInstanceOf(Date);
    expect(loaded![0].updatedAt).toBeInstanceOf(Date);
  });

  it('replaces all documents on save (full replace)', async () => {
    await idbSaveDocuments([makeDoc('idb-a', 'First')]);
    await idbSaveDocuments([makeDoc('idb-b', 'Second')]);

    const loaded = await idbLoadDocuments();
    expect(loaded).toHaveLength(1);
    expect(loaded![0].name).toBe('Second');
  });

  it('clears all documents', async () => {
    await idbSaveDocuments([makeDoc('idb-clear', 'To Clear')]);
    await idbClearDocuments();

    const loaded = await idbLoadDocuments();
    expect(loaded).toBeNull();
  });

  it('tracks migration status', async () => {
    expect(await idbHasMigrated()).toBe(false);

    await idbSetMigrated();
    expect(await idbHasMigrated()).toBe(true);
  });

  it('returns false for isIndexedDBAvailable when indexedDB is undefined', () => {
    const original = globalThis.indexedDB;
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: undefined,
    });

    expect(isIndexedDBAvailable()).toBe(false);

    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: original,
    });
  });

  it('idbLoadDocuments returns null when indexedDB is unavailable', async () => {
    const original = globalThis.indexedDB;
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: undefined,
    });

    const result = await idbLoadDocuments();
    expect(result).toBeNull();

    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: original,
    });
  });
});
