// GENERATED from 5e-bits/5e-database 2024 species + traits (SRD 5.2,
// OGL 1.0a — see docs/srd-sources.md), completing 2024 species coverage.

import { Species } from '../../../../types/character-options/species';

export const goliath: Species = {
  id: 'goliath',
  name: 'Goliath',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  // SRD 5.2 species grant no ability score increases (those moved to
  // backgrounds in the 2024 rules).
  abilityScoreIncrease: [],

  size: 'medium',
  speed: 35,

  languages: {
    automatic: ['Common', 'Giant'],
  },

  traits: [
    {
      id: 'giant-ancestry',
      name: 'Giant Ancestry',
      source: 'Goliath',
      description:
        "You are descended from Giants. Choose one of the following benefits-a supernatural boon from your ancestry; you can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest: Cloud's Jaunt (Cloud Giant). As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see. Fire's Burn (Fire Giant). When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target. Frost's Chill (Frost Giant). When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn. Hill's Tumble (Hill Giant). When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition. Stone's Endurance (Stone Giant). When you take damage, you can take a Reaction to roll 1d12. Add your Constitution modifier to the number rolled and reduce the damage by that total. - Storm's Thunder (Storm Giant). When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature.",
    },
    {
      id: 'large-form',
      name: 'Large Form',
      source: 'Goliath',
      description:
        "Starting at character level 5, you can change your size to Large as a Bonus Action if you're in a big enough space. This transformation lasts for 10 minutes or until you end it (no action required). For that duration, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can't use it again until you finish a Long Rest.",
    },
    {
      id: 'powerful-build',
      name: 'Powerful Build',
      source: 'Goliath',
      description:
        'You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.',
    },
  ],

  description:
    'Towering over most folk, goliaths carry the supernatural ancestry of giants — each goliath family line echoing one of the giant kindreds.',

  ageInfo: 'Goliaths reach adulthood in their late teens and can live to around 80 years.',

  sizeDescription: 'Medium',
};
