// D&D 5e Constants

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const POINT_BUY_CONFIG = {
  points: 27,
  minScore: 8,
  maxScore: 15,
  costs: {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
  },
};

export const ABILITY_SCORE_CAP = 20;
export const MAX_LEVEL = 20;

export const SKILLS_5E = [
  { id: 'acrobatics', name: 'Acrobatics', attribute: 'dex' },
  { id: 'animal-handling', name: 'Animal Handling', attribute: 'wis' },
  { id: 'arcana', name: 'Arcana', attribute: 'int' },
  { id: 'athletics', name: 'Athletics', attribute: 'str' },
  { id: 'deception', name: 'Deception', attribute: 'cha' },
  { id: 'history', name: 'History', attribute: 'int' },
  { id: 'insight', name: 'Insight', attribute: 'wis' },
  { id: 'intimidation', name: 'Intimidation', attribute: 'cha' },
  { id: 'investigation', name: 'Investigation', attribute: 'int' },
  { id: 'medicine', name: 'Medicine', attribute: 'wis' },
  { id: 'nature', name: 'Nature', attribute: 'int' },
  { id: 'perception', name: 'Perception', attribute: 'wis' },
  { id: 'performance', name: 'Performance', attribute: 'cha' },
  { id: 'persuasion', name: 'Persuasion', attribute: 'cha' },
  { id: 'religion', name: 'Religion', attribute: 'int' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', attribute: 'dex' },
  { id: 'stealth', name: 'Stealth', attribute: 'dex' },
  { id: 'survival', name: 'Survival', attribute: 'wis' },
];

export const CONDITIONS = [
  'blinded',
  'charmed',
  'deafened',
  'frightened',
  'grappled',
  'incapacitated',
  'invisible',
  'paralyzed',
  'petrified',
  'poisoned',
  'prone',
  'restrained',
  'stunned',
  'unconscious',
];

export const DAMAGE_TYPES = [
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
];
