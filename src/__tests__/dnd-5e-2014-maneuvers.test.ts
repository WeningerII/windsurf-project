import { describe, it, expect } from 'vitest';
import { battleMasterManeuvers } from '../data/dnd/5e-2014/class-features/fighter/maneuvers';

describe('D&D 5e-2014 Battle Master Maneuvers', () => {
  it('should have exactly 23 maneuvers', () => {
    expect(battleMasterManeuvers).toHaveLength(23);
  });

  it('should have unique IDs', () => {
    const ids = battleMasterManeuvers.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should all have valid structure', () => {
    battleMasterManeuvers.forEach((maneuver) => {
      expect(maneuver.id).toMatch(/^[a-z0-9-]+$/);
      expect(maneuver.name).toBeTruthy();
      expect(maneuver.description).toBeTruthy();
      expect(maneuver.superiorityDie).toMatch(/^d(8|10|12)$/);
      expect(maneuver.system).toBe('dnd-5e-2014');
      expect(['self', 'creature', 'area']).toContain(maneuver.targetType);
      expect(['attack', 'reaction', 'bonus', 'special']).toContain(maneuver.actionType);
    });
  });

  it('should all reference SRD 5.1', () => {
    battleMasterManeuvers.forEach((maneuver) => {
      expect(maneuver.source.book).toBe('SRD 5.1');
      expect(maneuver.source.page).toBeGreaterThan(0);
    });
  });

  it('should have version numbers', () => {
    battleMasterManeuvers.forEach((maneuver) => {
      expect(maneuver.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('should have saving throws for appropriate maneuvers', () => {
    const maneuversWithSaves = [
      'disarming-attack',
      'goading-attack',
      'menacing-attack',
      'pushing-attack',
      'trip-attack',
    ];

    battleMasterManeuvers.forEach((maneuver) => {
      if (maneuversWithSaves.includes(maneuver.id)) {
        expect(maneuver.savingThrow).toBeDefined();
        expect(maneuver.savingThrow?.dc).toBe('maneuver-save-dc');
        expect(['str', 'dex', 'con', 'int', 'wis', 'cha']).toContain(maneuver.savingThrow?.ability);
      }
    });
  });

  it('should include key maneuvers', () => {
    const keyManeuvers = [
      'commanders-strike',
      'disarming-attack',
      'precision-attack',
      'riposte',
      'trip-attack',
      'menacing-attack',
      'parry',
    ];

    const maneuverIds = battleMasterManeuvers.map((m) => m.id);
    keyManeuvers.forEach((key) => {
      expect(maneuverIds).toContain(key);
    });
  });
});
