import { systemRegistry } from '../registry';
import type { GameSystemId } from '../types/game-systems';
import type {
  SystemCatalogSummary,
  SystemContentCategoryId,
  SystemContentSummary,
  SystemSupportLevel,
} from '../types/system-catalog';
import {
  loadAdvantagesForSystem,
  loadArchetypesForSystem,
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadComplicationsForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadFeatureOptionsForSystem,
  loadMam3eArchetypesForSystem,
  loadMonstersForSystem,
  loadPf2eBackgroundsForSystem,
  loadPowerModifiersForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
  loadTraitsForSystem,
} from './dataLoader';

export const KNOWN_SYSTEM_IDS: GameSystemId[] = [
  'dnd-5e-2024',
  'dnd-5e-2014',
  'pf2e',
  'dnd-3.5e',
  'pf1e',
  'mam3e',
  'daggerheart',
];

const DEFAULT_SYSTEM_LABELS: Record<GameSystemId, { label: string; version?: string }> = {
  'dnd-5e-2024': { label: 'D&D 5e (2024)', version: 'SRD 5.2' },
  'dnd-5e-2014': { label: 'D&D 5e (2014)', version: 'SRD 5.1' },
  pf2e: { label: 'Pathfinder 2e', version: 'PF2e SRD' },
  'dnd-3.5e': { label: 'D&D 3.5e', version: 'SRD 3.5' },
  pf1e: { label: 'Pathfinder 1e', version: 'PF1e SRD' },
  mam3e: { label: 'M&M 3e', version: '3e' },
  daggerheart: { label: 'Daggerheart', version: '1.0' },
};

const CATEGORY_PRIORITY: Record<SystemContentCategoryId, number> = {
  spells: 0,
  classes: 1,
  species: 2,
  featureOptions: 3,
  backgrounds: 4,
  traits: 5,
  archetypes: 6,
  complications: 7,
  monsters: 8,
  equipment: 9,
  feats: 10,
  advantages: 11,
  powerModifiers: 12,
};

function productCategory(
  id: SystemContentCategoryId,
  label: string,
  count: number
): SystemContentSummary | null {
  if (count <= 0) {
    return null;
  }

  return {
    id,
    label,
    count,
    reachability: 'product',
  };
}

function sourceFilteredCategory(
  id: SystemContentCategoryId,
  label: string,
  note: string
): SystemContentSummary {
  return {
    id,
    label,
    count: 0,
    reachability: 'source-filtered',
    note,
  };
}

function appendCategories(
  categories: SystemContentSummary[],
  ...entries: Array<SystemContentSummary | null>
): void {
  categories.push(...entries.filter((entry): entry is SystemContentSummary => entry !== null));
}

function sortCategories(categories: SystemContentSummary[]): SystemContentSummary[] {
  return [...categories].sort((left, right) => {
    const priorityDelta = CATEGORY_PRIORITY[left.id] - CATEGORY_PRIORITY[right.id];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }
    return right.count - left.count;
  });
}

function getSystemMeta(systemId: GameSystemId): {
  label: string;
  version?: string;
  supportLevel: SystemSupportLevel;
  supportNotes?: string;
} {
  const system = systemRegistry.get(systemId);
  const fallback = DEFAULT_SYSTEM_LABELS[systemId];

  return {
    label: system?.label ?? fallback.label,
    version: system?.version ?? fallback.version,
    supportLevel: system?.supportLevel ?? 'full',
    supportNotes: system?.supportNotes,
  };
}

export async function loadSystemCatalogSummary(
  systemId: GameSystemId
): Promise<SystemCatalogSummary> {
  const meta = getSystemMeta(systemId);
  const categories: SystemContentSummary[] = [];

  switch (systemId) {
    case 'dnd-5e-2024': {
      const [spells, classes, species, backgrounds, monsters, equipment, feats] = await Promise.all(
        [
          loadSpellsForSystem(systemId),
          loadClassesForSystem(systemId),
          loadSpeciesForSystem(systemId),
          loadBackgroundsForSystem(systemId),
          loadMonstersForSystem(systemId),
          loadEquipmentForSystem(systemId),
          loadFeatsForSystem(systemId),
        ]
      );

      appendCategories(
        categories,
        productCategory('spells', 'Spells', spells.length),
        productCategory('classes', 'Classes', classes.length),
        productCategory('species', 'Species', species.length),
        productCategory('backgrounds', 'Backgrounds', backgrounds.length),
        productCategory('monsters', 'Monsters', monsters.length),
        productCategory('equipment', 'Equipment', equipment.length),
        productCategory('feats', 'Feats', feats.length)
      );
      break;
    }
    case 'dnd-5e-2014': {
      const [spells, classes, species, backgrounds, featureOptions, monsters, equipment] =
        await Promise.all([
          loadSpellsForSystem(systemId),
          loadClassesForSystem(systemId),
          loadSpeciesForSystem(systemId),
          loadBackgroundsForSystem(systemId),
          loadFeatureOptionsForSystem(systemId),
          loadMonstersForSystem(systemId),
          loadEquipmentForSystem(systemId),
        ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', spells.length),
        productCategory('classes', 'Classes', classes.length),
        productCategory('species', 'Species', species.length),
        productCategory('featureOptions', 'Feature Options', featureOptions.length),
        productCategory('backgrounds', 'Backgrounds', backgrounds.length),
        productCategory('monsters', 'Monsters', monsters.length),
        productCategory('equipment', 'Equipment', equipment.length),
        sourceFilteredCategory('feats', 'Feats', 'SRD 5.1 excludes feat data')
      );
      break;
    }
    case 'pf2e': {
      const [spells, classes, species, backgrounds, equipment, feats, archetypes] =
        await Promise.all([
          loadSpellsForSystem(systemId),
          loadClassesForSystem(systemId),
          loadSpeciesForSystem(systemId),
          loadPf2eBackgroundsForSystem(systemId),
          loadEquipmentForSystem(systemId),
          loadFeatsForSystem(systemId),
          loadArchetypesForSystem(systemId),
        ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', spells.length),
        productCategory('classes', 'Classes', classes.length),
        productCategory('species', 'Species', species.length),
        productCategory('backgrounds', 'Backgrounds', backgrounds.length),
        productCategory('archetypes', 'Archetypes', archetypes.length),
        productCategory('equipment', 'Equipment', equipment.length),
        productCategory('feats', 'Feats', feats.length)
      );
      break;
    }
    case 'dnd-3.5e':
    case 'pf1e': {
      const [spells, classes, species, equipment, feats, traits] = await Promise.all([
        loadSpellsForSystem(systemId),
        loadClassesForSystem(systemId),
        loadSpeciesForSystem(systemId),
        loadEquipmentForSystem(systemId),
        loadFeatsForSystem(systemId),
        loadTraitsForSystem(systemId),
      ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', spells.length),
        productCategory('classes', 'Classes', classes.length),
        productCategory('species', 'Species', species.length),
        productCategory('equipment', 'Equipment', equipment.length),
        productCategory('feats', 'Feats', feats.length),
        productCategory('traits', 'Traits', traits.length)
      );
      break;
    }
    case 'mam3e': {
      const [powers, advantages, equipment, archetypes, complications, powerModifiers] =
        await Promise.all([
          loadSpellsForSystem(systemId),
          loadAdvantagesForSystem(systemId),
          loadEquipmentForSystem(systemId),
          loadMam3eArchetypesForSystem(systemId),
          loadComplicationsForSystem(systemId),
          loadPowerModifiersForSystem(systemId),
        ]);

      appendCategories(
        categories,
        productCategory('spells', 'Powers', powers.length),
        productCategory('archetypes', 'Archetypes', archetypes.length),
        productCategory('complications', 'Complications', complications.length),
        productCategory('advantages', 'Advantages', advantages.length),
        productCategory('equipment', 'Equipment', equipment.length),
        productCategory('powerModifiers', 'Power Modifiers', powerModifiers.length)
      );
      break;
    }
    case 'daggerheart':
      break;
    default:
      break;
  }

  const sortedCategories = sortCategories(categories.filter(Boolean) as SystemContentSummary[]);
  return {
    systemId,
    label: meta.label,
    version: meta.version,
    supportLevel: meta.supportLevel,
    supportNotes: meta.supportNotes,
    categories: sortedCategories,
    totalReachableCount: sortedCategories
      .filter((category) => category.reachability === 'product')
      .reduce((sum, category) => sum + category.count, 0),
  };
}

export async function loadAllSystemCatalogSummaries(
  systemIds: GameSystemId[] = KNOWN_SYSTEM_IDS
): Promise<Record<GameSystemId, SystemCatalogSummary>> {
  const summaries = await Promise.all(
    systemIds.map(async (systemId) => [systemId, await loadSystemCatalogSummary(systemId)] as const)
  );

  return Object.fromEntries(summaries) as Record<GameSystemId, SystemCatalogSummary>;
}
