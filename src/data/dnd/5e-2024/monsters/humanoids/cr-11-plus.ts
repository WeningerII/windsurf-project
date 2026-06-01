import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Humanoids - CR 11+ (SRD 5.2)
// Legendary humanoids and powerful NPCs

export const archmage: Monster = {
  id: 'archmage-2024',
  name: 'Archmage',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful neutral',
  armorClass: 12,
  hitPoints: { count: 18, die: 'd8', modifier: 36, notation: '18d8+36' },
  speed: { walk: 30, fly: 30 },
  abilities: { str: 10, dex: 14, con: 14, int: 20, wis: 15, cha: 16 },
  savingThrows: { int: 8, wis: 5, cha: 6 },
  skills: { Arcana: 12, History: 12 },
  senses: ['truesight 120 ft.', 'passive Perception 12'],
  languages: ['Common', 'three other languages'],
  challengeRating: 12,
  experiencePoints: 8400,
  specialAbilities: [
    {
      name: 'Magic Resistance',
      description:
        'The archmage has advantage on saving throws against spells and magical effects.',
    },
    {
      name: 'Spellcasting',
      description:
        'The archmage is a 20th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). The archmage can cast disguise self and invisibility at will and has the following wizard spells prepared: Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp; 1st level (4 slots): detect magic, identify, mage armor, magic missile; 2nd level (4 slots): detect thoughts, mirror image, misty step, scorching ray; 3rd level (4 slots): counterspell, dispel magic, fireball, fly; 4th level (4 slots): banishment, greater invisibility, ice storm, stoneskin; 5th level (4 slots): cone of cold, scrying, telekinesis; 6th level (2 slots): chain lightning, disintegrate, globe of invulnerability; 7th level (2 slots): delayed blast fireball, teleport; 8th level (1 slot): mind blank; 9th level (1 slot): time stop.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd4', notation: '1d4' }, type: 'piercing' }],
    },
  ],
  legendaryActions: [
    {
      name: 'Cantrip',
      cost: 1,
      description: 'The archmage casts a cantrip.',
    },
    {
      name: 'Dagger Attack',
      cost: 1,
      description: 'The archmage makes a dagger attack.',
    },
    {
      name: 'Spell (Costs 1-3 Actions)',
      cost: 1,
      description:
        'The archmage casts a spell of 1st through 3rd level, using a spell slot as normal. To do so, it must use an action on its turn.',
    },
  ],
  environment: ['tower', 'urban'],
};

export const humanoidsCR11Plus: Monster[] = [archmage];
