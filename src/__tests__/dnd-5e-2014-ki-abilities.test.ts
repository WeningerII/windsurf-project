import { describe, it, expect } from 'vitest';
import { monkKiAbilities } from '../data/dnd/5e-2014/class-features/monk/ki-abilities';

describe('D&D 5e-2014 Monk Ki Abilities', () => {
  it('should have exactly 9 ki abilities', () => {
    expect(monkKiAbilities).toHaveLength(9);
  });
  
  it('should have unique IDs', () => {
    const ids = monkKiAbilities.map(k => k.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  it('should all have valid structure', () => {
    monkKiAbilities.forEach(ability => {
      expect(ability.id).toMatch(/^[a-z0-9-]+$/);
      expect(ability.name).toBeTruthy();
      expect(ability.description).toBeTruthy();
      expect(ability.system).toBe('dnd-5e-2014');
      expect(ability.kiCost).toBeGreaterThanOrEqual(0);
      expect(ability.minLevel).toBeGreaterThan(0);
      expect(['action', 'bonus', 'reaction', 'passive']).toContain(ability.actionType);
      expect(Array.isArray(ability.effects)).toBe(true);
      expect(ability.effects.length).toBeGreaterThan(0);
    });
  });
  
  it('should all reference SRD 5.1', () => {
    monkKiAbilities.forEach(ability => {
      expect(ability.source.book).toBe('SRD 5.1');
      expect(ability.source.page).toBeGreaterThan(0);
    });
  });
  
  it('should have version numbers', () => {
    monkKiAbilities.forEach(ability => {
      expect(ability.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
  
  it('should include core ki abilities', () => {
    const coreAbilities = [
      'flurry-of-blows',
      'patient-defense',
      'step-of-the-wind',
      'stunning-strike',
      'ki-empowered-strikes',
    ];
    
    const abilityIds = monkKiAbilities.map(a => a.id);
    coreAbilities.forEach(core => {
      expect(abilityIds).toContain(core);
    });
  });
  
  it('should have appropriate minimum levels', () => {
    const flurry = monkKiAbilities.find(a => a.id === 'flurry-of-blows');
    expect(flurry?.minLevel).toBe(2);
    
    const stunning = monkKiAbilities.find(a => a.id === 'stunning-strike');
    expect(stunning?.minLevel).toBe(5);
    
    const diamond = monkKiAbilities.find(a => a.id === 'diamond-soul');
    expect(diamond?.minLevel).toBe(14);
  });
});
