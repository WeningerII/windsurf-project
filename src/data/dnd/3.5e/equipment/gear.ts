/**
 * D&D 3.5e - Adventuring Gear, Tools, and Equipment
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 3.5 - Equipment Section
 * License: OGL v1.0a
 */

import { DnD35eGear } from '../../../../types/equipment';

// ADVENTURING GEAR - Essential items for adventurers
export const adventuringGear: DnD35eGear[] = [
  { id: 'barrel', name: 'Barrel', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 gp', weight: 30, description: 'Wooden barrel holding 40 gallons.' },
  { id: 'basket', name: 'Basket', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '4 sp', weight: 1, description: 'Wicker basket for carrying items.' },
  { id: 'bell', name: 'Bell', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 0, description: 'Small metal bell for alarms.' },
  { id: 'case-map-scroll', name: 'Case, Map or Scroll', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 0.5, description: 'Leather case for maps or scrolls.' },
  { id: 'backpack', name: 'Backpack', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 gp', weight: 2, description: 'A leather pack holding about 2 cubic feet.' },
  { id: 'bedroll', name: 'Bedroll', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 sp', weight: 5, description: 'Bedding and blanket for sleeping.' },
  { id: 'blanket', name: 'Blanket (winter)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 sp', weight: 3, description: 'Thick quilted blanket for warmth.' },
  { id: 'block-tackle', name: 'Block and Tackle', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 gp', weight: 5, description: 'Pulleys allowing you to hoist 5x normal weight.' },
  { id: 'bottle-glass', name: 'Bottle, Glass', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 gp', weight: 1, description: 'Glass bottle holding 1 pint.' },
  { id: 'bucket', name: 'Bucket', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 sp', weight: 2, description: 'Wooden pail holding 1 gallon.' },
  { id: 'caltrops', name: 'Caltrops', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 2, description: 'Sharp spikes to slow pursuers. Covers 5-foot square.' },
  { id: 'candle', name: 'Candle', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 cp', weight: 0, description: 'Provides light in 5-foot radius for 1 hour.' },
  { id: 'chain', name: 'Chain (10 ft.)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '30 gp', weight: 2, description: '10-foot iron chain. Hardness 10, 5 hp.' },
  { id: 'chalk', name: 'Chalk', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 cp', weight: 0, description: 'For writing on stone surfaces.' },
  { id: 'chest', name: 'Chest', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 gp', weight: 25, description: 'Wooden chest holding 12 cubic feet.' },
  { id: 'crowbar', name: 'Crowbar', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 gp', weight: 5, description: '+2 bonus on Strength checks to force doors.' },
  { id: 'flint-steel', name: 'Flint and Steel', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 0, description: 'Creates sparks to light fire (full-round action).' },
  { id: 'grappling-hook', name: 'Grappling Hook', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 4, description: 'Four-pronged iron hook for climbing.' },
  { id: 'hammer', name: 'Hammer', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 sp', weight: 2, description: 'Tool hammer for driving pitons.' },
  { id: 'ink', name: 'Ink (1 oz. vial)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '8 gp', weight: 0, description: 'Black writing ink.' },
  { id: 'inkpen', name: 'Inkpen', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 sp', weight: 0, description: 'Wooden or reed pen for writing.' },
  { id: 'jug-clay', name: 'Jug, Clay', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '3 cp', weight: 9, description: 'Clay container holding 1 gallon.' },
  { id: 'ladder', name: 'Ladder (10 ft.)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 cp', weight: 20, description: '10-foot wooden ladder.' },
  { id: 'lamp-common', name: 'Lamp, Common', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 sp', weight: 1, description: 'Light in 15-foot radius for 6 hours on 1 pint oil.' },
  { id: 'lantern-bullseye', name: 'Lantern, Bullseye', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '12 gp', weight: 3, description: 'Bright light in 60-foot cone for 6 hours.' },
  { id: 'lantern-hooded', name: 'Lantern, Hooded', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '7 gp', weight: 2, description: 'Light in 30-foot radius for 6 hours. Has shutters.' },
  { id: 'lock-simple', name: 'Lock, Simple', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '20 gp', weight: 1, description: 'Basic lock. DC 20 to pick.' },
  { id: 'lock-average', name: 'Lock, Average', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '40 gp', weight: 1, description: 'Moderate lock. DC 25 to pick.' },
  { id: 'lock-good', name: 'Lock, Good', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '80 gp', weight: 1, description: 'Quality lock. DC 30 to pick.' },
  { id: 'lock-amazing', name: 'Lock, Amazing', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '150 gp', weight: 1, description: 'Masterwork lock. DC 40 to pick.' },
  { id: 'manacles', name: 'Manacles', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '15 gp', weight: 2, description: 'Iron restraints. DC 30 to break/escape.' },
  { id: 'manacles-mw', name: 'Manacles, Masterwork', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '50 gp', weight: 2, description: 'Superior restraints. DC 35 to break/escape.' },
  { id: 'mirror-steel', name: 'Mirror, Small Steel', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '10 gp', weight: 0.5, description: 'Polished steel mirror.' },
  { id: 'oil', name: 'Oil (1-pint flask)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 sp', weight: 1, description: 'Lamp oil. Also usable as thrown weapon (1d6 fire).' },
  { id: 'paper', name: 'Paper (sheet)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '4 sp', weight: 0, description: 'Single sheet of writing paper.' },
  { id: 'parchment', name: 'Parchment (sheet)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 sp', weight: 0, description: 'Single sheet of parchment.' },
  { id: 'pick-miners', name: "Pick, Miner's", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '3 gp', weight: 10, description: 'Heavy pick for breaking rock.' },
  { id: 'piton', name: 'Piton', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 sp', weight: 0.5, description: 'Iron spike for climbing aid.' },
  { id: 'pole', name: 'Pole (10 ft.)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 sp', weight: 8, description: '10-foot wooden pole.' },
  { id: 'pot-iron', name: 'Pot, Iron', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 sp', weight: 10, description: 'Iron cooking pot (1 gallon).' },
  { id: 'pouch-belt', name: 'Pouch, Belt', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 0.5, description: 'Leather pouch (1/5 cubic foot).' },
  { id: 'ram-portable', name: 'Ram, Portable', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '10 gp', weight: 20, description: 'Log for battering. +2 to break doors.' },
  { id: 'rope-hempen', name: 'Rope, Hempen (50 ft.)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 10, description: '50-foot rope. Hardness 0, 2 hp.' },
  { id: 'rope-silk', name: 'Rope, Silk (50 ft.)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '10 gp', weight: 5, description: '50-foot silk rope. Hardness 0, 4 hp.' },
  { id: 'sack', name: 'Sack', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 sp', weight: 0.5, description: 'Cloth bag (1 cubic foot).' },
  { id: 'sealing-wax', name: 'Sealing Wax', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 1, description: 'Wax for sealing letters.' },
  { id: 'shovel', name: 'Shovel', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 gp', weight: 8, description: 'Tool for digging.' },
  { id: 'signal-whistle', name: 'Signal Whistle', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '8 sp', weight: 0, description: 'Audible up to 1 mile.' },
  { id: 'signet-ring', name: 'Signet Ring', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 gp', weight: 0, description: 'Ring with noble seal.' },
  { id: 'sledge', name: 'Sledge', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 10, description: 'Heavy hammer for driving stakes.' },
  { id: 'soap', name: 'Soap (per lb.)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '5 sp', weight: 1, description: 'Pound of cleaning soap.' },
  { id: 'spyglass', name: 'Spyglass', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1000 gp', weight: 1, description: 'Magnifies distant objects.' },
  { id: 'tent', name: 'Tent', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '10 gp', weight: 20, description: 'Canvas shelter for two.' },
  { id: 'torch', name: 'Torch', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 cp', weight: 1, description: 'Light in 20-foot radius for 1 hour. 1 fire damage as weapon.' },
  { id: 'vial', name: 'Vial', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 0.1, description: 'Glass container (1 ounce).' },
  { id: 'waterskin', name: 'Waterskin', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '1 gp', weight: 4, description: 'Leather container (1/2 gallon).' },
  { id: 'whetstone', name: 'Whetstone', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'adventuring', cost: '2 cp', weight: 1, description: 'Stone for sharpening blades.' },
];

// TOOLS & KITS - Professional equipment
export const toolsAndKits: DnD35eGear[] = [
  { id: 'alchemists-lab', name: "Alchemist's Lab", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '500 gp', weight: 40, description: '+2 on Craft (alchemy) checks.' },
  { id: 'artisans-tools', name: "Artisan's Tools", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '5 gp', weight: 5, description: 'Basic craft tools. Required to avoid -2 penalty.' },
  { id: 'artisans-tools-mw', name: "Artisan's Tools, Masterwork", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '55 gp', weight: 5, description: '+2 on Craft checks.' },
  { id: 'climbers-kit', name: "Climber's Kit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '80 gp', weight: 5, description: '+2 on Climb checks.' },
  { id: 'disguise-kit', name: 'Disguise Kit', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '50 gp', weight: 8, description: '+2 on Disguise checks.' },
  { id: 'healers-kit', name: "Healer's Kit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '50 gp', weight: 1, description: '+2 on Heal checks. 10 uses.' },
  { id: 'holy-symbol-wood', name: 'Holy Symbol, Wooden', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '1 gp', weight: 0, description: 'Required for divine spellcasting.' },
  { id: 'holy-symbol-silver', name: 'Holy Symbol, Silver', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '25 gp', weight: 1, description: 'Required for divine spellcasting.' },
  { id: 'hourglass', name: 'Hourglass', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '25 gp', weight: 1, description: 'Measures one hour.' },
  { id: 'magnifying-glass', name: 'Magnifying Glass', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '100 gp', weight: 0, description: '+2 on Appraise checks for small objects.' },
  { id: 'musical-instrument', name: 'Musical Instrument', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '5 gp', weight: 3, description: 'Basic instrument.' },
  { id: 'musical-instrument-mw', name: 'Musical Instrument, Masterwork', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '100 gp', weight: 3, description: '+2 on Perform checks.' },
  { id: 'merchants-scale', name: "Merchant's Scale", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '2 gp', weight: 1, description: '+2 on Appraise for items valued by weight.' },
  { id: 'spell-component-pouch', name: 'Spell Component Pouch', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '5 gp', weight: 2, description: 'Contains common spell components.' },
  { id: 'spellbook-blank', name: 'Spellbook (blank)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '15 gp', weight: 3, description: 'Blank book with 100 pages.' },
  { id: 'thieves-tools', name: "Thieves' Tools", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '30 gp', weight: 1, description: 'Lockpicks. Required to avoid -2 penalty.' },
  { id: 'thieves-tools-mw', name: "Thieves' Tools, Masterwork", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '100 gp', weight: 2, description: '+2 on Disable Device and Open Lock.' },
  { id: 'water-clock', name: 'Water Clock', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'tools', cost: '1000 gp', weight: 200, description: 'Accurate to within half hour per day.' },
];

// ALCHEMICAL SUBSTANCES - Special items
export const alchemicalSubstances: DnD35eGear[] = [
  { id: 'everburning-torch', name: 'Everburning Torch', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '110 gp', weight: 1, description: 'Torch with continual flame. Light in 20-foot radius forever.' },
  { id: 'acid', name: 'Acid (flask)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '10 gp', weight: 1, description: 'Direct hit deals 1d6 acid damage.' },
  { id: 'alchemists-fire', name: "Alchemist's Fire (flask)", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '20 gp', weight: 1, description: 'Direct hit deals 1d6 fire damage.' },
  { id: 'antitoxin', name: 'Antitoxin (vial)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '50 gp', weight: 0, description: '+5 bonus on Fort saves vs poison for 1 hour.' },
  { id: 'holy-water', name: 'Holy Water (flask)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '25 gp', weight: 1, description: 'Deals 2d4 damage to undead/evil outsiders.' },
  { id: 'smokestick', name: 'Smokestick', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '20 gp', weight: 0.5, description: 'Creates 10-foot cube of smoke for 1 minute.' },
  { id: 'sunrod', name: 'Sunrod', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '2 gp', weight: 1, description: 'Bright light in 30-foot radius for 6 hours.' },
  { id: 'tanglefoot-bag', name: 'Tanglefoot Bag', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '50 gp', weight: 4, description: 'Entangles creature on direct hit.' },
  { id: 'thunderstone', name: 'Thunderstone', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '30 gp', weight: 1, description: 'DC 15 Fort or deafened for 1 hour (10-foot radius).' },
  { id: 'tindertwig', name: 'Tindertwig', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'substances', cost: '1 gp', weight: 0, description: 'Lights as standard action with friction.' },
];

// ANIMALS & MOUNTS - Creatures for purchase
export const animalsAndMounts: DnD35eGear[] = [
  { id: 'camel', name: 'Camel', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '50 gp', weight: 0, description: 'Desert beast of burden.' },
  { id: 'cat', name: 'Cat', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '3 sp', weight: 0, description: 'Common house cat.' },
  { id: 'cow', name: 'Cow', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '10 gp', weight: 0, description: 'Domestic bovine.' },
  { id: 'dog', name: 'Dog', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '25 gp', weight: 0, description: 'Trained guard/hunting dog.' },
  { id: 'dog-riding', name: 'Dog, Riding', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '150 gp', weight: 0, description: 'Mount for Small riders.' },
  { id: 'donkey', name: 'Donkey or Mule', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '8 gp', weight: 0, description: 'Beast of burden.' },
  { id: 'hawk', name: 'Hawk', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '18 gp', weight: 0, description: 'Trained bird of prey.' },
  { id: 'horse-heavy', name: 'Horse, Heavy', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '200 gp', weight: 0, description: 'Warhorse or draft animal.' },
  { id: 'horse-heavy-combat', name: 'Horse, Heavy (combat)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '300 gp', weight: 0, description: 'Combat-trained warhorse.' },
  { id: 'horse-light', name: 'Horse, Light', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '75 gp', weight: 0, description: 'Riding horse.' },
  { id: 'horse-light-combat', name: 'Horse, Light (combat)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '110 gp', weight: 0, description: 'Combat-trained riding horse.' },
  { id: 'ox', name: 'Ox', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '15 gp', weight: 0, description: 'Large bovine for heavy labor.' },
  { id: 'pig', name: 'Pig', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '3 gp', weight: 0, description: 'Domestic swine.' },
  { id: 'pony', name: 'Pony', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '30 gp', weight: 0, description: 'Small horse for Small riders.' },
  { id: 'pony-combat', name: 'Pony (combat)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '45 gp', weight: 0, description: 'Combat-trained pony.' },
  { id: 'sheep', name: 'Sheep', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '2 gp', weight: 0, description: 'Domestic ovine.' },
  { id: 'warhorse-heavy', name: 'Warhorse, Heavy', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '400 gp', weight: 0, description: 'Powerful combat warhorse.' },
  { id: 'warhorse-light', name: 'Warhorse, Light', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '150 gp', weight: 0, description: 'Combat warhorse.' },
  { id: 'warpony', name: 'Warpony', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'animals', cost: '100 gp', weight: 0, description: 'Combat-trained pony.' },
];

// FOOD & LODGING - Inn and tavern goods
export const foodAndLodging: DnD35eGear[] = [
  { id: 'rations', name: 'Rations, Trail (per day)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '5 sp', weight: 1, description: 'Dried preserved food for travel.' },
  { id: 'inn-good', name: 'Inn Stay (good)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '2 gp', weight: 0, description: 'Night in good inn with private room.' },
  { id: 'inn-common', name: 'Inn Stay (common)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '5 sp', weight: 0, description: 'Night in common inn, shared room.' },
  { id: 'inn-poor', name: 'Inn Stay (poor)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '2 sp', weight: 0, description: 'Night sleeping on floor.' },
  { id: 'meal-good', name: 'Meal (good)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '5 sp', weight: 0, description: 'Quality meal at inn.' },
  { id: 'meal-common', name: 'Meal (common)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '3 sp', weight: 0, description: 'Standard meal.' },
  { id: 'meal-poor', name: 'Meal (poor)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '1 sp', weight: 0, description: 'Basic bread and porridge.' },
  { id: 'ale-gallon', name: 'Ale (gallon)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '2 sp', weight: 8, description: 'Gallon of common ale.' },
  { id: 'ale-mug', name: 'Ale (mug)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '4 cp', weight: 1, description: 'Mug of common ale.' },
  { id: 'bread', name: 'Bread (loaf)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '2 cp', weight: 0.5, description: 'Loaf of fresh bread.' },
  { id: 'cheese', name: 'Cheese (hunk)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '1 sp', weight: 0.5, description: 'Hunk of cheese.' },
  { id: 'meat', name: 'Meat (chunk)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '3 sp', weight: 0.5, description: 'Salted or smoked meat.' },
  { id: 'wine-common', name: 'Wine, Common (pitcher)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '2 sp', weight: 6, description: 'Pitcher of common wine.' },
  { id: 'wine-fine', name: 'Wine, Fine (bottle)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'food-lodging', cost: '10 gp', weight: 1.5, description: 'Bottle of fine wine.' },
];

// CLOTHING - Outfits and garments
export const clothing: DnD35eGear[] = [
  { id: 'artisans-outfit', name: "Artisan's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '1 gp', weight: 4, description: 'Shirt, pants/skirt, shoes, and tool belt for craftspeople.' },
  { id: 'clerics-vestments', name: "Cleric's Vestments", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '5 gp', weight: 6, description: 'Ecclesiastical clothes for performing priestly functions.' },
  { id: 'cold-weather-outfit', name: 'Cold Weather Outfit', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '8 gp', weight: 7, description: 'Wool coat, cap, cloak, and boots. +5 on Fort saves vs cold.' },
  { id: 'courtiers-outfit', name: "Courtier's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '30 gp', weight: 6, description: 'Fancy tailored clothes for noble courts. Requires jewelry (50+ gp).' },
  { id: 'entertainers-outfit', name: "Entertainer's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '3 gp', weight: 4, description: 'Flashy clothes designed for performance and mobility.' },
  { id: 'explorers-outfit', name: "Explorer's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '10 gp', weight: 8, description: 'Boots, breeches, belt, shirt, gloves, cloak with many pockets.' },
  { id: 'monks-outfit', name: "Monk's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '5 gp', weight: 2, description: 'Sandals, loose breeches, shirt, and sashes. Maximum mobility.' },
  { id: 'nobles-outfit', name: "Noble's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '75 gp', weight: 10, description: 'Expensive clothes with precious metals and gems worked in.' },
  { id: 'peasants-outfit', name: "Peasant's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '1 sp', weight: 2, description: 'Loose shirt, baggy breeches/skirt, and cloth wrappings for shoes.' },
  { id: 'royal-outfit', name: 'Royal Outfit', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '200 gp', weight: 15, description: 'Ostentatious clothing with gems, gold, silk, and fur.' },
  { id: 'scholars-outfit', name: "Scholar's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '5 gp', weight: 6, description: 'Robe, belt, cap, and soft shoes for academics.' },
  { id: 'travelers-outfit', name: "Traveler's Outfit", system: 'dnd-3.5e', source: 'SRD 3.5', category: 'clothing', cost: '1 gp', weight: 5, description: 'Boots, breeches, belt, shirt, and hooded cloak.' },
];

// TRANSPORT - Vehicles and vessels
export const transport: DnD35eGear[] = [
  { id: 'carriage', name: 'Carriage', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '100 gp', weight: 600, description: 'Enclosed four-wheeled vehicle for passengers.' },
  { id: 'cart', name: 'Cart', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '15 gp', weight: 200, description: 'Two-wheeled vehicle for cargo.' },
  { id: 'galley', name: 'Galley', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '30000 gp', weight: 0, description: 'Large warship with oars and sails.' },
  { id: 'keelboat', name: 'Keelboat', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '3000 gp', weight: 0, description: 'River boat 50-75 feet long.' },
  { id: 'longship', name: 'Longship', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '10000 gp', weight: 0, description: 'Viking-style warship 75 feet long.' },
  { id: 'rowboat', name: 'Rowboat', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '50 gp', weight: 100, description: 'Small boat for 2-3 passengers.' },
  { id: 'sailing-ship', name: 'Sailing Ship', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '10000 gp', weight: 0, description: 'Large merchant vessel.' },
  { id: 'sled', name: 'Sled', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '20 gp', weight: 300, description: 'Runners for snow/ice travel.' },
  { id: 'wagon', name: 'Wagon', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '35 gp', weight: 400, description: 'Four-wheeled vehicle for heavy cargo.' },
  { id: 'warship', name: 'Warship', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'transport', cost: '25000 gp', weight: 0, description: 'Military sailing vessel.' },
];

// MOUNT GEAR - Saddles, barding, and related equipment
export const mountGear: DnD35eGear[] = [
  { id: 'barding-medium', name: 'Barding, Medium Creature', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: 'Varies', weight: 0, description: 'Armor for Medium mounts. Double armor cost and weight.' },
  { id: 'barding-large', name: 'Barding, Large Creature', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: 'Varies', weight: 0, description: 'Armor for Large mounts. 4x armor cost, 2x weight.' },
  { id: 'feed', name: 'Feed (per day)', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: '5 cp', weight: 10, description: 'Daily feed for horse, donkey, mule, or pony.' },
  { id: 'saddle-exotic', name: 'Saddle, Exotic', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: 'Varies', weight: 0, description: 'Saddle designed for unusual mounts.' },
  { id: 'saddle-military', name: 'Saddle, Military', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: '20 gp', weight: 30, description: '+2 on Ride checks to stay in saddle. 75% stay if unconscious.' },
  { id: 'saddle-pack', name: 'Saddle, Pack', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: '5 gp', weight: 15, description: 'Holds gear and supplies, not a rider.' },
  { id: 'saddle-riding', name: 'Saddle, Riding', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'mount-gear', cost: '10 gp', weight: 25, description: 'Standard riding saddle for mount.' },
];

// SERVICES - Hired help and transportation
export const services: DnD35eGear[] = [
  { id: 'coach-hire', name: 'Coach Hire', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'services', cost: '3 cp/mile', weight: 0, description: 'Passenger fare for coach travel.' },
  { id: 'hireling-untrained', name: 'Hireling, Untrained', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'services', cost: '1 sp/day', weight: 0, description: 'Daily wage for unskilled labor.' },
  { id: 'hireling-trained', name: 'Hireling, Trained', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'services', cost: '3 sp/day', weight: 0, description: 'Daily wage for skilled labor.' },
  { id: 'messenger', name: 'Messenger', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'services', cost: '2 cp/mile', weight: 0, description: 'Fee for delivering message.' },
  { id: 'road-toll', name: 'Road or Gate Toll', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'services', cost: '1 cp', weight: 0, description: 'Standard road/gate toll.' },
  { id: 'ship-passage', name: 'Ship Passage', system: 'dnd-3.5e', source: 'SRD 3.5', category: 'services', cost: '1 sp/mile', weight: 0, description: 'Passenger fare for sea travel.' },
];

// Export all gear combined
export const allGear: DnD35eGear[] = [
  ...adventuringGear,
  ...toolsAndKits,
  ...alchemicalSubstances,
  ...animalsAndMounts,
  ...foodAndLodging,
  ...clothing,
  ...transport,
  ...mountGear,
  ...services,
];

// Main export for compatibility with equipment index
export const dnd35eGear = allGear;

// Export count for metadata
export const gearCount = allGear.length;
