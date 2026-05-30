import { SystemEngine, RollResult } from '../../../registry/types';
import { CharacterDocument } from '../../../types/core/document';
import { Dnd5eDataModel } from '../data-model';
import { abilityMod } from '../../../utils/math';
import { hitDieSize } from '../../../constants/hit-dice';
import { compute5eAC } from '../../../utils/armorClass';
import { compute5eSpellSlots } from '../../../utils/spellSlots';
import { hasDnd5eCondition, normalizeDnd5eConditions } from '../conditions';
import { getDnd5eDefenseStyleArmorClassBonus } from './activityState';

/** Proficiency bonus by total character level (D&D 5e SRD) */
export function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/** Skill → Ability mapping (D&D 5e SRD) */
export const SKILL_ABILITIES: Record<string, string> = {
  acrobatics: 'dex',
  'animal-handling': 'wis',
  arcana: 'int',
  athletics: 'str',
  deception: 'cha',
  history: 'int',
  insight: 'wis',
  intimidation: 'cha',
  investigation: 'int',
  medicine: 'wis',
  nature: 'int',
  perception: 'wis',
  performance: 'cha',
  persuasion: 'cha',
  religion: 'int',
  'sleight-of-hand': 'dex',
  stealth: 'dex',
  survival: 'wis',
};

export type RollMode = 'normal' | 'advantage' | 'disadvantage';

export interface D20Roll {
  chosen: number;
  formula: string;
  terms: number[];
}

export function rollD20(mode: RollMode): D20Roll {
  const r1 = Math.floor(Math.random() * 20) + 1;
  if (mode === 'normal') {
    return { chosen: r1, formula: '1d20', terms: [r1] };
  }
  const r2 = Math.floor(Math.random() * 20) + 1;
  if (mode === 'advantage') {
    return {
      chosen: Math.max(r1, r2),
      formula: '2d20kh1',
      terms: [r1, r2],
    };
  }
  return {
    chosen: Math.min(r1, r2),
    formula: '2d20kl1',
    terms: [r1, r2],
  };
}

export function normalizeDeathSaves(doc: CharacterDocument<Dnd5eDataModel>) {
  if (!doc.system.deathSaves) {
    doc.system.deathSaves = { successes: 0, failures: 0 };
  }
  doc.system.deathSaves.successes = Math.max(0, Math.min(3, doc.system.deathSaves.successes || 0));
  doc.system.deathSaves.failures = Math.max(0, Math.min(3, doc.system.deathSaves.failures || 0));
}

export abstract class Dnd5eEngineBase implements SystemEngine<Dnd5eDataModel> {
  prepareData(document: CharacterDocument<Dnd5eDataModel>): CharacterDocument<Dnd5eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        spellcasting: document.system.spellcasting
          ? {
              ...document.system.spellcasting,
              spellSlots: { ...document.system.spellcasting.spellSlots },
            }
          : undefined,
      },
    };
    const data = clonedDoc.system;
    normalizeDeathSaves(clonedDoc);
    data.conditions = normalizeDnd5eConditions(data.conditions);
    data.exhaustionLevel = Number.isFinite(data.exhaustionLevel)
      ? Math.max(0, Math.min(6, Math.floor(data.exhaustionLevel)))
      : 0;

    const conMod = abilityMod(data.baseAttributes.con ?? 10);
    const dexMod = abilityMod(data.baseAttributes.dex ?? 10);
    const totalLevel =
      data.classLevels.length > 0
        ? data.classLevels.reduce((sum, cl) => sum + cl.level, 0)
        : data.level;
    data.level = totalLevel;
    // Give derived classes a chance to alter initiative/AC base rules
    this.applySubsystemRules(clonedDoc, dexMod);

    // --- Max HP ---
    if (data.classLevels.length > 0) {
      let maxHP = 0;
      for (const cl of data.classLevels) {
        const die = hitDieSize(cl.classId);
        if (cl.hitDieRolls.length === 0) {
          // First level of first class: max die + CON
          maxHP += die + conMod;
        } else {
          for (const roll of cl.hitDieRolls) {
            maxHP += roll + conMod;
          }
        }
      }
      maxHP = Math.max(maxHP, totalLevel); // minimum 1 HP per level

      maxHP = this.applyExhaustionMaxHP(data.exhaustionLevel, maxHP);
      data.hitPoints.max = maxHP;
    }

    data.hitPoints.current = Math.min(data.hitPoints.current, data.hitPoints.max);
    if (this.isExhaustionLethal(data.exhaustionLevel)) {
      data.hitPoints.current = 0;
      clonedDoc.system.deathSaves = { successes: 0, failures: 3 };
    }

    // --- Hit Dice tracking ---
    const previousHitDice = Array.isArray(data.hitDice) ? data.hitDice : [];
    data.hitDice = data.classLevels.map((cl, index) => {
      const die = `d${hitDieSize(cl.classId)}`;
      const total = cl.level;
      const previous = previousHitDice[index];

      if (previous && previous.die === die) {
        const gainedAtLevelUp = Math.max(0, total - previous.total);
        return {
          die,
          total,
          remaining: Math.min(total, Math.max(0, previous.remaining + gainedAtLevelUp)),
        };
      }

      return {
        die,
        total,
        remaining: total,
      };
    });

    // --- Spell Slots (from class level tables) ---
    if (data.spellcasting) {
      data.spellcasting.spellSlots = compute5eSpellSlots(
        data.classLevels.map((cl) => ({
          classId: cl.classId,
          level: cl.level,
          subclassId: cl.subclassId,
        })),
        data.spellcasting.spellSlots
      );
    }

    return clonedDoc;
  }

  // Hook for 2014 vs 2024 specifics
  protected applySubsystemRules(doc: CharacterDocument<Dnd5eDataModel>, dexMod: number): void {
    const data = doc.system;
    data.armorClass =
      compute5eAC(data.baseAttributes.dex ?? 10, data.equipment) +
      getDnd5eDefenseStyleArmorClassBonus(data);
    data.initiative = dexMod;
  }

  protected applyExhaustionMaxHP(_exhaustion: number, maxHP: number): number {
    return maxHP; // overridden in 2014 engine
  }

  protected isExhaustionLethal(_exhaustion: number): boolean {
    return false; // overridden in 2014 engine
  }

  protected getExhaustionSkillPenalty(_exhaustion: number): boolean {
    return false;
  }

  protected getExhaustionSavePenalty(_exhaustion: number): boolean {
    return false;
  }

  async rollCheck(
    document: CharacterDocument<Dnd5eDataModel>,
    checkId: string
  ): Promise<RollResult> {
    const d = document.system;
    const totalLevel =
      d.classLevels.length > 0 ? d.classLevels.reduce((sum, cl) => sum + cl.level, 0) : d.level;
    const pb = profBonus(totalLevel);
    let modifier = 0;
    let flavor = '';
    let isAbilityCheck = false;
    let isSavingThrow = false;
    let saveAttribute = '';

    if (checkId in d.baseAttributes) {
      modifier = abilityMod(d.baseAttributes[checkId]);
      flavor = `${checkId.toUpperCase()} Check`;
      isAbilityCheck = true;
    } else if (checkId in SKILL_ABILITIES) {
      const attr = SKILL_ABILITIES[checkId];
      modifier = abilityMod(d.baseAttributes[attr] ?? 10);
      const prof = d.skillProficiencies[checkId];
      if (prof) {
        if (prof.level === 'proficient') modifier += pb;
        else if (prof.level === 'expertise' || prof.level === 'double') modifier += pb * 2;
        else if (prof.level === 'half') modifier += Math.floor(pb / 2);
      }
      flavor = `${checkId} Check`;
      isAbilityCheck = true;
    } else if (checkId.startsWith('save-')) {
      const attr = checkId.slice(5);
      modifier = abilityMod(d.baseAttributes[attr] ?? 10);
      if (d.savingThrowProficiencies.includes(attr)) modifier += pb;
      flavor = `${attr.toUpperCase()} Save`;
      isSavingThrow = true;
      saveAttribute = attr;
    }

    // Apply any base initiative modifiers if check is initiative
    if (checkId === 'dex') {
      modifier = this.applyInitiativeModifiers(document, modifier);
    }

    const isPoisoned = hasDnd5eCondition(d.conditions, 'poisoned');
    const autoFailDexStrSave =
      isSavingThrow &&
      (saveAttribute === 'str' || saveAttribute === 'dex') &&
      (hasDnd5eCondition(d.conditions, 'paralyzed') ||
        hasDnd5eCondition(d.conditions, 'petrified') ||
        hasDnd5eCondition(d.conditions, 'stunned') ||
        hasDnd5eCondition(d.conditions, 'unconscious'));

    if (autoFailDexStrSave) {
      return {
        total: modifier,
        formula: 'Auto-fail',
        terms: [modifier],
        flavor: `${flavor} (Condition auto-fail)`,
      };
    }

    const hasDisadvantage =
      (isAbilityCheck && (this.getExhaustionSkillPenalty(d.exhaustionLevel) || isPoisoned)) ||
      (isSavingThrow && this.getExhaustionSavePenalty(d.exhaustionLevel));

    const isInitiative = checkId === 'dex';
    const hasAdvantage = isInitiative && this.hasInitiativeAdvantage(document);

    let rollMode: RollMode = 'normal';
    if (hasDisadvantage && !hasAdvantage) rollMode = 'disadvantage';
    else if (hasAdvantage && !hasDisadvantage) rollMode = 'advantage';

    let rollFlavor = flavor;
    if (rollMode !== 'normal')
      rollFlavor += ` (${rollMode.charAt(0).toUpperCase() + rollMode.slice(1)})`;

    const d20 = rollD20(rollMode);

    // Apply numerical D20 modifier penalty for 2024 exhaustion
    const extraMod = this.getExhaustionD20Penalty(d.exhaustionLevel);

    return {
      total: d20.chosen + modifier + extraMod,
      formula: `${d20.formula} + ${modifier}${extraMod ? ` - ${Math.abs(extraMod)}` : ''}`,
      terms: [...d20.terms, modifier, ...(extraMod ? [extraMod] : [])],
      isCritical: d20.chosen === 20,
      isFumble: d20.chosen === 1,
      flavor: rollFlavor,
    };
  }

  protected applyInitiativeModifiers(
    _doc: CharacterDocument<Dnd5eDataModel>,
    modifier: number
  ): number {
    return modifier;
  }

  protected hasInitiativeAdvantage(_doc: CharacterDocument<Dnd5eDataModel>): boolean {
    return false;
  }

  protected getExhaustionD20Penalty(_exhaustion: number): number {
    return 0; // overridden in 2024
  }

  applyDamage(
    document: CharacterDocument<Dnd5eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd5eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        deathSaves: { ...document.system.deathSaves },
      },
    };
    const hp = clonedDoc.system.hitPoints;
    normalizeDeathSaves(clonedDoc);
    const deathSaves = clonedDoc.system.deathSaves!;

    if (amount === 0) {
      return clonedDoc;
    }

    if (amount < 0) {
      const healing = Math.abs(amount);
      hp.current = Math.min(hp.max, hp.current + healing);
      if (hp.current > 0) {
        deathSaves.successes = 0;
        deathSaves.failures = 0;
      }
      return clonedDoc;
    }

    let remaining = amount;
    const hpBeforeDamage = hp.current;
    const wasAtZero = hp.current === 0;

    // Temp HP absorbs first
    if (hp.temp > 0) {
      const absorbed = Math.min(hp.temp, remaining);
      hp.temp -= absorbed;
      remaining -= absorbed;
    }

    // Then current HP (floor at 0)
    if (remaining > 0) {
      hp.current = Math.max(0, hp.current - remaining);
    }

    if (hpBeforeDamage > 0 && hp.current === 0) {
      deathSaves.successes = 0;
      deathSaves.failures = 0;
    } else if (wasAtZero && remaining > 0) {
      deathSaves.failures = Math.min(3, deathSaves.failures + 1);
    }

    return clonedDoc;
  }
}
