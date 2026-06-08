import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { con: 2, cha: -2 },
    },
  ],

  size: 'medium',
  speed: 20,

  languages: {
    automatic: ['Common', 'Dwarven'],
    choice: {
      count: 0,
      options: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'darkvision-dwarf-35e',
      name: 'Darkvision',
      source: 'Dwarf',
      description: 'Dwarves can see in the dark up to 60 feet.',
    },
    {
      id: 'stonecunning-35e',
      name: 'Stonecunning',
      source: 'Dwarf',
      description: 'Dwarves have a +2 racial bonus on Search checks to notice unusual stonework.',
    },
    {
      id: 'weapon-familiarity-dwarf',
      name: 'Weapon Familiarity',
      source: 'Dwarf',
      description:
        'Dwarves may treat dwarven waraxes and dwarven urgroshes as martial weapons, rather than exotic weapons.',
    },
    {
      id: 'stability',
      name: 'Stability',
      source: 'Dwarf',
      description:
        'A dwarf gains a +4 bonus on ability checks made to resist being bull rushed or tripped when standing on the ground.',
    },
    {
      id: 'bonus-vs-giants',
      name: 'Bonus Against Giants',
      source: 'Dwarf',
      description:
        'Dwarves gain a +1 bonus on attack rolls against orcs and goblinoids. Dwarves gain a +4 dodge bonus to Armor Class against monsters of the giant type.',
    },
  ],

  description:
    "Dwarves are known for their skill in warfare, their ability to withstand physical and magical punishment, and their knowledge of the earth's secrets.",

  ageInfo:
    'Dwarves are considered young until age 40, middle-aged at 125, old at 188, and venerable at 250.',

  alignmentTendency: 'Dwarves are usually lawful.',

  sizeDescription: 'Dwarves stand 4 to 4½ feet tall. Your size is Medium.',
};
