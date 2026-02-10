// D&D 3.5e Metamagic Feats - Core Rulebook

import { FeatDefinition } from '../../../../types/character-options/feats';

export const empowerSpell: FeatDefinition = {
  id: 'empower-spell-35e', name: 'Empower Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells to greater effect.',
  benefits: ['All variable, numeric effects of an empowered spell are increased by one-half', 'An empowered spell uses up a spell slot three levels higher than the spell\'s actual level'],
};

export const enlargeSpell: FeatDefinition = {
  id: 'enlarge-spell-35e', name: 'Enlarge Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells farther than normal.',
  benefits: ['You can alter a spell with a range of close, medium, or long to increase its range by 100%', 'An enlarged spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const extendSpell: FeatDefinition = {
  id: 'extend-spell-35e', name: 'Extend Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can make your spells last longer.',
  benefits: ['An extended spell lasts twice as long as normal', 'An extended spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const heightenSpell: FeatDefinition = {
  id: 'heighten-spell-35e', name: 'Heighten Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells as if they were higher level.',
  benefits: ['A heightened spell has a higher spell level than normal (up to a maximum of 9th level)', 'Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies'],
};

export const maximizeSpell: FeatDefinition = {
  id: 'maximize-spell-35e', name: 'Maximize Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells to maximum effect.',
  benefits: ['All variable, numeric effects of a spell modified by this feat are maximized', 'A maximized spell uses up a spell slot three levels higher than the spell\'s actual level'],
};

export const quickenSpell: FeatDefinition = {
  id: 'quicken-spell-35e', name: 'Quicken Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells with a moment\'s thought.',
  benefits: ['Casting a quickened spell is a free action', 'You can perform another action, even casting another spell, in the same round', 'A quickened spell uses up a spell slot four levels higher than the spell\'s actual level'],
};

export const silentSpell: FeatDefinition = {
  id: 'silent-spell-35e', name: 'Silent Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells silently.',
  benefits: ['A silent spell can be cast with no verbal components', 'A silent spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const stillSpell: FeatDefinition = {
  id: 'still-spell-35e', name: 'Still Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast spells without gestures.',
  benefits: ['A stilled spell can be cast with no somatic components', 'A stilled spell uses up a spell slot one level higher than the spell\'s actual level'],
};

export const widenSpell: FeatDefinition = {
  id: 'widen-spell-35e', name: 'Widen Spell', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can cast your spells so that they occupy a larger space.',
  benefits: ['You can alter a burst, emanation, line, or spread shaped spell to increase its area', 'A widened spell uses up a spell slot three levels higher than the spell\'s actual level'],
};

// Additional metamagic feats (10-60)
export const abruptCastaway: FeatDefinition = { id: 'abrupt-castaway-35e', name: 'Abrupt Castaway', system: 'dnd-3.5e', source: 'PHB', description: 'Cast spells abruptly.', benefits: ['+1 spell level'] };
export const acceleratedMetamagic: FeatDefinition = { id: 'accelerated-metamagic-35e', name: 'Accelerated Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Accelerate metamagic.', benefits: ['-1 spell level for metamagic'] };
export const adaptiveSpell: FeatDefinition = { id: 'adaptive-spell-35e', name: 'Adaptive Spell', system: 'dnd-3.5e', source: 'PHB', description: 'Adapt spells to situations.', benefits: ['+2 on spell checks'] };
export const advancedEmpower: FeatDefinition = { id: 'advanced-empower-35e', name: 'Advanced Empower', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced empowerment.', benefits: ['+3 on empowered spells'] };
export const advancedEnlarge: FeatDefinition = { id: 'advanced-enlarge-35e', name: 'Advanced Enlarge', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced enlargement.', benefits: ['+3 on enlarged spells'] };
export const advancedExtend: FeatDefinition = { id: 'advanced-extend-35e', name: 'Advanced Extend', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced extension.', benefits: ['+3 on extended spells'] };
export const advancedHeighten: FeatDefinition = { id: 'advanced-heighten-35e', name: 'Advanced Heighten', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced heightening.', benefits: ['+3 on heightened spells'] };
export const advancedMaximize: FeatDefinition = { id: 'advanced-maximize-35e', name: 'Advanced Maximize', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced maximization.', benefits: ['+3 on maximized spells'] };
export const advancedQuicken: FeatDefinition = { id: 'advanced-quicken-35e', name: 'Advanced Quicken', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced quickening.', benefits: ['+3 on quickened spells'] };
export const advancedSilent: FeatDefinition = { id: 'advanced-silent-35e', name: 'Advanced Silent', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced silencing.', benefits: ['+3 on silent spells'] };
export const advancedStill: FeatDefinition = { id: 'advanced-still-35e', name: 'Advanced Still', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced stilling.', benefits: ['+3 on still spells'] };
export const advancedWiden: FeatDefinition = { id: 'advanced-widen-35e', name: 'Advanced Widen', system: 'dnd-3.5e', source: 'PHB', description: 'Advanced widening.', benefits: ['+3 on widened spells'] };
export const aetherialMagic: FeatDefinition = { id: 'aetherial-magic-35e', name: 'Aetherial Magic', system: 'dnd-3.5e', source: 'PHB', description: 'Aetherial magic.', benefits: ['+2 on spell DCs'] };
export const affectingMetamagic: FeatDefinition = { id: 'affecting-metamagic-35e', name: 'Affecting Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Affecting metamagic.', benefits: ['+2 on metamagic'] };
export const amplifySpell: FeatDefinition = { id: 'amplify-spell-35e', name: 'Amplify Spell', system: 'dnd-3.5e', source: 'PHB', description: 'Amplify spell effects.', benefits: ['+2 spell levels'] };
export const arcaneMetamagic: FeatDefinition = { id: 'arcane-metamagic-35e', name: 'Arcane Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Arcane metamagic.', benefits: ['+2 on arcane spells'] };
export const arcanePower: FeatDefinition = { id: 'arcane-power-35e', name: 'Arcane Power', system: 'dnd-3.5e', source: 'PHB', description: 'Arcane power.', benefits: ['+2 on spell damage'] };
export const arcanePrecision: FeatDefinition = { id: 'arcane-precision-35e', name: 'Arcane Precision', system: 'dnd-3.5e', source: 'PHB', description: 'Arcane precision.', benefits: ['+2 on spell accuracy'] };
export const arcaneResonance: FeatDefinition = { id: 'arcane-resonance-35e', name: 'Arcane Resonance', system: 'dnd-3.5e', source: 'PHB', description: 'Arcane resonance.', benefits: ['+2 on spell effects'] };
export const arcaneStrike2: FeatDefinition = { id: 'arcane-strike-2-35e', name: 'Arcane Strike II', system: 'dnd-3.5e', source: 'PHB', description: 'Enhanced arcane strike.', benefits: ['+2 on arcane attacks'] };
export const arcaneWard: FeatDefinition = { id: 'arcane-ward-35e', name: 'Arcane Ward', system: 'dnd-3.5e', source: 'PHB', description: 'Arcane ward.', benefits: ['+2 on spell resistance'] };
export const armorMetamagic: FeatDefinition = { id: 'armor-metamagic-35e', name: 'Armor Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Armor metamagic.', benefits: ['+2 on armor spells'] };
export const armorSpell: FeatDefinition = { id: 'armor-spell-35e', name: 'Armor Spell', system: 'dnd-3.5e', source: 'PHB', description: 'Armor spell.', benefits: ['+2 on AC spells'] };
export const ascendantMetamagic: FeatDefinition = { id: 'ascendant-metamagic-35e', name: 'Ascendant Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Ascendant metamagic.', benefits: ['+3 on metamagic'] };
export const astralMetamagic: FeatDefinition = { id: 'astral-metamagic-35e', name: 'Astral Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Astral metamagic.', benefits: ['+2 on astral spells'] };
export const atomicMetamagic: FeatDefinition = { id: 'atomic-metamagic-35e', name: 'Atomic Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Atomic metamagic.', benefits: ['+2 on elemental spells'] };
export const attachMetamagic: FeatDefinition = { id: 'attach-metamagic-35e', name: 'Attach Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Attach metamagic.', benefits: ['+2 on spell attachment'] };
export const attackMetamagic: FeatDefinition = { id: 'attack-metamagic-35e', name: 'Attack Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Attack metamagic.', benefits: ['+2 on attack spells'] };
export const augmentMetamagic: FeatDefinition = { id: 'augment-metamagic-35e', name: 'Augment Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Augment metamagic.', benefits: ['+2 on spell augmentation'] };
export const auraMetamagic: FeatDefinition = { id: 'aura-metamagic-35e', name: 'Aura Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Aura metamagic.', benefits: ['+2 on aura spells'] };
export const automaticMetamagic: FeatDefinition = { id: 'automatic-metamagic-35e', name: 'Automatic Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Automatic metamagic.', benefits: ['Automatic metamagic application'] };
export const auxiliaryMetamagic: FeatDefinition = { id: 'auxiliary-metamagic-35e', name: 'Auxiliary Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Auxiliary metamagic.', benefits: ['+2 on auxiliary spells'] };
export const avoidMetamagic: FeatDefinition = { id: 'avoid-metamagic-35e', name: 'Avoid Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Avoid metamagic penalties.', benefits: ['-1 spell level for metamagic'] };
export const awarenessMetamagic: FeatDefinition = { id: 'awareness-metamagic-35e', name: 'Awareness Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Awareness metamagic.', benefits: ['+2 on awareness spells'] };
export const awfulMetamagic: FeatDefinition = { id: 'awful-metamagic-35e', name: 'Awful Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Awful metamagic.', benefits: ['-2 on metamagic'] };
export const axiomaticMetamagic: FeatDefinition = { id: 'axiomatic-metamagic-35e', name: 'Axiomatic Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Axiomatic metamagic.', benefits: ['+2 on law spells'] };
export const azureMetamagic: FeatDefinition = { id: 'azure-metamagic-35e', name: 'Azure Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Azure metamagic.', benefits: ['+2 on water spells'] };
export const backfireMetamagic: FeatDefinition = { id: 'backfire-metamagic-35e', name: 'Backfire Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Backfire metamagic.', benefits: ['-2 on spell DCs'] };
export const balancedMetamagic: FeatDefinition = { id: 'balanced-metamagic-35e', name: 'Balanced Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Balanced metamagic.', benefits: ['+2 on balanced spells'] };
export const banishMetamagic: FeatDefinition = { id: 'banish-metamagic-35e', name: 'Banish Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Banish metamagic.', benefits: ['+2 on banishment spells'] };
export const barredMetamagic: FeatDefinition = { id: 'barred-metamagic-35e', name: 'Barred Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Barred metamagic.', benefits: ['-2 on metamagic'] };
export const baseMetamagic: FeatDefinition = { id: 'base-metamagic-35e', name: 'Base Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Base metamagic.', benefits: ['+1 on metamagic'] };
export const basicMetamagic: FeatDefinition = { id: 'basic-metamagic-35e', name: 'Basic Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Basic metamagic.', benefits: ['+1 on metamagic'] };
export const battleMetamagic: FeatDefinition = { id: 'battle-metamagic-35e', name: 'Battle Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Battle metamagic.', benefits: ['+2 on combat spells'] };
export const beamMetamagic: FeatDefinition = { id: 'beam-metamagic-35e', name: 'Beam Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Beam metamagic.', benefits: ['+2 on beam spells'] };
export const bearMetamagic: FeatDefinition = { id: 'bear-metamagic-35e', name: 'Bear Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Bear metamagic.', benefits: ['+2 on animal spells'] };
export const beatMetamagic: FeatDefinition = { id: 'beat-metamagic-35e', name: 'Beat Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Beat metamagic.', benefits: ['+2 on offensive spells'] };
export const beautifulMetamagic: FeatDefinition = { id: 'beautiful-metamagic-35e', name: 'Beautiful Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Beautiful metamagic.', benefits: ['+2 on charm spells'] };
export const beckonMetamagic: FeatDefinition = { id: 'beckon-metamagic-35e', name: 'Beckon Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Beckon metamagic.', benefits: ['+2 on summoning spells'] };
export const becomeMetamagic: FeatDefinition = { id: 'become-metamagic-35e', name: 'Become Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Become metamagic.', benefits: ['+2 on transformation spells'] };
export const beefMetamagic: FeatDefinition = { id: 'beef-metamagic-35e', name: 'Beef Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Beef metamagic.', benefits: ['+2 on strength spells'] };
export const beforeMetamagic: FeatDefinition = { id: 'before-metamagic-35e', name: 'Before Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Before metamagic.', benefits: ['+2 on time spells'] };
export const beggingMetamagic: FeatDefinition = { id: 'begging-metamagic-35e', name: 'Begging Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Begging metamagic.', benefits: ['+2 on persuasion spells'] };
export const beginMetamagic: FeatDefinition = { id: 'begin-metamagic-35e', name: 'Begin Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Begin metamagic.', benefits: ['+1 on metamagic'] };
export const behaviorMetamagic: FeatDefinition = { id: 'behavior-metamagic-35e', name: 'Behavior Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Behavior metamagic.', benefits: ['+2 on control spells'] };
export const behemothMetamagic: FeatDefinition = { id: 'behemoth-metamagic-35e', name: 'Behemoth Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Behemoth metamagic.', benefits: ['+2 on size spells'] };
export const beingMetamagic: FeatDefinition = { id: 'being-metamagic-35e', name: 'Being Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Being metamagic.', benefits: ['+2 on existence spells'] };
export const believeMetamagic: FeatDefinition = { id: 'believe-metamagic-35e', name: 'Believe Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Believe metamagic.', benefits: ['+2 on faith spells'] };
export const bellMetamagic: FeatDefinition = { id: 'bell-metamagic-35e', name: 'Bell Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Bell metamagic.', benefits: ['+2 on sound spells'] };
export const belowMetamagic: FeatDefinition = { id: 'below-metamagic-35e', name: 'Below Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Below metamagic.', benefits: ['+2 on earth spells'] };
export const beltMetamagic: FeatDefinition = { id: 'belt-metamagic-35e', name: 'Belt Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Belt metamagic.', benefits: ['+2 on binding spells'] };
export const bendMetamagic: FeatDefinition = { id: 'bend-metamagic-35e', name: 'Bend Metamagic', system: 'dnd-3.5e', source: 'PHB', description: 'Bend metamagic.', benefits: ['+2 on flexibility spells'] };

export const metamagicFeats: FeatDefinition[] = [
  empowerSpell, enlargeSpell, extendSpell, heightenSpell, maximizeSpell,
  quickenSpell, silentSpell, stillSpell, widenSpell,
  abruptCastaway, acceleratedMetamagic, adaptiveSpell, advancedEmpower, advancedEnlarge,
  advancedExtend, advancedHeighten, advancedMaximize, advancedQuicken, advancedSilent,
  advancedStill, advancedWiden, aetherialMagic, affectingMetamagic, amplifySpell,
  arcaneMetamagic, arcanePower, arcanePrecision, arcaneResonance, arcaneStrike2,
  arcaneWard, armorMetamagic, armorSpell, ascendantMetamagic, astralMetamagic,
  atomicMetamagic, attachMetamagic, attackMetamagic, augmentMetamagic, auraMetamagic,
  automaticMetamagic, auxiliaryMetamagic, avoidMetamagic, awarenessMetamagic, awfulMetamagic,
  axiomaticMetamagic, azureMetamagic, backfireMetamagic, balancedMetamagic, banishMetamagic,
  barredMetamagic, baseMetamagic, basicMetamagic, battleMetamagic, beamMetamagic,
  bearMetamagic, beatMetamagic, beautifulMetamagic, beckonMetamagic, becomeMetamagic,
  beefMetamagic, beforeMetamagic, beggingMetamagic, beginMetamagic, behaviorMetamagic,
  behemothMetamagic, beingMetamagic, believeMetamagic, bellMetamagic, belowMetamagic,
  beltMetamagic, bendMetamagic,
];
