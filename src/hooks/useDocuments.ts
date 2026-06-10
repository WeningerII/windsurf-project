import { useState, useEffect, useCallback, useRef } from 'react';
import { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  saveDocuments,
  loadDocuments,
  loadDocumentsAsync,
  clearDocumentStorage,
  mergeDocumentCollections,
  parseDocumentsSnapshot,
  DOCUMENTS_STORAGE_KEY,
} from '../utils/documentStorage';
import { systemRegistry } from '../registry';
import { sameDocumentSignatures } from '../utils/documentSignature';
import { useDebouncedPersistence } from './useDebouncedPersistence';

const MAX_HISTORY = 50;

function prepareDocumentWithEngine(
  doc: CharacterDocument<SystemDataModel>
): CharacterDocument<SystemDataModel> {
  const sysDef = systemRegistry.get(doc.systemId);
  return sysDef ? sysDef.engine.prepareData(doc) : doc;
}

function prepareDocumentsWithEngines(
  docs: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  return docs.map((doc) => prepareDocumentWithEngine(doc));
}

function documentsChanged(
  before: CharacterDocument<SystemDataModel>[],
  after: CharacterDocument<SystemDataModel>[]
): boolean {
  return JSON.stringify(before) !== JSON.stringify(after);
}

function cloneDocumentsSnapshot(
  docs: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(docs);
  }

  return docs.map((doc) => ({
    ...doc,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    system: JSON.parse(JSON.stringify(doc.system)) as SystemDataModel,
  }));
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<CharacterDocument<SystemDataModel>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyPast, setHistoryPast] = useState<CharacterDocument<SystemDataModel>[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<CharacterDocument<SystemDataModel>[][]>([]);
  const documentsRef = useRef<CharacterDocument<SystemDataModel>[]>([]);
  const historyPastRef = useRef<CharacterDocument<SystemDataModel>[][]>([]);
  const historyFutureRef = useRef<CharacterDocument<SystemDataModel>[][]>([]);
  const hasLocalEditsRef = useRef(false);
  const historySnapshotQueuedRef = useRef(false);
  const lastPushedSnapshotRef = useRef<CharacterDocument<SystemDataModel>[] | null>(null);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    historyPastRef.current = historyPast;
  }, [historyPast]);

  useEffect(() => {
    historyFutureRef.current = historyFuture;
  }, [historyFuture]);

  const persist = useCallback((docs: CharacterDocument<SystemDataModel>[]) => {
    try {
      saveDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save documents');
    }
  }, []);

  const persistence = useDebouncedPersistence(persist);

  useEffect(() => {
    // Fast synchronous load from localStorage first
    try {
      const loaded = loadDocuments();
      const prepared = prepareDocumentsWithEngines(loaded);
      setDocuments(prepared);
      if (documentsChanged(loaded, prepared)) {
        persist(prepared);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }

    // Then reconcile with IndexedDB. `loadDocumentsAsync` merges the two
    // stores per-document (version/updatedAt-aware), so a stale IndexedDB
    // mirror can no longer wholesale-revert newer localStorage edits.
    loadDocumentsAsync()
      .then((asyncDocs) => {
        if (
          asyncDocs.length > 0 &&
          historyPastRef.current.length === 0 &&
          !hasLocalEditsRef.current
        ) {
          const prepared = prepareDocumentsWithEngines(asyncDocs);
          setDocuments(prepared);
          if (documentsChanged(asyncDocs, prepared)) {
            persist(prepared);
          }
        }
      })
      .catch(() => {
        // IndexedDB load failed; synchronous localStorage data is already set
      });
  }, [persist]);

  const pushHistorySnapshot = useCallback((snapshot: CharacterDocument<SystemDataModel>[]) => {
    setHistoryPast((prev) => [...prev.slice(-(MAX_HISTORY - 1)), cloneDocumentsSnapshot(snapshot)]);
    setHistoryFuture([]);
  }, []);

  const queueHistorySnapshot = useCallback(
    (snapshot: CharacterDocument<SystemDataModel>[]) => {
      if (historySnapshotQueuedRef.current) return;

      historySnapshotQueuedRef.current = true;
      pushHistorySnapshot(snapshot);

      const releaseQueue = () => {
        historySnapshotQueuedRef.current = false;
      };

      if (typeof queueMicrotask === 'function') {
        queueMicrotask(releaseQueue);
        return;
      }

      setTimeout(releaseQueue, 0);
    },
    [pushHistorySnapshot]
  );

  // StrictMode double-invokes setState updaters, so the add/delete branch of
  // `applyDocumentsUpdate` would push the same snapshot twice. Distinct
  // mutations always receive distinct `prev` arrays, so deduping by reference
  // is exact (unlike the time-window dedupe of `queueHistorySnapshot`, it does
  // not coalesce two different adds landing in the same microtask). The ref is
  // released on a microtask so a recycled reference is never skipped later.
  const pushHistorySnapshotOnce = useCallback(
    (snapshot: CharacterDocument<SystemDataModel>[]) => {
      if (lastPushedSnapshotRef.current === snapshot) return;

      lastPushedSnapshotRef.current = snapshot;
      pushHistorySnapshot(snapshot);

      const release = () => {
        lastPushedSnapshotRef.current = null;
      };

      if (typeof queueMicrotask === 'function') {
        queueMicrotask(release);
        return;
      }

      setTimeout(release, 0);
    },
    [pushHistorySnapshot]
  );

  const applyDocumentsUpdate = useCallback(
    (
      updater: (prev: CharacterDocument<SystemDataModel>[]) => CharacterDocument<SystemDataModel>[]
    ) => {
      // Begin at call time (not inside the updater) so tokens rank mutations
      // in the order the user issued them — e.g. a clear-all right after an
      // add must out-rank the add's deferred updater.
      const persistVersion = persistence.beginVersion();
      setDocuments((prev) => {
        const next = updater(prev);
        // Hot path: runs on every mutation. Cheap signature compare is
        // sufficient because all mutations stamp a fresh `updatedAt`.
        if (sameDocumentSignatures(prev, next)) {
          // No-op update: roll the unused generation back. Leaving it
          // consumed would invalidate a still-pending debounced save from a
          // real edit moments earlier (e.g. a no-change sync merge landing
          // inside the debounce window), silently dropping that edit.
          persistence.abandonVersion(persistVersion);
          return prev;
        }

        hasLocalEditsRef.current = true;
        if (next.length === prev.length) {
          queueHistorySnapshot(prev);
        } else {
          pushHistorySnapshotOnce(prev);
        }
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence, pushHistorySnapshotOnce, queueHistorySnapshot]
  );

  const addDocument = useCallback(
    (doc: CharacterDocument<SystemDataModel>) => {
      const prepared = prepareDocumentWithEngine({
        ...doc,
        version: doc.version ?? 1,
      });

      applyDocumentsUpdate((prev) => [...prev, prepared]);
    },
    [applyDocumentsUpdate]
  );

  const updateDocument = useCallback(
    (doc: CharacterDocument<SystemDataModel>) => {
      applyDocumentsUpdate((prev) => {
        // Read the current version from in-memory state, not from the caller's
        // input. A stale `doc` reused across rapid successive updates would
        // otherwise collide on the same version and drop the later edit.
        const existing = prev.find((d) => d.id === doc.id);
        const nextVersion = (existing?.version ?? doc.version ?? 1) + 1;
        const prepared = prepareDocumentWithEngine({
          ...doc,
          updatedAt: new Date(),
          version: nextVersion,
        });
        return prev.map((d) => (d.id === prepared.id ? prepared : d));
      });
    },
    [applyDocumentsUpdate]
  );

  const deleteDocument = useCallback(
    (id: string) => {
      applyDocumentsUpdate((prev) => prev.filter((d) => d.id !== id));
      setError(null);
    },
    [applyDocumentsUpdate]
  );

  const addDocuments = useCallback(
    (docs: CharacterDocument<SystemDataModel>[]) => {
      const prepared = prepareDocumentsWithEngines(
        docs.map((doc) => ({
          ...doc,
          version: doc.version ?? 1,
        }))
      );

      applyDocumentsUpdate((prev) => mergeDocumentCollections(prev, prepared));
    },
    [applyDocumentsUpdate]
  );

  // Cross-tab reconciliation: when another tab writes the documents key,
  // merge its snapshot in (version/updatedAt-aware) instead of letting the
  // two tabs' whole-collection writes silently clobber each other. Loop-safe:
  // when the merge changes nothing, `applyDocumentsUpdate` short-circuits on
  // the signature compare and schedules no write, so tabs converge instead of
  // ping-ponging storage events forever.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== DOCUMENTS_STORAGE_KEY || !event.newValue) return;
      const incoming = parseDocumentsSnapshot(event.newValue);
      if (incoming === null || incoming.length === 0) return;
      addDocuments(incoming);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [addDocuments]);

  // Replace the collection with a sync-merged snapshot. Unlike `addDocuments`
  // (upsert-only, for imports), the merged collection is authoritative:
  // entries missing from it — e.g. tombstoned on another device — are removed
  // locally. History and debounced persistence behave as for any mutation.
  const applyMergedDocuments = useCallback(
    (merged: CharacterDocument<SystemDataModel>[]) => {
      const prepared = prepareDocumentsWithEngines(
        merged.map((doc) => ({
          ...doc,
          version: doc.version ?? 1,
        }))
      );

      applyDocumentsUpdate(() => prepared);
    },
    [applyDocumentsUpdate]
  );

  const clearAllDocuments = useCallback(() => {
    hasLocalEditsRef.current = true;
    // Begin-without-persist is deliberate here: it invalidates any pending
    // debounced write of the old collection so it cannot land after the clear.
    persistence.beginVersion();
    pushHistorySnapshot(documentsRef.current);
    persistence.cancel();
    setDocuments([]);
    clearDocumentStorage()
      .then(() => {
        setError(null);
      })
      .catch((err) => {
        // The IndexedDB clear failed: without surfacing this, the next
        // startup would resurrect the "permanently deleted" collection.
        setError(err instanceof Error ? err.message : 'Failed to clear document data');
      });
  }, [persistence, pushHistorySnapshot]);

  // Undo/redo perform their side effects (history shuffles, persistence) at
  // the event-handler level and pass plain values to setState. Doing this
  // inside setState updaters — as an earlier version did — double-runs the
  // side effects under StrictMode and corrupts history (one undo pushed two
  // future entries). The refs are updated eagerly so back-to-back calls in
  // the same tick observe each other's results before React re-renders.
  const undo = useCallback(() => {
    const past = historyPastRef.current;
    if (past.length === 0) return;

    const restored = cloneDocumentsSnapshot(past[past.length - 1]);
    const nextPast = past.slice(0, -1);
    const nextFuture = [
      cloneDocumentsSnapshot(documentsRef.current),
      ...historyFutureRef.current.slice(0, MAX_HISTORY - 1),
    ];

    hasLocalEditsRef.current = true;
    historyPastRef.current = nextPast;
    historyFutureRef.current = nextFuture;
    documentsRef.current = restored;
    setHistoryPast(nextPast);
    setHistoryFuture(nextFuture);
    setDocuments(restored);
    persistence.persist(restored, persistence.beginVersion());
  }, [persistence]);

  const redo = useCallback(() => {
    const future = historyFutureRef.current;
    if (future.length === 0) return;

    const restored = cloneDocumentsSnapshot(future[0]);
    const nextFuture = future.slice(1);
    const nextPast = [
      ...historyPastRef.current.slice(-(MAX_HISTORY - 1)),
      cloneDocumentsSnapshot(documentsRef.current),
    ];

    hasLocalEditsRef.current = true;
    historyPastRef.current = nextPast;
    historyFutureRef.current = nextFuture;
    documentsRef.current = restored;
    setHistoryPast(nextPast);
    setHistoryFuture(nextFuture);
    setDocuments(restored);
    persistence.persist(restored, persistence.beginVersion());
  }, [persistence]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    documents,
    isLoading,
    error,
    addDocument,
    addDocuments,
    applyMergedDocuments,
    updateDocument,
    deleteDocument,
    clearAllDocuments,
    undo,
    redo,
    canUndo: historyPast.length > 0,
    canRedo: historyFuture.length > 0,
    clearError,
    flushPendingSaves: persistence.flush,
  };
};
