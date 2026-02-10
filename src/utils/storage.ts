import { Character } from '../types/game-systems';

const STORAGE_KEY = 'rpg-characters';
export const STORAGE_VERSION = '1.0';

interface StorageData {
  version: string;
  characters: Character[];
  lastModified: string;
}

export const saveCharacters = (characters: Character[]): void => {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      characters,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to save characters:', error);
    }
    throw new Error('Failed to save character data. Storage may be full.');
  }
};

export const loadCharacters = (): Character[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data: StorageData = JSON.parse(stored);
    
    // Handle version migrations if needed
    if (data.version !== STORAGE_VERSION) {
      // Only log in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Storage version mismatch, migrating data...');
      }
      // Add migration logic here if needed in the future
    }

    // Parse dates back to Date objects
    return data.characters.map((char) => ({
      ...char,
      createdAt: new Date(char.createdAt),
      updatedAt: new Date(char.updatedAt),
    }));
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to load characters:', error);
    }
    return [];
  }
};

export const exportCharacters = (characters: Character[]): string => {
  const data: StorageData = {
    version: STORAGE_VERSION,
    characters,
    lastModified: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

export const importCharacters = (jsonString: string): Character[] => {
  try {
    const data: StorageData = JSON.parse(jsonString);
    
    if (!data.characters || !Array.isArray(data.characters)) {
      throw new Error('Invalid character data format');
    }

    return data.characters.map((char) => ({
      ...char,
      createdAt: new Date(char.createdAt),
      updatedAt: new Date(char.updatedAt),
    }));
  } catch (error) {
    throw new Error('Failed to import characters. Invalid JSON format.');
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getStorageSize = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? new Blob([stored]).size : 0;
};
