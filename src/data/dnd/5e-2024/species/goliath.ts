import { Species } from '../../../../types/character-options/species';

export const goliath: Species = {
  id: 'goliath',
  name: 'Goliath',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { str: 2, con: 1 },
    },
  ],

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
        'You are descended from Giants. Choose one of the following benefits—a supernatural boon from your ancestry. You can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.\n\nCloud’s Jaunt (Cloud Giant): As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see.\nFire’s Burn (Fire Giant): When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target.\nFrost’s Chill (Frost Giant): When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage and reduce its Speed by 10 feet until the start of your next turn.\nHill’s Tumble (Hill Giant): When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition.\nStone’s Endurance (Stone Giant): When you take damage, you can take a Reaction to roll 1d12, add your Constitution modifier, and reduce the damage by that total.\nStorm’s Thunder (Storm Giant): When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature.',
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
    'Goliaths trace their ancestry to Giants. They tower over most other peoples, standing between 7 and 8 feet tall, and carry the supernatural boons of their giant lineage.',
  ageInfo: 'Goliaths reach adulthood in their late teens and can live up to about 100 years.',
  sizeDescription: 'Goliaths are between 7 and 8 feet tall. Your size is Medium.',
};
