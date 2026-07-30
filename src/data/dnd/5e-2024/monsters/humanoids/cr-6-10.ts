import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Humanoids - CR 6-10 (SRD 5.2)
// Powerful NPCs and humanoid leaders

export const mage: Monster = {
  id: 'mage-2024',
  name: 'Mage',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 15,
  hitPoints: { count: 18, die: 'd8', notation: '18d8' },
  speed: { walk: 30 },
  abilities: { str: 9, dex: 14, con: 11, int: 17, wis: 12, cha: 11 },
  savingThrows: { int: 5, wis: 3 },
  skills: { Arcana: 7, History: 7 },
  senses: ['passive Perception 11'],
  languages: ['Common', 'two other languages'],
  challengeRating: 6,
  experiencePoints: 2300,
  specialAbilities: [
    {
      name: 'Magic Resistance',
      description: 'The mage has advantage on saving throws against spells and magical effects.',
    },
    {
      name: 'Spellcasting',
      description:
        'The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 15, +7 to hit with spell attacks). The mage has the following wizard spells prepared: Cantrips (at will): fire bolt, light, mage hand, prestidigitation; 1st level (4 slots): detect magic, mage armor, magic missile, shield; 2nd level (3 slots): misty step, scorching ray; 3rd level (3 slots): counterspell, fireball, fly; 4th level (3 slots): greater invisibility, ice storm; 5th level (1 slot): cone of cold.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description:
        'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.',
    },
  ],
  environment: ['urban', 'tower'],
};

// NOTE: The former 'warlord-2024' entry was removed. Its statblock could not
// be verified against the SRD 5.2 monster index, so it was deleted rather than
// shipped with an unverified citation. See docs/srd-manifest/dnd5e-2024.ts.

export const humanoidsCR6to10: Monster[] = [mage];
