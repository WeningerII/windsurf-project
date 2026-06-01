import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Giants - CR 11+ (SRD 5.2)
// Storm giants and other ancient giants

export const stormGiant: Monster = {
  id: 'storm-giant-2024',
  name: 'Storm Giant',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'giant',
  alignment: 'chaotic good',
  armorClass: 16,
  hitPoints: { count: 16, die: 'd12', modifier: 80, notation: '16d12+80' },
  speed: { walk: 50, fly: 50 },
  abilities: { str: 29, dex: 14, con: 20, int: 16, wis: 18, cha: 18 },
  savingThrows: { str: 12, con: 9, wis: 8, cha: 8 },
  skills: { Arcana: 7, Athletics: 12, Perception: 8 },
  damageImmunities: ['lightning', 'thunder'],
  senses: ['passive Perception 18'],
  languages: ['Common', 'Giant'],
  challengeRating: 16,
  experiencePoints: 15000,
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The giant can breathe air and water.',
    },
    {
      name: 'Legendary Resistance',
      description:
        'If the giant fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The giant makes two greatsword attacks.',
    },
    {
      name: 'Greatsword',
      description:
        'Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 28 (6d6 + 8) slashing damage.',
      attackBonus: 12,
      reach: 15,
      damage: [{ dice: { count: 6, die: 'd6', modifier: 8, notation: '6d6+8' }, type: 'slashing' }],
    },
    {
      name: 'Rock',
      description:
        'Ranged Weapon Attack: +12 to hit, range 60/240 ft., one target. Hit: 35 (10d6) bludgeoning damage.',
      attackBonus: 12,
      reach: 60,
      damage: [{ dice: { count: 10, die: 'd6', notation: '10d6' }, type: 'bludgeoning' }],
    },
    {
      name: 'Lightning Strike',
      description:
        'The giant casts lightning bolt as a 6th-level spell, centered on itself. Each creature within 100 feet of the giant must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much on a successful one.',
      savingThrow: { attribute: 'dex', dc: 17, effect: 'half as much damage on a success' },
      damage: [{ dice: { count: 12, die: 'd8', notation: '12d8' }, type: 'lightning' }],
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The giant makes a Wisdom (Perception) check.',
    },
    {
      name: 'Melee Attack',
      cost: 1,
      description: 'The giant makes one greatsword attack.',
    },
    {
      name: 'Teleport',
      cost: 2,
      description: 'The giant magically teleports up to 60 feet to an unoccupied space it can see.',
    },
  ],
  environment: ['mountain'],
};

export const giantsCR11Plus: Monster[] = [stormGiant];
