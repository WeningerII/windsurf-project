import { powerById } from '../../data/mutants-and-masterminds/3e/powers/aggregations';
import { mam3eAdvantagesById } from '../../data/mutants-and-masterminds/3e/advantages';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { CreationDraft, CreationIntent, ResolvedSelections, SystemCreator } from '../types';

/**
 * Mutants & Masterminds 3e creator. M&M has no levels — the axis is Power Level,
 * which sets both the trait caps (2 × PL) and the build budget (15 × PL). M&M's
 * caps are too tight for safe free-form one-shot authoring, so the LLM steers the
 * legal dials — name, Power Level, and an archetype — and the creator lays a
 * PL-scaled build for that archetype that stays comfortably inside every cap and
 * well under budget. With no `resolved` it reads the PL from the prompt and
 * defaults to a melee bruiser.
 */

const DEFAULT_PL = 10;
const MIN_PL = 1;
const MAX_PL = 20;
const STANDARD_PP_PER_PL = 15;
/** Signature combat advantages; filtered against the catalog. */
const PREFERRED_ADVANTAGE_IDS = ['all-out-attack', 'power-attack', 'improved-initiative'];

type Archetype = 'brawler' | 'skirmisher' | 'mastermind';
const ARCHETYPES: readonly Archetype[] = ['brawler', 'skirmisher', 'mastermind'];
/** Maps a lead ability to the archetype it best fits. */
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
    // Half-PL anchors the build: traits/defenses sit at ~PL/2 so combined caps
    // (2 × PL) are met with margin, and the point total stays well under 15 × PL.
    const half = Math.floor(pl / 2);
    const attackRank = Math.max(1, half);
    const archetype = resolveArchetype(resolved);

    const system = createDefaultMam3eData();
    system.powerLevel = pl;
    system.powerPoints.total = pl * STANDARD_PP_PER_PL;
    system.abilities = abilitiesFor(archetype, half);

    system.defenses = {
      dodge: { rank: half, total: 0 },
      parry: { rank: half, total: 0 },
      fortitude: { rank: half, total: 0 },
      toughness: { rank: 0, total: 0 }, // Toughness comes from Stamina, charged there.
      will: { rank: half, total: 0 },
    };

    const damage = powerById['damage'];
    if (damage) {
      system.powers = [{ ...damage, rank: attackRank }];
    }

    system.advantages = startingAdvantages();

    system.skills = {
      perception: { rank: 2, total: 0 },
      intimidation: { rank: half, total: 0 },
    };

    const name = intent.name ?? 'New Hero';
    return { name, system };
  },
};

/**
 * Ability spread per archetype, scaled to half-PL. Stamina stays at half in every
 * build (Toughness/Fortitude); the archetype's three signature abilities sit at
 * half and the rest stay low, keeping every combined PL cap satisfied with margin.
 */
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

/** Resolve the preferred advantage ids against the catalog (unranked, 1 PP each). */
function startingAdvantages(): Mam3eDataModel['advantages'] {
  return PREFERRED_ADVANTAGE_IDS.map((id) => mam3eAdvantagesById[id])
    .filter((advantage): advantage is NonNullable<typeof advantage> => Boolean(advantage))
    .map((advantage) => ({ id: advantage.id, name: advantage.name }));
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
  // "level N" in the prompt maps to PL; otherwise use the standard starting PL.
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
