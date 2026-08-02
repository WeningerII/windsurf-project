import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
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

describe('non-coin legacy prices survive normalization', () => {
  // The 3.5e catalog prices 8 of its entries as a rate or a qualifier rather
  // than an amount of coin. `cost` cannot hold either, and the placeholder
  // `{0, 'gp'}` it falls back to is indistinguishable downstream from a
  // legitimately free item — so the string is kept on `costText` here, where
  // it is still in hand, and that is what the browser prints.
  const NON_COIN = [
    { id: 'barding-medium', name: 'Barding, Medium Creature', costText: 'Varies' },
    { id: 'barding-large', name: 'Barding, Large Creature', costText: 'Varies' },
    { id: 'saddle-exotic', name: 'Saddle, Exotic', costText: 'Varies' },
    { id: 'coach-hire', name: 'Coach Hire', costText: '3 cp/mile' },
    { id: 'hireling-untrained', name: 'Hireling, Untrained', costText: '1 sp/day' },
    { id: 'hireling-trained', name: 'Hireling, Trained', costText: '3 sp/day' },
    { id: 'messenger', name: 'Messenger', costText: '2 cp/mile' },
    { id: 'ship-passage', name: 'Ship Passage', costText: '1 sp/mile' },
  ] as const;

  it.each(NON_COIN)('keeps $name priced at "$costText"', async ({ id, name, costText }) => {
    const items = await loadEquipmentForSystem('dnd-3.5e');
    const item = items.find((candidate) => candidate.id === id);
    expect(item, `${id} is no longer in the 3.5e catalog`).toBeDefined();
    expect(item?.name, `${id} was renamed`).toBe(name);
    expect(item?.costText, `${id} lost its non-coin price`).toBe(costText);
    // The placeholder stays so the arithmetic consumers keep their shape; it
    // is `costText` that makes it readable AS a placeholder rather than a zero.
    expect(item?.cost).toEqual({ amount: 0, currency: 'gp' });
  });

  it('marks those 8 and no others across the two legacy catalogs', async () => {
    for (const systemId of ['dnd-3.5e', 'pf1e'] as const) {
      const items = await loadEquipmentForSystem(systemId);
      const marked = items.filter((item) => item.costText !== undefined).map((item) => item.id);
      const expected = systemId === 'dnd-3.5e' ? NON_COIN.map((entry) => entry.id) : [];
      expect(marked.sort(), `${systemId} costText set`).toEqual([...expected].sort());
    }
  });

  it('never sets costText for a price the coin parser understood', async () => {
    const items = await loadEquipmentForSystem('dnd-3.5e');
    for (const item of items) {
      if (item.costText === undefined) continue;
      expect(item.costText, `${item.id} costText`).not.toMatch(/^[\d,.]+\s*(cp|sp|gp|pp)$/i);
    }
  });
});

describe('5e-2014 equipment consolidation (review M-2)', () => {
  it('serves a single object per id — no dual-identity entries', async () => {
    const items = await loadEquipmentForSystem('dnd-5e-2014');
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('formerly-dead category magic items are product-reachable', async () => {
    const items = await loadEquipmentForSystem('dnd-5e-2014');
    const byId = new Map(items.map((item) => [item.id, item]));
    // These lived only in the ad-hoc category files (never loaded) before
    // the consolidation folded them into the canonical equipment union.
    expect(byId.get('weapon-plus-1')?.type).toBe('magic-item');
    expect(byId.get('headband-of-intellect')?.type).toBe('magic-item');
    expect(byId.get('potion-of-heroism')?.type).toBe('consumable');
    // A duplicated id resolves to the canonical (family A) copy.
    expect(byId.get('bag-of-holding')?.cost).toEqual({ amount: 0, currency: 'gp' });
  });
});

describe('pf1e SRD equipment merge (encode-pf1e-equipment.mjs)', () => {
  it('lands the SRD denominator in the loader set with unique ids', async () => {
    const items = await loadEquipmentForSystem('pf1e');
    // The Core Rulebook denominator is 243 Equipment + 347 Magic Items = 590
    // unique SRD ids; hand-authored-only ids can only add to that.
    expect(items.length).toBeGreaterThanOrEqual(590);
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size, 'no duplicate ids in the merged pf1e set').toBe(ids.length);
    // SRD-only entries the hand-authored sample never carried.
    expect(ids).toContain('axe-orc-double'); // SRD martial weapon
    expect(ids).toContain('shield-tower'); // SRD shield
    expect(ids).toContain('rope-of-entanglement'); // SRD magic item
  });

  it('keeps hand-authored entries winning on id collision with the SRD', async () => {
    const items = await loadEquipmentForSystem('pf1e');
    const byId = new Map(items.map((item) => [item.id, item]));
    // Both 'club' and 'dagger' also exist in the SRD weapons bucket; the
    // curated hand-authored description must survive the merge (spread last).
    expect(byId.get('club')?.description).toBe('A simple wooden club.');
    expect(byId.get('dagger')?.description).toBe(
      'A small blade useful for both melee and ranged attacks.'
    );
  });

  it('splits the pinned manifest into the 243 / 347 coverage denominators', async () => {
    // vitest runs from the repo root, so the manifest resolves off cwd.
    const manifest = JSON.parse(
      await readFile(resolve('scripts/data/pf1e-equipment-manifest.json'), 'utf8')
    ) as { entries: Array<{ scope: string }> };
    expect(manifest.entries.filter((entry) => entry.scope === 'equipment').length).toBe(243);
    expect(manifest.entries.filter((entry) => entry.scope === 'magic').length).toBe(347);
  });
});
