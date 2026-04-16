import { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  isIndexedDBAvailable,
  idbLoadDocuments,
  idbSaveDocuments,
  idbClearDocuments,
  idbHasMigrated,
  idbSetMigrated,
} from './indexedDBAdapter';
import { emitToast } from './notifications';

const STORAGE_KEY = 'rpg-documents-v2';
const STORAGE_VERSION = '2.0';
const IDB_WARNING_THRESHOLD = 3;
const IDB_WARNING_MESSAGE =
  'Changes are saving to browser storage only. Larger storage (IndexedDB) is unavailable.';

interface DocumentStorageData {
  version: string;
  documents: CharacterDocument<SystemDataModel>[];
  lastModified: string;
}

let consecutiveIdbSaveFailures = 0;
let hasShownIdbWarning = false;

function noteIdbSaveSuccess(): void {
  consecutiveIdbSaveFailures = 0;
  hasShownIdbWarning = false;
}

function noteIdbSaveFailure(): void {
  consecutiveIdbSaveFailures += 1;
  if (consecutiveIdbSaveFailures >= IDB_WARNING_THRESHOLD && !hasShownIdbWarning) {
    hasShownIdbWarning = true;
    emitToast(IDB_WARNING_MESSAGE, 'warning');
  }
}

function hydrateDocuments(
  documents: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  return documents.map((doc) => ({
    ...doc,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  }));
}

function tryLoadV2Documents(): CharacterDocument<SystemDataModel>[] | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data: DocumentStorageData = JSON.parse(stored);
    if (!Array.isArray(data.documents)) {
      throw new Error('V2 storage payload is missing documents[]');
    }

    if (data.version !== STORAGE_VERSION && !import.meta.env.PROD) {
      console.warn('Document storage version mismatch, attempting migration...');
    }

    return hydrateDocuments(data.documents);
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.warn('Failed to parse V2 document storage:', error);
    }
    return null;
  }
}

function saveToLocalStorage(documents: CharacterDocument<SystemDataModel>[]): void {
  const data: DocumentStorageData = {
    version: STORAGE_VERSION,
    documents,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Save documents to IndexedDB (primary) and localStorage (best-effort mirror).
 * If IndexedDB is unavailable, falls back to localStorage only.
 */
export function saveDocuments(documents: CharacterDocument<SystemDataModel>[]): void {
  try {
    saveToLocalStorage(documents);
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Failed to save documents to localStorage:', error);
    }
    throw new Error('Failed to save document data. Storage may be full.');
  }

  // Best-effort async write to IndexedDB (does not block)
  if (isIndexedDBAvailable()) {
    idbSaveDocuments(documents)
      .then(() => {
        noteIdbSaveSuccess();
      })
      .catch(() => {
        noteIdbSaveFailure();
        // IndexedDB write failed; localStorage is still the source of truth
      });
  }
}

/**
 * Synchronous load from localStorage. Used as the initial (fast) path.
 */
export function loadDocuments(): CharacterDocument<SystemDataModel>[] {
  const v2Documents = tryLoadV2Documents();
  if (v2Documents !== null) {
    return v2Documents;
  }
  return [];
}

/**
 * Async load with IndexedDB primary, localStorage fallback, and auto-migration.
 *
 * Strategy:
 * 1. Try IndexedDB first (primary).
 * 2. If IndexedDB has data, return it.
 * 3. If IndexedDB is empty/unavailable, fall back to localStorage.
 * 4. If localStorage has data and IndexedDB hasn't been migrated, auto-migrate.
 */
export async function loadDocumentsAsync(): Promise<CharacterDocument<SystemDataModel>[]> {
  // Try IndexedDB first
  const idbDocs = await idbLoadDocuments();
  if (idbDocs !== null && idbDocs.length > 0) {
    return idbDocs;
  }

  // Fallback to localStorage
  const localDocs = tryLoadV2Documents();
  if (localDocs !== null && localDocs.length > 0) {
    // Auto-migrate: copy localStorage data into IndexedDB
    if (isIndexedDBAvailable() && !(await idbHasMigrated())) {
      try {
        await idbSaveDocuments(localDocs);
        await idbSetMigrated();
      } catch {
        // Migration failed; localStorage remains authoritative
      }
    }
    return localDocs;
  }

  return [];
}

export function exportDocuments(documents: CharacterDocument<SystemDataModel>[]): string {
  const data: DocumentStorageData = {
    version: STORAGE_VERSION,
    documents,
    lastModified: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDocuments(jsonString: string): CharacterDocument<SystemDataModel>[] {
  try {
    const data: DocumentStorageData = JSON.parse(jsonString);

    if (!data.documents || !Array.isArray(data.documents)) {
      throw new Error('Invalid document data format');
    }

    return data.documents.map((doc) => ({
      ...doc,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    }));
  } catch {
    throw new Error('Failed to import documents. Invalid JSON format.');
  }
}

/**
 * Clear documents from both IndexedDB and localStorage.
 */
export function clearDocumentStorage(): void {
  localStorage.removeItem(STORAGE_KEY);

  if (isIndexedDBAvailable()) {
    idbClearDocuments().catch(() => {
      // Best-effort clear
    });
  }
}

export function resetDocumentStorageDiagnosticsForTests(): void {
  consecutiveIdbSaveFailures = 0;
  hasShownIdbWarning = false;
}
