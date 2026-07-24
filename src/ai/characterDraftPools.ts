/**
 * Loader-derived candidate pools for AI character drafting (RFC 002 candidate
 * pools). Builds the set of LEGAL option ids for a target system from the SAME
 * per-system loaders (`src/utils/dataLoader.ts`) the system's validator checks
 * against, so the model chooses from real ids and the flow can reject any it
 * invents before the deterministic validator runs.
 *
 * Boundary-clean: this reads only the shared `dataLoader` dispatch hub, never the
 * systems layer, so it is safe under `src/ai/**` and the browser bundle. Each
 * category a system does not use resolves to an empty pool (e.g. mam3e has no
 * classes; daggerheart has no feats) — an expected, valid shape.
 */
import type { GameSystemId } from '../types/game-systems';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
  loadFeatsForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../utils/dataLoader';
import type { CharacterDraftCandidate, CharacterDraftCandidatePools } from './contracts';

/** An id+name option as loaded from a data catalog. */
interface NamedEntity {
  id?: unknown;
  name?: unknown;
}

/** Project loaded catalog entries to the minimal id/name candidate shape. */
function toCandidates(items: NamedEntity[], limit?: number): CharacterDraftCandidate[] {
  const candidates = items
    .filter((item): item is { id: string; name: string } => {
      return typeof item?.id === 'string' && !!item.id && typeof item?.name === 'string';
    })
    .map((item) => ({ id: item.id, name: item.name }));
  return typeof limit === 'number' ? candidates.slice(0, limit) : candidates;
}

async function classPool(
  systemId: GameSystemId,
  limit?: number
): Promise<CharacterDraftCandidate[]> {
  if (systemId === 'daggerheart') {
    return toCandidates(await loadDaggerheartClassesForSystem(systemId), limit);
  }
  return toCandidates(await loadClassesForSystem(systemId), limit);
}

async function ancestryPool(
  systemId: GameSystemId,
  limit?: number
): Promise<CharacterDraftCandidate[]> {
  if (systemId === 'daggerheart') {
    return toCandidates(await loadDaggerheartAncestriesForSystem(systemId), limit);
  }
  return toCandidates(await loadSpeciesForSystem(systemId), limit);
}

async function backgroundPool(
  systemId: GameSystemId,
  limit?: number
): Promise<CharacterDraftCandidate[]> {
  if (systemId === 'pf2e') {
    return toCandidates(await loadPf2eBackgroundsForSystem(systemId), limit);
  }
  if (systemId === 'daggerheart') {
    return toCandidates(await loadDaggerheartCommunitiesForSystem(systemId), limit);
  }
  return toCandidates(await loadBackgroundsForSystem(systemId), limit);
}

/**
 * Load the full candidate pools for a system. `limitPerPool`, when set, caps each
 * category (keeps the prompt bounded for very large catalogs); the model only
 * ever picks from what it is offered, so a cap never risks an invented id.
 */
export async function loadCharacterDraftPools(
  systemId: GameSystemId,
  options: { limitPerPool?: number } = {}
): Promise<CharacterDraftCandidatePools> {
  const limit = options.limitPerPool;
  const [classes, ancestries, backgrounds, feats, spells] = await Promise.all([
    classPool(systemId, limit),
    ancestryPool(systemId, limit),
    backgroundPool(systemId, limit),
    loadFeatsForSystem(systemId).then((items) => toCandidates(items, limit)),
    loadSpellsForSystem(systemId).then((items) => toCandidates(items, limit)),
  ]);
  return { classes, ancestries, backgrounds, feats, spells };
}
