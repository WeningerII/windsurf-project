import { Item } from '../../../../types/equipment/items';

// D&D 3.5e SRD Magic Items
// Rings, Wands, Potions, and Wondrous Items

// RINGS
export const ringOfProtection1: Item = {
  id: 'ring-of-protection-1-35e',
  name: 'Ring of Protection +1',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 2000, currency: 'gp' },
  description: 'This ring offers continual magical protection in the form of a deflection bonus of +1 to AC.',
  requiresAttunement: false,
};

export const ringOfProtection2: Item = {
  id: 'ring-of-protection-2-35e',
  name: 'Ring of Protection +2',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 8000, currency: 'gp' },
  description: 'This ring offers continual magical protection in the form of a deflection bonus of +2 to AC.',
  requiresAttunement: false,
};

export const ringOfFeatherFalling: Item = {
  id: 'ring-of-feather-falling-35e',
  name: 'Ring of Feather Falling',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 2200, currency: 'gp' },
  description: 'This ring is activated automatically when the wearer falls. It acts exactly like the feather fall spell, activated immediately if the wearer falls more than 5 feet.',
  requiresAttunement: false,
};

export const ringOfInvisibility: Item = {
  id: 'ring-of-invisibility-35e',
  name: 'Ring of Invisibility',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 0,
  cost: { amount: 20000, currency: 'gp' },
  description: 'By activating this simple silver ring, the wearer can benefit from invisibility, as the spell. The ring can be activated at will.',
  requiresAttunement: false,
};

export const ringOfWizardry1: Item = {
  id: 'ring-of-wizardry-1-35e',
  name: 'Ring of Wizardry I',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 20000, currency: 'gp' },
  description: 'This ring doubles the number of 1st-level spells per day that an arcane spellcaster can cast.',
  requiresAttunement: false,
};

export const ringOfFreeAction: Item = {
  id: 'ring-of-free-action-35e',
  name: 'Ring of Free Action',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 40000, currency: 'gp' },
  description: 'This ring continually grants the wearer the effects of a freedom of movement spell.',
  requiresAttunement: false,
};

export const ringOfRegeneration: Item = {
  id: 'ring-of-regeneration-35e',
  name: 'Ring of Regeneration',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 0,
  cost: { amount: 90000, currency: 'gp' },
  description: 'This white gold ring continually allows a living wearer to heal 1 hit point of damage per level every hour. The ring also restores lost levels at a rate of one per day.',
  requiresAttunement: false,
};

// WANDS
export const wandOfMagicMissiles: Item = {
  id: 'wand-of-magic-missiles-35e',
  name: 'Wand of Magic Missiles',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0.0625,
  cost: { amount: 750, currency: 'gp' },
  description: 'This wand can cast magic missile (1st level, 1 missile) 50 times before it is depleted.',
  requiresAttunement: false,
};

export const wandOfCureLightWounds: Item = {
  id: 'wand-of-cure-light-wounds-35e',
  name: 'Wand of Cure Light Wounds',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0.0625,
  cost: { amount: 750, currency: 'gp' },
  description: 'This wand can cast cure light wounds (heals 1d8+1 hit points) 50 times before it is depleted.',
  requiresAttunement: false,
};

export const wandOfFireball: Item = {
  id: 'wand-of-fireball-35e',
  name: 'Wand of Fireball',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0.0625,
  cost: { amount: 11250, currency: 'gp' },
  description: 'This wand can cast fireball (5th level caster, 5d6 damage) 50 times before it is depleted.',
  requiresAttunement: false,
};

export const wandOfLightningBolt: Item = {
  id: 'wand-of-lightning-bolt-35e',
  name: 'Wand of Lightning Bolt',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0.0625,
  cost: { amount: 11250, currency: 'gp' },
  description: 'This wand can cast lightning bolt (5th level caster, 5d6 damage) 50 times before it is depleted.',
  requiresAttunement: false,
};

export const wandOfPolymorph: Item = {
  id: 'wand-of-polymorph-35e',
  name: 'Wand of Polymorph',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0.0625,
  cost: { amount: 21000, currency: 'gp' },
  description: 'This wand can cast polymorph (7th level caster) 50 times before it is depleted.',
  requiresAttunement: false,
};

// POTIONS
export const potionOfCureLightWounds: Item = {
  id: 'potion-of-cure-light-wounds-35e',
  name: 'Potion of Cure Light Wounds',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 50, currency: 'gp' },
  description: 'This potion heals 1d8+1 hit points when consumed.',
  requiresAttunement: false,
};

export const potionOfCureModerateWounds: Item = {
  id: 'potion-of-cure-moderate-wounds-35e',
  name: 'Potion of Cure Moderate Wounds',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 300, currency: 'gp' },
  description: 'This potion heals 2d8+3 hit points when consumed.',
  requiresAttunement: false,
};

export const potionOfCureSeriousWounds: Item = {
  id: 'potion-of-cure-serious-wounds-35e',
  name: 'Potion of Cure Serious Wounds',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 750, currency: 'gp' },
  description: 'This potion heals 3d8+5 hit points when consumed.',
  requiresAttunement: false,
};

export const potionOfInvisibility: Item = {
  id: 'potion-of-invisibility-35e',
  name: 'Potion of Invisibility',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 300, currency: 'gp' },
  description: 'This potion grants the drinker invisibility for 3 minutes (as the spell).',
  requiresAttunement: false,
};

export const potionOfHaste: Item = {
  id: 'potion-of-haste-35e',
  name: 'Potion of Haste',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 750, currency: 'gp' },
  description: 'This potion grants the drinker the effects of haste for 5 rounds.',
  requiresAttunement: false,
};

export const potionOfFly: Item = {
  id: 'potion-of-fly-35e',
  name: 'Potion of Fly',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 750, currency: 'gp' },
  description: 'This potion grants the drinker a fly speed of 60 feet for 5 minutes.',
  requiresAttunement: false,
};

export const potionOfHeroism: Item = {
  id: 'potion-of-heroism-35e',
  name: 'Potion of Heroism',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 750, currency: 'gp' },
  description: 'This potion grants the drinker a +2 morale bonus on attack rolls, saves, and skill checks for 50 minutes.',
  requiresAttunement: false,
};

// WONDROUS ITEMS
export const bagOfHolding1: Item = {
  id: 'bag-of-holding-1-35e',
  name: 'Bag of Holding (Type I)',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 15,
  cost: { amount: 2500, currency: 'gp' },
  description: 'This appears to be a common cloth sack about 2 feet by 4 feet in size. The bag of holding opens into a nondimensional space: Its inside is larger than its outside dimensions. It can hold up to 250 pounds, not exceeding a volume of 30 cubic feet.',
  requiresAttunement: false,
};

export const cloakOfResistance1: Item = {
  id: 'cloak-of-resistance-1-35e',
  name: 'Cloak of Resistance +1',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 1000, currency: 'gp' },
  description: 'These garments offer magic protection in the form of a +1 resistance bonus on all saving throws (Fortitude, Reflex, and Will).',
  requiresAttunement: false,
};

export const bootsOfSpeed: Item = {
  id: 'boots-of-speed-35e',
  name: 'Boots of Speed',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 12000, currency: 'gp' },
  description: 'As a free action, the wearer can click her heels together, letting her act as though affected by a haste spell for up to 10 rounds each day. The duration need not be consecutive rounds.',
  requiresAttunement: false,
};

export const amuletOfNaturalArmor1: Item = {
  id: 'amulet-of-natural-armor-1-35e',
  name: 'Amulet of Natural Armor +1',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 2000, currency: 'gp' },
  description: 'This amulet toughens the wearer\'s body and flesh, giving him an enhancement bonus to his natural armor of +1.',
  requiresAttunement: false,
};

export const bracersOfArmor1: Item = {
  id: 'bracers-of-armor-1-35e',
  name: 'Bracers of Armor +1',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 1000, currency: 'gp' },
  description: 'These items appear to be wrist or arm guards. They surround the wearer with an invisible but tangible field of force, granting him an armor bonus of +1.',
  requiresAttunement: false,
};

export const pearlOfPower1: Item = {
  id: 'pearl-of-power-1-35e',
  name: 'Pearl of Power (1st level)',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 1000, currency: 'gp' },
  description: 'This seemingly normal pearl of average size and luster is a potent aid to all spellcasters who prepare spells. Once per day, a spellcaster may recall any one 1st-level spell that she had prepared and then cast.',
  requiresAttunement: false,
};

export const ringOfProtection3: Item = {
  id: 'ring-of-protection-3-35e',
  name: 'Ring of Protection +3',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 18000, currency: 'gp' },
  description: 'This ring offers continual magical protection in the form of a deflection bonus of +3 to AC.',
  requiresAttunement: false,
};

export const ringOfSpellStoring: Item = {
  id: 'ring-of-spell-storing-35e',
  name: 'Ring of Spell Storing',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 50000, currency: 'gp' },
  description: 'This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time.',
  requiresAttunement: false,
};

export const ringOfTelekinesis: Item = {
  id: 'ring-of-telekinesis-35e',
  name: 'Ring of Telekinesis',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 0,
  cost: { amount: 75000, currency: 'gp' },
  description: 'The wearer can use telekinesis on command. This functions as the telekinesis spell with a caster level of 13th.',
  requiresAttunement: false,
};

export const rodOfAbsorption: Item = {
  id: 'rod-of-absorption-35e',
  name: 'Rod of Absorption',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 5,
  cost: { amount: 50000, currency: 'gp' },
  description: 'This rod acts as a magnet, drawing spells or spell-like abilities into itself. The magic absorbed must be a single-target spell or a ray directed at either the character possessing the rod or her gear. The rod absorbs a maximum of 50 spell levels and can thereafter only be used as a +2 quarterstaff.',
  requiresAttunement: false,
};

export const rodOfCancellation: Item = {
  id: 'rod-of-cancellation-35e',
  name: 'Rod of Cancellation',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 5,
  cost: { amount: 11000, currency: 'gp' },
  description: 'This dreaded rod is a bane to magic items, for its touch drains an item of all magical properties. The item touched must make a DC 23 Will save to prevent the rod from draining it. If a creature is holding the item at the time, then the item can use the holder\'s Will save bonus in place of its own if the holder\'s is better. Upon draining an item, the rod itself becomes brittle and useless.',
  requiresAttunement: false,
};

export const rodOfLordlyMight: Item = {
  id: 'rod-of-lordly-might-35e',
  name: 'Rod of Lordly Might',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'legendary',
  weight: 10,
  cost: { amount: 70000, currency: 'gp' },
  description: 'This rod has functions that are spell-like, and it can also be used as a magic weapon of various sorts. It also has several more mundane uses. The following spell-like functions of the rod can each be used once per day: hold person, fear, and deal 2d4 hit points of damage.',
  requiresAttunement: false,
};

export const rodOfRulership: Item = {
  id: 'rod-of-rulership-35e',
  name: 'Rod of Rulership',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 8,
  cost: { amount: 60000, currency: 'gp' },
  description: 'This rod looks like a royal scepter worth at least 5,000 gp in materials and workmanship alone. The wielder can command the obedience and fealty of creatures within 120 feet when she activates the device. Creatures totaling 300 Hit Dice can be ruled, but creatures with Intelligence scores of 12 or higher are entitled to a Will save (DC 16) to negate the effect.',
  requiresAttunement: false,
};

export const staffOfFire: Item = {
  id: 'staff-of-fire-35e',
  name: 'Staff of Fire',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 5,
  cost: { amount: 17750, currency: 'gp' },
  description: 'This staff allows use of the following spells: Burning hands (1 charge), Fireball (1 charge), Wall of fire (2 charges). The staff holds 10 charges and regains 1d6+4 charges each day.',
  requiresAttunement: false,
};

export const staffOfFrost: Item = {
  id: 'staff-of-frost-35e',
  name: 'Staff of Frost',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 5,
  cost: { amount: 56250, currency: 'gp' },
  description: 'This staff allows use of the following spells: Ice storm (1 charge), Wall of ice (1 charge), Cone of cold (2 charges). The staff holds 10 charges and regains 1d6+4 charges each day.',
  requiresAttunement: false,
};

export const staffOfHealing: Item = {
  id: 'staff-of-healing-35e',
  name: 'Staff of Healing',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 5,
  cost: { amount: 27750, currency: 'gp' },
  description: 'This staff allows use of the following spells: Cure light wounds (1 charge), Cure moderate wounds (1 charge), Cure serious wounds (2 charges), Cure critical wounds (3 charges). The staff holds 10 charges and regains 1d6+4 charges each day.',
  requiresAttunement: false,
};

export const staffOfPower: Item = {
  id: 'staff-of-power-35e',
  name: 'Staff of Power',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'very-rare',
  weight: 5,
  cost: { amount: 211000, currency: 'gp' },
  description: 'The staff of power is a very potent magic item, with offensive and defensive abilities. It is usually topped with a glistening gem. The staff allows use of the following spells: Magic missile (1 charge), Ray of enfeeblement (1 charge), Continual flame (1 charge), Levitate (1 charge), Lightning bolt (1 charge), Fireball (1 charge), Cone of cold (2 charges), Hold monster (2 charges), Wall of force (2 charges), Globe of invulnerability (2 charges).',
  requiresAttunement: false,
};

export const staffOfTheWoodlands: Item = {
  id: 'staff-of-the-woodlands-35e',
  name: 'Staff of the Woodlands',
  system: 'dnd-3.5e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 5,
  cost: { amount: 101250, currency: 'gp' },
  description: 'This staff allows use of the following spells: Charm animal (1 charge), Speak with animals (1 charge), Barkskin (2 charges), Summon nature\'s ally VI (3 charges), Wall of thorns (3 charges), Animate plants (4 charges). The staff holds 10 charges and regains 1d6+4 charges each day.',
  requiresAttunement: false,
};

export const dnd35eMagicItems: Item[] = [
  ringOfProtection1,
  ringOfProtection2,
  ringOfProtection3,
  ringOfFeatherFalling,
  ringOfInvisibility,
  ringOfWizardry1,
  ringOfFreeAction,
  ringOfRegeneration,
  ringOfSpellStoring,
  ringOfTelekinesis,
  wandOfMagicMissiles,
  wandOfCureLightWounds,
  wandOfFireball,
  wandOfLightningBolt,
  wandOfPolymorph,
  potionOfCureLightWounds,
  potionOfCureModerateWounds,
  potionOfCureSeriousWounds,
  potionOfInvisibility,
  potionOfHaste,
  potionOfFly,
  potionOfHeroism,
  bagOfHolding1,
  cloakOfResistance1,
  bootsOfSpeed,
  amuletOfNaturalArmor1,
  bracersOfArmor1,
  pearlOfPower1,
  rodOfAbsorption,
  rodOfCancellation,
  rodOfLordlyMight,
  rodOfRulership,
  staffOfFire,
  staffOfFrost,
  staffOfHealing,
  staffOfPower,
  staffOfTheWoodlands,
];
