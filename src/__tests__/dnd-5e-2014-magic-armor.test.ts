import { describe, it, expect } from 'vitest';
import { magicArmor } from '../data/dnd/5e-2014/equipment/magic-armor';

describe('D&D 5e-2014 Magic Armor', () => {
  it('should have at least 12 magic armor pieces', () => {
    expect(magicArmor.length).toBeGreaterThanOrEqual(12);
  });

  it('should have unique IDs', () => {
    const ids = magicArmor.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should all have valid structure', () => {
    magicArmor.forEach((armor) => {
      expect(armor.id).toMatch(/^[a-z0-9-]+$/);
      expect(armor.name).toBeTruthy();
      expect(armor.description).toBeTruthy();
      expect(armor.system).toBe('dnd-5e-2014');
      expect(armor.source.book).toBe('SRD 5.1');
      expect(armor.source.page).toBeGreaterThan(0);
      expect(armor.type).toBe('armor');
      expect(['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact']).toContain(
        armor.rarity
      );
      expect(typeof armor.requiresAttunement).toBe('boolean');
      expect(armor.armorType).toBeTruthy();
    });
  });

  it('should have version numbers', () => {
    magicArmor.forEach((armor) => {
      expect(armor.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('should include +1, +2, +3 armor', () => {
    const plusArmor = ['armor-plus-1', 'armor-plus-2', 'armor-plus-3'];
    const armorIds = magicArmor.map((a) => a.id);

    plusArmor.forEach((plus) => {
      expect(armorIds).toContain(plus);
    });
  });

  it('should include +1, +2, +3 shields', () => {
    const plusShields = ['shield-plus-1', 'shield-plus-2', 'shield-plus-3'];
    const armorIds = magicArmor.map((a) => a.id);

    plusShields.forEach((plus) => {
      expect(armorIds).toContain(plus);
    });
  });

  it('should have correct bonuses for +X armor', () => {
    const plus1 = magicArmor.find((a) => a.id === 'armor-plus-1');
    expect(plus1?.bonusToAC).toBe(1);

    const plus2 = magicArmor.find((a) => a.id === 'armor-plus-2');
    expect(plus2?.bonusToAC).toBe(2);

    const plus3 = magicArmor.find((a) => a.id === 'armor-plus-3');
    expect(plus3?.bonusToAC).toBe(3);
  });

  it('should include special named armor', () => {
    const specialArmor = ['mithral-armor', 'adamantine-armor', 'dragon-scale-mail'];
    const armorIds = magicArmor.map((a) => a.id);

    specialArmor.forEach((special) => {
      expect(armorIds).toContain(special);
    });
  });

  it('should have appropriate rarities', () => {
    const plus1Armor = magicArmor.find((a) => a.id === 'armor-plus-1');
    expect(plus1Armor?.rarity).toBe('rare');

    const plus1Shield = magicArmor.find((a) => a.id === 'shield-plus-1');
    expect(plus1Shield?.rarity).toBe('uncommon');

    const mithral = magicArmor.find((a) => a.id === 'mithral-armor');
    expect(mithral?.rarity).toBe('uncommon');
  });

  it('should have special properties when appropriate', () => {
    const resistance = magicArmor.find((a) => a.id === 'armor-of-resistance');
    expect(resistance?.specialProperties).toBeDefined();
    expect(resistance?.specialProperties?.length).toBeGreaterThan(0);
  });
});
