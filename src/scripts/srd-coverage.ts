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
 *   - D&D 5e SRD 5.1/5.2: 5e-bits/5e-database (CC-BY-4.0 / OGL 1.0a); SRD 5.2
 *     spells from downfallx/dnd-5e-srd-markdown (CC-BY-4.0; 339 spells, ≠ 5.1)
 *   - Pathfinder 2e (CRB): Pf2eToolsOrg/Pf2eTools spells-crb.json
 *   - Pathfinder 1e (Core): wolfgangcodes/pathfinder-spellbook spells.csv (source="PFRPG Core")
 *   - Mutants & Masterminds 3e (Hero's Handbook): frnprt/mm3e-character-creator data.js
 *   - Daggerheart (SRD 1.0): Batres3/daggerheart-srd Domain Card Reference
 *   - D&D 3.5e (SRD 3.5 core): olimot/srd-v3.5-md clean Markdown chapters (the
 *     psionics/epic-mixed Rughalt/D35E packs are intentionally avoided)
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
  loadDaggerheartClassesForSystem,
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartCommunitiesForSystem,
  loadDaggerheartAdversariesForSystem,
  loadDaggerheartWeaponsForSystem,
  loadDaggerheartArmorForSystem,
} from '../utils/dataLoader';
import { GameSystemId } from '../types/game-systems';

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
/**
 * Loader entries may encode an SRD entry under a qualified name — e.g. the
 * SRD 5.2 feat "Archery" ships as "Fighting Style: Archery", and "Magic
 * Initiate" ships pre-split as "Magic Initiate (Cleric)". Matching also
 * against the prefix-/parenthetical-stripped form keeps coverage honest
 * without forcing id-breaking renames of shipped data.
 */
const loaderNormVariants = (s: string): string[] => {
  const variants = new Set([norm(s)]);
  variants.add(norm(s.replace(/^[\w\s]+:\s*/, '')));
  variants.add(norm(s.replace(/\s*\([^)]*\)\s*$/, '')));
  variants.delete('');
  return [...variants];
};

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

/** Extract a top-level `const NAME = [ ... ]` array literal from a JS data file as raw TEXT (string-aware bracket match) — never evaluated. */
function extractJsArray(text: string, name: string): string {
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
  return text.slice(lb, i);
}

/**
 * Pull `name: '...'` string values out of an array-literal slice TEXTUALLY.
 * The remote file is third-party JavaScript; evaluating it (eval/new Function)
 * would execute whatever its host serves on a maintainer machine. A textual
 * scan can over-collect nested name fields, which is acceptable for a
 * coverage report and strictly safer than execution.
 */
function extractNameValues(arrayLiteral: string): string[] {
  const names: string[] = [];
  for (const m of arrayLiteral.matchAll(/\bname\s*:\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
    const raw = m[2].replace(/\\(["'`\\])/g, '$1');
    if (raw.trim().length > 0) names.push(raw);
  }
  return names;
}

async function fetchJsArrayNames(url: string, constName: string): Promise<string[]> {
  return extractNameValues(extractJsArray(await fetchText(url), constName));
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

/**
 * Spell names from the SRD 5.2 markdown (downfallx/dnd-5e-srd-markdown): each
 * spell is a `#### Name` heading immediately followed by an italic
 * `_Level N School_` / `_School Cantrip_` descriptor, which distinguishes real
 * spells from the section sub-headings. SRD 5.2 has no 5e-database JSON, so this
 * markdown is the authoritative 2024 spell denominator (SRD 5.2 ≠ SRD 5.1).
 */
async function fetchSrd52SpellNames(url: string): Promise<string[]> {
  const lines = (await fetchText(url)).split('\n');
  const names: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^####\s+(.+?)\s*$/);
    if (!m) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    if (/^_.*(Level\s+\d|Cantrip).*_$/i.test((lines[j] ?? '').trim())) names.push(m[1]);
  }
  return names;
}

/**
 * Monster names from the SRD 5.2 markdown bestiary. The 5e-database 2024
 * monsters JSON holds only 3 entries (partial; flagged in docs/srd-sources.md),
 * so the downfallx markdown is the honest denominator: every `### Name` in
 * monsters-A-Z.md is one stat block (the `##` level groups variants), and every
 * `## Name` in animals.md is one animal (its `###`s are stat-block sections).
 * 235 + 95 = 330 stat blocks, consistent with the documented "~325".
 */
async function fetchSrd52MonsterNames(monstersUrl: string, animalsUrl: string): Promise<string[]> {
  const [monsters, animals] = await Promise.all([fetchText(monstersUrl), fetchText(animalsUrl)]);
  const names: string[] = [];
  for (const line of monsters.split('\n')) {
    const m = line.match(/^###\s+(.+?)\s*$/);
    if (m) names.push(m[1]);
  }
  for (const line of animals.split('\n')) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) names.push(m[1]);
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

// --- D&D 5e 2024 (SRD 5.2) — 5e-database has no 2024 spells file, and SRD 5.2
// genuinely differs from 5.1 (339 vs 319 spells), so spells use the authoritative
// SRD 5.2.1 markdown; other categories use 5e-database's 2024 set. ---
const en2024 = `${RAW5E}/2024/en`;
const SRD52_MD = 'https://raw.githubusercontent.com/downfallx/dnd-5e-srd-markdown/master';
const SRD52_SPELLS_MD = `${SRD52_MD}/spells.md`;
const cats5e2024: Array<[string, () => Promise<string[]>, () => Promise<string[]>]> = [
  [
    'spells',
    () => fetchSrd52SpellNames(SRD52_SPELLS_MD),
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
    // NOT the 5e-database 2024 JSON: that file holds only 3 monsters.
    () => fetchSrd52MonsterNames(`${SRD52_MD}/monsters-A-Z.md`, `${SRD52_MD}/animals.md`),
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
    srdSource: 'SRD 5.2 (5e-bits/5e-database; spells + monsters per downfallx SRD 5.2.1 markdown)',
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

// PF1e Bestiary 1: the denominator is the pinned upstream manifest written by
// encode-pf1e-monsters.mjs (devonjones/PSRD-Data bestiary/creature — GitHub's
// tree HTML truncates and its API is rate-limited, so the verbatim file list
// is committed alongside the encoder; regenerating the data refreshes it).
TARGETS.push({
  systemId: 'pf1e',
  systemLabel: 'Pathfinder 1e',
  category: 'monsters',
  srdSource: 'Bestiary 1 (devonjones/PSRD-Data, pinned manifest)',
  srd: async () => {
    const manifestPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../scripts/data/pf1e-bestiary-manifest.json'
    );
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as {
      entries: Array<{ name: string }>;
    };
    return manifest.entries.map((entry) => entry.name);
  },
  loader: () => loaderNames(loadMonstersForSystem, 'pf1e'),
});

// PF2e Bestiary 1: same Pf2eTools source family as the spell denominator.
TARGETS.push({
  systemId: 'pf2e',
  systemLabel: 'Pathfinder 2e',
  category: 'monsters',
  srdSource: 'Bestiary 1 (Pf2eToolsOrg/Pf2eTools creatures-b1.json)',
  srd: () =>
    fetchJsonPropNames(
      'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/bestiary/creatures-b1.json',
      'creature'
    ),
  loader: () => loaderNames(loadMonstersForSystem, 'pf2e'),
});

// PF2e Core Rulebook feats: the high-value catalog check (hundreds of entries,
// not eyeball-verifiable, unlike the 12 classes / handful of ancestries). Same
// single-CRB-file shape as the spell denominator (feats-crb.json `{ feat: [...] }`).
TARGETS.push({
  systemId: 'pf2e',
  systemLabel: 'Pathfinder 2e',
  category: 'feats',
  srdSource: 'Core Rulebook (Pf2eToolsOrg/Pf2eTools feats-crb.json)',
  srd: () =>
    fetchJsonPropNames(
      'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/feats/feats-crb.json',
      'feat'
    ),
  loader: () => loaderNames(loadFeatsForSystem, 'pf2e'),
});

// --- D&D 3.5e (SRD 3.5 core — olimot/srd-v3.5-md, clean core-only Markdown) ---
// Spell names are the `## Name` headers across the nine alphabetical spell
// files. This is the genuinely core-only denominator docs/srd-sources.md
// recommended over the psionics/epic-mixed D35E packs.
const SRD35_MD = 'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/spells';
const SRD35_SPELL_FILES = [
  'spells-a-b.md',
  'spells-c.md',
  'spells-d-e.md',
  'spells-f-g.md',
  'spells-h-l.md',
  'spells-m-o.md',
  'spells-p-r.md',
  'spells-s.md',
  'spells-t-z.md',
];
async function fetchSrd35SpellNames(): Promise<string[]> {
  const names: string[] = [];
  for (const file of SRD35_SPELL_FILES) {
    const text = await fetchText(`${SRD35_MD}/${file}`);
    for (const match of text.matchAll(/^## (.+)$/gm)) {
      const name = match[1].trim();
      // The SRD spell chapters carry naming-convention cross-reference stubs —
      // "Greater (Spell Name)", "Lesser (Spell Name)", "Mass (Spell Name)" —
      // that document how variant spells are alphabetized. They are not spells
      // themselves, so they must not inflate the denominator.
      if (/\(spell name\)/i.test(name)) continue;
      names.push(name);
    }
  }
  return names;
}
TARGETS.push({
  systemId: 'dnd-3.5e',
  systemLabel: 'D&D 3.5e',
  category: 'spells',
  srdSource: 'SRD 3.5 (olimot/srd-v3.5-md spell chapters)',
  srd: () => fetchSrd35SpellNames(),
  loader: () => loaderNames(loadSpellsForSystem, 'dnd-3.5e'),
});

const SRD35_MONSTER_FILES = [
  'monsters-intro-a.md',
  'monsters-b-c.md',
  'monsters-d-de.md',
  'monsters-di-do.md',
  'monsters-dr-dw.md',
  'monsters-e-f.md',
  'monsters-g.md',
  'monsters-h-i.md',
  'monsters-k-l.md',
  'monsters-m-n.md',
  'monsters-o-r.md',
  'monsters-s.md',
  'monsters-t-z.md',
  'monsters-animals.md',
  'monsters-vermin.md',
];
async function fetchSrd35MonsterNames(): Promise<string[]> {
  const names: string[] = [];
  for (const file of SRD35_MONSTER_FILES) {
    const text = await fetchText(
      `https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/monsters/${file}`
    );
    for (const match of text.matchAll(/^## (.+)$/gm)) names.push(match[1].trim());
  }
  return names;
}
TARGETS.push({
  systemId: 'dnd-3.5e',
  systemLabel: 'D&D 3.5e',
  category: 'monsters',
  srdSource: 'SRD 3.5 (olimot/srd-v3.5-md monster chapters)',
  srd: () => fetchSrd35MonsterNames(),
  loader: () => loaderNames(loadMonstersForSystem, 'dnd-3.5e'),
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

// Daggerheart catalog categories beyond domains/cards: the Batres3 SRD repo
// stores one markdown file per entity under category directories (classes/,
// ancestries/, communities/, adversaries/<Tier>/, weapons/, armor/), so the
// filename stems are the authoritative SRD denominator. The agent proxy blocks
// api.github.com, so the upstream git-tree listing is pinned (verbatim) as
// scripts/data/daggerheart-srd-manifest.json — the same pattern the PF1e
// bestiary denominator uses. Refresh by re-listing the upstream tree.
async function daggerheartManifestNames(category: string): Promise<string[]> {
  const manifestPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../scripts/data/daggerheart-srd-manifest.json'
  );
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as {
    categories: Record<string, string[]>;
  };
  return manifest.categories[category] ?? [];
}

const daggerheartCatalog: Array<[string, (s: GameSystemId) => Promise<unknown[]>]> = [
  ['classes', loadDaggerheartClassesForSystem],
  ['ancestries', loadDaggerheartAncestriesForSystem],
  ['communities', loadDaggerheartCommunitiesForSystem],
  ['adversaries', loadDaggerheartAdversariesForSystem],
  ['weapons', loadDaggerheartWeaponsForSystem],
  ['armor', loadDaggerheartArmorForSystem],
];
for (const [category, loader] of daggerheartCatalog) {
  TARGETS.push({
    systemId: 'daggerheart',
    systemLabel: 'Daggerheart',
    category,
    srdSource: `SRD 1.0 (Batres3/daggerheart-srd ${category}/ — pinned manifest)`,
    srd: () => daggerheartManifestNames(category),
    loader: () => loaderNames(loader, 'daggerheart'),
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
  loaderCount: number;
  extra: string[];
};

async function main(): Promise<void> {
  const rows: Row[] = [];
  const failedTargets: string[] = [];
  for (const t of TARGETS) {
    try {
      const [srdNames, loaderRaw] = await Promise.all([t.srd(), t.loader()]);
      const loaderSet = new Set(loaderRaw.flatMap(loaderNormVariants));
      const srdSet = new Set(srdNames.map(norm));
      const srdUnique = [...new Map(srdNames.map((n) => [norm(n), n])).values()];
      const loaderUnique = [...new Map(loaderRaw.map((n) => [norm(n), n])).values()];
      const missing = srdUnique.filter((n) => !loaderSet.has(norm(n)));
      // Provenance suspects: loader entries absent from the independent SRD list.
      // The loaders already pass the source-tag policy, so these are entries whose
      // tag claims an allowed SRD they are not actually part of (or name variants).
      const extra = loaderUnique.filter((n) => !srdSet.has(norm(n)));
      const covered = srdUnique.length - missing.length;
      rows.push({
        systemLabel: t.systemLabel,
        category: t.category,
        srdSource: t.srdSource,
        srdCount: srdUnique.length,
        covered,
        pct: srdUnique.length ? Math.round((covered / srdUnique.length) * 1000) / 10 : 0,
        missing,
        loaderCount: loaderUnique.length,
        extra,
      });
      console.log(
        `${t.systemLabel} ${t.category}: ${covered}/${srdUnique.length} (${rows[rows.length - 1].pct}%) — loader ${loaderUnique.length}, ${extra.length} not in SRD`
      );
    } catch (e) {
      failedTargets.push(`${t.systemLabel} ${t.category}`);
      console.error(`FAILED ${t.systemLabel} ${t.category}: ${(e as Error).message}`);
    }
  }

  if (failedTargets.length > 0) {
    // A degraded run (network hiccup, upstream moved) must not silently gut
    // the committed report — bail before writing anything.
    console.error(
      `srd-coverage aborted: ${failedTargets.length} target(s) failed (${failedTargets.join('; ')}); report left untouched.`
    );
    process.exit(1);
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
  lines.push('## Over-inclusion (loader entries NOT in the independent SRD — provenance suspects)');
  lines.push('');
  lines.push(
    '_Loaders already pass the source-tag policy (`src/utils/openContentPolicy.ts`), so a high count here means entries whose tag claims an allowed SRD they are **not actually part of** — i.e. content from outside the respective SRD analog (the strict open-content rule). A small count can also be name variants (e.g. legacy "Melf\'s" prefixes); verify before removing._'
  );
  lines.push('');
  lines.push('| System | Category | Loader | Not in SRD | Suspects |');
  lines.push('| --- | --- | ---: | ---: | --- |');
  for (const r of rows) {
    const shown = r.extra.slice(0, 40);
    lines.push(
      `| ${r.systemLabel} | ${r.category} | ${r.loaderCount} | ${r.extra.length} | ${r.extra.length ? shown.join(', ') + (r.extra.length > shown.length ? ', …' : '') : '—'} |`
    );
  }
  lines.push('');
  lines.push('## Pending (independent source not yet wired or not cleanly scopable)');
  lines.push(
    '- **D&D 3.5e** spells and monsters are measured against the clean core-only `olimot/srd-v3.5-md` chapters. The monster denominator counts every `## ` heading, which includes the SRD\'s category headers (e.g. "Angel", "Dragon", "Elemental") that nest individual stat blocks, so the monster percentage understates per-stat-block coverage. Remaining 3.5e categories (classes/feats/equipment) are unwired pending core-only sources. See `docs/srd-sources.md`.'
  );
  lines.push(
    '- **Daggerheart** classes/ancestries/communities/adversaries/weapons/armor are now wired against the pinned Batres3 SRD manifest (`scripts/data/daggerheart-srd-manifest.json`). The few weapon/armor/ancestry "not in SRD" suspects are denominator nuances — Mixed Ancestry (a rules option, not a per-file ancestry), the Combat Wheelchair line (a separate SRD doc), and upstream-mirror spelling typos (e.g. "Widgast"→correct "Widogast") — not provenance violations.'
  );
  lines.push(
    '- **Remaining categories** — PF2e/PF1e non-spell categories, D&D 3.5e classes/feats/equipment, M&M skills/conditions/equipment, and Daggerheart environments/subclasses are documented in `docs/srd-sources.md` and pending wiring.'
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
