import { describe, it, expect } from 'vitest';
import { potions } from '../data/dnd/5e-2014/equipment/potions';

describe('D&D 5e-2014 Potions', () => {
  it('should have at least 10 potions', () => {
    expect(potions.length).toBeGreaterThanOrEqual(10);
  });

  it('should have unique IDs', () => {
    const ids = potions.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should all have valid structure', () => {
    potions.forEach((potion) => {
      expect(potion.id).toMatch(/^[a-z0-9-]+$/);
      expect(potion.name).toBeTruthy();
      expect(potion.description).toBeTruthy();
      expect(potion.system).toBe('dnd-5e-2014');
      expect(potion.source.book).toBe('SRD 5.1');
      expect(potion.source.page).toBeGreaterThan(0);
      expect(potion.type).toBe('potion');
      expect(['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact']).toContain(
        potion.rarity
      );
      expect(potion.requiresAttunement).toBe(false);
      expect(potion.consumable).toBe(true);
      expect(potion.effect).toBeTruthy();
    });
  });

  it('should have version numbers', () => {
    potions.forEach((potion) => {
      expect(potion.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('should include all healing potions', () => {
    const healingPotions = [
      'potion-of-healing',
      'potion-of-greater-healing',
      'potion-of-superior-healing',
      'potion-of-supreme-healing',
    ];
    const potionIds = potions.map((p) => p.id);

    healingPotions.forEach((healing) => {
      expect(potionIds).toContain(healing);
    });
  });

  it('should have correct rarities for healing potions', () => {
    const basic = potions.find((p) => p.id === 'potion-of-healing');
    expect(basic?.rarity).toBe('common');

    const greater = potions.find((p) => p.id === 'potion-of-greater-healing');
    expect(greater?.rarity).toBe('uncommon');

    const superior = potions.find((p) => p.id === 'potion-of-superior-healing');
    expect(superior?.rarity).toBe('rare');

    const supreme = potions.find((p) => p.id === 'potion-of-supreme-healing');
    expect(supreme?.rarity).toBe('very-rare');
  });

  it('should include utility potions', () => {
    const utilityPotions = ['potion-of-invisibility', 'potion-of-flying', 'potion-of-speed'];
    const potionIds = potions.map((p) => p.id);

    utilityPotions.forEach((utility) => {
      expect(potionIds).toContain(utility);
    });
  });

  it('should all be consumable', () => {
    potions.forEach((potion) => {
      expect(potion.consumable).toBe(true);
    });
  });

  it('should not require attunement', () => {
    potions.forEach((potion) => {
      expect(potion.requiresAttunement).toBe(false);
    });
  });

  it('should have effect descriptions', () => {
    potions.forEach((potion) => {
      expect(potion.effect).toBeTruthy();
      expect(potion.effect.length).toBeGreaterThan(0);
    });
  });
});
