import { Item } from '../../../../types/equipment/items';

// Adventuring Gear (Packs)
export const burglarsPack: Item = {
  id: 'burglars-pack',
  name: "Burglar's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 44, // Estimate
  cost: { amount: 16, currency: 'gp' },
  description:
    'Includes a backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days of rations, a tinderbox, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.',
  requiresAttunement: false,
};

export const diplomatsPack: Item = {
  id: 'diplomats-pack',
  name: "Diplomat's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 36, // Estimate
  cost: { amount: 39, currency: 'gp' },
  description:
    'Includes a chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.',
  requiresAttunement: false,
};

export const dungeoneersPack: Item = {
  id: 'dungeoneers-pack',
  name: "Dungeoneer's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 61.5, // Estimate
  cost: { amount: 12, currency: 'gp' },
  description:
    'Includes a backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.',
  requiresAttunement: false,
};

export const entertainersPack: Item = {
  id: 'entertainers-pack',
  name: "Entertainer's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 38, // Estimate
  cost: { amount: 40, currency: 'gp' },
  description:
    'Includes a backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.',
  requiresAttunement: false,
};

export const explorersPack: Item = {
  id: 'explorers-pack',
  name: "Explorer's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 59, // Estimate
  cost: { amount: 10, currency: 'gp' },
  description:
    'Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.',
  requiresAttunement: false,
};

export const priestsPack: Item = {
  id: 'priests-pack',
  name: "Priest's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 24, // Estimate
  cost: { amount: 19, currency: 'gp' },
  description:
    'Includes a backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.',
  requiresAttunement: false,
};

export const scholarsPack: Item = {
  id: 'scholars-pack',
  name: "Scholar's Pack",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 11, // Estimate
  cost: { amount: 40, currency: 'gp' },
  description:
    'Includes a backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.',
  requiresAttunement: false,
};

// Common Gear
export const thievesTools: Item = {
  id: 'thieves-tools',
  name: "Thieves' Tools",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 1,
  cost: { amount: 25, currency: 'gp' },
  description:
    'This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to disarm traps or open locks.',
  requiresAttunement: false,
};

export const herbalismKit: Item = {
  id: 'herbalism-kit',
  name: 'Herbalism Kit',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'gp' },
  description:
    'This kit contains a variety of instruments such as clippers, mortar and pestle, and pouches and vials used by herbalists to create remedies and potions. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to identify or apply herbs. Also, proficiency with this kit is required to create antitoxin and potions of healing.',
  requiresAttunement: false,
};

// Essential Items
export const backpack: Item = {
  id: 'backpack-2024',
  name: 'Backpack',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'gp' },
  description: 'A backpack can hold 1 cubic foot or 30 pounds of gear.',
  requiresAttunement: false,
};

export const bedroll: Item = {
  id: 'bedroll-2024',
  name: 'Bedroll',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 7,
  cost: { amount: 1, currency: 'gp' },
  description: 'A simple sleeping roll.',
  requiresAttunement: false,
};

export const rope: Item = {
  id: 'rope-hempen-2024',
  name: 'Rope, Hempen (50 feet)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 10,
  cost: { amount: 1, currency: 'gp' },
  description: 'Rope has 2 hit points and can be burst with a DC 17 Strength check.',
  requiresAttunement: false,
};

export const torch: Item = {
  id: 'torch-2024',
  name: 'Torch',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'cp' },
  description:
    'A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.',
  requiresAttunement: false,
};

export const rations: Item = {
  id: 'rations-2024',
  name: 'Rations (1 day)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 5, currency: 'sp' },
  description:
    'Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.',
  requiresAttunement: false,
};

export const waterskin: Item = {
  id: 'waterskin-2024',
  name: 'Waterskin',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'sp' },
  description: 'A waterskin can hold 4 pints of liquid.',
  requiresAttunement: false,
};

export const tinderbox: Item = {
  id: 'tinderbox-2024',
  name: 'Tinderbox',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description:
    'This small container holds flint, fire steel, and tinder used to kindle a fire. Lighting a torch takes an action. Lighting any other fire takes 1 minute.',
  requiresAttunement: false,
};

export const lantern: Item = {
  id: 'lantern-hooded-2024',
  name: 'Lantern, Hooded',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A hooded lantern casts bright light in a 30-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask of oil.',
  requiresAttunement: false,
};

export const oil: Item = {
  id: 'oil-flask-2024',
  name: 'Oil (flask)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'sp' },
  description:
    'Oil can be splashed on a creature within 5 feet or thrown up to 20 feet. On a hit, the target is covered in oil. If the target takes fire damage, it takes an additional 5 fire damage from burning oil.',
  requiresAttunement: false,
};

export const crowbar: Item = {
  id: 'crowbar-2024',
  name: 'Crowbar',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'gp' },
  description:
    "Using a crowbar grants advantage to Strength checks where the crowbar's leverage can be applied.",
  requiresAttunement: false,
};

export const hammer: Item = {
  id: 'hammer-2024',
  name: 'Hammer',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 1, currency: 'gp' },
  description: 'A basic hammer for driving pitons and tent stakes.',
  requiresAttunement: false,
};

export const piton: Item = {
  id: 'piton-2024',
  name: 'Piton',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.25,
  cost: { amount: 5, currency: 'cp' },
  description: 'A metal spike used for climbing or securing rope.',
  requiresAttunement: false,
};

export const tent: Item = {
  id: 'tent-2024',
  name: 'Tent, Two-Person',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 20,
  cost: { amount: 2, currency: 'gp' },
  description: 'A simple and portable canvas shelter.',
  requiresAttunement: false,
};

export const pouch: Item = {
  id: 'pouch-2024',
  name: 'Pouch',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description:
    'A cloth or leather pouch can hold up to 20 sling bullets or 50 blowgun needles, among other things.',
  requiresAttunement: false,
};

export const componentPouch: Item = {
  id: 'component-pouch-2024',
  name: 'Component Pouch',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 25, currency: 'gp' },
  description:
    'A component pouch holds all the material components needed to cast spells, except those that have a specific cost.',
  requiresAttunement: false,
};

export const arcaneFocus: Item = {
  id: 'arcane-focus-2024',
  name: 'Arcane Focus',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 10, currency: 'gp' },
  description: 'An arcane focus is a special item designed to channel the power of arcane spells.',
  requiresAttunement: false,
};

export const holySymbol: Item = {
  id: 'holy-symbol-2024',
  name: 'Holy Symbol',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A holy symbol is a representation of a god or pantheon. A cleric or paladin can use a holy symbol as a spellcasting focus.',
  requiresAttunement: false,
};

export const druidicFocus: Item = {
  id: 'druidic-focus-2024',
  name: 'Druidic Focus',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A druidic focus might be a sprig of mistletoe, a wand made of special wood, or a totem object. A druid can use it as a spellcasting focus.',
  requiresAttunement: false,
};

export const healersKit: Item = {
  id: 'healers-kit-2024',
  name: "Healer's Kit",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'gp' },
  description:
    'This kit has ten uses. As an action, you can expend one use to stabilize a creature that has 0 hit points.',
  requiresAttunement: false,
};

export const climbersKit: Item = {
  id: 'climbers-kit-2024',
  name: "Climber's Kit",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 12,
  cost: { amount: 25, currency: 'gp' },
  description:
    'Includes special pitons, boot tips, gloves, and a harness. You can anchor yourself to prevent falling more than 25 feet.',
  requiresAttunement: false,
};

export const messKit: Item = {
  id: 'mess-kit-2024',
  name: 'Mess Kit',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 2, currency: 'sp' },
  description:
    'This tin box contains a cup and simple cutlery. One side can be used as a cooking pan.',
  requiresAttunement: false,
};

export const candle: Item = {
  id: 'candle-2024',
  name: 'Candle',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 1, currency: 'cp' },
  description:
    'For 1 hour, a candle sheds bright light in a 5-foot radius and dim light for an additional 5 feet.',
  requiresAttunement: false,
};

export const chain: Item = {
  id: 'chain-2024',
  name: 'Chain (10 feet)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 10,
  cost: { amount: 5, currency: 'gp' },
  description: 'A chain has 10 hit points. It can be burst with a DC 20 Strength check.',
  requiresAttunement: false,
};

export const lockItem: Item = {
  id: 'lock-2024',
  name: 'Lock',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 10, currency: 'gp' },
  description:
    "A key is provided with the lock. Without the key, the lock can be picked with a DC 15 Dexterity check using thieves' tools.",
  requiresAttunement: false,
};

export const manacles: Item = {
  id: 'manacles-2024',
  name: 'Manacles',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 6,
  cost: { amount: 2, currency: 'gp' },
  description:
    'These metal restraints can bind a Small or Medium creature. Escaping requires a DC 20 Dexterity check. Breaking requires a DC 20 Strength check.',
  requiresAttunement: false,
};

export const mirror: Item = {
  id: 'mirror-steel-2024',
  name: 'Mirror, Steel',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 5, currency: 'gp' },
  description: 'A polished steel mirror.',
  requiresAttunement: false,
};

export const ink: Item = {
  id: 'ink-2024',
  name: 'Ink (1 ounce bottle)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 10, currency: 'gp' },
  description: 'A bottle of black ink.',
  requiresAttunement: false,
};

export const inkPen: Item = {
  id: 'ink-pen-2024',
  name: 'Ink Pen',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.01,
  cost: { amount: 2, currency: 'cp' },
  description: 'A quill for writing.',
  requiresAttunement: false,
};

export const parchment: Item = {
  id: 'parchment-2024',
  name: 'Parchment (one sheet)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.01,
  cost: { amount: 1, currency: 'sp' },
  description: 'A single sheet of parchment.',
  requiresAttunement: false,
};

export const book: Item = {
  id: 'book-2024',
  name: 'Book',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 25, currency: 'gp' },
  description:
    'A book might contain poetry, historical accounts, lore, diagrams, or anything else represented in text or pictures.',
  requiresAttunement: false,
};

export const spellbook: Item = {
  id: 'spellbook-2024',
  name: 'Spellbook',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 3,
  cost: { amount: 50, currency: 'gp' },
  description:
    'Essential for wizards, a spellbook is a leather-bound tome with 100 blank vellum pages suitable for recording spells.',
  requiresAttunement: false,
};

export const blanket: Item = {
  id: 'blanket-2024',
  name: 'Blanket',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'sp' },
  description: 'A warm woolen blanket.',
  requiresAttunement: false,
};

export const chest: Item = {
  id: 'chest-2024',
  name: 'Chest',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 25,
  cost: { amount: 5, currency: 'gp' },
  description: 'A chest can hold 12 cubic feet or 300 pounds of gear.',
  requiresAttunement: false,
};

export const sack: Item = {
  id: 'sack-2024',
  name: 'Sack',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 1, currency: 'cp' },
  description: 'A sack can hold 1 cubic foot or 30 pounds of gear.',
  requiresAttunement: false,
};

export const bottle: Item = {
  id: 'bottle-glass-2024',
  name: 'Bottle, Glass',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 2, currency: 'gp' },
  description: 'A glass bottle can hold 1.5 pints of liquid.',
  requiresAttunement: false,
};

export const vial: Item = {
  id: 'vial-2024',
  name: 'Vial',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 1, currency: 'gp' },
  description: 'A vial can hold 4 ounces of liquid.',
  requiresAttunement: false,
};

export const bell: Item = {
  id: 'bell-2024',
  name: 'Bell',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 1, currency: 'gp' },
  description: 'A small bell that can be attached to items or used as an alarm.',
  requiresAttunement: false,
};

export const soap: Item = {
  id: 'soap-2024',
  name: 'Soap',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 2, currency: 'cp' },
  description: 'A bar of soap for washing.',
  requiresAttunement: false,
};

export const grappling_hook: Item = {
  id: 'grappling-hook-2024',
  name: 'Grappling Hook',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 2, currency: 'gp' },
  description: 'A four-pronged hook used for climbing or grappling.',
  requiresAttunement: false,
};

export const disguiseKit: Item = {
  id: 'disguise-kit-2024',
  name: 'Disguise Kit',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 25, currency: 'gp' },
  description:
    'This pouch of cosmetics, hair dye, and small props lets you create disguises. Proficiency with this kit lets you add your proficiency bonus to checks made to create a visual disguise.',
  requiresAttunement: false,
};

export const poisonersKit: Item = {
  id: 'poisoners-kit-2024',
  name: "Poisoner's Kit",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  type: 'tool',
  rarity: 'common',
  weight: 2,
  cost: { amount: 50, currency: 'gp' },
  description:
    'Includes vials, chemicals, and other equipment necessary for creating poisons. Proficiency with this kit lets you add your proficiency bonus to checks made to craft or use poisons.',
  requiresAttunement: false,
};

export const dnd5e2024Gear: Item[] = [
  // Equipment packs
  burglarsPack,
  diplomatsPack,
  dungeoneersPack,
  entertainersPack,
  explorersPack,
  priestsPack,
  scholarsPack,
  // Essential items
  backpack,
  bedroll,
  rope,
  torch,
  rations,
  waterskin,
  tinderbox,
  lantern,
  oil,
  // Tools
  crowbar,
  hammer,
  piton,
  thievesTools,
  herbalismKit,
  healersKit,
  climbersKit,
  disguiseKit,
  poisonersKit,
  // Containers
  tent,
  pouch,
  chest,
  sack,
  bottle,
  vial,
  // Spellcasting
  componentPouch,
  arcaneFocus,
  holySymbol,
  druidicFocus,
  spellbook,
  // Miscellaneous
  messKit,
  candle,
  chain,
  lockItem,
  manacles,
  mirror,
  ink,
  inkPen,
  parchment,
  book,
  blanket,
  bell,
  soap,
  grappling_hook,
];
