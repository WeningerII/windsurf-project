import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Mam3eConditionTrack, Mam3eDataModel } from './data-model';
import { calculatePowerPointCost, getPowerRank } from './powerMath';

/** Skill → Ability mapping for M&M 3e */
const SKILL_ABILITY_MAP: Record<string, string> = {
  acrobatics: 'agi',
  athletics: 'str',
  'close-combat': 'fgt',
  deception: 'pre',
  expertise: 'int',
  insight: 'awe',
  intimidation: 'pre',
  investigation: 'int',
  perception: 'awe',
  persuasion: 'pre',
  'ranged-combat': 'dex',
  'sleight-of-hand': 'dex',
  stealth: 'agi',
  technology: 'int',
  treatment: 'int',
  vehicles: 'dex',
};

function normalizeConditionTrack(track?: Partial<Mam3eConditionTrack>): Mam3eConditionTrack {
  return {
    bruised: Math.max(0, Math.floor(track?.bruised ?? 0)),
    dazed: Boolean(track?.dazed),
    staggered: Boolean(track?.staggered),
    incapacitated: Boolean(track?.incapacitated),
  };
}

/**
 * M&M 3e Toughness failure effects (Hero's Handbook p.191)
 * 1-4: Bruised
 * 5-9: Bruised + Dazed (or Staggered if already Dazed)
 * 10-14: Bruised + Staggered
 * 15+: Incapacitated
 */
function applyToughnessFailure(
  track: Mam3eConditionTrack,
  failureMargin: number
): Mam3eConditionTrack {
  const next = { ...track };
  if (failureMargin <= 0) return next;

  if (failureMargin >= 15) {
    next.incapacitated = true;
    return next;
  }

  if (failureMargin >= 10) {
    next.bruised += 1;
    next.staggered = true;
    return next;
  }

  if (failureMargin >= 5) {
    next.bruised += 1;
    if (next.dazed) {
      next.staggered = true;
    }
    next.dazed = true;
    return next;
  }

  next.bruised += 1;
  return next;
}

/**
 * M&M 3e Logic Engine
 * Handles Point Buy calculations and PL limits.
 */
export class Mam3eEngine implements SystemEngine<Mam3eDataModel> {
  prepareData(document: CharacterDocument<Mam3eDataModel>): CharacterDocument<Mam3eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        powerPoints: {
          ...document.system.powerPoints,
          spent: { ...document.system.powerPoints.spent },
        },
        defenses: {
          dodge: { ...document.system.defenses.dodge },
          parry: { ...document.system.defenses.parry },
          fortitude: { ...document.system.defenses.fortitude },
          toughness: { ...document.system.defenses.toughness },
          will: { ...document.system.defenses.will },
        },
        skills: { ...document.system.skills },
      },
    };
    const data = clonedDoc.system;
    data.conditionTrack = normalizeConditionTrack(data.conditionTrack);

    // 1. Calculate Ability Costs (2 PP per rank)
    let abilityCost = 0;
    Object.values(data.abilities).forEach((rank) => {
      abilityCost += rank * 2;
    });
    data.powerPoints.spent.abilities = abilityCost;

    // 2. Calculate Defense Totals & Costs
    // Defense Base = Ability + Purchased Rank
    // Dodge (Agi), Parry (Fgt), Fort (Sta), Will (Awe), Toughness (Sta + Powers)
    data.defenses.dodge.total = data.abilities.agi + data.defenses.dodge.rank;
    data.defenses.parry.total = data.abilities.fgt + data.defenses.parry.rank;
    data.defenses.fortitude.total = data.abilities.sta + data.defenses.fortitude.rank;
    data.defenses.will.total = data.abilities.awe + data.defenses.will.rank;
    data.defenses.toughness.total = data.abilities.sta + data.defenses.toughness.rank;

    // Add power contributions to defenses (Protection, Enhanced Trait, etc.)
    data.powers.forEach((power) => {
      const rank = getPowerRank(power);
      if (power.id === 'protection' || power.id === 'force-field') {
        data.defenses.toughness.total += rank;
      } else if (power.id === 'enhanced-trait' && power.descriptors) {
        for (const descriptor of power.descriptors) {
          if (descriptor in data.defenses) {
            data.defenses[descriptor as keyof typeof data.defenses].total += rank;
          }
        }
      }
    });

    // Each defense rank costs 1 PP. By M&M 3e RAW, Toughness improves only via
    // Stamina, the Protection effect, or the Defensive Roll advantage (all
    // accounted for elsewhere: Stamina is free, Protection is charged as a
    // power, Defensive Roll as an advantage). But the sheet exposes a direct
    // Toughness rank input that adds to the total, so any rank entered there
    // must be charged too — otherwise it grants a free defense.
    const defenseRankCost =
      data.defenses.dodge.rank +
      data.defenses.parry.rank +
      data.defenses.fortitude.rank +
      data.defenses.toughness.rank +
      data.defenses.will.rank;

    data.powerPoints.spent.defenses = defenseRankCost;

    // 3. Power Costs
    let powerCost = 0;
    data.powers.forEach((power) => {
      powerCost += calculatePowerPointCost(power);
    });
    data.powerPoints.spent.powers = powerCost;

    // 4. Advantage Costs (1 PP per advantage; ranked advantages cost rank PP, minimum 1)
    let advantageCost = 0;
    data.advantages.forEach((adv) => {
      advantageCost += adv.rank != null && adv.rank > 0 ? adv.rank : 1;
    });
    data.powerPoints.spent.advantages = advantageCost;

    // 5. Skill Costs (1 PP per 2 ranks, total ranks across all skills)
    let totalSkillRanks = 0;
    Object.entries(data.skills).forEach(([skillId, skill]) => {
      const abilityKey = SKILL_ABILITY_MAP[skillId];
      const abilityRank = abilityKey
        ? (data.abilities[abilityKey as keyof typeof data.abilities] ?? 0)
        : 0;
      data.skills[skillId] = {
        ...skill,
        total: skill.rank + abilityRank,
      };
      totalSkillRanks += skill.rank;
    });
    data.powerPoints.spent.skills = Math.ceil(totalSkillRanks / 2);

    // 6. PL Cap Validation (M&M 3e Hero's Handbook)
    const plLimit = data.powerLevel * 2;
    const violations: Array<{ label: string; value: number; limit: number }> = [];

    // Dodge + Toughness ≤ 2 × PL
    const dodgeTough = data.defenses.dodge.total + data.defenses.toughness.total;
    if (dodgeTough > plLimit) {
      violations.push({ label: 'Dodge + Toughness', value: dodgeTough, limit: plLimit });
    }

    // Parry + Toughness ≤ 2 × PL
    const parryTough = data.defenses.parry.total + data.defenses.toughness.total;
    if (parryTough > plLimit) {
      violations.push({ label: 'Parry + Toughness', value: parryTough, limit: plLimit });
    }

    // Fortitude + Will ≤ 2 × PL
    const fortWill = data.defenses.fortitude.total + data.defenses.will.total;
    if (fortWill > plLimit) {
      violations.push({ label: 'Fortitude + Will', value: fortWill, limit: plLimit });
    }

    // Close attack bonus + close effect rank ≤ 2 × PL
    const closeAttackBonus = data.abilities.fgt + (data.skills['close-combat']?.rank ?? 0);
    const closeEffectRank = data.powers
      .filter((power) => power.type === 'attack' && power.range === 'close')
      .reduce((max, power) => Math.max(max, getPowerRank(power)), 0);
    if (closeEffectRank > 0) {
      const closeAttackEffect = closeAttackBonus + closeEffectRank;
      if (closeAttackEffect > plLimit) {
        violations.push({
          label: 'Close Attack + Effect',
          value: closeAttackEffect,
          limit: plLimit,
        });
      }
    }

    // Ranged attack bonus + ranged effect rank ≤ 2 × PL
    const rangedAttackBonus = data.abilities.dex + (data.skills['ranged-combat']?.rank ?? 0);
    const rangedEffectRank = data.powers
      .filter(
        (power) =>
          power.type === 'attack' && (power.range === 'ranged' || power.range === 'perception')
      )
      .reduce((max, power) => Math.max(max, getPowerRank(power)), 0);
    if (rangedEffectRank > 0) {
      const rangedAttackEffect = rangedAttackBonus + rangedEffectRank;
      if (rangedAttackEffect > plLimit) {
        violations.push({
          label: 'Ranged Attack + Effect',
          value: rangedAttackEffect,
          limit: plLimit,
        });
      }
    }

    // Perception attacks typically cap effect rank at PL.
    const perceptionEffectRank = data.powers
      .filter((power) => power.type === 'attack' && power.range === 'perception')
      .reduce((max, power) => Math.max(max, getPowerRank(power)), 0);
    if (perceptionEffectRank > data.powerLevel) {
      violations.push({
        label: 'Perception Effect Rank',
        value: perceptionEffectRank,
        limit: data.powerLevel,
      });
    }

    data.plViolations = violations;

    return clonedDoc;
  }

  async rollCheck(
    document: CharacterDocument<Mam3eDataModel>,
    checkId: string
  ): Promise<RollResult> {
    const data = document.system;
    const d20 = Math.floor(Math.random() * 20) + 1;
    let mod = 0;
    let flavor = '';

    if (checkId in data.abilities) {
      // Raw ability check
      mod = data.abilities[checkId as keyof typeof data.abilities];
      flavor = `${checkId.toUpperCase()} Check`;
    } else if (checkId in data.skills) {
      // Skill check: ability rank + skill rank
      const skill = data.skills[checkId];
      const abilityKey = SKILL_ABILITY_MAP[checkId];
      const abilityRank = abilityKey
        ? (data.abilities[abilityKey as keyof typeof data.abilities] ?? 0)
        : 0;
      mod = abilityRank + skill.rank;
      flavor = `${checkId.replace(/-/g, ' ')} Check`;
    } else if (checkId in data.defenses) {
      // Defense check (e.g., Toughness save)
      mod = data.defenses[checkId as keyof typeof data.defenses].total;
      flavor = `${checkId.charAt(0).toUpperCase() + checkId.slice(1)} Check`;
    }

    return {
      total: d20 + mod,
      formula: `1d20 + ${mod}`,
      terms: [d20, mod],
      flavor,
    };
  }

  applyDamage(
    document: CharacterDocument<Mam3eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Mam3eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        conditionTrack: { ...document.system.conditionTrack },
      },
    };
    // For M&M, "amount" is interpreted as Toughness failure margin.
    const margin = Math.max(0, Math.floor(amount));
    if (margin <= 0) return clonedDoc;

    const current = normalizeConditionTrack(clonedDoc.system.conditionTrack);
    clonedDoc.system.conditionTrack = applyToughnessFailure(current, margin);
    return clonedDoc;
  }
}
