// D&D 3.5e Ability Feats

import { FeatDefinition } from '../../../../types/character-options/feats';

export const abilityBoostStrength: FeatDefinition = {
  id: 'ability-boost-strength-35e',
  name: 'Ability Boost (Strength)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have enhanced strength.',
  benefits: ['+2 bonus to Strength'],
};

export const abilityBoostDexterity: FeatDefinition = {
  id: 'ability-boost-dexterity-35e',
  name: 'Ability Boost (Dexterity)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have enhanced dexterity.',
  benefits: ['+2 bonus to Dexterity'],
};

export const abilityBoostConstitution: FeatDefinition = {
  id: 'ability-boost-constitution-35e',
  name: 'Ability Boost (Constitution)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have enhanced constitution.',
  benefits: ['+2 bonus to Constitution'],
};

export const abilityBoostIntelligence: FeatDefinition = {
  id: 'ability-boost-intelligence-35e',
  name: 'Ability Boost (Intelligence)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have enhanced intelligence.',
  benefits: ['+2 bonus to Intelligence'],
};

export const abilityBoostWisdom: FeatDefinition = {
  id: 'ability-boost-wisdom-35e',
  name: 'Ability Boost (Wisdom)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have enhanced wisdom.',
  benefits: ['+2 bonus to Wisdom'],
};

export const abilityBoostCharisma: FeatDefinition = {
  id: 'ability-boost-charisma-35e',
  name: 'Ability Boost (Charisma)',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have enhanced charisma.',
  benefits: ['+2 bonus to Charisma'],
};

export const strengthFocus: FeatDefinition = {
  id: 'strength-focus-35e',
  name: 'Strength Focus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You focus on physical power.',
  benefits: ['+1 bonus to melee attack rolls', '+1 bonus to damage rolls with melee weapons'],
};

export const dexterityFocus: FeatDefinition = {
  id: 'dexterity-focus-35e',
  name: 'Dexterity Focus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You focus on agility and reflexes.',
  benefits: ['+1 bonus to AC', '+1 bonus on Reflex saves'],
};

export const constitutionFocus: FeatDefinition = {
  id: 'constitution-focus-35e',
  name: 'Constitution Focus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You focus on endurance.',
  benefits: ['+2 hit points per level', '+1 bonus on Fortitude saves'],
};

export const intelligenceFocus: FeatDefinition = {
  id: 'intelligence-focus-35e',
  name: 'Intelligence Focus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You focus on intellect.',
  benefits: ['+1 bonus on Knowledge checks', '+1 bonus on Intelligence-based skill checks'],
};

export const wisdomFocus: FeatDefinition = {
  id: 'wisdom-focus-35e',
  name: 'Wisdom Focus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You focus on perception and intuition.',
  benefits: ['+1 bonus on Wisdom-based skill checks', '+1 bonus on Will saves'],
};

export const charismaFocus: FeatDefinition = {
  id: 'charisma-focus-35e',
  name: 'Charisma Focus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You focus on personality and presence.',
  benefits: ['+1 bonus on Charisma-based skill checks', '+1 bonus on turning undead checks'],
};

export const abilityFeats: FeatDefinition[] = [
  abilityBoostStrength,
  abilityBoostDexterity,
  abilityBoostConstitution,
  abilityBoostIntelligence,
  abilityBoostWisdom,
  abilityBoostCharisma,
  strengthFocus,
  dexterityFocus,
  constitutionFocus,
  intelligenceFocus,
  wisdomFocus,
  charismaFocus,
];
