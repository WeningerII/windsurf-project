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

export function getDaggerheartTier(level: number): 1 | 2 | 3 | 4 {
  if (level >= 8) {
    return 4;
  }
  if (level >= 5) {
    return 3;
  }
  if (level >= 2) {
    return 2;
  }
  return 1;
}

export function getDaggerheartProficiency(level: number): number {
  return getDaggerheartTier(level);
}

/**
 * HP marked by an incoming hit, per Daggerheart damage thresholds:
 * below Major → 1, at/above Major (below Severe) → 2, at/above Severe → 3.
 * Zero or negative damage marks nothing.
 */
export function getDaggerheartHpMarked(
  damage: number,
  majorThreshold: number,
  severeThreshold: number
): number {
  if (damage <= 0) return 0;
  if (damage >= severeThreshold) return 3;
  if (damage >= majorThreshold) return 2;
  return 1;
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

function getLoadoutDomainCounts(system: DaggerheartDataModel): Record<string, number> {
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

function getActivePassiveDomainCards(system: DaggerheartDataModel): DaggerheartDomainCard[] {
  const loadoutDomainCounts = getLoadoutDomainCounts(system);

  return system.domainCards
    .filter((entry) => entry.location !== 'vault')
    .map((entry) => getDaggerheartDomainCard(entry.cardId ?? entry.id))
    .filter((definition): definition is DaggerheartDomainCard =>
      Boolean(
        definition &&
        definition.automationMode === 'passive' &&
        doesPassiveConditionApply(system, definition, loadoutDomainCounts)
      )
    );
}

function getDaggerheartPassiveDerivedBonuses(
  system: DaggerheartDataModel
): DaggerheartPassiveDerivedBonus[] {
  return getActivePassiveDomainCards(system).flatMap(
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
    ...getActivePassiveDomainCards(system).map((definition) => definition.passiveBonuses),
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

function doesPassiveConditionApply(
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
