// D&D 3.5e Magic Feats — SRD 3.5 only.
//
// This file previously duplicated six metamagic feat ids already defined in
// metamagic.ts (with drifted text) and shipped a fabricated "Widening Spell";
// those were removed. The per-school Spell Focus entries encode the SRD 3.5
// Spell Focus feat (one selection per school) and Greater Spell Penetration is
// the SRD feat of the same name. All entries are re-cited as 'SRD 3.5' and
// their benefit text matches the SRD (the old text inverted Spell Focus into a
// defender bonus).

import { FeatDefinition } from '../../../../types/character-options/feats';

type SpellFocusSchool =
  | 'Abjuration'
  | 'Conjuration'
  | 'Divination'
  | 'Enchantment'
  | 'Evocation'
  | 'Illusion'
  | 'Necromancy'
  | 'Transmutation';

function spellFocusFor(school: SpellFocusSchool): FeatDefinition {
  return {
    id: `spell-focus-${school.toLowerCase()}-35e`,
    name: `Spell Focus (${school})`,
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: `Your ${school.toLowerCase()} spells are more potent than normal.`,
    benefits: [
      `Add +1 to the Difficulty Class for all saving throws against spells from the ${school.toLowerCase()} school`,
    ],
  };
}

export const spellFocusAbjuration: FeatDefinition = spellFocusFor('Abjuration');
export const spellFocusConjuration: FeatDefinition = spellFocusFor('Conjuration');
export const spellFocusDivination: FeatDefinition = spellFocusFor('Divination');
export const spellFocusEnchantment: FeatDefinition = spellFocusFor('Enchantment');
export const spellFocusEvocation: FeatDefinition = spellFocusFor('Evocation');
export const spellFocusIllusion: FeatDefinition = spellFocusFor('Illusion');
export const spellFocusNecromancy: FeatDefinition = spellFocusFor('Necromancy');
export const spellFocusTransmutation: FeatDefinition = spellFocusFor('Transmutation');

export const spellPenetrationGreater: FeatDefinition = {
  id: 'spell-penetration-greater-35e',
  name: 'Greater Spell Penetration',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Spell Penetration' }],
  description: 'Your spells are remarkably potent, defeating spell resistance more readily.',
  benefits: [
    "+2 bonus on caster level checks to overcome a creature's spell resistance (this stacks with Spell Penetration)",
  ],
};

export const magicFeats: FeatDefinition[] = [
  spellFocusAbjuration,
  spellFocusConjuration,
  spellFocusDivination,
  spellFocusEnchantment,
  spellFocusEvocation,
  spellFocusIllusion,
  spellFocusNecromancy,
  spellFocusTransmutation,
  spellPenetrationGreater,
];
