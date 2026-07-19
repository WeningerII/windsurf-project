import { daggerheartAncestries } from '../data/daggerheart/1.0/ancestries';
import { daggerheartClasses } from '../data/daggerheart/1.0/classes';
import { getDaggerheartDomainCard } from '../data/daggerheart/1.0/domain-cards';
import { getDaggerheartArmor } from '../data/daggerheart/1.0/equipment/armor';
import { getDaggerheartWeapon } from '../data/daggerheart/1.0/equipment/weapons';
import type {
  DaggerheartAncestry,
  DaggerheartArmor,
  DaggerheartDomainCard,
  DaggerheartPassiveDerivedBonus,
  DaggerheartPassiveBonuses,
  DaggerheartTier,
  DaggerheartTrait,
  DaggerheartWeapon,
} from '../types/daggerheart';
import type { DaggerheartDataModel } from '../systems/daggerheart/data-model';
import { getDaggerheartInventoryDefinition } from './daggerheartInventory';
import { breakpoints } from './derivation';

export type DaggerheartAncestryAdjustments = {
  evasion: number;
  hitPoints: number;
  stress: number;
};

export const DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS: DaggerheartAncestryAdjustments = {
  evasion: 0,
  hitPoints: 0,
  stress: 0,
};

const DAGGERHEART_TRAITS: DaggerheartTrait[] = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
];

const ANCESTRY_ADJUSTMENTS_BY_ID: Record<string, DaggerheartAncestryAdjustments> = {
  giant: { evasion: 0, hitPoints: 1, stress: 0 },
  human: { evasion: 0, hitPoints: 0, stress: 1 },
  simiah: { evasion: 1, hitPoints: 0, stress: 0 },
};

const classByName = Object.fromEntries(daggerheartClasses.map((entry) => [entry.name, entry]));
const ancestryByName = Object.fromEntries(
  daggerheartAncestries.map((entry) => [entry.name, entry])
);

function mergePassiveBonuses(
  total: DaggerheartPassiveBonuses,
  next?: DaggerheartPassiveBonuses
): DaggerheartPassiveBonuses {
  if (!next) {
    return total;
  }

  const mergedAttributes: Partial<Record<DaggerheartTrait, number>> = {
    ...(total.attributes || {}),
  };

  for (const [trait, amount] of Object.entries(next.attributes || {}) as Array<
    [DaggerheartTrait, number]
  >) {
    mergedAttributes[trait] = (mergedAttributes[trait] || 0) + amount;
  }

  return {
    evasion: (total.evasion || 0) + (next.evasion || 0),
    armorScore: (total.armorScore || 0) + (next.armorScore || 0),
    majorThreshold: (total.majorThreshold || 0) + (next.majorThreshold || 0),
    severeThreshold: (total.severeThreshold || 0) + (next.severeThreshold || 0),
    spellcast: (total.spellcast || 0) + (next.spellcast || 0),
    attributes: mergedAttributes,
  };
}

function scalePassiveBonuses(
  bonus: DaggerheartPassiveBonuses | undefined,
  multiplier: number
): DaggerheartPassiveBonuses | undefined {
  if (!bonus || multiplier <= 0) {
    return undefined;
  }

  const scaledAttributes = Object.fromEntries(
    Object.entries(bonus.attributes || {}).map(([trait, amount]) => [trait, amount * multiplier])
  ) as Partial<Record<DaggerheartTrait, number>>;

  return {
    evasion: (bonus.evasion || 0) * multiplier,
    armorScore: (bonus.armorScore || 0) * multiplier,
    majorThreshold: (bonus.majorThreshold || 0) * multiplier,
    severeThreshold: (bonus.severeThreshold || 0) * multiplier,
    spellcast: (bonus.spellcast || 0) * multiplier,
    attributes: scaledAttributes,
  };
}

/** Tier thresholds (Daggerheart SRD: Leveling Up): tier 1 at level 1, 2 at
 * 2–4, 3 at 5–7, 4 at 8–10. */
const DAGGERHEART_TIER_BREAKPOINTS = [
  [2, 2],
  [5, 3],
  [8, 4],
] as const;

export function getDaggerheartTier(level: number): 1 | 2 | 3 | 4 {
  return breakpoints(level, DAGGERHEART_TIER_BREAKPOINTS, 1) as 1 | 2 | 3 | 4;
}

export function getDaggerheartProficiency(level: number): number {
  return getDaggerheartTier(level);
}

/**
 * HP marked by an incoming hit, per Daggerheart damage thresholds:
 * below Major → 1, at/above Major (below Severe) → 2, at/above Severe → 3.
 * Zero or negative damage marks nothing. With the optional Massive Damage rule,
 * damage at or above twice the Severe threshold marks 4 HP instead of 3.
 */
export function getDaggerheartHpMarked(
  damage: number,
  majorThreshold: number,
  severeThreshold: number,
  options?: { massiveDamage?: boolean }
): number {
  if (damage <= 0) return 0;
  if (options?.massiveDamage && damage >= severeThreshold * 2) return 4;
  if (damage >= severeThreshold) return 3;
  if (damage >= majorThreshold) return 2;
  return 1;
}

/**
 * Critical damage: a critical success on an attack adds the maximum possible
 * result of the damage dice (diceCount × dieSize) to the rolled total — the
 * modifier is not multiplied (Daggerheart SRD: Critical Damage).
 */
export function getDaggerheartCriticalDamage(
  rolledTotal: number,
  diceCount: number,
  dieSize: number
): number {
  return rolledTotal + Math.max(0, diceCount) * Math.max(0, dieSize);
}

/**
 * Number of damage dice rolled when an effect deals damage using the Spellcast
 * trait: equal to the Spellcast trait, or none if it is +0 or lower
 * (Daggerheart SRD: Damage Rolls).
 */
export function getDaggerheartSpellcastDamageDiceCount(spellcastTrait: number): number {
  return Math.max(0, spellcastTrait);
}

/**
 * Incoming damage after resistance/immunity, applied before Hit Point
 * Thresholds and before any Armor Slots (Daggerheart SRD: Resistance, Immunity,
 * and Direct Damage). Immunity ignores the damage entirely; resistance halves
 * it (rounded down by convention — the SRD says "by half"); multiple
 * resistances to the same type don't stack.
 */
export function getDaggerheartDamageAfterResistance(
  damage: number,
  options: { resistant?: boolean; immune?: boolean }
): number {
  if (options.immune) return 0;
  const reduced = options.resistant ? Math.floor(damage / 2) : damage;
  return Math.max(0, reduced);
}

/**
 * HP marked after spending Armor Slots: each marked slot reduces the HP marked
 * by one (Daggerheart SRD: Reducing Incoming Damage). A character with Armor
 * Score 0 has no slots to mark, so no reduction applies. Direct damage (which
 * can't be reduced by Armor Slots) should pass 0 slots.
 */
export function getDaggerheartHpMarkedAfterArmor(
  baseHpMarked: number,
  armorSlotsMarked: number,
  armorScore: number
): number {
  if (armorScore <= 0) return baseHpMarked;
  return Math.max(0, baseHpMarked - Math.max(0, Math.floor(armorSlotsMarked)));
}

/**
 * Mechanical outcome of a Daggerheart duality (Hope/Fear) roll: which die is
 * higher determines Hope vs Fear; matched dice are a critical success. (The
 * narrative consequences of Hope/Fear are an accepted manual boundary — see
 * docs/srd-manifest/_exclusions.ts; only this numeric resolution is computed.)
 */
export function getDaggerheartDualityOutcome(
  hopeDie: number,
  fearDie: number
): 'critical' | 'hope' | 'fear' {
  if (hopeDie === fearDie) return 'critical';
  return hopeDie > fearDie ? 'hope' : 'fear';
}

/** Base bonus of an Experience (+2), plus +1 per "increase your Experience"
 * advancement taken on it (Daggerheart SRD: Leveling Up). */
export const DAGGERHEART_EXPERIENCE_BASE_BONUS = 2;
export function getDaggerheartExperienceBonus(increases = 0): number {
  return DAGGERHEART_EXPERIENCE_BASE_BONUS + Math.max(0, Math.floor(increases));
}

/**
 * Trait modifiers assigned across the six traits at character creation, in any
 * order: +2, +1, +1, +0, +0, −1 (Daggerheart SRD: Character Creation — Assign
 * Character Traits). Returned as a fresh array so callers can sort/assign freely.
 */
export function getDaggerheartStartingTraitArray(): number[] {
  return [2, 1, 1, 0, 0, -1];
}

/** Hope a PC starts a new campaign with (Daggerheart SRD: Character Creation). */
export const DAGGERHEART_STARTING_HOPE = 2;

/** Maximum Hope a PC can hold at once (Daggerheart SRD: Hope). */
export const DAGGERHEART_MAX_HOPE = 6;

/**
 * Total gold expressed in handfuls, the base denomination (Daggerheart SRD:
 * Gold) — 10 handfuls make a bag and 10 bags make a chest, so value =
 * handfuls + 10 × bags + 100 × chests. (A character can hold at most 1 chest.)
 */
export function getDaggerheartGoldInHandfuls(
  handfuls: number,
  bags: number,
  chests: number
): number {
  return Math.max(0, handfuls) + 10 * Math.max(0, bags) + 100 * Math.max(0, chests);
}

export type DaggerheartRange = 'melee' | 'very-close' | 'close' | 'far' | 'very-far';

/**
 * Range band converted to battle-map squares under the optional Defined Ranges
 * rule (Daggerheart SRD: Maps, Range, and Movement) — Melee 1, Very Close 3,
 * Close 6, Far 12, Very Far 13+ (one square ≈ 5 feet). Very Far returns its
 * lower bound of 13.
 */
export function getDaggerheartRangeSquares(range: DaggerheartRange): number {
  switch (range) {
    case 'melee':
      return 1;
    case 'very-close':
      return 3;
    case 'close':
      return 6;
    case 'far':
      return 12;
    case 'very-far':
      return 13;
  }
}

/**
 * Hit Points / Stress / Armor Slots cleared by a short-rest downtime move
 * (Tend to Wounds, Clear Stress, Repair Armor): 1d4 + Tier. The caller supplies
 * the d4 roll; the deterministic "+ Tier" is what is verified here
 * (Daggerheart SRD: Downtime). A long rest clears the corresponding track fully.
 */
export function getDaggerheartShortRestRecovery(d4Roll: number, tier: number): number {
  return Math.max(0, Math.floor(d4Roll)) + Math.max(0, Math.floor(tier));
}

/**
 * A character is Vulnerable once their last Stress is marked (current ≥ max),
 * until they clear at least 1 Stress (Daggerheart SRD: Stress).
 */
export function getDaggerheartIsVulnerable(currentStress: number, maxStress: number): boolean {
  return currentStress >= maxStress;
}

/**
 * When a character must mark Stress but their Stress track is full, they mark
 * 1 HP instead (Daggerheart SRD: Stress). Returns the HP that overflow onto the
 * HP track (0 when there is room to mark the Stress).
 */
export function getDaggerheartStressOverflowHp(
  currentStress: number,
  maxStress: number,
  stressToMark: number
): number {
  if (stressToMark <= 0) return 0;
  return currentStress >= maxStress ? 1 : 0;
}

/**
 * Risk It All death move: roll the Duality Dice. Hope higher → stay up and clear
 * HP/Stress equal to the Hope Die; Fear higher → cross through the veil (death);
 * matching dice are a critical success → stay up and clear ALL marked HP and
 * Stress (Daggerheart SRD: Death Moves — Risk It All). The critical branch
 * returns the `'all'` sentinel since the totals to clear depend on the
 * character's current marks.
 */
export function getDaggerheartRiskItAll(
  hopeDie: number,
  fearDie: number
): { survives: boolean; clears: number | 'all' } {
  const outcome = getDaggerheartDualityOutcome(hopeDie, fearDie);
  if (outcome === 'fear') return { survives: false, clears: 0 };
  if (outcome === 'critical') return { survives: true, clears: 'all' };
  return { survives: true, clears: hopeDie };
}

/**
 * Avoid Death death move: after falling unconscious, roll the Hope Die; if its
 * value is at or below the character's level, they gain a scar (cross out a Hope
 * slot) (Daggerheart SRD: Death).
 */
export function getDaggerheartAvoidDeathScar(hopeDie: number, level: number): boolean {
  return hopeDie <= level;
}

export function getDaggerheartAncestryAdjustments(
  ancestry?: Pick<DaggerheartAncestry, 'id'> | null
): DaggerheartAncestryAdjustments {
  if (!ancestry) {
    return DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS;
  }

  return ANCESTRY_ADJUSTMENTS_BY_ID[ancestry.id] || DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS;
}

export function getSelectedDaggerheartClass(system: DaggerheartDataModel) {
  return classByName[system.class];
}

export function getSelectedDaggerheartAncestry(system: DaggerheartDataModel) {
  return ancestryByName[system.heritage];
}

export function getEquippedDaggerheartWeapon(
  system: DaggerheartDataModel,
  slot: 'primary' | 'secondary'
): DaggerheartWeapon | undefined {
  const weaponId = slot === 'primary' ? system.weapons?.primaryId : system.weapons?.secondaryId;
  return weaponId ? getDaggerheartWeapon(weaponId) : undefined;
}

export function getEquippedDaggerheartArmor(
  system: DaggerheartDataModel
): DaggerheartArmor | undefined {
  return system.armorId ? getDaggerheartArmor(system.armorId) : undefined;
}

/** Loadout (non-vault) domain card counts per domain id, used to evaluate
 * loadout-count passive conditions. Shared by derived stats and the
 * contribution ledger so the two can never diverge. */
export function getDaggerheartLoadoutDomainCounts(
  system: DaggerheartDataModel
): Record<string, number> {
  return system.domainCards.reduce(
    (counts, entry) => {
      if (entry.location === 'vault') {
        return counts;
      }

      const definition = getDaggerheartDomainCard(entry.cardId ?? entry.id);
      const domainId = definition?.domain ?? (typeof entry.domain === 'string' ? entry.domain : '');
      if (domainId) {
        counts[domainId] = (counts[domainId] || 0) + 1;
      }

      return counts;
    },
    {} as Record<string, number>
  );
}

/** Passive-automation domain cards currently active: in the loadout with their
 * passive condition satisfied. Shared by derived stats and the contribution
 * ledger. */
export function getDaggerheartActivePassiveDomainCards(
  system: DaggerheartDataModel
): DaggerheartDomainCard[] {
  const loadoutDomainCounts = getDaggerheartLoadoutDomainCounts(system);

  return system.domainCards
    .filter((entry) => entry.location !== 'vault')
    .map((entry) => getDaggerheartDomainCard(entry.cardId ?? entry.id))
    .filter((definition): definition is DaggerheartDomainCard =>
      Boolean(
        definition &&
        definition.automationMode === 'passive' &&
        doesDaggerheartPassiveConditionApply(system, definition, loadoutDomainCounts)
      )
    );
}

function getDaggerheartPassiveDerivedBonuses(
  system: DaggerheartDataModel
): DaggerheartPassiveDerivedBonus[] {
  return getDaggerheartActivePassiveDomainCards(system).flatMap(
    (definition) => definition.passiveDerivedBonuses ?? []
  );
}

export function getDaggerheartPassiveBonuses(
  system: DaggerheartDataModel
): DaggerheartPassiveBonuses {
  const entries = [
    getEquippedDaggerheartWeapon(system, 'primary')?.passiveBonuses,
    getEquippedDaggerheartWeapon(system, 'secondary')?.passiveBonuses,
    getEquippedDaggerheartArmor(system)?.passiveBonuses,
    ...getDaggerheartActivePassiveDomainCards(system).map(
      (definition) => definition.passiveBonuses
    ),
    ...system.inventory.map((entry) =>
      scalePassiveBonuses(
        getDaggerheartInventoryDefinition(entry.itemId)?.passiveBonuses,
        Math.max(1, entry.quantity || 1)
      )
    ),
  ];

  return entries.reduce<DaggerheartPassiveBonuses>(
    (total, entry) => mergePassiveBonuses(total, entry),
    {}
  );
}

/** Whether a passive card's condition (always / while-armored /
 * while-unarmored / loadout-domain-count) is currently satisfied. Shared by
 * derived stats and the contribution ledger. */
export function doesDaggerheartPassiveConditionApply(
  system: DaggerheartDataModel,
  card: Pick<DaggerheartDomainCard, 'passiveCondition'>,
  loadoutDomainCounts: Record<string, number>
) {
  const condition = card.passiveCondition;
  if (!condition || condition.kind === 'always') {
    return true;
  }

  if (condition.kind === 'while-armored') {
    return Boolean(system.armorId);
  }

  if (condition.kind === 'while-unarmored') {
    return !system.armorId;
  }

  return (loadoutDomainCounts[condition.domain] || 0) >= condition.count;
}

export function getDaggerheartEffectiveAttribute(
  system: DaggerheartDataModel,
  trait: DaggerheartTrait
): number {
  const passive = getDaggerheartPassiveBonuses(system).attributes?.[trait] || 0;
  return (system.attributes[trait] || 0) + passive;
}

export function getDaggerheartDerivedStats(system: DaggerheartDataModel) {
  const selectedClass = getSelectedDaggerheartClass(system);
  const selectedAncestry = getSelectedDaggerheartAncestry(system);
  const ancestryAdjustments = getDaggerheartAncestryAdjustments(selectedAncestry);
  const passive = getDaggerheartPassiveBonuses(system);
  const armor = getEquippedDaggerheartArmor(system);
  const tier = getDaggerheartTier(system.level);
  const proficiency = getDaggerheartProficiency(system.level);
  const effectiveAttributes = Object.fromEntries(
    DAGGERHEART_TRAITS.map((trait) => [
      trait,
      (system.attributes[trait] || 0) + (passive.attributes?.[trait] || 0),
    ])
  ) as Record<DaggerheartTrait, number>;
  const passiveDerivedBonuses = getDaggerheartPassiveDerivedBonuses(system);

  const evasionBase = selectedClass
    ? selectedClass.startingEvasion + ancestryAdjustments.evasion
    : system.evasion;
  let evasionBonus = passive.evasion || 0;
  const armorScoreBonus = passive.armorScore || 0;
  const majorThresholdBonus = passive.majorThreshold || 0;
  let severeThresholdBonus = passive.severeThreshold || 0;
  let unarmoredBaseOverride:
    | {
        armorScore: number;
        majorThreshold: number;
        severeThreshold: number;
      }
    | undefined;

  passiveDerivedBonuses.forEach((bonus) => {
    switch (bonus.kind) {
      case 'evasion-half-trait': {
        evasionBonus += Math.max(0, Math.floor((effectiveAttributes[bonus.trait] || 0) / 2));
        break;
      }
      case 'severe-threshold-proficiency': {
        severeThresholdBonus += proficiency;
        break;
      }
      case 'unarmored-defense-by-tier': {
        const thresholds = bonus.thresholdsByTier[tier as DaggerheartTier];
        if (!thresholds) {
          break;
        }

        const candidate = {
          armorScore: bonus.armorScoreBase + (effectiveAttributes[bonus.trait] || 0),
          majorThreshold: thresholds.major,
          severeThreshold: thresholds.severe,
        };
        unarmoredBaseOverride = unarmoredBaseOverride
          ? {
              armorScore: Math.max(unarmoredBaseOverride.armorScore, candidate.armorScore),
              majorThreshold: Math.max(
                unarmoredBaseOverride.majorThreshold,
                candidate.majorThreshold
              ),
              severeThreshold: Math.max(
                unarmoredBaseOverride.severeThreshold,
                candidate.severeThreshold
              ),
            }
          : candidate;
        break;
      }
    }
  });

  const armorScoreBase = armor?.baseArmorScore ?? unarmoredBaseOverride?.armorScore ?? 0;
  const majorBase =
    armor?.baseMajorThreshold != null
      ? armor.baseMajorThreshold + system.level
      : (unarmoredBaseOverride?.majorThreshold ?? system.level);
  const severeBase =
    armor?.baseSevereThreshold != null
      ? armor.baseSevereThreshold + system.level
      : (unarmoredBaseOverride?.severeThreshold ?? system.level * 2);
  const armorMax = Math.max(0, Math.min(12, armorScoreBase + armorScoreBonus));
  const totalPassiveBonuses: DaggerheartPassiveBonuses = {
    ...passive,
    evasion: evasionBonus,
    armorScore: armorScoreBonus,
    majorThreshold: majorThresholdBonus,
    severeThreshold: severeThresholdBonus,
  };

  return {
    evasion: evasionBase + evasionBonus,
    armorScore: armorMax,
    majorThreshold: majorBase + majorThresholdBonus,
    severeThreshold: severeBase + severeThresholdBonus,
    armorMax,
    passiveBonuses: totalPassiveBonuses,
    selectedClass,
    selectedAncestry,
    armor,
  };
}
