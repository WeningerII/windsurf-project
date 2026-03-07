import { Item } from '../../../../types/equipment/items';

// Adventuring Gear - Essential Items
export const backpack: Item = {
  id: 'backpack',
  name: 'Backpack',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'gp' },
  description: 'A backpack can hold 1 cubic foot or 30 pounds of gear.',
  requiresAttunement: false,
};

export const bedroll: Item = {
  id: 'bedroll',
  name: 'Bedroll',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 7,
  cost: { amount: 1, currency: 'gp' },
  description: 'A simple sleeping roll.',
  requiresAttunement: false,
};

export const rope: Item = {
  id: 'rope-hempen',
  name: 'Rope, Hempen (50 feet)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 10,
  cost: { amount: 1, currency: 'gp' },
  description: 'Rope has 2 hit points and can be burst with a DC 17 Strength check.',
  requiresAttunement: false,
};

export const torch: Item = {
  id: 'torch',
  name: 'Torch',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'cp' },
  description:
    'A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.',
  requiresAttunement: false,
};

export const rations: Item = {
  id: 'rations',
  name: 'Rations (1 day)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 5, currency: 'sp' },
  description:
    'Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.',
  requiresAttunement: false,
};

export const waterskin: Item = {
  id: 'waterskin',
  name: 'Waterskin',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'sp' },
  description: 'A waterskin can hold 4 pints of liquid.',
  requiresAttunement: false,
};

export const tinderbox: Item = {
  id: 'tinderbox',
  name: 'Tinderbox',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description:
    'This small container holds flint, fire steel, and tinder (usually dry cloth soaked in light oil) used to kindle a fire. Using it to light a torch—or anything else with abundant, exposed fuel—takes an action. Lighting any other fire takes 1 minute.',
  requiresAttunement: false,
};

export const lantern: Item = {
  id: 'lantern-hooded',
  name: 'Lantern, Hooded',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A hooded lantern casts bright light in a 30-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil. As an action, you can lower the hood, reducing the light to dim light in a 5-foot radius.',
  requiresAttunement: false,
};

export const bullseyeLantern: Item = {
  id: 'lantern-bullseye',
  name: 'Lantern, Bullseye',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 3,
  cost: { amount: 10, currency: 'gp' },
  description:
    'A bullseye lantern casts bright light in a 60-foot cone and dim light for an additional 60 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil.',
  requiresAttunement: false,
};

export const oil: Item = {
  id: 'oil-flask',
  name: 'Oil (flask)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'sp' },
  description:
    'Oil usually comes in a clay flask that holds 1 pint. As an action, you can splash the oil in this flask onto a creature within 5 feet of you or throw it up to 20 feet, shattering it on impact. Make a ranged attack against a target creature or object, treating the oil as an improvised weapon. On a hit, the target is covered in oil. If the target takes any fire damage before the oil dries (after 1 minute), the target takes an additional 5 fire damage from the burning oil.',
  requiresAttunement: false,
};

export const crowbar: Item = {
  id: 'crowbar',
  name: 'Crowbar',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'gp' },
  description:
    "Using a crowbar grants advantage to Strength checks where the crowbar's leverage can be applied.",
  requiresAttunement: false,
};

export const hammer: Item = {
  id: 'hammer',
  name: 'Hammer',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 1, currency: 'gp' },
  description: 'A basic hammer for driving pitons and tent stakes.',
  requiresAttunement: false,
};

export const piton: Item = {
  id: 'piton',
  name: 'Piton',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.25,
  cost: { amount: 5, currency: 'cp' },
  description: 'A metal spike used for climbing or securing rope.',
  requiresAttunement: false,
};

export const grappling_hook: Item = {
  id: 'grappling-hook',
  name: 'Grappling Hook',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 2, currency: 'gp' },
  description: 'A four-pronged hook used for climbing or grappling.',
  requiresAttunement: false,
};

export const tent: Item = {
  id: 'tent',
  name: 'Tent, Two-Person',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 20,
  cost: { amount: 2, currency: 'gp' },
  description: 'A simple and portable canvas shelter.',
  requiresAttunement: false,
};

export const blanket: Item = {
  id: 'blanket',
  name: 'Blanket',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'sp' },
  description: 'A warm woolen blanket.',
  requiresAttunement: false,
};

export const pouch: Item = {
  id: 'pouch',
  name: 'Pouch',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description:
    'A cloth or leather pouch can hold up to 20 sling bullets or 50 blowgun needles, among other things. A compartmentalized pouch for holding spell components is called a component pouch.',
  requiresAttunement: false,
};

export const componentPouch: Item = {
  id: 'component-pouch',
  name: 'Component Pouch',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 25, currency: 'gp' },
  description:
    'A component pouch is a small, watertight leather belt pouch that has compartments to hold all the material components and other special items you need to cast your spells, except for those components that have a specific cost.',
  requiresAttunement: false,
};

export const arcaneFocus: Item = {
  id: 'arcane-focus',
  name: 'Arcane Focus',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 10, currency: 'gp' },
  description:
    'An arcane focus is a special item designed to channel the power of arcane spells. A sorcerer, warlock, or wizard can use such an item as a spellcasting focus.',
  requiresAttunement: false,
};

export const holySymbol: Item = {
  id: 'holy-symbol',
  name: 'Holy Symbol',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A holy symbol is a representation of a god or pantheon. A cleric or paladin can use a holy symbol as a spellcasting focus. To use the symbol in this way, the caster must hold it in hand, wear it visibly, or bear it on a shield.',
  requiresAttunement: false,
};

export const druidicFocus: Item = {
  id: 'druidic-focus',
  name: 'Druidic Focus',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A druidic focus might be a sprig of mistletoe or holly, a wand or scepter made of yew or another special wood, a staff drawn whole out of a living tree, or a totem object incorporating feathers, fur, bones, and teeth from sacred animals. A druid can use such an object as a spellcasting focus.',
  requiresAttunement: false,
};

export const healersKit: Item = {
  id: 'healers-kit',
  name: "Healer's Kit",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'gp' },
  description:
    'This kit is a leather pouch containing bandages, salves, and splints. The kit has ten uses. As an action, you can expend one use of the kit to stabilize a creature that has 0 hit points, without needing to make a Wisdom (Medicine) check.',
  requiresAttunement: false,
};

export const climbers_kit: Item = {
  id: 'climbers-kit',
  name: "Climber's Kit",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 12,
  cost: { amount: 25, currency: 'gp' },
  description:
    "A climber's kit includes special pitons, boot tips, gloves, and a harness. You can use the climber's kit as an action to anchor yourself; when you do, you can't fall more than 25 feet from the point where you anchored yourself, and you can't climb more than 25 feet away from that point without undoing the anchor.",
  requiresAttunement: false,
};

export const messKit: Item = {
  id: 'mess-kit',
  name: 'Mess Kit',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 2, currency: 'sp' },
  description:
    'This tin box contains a cup and simple cutlery. The box clamps together, and one side can be used as a cooking pan and the other as a plate or shallow bowl.',
  requiresAttunement: false,
};

export const flaskOrTankard: Item = {
  id: 'flask-or-tankard',
  name: 'Flask or Tankard',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 2, currency: 'cp' },
  description: 'A simple drinking vessel.',
  requiresAttunement: false,
};

export const jug: Item = {
  id: 'jug',
  name: 'Jug or Pitcher',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 2, currency: 'cp' },
  description: 'A jug can hold 1 gallon of liquid.',
  requiresAttunement: false,
};

export const pot: Item = {
  id: 'pot-iron',
  name: 'Pot, Iron',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 10,
  cost: { amount: 2, currency: 'gp' },
  description: 'An iron pot for cooking.',
  requiresAttunement: false,
};

export const bucket: Item = {
  id: 'bucket',
  name: 'Bucket',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 5, currency: 'cp' },
  description: 'A bucket can hold 3 gallons of liquid or 1/2 cubic foot of solids.',
  requiresAttunement: false,
};

export const chest: Item = {
  id: 'chest',
  name: 'Chest',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 25,
  cost: { amount: 5, currency: 'gp' },
  description: 'A chest can hold 12 cubic feet or 300 pounds of gear.',
  requiresAttunement: false,
};

export const sack: Item = {
  id: 'sack',
  name: 'Sack',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 1, currency: 'cp' },
  description: 'A sack can hold 1 cubic foot or 30 pounds of gear.',
  requiresAttunement: false,
};

export const barrel: Item = {
  id: 'barrel',
  name: 'Barrel',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 70,
  cost: { amount: 2, currency: 'gp' },
  description: 'A barrel can hold 40 gallons of liquid or 4 cubic feet of solids.',
  requiresAttunement: false,
};

export const basket: Item = {
  id: 'basket',
  name: 'Basket',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 4, currency: 'sp' },
  description: 'A basket can hold 2 cubic feet or 40 pounds of gear.',
  requiresAttunement: false,
};

export const bottle: Item = {
  id: 'bottle-glass',
  name: 'Bottle, Glass',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 2, currency: 'gp' },
  description: 'A glass bottle can hold 1.5 pints of liquid.',
  requiresAttunement: false,
};

export const vial: Item = {
  id: 'vial',
  name: 'Vial',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 1, currency: 'gp' },
  description: 'A vial can hold 4 ounces of liquid.',
  requiresAttunement: false,
};

export const candle: Item = {
  id: 'candle',
  name: 'Candle',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 1, currency: 'cp' },
  description:
    'For 1 hour, a candle sheds bright light in a 5-foot radius and dim light for an additional 5 feet.',
  requiresAttunement: false,
};

export const chain: Item = {
  id: 'chain',
  name: 'Chain (10 feet)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 10,
  cost: { amount: 5, currency: 'gp' },
  description: 'A chain has 10 hit points. It can be burst with a successful DC 20 Strength check.',
  requiresAttunement: false,
};

export const lockItem: Item = {
  id: 'lock',
  name: 'Lock',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 10, currency: 'gp' },
  description:
    "A key is provided with the lock. Without the key, a creature proficient with thieves' tools can pick this lock with a successful DC 15 Dexterity check.",
  requiresAttunement: false,
};

export const manacles: Item = {
  id: 'manacles',
  name: 'Manacles',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 6,
  cost: { amount: 2, currency: 'gp' },
  description:
    'These metal restraints can bind a Small or Medium creature. Escaping the manacles requires a successful DC 20 Dexterity check. Breaking them requires a successful DC 20 Strength check. Each set of manacles comes with one key.',
  requiresAttunement: false,
};

export const mirror: Item = {
  id: 'mirror-steel',
  name: 'Mirror, Steel',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 5, currency: 'gp' },
  description: 'A polished steel mirror.',
  requiresAttunement: false,
};

export const paper: Item = {
  id: 'paper',
  name: 'Paper (one sheet)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.01,
  cost: { amount: 2, currency: 'sp' },
  description: 'A single sheet of paper.',
  requiresAttunement: false,
};

export const parchment: Item = {
  id: 'parchment',
  name: 'Parchment (one sheet)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.01,
  cost: { amount: 1, currency: 'sp' },
  description: 'A single sheet of parchment.',
  requiresAttunement: false,
};

export const ink: Item = {
  id: 'ink',
  name: 'Ink (1 ounce bottle)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 10, currency: 'gp' },
  description: 'A bottle of black ink.',
  requiresAttunement: false,
};

export const inkPen: Item = {
  id: 'ink-pen',
  name: 'Ink Pen',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.01,
  cost: { amount: 2, currency: 'cp' },
  description: 'A quill for writing.',
  requiresAttunement: false,
};

export const book: Item = {
  id: 'book',
  name: 'Book',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 25, currency: 'gp' },
  description:
    'A book might contain poetry, historical accounts, information pertaining to a particular field of lore, diagrams and notes on gnomish contraptions, or just about anything else that can be represented using text or pictures.',
  requiresAttunement: false,
};

export const spellbook: Item = {
  id: 'spellbook',
  name: 'Spellbook',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 3,
  cost: { amount: 50, currency: 'gp' },
  description:
    'Essential for wizards, a spellbook is a leather-bound tome with 100 blank vellum pages suitable for recording spells.',
  requiresAttunement: false,
};

export const map: Item = {
  id: 'map-scroll-case',
  name: 'Map or Scroll Case',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'gp' },
  description:
    'This cylindrical leather case can hold up to ten rolled-up sheets of paper or five rolled-up sheets of parchment.',
  requiresAttunement: false,
};

export const bell: Item = {
  id: 'bell',
  name: 'Bell',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 1, currency: 'gp' },
  description: 'A small bell that can be attached to items or used as an alarm.',
  requiresAttunement: false,
};

export const signalWhistle: Item = {
  id: 'signal-whistle',
  name: 'Signal Whistle',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 5, currency: 'cp' },
  description: 'A whistle for signaling.',
  requiresAttunement: false,
};

export const soap: Item = {
  id: 'soap',
  name: 'Soap',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.1,
  cost: { amount: 2, currency: 'cp' },
  description: 'A bar of soap for washing.',
  requiresAttunement: false,
};

export const spyglass: Item = {
  id: 'spyglass',
  name: 'Spyglass',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1000, currency: 'gp' },
  description: 'Objects viewed through a spyglass are magnified to twice their size.',
  requiresAttunement: false,
};

export const thieves_tools: Item = {
  id: 'thieves-tools',
  name: "Thieves' Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 1,
  cost: { amount: 25, currency: 'gp' },
  description:
    'This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to disarm traps or open locks.',
  requiresAttunement: false,
};

export const ammunition_arrows: Item = {
  id: 'arrows',
  name: 'Arrows (20)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'gp' },
  description: 'Ammunition for bows.',
  requiresAttunement: false,
};

export const ammunition_bolts: Item = {
  id: 'crossbow-bolts',
  name: 'Crossbow Bolts (20)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1.5,
  cost: { amount: 1, currency: 'gp' },
  description: 'Ammunition for crossbows.',
  requiresAttunement: false,
};

export const quiver: Item = {
  id: 'quiver',
  name: 'Quiver',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'gp' },
  description: 'A quiver can hold up to 20 arrows.',
  requiresAttunement: false,
};

export const slingBullets: Item = {
  id: 'sling-bullets',
  name: 'Sling Bullets (20)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1.5,
  cost: { amount: 4, currency: 'cp' },
  description: 'Ammunition for slings.',
  requiresAttunement: false,
};

export const blowgunNeedles: Item = {
  id: 'blowgun-needles',
  name: 'Blowgun Needles (50)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'gp' },
  description: 'Ammunition for blowguns.',
  requiresAttunement: false,
};

export const abacus: Item = {
  id: 'abacus',
  name: 'Abacus',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 2,
  cost: { amount: 2, currency: 'gp' },
  description: 'A calculating tool using beads on rods.',
  requiresAttunement: false,
};

export const acidVial: Item = {
  id: 'acid-vial',
  name: 'Acid (vial)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 25, currency: 'gp' },
  description:
    'As an action, you can splash the contents of this vial onto a creature within 5 feet of you or throw the vial up to 20 feet, shattering it on impact. Make a ranged attack against a creature or object, treating the acid as an improvised weapon. On a hit, the target takes 2d6 acid damage.',
  requiresAttunement: false,
};

export const alchemistsFire: Item = {
  id: 'alchemists-fire',
  name: "Alchemist's Fire (flask)",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 50, currency: 'gp' },
  description:
    "This sticky, adhesive fluid ignites when exposed to air. As an action, you can throw this flask up to 20 feet, shattering it on impact. Make a ranged attack against a creature or object, treating the alchemist's fire as an improvised weapon. On a hit, the target takes 1d4 fire damage at the start of each of its turns. A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames.",
  requiresAttunement: false,
};

export const antiToxin: Item = {
  id: 'antitoxin',
  name: 'Antitoxin (vial)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 50, currency: 'gp' },
  description:
    'A creature that drinks this vial of liquid gains advantage on saving throws against poison for 1 hour. It confers no benefit to undead or constructs.',
  requiresAttunement: false,
};

export const ballBearings: Item = {
  id: 'ball-bearings',
  name: 'Ball Bearings (bag of 1,000)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 1, currency: 'gp' },
  description:
    'As an action, you can spill these tiny metal balls from their pouch to cover a level, square area that is 10 feet on a side. A creature moving across the covered area must succeed on a DC 10 Dexterity saving throw or fall prone.',
  requiresAttunement: false,
};

export const blockAndTackle: Item = {
  id: 'block-and-tackle',
  name: 'Block and Tackle',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 1, currency: 'gp' },
  description:
    'A set of pulleys with a cable threaded through them and a hook to attach to objects, a block and tackle allows you to hoist up to four times the weight you can normally lift.',
  requiresAttunement: false,
};

export const caltrops: Item = {
  id: 'caltrops',
  name: 'Caltrops (bag of 20)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 2,
  cost: { amount: 1, currency: 'gp' },
  description:
    "As an action, you can spread a bag of caltrops to cover a square area that is 5 feet on a side. Any creature that enters the area must succeed on a DC 15 Dexterity saving throw or stop moving this turn and take 1 piercing damage. Taking this damage reduces the creature's walking speed by 10 feet until the creature regains at least 1 hit point.",
  requiresAttunement: false,
};

export const caseForCrossbowBolts: Item = {
  id: 'case-crossbow-bolts',
  name: 'Case, Crossbow Bolt',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'gp' },
  description: 'This wooden case can hold up to twenty crossbow bolts.',
  requiresAttunement: false,
};

export const caseForMapsOrScrolls: Item = {
  id: 'case-map-scroll',
  name: 'Case, Map or Scroll',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'gp' },
  description:
    'This cylindrical leather case can hold up to ten rolled-up sheets of paper or five rolled-up sheets of parchment.',
  requiresAttunement: false,
};

export const chalk: Item = {
  id: 'chalk',
  name: 'Chalk (1 piece)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 1, currency: 'cp' },
  description: 'A piece of chalk for marking surfaces.',
  requiresAttunement: false,
};

export const clothesCommon: Item = {
  id: 'clothes-common',
  name: 'Clothes, Common',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'sp' },
  description: 'Typical everyday clothing.',
  requiresAttunement: false,
};

export const clothesCostume: Item = {
  id: 'clothes-costume',
  name: 'Clothes, Costume',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 5, currency: 'gp' },
  description: 'Elaborate costume clothing for performances.',
  requiresAttunement: false,
};

export const clothesFine: Item = {
  id: 'clothes-fine',
  name: 'Clothes, Fine',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 6,
  cost: { amount: 15, currency: 'gp' },
  description: 'High-quality clothing for nobility or wealthy individuals.',
  requiresAttunement: false,
};

export const clothesTravelers: Item = {
  id: 'clothes-travelers',
  name: "Clothes, Traveler's",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 2, currency: 'gp' },
  description: 'Practical clothing designed for travel.',
  requiresAttunement: false,
};

export const fishingTackle: Item = {
  id: 'fishing-tackle',
  name: 'Fishing Tackle',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 4,
  cost: { amount: 1, currency: 'gp' },
  description:
    'This kit includes a wooden rod, silken line, corkwood bobbers, steel hooks, lead sinkers, velvet lures, and narrow netting.',
  requiresAttunement: false,
};

export const grapplingHook: Item = {
  id: 'grappling-hook-item',
  name: 'Grappling Hook',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 2, currency: 'gp' },
  description: 'A metal hook with multiple prongs, used with rope for climbing.',
  requiresAttunement: false,
};

export const holyWater: Item = {
  id: 'holy-water',
  name: 'Holy Water (flask)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 25, currency: 'gp' },
  description:
    'As an action, you can splash the contents of this flask onto a creature within 5 feet of you or throw it up to 20 feet, shattering it on impact. Make a ranged attack against a target creature, treating the holy water as an improvised weapon. If the target is a fiend or undead, it takes 2d6 radiant damage.',
  requiresAttunement: false,
};

export const hourglass: Item = {
  id: 'hourglass',
  name: 'Hourglass',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 25, currency: 'gp' },
  description: 'A glass container for measuring time.',
  requiresAttunement: false,
};

export const huntingTrap: Item = {
  id: 'hunting-trap',
  name: 'Hunting Trap',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 25,
  cost: { amount: 5, currency: 'gp' },
  description:
    'When you use your action to set it, this trap forms a saw-toothed steel ring that snaps shut when a creature steps on a pressure plate in the center. The trap is affixed by a heavy chain to an immobile object. A creature that steps on the plate must succeed on a DC 13 Dexterity saving throw or take 1d4 piercing damage and stop moving.',
  requiresAttunement: false,
};

export const ladder: Item = {
  id: 'ladder',
  name: 'Ladder (10-foot)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 25,
  cost: { amount: 1, currency: 'sp' },
  description: 'A wooden ladder for climbing.',
  requiresAttunement: false,
};

export const lamp: Item = {
  id: 'lamp',
  name: 'Lamp',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description:
    'A lamp casts bright light in a 15-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil.',
  requiresAttunement: false,
};

export const magnifyingGlass: Item = {
  id: 'magnifying-glass',
  name: 'Magnifying Glass',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 100, currency: 'gp' },
  description:
    'This lens allows a closer look at small objects. It is also useful as a substitute for flint and steel when starting fires. Lighting a fire with a magnifying glass requires light as bright as sunlight to focus, tinder to ignite, and about 5 minutes for the fire to ignite.',
  requiresAttunement: false,
};

export const merchantsScale: Item = {
  id: 'merchants-scale',
  name: "Merchant's Scale",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'gp' },
  description:
    'A scale includes a small balance, pans, and a suitable assortment of weights up to 2 pounds. With it, you can measure the exact weight of small objects, such as raw precious metals or trade goods, to help determine their worth.',
  requiresAttunement: false,
};

export const perfume: Item = {
  id: 'perfume',
  name: 'Perfume (vial)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 5, currency: 'gp' },
  description: 'A vial of fragrant liquid.',
  requiresAttunement: false,
};

export const pickMiners: Item = {
  id: 'pick-miners',
  name: "Pick, Miner's",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 10,
  cost: { amount: 2, currency: 'gp' },
  description: "A miner's pick for excavating stone and ore.",
  requiresAttunement: false,
};

export const pole: Item = {
  id: 'pole',
  name: 'Pole (10-foot)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 7,
  cost: { amount: 5, currency: 'cp' },
  description: 'A long wooden pole for probing ahead.',
  requiresAttunement: false,
};

export const poisonBasic: Item = {
  id: 'poison-basic',
  name: 'Poison, Basic (vial)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 100, currency: 'gp' },
  description:
    'You can use the poison in this vial to coat one slashing or piercing weapon or up to three pieces of ammunition. Applying the poison takes an action. A creature hit by the poisoned weapon or ammunition must make a DC 10 Constitution saving throw or take 1d4 poison damage. Once applied, the poison retains potency for 1 minute before drying.',
  requiresAttunement: false,
};

export const potionOfHealing: Item = {
  id: 'potion-of-healing',
  name: 'Potion of Healing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 50, currency: 'gp' },
  description:
    'A character who drinks the magical red fluid in this vial regains 2d4 + 2 hit points. Drinking or administering a potion takes an action.',
  requiresAttunement: false,
};

export const ram: Item = {
  id: 'ram-portable',
  name: 'Ram, Portable',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 35,
  cost: { amount: 4, currency: 'gp' },
  description:
    'You can use a portable ram to break down doors. When doing so, you gain a +4 bonus on the Strength check. One other character can help you use the ram, giving you advantage on this check.',
  requiresAttunement: false,
};

export const robes: Item = {
  id: 'robes',
  name: 'Robes',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 4,
  cost: { amount: 1, currency: 'gp' },
  description: 'Simple robes suitable for wizards or priests.',
  requiresAttunement: false,
};

export const ropeSilk: Item = {
  id: 'rope-silk',
  name: 'Rope, Silk (50 feet)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 10, currency: 'gp' },
  description:
    'Rope made from silk, lighter and stronger than hemp rope. Has 2 hit points and can be burst with a DC 17 Strength check.',
  requiresAttunement: false,
};

export const scale: Item = {
  id: 'scale-merchants',
  name: "Scale, Merchant's",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'gp' },
  description: 'A scale for weighing goods and materials.',
  requiresAttunement: false,
};

export const sealingWax: Item = {
  id: 'sealing-wax',
  name: 'Sealing Wax',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 5, currency: 'sp' },
  description: 'Wax for sealing letters and documents.',
  requiresAttunement: false,
};

export const shovel: Item = {
  id: 'shovel',
  name: 'Shovel',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 2, currency: 'gp' },
  description: 'A tool for digging.',
  requiresAttunement: false,
};

export const signetRing: Item = {
  id: 'signet-ring',
  name: 'Signet Ring',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 5, currency: 'gp' },
  description: 'A ring bearing a family crest or personal symbol, used to seal documents.',
  requiresAttunement: false,
};

export const sledgehammer: Item = {
  id: 'sledgehammer',
  name: 'Sledgehammer',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 10,
  cost: { amount: 2, currency: 'gp' },
  description: 'A heavy hammer for breaking objects.',
  requiresAttunement: false,
};

export const spikes: Item = {
  id: 'spikes-iron',
  name: 'Spikes, Iron (10)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 5,
  cost: { amount: 1, currency: 'gp' },
  description: 'Iron spikes for securing rope or blocking doors.',
  requiresAttunement: false,
};

export const telescope: Item = {
  id: 'telescope',
  name: 'Telescope',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1000, currency: 'gp' },
  description: 'Objects viewed through a telescope are magnified to twice their size.',
  requiresAttunement: false,
};

export const tinderBox: Item = {
  id: 'tinder-box',
  name: 'Tinderbox',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 1,
  cost: { amount: 5, currency: 'sp' },
  description:
    'This small container holds flint, fire steel, and tinder (usually dry cloth soaked in light oil) used to kindle a fire. Using it to light a torch—or anything else with abundant, exposed fuel—takes an action. Lighting any other fire takes 1 minute.',
  requiresAttunement: false,
};

export const twoPersonTent: Item = {
  id: 'tent-two-person',
  name: 'Tent, Two-Person',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 20,
  cost: { amount: 2, currency: 'gp' },
  description: 'A simple and portable canvas shelter.',
  requiresAttunement: false,
};

export const whetstone: Item = {
  id: 'whetstone',
  name: 'Whetstone',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 1,
  cost: { amount: 1, currency: 'cp' },
  description: 'A stone for sharpening blades.',
  requiresAttunement: false,
};

// Equipment Packs
export const burglarsPack: Item = {
  id: 'burglars-pack',
  name: "Burglar's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 16, currency: 'gp' },
  description:
    'Includes a backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.',
  requiresAttunement: false,
};

export const diplomatsPack: Item = {
  id: 'diplomats-pack',
  name: "Diplomat's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 39, currency: 'gp' },
  description:
    'Includes a chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.',
  requiresAttunement: false,
};

export const dungeoneersPack: Item = {
  id: 'dungeoneers-pack',
  name: "Dungeoneer's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 12, currency: 'gp' },
  description:
    'Includes a backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.',
  requiresAttunement: false,
};

export const entertainersPack: Item = {
  id: 'entertainers-pack',
  name: "Entertainer's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 40, currency: 'gp' },
  description:
    'Includes a backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.',
  requiresAttunement: false,
};

export const explorersPack: Item = {
  id: 'explorers-pack',
  name: "Explorer's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 10, currency: 'gp' },
  description:
    'Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.',
  requiresAttunement: false,
};

export const priestsPack: Item = {
  id: 'priests-pack',
  name: "Priest's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 19, currency: 'gp' },
  description:
    'Includes a backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.',
  requiresAttunement: false,
};

export const scholarsPack: Item = {
  id: 'scholars-pack',
  name: "Scholar's Pack",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'gear',
  rarity: 'common',
  weight: 0,
  cost: { amount: 40, currency: 'gp' },
  description:
    'Includes a backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.',
  requiresAttunement: false,
};

// Artisan's Tools
export const alchemistsSupplies: Item = {
  id: 'alchemists-supplies',
  name: "Alchemist's Supplies",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 8,
  cost: { amount: 50, currency: 'gp' },
  description:
    "These special tools include the items needed to pursue a craft or trade. Proficiency with a set of artisan's tools lets you add your proficiency bonus to any ability checks you make using the tools in your craft.",
  requiresAttunement: false,
};

export const brewersSupplies: Item = {
  id: 'brewers-supplies',
  name: "Brewer's Supplies",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 9,
  cost: { amount: 20, currency: 'gp' },
  description: 'Supplies for brewing beer and ale.',
  requiresAttunement: false,
};

export const calligraphersSupplies: Item = {
  id: 'calligraphers-supplies',
  name: "Calligrapher's Supplies",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 10, currency: 'gp' },
  description: 'Supplies for fine writing and illumination.',
  requiresAttunement: false,
};

export const carpentersTools: Item = {
  id: 'carpenters-tools',
  name: "Carpenter's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 6,
  cost: { amount: 8, currency: 'gp' },
  description: 'Tools for woodworking.',
  requiresAttunement: false,
};

export const cartographersTools: Item = {
  id: 'cartographers-tools',
  name: "Cartographer's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 6,
  cost: { amount: 15, currency: 'gp' },
  description: 'Tools for map making.',
  requiresAttunement: false,
};

export const cobblersTools: Item = {
  id: 'cobblers-tools',
  name: "Cobbler's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 5, currency: 'gp' },
  description: 'Tools for shoe making and repair.',
  requiresAttunement: false,
};

export const cooksUtensils: Item = {
  id: 'cooks-utensils',
  name: "Cook's Utensils",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 8,
  cost: { amount: 1, currency: 'gp' },
  description: 'Utensils and tools for cooking.',
  requiresAttunement: false,
};

export const glassblowersTools: Item = {
  id: 'glassblowers-tools',
  name: "Glassblower's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 30, currency: 'gp' },
  description: 'Tools for shaping glass.',
  requiresAttunement: false,
};

export const jewelersTools: Item = {
  id: 'jewelers-tools',
  name: "Jeweler's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 2,
  cost: { amount: 25, currency: 'gp' },
  description: 'Tools for crafting jewelry.',
  requiresAttunement: false,
};

export const leatherworkersTools: Item = {
  id: 'leatherworkers-tools',
  name: "Leatherworker's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 5, currency: 'gp' },
  description: 'Tools for working with leather.',
  requiresAttunement: false,
};

export const masonsTools: Item = {
  id: 'masons-tools',
  name: "Mason's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 8,
  cost: { amount: 10, currency: 'gp' },
  description: 'Tools for stonework.',
  requiresAttunement: false,
};

export const paintersSupplies: Item = {
  id: 'painters-supplies',
  name: "Painter's Supplies",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 10, currency: 'gp' },
  description: 'Supplies for painting.',
  requiresAttunement: false,
};

export const pottersTools: Item = {
  id: 'potters-tools',
  name: "Potter's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 10, currency: 'gp' },
  description: 'Tools for pottery.',
  requiresAttunement: false,
};

export const smithsTools: Item = {
  id: 'smiths-tools',
  name: "Smith's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 8,
  cost: { amount: 20, currency: 'gp' },
  description: 'Tools for metalworking.',
  requiresAttunement: false,
};

export const tinkersTools: Item = {
  id: 'tinkers-tools',
  name: "Tinker's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 10,
  cost: { amount: 50, currency: 'gp' },
  description: 'Tools for repairing and creating small mechanical devices.',
  requiresAttunement: false,
};

export const weaversTools: Item = {
  id: 'weavers-tools',
  name: "Weaver's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 1, currency: 'gp' },
  description: 'Tools for weaving cloth.',
  requiresAttunement: false,
};

export const woodcarversTools: Item = {
  id: 'woodcarvers-tools',
  name: "Woodcarver's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 1, currency: 'gp' },
  description: 'Tools for carving wood.',
  requiresAttunement: false,
};

export const disguiseKit: Item = {
  id: 'disguise-kit',
  name: 'Disguise Kit',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 25, currency: 'gp' },
  description:
    'This pouch of cosmetics, hair dye, and small props lets you create disguises that change your physical appearance. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to create a visual disguise.',
  requiresAttunement: false,
};

export const forgeryKit: Item = {
  id: 'forgery-kit',
  name: 'Forgery Kit',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 5,
  cost: { amount: 15, currency: 'gp' },
  description:
    'This small box contains a variety of papers and parchments, pens and inks, seals and sealing wax, gold and silver leaf, and other supplies necessary to create convincing forgeries of physical documents.',
  requiresAttunement: false,
};

export const herbalismKit: Item = {
  id: 'herbalism-kit',
  name: 'Herbalism Kit',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 3,
  cost: { amount: 5, currency: 'gp' },
  description:
    'This kit contains a variety of instruments such as clippers, mortar and pestle, and pouches and vials used by herbalists to create remedies and potions.',
  requiresAttunement: false,
};

export const navigatorsTools: Item = {
  id: 'navigators-tools',
  name: "Navigator's Tools",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 2,
  cost: { amount: 25, currency: 'gp' },
  description:
    "This set of instruments is used for navigation at sea. Proficiency with navigator's tools lets you chart a ship's course and follow navigation charts.",
  requiresAttunement: false,
};

export const poisonersKit: Item = {
  id: 'poisoners-kit',
  name: "Poisoner's Kit",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'tool',
  rarity: 'common',
  weight: 2,
  cost: { amount: 50, currency: 'gp' },
  description:
    "A poisoner's kit includes the vials, chemicals, and other equipment necessary for the creation of poisons. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to craft or use poisons.",
  requiresAttunement: false,
};

export const dnd5eAdventuringGear: Item[] = [
  // Basic adventuring gear
  backpack,
  bedroll,
  rope,
  ropeSilk,
  torch,
  rations,
  waterskin,
  tinderbox,
  tinderBox,
  lantern,
  lamp,
  bullseyeLantern,
  oil,
  crowbar,
  hammer,
  piton,
  grappling_hook,
  grapplingHook,
  tent,
  twoPersonTent,
  blanket,
  pouch,
  componentPouch,
  arcaneFocus,
  holySymbol,
  druidicFocus,
  healersKit,
  climbers_kit,
  messKit,
  flaskOrTankard,
  jug,
  pot,
  bucket,
  chest,
  sack,
  barrel,
  basket,
  bottle,
  vial,
  candle,
  chain,
  lockItem,
  manacles,
  mirror,
  paper,
  parchment,
  ink,
  inkPen,
  book,
  spellbook,
  map,
  bell,
  signalWhistle,
  soap,
  spyglass,
  telescope,
  thieves_tools,
  // Ammunition
  ammunition_arrows,
  ammunition_bolts,
  quiver,
  slingBullets,
  blowgunNeedles,
  // Tools and supplies
  abacus,
  fishingTackle,
  merchantsScale,
  scale,
  whetstone,
  shovel,
  sledgehammer,
  pickMiners,
  pole,
  ladder,
  robes,
  // Combat items
  acidVial,
  alchemistsFire,
  antiToxin,
  holyWater,
  poisonBasic,
  potionOfHealing,
  // Utility items
  ballBearings,
  blockAndTackle,
  caltrops,
  caseForCrossbowBolts,
  caseForMapsOrScrolls,
  chalk,
  hourglass,
  huntingTrap,
  magnifyingGlass,
  perfume,
  ram,
  sealingWax,
  signetRing,
  spikes,
  // Clothing
  clothesCommon,
  clothesCostume,
  clothesFine,
  clothesTravelers,
  // Equipment packs
  burglarsPack,
  diplomatsPack,
  dungeoneersPack,
  entertainersPack,
  explorersPack,
  priestsPack,
  scholarsPack,
  // Artisan's tools
  alchemistsSupplies,
  brewersSupplies,
  calligraphersSupplies,
  carpentersTools,
  cartographersTools,
  cobblersTools,
  cooksUtensils,
  glassblowersTools,
  jewelersTools,
  leatherworkersTools,
  masonsTools,
  paintersSupplies,
  pottersTools,
  smithsTools,
  tinkersTools,
  weaversTools,
  woodcarversTools,
  // Specialist kits
  disguiseKit,
  forgeryKit,
  herbalismKit,
  navigatorsTools,
  poisonersKit,
];
