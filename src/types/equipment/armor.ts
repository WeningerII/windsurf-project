/**
 * @deprecated Legacy equipment type family (review M-2). ArmorItem / DnD35eArmor / DnD35eShield survive only
 * because the 3.5e/PF1e DATA files are authored in this shape; at load time
 * `normalizeLegacyEquipment` (utils/dataLoader.ts) converts every entry to the
 * canonical `Item` family in types/equipment/items.ts. Do NOT type new code or
 * new data against these — use the canonical family.
 */
// Equipment Types - Armor & Shields
// Base types for armor across all game systems

export interface ArmorItem {
  id: string;
  name: string;
  system: string;
  source: string;
  type: 'light' | 'medium' | 'heavy' | 'shield';
  armorClass: number | string;
  weight: number;
  cost: string | number;
  description?: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eArmor extends ArmorItem {
  armorClass: number;
  maxDexBonus?: number;
  armorCheckPenalty?: number;
  arcaneSpellFailure?: number;
  speedReduction?: number;
  cost: string; // e.g., "150 gp"
}

export interface DnD35eShield extends ArmorItem {
  type: 'shield';
  armorClassBonus: number;
  armorCheckPenalty?: number;
  arcaneSpellFailure?: number;
  cost: string;
}
