/**
 * @deprecated Legacy equipment type family (review M-2). GearItem / DnD35eGear survive only
 * because the 3.5e/PF1e DATA files are authored in this shape; at load time
 * `normalizeLegacyEquipment` (utils/dataLoader.ts) converts every entry to the
 * canonical `Item` family in types/equipment/items.ts. Do NOT type new code or
 * new data against these — use the canonical family.
 */
// Equipment Types - Gear/Adventuring Items
// Base types for gear across all game systems

export interface GearItem {
  id: string;
  name: string;
  system: string;
  source: string;
  category: string;
  cost: string | number;
  weight: number;
  description: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eGear extends GearItem {
  category:
    | 'adventuring'
    | 'tools'
    | 'substances'
    | 'animals'
    | 'services'
    | 'food-lodging'
    | 'clothing'
    | 'transport'
    | 'mount-gear';
  cost: string; // e.g., "2 gp"
}
