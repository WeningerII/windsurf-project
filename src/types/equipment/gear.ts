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

export interface DnD5eGear extends GearItem {
  category: string;
  cost: number; // In copper pieces
}

export interface PathfinderGear extends GearItem {
  category: string;
  bulk?: number; // PF2e uses bulk instead of weight
}
