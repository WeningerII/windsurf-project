/**
 * Pathfinder 1e Metamagic Feats - Core Rulebook
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const empowerSpell: FeatDefinition = {
  id: 'empower-spell-pf1e', name: 'Empower Spell', system: 'pf1e', source: 'CRB',
  description: 'You can increase the power of your spells, causing them to deal more damage.',
  benefits: ['All variable, numeric effects of an empowered spell are increased by half including bonuses to those dice rolls', 'An empowered spell uses up a spell slot two levels higher than the spell\'s actual level'],
};

export const enlargeSpell: FeatDefinition = {
  id: 'enlarge-spell-pf1e', name: 'Enlarge Spell', system: 'pf1e', source: 'CRB',
  description: 'You can increase the range of your spells.',
  benefits: ['You can alter a spell with a range of close, medium, or long to increase its range by 100%', 'An enlarged spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const extendSpell: FeatDefinition = {
  id: 'extend-spell-pf1e', name: 'Extend Spell', system: 'pf1e', source: 'CRB',
  description: 'You can make your spells last twice as long.',
  benefits: ['An extended spell lasts twice as long as normal', 'An extended spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const heightenSpell: FeatDefinition = {
  id: 'heighten-spell-pf1e', name: 'Heighten Spell', system: 'pf1e', source: 'CRB',
  description: 'You can cast spells as if they were a higher level.',
  benefits: ['A heightened spell has a higher spell level than normal (up to a maximum of 9th level)', 'Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies'],
};

export const maximizeSpell: FeatDefinition = {
  id: 'maximize-spell-pf1e', name: 'Maximize Spell', system: 'pf1e', source: 'CRB',
  description: 'Your spells have the maximum possible effect.',
  benefits: ['All variable, numeric effects of a spell modified by this feat are maximized', 'A maximized spell uses up a spell slot three levels higher than the spell\'s actual level'],
};

export const quickenSpell: FeatDefinition = {
  id: 'quicken-spell-pf1e', name: 'Quicken Spell', system: 'pf1e', source: 'CRB',
  description: 'You can cast spells in a fraction of the normal time.',
  benefits: ['Casting a quickened spell is a swift action', 'You can perform another action, even casting another spell, in the same round', 'A quickened spell uses up a spell slot four levels higher than the spell\'s actual level'],
};

export const silentSpell: FeatDefinition = {
  id: 'silent-spell-pf1e', name: 'Silent Spell', system: 'pf1e', source: 'CRB',
  description: 'You can cast your spells without making any sound.',
  benefits: ['A silent spell can be cast with no verbal components', 'A silent spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const stillSpell: FeatDefinition = {
  id: 'still-spell-pf1e', name: 'Still Spell', system: 'pf1e', source: 'CRB',
  description: 'You can cast spells without moving.',
  benefits: ['A stilled spell can be cast with no somatic components', 'A stilled spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const widenSpell: FeatDefinition = {
  id: 'widen-spell-pf1e', name: 'Widen Spell', system: 'pf1e', source: 'CRB',
  description: 'You can cast your spells so that they occupy a larger space.',
  benefits: ['You can alter a burst, emanation, or spread shaped spell to increase its area. Any numeric measurements of the spell\'s area increase by 100%', 'A widened spell uses up a spell slot three levels higher than the spell\'s actual level'],
};

export const metamagicFeats: FeatDefinition[] = [
  empowerSpell, enlargeSpell, extendSpell, heightenSpell, maximizeSpell,
  quickenSpell, silentSpell, stillSpell, widenSpell,
];
