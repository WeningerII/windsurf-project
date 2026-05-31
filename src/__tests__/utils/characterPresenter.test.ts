import { describe, it, expect } from 'vitest';
import {
  getClassLabel,
  getDocumentLevelValue,
  getHitPointLabel,
  getLevelLabel,
  getSpeciesLabel,
} from '../../utils/characterPresenter';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

function makeDoc(system: Record<string, unknown>): CharacterDocument<SystemDataModel> {
  return {
    id: 'doc-1',
    name: 'Hero',
    systemId: 'dnd-5e-2024',
    system: system as SystemDataModel,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };
}

describe('characterPresenter', () => {
  describe('getDocumentLevelValue', () => {
    it('prefers level, falls back to powerLevel, then 0', () => {
      expect(getDocumentLevelValue(makeDoc({ level: 5 }))).toBe(5);
      expect(getDocumentLevelValue(makeDoc({ powerLevel: 8 }))).toBe(8);
      expect(getDocumentLevelValue(makeDoc({}))).toBe(0);
    });
  });

  describe('getLevelLabel', () => {
    it('labels level, power level, or nothing', () => {
      expect(getLevelLabel(makeDoc({ level: 3 }))).toBe('Level 3');
      expect(getLevelLabel(makeDoc({ powerLevel: 10 }))).toBe('Power Level 10');
      expect(getLevelLabel(makeDoc({}))).toBeNull();
    });
  });

  describe('getClassLabel', () => {
    it('humanizes a single class from classLevels', () => {
      expect(
        getClassLabel({ classLevels: [{ classId: 'fighter', level: 3 }] } as SystemDataModel)
      ).toBe('Fighter');
    });

    it('appends a multiclass count', () => {
      expect(
        getClassLabel({
          classLevels: [
            { classId: 'rogue-scout', level: 2 },
            { classId: 'wizard', level: 1 },
          ],
        } as SystemDataModel)
      ).toBe('Rogue Scout +1');
    });

    it('falls back to a top-level classId, else null', () => {
      expect(getClassLabel({ classId: 'champion' } as SystemDataModel)).toBe('Champion');
      expect(getClassLabel({} as SystemDataModel)).toBeNull();
    });
  });

  describe('getSpeciesLabel', () => {
    it('prefers speciesId, falls back to ancestryId, else null', () => {
      expect(getSpeciesLabel({ speciesId: 'half-elf' } as SystemDataModel)).toBe('Half Elf');
      expect(getSpeciesLabel({ ancestryId: 'dwarf' } as SystemDataModel)).toBe('Dwarf');
      expect(getSpeciesLabel({} as SystemDataModel)).toBeNull();
    });
  });

  describe('getHitPointLabel', () => {
    it('formats current/max HP when both are finite numbers', () => {
      expect(getHitPointLabel({ hitPoints: { current: 12, max: 20 } } as SystemDataModel)).toBe(
        '12/20 HP'
      );
    });

    it('returns null when HP data is missing or malformed', () => {
      expect(getHitPointLabel({} as SystemDataModel)).toBeNull();
      expect(getHitPointLabel({ hitPoints: { current: 5 } } as SystemDataModel)).toBeNull();
    });
  });
});
