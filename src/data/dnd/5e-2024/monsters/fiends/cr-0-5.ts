import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Fiends - CR 0-5 (SRD 5.2)
// Imps, quasits, and lesser demons

export const imp: Monster = {
  id: 'imp-2024',
  name: 'Imp',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'tiny',
  type: 'fiend',
  alignment: 'lawful evil',
  armorClass: 13,
  hitPoints: { count: 3, die: 'd4', modifier: 3, notation: '3d4+3' },
  speed: { walk: 20, fly: 40 },
  abilities: { str: 6, dex: 17, con: 10, int: 11, wis: 12, cha: 14 },
  skills: { Deception: 4, Insight: 3 },
  damageResistances: ['cold', 'fire', 'lightning', 'piercing', 'slashing'],
  damageImmunities: ['poison'],
  conditionImmunities: ['poisoned'],
  senses: ['darkvision 120 ft.', 'passive Perception 11'],
  languages: ['Infernal', 'Common'],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Invisibility',
      description:
        'The imp can use an action to become invisible until it attacks or until its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisible with it.',
    },
    {
      name: 'Resistance to Magic',
      description: 'The imp has advantage on saving throws against spells and magical effects.',
    },
  ],
  actions: [
    {
      name: 'Sting',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 10 (3d6) poison damage.',
    },
  ],
  environment: ['underdark', 'urban'],
};

export const quasit: Monster = {
  id: 'quasit-2024',
  name: 'Quasit',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'tiny',
  type: 'fiend',
  alignment: 'chaotic evil',
  armorClass: 13,
  hitPoints: { count: 3, die: 'd4', notation: '3d4' },
  speed: { walk: 20, fly: 40 },
  abilities: { str: 5, dex: 17, con: 10, int: 7, wis: 10, cha: 10 },
  skills: { Stealth: 5 },
  damageResistances: ['cold', 'fire', 'lightning', 'piercing', 'slashing'],
  damageImmunities: ['poison'],
  conditionImmunities: ['poisoned'],
  senses: ['darkvision 120 ft.', 'passive Perception 10'],
  languages: ['Infernal', 'Common'],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Scare',
      description:
        "One creature of the quasit's choice within 20 feet of it that can see it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success.",
    },
  ],
  actions: [
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) slashing damage.',
    },
  ],
  environment: ['underdark'],
};

export const fiendsCR0to5: Monster[] = [imp, quasit];
