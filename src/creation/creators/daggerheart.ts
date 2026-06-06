import { daggerheartClasses } from '../../data/daggerheart/1.0/classes';
import { daggerheartAncestries } from '../../data/daggerheart/1.0/ancestries';
import { daggerheartCommunities } from '../../data/daggerheart/1.0/communities';
import { daggerheartDomainCardsByDomain } from '../../data/daggerheart/1.0/domain-cards';
import { normalizeDomainId } from '../../systems/daggerheart/daggerheartSheetConstants';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';
import type {
  DaggerheartClass,
  DaggerheartDomainCard,
  DaggerheartTrait,
} from '../../types/daggerheart';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, ResolvedSelections, SystemCreator } from '../types';

/**
 * Daggerheart creator. Construction is selection-driven and the engine derives
 * the rest (HP, Evasion, thresholds) from the chosen class and ancestry. With no
 * `resolved`, every choice is made deterministically (keyword + class defaults).
 * With `resolved` (the LLM author's pre-sanitized picks), each field is taken
 * from the model when it resolves against the catalog and falls back to the
 * deterministic choice otherwise — so "Batman" can become a stealthy Rogue while
 * a vague prompt still yields a complete, legal sheet.
 */

const MAX_LEVEL = 10;
const LEVEL_ONE_ARRAY = [2, 1, 1, 0, 0, -1];
const MAX_LOADOUT = 5;
const MAX_EXPERIENCES = 2;
const TRAITS: DaggerheartTrait[] = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
];

/** The trait a class leads with (gets the +2). Falls back to agility. */
const CLASS_PRIMARY_TRAIT: Record<string, DaggerheartTrait> = {
  Bard: 'presence',
  Druid: 'instinct',
  Guardian: 'strength',
  Ranger: 'agility',
  Rogue: 'finesse',
  Seraph: 'strength',
  Sorcerer: 'instinct',
  Warrior: 'strength',
  Wizard: 'knowledge',
};

/** Keyword hints that nudge trait choice when the class itself is ambiguous. */
const TRAIT_KEYWORDS: Array<{ trait: DaggerheartTrait; words: string[] }> = [
  { trait: 'strength', words: ['strong', 'mighty', 'brute', 'tank', 'guardian', 'warrior'] },
  { trait: 'agility', words: ['agile', 'quick', 'fast', 'nimble', 'scout', 'ranger'] },
  { trait: 'finesse', words: ['precise', 'sneaky', 'stealthy', 'rogue', 'assassin', 'deft'] },
  { trait: 'instinct', words: ['wild', 'feral', 'perceptive', 'druid', 'beast'] },
  { trait: 'presence', words: ['charming', 'bard', 'leader', 'commanding', 'social'] },
  { trait: 'knowledge', words: ['smart', 'wizard', 'scholar', 'learned', 'arcane', 'clever'] },
];

export const daggerheartCreator: SystemCreator<DaggerheartDataModel> = {
  systemId: 'daggerheart',
  build(
    intent: CreationIntent,
    resolved?: ResolvedSelections
  ): CreationDraft<DaggerheartDataModel> {
    const cls =
      byName(daggerheartClasses, asString(resolved?.class)) ??
      pickByKeywordsOrDefault(
        intent.tokens,
        daggerheartClasses,
        (entry) => [entry.name, ...entry.domains],
        daggerheartClasses[0]
      );
    const subclass =
      cls.subclasses.find((entry) => matchesName(entry.name, asString(resolved?.subclass))) ??
      cls.subclasses[0];
    const ancestry =
      byName(daggerheartAncestries, asString(resolved?.heritage)) ??
      pickByKeywordsOrDefault(
        intent.tokens,
        daggerheartAncestries,
        (entry) => [entry.name],
        daggerheartAncestries[0]
      );
    const community =
      byName(daggerheartCommunities, asString(resolved?.community)) ??
      pickByKeywordsOrDefault(
        intent.tokens,
        daggerheartCommunities,
        (entry) => [entry.name],
        daggerheartCommunities[0]
      );

    const level = Math.min(MAX_LEVEL, intent.level);

    const system = createDefaultDaggerheartData();
    system.level = level;
    system.class = cls.name;
    system.subclass = subclass.name;
    system.heritage = ancestry.name;
    system.community = community.name;
    system.attributes = resolveTraits(cls, intent, resolved) ?? assignTraitArray(cls, intent);
    system.domainCards = resolveCards(cls, level, resolved) ?? startingCards(cls, level);
    system.experiences = resolveExperiences(resolved) ?? startingExperiences(cls, intent);

    const name = intent.name ?? `${ancestry.name} ${cls.name}`;
    return { name, system };
  },
};

// --- LLM-resolution helpers (return undefined → caller uses the deterministic path) ---

function resolveTraits(
  cls: DaggerheartClass,
  intent: CreationIntent,
  resolved?: ResolvedSelections
): DaggerheartDataModel['attributes'] | undefined {
  const raw = resolved?.traits;
  if (!raw || typeof raw !== 'object') return undefined;
  const source = raw as Record<string, unknown>;

  const attributes = {} as DaggerheartDataModel['attributes'];
  for (const trait of TRAITS) {
    const value = source[trait];
    if (typeof value !== 'number' || !Number.isInteger(value)) return undefined;
    attributes[trait] = value;
  }
  // Must be exactly the level-1 array (any ordering) to be legal.
  const sorted = TRAITS.map((trait) => attributes[trait]).sort((a, b) => b - a);
  if (!sorted.every((value, index) => value === LEVEL_ONE_ARRAY[index])) return undefined;
  void cls;
  void intent;
  return attributes;
}

function resolveCards(
  cls: DaggerheartClass,
  level: number,
  resolved?: ResolvedSelections
): DaggerheartDataModel['domainCards'] | undefined {
  const names = asStringArray(resolved?.domainCards);
  if (!names || names.length === 0) return undefined;

  const pool = cls.domains.flatMap(
    (domain) => daggerheartDomainCardsByDomain[normalizeDomainId(domain)] ?? []
  );
  const chosen: DaggerheartDataModel['domainCards'] = [];
  const used = new Set<string>();
  for (const name of names) {
    if (chosen.length >= MAX_LOADOUT) break;
    const card = pool.find((entry) => matchesName(entry.name, name) && entry.level <= level);
    if (card && !used.has(card.id)) {
      used.add(card.id);
      chosen.push(toCardEntry(card));
    }
  }
  return chosen.length > 0 ? chosen : undefined;
}

function resolveExperiences(resolved?: ResolvedSelections): string[] | undefined {
  const values = asStringArray(resolved?.experiences);
  if (!values || values.length === 0) return undefined;
  return values.slice(0, MAX_EXPERIENCES).map((value) => value.slice(0, 60));
}

// --- Deterministic helpers (the fallback path) ---

/** A short, themed experience for each trait — the +2 trait seeds the first one. */
const TRAIT_EXPERIENCE: Record<DaggerheartTrait, string> = {
  strength: 'Brawler',
  agility: 'Acrobat',
  finesse: 'Burglar',
  instinct: 'Wilderness Tracker',
  presence: 'Silver Tongue',
  knowledge: 'Loremaster',
};

function startingExperiences(cls: DaggerheartClass, intent: CreationIntent): string[] {
  return [TRAIT_EXPERIENCE[leadTrait(cls, intent)], 'Adventurer'];
}

/** Assign the fixed +2/+1/+1/0/0/-1 array, +2 on the class/prompt-led trait. */
function assignTraitArray(
  cls: DaggerheartClass,
  intent: CreationIntent
): DaggerheartDataModel['attributes'] {
  const primary = leadTrait(cls, intent);
  const ordered = [primary, ...TRAITS.filter((trait) => trait !== primary)];
  return ordered.reduce(
    (result, trait, index) => {
      result[trait] = LEVEL_ONE_ARRAY[index];
      return result;
    },
    {} as DaggerheartDataModel['attributes']
  );
}

function leadTrait(cls: DaggerheartClass, intent: CreationIntent): DaggerheartTrait {
  const tokenSet = new Set(intent.tokens);
  for (const { trait, words } of TRAIT_KEYWORDS) {
    if (words.some((word) => tokenSet.has(word))) {
      return trait;
    }
  }
  return CLASS_PRIMARY_TRAIT[cls.name] ?? 'agility';
}

/** Two starting cards: the lowest-level card available from each class domain. */
function startingCards(cls: DaggerheartClass, level: number): DaggerheartDataModel['domainCards'] {
  const cards: DaggerheartDataModel['domainCards'] = [];
  for (const domain of cls.domains) {
    const domainId = normalizeDomainId(domain);
    const available = (daggerheartDomainCardsByDomain[domainId] ?? [])
      .filter((card) => card.level <= level)
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    const chosen = available[0];
    if (chosen) {
      cards.push(toCardEntry(chosen));
    }
  }
  return cards;
}

function toCardEntry(card: DaggerheartDomainCard): DaggerheartDataModel['domainCards'][number] {
  return {
    id: card.id,
    cardId: card.id,
    name: card.name,
    domain: card.domain,
    level: card.level,
    type: card.type,
    recallCost: card.recallCost,
    location: 'loadout',
    description: card.description,
  };
}

// --- Small value/lookup utilities ---

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((entry): entry is string => typeof entry === 'string');
  return strings.length > 0 ? strings : undefined;
}

function matchesName(candidate: string, value: string | undefined): boolean {
  return value !== undefined && candidate.toLowerCase() === value.toLowerCase();
}

function byName<T extends { name: string }>(list: T[], value: string | undefined): T | undefined {
  if (value === undefined) return undefined;
  return list.find((entry) => matchesName(entry.name, value));
}
