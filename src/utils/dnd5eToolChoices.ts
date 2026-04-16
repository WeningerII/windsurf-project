import {
  ArtisanToolProficiency,
  GamingSetProficiency,
  MusicalInstrumentProficiency,
} from '../constants/proficiencies';

const TOOL_LABELS: Record<string, string> = {
  'alchemists-supplies': "Alchemist's Supplies",
  'brewers-supplies': "Brewer's Supplies",
  'calligraphers-supplies': "Calligrapher's Supplies",
  'carpenters-tools': "Carpenter's Tools",
  'cartographers-tools': "Cartographer's Tools",
  'cobblers-tools': "Cobbler's Tools",
  'cooks-utensils': "Cook's Utensils",
  'glassblowers-tools': "Glassblower's Tools",
  'jewelers-tools': "Jeweler's Tools",
  'leatherworkers-tools': "Leatherworker's Tools",
  'masons-tools': "Mason's Tools",
  'painters-supplies': "Painter's Supplies",
  'potters-tools': "Potter's Tools",
  'smiths-tools': "Smith's Tools",
  'tinkers-tools': "Tinker's Tools",
  'weavers-tools': "Weaver's Tools",
  'woodcarvers-tools': "Woodcarver's Tools",
  bagpipes: 'Bagpipes',
  drum: 'Drum',
  dulcimer: 'Dulcimer',
  flute: 'Flute',
  lute: 'Lute',
  lyre: 'Lyre',
  horn: 'Horn',
  'pan-flute': 'Pan Flute',
  shawm: 'Shawm',
  viol: 'Viol',
  'dice-set': 'Dice Set',
  'dragonchess-set': 'Dragonchess Set',
  'playing-card-set': 'Playing Card Set',
  'three-dragon-ante-set': 'Three-Dragon Ante Set',
  'disguise-kit': 'Disguise Kit',
  'forgery-kit': 'Forgery Kit',
  'herbalism-kit': 'Herbalism Kit',
  'navigators-tools': "Navigator's Tools",
  'poisoners-kit': "Poisoner's Kit",
  'thieves-tools': "Thieves' Tools",
  'vehicles-land': 'Vehicles (Land)',
  'vehicles-water': 'Vehicles (Water)',
};

export const DND5E_ARTISAN_TOOL_OPTIONS = Object.values(ArtisanToolProficiency);
export const DND5E_GAMING_SET_OPTIONS = Object.values(GamingSetProficiency);
export const DND5E_MUSICAL_INSTRUMENT_OPTIONS = Object.values(MusicalInstrumentProficiency).filter(
  (value) => value !== 'musical-instrument'
);

function humanizeId(value: string): string {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export function expandDnd5eToolChoiceValue(value: string): string[] | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'one-gaming-set' || normalized === 'gaming-set') {
    return DND5E_GAMING_SET_OPTIONS;
  }

  if (
    normalized === 'one-artisan-tools' ||
    normalized === 'one-artisans-tools' ||
    normalized === 'artisan-tools' ||
    normalized === 'artisans-tools'
  ) {
    return DND5E_ARTISAN_TOOL_OPTIONS;
  }

  if (normalized === 'one-musical-instrument' || normalized === 'musical-instrument') {
    return DND5E_MUSICAL_INSTRUMENT_OPTIONS;
  }

  return null;
}

export function formatDnd5eToolLabel(toolId: string): string {
  const normalized = toolId.trim().toLowerCase();

  if (normalized === 'one-gaming-set' || normalized === 'gaming-set') {
    return 'Gaming Set';
  }

  if (
    normalized === 'one-artisan-tools' ||
    normalized === 'one-artisans-tools' ||
    normalized === 'artisan-tools' ||
    normalized === 'artisans-tools'
  ) {
    return "Artisan's Tools";
  }

  if (normalized === 'one-musical-instrument' || normalized === 'musical-instrument') {
    return 'Musical Instrument';
  }

  return TOOL_LABELS[toolId] || humanizeId(toolId);
}
