// D&D 5e (2024) General Feats - SRD 5.2
//
// SRD 5.2 includes only two general feats: Ability Score Improvement and
// Grappler. All other general feats are Player's Handbook content (not open)
// and are intentionally excluded.

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

export const generalFeats: FeatDefinition[] = [abilityScoreImprovement, grappler];
