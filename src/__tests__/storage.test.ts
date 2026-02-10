import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  STORAGE_VERSION,
  clearAllData,
  exportCharacters,
  getStorageSize,
  importCharacters,
  loadCharacters,
  saveCharacters,
} from '../utils/storage';
import type { Character } from '../types/game-systems';

const storageKey = 'rpg-characters';

const baseCharacter: Character = {
  id: 'storage-char-1',
  name: 'Storage Hero',
  system: 'dnd-5e-2014',
  level: 3,
  experiencePoints: 900,
  classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [8, 7, 6] }],
  baseAttributes: { str: 14, dex: 12, con: 13, int: 10, wis: 10, cha: 8 },
  skillProficiencies: {},
  hitPoints: { current: 24, max: 24, temp: 0 },
  hitDice: [{ die: 'd10', total: 3, remaining: 3 }],
  armorClass: 15,
  initiative: 1,
  speed: 30,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: ['str', 'con'],
  features: [],
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 25, platinum: 0 },
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
};

describe('storage utilities', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('saveCharacters persists versioned payload', () => {
    saveCharacters([baseCharacter]);

    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    expect(stored.version).toBe(STORAGE_VERSION);
    expect(stored.characters).toHaveLength(1);
    expect(typeof stored.lastModified).toBe('string');
  });

  it('saveCharacters throws friendly error when storage fails', () => {
    const stringifySpy = vi.spyOn(JSON, 'stringify').mockImplementation(() => {
      throw new Error('serialize failed');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => saveCharacters([baseCharacter])).toThrow(
      'Failed to save character data. Storage may be full.'
    );
    expect(stringifySpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save characters:', expect.any(Error));
  });

  it('saveCharacters suppresses dev logging in production mode', () => {
    process.env.NODE_ENV = 'production';
    vi.spyOn(JSON, 'stringify').mockImplementation(() => {
      throw new Error('serialize failed');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => saveCharacters([baseCharacter])).toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalledWith('Failed to save characters:', expect.any(Error));
  });

  it('loadCharacters returns empty array when nothing is stored', () => {
    expect(loadCharacters()).toEqual([]);
  });

  it('loadCharacters hydrates dates and warns on version mismatch', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: '0.9',
        characters: [
          {
            ...baseCharacter,
            createdAt: baseCharacter.createdAt.toISOString(),
            updatedAt: baseCharacter.updatedAt.toISOString(),
          },
        ],
        lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
      })
    );

    const loaded = loadCharacters();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.createdAt).toBeInstanceOf(Date);
    expect(loaded[0]?.updatedAt).toBeInstanceOf(Date);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Storage version mismatch, migrating data...');
  });

  it('loadCharacters suppresses version warnings in production mode', () => {
    process.env.NODE_ENV = 'production';
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: '0.9',
        characters: [],
        lastModified: new Date('2026-01-03T00:00:00.000Z').toISOString(),
      })
    );

    expect(loadCharacters()).toEqual([]);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('loadCharacters catches malformed data and logs in non-production', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(storageKey, 'not-json');

    expect(loadCharacters()).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load characters:', expect.any(Error));
  });

  it('exportCharacters returns pretty JSON with version info', () => {
    const json = exportCharacters([baseCharacter]);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe(STORAGE_VERSION);
    expect(parsed.characters).toHaveLength(1);
    expect(json).toContain('\n');
  });

  it('importCharacters hydrates dates from valid JSON', () => {
    const input = JSON.stringify({
      version: STORAGE_VERSION,
      characters: [
        {
          ...baseCharacter,
          createdAt: baseCharacter.createdAt.toISOString(),
          updatedAt: baseCharacter.updatedAt.toISOString(),
        },
      ],
      lastModified: new Date().toISOString(),
    });

    const imported = importCharacters(input);
    expect(imported).toHaveLength(1);
    expect(imported[0]?.createdAt).toBeInstanceOf(Date);
    expect(imported[0]?.updatedAt).toBeInstanceOf(Date);
  });

  it('importCharacters rejects invalid payloads and malformed JSON', () => {
    expect(() => importCharacters(JSON.stringify({ version: STORAGE_VERSION }))).toThrow(
      'Failed to import characters. Invalid JSON format.'
    );
    expect(() => importCharacters('bad-json')).toThrow(
      'Failed to import characters. Invalid JSON format.'
    );
  });

  it('clearAllData removes saved payload and getStorageSize reflects current size', () => {
    expect(getStorageSize()).toBe(0);
    saveCharacters([baseCharacter]);
    expect(getStorageSize()).toBeGreaterThan(0);
    clearAllData();
    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(getStorageSize()).toBe(0);
  });
});
