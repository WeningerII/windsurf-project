import { daggerheartClasses } from '../data/daggerheart/1.0/classes';
import { daggerheartAncestries } from '../data/daggerheart/1.0/ancestries';
import { daggerheartCommunities } from '../data/daggerheart/1.0/communities';
import { LOADOUT_LIMIT } from '../systems/daggerheart/daggerheartSheetConstants';
import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadBackgroundsForSystem,
  loadPf2eBackgroundsForSystem,
} from '../utils/dataLoader';
import type { GameSystemId } from '../types/game-systems';

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const D20_ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

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

async function dnd5eManifest(systemId: GameSystemId): Promise<unknown> {
  const [classes, species, backgrounds] = await Promise.all([
    loadClassesForSystem(systemId),
    loadSpeciesForSystem(systemId),
    loadBackgroundsForSystem(systemId),
  ]);
  return {
    system: systemId,
    levelRange: [1, 20],
    abilityMethod: {
      kind: 'standard-array',
      array: STANDARD_ARRAY,
      abilities: D20_ABILITIES,
      note: 'Assign each array value to exactly one ability (before racial bonuses).',
    },
    classes: classes.map((entry) => ({
      name: entry.name,
      primaryAbility: entry.primaryAbility,
      caster: Boolean(entry.spellcasting),
    })),
    species: species.map((entry) => entry.name),
    backgrounds: backgrounds.map((entry) => entry.name),
    selectionKeys: {
      class: 'a class name from classes[].name',
      species: 'a species name from species[]',
      background: 'a background name from backgrounds[]',
      abilities: 'object mapping each ability (str/dex/con/int/wis/cha) to one array value',
      spells:
        'for caster classes only: an array of spell names this class can learn at this level (cantrips + low level)',
    },
  };
}

async function pf2eManifest(): Promise<unknown> {
  const [classes, ancestries, backgrounds] = await Promise.all([
    loadClassesForSystem('pf2e'),
    loadSpeciesForSystem('pf2e'),
    loadPf2eBackgroundsForSystem('pf2e'),
  ]);
  return {
    system: 'pf2e',
    levelRange: [1, 20],
    abilityMethod: {
      kind: 'boosts',
      abilities: D20_ABILITIES,
      note: 'Ancestry, background, and class boosts apply automatically; you also choose four free boosts to four different abilities (+2 each, capped at 18 at level 1).',
    },
    classes: classes.map((entry) => ({ name: entry.name, keyAbility: entry.primaryAbility })),
    ancestries: ancestries.map((entry) => ({
      name: entry.name,
      heritages: (entry.subraces ?? []).map((subrace) => subrace.name),
    })),
    backgrounds: backgrounds.map((entry) => entry.name),
    selectionKeys: {
      class: 'a class name from classes[].name',
      ancestry: 'an ancestry name from ancestries[].name',
      heritage: 'a heritage name from the chosen ancestry.heritages[]',
      background: 'a background name from backgrounds[]',
      freeBoosts: 'array of 4 ability ids (str/dex/con/int/wis/cha) for the free boosts',
    },
  };
}

async function d20LegacyManifest(systemId: GameSystemId): Promise<unknown> {
  const [classes, species] = await Promise.all([
    loadClassesForSystem(systemId),
    loadSpeciesForSystem(systemId),
  ]);
  return {
    system: systemId,
    levelRange: [1, 20],
    abilityMethod: {
      kind: 'standard-array',
      array: STANDARD_ARRAY,
      abilities: D20_ABILITIES,
      note: 'Assign each array value to exactly one ability (before racial adjustments).',
    },
    classes: classes.map((entry) => ({ name: entry.name, primaryAbility: entry.primaryAbility })),
    races: species.map((entry) => entry.name),
    selectionKeys: {
      class: 'a class name from classes[].name',
      race: 'a race name from races[]',
      abilities: 'object mapping each ability (str/dex/con/int/wis/cha) to one array value',
    },
  };
}

const MANIFEST_BUILDERS: Partial<Record<GameSystemId, () => unknown | Promise<unknown>>> = {
  daggerheart: daggerheartManifest,
  'dnd-5e-2014': () => dnd5eManifest('dnd-5e-2014'),
  'dnd-5e-2024': () => dnd5eManifest('dnd-5e-2024'),
  pf2e: pf2eManifest,
  pf1e: () => d20LegacyManifest('pf1e'),
  'dnd-3.5e': () => d20LegacyManifest('dnd-3.5e'),
};

/**
 * Build the options manifest for a system, or `undefined` if the LLM-author path
 * isn't wired for it yet (the caller then uses deterministic creation). Async so
 * loader-backed systems can pull their catalogs.
 */
export async function buildOptionsManifest(systemId: GameSystemId): Promise<unknown | undefined> {
  const builder = MANIFEST_BUILDERS[systemId];
  return builder ? builder() : undefined;
}

/** Whether the LLM-author path is available for a system. */
export function hasOptionsManifest(systemId: GameSystemId): boolean {
  return systemId in MANIFEST_BUILDERS;
}
