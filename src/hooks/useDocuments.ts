import { useState, useEffect, useCallback } from 'react';
import { CharacterDocument, SystemDataModel } from '../types/core/document';
import { saveDocuments, loadDocuments, clearDocumentStorage } from '../utils/documentStorage';
import { systemRegistry } from '../registry';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<CharacterDocument<SystemDataModel>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loaded = loadDocuments();
      setDocuments(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((docs: CharacterDocument<SystemDataModel>[]) => {
    try {
      saveDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save documents');
    }
  }, []);

  const addDocument = useCallback((doc: CharacterDocument<SystemDataModel>) => {
    // Run prepareData through the system engine before saving
    const sysDef = systemRegistry.get(doc.systemId);
    const prepared = sysDef ? sysDef.engine.prepareData(doc) : doc;

    setDocuments(prev => {
      const updated = [...prev, prepared];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const updateDocument = useCallback((doc: CharacterDocument<SystemDataModel>) => {
    const sysDef = systemRegistry.get(doc.systemId);
    const prepared = sysDef ? sysDef.engine.prepareData({ ...doc, updatedAt: new Date() }) : { ...doc, updatedAt: new Date() };

    setDocuments(prev => {
      const updated = prev.map(d => d.id === prepared.id ? prepared : d);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => {
      const updated = prev.filter(d => d.id !== id);
      persist(updated);
      return updated;
    });
    setError(null);
  }, [persist]);

  const addDocuments = useCallback((docs: CharacterDocument<SystemDataModel>[]) => {
    const prepared = docs.map(doc => {
      const sysDef = systemRegistry.get(doc.systemId);
      return sysDef ? sysDef.engine.prepareData(doc) : doc;
    });

    setDocuments(prev => {
      const updated = [...prev, ...prepared];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const clearAllDocuments = useCallback(() => {
    setDocuments([]);
    try {
      clearDocumentStorage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear document data');
    }
    setError(null);
  }, []);

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
    clearError,
  };
};
