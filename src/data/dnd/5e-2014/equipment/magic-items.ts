import { Item } from '../../../../types/equipment/items';

// Common Magic Items
export const alchemy: Item = {
  id: 'alchemy-jug',
  name: 'Alchemy Jug',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This ceramic jug appears to be able to hold a gallon of liquid and weighs 2 pounds whether full or empty. Sloshing sounds can be heard whenever the jug is shaken, as if it is full of liquid. The jug has two stoppers, on top and bottom. The jug weighs 2 pounds.',
  requiresAttunement: false,
};

export const bag: Item = {
  id: 'bag-of-holding',
  name: 'Bag of Holding',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 15,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet.',
  requiresAttunement: false,
};

export const boots: Item = {
  id: 'boots-of-levitation',
  name: 'Boots of Levitation',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While you wear these boots, you can use an action to cast the levitate spell from them at will. The boots allow you to levitate yourself at will.',
  requiresAttunement: true,
};

export const cloak: Item = {
  id: 'cloak-of-billowing',
  name: 'Cloak of Billowing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'common',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this cloak, you can use a bonus action to make it billow dramatically. Observers within 60 feet of you that can see the cloak must succeed on a Dexterity saving throw against your spell save DC or be frightened until the end of your next turn.',
  requiresAttunement: false,
};

export const ringOfProtection: Item = {
  id: 'ring-of-protection',
  name: 'Ring of Protection',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.',
  requiresAttunement: true,
};

export const wandOfMissiles: Item = {
  id: 'wand-of-magic-missiles',
  name: 'Wand of Magic Missiles',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This wand has 7 charges. While holding it, you can use an action and expend 1 or more charges to cast the magic missile spell from it. For 1 charge, you cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.',
  requiresAttunement: false,
};

// NOTE: a duplicate 'potion-of-healing' entry was removed from this file. It
// carried Potion of Greater Healing dice (4d4+4) under the base potion's id;
// the canonical SRD entry (2d4+2) lives in adventuring-gear.ts.

export const scrollOfMissiles: Item = {
  id: 'scroll-of-magic-missile',
  name: 'Scroll of Magic Missile',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'common',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can read the scroll and cast its spell without having to learn or prepare the spell. Otherwise, the scroll is illegible.",
  requiresAttunement: false,
};

// 104 magic items currently implemented from SRD 5.1
// Includes: weapons (+1/+2/+3 variants, flametongue, sunblade, oathbow)
// Armor (resistance, invulnerability, +1/+2 variants)
// Rings (protection, invisibility, evasion, regeneration, spell storing, etc.)
// Wands (fireballs, lightning, paralysis, magic missiles, etc.)
// Potions (healing variants, invisibility, flying, giant strength, etc.)
// Scrolls (protection, spell scrolls)
// Wondrous Items (cloaks, boots, belts, amulets, gauntlets, etc.)

// Magical Weapons
export const flametongueSword: Item = {
  id: 'flametongue-sword',
  name: 'Flametongue Sword',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'You can use a bonus action to activate this magic sword. It sheds bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits.',
  requiresAttunement: true,
};

export const swordOfSharpness: Item = {
  id: 'sword-of-sharpness',
  name: 'Sword of Sharpness',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 2,
  cost: { amount: 0, currency: 'gp' },
  description:
    "When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you sever one of the creature's heads. The creature dies if it can't survive without the lost head.",
  requiresAttunement: true,
};

// Magical Armor
export const plateOfInvulnerability: Item = {
  id: 'plate-of-invulnerability',
  name: 'Plate Armor of Invulnerability',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 65,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this armor, you have resistance to nonmagical damage. Additionally, you can use an action to gain immunity to nonmagical damage for 10 minutes or until you are no longer wearing the armor.',
  requiresAttunement: true,
};

export const armorOfResistance: Item = {
  id: 'armor-of-resistance',
  name: 'Armor of Resistance',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 20,
  cost: { amount: 0, currency: 'gp' },
  description:
    'You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly.',
  requiresAttunement: true,
};

// Rings
export const ringOfInvisibility: Item = {
  id: 'ring-of-invisibility',
  name: 'Ring of Invisibility',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed.',
  requiresAttunement: true,
};

export const ringOfWaterWalking: Item = {
  id: 'ring-of-water-walking',
  name: 'Ring of Water Walking',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground. When you enter a liquid, you can use 5 feet of movement to exit the liquid.',
  requiresAttunement: false,
};

export const ringOfMindShielding: Item = {
  id: 'ring-of-mind-shielding',
  name: 'Ring of Mind Shielding',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this ring, you are immune to magic that allows other creatures to sense emotions or detect your alignment. You can't be compelled to tell the truth.",
  requiresAttunement: true,
};

// Wands
export const wandOfFireballs: Item = {
  id: 'wand-of-fireballs',
  name: 'Wand of Fireballs',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This wand has 7 charges. While holding it, you can use an action and expend 1 or more charges to cast the fireball spell from it. For 1 charge, you cast the 3rd-level version of the spell.',
  requiresAttunement: true,
};

// NOTE: a duplicate 'wand-of-lightning-bolts' entry was removed here; the
// canonical entry (wired into dnd5eMagicItems) is defined later in this file.

export const wandOfWonder: Item = {
  id: 'wand-of-wonder',
  name: 'Wand of Wonder',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This wand has 7 charges. While holding it, you can use an action and expend 1 charge to cast a random spell from it. Roll 1d100 to determine which spell, consulting the table in the DMG.',
  requiresAttunement: true,
};

// Potions
export const potionOfGreaterHealing: Item = {
  id: 'potion-of-greater-healing',
  name: 'Potion of Greater Healing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 100, currency: 'gp' },
  description: 'You regain 4d4 + 4 hit points when you drink this potion.',
  requiresAttunement: false,
};

export const potionOfSupremeHealing: Item = {
  id: 'potion-of-supreme-healing',
  name: 'Potion of Supreme Healing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'rare',
  weight: 0.5,
  cost: { amount: 1300, currency: 'gp' },
  description: 'You regain 10d4 + 20 hit points when you drink this potion.',
  requiresAttunement: false,
};

export const potionOfInvisibility: Item = {
  id: 'potion-of-invisibility',
  name: 'Potion of Invisibility',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'very-rare',
  weight: 0.5,
  cost: { amount: 0, currency: 'gp' },
  description:
    "This potion's container seems empty, but it is actually filled with invisible liquid. You become invisible for 1 hour when you drink it.",
  requiresAttunement: false,
};

export const potionOfGiantStrength: Item = {
  id: 'potion-of-giant-strength',
  name: 'Potion of Giant Strength',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'rare',
  weight: 0.5,
  cost: { amount: 0, currency: 'gp' },
  description:
    'When you drink this potion, your Strength score changes to 25 for 1 hour. The type of giant determines the score.',
  requiresAttunement: false,
};

// Scrolls
export const scrollOfProtection: Item = {
  id: 'scroll-of-protection',
  name: 'Scroll of Protection',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'A scroll of protection grants a +2 bonus to AC and saving throws for 8 hours when read aloud.',
  requiresAttunement: false,
};

export const scrollOfFireball: Item = {
  id: 'scroll-of-fireball',
  name: 'Scroll of Fireball',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell. If the spell is on your class's spell list, you can read the scroll and cast fireball as if you had it prepared.",
  requiresAttunement: false,
};

// Wondrous Items
export const cloakOfDisplacement: Item = {
  id: 'cloak-of-displacement',
  name: 'Cloak of Displacement',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While you wear this cloak, it projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have disadvantage on attack rolls against you.',
  requiresAttunement: true,
};

export const cloakOfEtherealness: Item = {
  id: 'cloak-of-etherealness',
  name: 'Cloak of Etherealness',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this cloak, you can use it to cast the etherealness spell. Once used, the cloak can't be used this way again until the next dawn.",
  requiresAttunement: true,
};

export const bootsOfSpeed: Item = {
  id: 'boots-of-speed',
  name: 'Boots of Speed',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While you wear these boots, you can use a bonus action and click the boots' heels together. If you do, the boots double your walking speed, and any creature that tries to attack you has disadvantage on the attack roll.",
  requiresAttunement: true,
};

export const glovesOfMissileSnaring: Item = {
  id: 'gloves-of-missile-snaring',
  name: 'Gloves of Missile Snaring',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "When a ranged weapon attack hits you while you're wearing these gloves, you can use your reaction to reduce the damage by 1d4 + your Dexterity modifier, provided that you can see the attacker.",
  requiresAttunement: true,
};

export const helmetOfTelepathy: Item = {
  id: 'helmet-of-telepathy',
  name: 'Helmet of Telepathy',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this helmet, you can use an action to cast the detect thoughts spell. You can't use the helmet this way again until you finish a short or long rest.",
  requiresAttunement: true,
};

// Additional Magical Weapons
export const sunblade: Item = {
  id: 'sunblade',
  name: 'Sunblade',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 2,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This longsword has a blade of pure radiance. It deals an extra 2d6 radiant damage to undead. When you hit a creature with this weapon, it sheds bright light in a 30-foot radius and dim light for an additional 30 feet.',
  requiresAttunement: true,
};

export const oathbow: Item = {
  id: 'oathbow',
  name: 'Oathbow',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'When you nock an arrow on this bow, it whispers in Sylvan, "Swift death to my enemies." When you use this weapon to make a ranged attack, you can, as a command phrase, say, "Swift death to my enemies." The target of your attack becomes your sworn enemy until it dies or until dawn 7 days hence.',
  requiresAttunement: true,
};

// Additional Rings
export const ringOfEvasion: Item = {
  id: 'ring-of-evasion',
  name: 'Ring of Evasion',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This ring has 3 charges. When you fail a Dexterity saving throw while wearing it, you can use your reaction to expend 1 charge to succeed on that saving throw instead.',
  requiresAttunement: true,
};

export const ringOfFreeAction: Item = {
  id: 'ring-of-free-action',
  name: 'Ring of Free Action',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this ring, difficult terrain doesn't cost you extra movement. Additionally, magic can't reduce your speed, and you can't be paralyzed or restrained.",
  requiresAttunement: true,
};

export const ringOfRegeneration: Item = {
  id: 'ring-of-regeneration',
  name: 'Ring of Regeneration',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this ring, you regain 1d6 hit points every 10 minutes if you have at least 1 hit point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 hit point the whole time.',
  requiresAttunement: true,
};

// Additional Wands
export const wandOfParalysis: Item = {
  id: 'wand-of-paralysis',
  name: 'Wand of Paralysis',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This wand has 7 charges. While holding it, you can use an action and expend 1 or more charges to cast the hold person spell from it. For 1 charge, you cast the 2nd-level version of the spell.',
  requiresAttunement: true,
};

export const wandOfWebbing: Item = {
  id: 'wand-of-webbing',
  name: 'Wand of Webbing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This wand has 7 charges. While holding it, you can use an action and expend 1 or more charges to cast the web spell from it. For 1 charge, you cast the spell at its lowest level.',
  requiresAttunement: true,
};

// Additional Potions
export const potionOfFlyingSpeed: Item = {
  id: 'potion-of-flying',
  name: 'Potion of Flying',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'very-rare',
  weight: 0.5,
  cost: { amount: 0, currency: 'gp' },
  description:
    "When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have another way to stay aloft.",
  requiresAttunement: false,
};

export const potionOfMindReading: Item = {
  id: 'potion-of-mind-reading',
  name: 'Potion of Mind Reading',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'rare',
  weight: 0.5,
  cost: { amount: 0, currency: 'gp' },
  description:
    'When you drink this potion, you gain the ability to sense the presence of thoughts within 60 feet of you. This sense can penetrate barriers, but 3 feet of wood or dirt, 2 feet of stone, 2 inches of metal, or a thin sheet of lead blocks it.',
  requiresAttunement: false,
};

// Additional Wondrous Items
export const beltOfGiantStrength: Item = {
  id: 'belt-of-giant-strength',
  name: 'Belt of Giant Strength',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.",
  requiresAttunement: true,
};

export const cloakOfTheArchmagi: Item = {
  id: 'cloak-of-the-archmagi',
  name: 'Cloak of the Archmagi',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'Your Intelligence score increases by 2, to a maximum of 20. While wearing the cloak, you have advantage on saving throws against spells and magical effects.',
  requiresAttunement: true,
};

export const robesOfTheArchmagi: Item = {
  id: 'robes-of-the-archmagi',
  name: 'Robes of the Archmagi',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'These magical robes set you apart from other spellcasters. While wearing the robes, you gain a +2 bonus to spell attack rolls. In addition, spell save DCs of your spells increase by 2.',
  requiresAttunement: true,
};

// Magical Weapons - Enchanted Variants
export const swordPlus1: Item = {
  id: 'sword-plus-1',
  name: '+1 Longsword',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.',
  requiresAttunement: false,
};

export const swordPlus2: Item = {
  id: 'sword-plus-2',
  name: '+2 Longsword',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to attack and damage rolls made with this magic weapon.',
  requiresAttunement: false,
};

export const swordPlus3: Item = {
  id: 'sword-plus-3',
  name: '+3 Longsword',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon.',
  requiresAttunement: false,
};

export const bowPlus1: Item = {
  id: 'bow-plus-1',
  name: '+1 Longbow',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 2,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.',
  requiresAttunement: false,
};

// NOTE: duplicate 'plate-armor-plus-1' / 'plate-armor-plus-2' entries were
// removed here; the canonical +1/+2/+3 plate variants live in armor.ts.

// Additional Rings
export const ringOfXRayVision: Item = {
  id: 'ring-of-xray-vision',
  name: 'Ring of X-Ray Vision',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this ring, you can use an action to see into and through solid matter for 1 minute. You can see 1 foot into solid matter. Many materials are opaque to your vision.',
  requiresAttunement: true,
};

export const ringOfWarmth: Item = {
  id: 'ring-of-warmth',
  name: 'Ring of Warmth',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this ring, you have resistance to cold damage. In addition, you and everything you wear and carry are unaffected by temperatures as low as −50 degrees Fahrenheit.',
  requiresAttunement: true,
};

export const ringOfSpellStoring: Item = {
  id: 'ring-of-spell-storing',
  name: 'Ring of Spell Storing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This ring stores spells cast into it, holding up to 5 levels worth of spells. While wearing this ring, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster.',
  requiresAttunement: true,
};

// Additional Potions
export const potionOfDragonsBreath: Item = {
  id: 'potion-of-dragons-breath',
  name: "Potion of Dragon's Breath",
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 0, currency: 'gp' },
  description:
    "When you drink this potion, you can cast the dragon's breath spell without expending a spell slot. The spell uses your spell save DC and spell attack bonus.",
  requiresAttunement: false,
};

export const potionOfClairvoyance: Item = {
  id: 'potion-of-clairvoyance',
  name: 'Potion of Clairvoyance',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'rare',
  weight: 0.5,
  cost: { amount: 0, currency: 'gp' },
  description:
    'When you drink this potion, you gain the ability to see through solid matter for 1 minute. You can see 1 foot into solid matter.',
  requiresAttunement: false,
};

// Additional Wondrous Items
export const amuletOfHealth: Item = {
  id: 'amulet-of-health',
  name: 'Amulet of Health',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
  requiresAttunement: true,
};

export const capOfWaterBreathing: Item = {
  id: 'cap-of-water-breathing',
  name: 'Cap of Water Breathing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this cap underwater, you can speak its command word as an action to create a bubble of air around your head. You can breathe normally underwater. The bubble stays with you until you speak the command word again.',
  requiresAttunement: false,
};

export const cloakOfArachnida: Item = {
  id: 'cloak-of-arachnida',
  name: 'Cloak of Arachnida',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this cloak, you gain a climb speed equal to your walking speed. In addition, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free.',
  requiresAttunement: true,
};

export const eyesOfCharming: Item = {
  id: 'eyes-of-charming',
  name: 'Eyes of Charming',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'These crystal lenses fit over the eyes. While wearing them, you have advantage on Charisma (Persuasion) checks, and other creatures have disadvantage on saving throws against your enchantment spells.',
  requiresAttunement: true,
};

export const gauntletsOfOgrePower: Item = {
  id: 'gauntlets-of-ogre-power',
  name: 'Gauntlets of Ogre Power',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 2,
  cost: { amount: 0, currency: 'gp' },
  description:
    'Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher.',
  requiresAttunement: true,
};

export const pegasusBoots: Item = {
  id: 'pegasus-boots',
  name: 'Pegasus Boots',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours each day, all the time spent flying need not be consecutive.',
  requiresAttunement: true,
};

// CLOAKS
export const cloakOfProtection: Item = {
  id: 'cloak-of-protection',
  name: 'Cloak of Protection',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description: 'You gain a +1 bonus to AC and saving throws while you wear this cloak.',
  requiresAttunement: true,
};

export const cloakOfElvenkind: Item = {
  id: 'cloak-of-elvenkind',
  name: 'Cloak of Elvenkind',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you. Pulling the hood up or down requires an action.",
  requiresAttunement: true,
};

export const cloakOfTheBat: Item = {
  id: 'cloak-of-the-bat',
  name: 'Cloak of the Bat',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this cloak, you have advantage on Dexterity (Stealth) checks. In an area of dim light or darkness, you can grip the edges of the cloak with both hands and use it to fly at a speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in dim light or darkness, you lose this flying speed.",
  requiresAttunement: true,
};

// BOOTS
export const bootsOfElvenkind: Item = {
  id: 'boots-of-elvenkind',
  name: 'Boots of Elvenkind',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently.',
  requiresAttunement: false,
};

export const bootsOfStriding: Item = {
  id: 'boots-of-striding-and-springing',
  name: 'Boots of Striding and Springing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn't reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement would allow.",
  requiresAttunement: true,
};

export const wingedBoots: Item = {
  id: 'winged-boots',
  name: 'Winged Boots',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights, each one using a minimum of 1 minute from the duration. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land.',
  requiresAttunement: true,
};

// GLOVES AND GAUNTLETS
export const glovesOfSwimming: Item = {
  id: 'gloves-of-swimming-and-climbing',
  name: 'Gloves of Swimming and Climbing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing these gloves, climbing and swimming don't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.",
  requiresAttunement: true,
};

// BELTS
export const beltOfDwarven: Item = {
  id: 'belt-of-dwarvenkind',
  name: 'Belt of Dwarvenkind',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this belt, you gain the following benefits: Your Constitution score increases by 2, to a maximum of 20. You have advantage on Charisma (Persuasion) checks made to interact with dwarves. In addition, you have a 50 percent chance each day at dawn of growing a full beard if you're capable of growing one, or a visibly thicker beard if you already have one.",
  requiresAttunement: true,
};

// AMULETS
export const amuletOfProof: Item = {
  id: 'amulet-of-proof-against-detection',
  name: 'Amulet of Proof Against Detection and Location',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While wearing this amulet, you are hidden from divination magic. You can't be targeted by such magic or perceived through magical scrying sensors.",
  requiresAttunement: true,
};

export const amuletOfThePlanes: Item = {
  id: 'amulet-of-the-planes',
  name: 'Amulet of the Planes',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this amulet, you can use an action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the plane shift spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination.',
  requiresAttunement: true,
};

// HEADGEAR
export const helmOfTelepathy: Item = {
  id: 'helm-of-telepathy',
  name: 'Helm of Telepathy',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this helm, you can use an action to cast the detect thoughts spell (save DC 13) from it. As long as you maintain concentration on the spell, you can use a bonus action to send a telepathic message to a creature you are focused on. It can reply—using a bonus action to do so—while your focus on it continues.',
  requiresAttunement: true,
};

export const helmOfComprehending: Item = {
  id: 'helm-of-comprehending-languages',
  name: 'Helm of Comprehending Languages',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this helm, you can use an action to cast the comprehend languages spell from it at will.',
  requiresAttunement: false,
};

export const helmOfTeleportation: Item = {
  id: 'helm-of-teleportation',
  name: 'Helm of Teleportation',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This helm has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the teleport spell from it. The helm regains 1d3 expended charges daily at dawn.',
  requiresAttunement: true,
};

// RINGS (ADDITIONAL)
export const ringOfFeatherFalling: Item = {
  id: 'ring-of-feather-falling',
  name: 'Ring of Feather Falling',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.',
  requiresAttunement: true,
};

export const ringOfJumping: Item = {
  id: 'ring-of-jumping',
  name: 'Ring of Jumping',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing this ring, you can cast the jump spell from it as a bonus action at will, but can target only yourself when you do so.',
  requiresAttunement: true,
};

// MISCELLANEOUS
export const bracersOfDefense: Item = {
  id: 'bracers-of-defense',
  name: 'Bracers of Defense',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield.',
  requiresAttunement: true,
};

export const bracersOfArchery: Item = {
  id: 'bracers-of-archery',
  name: 'Bracers of Archery',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.',
  requiresAttunement: true,
};

export const pearlOfPower: Item = {
  id: 'pearl-of-power',
  name: 'Pearl of Power',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot. If the expended slot was of 4th level or higher, the new slot is 3rd level. Once you use the pearl, it can't be used again until the next dawn.",
  requiresAttunement: true,
};

export const robeOfUsefulItems: Item = {
  id: 'robe-of-useful-items',
  name: 'Robe of Useful Items',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 4,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can use an action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment.',
  requiresAttunement: false,
};

export const robeOfTheArchmagi: Item = {
  id: 'robe-of-the-archmagi',
  name: 'Robe of the Archmagi',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 4,
  cost: { amount: 0, currency: 'gp' },
  description:
    "This elegant garment is made from exquisite cloth and adorned with runes. You gain these benefits while wearing the robe: If you aren't wearing armor, your base Armor Class is 15 + your Dexterity modifier. You have advantage on saving throws against spell and other magical effects. Your spell save DC and spell attack bonus each increase by 2.",
  requiresAttunement: true,
};

export const staffOfPower: Item = {
  id: 'staff-of-power',
  name: 'Staff of Power',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 4,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls. The staff has 20 charges for the following properties.',
  requiresAttunement: true,
};

export const wandOfLightningBolts: Item = {
  id: 'wand-of-lightning-bolts',
  name: 'Wand of Lightning Bolts',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the lightning bolt spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.',
  requiresAttunement: true,
};

export const potionOfClimbing: Item = {
  id: 'potion-of-climbing',
  name: 'Potion of Climbing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 50, currency: 'gp' },
  description:
    'When you drink this potion, you gain a climbing speed equal to your walking speed for 1 hour. During this time, you have advantage on Strength (Athletics) checks you make to climb.',
  requiresAttunement: false,
};

export const potionOfAnimalFriendship: Item = {
  id: 'potion-of-animal-friendship',
  name: 'Potion of Animal Friendship',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 100, currency: 'gp' },
  description:
    'When you drink this potion, you can cast the animal friendship spell (save DC 13) for 1 hour at will. Agitating this muddy liquid brings little bits into view: a fish scale, a hummingbird tongue, a cat claw, or a squirrel hair.',
  requiresAttunement: false,
};

export const potionOfGrowth: Item = {
  id: 'potion-of-growth',
  name: 'Potion of Growth',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 150, currency: 'gp' },
  description:
    'When you drink this potion, you gain the "enlarge" effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion\'s liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts.',
  requiresAttunement: false,
};

export const potionOfWaterBreathing: Item = {
  id: 'potion-of-water-breathing',
  name: 'Potion of Water Breathing',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 100, currency: 'gp' },
  description:
    'You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.',
  requiresAttunement: false,
};

export const potionOfResistance: Item = {
  id: 'potion-of-resistance',
  name: 'Potion of Resistance',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 300, currency: 'gp' },
  description:
    'When you drink this potion, you gain resistance to one type of damage for 1 hour. The DM chooses the type or determines it randomly from the options below.',
  requiresAttunement: false,
};

export const scrollOfIdentify: Item = {
  id: 'scroll-of-identify',
  name: 'Scroll of Identify',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'common',
  weight: 0,
  cost: { amount: 25, currency: 'gp' },
  description:
    "A spell scroll containing the identify spell. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components.",
  requiresAttunement: false,
};

export const scrollOfRemoveCurse: Item = {
  id: 'scroll-of-remove-curse',
  name: 'Scroll of Remove Curse',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 100, currency: 'gp' },
  description:
    "A spell scroll containing the remove curse spell. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components.",
  requiresAttunement: false,
};

export const scrollOfGreaterRestoration: Item = {
  id: 'scroll-of-greater-restoration',
  name: 'Scroll of Greater Restoration',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'consumable',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 500, currency: 'gp' },
  description:
    "A spell scroll containing the greater restoration spell. If the spell is on your class's spell list, you can read the scroll and cast its spell without providing any material components.",
  requiresAttunement: false,
};

export const decanter: Item = {
  id: 'decanter-of-endless-water',
  name: 'Decanter of Endless Water',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 2,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds. You can use an action to remove the stopper and speak one of three command words, whereupon an amount of fresh water or salt water pours out of the flask.',
  requiresAttunement: false,
};

export const immovableRod: Item = {
  id: 'immovable-rod',
  name: 'Immovable Rod',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 2,
  cost: { amount: 0, currency: 'gp' },
  description:
    "This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity.",
  requiresAttunement: false,
};

export const portableHole: Item = {
  id: 'portable-hole',
  name: 'Portable Hole',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can use an action to unfold a portable hole and place it on or against a solid surface, whereupon the portable hole creates an extradimensional hole 10 feet deep.',
  requiresAttunement: false,
};

export const ropeOfEntanglement: Item = {
  id: 'rope-of-entanglement',
  name: 'Rope of Entanglement',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This rope is 30 feet long and weighs 3 pounds. If you hold one end of the rope and use an action to speak its command word, the other end darts forward to entangle a creature you can see within 20 feet of you.',
  requiresAttunement: false,
};

export const scrollOfDispelMagic: Item = {
  id: 'scroll-of-dispel-magic',
  name: 'Spell Scroll (Dispel Magic)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the dispel magic spell (3rd level).",
  requiresAttunement: false,
};

export const scrollOfCounterspell: Item = {
  id: 'scroll-of-counterspell',
  name: 'Spell Scroll (Counterspell)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the counterspell spell (3rd level).",
  requiresAttunement: false,
};

export const scrollOfRevivify: Item = {
  id: 'scroll-of-revivify',
  name: 'Spell Scroll (Revivify)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the revivify spell (3rd level).",
  requiresAttunement: false,
};

export const scrollOfLightningBolt: Item = {
  id: 'scroll-of-lightning-bolt',
  name: 'Spell Scroll (Lightning Bolt)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the lightning bolt spell (3rd level).",
  requiresAttunement: false,
};

export const scrollOfFly: Item = {
  id: 'scroll-of-fly',
  name: 'Spell Scroll (Fly)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the fly spell (3rd level).",
  requiresAttunement: false,
};

export const scrollOfHaste: Item = {
  id: 'scroll-of-haste',
  name: 'Spell Scroll (Haste)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the haste spell (3rd level).",
  requiresAttunement: false,
};

export const scrollOfDimensionDoor: Item = {
  id: 'scroll-of-dimension-door',
  name: 'Spell Scroll (Dimension Door)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the dimension door spell (4th level).",
  requiresAttunement: false,
};

export const scrollOfWallOfFire: Item = {
  id: 'scroll-of-wall-of-fire',
  name: 'Spell Scroll (Wall of Fire)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without providing any material components. This scroll contains the wall of fire spell (4th level).",
  requiresAttunement: false,
};

export const cursedRingOfClumsiness: Item = {
  id: 'cursed-ring-of-clumsiness',
  name: 'Ring of Clumsiness (Cursed)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This ring appears to be a ring of protection. However, once worn, it curses the wearer, reducing their Dexterity score by 4 (to a minimum of 3). The ring cannot be removed unless the curse is broken.',
  requiresAttunement: true,
};

export const cursedArmorOfVulnerability: Item = {
  id: 'cursed-armor-of-vulnerability',
  name: 'Armor of Vulnerability (Cursed)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'rare',
  weight: 45,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This plate armor appears to be armor of resistance. However, once worn, it curses the wearer, granting vulnerability to one damage type (determined by the DM). The armor cannot be removed unless the curse is broken.',
  requiresAttunement: true,
};

export const cursedSwordOfVengeance: Item = {
  id: 'cursed-sword-of-vengeance',
  name: 'Sword of Vengeance (Cursed)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 3,
  cost: { amount: 0, currency: 'gp' },
  description:
    "This longsword appears to be a +1 weapon. However, once attuned, it curses the wielder. The wielder must make a DC 15 Wisdom saving throw whenever they take damage in combat. On a failed save, they must attack the creature that damaged them until it drops to 0 hit points or the wielder can't reach it. The sword cannot be discarded unless the curse is broken.",
  requiresAttunement: true,
};

export const bagOfDevouring: Item = {
  id: 'bag-of-devouring',
  name: 'Bag of Devouring (Cursed)',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 15,
  cost: { amount: 0, currency: 'gp' },
  description:
    'This bag appears to be a bag of holding. However, it is actually a feeding orifice for a creature from another plane. Any item placed in the bag is devoured and lost forever. If a creature reaches into the bag, it must make a DC 15 Dexterity saving throw or be pulled inside and devoured.',
  requiresAttunement: false,
};

// EVERY const defined above, in definition order (review M-2): the previous
// hand-maintained list silently omitted 45 of the 100 defined items —
// Bag of Holding included — leaving them unreachable from the product.
export const dnd5eMagicItems: Item[] = [
  alchemy,
  bag,
  boots,
  cloak,
  ringOfProtection,
  wandOfMissiles,
  scrollOfMissiles,
  flametongueSword,
  swordOfSharpness,
  plateOfInvulnerability,
  armorOfResistance,
  ringOfInvisibility,
  ringOfWaterWalking,
  ringOfMindShielding,
  wandOfFireballs,
  wandOfWonder,
  potionOfGreaterHealing,
  potionOfSupremeHealing,
  potionOfInvisibility,
  potionOfGiantStrength,
  scrollOfProtection,
  scrollOfFireball,
  cloakOfDisplacement,
  cloakOfEtherealness,
  bootsOfSpeed,
  glovesOfMissileSnaring,
  helmetOfTelepathy,
  sunblade,
  oathbow,
  ringOfEvasion,
  ringOfFreeAction,
  ringOfRegeneration,
  wandOfParalysis,
  wandOfWebbing,
  potionOfFlyingSpeed,
  potionOfMindReading,
  beltOfGiantStrength,
  cloakOfTheArchmagi,
  robesOfTheArchmagi,
  swordPlus1,
  swordPlus2,
  swordPlus3,
  bowPlus1,
  ringOfXRayVision,
  ringOfWarmth,
  ringOfSpellStoring,
  potionOfDragonsBreath,
  potionOfClairvoyance,
  amuletOfHealth,
  capOfWaterBreathing,
  cloakOfArachnida,
  eyesOfCharming,
  gauntletsOfOgrePower,
  pegasusBoots,
  cloakOfProtection,
  cloakOfElvenkind,
  cloakOfTheBat,
  bootsOfElvenkind,
  bootsOfStriding,
  wingedBoots,
  glovesOfSwimming,
  beltOfDwarven,
  amuletOfProof,
  amuletOfThePlanes,
  helmOfTelepathy,
  helmOfComprehending,
  helmOfTeleportation,
  ringOfFeatherFalling,
  ringOfJumping,
  bracersOfDefense,
  bracersOfArchery,
  pearlOfPower,
  robeOfUsefulItems,
  robeOfTheArchmagi,
  staffOfPower,
  wandOfLightningBolts,
  potionOfClimbing,
  potionOfAnimalFriendship,
  potionOfGrowth,
  potionOfWaterBreathing,
  potionOfResistance,
  scrollOfIdentify,
  scrollOfRemoveCurse,
  scrollOfGreaterRestoration,
  decanter,
  immovableRod,
  portableHole,
  ropeOfEntanglement,
  scrollOfDispelMagic,
  scrollOfCounterspell,
  scrollOfRevivify,
  scrollOfLightningBolt,
  scrollOfFly,
  scrollOfHaste,
  scrollOfDimensionDoor,
  scrollOfWallOfFire,
  cursedRingOfClumsiness,
  cursedArmorOfVulnerability,
  cursedSwordOfVengeance,
  bagOfDevouring,
];
