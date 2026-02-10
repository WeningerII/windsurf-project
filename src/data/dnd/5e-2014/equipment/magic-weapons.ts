/**
 * D&D 5e (2014) - Magic Weapons
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface MagicWeapon {
  id: string;
  name: string;
  description: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  type: 'weapon';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';
  requiresAttunement: boolean;
  weaponType: string;
  bonusToHit?: number;
  bonusToDamage?: number;
  specialProperties?: string[];
  version: string;
}

export const magicWeapons: MagicWeapon[] = [
  {
    id: 'weapon-plus-1',
    name: 'Weapon +1',
    description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 213 },
    type: 'weapon',
    rarity: 'uncommon',
    requiresAttunement: false,
    weaponType: 'any',
    bonusToHit: 1,
    bonusToDamage: 1,
    version: '1.0.0',
  },
  {
    id: 'weapon-plus-2',
    name: 'Weapon +2',
    description: 'You have a +2 bonus to attack and damage rolls made with this magic weapon.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 213 },
    type: 'weapon',
    rarity: 'rare',
    requiresAttunement: false,
    weaponType: 'any',
    bonusToHit: 2,
    bonusToDamage: 2,
    version: '1.0.0',
  },
  {
    id: 'weapon-plus-3',
    name: 'Weapon +3',
    description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 213 },
    type: 'weapon',
    rarity: 'very-rare',
    requiresAttunement: false,
    weaponType: 'any',
    bonusToHit: 3,
    bonusToDamage: 3,
    version: '1.0.0',
  },
  {
    id: 'flame-tongue',
    name: 'Flame Tongue',
    description: 'You can use a bonus action to speak this magic sword\'s command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 170 },
    type: 'weapon',
    rarity: 'rare',
    requiresAttunement: true,
    weaponType: 'longsword',
    specialProperties: ['Extra 2d6 fire damage when active', 'Sheds bright light'],
    version: '1.0.0',
  },
  {
    id: 'javelin-of-lightning',
    name: 'Javelin of Lightning',
    description: 'This javelin is a magic weapon. When you hurl it and speak its command word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a DC 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save, and half as much damage on a successful one. The lightning bolt turns back into a javelin when it reaches the target. Make a ranged weapon attack against the target. On a hit, the target takes damage from the javelin plus 4d6 lightning damage. The javelin\'s property can\'t be used again until the next dawn. In the meantime, the javelin can still be used as a magic weapon.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 179 },
    type: 'weapon',
    rarity: 'uncommon',
    requiresAttunement: false,
    weaponType: 'javelin',
    specialProperties: ['Transforms into lightning bolt', '4d6 lightning damage', 'Recharges at dawn'],
    version: '1.0.0',
  },
  {
    id: 'sword-of-sharpness',
    name: 'Sword of Sharpness',
    description: 'When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target. When you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 4d6 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target\'s limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead. In addition, you can speak the sword\'s command word to cause the blade to shed bright light in a 10-foot radius and dim light for an additional 10 feet. Speaking the command word again or sheathing the sword puts out the light.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 206 },
    type: 'weapon',
    rarity: 'very-rare',
    requiresAttunement: true,
    weaponType: 'longsword',
    specialProperties: ['Maximized damage vs objects', 'Extra 4d6 on critical', 'Limb severing', 'Light source'],
    version: '1.0.0',
  },
  {
    id: 'trident-of-fish-command',
    name: 'Trident of Fish Command',
    description: 'This trident is a magic weapon. It has 3 charges. While you carry it, you can use an action and expend 1 charge to cast dominate beast (save DC 15) from it on a beast that has an innate swimming speed. The trident regains 1d3 expended charges daily at dawn.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 209 },
    type: 'weapon',
    rarity: 'uncommon',
    requiresAttunement: true,
    weaponType: 'trident',
    specialProperties: ['3 charges', 'Cast dominate beast on aquatic creatures', 'Regains 1d3 charges at dawn'],
    version: '1.0.0',
  },
  {
    id: 'dagger-of-venom',
    name: 'Dagger of Venom',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. You can use an action to cause thick, black poison to coat the blade. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a DC 15 Constitution saving throw or take 2d10 poison damage and become poisoned for 1 minute. The dagger can\'t be used this way again until the next dawn.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 161 },
    type: 'weapon',
    rarity: 'rare',
    requiresAttunement: false,
    weaponType: 'dagger',
    bonusToHit: 1,
    bonusToDamage: 1,
    specialProperties: ['Poison coating', '2d10 poison damage', 'Poisoned condition', 'Recharges at dawn'],
    version: '1.0.0',
  },
  {
    id: 'mace-of-disruption',
    name: 'Mace of Disruption',
    description: 'When you hit a fiend or an undead with this magic weapon, that creature takes an extra 2d6 radiant damage. If the target has 25 hit points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature becomes frightened of you until the end of your next turn. While you hold this weapon, it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 179 },
    type: 'weapon',
    rarity: 'rare',
    requiresAttunement: true,
    weaponType: 'mace',
    specialProperties: ['Extra 2d6 radiant vs fiends/undead', 'Destroy low HP targets', 'Frightened on save', 'Light source'],
    version: '1.0.0',
  },
  {
    id: 'sword-of-wounding',
    name: 'Sword of Wounding',
    description: 'Hit points lost to this weapon\'s damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means. Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature\'s turns, it takes 1d4 necrotic damage for each time you\'ve wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 207 },
    type: 'weapon',
    rarity: 'rare',
    requiresAttunement: true,
    weaponType: 'longsword',
    specialProperties: ['Prevents regeneration', 'Ongoing 1d4 necrotic damage', 'Stackable wounds'],
    version: '1.0.0',
  },
];
