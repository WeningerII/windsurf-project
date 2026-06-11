/**
 * @deprecated Legacy equipment type family (review M-2). WeaponItem / DnD35eWeapon survive only
 * because the 3.5e/PF1e DATA files are authored in this shape; at load time
 * `normalizeLegacyEquipment` (utils/dataLoader.ts) converts every entry to the
 * canonical `Item` family in types/equipment/items.ts. Do NOT type new code or
 * new data against these — use the canonical family.
 */
// Equipment Types - Weapons
// Base types for weapons across all game systems

export interface WeaponItem {
  id: string;
  name: string;
  system: string;
  source: string;
  type: 'melee' | 'ranged' | 'thrown';
  category?: string; // e.g., 'simple', 'martial'
  damage?: string | { dice: string; type: string };
  properties?: string[];
  weight: number;
  cost: string | number;
  description?: string;
}

// System-specific extensions
export interface DnD35eWeapon extends WeaponItem {
  damage: string;
  critical?: string; // e.g., "19-20/×2"
  range?: number;
  damageType?: 'slashing' | 'piercing' | 'bludgeoning';
  cost: string; // e.g., "15 gp"
}
