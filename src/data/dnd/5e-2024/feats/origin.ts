// D&D 5e (2024) Origin Feats - SRD 5.2
// These feats are available at 1st level through backgrounds

import { FeatDefinition } from '../../../../types/character-options/feats';

export const alert: FeatDefinition = {
  id: 'alert', name: 'Alert', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'Always on the lookout for danger, you gain the following benefits.',
  benefits: ['Initiative Proficiency: Add your Proficiency Bonus to Initiative rolls.', 'Initiative Swap: Immediately after you roll Initiative, you can swap your Initiative with one willing ally.'],
};

export const crafter: FeatDefinition = {
  id: 'crafter', name: 'Crafter', system: 'dnd-5e-2024', source: 'SRD 5.2',
  proficienciesGranted: { tools: ['three artisan tools of your choice'] },
  description: 'You are adept at crafting things and bargaining with merchants.',
  benefits: ['Tool Proficiency: You gain proficiency with three different Artisan\'s Tools of your choice.', 'Discount: Whenever you buy a nonmagical item, you receive a 20% discount.', 'Faster Crafting: When you craft an item using a tool with which you have proficiency, reduce the crafting time by 20%.'],
};

export const healer: FeatDefinition = {
  id: 'healer', name: 'Healer', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have the training and intuition to administer first aid and other care effectively.',
  benefits: ['Battle Medic: If you have a Healer\'s Kit, you can expend one use of it and tend to a creature within 5 feet. That creature regains 2d4 + 2 HP.', 'Healing Rerolls: Whenever you roll a die to determine HP restored, you can reroll the die if it rolls a 1, and you must use the new roll.'],
};

export const lucky: FeatDefinition = {
  id: 'lucky', name: 'Lucky', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have inexplicable luck that can kick in at just the right moment.',
  benefits: ['Luck Points: You have a number of Luck Points equal to your Proficiency Bonus.', 'Advantage: Spend 1 Luck Point when you make a d20 Test to give yourself Advantage.', 'Disadvantage to Attacker: Spend 1 Luck Point when a creature makes an attack roll against you to impose Disadvantage on that roll.', 'Regain Points: You regain all expended Luck Points when you finish a Long Rest.'],
};

export const magicInitiateCleric: FeatDefinition = {
  id: 'magic-initiate-cleric', name: 'Magic Initiate (Cleric)', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have learned the basics of a particular magical tradition from the Cleric spell list.',
  benefits: ['Two Cantrips: You learn two cantrips of your choice from the Cleric spell list.', 'Level 1 Spell: You learn one level 1 spell of your choice from the Cleric spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.', 'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.'],
};

export const magicInitiateDruid: FeatDefinition = {
  id: 'magic-initiate-druid', name: 'Magic Initiate (Druid)', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have learned the basics of a particular magical tradition from the Druid spell list.',
  benefits: ['Two Cantrips: You learn two cantrips of your choice from the Druid spell list.', 'Level 1 Spell: You learn one level 1 spell of your choice from the Druid spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.', 'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.'],
};

export const magicInitiateWizard: FeatDefinition = {
  id: 'magic-initiate-wizard', name: 'Magic Initiate (Wizard)', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have learned the basics of a particular magical tradition from the Wizard spell list.',
  benefits: ['Two Cantrips: You learn two cantrips of your choice from the Wizard spell list.', 'Level 1 Spell: You learn one level 1 spell of your choice from the Wizard spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.', 'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.'],
};

export const magicInitiateBard: FeatDefinition = {
  id: 'magic-initiate-bard', name: 'Magic Initiate (Bard)', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have learned the basics of a particular magical tradition from the Bard spell list.',
  benefits: ['Two Cantrips: You learn two cantrips of your choice from the Bard spell list.', 'Level 1 Spell: You learn one level 1 spell of your choice from the Bard spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.', 'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.'],
};

export const magicInitiateSorcerer: FeatDefinition = {
  id: 'magic-initiate-sorcerer', name: 'Magic Initiate (Sorcerer)', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have learned the basics of a particular magical tradition from the Sorcerer spell list.',
  benefits: ['Two Cantrips: You learn two cantrips of your choice from the Sorcerer spell list.', 'Level 1 Spell: You learn one level 1 spell of your choice from the Sorcerer spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.', 'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.'],
};

export const magicInitiateWarlock: FeatDefinition = {
  id: 'magic-initiate-warlock', name: 'Magic Initiate (Warlock)', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have learned the basics of a particular magical tradition from the Warlock spell list.',
  benefits: ['Two Cantrips: You learn two cantrips of your choice from the Warlock spell list.', 'Level 1 Spell: You learn one level 1 spell of your choice from the Warlock spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.', 'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.'],
};

export const musician: FeatDefinition = {
  id: 'musician', name: 'Musician', system: 'dnd-5e-2024', source: 'SRD 5.2',
  proficienciesGranted: { tools: ['three musical instruments of your choice'] },
  description: 'You are a practiced musician, granting you the following benefits.',
  benefits: ['Instrument Training: You gain proficiency with three Musical Instruments of your choice.', 'Inspiring Song: As you finish a Short or Long Rest, you can play a song on a Musical Instrument and give Heroic Inspiration to allies who hear the song.'],
};

export const savageAttacker: FeatDefinition = {
  id: 'savage-attacker', name: 'Savage Attacker', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'You have trained to deal particularly damaging strikes.',
  benefits: ['Damage Reroll: Once per turn when you hit a target with a weapon, you can roll the weapon\'s damage dice twice and use either roll against the target.'],
};

export const skilled: FeatDefinition = {
  id: 'skilled', name: 'Skilled', system: 'dnd-5e-2024', source: 'SRD 5.2',
  proficienciesGranted: { skills: ['three skills of your choice'] },
  description: 'You have exceptionally broad learning.',
  benefits: ['Skill Proficiencies: You gain proficiency in any combination of three skills or tools of your choice.'],
};

export const tavern_brawler: FeatDefinition = {
  id: 'tavern-brawler', name: 'Tavern Brawler', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'Accustomed to brawling, you gain the following benefits.',
  benefits: ['Enhanced Unarmed Strike: When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d4 plus your Strength modifier instead of the normal damage.', 'Damage Rerolls: When you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll.', 'Shove: When you hit a creature with your Unarmed Strike as part of the Attack action, you can deal damage and also push the creature 5 feet away. You can use this benefit only once per turn.', 'Furniture as Weapons: You can wield furniture as a weapon, using the statistics of a Club for Small furniture or a Greatclub for Medium or larger furniture.'],
};

export const tough: FeatDefinition = {
  id: 'tough', name: 'Tough', system: 'dnd-5e-2024', source: 'SRD 5.2',
  description: 'Your Hit Point maximum increases.',
  benefits: ['Hit Point Increase: Your Hit Point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a level thereafter, your Hit Point maximum increases by an additional 2 HP.'],
};

export const originFeats: FeatDefinition[] = [
  alert, crafter, healer, lucky, magicInitiateCleric, magicInitiateDruid,
  magicInitiateWizard, magicInitiateBard, magicInitiateSorcerer, magicInitiateWarlock,
  musician, savageAttacker, skilled, tavern_brawler, tough,
];
