import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { con: 2, wis: 2, cha: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['str', 'dex', 'int'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'medium',
  speed: 20,

  languages: {
    automatic: ['Common', 'Dwarven'],
    choice: {
      count: 0,
      options: ['Gnomish', 'Goblin', 'Jotun', 'Orcish', 'Terran', 'Undercommon'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'darkvision',
      name: 'Darkvision',
      source: 'Dwarf',
      description:
        'You can see in darkness and dim light just as well as you can see in bright light.',
    },
    {
      id: 'clan-dagger',
      name: 'Clan Dagger',
      source: 'Dwarf',
      description: 'You get one clan dagger for free, as it was given to you at birth.',
    },
  ],

  subraces: [
    {
      id: 'forge-blessed',
      name: 'Forge-Blessed Heritage',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { str: 2 } }],
      traits: [],
      description:
        'You gain a +1 status bonus to Crafting checks and can use Crafting to repair metal items.',
    },
    {
      id: 'stonecunning',
      name: 'Stonecunning Heritage',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { int: 2 } }],
      traits: [],
      description:
        'You gain a +1 status bonus to Perception checks to notice stonework and can identify stone materials.',
    },
    {
      id: 'ironclad',
      name: 'Ironclad Heritage',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { con: 2 } }],
      traits: [],
      description: 'You gain a +1 status bonus to AC when wearing metal armor.',
    },
    {
      id: 'mountainborn',
      name: 'Mountainborn Heritage',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { wis: 2 } }],
      traits: [],
      description: 'You gain a +1 status bonus to Survival checks in mountainous terrain.',
    },
  ],

  description:
    'Dwarves have a well-earned reputation as a stoic and stern people, ensconced within citadels and cities carved from solid rock.',
  ageInfo: 'Dwarves are considered young until age 25 and can live to around 350 years old.',
  alignmentTendency: 'Dwarves tend toward lawful alignments.',
  sizeDescription: 'Dwarves are about a foot shorter than most humans.',
};
