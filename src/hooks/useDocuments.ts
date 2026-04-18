import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  saveDocuments,
  loadDocuments,
  loadDocumentsAsync,
  clearDocumentStorage,
} from '../utils/documentStorage';
import { systemRegistry } from '../registry';
import { debounce } from '../utils/performance';
import { sameDocumentSignatures } from '../utils/documentSignature';

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

function getDocumentVersion(doc: CharacterDocument<SystemDataModel>): number {
  return doc.version ?? 1;
}

function mergeDocumentCollections(
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
  const hasLocalEditsRef = useRef(false);
  const persistVersionRef = useRef(0);
  const historySnapshotQueuedRef = useRef(false);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    historyPastRef.current = historyPast;
  }, [historyPast]);

  const persist = useCallback((docs: CharacterDocument<SystemDataModel>[]) => {
    try {
      saveDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save documents');
    }
  }, []);

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

    // Then attempt async IndexedDB load (may auto-migrate localStorage data)
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

  const debouncedPersist = useMemo(
    () =>
      debounce((docs: CharacterDocument<SystemDataModel>[], version: number) => {
        if (version !== persistVersionRef.current) return;
        persist(docs);
      }, 300),
    [persist]
  );

  useEffect(() => () => debouncedPersist.flush(), [debouncedPersist]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const flushPersist = () => {
      debouncedPersist.flush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPersist();
      }
    };

    window.addEventListener('pagehide', flushPersist);
    window.addEventListener('beforeunload', flushPersist);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', flushPersist);
      window.removeEventListener('beforeunload', flushPersist);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [debouncedPersist]);

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

  const applyDocumentsUpdate = useCallback(
    (
      updater: (prev: CharacterDocument<SystemDataModel>[]) => CharacterDocument<SystemDataModel>[]
    ) => {
      const persistVersion = ++persistVersionRef.current;
      setDocuments((prev) => {
        const next = updater(prev);
        // Hot path: runs on every mutation. Cheap signature compare is
        // sufficient because all mutations stamp a fresh `updatedAt`.
        if (sameDocumentSignatures(prev, next)) {
          return prev;
        }

        hasLocalEditsRef.current = true;
        if (next.length === prev.length) {
          queueHistorySnapshot(prev);
        } else {
          pushHistorySnapshot(prev);
        }
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, pushHistorySnapshot, queueHistorySnapshot]
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

  const clearAllDocuments = useCallback(() => {
    hasLocalEditsRef.current = true;
    persistVersionRef.current += 1;
    pushHistorySnapshot(documentsRef.current);
    debouncedPersist.cancel();
    setDocuments([]);
    try {
      clearDocumentStorage();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear document data');
    }
  }, [debouncedPersist, pushHistorySnapshot]);

  const undo = useCallback(() => {
    const persistVersion = ++persistVersionRef.current;
    setHistoryPast((past) => {
      if (past.length === 0) return past;

      const previous = past[past.length - 1];
      const current = documentsRef.current;
      setHistoryFuture((future) => [
        cloneDocumentsSnapshot(current),
        ...future.slice(0, MAX_HISTORY - 1),
      ]);
      hasLocalEditsRef.current = true;
      setDocuments(cloneDocumentsSnapshot(previous));
      debouncedPersist(previous, persistVersion);

      return past.slice(0, -1);
    });
  }, [debouncedPersist]);

  const redo = useCallback(() => {
    const persistVersion = ++persistVersionRef.current;
    setHistoryFuture((future) => {
      if (future.length === 0) return future;

      const next = future[0];
      const current = documentsRef.current;
      setHistoryPast((past) => [
        ...past.slice(-(MAX_HISTORY - 1)),
        cloneDocumentsSnapshot(current),
      ]);
      hasLocalEditsRef.current = true;
      setDocuments(cloneDocumentsSnapshot(next));
      debouncedPersist(next, persistVersion);

      return future.slice(1);
    });
  }, [debouncedPersist]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    documents,
    isLoading,
    error,
    addDocument,
    addDocuments,
    updateDocument,
    deleteDocument,
    clearAllDocuments,
    undo,
    redo,
    canUndo: historyPast.length > 0,
    canRedo: historyFuture.length > 0,
    clearError,
    flushPendingSaves: debouncedPersist.flush,
  };
};
