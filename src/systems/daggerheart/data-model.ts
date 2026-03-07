/**
 * Daggerheart Data Model
 *
 * Minimal scaffold implementing the Daggerheart TTRPG system.
 * This demonstrates how to add a new system to the registry.
 */

import { SystemDataModel } from '../../types/core/document';

export interface DaggerheartDataModel extends SystemDataModel {
  level: number;
  heritage: string;
  community: string;
  class: string;
  subclass: string;

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

  // Domain cards (simplified)
  domainCards: Array<{
    id: string;
    name: string;
    domain: string;
    level: number;
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
  domainCards: [],
  notes: '',
});
