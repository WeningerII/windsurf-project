// D&D 3.5e Metamagic Feats - System Reference Document v3.5
//
// Parsed from the OGL System Reference Document v3.5 (github.com/olimot/srd-v3.5-md),
// which reproduces the SRD verbatim under the Open Game License v1.0a.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const metamagicFeats: FeatDefinition[] = [
  {
    id: 'empower-spell-35e',
    name: 'Empower Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'All variable, numeric effects of an empowered spell are increased by one-half. Saving throws and opposed rolls are not affected, nor are spells without random variables. An empowered spell uses up a spell slot two levels higher than the spell’s actual level.',
    benefits: [
      'All variable, numeric effects of an empowered spell are increased by one-half.',
      'Saving throws and opposed rolls are not affected, nor are spells without random variables.',
      'An empowered spell uses up a spell slot two levels higher than the spell’s actual level.',
    ],
  },
  {
    id: 'enlarge-spell-35e',
    name: 'Enlarge Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You can alter a spell with a range of close, medium, or long to increase its range by 100%. An enlarged spell with a range of close now has a range of 50 ft. + 5 ft./level, while medium-range spells have a range of 200 ft. + 20 ft./level and long-range spells have a range of 800 ft. + 80 ft./level. An enlarged spell uses up a spell slot one level higher than the spell’s actual level. Spells whose ranges are not defined by distance, as well as spells whose ranges are not close, medium, or long, do not have increased ranges.',
    benefits: [
      'You can alter a spell with a range of close, medium, or long to increase its range by 100%.',
      'An enlarged spell with a range of close now has a range of 50 ft. + 5 ft./level, while medium-range spells have a range of 200 ft. + 20 ft./level and long-range spells have a range of 800 ft. + 80 ft./level.',
      'An enlarged spell uses up a spell slot one level higher than the spell’s actual level.',
      'Spells whose ranges are not defined by distance, as well as spells whose ranges are not close, medium, or long, do not have increased ranges.',
    ],
  },
  {
    id: 'extend-spell-35e',
    name: 'Extend Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'An extended spell lasts twice as long as normal. A spell with a duration of concentration, instantaneous, or permanent is not affected by this feat. An extended spell uses up a spell slot one level higher than the spell’s actual level.',
    benefits: [
      'An extended spell lasts twice as long as normal.',
      'A spell with a duration of concentration, instantaneous, or permanent is not affected by this feat.',
      'An extended spell uses up a spell slot one level higher than the spell’s actual level.',
    ],
  },
  {
    id: 'heighten-spell-35e',
    name: 'Heighten Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'A heightened spell has a higher spell level than normal (up to a maximum of 9th level). Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies. All effects dependent on spell level (such as saving throw DCs and ability to penetrate a lesser globe of invulnerability) are calculated according to the heightened level. The heightened spell is as difficult to prepare and cast as a spell of its effective level.',
    benefits: [
      'A heightened spell has a higher spell level than normal (up to a maximum of 9th level).',
      'Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies.',
      'All effects dependent on spell level (such as saving throw DCs and ability to penetrate a lesser globe of invulnerability) are calculated according to the heightened level.',
      'The heightened spell is as difficult to prepare and cast as a spell of its effective level.',
    ],
  },
  {
    id: 'maximize-spell-35e',
    name: 'Maximize Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'All variable, numeric effects of a spell modified by this feat are maximized. Saving throws and opposed rolls are not affected, nor are spells without random variables. A maximized spell uses up a spell slot three levels higher than the spell’s actual level. An empowered, maximized spell gains the separate benefits of each feat: the maximum result plus one-half the normally rolled result.',
    benefits: [
      'All variable, numeric effects of a spell modified by this feat are maximized.',
      'Saving throws and opposed rolls are not affected, nor are spells without random variables.',
      'A maximized spell uses up a spell slot three levels higher than the spell’s actual level.',
      'An empowered, maximized spell gains the separate benefits of each feat: the maximum result plus one-half the normally rolled result.',
    ],
  },
  {
    id: 'quicken-spell-35e',
    name: 'Quicken Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'Casting a quickened spell is a free action. You can perform another action, even casting another spell, in the same round as you cast a quickened spell. You may cast only one quickened spell per round. A spell whose casting time is more than 1 full round action cannot be quickened. A quickened spell uses up a spell slot four levels higher than the spell’s actual level. Casting a quickened spell doesn’t provoke an attack of opportunity.',
    benefits: [
      'Casting a quickened spell is a free action.',
      'You can perform another action, even casting another spell, in the same round as you cast a quickened spell.',
      'You may cast only one quickened spell per round.',
      'A spell whose casting time is more than 1 full round action cannot be quickened.',
      'A quickened spell uses up a spell slot four levels higher than the spell’s actual level.',
      'Casting a quickened spell doesn’t provoke an attack of opportunity.',
    ],
    special:
      'This feat can’t be applied to any spell cast spontaneously (including sorcerer spells, bard spells, and cleric or druid spells cast spontaneously), since applying a metamagic feat to a spontaneously cast spell automatically increases the casting time to a full-round action.',
  },
  {
    id: 'silent-spell-35e',
    name: 'Silent Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'A silent spell can be cast with no verbal components. Spells without verbal components are not affected. A silent spell uses up a spell slot one level higher than the spell’s actual level.',
    benefits: [
      'A silent spell can be cast with no verbal components.',
      'Spells without verbal components are not affected.',
      'A silent spell uses up a spell slot one level higher than the spell’s actual level.',
    ],
    special: 'Bard spells cannot be enhanced by this metamagic feat.',
  },
  {
    id: 'still-spell-35e',
    name: 'Still Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'A stilled spell can be cast with no somatic components. Spells without somatic components are not affected. A stilled spell uses up a spell slot one level higher than the spell’s actual level.',
    benefits: [
      'A stilled spell can be cast with no somatic components.',
      'Spells without somatic components are not affected.',
      'A stilled spell uses up a spell slot one level higher than the spell’s actual level.',
    ],
  },
];
