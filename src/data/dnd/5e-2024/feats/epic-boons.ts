// D&D 5e (2024) Epic Boons - SRD 5.2
// Level 19+ feats.
//
// SRD 5.2 includes seven epic boons: Combat Prowess, Dimensional Travel, Fate,
// Irresistible Offense, Spell Recall, the Night Spirit, and Truesight. The other
// boons are Player's Handbook / Dungeon Master's Guide content (not open) and are
// intentionally excluded.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const boonOfCombatProwess: FeatDefinition = {
  id: 'boon-of-combat-prowess',
  name: 'Boon of Combat Prowess',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    "Peerless Aim: When you miss with an attack roll, you can hit instead. Once you use this benefit, you can't use it again until the start of your next turn.",
  ],
};

export const boonOfDimensionalTravel: FeatDefinition = {
  id: 'boon-of-dimensional-travel',
  name: 'Boon of Dimensional Travel',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    'Blink Steps: Immediately after you take the Attack action or the Magic action, you can teleport up to 30 feet to an unoccupied space you can see.',
  ],
};

export const boonOfFate: FeatDefinition = {
  id: 'boon-of-fate',
  name: 'Boon of Fate',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    'Improve Fate: When you or another creature within 60 feet fails a d20 Test, you can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll.',
  ],
};

export const boonOfIrresistibleOffense: FeatDefinition = {
  id: 'boon-of-irresistible-offense',
  name: 'Boon of Irresistible Offense',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    'Overcome Defenses: The Bludgeoning, Piercing, and Slashing damage you deal ignores Resistance.',
    'Overwhelming Strike: When you roll a 20 on the d20 for an attack roll, you can deal extra damage equal to the ability modifier used for the attack.',
  ],
};

export const boonOfSpellRecall: FeatDefinition = {
  id: 'boon-of-spell-recall',
  name: 'Boon of Spell Recall',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [
    { type: 'level', value: 19 },
    { type: 'other', description: 'Spellcasting or Pact Magic feature' },
  ],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    "Free Casting: You can cast any spell you have prepared at its base level without expending a spell slot. Once you do so, you can't use this benefit again until you finish a Short or Long Rest.",
    "Recover Slots: You can use a Bonus Action to regain one expended spell slot of level 5 or lower. Once you do so, you can't do it again until you finish a Long Rest.",
  ],
};

export const boonOfTheNightSpirit: FeatDefinition = {
  id: 'boon-of-the-night-spirit',
  name: 'Boon of the Night Spirit',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    'Merge with Shadows: While in Dim Light or Darkness, you can give yourself the Invisible condition as a Bonus Action. The condition ends on you immediately after you take an action, a Bonus Action, or a Reaction.',
    'Shadowy Form: While in Dim Light or Darkness, you have Resistance to all damage except Force, Psychic, and Radiant.',
  ],
};

export const boonOfTruesight: FeatDefinition = {
  id: 'boon-of-truesight',
  name: 'Boon of Truesight',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'You gain the following benefits.',
  benefits: [
    'Ability Score Increase: Increase one ability score by 1, to a maximum of 30.',
    'Truesight: You have Truesight with a range of 60 feet.',
  ],
};

export const epicBoons: FeatDefinition[] = [
  boonOfCombatProwess,
  boonOfDimensionalTravel,
  boonOfFate,
  boonOfIrresistibleOffense,
  boonOfSpellRecall,
  boonOfTheNightSpirit,
  boonOfTruesight,
];
