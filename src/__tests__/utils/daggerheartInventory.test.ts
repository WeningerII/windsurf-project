import { describe, expect, it } from 'vitest';
import {
  MAX_DAGGERHEART_BAGS,
  MAX_DAGGERHEART_CHESTS,
  MAX_DAGGERHEART_CONSUMABLE_QUANTITY,
  MAX_DAGGERHEART_HANDFULS,
  clampDaggerheartInventoryQuantity,
  createDaggerheartInventoryEntry,
  daggerheartInventoryDefinitions,
  findDaggerheartInventoryDefinitionByName,
  getDaggerheartInventoryDefinition,
  isDaggerheartConsumableDefinition,
  normalizeDaggerheartCurrency,
} from '../../utils/daggerheartInventory';

/**
 * Inventory + currency normalization helpers. Anchored to the real shipped
 * catalog (`daggerheartInventoryDefinitions`) rather than hardcoded ids, and
 * exercises the non-finite guard in `normalizeInteger` through both of its
 * fallbacks (currency → 0, quantity → 1).
 */

const firstConsumable = daggerheartInventoryDefinitions.find(
  (entry) => entry.category === 'consumable'
)!;
const firstLoot = daggerheartInventoryDefinitions.find((entry) => entry.category === 'loot')!;

describe('normalizeDaggerheartCurrency', () => {
  it('carries handfuls into bags and bags into chests', () => {
    expect(normalizeDaggerheartCurrency({ handfuls: 23, bags: 0, chests: 0 })).toEqual({
      handfuls: 3,
      bags: 2,
      chests: 0,
    });
    expect(normalizeDaggerheartCurrency({ handfuls: 0, bags: 12, chests: 0 })).toEqual({
      handfuls: 0,
      bags: 2,
      chests: 1,
    });
  });

  it('caps each denomination at its maximum after carrying', () => {
    // 99 handfuls → 9 carried into bags (108), 9 remainder; 108 bags → 10 carried
    // into chests, 8 remainder; chests floor at the 1-chest hold limit.
    const capped = normalizeDaggerheartCurrency({ handfuls: 99, bags: 99, chests: 99 });
    expect(capped).toEqual({
      handfuls: MAX_DAGGERHEART_HANDFULS,
      bags: 8,
      chests: MAX_DAGGERHEART_CHESTS,
    });
    // Every denomination stays within its declared maximum.
    expect(capped.handfuls).toBeLessThanOrEqual(MAX_DAGGERHEART_HANDFULS);
    expect(capped.bags).toBeLessThanOrEqual(MAX_DAGGERHEART_BAGS);
    expect(capped.chests).toBeLessThanOrEqual(MAX_DAGGERHEART_CHESTS);
  });

  it('treats non-finite and negative inputs as zero (normalizeInteger fallback)', () => {
    expect(
      normalizeDaggerheartCurrency({
        handfuls: Number.NaN,
        bags: Number.POSITIVE_INFINITY,
        chests: -5,
      })
    ).toEqual({ handfuls: 0, bags: 0, chests: 0 });
  });
});

describe('clampDaggerheartInventoryQuantity', () => {
  it('floors any quantity to at least 1, including a non-finite quantity', () => {
    expect(clampDaggerheartInventoryQuantity(firstLoot.id, 0)).toBe(1);
    expect(clampDaggerheartInventoryQuantity(firstLoot.id, -3)).toBe(1);
    // Non-finite → normalizeInteger fallback of 1 → still at least 1.
    expect(clampDaggerheartInventoryQuantity(firstLoot.id, Number.NaN)).toBe(1);
  });

  it('caps consumables at the consumable maximum but leaves loot uncapped', () => {
    expect(clampDaggerheartInventoryQuantity(firstConsumable.id, 99)).toBe(
      MAX_DAGGERHEART_CONSUMABLE_QUANTITY
    );
    expect(clampDaggerheartInventoryQuantity(firstLoot.id, 99)).toBe(99);
  });
});

describe('inventory definition lookup', () => {
  it('resolves a definition by id and by case-insensitive name', () => {
    expect(getDaggerheartInventoryDefinition(firstLoot.id)).toBe(firstLoot);
    expect(getDaggerheartInventoryDefinition('no-such-id')).toBeUndefined();

    expect(findDaggerheartInventoryDefinitionByName(firstLoot.name.toUpperCase())).toBe(firstLoot);
    expect(findDaggerheartInventoryDefinitionByName('no-such-name')).toBeUndefined();
  });

  it('identifies consumable definitions only', () => {
    expect(isDaggerheartConsumableDefinition(firstConsumable)).toBe(true);
    expect(isDaggerheartConsumableDefinition(firstLoot)).toBe(false);
    expect(isDaggerheartConsumableDefinition(undefined)).toBe(false);
  });

  it('creates a quantity-1 inventory entry from a definition', () => {
    expect(createDaggerheartInventoryEntry(firstLoot)).toEqual({
      itemId: firstLoot.id,
      name: firstLoot.name,
      quantity: 1,
      description: '',
    });
  });
});
