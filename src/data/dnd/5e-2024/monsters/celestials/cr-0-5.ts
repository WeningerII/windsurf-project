import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Celestials - CR 0-5 (SRD 5.2)
// Angels and celestial beings

export const deva: Monster = {
  id: 'deva-2024',
  name: 'Deva',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'celestial',
  alignment: 'lawful good',
  armorClass: 17,
  hitPoints: { count: 8, die: 'd8', modifier: 24, notation: '8d8+24' },
  speed: { walk: 30, fly: 90 },
  abilities: { str: 18, dex: 16, con: 16, int: 16, wis: 16, cha: 16 },
  savingThrows: { wis: 6, cha: 6 },
  skills: { Insight: 6, Perception: 6 },
  damageResistances: ['radiant', 'bludgeoning', 'piercing', 'slashing'],
  senses: ['darkvision 120 ft.', 'passive Perception 16'],
  languages: ['all', 'telepathy 120 ft.'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Innate Spellcasting',
      description: 'The deva\'s spellcasting ability is Charisma (spell save DC 14). The deva can innately cast the following spells, requiring only verbal components: At will: detect evil and good; 1/day each: commune, detect thoughts.',
    },
    {
      name: 'Magic Resistance',
      description: 'The deva has advantage on saving throws against spells and magical effects.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The deva makes two melee attacks.',
    },
    {
      name: 'Mace',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d8 + 4) bludgeoning damage plus 16 (3d10) radiant damage.',
    },
  ],
  environment: ['celestial'],
};

export const celestialsCR0to5: Monster[] = [
  deva,
];
