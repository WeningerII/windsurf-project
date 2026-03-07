import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveDocuments,
  loadDocuments,
  loadDocumentsAsync,
  exportDocuments,
  importDocuments,
  clearDocumentStorage,
} from '../../utils/documentStorage';
import { idbLoadDocuments, idbClearDocuments } from '../../utils/indexedDBAdapter';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

function makeDoc(id: string, name: string): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: { level: 5 },
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T12:00:00.000Z'),
  };
}

describe('documentStorage with IndexedDB', () => {
  beforeEach(async () => {
    localStorage.clear();
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('rpg-character-sheet');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  });

  // D3: Verify saves load after reload with IndexedDB primary
  it('saves to both localStorage and IndexedDB, loads from IndexedDB on async path', async () => {
    const docs = [makeDoc('d3-1', 'Dual Write Hero')];
    saveDocuments(docs);

    // Wait for async IndexedDB write to settle
    await new Promise((r) => setTimeout(r, 50));

    // Verify localStorage has the data
    const localDocs = loadDocuments();
    expect(localDocs).toHaveLength(1);
    expect(localDocs[0].name).toBe('Dual Write Hero');

    // Verify IndexedDB has the data
    const idbDocs = await idbLoadDocuments();
    expect(idbDocs).not.toBeNull();
    expect(idbDocs).toHaveLength(1);
    expect(idbDocs![0].name).toBe('Dual Write Hero');

    // Async load should return IndexedDB data as primary
    const asyncDocs = await loadDocumentsAsync();
    expect(asyncDocs).toHaveLength(1);
    expect(asyncDocs[0].name).toBe('Dual Write Hero');
  });

  // D3: Verify data survives simulated reload (re-load from both stores)
  it('data persists across simulated reload', async () => {
    saveDocuments([
      makeDoc('persist-1', 'Persistent Hero'),
      makeDoc('persist-2', 'Persistent Mage'),
    ]);
    await new Promise((r) => setTimeout(r, 50));

    // Simulate reload: load from scratch
    const syncResult = loadDocuments();
    expect(syncResult).toHaveLength(2);

    const asyncResult = await loadDocumentsAsync();
    expect(asyncResult).toHaveLength(2);
    expect(asyncResult[0].createdAt).toBeInstanceOf(Date);
    expect(asyncResult[1].updatedAt).toBeInstanceOf(Date);
  });

  // D2: Auto-migrate localStorage users on first async load
  it('auto-migrates localStorage data to IndexedDB on first async load', async () => {
    // Seed data only in localStorage (simulating a pre-IndexedDB user)
    localStorage.setItem(
      'rpg-documents-v2',
      JSON.stringify({
        version: '2.0',
        documents: [makeDoc('migrate-1', 'Legacy Hero')],
        lastModified: new Date().toISOString(),
      })
    );

    // IndexedDB should be empty
    const idbBefore = await idbLoadDocuments();
    expect(idbBefore).toBeNull();

    // Async load should migrate
    const result = await loadDocumentsAsync();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Legacy Hero');

    // After migration, IndexedDB should now have the data
    const idbAfter = await idbLoadDocuments();
    expect(idbAfter).not.toBeNull();
    expect(idbAfter).toHaveLength(1);
    expect(idbAfter![0].name).toBe('Legacy Hero');
  });

  // D4: Export/import payload compatibility unchanged
  it('export format remains version 2.0 with standard shape', () => {
    const docs = [makeDoc('export-1', 'Export Hero')];
    const exported = exportDocuments(docs);
    const parsed = JSON.parse(exported);

    expect(parsed.version).toBe('2.0');
    expect(parsed.documents).toHaveLength(1);
    expect(parsed.documents[0].name).toBe('Export Hero');
    expect(parsed.lastModified).toBeDefined();
  });

  it('import correctly parses version 2.0 payload and hydrates dates', () => {
    const payload = JSON.stringify({
      version: '2.0',
      documents: [makeDoc('import-1', 'Import Hero')],
      lastModified: '2026-02-24T00:00:00.000Z',
    });

    const imported = importDocuments(payload);
    expect(imported).toHaveLength(1);
    expect(imported[0].name).toBe('Import Hero');
    expect(imported[0].createdAt).toBeInstanceOf(Date);
    expect(imported[0].updatedAt).toBeInstanceOf(Date);
  });

  it('import rejects invalid JSON', () => {
    expect(() => importDocuments('not json')).toThrow('Failed to import documents');
  });

  it('import rejects payload without documents array', () => {
    expect(() => importDocuments(JSON.stringify({ version: '2.0' }))).toThrow(
      'Failed to import documents'
    );
  });

  // D5: No data loss when IndexedDB unavailable
  it('saveDocuments works when IndexedDB is unavailable (localStorage fallback)', async () => {
    const original = globalThis.indexedDB;
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: undefined,
    });

    const docs = [makeDoc('fallback-1', 'Fallback Hero')];
    saveDocuments(docs);

    const loaded = loadDocuments();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('Fallback Hero');

    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: original,
    });
  });

  it('loadDocumentsAsync falls back to localStorage when IndexedDB unavailable', async () => {
    localStorage.setItem(
      'rpg-documents-v2',
      JSON.stringify({
        version: '2.0',
        documents: [makeDoc('fallback-2', 'LocalStorage Fallback')],
        lastModified: new Date().toISOString(),
      })
    );

    const original = globalThis.indexedDB;
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: undefined,
    });

    const result = await loadDocumentsAsync();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('LocalStorage Fallback');

    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: original,
    });
  });

  // D5: clearDocumentStorage clears both stores
  it('clearDocumentStorage removes data from both localStorage and IndexedDB', async () => {
    saveDocuments([makeDoc('clear-1', 'Clear Me')]);
    await new Promise((r) => setTimeout(r, 50));

    clearDocumentStorage();
    await new Promise((r) => setTimeout(r, 50));

    expect(localStorage.getItem('rpg-documents-v2')).toBeNull();

    const idbDocs = await idbLoadDocuments();
    expect(idbDocs).toBeNull();
  });
});
