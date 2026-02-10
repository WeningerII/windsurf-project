// D&D 5e SRD Sorcerer Metamagic Options

export interface Metamagic {
  id: string;
  name: string;
  system: string;
  source: string;
  sorceryPointCost: number;
  description: string;
  effects: string[];
}

export const sorcererMetamagic: Metamagic[] = [
  {
    id: 'careful-spell',
    name: 'Careful Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 1,
    description: 'When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell\'s full effects.',
    effects: ['Choose creatures to succeed on saving throw'],
  },
  {
    id: 'distant-spell',
    name: 'Distant Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 1,
    description: 'When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell.',
    effects: ['Double spell range'],
  },
  {
    id: 'empowered-spell',
    name: 'Empowered Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 1,
    description: 'When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier.',
    effects: ['Reroll damage dice'],
  },
  {
    id: 'extended-spell',
    name: 'Extended Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 1,
    description: 'When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration.',
    effects: ['Double spell duration'],
  },
  {
    id: 'heightened-spell',
    name: 'Heightened Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 3,
    description: 'When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target disadvantage on its first saving throw made against the spell.',
    effects: ['Target has disadvantage on first save'],
  },
  {
    id: 'quickened-spell',
    name: 'Quickened Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 2,
    description: 'When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action.',
    effects: ['Cast spell as bonus action'],
  },
  {
    id: 'subtle-spell',
    name: 'Subtle Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 1,
    description: 'When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.',
    effects: ['Cast without components'],
  },
  {
    id: 'twinned-spell',
    name: 'Twinned Spell',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    sorceryPointCost: 1,
    description: 'When you cast a spell that targets only one creature and doesn\'t have a range of self, you can spend a number of sorcery points equal to the spell\'s level to target another creature in range with the same spell.',
    effects: ['Target additional creature with spell'],
  },
];
