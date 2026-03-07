import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5eDataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { hitDieSize } from '../../constants/hit-dice';
import { compute5eAC } from '../../utils/armorClass';
import { compute5eSpellSlots } from '../../utils/spellSlots';
import { hasDnd5eCondition, normalizeDnd5eConditions } from './conditions';

/** Proficiency bonus by total character level (D&D 5e SRD) */
function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/** Skill → Ability mapping (D&D 5e SRD) */
const SKILL_ABILITIES: Record<string, string> = {
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

type RollMode = 'normal' | 'advantage' | 'disadvantage';

interface D20Roll {
  chosen: number;
  terms: number[];
  formula: string;
}

function rollD20(mode: RollMode): D20Roll {
  const roll = () => Math.floor(Math.random() * 20) + 1;
  if (mode === 'normal') {
    const value = roll();
    return { chosen: value, terms: [value], formula: '1d20' };
  }

  const first = roll();
  const second = roll();
  const chosen = mode === 'advantage' ? Math.max(first, second) : Math.min(first, second);
  return {
    chosen,
    terms: [first, second],
    formula: mode === 'advantage' ? '2d20kh1' : '2d20kl1',
  };
}

function normalizeDeathSaves(document: CharacterDocument<Dnd5eDataModel>): void {
  const deathSaves = document.system.deathSaves;
  if (!deathSaves || typeof deathSaves !== 'object') {
    document.system.deathSaves = { successes: 0, failures: 0 };
    return;
  }

  document.system.deathSaves = {
    successes: Math.max(0, Math.min(3, deathSaves.successes || 0)),
    failures: Math.max(0, Math.min(3, deathSaves.failures || 0)),
  };
}

/**
 * D&D 5e Logic Engine
 *
 * Implements real SRD 5.1 mechanics:
 * - Ability modifier = floor((score-10)/2)
 * - Proficiency bonus = ceil(level/4)+1
 * - AC = 10 + DEX mod (unarmored)
 * - Max HP from class hit dice + CON mod per level
 * - Initiative = DEX mod
 * - Skill checks = ability mod + proficiency (if proficient)
 */
export class Dnd5eEngine implements SystemEngine<Dnd5eDataModel> {
  prepareData(document: CharacterDocument<Dnd5eDataModel>): CharacterDocument<Dnd5eDataModel> {
    const d = document.system;
    normalizeDeathSaves(document);
    d.conditions = normalizeDnd5eConditions(d.conditions);
    d.exhaustionLevel = Number.isFinite(d.exhaustionLevel)
      ? Math.max(0, Math.min(6, Math.floor(d.exhaustionLevel)))
      : 0;
    const conMod = abilityMod(d.baseAttributes.con ?? 10);
    const dexMod = abilityMod(d.baseAttributes.dex ?? 10);
    const totalLevel =
      d.classLevels.length > 0 ? d.classLevels.reduce((sum, cl) => sum + cl.level, 0) : d.level;
    d.level = totalLevel;
    const pb = profBonus(totalLevel);

    // --- Max HP ---
    let maxHP = 0;
    for (const cl of d.classLevels) {
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
    if (d.exhaustionLevel >= 4) {
      // 2014 exhaustion level 4: hit point maximum is halved.
      maxHP = Math.max(1, Math.floor(maxHP / 2));
    }
    d.hitPoints.max = maxHP;
    d.hitPoints.current = Math.min(d.hitPoints.current, maxHP);
    if (d.exhaustionLevel >= 6) {
      // 2014 exhaustion level 6: death.
      d.hitPoints.current = 0;
      document.system.deathSaves = { successes: 0, failures: 3 };
    }

    // --- AC (from equipped armor, or unarmored fallback) ---
    d.armorClass = compute5eAC(d.baseAttributes.dex ?? 10, d.equipment);

    // --- Initiative ---
    d.initiative = dexMod;

    // --- Hit Dice tracking ---
    const previousHitDice = Array.isArray(d.hitDice) ? d.hitDice : [];
    d.hitDice = d.classLevels.map((cl, index) => {
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

    // --- Saving throw modifiers (stored for UI convenience) ---
    // Proficient saves get ability mod + proficiency bonus
    // Non-proficient saves get just ability mod
    // (These are derived; the UI can read savingThrowProficiencies + baseAttributes)

    // --- Skill totals (derived, not stored — but we validate proficiency sources) ---
    // No mutation needed; the sheet computes: abilityMod + (proficient ? pb : 0)

    // --- Spell Slots (from class level tables) ---
    if (d.spellcasting) {
      d.spellcasting.spellSlots = compute5eSpellSlots(
        d.classLevels.map((cl) => ({
          classId: cl.classId,
          level: cl.level,
          subclassId: cl.subclassId,
        })),
        d.spellcasting.spellSlots
      );
    }

    void pb; // used by sheet at render time, not stored
    return document;
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
      // Raw ability check
      modifier = abilityMod(d.baseAttributes[checkId]);
      flavor = `${checkId.toUpperCase()} Check`;
      isAbilityCheck = true;
    } else if (checkId in SKILL_ABILITIES) {
      // Skill check
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
      // Saving throw: "save-str", "save-dex", etc.
      const attr = checkId.slice(5);
      modifier = abilityMod(d.baseAttributes[attr] ?? 10);
      if (d.savingThrowProficiencies.includes(attr)) modifier += pb;
      flavor = `${attr.toUpperCase()} Save`;
      isSavingThrow = true;
      saveAttribute = attr;
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
      (isAbilityCheck && (d.exhaustionLevel >= 1 || isPoisoned)) ||
      (isSavingThrow && d.exhaustionLevel >= 3);
    const d20 = rollD20(hasDisadvantage ? 'disadvantage' : 'normal');

    return {
      total: d20.chosen + modifier,
      formula: `${d20.formula} + ${modifier}`,
      terms: [...d20.terms, modifier],
      isCritical: d20.chosen === 20,
      isFumble: d20.chosen === 1,
      flavor: hasDisadvantage ? `${flavor} (Disadvantage)` : flavor,
    };
  }

  applyDamage(
    document: CharacterDocument<Dnd5eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd5eDataModel> {
    const hp = document.system.hitPoints;
    normalizeDeathSaves(document);
    const deathSaves = document.system.deathSaves;

    if (amount === 0) {
      return document;
    }

    if (amount < 0) {
      const healing = Math.abs(amount);
      hp.current = Math.min(hp.max, hp.current + healing);
      if (hp.current > 0) {
        deathSaves.successes = 0;
        deathSaves.failures = 0;
      }
      return document;
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

    return document;
  }
}
