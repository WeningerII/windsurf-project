import { Species } from '../../../../types/character-options/species';

export const gnome: Species = {
  id: 'gnome',
  name: 'Gnome',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { con: 2, cha: 2, str: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['dex', 'int', 'wis'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'small',
  speed: 25,

  languages: {
    automatic: ['Common', 'Gnomish', 'Sylvan'],
    choice: {
      count: 0,
      options: ['Draconic', 'Dwarven', 'Elven', 'Goblin', 'Jotun', 'Orcish'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'low-light-vision',
      name: 'Low-Light Vision',
      source: 'Gnome',
      description: 'You can see in dim light as though it were bright light.',
    },
  ],

  // CRB heritages. PF2e heritages never grant ability boosts (those come from
  // the ancestry itself) — each grants the feature in its description, so
  // abilityScoreIncrease is truthfully empty on every entry.
  subraces: [
    {
      id: 'chameleon',
      name: 'Chameleon Gnome',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You can slowly shift the hue of your skin and hair; when they match your surroundings you gain a +2 circumstance bonus to Stealth checks.',
    },
    {
      id: 'fey-touched',
      name: 'Fey-Touched Gnome',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain the fey trait, and you can cast one chosen primal cantrip as an innate spell at will, changeable with a day of meditation.',
    },
    {
      id: 'sensate',
      name: 'Sensate Gnome',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain a special sense: imprecise scent with a range of 30 feet, and a +2 circumstance bonus to Perception checks to locate an undetected creature you could smell.',
    },
    {
      id: 'umbral',
      name: 'Umbral Gnome',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [],
      traits: [],
      description: 'You gain darkvision.',
    },
    {
      id: 'wellspring',
      name: 'Wellspring Gnome',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You can cast one chosen cantrip from the arcane, divine, or occult list as an innate spell of that tradition at will.',
    },
  ],

  description:
    'Long ago, gnomes were fey spirits who emigrated from the First World. While they are no longer truly fey, gnomes retain their fey magic.',
  ageInfo: 'Gnomes reach adulthood at 18 and can live to 400 years or more.',
  alignmentTendency: 'Gnomes are typically good and tend toward chaos.',
  sizeDescription: 'Gnomes are about 3 feet tall and weigh about 40 pounds.',
};
