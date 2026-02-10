import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Character } from '../types/game-systems';
import {
  createMigrationBackup,
  migrateAllCharacters,
  migrateCharacter,
  needsMigration,
  restoreFromBackup,
  validateMigratedCharacter,
} from '../utils/dataMigration';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';

const baseCharacter: Partial<Character> = {
  id: 'char-1',
  name: 'Migrator',
  system: 'dnd-5e-2024',
  level: 3,
};

describe('dataMigration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('detects whether migration is needed', () => {
    expect(needsMigration('0.9')).toBe(true);
    expect(needsMigration('1.0')).toBe(false);
  });

  it('returns input character when no migration is needed', () => {
    const migrated = migrateCharacter(baseCharacter, '1.0', '1.0');
    expect(migrated).toMatchObject(baseCharacter);
  });

  it('applies known migration and logs low-severity message', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    const migrated = migrateCharacter(baseCharacter, '1.0', '1.1');

    expect(migrated).toMatchObject(baseCharacter);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.LOW,
      'Applied migration 1.0_to_1.1',
      undefined,
      expect.objectContaining({ characterId: 'char-1' })
    );
  });

  it('returns null and logs high-severity error when migration throws', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const badCharacter: Partial<Character> = { id: 'bad-char' };

    Object.defineProperty(badCharacter, 'name', {
      get() {
        throw new Error('broken character');
      },
      enumerable: true,
    });

    const migrated = migrateCharacter(badCharacter, '1.0', '1.1');

    expect(migrated).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Character migration failed',
      expect.any(Error),
      expect.objectContaining({ fromVersion: '1.0', toVersion: '1.1' })
    );
  });

  it('migrates collections and returns failure details for invalid records', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const badCharacter: Partial<Character> = { id: 'bad-collection-char' };

    Object.defineProperty(badCharacter, 'name', {
      get() {
        throw new Error('bad collection item');
      },
      enumerable: true,
    });

    const result = migrateAllCharacters([baseCharacter, badCharacter], '1.0', '1.1');

    expect(result.success).toBe(false);
    expect(result.migratedCount).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/bad-collection-char/);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Migration completed: 1/2 characters',
      undefined,
      expect.objectContaining({ migratedCount: 1 })
    );
  });

  it('validates migrated character shape', () => {
    expect(validateMigratedCharacter(baseCharacter)).toBe(true);
    expect(validateMigratedCharacter({ name: 'Missing fields' })).toBe(false);
    expect(validateMigratedCharacter(null)).toBe(false);
  });

  it('creates backup JSON and restores valid backups', () => {
    const backup = createMigrationBackup([baseCharacter as Character]);
    const restored = restoreFromBackup(backup);

    expect(backup).toContain('char-1');
    expect(restored).toHaveLength(1);
    expect(restored?.[0]).toMatchObject({ id: 'char-1' });
  });

  it('logs and returns null for invalid backup format', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    const restored = restoreFromBackup('{"version":"1.0"}');

    expect(restored).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Failed to restore from backup',
      expect.any(Error)
    );
  });

  it('returns empty string when backup serialization fails', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const circular: Character[] = [];
    const entry = { self: null } as unknown as Character;
    (entry as unknown as { self: unknown }).self = entry;
    circular.push(entry);

    const backup = createMigrationBackup(circular);

    expect(backup).toBe('');
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Failed to create migration backup',
      expect.any(Error)
    );
  });
});
