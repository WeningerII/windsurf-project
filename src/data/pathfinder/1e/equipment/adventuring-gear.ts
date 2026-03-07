import { Item } from '../../../../types/equipment/items';

export const backpack: Item = {
  id: 'backpack',
  name: 'Backpack',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 2, currency: 'gp' },
  description: 'A leather pack with straps for carrying equipment.',
  requiresAttunement: false,
};

export const bedroll: Item = {
  id: 'bedroll',
  name: 'Bedroll',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 1, currency: 'sp' },
  description: 'A simple bedroll for sleeping outdoors.',
  requiresAttunement: false,
};

export const rope50ft: Item = {
  id: 'rope-50ft',
  name: 'Rope (50 ft.)',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 10,
  cost: { amount: 1, currency: 'gp' },
  description: 'Hemp rope, 50 feet long.',
  requiresAttunement: false,
};

export const torch: Item = {
  id: 'torch',
  name: 'Torch',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'cp' },
  description: 'A wooden torch that burns for 1 hour.',
  requiresAttunement: false,
};

export const rations: Item = {
  id: 'rations',
  name: 'Trail Rations (1 day)',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description: 'Dried food suitable for extended travel.',
  requiresAttunement: false,
};

export const waterskin: Item = {
  id: 'waterskin',
  name: 'Waterskin',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 1, currency: 'gp' },
  description: 'A leather pouch for carrying water.',
  requiresAttunement: false,
};

export const thievesTools: Item = {
  id: 'thieves-tools',
  name: "Thieves' Tools",
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'tool',
  rarity: 'common',
  weight: 1,
  cost: { amount: 30, currency: 'gp' },
  description: 'Picks and tools for disabling locks and traps.',
  requiresAttunement: false,
};

export const healersKit: Item = {
  id: 'healers-kit',
  name: "Healer's Kit",
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'tool',
  rarity: 'common',
  weight: 1,
  cost: { amount: 50, currency: 'gp' },
  description: 'A kit containing bandages and herbs for treating wounds.',
  requiresAttunement: false,
};

export const holySymbol: Item = {
  id: 'holy-symbol',
  name: 'Holy Symbol',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 25, currency: 'gp' },
  description: 'A religious symbol used as a divine focus.',
  requiresAttunement: false,
};

export const spellComponentPouch: Item = {
  id: 'spell-component-pouch',
  name: 'Spell Component Pouch',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 5, currency: 'gp' },
  description: 'A pouch containing common spell components.',
  requiresAttunement: false,
};

export const pf1eGear = {
  backpack,
  bedroll,
  rope50ft,
  torch,
  rations,
  waterskin,
  thievesTools,
  healersKit,
  holySymbol,
  spellComponentPouch,
};
