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
 * Sources (open-content, cited; each scoped to the policy's allowedSources):
 *   - D&D 5e SRD 5.1/5.2: 5e-bits/5e-database (CC-BY-4.0 / OGL 1.0a)
 *   - Pathfinder 2e (CRB): Pf2eToolsOrg/Pf2eTools spells-crb.json
 *   - Pathfinder 1e (Core): wolfgangcodes/pathfinder-spellbook spells.csv (source="PFRPG Core")
 *   - Mutants & Masterminds 3e (Hero's Handbook): frnprt/mm3e-character-creator data.js
 *   - Daggerheart (SRD 1.0): Batres3/daggerheart-srd Domain Card Reference
 * D&D 3.5e is pending a clean core-only filter (its source mixes Psionics/Epic).
 * Remaining categories are documented in docs/srd-sources.md and added incrementally.
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
  loadAdvantagesForSystem,
  loadDaggerheartDomainCardsForSystem,
  loadDaggerheartDomainsForSystem,
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

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Names from a JSON object whose `prop` holds an array of `{ name }` (e.g. Pf2eTools `{ spell: [...] }`). */
async function fetchJsonPropNames(url: string, prop: string): Promise<string[]> {
  const data = JSON.parse(await fetchText(url)) as Record<string, NamedEntry[]>;
  const arr = data[prop] ?? [];
  return arr.filter((e) => typeof e.name === 'string').map((e) => e.name as string);
}

/** Minimal RFC4180 CSV row reader (handles quoted fields with embedded commas, quotes, and newlines). */
function* csvRows(text: string): Generator<string[]> {
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      yield row;
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    yield row;
  }
}

/** CSV `name` column, optionally filtered to rows whose `source` column equals `sourceFilter`. */
async function fetchCsvNames(url: string, sourceFilter?: string): Promise<string[]> {
  const text = await fetchText(url);
  let header: string[] | null = null;
  let nameIdx = 0;
  let srcIdx = -1;
  const names: string[] = [];
  for (const r of csvRows(text)) {
    if (!header) {
      header = r;
      nameIdx = header.indexOf('name');
      srcIdx = header.indexOf('source');
      continue;
    }
    if (sourceFilter && r[srcIdx] !== sourceFilter) continue;
    if (r[nameIdx]) names.push(r[nameIdx]);
  }
  return names;
}

/** Extract a top-level `const NAME = [ ... ]` array literal from a JS data file (string-aware bracket match) and eval it. */
function extractJsArray(text: string, name: string): Array<{ name?: unknown }> {
  const start = text.indexOf(`const ${name}`);
  if (start < 0) throw new Error(`const ${name} not found`);
  const lb = text.indexOf('[', start);
  let depth = 0;
  let quote: string | null = null;
  let escaped = false;
  let i = lb;
  for (; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) {
      i++;
      break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function(`return (${text.slice(lb, i)})`)() as Array<{ name?: unknown }>;
}

async function fetchJsArrayNames(url: string, constName: string): Promise<string[]> {
  const arr = extractJsArray(await fetchText(url), constName);
  return arr.filter((e) => typeof e.name === 'string').map((e) => e.name as string);
}

/** Markdown link display texts (`[Name](href)`), optionally filtered to hrefs containing `hrefIncludes`. */
async function fetchMarkdownLinkNames(url: string, hrefIncludes?: string): Promise<string[]> {
  const text = await fetchText(url);
  const names: string[] = [];
  for (const m of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    if (!hrefIncludes || m[2].includes(hrefIncludes)) names.push(m[1]);
  }
  return names;
}

/** Markdown `## Headings`, optionally stripping a trailing word (e.g. " DOMAIN"). */
async function fetchMarkdownHeadings(url: string, stripSuffix?: string): Promise<string[]> {
  const text = await fetchText(url);
  return [...text.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) =>
    stripSuffix && m[1].endsWith(stripSuffix) ? m[1].slice(0, -stripSuffix.length).trim() : m[1]
  );
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

// --- Pathfinder 2e (Core Rulebook) ---
const PF2E_SPELLS_CRB =
  'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/spells/spells-crb.json';
TARGETS.push({
  systemId: 'pf2e',
  systemLabel: 'Pathfinder 2e',
  category: 'spells',
  srdSource: 'Core Rulebook (Pf2eToolsOrg/Pf2eTools spells-crb.json)',
  srd: () => fetchJsonPropNames(PF2E_SPELLS_CRB, 'spell'),
  loader: () => loaderNames(loadSpellsForSystem, 'pf2e'),
});

// --- Pathfinder 1e (Core Rulebook — filter spells.csv source column to "PFRPG Core") ---
const PF1E_SPELLS_CSV =
  'https://raw.githubusercontent.com/wolfgangcodes/pathfinder-spellbook/master/data/spells.csv';
TARGETS.push({
  systemId: 'pf1e',
  systemLabel: 'Pathfinder 1e',
  category: 'spells',
  srdSource: 'Core Rulebook (wolfgangcodes/pathfinder-spellbook spells.csv, source="PFRPG Core")',
  srd: () => fetchCsvNames(PF1E_SPELLS_CSV, 'PFRPG Core'),
  loader: () => loaderNames(loadSpellsForSystem, 'pf1e'),
});

// --- Mutants & Masterminds 3e (Hero's Handbook — whole DHH open content in scope) ---
const MM_DATA_JS =
  'https://raw.githubusercontent.com/frnprt/mm3e-character-creator/master/js/data.js';
TARGETS.push({
  systemId: 'mam3e',
  systemLabel: 'Mutants & Masterminds 3e',
  category: 'powers',
  srdSource: "Hero's Handbook (frnprt/mm3e-character-creator POWER_EFFECTS)",
  srd: () => fetchJsArrayNames(MM_DATA_JS, 'POWER_EFFECTS'),
  loader: () => loaderNames(loadSpellsForSystem, 'mam3e'),
});
TARGETS.push({
  systemId: 'mam3e',
  systemLabel: 'Mutants & Masterminds 3e',
  category: 'advantages',
  srdSource: "Hero's Handbook (frnprt/mm3e-character-creator ADVANTAGES)",
  srd: () => fetchJsArrayNames(MM_DATA_JS, 'ADVANTAGES'),
  loader: () => loaderNames(loadAdvantagesForSystem, 'mam3e'),
});

// --- Daggerheart (SRD 1.0 — whole SRD in scope) ---
const DH_DOMAIN_REF =
  'https://raw.githubusercontent.com/Batres3/daggerheart-srd/main/contents/Domain%20Card%20Reference.md';
TARGETS.push({
  systemId: 'daggerheart',
  systemLabel: 'Daggerheart',
  category: 'domain cards',
  srdSource: 'SRD 1.0 (Batres3/daggerheart-srd Domain Card Reference)',
  srd: () => fetchMarkdownLinkNames(DH_DOMAIN_REF, '/abilities/'),
  loader: () => loaderNames(loadDaggerheartDomainCardsForSystem, 'daggerheart'),
});
TARGETS.push({
  systemId: 'daggerheart',
  systemLabel: 'Daggerheart',
  category: 'domains',
  srdSource: 'SRD 1.0 (Batres3/daggerheart-srd Domain Card Reference headings)',
  srd: () => fetchMarkdownHeadings(DH_DOMAIN_REF, 'DOMAIN'),
  loader: () => loaderNames(loadDaggerheartDomainsForSystem, 'daggerheart'),
});

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
  lines.push('## Pending (independent source not yet wired or not cleanly scopable)');
  lines.push(
    '- **D&D 3.5e** — `Rughalt/D35E` packs mix SRD-3.5 core with Psionics and Epic; a clean core-only filter is not yet implemented, so 3.5e is omitted here rather than reported against a wrong (inflated) denominator. See `docs/srd-sources.md`.'
  );
  lines.push(
    '- **Remaining categories** — PF2e/PF1e non-spell categories, M&M skills/conditions/equipment, Daggerheart classes/ancestries/communities/weapons/armor, and all monsters are documented in `docs/srd-sources.md` and pending wiring.'
  );
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
