import { daggerheartClasses } from '../data/daggerheart/1.0/classes';
import { daggerheartAncestries } from '../data/daggerheart/1.0/ancestries';
import { daggerheartCommunities } from '../data/daggerheart/1.0/communities';
import { LOADOUT_LIMIT } from '../systems/daggerheart/daggerheartSheetConstants';
import type { GameSystemId } from '../types/game-systems';

/**
 * Per-system "options manifest" — the compact, machine-readable menu of legal
 * choices and the structural rules handed to the LLM author so it picks only
 * valid values. It mirrors exactly the selection keys each creator reads back,
 * and stays small (names + rules, not full stat blocks) so one-shot authoring
 * fits comfortably in context. Systems without a manifest builder yet return
 * `undefined`, and the orchestrator falls back to deterministic creation.
 */

function daggerheartManifest(): unknown {
  return {
    system: 'daggerheart',
    levelRange: [1, 10],
    abilityMethod: {
      kind: 'fixed-array',
      array: [2, 1, 1, 0, 0, -1],
      traits: ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'],
      note: 'Assign each array value to exactly one trait.',
    },
    loadoutLimit: LOADOUT_LIMIT,
    classes: daggerheartClasses.map((entry) => ({
      name: entry.name,
      domains: entry.domains,
      subclasses: entry.subclasses.map((subclass) => subclass.name),
    })),
    ancestries: daggerheartAncestries.map((entry) => entry.name),
    communities: daggerheartCommunities.map((entry) => entry.name),
    selectionKeys: {
      class: 'a class name from classes[].name',
      subclass: 'a subclass name from the chosen class.subclasses[]',
      heritage: 'an ancestry name from ancestries[]',
      community: 'a community name from communities[]',
      traits: 'object mapping each trait to one value of the fixed array (each value used once)',
      domainCards: "array of up to 2 domain card names from the chosen class's domains",
      experiences: 'array of 2 short experience phrases that fit the concept',
    },
  };
}

const MANIFEST_BUILDERS: Partial<Record<GameSystemId, () => unknown>> = {
  daggerheart: daggerheartManifest,
};

/**
 * Build the options manifest for a system, or `undefined` if the LLM-author path
 * isn't wired for it yet (the caller then uses deterministic creation).
 */
export function buildOptionsManifest(systemId: GameSystemId): unknown | undefined {
  return MANIFEST_BUILDERS[systemId]?.();
}

/** Whether the LLM-author path is available for a system. */
export function hasOptionsManifest(systemId: GameSystemId): boolean {
  return systemId in MANIFEST_BUILDERS;
}
