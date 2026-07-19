import { SystemEngine, RollResult } from '../../../registry/types';
import { CharacterDocument } from '../../../types/core/document';
import { Dnd5eDataModel } from '../data-model';
import { abilityMod, profBonus } from '../../../utils/math';
import { dnd5eSpellAttackBonus, dnd5eSpellSaveDC } from '../../../utils/derivedCasterMath';
import { applyDerivedQuantities } from '../../../rules/derivation';
import { DND5E_DERIVED_QUANTITIES } from './derivedQuantities';
import { hitDieSize } from '../../../constants/hit-dice';
import { compute5eAC } from '../../../utils/armorClass';
import { clampCount } from '../../../utils/resourcePool';
import {
  compute5eSpellSlots,
  computePactMagicSlots,
  type Dnd5eRulesEdition,
} from '../../../utils/spellSlots';
import {
  dnd5eUnarmoredDefenseBarbarian,
  dnd5eUnarmoredDefenseMonk,
} from '../../../utils/derivedCombatMath';
import { resolveCharacterEffects } from '../../../rules';
import { conditionImposesDisadvantage } from '../../../rules/conditions/dnd5eConditions';
import type { GameSystemId } from '../../../types/game-systems';
import { hasDnd5eCondition, normalizeDnd5eConditions } from '../conditions';
import { getDnd5eDefenseStyleArmorClassBonus } from './activityState';
import { rollD20, type RollMode, type D20Roll } from '../../../rules/dice';

// profBonus lives in utils/math so the system-agnostic rules layer can use it
// without importing this engine (which itself imports src/rules — a cycle).
export { profBonus };

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

// d20 rolling now lives in the shared dice module (one tested, seedable path for
// every system's checks); re-exported here for back-compat with existing imports.
export { rollD20 };
export type { RollMode, D20Roll };

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
        // Clone deathSaves too: normalizeDeathSaves writes clamped values, and
        // the input document's object must never be mutated.
        deathSaves: document.system.deathSaves
          ? { ...document.system.deathSaves }
          : document.system.deathSaves,
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
    // Derive the UNHALVED base first. prepareData must be idempotent: the app
    // persists prepared documents (useDocuments), so a derived value may never
    // be written over its own input. `baseMaxHP` stores the unhalved base for
    // class-less documents; `hitPoints.max` is always re-derived from it, so
    // the 2014 exhaustion halving cannot compound across save/load cycles.
    let baseMaxHP: number;
    if (data.classLevels.length > 0) {
      // Recompute from class hit dice when they're tracked.
      baseMaxHP = 0;
      data.classLevels.forEach((cl, classIndex) => {
        const die = hitDieSize(cl.classId);
        if (cl.hitDieRolls.length === 0) {
          // No tracked rolls (hand-made/imported row): count EVERY level —
          // max die for the character's first level (first class row only),
          // the SRD average for the rest. Previously a level-5 untracked row
          // contributed a single die.
          const average = Math.floor(die / 2) + 1;
          for (let levelIndex = 0; levelIndex < cl.level; levelIndex += 1) {
            const maxed = classIndex === 0 && levelIndex === 0;
            baseMaxHP += Math.max(1, (maxed ? die : average) + conMod);
          }
        } else {
          for (const roll of cl.hitDieRolls) {
            // PHB: each level adds a minimum of 1 hit point, so the clamp is
            // per level (matching the 3.5e engine's per-die clamp) — not a
            // single floor on the total.
            baseMaxHP += Math.max(1, roll + conMod);
          }
        }
      });
      baseMaxHP = Math.max(baseMaxHP, totalLevel); // levels without tracked rolls still count
    } else {
      // 5e HP can't be derived without per-class hit dice: preserve the stored
      // base. `baseMaxHP` (when present) is authoritative — the persisted
      // `hitPoints.max` may be an exhaustion-halved derived value.
      baseMaxHP = data.baseMaxHP ?? data.hitPoints.max;
    }
    data.baseMaxHP = baseMaxHP;

    // Exhaustion (2014 halves max HP at level 4) applies regardless of how the
    // base was derived; the halved value lives only in `hitPoints.max`.
    data.hitPoints.max = this.applyExhaustionMaxHP(data.exhaustionLevel, baseMaxHP);

    data.hitPoints.current = Math.min(data.hitPoints.current, data.hitPoints.max);
    if (this.isExhaustionLethal(data.exhaustionLevel)) {
      data.hitPoints.current = 0;
      clonedDoc.system.deathSaves = { successes: 0, failures: 3 };
    }

    // --- Hit Dice tracking ---
    // Pools are matched by classId, not array position: removing or
    // reordering a class must not hand its spent-dice count to a different
    // class that happens to share the die size. Legacy entries without a
    // classId fall back to positional matching once.
    const previousHitDice = Array.isArray(data.hitDice) ? data.hitDice : [];
    data.hitDice = data.classLevels.map((cl, index) => {
      const die = `d${hitDieSize(cl.classId)}`;
      const total = cl.level;
      const previous =
        previousHitDice.find((entry) => entry.classId === cl.classId) ??
        (previousHitDice[index]?.classId === undefined ? previousHitDice[index] : undefined);

      if (previous && previous.die === die) {
        const gainedAtLevelUp = Math.max(0, total - previous.total);
        return {
          classId: cl.classId,
          die,
          total,
          remaining: clampCount(previous.remaining + gainedAtLevelUp, total),
        };
      }

      return {
        classId: cl.classId,
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
        data.spellcasting.spellSlots,
        { edition: this.getRulesEdition() }
      );

      // Warlock Pact Magic is a separate short-rest pool (SRD), never part of
      // the multiclass grid above.
      const warlockLevel = data.classLevels
        .filter((cl) => cl.classId === 'warlock')
        .reduce((sum, cl) => sum + cl.level, 0);
      data.spellcasting.pactMagic = computePactMagicSlots(
        warlockLevel,
        data.spellcasting.pactMagic
      );

      // Spell save DC + attack bonus (SRD: Spellcasting). Derived per spellcasting
      // class so a multiclass caster's INT/WIS/CHA entries each get their own.
      // REPLACE the classes array (do not mutate its entries): the clone above
      // shares this array with the input document, and prepareData must be pure.
      const spellProficiency = profBonus(totalLevel);
      data.spellcasting.classes = (data.spellcasting.classes ?? []).map((casterClass) => {
        const spellMod = abilityMod(data.baseAttributes[casterClass.ability] ?? 10);
        return {
          ...casterClass,
          spellSaveDc: dnd5eSpellSaveDC(spellProficiency, spellMod),
          spellAttackBonus: dnd5eSpellAttackBonus(spellProficiency, spellMod),
        };
      });
    }

    return clonedDoc;
  }

  /** Rules edition for slot rounding etc. — overridden by the 2024 engine. */
  protected getRulesEdition(): Dnd5eRulesEdition {
    return '2014';
  }

  // Hook for 2014 vs 2024 specifics
  protected applySubsystemRules(doc: CharacterDocument<Dnd5eDataModel>, dexMod: number): void {
    const data = doc.system;
    // Base AC from armor/shield (with Unarmored Defense when the class feature
    // is present) + Defense fighting style, then layer magic-item and
    // feat/feature AC bonuses through the shared rules resolver (RFC 003).
    // Additive: with no bonus-bearing gear or modifiers this contributes 0, so
    // existing AC outputs are unchanged.
    data.armorClass =
      this.computeBaseArmorClass(data, dexMod) +
      getDnd5eDefenseStyleArmorClassBonus(data) +
      resolveCharacterEffects(doc.systemId as GameSystemId, {
        equipment: data.equipment,
        feats: data.feats,
        features: data.features,
      }).bonus('ac');
    data.initiative = dexMod;

    // Derived quantities (Passive Perception, carrying capacity, ...) come from
    // the declarative derivation layer: each is a single cited declaration in
    // ./derivedQuantities, computed generically here, surfaced on the sheet, and
    // verified by one test. Adding one needs no new engine code.
    data.derived = applyDerivedQuantities(data, DND5E_DERIVED_QUANTITIES);
  }

  /**
   * Armor/shield AC, taking the best applicable Unarmored Defense formula
   * (SRD 5.1/5.2, identical in both editions) when the character has the
   * class feature and wears no armor:
   *   - Barbarian: 10 + Dex mod + Con mod (a shield still applies)
   *   - Monk:      10 + Dex mod + Wis mod (no armor AND no shield)
   */
  protected computeBaseArmorClass(data: Dnd5eDataModel, dexMod: number): number {
    let baseAC = compute5eAC(data.baseAttributes.dex ?? 10, data.equipment);

    const armor = data.equipment.find((e) => e.slot === 'chest' && e.armorClass != null);
    if (armor) {
      return baseAC;
    }

    const shield = data.equipment.find((e) => e.slot === 'offHand' && e.shieldBonus != null);
    const hasFeature = (featureId: string) =>
      data.features.some((feature) => feature.id === featureId);

    if (hasFeature('unarmored-defense-barbarian')) {
      const conMod = abilityMod(data.baseAttributes.con ?? 10);
      baseAC = Math.max(
        baseAC,
        dnd5eUnarmoredDefenseBarbarian(dexMod, conMod) + (shield?.shieldBonus ?? 0)
      );
    }
    if (!shield && hasFeature('unarmored-defense-monk')) {
      const wisMod = abilityMod(data.baseAttributes.wis ?? 10);
      baseAC = Math.max(baseAC, dnd5eUnarmoredDefenseMonk(dexMod, wisMod));
    }

    return baseAC;
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

    if (checkId === 'initiative') {
      // Initiative is a Dexterity check (PHB), but it gets its own check id so
      // initiative-only modifiers (e.g. the 2024 Alert proficiency bonus)
      // never leak onto plain DEX ability checks.
      modifier = abilityMod(d.baseAttributes.dex ?? 10);
      modifier = this.applyInitiativeModifiers(document, modifier);
      flavor = 'Initiative';
      isAbilityCheck = true;
    } else if (checkId in d.baseAttributes) {
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

    // Condition-derived disadvantage now comes from the shared condition IR
    // (RFC 003) rather than bespoke branches: ability checks read the
    // 'ability-check' target; saves read 'save' and the ability-specific
    // 'save.<attr>'. Only deterministic, non-situational effects count
    // (situational ones are notes). Exhaustion stays a separate engine concern.
    const conditionIds = d.conditions.map((condition) => condition.id);
    const rollTargets = isAbilityCheck
      ? ['ability-check']
      : isSavingThrow
        ? ['save', `save.${saveAttribute}`]
        : [];
    const conditionDisadvantage =
      rollTargets.length > 0 && conditionImposesDisadvantage(conditionIds, rollTargets);

    const hasDisadvantage =
      (isAbilityCheck && this.getExhaustionSkillPenalty(d.exhaustionLevel)) ||
      (isSavingThrow && this.getExhaustionSavePenalty(d.exhaustionLevel)) ||
      conditionDisadvantage;

    const isInitiative = checkId === 'initiative';
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
