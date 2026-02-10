/**
 * Data Loader Integration Tests
 * 
 * Ensures data loaders work correctly for all game systems
 */

import { describe, it, expect } from 'vitest';
import { 
  loadSpellsForSystem, 
  loadClassesForSystem, 
  loadSpeciesForSystem,
  loadMonstersForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem 
} from '../utils/dataLoader';

describe('Data Loader Integration Tests', () => {
  describe('D&D 5e-2014 Loaders', () => {
    it('should load spells for dnd-5e-2014', async () => {
      const spells = await loadSpellsForSystem('dnd-5e-2014');
      expect(spells.length).toBe(238);
      expect(spells.every(s => s.id && s.name && s.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load classes for dnd-5e-2014', async () => {
      const classes = await loadClassesForSystem('dnd-5e-2014');
      expect(classes.length).toBe(12);
      expect(classes.every(c => c.id && c.name && c.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load species for dnd-5e-2014', async () => {
      const species = await loadSpeciesForSystem('dnd-5e-2014');
      expect(species.length).toBe(9);
      expect(species.every(s => s.id && s.name && s.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load monsters for dnd-5e-2014', async () => {
      const monsters = await loadMonstersForSystem('dnd-5e-2014');
      expect(monsters.length).toBeGreaterThan(30);
      expect(monsters.every(m => m.id && m.name && m.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load equipment for dnd-5e-2014', async () => {
      const equipment = await loadEquipmentForSystem('dnd-5e-2014');
      expect(equipment.length).toBeGreaterThan(200);
      expect(equipment.every(e => e.id && e.name && e.system === 'dnd-5e-2014')).toBe(true);
    });
  });

  describe('D&D 5e-2024 Loaders', () => {
    it('should load spells for dnd-5e-2024', async () => {
      const spells = await loadSpellsForSystem('dnd-5e-2024');
      expect(Array.isArray(spells)).toBe(true);
    });

    it('should load classes for dnd-5e-2024', async () => {
      const classes = await loadClassesForSystem('dnd-5e-2024');
      expect(Array.isArray(classes)).toBe(true);
    });

    it('should load species for dnd-5e-2024', async () => {
      const species = await loadSpeciesForSystem('dnd-5e-2024');
      expect(species.length).toBe(9);
      expect(species.every(s => s.id && s.name && s.system === 'dnd-5e-2024')).toBe(true);
    });

    it('should load feats for dnd-5e-2024', async () => {
      const feats = await loadFeatsForSystem('dnd-5e-2024');
      expect(feats.length).toBe(87);
      expect(new Set(feats.map(f => f.id)).size).toBe(feats.length);
    });

    it('should load equipment for dnd-5e-2024 without duplicates', async () => {
      const equipment = await loadEquipmentForSystem('dnd-5e-2024');
      expect(equipment.length).toBe(204);
      expect(new Set(equipment.map(e => e.id)).size).toBe(equipment.length);
    });
  });

  describe('Pathfinder 2e Loaders', () => {
    it('should load spells for pf2e', async () => {
      const spells = await loadSpellsForSystem('pf2e');
      expect(Array.isArray(spells)).toBe(true);
    });

    it('should load classes for pf2e', async () => {
      const classes = await loadClassesForSystem('pf2e');
      expect(Array.isArray(classes)).toBe(true);
    });
  });

  describe('Strict Open-Content Filtering', () => {
    it('should exclude non-core PF1e feats', async () => {
      const feats = await loadFeatsForSystem('pf1e');
      expect(feats.length).toBeGreaterThan(0);
      expect(feats.some(feat => feat.source === 'APG' || feat.source === "Advanced Player's Guide")).toBe(false);
      expect(feats.every(feat => feat.source === 'CRB' || feat.source === 'Core Rulebook')).toBe(true);
    });

    it('should exclude non-core PF2e species', async () => {
      const species = await loadSpeciesForSystem('pf2e');
      expect(species.length).toBeGreaterThan(0);
      expect(species.some(entry => entry.id === 'orc')).toBe(false);
      expect(species.every(entry => entry.source === 'Core Rulebook' || entry.source === 'CRB')).toBe(true);
    });

    it('should dedupe M&M powers by ID', async () => {
      const powers = await loadSpellsForSystem('mam3e');
      expect(powers.length).toBeGreaterThan(0);
      expect(new Set(powers.map(power => power.id)).size).toBe(powers.length);
    });
  });

  describe('Error Handling', () => {
    it('should return empty array for unknown system', async () => {
      const spells = await loadSpellsForSystem('unknown-system' as any);
      expect(spells).toEqual([]);
    });

    it('should not throw errors on missing data', async () => {
      await expect(loadFeatsForSystem('mam3e')).resolves.toEqual([]);
    });
  });

  describe('Data Validation', () => {
    it('should filter out invalid spell data', async () => {
      const spells = await loadSpellsForSystem('dnd-5e-2014');
      spells.forEach(spell => {
        expect(spell.id).toBeTruthy();
        expect(spell.name).toBeTruthy();
        expect(spell.system).toBeTruthy();
      });
    });

    it('should filter out invalid class data', async () => {
      const classes = await loadClassesForSystem('dnd-5e-2024');
      classes.forEach(cls => {
        expect(cls.id).toBeTruthy();
        expect(cls.name).toBeTruthy();
        expect(cls.system).toBeTruthy();
      });
    });
  });
});
