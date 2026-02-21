import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Pf2eDataModel, profTotal } from './data-model';
import { abilityMod } from '../../utils/math';
import { SKILL_ABILITIES, SAVE_ABILITIES } from './constants';

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
    const d = document.system;
    const dexMod = abilityMod(d.baseAttributes.dex ?? 10);
    // CON mod: abilityMod(d.baseAttributes.con ?? 10) — used in HP calc when level-up engine is built

    // --- Recompute all proficiency totals ---
    for (const [skillId, prof] of Object.entries(d.skillProficiencies)) {
      d.skillProficiencies[skillId] = {
        ...prof,
        total: profTotal(d.level, prof.tier),
      };
    }

    // Saves
    for (const [saveId, attr] of Object.entries(SAVE_ABILITIES)) {
      const save = d.saveProficiencies[saveId as keyof typeof d.saveProficiencies];
      if (save) {
        save.total = profTotal(d.level, save.tier);
      }
      void attr; // ability mod added at roll time
    }

    // Perception
    d.perceptionProficiency.total = profTotal(d.level, d.perceptionProficiency.tier);

    // Armor proficiencies
    for (const [key, prof] of Object.entries(d.armorProficiencies)) {
      d.armorProficiencies[key] = { ...prof, total: profTotal(d.level, prof.tier) };
    }

    // Weapon proficiencies
    for (const [key, prof] of Object.entries(d.weaponProficiencies)) {
      d.weaponProficiencies[key] = { ...prof, total: profTotal(d.level, prof.tier) };
    }

    // --- AC = 10 + DEX mod + armor proficiency (unarmored for now) ---
    const armorProf = d.armorProficiencies.unarmored?.total ?? 0;
    d.armorClass = 10 + dexMod + armorProf;

    // --- HP = sum of class die rolls + CON mod per level ---
    // (Ancestry HP is baked into the first level's roll for simplicity)
    let maxHP = 0;
    if (d.classId) {
      // PF2e: each level gives class HP die + CON mod
      // For now, we don't have per-level rolls stored the same way as 3.5e/5e
      // Use a simple formula: level * (average die + CON mod)
      // This will be refined when we have proper level-up tracking
      maxHP = d.hitPoints.max; // trust stored value until level-up engine is built
    }
    maxHP = Math.max(maxHP, d.level);
    d.hitPoints.max = maxHP;
    d.hitPoints.current = Math.min(d.hitPoints.current, maxHP);

    return document;
  }

  async rollCheck(document: CharacterDocument<Pf2eDataModel>, checkId: string): Promise<RollResult> {
    const d = document.system;
    let modifier = 0;
    let flavor = '';

    if (checkId === 'perception') {
      modifier = abilityMod(d.baseAttributes.wis ?? 10) + d.perceptionProficiency.total;
      flavor = 'Perception';
    } else if (checkId in SKILL_ABILITIES) {
      const attr = SKILL_ABILITIES[checkId];
      const prof = d.skillProficiencies[checkId];
      modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (prof?.total ?? 0);
      flavor = `${checkId} Check`;
    } else if (checkId in SAVE_ABILITIES) {
      const attr = SAVE_ABILITIES[checkId];
      const save = d.saveProficiencies[checkId as keyof typeof d.saveProficiencies];
      modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (save?.total ?? 0);
      flavor = `${checkId.charAt(0).toUpperCase() + checkId.slice(1)} Save`;
    } else if (checkId in d.baseAttributes) {
      modifier = abilityMod(d.baseAttributes[checkId]);
      flavor = `${checkId.toUpperCase()} Check`;
    }

    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + modifier;

    return {
      total,
      formula: `1d20 + ${modifier}`,
      terms: [d20, modifier],
      isCritical: d20 === 20,
      isFumble: d20 === 1,
      flavor,
    };
  }

  applyDamage(document: CharacterDocument<Pf2eDataModel>, amount: number, _type: string): CharacterDocument<Pf2eDataModel> {
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
