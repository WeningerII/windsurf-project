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

// Engines are lazily imported (`SystemDefinition.loadEngine`), so every path
// below resolves a system's engine BEFORE preparing a document and then runs the
// same synchronous `prepareData` call it always did. Nothing is ever dispatched
// to React unprepared: when an engine is already resolved the whole path stays
// synchronous, and when it is not the dispatch waits for the chunk.

function prepareDocumentWithEngine(
  doc: CharacterDocument<SystemDataModel>
): CharacterDocument<SystemDataModel> {
  const engine = systemRegistry.peekEngine(doc.systemId);
  return engine ? engine.prepareData(doc) : doc;
}

function prepareDocumentsWithEngines(
  docs: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  return docs.map((doc) => prepareDocumentWithEngine(doc));
}

/**
 * The systems in `docs` that are registered but whose engine is not resolved —
 * i.e. the documents `prepareDocumentWithEngine` would pass through unprepared.
 * Empty in every normal case; non-empty only when an engine chunk failed to
 * download (stale deploy, offline).
 */
function unresolvedEngineSystemIds(docs: CharacterDocument<SystemDataModel>[]): string[] {
  const missing = new Set<string>();
  for (const doc of docs) {
    if (!systemRegistry.peekEngine(doc.systemId) && systemRegistry.get(doc.systemId)) {
      missing.add(doc.systemId);
    }
  }
  return [...missing];
}

function engineLoadErrorMessage(systemIds: string[]): string {
  return `Could not load the rules engine for ${systemIds.join(', ')}. Derived values may be out of date — reload to retry.`;
}

/**
 * Run `dispatch` with engine-prepared documents. Stays fully synchronous — same
 * call ordering as before engines went lazy — whenever every system involved is
 * already resolved, which is the case for anything already in the collection.
 */
function withPreparedDocuments(
  docs: CharacterDocument<SystemDataModel>[],
  dispatch: (prepared: CharacterDocument<SystemDataModel>[]) => void
): void {
  if (unresolvedEngineSystemIds(docs).length === 0) {
    dispatch(prepareDocumentsWithEngines(docs));
    return;
  }

  void systemRegistry.preloadEngines(docs.map((doc) => doc.systemId)).then(() => {
    dispatch(prepareDocumentsWithEngines(docs));
  });
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
    let cancelled = false;

    // Start the IndexedDB read immediately so it still overlaps the localStorage
    // read and the engine-chunk fetch. Its result is only APPLIED after the
    // localStorage branch has published (see the `Promise.all` below), which
    // preserves the old ordering where the synchronous snapshot always lands
    // first and IndexedDB only ever reconciles on top of it.
    const asyncLoad = loadDocumentsAsync().catch(() => null);

    // Fast synchronous load from localStorage first. When no engine chunk is
    // outstanding — an empty store, or every system already resolved — this
    // whole block still runs SYNCHRONOUSLY inside the effect, exactly as it did
    // before engines went lazy (an async IIFE that never awaits completes
    // synchronously). Otherwise the only thing awaited is the engine
    // resolution, with `isLoading` held true meanwhile: documents are never
    // published to React unprepared, they are published once the engines for
    // the systems actually present are in.
    const publishLocal = (async () => {
      try {
        const loaded = loadDocuments();
        if (unresolvedEngineSystemIds(loaded).length > 0) {
          await systemRegistry.preloadEngines(loaded.map((doc) => doc.systemId));
          if (cancelled) return;
        }

        const prepared = prepareDocumentsWithEngines(loaded);
        const unresolved = unresolvedEngineSystemIds(loaded);
        setDocuments(prepared);
        if (unresolved.length > 0) {
          // Surfaced rather than swallowed: without an engine these documents
          // carry whatever derived values were last stored, and writing them
          // back would make that stale math authoritative.
          setError(engineLoadErrorMessage(unresolved));
        } else if (documentsChanged(loaded, prepared)) {
          persist(prepared);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load documents');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    // Then reconcile with IndexedDB. `loadDocumentsAsync` merges the two
    // stores per-document (version/updatedAt-aware), so a stale IndexedDB
    // mirror can no longer wholesale-revert newer localStorage edits.
    void Promise.all([publishLocal, asyncLoad]).then(async ([, asyncDocs]) => {
      if (cancelled || !asyncDocs || asyncDocs.length === 0) return;
      if (historyPastRef.current.length !== 0 || hasLocalEditsRef.current) return;

      await systemRegistry.preloadEngines(asyncDocs.map((doc) => doc.systemId));
      // Re-checked after the await: an edit landing while the engine chunk was
      // in flight must not be clobbered by the reconciled snapshot.
      if (cancelled || historyPastRef.current.length !== 0 || hasLocalEditsRef.current) return;

      const prepared = prepareDocumentsWithEngines(asyncDocs);
      const unresolved = unresolvedEngineSystemIds(asyncDocs);
      setDocuments(prepared);
      if (unresolved.length > 0) {
        setError(engineLoadErrorMessage(unresolved));
      } else if (documentsChanged(asyncDocs, prepared)) {
        persist(prepared);
      }
    });

    return () => {
      cancelled = true;
    };
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
      const seeded = { ...doc, version: doc.version ?? 1 };

      withPreparedDocuments([seeded], ([prepared]) => {
        applyDocumentsUpdate((prev) => [...prev, prepared]);
      });
    },
    [applyDocumentsUpdate]
  );

  const updateDocument = useCallback(
    (doc: CharacterDocument<SystemDataModel>) => {
      const runUpdate = () => {
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
      };

      // The engine is PRE-RESOLVED here, outside the updater, so the version
      // derivation above stays exactly where it is: inside the updater, reading
      // `prev`. Every document already in the collection arrived through a path
      // that resolved its engine first, so this is the synchronous branch in
      // practice and the call ordering is unchanged.
      if (systemRegistry.peekEngine(doc.systemId) || !systemRegistry.get(doc.systemId)) {
        runUpdate();
        return;
      }

      void systemRegistry.loadEngine(doc.systemId).then(runUpdate);
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
      const seeded = docs.map((doc) => ({ ...doc, version: doc.version ?? 1 }));

      withPreparedDocuments(seeded, (prepared) => {
        applyDocumentsUpdate((prev) => mergeDocumentCollections(prev, prepared));
      });
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
      const seeded = merged.map((doc) => ({ ...doc, version: doc.version ?? 1 }));

      withPreparedDocuments(seeded, (prepared) => {
        applyDocumentsUpdate(() => prepared);
      });
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
