import { CharacterDocument, SystemDataModel } from '../types/core/document';

const STORAGE_KEY = 'rpg-documents-v2';
const STORAGE_VERSION = '2.0';

interface DocumentStorageData {
  version: string;
  documents: CharacterDocument<SystemDataModel>[];
  lastModified: string;
}

function hydrateDocuments(
  documents: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  return documents.map(doc => ({
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

    if (data.version !== STORAGE_VERSION && process.env.NODE_ENV !== 'production') {
      console.warn('Document storage version mismatch, attempting migration...');
    }

    return hydrateDocuments(data.documents);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to parse V2 document storage:', error);
    }
    return null;
  }
}

export function saveDocuments(documents: CharacterDocument<SystemDataModel>[]): void {
  try {
    const data: DocumentStorageData = {
      version: STORAGE_VERSION,
      documents,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to save documents:', error);
    }
    throw new Error('Failed to save document data. Storage may be full.');
  }
}

export function loadDocuments(): CharacterDocument<SystemDataModel>[] {
  const v2Documents = tryLoadV2Documents();
  if (v2Documents !== null) {
    return v2Documents;
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

    return data.documents.map(doc => ({
      ...doc,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    }));
  } catch {
    throw new Error('Failed to import documents. Invalid JSON format.');
  }
}

export function clearDocumentStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
