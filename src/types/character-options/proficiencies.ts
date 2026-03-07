/**
 * Standardized proficiency identifiers for all D&D content
 *
 * Use these constants to ensure consistency across all class/species/background data
 */

// Armor Proficiencies
export const ArmorProficiency = {
  LIGHT: 'light-armor',
  MEDIUM: 'medium-armor',
  HEAVY: 'heavy-armor',
  SHIELDS: 'shields',
} as const;

export type ArmorProficiencyType = (typeof ArmorProficiency)[keyof typeof ArmorProficiency];

// Weapon Proficiency Categories
export const WeaponProficiency = {
  // Categories
  SIMPLE: 'simple-weapons',
  MARTIAL: 'martial-weapons',

  // Simple Melee
  CLUB: 'club',
  DAGGER: 'dagger',
  GREATCLUB: 'greatclub',
  HANDAXE: 'handaxe',
  JAVELIN: 'javelin',
  LIGHT_HAMMER: 'light-hammer',
  MACE: 'mace',
  QUARTERSTAFF: 'quarterstaff',
  SICKLE: 'sickle',
  SPEAR: 'spear',

  // Simple Ranged
  LIGHT_CROSSBOW: 'light-crossbow',
  DART: 'dart',
  SHORTBOW: 'shortbow',
  SLING: 'sling',

  // Martial Melee
  BATTLEAXE: 'battleaxe',
  FLAIL: 'flail',
  GLAIVE: 'glaive',
  GREATAXE: 'greataxe',
  GREATSWORD: 'greatsword',
  HALBERD: 'halberd',
  LANCE: 'lance',
  LONGSWORD: 'longsword',
  MAUL: 'maul',
  MORNINGSTAR: 'morningstar',
  PIKE: 'pike',
  RAPIER: 'rapier',
  SCIMITAR: 'scimitar',
  SHORTSWORD: 'shortsword',
  TRIDENT: 'trident',
  WAR_PICK: 'war-pick',
  WARHAMMER: 'warhammer',
  WHIP: 'whip',

  // Martial Ranged
  BLOWGUN: 'blowgun',
  HAND_CROSSBOW: 'hand-crossbow',
  HEAVY_CROSSBOW: 'heavy-crossbow',
  LONGBOW: 'longbow',
  NET: 'net',
} as const;

export type WeaponProficiencyType = (typeof WeaponProficiency)[keyof typeof WeaponProficiency];

// Tool Proficiencies
export const ToolProficiency = {
  // Artisan's Tools
  ALCHEMISTS_SUPPLIES: 'alchemists-supplies',
  BREWERS_SUPPLIES: 'brewers-supplies',
  CALLIGRAPHERS_SUPPLIES: 'calligraphers-supplies',
  CARPENTERS_TOOLS: 'carpenters-tools',
  CARTOGRAPHERS_TOOLS: 'cartographers-tools',
  COBBLERS_TOOLS: 'cobblers-tools',
  COOKS_UTENSILS: 'cooks-utensils',
  GLASSBLOWERS_TOOLS: 'glassblowers-tools',
  JEWELERS_TOOLS: 'jewelers-tools',
  LEATHERWORKERS_TOOLS: 'leatherworkers-tools',
  MASONS_TOOLS: 'masons-tools',
  PAINTERS_SUPPLIES: 'painters-supplies',
  POTTERS_TOOLS: 'potters-tools',
  SMITHS_TOOLS: 'smiths-tools',
  TINKERS_TOOLS: 'tinkers-tools',
  WEAVERS_TOOLS: 'weavers-tools',
  WOODCARVERS_TOOLS: 'woodcarvers-tools',

  // Gaming Sets
  DICE_SET: 'dice-set',
  DRAGONCHESS_SET: 'dragonchess-set',
  PLAYING_CARD_SET: 'playing-card-set',
  THREE_DRAGON_ANTE_SET: 'three-dragon-ante-set',

  // Musical Instruments
  BAGPIPES: 'bagpipes',
  DRUM: 'drum',
  DULCIMER: 'dulcimer',
  FLUTE: 'flute',
  LUTE: 'lute',
  LYRE: 'lyre',
  HORN: 'horn',
  PAN_FLUTE: 'pan-flute',
  SHAWM: 'shawm',
  VIOL: 'viol',

  // Other Tools
  DISGUISE_KIT: 'disguise-kit',
  FORGERY_KIT: 'forgery-kit',
  HERBALISM_KIT: 'herbalism-kit',
  NAVIGATORS_TOOLS: 'navigators-tools',
  POISONERS_KIT: 'poisoners-kit',
  THIEVES_TOOLS: 'thieves-tools',

  // Generic categories for character creation
  ANY_ARTISANS_TOOLS: 'any-artisans-tools',
  ANY_MUSICAL_INSTRUMENT: 'any-musical-instrument',
  ANY_GAMING_SET: 'any-gaming-set',
} as const;

export type ToolProficiencyType = (typeof ToolProficiency)[keyof typeof ToolProficiency];

// Skill Proficiencies (for reference)
export const Skill = {
  ACROBATICS: 'acrobatics',
  ANIMAL_HANDLING: 'animal-handling',
  ARCANA: 'arcana',
  ATHLETICS: 'athletics',
  DECEPTION: 'deception',
  HISTORY: 'history',
  INSIGHT: 'insight',
  INTIMIDATION: 'intimidation',
  INVESTIGATION: 'investigation',
  MEDICINE: 'medicine',
  NATURE: 'nature',
  PERCEPTION: 'perception',
  PERFORMANCE: 'performance',
  PERSUASION: 'persuasion',
  RELIGION: 'religion',
  SLEIGHT_OF_HAND: 'sleight-of-hand',
  STEALTH: 'stealth',
  SURVIVAL: 'survival',
} as const;

export type SkillType = (typeof Skill)[keyof typeof Skill];
