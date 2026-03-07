import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Pf1eDataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { CMB_SIZE_MODS, baseSave, classBAB } from '../shared/d20-helpers';
import { computeD20LegacyAC } from '../../utils/armorClass';
import { pf1eClasses } from '../../data/pathfinder/1e/classes';
import { getSpellSlotsAtClassLevel, mergeVancianSpellSlots } from '../../utils/classSpellcasting';

const SKILL_ABILITIES: Record<string, string> = {
  acrobatics: 'dex',
  appraise: 'int',
  bluff: 'cha',
  climb: 'str',
  diplomacy: 'cha',
  'disable-device': 'dex',
  disguise: 'cha',
  'escape-artist': 'dex',
  fly: 'dex',
  'handle-animal': 'cha',
  heal: 'wis',
  intimidate: 'cha',
  knowledge: 'int',
  linguistics: 'int',
  perception: 'wis',
  ride: 'dex',
  'sense-motive': 'wis',
  'sleight-of-hand': 'dex',
  spellcraft: 'int',
  stealth: 'dex',
  survival: 'wis',
  swim: 'str',
  'use-magic': 'cha',
};

/**
 * Pathfinder 1e Logic Engine
 *
 * Key differences from D&D 3.5e:
 *   - CMB = BAB + STR mod + special size mod
 *   - CMD = 10 + BAB + STR mod + DEX mod + special size mod
 *   - Class skills give +3 when trained (1+ rank)
 *   - Favored class bonus (HP or skill point)
 */
export class Pf1eEngine implements SystemEngine<Pf1eDataModel> {
  prepareData(document: CharacterDocument<Pf1eDataModel>): CharacterDocument<Pf1eDataModel> {
    const d = document.system;
    const strMod = abilityMod(d.baseAttributes.str ?? 10);
    const dexMod = abilityMod(d.baseAttributes.dex ?? 10);
    const conMod = abilityMod(d.baseAttributes.con ?? 10);
    const wisMod = abilityMod(d.baseAttributes.wis ?? 10);
    const cmbSizeMod = CMB_SIZE_MODS[d.sizeCategory] ?? 0;

    // --- BAB ---
    let totalBAB = 0;
    for (const cl of d.classLevels) {
      totalBAB += classBAB(cl.level, cl.bab);
    }
    d.baseAttackBonus = totalBAB;

    // --- Saves ---
    let fortBase = 0,
      refBase = 0,
      willBase = 0;
    for (const cl of d.classLevels) {
      fortBase += baseSave(cl.level, cl.fortSave);
      refBase += baseSave(cl.level, cl.refSave);
      willBase += baseSave(cl.level, cl.willSave);
    }
    d.saves.fortitude = {
      base: fortBase,
      ability: conMod,
      misc: d.saves.fortitude.misc,
      total: fortBase + conMod + d.saves.fortitude.misc,
    };
    d.saves.reflex = {
      base: refBase,
      ability: dexMod,
      misc: d.saves.reflex.misc,
      total: refBase + dexMod + d.saves.reflex.misc,
    };
    d.saves.will = {
      base: willBase,
      ability: wisMod,
      misc: d.saves.will.misc,
      total: willBase + wisMod + d.saves.will.misc,
    };

    // --- Max HP ---
    let maxHP = 0;
    let favoredClassSkillBonus = 0;
    for (const cl of d.classLevels) {
      for (const roll of cl.hitDieRolls) {
        maxHP += Math.max(1, roll + conMod);
      }
      // Favored class HP bonus
      if (cl.favoredClassBonus === 'hp') {
        maxHP += cl.level;
      } else if (cl.favoredClassBonus === 'skill') {
        favoredClassSkillBonus += cl.level;
      }
    }
    d.favoredClassSkillBonus = favoredClassSkillBonus;
    maxHP = Math.max(maxHP, 1);
    d.hitPoints.max = maxHP;
    d.hitPoints.current = Math.min(d.hitPoints.current, maxHP);

    // --- Spell Slots (class spell tables) ---
    const slotTotals: Record<number, number> = {};
    for (const cl of d.classLevels) {
      const classDef = pf1eClasses[cl.classId as keyof typeof pf1eClasses];
      const classSlots = getSpellSlotsAtClassLevel(
        classDef?.spellcasting?.spellSlots as Record<number, number[]> | undefined,
        cl.level
      );
      for (const [spellLevel, total] of Object.entries(classSlots)) {
        const level = Number(spellLevel);
        slotTotals[level] = (slotTotals[level] ?? 0) + total;
      }
    }
    d.spellsPerDay = mergeVancianSpellSlots(d.spellsPerDay, slotTotals);

    // --- AC (from equipped armor items + size) ---
    const ac = computeD20LegacyAC(d.baseAttributes.dex ?? 10, d.sizeCategory, d.equipment);
    d.armorClass.total = ac.total;
    d.armorClass.touch = ac.touch;
    d.armorClass.flatFooted = ac.flatFooted;

    // --- Initiative ---
    d.initiative = dexMod;

    // --- CMB / CMD ---
    d.cmb = totalBAB + strMod + cmbSizeMod;
    d.cmd = 10 + totalBAB + strMod + dexMod + cmbSizeMod;

    return document;
  }

  async rollCheck(
    document: CharacterDocument<Pf1eDataModel>,
    checkId: string
  ): Promise<RollResult> {
    const d = document.system;
    let modifier = 0;
    let flavor = '';

    if (checkId in d.baseAttributes) {
      modifier = abilityMod(d.baseAttributes[checkId]);
      flavor = `${checkId.toUpperCase()} Check`;
    } else if (checkId in SKILL_ABILITIES) {
      const attr = SKILL_ABILITIES[checkId];
      modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (d.skillRanks[checkId] ?? 0);
      // +3 class skill bonus if trained
      if ((d.skillRanks[checkId] ?? 0) > 0 && d.classSkills.includes(checkId)) {
        modifier += 3;
      }
      flavor = `${checkId} Check`;
    } else if (checkId === 'save-fort') {
      modifier = d.saves.fortitude.total;
      flavor = 'Fortitude Save';
    } else if (checkId === 'save-ref') {
      modifier = d.saves.reflex.total;
      flavor = 'Reflex Save';
    } else if (checkId === 'save-will') {
      modifier = d.saves.will.total;
      flavor = 'Will Save';
    } else if (checkId === 'cmb') {
      modifier = d.cmb;
      flavor = 'Combat Maneuver';
    } else if (checkId === 'attack') {
      modifier = d.baseAttackBonus + abilityMod(d.baseAttributes.str ?? 10);
      flavor = 'Attack Roll';
    }

    const d20 = Math.floor(Math.random() * 20) + 1;
    return {
      total: d20 + modifier,
      formula: `1d20 + ${modifier}`,
      terms: [d20, modifier],
      isCritical: d20 === 20,
      isFumble: d20 === 1,
      flavor,
    };
  }

  applyDamage(
    document: CharacterDocument<Pf1eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Pf1eDataModel> {
    const hp = document.system.hitPoints;
    let remaining = amount;
    if (hp.temp > 0) {
      const absorbed = Math.min(hp.temp, remaining);
      hp.temp -= absorbed;
      remaining -= absorbed;
    }
    if (remaining > 0) {
      hp.current = Math.max(0, hp.current - remaining);
    }
    return document;
  }
}
