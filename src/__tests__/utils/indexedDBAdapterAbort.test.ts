import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { idbSaveDocuments, idbClearDocuments, idbSetMigrated } from '../../utils/indexedDBAdapter';
import {
  resetDocumentStorageDiagnosticsForTests,
  saveDocuments,
} from '../../utils/documentStorage';
import * as notifications from '../../utils/notifications';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

/**
 * M4 regression: IndexedDB transactions aborted by the engine (e.g.
 * QuotaExceededError) fire `abort` without necessarily firing `error`, and a
 * blocked `open` never fires `success`. Without onabort/onblocked handlers the
 * adapter promises never settle, so the 3-strikes save diagnostics never run.
 *
 * fake-indexeddb cannot simulate engine-initiated aborts, so these tests wire
 * a minimal stub IDB whose transactions abort (or whose open blocks).
 */

function makeDoc(id: string): CharacterDocument<SystemDataModel> {
  return {
    id,
    name: `Doc ${id}`,
    systemId: 'dnd-5e-2024',
    system: { level: 1 },
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

interface StubTransaction {
  error: DOMException | null;
  objectStore: () => { clear: () => void; put: (value: unknown) => void };
  oncomplete: (() => void) | null;
  onerror: (() => void) | null;
  onabort: (() => void) | null;
}

function installStubIndexedDB(behavior: 'abort' | 'blocked') {
  const state = {
    dbClosed: false,
    lastTxError: new DOMException('Quota exceeded', 'QuotaExceededError'),
  };

  const db = {
    close: () => {
      state.dbClosed = true;
    },
    transaction: (): StubTransaction => {
      const tx: StubTransaction = {
        error: state.lastTxError,
        objectStore: () => ({ clear: () => undefined, put: () => undefined }),
        oncomplete: null,
        onerror: null,
        onabort: null,
      };
      // The abort event fires asynchronously, after the adapter has attached
      // its handlers.
      setTimeout(() => tx.onabort?.(), 0);
      return tx;
    },
  };

  const stub = {
    open: () => {
      const request: {
        result: typeof db;
        onupgradeneeded: (() => void) | null;
        onsuccess: (() => void) | null;
        onerror: (() => void) | null;
        onblocked: (() => void) | null;
      } = {
        result: db,
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
        onblocked: null,
      };
      setTimeout(() => {
        if (behavior === 'blocked') {
          request.onblocked?.();
        } else {
          request.onsuccess?.();
        }
      }, 0);
      return request;
    },
  };

  const original = globalThis.indexedDB;
  Object.defineProperty(globalThis, 'indexedDB', {
    configurable: true,
    value: stub,
  });

  return {
    state,
    restore: () => {
      Object.defineProperty(globalThis, 'indexedDB', {
        configurable: true,
        value: original,
      });
    },
  };
}

describe('indexedDBAdapter abort/blocked handling', () => {
  let restore: (() => void) | null = null;

  beforeEach(() => {
    localStorage.clear();
    resetDocumentStorageDiagnosticsForTests();
  });

  afterEach(() => {
    restore?.();
    restore = null;
    vi.restoreAllMocks();
  });

  it('idbSaveDocuments rejects with the transaction error and closes the db on abort', async () => {
    const stub = installStubIndexedDB('abort');
    restore = stub.restore;

    await expect(idbSaveDocuments([makeDoc('abort-1')])).rejects.toMatchObject({
      name: 'QuotaExceededError',
    });
    expect(stub.state.dbClosed).toBe(true);
  });

  it('idbClearDocuments rejects on abort instead of hanging', async () => {
    const stub = installStubIndexedDB('abort');
    restore = stub.restore;

    await expect(idbClearDocuments()).rejects.toMatchObject({ name: 'QuotaExceededError' });
    expect(stub.state.dbClosed).toBe(true);
  });

  it('idbSetMigrated rejects on abort instead of hanging', async () => {
    const stub = installStubIndexedDB('abort');
    restore = stub.restore;

    await expect(idbSetMigrated()).rejects.toMatchObject({ name: 'QuotaExceededError' });
  });

  it('a blocked open rejects instead of hanging', async () => {
    const stub = installStubIndexedDB('blocked');
    restore = stub.restore;

    await expect(idbSaveDocuments([makeDoc('blocked-1')])).rejects.toThrow(/blocked/i);
  });

  it('aborted saves feed the 3-strikes warning diagnostics', async () => {
    const stub = installStubIndexedDB('abort');
    restore = stub.restore;
    const toastSpy = vi.spyOn(notifications, 'emitToast').mockImplementation(() => {});

    saveDocuments([makeDoc('strike-1')]);
    saveDocuments([makeDoc('strike-1')]);
    saveDocuments([makeDoc('strike-1')]);

    // Let the stubbed aborts (setTimeout 0) and rejection handlers settle.
    await new Promise((r) => setTimeout(r, 20));

    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith(
      'Changes are saving to browser storage only. Larger storage (IndexedDB) is unavailable.',
      'warning'
    );
  });
});
