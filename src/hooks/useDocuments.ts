import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  saveDocuments,
  loadDocuments,
  loadDocumentsAsync,
  clearDocumentStorage,
} from '../utils/documentStorage';
import { systemRegistry } from '../registry';
import { debounce, throttle } from '../utils/performance';

const MAX_HISTORY = 50;

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

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    historyPastRef.current = historyPast;
  }, [historyPast]);

  useEffect(() => {
    // Fast synchronous load from localStorage first
    try {
      const loaded = loadDocuments();
      setDocuments(loaded);
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
          setDocuments(asyncDocs);
        }
      })
      .catch(() => {
        // IndexedDB load failed; synchronous localStorage data is already set
      });
  }, []);

  const persist = useCallback((docs: CharacterDocument<SystemDataModel>[]) => {
    try {
      saveDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save documents');
    }
  }, []);

  const debouncedPersist = useMemo(
    () =>
      debounce((docs: CharacterDocument<SystemDataModel>[], version: number) => {
        if (version !== persistVersionRef.current) return;
        persist(docs);
      }, 300),
    [persist]
  );

  useEffect(() => () => debouncedPersist.flush(), [debouncedPersist]);

  const pushHistorySnapshot = useCallback((snapshot: CharacterDocument<SystemDataModel>[]) => {
    setHistoryPast((prev) => [...prev.slice(-(MAX_HISTORY - 1)), cloneDocumentsSnapshot(snapshot)]);
    setHistoryFuture([]);
  }, []);

  const throttledPushHistory = useMemo(
    () =>
      throttle((snapshot: CharacterDocument<SystemDataModel>[]) => {
        pushHistorySnapshot(snapshot);
      }, 500),
    [pushHistorySnapshot]
  );

  const applyDocumentsUpdate = useCallback(
    (
      updater: (prev: CharacterDocument<SystemDataModel>[]) => CharacterDocument<SystemDataModel>[]
    ) => {
      const persistVersion = ++persistVersionRef.current;
      setDocuments((prev) => {
        const next = updater(prev);
        hasLocalEditsRef.current = true;
        if (next.length === prev.length) {
          throttledPushHistory(prev);
        } else {
          pushHistorySnapshot(prev);
        }
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, pushHistorySnapshot, throttledPushHistory]
  );

  const addDocument = useCallback(
    (doc: CharacterDocument<SystemDataModel>) => {
      // Run prepareData through the system engine before saving
      const sysDef = systemRegistry.get(doc.systemId);
      const prepared = sysDef ? sysDef.engine.prepareData(doc) : doc;

      applyDocumentsUpdate((prev) => [...prev, prepared]);
    },
    [applyDocumentsUpdate]
  );

  const updateDocument = useCallback(
    (doc: CharacterDocument<SystemDataModel>) => {
      const sysDef = systemRegistry.get(doc.systemId);
      const prepared = sysDef
        ? sysDef.engine.prepareData({ ...doc, updatedAt: new Date() })
        : { ...doc, updatedAt: new Date() };

      applyDocumentsUpdate((prev) => prev.map((d) => (d.id === prepared.id ? prepared : d)));
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
      const prepared = docs.map((doc) => {
        const sysDef = systemRegistry.get(doc.systemId);
        return sysDef ? sysDef.engine.prepareData(doc) : doc;
      });

      applyDocumentsUpdate((prev) => [...prev, ...prepared]);
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
  };
};
