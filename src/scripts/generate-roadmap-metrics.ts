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
  isOriginalContentSource,
  strictOpenContentPolicy,
} from '../utils/openContentPolicy';

import { allPowers } from '../data/mutants-and-masterminds/3e/powers';
import { mam3eAdvantages } from '../data/mutants-and-masterminds/3e/advantages';
import { mm3eArchetypes } from '../data/mutants-and-masterminds/3e/archetypes';
import { complications as mam3eComplications } from '../data/mutants-and-masterminds/3e/complications';
import { powerModifiers as mam3ePowerModifiers } from '../data/mutants-and-masterminds/3e/modifiers';
import { allPf2eArchetypes } from '../data/pathfinder/2e/archetypes';
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
  /**
   * Entries citing a declared `originalContentSources` label — authored for
   * this app, NOT transcribed from an open document. They are cited and
   * policy-clean, so they are not violations, but they are not open content
   * either and must never be folded into an open-content compliance figure.
   */
  originalContentCount: number;
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
  let originalContentCount = 0;

  uniqueItems.forEach((item) => {
    const source = extractSourceAttribution(item);
    if (!source) {
      missingSourceCount += 1;
    } else {
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
      if (isOriginalContentSource(systemId, source)) {
        originalContentCount += 1;
      }
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
    originalContentCount,
    sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort((a, b) => b[1] - a[1])),
  };
}

function markdownTableRow(cells: Array<string | number>): string {
  return `| ${cells.join(' | ')} |`;
}

/**
 * One measured (system × category) row of Denominator A, as
 * `docs/generated/srd-coverage.json` records it.
 */
type SrdCoverageRow = {
  systemId: string;
  systemLabel: string;
  category: string;
  srdSource: string;
  covered: number;
  srdTotal: number;
  pct: number;
  missingCount: number;
  loaderCount: number;
  overInclusionCount: number;
};

type SrdCoverageReport = {
  generatedAt: string;
  rows: SrdCoverageRow[];
  absent: Array<{ systemLabel: string; category: string }>;
};

/** Per-system rollup of Denominator A, as this report publishes it. */
type ContentCoverageRow = {
  systemId: string;
  systemLabel: string;
  categories: number;
  covered: number;
  srdTotal: number;
  percent: number;
  shortfallCategories: number;
};

type ComputeCompletionRow = {
  systemId: string;
  systemLabel: string;
  verified: number;
  inScope: number;
  percent: number;
  byLayer: Record<string, { verified: number; inScope: number }>;
};

function systemLabelFor(systemId: string): string {
  return systems.find((system) => system.id === systemId)?.label ?? systemId;
}

function toPercent(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 1000) / 10;
}

/**
 * Denominator A, read from the independent reverse diff.
 *
 * This report used to compute content completeness by joining the ids in
 * `docs/srd-manifest/` against actually-loaded ids. That was circular: those
 * manifests are GENERATED FROM the loaders, so the same population sat on both
 * sides of the ratio and every category could only ever read 100% — including
 * categories whose denominator had drifted to roughly a tenth of what the
 * loader ships. Per the decision in `docs/GAPS.md` §6, Denominator A is now
 * `docs/generated/srd-coverage.md`, whose denominators are fetched from
 * open-content SRD indexes OUTSIDE this repo and therefore cannot be moved by
 * changing the product.
 *
 * That measurement needs the network, so it is not recomputed here (this script
 * runs inside `check:generated-docs` on every CI pass). It is read from the
 * committed `srd-coverage.json` sidecar written by the same `npm run
 * srd:coverage` run, so the two reports cannot disagree.
 */
async function readSrdCoverage(rootDir: string): Promise<SrdCoverageReport | null> {
  try {
    const raw = await fs.readFile(path.join(rootDir, 'docs/generated/srd-coverage.json'), 'utf8');
    return JSON.parse(raw) as SrdCoverageReport;
  } catch {
    // Absent sidecar is reported honestly in the rendered section rather than
    // silently substituting a fabricated (or loader-derived) denominator.
    return null;
  }
}

/** Per-system rollup of the measured (system × category) coverage rows. */
function buildContentCoverage(report: SrdCoverageReport | null): ContentCoverageRow[] {
  if (!report) return [];
  const rows: ContentCoverageRow[] = [];
  for (const system of systems) {
    const measured = report.rows.filter((row) => row.systemId === system.id);
    if (measured.length === 0) continue;
    const covered = measured.reduce((sum, row) => sum + row.covered, 0);
    const srdTotal = measured.reduce((sum, row) => sum + row.srdTotal, 0);
    rows.push({
      systemId: system.id,
      systemLabel: system.label,
      categories: measured.length,
      covered,
      srdTotal,
      percent: toPercent(covered, srdTotal),
      shortfallCategories: measured.filter((row) => row.missingCount > 0).length,
    });
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
  contentCoverage: ContentCoverageRow[],
  contentCoverageMeasuredAt: string | null,
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
      'Original (non-SRD)',
    ])
  );
  lines.push(markdownTableRow(['---', '---', '---:', '---:', '---:', '---:', '---:']));
  loaderRows.forEach((row) => {
    lines.push(
      markdownTableRow([
        row.systemLabel,
        row.categoryLabel,
        row.metrics.uniqueCount,
        row.metrics.duplicateCount,
        row.metrics.missingSourceCount,
        row.metrics.nonCompliantCount,
        row.metrics.originalContentCount,
      ])
    );
  });
  lines.push('');
  lines.push('### Referenced Module Audit (Repo-Resident Raw Exports)');
  lines.push(
    markdownTableRow([
      'Dataset',
      'Unique Items',
      'Duplicates',
      'Missing Source',
      'Non-Compliant',
      'Original (non-SRD)',
    ])
  );
  lines.push(markdownTableRow(['---', '---:', '---:', '---:', '---:', '---:']));
  moduleRows.forEach((row) => {
    lines.push(
      markdownTableRow([
        row.label,
        row.metrics.uniqueCount,
        row.metrics.duplicateCount,
        row.metrics.missingSourceCount,
        row.metrics.nonCompliantCount,
        row.metrics.originalContentCount,
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

  lines.push('### Content Coverage (Denominator A — independent SRD reverse diff)');
  lines.push(
    '_Per-system rollup of `docs/generated/srd-coverage.md`, which is the sole content denominator. Denominators are open-content SRD entry indexes fetched from OUTSIDE this repo and diffed against the loaders by normalized name, so `Covered / SRD Total` is genuine coverage — how much of each measured SRD category the product actually ships — and changing the product cannot move the denominator. Only wired (system × category) targets are counted; unwired and closed-by-no-source categories are listed in that file rather than folded in at an assumed 100%, so these percentages describe what is MEASURED, not the whole SRD._'
  );
  lines.push(
    '_Superseded the loader-derived `docs/srd-manifest/` catalogs (decision 2026-07-21, executed 2026-07-27 — `docs/GAPS.md` §6). Those manifests are generated FROM the loaders, so joining their ids against loaded ids put the same population on both sides of the ratio and could only ever read 100%. They are now provenance-only and no longer published as a denominator here; per-category coverage and the named missing entries live in `docs/generated/srd-coverage.md`._'
  );
  if (contentCoverage.length === 0) {
    lines.push(
      '_Denominator A unavailable: `docs/generated/srd-coverage.json` is missing. Run `npm run srd:coverage` (requires network) to measure it. No substitute figure is published here._'
    );
  } else {
    lines.push(
      `_Measured ${contentCoverageMeasuredAt ?? 'unknown'} by \`npm run srd:coverage\`; republished here, never recomputed._`
    );
    lines.push(
      markdownTableRow([
        'System',
        'Categories Measured',
        'Covered',
        'SRD Total',
        'Coverage',
        'Categories With Gaps',
      ])
    );
    lines.push(markdownTableRow(['---', '---:', '---:', '---:', '---:', '---:']));
    contentCoverage.forEach((row) => {
      lines.push(
        markdownTableRow([
          row.systemLabel,
          row.categories,
          row.covered,
          row.srdTotal,
          `${row.percent}%`,
          row.shortfallCategories,
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
    `_Denominators: the independent SRD reverse diff in docs/generated/srd-coverage.md (content) and the cited registers in docs/compute-register/ (compute). Enumerated manual boundaries excluded from both: ${MANUAL_EXCLUSIONS.length}, registered in \`docs/srd-manifest/_exclusions.ts\`._`
  );
  lines.push('');

  lines.push('### Content Integrity (Denominator A — provenance + policy)');
  lines.push(
    "_Share of each system's **open-content** loader-backed entries that are source-tagged AND open-content-policy-clean — i.e. the content DONE conditions 'encoded, loader-backed, source-tagged, policy-clean'. This certifies CATALOG INTEGRITY (every shipped open-content entry is cited and compliant) and is a PROVENANCE measure, not a denominator: it says nothing about which SRD entries are MISSING. That is what the Content Coverage section above measures, against the external indexes in `docs/generated/srd-coverage.md`. A 100% here is compatible with a low coverage figure there._"
  );
  lines.push(
    '_`Original (non-SRD)` counts entries this project AUTHORED rather than transcribed from an open document, declared via `originalContentSources` in `src/utils/openContentPolicy.ts`. They are cited and shippable, but they are not open content, so they are excluded from BOTH sides of the Integrity ratio — counting them as compliant open content would launder exactly the mislabeling that channel exists to expose (see `docs/mam3e-equipment-provenance.md`). `Open-Content Pop.` is `Loader Entries` minus that column._'
  );
  lines.push(
    markdownTableRow([
      'System',
      'Loader Entries',
      'Original (non-SRD)',
      'Open-Content Pop.',
      'Cited + Policy-Clean',
      'Integrity',
    ])
  );
  lines.push(markdownTableRow(['---', '---:', '---:', '---:', '---:', '---:']));
  systems.forEach((system) => {
    const rows = loaderRows.filter((row) => row.systemId === system.id);
    const total = rows.reduce((sum, row) => sum + row.metrics.uniqueCount, 0);
    const original = rows.reduce((sum, row) => sum + row.metrics.originalContentCount, 0);
    const violations = rows.reduce(
      (sum, row) => sum + row.metrics.missingSourceCount + row.metrics.nonCompliantCount,
      0
    );
    // Original-content entries are cited and policy-clean by construction, so
    // they are never part of `violations` — subtracting them from the
    // population cannot hide a real violation.
    const openContentPopulation = total - original;
    const clean = openContentPopulation - violations;
    lines.push(
      markdownTableRow([
        system.label,
        total,
        original,
        openContentPopulation,
        clean,
        `${toPercent(clean, openContentPopulation)}%`,
      ])
    );
  });

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

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(scriptDir, '../..');

  const generatedAtIso = new Date().toISOString();
  const srdCoverage = await readSrdCoverage(projectRoot);
  const contentCoverage = buildContentCoverage(srdCoverage);
  const computeCompletion = buildComputeCompletion();
  const markdown = buildMarkdownReport(
    generatedAtIso,
    loaderRows,
    moduleRows,
    contentCoverage,
    srdCoverage?.generatedAt ?? null,
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
    // Denominator A. `source` names the file this was measured in, and
    // `measuredAt` is that run's timestamp — republished, never recomputed
    // here, so this report cannot drift away from srd-coverage.md.
    contentCoverage: {
      source: 'docs/generated/srd-coverage.md',
      measuredAt: srdCoverage?.generatedAt ?? null,
      bySystem: contentCoverage,
    },
    computeCompletion,
    loaderAudit: loaderRows,
    moduleAudit: moduleRows,
  };

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
