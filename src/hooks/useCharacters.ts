import { useState, useEffect, useCallback } from 'react';
import { Character } from '../types/game-systems';
import { loadCharacters, saveCharacters, clearAllData } from '../utils/storage';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';
import { validateCharacter } from '../utils/validation';

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loaded = loadCharacters();
      setCharacters(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCharacter = useCallback((character: Character) => {
    try {
      validateCharacter(character);
      setCharacters((prev) => {
        const updated = [...prev, character];
        try {
          saveCharacters(updated);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to save characters');
        }
        return updated;
      });
      
      errorLogger.log(
        ErrorCategory.USER_ACTION,
        ErrorSeverity.LOW,
        'Character added successfully',
        undefined,
        { characterId: character.id, characterName: character.name }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add character';
      setError(errorMessage);
      
      errorLogger.log(
        ErrorCategory.STORAGE,
        ErrorSeverity.HIGH,
        'Failed to add character',
        err as Error,
        { characterId: character.id }
      );
      throw err;
    }
  }, []);

  const updateCharacter = useCallback((updatedCharacter: Character) => {
    try {
      validateCharacter(updatedCharacter);
      setCharacters((prev) => {
        const updated = prev.map((char) =>
          char.id === updatedCharacter.id
            ? { ...updatedCharacter, updatedAt: new Date() }
            : char
        );
        try {
          saveCharacters(updated);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to save characters');
        }
        return updated;
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update character');
      throw err;
    }
  }, []);

  const deleteCharacter = useCallback((characterId: string) => {
    setCharacters((prev) => {
      const updated = prev.filter((char) => char.id !== characterId);
      try {
        saveCharacters(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save characters');
      }
      return updated;
    });
    setError(null);
  }, []);

  const addCharacters = useCallback((newCharacters: Character[]) => {
    try {
      newCharacters.forEach(validateCharacter);
      setCharacters((prev) => {
        const updated = [...prev, ...newCharacters];
        try {
          saveCharacters(updated);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to save characters');
        }
        return updated;
      });

      errorLogger.log(
        ErrorCategory.USER_ACTION,
        ErrorSeverity.LOW,
        'Characters imported successfully',
        undefined,
        { count: newCharacters.length }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import characters';
      setError(errorMessage);

      errorLogger.log(
        ErrorCategory.STORAGE,
        ErrorSeverity.HIGH,
        'Failed to import characters',
        err as Error
      );
      throw err;
    }
  }, []);

  const clearAllCharacters = useCallback(() => {
    setCharacters([]);
    try {
      clearAllData();
      saveCharacters([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear character data');
    }
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    characters,
    isLoading,
    error,
    addCharacter,
    addCharacters,
    updateCharacter,
    deleteCharacter,
    clearAllCharacters,
    clearError,
  };
};
