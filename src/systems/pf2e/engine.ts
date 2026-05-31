import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Pf2eDataModel, profTotal } from './data-model';
import { abilityMod } from '../../utils/math';
import { SKILL_ABILITIES, SAVE_ABILITIES } from './constants';
import { computePf2eAC } from '../../utils/armorClass';
import { resolveCharacterEffects } from '../../rules';
import { getPf2eConditionStatusPenalty } from '../../rules/conditions/pf2eConditions';
import { pf2eClasses } from '../../data/pathfinder/2e/classes';
import { getSpellSlotsAtClassLevel, mergeMaxUsedSpellSlots } from '../../utils/classSpellcasting';
import { hitDieFaces } from '../../utils/templateShared';

type Pf2eSpellcastingData = NonNullable<Pf2eDataModel['spellcasting']>;

const DEGREE_ORDER: RollResult['degreeOfSuccess'][] = [
  'critical-failure',
  'failure',
  'success',
  'critical-success',
];

function normalizedConditionValue(conditions: Pf2eDataModel['conditions'], name: string): number {
  const lower = name.toLowerCase();
  let highest = 0;
  for (const condition of conditions) {
    if (condition.name.toLowerCase() !== lower) continue;
    const numeric = condition.value != null ? condition.value : 1;
    if (numeric > highest) highest = numeric;
  }
  return highest;
}

// Condition status-penalty selection now lives in the shared condition IR
// (src/rules/conditions/pf2eConditions.ts) so the rule is defined once and
// also surfaces as ledger provenance. This thin wrapper preserves the engine's
// call sites and signature.
function getPf2eStatusPenalty(conditions: Pf2eDataModel['conditions'], ability?: string): number {
  return getPf2eConditionStatusPenalty(conditions, ability);
}

function inferPf2eTradition(spellListId: string): Pf2eSpellcastingData['tradition'] {
  if (spellListId.includes('divine')) return 'divine';
  if (spellListId.includes('occult')) return 'occult';
  if (spellListId.includes('primal')) return 'primal';
  return 'arcane';
}

function inferPf2eCastingType(
  preparedCasterFormula?: string,
  spellsKnown?: number[]
): Pf2eSpellcastingData['type'] {
  if (preparedCasterFormula) return 'prepared';
  if (Array.isArray(spellsKnown) && spellsKnown.length > 0) return 'spontaneous';
  return 'prepared';
}

function parseFixedPositiveInt(formula: string | undefined): number | null {
  if (!formula) return null;
  const parsed = Number.parseInt(formula.trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

/** PF2e CRB p.445: determine degree of success, then adjust for nat 20/1 */
function pf2eDegreeOfSuccess(
  total: number,
  dc: number,
  d20: number
): RollResult['degreeOfSuccess'] {
  // Base degree from total vs DC
  let idx: number;
  if (total >= dc + 10)
    idx = 3; // critical success
  else if (total >= dc)
    idx = 2; // success
  else if (total <= dc - 10)
    idx = 0; // critical failure
  else idx = 1; // failure

  // Natural 20 upgrades one step, natural 1 downgrades one step
  if (d20 === 20) idx = Math.min(3, idx + 1);
  else if (d20 === 1) idx = Math.max(0, idx - 1);

  return DEGREE_ORDER[idx];
}

/**
 * Pathfinder 2e Logic Engine
 *
 * Core formula: d20 + ability mod + proficiency bonus
 * Proficiency bonus = 0 (untrained) or level + tier (2/4/6/8)
 *
 * Key PF2e mechanics:
 *   - AC = 10 + DEX mod + proficiency + armor item bonus
 *   - HP = ancestry HP + (class HP + CON mod) per level
 *   - Saves = ability mod + proficiency
 *   - Skills = ability mod + proficiency + item bonuses
 *   - Perception is its own proficiency (not a skill)
 *   - Degrees of success: crit success (beat DC by 10+), success, failure, crit failure
 */
export class Pf2eEngine implements SystemEngine<Pf2eDataModel> {
  prepareData(document: CharacterDocument<Pf2eDataModel>): CharacterDocument<Pf2eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        skillProficiencies: { ...document.system.skillProficiencies },
        loreProficiencies: { ...document.system.loreProficiencies },
        saveProficiencies: {
          fortitude: { ...document.system.saveProficiencies.fortitude },
          reflex: { ...document.system.saveProficiencies.reflex },
          will: { ...document.system.saveProficiencies.will },
        },
        perceptionProficiency: { ...document.system.perceptionProficiency },
        armorProficiencies: { ...document.system.armorProficiencies },
        weaponProficiencies: { ...document.system.weaponProficiencies },
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const data = clonedDoc.system;

    // --- Recompute all proficiency totals ---
    for (const [skillId, prof] of Object.entries(data.skillProficiencies)) {
      data.skillProficiencies[skillId] = {
        ...prof,
        total: profTotal(data.level, prof.tier),
      };
    }

    for (const [loreId, prof] of Object.entries(data.loreProficiencies || {})) {
      data.loreProficiencies[loreId] = {
        ...prof,
        total: profTotal(data.level, prof.tier),
      };
    }

    // Saves
    for (const [saveId, attr] of Object.entries(SAVE_ABILITIES)) {
      const save = data.saveProficiencies[saveId as keyof typeof data.saveProficiencies];
      if (save) {
        save.total = profTotal(data.level, save.tier);
      }
      void attr; // ability mod added at roll time
    }

    // Perception
    data.perceptionProficiency.total = profTotal(data.level, data.perceptionProficiency.tier);

    // Armor proficiencies
    for (const [key, prof] of Object.entries(data.armorProficiencies)) {
      data.armorProficiencies[key] = { ...prof, total: profTotal(data.level, prof.tier) };
    }

    // Weapon proficiencies
    for (const [key, prof] of Object.entries(data.weaponProficiencies)) {
      data.weaponProficiencies[key] = { ...prof, total: profTotal(data.level, prof.tier) };
    }

    // --- AC = 10 + DEX mod + armor proficiency + armor item bonus ---
    const equippedArmor = data.equipment.find(
      (e) => e.equipped && e.armorClass != null && !e.shieldBonus
    );
    const armorCategory = equippedArmor?.armorType ?? 'unarmored';
    const armorProf =
      data.armorProficiencies[armorCategory]?.total ??
      data.armorProficiencies.unarmored?.total ??
      0;
    const clumsyPenalty = normalizedConditionValue(data.conditions, 'clumsy');
    const effectiveDex = Math.max(1, (data.baseAttributes.dex ?? 10) - clumsyPenalty * 2);
    // Base AC, then layer magic-item (item bonus) and feat/feature AC bonuses
    // through the shared rules resolver (RFC 003). PF2e item bonuses take the
    // highest per bucket; buckets sum. Additive without bonus-bearing gear.
    data.armorClass =
      computePf2eAC(effectiveDex, armorProf, data.equipment) +
      resolveCharacterEffects('pf2e', {
        equipment: data.equipment.filter((item) => item.equipped),
        feats: data.feats,
        features: data.features,
      }).bonus('ac');

    // --- HP = ancestryHP + level × (class HP die + CON mod) ---
    // PF2e CRB p.26: Ancestry HP (flat) + level × (class HP + CON mod). Class HP
    // per level is the class hit-die size, read from the class definition (the
    // single source of truth) instead of a duplicated lookup table.
    const conMod = abilityMod(data.baseAttributes.con ?? 10);
    const classDef = data.classId
      ? pf2eClasses[data.classId as keyof typeof pf2eClasses]
      : undefined;
    const parsedHitDie = classDef?.hitDie ? hitDieFaces(classDef.hitDie) : NaN;
    const classHitDie = Number.isFinite(parsedHitDie) ? parsedHitDie : 8;
    let maxHP = (data.ancestryHP ?? 0) + data.level * (classHitDie + conMod);
    maxHP = Math.max(maxHP, data.level);
    data.hitPoints.max = maxHP;
    data.hitPoints.current = Math.min(data.hitPoints.current, maxHP);

    // --- Spellcasting slots/focus from class progression ---
    const classSpellcasting = classDef?.spellcasting;
    if (classSpellcasting) {
      const slotMaxes = getSpellSlotsAtClassLevel(
        classSpellcasting.spellSlots as unknown as Record<number, number[]>,
        data.level
      );
      const existing = data.spellcasting;

      const focusResource = classDef?.classResources?.find(
        (resource) => resource.id === 'focus-points'
      );
      const focusMaxFromClass = parseFixedPositiveInt(focusResource?.maxFormula);
      const focusMax = Math.max(0, focusMaxFromClass ?? existing?.focusPoints.max ?? 0);
      const focusCurrent = Math.min(existing?.focusPoints.current ?? focusMax, focusMax);

      const proficiencyTier = existing?.proficiency.tier ?? 'trained';
      data.spellcasting = {
        tradition: existing?.tradition ?? inferPf2eTradition(classSpellcasting.spellListId),
        type:
          existing?.type ??
          inferPf2eCastingType(
            classSpellcasting.preparedCasterFormula,
            classSpellcasting.spellsKnown
          ),
        proficiency: {
          tier: proficiencyTier,
          total: profTotal(data.level, proficiencyTier),
        },
        spellSlots: mergeMaxUsedSpellSlots(existing?.spellSlots, slotMaxes),
        spellsKnown: existing?.spellsKnown ?? [],
        preparedSpellsByRank: existing?.preparedSpellsByRank,
        alwaysPreparedSpellIds: existing?.alwaysPreparedSpellIds,
        focusSpells: existing?.focusSpells ?? [],
        focusPoints: {
          current: focusCurrent,
          max: focusMax,
        },
      };
    }

    return clonedDoc;
  }

  async rollCheck(
    document: CharacterDocument<Pf2eDataModel>,
    checkId: string,
    options?: unknown
  ): Promise<RollResult> {
    const d = document.system;
    let modifier = 0;
    let conditionPenalty = 0;
    let flavor = '';

    if (checkId === 'perception') {
      modifier = abilityMod(d.baseAttributes.wis ?? 10) + d.perceptionProficiency.total;
      conditionPenalty = getPf2eStatusPenalty(d.conditions, 'wis');
      flavor = 'Perception';
    } else if (checkId in SKILL_ABILITIES) {
      const attr = SKILL_ABILITIES[checkId];
      const prof = d.skillProficiencies[checkId];
      modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (prof?.total ?? 0);
      conditionPenalty = getPf2eStatusPenalty(d.conditions, attr);
      flavor = `${checkId} Check`;
    } else if (checkId in SAVE_ABILITIES) {
      const attr = SAVE_ABILITIES[checkId];
      const save = d.saveProficiencies[checkId as keyof typeof d.saveProficiencies];
      modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (save?.total ?? 0);
      conditionPenalty = getPf2eStatusPenalty(d.conditions, attr);
      flavor = `${checkId.charAt(0).toUpperCase() + checkId.slice(1)} Save`;
    } else if (checkId in d.baseAttributes) {
      modifier = abilityMod(d.baseAttributes[checkId]);
      conditionPenalty = getPf2eStatusPenalty(d.conditions, checkId);
      flavor = `${checkId.toUpperCase()} Check`;
    }

    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + modifier - conditionPenalty;

    // Degree of success (PF2e CRB p.445)
    // If a DC is provided, compute the degree:
    //   critical success: beat DC by 10+
    //   success: meet or beat DC
    //   failure: miss DC
    //   critical failure: miss DC by 10+
    // Natural 20 upgrades one step, natural 1 downgrades one step.
    const dc = (options as { dc?: number } | undefined)?.dc;
    let degreeOfSuccess: RollResult['degreeOfSuccess'];
    if (dc != null) {
      degreeOfSuccess = pf2eDegreeOfSuccess(total, dc, d20);
    }

    return {
      total,
      formula: `1d20 + ${modifier}${conditionPenalty > 0 ? ` - ${conditionPenalty}` : ''}`,
      terms: [d20, modifier, -conditionPenalty],
      isCritical: d20 === 20,
      isFumble: d20 === 1,
      flavor,
      degreeOfSuccess,
    };
  }

  applyDamage(
    document: CharacterDocument<Pf2eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Pf2eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = clonedDoc.system.hitPoints;
    let remaining = amount;
    if (hp.temp > 0) {
      const absorbed = Math.min(hp.temp, remaining);
      hp.temp -= absorbed;
      remaining -= absorbed;
    }
    if (remaining > 0) {
      hp.current = Math.max(0, hp.current - remaining);
    }
    return clonedDoc;
  }
}
