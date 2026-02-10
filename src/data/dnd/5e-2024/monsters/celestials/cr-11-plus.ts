import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Celestials - CR 11+ (SRD 5.2)
// Legendary celestials

export const solar: Monster = {
  id: 'solar-2024',
  name: 'Solar',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'celestial',
  alignment: 'lawful good',
  armorClass: 21,
  hitPoints: { count: 22, die: 'd10', modifier: 132, notation: '22d10+132' },
  speed: { walk: 50, fly: 150 },
  abilities: { str: 26, dex: 22, con: 22, int: 25, wis: 25, cha: 26 },
  savingThrows: { int: 12, wis: 12, cha: 13 },
  skills: { Perception: 12 },
  damageResistances: ['radiant', 'bludgeoning', 'piercing', 'slashing'],
  senses: ['truesight 120 ft.', 'passive Perception 22'],
  languages: ['all', 'telepathy 120 ft.'],
  challengeRating: 21,
  experiencePoints: 33000,
  specialAbilities: [
    {
      name: 'Innate Spellcasting',
      description: 'The solar\'s spellcasting ability is Charisma (spell save DC 21). The solar can innately cast the following spells, requiring no material components: At will: detect evil and good, invisibility, identify; 3/day each: blade barrier, dispel evil and good, resurrection; 1/day each: commune, control weather.',
    },
    {
      name: 'Legendary Resistance',
      description: 'If the solar fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
    {
      name: 'Magic Resistance',
      description: 'The solar has advantage on saving throws against spells and magical effects.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The solar makes two greatsword attacks.',
    },
    {
      name: 'Greatsword',
      description: 'Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 21 (4d6 + 7) slashing damage plus 27 (5d10) radiant damage.',
    },
  ],
  legendaryActions: [
    {
      name: 'Teleport',
      cost: 1,
      description: 'The solar magically teleports up to 120 feet to an unoccupied space it can see.',
    },
    {
      name: 'Searing Burst',
      cost: 2,
      description: 'The solar emits magical, divine energy. Each creature of its choice that it can see within 10 feet of it must make a DC 21 Dexterity saving throw, taking 16 (3d10) fire damage on a failed save, or half as much on a successful one.',
    },
  ],
  environment: ['celestial'],
};

export const celestialsCR11Plus: Monster[] = [
  solar,
];
