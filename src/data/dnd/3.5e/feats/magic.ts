// D&D 3.5e Magic Feats - System Reference Document v3.5
//
// Parsed from the OGL System Reference Document v3.5 (github.com/olimot/srd-v3.5-md),
// which reproduces the SRD verbatim under the Open Game License v1.0a.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const magicFeats: FeatDefinition[] = [
  {
    id: 'augment-summoning-35e',
    name: 'Augment Summoning',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Spell Focus (conjuration).' }],
    description:
      'Each creature you conjure with any summon spell gains a +4 enhancement bonus to Strength and Constitution for the duration of the spell that summoned it.',
    benefits: [
      'Each creature you conjure with any summon spell gains a +4 enhancement bonus to Strength and Constitution for the duration of the spell that summoned it.',
    ],
  },
  {
    id: 'combat-casting-35e',
    name: 'Combat Casting',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You get a +4 bonus on Concentration checks made to cast a spell or use a spell-like ability while on the defensive or while you are grappling or pinned.',
    benefits: [
      'You get a +4 bonus on Concentration checks made to cast a spell or use a spell-like ability while on the defensive or while you are grappling or pinned.',
    ],
  },
  {
    id: 'eschew-materials-35e',
    name: 'Eschew Materials',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You can cast any spell that has a material component costing 1 gp or less without needing that component. (The casting of the spell still provokes attacks of opportunity as normal.) If the spell requires a material component that costs more than 1 gp, you must have the material component at hand to cast the spell, just as normal.',
    benefits: [
      'You can cast any spell that has a material component costing 1 gp or less without needing that component. (The casting of the spell still provokes attacks of opportunity as normal.) If the spell requires a material component that costs more than 1 gp, you must have the material component at hand to cast the spell, just as normal.',
    ],
  },
  {
    id: 'greater-spell-focus-35e',
    name: 'Greater Spell Focus',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select.',
    benefits: [
      'Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select.',
      'This bonus stacks with the bonus from Spell Focus.',
    ],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new school of magic to which you already have applied the Spell Focus feat.',
  },
  {
    id: 'greater-spell-penetration-35e',
    name: 'Greater Spell Penetration',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Spell Penetration.' }],
    description:
      'You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature’s spell resistance.',
    benefits: [
      'You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature’s spell resistance.',
      'This bonus stacks with the one from Spell Penetration.',
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
        description:
          'Ability to acquire a new familiar, compatible alignment, sufficiently high level (see below).',
      },
    ],
    description:
      'When choosing a familiar, the creatures listed below are also available to the spellcaster.',
    benefits: [
      'When choosing a familiar, the creatures listed below are also available to the spellcaster.',
      'The spellcaster may choose a familiar with an alignment up to one step away on each of the alignment axes (lawful through chaotic, good through evil). <table data-debug="no-caption" class="half-width-table"><tbody><tr><th>Familiar</th><th>Alignment</th><th>Arcane Spellcaster Level</th></tr><tr><td>Shocker lizard</td><td>Neutral</td><td>5th</td></tr><tr><td>Stirge</td><td>Neutral</td><td>5th</td></tr><tr><td>Formian worker</td><td>Lawful neutral</td><td>7th</td></tr><tr><td>Imp</td><td>Lawful evil</td><td>7th</td></tr><tr><td>Pseudodragon</td><td>Neutral good</td><td>7th</td></tr><tr><td>Quasit</td><td>Chaotic evil</td><td>7th</td></tr></tbody></table> Improved familiars otherwise use the rules for regular familiars, with two exceptions: If the creature’s type is something other than animal, its type does not change; and improved familiars do not gain the ability to speak with other creatures of their kind (although many of them already have the ability to communicate).',
      'The list in the table above presents only a few possible improved familiars.',
      'Almost any creature of the same general size and power as those on the list makes a suitable familiar.',
      'Nor is the master’s alignment the only possible categorization.',
      'For instance, improved familiars could be assigned by the master’s creature type or subtype, as shown below. <table data-debug="no-caption" class="full-width-table"><tbody><tr><th>Familiar</th><th>Type/Subtype</th><th>Arcane Spellcaster Level</th></tr><tr><td>Celestial hawk<sup>1</sup></td><td>Good</td><td>3rd</td></tr><tr><td>Fiendish Tiny viper snake<sup>2</sup></td><td>Evil</td><td>3rd</td></tr><tr><td>Air elemental, Small</td><td>Air</td><td>5th</td></tr><tr><td>Earth elemental, Small</td><td>Earth</td><td>5th</td></tr><tr><td>Fire elemental, Small</td><td>Fire</td><td>5th</td></tr><tr><td>Shocker lizard</td><td>Electricity</td><td>5th</td></tr><tr><td>Water elemental, Small</td><td>Water</td><td>5th</td></tr><tr><td>Homunculus<sup>3</sup></td><td>Undead</td><td>7th</td></tr><tr><td>Ice mephit</td><td>Cold</td><td>7th</td></tr><tr><td colspan="3">1 Or other celestial animal from the standard familiar list.</td></tr><tr><td colspan="3">2 Or other fiendish animal from the standard familiar list.</td></tr><tr><td colspan="3">3 The master must first create the homunculus, substituting ichor or another part of the master’s body for blood if necessary.</td></tr></tbody></table>',
    ],
  },
  {
    id: 'natural-spell-35e',
    name: 'Natural Spell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Wis 13, wild shape ability.' }],
    description:
      'You can complete the verbal and somatic components of spells while in a wild shape.',
    benefits: [
      'You can complete the verbal and somatic components of spells while in a wild shape.',
      'You substitute various noises and gestures for the normal verbal and somatic components of a spell.',
      'You can also use any material components or focuses you possess, even if such items are melded within your current form.',
      'This feat does not permit the use of magic items while you are in a form that could not ordinarily use them, and you do not gain the ability to speak while in a wild shape.',
    ],
  },
  {
    id: 'spell-focus-35e',
    name: 'Spell Focus',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select.',
    benefits: [
      'Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select.',
    ],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new school of magic.',
  },
  {
    id: 'spell-mastery-35e',
    name: 'Spell Mastery',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Wizard level 1st.' }],
    description:
      'Each time you take this feat, choose a number of spells equal to your Intelligence modifier that you already know.',
    benefits: [
      'Each time you take this feat, choose a number of spells equal to your Intelligence modifier that you already know.',
      'From that point on, you can prepare these spells without referring to a spellbook.',
    ],
  },
  {
    id: 'spell-penetration-35e',
    name: 'Spell Penetration',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature’s spell resistance.',
    benefits: [
      'You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature’s spell resistance.',
    ],
  },
];
