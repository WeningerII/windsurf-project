import {
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadMonstersForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../utils/dataLoader';
import { GameSystemId } from '../types/game-systems';
import {
  OpenContentCategory,
  extractSourceAttribution,
  isOpenContentCompliant,
} from '../utils/openContentPolicy';

type LoaderCategory = {
  key: OpenContentCategory;
  label: string;
  load: (systemId: GameSystemId) => Promise<unknown[]>;
};

const systems: Array<{ id: GameSystemId; label: string }> = [
  { id: 'dnd-5e-2024', label: 'D&D 5e (2024)' },
  { id: 'dnd-5e-2014', label: 'D&D 5e (2014)' },
  { id: 'dnd-3.5e', label: 'D&D 3.5e' },
  { id: 'pf1e', label: 'Pathfinder 1e' },
  { id: 'pf2e', label: 'Pathfinder 2e' },
  { id: 'mam3e', label: 'M&M 3e' },
];

const categories: LoaderCategory[] = [
  { key: 'spells', label: 'Spells/Powers', load: loadSpellsForSystem },
  { key: 'classes', label: 'Classes', load: loadClassesForSystem },
  { key: 'species', label: 'Species/Races', load: loadSpeciesForSystem },
  { key: 'monsters', label: 'Monsters', load: loadMonstersForSystem },
  { key: 'equipment', label: 'Equipment', load: loadEquipmentForSystem },
  { key: 'feats', label: 'Feats', load: loadFeatsForSystem },
];

type DataItem = {
  id: string;
  source?: string;
};

function dedupeById(items: DataItem[]): DataItem[] {
  const seen = new Set<string>();
  const unique: DataItem[] = [];

  items.forEach(item => {
    if (!item || typeof item.id !== 'string' || item.id.trim().length === 0) {
      return;
    }
    if (seen.has(item.id)) {
      return;
    }
    seen.add(item.id);
    unique.push(item);
  });

  return unique;
}

for (const system of systems) {
  console.log(`\n${system.label} (${system.id})`);

  for (const category of categories) {
    const rawItems = (await category.load(system.id)) as DataItem[];
    if (rawItems.length === 0) {
      continue;
    }

    const items = dedupeById(rawItems);
    const duplicateCount = rawItems.length - items.length;
    let missingSourceCount = 0;
    let nonCompliantCount = 0;
    const sourceCounts = new Map<string, number>();

    items.forEach(item => {
      const source = extractSourceAttribution(item);
      if (!source) {
        missingSourceCount += 1;
      } else {
        sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
      }

      if (!isOpenContentCompliant(system.id, category.key, item)) {
        nonCompliantCount += 1;
      }
    });

    const topSources = [...sourceCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => `${source} (${count})`)
      .join(', ');

    console.log(
      `  ${category.label}: total=${items.length}, duplicatesRemoved=${duplicateCount}, missingSource=${missingSourceCount}, nonCompliant=${nonCompliantCount}`
    );
    if (topSources.length > 0) {
      console.log(`    sources: ${topSources}`);
    }
  }
}
