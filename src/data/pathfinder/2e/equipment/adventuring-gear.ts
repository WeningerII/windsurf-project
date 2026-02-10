import { Item } from '../../../../types/equipment/items';

export const backpack: Item = {
  id: 'backpack', name: 'Backpack', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'sp' },
  description: 'A leather pack for carrying equipment.', requiresAttunement: false,
};

export const bedroll: Item = {
  id: 'bedroll', name: 'Bedroll', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'cp' },
  description: 'A simple bedroll for sleeping.', requiresAttunement: false,
};

export const rope: Item = {
  id: 'rope', name: 'Rope (50 ft.)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'Hemp rope, 50 feet long.', requiresAttunement: false,
};

export const torch: Item = {
  id: 'torch', name: 'Torch', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'cp' },
  description: 'A wooden torch that burns for 1 hour.', requiresAttunement: false,
};

export const rations: Item = {
  id: 'rations', name: 'Rations (1 week)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 4, currency: 'sp' },
  description: 'A week of preserved food.', requiresAttunement: false,
};

export const waterskin: Item = {
  id: 'waterskin', name: 'Waterskin', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'cp' },
  description: 'A leather pouch for water.', requiresAttunement: false,
};

export const thievesTools: Item = {
  id: 'thieves-tools', name: "Thieves' Tools", system: 'pf2e', type: 'tool',
  rarity: 'common', weight: 0, cost: { amount: 3, currency: 'gp' },
  description: 'Lock picks and tools for disabling devices.', requiresAttunement: false,
};

export const healersTools: Item = {
  id: 'healers-tools', name: "Healer's Tools", system: 'pf2e', type: 'tool',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'gp' },
  description: 'Medical supplies for treating wounds.', requiresAttunement: false,
};

export const religiousSymbol: Item = {
  id: 'religious-symbol', name: 'Religious Symbol', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 2, currency: 'gp' },
  description: 'A symbol of your deity.', requiresAttunement: false,
};

export const materialComponent: Item = {
  id: 'material-component', name: 'Material Component Pouch', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'sp' },
  description: 'Common spell components.', requiresAttunement: false,
};

export const lantern: Item = {
  id: 'lantern', name: 'Lantern', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 7, currency: 'sp' },
  description: 'A hooded lantern for illumination.', requiresAttunement: false,
};

export const oil: Item = {
  id: 'oil', name: 'Oil (1 pint)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'Lamp oil or flammable substance.', requiresAttunement: false,
};

export const grappling_hook: Item = {
  id: 'grappling-hook', name: 'Grappling Hook', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'Hook for climbing and securing ropes.', requiresAttunement: false,
};

export const tent: Item = {
  id: 'tent', name: 'Tent', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 2, cost: { amount: 5, currency: 'sp' },
  description: 'A simple tent for 2 people.', requiresAttunement: false,
};

export const chalk: Item = {
  id: 'chalk', name: 'Chalk (10 pieces)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'cp' },
  description: 'Marking chalk.', requiresAttunement: false,
};

export const crowbar: Item = {
  id: 'crowbar', name: 'Crowbar', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 2, cost: { amount: 2, currency: 'sp' },
  description: 'An iron bar for prying.', requiresAttunement: false,
};

export const hammer: Item = {
  id: 'hammer', name: 'Hammer', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'A standard hammer.', requiresAttunement: false,
};

export const piton: Item = {
  id: 'piton', name: 'Piton (10)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'cp' },
  description: 'Metal spikes for climbing.', requiresAttunement: false,
};

export const pole: Item = {
  id: 'pole', name: 'Pole (10 ft.)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'cp' },
  description: 'A wooden pole.', requiresAttunement: false,
};

export const mirror: Item = {
  id: 'mirror', name: 'Mirror (small steel)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'gp' },
  description: 'A small steel mirror.', requiresAttunement: false,
};

export const pouch: Item = {
  id: 'pouch', name: 'Pouch', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'cp' },
  description: 'A belt pouch for small items.', requiresAttunement: false,
};

export const sack: Item = {
  id: 'sack', name: 'Sack', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'cp' },
  description: 'A simple cloth sack.', requiresAttunement: false,
};

export const soap: Item = {
  id: 'soap', name: 'Soap', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 2, currency: 'cp' },
  description: 'A bar of soap.', requiresAttunement: false,
};

export const spellbook: Item = {
  id: 'spellbook', name: 'Spellbook', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'A blank spellbook.', requiresAttunement: false,
};

export const ink: Item = {
  id: 'ink', name: 'Ink (1 oz vial)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'gp' },
  description: 'A vial of black ink.', requiresAttunement: false,
};

export const pen: Item = {
  id: 'pen', name: 'Ink Pen', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 2, currency: 'cp' },
  description: 'A writing implement.', requiresAttunement: false,
};

export const parchment: Item = {
  id: 'parchment', name: 'Parchment (sheet)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'sp' },
  description: 'A sheet of parchment.', requiresAttunement: false,
};

export const sealing_wax: Item = {
  id: 'sealing-wax', name: 'Sealing Wax', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'sp' },
  description: 'Wax for sealing letters.', requiresAttunement: false,
};

export const vial: Item = {
  id: 'vial', name: 'Vial', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'gp' },
  description: 'A small glass vial.', requiresAttunement: false,
};

export const flask: Item = {
  id: 'flask', name: 'Flask', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 3, currency: 'cp' },
  description: 'A leather or metal flask.', requiresAttunement: false,
};

export const jug: Item = {
  id: 'jug', name: 'Jug', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 3, currency: 'cp' },
  description: 'A ceramic jug.', requiresAttunement: false,
};

export const bucket: Item = {
  id: 'bucket', name: 'Bucket', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'cp' },
  description: 'A wooden bucket.', requiresAttunement: false,
};

export const chest: Item = {
  id: 'chest', name: 'Chest', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 5, cost: { amount: 2, currency: 'gp' },
  description: 'A wooden chest for storage.', requiresAttunement: false,
};

export const ladder: Item = {
  id: 'ladder', name: 'Ladder (10 ft.)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 3, cost: { amount: 5, currency: 'cp' },
  description: 'A wooden ladder.', requiresAttunement: false,
};

export const ironChain: Item = {
  id: 'iron-chain', name: 'Chain (10 ft.)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 2, cost: { amount: 5, currency: 'gp' },
  description: 'Iron chain.', requiresAttunement: false,
};

export const manacles: Item = {
  id: 'manacles', name: 'Manacles', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 2, currency: 'gp' },
  description: 'Iron manacles with a key.', requiresAttunement: false,
};

export const lock: Item = {
  id: 'lock', name: 'Lock', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 10, currency: 'gp' },
  description: 'A padlock with a key.', requiresAttunement: false,
};

export const blanket: Item = {
  id: 'blanket', name: 'Blanket', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'A wool blanket.', requiresAttunement: false,
};

export const candle: Item = {
  id: 'candle', name: 'Candle', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'cp' },
  description: 'A wax candle.', requiresAttunement: false,
};

export const tinderbox: Item = {
  id: 'tinderbox', name: 'Tinderbox', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'sp' },
  description: 'Flint and steel for starting fires.', requiresAttunement: false,
};

export const bell: Item = {
  id: 'bell', name: 'Bell', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'gp' },
  description: 'A small bell.', requiresAttunement: false,
};

export const horn: Item = {
  id: 'horn', name: 'Horn', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 3, currency: 'sp' },
  description: 'A signaling horn.', requiresAttunement: false,
};

export const hourglass: Item = {
  id: 'hourglass', name: 'Hourglass', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 25, currency: 'gp' },
  description: 'A glass time-keeping device.', requiresAttunement: false,
};

export const magnifying_glass: Item = {
  id: 'magnifying-glass', name: 'Magnifying Glass', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 100, currency: 'gp' },
  description: 'A lens for examining details.', requiresAttunement: false,
};

export const spyglass: Item = {
  id: 'spyglass', name: 'Spyglass', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1000, currency: 'gp' },
  description: 'A telescope for seeing distant objects.', requiresAttunement: false,
};

export const compass: Item = {
  id: 'compass', name: 'Compass', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 10, currency: 'gp' },
  description: 'A navigational compass.', requiresAttunement: false,
};

export const fishing_tackle: Item = {
  id: 'fishing-tackle', name: 'Fishing Tackle', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'Hook, line, and tackle.', requiresAttunement: false,
};

export const net_fishing: Item = {
  id: 'net-fishing', name: 'Net (fishing)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A fishing net.', requiresAttunement: false,
};

export const trap: Item = {
  id: 'trap', name: 'Trap (hunting)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 3, cost: { amount: 5, currency: 'gp' },
  description: 'A mechanical trap for hunting.', requiresAttunement: false,
};

export const whistle: Item = {
  id: 'whistle', name: 'Whistle', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'cp' },
  description: 'A signal whistle.', requiresAttunement: false,
};

export const basket: Item = {
  id: 'basket', name: 'Basket', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 4, currency: 'sp' },
  description: 'A woven basket.', requiresAttunement: false,
};

export const bottle: Item = {
  id: 'bottle', name: 'Bottle (glass)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 2, currency: 'gp' },
  description: 'A glass bottle.', requiresAttunement: false,
};

export const scrollCase: Item = {
  id: 'scroll-case', name: 'Map/Scroll Case', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'gp' },
  description: 'A leather tube for maps.', requiresAttunement: false,
};

export const signal_whistle: Item = {
  id: 'signal-whistle', name: 'Signal Whistle', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 8, currency: 'sp' },
  description: 'A loud whistle for signaling.', requiresAttunement: false,
};

export const rope_silk: Item = {
  id: 'rope-silk', name: 'Rope, Silk (50 ft.)', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 10, currency: 'gp' },
  description: 'Strong silk rope.', requiresAttunement: false,
};

export const shovel: Item = {
  id: 'shovel', name: 'Shovel', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 2, cost: { amount: 2, currency: 'gp' },
  description: 'A digging tool.', requiresAttunement: false,
};

export const pickaxe: Item = {
  id: 'pickaxe', name: 'Pickaxe', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 3, cost: { amount: 3, currency: 'gp' },
  description: 'A mining tool.', requiresAttunement: false,
};

export const sledgehammer: Item = {
  id: 'sledgehammer', name: 'Sledgehammer', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 4, cost: { amount: 2, currency: 'gp' },
  description: 'A heavy hammer for breaking.', requiresAttunement: false,
};

export const saw: Item = {
  id: 'saw', name: 'Saw', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 4, currency: 'sp' },
  description: 'A woodcutting saw.', requiresAttunement: false,
};

export const chisel: Item = {
  id: 'chisel', name: 'Chisel', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'sp' },
  description: 'A metal chisel.', requiresAttunement: false,
};

export const file: Item = {
  id: 'file', name: 'File', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'sp' },
  description: 'A metal file.', requiresAttunement: false,
};

export const tongs: Item = {
  id: 'tongs', name: 'Tongs', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'Metal tongs for handling hot items.', requiresAttunement: false,
};

export const block_tackle: Item = {
  id: 'block-tackle', name: 'Block and Tackle', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 2, cost: { amount: 5, currency: 'gp' },
  description: 'Pulley system for lifting.', requiresAttunement: false,
};

export const caltrops: Item = {
  id: 'caltrops', name: 'Caltrops', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'Spiked metal pieces.', requiresAttunement: false,
};

export const marbles: Item = {
  id: 'marbles', name: 'Marbles', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'Glass marbles.', requiresAttunement: false,
};

export const ball_bearings: Item = {
  id: 'ball-bearings', name: 'Ball Bearings', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'Metal ball bearings.', requiresAttunement: false,
};

export const dice: Item = {
  id: 'dice', name: 'Dice Set', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 1, currency: 'sp' },
  description: 'Gaming dice.', requiresAttunement: false,
};

export const playing_cards: Item = {
  id: 'playing-cards', name: 'Playing Cards', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 0, cost: { amount: 5, currency: 'sp' },
  description: 'A deck of playing cards.', requiresAttunement: false,
};

export const musical_instrument: Item = {
  id: 'musical-instrument', name: 'Musical Instrument', system: 'pf2e', type: 'gear',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'gp' },
  description: 'A common instrument.', requiresAttunement: false,
};

export const disguise_kit: Item = {
  id: 'disguise-kit', name: 'Disguise Kit', system: 'pf2e', type: 'tool',
  rarity: 'common', weight: 1, cost: { amount: 25, currency: 'gp' },
  description: 'Cosmetics and props for disguises.', requiresAttunement: false,
};

export const artisan_tools: Item = {
  id: 'artisan-tools', name: "Artisan's Tools", system: 'pf2e', type: 'tool',
  rarity: 'common', weight: 2, cost: { amount: 5, currency: 'gp' },
  description: 'Tools for a specific craft.', requiresAttunement: false,
};

export const alchemist_tools: Item = {
  id: 'alchemist-tools', name: "Alchemist's Tools", system: 'pf2e', type: 'tool',
  rarity: 'common', weight: 2, cost: { amount: 5, currency: 'gp' },
  description: 'Equipment for alchemy.', requiresAttunement: false,
};

export const herbalism_kit: Item = {
  id: 'herbalism-kit', name: 'Herbalism Kit', system: 'pf2e', type: 'tool',
  rarity: 'common', weight: 1, cost: { amount: 5, currency: 'gp' },
  description: 'Tools for identifying and preparing herbs.', requiresAttunement: false,
};

export const pf2eGear = {
  backpack, bedroll, rope, torch, rations, waterskin,
  thievesTools, healersTools, religiousSymbol, materialComponent,
  lantern, oil, grappling_hook, tent, chalk, crowbar, hammer, piton, pole, mirror,
  pouch, sack, soap, spellbook, ink, pen, parchment, sealing_wax, vial, flask,
  jug, bucket, chest, ladder, ironChain, manacles, lock, blanket, candle, tinderbox,
  bell, horn, hourglass, magnifying_glass, spyglass, compass, fishing_tackle, net_fishing,
  trap, whistle, basket, bottle, scrollCase, signal_whistle, rope_silk, shovel, pickaxe,
  sledgehammer, saw, chisel, file, tongs, block_tackle, caltrops, marbles, ball_bearings,
  dice, playing_cards, musical_instrument, disguise_kit, artisan_tools, alchemist_tools, herbalism_kit,
};
