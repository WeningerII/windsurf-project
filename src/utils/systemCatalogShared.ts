import { systemRegistry } from '../registry';
import type { GameSystemId } from '../types/game-systems';
import type {
  SystemCatalogSummary,
  SystemContentCategoryId,
  SystemContentSummary,
  SystemSupportLevel,
} from '../types/system-catalog';

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
  domains: 2,
  domainCards: 3,
  species: 4,
  featureOptions: 5,
  backgrounds: 6,
  traits: 7,
  archetypes: 8,
  complications: 9,
  monsters: 10,
  equipment: 11,
  feats: 12,
  advantages: 13,
  powerModifiers: 14,
};

export function productCategory(
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

export function sourceFilteredCategory(
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

export function appendCategories(
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

export function buildSummary(
  systemId: GameSystemId,
  categories: SystemContentSummary[]
): SystemCatalogSummary {
  const meta = getSystemMeta(systemId);
  const sortedCategories = sortCategories(categories);

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
