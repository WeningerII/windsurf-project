/**
 * Standardized proficiency identifiers for D&D 5e
 * 
 * This ensures consistency across all class definitions and prevents typos.
 * All proficiency strings should use these constants.
 */

// ============================================================================
// WEAPON PROFICIENCIES
// ============================================================================

/**
 * Weapon category proficiencies
 */
export const WeaponCategoryProficiency = {
  SIMPLE: 'simple-weapons',
  MARTIAL: 'martial-weapons',
  // Backwards compatibility aliases (deprecated - use full names)
  SIMPLE_SHORT: 'simple',
  MARTIAL_SHORT: 'martial',
} as const;

/**
 * Individual simple weapon proficiencies
 */
export const SimpleWeaponProficiency = {
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
  LIGHT_CROSSBOW: 'light-crossbow',
  DART: 'dart',
  SHORTBOW: 'shortbow',
  SLING: 'sling',
  // Plural forms (backwards compatibility)
  CLUBS: 'clubs',
  DAGGERS: 'daggers',
  GREATCLUBS: 'greatclubs',
  HANDAXES: 'handaxes',
  JAVELINS: 'javelins',
  LIGHT_HAMMERS: 'light-hammers',
  MACES: 'maces',
  QUARTERSTAFFS: 'quarterstaffs',
  SICKLES: 'sickles',
  SPEARS: 'spears',
  LIGHT_CROSSBOWS: 'light-crossbows',
  DARTS: 'darts',
  SHORTBOWS: 'shortbows',
  SLINGS: 'slings',
} as const;

/**
 * Individual martial weapon proficiencies
 */
export const MartialWeaponProficiency = {
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
  BLOWGUN: 'blowgun',
  HAND_CROSSBOW: 'hand-crossbow',
  HEAVY_CROSSBOW: 'heavy-crossbow',
  LONGBOW: 'longbow',
  NET: 'net',
  // Plural forms (backwards compatibility)
  BATTLEAXES: 'battleaxes',
  FLAILS: 'flails',
  GLAIVES: 'glaives',
  GREATAXES: 'greataxes',
  GREATSWORDS: 'greatswords',
  HALBERDS: 'halberds',
  LANCES: 'lances',
  LONGSWORDS: 'longswords',
  MAULS: 'mauls',
  MORNINGSTARS: 'morningstars',
  PIKES: 'pikes',
  RAPIERS: 'rapiers',
  SCIMITARS: 'scimitars',
  SHORTSWORDS: 'shortswords',
  TRIDENTS: 'tridents',
  WAR_PICKS: 'war-picks',
  WARHAMMERS: 'warhammers',
  WHIPS: 'whips',
  BLOWGUNS: 'blowguns',
  HAND_CROSSBOWS: 'hand-crossbows',
  HEAVY_CROSSBOWS: 'heavy-crossbows',
  LONGBOWS: 'longbows',
  NETS: 'nets',
} as const;

/**
 * Combined weapon proficiency type
 */
export type WeaponProficiency = 
  | typeof WeaponCategoryProficiency[keyof typeof WeaponCategoryProficiency]
  | typeof SimpleWeaponProficiency[keyof typeof SimpleWeaponProficiency]
  | typeof MartialWeaponProficiency[keyof typeof MartialWeaponProficiency];

// ============================================================================
// ARMOR PROFICIENCIES
// ============================================================================

/**
 * Armor category proficiencies
 */
export const ArmorProficiency = {
  LIGHT: 'light-armor',
  MEDIUM: 'medium-armor',
  HEAVY: 'heavy-armor',
  SHIELDS: 'shields',
  // Backwards compatibility aliases (deprecated - use full names)
  LIGHT_SHORT: 'light',
  MEDIUM_SHORT: 'medium',
  HEAVY_SHORT: 'heavy',
} as const;

export type ArmorProficiencyType = typeof ArmorProficiency[keyof typeof ArmorProficiency];

// ============================================================================
// TOOL PROFICIENCIES
// ============================================================================

/**
 * Artisan's tools
 */
export const ArtisanToolProficiency = {
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
} as const;

/**
 * Gaming sets
 */
export const GamingSetProficiency = {
  DICE_SET: 'dice-set',
  DRAGONCHESS_SET: 'dragonchess-set',
  PLAYING_CARD_SET: 'playing-card-set',
  THREE_DRAGON_ANTE_SET: 'three-dragon-ante-set',
} as const;

/**
 * Musical instruments
 */
export const MusicalInstrumentProficiency = {
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
  // Generic category for "any musical instrument"
  MUSICAL_INSTRUMENT: 'musical-instrument',
} as const;

/**
 * Other tool proficiencies and categories
 */
export const OtherToolProficiency = {
  DISGUISE_KIT: 'disguise-kit',
  FORGERY_KIT: 'forgery-kit',
  HERBALISM_KIT: 'herbalism-kit',
  NAVIGATORS_TOOLS: 'navigators-tools',
  POISONERS_KIT: 'poisoners-kit',
  THIEVES_TOOLS: 'thieves-tools',
  VEHICLES_LAND: 'vehicles-land',
  VEHICLES_WATER: 'vehicles-water',
  // Category selectors
  ARTISANS_TOOLS: 'artisans-tools', // Any artisan's tool
  GAMING_SET: 'gaming-set', // Any gaming set
} as const;

/**
 * Combined tool proficiency type
 */
export type ToolProficiency = 
  | typeof ArtisanToolProficiency[keyof typeof ArtisanToolProficiency]
  | typeof GamingSetProficiency[keyof typeof GamingSetProficiency]
  | typeof MusicalInstrumentProficiency[keyof typeof MusicalInstrumentProficiency]
  | typeof OtherToolProficiency[keyof typeof OtherToolProficiency];

// ============================================================================
// SKILL PROFICIENCIES
// ============================================================================

/**
 * All D&D 5e skills
 */
export const SkillProficiency = {
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

export type SkillProficiencyType = typeof SkillProficiency[keyof typeof SkillProficiency];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a proficiency string is valid
 */
export function isValidWeaponProficiency(prof: string): prof is WeaponProficiency {
  const all = [
    ...Object.values(WeaponCategoryProficiency),
    ...Object.values(SimpleWeaponProficiency),
    ...Object.values(MartialWeaponProficiency),
  ];
  return all.includes(prof as WeaponProficiency);
}

export function isValidArmorProficiency(prof: string): prof is ArmorProficiencyType {
  return Object.values(ArmorProficiency).includes(prof as ArmorProficiencyType);
}

export function isValidToolProficiency(prof: string): prof is ToolProficiency {
  const all = [
    ...Object.values(ArtisanToolProficiency),
    ...Object.values(GamingSetProficiency),
    ...Object.values(MusicalInstrumentProficiency),
    ...Object.values(OtherToolProficiency),
  ];
  return all.includes(prof as ToolProficiency);
}

export function isValidSkillProficiency(prof: string): prof is SkillProficiencyType {
  return Object.values(SkillProficiency).includes(prof as SkillProficiencyType);
}
