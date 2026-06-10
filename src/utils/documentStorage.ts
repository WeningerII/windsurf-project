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
import { parseCharacterDocument } from './boundaryValidation';
import { migrateDocument } from './documentMigrations';
import { ErrorCategory, ErrorSeverity, errorLogger } from './errorLogger';

const STORAGE_KEY = 'rpg-documents-v2';
/** Exported for cross-tab `storage` event filtering in useDocuments. */
export const DOCUMENTS_STORAGE_KEY = STORAGE_KEY;
const CORRUPT_BACKUP_KEY = `${STORAGE_KEY}.corrupt`;
const STORAGE_VERSION = '2.0';
const IDB_WARNING_THRESHOLD = 3;
const IDB_WARNING_MESSAGE =
  'Changes are saving to browser storage only. Larger storage (IndexedDB) is unavailable.';
const LOCAL_STORAGE_WARNING_MESSAGE =
  'Browser storage is full. Changes are saving to larger storage (IndexedDB) only.';
const BOTH_STORES_FAILED_MESSAGE =
  'Saving failed: both browser storage and IndexedDB are unavailable. Recent changes may be lost.';
const CORRUPT_STORAGE_MESSAGE = `Stored characters could not be read. The raw data was preserved under "${CORRUPT_BACKUP_KEY}".`;

interface DocumentStorageData {
  version: string;
  documents: CharacterDocument<SystemDataModel>[];
  lastModified: string;
}

let consecutiveIdbSaveFailures = 0;
let hasShownIdbWarning = false;
let hasShownLocalStorageWarning = false;
let hasShownBothStoresFailedError = false;

function noteIdbSaveSuccess(): void {
  consecutiveIdbSaveFailures = 0;
  hasShownIdbWarning = false;
  hasShownBothStoresFailedError = false;
}

function noteIdbSaveFailure(): void {
  consecutiveIdbSaveFailures += 1;
  if (consecutiveIdbSaveFailures >= IDB_WARNING_THRESHOLD && !hasShownIdbWarning) {
    hasShownIdbWarning = true;
    emitToast(IDB_WARNING_MESSAGE, 'warning');
  }
}

function noteLocalStorageSaveSuccess(): void {
  hasShownLocalStorageWarning = false;
  hasShownBothStoresFailedError = false;
}

/** localStorage failed but the IndexedDB write landed: data is safe, warn once. */
function noteLocalStorageOnlyFailure(error: unknown): void {
  errorLogger.log(
    ErrorCategory.STORAGE,
    ErrorSeverity.MEDIUM,
    'localStorage save failed; documents persisted to IndexedDB only',
    error instanceof Error ? error : undefined
  );
  if (!hasShownLocalStorageWarning) {
    hasShownLocalStorageWarning = true;
    emitToast(LOCAL_STORAGE_WARNING_MESSAGE, 'warning');
  }
}

/** Both stores failed: the app genuinely cannot save. Loud, but only once per streak. */
function noteCompleteSaveFailure(localError: unknown, idbError: unknown): void {
  errorLogger.log(
    ErrorCategory.STORAGE,
    ErrorSeverity.HIGH,
    'Document save failed in both localStorage and IndexedDB',
    localError instanceof Error ? localError : undefined,
    { idbError: idbError instanceof Error ? idbError.message : String(idbError) }
  );
  if (!hasShownBothStoresFailedError) {
    hasShownBothStoresFailedError = true;
    emitToast(BOTH_STORES_FAILED_MESSAGE, 'error');
  }
}

function hydrateDocuments(
  documents: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  // Every load path funnels through here (sync, async/IndexedDB, cross-tab
  // snapshots), so this is THE place schema migrations run.
  return documents.map((doc) =>
    migrateDocument({
      ...doc,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    })
  );
}

/**
 * Parse a raw V2 documents payload (e.g. a cross-tab `storage` event value).
 * Returns null when the payload is not a structurally valid snapshot. Does
 * not log or stash — corruption handling belongs to the load path.
 */
export function parseDocumentsSnapshot(raw: string): CharacterDocument<SystemDataModel>[] | null {
  try {
    const data: DocumentStorageData = JSON.parse(raw);
    if (!Array.isArray(data.documents)) {
      throw new Error('V2 storage payload is missing documents[]');
    }

    if (data.version !== STORAGE_VERSION && !import.meta.env.PROD) {
      console.warn('Document storage version mismatch, attempting migration...');
    }

    return hydrateDocuments(data.documents);
  } catch {
    return null;
  }
}

/**
 * Preserve an unreadable payload under a backup key BEFORE any subsequent
 * save can overwrite it, and report loudly (the payload may be
 * hand-recoverable). Stashing is idempotent per payload so the twin load
 * paths (sync + async) do not double-report.
 */
function stashCorruptPayload(raw: string): void {
  try {
    if (localStorage.getItem(CORRUPT_BACKUP_KEY) === raw) {
      return;
    }
    localStorage.setItem(CORRUPT_BACKUP_KEY, raw);
  } catch {
    // Quota exhausted while stashing; the error below still surfaces.
  }
  errorLogger.log(
    ErrorCategory.STORAGE,
    ErrorSeverity.HIGH,
    'Stored documents payload is corrupted; raw payload preserved for recovery',
    undefined,
    { key: STORAGE_KEY, backupKey: CORRUPT_BACKUP_KEY, payloadLength: raw.length }
  );
}

function tryLoadV2Documents(): CharacterDocument<SystemDataModel>[] | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const documents = parseDocumentsSnapshot(stored);
  if (documents === null) {
    stashCorruptPayload(stored);
  }
  return documents;
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
 * Save documents to BOTH stores, independently:
 *
 *   - localStorage: synchronous, commits reliably even during unload.
 *   - IndexedDB: async, larger quota — attempted regardless of the
 *     localStorage outcome, so a collection that outgrows the ~5 MB
 *     localStorage quota can still be persisted.
 *
 * An error is surfaced only when persistence is impossible in BOTH stores:
 * synchronously (throw) when localStorage fails and IndexedDB is unavailable,
 * or asynchronously (toast + error log) when the in-flight IndexedDB write
 * also fails. A localStorage-only failure downgrades to a one-time warning
 * because the data still landed in IndexedDB (the startup merge in
 * `loadDocumentsAsync` then treats IndexedDB's newer copy as authoritative).
 */
export function saveDocuments(documents: CharacterDocument<SystemDataModel>[]): void {
  let localStorageError: unknown = null;
  try {
    saveToLocalStorage(documents);
    noteLocalStorageSaveSuccess();
  } catch (error) {
    localStorageError = error;
    if (!import.meta.env.PROD) {
      console.error('Failed to save documents to localStorage:', error);
    }
  }

  if (!isIndexedDBAvailable()) {
    if (localStorageError !== null) {
      // No fallback exists: the save genuinely failed.
      throw new Error('Failed to save document data. Storage may be full.');
    }
    return;
  }

  // Async write to IndexedDB (does not block the caller).
  idbSaveDocuments(documents)
    .then(() => {
      noteIdbSaveSuccess();
      if (localStorageError !== null) {
        noteLocalStorageOnlyFailure(localStorageError);
      }
    })
    .catch((idbError) => {
      noteIdbSaveFailure();
      if (localStorageError !== null) {
        // Both stores failed: the app cannot save at all right now.
        noteCompleteSaveFailure(localStorageError, idbError);
      }
      // Otherwise localStorage succeeded and remains the source of truth.
    });
}

/**
 * Synchronous load from localStorage. Used as the initial (fast) path.
 * Throws when a stored payload exists but cannot be read (it is first
 * preserved under the `.corrupt` backup key), so callers can surface the
 * failure instead of silently rendering an empty collection.
 */
export function loadDocuments(): CharacterDocument<SystemDataModel>[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const documents = parseDocumentsSnapshot(stored);
  if (documents === null) {
    stashCorruptPayload(stored);
    throw new Error(CORRUPT_STORAGE_MESSAGE);
  }
  return documents;
}

function getDocumentVersion(doc: CharacterDocument<SystemDataModel>): number {
  return doc.version ?? 1;
}

/**
 * Version/updatedAt-aware union of two document collections: an incoming
 * document replaces the current one only when its `version` is higher, or
 * equal with an `updatedAt` at least as new (i.e. incoming wins exact ties).
 * Documents present on only one side are always kept.
 */
export function mergeDocumentCollections(
  current: CharacterDocument<SystemDataModel>[],
  incoming: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  const merged = new Map<string, CharacterDocument<SystemDataModel>>();

  current.forEach((doc) => {
    merged.set(doc.id, doc);
  });

  incoming.forEach((doc) => {
    const existing = merged.get(doc.id);
    const docVersion = getDocumentVersion(doc);
    const existingVersion = existing ? getDocumentVersion(existing) : 0;

    if (
      !existing ||
      docVersion > existingVersion ||
      (docVersion === existingVersion && doc.updatedAt >= existing.updatedAt)
    ) {
      merged.set(doc.id, doc);
    }
  });

  return Array.from(merged.values()).sort(
    (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime()
  );
}

/**
 * Async load reconciling IndexedDB with localStorage, plus auto-migration.
 *
 * Strategy:
 * 1. Read both stores.
 * 2. If only one has data, use it (auto-migrating localStorage data into
 *    IndexedDB on first contact).
 * 3. If both have data, MERGE per-document by version/updatedAt. The stores
 *    routinely diverge: the unload-time flush writes localStorage
 *    synchronously but its fire-and-forget IndexedDB write often never
 *    commits, so the IndexedDB mirror can be a session behind — preferring
 *    either snapshot wholesale would silently revert the other's edits.
 */
export async function loadDocumentsAsync(): Promise<CharacterDocument<SystemDataModel>[]> {
  const idbDocs = await idbLoadDocuments();
  const localDocs = tryLoadV2Documents();
  const hasIdbDocs = idbDocs !== null && idbDocs.length > 0;
  const hasLocalDocs = localDocs !== null && localDocs.length > 0;

  if (hasIdbDocs && hasLocalDocs) {
    // Incoming = localStorage: on identical (version, updatedAt) prefer the
    // synchronously-committed store over the fire-and-forget mirror.
    return mergeDocumentCollections(idbDocs, localDocs);
  }

  if (hasIdbDocs) {
    return idbDocs;
  }

  if (hasLocalDocs) {
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

export interface ImportDocumentsResult {
  documents: CharacterDocument<SystemDataModel>[];
  /** Number of records in the payload that failed structural validation. */
  droppedCount: number;
}

/**
 * Import documents from an export payload, reporting how many records were
 * dropped by validation so callers can tell a partial (or empty) import apart
 * from a clean one.
 */
export function importDocumentsWithReport(jsonString: string): ImportDocumentsResult {
  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    throw new Error('Failed to import documents. Invalid JSON format.');
  }

  const documentsField =
    data && typeof data === 'object' ? (data as { documents?: unknown }).documents : undefined;
  if (!Array.isArray(documentsField)) {
    throw new Error('Failed to import documents. Invalid JSON format.');
  }

  // Parse, don't cast: drop records that are not structurally valid documents
  // rather than letting malformed data masquerade as a character.
  const documents: CharacterDocument<SystemDataModel>[] = [];
  for (const candidate of documentsField) {
    const parsed = parseCharacterDocument(candidate);
    if (parsed.ok) {
      documents.push(parsed.value);
    }
  }

  return { documents, droppedCount: documentsField.length - documents.length };
}

/** Backward-compatible wrapper around {@link importDocumentsWithReport}. */
export function importDocuments(jsonString: string): CharacterDocument<SystemDataModel>[] {
  return importDocumentsWithReport(jsonString).documents;
}

/**
 * Clear documents from both IndexedDB and localStorage. The IndexedDB clear
 * is awaited and failures propagate: a swallowed failure would let the next
 * startup's IndexedDB load resurrect the "permanently deleted" collection.
 * The corrupt-payload backup is removed too — clear-all is also the
 * account-switch privacy wipe, which must not leave user data behind.
 */
export async function clearDocumentStorage(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CORRUPT_BACKUP_KEY);

  if (isIndexedDBAvailable()) {
    await idbClearDocuments();
  }
}

export function resetDocumentStorageDiagnosticsForTests(): void {
  consecutiveIdbSaveFailures = 0;
  hasShownIdbWarning = false;
  hasShownLocalStorageWarning = false;
  hasShownBothStoresFailedError = false;
}
