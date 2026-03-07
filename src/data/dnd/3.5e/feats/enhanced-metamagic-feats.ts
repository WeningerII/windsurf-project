// D&D 3.5e Enhanced Metamagic Feats with Detailed Mechanics
// SRD-compliant metamagic feats with comprehensive descriptions

import { FeatDefinition } from '../../../../types/character-options/feats';

export const empowerSpell: FeatDefinition = {
  id: 'empower-spell-35e',
  name: 'Empower Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can cast spells to greater effect.',
  benefits: [
    'All variable, numeric effects of an empowered spell are increased by one-half',
    'Saving throws and opposed rolls are not affected',
    'Spells without random variables are not affected',
    "An empowered spell uses up a spell slot two levels higher than the spell's actual level",
  ],
};

export const enlargeSpell: FeatDefinition = {
  id: 'enlarge-spell-35e',
  name: 'Enlarge Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can cast spells farther than normal.',
  benefits: [
    'You can alter a spell with a range of close, medium, or long to increase its range by 100%',
    'An enlarged spell with a range of close now has a range of 50 ft. + 5 ft./level, while medium-range spells have a range of 200 ft. + 20 ft./level and long-range spells have a range of 800 ft. + 80 ft./level',
    "An enlarged spell uses up a spell slot one level higher than the spell's actual level",
    'Spells whose ranges are not defined by distance do not have increased ranges',
  ],
};

export const extendSpell: FeatDefinition = {
  id: 'extend-spell-35e',
  name: 'Extend Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can make your spells last twice as long.',
  benefits: [
    'An extended spell lasts twice as long as normal',
    'A spell with a duration of concentration, instantaneous, or permanent is not affected by this feat',
    "An extended spell uses up a spell slot one level higher than the spell's actual level",
  ],
};

export const heightenSpell: FeatDefinition = {
  id: 'heighten-spell-35e',
  name: 'Heighten Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can cast a spell as if it were a higher level.',
  benefits: [
    'A heightened spell has a higher spell level than normal (up to a maximum of 9th level)',
    'Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies',
    'All effects dependent on spell level (such as saving throw DCs and ability to penetrate a lesser globe of invulnerability) are calculated according to the heightened level',
    'The heightened spell is as difficult to prepare or cast as a spell of its effective level',
  ],
};

export const maximizeSpell: FeatDefinition = {
  id: 'maximize-spell-35e',
  name: 'Maximize Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can cast spells to maximum effect.',
  benefits: [
    'All variable, numeric effects of a spell modified by this feat are maximized',
    'Saving throws and opposed rolls are not affected, nor are spells without random variables',
    "A maximized spell uses up a spell slot three levels higher than the spell's actual level",
    'An empowered, maximized spell gains the separate benefits of each feat: the maximum result plus one-half the normally rolled result',
  ],
};

export const quickenSpell: FeatDefinition = {
  id: 'quicken-spell-35e',
  name: 'Quicken Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: "You can cast a spell with a moment's thought.",
  benefits: [
    'Casting a quickened spell is a free action',
    'You can perform another action, even casting another spell, in the same round as you cast a quickened spell',
    'You may cast only one quickened spell per round',
    'A spell whose casting time is more than 1 full round action cannot be quickened',
    "A quickened spell uses up a spell slot four levels higher than the spell's actual level",
    "Casting a quickened spell doesn't provoke an attack of opportunity",
  ],
};

export const silentSpell: FeatDefinition = {
  id: 'silent-spell-35e',
  name: 'Silent Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can cast spells silently.',
  benefits: [
    'A silent spell can be cast with no verbal components',
    'Spells without verbal components are not affected',
    "A silent spell uses up a spell slot one level higher than the spell's actual level",
  ],
};

export const stillSpell: FeatDefinition = {
  id: 'still-spell-35e',
  name: 'Still Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You can cast spells without gestures.',
  benefits: [
    'A stilled spell can be cast with no somatic components',
    'Spells without somatic components are not affected',
    "A stilled spell uses up a spell slot one level higher than the spell's actual level",
  ],
};

export const widenSpell: FeatDefinition = {
  id: 'widen-spell-35e',
  name: 'Widen Spell',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description:
    'You can alter a burst, emanation, line, or spread-shaped spell to increase its area.',
  benefits: [
    'You can alter a burst, emanation, line, or spread shaped spell to increase its area',
    "Any numeric measurements of the spell's area are doubled",
    "A widened spell uses up a spell slot three levels higher than the spell's actual level",
    'Spells that do not have an area of one of these four sorts are not affected by this feat',
  ],
};

export const dnd35eEnhancedMetamagicFeats: FeatDefinition[] = [
  empowerSpell,
  enlargeSpell,
  extendSpell,
  heightenSpell,
  maximizeSpell,
  quickenSpell,
  silentSpell,
  stillSpell,
  widenSpell,
];
