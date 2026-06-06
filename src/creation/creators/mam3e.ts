import { allPowers, powerById } from '../../data/mutants-and-masterminds/3e/powers/aggregations';
import {
  mam3eAdvantages,
  mam3eAdvantagesById,
} from '../../data/mutants-and-masterminds/3e/advantages';
import { MAM3E_MODIFIER_BY_ID } from '../../systems/mam3e/powerMath';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { Power, PowerRange } from '../../types/mam/powers';
import type { CreationDraft, CreationIntent, ResolvedSelections, SystemCreator } from '../types';

const POWER_RANGES: readonly PowerRange[] = ['personal', 'close', 'ranged', 'perception'];

/**
 * Mutants & Masterminds 3e creator.
 *
 * M&M is point-buy with tight caps (every trait pairing ≤ 2 × PL) on a 15 × PL
 * budget. Two authoring modes:
 *
 *  - FREE-FORM (the model authored `abilities`): build exactly what the model
 *    specified — abilities, defense ranks, any number of powers (each with rank,
 *    range, and extras/flaws), advantages, and skills — and let the validator
 *    judge it. Over-budget or cap-breaking builds
 *    surface as validator errors, which the orchestrator's validate-and-repair
 *    loop feeds back so the model fixes them; if repair never lands a legal
 *    build, the orchestrator falls back to the deterministic build below.
 *  - DETERMINISTIC (no authored abilities): a PL-scaled archetype that is always
 *    inside every cap and under budget. Steered by Power Level + archetype.
 */

const DEFAULT_PL = 10;
const MIN_PL = 1;
const MAX_PL = 20;
const STANDARD_PP_PER_PL = 15;
/** Signature combat advantages for the deterministic build; filtered against the catalog. */
const PREFERRED_ADVANTAGE_IDS = ['all-out-attack', 'power-attack', 'improved-initiative'];

const MAM_ABILITIES = ['str', 'sta', 'agi', 'dex', 'fgt', 'int', 'awe', 'pre'] as const;

type Archetype = 'brawler' | 'skirmisher' | 'mastermind';
const ARCHETYPES: readonly Archetype[] = ['brawler', 'skirmisher', 'mastermind'];
const LEAD_ABILITY_ARCHETYPE: Record<string, Archetype> = {
  str: 'brawler',
  sta: 'brawler',
  fgt: 'brawler',
  agi: 'skirmisher',
  dex: 'skirmisher',
  int: 'mastermind',
  awe: 'mastermind',
  pre: 'mastermind',
};

export const mam3eCreator: SystemCreator<Mam3eDataModel> = {
  systemId: 'mam3e',
  build(intent: CreationIntent, resolved?: ResolvedSelections): CreationDraft<Mam3eDataModel> {
    const pl = resolvePowerLevel(intent, resolved);
    const system = createDefaultMam3eData();
    system.powerLevel = pl;
    system.powerPoints.total = pl * STANDARD_PP_PER_PL;

    // Author picks that don't resolve against the catalog are collected here and
    // surfaced to the repair loop instead of being silently dropped.
    const unresolved: string[] = [];

    const authored = resolveAbilities(resolved);
    if (authored) {
      // Free-form, model-authored build — the validator judges and the loop repairs.
      system.abilities = authored;
      system.defenses = resolveDefenses(resolved);
      system.powers = resolvePowers(resolved, unresolved);
      system.advantages = resolveAdvantages(resolved, unresolved) ?? [];
      system.skills = resolveSkills(resolved) ?? {};
    } else {
      // Deterministic, cap-safe archetype build.
      const half = Math.floor(pl / 2);
      const archetype = resolveArchetype(resolved);
      system.abilities = abilitiesFor(archetype, half);
      system.defenses = {
        dodge: { rank: half, total: 0 },
        parry: { rank: half, total: 0 },
        fortitude: { rank: half, total: 0 },
        toughness: { rank: 0, total: 0 },
        will: { rank: half, total: 0 },
      };
      const damage = powerById['damage'];
      system.powers = damage ? [{ ...damage, rank: Math.max(1, half) }] : [];
      system.advantages = startingAdvantages();
      system.skills = {
        perception: { rank: 2, total: 0 },
        intimidation: { rank: half, total: 0 },
      };
    }

    const name = intent.name ?? 'New Hero';
    return { name, system, unresolved: unresolved.length ? unresolved : undefined };
  },
};

// --- Free-form resolution (undefined → not authored → deterministic build) ---

function resolveAbilities(resolved?: ResolvedSelections): Mam3eDataModel['abilities'] | undefined {
  const raw = resolved?.abilities;
  if (!raw || typeof raw !== 'object') return undefined;
  const source = raw as Record<string, unknown>;

  const abilities = {} as Mam3eDataModel['abilities'];
  let authored = false;
  for (const ability of MAM_ABILITIES) {
    const value = source[ability];
    if (typeof value === 'number' && Number.isInteger(value)) {
      abilities[ability] = value;
      authored = true;
    } else {
      abilities[ability] = 0;
    }
  }
  return authored ? abilities : undefined;
}

function resolveDefenses(resolved?: ResolvedSelections): Mam3eDataModel['defenses'] {
  const raw = (resolved?.defenses ?? {}) as Record<string, unknown>;
  const rankOf = (key: string): number => {
    const value = raw[key];
    return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0;
  };
  return {
    dodge: { rank: rankOf('dodge'), total: 0 },
    parry: { rank: rankOf('parry'), total: 0 },
    fortitude: { rank: rankOf('fortitude'), total: 0 },
    toughness: { rank: rankOf('toughness'), total: 0 },
    will: { rank: rankOf('will'), total: 0 },
  };
}

/**
 * Resolve a full array of model-authored powers against the M&M catalog. Each
 * entry names a base power (by id or name) and may set rank, range, and
 * extras/flaws/modifier ranks (filtered to real modifiers). Power-point cost and
 * the PL effect-rank caps are computed by the engine and judged by the validator,
 * so the loop repairs any over-budget or cap-breaking power suite.
 */
function resolvePowers(resolved: ResolvedSelections | undefined, unresolved: string[]): Power[] {
  const raw = resolved?.powers;
  if (!Array.isArray(raw)) return [];

  const powers: Power[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const fields = entry as Record<string, unknown>;
    const base = resolvePowerBase(fields.id, fields.name);
    if (!base) {
      const label = asString(fields.id) ?? asString(fields.name);
      if (label) unresolved.push(`power "${label}" isn't in the M&M power catalog.`);
      continue;
    }

    const power: Power = { ...base };
    const rank = fields.rank;
    power.rank =
      typeof rank === 'number' && Number.isInteger(rank) && rank >= 1 ? rank : (base.rank ?? 1);
    if (
      typeof fields.range === 'string' &&
      (POWER_RANGES as readonly string[]).includes(fields.range)
    ) {
      power.range = fields.range as PowerRange;
    }
    const extras = filterModifierIds(fields.extras, 'extra');
    const flaws = filterModifierIds(fields.flaws, 'flaw');
    if (extras.length > 0) power.extras = extras;
    if (flaws.length > 0) power.flaws = flaws;
    const modifierRanks = filterModifierRanks(fields.modifierRanks);
    if (modifierRanks) power.modifierRanks = modifierRanks;

    powers.push(power);
  }
  return powers;
}

function resolvePowerBase(id: unknown, name: unknown): Power | undefined {
  if (typeof id === 'string' && powerById[id]) return powerById[id];
  if (typeof name === 'string') {
    const lower = name.toLowerCase();
    return allPowers.find((power) => power.name.toLowerCase() === lower || power.id === lower);
  }
  return undefined;
}

function filterModifierIds(value: unknown, type: 'extra' | 'flaw'): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (id): id is string => typeof id === 'string' && MAM3E_MODIFIER_BY_ID.get(id)?.type === type
  );
}

function filterModifierRanks(value: unknown): Record<string, number> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const result: Record<string, number> = {};
  for (const [id, rank] of Object.entries(value as Record<string, unknown>)) {
    if (
      MAM3E_MODIFIER_BY_ID.has(id) &&
      typeof rank === 'number' &&
      Number.isInteger(rank) &&
      rank >= 1
    ) {
      result[id] = rank;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function resolveAdvantages(
  resolved: ResolvedSelections | undefined,
  unresolved: string[]
): Mam3eDataModel['advantages'] | undefined {
  const names = asStringArray(resolved?.advantages);
  if (!names) return undefined;
  const result: Mam3eDataModel['advantages'] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const advantage = mam3eAdvantagesById[name] ?? findAdvantageByName(name);
    if (!advantage) {
      unresolved.push(`advantage "${name}" isn't in the M&M advantage catalog.`);
      continue;
    }
    if (!seen.has(advantage.id)) {
      seen.add(advantage.id);
      result.push({ id: advantage.id, name: advantage.name });
    }
  }
  return result;
}

function resolveSkills(resolved?: ResolvedSelections): Mam3eDataModel['skills'] | undefined {
  const raw = resolved?.skills;
  if (!raw || typeof raw !== 'object') return undefined;
  const result: Mam3eDataModel['skills'] = {};
  for (const [skillId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
      result[skillId] = { rank: value, total: 0 };
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

// --- Deterministic archetype build (the fallback path) ---

function abilitiesFor(archetype: Archetype, half: number): Mam3eDataModel['abilities'] {
  switch (archetype) {
    case 'skirmisher':
      return { str: 2, sta: half, agi: half, dex: half, fgt: half, int: 0, awe: 2, pre: 0 };
    case 'mastermind':
      return { str: 0, sta: half, agi: 2, dex: 0, fgt: 2, int: half, awe: half, pre: half };
    case 'brawler':
    default:
      return { str: half, sta: half, agi: 2, dex: 0, fgt: half, int: 0, awe: 2, pre: 0 };
  }
}

function resolveArchetype(resolved?: ResolvedSelections): Archetype {
  const explicit = asString(resolved?.archetype)?.toLowerCase();
  if (explicit && (ARCHETYPES as readonly string[]).includes(explicit)) {
    return explicit as Archetype;
  }
  const lead = asString(resolved?.leadAbility)?.toLowerCase();
  if (lead && LEAD_ABILITY_ARCHETYPE[lead]) {
    return LEAD_ABILITY_ARCHETYPE[lead];
  }
  return 'brawler';
}

function startingAdvantages(): Mam3eDataModel['advantages'] {
  return PREFERRED_ADVANTAGE_IDS.map((id) => mam3eAdvantagesById[id])
    .filter((advantage): advantage is NonNullable<typeof advantage> => Boolean(advantage))
    .map((advantage) => ({ id: advantage.id, name: advantage.name }));
}

// --- Shared helpers ---

function findAdvantageByName(name: string): (typeof mam3eAdvantages)[number] | undefined {
  const lower = name.toLowerCase();
  return mam3eAdvantages.find(
    (advantage) => advantage.name.toLowerCase() === lower || advantage.id === lower
  );
}

function resolvePowerLevel(intent: CreationIntent, resolved?: ResolvedSelections): number {
  const authored = resolved?.powerLevel;
  if (typeof authored === 'number' && Number.isFinite(authored)) {
    return clampPowerLevel(authored);
  }
  const explicit = intent.prompt.toLowerCase().match(/\b(?:pl|power\s*level)\s*(\d{1,2})\b/);
  if (explicit) {
    return clampPowerLevel(Number.parseInt(explicit[1], 10));
  }
  if (intent.level > 1) {
    return clampPowerLevel(intent.level);
  }
  return DEFAULT_PL;
}

function clampPowerLevel(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PL;
  return Math.min(MAX_PL, Math.max(MIN_PL, Math.floor(value)));
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((entry): entry is string => typeof entry === 'string');
  return strings.length > 0 ? strings : undefined;
}
