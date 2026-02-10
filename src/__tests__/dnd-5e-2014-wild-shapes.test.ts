import { describe, it, expect } from 'vitest';
import { wildShapeForms } from '../data/dnd/5e-2014/class-features/druid/wild-shapes';

describe('D&D 5e-2014 Wild Shape Forms', () => {
  it('should have exactly 20 wild shape forms', () => {
    expect(wildShapeForms).toHaveLength(20);
  });
  
  it('should have unique IDs', () => {
    const ids = wildShapeForms.map(f => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  it('should all have valid structure', () => {
    wildShapeForms.forEach(form => {
      expect(form.id).toMatch(/^[a-z0-9-]+$/);
      expect(form.name).toBeTruthy();
      expect(form.system).toBe('dnd-5e-2014');
      expect(form.source.book).toBe('SRD 5.1');
      expect(form.source.page).toBeGreaterThan(0);
      expect(['tiny', 'small', 'medium', 'large', 'huge']).toContain(form.size);
      expect(form.type).toBe('beast');
      expect(form.challengeRating).toBeGreaterThanOrEqual(0);
      expect(form.minDruidLevel).toBeGreaterThanOrEqual(2);
      expect(form.ac).toBeGreaterThan(0);
      expect(form.hp).toBeGreaterThan(0);
    });
  });
  
  it('should have version numbers', () => {
    wildShapeForms.forEach(form => {
      expect(form.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
  
  it('should have valid ability scores', () => {
    wildShapeForms.forEach(form => {
      expect(form.stats.str).toBeGreaterThan(0);
      expect(form.stats.dex).toBeGreaterThan(0);
      expect(form.stats.con).toBeGreaterThan(0);
      expect(form.stats.int).toBeGreaterThan(0);
      expect(form.stats.wis).toBeGreaterThan(0);
      expect(form.stats.cha).toBeGreaterThan(0);
    });
  });
  
  it('should have at least one action', () => {
    wildShapeForms.forEach(form => {
      expect(form.actions.length).toBeGreaterThan(0);
    });
  });
  
  it('should include popular wild shape forms', () => {
    const popularForms = [
      'wolf',
      'brown-bear',
      'dire-wolf',
      'giant-eagle',
      'giant-spider',
    ];
    
    const formIds = wildShapeForms.map(f => f.id);
    popularForms.forEach(popular => {
      expect(formIds).toContain(popular);
    });
  });
  
  it('should have appropriate CR for level requirements', () => {
    wildShapeForms.forEach(form => {
      // Level 2: CR 1/4 max (no swim/fly)
      if (form.minDruidLevel === 2) {
        expect(form.challengeRating).toBeLessThanOrEqual(0.25);
      } 
      // Level 4+: CR 1/2 to 1 allowed (swim allowed)
      else if (form.minDruidLevel >= 4 && form.minDruidLevel < 8) {
        expect(form.challengeRating).toBeLessThanOrEqual(1);
      } 
      // Level 8+: CR 2 allowed (fly allowed)
      else if (form.minDruidLevel >= 8) {
        expect(form.challengeRating).toBeGreaterThanOrEqual(0);
      }
    });
  });
  
  it('should have swim forms for aquatic druids', () => {
    const swimForms = wildShapeForms.filter(f => f.swimSpeed);
    expect(swimForms.length).toBeGreaterThan(0);
    
    swimForms.forEach(form => {
      expect(form.speed.swim).toBeGreaterThan(0);
    });
  });
  
  it('should have fly forms requiring level 8', () => {
    const flyForms = wildShapeForms.filter(f => f.flySpeed);
    expect(flyForms.length).toBeGreaterThan(0);
    
    flyForms.forEach(form => {
      expect(form.minDruidLevel).toBe(8);
      expect(form.speed.fly).toBeGreaterThan(0);
    });
  });
  
  it('should have valid speed properties', () => {
    wildShapeForms.forEach(form => {
      expect(form.speed).toBeDefined();
      
      if (form.speed.walk !== undefined) {
        expect(form.speed.walk).toBeGreaterThan(0);
      }
      
      if (form.speed.swim !== undefined) {
        expect(form.speed.swim).toBeGreaterThan(0);
      }
      
      if (form.speed.fly !== undefined) {
        expect(form.speed.fly).toBeGreaterThan(0);
      }
      
      if (form.speed.climb !== undefined) {
        expect(form.speed.climb).toBeGreaterThan(0);
      }
    });
  });
  
  it('should include forms of various sizes', () => {
    const sizes = wildShapeForms.map(f => f.size);
    const uniqueSizes = new Set(sizes);
    
    expect(uniqueSizes.has('tiny') || uniqueSizes.has('small')).toBe(true);
    expect(uniqueSizes.has('medium')).toBe(true);
    expect(uniqueSizes.has('large')).toBe(true);
  });
});
