import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Pf1eDataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { CMB_SIZE_MODS, baseSave, classBAB, d20SkillCheckPenalty } from '../shared/d20-helpers';
import { computeD20LegacyAC, D20_SIZE_MOD } from '../../utils/armorClass';
import { resolveCharacterEffects } from '../../rules';
import { d20LegacyCheckPenalty } from '../../rules/conditions/d20LegacyConditions';
import { mergeVancianSpellSlots } from '../../utils/classSpellcasting';
import { pf1eClasses } from '../../data/pathfinder/1e/classes';
import { pf1ePrestigeClasses } from '../../data/pathfinder/1e/prestige-classes';
import { buildD20LegacySpellSlotTotals } from '../../utils/d20LegacySpellcasting';

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
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        saves: { ...document.system.saves },
        hitPoints: { ...document.system.hitPoints },
        armorClass: { ...document.system.armorClass },
      },
    };
    const data = clonedDoc.system;
    const strMod = abilityMod(data.baseAttributes.str ?? 10);
    const dexMod = abilityMod(data.baseAttributes.dex ?? 10);
    const conMod = abilityMod(data.baseAttributes.con ?? 10);
    const wisMod = abilityMod(data.baseAttributes.wis ?? 10);
    const cmbSizeMod = CMB_SIZE_MODS[data.sizeCategory] ?? 0;

    // --- BAB ---
    let totalBAB = 0;
    for (const cl of data.classLevels) {
      totalBAB += classBAB(cl.level, cl.bab);
    }
    data.baseAttackBonus = totalBAB;

    // --- Saves ---
    let fortBase = 0,
      refBase = 0,
      willBase = 0;
    for (const cl of data.classLevels) {
      fortBase += baseSave(cl.level, cl.fortSave);
      refBase += baseSave(cl.level, cl.refSave);
      willBase += baseSave(cl.level, cl.willSave);
    }
    data.saves.fortitude = {
      base: fortBase,
      ability: conMod,
      misc: data.saves.fortitude.misc,
      total: fortBase + conMod + data.saves.fortitude.misc,
    };
    data.saves.reflex = {
      base: refBase,
      ability: dexMod,
      misc: data.saves.reflex.misc,
      total: refBase + dexMod + data.saves.reflex.misc,
    };
    data.saves.will = {
      base: willBase,
      ability: wisMod,
      misc: data.saves.will.misc,
      total: willBase + wisMod + data.saves.will.misc,
    };

    // --- Max HP ---
    let maxHP = 0;
    let favoredClassSkillBonus = 0;
    for (const cl of data.classLevels) {
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
    data.favoredClassSkillBonus = favoredClassSkillBonus;
    maxHP = Math.max(maxHP, 1);
    data.hitPoints.max = maxHP;
    data.hitPoints.current = Math.min(data.hitPoints.current, maxHP);

    // --- Spell Slots (class spell tables + casting-ability bonus spells) ---
    // PF1e CRB (Ability Modifiers and Bonus Spells): a high casting ability
    // grants bonus spells per day, applied per class inside the builder.
    // mergeVancianSpellSlots keeps each level's persisted manualBonus on top.
    const slotTotals = buildD20LegacySpellSlotTotals(
      'pf1e',
      data.classLevels,
      new Map(
        [...Object.values(pf1eClasses), ...pf1ePrestigeClasses].map((klass) => [klass.id, klass])
      ),
      data.baseAttributes
    );
    data.spellsPerDay = mergeVancianSpellSlots(data.spellsPerDay, slotTotals);

    // --- AC (from equipped armor items + size) ---
    // Base AC, then layer magic-item and feat/feature AC bonuses through the
    // shared rules resolver (RFC 003). Per-bonus-type routing to touch/flat-
    // footed is a Phase 2 refinement; the resolved delta applies to total here.
    // Additive: contributes 0 without bonus-bearing gear/modifiers.
    const ac = computeD20LegacyAC(data.baseAttributes.dex ?? 10, data.sizeCategory, data.equipment);
    const acBonus = resolveCharacterEffects('pf1e', {
      equipment: data.equipment.filter((item) => item.equipped),
      feats: data.feats,
      features: data.features,
    }).bonus('ac');
    data.armorClass.total = ac.total + acBonus;
    data.armorClass.touch = ac.touch;
    data.armorClass.flatFooted = ac.flatFooted;

    // --- Initiative ---
    data.initiative = dexMod;

    // --- CMB / CMD ---
    // PF1e CRB: Tiny or smaller creatures use their Dexterity modifier in
    // place of Strength for CMB (CMD keeps both Str and Dex regardless).
    const tinyOrSmaller =
      data.sizeCategory === 'tiny' ||
      data.sizeCategory === 'diminutive' ||
      data.sizeCategory === 'fine';
    data.cmb = totalBAB + (tinyOrSmaller ? dexMod : strMod) + cmbSizeMod;
    data.cmd = 10 + totalBAB + strMod + dexMod + cmbSizeMod;

    return clonedDoc;
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
      const carriedWeight = (d.inventory ?? []).reduce(
        (weight, item) => weight + item.weight * item.quantity,
        0
      );
      // Ranks + ability mod + the total check penalty (load + equipped armor/
      // shield) on physical skills. PF1e has no 3.5e-style synergy system.
      modifier =
        abilityMod(d.baseAttributes[attr] ?? 10) +
        (d.skillRanks[checkId] ?? 0) +
        d20SkillCheckPenalty(
          'pf1e',
          d.baseAttributes.str ?? 10,
          carriedWeight,
          d.equipment,
          checkId
        );
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
      // Base attack = BAB + STR + size modifier (PF1e CRB: size applies to
      // attack rolls exactly as to AC), then layer equipped-weapon and
      // feat/feature attack bonuses through the shared rules resolver
      // (RFC 003). The resolver contributes deterministically; only the d20
      // below is random.
      modifier =
        d.baseAttackBonus +
        abilityMod(d.baseAttributes.str ?? 10) +
        (D20_SIZE_MOD[d.sizeCategory] ?? 0) +
        resolveCharacterEffects('pf1e', {
          equipment: d.equipment.filter((item) => item.equipped),
          feats: d.feats,
          features: d.features,
        }).bonus('attack');
      flavor = 'Attack Roll';
    }

    // Active fear/sickened conditions impose their flat SRD penalty on every
    // check and save (worst fear state only; sickened stacks with fear).
    modifier -= d20LegacyCheckPenalty((d.conditions ?? []).map((condition) => condition.id));

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
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = clonedDoc.system.hitPoints;
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
