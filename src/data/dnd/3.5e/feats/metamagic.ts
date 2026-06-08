// D&D 3.5e Metamagic Feats (SRD 3.5)

import { FeatDefinition } from '../../../../types/character-options/feats';

export const metamagicFeats: FeatDefinition[] = [
  {
    id: 'empower-spell-35e',
    name: 'Empower Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells to greater effect.',
    benefits: [
      'All variable, numeric effects of an empowered spell are increased by one-half',
      "An empowered spell uses up a spell slot three levels higher than the spell's actual level",
    ],
  },
  {
    id: 'enlarge-spell-35e',
    name: 'Enlarge Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells farther than normal.',
    benefits: [
      'You can alter a spell with a range of close, medium, or long to increase its range by 100%',
      "An enlarged spell uses up a spell slot one level higher than the spell's actual level",
    ],
  },
  {
    id: 'extend-spell-35e',
    name: 'Extend Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can make your spells last longer.',
    benefits: [
      'An extended spell lasts twice as long as normal',
      "An extended spell uses up a spell slot one level higher than the spell's actual level",
    ],
  },
  {
    id: 'heighten-spell-35e',
    name: 'Heighten Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells as if they were higher level.',
    benefits: [
      'A heightened spell has a higher spell level than normal (up to a maximum of 9th level)',
      'Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies',
    ],
  },
  {
    id: 'maximize-spell-35e',
    name: 'Maximize Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells to maximum effect.',
    benefits: [
      'All variable, numeric effects of a spell modified by this feat are maximized',
      "A maximized spell uses up a spell slot three levels higher than the spell's actual level",
    ],
  },
  {
    id: 'quicken-spell-35e',
    name: 'Quicken Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: "You can cast spells with a moment's thought.",
    benefits: [
      'Casting a quickened spell is a free action',
      'You can perform another action, even casting another spell, in the same round',
      "A quickened spell uses up a spell slot four levels higher than the spell's actual level",
    ],
  },
  {
    id: 'silent-spell-35e',
    name: 'Silent Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells silently.',
    benefits: [
      'A silent spell can be cast with no verbal components',
      "A silent spell uses up a spell slot one level higher than the spell's actual level",
    ],
  },
  {
    id: 'still-spell-35e',
    name: 'Still Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast spells without gestures.',
    benefits: [
      'A stilled spell can be cast with no somatic components',
      "A stilled spell uses up a spell slot one level higher than the spell's actual level",
    ],
  },
  {
    id: 'widen-spell-35e',
    name: 'Widen Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can cast your spells so that they occupy a larger space.',
    benefits: [
      'You can alter a burst, emanation, line, or spread shaped spell to increase its area',
      "A widened spell uses up a spell slot three levels higher than the spell's actual level",
    ],
  },
];
