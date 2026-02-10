// Canonical type definitions for game systems
export type GameSystemId = 'dnd-5e-2014' | 'dnd-5e-2024' | 'dnd-3.5e' | 'pf1e' | 'pf2e' | 'mam3e';

export interface GameSystem {
  id: GameSystemId;
  name: string;
  fullName: string;
  version: string;
  attributes: Attribute[];
  skills?: Skill[];
  proficiencies?: string[];
  features?: string[];
}

export interface Attribute {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  attribute: string;
  description?: string;
}

// Re-export Character and related types from the canonical source
export type {
  Character,
  ClassLevel,
  ProficiencyLevel,
  SkillProficiency,
  HitPoints,
  HitDice,
  Feature,
  FeatureUses,
  Feat,
  SpellcastingInfo,
  SpellcastingClass,
  SpellSlots,
  EquippedItem,
  EquipmentSlot,
  InventoryItem,
  Currency,
  PersonalityInfo,
} from './core/character';
