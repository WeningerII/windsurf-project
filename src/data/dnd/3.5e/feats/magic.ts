// D&D 3.5e Magic Feats

import { FeatDefinition } from '../../../../types/character-options/feats';

export const spellFocusEvocation: FeatDefinition = {
  id: 'spell-focus-evocation-35e',
  name: 'Spell Focus (Evocation)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at evocation magic.',
  benefits: ['+1 bonus on saving throws against your evocation spells'],
};

export const spellFocusAbjuration: FeatDefinition = {
  id: 'spell-focus-abjuration-35e',
  name: 'Spell Focus (Abjuration)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at abjuration magic.',
  benefits: ['+1 bonus on saving throws against your abjuration spells'],
};

export const spellFocusConjuration: FeatDefinition = {
  id: 'spell-focus-conjuration-35e',
  name: 'Spell Focus (Conjuration)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at conjuration magic.',
  benefits: ['+1 bonus on saving throws against your conjuration spells'],
};

export const spellFocusDivination: FeatDefinition = {
  id: 'spell-focus-divination-35e',
  name: 'Spell Focus (Divination)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at divination magic.',
  benefits: ['+1 bonus on saving throws against your divination spells'],
};

export const spellFocusEnchantment: FeatDefinition = {
  id: 'spell-focus-enchantment-35e',
  name: 'Spell Focus (Enchantment)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at enchantment magic.',
  benefits: ['+1 bonus on saving throws against your enchantment spells'],
};

export const spellFocusIllusion: FeatDefinition = {
  id: 'spell-focus-illusion-35e',
  name: 'Spell Focus (Illusion)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at illusion magic.',
  benefits: ['+1 bonus on saving throws against your illusion spells'],
};

export const spellFocusNecromancy: FeatDefinition = {
  id: 'spell-focus-necromancy-35e',
  name: 'Spell Focus (Necromancy)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at necromancy magic.',
  benefits: ['+1 bonus on saving throws against your necromancy spells'],
};

export const spellFocusTransmutation: FeatDefinition = {
  id: 'spell-focus-transmutation-35e',
  name: 'Spell Focus (Transmutation)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are skilled at transmutation magic.',
  benefits: ['+1 bonus on saving throws against your transmutation spells'],
};

export const spellPenetrationGreater: FeatDefinition = {
  id: 'spell-penetration-greater-35e',
  name: 'Greater Spell Penetration',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Spell Penetration' }],
  description: 'Your spells are more likely to overcome spell resistance.',
  benefits: ['+4 bonus on caster level checks to overcome spell resistance'],
};

export const quickenSpell: FeatDefinition = {
  id: 'quicken-spell-35e',
  name: 'Quicken Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You can cast spells faster.',
  benefits: ['You can cast one spell per day as a free action instead of a standard action'],
};

export const silentSpell: FeatDefinition = {
  id: 'silent-spell-35e',
  name: 'Silent Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You can cast spells without speaking.',
  benefits: ['You can cast spells without verbal components'],
};

export const stillSpell: FeatDefinition = {
  id: 'still-spell-35e',
  name: 'Still Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You can cast spells without moving.',
  benefits: ['You can cast spells without somatic components'],
};

export const extendSpell: FeatDefinition = {
  id: 'extend-spell-35e',
  name: 'Extend Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Your spells last longer.',
  benefits: ['You can double the duration of your spells'],
};

export const maximizeSpell: FeatDefinition = {
  id: 'maximize-spell-35e',
  name: 'Maximize Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Your spells are maximized.',
  benefits: ['You can maximize the damage or healing of your spells'],
};

export const empowerSpell: FeatDefinition = {
  id: 'empower-spell-35e',
  name: 'Empower Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Your spells are more powerful.',
  benefits: ['You can increase the damage or healing of your spells by 50%'],
};

export const wideningSpell: FeatDefinition = {
  id: 'widening-spell-35e',
  name: 'Widening Spell',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Your spells affect a wider area.',
  benefits: ['You can double the area of effect of your spells'],
};

export const magicFeats: FeatDefinition[] = [
  spellFocusEvocation,
  spellFocusAbjuration,
  spellFocusConjuration,
  spellFocusDivination,
  spellFocusEnchantment,
  spellFocusIllusion,
  spellFocusNecromancy,
  spellFocusTransmutation,
  spellPenetrationGreater,
  quickenSpell,
  silentSpell,
  stillSpell,
  extendSpell,
  maximizeSpell,
  empowerSpell,
  wideningSpell,
];
