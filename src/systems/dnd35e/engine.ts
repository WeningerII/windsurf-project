import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Dnd35eDataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { GRAPPLE_SIZE_MODS, baseSave, classBAB } from '../shared/d20-helpers';
import { computeD20LegacyAC } from '../../utils/armorClass';
import { dnd35eClasses } from '../../data/dnd/3.5e/classes';
import { pf1eClasses } from '../../data/pathfinder/1e/classes';
import { getSpellSlotsAtClassLevel, mergeVancianSpellSlots } from '../../utils/classSpellcasting';

const SKILL_ABILITIES: Record<string, string> = {
  appraise: 'int',
  balance: 'dex',
  bluff: 'cha',
  climb: 'str',
  concentration: 'con',
  diplomacy: 'cha',
  'disable-device': 'int',
  disguise: 'cha',
  'escape-artist': 'dex',
  'gather-info': 'cha',
  'handle-animal': 'cha',
  heal: 'wis',
  hide: 'dex',
  intimidate: 'cha',
  jump: 'str',
  knowledge: 'int',
  listen: 'wis',
  'move-silently': 'dex',
  'open-lock': 'dex',
  ride: 'dex',
  search: 'int',
  'sense-motive': 'wis',
  'sleight-of-hand': 'dex',
  spellcraft: 'int',
  spot: 'wis',
  survival: 'wis',
  swim: 'str',
  tumble: 'dex',
  'use-magic': 'cha',
  'use-rope': 'dex',
};

/**
 * D&D 3.5e Logic Engine
 *
 * Key differences from 5e:
 *   - BAB replaces proficiency bonus for attacks
 *   - Three saves (Fort/Ref/Will) with good/poor progressions
 *   - Skills use ranks (max = level+3 for class skills, (level+3)/2 for cross-class)
 *   - AC has touch and flat-footed variants
 *   - Grapple = BAB + STR mod + size modifier
 */
export class Dnd35eEngine implements SystemEngine<Dnd35eDataModel> {
  prepareData(document: CharacterDocument<Dnd35eDataModel>): CharacterDocument<Dnd35eDataModel> {
    const d = document.system;
    const strMod = abilityMod(d.baseAttributes.str ?? 10);
    const dexMod = abilityMod(d.baseAttributes.dex ?? 10);
    const conMod = abilityMod(d.baseAttributes.con ?? 10);
    const wisMod = abilityMod(d.baseAttributes.wis ?? 10);
    const grappleSizeMod = GRAPPLE_SIZE_MODS[d.sizeCategory] ?? 0;

    // --- BAB (sum across multiclass) ---
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
    d.saves.fortitude.base = fortBase;
    d.saves.fortitude.ability = conMod;
    d.saves.fortitude.total = fortBase + conMod + d.saves.fortitude.misc;

    d.saves.reflex.base = refBase;
    d.saves.reflex.ability = dexMod;
    d.saves.reflex.total = refBase + dexMod + d.saves.reflex.misc;

    d.saves.will.base = willBase;
    d.saves.will.ability = wisMod;
    d.saves.will.total = willBase + wisMod + d.saves.will.misc;

    // --- Max HP ---
    let maxHP = 0;
    for (const cl of d.classLevels) {
      for (const roll of cl.hitDieRolls) {
        maxHP += Math.max(1, roll + conMod); // minimum 1 HP per die
      }
    }
    maxHP = Math.max(maxHP, 1);
    d.hitPoints.max = maxHP;
    d.hitPoints.current = Math.min(d.hitPoints.current, maxHP);

    // --- Spell Slots (best available class spell table data) ---
    // NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables.
    // We use native 3.5e spell tables when present and fall back to PF1e core tables
    // for matching class IDs to automate baseline slot totals.
    const slotTotals: Record<number, number> = {};
    for (const cl of d.classLevels) {
      const dndClass = dnd35eClasses.find((klass) => klass.id === cl.classId);
      const fallbackPf1Class = pf1eClasses[cl.classId as keyof typeof pf1eClasses];
      const spellSlotsTable = (dndClass?.spellcasting?.spellSlots ??
        fallbackPf1Class?.spellcasting?.spellSlots) as Record<number, number[]> | undefined;

      const classSlots = getSpellSlotsAtClassLevel(spellSlotsTable, cl.level);
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
    d.initiative = dexMod; // + Improved Initiative feat (+4) handled by misc

    // --- Grapple ---
    d.grapple = totalBAB + strMod + grappleSizeMod;

    return document;
  }

  async rollCheck(
    document: CharacterDocument<Dnd35eDataModel>,
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
    } else if (checkId === 'attack') {
      modifier = d.baseAttackBonus + abilityMod(d.baseAttributes.str ?? 10);
      flavor = 'Attack Roll';
    } else if (checkId === 'grapple') {
      modifier = d.grapple;
      flavor = 'Grapple Check';
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
    document: CharacterDocument<Dnd35eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd35eDataModel> {
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
