export type DaggerheartTrait =
  | 'agility'
  | 'strength'
  | 'finesse'
  | 'instinct'
  | 'presence'
  | 'knowledge';

export type DaggerheartTier = 1 | 2 | 3 | 4;

export type DaggerheartRange = 'Melee' | 'Very Close' | 'Close' | 'Far' | 'Very Far';

export type DaggerheartDamageType = 'physical' | 'magic' | 'physical-or-magic';

export type DaggerheartWeaponCategory = 'primary' | 'secondary';
export type DaggerheartInventoryCategory = 'loot' | 'consumable';

export type DaggerheartDomainId =
  | 'arcana'
  | 'blade'
  | 'bone'
  | 'codex'
  | 'grace'
  | 'midnight'
  | 'sage'
  | 'splendor'
  | 'valor';

export type DaggerheartDomainCardType = 'ability' | 'spell' | 'grimoire';
export type DaggerheartAutomationMode = 'passive' | 'triggered-manual' | 'reference-only';

export type DaggerheartPassiveCondition =
  | { kind: 'always' }
  | { kind: 'while-armored' }
  | { kind: 'while-unarmored' }
  | { kind: 'loadout-domain-count-at-least'; domain: DaggerheartDomainId; count: number };

export type DaggerheartPassiveDerivedBonus =
  | { kind: 'evasion-half-trait'; trait: DaggerheartTrait }
  | { kind: 'severe-threshold-proficiency' }
  | {
      kind: 'unarmored-defense-by-tier';
      armorScoreBase: number;
      trait: DaggerheartTrait;
      thresholdsByTier: Record<DaggerheartTier, { major: number; severe: number }>;
    };

export interface DaggerheartPassiveBonuses {
  evasion?: number;
  armorScore?: number;
  majorThreshold?: number;
  severeThreshold?: number;
  spellcast?: number;
  attributes?: Partial<Record<DaggerheartTrait, number>>;
}

export interface DaggerheartFeature {
  id: string;
  name: string;
  description: string;
}

export interface DaggerheartSubclass {
  id: string;
  name: string;
  description: string;
  spellcastTrait?: DaggerheartTrait;
  foundationFeatures: DaggerheartFeature[];
  specializationFeatures: DaggerheartFeature[];
  masteryFeatures: DaggerheartFeature[];
}

export interface DaggerheartClass {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  description: string;
  /**
   * Canonical lowercase domain ids — display names come from the domain
   * record (daggerheartDomainsById), not from this tuple.
   */
  domains: [DaggerheartDomainId, DaggerheartDomainId];
  startingEvasion: number;
  startingHitPoints: number;
  classItems: [string, string];
  hopeFeature: DaggerheartFeature;
  classFeatures: DaggerheartFeature[];
  subclasses: [DaggerheartSubclass, DaggerheartSubclass];
}

export interface DaggerheartAncestry {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  description: string;
  features: [DaggerheartFeature, DaggerheartFeature];
}

export interface DaggerheartCommunity {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  description: string;
  adjectives: string[];
  feature: DaggerheartFeature;
}

export interface DaggerheartDomain {
  id: DaggerheartDomainId;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  description: string;
  classIds: string[];
}

export interface DaggerheartDomainCard {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  domain: DaggerheartDomainId;
  level: number;
  type: DaggerheartDomainCardType;
  recallCost: number;
  description: string;
  automationMode?: DaggerheartAutomationMode;
  passiveBonuses?: DaggerheartPassiveBonuses;
  passiveDerivedBonuses?: DaggerheartPassiveDerivedBonus[];
  passiveCondition?: DaggerheartPassiveCondition;
  effectTags?: string[];
  automationNote?: string;
}

export interface DaggerheartWeapon {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  category: DaggerheartWeaponCategory;
  tier: DaggerheartTier;
  trait: DaggerheartTrait | 'spellcast';
  range: DaggerheartRange;
  damage: string;
  damageType: DaggerheartDamageType;
  burden: 1 | 2;
  feature?: string;
  requiresSpellcast?: boolean;
  passiveBonuses?: DaggerheartPassiveBonuses;
  tags?: string[];
}

export interface DaggerheartArmor {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  tier: DaggerheartTier;
  baseMajorThreshold: number;
  baseSevereThreshold: number;
  baseArmorScore: number;
  feature?: string;
  passiveBonuses?: DaggerheartPassiveBonuses;
}

interface DaggerheartInventoryDefinitionBase {
  id: string;
  name: string;
  system: 'daggerheart';
  source: string;
  version: '1.0';
  lastUpdated: string;
  sourceBook: {
    name: string;
    url: string;
  };
  description: string;
  tags?: string[];
  passiveBonuses?: DaggerheartPassiveBonuses;
}

export interface DaggerheartLoot extends DaggerheartInventoryDefinitionBase {
  category: 'loot';
}

export interface DaggerheartConsumable extends DaggerheartInventoryDefinitionBase {
  category: 'consumable';
  maxQuantity: 5;
}

export type DaggerheartInventoryDefinition = DaggerheartLoot | DaggerheartConsumable;
