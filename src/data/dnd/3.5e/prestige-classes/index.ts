// D&D 3.5e Prestige Classes

import type { CharacterClass } from '../../../../types/character-options/classes';
import { arcaneArcher as normalizedArcaneArcher } from './arcane-archer';
import { arcaneTrickster as normalizedArcaneTrickster } from './arcane-trickster';
import { archmage as normalizedArchmage } from './archmage';
import { assassin as normalizedAssassin } from './assassin';
import { blackguard as normalizedBlackguard } from './blackguard';
import { dragonDisciple as normalizedDragonDisciple } from './dragon-disciple';
import { duelist as normalizedDuelist } from './duelist';
import { dwarvenDefender as normalizedDwarvenDefender } from './dwarven-defender';
import { eldritchKnight as normalizedEldritchKnight } from './eldritch-knight';
import { hierophant as normalizedHierophant } from './hierophant';
import { horizonWalker as normalizedHorizonWalker } from './horizon-walker';
import { loremaster as normalizedLoremaster } from './loremaster';
import { mysticTheurge as normalizedMysticTheurge } from './mystic-theurge';
import { isDnd35eProductPrestigeClassId } from './productCatalog';
import { shadowdancer as normalizedShadowdancer } from './shadowdancer';
import { thaumaturgist as normalizedThaumaturgist } from './thaumaturgist';

export interface PrestigeClass {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  hitDie: string;
  skillPoints: number;
  classFeatures: Record<number, string[]>;
  source: string;
}

// Core Prestige Classes
export const assassin: PrestigeClass = {
  id: 'assassin',
  name: 'Assassin',
  description: 'Masters of death and deception.',
  prerequisites: [
    'Alignment: Any non-good',
    'BAB +6',
    'Sneak Attack +2d6',
    'Disguise 8 ranks',
    'Stealth 8 ranks',
  ],
  hitDie: 'd6',
  skillPoints: 4,
  classFeatures: {
    1: ['Assassinate', 'Death Attack', 'Poison Use'],
    2: ['Uncanny Dodge'],
    3: ['Hide in Plain Sight'],
  },
  source: 'SRD 3.5',
};

export const blackguard: PrestigeClass = {
  id: 'blackguard',
  name: 'Blackguard',
  description: 'Fallen paladins who embrace darkness.',
  prerequisites: [
    'Alignment: Any non-good',
    'BAB +6',
    'Knowledge (Religion) 2 ranks',
    'Perform 2 ranks',
  ],
  hitDie: 'd10',
  skillPoints: 2,
  classFeatures: {
    1: ['Aura of Despair', 'Detect Good', 'Smite Good'],
    2: ['Dark Blessing'],
    3: ['Sneak Attack +1d6'],
  },
  source: 'SRD 3.5',
};

export const arcaneArcher: PrestigeClass = {
  id: 'arcane-archer',
  name: 'Arcane Archer',
  description: 'Masters of archery who imbue arrows with magic.',
  prerequisites: [
    'BAB +6',
    'Point Blank Shot',
    'Precise Shot',
    'Ability to cast 1st-level arcane spells',
  ],
  hitDie: 'd8',
  skillPoints: 4,
  classFeatures: {
    1: ['Enhance Arrow +1'],
    2: ['Imbue Arrow'],
    3: ['Enhance Arrow +2'],
  },
  source: 'SRD 3.5',
};

export const arcaneTrickster: PrestigeClass = {
  id: 'arcane-trickster',
  name: 'Arcane Trickster',
  description: 'Rogues who combine arcane magic with stealth.',
  prerequisites: ['Sneak Attack +2d6', 'Ability to cast 3rd-level arcane spells'],
  hitDie: 'd4',
  skillPoints: 4,
  classFeatures: {
    1: ['Ranged Legerdemain'],
    2: ['Sneak Attack +1d6'],
  },
  source: 'SRD 3.5',
};

export const archmage: PrestigeClass = {
  id: 'archmage',
  name: 'Archmage',
  description: 'Ultimate masters of arcane magic.',
  prerequisites: [
    'Ability to cast 7th-level arcane spells',
    'Spellcraft 15 ranks',
    'Knowledge (Arcana) 15 ranks',
  ],
  hitDie: 'd4',
  skillPoints: 2,
  classFeatures: {
    1: ['High Arcana'],
    2: ['Arcane Fire'],
  },
  source: 'SRD 3.5',
};

export const dragonDisciple: PrestigeClass = {
  id: 'dragon-disciple',
  name: 'Dragon Disciple',
  description: 'Sorcerers who embrace their draconic heritage.',
  prerequisites: ['Ability to cast arcane spells', 'Draconic bloodline'],
  hitDie: 'd12',
  skillPoints: 2,
  classFeatures: {
    1: ['Natural Armor +1'],
    2: ['Ability Boost (Str +2)'],
  },
  source: 'SRD 3.5',
};

export const duelist: PrestigeClass = {
  id: 'duelist',
  name: 'Duelist',
  description: 'Master of one-on-one combat with finesse.',
  prerequisites: ['BAB +6', 'Dodge', 'Mobility', 'Weapon Finesse'],
  hitDie: 'd10',
  skillPoints: 4,
  classFeatures: {
    1: ['Canny Defense'],
    2: ['Improved Reaction +2'],
  },
  source: 'SRD 3.5',
};

export const dwarvenDefender: PrestigeClass = {
  id: 'dwarven-defender',
  name: 'Dwarven Defender',
  description: 'Dwarven defensive specialists.',
  prerequisites: ['Dwarf', 'BAB +7', 'Dodge', 'Toughness'],
  hitDie: 'd12',
  skillPoints: 2,
  classFeatures: {
    1: ['Defensive Stance'],
    2: ['Uncanny Dodge'],
  },
  source: 'SRD 3.5',
};

export const eldritchKnight: PrestigeClass = {
  id: 'eldritch-knight',
  name: 'Eldritch Knight',
  description: 'Warriors who blend martial prowess with arcane magic.',
  prerequisites: ['BAB +6', 'Ability to cast 3rd-level arcane spells'],
  hitDie: 'd6',
  skillPoints: 2,
  classFeatures: {
    1: ['Bonus Feat'],
    2: ['Diverse Training'],
  },
  source: 'SRD 3.5',
};

export const hierophant: PrestigeClass = {
  id: 'hierophant',
  name: 'Hierophant',
  description: 'Divine spellcasters of great power.',
  prerequisites: ['Ability to cast 7th-level divine spells', 'Knowledge (Religion) 15 ranks'],
  hitDie: 'd8',
  skillPoints: 4,
  classFeatures: {
    1: ['Bonus Spells', 'Mastery of Energy'],
    2: ['Mastery of Shaping'],
  },
  source: 'SRD 3.5',
};

export const loremaster: PrestigeClass = {
  id: 'loremaster',
  name: 'Loremaster',
  description: 'Keepers of arcane knowledge.',
  prerequisites: [
    'Ability to cast 6th-level spells',
    'Knowledge (any) 15 ranks',
    'Spellcraft 15 ranks',
  ],
  hitDie: 'd4',
  skillPoints: 4,
  classFeatures: {
    1: ['Bonus Spells', 'Lore'],
    2: ['Secret'],
  },
  source: 'SRD 3.5',
};

export const mysticTheurge: PrestigeClass = {
  id: 'mystic-theurge',
  name: 'Mystic Theurge',
  description: 'Masters of both arcane and divine magic.',
  prerequisites: [
    'Ability to cast 2nd-level arcane spells',
    'Ability to cast 2nd-level divine spells',
    'Knowledge (Arcana) 6 ranks',
    'Knowledge (Religion) 6 ranks',
  ],
  hitDie: 'd6',
  skillPoints: 2,
  classFeatures: {
    1: ['Spellcasting'],
    2: ['Bonus Spells'],
  },
  source: 'SRD 3.5',
};

export const shadowdancer: PrestigeClass = {
  id: 'shadowdancer',
  name: 'Shadowdancer',
  description: 'Masters of shadow and stealth.',
  prerequisites: ['Stealth 8 ranks', 'Perform 3 ranks', 'Dodge feat'],
  hitDie: 'd8',
  skillPoints: 6,
  classFeatures: {
    1: ['Hide in Plain Sight', 'Evasion'],
    2: ['Shadow Illusion'],
  },
  source: 'SRD 3.5',
};

export const horizonWalker: PrestigeClass = {
  id: 'horizon-walker',
  name: 'Horizon Walker',
  description: 'Masters of planar and terrain adaptation.',
  prerequisites: ['Endurance', 'Knowledge (Geography) 8 ranks'],
  hitDie: 'd8',
  skillPoints: 4,
  classFeatures: {
    1: ['Terrain Mastery'],
    2: ['Planar Terrain Mastery'],
  },
  source: 'SRD 3.5',
};

export const thaumaturgist: PrestigeClass = {
  id: 'thaumaturgist',
  name: 'Thaumaturgist',
  description: 'Specialists in summoning and binding outsiders.',
  prerequisites: [
    'Ability to cast lesser planar ally',
    'Knowledge (Planes) 10 ranks',
    'Knowledge (Religion) 10 ranks',
  ],
  hitDie: 'd4',
  skillPoints: 2,
  classFeatures: {
    1: ['Improved Ally'],
    2: ['Augment Summoning'],
  },
  source: 'SRD 3.5',
};

// D&D 3.5e SRD Prestige Classes (DMG core prestige classes only - 15 total)
export const dnd35ePrestigeClasses: PrestigeClass[] = [
  arcaneArcher,
  arcaneTrickster,
  archmage,
  assassin,
  blackguard,
  dragonDisciple,
  duelist,
  dwarvenDefender,
  eldritchKnight,
  hierophant,
  horizonWalker,
  loremaster,
  mysticTheurge,
  shadowdancer,
  thaumaturgist,
];

export const getPrestigeClass = (id: string) => {
  return dnd35ePrestigeClasses.find((pc) => pc.id === id);
};

export const dnd35eNormalizedPrestigeClasses: CharacterClass[] = [
  normalizedArcaneArcher,
  normalizedArcaneTrickster,
  normalizedArchmage,
  normalizedAssassin,
  normalizedBlackguard,
  normalizedDragonDisciple,
  normalizedDuelist,
  normalizedEldritchKnight,
  normalizedHierophant,
  normalizedShadowdancer,
  normalizedHorizonWalker,
  normalizedDwarvenDefender,
  normalizedLoremaster,
  normalizedMysticTheurge,
  normalizedThaumaturgist,
];

export const dnd35eProductPrestigeClasses: CharacterClass[] =
  dnd35eNormalizedPrestigeClasses.filter((classData) =>
    isDnd35eProductPrestigeClassId(classData.id)
  );

export { dnd35eProductPrestigeClassIds, isDnd35eProductPrestigeClassId } from './productCatalog';
