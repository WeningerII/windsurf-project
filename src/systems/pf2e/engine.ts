import { SystemEngine, RollResult } from '../../registry/types';
import { rollD20 } from '../../rules/dice';
import { CharacterDocument } from '../../types/core/document';
import { Pf2eDataModel, profTotal } from './data-model';
import { abilityMod } from '../../utils/math';
import { pf2eDegreeOfSuccess } from '../../rules/resolver/pf2eDegree';
import { SKILL_ABILITIES, SAVE_ABILITIES } from './constants';
import { resolveCharacterEffects, computePf2eAC } from '../../rules';
import { getPf2eConditionStatusPenalty } from '../../rules/conditions/pf2eConditions';
import { pf2eClasses } from '../../data/pathfinder/2e/classes';
import { getSpellSlotsAtClassLevel, mergeMaxUsedSpellSlots } from '../../utils/classSpellcasting';
import { hitDieFaces } from '../../utils/templateShared';
import { applyDerivedQuantities } from '../../rules/derivation';
import { PF2E_DERIVED_QUANTITIES } from './derivedQuantities';

type Pf2eSpellcastingData = NonNullable<Pf2eDataModel['spellcasting']>;

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

    // Class DC proficiency (CRB p.29). Older documents may lack the entry;
    // every class starts trained, so seed that and recompute the total.
    const classDcTier = data.classDcProficiency?.tier ?? 'trained';
    data.classDcProficiency = {
      ...(data.classDcProficiency ?? { tier: classDcTier }),
      tier: classDcTier,
      total: profTotal(data.level, classDcTier),
    };

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
    // Base AC, then layer magic-item (item bonus) and feat/feature AC bonuses
    // through the shared rules resolver (RFC 003). PF2e item bonuses take the
    // highest per bucket; buckets sum. Additive without bonus-bearing gear.
    //
    // Status penalties to AC (CRB Conditions Appendix): frightened and
    // sickened penalize "all your checks and DCs" — AC included — and clumsy
    // penalizes "Dexterity-based checks and DCs, including AC". They are all
    // status penalties, so only the single worst one applies, and it applies
    // AFTER the armor's Dex cap (a clumsy fighter in full plate still loses
    // AC). getPf2eConditionStatusPenalty(conditions, 'dex') selects exactly
    // that set: the 'all' conditions plus the Dex-scoped clumsy.
    // A shield that isn't equipped can't be raised — clear stale flags so a
    // re-equipped shield starts lowered (Raise a Shield is a per-round action).
    for (const item of data.equipment) {
      if (item.shieldBonus != null && !item.equipped && item.raised) {
        item.raised = false;
      }
    }
    const acStatusPenalty = getPf2eStatusPenalty(data.conditions, 'dex');
    // Base AC (scalar) seeds a `set` on 'ac'; the magic-item/feat/feature effects
    // add on top through the resolver, so bonus('ac') is base + bonuses. The
    // status penalty is then subtracted, exactly as before.
    data.armorClass =
      resolveCharacterEffects('pf2e', {
        equipment: data.equipment.filter((item) => item.equipped),
        feats: data.feats,
        features: data.features,
        baseArmorClass: computePf2eAC(data.baseAttributes.dex ?? 10, armorProf, data.equipment),
      }).bonus('ac') - acStatusPenalty;

    // --- HP = ancestryHP + level × (class HP die + CON mod) + manual bonus ---
    // PF2e CRB p.26: Ancestry HP (flat) + level × (class HP + CON mod). Class HP
    // per level is the class hit-die size, read from the class definition (the
    // single source of truth) instead of a duplicated lookup table.
    // `hitPoints.maxBonus` is the persisted manual adjustment (Toughness, item
    // HP, …) recorded by the sheet's Max HP editor; it survives re-prepares
    // where a raw `max` edit would be overwritten.
    const conMod = abilityMod(data.baseAttributes.con ?? 10);
    const classDef = data.classId
      ? pf2eClasses[data.classId as keyof typeof pf2eClasses]
      : undefined;
    const parsedHitDie = classDef?.hitDie ? hitDieFaces(classDef.hitDie) : NaN;
    const classHitDie = Number.isFinite(parsedHitDie) ? parsedHitDie : 8;
    let maxHP =
      (data.ancestryHP ?? 0) + data.level * (classHitDie + conMod) + (data.hitPoints.maxBonus ?? 0);
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

    // Declarative derived quantities (Bulk limits, auto-heighten rank, Class DC)
    // come from the declarative derivation layer: each is a single cited
    // declaration in ./derivedQuantities, computed generically here, surfaced on
    // the sheet, and verified by one test. Adding one needs no new engine code.
    data.derived = applyDerivedQuantities(data, PF2E_DERIVED_QUANTITIES);

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

    const d20 = rollD20('normal').chosen;
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
    // Negative amounts are healing, matching the PF1e/3.5e/5e engines: restore
    // current HP (capped at max) without touching temp HP. Without this guard a
    // negative `remaining` would *increase* temp HP via Math.min below.
    if (amount < 0) {
      const healing = Math.abs(amount);
      hp.current = Math.min(hp.max, hp.current + healing);
      return clonedDoc;
    }
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
