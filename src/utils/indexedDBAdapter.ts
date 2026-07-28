import { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { SceneDocument } from '../types/core/scene';

const DB_NAME = 'rpg-character-sheet';
/**
 * v1: `documents` + `meta`.
 * v2: adds `scenes` — the scene collection outgrew the ~5 MB localStorage
 *     quota once campaigns started accumulating event logs (see sceneStorage).
 * Upgrades are additive and every `createObjectStore` is existence-guarded, so
 * a v1 database opens at v2 without touching the documents already in it.
 */
const DB_VERSION = 2;
const STORE_NAME = 'documents';
const SCENES_STORE = 'scenes';
const META_STORE = 'meta';

const DOCUMENTS_MIGRATED_KEY = 'migrated-from-localstorage';
const SCENES_MIGRATED_KEY = 'scenes-migrated-from-localstorage';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SCENES_STORE)) {
        db.createObjectStore(SCENES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    // A version upgrade blocked by another open connection would otherwise
    // leave this promise unsettled forever (and every caller hanging).
    request.onblocked = () =>
      reject(new Error('IndexedDB open blocked by another connection holding an older version.'));
  });
}

/**
 * Reject the transaction's promise when the engine aborts it (e.g. a
 * QuotaExceededError). Aborts do not always surface through `tx.onerror`, so
 * without this the promise never settles and failure diagnostics (the
 * 3-strikes warning in documentStorage) never fire.
 */
function rejectOnAbort(tx: IDBTransaction, db: IDBDatabase, reject: (reason?: unknown) => void) {
  tx.onabort = () => {
    db.close();
    reject(tx.error ?? new DOMException('IndexedDB transaction aborted', 'AbortError'));
  };
}

function hydrateDoc(doc: CharacterDocument<SystemDataModel>): CharacterDocument<SystemDataModel> {
  return {
    ...doc,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

/**
 * Check whether IndexedDB is available in the current environment.
 */
export function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Load all documents from IndexedDB.
 * Returns null if IndexedDB is unavailable or the store is empty/uninitialized.
 */
export async function idbLoadDocuments(): Promise<CharacterDocument<SystemDataModel>[] | null> {
  if (!isIndexedDBAvailable()) return null;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      let result: CharacterDocument<SystemDataModel>[] = [];

      request.onsuccess = () => {
        result = request.result as CharacterDocument<SystemDataModel>[];
      };
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => {
        db.close();
        resolve(result.length > 0 ? result.map(hydrateDoc) : null);
      };
      rejectOnAbort(tx, db, reject);
    });
  } catch {
    return null;
  }
}

/**
 * Save all documents to IndexedDB (full replace).
 */
export async function idbSaveDocuments(
  documents: CharacterDocument<SystemDataModel>[]
): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Clear existing, then put all
    store.clear();
    for (const doc of documents) {
      store.put(doc);
    }

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    rejectOnAbort(tx, db, reject);
  });
}

/**
 * Clear all documents from IndexedDB.
 */
export async function idbClearDocuments(): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME, META_STORE], 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.objectStore(META_STORE).clear();

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    rejectOnAbort(tx, db, reject);
  });
}

/** Read a `meta` flag, resolving false whenever the read cannot be completed. */
async function readMetaFlag(key: string): Promise<boolean> {
  if (!isIndexedDBAvailable()) return false;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(META_STORE, 'readonly');
      const store = tx.objectStore(META_STORE);
      const request = store.get(key);
      let migrated = false;

      request.onsuccess = () => {
        migrated = !!request.result;
      };
      request.onerror = () => {
        /* resolve false on complete */
      };
      tx.oncomplete = () => {
        db.close();
        resolve(migrated);
      };
      tx.onabort = () => {
        db.close();
        resolve(false);
      };
    });
  } catch {
    return false;
  }
}

/** Set a `meta` flag, rejecting on failure so callers can retry next load. */
async function writeMetaFlag(key: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    store.put({ key, value: new Date().toISOString() });

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    rejectOnAbort(tx, db, reject);
  });
}

/**
 * Check if migration from localStorage has already been completed.
 */
export async function idbHasMigrated(): Promise<boolean> {
  return readMetaFlag(DOCUMENTS_MIGRATED_KEY);
}

/**
 * Mark migration as complete.
 */
export async function idbSetMigrated(): Promise<void> {
  return writeMetaFlag(DOCUMENTS_MIGRATED_KEY);
}

// ---------------------------------------------------------------------------
// Scenes
//
// Same shape as the document store above, deliberately: one adapter, one DB,
// one set of conventions. Scenes are stored as raw records rather than parsed
// documents — `sceneStorage` runs every load through `parseSceneDocument`
// (parse, don't cast), so hydrating here would only duplicate that work and
// invite the two paths to drift.
// ---------------------------------------------------------------------------

/**
 * Load all scene records from IndexedDB.
 * Returns null if IndexedDB is unavailable or the store is empty/uninitialized,
 * which is what lets the caller tell "no IndexedDB tier yet" apart from
 * "IndexedDB says the collection is empty".
 */
export async function idbLoadScenes(): Promise<unknown[] | null> {
  if (!isIndexedDBAvailable()) return null;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SCENES_STORE, 'readonly');
      const store = tx.objectStore(SCENES_STORE);
      const request = store.getAll();
      let result: unknown[] = [];

      request.onsuccess = () => {
        result = request.result as unknown[];
      };
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => {
        db.close();
        resolve(result.length > 0 ? result : null);
      };
      rejectOnAbort(tx, db, reject);
    });
  } catch {
    return null;
  }
}

/**
 * Save all scenes to IndexedDB (full replace). Keyed by `id`, so re-running a
 * migration over the same collection overwrites rather than duplicates.
 */
export async function idbSaveScenes(scenes: SceneDocument[]): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SCENES_STORE, 'readwrite');
    const store = tx.objectStore(SCENES_STORE);

    store.clear();
    for (const scene of scenes) {
      store.put(scene);
    }

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    rejectOnAbort(tx, db, reject);
  });
}

/**
 * Clear all scenes from IndexedDB, including the migration marker — a wipe
 * (account switch, clear-all) must leave the tier able to re-migrate if the
 * user later restores a localStorage-only backup.
 */
export async function idbClearScenes(): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([SCENES_STORE, META_STORE], 'readwrite');
    tx.objectStore(SCENES_STORE).clear();
    tx.objectStore(META_STORE).delete(SCENES_MIGRATED_KEY);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    rejectOnAbort(tx, db, reject);
  });
}

/** Check if the scene migration from localStorage has already been completed. */
export async function idbHasMigratedScenes(): Promise<boolean> {
  return readMetaFlag(SCENES_MIGRATED_KEY);
}

/** Mark the scene migration from localStorage as complete. */
export async function idbSetScenesMigrated(): Promise<void> {
  return writeMetaFlag(SCENES_MIGRATED_KEY);
}
