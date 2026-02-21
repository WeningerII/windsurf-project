import { CharacterDocument, SystemDataModel } from '../types/core/document';
import { Character } from '../types/game-systems';
import { migrateLegacyCharacters } from './migrateLegacy';

const STORAGE_KEY = 'rpg-documents-v2';
const LEGACY_STORAGE_KEY = 'rpg-characters';

/** Load legacy V1 characters from localStorage (for one-time migration) */
function loadLegacyCharacters(): Character[] {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) return [];
    const data = JSON.parse(stored);
    if (!Array.isArray(data.characters)) return [];
    return data.characters.map((char: Character) => ({
      ...char,
      createdAt: new Date(char.createdAt),
      updatedAt: new Date(char.updatedAt),
    }));
  } catch {
    return [];
  }
}
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
      console.warn('Failed to parse V2 document storage, falling back to legacy migration:', error);
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

  // No valid V2 payload was found. Attempt legacy migration.
  const legacyCharacters = loadLegacyCharacters();
  if (legacyCharacters.length === 0) {
    return [];
  }

  try {
    const migrated = migrateLegacyCharacters(legacyCharacters);
    saveDocuments(migrated);

    if (process.env.NODE_ENV !== 'production') {
      const hadLegacyKey = Boolean(localStorage.getItem(LEGACY_STORAGE_KEY));
      if (hadLegacyKey) {
        console.log(`Migrated ${migrated.length} legacy character(s) to V2 document storage.`);
      }
    }

    return migrated;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to migrate legacy character storage:', error);
    }
    return [];
  }
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
