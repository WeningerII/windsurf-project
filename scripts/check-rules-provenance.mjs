#!/usr/bin/env tsx
/**
 * check:rules-provenance — the open-content audit for content encoded OUTSIDE
 * `src/data/`.
 *
 * THE BLIND SPOT THIS CLOSES. `npm run srd:coverage` is a reverse-diff audit:
 * it fetches published open-content lists and diffs them against what the
 * LOADERS expose. Everything it can see therefore lives under `src/data/`.
 * Content encoded directly in the rules layer (a feat rider compiled in
 * `src/rules/conditions/**`), in the compute register (`docs/compute-register/`)
 * or in the declarative derived-quantity specs (`src/systems/**`) never passes
 * through a loader, so an SRD citation naming a feat the SRD does not contain
 * ships unchallenged. That is exactly the defect class `srd:coverage` exists to
 * catch, hiding in directories it cannot reach.
 *
 * WHAT IT ASSERTS (offline — no network, so it can live in `npm run verify`):
 *
 *   A. EDITION VALIDITY. Every structured open-content citation must start with
 *      an edition prefix registered for that system. The registry is the UNION
 *      of `strictOpenContentPolicy.allowedSources` (the data-layer whitelist)
 *      and the longer citation prefixes the rules/compute layers use, so the
 *      two policies cannot silently diverge. Cites a closed book, or an edition
 *      that does not exist → red.
 *
 *   B. NAMED-ENTRY RESOLUTION. A citation shaped `<Edition>: <Category> — <Entry>`
 *      (e.g. `SRD 5.1: Feats — Great Weapon Master`) must resolve `<Entry>` in
 *      that system's in-repo open-content corpus — the same loader corpus
 *      `srd:coverage` reverse-diffs against the published SRD list. Unresolved
 *      → red.
 *
 *   C. RULES-LAYER CONTENT LITERALS. Every `source: { kind, id, label }` effect
 *      source in `src/rules/**` / `src/scene/**` whose kind names shippable
 *      content (`feat`, `item`, `spell`) and whose label is a string LITERAL
 *      must resolve in the corpus of at least one system the file serves.
 *      Unresolved → red. Dynamic sources (label taken from a loaded entry) are
 *      already covered by the loader-side audit and are counted, not flagged.
 *
 *   D. SCOPE + ALLOWLIST RATCHET. Any scanned file carrying a literal effect
 *      source must be declared in RULES_FILE_SYSTEM_SCOPE (a new rules file
 *      encoding content cannot slip in unscoped), and every ALLOWLIST entry
 *      must still be OBSERVED and still UNRESOLVED — a stale allowlist entry is
 *      itself a failure, so the quarantine cannot rot into a rubber stamp.
 *
 * WHAT IT DOES NOT ASSERT — recorded in docs/GAPS.md, not silently skipped:
 *   - Chapter-level citations (`SRD 5.1: Carrying Capacity`) name a book
 *     section, not an entry; there is no in-repo denominator of SRD section
 *     titles, so they are counted and reported but not resolved.
 *   - `kind: 'feature'` (class features) and `kind: 'condition'` have no
 *     independent open-content corpus in this repo; resolving them would mean
 *     inventing a denominator. Reported as unresolvable-by-category.
 *
 * Run: npm run check:rules-provenance  (add --json for the machine report)
 */

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseOpenContentCitation,
  isRegisteredOpenContentEdition,
  entryResolvesInCorpus,
  extractEffectSourceLiterals,
  sourceKindNamesContent,
  CONTENT_SOURCE_KIND_CATEGORY,
  UNRESOLVABLE_SOURCE_KINDS,
} from '../src/scripts/rulesProvenanceShape.ts';
import { COMPUTE_REGISTERS } from '../docs/compute-register/index.ts';
import {
  loadFeatsForSystem,
  loadSpellsForSystem,
  loadAdvantagesForSystem,
  loadMonstersForSystem,
  loadBackgroundsForSystem,
  loadSpeciesForSystem,
  loadEquipmentForSystem,
  loadComplicationsForSystem,
  loadDaggerheartDomainCardsForSystem,
  loadClassesForSystem,
  loadFeatureOptionsForSystem,
  loadPowerModifiersForSystem,
} from '../src/utils/dataLoader.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const JSON_MODE = process.argv.includes('--json');

const ALL_SYSTEMS = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

// ───────────────────────────── scan scope ──────────────────────────────────

/** Directories scanned for rules-layer content literals (never `src/data/`). */
const RULES_SCAN_DIRS = ['src/rules', 'src/scene'];

/**
 * Which systems' open content each rules file may cite. A file carrying a
 * literal effect source MUST appear here (assertion D) — the compiler serving a
 * system is what tells us which corpus its cited feats have to exist in.
 */
const RULES_FILE_SYSTEM_SCOPE = {
  'src/rules/conditions/dnd5eRiders.ts': ['dnd-5e-2014', 'dnd-5e-2024'],
  'src/rules/conditions/d20LegacyRiders.ts': ['dnd-3.5e', 'pf1e'],
  'src/rules/conditions/pf2eRiders.ts': ['pf2e'],
  'src/rules/conditions/mam3eConditions.ts': ['mam3e'],
  // System-agnostic scene layer: synthesises a generic status-penalty effect
  // rather than citing any book's content.
  'src/rules/conditions/sceneConditions.ts': ALL_SYSTEMS,
};

/**
 * Declarative derived-quantity spec files and the systems whose editions they
 * may cite. `src/systems/dnd5e/shared` serves BOTH 5e editions, which is why
 * its citations read `D&D 5e SRD (5.1/5.2)`.
 */
const DERIVED_QUANTITY_FILE_SCOPE = {
  'src/systems/dnd5e/shared/derivedQuantities.ts': ['dnd-5e-2014', 'dnd-5e-2024'],
  'src/systems/dnd35e/derivedQuantities.ts': ['dnd-3.5e'],
  'src/systems/pf1e/derivedQuantities.ts': ['pf1e'],
  'src/systems/pf2e/derivedQuantities.ts': ['pf2e'],
  'src/systems/mam3e/derivedQuantities.ts': ['mam3e'],
  'src/systems/daggerheart/derivedQuantities.ts': ['daggerheart'],
};

// ───────────────────────────── allowlist ───────────────────────────────────

/**
 * REVIEWED EXCEPTIONS — quarantined, not forgiven.
 *
 * Every entry is a citation this gate could NOT substantiate against the repo's
 * open-content corpora, together with the reviewed verdict:
 *
 *   'unsubstantiated'  the citation names a source that does not contain the
 *                      entry. A licensing/product decision by the repo owner,
 *                      mirrored in docs/GAPS.md under `gapsAnchor`. Removing
 *                      shipped content is not a decision this tooling makes.
 *   'chapter-section'  the citation is chapter-level in intent but shaped like
 *                      an entry citation, and the parser cannot tell them apart
 *                      without a denominator of SRD section titles (which does
 *                      not exist in-repo).
 *
 * Assertion D makes each entry self-expiring: once the underlying citation is
 * fixed or removed, the now-stale entry FAILS the gate and must be deleted. So
 * this list can shrink silently but never grow silently.
 *
 * Each entry is also CONTENT-ADDRESSED: it pins the exact `citation` text and
 * the `assertion` that was reviewed, not just the finding id. Keying on the id
 * alone granted blanket immunity — the id encodes only location + kind + entry
 * id, so a reviewed verdict for one citation silently absolved that location of
 * EVERY future failure, including a strictly worse one. Demonstrated: rewriting
 * a register citation to name an outright closed book ("Player's Handbook 2014:
 * Feats — Great Weapon Master") still matched the id, printed the reviewed
 * reason about SRD 5.1, and exited 0. That is the "quarantine rots into a
 * rubber stamp" failure this gate exists to avoid, and it mattered because the
 * gate ships green only by virtue of these quarantined findings.
 *
 * A finding now quarantines only when the id, the assertion AND the citation
 * all match what was reviewed. Anything else is a failure, even at a
 * location that already carries an entry.
 */
const ALLOWLIST = [
  {
    id: 'rules:src/rules/conditions/dnd5eRiders.ts:feat:great-weapon-master',
    assertion: 'C/content-literal',
    citation: 'feat "Great Weapon Master"',
    verdict: 'unsubstantiated',
    gapsAnchor: 'OC-1',
    reason:
      'The Great Weapon Master -5/+10 rider is compiled for dnd-5e-2014, but SRD 5.1 opens exactly one feat (Grappler) — see src/data/dnd/5e-2014/feats/index.ts and docs/srd-sources.md. The feat is 2014 Player’s Handbook content. Removing shipped content is the repo owner’s call; this gate records the evidence.',
  },
  {
    id: 'rules:src/rules/conditions/dnd5eRiders.ts:feat:sharpshooter',
    assertion: 'C/content-literal',
    citation: 'feat "Sharpshooter"',
    verdict: 'unsubstantiated',
    gapsAnchor: 'OC-1',
    reason:
      'Same defect as great-weapon-master: the Sharpshooter -5/+10 rider is compiled for dnd-5e-2014 while SRD 5.1 opens only Grappler. Owner decision pending.',
  },
  {
    id: 'register:dnd5e2014.L3.gwm-tradeoff',
    assertion: 'B/named-entry',
    citation: 'SRD 5.1: Feats — Great Weapon Master',
    verdict: 'unsubstantiated',
    gapsAnchor: 'OC-1',
    reason:
      'Compute-register entry cites "SRD 5.1: Feats — Great Weapon Master". SRD 5.1 contains no such feat (feats = 1, Grappler). The citation names a source that does not contain the entry.',
  },
  {
    id: 'register:dnd5e2014.L3.sharpshooter-tradeoff',
    assertion: 'B/named-entry',
    citation: 'SRD 5.1: Feats — Sharpshooter',
    verdict: 'unsubstantiated',
    gapsAnchor: 'OC-1',
    reason:
      'Compute-register entry cites "SRD 5.1: Feats — Sharpshooter". SRD 5.1 contains no such feat.',
  },
  {
    id: 'register:mam3e.L9.power-cost',
    assertion: 'B/named-entry',
    citation: "M&M 3e Hero's Handbook (DHH OGC): Powers — Power Cost; Modifiers (minimum cost)",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      '"Powers — Power Cost" is the Power Cost SECTION of the Hero\'s Handbook Powers chapter, not a power effect named "Power Cost"; the shipped mam3e power corpus (loadSpellsForSystem) is a list of power EFFECTS, so the name cannot resolve. The citation is sound; the parser cannot distinguish a chapter section from an entry without a denominator of section titles.',
  },

  // The mam3e L5 rows added 2026-07-31 are all the SAME SHAPE as
  // register:mam3e.L9.power-cost above: each cites a section of the Hero's
  // Handbook Powers chapter (Duration, Effect Ranks, Power Cost, Modifiers),
  // and the shipped mam3e corpus is a list of power EFFECTS, so a section title
  // can never resolve against it. Listed individually rather than pattern-matched
  // so each remains a reviewable claim — a wildcard here would let a genuinely
  // fabricated citation in under cover of the real ones.
  //
  // NOTE, separately: whether these rows belong in L5 at all is an open question.
  // docs/compute-register/types.ts defines L5 as "spellcasting economy" and M&M
  // has no spellcasting, so siting the EFFECT economy there is a reinterpretation
  // that moves the published completeness number. That is a scope decision, and
  // it is not settled by this allowlist — this only records that the citations
  // name real chapter sections.
  {
    id: 'register:mam3e.L5.continuous-effect-no-activation',
    assertion: 'B/named-entry',
    citation:
      "M&M 3e Hero's Handbook (DHH OGC): Powers — Duration (Continuous, Permanent); Action & Adventure — Action Types",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      '"Powers — Duration" is the Duration SECTION of the Powers chapter; Continuous and Permanent are duration VALUES within it, not power effects. Cannot resolve against a corpus of effect names.',
  },
  {
    id: 'register:mam3e.L5.effect-rank',
    assertion: 'B/named-entry',
    citation: "M&M 3e Hero's Handbook (DHH OGC): Powers — Effect Ranks",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      '"Effect Ranks" is a section of the Powers chapter describing how rank scales an effect, not an effect named "Effect Ranks".',
  },
  {
    id: 'register:mam3e.L5.flat-effect-rank',
    assertion: 'B/named-entry',
    citation: "M&M 3e Hero's Handbook (DHH OGC): Powers — Power Cost (flat versus per-rank effects)",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      'Same Power Cost section as register:mam3e.L9.power-cost, narrowed to the flat-versus-per-rank distinction. A section, not an effect.',
  },
  {
    id: 'register:mam3e.L5.modifier-applied-rank',
    assertion: 'B/named-entry',
    citation: "M&M 3e Hero's Handbook (DHH OGC): Powers — Modifiers (ranked extras and flaws)",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      '"Modifiers" is the extras-and-flaws SECTION of the Powers chapter. Individual modifiers ship in the modifier corpus, not the power-effect corpus this assertion resolves against.',
  },
  {
    id: 'register:mam3e.L5.sustained-effect-upkeep',
    assertion: 'B/named-entry',
    citation: "M&M 3e Hero's Handbook (DHH OGC): Powers — Duration (Sustained)",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      'Sustained is a duration VALUE in the Powers chapter Duration section, not a power effect. Note the row itself is recorded `missing`: costForAction takes only an action type, so sustained upkeep is genuinely not modelled.',
  },
  {
    id: 'register:mam3e.L5.no-per-use-resource-economy',
    assertion: 'B/named-entry',
    citation:
      "M&M 3e Hero's Handbook (DHH OGC): Powers — Duration (effects are instant/concentration/sustained/continuous/permanent; none are expendable uses)",
    verdict: 'chapter-section',
    gapsAnchor: 'OC-2',
    reason:
      'Cites the Duration section to evidence an ABSENCE — M&M has no per-use/slot economy to model. An absence claim can never resolve to a named corpus entry by construction.',
  },
];

const ALLOWED_BY_ID = new Map(ALLOWLIST.map((entry) => [entry.id, entry]));
const allowlistHits = new Set();

// ───────────────────────────── corpora ─────────────────────────────────────

const CATEGORY_LOADERS = {
  feats: loadFeatsForSystem,
  spells: loadSpellsForSystem,
  advantages: loadAdvantagesForSystem,
  monsters: loadMonstersForSystem,
  backgrounds: loadBackgroundsForSystem,
  species: loadSpeciesForSystem,
  equipment: loadEquipmentForSystem,
  complications: loadComplicationsForSystem,
  domainCards: loadDaggerheartDomainCardsForSystem,
  classes: loadClassesForSystem,
  featureOptions: loadFeatureOptionsForSystem,
  powerModifiers: loadPowerModifiersForSystem,
  // M&M power effects ship through the spell loader (the same wiring
  // `srd:coverage` uses for its mam3e/powers target).
  powers: (systemId) =>
    systemId === 'mam3e' ? loadSpellsForSystem(systemId) : Promise.resolve([]),
};

const corpusCache = new Map();

/**
 * Names in `systemId`'s open-content corpus for `category`, or `null` when the
 * repo ships no corpus for that pair. `null` means UNRESOLVABLE, never
 * "everything fails" — resolving against an empty corpus would manufacture
 * failures for systems that simply have no such catalog.
 */
async function corpusNames(systemId, category) {
  const key = `${systemId}::${category}`;
  if (corpusCache.has(key)) return corpusCache.get(key);
  const loader = CATEGORY_LOADERS[category];
  let names = null;
  if (loader) {
    const items = await loader(systemId);
    const found = items
      .map((item) => (item && typeof item.name === 'string' ? item.name : null))
      .filter((name) => name !== null);
    names = found.length > 0 ? found : null;
  }
  corpusCache.set(key, names);
  return names;
}

// ───────────────────────────── findings ────────────────────────────────────

const failures = [];
const quarantined = [];
const cleared = [];
const unresolvable = [];
const stats = {
  citationsScanned: 0,
  chapterCitations: 0,
  negativeCitations: 0,
  namedEntryCitations: 0,
  effectSourcesScanned: 0,
  dynamicEffectSources: 0,
  literalEffectSources: 0,
  nonContentEffectSources: 0,
};

function record(finding) {
  const allowed = ALLOWED_BY_ID.get(finding.id);
  // Content-addressed quarantine: the id alone is NOT enough. The reviewed
  // assertion and citation text must both match, so a DIFFERENT defect at an
  // already-reviewed location (a worse citation, or the same entry failing a
  // different assertion) fails instead of inheriting the reviewed verdict.
  if (allowed && allowed.assertion === finding.assertion && allowed.citation === finding.citation) {
    allowlistHits.add(finding.id);
    quarantined.push({
      ...finding,
      verdict: allowed.verdict,
      gapsAnchor: allowed.gapsAnchor,
      reason: allowed.reason,
    });
    return;
  }
  if (allowed) {
    failures.push({
      ...finding,
      detail:
        `${finding.detail} — and this is NOT the reviewed finding for id ${JSON.stringify(finding.id)}: ` +
        `the allowlist pins assertion ${JSON.stringify(allowed.assertion)} / citation ${JSON.stringify(allowed.citation)}, ` +
        `but this is assertion ${JSON.stringify(finding.assertion)} / citation ${JSON.stringify(finding.citation)}. ` +
        `A reviewed verdict covers one specific citation, never the location in general.`,
    });
    return;
  }
  failures.push(finding);
}

// ───────────────────── A/B: structured citation audit ──────────────────────

/** Audit one citation string against the systems whose editions it may cite. */
async function auditCitation({ id, where, citation, systems }) {
  stats.citationsScanned += 1;
  const parsed = parseOpenContentCitation(citation);

  const editionSystems = systems.filter((s) => isRegisteredOpenContentEdition(s, parsed.edition));
  if (editionSystems.length === 0) {
    record({
      id,
      where,
      citation,
      assertion: 'A/edition',
      detail: `edition prefix ${JSON.stringify(parsed.edition)} is not registered open content for ${systems.join(', ')}`,
    });
    return;
  }

  for (const segment of parsed.segments) {
    if (segment.kind === 'chapter') {
      stats.chapterCitations += 1;
      continue;
    }
    if (segment.kind === 'negative') {
      stats.negativeCitations += 1;
      continue;
    }
    stats.namedEntryCitations += 1;

    let resolvedIn = null;
    let anyCorpus = false;
    for (const systemId of editionSystems) {
      const names = await corpusNames(systemId, segment.category);
      if (names === null) continue;
      anyCorpus = true;
      if (entryResolvesInCorpus(segment.entry, names)) {
        resolvedIn = systemId;
        break;
      }
    }

    if (resolvedIn) {
      cleared.push({
        where,
        citation,
        category: segment.category,
        entry: segment.entry,
        resolvedIn,
      });
      continue;
    }
    if (!anyCorpus) {
      unresolvable.push({
        where,
        citation,
        reason: `no in-repo open-content corpus for category "${segment.category}" in ${editionSystems.join(', ')}`,
      });
      continue;
    }
    record({
      id,
      where,
      citation,
      assertion: 'B/named-entry',
      detail: `cites ${segment.category} entry ${JSON.stringify(segment.entry)}, which is absent from the ${editionSystems.join('/')} open-content corpus`,
    });
  }
}

// ──────────────────────── C/D: rules-layer literals ────────────────────────

async function listTsFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(path.join(REPO_ROOT, dir), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...(await listTsFiles(rel)));
    else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) out.push(rel);
  }
  return out;
}

async function auditRulesLayerLiterals() {
  const files = [];
  for (const dir of RULES_SCAN_DIRS) files.push(...(await listTsFiles(dir)));

  for (const rel of files.sort()) {
    const text = readFileSync(path.join(REPO_ROOT, rel), 'utf8');
    const sources = extractEffectSourceLiterals(text);
    if (sources.length === 0) continue;
    stats.effectSourcesScanned += sources.length;

    const allLiterals = sources.filter((s) => !s.dynamic);
    stats.dynamicEffectSources += sources.length - allLiterals.length;
    stats.literalEffectSources += allLiterals.length;
    // Engine-synthetic provenance (`system`, `custom`) names no book content,
    // so it needs neither a citation nor a system scope.
    const literals = allLiterals.filter((s) => sourceKindNamesContent(s.kind));
    stats.nonContentEffectSources += allLiterals.length - literals.length;
    if (literals.length === 0) continue;

    const systems = RULES_FILE_SYSTEM_SCOPE[rel];
    if (!systems) {
      failures.push({
        id: `scope:${rel}`,
        where: rel,
        citation: literals.map((s) => `${s.kind}:${s.id ?? s.label}`).join(', '),
        assertion: 'D/scope',
        detail:
          'file encodes literal content effect sources but is not declared in RULES_FILE_SYSTEM_SCOPE — declare which systems it serves so its citations can be resolved',
      });
      continue;
    }

    for (const source of literals) {
      const category = CONTENT_SOURCE_KIND_CATEGORY[source.kind];
      const name = source.label ?? source.id;
      const where = `${rel}:${source.line}`;
      if (!category) {
        if (UNRESOLVABLE_SOURCE_KINDS.includes(source.kind)) {
          unresolvable.push({
            where,
            citation: `${source.kind} "${name}"`,
            reason: `kind "${source.kind}" has no independent open-content corpus in this repo`,
          });
        } else {
          failures.push({
            id: `kind:${rel}:${source.kind}`,
            where,
            citation: `${source.kind} "${name}"`,
            assertion: 'C/kind',
            detail: `unknown effect-source kind "${source.kind}" — classify it in rulesProvenanceShape.ts`,
          });
        }
        continue;
      }

      let resolvedIn = null;
      let anyCorpus = false;
      for (const systemId of systems) {
        const names = await corpusNames(systemId, category);
        if (names === null) continue;
        anyCorpus = true;
        if (entryResolvesInCorpus(name, names)) {
          resolvedIn = systemId;
          break;
        }
      }

      if (resolvedIn) {
        cleared.push({
          where,
          citation: `${source.kind} "${name}"`,
          category,
          entry: name,
          resolvedIn,
        });
        continue;
      }
      if (!anyCorpus) {
        unresolvable.push({
          where,
          citation: `${source.kind} "${name}"`,
          reason: `no in-repo ${category} corpus for ${systems.join(', ')}`,
        });
        continue;
      }
      record({
        id: `rules:${rel}:${source.kind}:${source.id ?? name}`,
        where,
        citation: `${source.kind} "${name}"`,
        assertion: 'C/content-literal',
        detail: `is compiled by the rules layer but is absent from the ${systems.join('/')} open-content ${category} corpus`,
      });
    }
  }
}

// ─────────────────────────────── run ───────────────────────────────────────

for (const register of COMPUTE_REGISTERS) {
  for (const entry of register.entries) {
    await auditCitation({
      id: `register:${entry.id}`,
      where: `docs/compute-register (${register.systemId}) ${entry.id}`,
      citation: entry.source,
      systems: [register.systemId],
    });
  }
}

const DERIVED_SOURCE = /^\s*source:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")\s*,\s*$/gm;
// Completeness ratchet for the derived-quantity map, mirroring assertion D over
// RULES_FILE_SYSTEM_SCOPE. Without this, iterating a hardcoded map means a NEW
// derived-quantity spec file silently drops out of coverage: it is simply never
// read, and the citation count stays flat so nothing looks wrong. Seven systems
// share six files today only because src/systems/dnd5e/shared serves both 5e
// editions — splitting it would silently unscan one.
const declaredDerivedFiles = new Set(Object.keys(DERIVED_QUANTITY_FILE_SCOPE));
for (const systemDir of await readdir(path.join(REPO_ROOT, 'src/systems'), {
  withFileTypes: true,
})) {
  if (!systemDir.isDirectory()) continue;
  const dirPath = path.join(REPO_ROOT, 'src/systems', systemDir.name);
  for (const entry of await readdir(dirPath, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !/^derivedQuantities.*\.ts$/.test(entry.name)) continue;
    const rel = path
      .relative(REPO_ROOT, path.join(entry.parentPath ?? entry.path ?? dirPath, entry.name))
      .split(path.sep)
      .join('/');
    if (declaredDerivedFiles.has(rel)) continue;
    failures.push({
      id: `scope:${rel}`,
      where: rel,
      citation: rel,
      assertion: 'D/scope',
      detail:
        'derived-quantity spec file is not declared in DERIVED_QUANTITY_FILE_SCOPE — declare which systems it serves, or its open-content citations are never audited',
    });
  }
}

for (const [rel, systems] of Object.entries(DERIVED_QUANTITY_FILE_SCOPE)) {
  const text = readFileSync(path.join(REPO_ROOT, rel), 'utf8');
  DERIVED_SOURCE.lastIndex = 0;
  let match;
  let index = 0;
  while ((match = DERIVED_SOURCE.exec(text)) !== null) {
    const citation = (match[1] ?? match[2]).replace(/\\'/g, "'").replace(/\\"/g, '"');
    const line = text.slice(0, match.index).split('\n').length;
    index += 1;
    await auditCitation({
      id: `derived:${rel}:${index}`,
      where: `${rel}:${line}`,
      citation,
      systems,
    });
  }
}

await auditRulesLayerLiterals();

for (const entry of ALLOWLIST) {
  if (!allowlistHits.has(entry.id)) {
    failures.push({
      id: `stale:${entry.id}`,
      where: 'scripts/check-rules-provenance.mjs ALLOWLIST',
      citation: entry.id,
      assertion: 'D/stale-allowlist',
      detail:
        'allowlisted citation was not observed as unsubstantiated — the underlying citation was fixed or removed, so delete this allowlist entry (and its docs/GAPS.md row)',
    });
  }
}

// ────────────────────────────── report ─────────────────────────────────────

if (JSON_MODE) {
  console.log(JSON.stringify({ stats, failures, quarantined, cleared, unresolvable }, null, 2));
} else {
  console.log('check:rules-provenance — open-content citations OUTSIDE src/data/\n');
  console.log(
    `  scanned: ${stats.citationsScanned} structured citations -> ` +
      `${stats.namedEntryCitations + stats.chapterCitations + stats.negativeCitations} segments ` +
      `(${stats.namedEntryCitations} name an entry, ${stats.chapterCitations} chapter-level, ` +
      `${stats.negativeCitations} absence assertions)`
  );
  console.log(
    `           ${stats.effectSourcesScanned} rules-layer effect sources ` +
      `(${stats.literalEffectSources} literal — ${stats.nonContentEffectSources} of them engine-synthetic, ` +
      `${stats.dynamicEffectSources} data-driven)\n`
  );

  if (cleared.length > 0) {
    console.log(`  CLEARED (${cleared.length}) — resolved in an open-content corpus:`);
    for (const c of cleared) console.log(`    ok  ${c.where}  ${c.citation} -> ${c.resolvedIn}`);
    console.log('');
  }
  if (unresolvable.length > 0) {
    console.log(`  UNRESOLVABLE (${unresolvable.length}) — no denominator, see docs/GAPS.md:`);
    for (const u of unresolvable) console.log(`    ??  ${u.where}  ${u.citation} — ${u.reason}`);
    console.log('');
  }
  const unsubstantiated = quarantined.filter((q) => q.verdict === 'unsubstantiated');
  const chapterSections = quarantined.filter((q) => q.verdict === 'chapter-section');
  if (unsubstantiated.length > 0) {
    console.log(
      `  UNSUBSTANTIATED (${unsubstantiated.length}) — cited source does not contain the entry; owner decision pending:`
    );
    for (const q of unsubstantiated) {
      console.log(`    !!  ${q.where}  ${q.citation}`);
      console.log(`        ${q.detail}  [docs/GAPS.md ${q.gapsAnchor}]`);
    }
    console.log('');
  }
  if (chapterSections.length > 0) {
    console.log(
      `  CHAPTER-SECTION (${chapterSections.length}) — reviewed: cites a book section, not an entry:`
    );
    for (const q of chapterSections) {
      console.log(`    ~~  ${q.where}  ${q.citation}  [docs/GAPS.md ${q.gapsAnchor}]`);
    }
    console.log('');
  }
  if (failures.length > 0) {
    console.log(`  FAILURES (${failures.length}):`);
    for (const f of failures) {
      console.log(`    XX  [${f.assertion}] ${f.where}`);
      console.log(`        ${f.citation}`);
      console.log(`        ${f.detail}`);
    }
    console.log('');
  }
}

if (failures.length > 0) {
  console.error(
    `check:rules-provenance FAILED — ${failures.length} unsubstantiated open-content citation(s) outside src/data/.`
  );
  process.exit(1);
}
if (!JSON_MODE) console.log('check:rules-provenance OK');
