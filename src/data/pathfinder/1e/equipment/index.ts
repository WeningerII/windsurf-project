// Pathfinder 1e Equipment Index.
//
// Merges the GENERATED SRD buckets (scripts/encode-pf1e-equipment.mjs, from the
// devonjones/PSRD-Data Core Rulebook — Open Game Content) with the hand-authored
// baseline. The hand-written entry ALWAYS WINS on id collision: the id-keyed
// records spread the curated entries last, and the magic-item array dedupes with
// the hand-written entry taking precedence — so curated descriptions/stats
// survive. The merged aggregate names (`pf1eWeapons`, `pf1eArmor`, `pf1eGear`,
// `pf1eMagicItems`) are exactly what `loadPf1eEquipment` (src/utils/dataLoader)
// and systemCatalogMetadata read, so no loader change is required.
import type { Item, Weapon, Armor, Shield, MagicItem } from '../../../../types/equipment/items';
import { pf1eWeapons as handWeapons } from './weapons';
import { pf1eArmor as handArmor } from './armor';
import { pf1eGear as handGear } from './adventuring-gear';
import { pf1eMagicItems as handMagicItems } from './magic-items';
import { pf1eSrdWeapons } from './srd-weapons';
import { pf1eSrdArmor } from './srd-armor';
import { pf1eSrdGear } from './srd-gear';
import { pf1eSrdMagicItems } from './srd-magic-items';

/**
 * Re-key a name-keyed record (hand-authored buckets use camelCase const names as
 * keys) by each entry's canonical `id`, so a hand-written entry overrides the SRD
 * entry with the SAME id. The SRD buckets are already id-keyed; without this
 * re-key the differing keys would not collide and Object.values() would yield
 * two items sharing one id.
 */
function byId<T extends { id: string }>(record: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const entry of Object.values(record)) out[entry.id] = entry;
  return out;
}

export const pf1eWeapons: Record<string, Weapon | Item> = {
  ...pf1eSrdWeapons,
  ...byId(handWeapons),
};

export const pf1eArmor: Record<string, Armor | Shield | Item> = {
  ...pf1eSrdArmor,
  ...byId(handArmor),
};

export const pf1eGear: Record<string, Item> = {
  ...pf1eSrdGear,
  ...byId(handGear),
};

// Magic items ship as an ARRAY (the loader/catalog contract). Concatenate SRD +
// hand-written, deduped by id with the hand-written entry winning.
const magicById = new Map<string, MagicItem>();
for (const item of pf1eSrdMagicItems) magicById.set(item.id, item);
for (const item of handMagicItems) magicById.set(item.id, item);
export const pf1eMagicItems: MagicItem[] = [...magicById.values()];
