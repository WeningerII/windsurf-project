/**
 * Component Prop Type Definitions
 * 
 * Centralized prop interfaces for reusability across components
 */

import { Character, GameSystem } from '../game-systems';
import { Monster } from '../creatures/monsters';

export interface CharacterSheetProps {
  character: Character;
  gameSystem: GameSystem;
  onUpdate: (character: Character) => void;
}

export interface SpellDisplay {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  classes: string[];
}

export interface SpellBrowserProps {
  spells: SpellDisplay[];
  onSelectSpell?: (spell: SpellDisplay) => void;
}

export interface MonsterBrowserProps {
  monsters: Monster[];
  onSelectMonster?: (monster: Monster) => void;
}

export interface FeatDisplay {
  id: string;
  name: string;
  system: string;
  source: string;
  description: string;
  benefits?: string[];
  prerequisites?: Array<{
    type: string;
    description: string;
  }>;
}

export interface FeatBrowserProps {
  feats: FeatDisplay[];
  onSelectFeat?: (feat: FeatDisplay) => void;
}

export interface EquipmentDisplay {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: string;
  weight: number;
  description: string;
  properties: string[];
}

export interface EquipmentBrowserProps {
  equipment: EquipmentDisplay[];
  onSelectEquipment?: (equipment: EquipmentDisplay) => void;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  value: string;
  description?: string;
}

export interface InventoryManagerProps {
  items: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}
