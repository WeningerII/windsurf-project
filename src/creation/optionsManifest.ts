import { daggerheartClasses } from '../data/daggerheart/1.0/classes';
import { daggerheartAncestries } from '../data/daggerheart/1.0/ancestries';
import { daggerheartCommunities } from '../data/daggerheart/1.0/communities';
import { allPowers } from '../data/mutants-and-masterminds/3e/powers/aggregations';
import { MAM3E_EXTRA_MODIFIERS, MAM3E_FLAW_MODIFIERS } from '../systems/mam3e/powerMath';
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

function mam3eManifest(): unknown {
  return {
    system: 'mam3e',
    powerLevelRange: [1, 20],
    abilityMethod: {
      kind: 'point-buy',
      budget: '15 × PL power points',
      abilities: ['str', 'sta', 'agi', 'dex', 'fgt', 'int', 'awe', 'pre'],
      costs: {
        ability: '2 points per rank',
        defenseRank:
          '1 point per rank (dodge/parry/fortitude/will; toughness usually from stamina)',
        attack: '1 point per rank (a close Damage power)',
        advantage: '1 point each',
        skill: '1 point per 2 ranks (summed across skills)',
      },
      caps: [
        'Dodge + Toughness ≤ 2 × PL',
        'Parry + Toughness ≤ 2 × PL',
        'Fortitude + Will ≤ 2 × PL',
        'Fighting + close attack (Damage) rank ≤ 2 × PL',
        'each skill bonus (ability + ranks) ≤ PL + 10',
        'total points spent ≤ 15 × PL',
      ],
      note: 'Defenses add to abilities: Dodge=Agility+rank, Parry=Fighting+rank, Fortitude/Toughness=Stamina(+rank), Will=Awareness+rank.',
    },
    note: 'Author a full build via the free-form keys below, OR omit `abilities` to get an auto-built, cap-safe archetype hero (choose `archetype`/`leadAbility`).',
    powers: allPowers.map((power) => ({
      id: power.id,
      name: power.name,
      type: power.type,
      range: power.range,
      cost: power.baseCost,
      perRank: power.perRank,
    })),
    powerModifiers: {
      extras: MAM3E_EXTRA_MODIFIERS.map((modifier) => ({ id: modifier.id, name: modifier.name })),
      flaws: MAM3E_FLAW_MODIFIERS.map((modifier) => ({ id: modifier.id, name: modifier.name })),
    },
    archetypes: [
      { name: 'brawler', focus: 'Strength/Stamina/Fighting — a melee powerhouse' },
      { name: 'skirmisher', focus: 'Agility/Dexterity/Fighting — fast and evasive' },
      { name: 'mastermind', focus: 'Intellect/Awareness/Presence — a cunning leader' },
    ],
    selectionKeys: {
      powerLevel: 'an integer power level within powerLevelRange (default 10)',
      abilities:
        'free-form: object mapping ability ids to integer ranks (e.g. {fgt:8, agi:6, sta:6})',
      defenses:
        'free-form: object of purchased defense ranks {dodge,parry,fortitude,will,toughness}',
      powers:
        'free-form: array of { id (from powers[]), rank, range?, extras?, flaws?, modifierRanks? }',
      advantages: 'free-form: array of advantage names',
      skills: 'free-form: object mapping skill ids to integer ranks',
      archetype: 'auto-build alternative: one of the archetype names',
      leadAbility: 'auto-build alternative: a lead ability id that maps to an archetype',
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
  mam3e: mam3eManifest,
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

/**
 * Which discrete name selections to check against which manifest list, per system.
 * These are the choices the creators resolve by exact name (and silently fall
 * back on) — surfacing a mismatch lets the repair loop tell the model "that name
 * isn't valid; pick one of these" instead of accepting a low-fidelity fallback.
 */
const SELECTION_LINT: Partial<
  Record<GameSystemId, Array<{ key: string; listKey: string; label: string }>>
> = {
  daggerheart: [
    { key: 'class', listKey: 'classes', label: 'class' },
    { key: 'heritage', listKey: 'ancestries', label: 'heritage (ancestry)' },
    { key: 'community', listKey: 'communities', label: 'community' },
  ],
  'dnd-5e-2014': [
    { key: 'class', listKey: 'classes', label: 'class' },
    { key: 'species', listKey: 'species', label: 'species' },
    { key: 'background', listKey: 'backgrounds', label: 'background' },
  ],
  'dnd-5e-2024': [
    { key: 'class', listKey: 'classes', label: 'class' },
    { key: 'species', listKey: 'species', label: 'species' },
    { key: 'background', listKey: 'backgrounds', label: 'background' },
  ],
  pf2e: [
    { key: 'class', listKey: 'classes', label: 'class' },
    { key: 'ancestry', listKey: 'ancestries', label: 'ancestry' },
    { key: 'background', listKey: 'backgrounds', label: 'background' },
  ],
  pf1e: [
    { key: 'class', listKey: 'classes', label: 'class' },
    { key: 'race', listKey: 'races', label: 'race' },
  ],
  'dnd-3.5e': [
    { key: 'class', listKey: 'classes', label: 'class' },
    { key: 'race', listKey: 'races', label: 'race' },
  ],
};

const MAX_LISTED_NAMES = 14;

function nameOf(entry: unknown): string | undefined {
  if (typeof entry === 'string') return entry;
  if (
    entry &&
    typeof entry === 'object' &&
    typeof (entry as { name?: unknown }).name === 'string'
  ) {
    return (entry as { name: string }).name;
  }
  return undefined;
}

/**
 * Report the model's discrete name picks that don't resolve against the manifest
 * (e.g. class "Vigilante" when no such class exists). Each message names the
 * offending value and lists valid options, so a repair round can correct it.
 */
export function lintSelections(
  systemId: GameSystemId,
  manifest: unknown,
  selections: Record<string, unknown>
): string[] {
  const rules = SELECTION_LINT[systemId];
  if (!rules || !manifest || typeof manifest !== 'object') return [];
  const record = manifest as Record<string, unknown>;
  const issues: string[] = [];

  for (const { key, listKey, label } of rules) {
    const value = selections[key];
    if (typeof value !== 'string' || value.trim() === '') continue;
    const list = record[listKey];
    if (!Array.isArray(list)) continue;
    const names = list.map(nameOf).filter((name): name is string => Boolean(name));
    if (names.length === 0) continue;
    if (!names.some((name) => name.toLowerCase() === value.toLowerCase())) {
      const shown = names.slice(0, MAX_LISTED_NAMES).join(', ');
      const suffix = names.length > MAX_LISTED_NAMES ? ', …' : '';
      issues.push(`'${value}' is not a valid ${label}. Choose one of: ${shown}${suffix}.`);
    }
  }
  return issues;
}
