#!/usr/bin/env tsx

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
  strictOpenContentPolicy,
} from '../utils/openContentPolicy';

import * as mamPowersModule from '../data/mutants-and-masterminds/3e/powers';
import * as mamAdvantagesModule from '../data/mutants-and-masterminds/3e/advantages';
import * as mamArchetypesModule from '../data/mutants-and-masterminds/3e/archetypes';
import * as pf2eArchetypesModule from '../data/pathfinder/2e/archetypes';

type LoaderCategory = 'spells' | 'classes' | 'species' | 'monsters' | 'equipment' | 'feats';

type LoaderDefinition = {
  key: LoaderCategory;
  label: string;
  load: (systemId: GameSystemId) => Promise<unknown[]>;
};

type SystemDefinition = {
  id: GameSystemId;
  label: string;
};

type ItemRecord = {
  id: string;
  [key: string]: unknown;
};

type Metrics = {
  rawCount: number;
  uniqueCount: number;
  duplicateCount: number;
  missingSourceCount: number;
  nonCompliantCount: number;
  sourceCounts: Record<string, number>;
};

type LoaderAuditRow = {
  systemId: GameSystemId;
  systemLabel: string;
  category: LoaderCategory;
  categoryLabel: string;
  metrics: Metrics;
};

type ModuleAuditRow = {
  label: string;
  systemId: GameSystemId;
  category: OpenContentCategory;
  metrics: Metrics;
};

const systems: SystemDefinition[] = [
  { id: 'dnd-5e-2014', label: 'D&D 5e (2014)' },
  { id: 'dnd-5e-2024', label: 'D&D 5e (2024)' },
  { id: 'dnd-3.5e', label: 'D&D 3.5e' },
  { id: 'pf1e', label: 'Pathfinder 1e' },
  { id: 'pf2e', label: 'Pathfinder 2e' },
  { id: 'mam3e', label: 'Mutants & Masterminds 3e' },
];

const loaderDefinitions: LoaderDefinition[] = [
  { key: 'spells', label: 'Spells/Powers', load: systemId => loadSpellsForSystem(systemId) },
  { key: 'classes', label: 'Classes', load: systemId => loadClassesForSystem(systemId) },
  { key: 'species', label: 'Species/Races', load: systemId => loadSpeciesForSystem(systemId) },
  { key: 'monsters', label: 'Monsters', load: systemId => loadMonstersForSystem(systemId) },
  { key: 'equipment', label: 'Equipment', load: systemId => loadEquipmentForSystem(systemId) },
  { key: 'feats', label: 'Feats', load: systemId => loadFeatsForSystem(systemId) },
];

const ROADMAP_MARKER = 'COMPUTED_ROADMAP_METRICS';

function isItemRecord(value: unknown): value is ItemRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && record.id.trim().length > 0;
}

function dedupeById<T extends ItemRecord>(items: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  items.forEach(item => {
    if (seen.has(item.id)) {
      return;
    }
    seen.add(item.id);
    unique.push(item);
  });

  return unique;
}

function collectModuleItems(moduleExports: Record<string, unknown>): ItemRecord[] {
  const items: unknown[] = [];

  const collect = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(entry => items.push(entry));
      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    const record = value as Record<string, unknown>;
    if (typeof record.id === 'string' && typeof record.name === 'string') {
      items.push(record);
      return;
    }

    Object.values(record).forEach(innerValue => {
      if (Array.isArray(innerValue)) {
        innerValue.forEach(entry => items.push(entry));
      } else if (
        innerValue &&
        typeof innerValue === 'object' &&
        'id' in innerValue &&
        'name' in innerValue
      ) {
        items.push(innerValue);
      }
    });
  };

  Object.values(moduleExports).forEach(collect);

  return items.filter(isItemRecord);
}

function computeMetrics(
  systemId: GameSystemId,
  category: OpenContentCategory,
  items: unknown[]
): Metrics {
  const rawItems = items.filter(isItemRecord);
  const uniqueItems = dedupeById(rawItems);
  const sourceCounts = new Map<string, number>();

  let missingSourceCount = 0;
  let nonCompliantCount = 0;

  uniqueItems.forEach(item => {
    const source = extractSourceAttribution(item);
    if (!source) {
      missingSourceCount += 1;
    } else {
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    }

    if (!isOpenContentCompliant(systemId, category, item)) {
      nonCompliantCount += 1;
    }
  });

  return {
    rawCount: rawItems.length,
    uniqueCount: uniqueItems.length,
    duplicateCount: rawItems.length - uniqueItems.length,
    missingSourceCount,
    nonCompliantCount,
    sourceCounts: Object.fromEntries(
      [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])
    ),
  };
}

function markdownTableRow(cells: Array<string | number>): string {
  return `| ${cells.join(' | ')} |`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function upsertComputedSection(filePath: string, markdown: string): Promise<void> {
  const beginMarker = `<!-- BEGIN:${ROADMAP_MARKER} -->`;
  const endMarker = `<!-- END:${ROADMAP_MARKER} -->`;
  const wrappedSection = `${beginMarker}\n${markdown}\n${endMarker}`;

  const existing = await fs.readFile(filePath, 'utf8');
  if (existing.includes(beginMarker) && existing.includes(endMarker)) {
    const pattern = new RegExp(
      `${escapeRegExp(beginMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`,
      'm'
    );
    const updated = existing.replace(pattern, wrappedSection);
    await fs.writeFile(filePath, updated, 'utf8');
    return;
  }

  const insertion = `\n## Computed Metrics Snapshot\n\n${wrappedSection}\n`;
  const firstLineEnd = existing.indexOf('\n');
  if (firstLineEnd < 0) {
    await fs.writeFile(filePath, `${existing}\n${insertion}`, 'utf8');
    return;
  }

  const updated =
    existing.slice(0, firstLineEnd + 1) + insertion + existing.slice(firstLineEnd + 1);
  await fs.writeFile(filePath, updated, 'utf8');
}

function buildMarkdownReport(
  generatedAtIso: string,
  loaderRows: LoaderAuditRow[],
  moduleRows: ModuleAuditRow[]
): string {
  const loaderBySystem = new Map<GameSystemId, Record<LoaderCategory, number>>();
  systems.forEach(system => {
    loaderBySystem.set(system.id, {
      spells: 0,
      classes: 0,
      species: 0,
      monsters: 0,
      equipment: 0,
      feats: 0,
    });
  });

  loaderRows.forEach(row => {
    const existing = loaderBySystem.get(row.systemId);
    if (!existing) {
      return;
    }
    existing[row.category] = row.metrics.uniqueCount;
  });

  const lines: string[] = [];
  lines.push(`_Generated: ${generatedAtIso}_`);
  lines.push('_Policy: strict core/SRD-only (`src/utils/openContentPolicy.ts`)_');
  lines.push('');
  lines.push('### Loader Totals (Authoritative)');
  lines.push(markdownTableRow(['System', 'Spells/Powers', 'Classes', 'Species', 'Monsters', 'Equipment', 'Feats']));
  lines.push(markdownTableRow(['---', '---:', '---:', '---:', '---:', '---:', '---:']));
  systems.forEach(system => {
    const counts = loaderBySystem.get(system.id);
    if (!counts) {
      return;
    }
    lines.push(
      markdownTableRow([
        system.label,
        counts.spells,
        counts.classes,
        counts.species,
        counts.monsters,
        counts.equipment,
        counts.feats,
      ])
    );
  });
  lines.push('');
  lines.push('### Loader Compliance Audit');
  lines.push(
    markdownTableRow([
      'System',
      'Category',
      'Unique Items',
      'Duplicates Removed',
      'Missing Source',
      'Non-Compliant',
    ])
  );
  lines.push(markdownTableRow(['---', '---', '---:', '---:', '---:', '---:']));
  loaderRows.forEach(row => {
    lines.push(
      markdownTableRow([
        row.systemLabel,
        row.categoryLabel,
        row.metrics.uniqueCount,
        row.metrics.duplicateCount,
        row.metrics.missingSourceCount,
        row.metrics.nonCompliantCount,
      ])
    );
  });
  lines.push('');
  lines.push('### Referenced Module Audit (Raw Exports)');
  lines.push(
    markdownTableRow([
      'Dataset',
      'Unique Items',
      'Duplicates',
      'Missing Source',
      'Non-Compliant',
    ])
  );
  lines.push(markdownTableRow(['---', '---:', '---:', '---:', '---:']));
  moduleRows.forEach(row => {
    lines.push(
      markdownTableRow([
        row.label,
        row.metrics.uniqueCount,
        row.metrics.duplicateCount,
        row.metrics.missingSourceCount,
        row.metrics.nonCompliantCount,
      ])
    );
  });
  lines.push('');

  const totalMissingSource = loaderRows.reduce(
    (sum, row) => sum + row.metrics.missingSourceCount,
    0
  );
  const totalNonCompliantInModules = moduleRows.reduce(
    (sum, row) => sum + row.metrics.nonCompliantCount,
    0
  );

  lines.push('### Policy Notes');
  lines.push('- Loader totals above are the canonical roadmap counts.');
  lines.push('- Non-loader rows identify compliance debt in implementation files that are not currently loader-backed.');
  if (totalMissingSource === 0) {
    lines.push('- All loader-backed datasets currently include explicit source attribution (missing source: 0).');
  } else {
    lines.push(`- Loader-backed datasets still have missing source attribution (${totalMissingSource} records).`);
  }
  if (totalNonCompliantInModules === 0) {
    lines.push('- Referenced non-loader exports currently show 0 non-compliant records.');
  } else {
    lines.push(`- Referenced non-loader exports still include ${totalNonCompliantInModules} non-compliant records.`);
  }
  lines.push('');

  lines.push('### Derived Next Steps');
  if (totalNonCompliantInModules > 0) {
    lines.push(
      `- Remove or quarantine non-core records in non-loader modules (${totalNonCompliantInModules} non-compliant records detected).`
    );
  }
  if (totalMissingSource > 0) {
    lines.push(
      `- Add explicit source attribution to legacy equipment datasets (${totalMissingSource} records currently missing source metadata).`
    );
  }
  lines.push('- Keep roadmap counts synced by running `npm run roadmap:metrics` after content changes.');

  return lines.join('\n');
}

async function main(): Promise<void> {
  const loaderRows: LoaderAuditRow[] = [];

  for (const system of systems) {
    for (const loader of loaderDefinitions) {
      const items = await loader.load(system.id);
      const metrics = computeMetrics(system.id, loader.key, items);

      if (metrics.rawCount === 0 && metrics.uniqueCount === 0) {
        continue;
      }

      loaderRows.push({
        systemId: system.id,
        systemLabel: system.label,
        category: loader.key,
        categoryLabel: loader.label,
        metrics,
      });
    }
  }

  const moduleRows: ModuleAuditRow[] = [
    {
      label: 'M&M 3e powers exports',
      systemId: 'mam3e',
      category: 'powers',
      metrics: computeMetrics('mam3e', 'powers', collectModuleItems(mamPowersModule)),
    },
    {
      label: 'M&M 3e advantages exports',
      systemId: 'mam3e',
      category: 'advantages',
      metrics: computeMetrics('mam3e', 'advantages', collectModuleItems(mamAdvantagesModule)),
    },
    {
      label: 'M&M 3e archetypes exports',
      systemId: 'mam3e',
      category: 'archetypes',
      metrics: computeMetrics('mam3e', 'archetypes', collectModuleItems(mamArchetypesModule)),
    },
    {
      label: 'PF2e archetypes exports',
      systemId: 'pf2e',
      category: 'archetypes',
      metrics: computeMetrics('pf2e', 'archetypes', collectModuleItems(pf2eArchetypesModule)),
    },
  ];

  const generatedAtIso = new Date().toISOString();
  const markdown = buildMarkdownReport(generatedAtIso, loaderRows, moduleRows);

  const loaderSummary = Object.fromEntries(
    systems.map(system => {
      const perCategory = Object.fromEntries(
        loaderDefinitions.map(loader => {
          const row = loaderRows.find(
            candidate => candidate.systemId === system.id && candidate.category === loader.key
          );
          return [loader.key, row ? row.metrics.uniqueCount : 0];
        })
      );
      return [system.id, perCategory];
    })
  );

  const output = {
    generatedAt: generatedAtIso,
    policy: strictOpenContentPolicy,
    loaderSummary,
    loaderAudit: loaderRows,
    moduleAudit: moduleRows,
  };

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(scriptDir, '../..');
  const generatedDir = path.join(projectRoot, 'docs/generated');

  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(path.join(generatedDir, 'roadmap-metrics.md'), `${markdown}\n`, 'utf8');
  await fs.writeFile(
    path.join(generatedDir, 'roadmap-metrics.json'),
    `${JSON.stringify(output, null, 2)}\n`,
    'utf8'
  );

  const roadmapProgressPath = path.join(projectRoot, 'ROADMAP_PROGRESS.md');
  const technicalRoadmapPath = path.join(projectRoot, 'TECHNICAL_ROADMAP.md');

  await upsertComputedSection(roadmapProgressPath, markdown);
  await upsertComputedSection(technicalRoadmapPath, markdown);

  console.log('Roadmap metrics regenerated and synced.');
  console.log(`- ${path.relative(projectRoot, path.join(generatedDir, 'roadmap-metrics.md'))}`);
  console.log(`- ${path.relative(projectRoot, path.join(generatedDir, 'roadmap-metrics.json'))}`);
  console.log(`- ${path.relative(projectRoot, roadmapProgressPath)}`);
  console.log(`- ${path.relative(projectRoot, technicalRoadmapPath)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
