import { describe, expect, it } from 'vitest';
import { loadEquipmentForSystem } from '../../utils/dataLoader';
describe('legacy equipment normalization (review M-3)', () => {
  // The loaders previously asserted `as Item[]` over 3.5e/PF1e entries with
  // string costs ('2 gp') and non-ItemType types ('melee'), so
  // `item.cost.amount` was undefined at runtime despite green types.
  const ITEM_TYPES = new Set([
    'weapon',
    'armor',
    'shield',
    'consumable',
    'tool',
    'gear',
    'magic-item',
    'treasure',
  ]);

  it.each(['dnd-3.5e', 'pf1e'] as const)(
    'every %s equipment item satisfies the canonical Item shape',
    async (systemId) => {
      const items = await loadEquipmentForSystem(systemId);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(typeof item.cost, item.id).toBe('object');
        expect(Number.isFinite(item.cost.amount), `${item.id} cost.amount`).toBe(true);
        expect(['cp', 'sp', 'gp', 'pp']).toContain(item.cost.currency);
        expect(ITEM_TYPES.has(item.type), `${item.id} type=${item.type}`).toBe(true);
        expect(typeof item.weight, `${item.id} weight`).toBe('number');
      }
    }
  );

  it('parses the dagger price the equipment browser displays', async () => {
    const items = await loadEquipmentForSystem('dnd-3.5e');
    const dagger = items.find((item) => item.id === 'dagger');
    expect(dagger?.cost).toEqual({ amount: 2, currency: 'gp' });
    expect(dagger?.type).toBe('weapon');
  });
});
