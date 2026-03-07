// Equipment Types - Magic Items
// Base types for magic items across all game systems

export interface MagicItem {
  id: string;
  name: string;
  system: string;
  source: string;
  type: string; // e.g., 'weapon', 'armor', 'wondrous', 'potion', 'scroll'
  rarity: string;
  requiresAttunement?: boolean;
  description: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eMagicItem extends MagicItem {
  casterLevel: number;
  aura?: string; // e.g., "faint evocation"
  price: string; // e.g., "2,000 gp"
  weight?: number;
}

export interface DnD5eMagicItem extends MagicItem {
  rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary' | 'artifact';
  requiresAttunement?: boolean;
  attunementRequirements?: string; // e.g., "by a spellcaster"
}

export interface PathfinderMagicItem extends MagicItem {
  level: number;
  price: string;
  bulk?: number;
  usage?: string; // e.g., "worn", "held in 1 hand"
  activate?: string; // Activation requirements
  traits?: string[];
}
