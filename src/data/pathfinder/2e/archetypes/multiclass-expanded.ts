// Pathfinder 2e Expanded Multiclass Dedication Archetypes
// Source: APG, Secrets of Magic, Guns & Gears, Dark Archive, and other expansions

import { Archetype } from '../../../../types/character-options/archetypes';

// APG MULTICLASS DEDICATIONS

export const investigatorDedication: Archetype = {
  id: 'pf2e-investigator-dedication',
  name: 'Investigator Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'You gain the on the case class feature, which grants you both the Clue In reaction and a Pursue a Lead activity. You become trained in Society and another skill of your choice. If you were already trained in Society, you instead become trained in an additional skill of your choice. You also become trained in investigator class DC.',
  features: [
    { level: 2, name: 'Investigator Dedication', description: 'Gain Pursue a Lead and Clue In reaction.' },
    { level: 4, name: 'Basic Deduction', description: 'Gain a 1st- or 2nd-level investigator feat.' },
    { level: 6, name: 'Advanced Deduction', description: 'Gain one investigator feat. For the purpose of meeting its prerequisites, your investigator level is equal to half your character level.' },
  ],
};

export const oracleDedication: Archetype = {
  id: 'pf2e-oracle-dedication',
  name: 'Oracle Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'Choose a mystery. You become trained in Religion and the mystery\'s skill; if you were already trained, you become trained in a skill of your choice. You gain the mild, moderate, and severe curse effects of the mystery\'s curse, but not the extreme curse effect. You cast spells like an oracle and gain the Cast a Spell activity. You gain a spell repertoire with two common cantrips from the divine spell list or any other divine cantrips you learn or discover. You\'re trained in spell attack rolls and spell DCs for divine spells. Your key spellcasting ability for oracle archetype spells is Charisma.',
  features: [
    { level: 2, name: 'Oracle Dedication', description: 'Choose mystery, gain divine spellcasting and curse effects.' },
    { level: 4, name: 'Basic Oracle Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Mystery', description: 'Gain a 1st- or 2nd-level oracle feat.' },
  ],
};

export const swashbucklerDedication: Archetype = {
  id: 'pf2e-swashbuckler-dedication',
  name: 'Swashbuckler Dedication',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'multiclass',
  description: 'Choose a swashbuckler\'s style. You gain the panache class feature, and you can gain panache in all the ways a swashbuckler of your style can. You become trained in Acrobatics or the skill associated with your style. If you were already trained in both skills, you instead become trained in a skill of your choice. You also become trained in swashbuckler class DC.',
  features: [
    { level: 2, name: 'Swashbuckler Dedication', description: 'Choose style and gain panache class feature.' },
    { level: 4, name: 'Basic Flair', description: 'Gain a 1st- or 2nd-level swashbuckler feat.' },
    { level: 6, name: 'Advanced Flair', description: 'Gain one swashbuckler feat. For the purpose of meeting its prerequisites, your swashbuckler level is equal to half your character level.' },
  ],
};

export const witchDedication: Archetype = {
  id: 'pf2e-witch-dedication',
  name: 'Witch Dedication',
  system: 'pf2e',
  source: 'Player Core',
  parentClassId: 'multiclass',
  description: 'Choose a patron; you gain a familiar with two common cantrips from your chosen patron\'s tradition, but aside from the tradition, you don\'t gain any other effects the patron would usually grant. Your familiar has one less familiar ability than normal. You cast spells like a witch and gain the Cast a Spell activity. You can prepare two cantrips each day from your familiar. You\'re trained in spell attack rolls and spell DCs for your patron\'s tradition. Your key spellcasting ability for witch archetype spells is Intelligence.',
  features: [
    { level: 2, name: 'Witch Dedication', description: 'Choose patron, gain familiar and spellcasting.' },
    { level: 4, name: 'Basic Witch Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Witchcraft', description: 'Gain a 1st- or 2nd-level witch feat.' },
  ],
};

// GUNS & GEARS MULTICLASS DEDICATIONS

export const gunslingerDedication: Archetype = {
  id: 'pf2e-gunslinger-dedication',
  name: 'Gunslinger Dedication',
  system: 'pf2e',
  source: 'Guns & Gears',
  parentClassId: 'multiclass',
  description: 'You become trained in simple weapons and martial weapons in the firearm and crossbow groups. You become trained in gunslinger class DC. You gain the Gunslinger\'s Way class feature and choose a way; you gain the slinger\'s reload from that way. You also gain the initial deed from that way. You don\'t gain any other abilities from your choice of way.',
  features: [
    { level: 2, name: 'Gunslinger Dedication', description: 'Choose way, gain firearm/crossbow proficiency and initial deed.' },
    { level: 4, name: 'Basic Shooting', description: 'Gain a 1st- or 2nd-level gunslinger feat.' },
    { level: 6, name: 'Advanced Shooting', description: 'Gain one gunslinger feat. For the purpose of meeting its prerequisites, your gunslinger level is equal to half your character level.' },
  ],
};

export const inventorDedication: Archetype = {
  id: 'pf2e-inventor-dedication',
  name: 'Inventor Dedication',
  system: 'pf2e',
  source: 'Guns & Gears',
  parentClassId: 'multiclass',
  description: 'You become trained in Crafting (or another skill if you were already trained in Crafting) and in the inventor class DC. You gain the Inventor feat and the innovation class feature. You choose your innovation and your innovation\'s modifications as described in the inventor class feature. You gain the Explode action. You don\'t gain any other abilities from your choice of innovation.',
  features: [
    { level: 2, name: 'Inventor Dedication', description: 'Choose innovation and gain Explode action.' },
    { level: 4, name: 'Basic Breakthrough', description: 'Gain a 1st- or 2nd-level inventor feat.' },
    { level: 6, name: 'Advanced Breakthrough', description: 'Gain one inventor feat. For the purpose of meeting its prerequisites, your inventor level is equal to half your character level.' },
  ],
};

// SECRETS OF MAGIC MULTICLASS DEDICATIONS

export const magusDedication: Archetype = {
  id: 'pf2e-magus-dedication',
  name: 'Magus Dedication',
  system: 'pf2e',
  source: 'Secrets of Magic',
  parentClassId: 'multiclass',
  description: 'You cast spells like a magus, gaining a spellbook with four common arcane cantrips of your choice. You gain the Cast a Spell activity. You can prepare two cantrips each day from your spellbook. Each time you gain a spell slot of a new level from the magus archetype, add two common arcane spells of that level to your spellbook. You become trained in arcane spell attack rolls and spell DCs. Your key spellcasting ability for magus archetype spells is Intelligence. You also gain the Spellstrike activity.',
  features: [
    { level: 2, name: 'Magus Dedication', description: 'Gain Spellstrike and arcane spellcasting.' },
    { level: 4, name: 'Basic Magus Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Hybrid Study', description: 'Gain a 1st- or 2nd-level magus feat.' },
  ],
};

export const summonerDedication: Archetype = {
  id: 'pf2e-summoner-dedication',
  name: 'Summoner Dedication',
  system: 'pf2e',
  source: 'Secrets of Magic',
  parentClassId: 'multiclass',
  description: 'You cast spells like a summoner and gain the Cast a Spell activity. Choose a tradition for your eidolon: arcane, divine, occult, or primal. You become trained in the corresponding magical tradition. You can prepare two common cantrips from your eidolon\'s tradition of your choice each day. You\'re trained in spell attack rolls and spell DCs for the tradition you chose. Your key spellcasting ability for summoner archetype spells is Charisma. You also gain the Manifest Eidolon and Act Together activities.',
  features: [
    { level: 2, name: 'Summoner Dedication', description: 'Gain eidolon companion, Manifest Eidolon, and Act Together.' },
    { level: 4, name: 'Basic Summoner Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Synthesis', description: 'Gain a 1st- or 2nd-level summoner feat.' },
  ],
};

// DARK ARCHIVE MULTICLASS DEDICATIONS

export const psychicDedication: Archetype = {
  id: 'pf2e-psychic-dedication',
  name: 'Psychic Dedication',
  system: 'pf2e',
  source: 'Dark Archive',
  parentClassId: 'multiclass',
  description: 'Choose a conscious mind. You become trained in Occultism; if you were already trained in Occultism, you instead become trained in a skill of your choice. You cast spells like a psychic, gaining a spell repertoire with two common cantrips from the occult spell list or any other occult cantrips you learn or discover. You gain the Amped Cantrips feature and the Psyche Action. You become trained in occult spell attack rolls and spell DCs. Your key spellcasting ability for psychic archetype spells is Intelligence or Charisma (you choose when you take this feat).',
  features: [
    { level: 2, name: 'Psychic Dedication', description: 'Choose conscious mind, gain amped cantrips and Psyche action.' },
    { level: 4, name: 'Basic Psychic Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Psychic Conscious Mind', description: 'Gain a 1st- or 2nd-level psychic feat.' },
  ],
};

export const thaumaturgeDedication: Archetype = {
  id: 'pf2e-thaumaturge-dedication',
  name: 'Thaumaturge Dedication',
  system: 'pf2e',
  source: 'Dark Archive',
  parentClassId: 'multiclass',
  description: 'You gain the thaumaturge\'s esoteric lore class feature. You become trained in your choice of Arcana, Nature, Occultism, or Religion; if you were already trained in all of these, you instead become trained in a skill of your choice. You gain the Exploit Vulnerability action and the Glimpse Vulnerability action. You also gain a single 1st-level implement and its associated implement\'s empowerment ability.',
  features: [
    { level: 2, name: 'Thaumaturge Dedication', description: 'Gain Exploit Vulnerability and one 1st-level implement.' },
    { level: 4, name: 'Basic Thaumaturgy', description: 'Gain a 1st- or 2nd-level thaumaturge feat.' },
    { level: 6, name: 'Advanced Thaumaturgy', description: 'Gain one thaumaturge feat. For the purpose of meeting its prerequisites, your thaumaturge level is equal to half your character level.' },
  ],
};

// RAGE OF ELEMENTS MULTICLASS DEDICATIONS

export const kineticistDedication: Archetype = {
  id: 'pf2e-kineticist-dedication',
  name: 'Kineticist Dedication',
  system: 'pf2e',
  source: 'Rage of Elements',
  parentClassId: 'multiclass',
  description: 'Choose one kinetic element to be your kinetic gate. You become trained in kineticist class DC. You gain the Gather Elements action, the Kinetic Aura feat, and the Base Kinesis action. You don\'t gain the elemental blast class feature and don\'t gain any elemental blast impulses. You can\'t select any kineticist feats that require an elemental blast.',
  features: [
    { level: 2, name: 'Kineticist Dedication', description: 'Choose element, gain Gather Elements and Base Kinesis.' },
    { level: 4, name: 'Basic Kinesis', description: 'Gain a 1st- or 2nd-level kineticist feat.' },
    { level: 6, name: 'Advanced Kinesis', description: 'Gain one kineticist feat. For the purpose of meeting its prerequisites, your kineticist level is equal to half your character level.' },
  ],
};

// LATEST MULTICLASS DEDICATIONS

export const animistDedication: Archetype = {
  id: 'pf2e-animist-dedication',
  name: 'Animist Dedication',
  system: 'pf2e',
  source: 'War of Immortals',
  parentClassId: 'multiclass',
  description: 'Choose a primary apparition and become bound by its edict. You cast spells like an animist and gain the Cast a Spell activity. You gain a spell repertoire with two common cantrips from the divine or primal spell list or any other cantrips from those lists you learn or discover. You\'re trained in spell attack rolls and spell DCs for divine and primal spells. Your key spellcasting ability for animist archetype spells is Wisdom.',
  features: [
    { level: 2, name: 'Animist Dedication', description: 'Choose apparition and gain divine/primal spellcasting.' },
    { level: 4, name: 'Basic Animist Spellcasting', description: 'Gain the basic spellcasting benefits.' },
    { level: 6, name: 'Basic Apparition', description: 'Gain a 1st- or 2nd-level animist feat.' },
  ],
};

export const exemplarDedication: Archetype = {
  id: 'pf2e-exemplar-dedication',
  name: 'Exemplar Dedication',
  system: 'pf2e',
  source: 'War of Immortals',
  parentClassId: 'multiclass',
  description: 'You gain the ikons class feature. You choose two 1st-level ikons. You also gain the Shift Ikon action. You become trained in exemplar class DC.',
  features: [
    { level: 2, name: 'Exemplar Dedication', description: 'Choose two 1st-level ikons and gain Shift Ikon action.' },
    { level: 4, name: 'Basic Epithet', description: 'Gain a 1st- or 2nd-level exemplar feat.' },
    { level: 6, name: 'Advanced Epithet', description: 'Gain one exemplar feat. For the purpose of meeting its prerequisites, your exemplar level is equal to half your character level.' },
  ],
};

export const commanderDedication: Archetype = {
  id: 'pf2e-commander-dedication',
  name: 'Commander Dedication',
  system: 'pf2e',
  source: 'Battlecry!',
  parentClassId: 'multiclass',
  description: 'You become trained in martial weapons. If you were already trained in all martial weapons, you become trained in one advanced weapon of your choice. You also become trained in your choice of Diplomacy or Intimidation. You gain the commander\'s aura class feature and gain the Rallying Command action.',
  features: [
    { level: 2, name: 'Commander Dedication', description: 'Gain commander\'s aura and Rallying Command action.' },
    { level: 4, name: 'Basic Command', description: 'Gain a 1st- or 2nd-level commander feat.' },
    { level: 6, name: 'Advanced Command', description: 'Gain one commander feat. For the purpose of meeting its prerequisites, your commander level is equal to half your character level.' },
  ],
};

export const guardianDedication: Archetype = {
  id: 'pf2e-guardian-dedication',
  name: 'Guardian Dedication',
  system: 'pf2e',
  source: 'Battlecry!',
  parentClassId: 'multiclass',
  description: 'You become trained in light armor and medium armor. If you were already trained in light and medium armor, you gain training in heavy armor as well. Whenever you gain a class feature that grants you expert or greater proficiency in any type of armor (but not unarmored defense), you also gain that proficiency in the types of armor granted to you by this feat. You become trained in Athletics; if you were already trained in Athletics, you instead become trained in a skill of your choice. You gain the Taunt action.',
  features: [
    { level: 2, name: 'Guardian Dedication', description: 'Gain armor proficiency and Taunt action.' },
    { level: 4, name: 'Basic Resolve', description: 'Gain a 1st- or 2nd-level guardian feat.' },
    { level: 6, name: 'Advanced Resolve', description: 'Gain one guardian feat. For the purpose of meeting its prerequisites, your guardian level is equal to half your character level.' },
  ],
};

// Export all expanded multiclass dedications
export const expandedMulticlassDedications: Archetype[] = [
  investigatorDedication,
  oracleDedication,
  swashbucklerDedication,
  witchDedication,
  gunslingerDedication,
  inventorDedication,
  magusDedication,
  summonerDedication,
  psychicDedication,
  thaumaturgeDedication,
  kineticistDedication,
  animistDedication,
  exemplarDedication,
  commanderDedication,
  guardianDedication,
];
