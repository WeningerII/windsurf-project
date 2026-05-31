#!/usr/bin/env tsx

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadAdvantagesForSystem,
  loadArchetypesForSystem,
  loadBackgroundsForSystem,
  loadComplicationsForSystem,
  loadClassesForSystem,
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartArmorForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
  loadDaggerheartConsumablesForSystem,
  loadDaggerheartLootForSystem,
  loadDaggerheartWeaponsForSystem,
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
} from '../utils/dataLoader';
import { GameSystemId } from '../types/game-systems';
import {
  OpenContentCategory,
  extractSourceAttribution,
  isOpenContentCompliant,
  strictOpenContentPolicy,
} from '../utils/openContentPolicy';

import { allPowers } from '../data/mutants-and-masterminds/3e/powers';
import { mam3eAdvantages } from '../data/mutants-and-masterminds/3e/advantages';
import { mm3eArchetypes } from '../data/mutants-and-masterminds/3e/archetypes';
import { complications as mam3eComplications } from '../data/mutants-and-masterminds/3e/complications';
import { powerModifiers as mam3ePowerModifiers } from '../data/mutants-and-masterminds/3e/modifiers';
import { allPf2eArchetypes } from '../data/pathfinder/2e/archetypes';
import { SRD_MANIFESTS } from '../../docs/srd-manifest';
import type { ManifestCategory } from '../../docs/srd-manifest';
import { COMPUTE_REGISTERS } from '../../docs/compute-register';
import { MANUAL_EXCLUSIONS } from '../../docs/srd-manifest/_exclusions';

type LoaderCategory =
  | 'spells'
  | 'classes'
  | 'species'
  | 'backgrounds'
  | 'traits'
  | 'featureOptions'
  | 'archetypes'
  | 'complications'
  | 'monsters'
  | 'equipment'
  | 'feats'
  | 'advantages'
  | 'powerModifiers';

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
  { id: 'daggerheart', label: 'Daggerheart' },
];

const loaderDefinitions: LoaderDefinition[] = [
  { key: 'spells', label: 'Spells/Powers', load: (systemId) => loadSpellsForSystem(systemId) },
  {
    key: 'classes',
    label: 'Classes',
    load: (systemId) =>
      systemId === 'daggerheart'
        ? loadDaggerheartClassesForSystem(systemId)
        : loadClassesForSystem(systemId),
  },
  {
    key: 'species',
    label: 'Species/Races',
    load: (systemId) =>
      systemId === 'daggerheart'
        ? loadDaggerheartAncestriesForSystem(systemId)
        : loadSpeciesForSystem(systemId),
  },
  {
    key: 'backgrounds',
    label: 'Backgrounds',
    load: (systemId) =>
      systemId === 'daggerheart'
        ? loadDaggerheartCommunitiesForSystem(systemId)
        : systemId === 'pf2e'
          ? loadPf2eBackgroundsForSystem(systemId)
          : loadBackgroundsForSystem(systemId),
  },
  { key: 'traits', label: 'Traits', load: (systemId) => loadTraitsForSystem(systemId) },
  {
    key: 'featureOptions',
    label: 'Feature Options',
    load: (systemId) => loadFeatureOptionsForSystem(systemId),
  },
  {
    key: 'archetypes',
    label: 'Archetypes',
    load: (systemId) =>
      systemId === 'mam3e'
        ? loadMam3eArchetypesForSystem(systemId)
        : loadArchetypesForSystem(systemId),
  },
  {
    key: 'complications',
    label: 'Complications',
    load: (systemId) => loadComplicationsForSystem(systemId),
  },
  { key: 'monsters', label: 'Monsters', load: (systemId) => loadMonstersForSystem(systemId) },
  {
    key: 'equipment',
    label: 'Equipment',
    load: async (systemId) =>
      systemId === 'daggerheart'
        ? [
            ...(await loadDaggerheartWeaponsForSystem(systemId)),
            ...(await loadDaggerheartArmorForSystem(systemId)),
            ...(await loadDaggerheartLootForSystem(systemId)),
            ...(await loadDaggerheartConsumablesForSystem(systemId)),
          ]
        : loadEquipmentForSystem(systemId),
  },
  { key: 'feats', label: 'Feats', load: (systemId) => loadFeatsForSystem(systemId) },
  { key: 'advantages', label: 'Advantages', load: (systemId) => loadAdvantagesForSystem(systemId) },
  {
    key: 'powerModifiers',
    label: 'Power Modifiers',
    load: (systemId) => loadPowerModifiersForSystem(systemId),
  },
];

const summaryCategories: LoaderCategory[] = [
  'spells',
  'classes',
  'species',
  'backgrounds',
  'traits',
  'featureOptions',
  'monsters',
  'equipment',
  'feats',
  'advantages',
];

const extendedSummaryCategories: LoaderCategory[] = [
  'archetypes',
  'complications',
  'powerModifiers',
];

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

  items.forEach((item) => {
    if (seen.has(item.id)) {
      return;
    }
    seen.add(item.id);
    unique.push(item);
  });

  return unique;
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

  uniqueItems.forEach((item) => {
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
    sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort((a, b) => b[1] - a[1])),
  };
}

function markdownTableRow(cells: Array<string | number>): string {
  return `| ${cells.join(' | ')} |`;
}

type ContentCompletionRow = {
  systemId: string;
  systemLabel: string;
  category: ManifestCategory;
  encoded: number;
  target: number;
  percent: number;
};

type ComputeCompletionRow = {
  systemId: string;
  systemLabel: string;
  verified: number;
  inScope: number;
  percent: number;
  byLayer: Record<string, { verified: number; inScope: number }>;
};

/** Manifest categories that map directly to a loader, enabling an id-join. */
const MANIFEST_LOADER_KEY: Partial<Record<ManifestCategory, LoaderCategory>> = {
  spells: 'spells',
  classes: 'classes',
  species: 'species',
  backgrounds: 'backgrounds',
  traits: 'traits',
  featureOptions: 'featureOptions',
  archetypes: 'archetypes',
  complications: 'complications',
  monsters: 'monsters',
  equipment: 'equipment',
  feats: 'feats',
  advantages: 'advantages',
  powerModifiers: 'powerModifiers',
};

function systemLabelFor(systemId: string): string {
  return systems.find((system) => system.id === systemId)?.label ?? systemId;
}

function toPercent(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 1000) / 10;
}

/**
 * Content completeness (Denominator A). Where a manifest category maps to a
 * loader, completeness is the JOIN of manifest ids with actually-loaded ids, so
 * a wrong/absent id surfaces as a real gap rather than a self-asserted 100%.
 */
function buildContentCompletion(idsByKey: Map<string, Set<string>>): ContentCompletionRow[] {
  const rows: ContentCompletionRow[] = [];
  for (const manifest of SRD_MANIFESTS) {
    const inScope = manifest.entries.filter(
      (entry) => entry.status === 'encoded' || entry.status === 'missing'
    );
    const categories = [...new Set(inScope.map((entry) => entry.category))];
    for (const category of categories) {
      const entries = inScope.filter((entry) => entry.category === category);
      const loaderKey = MANIFEST_LOADER_KEY[category];
      const loadedIds = loaderKey ? idsByKey.get(`${manifest.systemId}:${loaderKey}`) : undefined;
      const encoded = loadedIds
        ? entries.filter((entry) => loadedIds.has(entry.id)).length
        : entries.filter((entry) => entry.status === 'encoded').length;
      rows.push({
        systemId: manifest.systemId,
        systemLabel: systemLabelFor(manifest.systemId),
        category,
        encoded,
        target: entries.length,
        percent: toPercent(encoded, entries.length),
      });
    }
  }
  return rows;
}

/** Engine-math completeness (Denominator B): verified / in-scope per system. */
function buildComputeCompletion(): ComputeCompletionRow[] {
  return COMPUTE_REGISTERS.map((register) => {
    const inScopeEntries = register.entries.filter(
      (entry) =>
        entry.status === 'verified' || entry.status === 'implemented' || entry.status === 'missing'
    );
    const verified = inScopeEntries.filter((entry) => entry.status === 'verified').length;
    const byLayer: Record<string, { verified: number; inScope: number }> = {};
    for (const entry of inScopeEntries) {
      const bucket = (byLayer[entry.layer] ??= { verified: 0, inScope: 0 });
      bucket.inScope += 1;
      if (entry.status === 'verified') {
        bucket.verified += 1;
      }
    }
    return {
      systemId: register.systemId,
      systemLabel: systemLabelFor(register.systemId),
      verified,
      inScope: inScopeEntries.length,
      percent: toPercent(verified, inScopeEntries.length),
      byLayer,
    };
  });
}

function createEmptyCategoryCounts(): Record<LoaderCategory, number> {
  return {
    spells: 0,
    classes: 0,
    species: 0,
    backgrounds: 0,
    traits: 0,
    featureOptions: 0,
    archetypes: 0,
    complications: 0,
    monsters: 0,
    equipment: 0,
    feats: 0,
    advantages: 0,
    powerModifiers: 0,
  };
}

function createSummaryBySystem(
  loaderRows: LoaderAuditRow[]
): Map<GameSystemId, Record<LoaderCategory, number>> {
  const summary = new Map<GameSystemId, Record<LoaderCategory, number>>();
  systems.forEach((system) => {
    summary.set(system.id, createEmptyCategoryCounts());
  });

  loaderRows.forEach((row) => {
    const existing = summary.get(row.systemId);
    if (!existing) {
      return;
    }
    existing[row.category] = row.metrics.uniqueCount;
  });

  return summary;
}

function applyRepoResidentOverrides(
  summary: Map<GameSystemId, Record<LoaderCategory, number>>,
  moduleRows: ModuleAuditRow[]
): Map<GameSystemId, Record<LoaderCategory, number>> {
  const repoResident = new Map<GameSystemId, Record<LoaderCategory, number>>();

  for (const [systemId, counts] of summary.entries()) {
    repoResident.set(systemId, { ...counts });
  }

  const overlayCategoryMap: Partial<Record<OpenContentCategory, LoaderCategory>> = {
    archetypes: 'archetypes',
    complications: 'complications',
    powerModifiers: 'powerModifiers',
    advantages: 'advantages',
    powers: 'spells',
  };

  moduleRows.forEach((row) => {
    const targetCategory = overlayCategoryMap[row.category];
    if (!targetCategory) {
      return;
    }

    const systemCounts = repoResident.get(row.systemId);
    if (!systemCounts) {
      return;
    }

    systemCounts[targetCategory] = Math.max(systemCounts[targetCategory], row.metrics.uniqueCount);
  });

  return repoResident;
}

function buildMarkdownReport(
  generatedAtIso: string,
  loaderRows: LoaderAuditRow[],
  moduleRows: ModuleAuditRow[],
  contentCompletion: ContentCompletionRow[],
  computeCompletion: ComputeCompletionRow[]
): string {
  const loaderBySystem = createSummaryBySystem(loaderRows);

  const lines: string[] = [];
  lines.push(`_Generated: ${generatedAtIso}_`);
  lines.push('_Policy: strict core/SRD-only (`src/utils/openContentPolicy.ts`)_');
  lines.push('');
  lines.push('### Loader Totals (Product-Reachable)');
  lines.push(
    markdownTableRow([
      'System',
      ...summaryCategories.map(
        (category) => loaderDefinitions.find((loader) => loader.key === category)?.label ?? category
      ),
    ])
  );
  lines.push(markdownTableRow(['---', ...summaryCategories.map(() => '---:')]));
  systems.forEach((system) => {
    const counts = loaderBySystem.get(system.id);
    if (!counts) {
      return;
    }
    lines.push(
      markdownTableRow([system.label, ...summaryCategories.map((category) => counts[category])])
    );
  });
  lines.push('');
  lines.push('### Extended Loader Totals (Product-Reachable)');
  lines.push(
    markdownTableRow([
      'System',
      ...extendedSummaryCategories.map(
        (category) => loaderDefinitions.find((loader) => loader.key === category)?.label ?? category
      ),
    ])
  );
  lines.push(markdownTableRow(['---', ...extendedSummaryCategories.map(() => '---:')]));
  systems.forEach((system) => {
    const counts = loaderBySystem.get(system.id);
    if (!counts) {
      return;
    }
    lines.push(
      markdownTableRow([
        system.label,
        ...extendedSummaryCategories.map((category) => counts[category]),
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
  loaderRows.forEach((row) => {
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
  lines.push('### Referenced Module Audit (Repo-Resident Raw Exports)');
  lines.push(
    markdownTableRow(['Dataset', 'Unique Items', 'Duplicates', 'Missing Source', 'Non-Compliant'])
  );
  lines.push(markdownTableRow(['---', '---:', '---:', '---:', '---:']));
  moduleRows.forEach((row) => {
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
  lines.push('- Loader totals above are the canonical product-reachable roadmap counts.');
  lines.push(
    '- Raw-export rows below capture repo-resident datasets that may exceed product reachability.'
  );
  if (totalMissingSource === 0) {
    lines.push(
      '- All loader-backed datasets currently include explicit source attribution (missing source: 0).'
    );
  } else {
    lines.push(
      `- Loader-backed datasets still have missing source attribution (${totalMissingSource} records).`
    );
  }
  if (totalNonCompliantInModules === 0) {
    lines.push('- Referenced non-loader exports currently show 0 non-compliant records.');
  } else {
    lines.push(
      `- Referenced non-loader exports still include ${totalNonCompliantInModules} non-compliant records.`
    );
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
  lines.push(
    '- Keep roadmap counts synced by running `npm run roadmap:metrics` after content changes.'
  );
  lines.push('');

  lines.push(
    '### Content Catalog Parity (Denominator A — provenance; loader-derived, NOT independent SRD parity)'
  );
  lines.push(
    '_The manifests in docs/srd-manifest/ are generated from the loaders, so this measures CATALOG PARITY + provenance (every shipped open-content entry is encoded, loader-backed, and cited) — it is NOT independent data-parity against the full published SRD. Genuine SRD parity (comparing the shipped product to an external authoritative SRD index to detect omitted entries) requires that external index, which is unavailable in this environment and is flagged unresolved per the "cite, never invent" policy. A 100% here does not assert published-SRD coverage._'
  );
  if (contentCompletion.length === 0) {
    lines.push('_No content denominators authored yet._');
  } else {
    lines.push(markdownTableRow(['System', 'Category', 'Encoded', 'Target', 'Complete']));
    lines.push(markdownTableRow(['---', '---', '---:', '---:', '---:']));
    contentCompletion.forEach((row) => {
      lines.push(
        markdownTableRow([
          row.systemLabel,
          row.category,
          row.encoded,
          row.target,
          `${row.percent}%`,
        ])
      );
    });
  }
  lines.push('');

  lines.push('### Engine-Math Completion (vs Compute Register — Denominator B)');
  if (computeCompletion.length === 0) {
    lines.push('_No compute registers authored yet._');
  } else {
    lines.push(markdownTableRow(['System', 'Verified', 'In-Scope', 'Complete']));
    lines.push(markdownTableRow(['---', '---:', '---:', '---:']));
    computeCompletion.forEach((row) => {
      lines.push(markdownTableRow([row.systemLabel, row.verified, row.inScope, `${row.percent}%`]));
    });
  }
  lines.push('');
  lines.push(
    `_Denominators: cited open-content manifests in docs/srd-manifest/ and docs/compute-register/. Enumerated manual boundaries excluded from both: ${MANUAL_EXCLUSIONS.length}._`
  );
  lines.push('');

  lines.push('### Content Integrity (Denominator A — provenance + policy)');
  lines.push(
    "_Share of each system's loader-backed entries that are source-tagged AND open-content-policy-clean — i.e. the content DONE conditions 'encoded, loader-backed, source-tagged, policy-clean'. This certifies CATALOG INTEGRITY (every shipped open-content entry is cited and compliant). It is NOT coverage vs the full published SRD: measuring which SRD entries are MISSING requires an external authoritative SRD index that is unavailable in this environment, so that coverage dimension is flagged unresolved rather than asserted._"
  );
  lines.push(markdownTableRow(['System', 'Loader Entries', 'Cited + Policy-Clean', 'Integrity']));
  lines.push(markdownTableRow(['---', '---:', '---:', '---:']));
  systems.forEach((system) => {
    const rows = loaderRows.filter((row) => row.systemId === system.id);
    const total = rows.reduce((sum, row) => sum + row.metrics.uniqueCount, 0);
    const violations = rows.reduce(
      (sum, row) => sum + row.metrics.missingSourceCount + row.metrics.nonCompliantCount,
      0
    );
    const clean = total - violations;
    lines.push(markdownTableRow([system.label, total, clean, `${toPercent(clean, total)}%`]));
  });

  return lines.join('\n');
}

async function main(): Promise<void> {
  const loaderRows: LoaderAuditRow[] = [];
  const idsByKey = new Map<string, Set<string>>();

  for (const system of systems) {
    for (const loader of loaderDefinitions) {
      const items = await loader.load(system.id);
      idsByKey.set(
        `${system.id}:${loader.key}`,
        new Set(items.filter(isItemRecord).map((item) => item.id))
      );
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
      label: 'M&M 3e powers',
      systemId: 'mam3e',
      category: 'powers',
      metrics: computeMetrics('mam3e', 'powers', allPowers),
    },
    {
      label: 'M&M 3e advantages',
      systemId: 'mam3e',
      category: 'advantages',
      metrics: computeMetrics('mam3e', 'advantages', mam3eAdvantages),
    },
    {
      label: 'M&M 3e archetypes',
      systemId: 'mam3e',
      category: 'archetypes',
      metrics: computeMetrics('mam3e', 'archetypes', Object.values(mm3eArchetypes)),
    },
    {
      label: 'M&M 3e complications',
      systemId: 'mam3e',
      category: 'complications',
      metrics: computeMetrics('mam3e', 'complications', mam3eComplications),
    },
    {
      label: 'M&M 3e power modifiers',
      systemId: 'mam3e',
      category: 'powerModifiers',
      metrics: computeMetrics('mam3e', 'powerModifiers', [
        ...mam3ePowerModifiers.extras,
        ...mam3ePowerModifiers.flaws,
      ]),
    },
    {
      label: 'PF2e archetypes',
      systemId: 'pf2e',
      category: 'archetypes',
      metrics: computeMetrics('pf2e', 'archetypes', allPf2eArchetypes),
    },
  ];

  const generatedAtIso = new Date().toISOString();
  const contentCompletion = buildContentCompletion(idsByKey);
  const computeCompletion = buildComputeCompletion();
  const markdown = buildMarkdownReport(
    generatedAtIso,
    loaderRows,
    moduleRows,
    contentCompletion,
    computeCompletion
  );

  const productReachableSummaryMap = createSummaryBySystem(loaderRows);
  const repoResidentSummaryMap = applyRepoResidentOverrides(productReachableSummaryMap, moduleRows);

  const productReachableSummary = Object.fromEntries(
    systems.map((system) => [system.id, productReachableSummaryMap.get(system.id)])
  );
  const repoResidentSummary = Object.fromEntries(
    systems.map((system) => [system.id, repoResidentSummaryMap.get(system.id)])
  );

  const output = {
    generatedAt: generatedAtIso,
    policy: strictOpenContentPolicy,
    productReachableSummary,
    repoResidentSummary,
    contentCompletion,
    computeCompletion,
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

  console.log('Roadmap metrics regenerated.');
  console.log(`- ${path.relative(projectRoot, path.join(generatedDir, 'roadmap-metrics.md'))}`);
  console.log(`- ${path.relative(projectRoot, path.join(generatedDir, 'roadmap-metrics.json'))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
