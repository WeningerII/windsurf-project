import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5e2024DataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { hitDieSize } from '../../constants/hit-dice';

/** Proficiency bonus by total character level (D&D 5e SRD 5.2) */
function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

const SKILL_ABILITIES: Record<string, string> = {
  acrobatics: 'dex', 'animal-handling': 'wis', arcana: 'int',
  athletics: 'str', deception: 'cha', history: 'int',
  insight: 'wis', intimidation: 'cha', investigation: 'int',
  medicine: 'wis', nature: 'int', perception: 'wis',
  performance: 'cha', persuasion: 'cha', religion: 'int',
  'sleight-of-hand': 'dex', stealth: 'dex', survival: 'wis',
};

/**
 * D&D 5e 2024 Logic Engine (SRD 5.2)
 *
 * Core math is identical to 2014. Differences from 2014:
 *   - Initiative can use INT or DEX (Alert feat gives proficiency)
 *   - Weapon Mastery properties on attacks
 *   - Origin feats from backgrounds
 * These are handled at the sheet/UI layer; the engine math is the same.
 */
export class Dnd5e2024Engine implements SystemEngine<Dnd5e2024DataModel> {

  prepareData(document: CharacterDocument<Dnd5e2024DataModel>): CharacterDocument<Dnd5e2024DataModel> {
    const d = document.system;
    const conMod = abilityMod(d.baseAttributes.con ?? 10);
    const dexMod = abilityMod(d.baseAttributes.dex ?? 10);

    // --- Max HP ---
    let maxHP = 0;
    for (const cl of d.classLevels) {
      const die = hitDieSize(cl.classId);
      if (cl.hitDieRolls.length === 0) {
        maxHP += die + conMod;
      } else {
        for (const roll of cl.hitDieRolls) {
          maxHP += roll + conMod;
        }
      }
    }
    maxHP = Math.max(maxHP, d.level);
    d.hitPoints.max = maxHP;
    d.hitPoints.current = Math.min(d.hitPoints.current, maxHP);

    // --- AC (unarmored) ---
    d.armorClass = 10 + dexMod;

    // --- Initiative (2024: can be DEX or INT with Alert) ---
    d.initiative = dexMod;

    // --- Hit Dice ---
    d.hitDice = d.classLevels.map(cl => ({
      die: `d${hitDieSize(cl.classId)}`,
      total: cl.level,
      remaining: cl.level,
    }));

    return document;
  }

  async rollCheck(document: CharacterDocument<Dnd5e2024DataModel>, checkId: string): Promise<RollResult> {
    const d = document.system;
    const pb = profBonus(d.level);
    let modifier = 0;
    let flavor = '';

    if (checkId in d.baseAttributes) {
      modifier = abilityMod(d.baseAttributes[checkId]);
      flavor = `${checkId.toUpperCase()} Check`;
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
    } else if (checkId.startsWith('save-')) {
      const attr = checkId.slice(5);
      modifier = abilityMod(d.baseAttributes[attr] ?? 10);
      if (d.savingThrowProficiencies.includes(attr)) modifier += pb;
      flavor = `${attr.toUpperCase()} Save`;
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

  applyDamage(document: CharacterDocument<Dnd5e2024DataModel>, amount: number, _type: string): CharacterDocument<Dnd5e2024DataModel> {
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
