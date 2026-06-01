import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Dnd35eDataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { GRAPPLE_SIZE_MODS, baseSave, classBAB } from '../shared/d20-helpers';
import { computeD20LegacyAC } from '../../utils/armorClass';
import { resolveCharacterEffects } from '../../rules';
import { dnd35eClasses } from '../../data/dnd/3.5e/classes';
import { dnd35eNormalizedPrestigeClasses } from '../../data/dnd/3.5e/prestige-classes';
import { mergeVancianSpellSlots } from '../../utils/classSpellcasting';
import { buildD20LegacySpellSlotTotals } from '../../utils/d20LegacySpellcasting';

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

const DND35E_CLASS_CATALOG = [...dnd35eClasses, ...dnd35eNormalizedPrestigeClasses];

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
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        saves: {
          fortitude: { ...document.system.saves.fortitude },
          reflex: { ...document.system.saves.reflex },
          will: { ...document.system.saves.will },
        },
        hitPoints: { ...document.system.hitPoints },
        armorClass: { ...document.system.armorClass },
      },
    };
    const data = clonedDoc.system;
    const strMod = abilityMod(data.baseAttributes.str ?? 10);
    const dexMod = abilityMod(data.baseAttributes.dex ?? 10);
    const conMod = abilityMod(data.baseAttributes.con ?? 10);
    const wisMod = abilityMod(data.baseAttributes.wis ?? 10);
    const grappleSizeMod = GRAPPLE_SIZE_MODS[data.sizeCategory] ?? 0;

    // --- BAB (sum across multiclass) ---
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
    data.saves.fortitude.base = fortBase;
    data.saves.fortitude.ability = conMod;
    data.saves.fortitude.total = fortBase + conMod + data.saves.fortitude.misc;

    data.saves.reflex.base = refBase;
    data.saves.reflex.ability = dexMod;
    data.saves.reflex.total = refBase + dexMod + data.saves.reflex.misc;

    data.saves.will.base = willBase;
    data.saves.will.ability = wisMod;
    data.saves.will.total = willBase + wisMod + data.saves.will.misc;

    // --- Max HP ---
    let maxHP = 0;
    for (const cl of data.classLevels) {
      for (const roll of cl.hitDieRolls) {
        maxHP += Math.max(1, roll + conMod); // minimum 1 HP per die
      }
    }
    maxHP = Math.max(maxHP, 1);
    data.hitPoints.max = maxHP;
    data.hitPoints.current = Math.min(data.hitPoints.current, maxHP);

    // --- Spell Slots (best available class spell table data) ---
    // NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables.
    // We use native 3.5e spell tables when present and fall back to PF1e core tables
    // for matching class IDs to automate baseline slot totals.
    const slotTotals = buildD20LegacySpellSlotTotals(
      'dnd-3.5e',
      data.classLevels,
      new Map(DND35E_CLASS_CATALOG.map((klass) => [klass.id, klass]))
    );
    data.spellsPerDay = mergeVancianSpellSlots(data.spellsPerDay, slotTotals);

    // --- AC (from equipped armor items + size) ---
    // Base AC, then layer magic-item and feat/feature AC bonuses through the
    // shared rules resolver (RFC 003). d20 enhancement bonuses take the largest
    // of a named type; different types stack. Per-bonus-type routing to
    // touch/flat-footed is a Phase 2 refinement; the resolved delta applies to
    // total here. Additive: contributes 0 without bonus-bearing gear/modifiers.
    const ac = computeD20LegacyAC(data.baseAttributes.dex ?? 10, data.sizeCategory, data.equipment);
    const acBonus = resolveCharacterEffects('dnd-3.5e', {
      equipment: data.equipment.filter((item) => item.equipped),
      feats: data.feats,
      features: data.features,
    }).bonus('ac');
    data.armorClass.total = ac.total + acBonus;
    data.armorClass.touch = ac.touch;
    data.armorClass.flatFooted = ac.flatFooted;

    // --- Initiative ---
    data.initiative = dexMod; // + Improved Initiative feat (+4) handled by misc

    // --- Grapple ---
    data.grapple = totalBAB + strMod + grappleSizeMod;

    return clonedDoc;
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
      // Base attack = BAB + STR, then layer equipped-weapon and feat/feature
      // attack bonuses through the shared rules resolver (RFC 003). The resolver
      // contributes deterministically; only the d20 below is random.
      modifier =
        d.baseAttackBonus +
        abilityMod(d.baseAttributes.str ?? 10) +
        resolveCharacterEffects('dnd-3.5e', {
          equipment: d.equipment.filter((item) => item.equipped),
          feats: d.feats,
          features: d.features,
        }).bonus('attack');
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
