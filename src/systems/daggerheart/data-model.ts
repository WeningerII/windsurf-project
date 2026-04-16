import { SystemDataModel } from '../../types/core/document';
import type { DaggerheartDomainCardType, DaggerheartDomainId } from '../../types/daggerheart';

export interface DaggerheartDataModel extends SystemDataModel {
  level: number;
  heritage: string;
  community: string;
  class: string;
  subclass: string;
  currency: {
    handfuls: number;
    bags: number;
    chests: number;
  };

  // Daggerheart uses paired attributes (Agility/Strength, Finesse/Instinct, etc.)
  attributes: {
    agility: number;
    strength: number;
    finesse: number;
    instinct: number;
    presence: number;
    knowledge: number;
  };

  // Evasion and Armor Threshold
  evasion: number;
  armorScore: number;
  majorThreshold: number;
  severeThreshold: number;

  // Hit Points and Stress
  hitPoints: { current: number; max: number };
  stress: { current: number; max: number };
  armor: { current: number; max: number };

  // Hope and Fear (Daggerheart's dual-resource mechanic)
  hope: number;

  // Experiences (free-form tags like "Sailor", "Scholar")
  experiences: string[];

  // Inventory
  inventory: Array<{ itemId: string; name: string; quantity: number; description: string }>;

  weapons: {
    primaryId: string;
    secondaryId: string;
    inventoryIds: string[];
  };
  armorId: string;

  // Domain cards
  domainCards: Array<{
    id: string;
    cardId?: string;
    name: string;
    domain: DaggerheartDomainId | string;
    level: number;
    type?: DaggerheartDomainCardType;
    recallCost?: number;
    location?: 'loadout' | 'vault';
    description: string;
  }>;

  notes: string;
}

export const createDefaultDaggerheartData = (): DaggerheartDataModel => ({
  level: 1,
  heritage: '',
  community: '',
  class: '',
  subclass: '',
  currency: {
    handfuls: 0,
    bags: 0,
    chests: 0,
  },
  attributes: {
    agility: 0,
    strength: 0,
    finesse: 0,
    instinct: 0,
    presence: 0,
    knowledge: 0,
  },
  evasion: 0,
  armorScore: 0,
  majorThreshold: 0,
  severeThreshold: 0,
  hitPoints: { current: 6, max: 6 },
  stress: { current: 0, max: 6 },
  armor: { current: 0, max: 0 },
  hope: 2,
  experiences: [],
  inventory: [],
  weapons: {
    primaryId: '',
    secondaryId: '',
    inventoryIds: [],
  },
  armorId: '',
  domainCards: [],
  notes: '',
});
