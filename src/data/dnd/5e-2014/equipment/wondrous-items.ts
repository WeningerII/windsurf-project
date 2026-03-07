/**
 * D&D 5e (2014) - Wondrous Items
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface WondrousItem {
  id: string;
  name: string;
  description: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  type: 'wondrous-item';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';
  requiresAttunement: boolean;
  slot?: string;
  charges?: number;
  specialProperties?: string[];
  version: string;
}

export const wondrousItems: WondrousItem[] = [
  {
    id: 'amulet-of-health',
    name: 'Amulet of Health',
    description:
      'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 150 },
    type: 'wondrous-item',
    rarity: 'rare',
    requiresAttunement: true,
    slot: 'neck',
    specialProperties: ['Sets Constitution to 19'],
    version: '1.0.0',
  },
  {
    id: 'bag-of-holding',
    name: 'Bag of Holding',
    description:
      'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action. If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum 1 minute), after which time they begin to suffocate. Placing a bag of holding inside an extradimensional space created by a handy haversack, portable hole, or similar item instantly destroys both items and opens a gate to the Astral Plane.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 153 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: false,
    specialProperties: ['500 lb capacity', '64 cubic feet volume', 'Extradimensional space'],
    version: '1.0.0',
  },
  {
    id: 'boots-of-speed',
    name: 'Boots of Speed',
    description:
      "While you wear these boots, you can use a bonus action and click the boots' heels together. If you do, the boots double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. If you click your heels together again, you end the effect. When the boots' property has been used for a total of 10 minutes, the magic ceases to function until you finish a long rest.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 155 },
    type: 'wondrous-item',
    rarity: 'rare',
    requiresAttunement: true,
    slot: 'feet',
    specialProperties: ['Double speed', 'Disadvantage on opportunity attacks', '10 min/day'],
    version: '1.0.0',
  },
  {
    id: 'cloak-of-protection',
    name: 'Cloak of Protection',
    description: 'You gain a +1 bonus to AC and saving throws while you wear this cloak.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 159 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: true,
    slot: 'shoulders',
    specialProperties: ['+1 AC', '+1 saving throws'],
    version: '1.0.0',
  },
  {
    id: 'gauntlets-of-ogre-power',
    name: 'Gauntlets of Ogre Power',
    description:
      'Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 171 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: true,
    slot: 'hands',
    specialProperties: ['Sets Strength to 19'],
    version: '1.0.0',
  },
  {
    id: 'headband-of-intellect',
    name: 'Headband of Intellect',
    description:
      'Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 173 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: true,
    slot: 'head',
    specialProperties: ['Sets Intelligence to 19'],
    version: '1.0.0',
  },
  {
    id: 'immovable-rod',
    name: 'Immovable Rod',
    description:
      "This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can use an action to make a DC 30 Strength check, moving the fixed rod up to 10 feet on a success.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 175 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: false,
    specialProperties: ['Fixed in place', 'Holds 8,000 lbs', 'DC 30 Strength to move'],
    version: '1.0.0',
  },
  {
    id: 'ring-of-protection',
    name: 'Ring of Protection',
    description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 191 },
    type: 'wondrous-item',
    rarity: 'rare',
    requiresAttunement: true,
    slot: 'ring',
    specialProperties: ['+1 AC', '+1 saving throws'],
    version: '1.0.0',
  },
  {
    id: 'ring-of-invisibility',
    name: 'Ring of Invisibility',
    description:
      'While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 191 },
    type: 'wondrous-item',
    rarity: 'legendary',
    requiresAttunement: true,
    slot: 'ring',
    specialProperties: ['Invisibility at will', 'Ends on attack or spell'],
    version: '1.0.0',
  },
  {
    id: 'ring-of-spell-storing',
    name: 'Ring of Spell Storing',
    description:
      "This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 − 1 levels of stored spells chosen by the GM. Any creature can cast a spell of 1st through 5th level into the ring by touching the ring as the spell is cast. The spell has no effect, other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses. While wearing this ring, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster, but is otherwise treated as if you cast the spell. The spell cast from the ring is no longer stored in it, freeing up space.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 192 },
    type: 'wondrous-item',
    rarity: 'rare',
    requiresAttunement: true,
    slot: 'ring',
    specialProperties: ['Store up to 5 spell levels', 'Cast stored spells'],
    version: '1.0.0',
  },
  {
    id: 'rope-of-climbing',
    name: 'Rope of Climbing',
    description:
      'This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination you choose. That end moves 10 feet on your turn when you first command it and 10 feet on each of your turns until reaching its destination, up to its maximum length away, or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying. If you tell the rope to knot, large knots appear at 1-foot intervals along the rope. While knotted, the rope shortens to a 50-foot length and grants advantage on checks made to climb it. The rope has AC 20 and 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 197 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: false,
    specialProperties: ['Animates on command', 'Self-knotting', 'Advantage on climb checks'],
    version: '1.0.0',
  },
  {
    id: 'wand-of-magic-missiles',
    name: 'Wand of Magic Missiles',
    description:
      "This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the magic missile spell from it. For 1 charge, you cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 211 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: false,
    charges: 7,
    specialProperties: [
      'Cast magic missile',
      'Scale with charges',
      'Regains 1d6+1 charges at dawn',
    ],
    version: '1.0.0',
  },
  {
    id: 'wand-of-fireballs',
    name: 'Wand of Fireballs',
    description:
      "This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the fireball spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 210 },
    type: 'wondrous-item',
    rarity: 'rare',
    requiresAttunement: false,
    charges: 7,
    specialProperties: ['Cast fireball', 'Scale with charges', 'Regains 1d6+1 charges at dawn'],
    version: '1.0.0',
  },
  {
    id: 'boots-of-elvenkind',
    name: 'Boots of Elvenkind',
    description:
      'While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 155 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: false,
    slot: 'feet',
    specialProperties: ['Silent movement', 'Advantage on Stealth checks'],
    version: '1.0.0',
  },
  {
    id: 'cloak-of-elvenkind',
    name: 'Cloak of Elvenkind',
    description:
      "While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you. Pulling the hood up or down requires an action.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 158 },
    type: 'wondrous-item',
    rarity: 'uncommon',
    requiresAttunement: true,
    slot: 'shoulders',
    specialProperties: ['Disadvantage to see you', 'Advantage on Stealth', 'Camouflage'],
    version: '1.0.0',
  },
];
