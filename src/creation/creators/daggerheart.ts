import { daggerheartClasses } from '../../data/daggerheart/1.0/classes';
import { daggerheartAncestries } from '../../data/daggerheart/1.0/ancestries';
import { daggerheartCommunities } from '../../data/daggerheart/1.0/communities';
import { daggerheartDomainCardsByDomain } from '../../data/daggerheart/1.0/domain-cards';
import { normalizeDomainId } from '../../systems/daggerheart/daggerheartSheetConstants';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';
import type { DaggerheartClass, DaggerheartTrait } from '../../types/daggerheart';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, SystemCreator } from '../types';

/**
 * Daggerheart creator. Daggerheart construction is selection-driven and the
 * engine derives the rest (HP, Evasion, thresholds) from the chosen class and
 * ancestry, so a complete level-appropriate sheet falls out of: pick
 * class/subclass/heritage/community, assign the fixed level-1 trait array
 * (+2/+1/+1/0/0/-1) with the +2 on the class's signature trait, and seed two
 * starting domain cards from the class's domains.
 */

const MAX_LEVEL = 10;
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
  build(intent: CreationIntent): CreationDraft<DaggerheartDataModel> {
    const cls = pickByKeywordsOrDefault(
      intent.tokens,
      daggerheartClasses,
      (entry) => [entry.name, ...entry.domains],
      daggerheartClasses[0]
    );
    const subclass = cls.subclasses[0];
    const ancestry = pickByKeywordsOrDefault(
      intent.tokens,
      daggerheartAncestries,
      (entry) => [entry.name],
      daggerheartAncestries[0]
    );
    const community = pickByKeywordsOrDefault(
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
    system.attributes = assignTraitArray(cls, intent);
    system.domainCards = startingCards(cls, level);
    system.experiences = startingExperiences(cls, intent);

    const name = intent.name ?? `${ancestry.name} ${cls.name}`;
    return { name, system };
  },
};

/** A short, themed experience for each trait — the +2 trait seeds the first one. */
const TRAIT_EXPERIENCE: Record<DaggerheartTrait, string> = {
  strength: 'Brawler',
  agility: 'Acrobat',
  finesse: 'Burglar',
  instinct: 'Wilderness Tracker',
  presence: 'Silver Tongue',
  knowledge: 'Loremaster',
};

/** Two starting experiences (Daggerheart grants two at +2): trait-themed + general. */
function startingExperiences(cls: DaggerheartClass, intent: CreationIntent): string[] {
  return [TRAIT_EXPERIENCE[leadTrait(cls, intent)], 'Adventurer'];
}

/** Assign the fixed +2/+1/+1/0/0/-1 array, +2 on the class/prompt-led trait. */
function assignTraitArray(
  cls: DaggerheartClass,
  intent: CreationIntent
): DaggerheartDataModel['attributes'] {
  const primary = leadTrait(cls, intent);
  // Order the remaining traits deterministically and lay the array over them.
  const ordered = [primary, ...TRAITS.filter((trait) => trait !== primary)];
  const values = [2, 1, 1, 0, 0, -1];

  return ordered.reduce(
    (result, trait, index) => {
      result[trait] = values[index];
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
      cards.push({
        id: chosen.id,
        cardId: chosen.id,
        name: chosen.name,
        domain: chosen.domain,
        level: chosen.level,
        type: chosen.type,
        recallCost: chosen.recallCost,
        location: 'loadout',
        description: chosen.description,
      });
    }
  }

  return cards;
}
