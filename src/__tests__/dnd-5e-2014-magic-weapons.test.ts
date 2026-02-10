import { describe, it, expect } from 'vitest';
import { magicWeapons } from '../data/dnd/5e-2014/equipment/magic-weapons';

describe('D&D 5e-2014 Magic Weapons', () => {
  it('should have at least 10 magic weapons', () => {
    expect(magicWeapons.length).toBeGreaterThanOrEqual(10);
  });
  
  it('should have unique IDs', () => {
    const ids = magicWeapons.map(w => w.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  it('should all have valid structure', () => {
    magicWeapons.forEach(weapon => {
      expect(weapon.id).toMatch(/^[a-z0-9-]+$/);
      expect(weapon.name).toBeTruthy();
      expect(weapon.description).toBeTruthy();
      expect(weapon.system).toBe('dnd-5e-2014');
      expect(weapon.source.book).toBe('SRD 5.1');
      expect(weapon.source.page).toBeGreaterThan(0);
      expect(weapon.type).toBe('weapon');
      expect(['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact']).toContain(weapon.rarity);
      expect(typeof weapon.requiresAttunement).toBe('boolean');
      expect(weapon.weaponType).toBeTruthy();
    });
  });
  
  it('should have version numbers', () => {
    magicWeapons.forEach(weapon => {
      expect(weapon.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
  
  it('should include +1, +2, +3 weapons', () => {
    const plusWeapons = ['weapon-plus-1', 'weapon-plus-2', 'weapon-plus-3'];
    const weaponIds = magicWeapons.map(w => w.id);
    
    plusWeapons.forEach(plus => {
      expect(weaponIds).toContain(plus);
    });
  });
  
  it('should have correct bonuses for +X weapons', () => {
    const plus1 = magicWeapons.find(w => w.id === 'weapon-plus-1');
    expect(plus1?.bonusToHit).toBe(1);
    expect(plus1?.bonusToDamage).toBe(1);
    
    const plus2 = magicWeapons.find(w => w.id === 'weapon-plus-2');
    expect(plus2?.bonusToHit).toBe(2);
    expect(plus2?.bonusToDamage).toBe(2);
    
    const plus3 = magicWeapons.find(w => w.id === 'weapon-plus-3');
    expect(plus3?.bonusToHit).toBe(3);
    expect(plus3?.bonusToDamage).toBe(3);
  });
  
  it('should include special named weapons', () => {
    const specialWeapons = ['flame-tongue', 'javelin-of-lightning', 'dagger-of-venom'];
    const weaponIds = magicWeapons.map(w => w.id);
    
    specialWeapons.forEach(special => {
      expect(weaponIds).toContain(special);
    });
  });
  
  it('should have appropriate rarities', () => {
    const plus1 = magicWeapons.find(w => w.id === 'weapon-plus-1');
    expect(plus1?.rarity).toBe('uncommon');
    
    const plus2 = magicWeapons.find(w => w.id === 'weapon-plus-2');
    expect(plus2?.rarity).toBe('rare');
    
    const plus3 = magicWeapons.find(w => w.id === 'weapon-plus-3');
    expect(plus3?.rarity).toBe('very-rare');
  });
  
  it('should have special properties when appropriate', () => {
    const flameTongue = magicWeapons.find(w => w.id === 'flame-tongue');
    expect(flameTongue?.specialProperties).toBeDefined();
    expect(flameTongue?.specialProperties?.length).toBeGreaterThan(0);
  });
});
