import { CharacterDocument, SystemDataModel } from '../types/core/document';

const DB_NAME = 'rpg-character-sheet';
const DB_VERSION = 1;
const STORE_NAME = 'documents';
const META_STORE = 'meta';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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
  });
}

/**
 * Check if migration from localStorage has already been completed.
 */
export async function idbHasMigrated(): Promise<boolean> {
  if (!isIndexedDBAvailable()) return false;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(META_STORE, 'readonly');
      const store = tx.objectStore(META_STORE);
      const request = store.get('migrated-from-localstorage');
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
    });
  } catch {
    return false;
  }
}

/**
 * Mark migration as complete.
 */
export async function idbSetMigrated(): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    store.put({ key: 'migrated-from-localstorage', value: new Date().toISOString() });

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
