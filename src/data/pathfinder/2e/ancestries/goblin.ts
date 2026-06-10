import { Species } from '../../../../types/character-options/species';

export const goblin: Species = {
  id: 'goblin',
  name: 'Goblin',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, cha: 2, wis: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['str', 'con', 'int'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'small',
  speed: 25,

  languages: {
    automatic: ['Common', 'Goblin'],
    choice: {
      count: 0,
      options: ['Draconic', 'Dwarven', 'Gnoll', 'Gnomish', 'Halfling', 'Orcish'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'darkvision',
      name: 'Darkvision',
      source: 'Goblin',
      description:
        'You can see in darkness and dim light just as well as you can see in bright light.',
    },
  ],

  // CRB heritages. PF2e heritages never grant ability boosts (those come from
  // the ancestry itself) — each grants the feature in its description, so
  // abilityScoreIncrease is truthfully empty on every entry.
  subraces: [
    {
      id: 'charhide',
      name: 'Charhide Goblin',
      parentSpeciesId: 'goblin',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain fire resistance equal to half your level (minimum 1), and the flat check to remove persistent fire damage on you is DC 10 (DC 5 with appropriate assistance).',
    },
    {
      id: 'irongut',
      name: 'Irongut Goblin',
      parentSpeciesId: 'goblin',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You can eat and drink things others cannot: you gain a +2 circumstance bonus to saving throws against afflictions and effects from things you ingest, and you reduce your sickened value by 2 on a successful save to recover.',
    },
    {
      id: 'razortooth',
      name: 'Razortooth Goblin',
      parentSpeciesId: 'goblin',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'Your jaws are a 1d6 piercing unarmed attack with the finesse and unarmed traits.',
    },
    {
      id: 'snow',
      name: 'Snow Goblin',
      parentSpeciesId: 'goblin',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain cold resistance equal to half your level (minimum 1), and you treat environmental cold effects as if they were one step less extreme.',
    },
    {
      id: 'unbreakable',
      name: 'Unbreakable Goblin',
      parentSpeciesId: 'goblin',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'Your maximum Hit Points increase by 4, and when you fall you take damage as if the fall were half as far.',
    },
  ],

  description:
    'Goblins are a short, scrappy, energetic people. They have been a thorn in the side of other ancestries but now many seek to join their communities.',
  ageInfo: 'Goblins reach adulthood by 8 and live to around 60.',
  alignmentTendency: 'Goblins tend toward chaotic alignments.',
  sizeDescription: 'Goblins are 3 feet tall and weigh about 35 pounds.',
};
