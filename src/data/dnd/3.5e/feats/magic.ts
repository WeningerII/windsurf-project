// D&D 3.5e Magic Feats (SRD 3.5)

import { FeatDefinition } from '../../../../types/character-options/feats';

export const magicFeats: FeatDefinition[] = [
  {
    id: 'spell-focus-evocation-35e',
    name: 'Spell Focus (Evocation)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at evocation magic.',
    benefits: ['+1 bonus on saving throws against your evocation spells'],
  },
  {
    id: 'spell-focus-abjuration-35e',
    name: 'Spell Focus (Abjuration)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at abjuration magic.',
    benefits: ['+1 bonus on saving throws against your abjuration spells'],
  },
  {
    id: 'spell-focus-conjuration-35e',
    name: 'Spell Focus (Conjuration)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at conjuration magic.',
    benefits: ['+1 bonus on saving throws against your conjuration spells'],
  },
  {
    id: 'spell-focus-divination-35e',
    name: 'Spell Focus (Divination)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at divination magic.',
    benefits: ['+1 bonus on saving throws against your divination spells'],
  },
  {
    id: 'spell-focus-enchantment-35e',
    name: 'Spell Focus (Enchantment)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at enchantment magic.',
    benefits: ['+1 bonus on saving throws against your enchantment spells'],
  },
  {
    id: 'spell-focus-illusion-35e',
    name: 'Spell Focus (Illusion)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at illusion magic.',
    benefits: ['+1 bonus on saving throws against your illusion spells'],
  },
  {
    id: 'spell-focus-necromancy-35e',
    name: 'Spell Focus (Necromancy)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at necromancy magic.',
    benefits: ['+1 bonus on saving throws against your necromancy spells'],
  },
  {
    id: 'spell-focus-transmutation-35e',
    name: 'Spell Focus (Transmutation)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at transmutation magic.',
    benefits: ['+1 bonus on saving throws against your transmutation spells'],
  },
  {
    id: 'spell-penetration-greater-35e',
    name: 'Greater Spell Penetration',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Spell Penetration',
      },
    ],
    description: 'Your spells are more likely to overcome spell resistance.',
    benefits: ['+4 bonus on caster level checks to overcome spell resistance'],
  },
  {
    id: 'eschew-materials-35e',
    name: 'Eschew Materials',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells without minor material components.',
    benefits: [
      'Cast any spell with a material component costing 1 gp or less without that component',
    ],
  },
  {
    id: 'greater-spell-focus-35e',
    name: 'Greater Spell Focus',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'Your spells of a chosen school are even harder to resist.',
    benefits: ['+1 to save DCs for spells of the chosen school (stacks with Spell Focus)'],
    special:
      'You can gain this feat multiple times; each time it applies to a new school for which you have Spell Focus.',
  },
  {
    id: 'improved-counterspell-35e',
    name: 'Improved Counterspell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You are skilled at countering the spells of others.',
    benefits: [
      'Counterspell using any spell of the same school that is one or more levels higher than the target',
    ],
  },
  {
    id: 'improved-familiar-35e',
    name: 'Improved Familiar',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Ability to acquire a new familiar',
      },
      {
        type: 'other',
        description: 'compatible alignment',
      },
      {
        type: 'other',
        description: 'sufficiently high level (see below)',
      },
    ],
    description: 'You can call a more exotic and powerful familiar.',
    benefits: [
      'Choose your familiar from an expanded list of more powerful creatures based on your caster level',
    ],
  },
  {
    id: 'spell-mastery-35e',
    name: 'Spell Mastery',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Wizard level 1st',
      },
    ],
    description: 'You have mastered spells you can prepare from memory.',
    benefits: [
      'Choose spells equal to your Intelligence modifier; prepare them without a spellbook',
    ],
    special: 'You can gain this feat multiple times; each time choose new spells.',
  },
];
