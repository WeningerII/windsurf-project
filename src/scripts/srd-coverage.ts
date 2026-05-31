#!/usr/bin/env tsx
/**
 * GENUINE content data-parity: fetch INDEPENDENT open-content SRD entry lists
 * (hosted on GitHub raw — verified fetchable from this environment via Node,
 * unlike the truncating WebFetch tool) and diff them against the product's
 * loaders by normalized name. Unlike docs/srd-manifest/ (which is loader-derived
 * catalog parity), this measures real coverage: which SRD entries the product is
 * MISSING. Run with network; writes docs/generated/srd-coverage.md (committed
 * static). Re-run to refresh.
 *
 * Sources (open-content, cited):
 *   - D&D 5e SRD 5.1/5.2: 5e-bits/5e-database (CC-BY-4.0 / OGL 1.0a)
 * Additional systems are added as their independent sources are wired in
 * (see docs/GAPS.md and docs/srd-sources.md).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadSpellsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadFeatsForSystem,
  loadEquipmentForSystem,
  loadMonstersForSystem,
  loadBackgroundsForSystem,
} from '../utils/dataLoader';
import { GameSystemId } from '../types/game-systems';

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

const RAW5E = 'https://raw.githubusercontent.com/5e-bits/5e-database/main/src';

type NamedEntry = { name?: unknown };

async function fetchNames(...urls: string[]): Promise<string[]> {
  const names: string[] = [];
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const data = (await res.json()) as NamedEntry[];
    for (const e of data) if (typeof e.name === 'string') names.push(e.name);
  }
  return names;
}

async function loaderNames(load: (s: GameSystemId) => Promise<unknown[]>, system: GameSystemId) {
  const items = (await load(system)) as Array<{ name?: unknown }>;
  return items.filter((i) => typeof i.name === 'string').map((i) => i.name as string);
}

type CoverageTarget = {
  systemId: GameSystemId;
  systemLabel: string;
  category: string;
  srdSource: string;
  srd: () => Promise<string[]>;
  loader: () => Promise<string[]>;
};

const TARGETS: CoverageTarget[] = [];

// --- D&D 5e 2014 (SRD 5.1) ---
const en2014 = `${RAW5E}/2014/en`;
const cats5e2014: Array<[string, () => Promise<string[]>, () => Promise<string[]>]> = [
  [
    'spells',
    () => fetchNames(`${en2014}/5e-SRD-Spells.json`),
    () => loaderNames(loadSpellsForSystem, 'dnd-5e-2014'),
  ],
  [
    'classes',
    () => fetchNames(`${en2014}/5e-SRD-Classes.json`),
    () => loaderNames(loadClassesForSystem, 'dnd-5e-2014'),
  ],
  [
    'species',
    () => fetchNames(`${en2014}/5e-SRD-Races.json`),
    () => loaderNames(loadSpeciesForSystem, 'dnd-5e-2014'),
  ],
  [
    'backgrounds',
    () => fetchNames(`${en2014}/5e-SRD-Backgrounds.json`),
    () => loaderNames(loadBackgroundsForSystem, 'dnd-5e-2014'),
  ],
  [
    'feats',
    () => fetchNames(`${en2014}/5e-SRD-Feats.json`),
    () => loaderNames(loadFeatsForSystem, 'dnd-5e-2014'),
  ],
  [
    'monsters',
    () => fetchNames(`${en2014}/5e-SRD-Monsters.json`),
    () => loaderNames(loadMonstersForSystem, 'dnd-5e-2014'),
  ],
  [
    'equipment',
    () => fetchNames(`${en2014}/5e-SRD-Equipment.json`, `${en2014}/5e-SRD-Magic-Items.json`),
    () => loaderNames(loadEquipmentForSystem, 'dnd-5e-2014'),
  ],
];
for (const [category, srd, loader] of cats5e2014) {
  TARGETS.push({
    systemId: 'dnd-5e-2014',
    systemLabel: 'D&D 5e (2014)',
    category,
    srdSource: 'SRD 5.1 (5e-bits/5e-database)',
    srd,
    loader,
  });
}

// --- D&D 5e 2024 (SRD 5.2) — 2024 set has no Spells file; SRD 5.2 spells == 5.1 ---
const en2024 = `${RAW5E}/2024/en`;
const cats5e2024: Array<[string, () => Promise<string[]>, () => Promise<string[]>]> = [
  [
    'spells',
    () => fetchNames(`${en2014}/5e-SRD-Spells.json`),
    () => loaderNames(loadSpellsForSystem, 'dnd-5e-2024'),
  ],
  [
    'classes',
    () => fetchNames(`${en2024}/5e-SRD-Classes.json`),
    () => loaderNames(loadClassesForSystem, 'dnd-5e-2024'),
  ],
  [
    'species',
    () => fetchNames(`${en2024}/5e-SRD-Species.json`),
    () => loaderNames(loadSpeciesForSystem, 'dnd-5e-2024'),
  ],
  [
    'backgrounds',
    () => fetchNames(`${en2024}/5e-SRD-Backgrounds.json`),
    () => loaderNames(loadBackgroundsForSystem, 'dnd-5e-2024'),
  ],
  [
    'feats',
    () => fetchNames(`${en2024}/5e-SRD-Feats.json`),
    () => loaderNames(loadFeatsForSystem, 'dnd-5e-2024'),
  ],
  [
    'monsters',
    () => fetchNames(`${en2024}/5e-SRD-Monsters.json`),
    () => loaderNames(loadMonstersForSystem, 'dnd-5e-2024'),
  ],
  [
    'equipment',
    () => fetchNames(`${en2024}/5e-SRD-Equipment.json`, `${en2024}/5e-SRD-Magic-Items.json`),
    () => loaderNames(loadEquipmentForSystem, 'dnd-5e-2024'),
  ],
];
for (const [category, srd, loader] of cats5e2024) {
  TARGETS.push({
    systemId: 'dnd-5e-2024',
    systemLabel: 'D&D 5e (2024)',
    category,
    srdSource: 'SRD 5.2 (5e-bits/5e-database; spells per SRD 5.1)',
    srd,
    loader,
  });
}

type Row = {
  systemLabel: string;
  category: string;
  srdSource: string;
  srdCount: number;
  covered: number;
  pct: number;
  missing: string[];
};

async function main(): Promise<void> {
  const rows: Row[] = [];
  for (const t of TARGETS) {
    try {
      const [srdNames, loaderRaw] = await Promise.all([t.srd(), t.loader()]);
      const loaderSet = new Set(loaderRaw.map(norm));
      const srdUnique = [...new Map(srdNames.map((n) => [norm(n), n])).values()];
      const missing = srdUnique.filter((n) => !loaderSet.has(norm(n)));
      const covered = srdUnique.length - missing.length;
      rows.push({
        systemLabel: t.systemLabel,
        category: t.category,
        srdSource: t.srdSource,
        srdCount: srdUnique.length,
        covered,
        pct: srdUnique.length ? Math.round((covered / srdUnique.length) * 1000) / 10 : 0,
        missing,
      });
      console.log(
        `${t.systemLabel} ${t.category}: ${covered}/${srdUnique.length} (${rows[rows.length - 1].pct}%)`
      );
    } catch (e) {
      console.error(`SKIP ${t.systemLabel} ${t.category}: ${(e as Error).message}`);
    }
  }

  const lines: string[] = [];
  lines.push('# Genuine SRD Coverage (Independent Denominator)');
  lines.push('');
  lines.push(
    `_Generated by \`npm run srd:coverage\` (requires network). Independent open-content SRD entry lists fetched from GitHub-hosted sources and diffed against the product loaders by normalized name. Unlike docs/srd-manifest/ (loader-derived catalog parity), this is REAL coverage — which SRD entries the product is missing._`
  );
  lines.push('');
  lines.push('| System | Category | Covered | SRD Total | Coverage | Source |');
  lines.push('| --- | --- | ---: | ---: | ---: | --- |');
  for (const r of rows) {
    lines.push(
      `| ${r.systemLabel} | ${r.category} | ${r.covered} | ${r.srdCount} | ${r.pct}% | ${r.srdSource} |`
    );
  }
  lines.push('');
  lines.push('## Missing entries (per system × category)');
  for (const r of rows) {
    if (r.missing.length === 0) {
      lines.push(`- **${r.systemLabel} / ${r.category}** — complete (0 missing).`);
      continue;
    }
    const shown = r.missing.slice(0, 60);
    lines.push(
      `- **${r.systemLabel} / ${r.category}** — ${r.missing.length} missing: ${shown.join(', ')}${r.missing.length > shown.length ? ', …' : ''}`
    );
  }
  lines.push('');

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const out = path.resolve(scriptDir, '../../docs/generated/srd-coverage.md');
  await fs.writeFile(out, `${lines.join('\n')}\n`, 'utf8');
  console.log(`\nWrote ${path.relative(path.resolve(scriptDir, '../..'), out)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
