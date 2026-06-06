import { powerById } from '../../data/mutants-and-masterminds/3e/powers/aggregations';
import {
  mam3eAdvantages,
  mam3eAdvantagesById,
} from '../../data/mutants-and-masterminds/3e/advantages';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { Power } from '../../types/mam/powers';
import type { CreationDraft, CreationIntent, ResolvedSelections, SystemCreator } from '../types';

/**
 * Mutants & Masterminds 3e creator.
 *
 * M&M is point-buy with tight caps (every trait pairing ≤ 2 × PL) on a 15 × PL
 * budget. Two authoring modes:
 *
 *  - FREE-FORM (the model authored `abilities`): build exactly what the model
 *    specified — abilities, defense ranks, a close Damage power, advantages,
 *    skills — and let the validator judge it. Over-budget or cap-breaking builds
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

    const authored = resolveAbilities(resolved);
    if (authored) {
      // Free-form, model-authored build — the validator judges and the loop repairs.
      system.abilities = authored;
      system.defenses = resolveDefenses(resolved);
      const power = resolveAttack(resolved);
      system.powers = power ? [power] : [];
      system.advantages = resolveAdvantages(resolved) ?? [];
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
    return { name, system };
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

/** A close Damage power at the authored rank (the validator caps Fighting + rank). */
function resolveAttack(resolved?: ResolvedSelections): Power | undefined {
  const raw = resolved?.attack;
  if (!raw || typeof raw !== 'object') return undefined;
  const rank = (raw as Record<string, unknown>).rank;
  const damage = powerById['damage'];
  if (!damage || typeof rank !== 'number' || !Number.isInteger(rank) || rank < 1) return undefined;
  return { ...damage, rank };
}

function resolveAdvantages(
  resolved?: ResolvedSelections
): Mam3eDataModel['advantages'] | undefined {
  const names = asStringArray(resolved?.advantages);
  if (!names) return undefined;
  const result: Mam3eDataModel['advantages'] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const advantage = mam3eAdvantagesById[name] ?? findAdvantageByName(name);
    if (advantage && !seen.has(advantage.id)) {
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
