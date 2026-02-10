// D&D 3.5e Enhanced Combat Feats with Detailed Mechanics
// SRD-compliant feats with comprehensive descriptions

import { FeatDefinition } from '../../../../types/character-options/feats';

export const powerAttack: FeatDefinition = {
  id: 'power-attack-35e',
  name: 'Power Attack',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [{ type: 'attribute', ability: 'str', value: 13 }],
  description: 'You can make exceptionally deadly melee attacks by sacrificing accuracy for power.',
  benefits: [
    'On your action, before making attack rolls for a round, you may choose to subtract a number from all melee attack rolls and add the same number to all melee damage rolls',
    'This number may not exceed your base attack bonus',
    'The penalty on attacks and bonus on damage apply until your next turn',
    'If you attack with a two-handed weapon, or with a one-handed weapon wielded in two hands, you add twice the number subtracted from attack rolls to damage rolls',
    'If you attack with an off-hand weapon, you add only half the number subtracted from attack rolls (round down)',
  ],
  special: 'A fighter may select Power Attack as one of his fighter bonus feats.',
};

export const cleave: FeatDefinition = {
  id: 'cleave-35e',
  name: 'Cleave',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'attribute', ability: 'str', value: 13 },
    { type: 'other', description: 'Power Attack' },
  ],
  description: 'You can follow through with powerful blows.',
  benefits: [
    'If you deal a creature enough damage to make it drop (typically by dropping it to below 0 hit points or killing it), you get an immediate, extra melee attack against another creature within reach',
    'You cannot take a 5-foot step before making this extra attack',
    'The extra attack is with the same weapon and at the same bonus as the attack that dropped the previous creature',
    'You can use this ability once per round',
  ],
  special: 'A fighter may select Cleave as one of his fighter bonus feats.',
};

export const greatCleave: FeatDefinition = {
  id: 'great-cleave-35e',
  name: 'Great Cleave',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'attribute', ability: 'str', value: 13 },
    { type: 'other', description: 'Power Attack, Cleave, base attack bonus +4' },
  ],
  description: 'You can wield a melee weapon with such power that you can strike multiple times when you fell your foes.',
  benefits: [
    'This feat works like Cleave, except that there is no limit to the number of times you can use it per round',
    'Each time you drop an enemy, you can make an additional attack against another creature within reach',
  ],
  special: 'A fighter may select Great Cleave as one of his fighter bonus feats.',
};

export const combatReflexes: FeatDefinition = {
  id: 'combat-reflexes-35e',
  name: 'Combat Reflexes',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can respond quickly and repeatedly to opponents who let their defenses down.',
  benefits: [
    'You may make a number of additional attacks of opportunity equal to your Dexterity bonus',
    'With this feat, you may also make attacks of opportunity while flat-footed',
    'Normal: A character without this feat can make only one attack of opportunity per round and can\'t make attacks of opportunity while flat-footed',
  ],
  special: 'A fighter may select Combat Reflexes as one of his fighter bonus feats. The Combat Reflexes feat does not allow a rogue to use her opportunist ability more than once per round.',
};

export const improvedInitiative: FeatDefinition = {
  id: 'improved-initiative-35e',
  name: 'Improved Initiative',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can react more quickly than normal in a fight.',
  benefits: [
    'You get a +4 bonus on initiative checks',
  ],
  special: 'A fighter may select Improved Initiative as one of his fighter bonus feats.',
};

export const weaponFocus: FeatDefinition = {
  id: 'weapon-focus-35e',
  name: 'Weapon Focus',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'other', description: 'Proficiency with weapon, base attack bonus +1' },
  ],
  description: 'You are especially good at using your chosen weapon.',
  benefits: [
    'Choose one type of weapon (such as longsword or greataxe)',
    'You gain a +1 bonus on all attack rolls you make using the selected weapon',
  ],
  special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new weapon. A fighter may select Weapon Focus as one of his fighter bonus feats. He must have Weapon Focus with a weapon to gain the Weapon Specialization feat for that weapon.',
};

export const weaponSpecialization: FeatDefinition = {
  id: 'weapon-specialization-35e',
  name: 'Weapon Specialization',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'other', description: 'Proficiency with weapon, Weapon Focus with weapon, fighter level 4th' },
  ],
  description: 'You deal extra damage when using your chosen weapon.',
  benefits: [
    'Choose one type of weapon for which you have already selected Weapon Focus',
    'You gain a +2 bonus on all damage rolls you make using the selected weapon',
  ],
  special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new weapon. A fighter must have Weapon Specialization with a weapon to gain the Greater Weapon Focus feat for that weapon.',
};

export const improvedCritical: FeatDefinition = {
  id: 'improved-critical-35e',
  name: 'Improved Critical',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'other', description: 'Proficiency with weapon, base attack bonus +8' },
  ],
  description: 'Your attacks with your chosen weapon are more likely to be critical hits.',
  benefits: [
    'Choose one type of weapon',
    'The critical threat range for that weapon is doubled',
    'For example, a longsword\'s threat range of 19-20 becomes 17-20, and a rapier\'s threat range of 18-20 becomes 15-20',
    'This effect doesn\'t stack with any other effect that expands the threat range of a weapon',
  ],
  special: 'You can gain Improved Critical multiple times. The effects do not stack. Each time you take the feat, it applies to a new weapon. A fighter may select Improved Critical as one of his fighter bonus feats. A fighter must be at least 8th level to select this feat.',
};

export const twoWeaponFighting: FeatDefinition = {
  id: 'two-weapon-fighting-35e',
  name: 'Two-Weapon Fighting',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'attribute', ability: 'dex', value: 15 },
  ],
  description: 'You can fight with a weapon in each hand.',
  benefits: [
    'Your penalties on attack rolls for fighting with two weapons are reduced',
    'The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6',
    'Normal: If you wield a second weapon in your off hand, you can get one extra attack per round with that weapon. Without this feat, you take a -6 penalty with your regular attack with your primary hand and a -10 penalty to the attack with your off hand. If your off-hand weapon is light, the penalties are reduced by 2 each',
  ],
  special: 'A 2nd-level ranger who has chosen the two-weapon combat style is treated as having Two-Weapon Fighting, even if he does not have the prerequisite for it, but only when he is wearing light or no armor. A fighter may select Two-Weapon Fighting as one of his fighter bonus feats.',
};

export const improvedTwoWeaponFighting: FeatDefinition = {
  id: 'improved-two-weapon-fighting-35e',
  name: 'Improved Two-Weapon Fighting',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'attribute', ability: 'dex', value: 17 },
    { type: 'other', description: 'Two-Weapon Fighting, base attack bonus +6' },
  ],
  description: 'You are an expert in fighting two-handed.',
  benefits: [
    'In addition to the standard single extra attack you get with an off-hand weapon, you get a second attack with it, albeit at a -5 penalty',
    'Normal: Without this feat, you can only get a single extra attack with an off-hand weapon',
  ],
  special: 'A 6th-level ranger who has chosen the two-weapon combat style is treated as having Improved Two-Weapon Fighting, even if he does not have the prerequisite for it, but only when he is wearing light or no armor. A fighter may select Improved Two-Weapon Fighting as one of his fighter bonus feats.',
};

export const rapidShot: FeatDefinition = {
  id: 'rapid-shot-35e',
  name: 'Rapid Shot',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'attribute', ability: 'dex', value: 13 },
    { type: 'other', description: 'Point Blank Shot' },
  ],
  description: 'You can use ranged weapons with exceptional speed.',
  benefits: [
    'When making a full attack action with a ranged weapon, you can fire one additional time this round',
    'All of your attack rolls take a -2 penalty when using Rapid Shot',
  ],
  special: 'A 2nd-level ranger who has chosen the archery combat style is treated as having Rapid Shot, even if he does not have the prerequisite for it, but only when he is wearing light or no armor. A fighter may select Rapid Shot as one of his fighter bonus feats.',
};

export const pointBlankShot: FeatDefinition = {
  id: 'point-blank-shot-35e',
  name: 'Point Blank Shot',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You are skilled at making well-placed shots with ranged weapons at close range.',
  benefits: [
    'You get a +1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet',
  ],
  special: 'A fighter may select Point Blank Shot as one of his fighter bonus feats.',
};

export const preciseShot: FeatDefinition = {
  id: 'precise-shot-35e',
  name: 'Precise Shot',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'other', description: 'Point Blank Shot' },
  ],
  description: 'You are skilled at timing and aiming ranged attacks.',
  benefits: [
    'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard -4 penalty on your attack roll',
    'Normal: When you use a ranged weapon while an opponent is engaged in melee with an ally, you take a -4 penalty on your attack roll because you have to be careful not to hit your ally',
  ],
  special: 'A fighter may select Precise Shot as one of his fighter bonus feats.',
};

export const dnd35eEnhancedCombatFeats: FeatDefinition[] = [
  powerAttack,
  cleave,
  greatCleave,
  combatReflexes,
  improvedInitiative,
  weaponFocus,
  weaponSpecialization,
  improvedCritical,
  twoWeaponFighting,
  improvedTwoWeaponFighting,
  rapidShot,
  pointBlankShot,
  preciseShot,
];
