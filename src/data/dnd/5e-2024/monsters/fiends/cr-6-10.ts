import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Fiends - CR 6-10 (SRD 5.2)
// Demons, devils, and powerful fiends

export const succubus: Monster = {
  id: 'succubus-2024',
  name: 'Succubus',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'fiend',
  alignment: 'chaotic evil',
  armorClass: 15,
  hitPoints: { count: 6, die: 'd8', modifier: 12, notation: '6d8+12' },
  speed: { walk: 30, fly: 60 },
  abilities: { str: 8, dex: 17, con: 13, int: 15, wis: 12, cha: 20 },
  savingThrows: { wis: 4, cha: 7 },
  skills: { Deception: 10, Insight: 4, Perception: 4, Persuasion: 7 },
  damageResistances: ['cold', 'fire', 'lightning', 'poison', 'bludgeoning', 'piercing', 'slashing'],
  senses: ['truesight 120 ft.', 'passive Perception 14'],
  languages: ['Abyssal', 'Common', 'Infernal', 'telepathy 120 ft.'],
  challengeRating: 4,
  experiencePoints: 1100,
  specialAbilities: [
    {
      name: 'Telepathic Bond',
      description:
        'The succubus ignores the range restriction on its telepathy when communicating with a creature it has charmed. The charmed creature can respond telepathically to the succubus even when it is on a different plane of existence.',
    },
  ],
  actions: [
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage.',
    },
    {
      name: 'Charm',
      description:
        "One humanoid the succubus can see within 30 feet of it must make a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed creature obeys the succubus's verbal or telepathic commands. If the target takes any damage, it can repeat the saving throw, ending the effect on a success.",
    },
  ],
  environment: ['underdark', 'urban'],
};

export const fiendsCR6to10: Monster[] = [succubus];
