#!/usr/bin/env tsx
/**
 * Generates Denominator A content manifests by enumerating the repo's
 * loader-backed open-content entries with their cited {id, category, source}.
 *
 * IMPORTANT — what this is and is not:
 *   - IS: a complete, cited catalog of every entry the product ships (the
 *     literal Denominator A artifact). Every entry is real, encoded,
 *     loader-backed, source-tagged, and policy-clean. Entries whose citation is
 *     a declared `originalContentSources` label — authored here, not
 *     transcribed from an open document — are emitted with status 'original'
 *     and are NOT part of the open-content denominator.
 *   - IS NOT: a measure of coverage vs the full *published* SRD. Because the
 *     manifest is derived from the loaders, the metric's per-category parity is
 *     catalog parity (everything cataloged is encoded), not a detector of
 *     entries the published SRD contains but the loaders omit. Detecting those
 *     omissions requires an external authoritative SRD index, which is flagged
 *     unresolved (see docs/STATUS.md). This generator never invents entries.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadAdvantagesForSystem,
  loadArchetypesForSystem,
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadComplicationsForSystem,
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
import { extractSourceAttribution, isOriginalContentSource } from '../utils/openContentPolicy';
import { GameSystemId } from '../types/game-systems';
import type { ManifestCategory } from '../../docs/srd-manifest/types';

type Loaded = { id?: unknown; name?: unknown };
type CategoryLoader = {
  category: ManifestCategory;
  load: (systemId: GameSystemId) => Promise<unknown[]>;
};

const CATEGORY_LOADERS: CategoryLoader[] = [
  { category: 'spells', load: (s) => loadSpellsForSystem(s) },
  {
    category: 'classes',
    load: (s) =>
      s === 'daggerheart' ? loadDaggerheartClassesForSystem(s) : loadClassesForSystem(s),
  },
  {
    category: 'species',
    load: (s) =>
      s === 'daggerheart' ? loadDaggerheartAncestriesForSystem(s) : loadSpeciesForSystem(s),
  },
  {
    category: 'backgrounds',
    load: (s) =>
      s === 'daggerheart'
        ? loadDaggerheartCommunitiesForSystem(s)
        : s === 'pf2e'
          ? loadPf2eBackgroundsForSystem(s)
          : loadBackgroundsForSystem(s),
  },
  { category: 'traits', load: (s) => loadTraitsForSystem(s) },
  { category: 'featureOptions', load: (s) => loadFeatureOptionsForSystem(s) },
  {
    category: 'archetypes',
    load: (s) => (s === 'mam3e' ? loadMam3eArchetypesForSystem(s) : loadArchetypesForSystem(s)),
  },
  { category: 'complications', load: (s) => loadComplicationsForSystem(s) },
  { category: 'monsters', load: (s) => loadMonstersForSystem(s) },
  {
    category: 'equipment',
    load: async (s) =>
      s === 'daggerheart'
        ? [
            ...(await loadDaggerheartWeaponsForSystem(s)),
            ...(await loadDaggerheartArmorForSystem(s)),
            ...(await loadDaggerheartLootForSystem(s)),
            ...(await loadDaggerheartConsumablesForSystem(s)),
          ]
        : loadEquipmentForSystem(s),
  },
  { category: 'feats', load: (s) => loadFeatsForSystem(s) },
  { category: 'advantages', load: (s) => loadAdvantagesForSystem(s) },
  { category: 'powerModifiers', load: (s) => loadPowerModifiersForSystem(s) },
];

type SystemConfig = {
  id: GameSystemId;
  file: string;
  exportName: string;
  srdVersion: string;
};

const SYSTEMS: SystemConfig[] = [
  { id: 'dnd-5e-2014', file: 'dnd5e-2014', exportName: 'dnd5e2014Manifest', srdVersion: 'SRD 5.1' },
  { id: 'dnd-5e-2024', file: 'dnd5e-2024', exportName: 'dnd5e2024Manifest', srdVersion: 'SRD 5.2' },
  { id: 'dnd-3.5e', file: 'dnd35e', exportName: 'dnd35eManifest', srdVersion: 'SRD 3.5' },
  { id: 'pf1e', file: 'pf1e', exportName: 'pf1eManifest', srdVersion: 'PF1e Core Rulebook (OGC)' },
  { id: 'pf2e', file: 'pf2e', exportName: 'pf2eManifest', srdVersion: 'PF2e Core Rulebook (OGC)' },
  {
    id: 'mam3e',
    file: 'mam3e',
    exportName: 'mam3eManifest',
    srdVersion: "M&M 3e Hero's Handbook (DHH OGC)",
  },
  {
    id: 'daggerheart',
    file: 'daggerheart',
    exportName: 'daggerheartManifest',
    srdVersion: 'Daggerheart SRD 1.0',
  },
];

function isRecord(value: unknown): value is Loaded {
  return Boolean(value) && typeof value === 'object';
}

function escape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function buildSystem(config: SystemConfig): Promise<string> {
  const lines: string[] = [];
  const seen = new Set<string>();
  let count = 0;
  let originalCount = 0;

  for (const loader of CATEGORY_LOADERS) {
    const items = await loader.load(config.id);
    for (const item of items) {
      if (!isRecord(item) || typeof item.id !== 'string' || item.id.trim().length === 0) continue;
      const key = `${loader.category}:${item.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const source = extractSourceAttribution(item) ?? config.srdVersion;
      const name = typeof item.name === 'string' ? item.name : item.id;
      // Self-authored entries ship and are honestly cited, but they are not open
      // content, so they are enumerated with status 'original' and drop out of
      // the open-content denominator (`isInScope`). Emitting them as 'encoded'
      // would report a non-open-content population as open-content parity.
      const isOriginal = isOriginalContentSource(config.id, source);
      if (isOriginal) originalCount += 1;
      lines.push(
        `    { id: '${escape(item.id)}', category: '${loader.category}', name: '${escape(name)}', source: '${escape(source)}', status: '${isOriginal ? 'original' : 'encoded'}' },`
      );
      count += 1;
    }
  }

  const openContentCount = count - originalCount;
  return `// AUTO-GENERATED by src/scripts/generate-srd-manifests.ts — do not edit by hand.
// Catalog enumeration of every entry the loaders ship (id/category/source).
// CATALOG PARITY, not full-published-SRD coverage — see docs/STATUS.md.
// Entries: ${count} (${openContentCount} open-content 'encoded'; ${originalCount} 'original',
// i.e. authored by this project, NOT open content, and excluded from the
// open-content denominator — see docs/mam3e-equipment-provenance.md).
import type { SystemManifest } from './types';

export const ${config.exportName}: SystemManifest = {
  systemId: '${config.id}',
  srdVersion: '${escape(config.srdVersion)}',
  entries: [
${lines.join('\n')}
  ],
};

export default ${config.exportName};
`;
}

async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const manifestDir = path.resolve(scriptDir, '../../docs/srd-manifest');

  for (const config of SYSTEMS) {
    const contents = await buildSystem(config);
    await fs.writeFile(path.join(manifestDir, `${config.file}.ts`), contents, 'utf8');
    console.log(`Wrote docs/srd-manifest/${config.file}.ts`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
