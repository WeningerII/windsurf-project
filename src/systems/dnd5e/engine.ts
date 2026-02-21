import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5eDataModel } from './data-model';
import { abilityMod } from '../../utils/math';
import { hitDieSize } from '../../constants/hit-dice';

/** Proficiency bonus by total character level (D&D 5e SRD) */
function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/** Skill → Ability mapping (D&D 5e SRD) */
const SKILL_ABILITIES: Record<string, string> = {
  acrobatics: 'dex', 'animal-handling': 'wis', arcana: 'int',
  athletics: 'str', deception: 'cha', history: 'int',
  insight: 'wis', intimidation: 'cha', investigation: 'int',
  medicine: 'wis', nature: 'int', perception: 'wis',
  performance: 'cha', persuasion: 'cha', religion: 'int',
  'sleight-of-hand': 'dex', stealth: 'dex', survival: 'wis',
};

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
    const conMod = abilityMod(d.baseAttributes.con ?? 10);
    const dexMod = abilityMod(d.baseAttributes.dex ?? 10);
    const pb = profBonus(d.level);

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
    maxHP = Math.max(maxHP, d.level); // minimum 1 HP per level
    d.hitPoints.max = maxHP;
    d.hitPoints.current = Math.min(d.hitPoints.current, maxHP);

    // --- AC (unarmored) ---
    d.armorClass = 10 + dexMod;

    // --- Initiative ---
    d.initiative = dexMod;

    // --- Hit Dice tracking ---
    d.hitDice = d.classLevels.map(cl => ({
      die: `d${hitDieSize(cl.classId)}`,
      total: cl.level,
      remaining: cl.level, // reset on long rest
    }));

    // --- Saving throw modifiers (stored for UI convenience) ---
    // Proficient saves get ability mod + proficiency bonus
    // Non-proficient saves get just ability mod
    // (These are derived; the UI can read savingThrowProficiencies + baseAttributes)

    // --- Skill totals (derived, not stored — but we validate proficiency sources) ---
    // No mutation needed; the sheet computes: abilityMod + (proficient ? pb : 0)

    void pb; // used by sheet at render time, not stored
    return document;
  }

  async rollCheck(document: CharacterDocument<Dnd5eDataModel>, checkId: string): Promise<RollResult> {
    const d = document.system;
    const pb = profBonus(d.level);
    let modifier = 0;
    let flavor = '';

    if (checkId in d.baseAttributes) {
      // Raw ability check
      modifier = abilityMod(d.baseAttributes[checkId]);
      flavor = `${checkId.toUpperCase()} Check`;
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
    } else if (checkId.startsWith('save-')) {
      // Saving throw: "save-str", "save-dex", etc.
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

  applyDamage(document: CharacterDocument<Dnd5eDataModel>, amount: number, _type: string): CharacterDocument<Dnd5eDataModel> {
    const hp = document.system.hitPoints;
    let remaining = amount;

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

    return document;
  }
}
