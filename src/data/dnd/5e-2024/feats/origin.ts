// D&D 5e (2024) Origin Feats - SRD 5.2
// These feats are available at 1st level through backgrounds.
//
// SRD 5.2 origin feats: Alert, Magic Initiate (Cleric/Druid/Wizard), Savage
// Attacker, Skilled. The 2024 Magic Initiate feat offers only the Cleric,
// Druid, or Wizard spell list, so the Bard/Sorcerer/Warlock variants — and the
// other origin feats (Crafter, Healer, Lucky, Musician, Tavern Brawler, Tough)
// — are Player's Handbook content (not open) and are intentionally excluded.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const alert: FeatDefinition = {
  id: 'alert',
  name: 'Alert',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  description: 'Always on the lookout for danger, you gain the following benefits.',
  benefits: [
    'Initiative Proficiency: Add your Proficiency Bonus to Initiative rolls.',
    'Initiative Swap: Immediately after you roll Initiative, you can swap your Initiative with one willing ally.',
  ],
};

export const magicInitiateCleric: FeatDefinition = {
  id: 'magic-initiate-cleric',
  name: 'Magic Initiate (Cleric)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  description:
    'You have learned the basics of a particular magical tradition from the Cleric spell list.',
  benefits: [
    'Two Cantrips: You learn two cantrips of your choice from the Cleric spell list.',
    'Level 1 Spell: You learn one level 1 spell of your choice from the Cleric spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.',
    'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.',
  ],
};

export const magicInitiateDruid: FeatDefinition = {
  id: 'magic-initiate-druid',
  name: 'Magic Initiate (Druid)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  description:
    'You have learned the basics of a particular magical tradition from the Druid spell list.',
  benefits: [
    'Two Cantrips: You learn two cantrips of your choice from the Druid spell list.',
    'Level 1 Spell: You learn one level 1 spell of your choice from the Druid spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.',
    'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.',
  ],
};

export const magicInitiateWizard: FeatDefinition = {
  id: 'magic-initiate-wizard',
  name: 'Magic Initiate (Wizard)',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  description:
    'You have learned the basics of a particular magical tradition from the Wizard spell list.',
  benefits: [
    'Two Cantrips: You learn two cantrips of your choice from the Wizard spell list.',
    'Level 1 Spell: You learn one level 1 spell of your choice from the Wizard spell list. You can cast it once without a spell slot, regaining the ability after a Long Rest.',
    'Spell Change: Whenever you gain a new level, you can replace one spell from this feat.',
  ],
};

export const savageAttacker: FeatDefinition = {
  id: 'savage-attacker',
  name: 'Savage Attacker',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  description: 'You have trained to deal particularly damaging strikes.',
  benefits: [
    "Damage Reroll: Once per turn when you hit a target with a weapon, you can roll the weapon's damage dice twice and use either roll against the target.",
  ],
};

export const skilled: FeatDefinition = {
  id: 'skilled',
  name: 'Skilled',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  proficienciesGranted: { skills: ['three skills of your choice'] },
  description: 'You have exceptionally broad learning.',
  benefits: [
    'Skill Proficiencies: You gain proficiency in any combination of three skills or tools of your choice.',
  ],
};

export const originFeats: FeatDefinition[] = [
  alert,
  magicInitiateCleric,
  magicInitiateDruid,
  magicInitiateWizard,
  savageAttacker,
  skilled,
];
