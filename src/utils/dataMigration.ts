/**
 * Data Migration Utilities
 * 
 * Handles version changes and data structure migrations
 */

import { Character } from '../types/game-systems';
import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';

// Note: STORAGE_VERSION is a string in storage.ts, we use semantic versioning
const CURRENT_VERSION = '1.0';

export interface MigrationResult {
  success: boolean;
  fromVersion: string;
  toVersion: string;
  migratedCount: number;
  errors: string[];
}

/**
 * Migration function type
 */
type MigrationFn = (data: Partial<Character>) => Partial<Character>;

/**
 * Registry of migration functions
 * Key format: "fromVersion_to_toVersion" (e.g., "1.0_to_1.1")
 */
const migrations: Record<string, MigrationFn> = {
  // Example: v1.0 to v1.1 migration
  '1.0_to_1.1': (data: Partial<Character>) => {
    // Add new field with default value if needed
    return {
      ...data,
      // Example: newField: 'defaultValue',
    };
  },
  
  // Add more migrations as needed
};

/**
 * Migrate character data from one version to another
 */
export function migrateCharacter(
  character: Partial<Character>,
  fromVersion: string,
  toVersion: string
): Character | null {
  try {
    let migrated = { ...character };
    
    // For now, direct version comparison
    // In the future, implement semantic version comparison
    if (fromVersion !== toVersion) {
      const migrationKey = `${fromVersion}_to_${toVersion}`;
      const migrationFn = migrations[migrationKey];
      
      if (migrationFn) {
        migrated = migrationFn(migrated);
        errorLogger.log(
          ErrorCategory.DATA_LOAD,
          ErrorSeverity.LOW,
          `Applied migration ${migrationKey}`,
          undefined,
          { characterId: character.id }
        );
      }
    }
    
    return migrated as Character;
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Character migration failed',
      error as Error,
      { fromVersion, toVersion, characterId: character.id }
    );
    return null;
  }
}

/**
 * Migrate all characters in storage
 */
export function migrateAllCharacters(
  characters: Partial<Character>[],
  fromVersion: string,
  toVersion: string = CURRENT_VERSION
): MigrationResult {
  const result: MigrationResult = {
    success: true,
    fromVersion,
    toVersion,
    migratedCount: 0,
    errors: [],
  };
  
  if (fromVersion === toVersion) {
    return result;
  }
  
  const migratedCharacters: Character[] = [];
  
  for (const character of characters) {
    const migrated = migrateCharacter(character, fromVersion, toVersion);
    
    if (migrated) {
      migratedCharacters.push(migrated);
      result.migratedCount++;
    } else {
      result.success = false;
      result.errors.push(`Failed to migrate character ${character.id || 'unknown'}`);
    }
  }
  
  errorLogger.log(
    ErrorCategory.DATA_LOAD,
    result.success ? ErrorSeverity.LOW : ErrorSeverity.HIGH,
    `Migration completed: ${result.migratedCount}/${characters.length} characters`,
    undefined,
    result
  );
  
  return result;
}

/**
 * Check if data needs migration
 */
export function needsMigration(storedVersion: string): boolean {
  return storedVersion !== CURRENT_VERSION;
}

/**
 * Validate migrated data
 */
export function validateMigratedCharacter(character: Partial<Character>): boolean {
  try {
    // Basic structure validation
    return (
      typeof character === 'object' &&
      character !== null &&
      typeof character.id === 'string' &&
      typeof character.name === 'string' &&
      typeof character.system === 'string' &&
      typeof character.level === 'number'
    );
  } catch (error) {
    return false;
  }
}

/**
 * Create backup before migration
 */
export function createMigrationBackup(characters: Character[]): string {
  try {
    const backup = {
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      characters,
    };
    
    return JSON.stringify(backup);
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Failed to create migration backup',
      error as Error
    );
    return '';
  }
}

/**
 * Restore from backup
 */
export function restoreFromBackup(backupString: string): Character[] | null {
  try {
    const backup = JSON.parse(backupString);
    
    if (!backup.characters || !Array.isArray(backup.characters)) {
      throw new Error('Invalid backup format');
    }
    
    return backup.characters;
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Failed to restore from backup',
      error as Error
    );
    return null;
  }
}
