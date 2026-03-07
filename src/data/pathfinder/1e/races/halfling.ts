import { Species } from '../../../../types/character-options/species';

export const halfling: Species = {
  id: 'halfling',
  name: 'Halfling',
  system: 'pf1e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [{ type: 'fixed', attributes: { dex: 2, cha: 2, str: -2 } }],

  size: 'small',
  speed: 20,

  languages: {
    automatic: ['Common', 'Halfling'],
    choice: {
      count: 0,
      options: ['Dwarven', 'Elven', 'Gnome', 'Goblin'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'small',
      name: 'Small',
      source: 'Halfling',
      description:
        'Halflings are Small creatures and gain a +1 size bonus to their AC, a +1 size bonus on attack rolls, a –1 penalty to their CMB and CMD, and a +4 size bonus on Stealth checks.',
    },
    {
      id: 'fearless',
      name: 'Fearless',
      source: 'Halfling',
      description:
        'Halflings receive a +2 racial bonus on all saving throws against fear. This bonus stacks with the bonus granted by halfling luck.',
    },
    {
      id: 'halfling-luck',
      name: 'Halfling Luck',
      source: 'Halfling',
      description: 'Halflings receive a +1 racial bonus on all saving throws.',
    },
    {
      id: 'keen-senses',
      name: 'Keen Senses',
      source: 'Halfling',
      description: 'Halflings receive a +2 racial bonus on Perception checks.',
    },
    {
      id: 'sure-footed',
      name: 'Sure-Footed',
      source: 'Halfling',
      description: 'Halflings receive a +2 racial bonus on Acrobatics and Climb checks.',
    },
    {
      id: 'weapon-familiarity',
      name: 'Weapon Familiarity',
      source: 'Halfling',
      description:
        'Halflings are proficient with slings and treat any weapon with the word "halfling" in its name as a martial weapon.',
    },
  ],

  description:
    'Optimistic and cheerful by nature, blessed with uncanny luck, and driven by a powerful wanderlust, halflings make up for their short stature with an abundance of bravado and curiosity.',
  ageInfo: 'Halflings reach adulthood at 20 and can live to nearly 200 years.',
  alignmentTendency: 'Halflings tend toward neutral.',
  sizeDescription: 'Halflings are Small creatures.',
};
