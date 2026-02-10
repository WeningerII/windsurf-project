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
  cost: string;  // e.g., "150 gp"
}

export interface DnD35eShield extends ArmorItem {
  type: 'shield';
  armorClassBonus: number;
  armorCheckPenalty?: number;
  arcaneSpellFailure?: number;
  cost: string;
}

export interface DnD5eArmor extends ArmorItem {
  armorClass: number | string;  // Can be "11 + Dex modifier"
  stealthDisadvantage?: boolean;
  strengthRequirement?: number;
  cost: number;  // In gold pieces
}

export interface PathfinderArmor extends ArmorItem {
  armorClass: number;
  dexCap?: number;
  checkPenalty?: number;
  speedPenalty?: number;
  strength?: number;  // Strength requirement
  bulk?: number;
  traits?: string[];
}
