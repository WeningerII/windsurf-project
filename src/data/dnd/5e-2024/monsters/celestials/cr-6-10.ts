import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Celestials - CR 6-10 (SRD 5.2)
// Powerful angels

export const planetar: Monster = {
  id: 'planetar-2024',
  name: 'Planetar',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'celestial',
  alignment: 'lawful good',
  armorClass: 19,
  hitPoints: { count: 21, die: 'd10', modifier: 147, notation: '21d10+147' },
  speed: { walk: 40, fly: 120 },
  abilities: { str: 24, dex: 20, con: 24, int: 19, wis: 22, cha: 25 },
  savingThrows: { con: 9, wis: 10, cha: 9 },
  skills: { Perception: 10 },
  damageResistances: ['radiant', 'bludgeoning', 'piercing', 'slashing'],
  senses: ['truesight 120 ft.', 'passive Perception 20'],
  languages: ['all', 'telepathy 120 ft.'],
  challengeRating: 16,
  experiencePoints: 15000,
  specialAbilities: [
    {
      name: 'Innate Spellcasting',
      description:
        "The planetar's spellcasting ability is Charisma (spell save DC 17). The planetar can innately cast the following spells, requiring no material components: At will: detect evil and good, invisibility; 3/day each: blade barrier, dispel evil and good, flame strike, teleport; 1/day each: commune, control weather.",
    },
    {
      name: 'Magic Resistance',
      description:
        'The planetar has advantage on saving throws against spells and magical effects.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The planetar makes two melee attacks.',
    },
    {
      name: 'Greatsword',
      description:
        'Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 21 (4d6 + 7) slashing damage plus 22 (4d10) radiant damage.',
    },
  ],
  environment: ['celestial'],
};

export const celestialsCR6to10: Monster[] = [planetar];
