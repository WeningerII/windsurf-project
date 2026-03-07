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

export interface DnD5eWeapon extends WeaponItem {
  damage: { dice: string; type: string };
  range?: { normal: number; long?: number };
  cost: number; // In gold pieces
}

export interface PathfinderWeapon extends WeaponItem {
  damage: { dice: string; type: string };
  traits?: string[];
  bulk?: number;
}
