import { describe, it, expect } from 'vitest';
import { wondrousItems } from '../data/dnd/5e-2014/equipment/wondrous-items';

describe('D&D 5e-2014 Wondrous Items', () => {
  it('should have at least 15 wondrous items', () => {
    expect(wondrousItems.length).toBeGreaterThanOrEqual(15);
  });

  it('should have unique IDs', () => {
    const ids = wondrousItems.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should all have valid structure', () => {
    wondrousItems.forEach((item) => {
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.system).toBe('dnd-5e-2014');
      expect(item.source.book).toBe('SRD 5.1');
      expect(item.source.page).toBeGreaterThan(0);
      expect(item.type).toBe('wondrous-item');
      expect(['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact']).toContain(
        item.rarity
      );
      expect(typeof item.requiresAttunement).toBe('boolean');
    });
  });

  it('should have version numbers', () => {
    wondrousItems.forEach((item) => {
      expect(item.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('should include ability score items', () => {
    const abilityItems = ['amulet-of-health', 'gauntlets-of-ogre-power', 'headband-of-intellect'];
    const itemIds = wondrousItems.map((i) => i.id);

    abilityItems.forEach((ability) => {
      expect(itemIds).toContain(ability);
    });
  });

  it('should include utility items', () => {
    const utilityItems = ['bag-of-holding', 'rope-of-climbing', 'immovable-rod'];
    const itemIds = wondrousItems.map((i) => i.id);

    utilityItems.forEach((utility) => {
      expect(itemIds).toContain(utility);
    });
  });

  it('should include protection items', () => {
    const protectionItems = ['cloak-of-protection', 'ring-of-protection'];
    const itemIds = wondrousItems.map((i) => i.id);

    protectionItems.forEach((protection) => {
      expect(itemIds).toContain(protection);
    });
  });

  it('should have charges for wands', () => {
    const wandOfMagicMissiles = wondrousItems.find((i) => i.id === 'wand-of-magic-missiles');
    expect(wandOfMagicMissiles?.charges).toBe(7);

    const wandOfFireballs = wondrousItems.find((i) => i.id === 'wand-of-fireballs');
    expect(wandOfFireballs?.charges).toBe(7);
  });

  it('should have appropriate rarities', () => {
    const bagOfHolding = wondrousItems.find((i) => i.id === 'bag-of-holding');
    expect(bagOfHolding?.rarity).toBe('uncommon');

    const ringOfInvisibility = wondrousItems.find((i) => i.id === 'ring-of-invisibility');
    expect(ringOfInvisibility?.rarity).toBe('legendary');
  });

  it('should have special properties', () => {
    wondrousItems.forEach((item) => {
      if (item.specialProperties) {
        expect(item.specialProperties.length).toBeGreaterThan(0);
      }
    });
  });
});
