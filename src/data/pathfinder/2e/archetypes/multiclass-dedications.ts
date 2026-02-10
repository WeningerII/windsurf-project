// Pathfinder 2e Multiclass Dedication Archetypes
// Source: Core Rulebook, APG, and other official sources (SRD-compliant)

import { Archetype } from '../../../../types/character-options/archetypes';

// CORE MULTICLASS DEDICATIONS (from Core Rulebook/Player Core)

export const alchemistDedication: Archetype = {
  id: 'pf2e-alchemist-dedication',
  name: 'Alchemist Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'You put your alchemical interest into practice. You become trained in alchemical bombs and Crafting; if you were already trained in Crafting, you instead become trained in a skill of your choice. You become trained in alchemist class DC. You gain the alchemist\'s infused reagents class feature, gaining a number of reagents each day equal to your level. You also gain the Alchemical Crafting feat and four additional formulas for 1st-level alchemical items.',
  features: [
    { level: 2, name: 'Alchemist Dedication', description: 'Gain infused reagents, alchemical bombs proficiency, and Alchemical Crafting feat.' },
    { level: 4, name: 'Basic Concoction', description: 'Gain a 1st- or 2nd-level alchemist feat.' },
    { level: 6, name: 'Advanced Concoction', description: 'Gain one alchemist feat. For the purpose of meeting its prerequisites, your alchemist level is equal to half your character level.' },
  ],
};

export const barbarianDedication: Archetype = {
  id: 'pf2e-barbarian-dedication',
  name: 'Barbarian Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'You become trained in Athletics; if you were already trained in Athletics, you instead become trained in a skill of your choice. You become trained in barbarian class DC. You can use the Rage action. Choose an instinct as you would if you were a barbarian. You have that instinct for all purposes and become bound by its anathema, but you don\'t gain any of the other abilities it grants.',
  features: [
    { level: 2, name: 'Barbarian Dedication', description: 'Gain Rage action and choose an instinct.' },
    { level: 4, name: 'Basic Fury', description: 'Gain a 1st- or 2nd-level barbarian feat.' },
    { level: 6, name: 'Advanced Fury', description: 'Gain one barbarian feat. For the purpose of meeting its prerequisites, your barbarian level is equal to half your character level.' },
  ],
};

export const bardDedication: Archetype = {
  id: 'pf2e-bard-dedication',
  name: 'Bard Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'You cast spells like a bard and gain the Cast a Spell activity. You gain a spell repertoire with two common cantrips from the occult spell list, or any other cantrips you learn or discover. You\'re trained in spell attack rolls and spell DCs for occult spells. Your key spellcasting ability for bard archetype spells is Charisma, and they are occult bard spells. You become trained in Occultism and Performance; for each of these skills in which you were already trained, you instead become trained in a skill of your choice.',
  features: [
    { level: 2, name: 'Bard Dedication', description: 'Gain occult spellcasting with 2 cantrips and trained proficiency.' },
    { level: 4, name: 'Basic Bard Spellcasting', description: 'Gain the basic spellcasting benefits. Each time you gain a spell slot of a new level from this archetype, add a spell of the appropriate spell level to your repertoire.' },
    { level: 6, name: 'Basic Muse', description: 'Gain a 1st- or 2nd-level bard feat.' },
  ],
};

export const championDedication: Archetype = {
  id: 'pf2e-champion-dedication',
  name: 'Champion Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'Choose a deity and cause as you would if you were a champion. You become trained in light, medium, and heavy armor. You become trained in Religion and your deity\'s associated skill; for each of these skills in which you were already trained, you instead become trained in a skill of your choice. You become trained in champion class DC. You are bound by your deity\'s anathema and must follow the champion\'s code and alignment requirements for your cause. You don\'t gain any other abilities from your choice of deity or cause.',
  features: [
    { level: 2, name: 'Champion Dedication', description: 'Choose deity and cause, gain armor proficiency.' },
    { level: 4, name: 'Basic Devotion', description: 'Gain a 1st- or 2nd-level champion feat.' },
    { level: 6, name: 'Advanced Devotion', description: 'Gain one champion feat. For the purpose of meeting its prerequisites, your champion level is equal to half your character level.' },
  ],
};

export const clericDedication: Archetype = {
  id: 'pf2e-cleric-dedication',
  name: 'Cleric Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'Choose a deity as you would if you were a cleric. You become trained in Religion and your deity\'s associated skill; for each of these skills in which you were already trained, you instead become trained in a skill of your choice. You cast spells like a cleric. You can prepare two common cantrips from the divine spell list or any other divine cantrips you learn or discover. You\'re trained in spell attack rolls and spell DCs for divine spells. Your key spellcasting ability for cleric archetype spells is Wisdom, and they are divine cleric spells. You become bound by your deity\'s anathema.',
  features: [
    { level: 2, name: 'Cleric Dedication', description: 'Choose deity, gain divine spellcasting with 2 cantrips.' },
    { level: 4, name: 'Basic Cleric Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Dogma', description: 'Gain a 1st- or 2nd-level cleric feat.' },
  ],
};

export const druidDedication: Archetype = {
  id: 'pf2e-druid-dedication',
  name: 'Druid Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'You cast spells like a druid. You can prepare two common cantrips from the primal spell list or any other primal cantrips you learn or discover. You\'re trained in spell attack rolls and spell DCs for primal spells. Your key spellcasting ability for druid archetype spells is Wisdom, and they are primal druid spells. You become trained in Nature and Druidic; for each of these skills in which you were already trained, you instead become trained in a skill of your choice. You become bound by the druid\'s anathema.',
  features: [
    { level: 2, name: 'Druid Dedication', description: 'Gain primal spellcasting with 2 cantrips and Druidic language.' },
    { level: 4, name: 'Basic Druid Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Wilding', description: 'Gain a 1st- or 2nd-level druid feat.' },
  ],
};

export const fighterDedication: Archetype = {
  id: 'pf2e-fighter-dedication',
  name: 'Fighter Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'You become trained in simple weapons and martial weapons. You become trained in your choice of Acrobatics or Athletics; if you are already trained in both of these skills, you instead become trained in a skill of your choice. You become trained in fighter class DC.',
  features: [
    { level: 2, name: 'Fighter Dedication', description: 'Gain weapon proficiency in simple and martial weapons.' },
    { level: 4, name: 'Basic Maneuver', description: 'Gain a 1st- or 2nd-level fighter feat.' },
    { level: 6, name: 'Advanced Maneuver', description: 'Gain one fighter feat. For the purpose of meeting its prerequisites, your fighter level is equal to half your character level.' },
  ],
};

export const monkDedication: Archetype = {
  id: 'pf2e-monk-dedication',
  name: 'Monk Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'You become trained in unarmed attacks. You become trained in your choice of Acrobatics or Athletics; if you are already trained in both of these skills, you instead become trained in a skill of your choice. You become trained in monk class DC. You become an expert in unarmored defense, and your speed increases by 10 feet (you can only apply this bonus while you aren\'t wearing armor).',
  features: [
    { level: 2, name: 'Monk Dedication', description: 'Gain expert unarmored defense and +10 feet speed.' },
    { level: 4, name: 'Basic Kata', description: 'Gain a 1st- or 2nd-level monk feat.' },
    { level: 6, name: 'Advanced Kata', description: 'Gain one monk feat. For the purpose of meeting its prerequisites, your monk level is equal to half your character level.' },
  ],
};

export const rangerDedication: Archetype = {
  id: 'pf2e-ranger-dedication',
  name: 'Ranger Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'You become trained in Survival; if you were already trained in Survival, you instead become trained in another skill of your choice. You become trained in ranger class DC. You can use the Hunt Prey action.',
  features: [
    { level: 2, name: 'Ranger Dedication', description: 'Gain Hunt Prey action and Survival proficiency.' },
    { level: 4, name: 'Basic Hunter\'s Trick', description: 'Gain a 1st- or 2nd-level ranger feat.' },
    { level: 6, name: 'Advanced Hunter\'s Trick', description: 'Gain one ranger feat. For the purpose of meeting its prerequisites, your ranger level is equal to half your character level.' },
  ],
};

export const rogueDedication: Archetype = {
  id: 'pf2e-rogue-dedication',
  name: 'Rogue Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'You gain a skill feat and the rogue\'s surprise attack class feature. You become trained in light armor. In addition, you become trained in Stealth or Thievery plus one skill of your choice; if you are already trained in both Stealth and Thievery, you instead become trained in an additional skill of your choice. You become trained in rogue class DC.',
  features: [
    { level: 2, name: 'Rogue Dedication', description: 'Gain surprise attack and a skill feat.' },
    { level: 4, name: 'Basic Trickery', description: 'Gain a 1st- or 2nd-level rogue feat.' },
    { level: 6, name: 'Advanced Trickery', description: 'Gain one rogue feat. For the purpose of meeting its prerequisites, your rogue level is equal to half your character level.' },
  ],
};

export const sorcererDedication: Archetype = {
  id: 'pf2e-sorcerer-dedication',
  name: 'Sorcerer Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'Choose a bloodline as you would if you were a sorcerer. You cast spells like a sorcerer. You gain a spell repertoire with two common cantrips from the spell list associated with your bloodline, or any other cantrips from that list you learn or discover. You\'re trained in spell attack rolls and spell DCs for your bloodline\'s spell tradition. Your key spellcasting ability for sorcerer archetype spells is Charisma.',
  features: [
    { level: 2, name: 'Sorcerer Dedication', description: 'Choose bloodline and gain spellcasting with 2 cantrips.' },
    { level: 4, name: 'Basic Sorcerer Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Blood Potency', description: 'Gain a 1st- or 2nd-level sorcerer feat.' },
  ],
};

export const wizardDedication: Archetype = {
  id: 'pf2e-wizard-dedication',
  name: 'Wizard Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'You cast spells like a wizard, gaining a spellbook with four common arcane cantrips of your choice. You gain the Cast a Spell activity. You can prepare two cantrips each day from your spellbook. Each time you gain a spell slot of a new level from the wizard archetype, add two common arcane spells of that level to your spellbook. You\'re trained in arcane spell attack rolls and spell DCs. Your key spellcasting ability for wizard archetype spells is Intelligence, and they are arcane wizard spells.',
  features: [
    { level: 2, name: 'Wizard Dedication', description: 'Gain arcane spellcasting with spellbook containing 4 cantrips.' },
    { level: 4, name: 'Basic Wizard Spellcasting', description: 'Gain the basic spellcasting benefits and add 2 spells to your spellbook per level.' },
    { level: 6, name: 'Basic Arcana', description: 'Gain a 1st- or 2nd-level wizard feat.' },
  ],
};

// Export all core multiclass dedications
export const coreMulticlassDedications: Archetype[] = [
  alchemistDedication,
  barbarianDedication,
  bardDedication,
  championDedication,
  clericDedication,
  druidDedication,
  fighterDedication,
  monkDedication,
  rangerDedication,
  rogueDedication,
  sorcererDedication,
  wizardDedication,
];
