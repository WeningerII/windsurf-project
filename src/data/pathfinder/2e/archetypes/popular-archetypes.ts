// Pathfinder 2e Popular Class & General Archetypes
// Source: Core Rulebook, APG, and other official sources (SRD-compliant)

import { Archetype } from '../../../../types/character-options/archetypes';

// HIGH-DEMAND COMBAT ARCHETYPES

export const archerArchetype: Archetype = {
  id: 'pf2e-archer',
  name: 'Archer',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You are skilled with bows and crossbows and move with grace while using them.',
  features: [
    { level: 2, name: 'Archer Dedication', description: 'You become trained in all weapons in the bow and crossbow weapon groups. Whenever you critically hit using a weapon from these groups while you have a status bonus to damage with that weapon, you add 4 precision damage instead of the 2 precision damage from the circumstance bonus.' },
    { level: 4, name: 'Archer\'s Aim', description: 'You slow down, line up a shot, and strike with incredible precision.' },
    { level: 6, name: 'Crossbow Terror', description: 'You can reload crossbows with frightening efficiency.' },
  ],
};

export const beastmasterArchetype: Archetype = {
  id: 'pf2e-beastmaster',
  name: 'Beastmaster',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You attract the loyalty of animals, and as your powers increase you can command more of them, briefly inhabit their bodies to perceive what they perceive, and even communicate with them over vast distances.',
  features: [
    { level: 2, name: 'Beastmaster Dedication', description: 'You gain the service of a young animal companion that travels with you and obeys your commands.' },
    { level: 4, name: 'Additional Companion', description: 'Another animal joins you in your travels. It is a young animal companion.' },
    { level: 6, name: 'Heal Animal', description: 'You can heal your animal companions with your own energy.' },
  ],
};

export const dualWeaponWarriorArchetype: Archetype = {
  id: 'pf2e-dual-weapon-warrior',
  name: 'Dual-Weapon Warrior',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You\'re able to fend off multiple foes with ease. You\'re typically skilled with both of your weapons, and can employ them together in devastating combination.',
  features: [
    { level: 2, name: 'Dual-Weapon Warrior Dedication', description: 'You\'re exceptional in your use of two weapons. You gain the Double Slice fighter feat. This serves as Double Slice for the purpose of meeting prerequisites.' },
    { level: 4, name: 'Dual Thrower', description: 'You know how to throw two weapons at once with devastating effect.' },
    { level: 6, name: 'Dual-Weapon Blitz', description: 'You attack as you run by your enemies.' },
  ],
};

export const duelistArchetype: Archetype = {
  id: 'pf2e-duelist',
  name: 'Duelist',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You\'ve learned to fight with a weapon in one hand and little else, channeling all your skill into displaying powerful flourishes and precise strikes.',
  features: [
    { level: 2, name: 'Duelist Dedication', description: 'You\'re skilled at making stylish flourishes with one-handed melee weapons. You gain the Dueling Parry action.' },
    { level: 4, name: 'Dueling Riposte', description: 'You riposte with retaliatory attacks when enemies fail to harm you.' },
    { level: 6, name: 'Dueling Dance', description: 'You use your free hand to block, deflect, and maneuver your opponents.' },
  ],
};

export const eldritchArcherArchetype: Archetype = {
  id: 'pf2e-eldritch-archer',
  name: 'Eldritch Archer',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You blend the power of magic with the precision of archery, allowing you to fire arrows charged with deadly magic.',
  features: [
    { level: 6, name: 'Eldritch Archer Dedication', description: 'You blend magic with your archery, gaining the Eldritch Shot action. You must have the ability to cast spells.' },
    { level: 8, name: 'Basic Eldritch Archery', description: 'You gain the Phase Arrow or Seeker Arrow feat.' },
    { level: 10, name: 'Precious Arrow', description: 'Your arrows can ignore certain resistances.' },
  ],
};

// SKILL-BASED ARCHETYPES

export const acrobatArchetype: Archetype = {
  id: 'pf2e-acrobat',
  name: 'Acrobat',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You have trained your body to perform incredible, seemingly superhuman stunts. You move in ways that leave your opponents caught off guard.',
  features: [
    { level: 2, name: 'Acrobat Dedication', description: 'You become an expert in Acrobatics. At 7th level, you become a master in Acrobatics, and at 15th level, you become legendary in Acrobatics.' },
    { level: 4, name: 'Contortionist', description: 'You can squeeze through incredibly tight spaces.' },
    { level: 6, name: 'Tumbling Strike', description: 'You tumble and strike all in one motion.' },
  ],
};

export const assassinArchetype: Archetype = {
  id: 'pf2e-assassin',
  name: 'Assassin',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You\'ve trained to assassinate your foes, and you do so with tenacity and precision.',
  features: [
    { level: 2, name: 'Assassin Dedication', description: 'You become trained in Stealth. You can use Stealth to roll initiative. You also gain the Mark for Death action.' },
    { level: 4, name: 'Angel of Death', description: 'You deal 2d6 additional precision damage to your marked target.' },
    { level: 6, name: 'Assassinate', description: 'You can kill a target with a single well-placed strike.' },
  ],
};

export const medicArchetype: Archetype = {
  id: 'pf2e-medic',
  name: 'Medic',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You\'ve studied healing, and you can patch up wounds with amazing speed.',
  features: [
    { level: 2, name: 'Medic Dedication', description: 'You become an expert in Medicine. You gain the Battle Medicine feat and use Medicine instead of Treat Wounds.' },
    { level: 4, name: 'Doctor\'s Visitation', description: 'You travel to patients in need.' },
    { level: 6, name: 'Holistic Care', description: 'You provide holistic healing that benefits your patients.' },
  ],
};

// SPELLCASTING ARCHETYPES

export const familiarMasterArchetype: Archetype = {
  id: 'pf2e-familiar-master',
  name: 'Familiar Master',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'From the wise owl perched on the wizard\'s shoulder to the crafty gremlin that serves the sorcerer, familiars have always been the iconic companions of spellcasters.',
  features: [
    { level: 2, name: 'Familiar Master Dedication', description: 'You gain a familiar. If you already have a familiar, your familiar gains two additional familiar abilities.' },
    { level: 4, name: 'Enhanced Familiar', description: 'Your familiar gains an additional ability.' },
    { level: 6, name: 'Incredible Familiar Spell', description: 'Your familiar learns a spell.' },
  ],
};

export const ritualistArchetype: Archetype = {
  id: 'pf2e-ritualist',
  name: 'Ritualist',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'While some learn the art of ritual casting through rigorous study, other gifted individuals can perform rituals through intuition and instinct alone.',
  features: [
    { level: 4, name: 'Ritualist Dedication', description: 'You have the ability to perform rituals. You gain a number of common rituals.' },
    { level: 6, name: 'Efficient Rituals', description: 'You can perform rituals in half the normal time.' },
    { level: 8, name: 'Flexible Ritualist', description: 'You can substitute different skill checks for ritual requirements.' },
  ],
};

// SOCIAL & SUPPORT ARCHETYPES

export const marshalArchetype: Archetype = {
  id: 'pf2e-marshal',
  name: 'Marshal',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'Marshals are leaders, first and foremost. Marshals can come from any class or background, though they all share a willingness to sacrifice their own glory for the greater good of the team.',
  features: [
    { level: 2, name: 'Marshal Dedication', description: 'You become trained in Diplomacy and gain the Inspiring Marshal Stance action.' },
    { level: 4, name: 'Dread Marshal Stance', description: 'You inspire dread in your enemies with a terrifying presence.' },
    { level: 6, name: 'Steel Yourself', description: 'You can help an ally shake off mental effects.' },
  ],
};

export const celebrityArchetype: Archetype = {
  id: 'pf2e-celebrity',
  name: 'Celebrity',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You\'re a famous performer who wows crowds with your talents.',
  features: [
    { level: 2, name: 'Celebrity Dedication', description: 'You become trained in Performance and gain the Mesmerizing Performance feat.' },
    { level: 4, name: 'Never Forget a Face', description: 'You can recognize anyone you\'ve met before.' },
    { level: 6, name: 'Stage Presence', description: 'Your performances are unforgettable.' },
  ],
};

// EXPLORATION ARCHETYPES

export const scoutArchetype: Archetype = {
  id: 'pf2e-scout',
  name: 'Scout',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You\'re an expert in scouting out danger, keeping your allies safe, and striking first.',
  features: [
    { level: 2, name: 'Scout Dedication', description: 'You become trained in Survival. You gain the Scout\'s Warning reaction.' },
    { level: 4, name: 'Scout\'s Charge', description: 'You can charge into battle after scouting.' },
    { level: 6, name: 'Terrain Stalker', description: 'You can move through difficult terrain with ease.' },
  ],
};

export const cavalierArchetype: Archetype = {
  id: 'pf2e-cavalier',
  name: 'Cavalier',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You are a skilled rider, combining your mount\'s abilities with your own combat prowess.',
  features: [
    { level: 2, name: 'Cavalier Dedication', description: 'You gain a young animal companion that serves as your mount. You also gain the Mounted Shield feat.' },
    { level: 4, name: 'Cavalier\'s Charge', description: 'You can make devastating charges while mounted.' },
    { level: 6, name: 'Impressive Mount', description: 'Your mount becomes even more powerful.' },
  ],
};

// DEFENSIVE ARCHETYPES

export const bastionArchetype: Archetype = {
  id: 'pf2e-bastion',
  name: 'Bastion',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You are a master of shield combat, using your shield not just as protection but as a weapon.',
  features: [
    { level: 2, name: 'Bastion Dedication', description: 'You gain the Shield Block reaction if you don\'t already have it.' },
    { level: 4, name: 'Disarming Block', description: 'You can disarm foes with your shield.' },
    { level: 6, name: 'Destructive Block', description: 'You can damage weapons that hit your shield.' },
  ],
};

export const sentinelArchetype: Archetype = {
  id: 'pf2e-sentinel',
  name: 'Sentinel',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'You stand strong in the face of danger and inspire your allies to do the same.',
  features: [
    { level: 2, name: 'Sentinel Dedication', description: 'You become trained in light armor and medium armor. You gain the Armor Assist action.' },
    { level: 4, name: 'Steel Skin', description: 'You become expert in the armor you\'re trained in.' },
    { level: 6, name: 'Mighty Bulwark', description: 'Your armor protects you from area effects.' },
  ],
};

// SUPERNATURAL ARCHETYPES

export const blessedOneArchetype: Archetype = {
  id: 'pf2e-blessed-one',
  name: 'Blessed One',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'Through luck or through need, you have been blessed by a deity or other divine force.',
  features: [
    { level: 2, name: 'Blessed One Dedication', description: 'You can cast lay on hands as a champion, even if you aren\'t one.' },
    { level: 4, name: 'Blessed Spell', description: 'You can enhance healing spells.' },
    { level: 6, name: 'Mercy', description: 'Your lay on hands can remove conditions.' },
  ],
};

export const poisonerArchetype: Archetype = {
  id: 'pf2e-poisoner',
  name: 'Poisoner',
  system: 'pf2e',
  source: 'Player Core 2',
  parentClassId: 'general',
  description: 'People are so delightfully fragile and easy to poison.',
  features: [
    { level: 2, name: 'Poisoner Dedication', description: 'You become trained in Crafting and gain the poison weapon ability.' },
    { level: 4, name: 'Improved Poison Weapon', description: 'You can apply poison more efficiently.' },
    { level: 6, name: 'Deadly Poison Weapon', description: 'Your poisons are more potent.' },
  ],
};

// Export all popular archetypes
export const popularArchetypes: Archetype[] = [
  archerArchetype,
  beastmasterArchetype,
  dualWeaponWarriorArchetype,
  duelistArchetype,
  eldritchArcherArchetype,
  acrobatArchetype,
  assassinArchetype,
  medicArchetype,
  familiarMasterArchetype,
  ritualistArchetype,
  marshalArchetype,
  celebrityArchetype,
  scoutArchetype,
  cavalierArchetype,
  bastionArchetype,
  sentinelArchetype,
  blessedOneArchetype,
  poisonerArchetype,
];
