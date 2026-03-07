// D&D 5e (2024) General Feats - SRD 5.2

import { FeatDefinition } from '../../../../types/character-options/feats';

export const abilityScoreImprovement: FeatDefinition = {
  id: 'ability-score-improvement',
  name: 'Ability Score Improvement',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 2, maxPerAttribute: 2 },
  description: 'You increase your abilities.',
  benefits: [
    "Increase one ability score by 2, or increase two ability scores by 1 each. You can't increase an ability score above 20 using this feat.",
  ],
};

export const actor: FeatDefinition = {
  id: 'actor',
  name: 'Actor',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'cha', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { charisma: 1 } },
  description: 'Skilled at mimicry and dramatics, you gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Charisma by 1, to a maximum of 20.',
    "Impersonation: While you're disguised as a fictional person or a real person other than yourself, you have Advantage on Charisma (Performance) checks to convince others that you are that person.",
    'Mimicry: You can mimic the sounds of other creatures, including speech. To mimic a sound, you must have heard it for at least 1 minute.',
  ],
};

export const athlete: FeatDefinition = {
  id: 'athlete',
  name: 'Athlete',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description:
    'You have undergone extensive physical training, granting you the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Climb Speed: You gain a Climb Speed equal to your Speed.',
    'Hop Up: When you have the Prone condition, you can right yourself as part of your move rather than using half your movement.',
  ],
};

export const charger: FeatDefinition = {
  id: 'charger',
  name: 'Charger',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You have trained to charge headlong into battle, gaining the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Constitution by 1, to a maximum of 20.',
    'Improved Dash: When you take the Dash action, your Speed increases by 10 feet for that action.',
    'Charge Attack: If you move at least 10 feet in a straight line toward a target immediately before hitting it with a melee attack as part of the Attack action, the target takes an extra 1d8 damage from the attack.',
  ],
};

export const crossbowExpert: FeatDefinition = {
  id: 'crossbow-expert',
  name: 'Crossbow Expert',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'dex', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { dexterity: 1 } },
  description: 'Thanks to extensive practice with crossbows, you gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Dexterity by 1, to a maximum of 20.',
    'Ignore Loading: You ignore the Loading property of crossbows.',
    "Firing in Melee: Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with crossbows.",
    'Dual Wielding: When you make the extra attack of the Light property, you can add your ability modifier to the damage of the extra attack if that attack is made with a crossbow that has the Light property.',
  ],
};

export const crusher: FeatDefinition = {
  id: 'crusher',
  name: 'Crusher',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You are practiced in crushing your enemies, granting you the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Constitution by 1, to a maximum of 20.',
    'Push: Once per turn, when you hit a creature with an attack that deals Bludgeoning damage, you can move it 5 feet to an unoccupied space if the target is no more than one size larger than you.',
    'Enhanced Critical: When you score a Critical Hit that deals Bludgeoning damage, attack rolls against that creature have Advantage until the start of your next turn.',
  ],
};

export const defensiveDuelist: FeatDefinition = {
  id: 'defensive-duelist',
  name: 'Defensive Duelist',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'dex', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { dexterity: 1 } },
  description: 'You can skillfully defend yourself against melee attacks.',
  benefits: [
    'Ability Score Increase: Increase your Dexterity by 1, to a maximum of 20.',
    "Parry: If you're holding a Finesse weapon and a creature hits you with a melee attack, you can take a Reaction to add your Proficiency Bonus to your AC against that attack, potentially causing it to miss.",
  ],
};

export const dualWielder: FeatDefinition = {
  id: 'dual-wielder',
  name: 'Dual Wielder',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You master fighting with two weapons, gaining the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Enhanced Dual Wielding: When you take the Attack action and attack with a weapon that has the Light property, you can make one extra attack as a Bonus Action later on the same turn with a different weapon, which must be a Melee weapon that lacks the Two-Handed property.',
    'Quick Draw: You can draw or stow two weapons that lack the Two-Handed property when you would normally be able to draw or stow only one.',
  ],
};

export const durable: FeatDefinition = {
  id: 'durable',
  name: 'Durable',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { constitution: 1 } },
  description: 'Hardy and resilient, you gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Constitution by 1, to a maximum of 20.',
    'Defy Death: You have Advantage on Death Saving Throws.',
    'Speedy Recovery: As a Bonus Action, you can expend one of your Hit Point Dice, roll the die, and regain a number of Hit Points equal to the roll plus your Constitution modifier.',
  ],
};

export const elemental_adept: FeatDefinition = {
  id: 'elemental-adept',
  name: 'Elemental Adept',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Spellcasting or Pact Magic feature' },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have focused your spellcasting on one element, gaining the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Energy Mastery: Choose one damage type: Acid, Cold, Fire, Lightning, or Thunder. Spells you cast ignore Resistance to damage of the chosen type. When you roll damage for a spell that deals damage of that type, you can treat any 1 on a damage die as a 2.',
    'Repeatable: You can select this feat multiple times, choosing a different damage type each time.',
  ],
};

export const fey_touched: FeatDefinition = {
  id: 'fey-touched',
  name: 'Fey Touched',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: "Your exposure to the Feywild's magic has granted you the following benefits.",
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Fey Magic: You learn the Misty Step spell and one level 1 spell of your choice from the Divination or Enchantment school. You can cast each spell once without a spell slot, and you regain the ability when you finish a Long Rest. You can also cast these spells using spell slots you have.',
  ],
};

export const grappler: FeatDefinition = {
  id: 'grappler',
  name: 'Grappler',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description:
    'You have developed the skills necessary to hold your own in close-quarters grappling.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Punch and Grab: When you hit a creature with an Unarmed Strike as part of the Attack action, you can use both the Damage and the Grapple option.',
    'Attack Advantage: You have Advantage on attack rolls against a creature you have Grappled.',
  ],
};

export const greatWeaponMaster: FeatDefinition = {
  id: 'great-weapon-master',
  name: 'Great Weapon Master',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: "You've learned to use the weight of a weapon to your advantage.",
  benefits: [
    'Ability Score Increase: Increase your Strength by 1, to a maximum of 20.',
    'Heavy Weapon Mastery: When you hit a creature with a weapon that has the Heavy property as part of the Attack action, you can cause the weapon to deal extra damage equal to your Proficiency Bonus.',
    'Hew: Immediately after you score a Critical Hit with a Melee weapon or reduce a creature to 0 HP with one, you can make one attack with the same weapon as a Bonus Action.',
  ],
};

export const heavilyArmored: FeatDefinition = {
  id: 'heavily-armored',
  name: 'Heavily Armored',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Medium Armor Training' },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { armor: ['heavy armor'] },
  description: 'You have trained to master the use of heavy armor.',
  benefits: [
    'Ability Score Increase: Increase your Constitution or Strength by 1, to a maximum of 20.',
    'Armor Training: You gain Heavy Armor Training.',
  ],
};

export const inspiring_leader: FeatDefinition = {
  id: 'inspiring-leader',
  name: 'Inspiring Leader',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'wis', value: 13 },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description:
    'You can spend 10 minutes inspiring your companions, shoring up their resolve to fight.',
  benefits: [
    'Ability Score Increase: Increase your Wisdom or Charisma by 1, to a maximum of 20.',
    'Encouraging Performance: At the end of a Short or Long Rest, you can give an inspiring performance. When you do so, choose up to six friendly creatures within 30 feet. Each gains Temporary HP equal to your level plus your Charisma or Wisdom modifier.',
  ],
};

export const keen_mind: FeatDefinition = {
  id: 'keen-mind',
  name: 'Keen Mind',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  proficienciesGranted: { skills: ['one Intelligence skill of your choice'] },
  description: 'You have trained your mind for quick and accurate recall.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence by 1, to a maximum of 20.',
    'Skill Proficiency: You gain proficiency in one of the following skills of your choice: Arcana, History, Investigation, Nature, or Religion.',
    'Quick Study: You can use a Study action to make an Intelligence check to recall information.',
    'Lore Knowledge: Once per Short or Long Rest, when you make an Intelligence check, you can give yourself a bonus equal to your Proficiency Bonus.',
  ],
};

export const mage_slayer: FeatDefinition = {
  id: 'mage-slayer',
  name: 'Mage Slayer',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You have practiced techniques useful in melee combat against spellcasters.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Concentration Breaker: When you damage a creature that is concentrating, it has Disadvantage on the saving throw to maintain Concentration.',
    "Guarded Mind: If you fail an Intelligence, a Wisdom, or a Charisma saving throw, you can cause yourself to succeed instead. Once you use this benefit, you can't use it again until you finish a Short or Long Rest.",
  ],
};

export const mobile: FeatDefinition = {
  id: 'mobile',
  name: 'Mobile',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'dex', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { dexterity: 1 } },
  description: 'You are exceptionally speedy and agile.',
  benefits: [
    'Ability Score Increase: Increase your Dexterity or Constitution by 1, to a maximum of 20.',
    'Speed Increase: Your Speed increases by 10 feet.',
    "Dash over Difficult Terrain: When you take the Dash action, Difficult Terrain doesn't cost you extra movement for the rest of the current turn.",
    "Agile Footwork: When you make a melee attack against a creature, you don't provoke Opportunity Attacks from that creature for the rest of the turn.",
  ],
};

export const mounted_combatant: FeatDefinition = {
  id: 'mounted-combatant',
  name: 'Mounted Combatant',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You are a dangerous foe to face while mounted.',
  benefits: [
    'Ability Score Increase: Increase your Strength, Dexterity, or Wisdom by 1, to a maximum of 20.',
    'Mount Handler: You have Advantage on Wisdom (Animal Handling) checks made to handle or train horses and other Beasts used as mounts.',
    'Mounted Strike: While mounted, you have Advantage on attack rolls against any unmounted creature that is within 5 feet of your mount and at least one size smaller than it.',
    'Leap Aside: If your mount is subjected to an effect that allows it to make a Dexterity saving throw, it instead takes no damage if it succeeds and only half damage if it fails.',
    "Veer: While mounted, you can force an attack that hits your mount to hit you instead, provided you don't have the Incapacitated condition.",
  ],
};

export const observant: FeatDefinition = {
  id: 'observant',
  name: 'Observant',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  description: 'Quick to notice details, you gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence or Wisdom by 1, to a maximum of 20.',
    'Keen Observer: Choose one: You gain Proficiency in the Insight, Investigation, or Perception skill. Or if you have Proficiency in that skill, you gain Expertise.',
    'Quick Search: You can take the Search action as a Bonus Action.',
  ],
};

export const polearmMaster: FeatDefinition = {
  id: 'polearm-master',
  name: 'Polearm Master',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You have trained to master weapons with reach.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Bonus Attack: When you take the Attack action and attack with only a Quarterstaff, Spear, or weapon with the Heavy and Reach properties, you can use a Bonus Action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack and deals 1d4 Bludgeoning damage.',
    "Reactive Strike: While you're holding one of these weapons, you can take a Reaction to make a melee attack against a creature that enters your reach.",
  ],
};

export const resilient: FeatDefinition = {
  id: 'resilient',
  name: 'Resilient',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You choose one ability and gain benefits for it.',
  benefits: [
    'Ability Score Increase: Increase any ability score by 1, to a maximum of 20.',
    'Saving Throw Proficiency: You gain Saving Throw Proficiency with the ability chosen.',
  ],
};

export const sentinel: FeatDefinition = {
  id: 'sentinel',
  name: 'Sentinel',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'str', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: "You have mastered techniques to take advantage of every drop in a foe's guard.",
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Guardian: Immediately after a creature within 5 feet of you takes the Disengage action or hits a target other than you with an attack, you can make an Opportunity Attack against that creature.',
    "Halt: When you hit a creature with an Opportunity Attack, the creature's Speed becomes 0 for the rest of the turn.",
  ],
};

export const sharpshooter: FeatDefinition = {
  id: 'sharpshooter',
  name: 'Sharpshooter',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'dex', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { dexterity: 1 } },
  description: 'You have mastered ranged weapons.',
  benefits: [
    'Ability Score Increase: Increase your Dexterity by 1, to a maximum of 20.',
    'Bypass Cover: Your ranged attacks with weapons ignore Half Cover and Three-Quarters Cover.',
    "Firing in Melee: Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with Ranged weapons.",
    "Long Shots: Attacking at long range doesn't impose Disadvantage on your attack rolls with Ranged weapons.",
  ],
};

export const shield_master: FeatDefinition = {
  id: 'shield-master',
  name: 'Shield Master',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Shield Training' },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You use shields not just for protection but also for offense.',
  benefits: [
    'Ability Score Increase: Increase your Strength by 1, to a maximum of 20.',
    'Shield Bash: If you attack a creature within 5 feet as part of the Attack action and hit with a Melee weapon, you can immediately bash the target with your shield and force it to make a Strength saving throw (DC = 8 + your Strength modifier + your Proficiency Bonus). On a failed save, you either push the target 5 feet or cause it to have the Prone condition.',
    "Interpose Shield: If you're subject to an effect allowing a Dexterity save for half damage, you can take a Reaction to take no damage if you succeed, interposing your shield.",
  ],
};

export const skulker: FeatDefinition = {
  id: 'skulker',
  name: 'Skulker',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'dex', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { dexterity: 1 } },
  description: 'You are an expert at slinking through shadows.',
  benefits: [
    'Ability Score Increase: Increase your Dexterity by 1, to a maximum of 20.',
    'Blindsight: You gain Blindsight with a range of 10 feet.',
    "Fog of War: You are Heavily Obscured to others while in Dim Light or Darkness, and you don't reveal your position by missing a ranged attack.",
    "Sniper: If you make an attack roll while Hidden and the roll misses, making the attack doesn't reveal your position.",
  ],
};

export const speedy: FeatDefinition = {
  id: 'speedy',
  name: 'Speedy',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'dex', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { dexterity: 1 } },
  description: 'You are extraordinarily fast.',
  benefits: [
    'Ability Score Increase: Increase your Dexterity or Constitution by 1, to a maximum of 20.',
    'Speed Increase: Your Speed increases by 10 feet.',
    "Dash over Difficult Terrain: When you take the Dash action on your turn, Difficult Terrain doesn't cost you extra movement for the rest of that turn.",
    'Agile Movement: Opportunity Attacks have Disadvantage against you.',
  ],
};

export const spellSniper: FeatDefinition = {
  id: 'spell-sniper',
  name: 'Spell Sniper',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Spellcasting or Pact Magic feature' },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have trained to cast spells that shoot at distant or obscured targets.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Bypass Cover: Your spell attacks ignore Half Cover and Three-Quarters Cover.',
    "Casting in Melee: Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with spells.",
    "Increased Range: When you cast a spell that has a range of at least 10 feet and requires you to make an attack roll, you can increase the spell's range by 60 feet.",
  ],
};

export const warCaster: FeatDefinition = {
  id: 'war-caster',
  name: 'War Caster',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Spellcasting or Pact Magic feature' },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have practiced casting spells in the midst of combat.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Concentration: You have Advantage on Constitution saving throws to maintain Concentration.',
    'Reactive Spell: When a creature provokes an Opportunity Attack from you by leaving your reach, you can take a Reaction to cast a spell at the creature. The spell must have a casting time of 1 action and must target only that creature.',
    'Somatic Components: You can perform the Somatic components of spells even when you have weapons or a Shield in one or both hands.',
  ],
};

export const lightly_armored: FeatDefinition = {
  id: 'lightly-armored',
  name: 'Lightly Armored',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { armor: ['light armor'] },
  description: 'You have trained to use light armor effectively.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Armor Training: You gain Light Armor Training.',
  ],
};

export const moderately_armored: FeatDefinition = {
  id: 'moderately-armored',
  name: 'Moderately Armored',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Light Armor Training' },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { armor: ['medium armor', 'shields'] },
  description: 'You have trained to use medium armor and shields.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Armor Training: You gain Medium Armor and Shield Training.',
  ],
};

export const weapon_master: FeatDefinition = {
  id: 'weapon-master',
  name: 'Weapon Master',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { weapons: ['four weapons of your choice'] },
  description: 'You have practiced extensively with a variety of weapons.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Weapon Proficiency: You gain proficiency with four weapons of your choice. Each one must be a Simple or a Martial weapon.',
  ],
};

export const linguist: FeatDefinition = {
  id: 'linguist',
  name: 'Linguist',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  proficienciesGranted: { languages: ['three languages of your choice'] },
  description: 'You have studied languages and codes.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence by 1, to a maximum of 20.',
    'Languages: You learn three languages of your choice.',
    "Ciphers: You can create written ciphers. Others can't decipher your code unless you teach them, or they succeed on an Intelligence check (DC = your Intelligence score + your Proficiency Bonus).",
  ],
};

export const dungeon_delver: FeatDefinition = {
  id: 'dungeon-delver',
  name: 'Dungeon Delver',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  description: 'Alert to the hidden traps and secret doors in many dungeons.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence or Wisdom by 1, to a maximum of 20.',
    'Advantage on Perception and Investigation checks to detect secret doors.',
    'Advantage on saving throws to avoid or resist traps.',
    'Resistance to damage dealt by traps.',
    'You can search for traps while traveling at a normal pace instead of a slow pace.',
  ],
};

export const magic_initiate_ranger: FeatDefinition = {
  id: 'magic-initiate-ranger',
  name: 'Magic Initiate (Ranger)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have learned magic from the Ranger tradition.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Two Cantrips: You learn two cantrips from the Ranger spell list.',
    'Level 1 Spell: You learn one level 1 spell from the Ranger spell list. You can cast it once without expending a spell slot, and you regain the ability when you finish a Long Rest.',
  ],
};

export const magic_initiate_paladin: FeatDefinition = {
  id: 'magic-initiate-paladin',
  name: 'Magic Initiate (Paladin)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have learned magic from the Paladin tradition.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Two Cantrips: You learn two cantrips from the Paladin spell list.',
    'Level 1 Spell: You learn one level 1 spell from the Paladin spell list. You can cast it once without expending a spell slot, and you regain the ability when you finish a Long Rest.',
  ],
};

export const piercer: FeatDefinition = {
  id: 'piercer',
  name: 'Piercer',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You have achieved mastery with piercing weapons.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    "Reroll Damage: Once per turn when you hit with an attack that deals Piercing damage, you can reroll one of the attack's damage dice, and you must use the new roll.",
    'Enhanced Critical: When you score a Critical Hit that deals Piercing damage, you can roll one additional damage die.',
  ],
};

export const slasher: FeatDefinition = {
  id: 'slasher',
  name: 'Slasher',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You have learned to deal slashing wounds that hamper your foes.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Reduce Speed: Once per turn when you hit a creature with an attack that deals Slashing damage, you reduce the speed of the target by 10 feet until the start of your next turn.',
    'Hamper Critical: When you score a Critical Hit that deals Slashing damage, you grievously wound the target. Until the start of your next turn, it has Disadvantage on attack rolls.',
  ],
};

export const shadow_touched: FeatDefinition = {
  id: 'shadow-touched',
  name: 'Shadow Touched',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: "Your exposure to the Shadowfell's magic has changed you.",
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Shadow Magic: You learn the Invisibility spell and one level 1 spell of your choice from the Illusion or Necromancy school. You can cast each spell once without a spell slot, and you regain the ability when you finish a Long Rest. You can also cast these spells using spell slots you have.',
  ],
};

export const telekinetic: FeatDefinition = {
  id: 'telekinetic',
  name: 'Telekinetic',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You learn to move things with your mind.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Telekinetic Shove: You can use a Bonus Action to target one creature you can see within 30 feet. The target must succeed on a Strength saving throw (DC = 8 + your proficiency bonus + the ability modifier of the score increased by this feat) or be moved 5 feet toward or away from you.',
    'Mage Hand Cantrip: You learn the Mage Hand cantrip. The spectral hand is invisible, and you can make it appear as a Bonus Action.',
  ],
};

export const telepathic: FeatDefinition = {
  id: 'telepathic',
  name: 'Telepathic',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You awaken the ability to mentally connect with others.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    "Telepathy: You can speak telepathically to any creature you can see within 60 feet. You don't need to share a language, but the creature must understand at least one language.",
    'Detect Thoughts: You can cast the Detect Thoughts spell once without a spell slot, and you regain the ability when you finish a Long Rest. Your spellcasting ability for the spell is the ability increased by this feat.',
  ],
};

export const ritual_caster: FeatDefinition = {
  id: 'ritual-caster',
  name: 'Ritual Caster',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have learned a number of spells that you can cast as rituals.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence or Wisdom by 1, to a maximum of 20.',
    "Ritual Spells: Choose a class: Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard. You learn two level 1 spells that have the Ritual tag from that class's spell list. You can cast these spells as rituals. If you find a spell scroll with a Ritual tag and that spell is on your chosen class's spell list, you can add it to your ritual book.",
  ],
};

export const chef: FeatDefinition = {
  id: 'chef',
  name: 'Chef',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { constitution: 1 } },
  proficienciesGranted: { tools: ["cook's utensils"] },
  description: 'Time and effort spent mastering the culinary arts has paid off.',
  benefits: [
    'Ability Score Increase: Increase your Constitution or Wisdom by 1, to a maximum of 20.',
    "Cook's Utensils Proficiency: You gain proficiency with cook's utensils if you don't already have it.",
    "Prepare Meals: As part of a Short Rest, you can cook special food if you have cook's utensils and ingredients. You can prepare a number of treats equal to your proficiency bonus. A creature can use a Bonus Action to eat one of those treats to gain Temporary HP equal to your Proficiency Bonus.",
    'Bolstering Meal: When you finish a Long Rest, you can cook for up to six creatures. Each creature gains additional HP equal to your Proficiency Bonus + your Constitution modifier.',
  ],
};

export const eldritch_adept: FeatDefinition = {
  id: 'eldritch-adept',
  name: 'Eldritch Adept',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Spellcasting or Pact Magic feature' },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You have learned a magical invocation.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.',
    'Eldritch Invocation: You learn one Eldritch Invocation option of your choice from the Warlock class. If the invocation has a prerequisite, you can choose that invocation only if you meet the prerequisite.',
  ],
};

export const fighting_initiate: FeatDefinition = {
  id: 'fighting-initiate',
  name: 'Fighting Initiate',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Proficiency with a Martial weapon' },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You have learned a fighting style.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
    'Fighting Style: You learn one Fighting Style option from the Fighter class.',
  ],
};

export const generalFeats: FeatDefinition[] = [
  abilityScoreImprovement,
  actor,
  athlete,
  charger,
  crossbowExpert,
  crusher,
  defensiveDuelist,
  dualWielder,
  durable,
  elemental_adept,
  fey_touched,
  grappler,
  greatWeaponMaster,
  heavilyArmored,
  inspiring_leader,
  keen_mind,
  mage_slayer,
  mobile,
  mounted_combatant,
  observant,
  polearmMaster,
  resilient,
  sentinel,
  sharpshooter,
  shield_master,
  skulker,
  speedy,
  spellSniper,
  warCaster,
  lightly_armored,
  moderately_armored,
  weapon_master,
  linguist,
  dungeon_delver,
  magic_initiate_ranger,
  magic_initiate_paladin,
  piercer,
  slasher,
  shadow_touched,
  telekinetic,
  telepathic,
  ritual_caster,
  chef,
  eldritch_adept,
  fighting_initiate,
];
