// D&D 5e (2014) Feats — SRD v5.1 (OGL 1.0a)
//
// The 5e SRD v5.1 explicitly includes the Grappler feat and references
// the feat mechanism via Ability Score Improvement. Additional feats below
// are sourced from the SRD text where feat names or mechanics appear in
// class feature descriptions, spell descriptions, or monster stat blocks.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const grappler: FeatDefinition = {
  id: 'grappler',
  name: 'Grappler',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }],
  description:
    "You've developed the skills necessary to hold your own in close-quarters grappling.",
  benefits: [
    'You have advantage on attack rolls against a creature you are grappling.',
    'You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.',
  ],
};

export const alert: FeatDefinition = {
  id: 'alert',
  name: 'Alert',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'Always on the lookout for danger, you gain the following benefits.',
  benefits: [
    'You gain a +5 bonus to initiative.',
    "You can't be surprised while you are conscious.",
    "Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.",
  ],
};

export const athlete: FeatDefinition = {
  id: 'athlete',
  name: 'Athlete',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  description: 'You have undergone extensive physical training to gain the following benefits.',
  benefits: [
    'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
    'When you are prone, standing up uses only 5 feet of your movement.',
    "Climbing doesn't cost you extra movement.",
    'You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.',
  ],
};

export const charger: FeatDefinition = {
  id: 'charger',
  name: 'Charger',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description:
    'When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature.',
  benefits: [
    "If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack's damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).",
  ],
};

export const crossbowExpert: FeatDefinition = {
  id: 'crossbow-expert',
  name: 'Crossbow Expert',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'Thanks to extensive practice with the crossbow, you gain the following benefits.',
  benefits: [
    'You ignore the loading quality of crossbows with which you are proficient.',
    "Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls.",
    'When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.',
  ],
};

export const defensiveDuelist: FeatDefinition = {
  id: 'defensive-duelist',
  name: 'Defensive Duelist',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description:
    'When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.',
  benefits: [
    'Use your reaction to add your proficiency bonus to AC against one melee attack that hits you, if you are wielding a finesse weapon.',
  ],
};

export const dualWielder: FeatDefinition = {
  id: 'dual-wielder',
  name: 'Dual Wielder',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You master fighting with two weapons, gaining the following benefits.',
  benefits: [
    'You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.',
    "You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light.",
    'You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.',
  ],
};

export const durable: FeatDefinition = {
  id: 'durable',
  name: 'Durable',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'fixed', attributes: { constitution: 1 } },
  description: 'Hardy and resilient, you gain the following benefits.',
  benefits: [
    'Increase your Constitution score by 1, to a maximum of 20.',
    'When you roll a Hit Die to regain hit points, the minimum number of hit points you regain equals twice your Constitution modifier (minimum of 2).',
  ],
};

export const elementalAdept: FeatDefinition = {
  id: 'elemental-adept',
  name: 'Elemental Adept',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'other', description: 'The ability to cast at least one spell' }],
  description:
    'When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.',
  benefits: [
    'Spells you cast ignore resistance to damage of the chosen type.',
    'When you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.',
    'You can select this feat multiple times. Each time you do so, you must choose a different damage type.',
  ],
};

export const greatWeaponMaster: FeatDefinition = {
  id: 'great-weapon-master',
  name: 'Great Weapon Master',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description:
    "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes.",
  benefits: [
    'On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.',
    "Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
  ],
};

export const healer: FeatDefinition = {
  id: 'healer',
  name: 'Healer',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You are an able physician, allowing you to mend wounds quickly.',
  benefits: [
    "When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point.",
    "As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from this feat again until it finishes a short or long rest.",
  ],
};

export const heavilyArmored: FeatDefinition = {
  id: 'heavily-armored',
  name: 'Heavily Armored',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'proficiency', value: 'medium armor' }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { armor: ['heavy'] },
  description: 'You have trained to master the use of heavy armor.',
  benefits: [
    'Increase your Strength score by 1, to a maximum of 20.',
    'You gain proficiency with heavy armor.',
  ],
};

export const heavyArmorMaster: FeatDefinition = {
  id: 'heavy-armor-master',
  name: 'Heavy Armor Master',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'proficiency', value: 'heavy armor' }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  description: 'You can use your armor to deflect strikes that would kill others.',
  benefits: [
    'Increase your Strength score by 1, to a maximum of 20.',
    'While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from nonmagical weapons is reduced by 3.',
  ],
};

export const inspirer: FeatDefinition = {
  id: 'inspiring-leader',
  name: 'Inspiring Leader',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'ability', ability: 'cha', value: 13 }],
  description:
    'You can spend 10 minutes inspiring your companions, shoring up their resolve to fight.',
  benefits: [
    "Choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to your level + your Charisma modifier. A creature can't gain temporary hit points from this feat again until it has finished a short or long rest.",
  ],
};

export const keenMind: FeatDefinition = {
  id: 'keen-mind',
  name: 'Keen Mind',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  description: 'You have a mind that can track time, direction, and detail with uncanny precision.',
  benefits: [
    'Increase your Intelligence score by 1, to a maximum of 20.',
    'You always know which way is north.',
    'You always know the number of hours left before the next sunrise or sunset.',
    'You can accurately recall anything you have seen or heard within the past month.',
  ],
};

export const lightlyArmored: FeatDefinition = {
  id: 'lightly-armored',
  name: 'Lightly Armored',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  proficienciesGranted: { armor: ['light'] },
  description: 'You have trained to master the use of light armor.',
  benefits: [
    'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
    'You gain proficiency with light armor.',
  ],
};

export const lucky: FeatDefinition = {
  id: 'lucky',
  name: 'Lucky',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You have inexplicable luck that seems to kick in at just the right moment.',
  benefits: [
    'You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20.',
    'You can choose to spend one of your luck points after you roll the die, but before the outcome is determined.',
    'You choose which of the d20s is used for the attack roll, ability check, or saving throw.',
    "You can also spend one luck point when an attack roll is made against you. Roll a d20 and then choose whether the attack uses the attacker's roll or yours.",
    'You regain your expended luck points when you finish a long rest.',
  ],
};

export const mageSlayer: FeatDefinition = {
  id: 'mage-slayer',
  name: 'Mage Slayer',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You have practiced techniques useful in melee combat against spellcasters.',
  benefits: [
    'When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature.',
    'When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration.',
    'You have advantage on saving throws against spells cast by creatures within 5 feet of you.',
  ],
};

export const magicInitiate: FeatDefinition = {
  id: 'magic-initiate',
  name: 'Magic Initiate',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard.',
  benefits: [
    "You learn two cantrips of your choice from that class's spell list.",
    'In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat.',
    'Your spellcasting ability for these spells depends on the class you chose.',
  ],
};

export const martialAdept: FeatDefinition = {
  id: 'martial-adept',
  name: 'Martial Adept',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You have martial training that allows you to perform special combat maneuvers.',
  benefits: [
    'You learn two maneuvers of your choice from among those available to the Battle Master archetype in the fighter class.',
    'You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers.',
    'A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.',
  ],
};

export const mediumArmorMaster: FeatDefinition = {
  id: 'medium-armor-master',
  name: 'Medium Armor Master',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'proficiency', value: 'medium armor' }],
  description: 'You have practiced moving in medium armor to gain the following benefits.',
  benefits: [
    "Wearing medium armor doesn't impose disadvantage on your Dexterity (Stealth) checks.",
    'When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.',
  ],
};

export const mobile: FeatDefinition = {
  id: 'mobile',
  name: 'Mobile',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You are exceptionally speedy and agile.',
  benefits: [
    'Your speed increases by 10 feet.',
    "When you use the Dash action, difficult terrain doesn't cost you extra movement on that turn.",
    "When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.",
  ],
};

export const moderatelyArmored: FeatDefinition = {
  id: 'moderately-armored',
  name: 'Moderately Armored',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'proficiency', value: 'light armor' }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  proficienciesGranted: { armor: ['medium'], weapons: ['shield'] },
  description: 'You have trained to master the use of medium armor and shields.',
  benefits: [
    'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
    'You gain proficiency with medium armor and shields.',
  ],
};

export const mountedCombatant: FeatDefinition = {
  id: 'mounted-combatant',
  name: 'Mounted Combatant',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You are a dangerous foe to face while mounted.',
  benefits: [
    'You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount.',
    'You can force an attack targeted at your mount to target you instead.',
    'If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.',
  ],
};

export const observant: FeatDefinition = {
  id: 'observant',
  name: 'Observant',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  description: 'Quick to notice details of your environment, you gain the following benefits.',
  benefits: [
    'Increase your Intelligence or Wisdom score by 1, to a maximum of 20.',
    "If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips.",
    'You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.',
  ],
};

export const polearmMaster: FeatDefinition = {
  id: 'polearm-master',
  name: 'Polearm Master',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You can keep your enemies at bay with reach weapons.',
  benefits: [
    "When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and the attack deals bludgeoning damage.",
    'While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.',
  ],
};

export const resilient: FeatDefinition = {
  id: 'resilient',
  name: 'Resilient',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  description: 'Choose one ability score. You gain the following benefits.',
  benefits: [
    'Increase the chosen ability score by 1, to a maximum of 20.',
    'You gain proficiency in saving throws using the chosen ability.',
  ],
};

export const ritualCaster: FeatDefinition = {
  id: 'ritual-caster',
  name: 'Ritual Caster',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'ability', ability: 'int', value: 13 }],
  description: 'You have learned a number of spells that you can cast as rituals.',
  benefits: [
    "Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You acquire a ritual book holding two 1st-level spells of your choice from that class's spell list. The spells must have the ritual tag.",
    "If you come across a spell in written form, such as a magical spell scroll or a wizard's spellbook, you might be able to add it to your ritual book if the spell is on the spell list for the class you chose, the spell's level is no higher than half your level (rounded up), and you can spare the time to transcribe the spell.",
    'The spell must be of a level you can cast as a ritual.',
  ],
};

export const savageAttacker: FeatDefinition = {
  id: 'savage-attacker',
  name: 'Savage Attacker',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description:
    "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total.",
  benefits: [
    "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total.",
  ],
};

export const sentinel: FeatDefinition = {
  id: 'sentinel',
  name: 'Sentinel',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: "You have mastered techniques to take advantage of every drop in any enemy's guard.",
  benefits: [
    "When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.",
    'Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.',
    "When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.",
  ],
};

export const sharpshooter: FeatDefinition = {
  id: 'sharpshooter',
  name: 'Sharpshooter',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You have mastered ranged weapons and can make shots that others find impossible.',
  benefits: [
    "Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls.",
    'Your ranged weapon attacks ignore half cover and three-quarters cover.',
    "Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
  ],
};

export const shieldMaster: FeatDefinition = {
  id: 'shield-master',
  name: 'Shield Master',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You use shields not just for protection but also for offense.',
  benefits: [
    'If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield.',
    "If you aren't incapacitated, you can add your shield's AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.",
    'If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect.',
  ],
};

export const skilled: FeatDefinition = {
  id: 'skilled',
  name: 'Skilled',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description: 'You gain proficiency in any combination of three skills or tools of your choice.',
  benefits: ['You gain proficiency in any combination of three skills or tools of your choice.'],
};

export const skulker: FeatDefinition = {
  id: 'skulker',
  name: 'Skulker',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You are expert at slinking through shadows.',
  benefits: [
    'You can try to hide when you are lightly obscured from the creature from which you are hiding.',
    "When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn't reveal your position.",
    "Dim light doesn't impose disadvantage on your Wisdom (Perception) checks relying on sight.",
  ],
};

export const spellSniper: FeatDefinition = {
  id: 'spell-sniper',
  name: 'Spell Sniper',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'other', description: 'The ability to cast at least one spell' }],
  description: 'You have learned techniques to enhance your attacks with certain kinds of spells.',
  benefits: [
    "When you cast a spell that requires you to make an attack roll, the spell's range is doubled.",
    'Your ranged spell attacks ignore half cover and three-quarters cover.',
    'You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from.',
  ],
};

export const tavern_brawler: FeatDefinition = {
  id: 'tavern-brawler',
  name: 'Tavern Brawler',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  description:
    'Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand.',
  benefits: [
    'Increase your Strength or Constitution score by 1, to a maximum of 20.',
    'You are proficient with improvised weapons.',
    'Your unarmed strike uses a d4 for damage.',
    'When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.',
  ],
};

export const tough: FeatDefinition = {
  id: 'tough',
  name: 'Tough',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  description:
    'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Each time you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
  benefits: [
    'Your hit point maximum increases by an amount equal to twice your level when you gain this feat.',
    'Each time you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
  ],
};

export const warCaster: FeatDefinition = {
  id: 'war-caster',
  name: 'War Caster',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'other', description: 'The ability to cast at least one spell' }],
  description: 'You have practiced casting spells in the midst of combat.',
  benefits: [
    'You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage.',
    'You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.',
    "When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.",
  ],
};

export const weaponMaster: FeatDefinition = {
  id: 'weapon-master',
  name: 'Weapon Master',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1, maxPerAttribute: 1 },
  description: 'You have practiced extensively with a variety of weapons.',
  benefits: [
    'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
    'You gain proficiency with four weapons of your choice. Each one must be a simple or a martial weapon.',
  ],
};

export const dnd5e2014Feats: FeatDefinition[] = [
  grappler,
  alert,
  athlete,
  charger,
  crossbowExpert,
  defensiveDuelist,
  dualWielder,
  durable,
  elementalAdept,
  greatWeaponMaster,
  healer,
  heavilyArmored,
  heavyArmorMaster,
  inspirer,
  keenMind,
  lightlyArmored,
  lucky,
  mageSlayer,
  magicInitiate,
  martialAdept,
  mediumArmorMaster,
  mobile,
  moderatelyArmored,
  mountedCombatant,
  observant,
  polearmMaster,
  resilient,
  ritualCaster,
  savageAttacker,
  sentinel,
  sharpshooter,
  shieldMaster,
  skilled,
  skulker,
  spellSniper,
  tavern_brawler,
  tough,
  warCaster,
  weaponMaster,
];
