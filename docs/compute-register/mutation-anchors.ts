/**
 * MUTATION ANCHORS — sidecar for the compute-register integrity gate.
 *
 * This is intentionally a SEPARATE module from the typed register so that
 * `ComputeRegisterEntry` stays untouched (typecheck-clean) while the gate can
 * carry an engine-source perturbation per entry id.
 *
 * Each anchor names an engine-source `file`, a `find` string that MUST occur
 * EXACTLY ONCE in that file, and a type-valid `replace` that breaks the formula
 * arithmetically. The gate (scripts/check-compute-register.mjs --mutate) applies
 * the perturbation under try/finally with `git checkout -- <file>` restore, then
 * requires at least one of the entry's matching test assertions to flip
 * passed -> failed. If the mutation does not break the linked test, the
 * verification is not mutation-sensitive and the entry is demoted.
 *
 * CITED, NEVER INVENTED: every `find` is a literal substring of the live engine
 * source (verified at authoring time). `find` strings that no longer occur (or
 * occur more than once) abort their anchor loudly rather than silently passing.
 *
 * This is an INITIAL seeded subset (>=1 per system). Entries without an anchor
 * that pass Tier A stay `verified` but are reported `mutation: 'unanchored'` in
 * the gate JSON, so the published numerator is honest about which verifications
 * are name+pass only vs. mutation-proven.
 */

export interface MutationAnchor {
  /** Engine-source file, repo-root-relative. */
  file: string;
  /** Literal substring of `file`; MUST occur exactly once. */
  find: string;
  /** Type-valid arithmetic perturbation that breaks the formula. */
  replace: string;
}

export const MUTATION_ANCHORS: Record<string, MutationAnchor> = {
  // ── dnd-5e-2014 ──
  'dnd5e2014.L1.ability-mod': {
    file: 'src/utils/math.ts',
    find: 'Math.floor((score - 10) / 2)',
    replace: 'Math.floor((score - 11) / 2)',
  },
  // passive Perception: both editions engine-wire the same shared helper, so the
  // one formula perturbation (base 10 -> 11) flips the engine-wired test for each.
  'dnd5e2014.L4.passive-perception': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 10 + wisMod + profPart;',
    replace: 'return 11 + wisMod + profPart;',
  },
  'dnd5e2024.L4.passive-perception': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 10 + wisMod + profPart;',
    replace: 'return 11 + wisMod + profPart;',
  },
  'dnd5e2024.L6.carrying-capacity': {
    file: 'src/systems/dnd5e/shared/dnd5eMovement.ts',
    find: 'Math.max(0, strengthScore) * 15',
    replace: 'Math.max(0, strengthScore) * 16',
  },
  'dnd5e2014.L2.ac.unarmored': {
    file: 'src/utils/armorClass.ts',
    find: '(armor ? armor.armorClass! : 10) + dnd5eArmorDexContribution(armor, dexMod)',
    replace: '(armor ? armor.armorClass! : 11) + dnd5eArmorDexContribution(armor, dexMod)',
  },
  // sneak-attack-dice: a real formula mutation (ceil(level/2) -> ceil(level/3)),
  // proven by the dedicated dice-count test '5e sneak attack dice (phase 4)'.
  'dnd5e2014.L3.sneak-attack-dice': {
    file: 'src/rules/conditions/dnd5eRiders.ts',
    find: 'Math.ceil(rogueLevel / 2)',
    replace: 'Math.ceil(rogueLevel / 3)',
  },
  'dnd5e2014.L1.proficiency-bonus': {
    file: 'src/utils/math.ts',
    find: 'Math.ceil(level / 4) + 1',
    replace: 'Math.ceil(level / 4) + 2',
  },
  // Spell DC / attack are now engine-wired (prepareData), so the helper mutation
  // breaks the engine test "L2 spell save DC and attack (engine-wired)".
  'dnd5e2014.L2.spell-save-dc': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 8 + proficiencyBonus + abilityMod;',
    replace: 'return 9 + proficiencyBonus + abilityMod;',
  },
  'dnd5e2014.L2.spell-attack': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return proficiencyBonus + abilityMod;',
    replace: 'return proficiencyBonus + abilityMod + 1;',
  },
  // ── L3 damage assembly (riders + extra attack) ──
  // Rage damage scales +2/+3/+4 at 1/9/16; the rider test runs a barbarian-9
  // (=> +3), so breaking the >=9 branch flips its `toContain(3)`.
  'dnd5e2014.L3.rage-damage': {
    file: 'src/rules/conditions/dnd5eRiders.ts',
    find: '[9, 3]',
    replace: '[9, 2]',
  },
  // Divine Smite base is 2d8; the rider test asserts every smite die value === 8.
  'dnd5e2014.L3.divine-smite-base': {
    file: 'src/rules/conditions/dnd5eRiders.ts',
    find: 'value: 8,',
    replace: 'value: 9,',
  },
  // GWM trades -5 attack for +10 damage; perturb the +10 (multi-line find kept
  // unique by the great-weapon-master source id, since -5/+10 recur for Sharpshooter).
  'dnd5e2014.L3.gwm-tradeoff': {
    file: 'src/rules/conditions/dnd5eRiders.ts',
    find: `value: 10,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'great-weapon-master', label: 'Great Weapon Master' },`,
    replace: `value: 11,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'great-weapon-master', label: 'Great Weapon Master' },`,
  },
  // Sharpshooter trades -5 attack for +10 damage; perturb the -5 (multi-line find
  // kept unique by the sharpshooter source id).
  'dnd5e2014.L3.sharpshooter-tradeoff': {
    file: 'src/rules/conditions/dnd5eRiders.ts',
    find: `value: -5,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'sharpshooter', label: 'Sharpshooter' },`,
    replace: `value: -6,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'sharpshooter', label: 'Sharpshooter' },`,
  },
  // Extra Attack count = 1 + owned 'extra-attack*' features; break the matcher so
  // no feature matches (=> 1 attack, not the test's expected 3).
  'dnd5e2014.L3.extra-attack-count': {
    file: 'src/rules/combatants/systemProfiles.ts',
    find: '/^extra-attack(-\\d+)?$/',
    replace: '/^extra-attackXX(-\\d+)?$/',
  },
  // Versatile selects the larger die only when wielded two-handed; forcing it to
  // always use the base die breaks the two-handed test. Shared dnd5eVersatileDamageDie
  // helper serves both 2014 and 2024 (deduped by the gate).
  'dnd5e2014.L3.versatile-damage': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return wieldedTwoHanded && versatileDie != null ? versatileDie : baseDie;',
    replace: 'return wieldedTwoHanded && versatileDie != null ? baseDie : baseDie;',
  },
  // Off-hand damage omits the ability mod unless the TWF style; forcing it to
  // always add the mod breaks the no-style test (expects 0). Shared
  // dnd5eOffHandDamageMod helper serves both 2014 and 2024 (deduped by the gate).
  'dnd5e2014.L3.two-weapon-offhand': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return hasTwoWeaponFightingStyle ? abilityMod : Math.min(0, abilityMod);',
    replace: 'return hasTwoWeaponFightingStyle ? abilityMod : abilityMod;',
  },

  // ── dnd-5e-2024 (reuses the shared 5e leaf helpers) ──
  'dnd5e2024.L1.ability-mod': {
    file: 'src/utils/math.ts',
    find: 'Math.floor((score - 10) / 2)',
    replace: 'Math.floor((score - 11) / 2)',
  },
  'dnd5e2024.L1.proficiency-bonus': {
    file: 'src/utils/math.ts',
    find: 'Math.ceil(level / 4) + 1',
    replace: 'Math.ceil(level / 4) + 2',
  },
  'dnd5e2024.L2.spell-save-dc': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 8 + proficiencyBonus + abilityMod;',
    replace: 'return 9 + proficiencyBonus + abilityMod;',
  },
  'dnd5e2024.L2.spell-attack': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return proficiencyBonus + abilityMod;',
    replace: 'return proficiencyBonus + abilityMod + 1;',
  },
  // Shares dnd5eVersatileDamageDie with 2014 (deduped by the gate).
  'dnd5e2024.L3.versatile-damage': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return wieldedTwoHanded && versatileDie != null ? versatileDie : baseDie;',
    replace: 'return wieldedTwoHanded && versatileDie != null ? baseDie : baseDie;',
  },
  // Shares dnd5eOffHandDamageMod with 2014 (deduped by the gate).
  'dnd5e2024.L3.two-weapon-offhand': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return hasTwoWeaponFightingStyle ? abilityMod : Math.min(0, abilityMod);',
    replace: 'return hasTwoWeaponFightingStyle ? abilityMod : abilityMod;',
  },

  // ── dnd-3.5e ──
  'dnd35e.L1.save-progression': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'linearRate(level, 1, 2, 2)',
    replace: 'linearRate(level, 1, 2, 3)',
  },
  'dnd35e.L2.ac': {
    file: 'src/utils/armorClass.ts',
    find: 'const total = 10 + armorBonus + shieldBonus + effectiveDex + sizeMod;',
    replace: 'const total = 11 + armorBonus + shieldBonus + effectiveDex + sizeMod;',
  },
  // iterative-attacks: extra attacks at BAB +6/+11/+16, each at a cumulative -5.
  // Breaking the first iterative step (bab-5 -> bab-4) makes
  // iterativeAttackBonuses(6) === [6, 2] != [6, 1]. The shared derivedCombatMath
  // helper backs both 3.5e and pf1e, so the gate dedups this find across both.
  'dnd35e.L3.iterative-attacks': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'bonuses.push(bab - 5)',
    replace: 'bonuses.push(bab - 4)',
  },
  // BAB-sum track: full BAB = level. The shared classBAB helper backs both 3.5e
  // and pf1e bab-sum, so the gate dedups this find across them.
  'dnd35e.L3.bab-sum': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'linearRate(level, 1, 1)',
    replace: 'linearRate(level, 2, 1)',
  },
  // Grapple = BAB + Str mod + size mod (3.5e engine leaf).
  'dnd35e.L3.grapple': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'data.grapple = totalBAB + strMod + grappleSizeMod;',
    replace: 'data.grapple = totalBAB + strMod + grappleSizeMod + 1;',
  },
  // Confirmed-crit damage = normal × multiplier (+ unmultiplied extra). Shared
  // d20CriticalDamage helper backs both 3.5e and pf1e crit-confirmation; the gate
  // dedups this find across them.
  'dnd35e.L3.crit-confirmation': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return normalDamage * Math.max(1, Math.floor(multiplier)) + unmultipliedExtra;',
    replace: 'return normalDamage * Math.max(1, Math.floor(multiplier)) + unmultipliedExtra + 1;',
  },

  // ── pf1e (shares d20 helpers + legacy AC with 3.5e) ──
  'pf1e.L2.ac': {
    file: 'src/utils/armorClass.ts',
    find: 'const total = 10 + armorBonus + shieldBonus + effectiveDex + sizeMod;',
    replace: 'const total = 11 + armorBonus + shieldBonus + effectiveDex + sizeMod;',
  },
  'pf1e.L1.save-progression': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'linearRate(level, 1, 2, 2)',
    replace: 'linearRate(level, 1, 2, 3)',
  },
  // Shares the derivedCombatMath iterative helper with 3.5e (deduped by the gate).
  'pf1e.L3.iterative-attacks': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'bonuses.push(bab - 5)',
    replace: 'bonuses.push(bab - 4)',
  },
  // Shares classBAB with 3.5e (deduped by the gate).
  'pf1e.L3.bab-sum': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'linearRate(level, 1, 1)',
    replace: 'linearRate(level, 2, 1)',
  },
  // CMB = BAB + Str (or Dex if Tiny-) + size mod; CMD = 10 + BAB + Str + Dex + size.
  'pf1e.L3.cmb': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'data.cmb = totalBAB + (tinyOrSmaller ? dexMod : strMod) + cmbSizeMod;',
    replace: 'data.cmb = totalBAB + (tinyOrSmaller ? dexMod : strMod) + cmbSizeMod + 1;',
  },
  'pf1e.L3.cmd': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'data.cmd = 10 + totalBAB + strMod + dexMod + cmbSizeMod;',
    replace: 'data.cmd = 11 + totalBAB + strMod + dexMod + cmbSizeMod;',
  },
  // A combat maneuver succeeds when the CMB check meets the target CMD (>=).
  'pf1e.L3.maneuver-types': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return cmbCheckTotal >= targetCMD;',
    replace: 'return cmbCheckTotal > targetCMD;',
  },
  // Shares d20CriticalDamage with 3.5e crit-confirmation (deduped by the gate).
  'pf1e.L3.crit-confirmation': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return normalDamage * Math.max(1, Math.floor(multiplier)) + unmultipliedExtra;',
    replace: 'return normalDamage * Math.max(1, Math.floor(multiplier)) + unmultipliedExtra + 1;',
  },

  // ── pf2e ──
  'pf2e.L8.degrees-of-success': {
    file: 'src/rules/resolver/pf2eDegree.ts',
    find: 'if (total >= dc + 10) {',
    replace: 'if (total >= dc + 11) {',
  },
  'pf2e.L1.proficiency': {
    file: 'src/systems/pf2e/data-model.ts',
    find: 'trained: 2',
    replace: 'trained: 3',
  },
  // L3 offense: multiple-attack penalty (2nd attack -5, agile -4); striking-rune
  // damage-dice count (striking = 2); attack modifier = ability + prof + item.
  'pf2e.L3.map': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'if (attackNumber === 2) return agile ? -4 : -5;',
    replace: 'if (attackNumber === 2) return agile ? -4 : -6;',
  },
  'pf2e.L3.striking-runes': {
    file: 'src/utils/derivedCombatMath.ts',
    find: '{ none: 1, striking: 2, greater: 3, major: 4 }',
    replace: '{ none: 1, striking: 3, greater: 3, major: 4 }',
  },
  'pf2e.L3.attack-modifier': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'return abilityMod + proficiency + itemBonus;',
    replace: 'return abilityMod + proficiency + itemBonus + 1;',
  },

  // ── mam3e ──
  'mam3e.L3.attack-dc': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 10 + activeDefense;',
    replace: 'return 11 + activeDefense;',
  },
  // L3 damage assembly: Damage resistance DC = 15 + rank; Affliction DC = 10 +
  // rank; a critical hit adds +5 to the resistance DC; degrees of success step
  // every 5 points. Each is a leaf formula in derivedMath.ts.
  'mam3e.L3.damage-resistance-dc': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 15 + damageRank;',
    replace: 'return 16 + damageRank;',
  },
  'mam3e.L3.affliction-dc': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 10 + rank;',
    replace: 'return 11 + rank;',
  },
  'mam3e.L3.critical-hit': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return baseDC + 5;',
    replace: 'return baseDC + 6;',
  },
  'mam3e.L3.degrees-of-success': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: '1 + Math.floor((checkTotal - dc) / 5)',
    replace: '1 + Math.floor((checkTotal - dc) / 6)',
  },

  // ── daggerheart ──
  'daggerheart.L1.tier': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'breakpoints(level, DAGGERHEART_TIER_BREAKPOINTS, 1)',
    replace: 'breakpoints(level, DAGGERHEART_TIER_BREAKPOINTS, 2)',
  },
  // proficiency == tier (getDaggerheartProficiency delegates to getDaggerheartTier),
  // so the tier mutation breaks the shared "tier and proficiency" test for both.
  'daggerheart.L1.proficiency': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'breakpoints(level, DAGGERHEART_TIER_BREAKPOINTS, 1)',
    replace: 'breakpoints(level, DAGGERHEART_TIER_BREAKPOINTS, 2)',
  },
  // L3 damage assembly: weapon dice = proficiency; a crit adds the max of the
  // damage dice (diceCount × dieSize) to the rolled total; Spellcast damage rolls
  // a number of dice equal to the Spellcast trait (0 if non-positive).
  'daggerheart.L3.attack-vs-difficulty': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return Math.max(1, proficiency);',
    replace: 'return Math.max(1, proficiency) + 1;',
  },
  'daggerheart.L3.critical-damage': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return rolledTotal + Math.max(0, diceCount) * Math.max(0, dieSize);',
    replace: 'return rolledTotal + Math.max(0, diceCount) * Math.max(0, dieSize) + 1;',
  },
  'daggerheart.L3.spellcast-damage-dice': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return Math.max(0, spellcastTrait);',
    replace: 'return Math.max(0, spellcastTrait) + 1;',
  },
  // ── workflow-scoped rollout batch (p3.mutation-anchor-rollout) ──
  // 141 leaf-formula anchors scoped per system, each independently
  // preflighted (find occurs exactly once) and gate-verified via --mutate.
  'dnd5e2014.L2.ac.light': {
    file: 'src/utils/armorClass.ts',
    find: 'return dexMod;',
    replace: 'return dexMod + 1;',
  },
  'dnd5e2014.L2.ac.medium': {
    file: 'src/utils/armorClass.ts',
    find: 'Math.min(dexMod, armor.dexBonusMax ?? 2)',
    replace: 'Math.min(dexMod, armor.dexBonusMax ?? 3)',
  },
  'dnd5e2014.L2.ac.heavy': {
    file: 'src/utils/armorClass.ts',
    find: 'return 0;',
    replace: 'return 1;',
  },
  'dnd5e2014.L2.ac.defense-style': {
    file: 'src/systems/dnd5e/shared/activityState.ts',
    find: 'return hasDnd5eEquippedArmor(system.equipment) ? 1 : 0;',
    replace: 'return hasDnd5eEquippedArmor(system.equipment) ? 2 : 0;',
  },
  'dnd5e2014.L2.ac.unarmored-defense-barbarian': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return 10 + dexMod + conMod;',
    replace: 'return 11 + dexMod + conMod;',
  },
  'dnd5e2014.L2.ac.unarmored-defense-monk': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return 10 + dexMod + wisMod;',
    replace: 'return 11 + dexMod + wisMod;',
  },
  'dnd5e2014.L2.saving-throw': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'if (d.savingThrowProficiencies.includes(attr)) modifier += pb;',
    replace: 'if (d.savingThrowProficiencies.includes(attr)) modifier += pb + 1;',
  },
  'dnd5e2014.L4.skill-check': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'modifier += pb * 2;',
    replace: 'modifier += pb * 3;',
  },
  'dnd5e2014.L4.initiative': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'data.initiative = dexMod;',
    replace: 'data.initiative = dexMod + 1;',
  },
  'dnd5e2014.L4.d20-modes': {
    file: 'src/rules/dice.ts',
    find: 'Math.max(first, second)',
    replace: 'Math.max(first, second) + 1',
  },
  'dnd5e2014.L5.multiclass-spell-slots': {
    file: 'src/utils/spellSlots.ts',
    find: 'casterLevel += cl.level;',
    replace: 'casterLevel += cl.level + 1;',
  },
  'dnd5e2014.L5.pact-magic': {
    file: 'src/utils/spellSlots.ts',
    find: 'const max = level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 2 : 1;',
    replace: 'const max = level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 3 : 1;',
  },
  'dnd5e2014.L7.max-hp': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'Math.max(1, roll + conMod)',
    replace: 'Math.max(1, roll + conMod + 1)',
  },
  'dnd5e2014.L7.hit-dice-pool': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'const total = cl.level;',
    replace: 'const total = cl.level + 1;',
  },
  'dnd5e2014.L8.exhaustion-max-hp': {
    file: 'src/systems/dnd5e/engine.ts',
    find: 'Math.floor(maxHP / 2)',
    replace: 'Math.floor(maxHP / 3)',
  },
  'dnd5e2014.L8.exhaustion-lethal': {
    file: 'src/systems/dnd5e/engine.ts',
    find: 'return exhaustion >= 6;',
    replace: 'return exhaustion >= 7;',
  },
  'dnd5e2014.L8.exhaustion-clamp': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'Math.min(6, Math.floor(data.exhaustionLevel))',
    replace: 'Math.min(7, Math.floor(data.exhaustionLevel))',
  },
  'dnd5e2014.L8.exhaustion-disadvantage': {
    file: 'src/systems/dnd5e/engine.ts',
    find: 'return exhaustion >= 1;',
    replace: 'return exhaustion >= 2;',
  },
  'dnd5e2014.L8.apply-damage': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'deathSaves.failures = Math.min(3, deathSaves.failures + 1);',
    replace: 'deathSaves.failures = Math.min(3, deathSaves.failures + 2);',
  },
  'dnd5e2014.L8.death-save-normalize': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'Math.min(3, doc.system.deathSaves.successes || 0)',
    replace: 'Math.min(4, doc.system.deathSaves.successes || 0)',
  },
  'dnd5e2014.L8.condition-poisoned': {
    file: 'src/rules/conditions/dnd5eConditions.ts',
    find: "      target: 'ability-check',\n      operation: 'disadvantage',\n      label: 'Poisoned: disadvantage on ability checks',",
    replace:
      "      target: 'ability-check-disabled',\n      operation: 'disadvantage',\n      label: 'Poisoned: disadvantage on ability checks',",
  },
  'dnd5e2024.L2.ac-formula-set': {
    file: 'src/utils/armorClass.ts',
    find: '(armor ? armor.armorClass! : 10) + dnd5eArmorDexContribution(armor, dexMod)',
    replace: '(armor ? armor.armorClass! : 11) + dnd5eArmorDexContribution(armor, dexMod)',
  },
  'dnd5e2024.L2.saving-throw': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'if (d.savingThrowProficiencies.includes(attr)) modifier += pb;',
    replace: 'if (d.savingThrowProficiencies.includes(attr)) modifier += pb + 1;',
  },
  'dnd5e2024.L2.ac.unarmored-defense-barbarian': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return 10 + dexMod + conMod;',
    replace: 'return 11 + dexMod + conMod;',
  },
  'dnd5e2024.L2.ac.unarmored-defense-monk': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return 10 + dexMod + wisMod;',
    replace: 'return 11 + dexMod + wisMod;',
  },
  'dnd5e2024.L4.skill-check': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: "else if (prof.level === 'half') modifier += Math.floor(pb / 2);",
    replace: "else if (prof.level === 'half') modifier += Math.floor(pb / 3);",
  },
  // Shares the rollD20 advantage selection with 2014 (same testRef); the
  // deterministic max+1 break is deduped across both. (The workflow's 2024 agent
  // skipped this as flaky under a max<->min flip, but max+1 breaks it for every roll.)
  'dnd5e2024.L4.d20-modes': {
    file: 'src/rules/dice.ts',
    find: 'Math.max(first, second)',
    replace: 'Math.max(first, second) + 1',
  },
  'dnd5e2024.L4.initiative-alert': {
    file: 'src/systems/dnd5e-2024/engine.ts',
    find: 'data.initiative = dexMod + (hasAlertFeat(data) ? profBonus(totalCharacterLevel(data)) : 0);',
    replace:
      'data.initiative = dexMod + (hasAlertFeat(data) ? profBonus(totalCharacterLevel(data)) + 1 : 0);',
  },
  'dnd5e2024.L5.multiclass-spell-slots': {
    file: 'src/utils/spellSlots.ts',
    find: 'return Math.ceil(level / 2);',
    replace: 'return Math.floor(level / 2);',
  },
  'dnd5e2024.L5.pact-magic': {
    file: 'src/utils/spellSlots.ts',
    find: 'level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 2 : 1',
    replace: 'level >= 17 ? 5 : level >= 11 ? 3 : level >= 2 ? 2 : 1',
  },
  'dnd5e2024.L7.max-hp': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'baseMaxHP += Math.max(1, roll + conMod);',
    replace: 'baseMaxHP += Math.max(1, roll + conMod + 1);',
  },
  'dnd5e2024.L7.hit-dice-pool': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'remaining: clampCount(previous.remaining + gainedAtLevelUp, total),',
    replace: 'remaining: clampCount(previous.remaining + gainedAtLevelUp + 1, total),',
  },
  'dnd5e2024.L8.exhaustion-no-hp-halve': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'return maxHP; // overridden in 2014 engine',
    replace: 'return maxHP - 1; // overridden in 2014 engine',
  },
  'dnd5e2024.L8.exhaustion-d20-penalty': {
    file: 'src/systems/dnd5e-2024/engine.ts',
    find: 'return -2 * exhaustion;',
    replace: 'return -3 * exhaustion;',
  },
  'dnd5e2024.L8.exhaustion-lethal': {
    file: 'src/systems/dnd5e-2024/engine.ts',
    find: 'return exhaustion >= 6;',
    replace: 'return exhaustion > 6;',
  },
  'dnd5e2024.L8.apply-damage': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'hp.current = Math.max(0, hp.current - remaining);',
    replace: 'hp.current = Math.max(0, hp.current - remaining - 1);',
  },
  'dnd5e2024.L8.condition-poisoned': {
    file: 'src/rules/conditions/dnd5eConditions.ts',
    find: "      target: 'ability-check',\n      operation: 'disadvantage',\n      label: 'Poisoned: disadvantage on ability checks',",
    replace:
      "      target: 'ability-check',\n      operation: 'note',\n      label: 'Poisoned: disadvantage on ability checks',",
  },
  'dnd5e2024.L8.death-save-normalize': {
    file: 'src/systems/dnd5e/shared/engine.ts',
    find: 'Math.min(3, doc.system.deathSaves.successes || 0)',
    replace: 'Math.min(4, doc.system.deathSaves.successes || 0)',
  },
  'dnd35e.L1.ability-mod': {
    file: 'src/utils/math.ts',
    find: 'Math.floor((score - 10) / 2)',
    replace: 'Math.floor((score - 11) / 2)',
  },
  'dnd35e.L1.bab-track': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'linearRate(level, 3, 4)',
    replace: 'linearRate(level, 1, 4)',
  },
  'dnd35e.L2.saves-total': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'data.saves.fortitude.total = fortBase + conMod + data.saves.fortitude.misc;',
    replace: 'data.saves.fortitude.total = fortBase + conMod + data.saves.fortitude.misc + 1;',
  },
  'dnd35e.L3.attack-roll': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'd.baseAttackBonus +',
    replace: 'd.baseAttackBonus + 1 +',
  },
  'dnd35e.L4.skill-ranks': {
    file: 'src/systems/dnd35e/engine.ts',
    find: '(d.skillRanks[checkId] ?? 0) +',
    replace: '(d.skillRanks[checkId] ?? 0) + 1 +',
  },
  'dnd35e.L4.skill-synergy': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return relatedSkillRanks >= 5 ? 2 : 0;',
    replace: 'return relatedSkillRanks >= 5 ? 3 : 0;',
  },
  'dnd35e.L4.max-rank-cap': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return isClassSkill ? level + 3 : Math.floor((level + 3) / 2);',
    replace: 'return isClassSkill ? level + 4 : Math.floor((level + 3) / 2);',
  },
  'dnd35e.L4.initiative': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'data.initiative = dexMod;',
    replace: 'data.initiative = dexMod + 1;',
  },
  'dnd35e.L5.vancian-slots': {
    file: 'src/systems/shared/d20LegacySpellcasting.ts',
    find: '(slotTotals[numericLevel] ?? 0) + total + bonusSpells + domainSlot + specialistSlot;',
    replace:
      '(slotTotals[numericLevel] ?? 0) + total + 1 + bonusSpells + domainSlot + specialistSlot;',
  },
  'dnd35e.L5.spell-save-dc': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 10 + spellLevel + abilityMod;',
    replace: 'return 11 + spellLevel + abilityMod;',
  },
  'dnd35e.L5.bonus-spells': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'return Math.floor((abilityMod - spellLevel) / 4) + 1;',
    replace: 'return Math.floor((abilityMod - spellLevel) / 4) + 2;',
  },
  'dnd35e.L6.carrying-capacity': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'light: Math.floor(heavy / 3),',
    replace: 'light: Math.floor(heavy / 4),',
  },
  'dnd35e.L6.encumbrance': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'return { maxDex: 1, checkPenalty: -6, runMultiplier: 3 };',
    replace: 'return { maxDex: 2, checkPenalty: -6, runMultiplier: 3 };',
  },
  'dnd35e.L6.lift-drag': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'return { overHead: max, offGround: max * 2, pushDrag: max * 5 };',
    replace: 'return { overHead: max, offGround: max * 2, pushDrag: max * 6 };',
  },
  'dnd35e.L7.max-hp': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'maxHP += Math.max(1, roll + conMod);',
    replace: 'maxHP += Math.max(1, roll + conMod + 1);',
  },
  'dnd35e.L8.apply-damage': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'hp.current = Math.max(0, hp.current - remaining);',
    replace: 'hp.current = Math.max(0, hp.current - remaining - 1);',
  },
  'dnd35e.L5.concentration-dc': {
    file: 'src/systems/dnd35e/derivedMath.ts',
    find: 'return 15 + spellLevel;',
    replace: 'return 16 + spellLevel;',
  },
  'dnd35e.L7.feats-from-level': {
    file: 'src/systems/dnd35e/derivedMath.ts',
    find: 'return linearRate(l, 1, 3, 1);',
    replace: 'return linearRate(l, 1, 3, 2);',
  },
  'dnd35e.L7.ability-increases': {
    file: 'src/systems/dnd35e/derivedMath.ts',
    find: 'return linearRate(Math.max(0, level), 1, 4);',
    replace: 'return linearRate(Math.max(0, level), 1, 5);',
  },
  'dnd35e.L1.xp-to-level': {
    file: 'src/systems/dnd35e/derivedMath.ts',
    find: 'return 500 * l * (l - 1);',
    replace: 'return 600 * l * (l - 1);',
  },
  'dnd35e.L8.massive-damage': {
    file: 'src/systems/dnd35e/derivedMath.ts',
    find: 'return damage >= DND35E_MASSIVE_DAMAGE_THRESHOLD;',
    replace: 'return damage > DND35E_MASSIVE_DAMAGE_THRESHOLD;',
  },
  'dnd35e.L8.hp-state-track': {
    file: 'src/systems/dnd35e/derivedMath.ts',
    find: "if (currentHp <= -10) return 'dead';",
    replace: "if (currentHp < -10) return 'dead';",
  },
  'pf1e.L1.ability-mod': {
    file: 'src/utils/math.ts',
    find: 'Math.floor((score - 10) / 2)',
    replace: 'Math.floor((score - 11) / 2)',
  },
  'pf1e.L1.bab-track': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'linearRate(level, 3, 4)',
    replace: 'linearRate(level, 1, 4)',
  },
  'pf1e.L2.saves-total': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'total: fortBase + conMod + data.saves.fortitude.misc,',
    replace: 'total: fortBase + conMod + data.saves.fortitude.misc + 1,',
  },
  'pf1e.L3.attack-roll': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'd.baseAttackBonus +',
    replace: 'd.baseAttackBonus + 1 +',
  },
  'pf1e.L4.skill-ranks': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'modifier += 3;',
    replace: 'modifier += 4;',
  },
  'pf1e.L4.initiative': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'data.initiative = dexMod;',
    replace: 'data.initiative = dexMod + 1;',
  },
  'pf1e.L5.vancian-slots': {
    file: 'src/systems/shared/d20LegacySpellcasting.ts',
    find: '(slotTotals[numericLevel] ?? 0) + total + bonusSpells + domainSlot + specialistSlot;',
    replace:
      '(slotTotals[numericLevel] ?? 0) + total + bonusSpells + domainSlot + specialistSlot + 1;',
  },
  'pf1e.L5.spell-save-dc': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 10 + spellLevel + abilityMod;',
    replace: 'return 11 + spellLevel + abilityMod;',
  },
  'pf1e.L5.bonus-spells': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'return Math.floor((abilityMod - spellLevel) / 4) + 1;',
    replace: 'return Math.floor((abilityMod - spellLevel) / 4) + 2;',
  },
  'pf1e.L5.concentration-dc': {
    file: 'src/systems/pf1e/derivedMath.ts',
    find: 'return 15 + 2 * spellLevel;',
    replace: 'return 16 + 2 * spellLevel;',
  },
  'pf1e.L8.hp-state-track': {
    file: 'src/systems/pf1e/derivedMath.ts',
    find: "if (currentHp <= -Math.max(0, constitution)) return 'dead';",
    replace: "if (currentHp < -Math.max(0, constitution)) return 'dead';",
  },
  'pf1e.L7.feats-from-level': {
    file: 'src/systems/pf1e/derivedMath.ts',
    find: 'return Math.ceil(Math.max(0, Math.floor(level)) / 2);',
    replace: 'return Math.ceil(Math.max(0, Math.floor(level)) / 3);',
  },
  'pf1e.L6.carrying-capacity': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'light: Math.floor(heavy / 3),',
    replace: 'light: Math.floor(heavy / 4),',
  },
  'pf1e.L6.encumbrance': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'return { maxDex: 3, checkPenalty: -3, runMultiplier: 4 };',
    replace: 'return { maxDex: 4, checkPenalty: -3, runMultiplier: 4 };',
  },
  'pf1e.L6.lift-drag': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: 'return { overHead: max, offGround: max * 2, pushDrag: max * 5 };',
    replace: 'return { overHead: max, offGround: max * 2, pushDrag: max * 6 };',
  },
  'pf1e.L7.max-hp': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'maxHP += Math.max(1, roll + conMod);',
    replace: 'maxHP += Math.max(1, roll + conMod) + 1;',
  },
  'pf1e.L7.favored-class-hp': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'maxHP += cl.level;',
    replace: 'maxHP += cl.level + 1;',
  },
  'pf1e.L7.favored-class-skill': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'favoredClassSkillBonus += cl.level;',
    replace: 'favoredClassSkillBonus += cl.level + 1;',
  },
  'pf1e.L8.apply-damage': {
    file: 'src/systems/pf1e/engine.ts',
    find: 'hp.current = Math.max(0, hp.current - remaining);',
    replace: 'hp.current = Math.max(1, hp.current - remaining);',
  },
  'pf2e.L1.ability-mod': {
    file: 'src/utils/math.ts',
    find: 'Math.floor((score - 10) / 2)',
    replace: 'Math.floor((score - 11) / 2)',
  },
  'pf2e.L2.ac': {
    file: 'src/utils/armorClass.ts',
    find: 'ac = 10 + dexMod + proficiencyBonus;',
    replace: 'ac = 11 + dexMod + proficiencyBonus;',
  },
  'pf2e.L2.ac-clumsy': {
    file: 'src/rules/conditions/pf2eConditions.ts',
    find: "clumsy: { kind: 'abilities', abilities: ['dex'] }",
    replace: "clumsy: { kind: 'abilities', abilities: ['con'] }",
  },
  'pf2e.L2.saves': {
    file: 'src/systems/pf2e/engine.ts',
    find: 'save.total = profTotal(data.level, save.tier);',
    replace: 'save.total = profTotal(data.level, save.tier) + 1;',
  },
  'pf2e.L2.perception': {
    file: 'src/systems/pf2e/engine.ts',
    find: 'modifier = abilityMod(d.baseAttributes.wis ?? 10) + d.perceptionProficiency.total;',
    replace:
      'modifier = abilityMod(d.baseAttributes.wis ?? 10) + d.perceptionProficiency.total + 1;',
  },
  'pf2e.L2.class-spell-dc': {
    file: 'src/utils/derivedCasterMath.ts',
    find: 'return 10 + proficiencyTotal + abilityMod;',
    replace: 'return 11 + proficiencyTotal + abilityMod;',
  },
  'pf2e.L4.skill-check': {
    file: 'src/systems/pf2e/engine.ts',
    find: 'modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (prof?.total ?? 0);',
    replace: 'modifier = abilityMod(d.baseAttributes[attr] ?? 10) + (prof?.total ?? 0) + 1;',
  },
  'pf2e.L7.hp': {
    file: 'src/systems/pf2e/engine.ts',
    find: 'const classHitDie = Number.isFinite(parsedHitDie) ? parsedHitDie : 8;',
    replace: 'const classHitDie = Number.isFinite(parsedHitDie) ? parsedHitDie : 9;',
  },
  'pf2e.L8.valued-conditions': {
    file: 'src/rules/conditions/pf2eConditions.ts',
    find: "enfeebled: { kind: 'abilities', abilities: ['str'] }",
    replace: "enfeebled: { kind: 'abilities', abilities: ['con'] }",
  },
  'pf2e.L8.apply-damage': {
    file: 'src/systems/pf2e/engine.ts',
    find: 'hp.current = Math.max(0, hp.current - remaining);',
    replace: 'hp.current = Math.max(0, hp.current - remaining - 1);',
  },
  'pf2e.L5.spell-slots': {
    file: 'src/utils/classSpellcasting.ts',
    find: 'const max = Math.max(0, maxes[level] ?? 0);',
    replace: 'const max = Math.max(0, maxes[level] ?? 0) + 1;',
  },
  'pf2e.L5.focus-points': {
    file: 'src/data/pathfinder/2e/classes/wizard.ts',
    find: "maxFormula: '1'",
    replace: "maxFormula: '2'",
  },
  'pf2e.L5.heightening': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'Math.ceil(characterLevel / 2)',
    replace: 'Math.ceil(characterLevel / 3)',
  },
  'pf2e.L6.bulk': {
    file: 'src/utils/derivedCombatMath.ts',
    find: 'return { encumbered: strMod + 5, max: strMod + 10 };',
    replace: 'return { encumbered: strMod + 6, max: strMod + 10 };',
  },
  'pf2e.L8.shield-block': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'return Math.max(0, damage - Math.max(0, hardness));',
    replace: 'return Math.max(0, damage - Math.max(0, hardness) + 1);',
  },
  'pf2e.L7.hero-points': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'PF2E_HERO_POINTS_AT_SESSION_START = 1;',
    replace: 'PF2E_HERO_POINTS_AT_SESSION_START = 2;',
  },
  'pf2e.L8.dying-on-knockout': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'return (fromCriticalHit ? 2 : 1) + Math.max(0, Math.floor(wounded));',
    replace: 'return (fromCriticalHit ? 3 : 1) + Math.max(0, Math.floor(wounded));',
  },
  'pf2e.L8.dying-recovery': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'return 10 + Math.max(0, Math.floor(dying));',
    replace: 'return 11 + Math.max(0, Math.floor(dying));',
  },
  'pf2e.L8.wounded-track': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'return Math.max(0, Math.floor(wounded)) + 1;',
    replace: 'return Math.max(0, Math.floor(wounded)) + 2;',
  },
  'pf2e.L10.creature-xp': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: '[0, 40]',
    replace: '[0, 41]',
  },
  'pf2e.L10.encounter-budget': {
    file: 'src/systems/pf2e/derivedMath.ts',
    find: 'const base = Math.max(0, Math.floor(partySize)) * 20;',
    replace: 'const base = Math.max(0, Math.floor(partySize)) * 21;',
  },
  'mam3e.L1.initiative': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'agility + 4 * Math.max(0, Math.floor(improvedInitiativeRank))',
    replace: 'agility + 5 * Math.max(0, Math.floor(improvedInitiativeRank))',
  },
  'mam3e.L7.starting-power-points': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 15 * Math.max(0, Math.floor(powerLevel));',
    replace: 'return 16 * Math.max(0, Math.floor(powerLevel));',
  },
  'mam3e.L10.equipment-points': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 5 * Math.max(0, Math.floor(advantageRank));',
    replace: 'return 6 * Math.max(0, Math.floor(advantageRank));',
  },
  'mam3e.L7.hero-points': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 1 + Math.max(0, Math.floor(complicationsActivated));',
    replace: 'return 2 + Math.max(0, Math.floor(complicationsActivated));',
  },
  'mam3e.L2.defense-totals': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'data.defenses.dodge.total = data.abilities.agi + data.defenses.dodge.rank;',
    replace: 'data.defenses.dodge.total = data.abilities.agi + data.defenses.dodge.rank + 1;',
  },
  'mam3e.L2.toughness-power-bonus': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'data.defenses.toughness.total += rank;',
    replace: 'data.defenses.toughness.total += rank + 1;',
  },
  'mam3e.L4.skill-total': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'total: skill.rank + abilityRank,',
    replace: 'total: skill.rank + abilityRank + 1,',
  },
  'mam3e.L8.toughness-failure-track': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (failureMargin >= 15) {',
    replace: 'if (failureMargin >= 16) {',
  },
  'mam3e.L9.cost-abilities': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'abilityCost += rank * 2;',
    replace: 'abilityCost += rank * 3;',
  },
  'mam3e.L9.cost-defenses': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'data.powerPoints.spent.defenses = defenseRankCost;',
    replace: 'data.powerPoints.spent.defenses = defenseRankCost + 1;',
  },
  'mam3e.L9.cost-skills': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'data.powerPoints.spent.skills = Math.ceil(totalSkillRanks / 2);',
    replace: 'data.powerPoints.spent.skills = Math.ceil(totalSkillRanks / 3);',
  },
  'mam3e.L9.cost-advantages': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'advantageCost += adv.rank != null && adv.rank > 0 ? adv.rank : 1;',
    replace: 'advantageCost += adv.rank != null && adv.rank > 0 ? adv.rank + 1 : 1;',
  },
  'mam3e.L9.power-cost': {
    file: 'src/systems/mam3e/powerMath.ts',
    find: 'Math.round(costPerRank * rank * 100)',
    replace: 'Math.round((costPerRank * rank + 1) * 100)',
  },
  'mam3e.L9.pl-cap-dodge-toughness': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (dodgeTough > plLimit) {',
    replace: 'if (dodgeTough > plLimit + 100) {',
  },
  'mam3e.L9.pl-cap-fortitude-will': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (fortWill > plLimit) {',
    replace: 'if (fortWill > plLimit + 100) {',
  },
  'mam3e.L9.pl-cap-parry-toughness': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (parryTough > plLimit) {',
    replace: 'if (parryTough > plLimit + 100) {',
  },
  'mam3e.L9.pl-cap-close-attack': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (closeAttackEffect > plLimit) {',
    replace: 'if (closeAttackEffect > plLimit + 100) {',
  },
  'mam3e.L9.pl-cap-ranged-attack': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (rangedAttackEffect > plLimit) {',
    replace: 'if (rangedAttackEffect > plLimit + 100) {',
  },
  'mam3e.L9.pl-cap-perception': {
    file: 'src/systems/mam3e/engine.ts',
    find: 'if (perceptionEffectRank > data.powerLevel) {',
    replace: 'if (perceptionEffectRank > data.powerLevel + 100) {',
  },
  'mam3e.L9.pp-budget-conservation': {
    file: 'src/systems/mam3e/powerMath.ts',
    find: 'return spent.abilities + spent.powers + spent.advantages + spent.skills + spent.defenses;',
    replace:
      'return spent.abilities + spent.powers + spent.advantages + spent.skills + spent.defenses + 1;',
  },
  'mam3e.L10.measurements-track': {
    file: 'src/systems/mam3e/powerMath.ts',
    find: 'return rank0Value * 2 ** rank;',
    replace: 'return rank0Value * 2 ** (rank + 1);',
  },
  'daggerheart.L1.ancestry-adjustments': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'giant: { evasion: 0, hitPoints: 1, stress: 0 },',
    replace: 'giant: { evasion: 0, hitPoints: 2, stress: 0 },',
  },
  'daggerheart.L2.evasion': {
    file: 'src/rules/daggerheartDerived.ts',
    find: ': system.evasion;',
    replace: ': system.evasion + 1;',
  },
  'daggerheart.L2.armor-score': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'const armorMax = Math.max(0, Math.min(12, armorScoreBase + armorScoreBonus));',
    replace: 'const armorMax = Math.max(1, Math.min(12, armorScoreBase + armorScoreBonus));',
  },
  'daggerheart.L2.major-threshold': {
    file: 'src/rules/daggerheartDerived.ts',
    find: ': (unarmoredBaseOverride?.majorThreshold ?? system.level);',
    replace: ': (unarmoredBaseOverride?.majorThreshold ?? system.level + 1);',
  },
  'daggerheart.L2.severe-threshold': {
    file: 'src/rules/daggerheartDerived.ts',
    find: ': (unarmoredBaseOverride?.severeThreshold ?? system.level * 2);',
    replace: ': (unarmoredBaseOverride?.severeThreshold ?? system.level * 3);',
  },
  'daggerheart.L2.passive-bonuses': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'evasion: (total.evasion || 0) + (next.evasion || 0),',
    replace: 'evasion: (total.evasion || 0) + (next.evasion || 0) + 1,',
  },
  'daggerheart.L1.effective-attribute': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return (system.attributes[trait] || 0) + passive;',
    replace: 'return (system.attributes[trait] || 0) + passive + 1;',
  },
  'daggerheart.L7.tracks': {
    file: 'src/systems/daggerheart/engine.ts',
    find: 'hp.current = Math.min(hp.max, hp.current + amount);',
    replace: 'hp.current = Math.min(hp.max, hp.current + amount + 1);',
  },
  'daggerheart.L8.hp-marked': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'if (damage >= majorThreshold) return 2;',
    replace: 'if (damage > majorThreshold) return 2;',
  },
  'daggerheart.L8.duality-outcome': {
    file: 'src/rules/daggerheartDerived.ts',
    find: "return hopeDie > fearDie ? 'hope' : 'fear';",
    replace: "return hopeDie < fearDie ? 'hope' : 'fear';",
  },
  'daggerheart.L8.massive-damage': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'if (options?.massiveDamage && damage >= severeThreshold * 2) return 4;',
    replace: 'if (options?.massiveDamage && damage >= severeThreshold * 3) return 4;',
  },
  'daggerheart.L8.resistance-immunity': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'const reduced = options.resistant ? Math.floor(damage / 2) : damage;',
    replace: 'const reduced = options.resistant ? Math.floor(damage / 3) : damage;',
  },
  'daggerheart.L8.armor-slot-reduction': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return Math.max(0, baseHpMarked - Math.max(0, Math.floor(armorSlotsMarked)));',
    replace: 'return Math.max(0, baseHpMarked - 2 * Math.max(0, Math.floor(armorSlotsMarked)));',
  },
  'daggerheart.L1.experience-bonus': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return DAGGERHEART_EXPERIENCE_BASE_BONUS + Math.max(0, Math.floor(increases));',
    replace: 'return DAGGERHEART_EXPERIENCE_BASE_BONUS + Math.max(0, Math.floor(increases)) + 1;',
  },
  'daggerheart.L1.starting-trait-array': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return [2, 1, 1, 0, 0, -1];',
    replace: 'return [2, 1, 1, 0, 0, 0];',
  },
  'daggerheart.L7.starting-hope': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'DAGGERHEART_STARTING_HOPE = 2;',
    replace: 'DAGGERHEART_STARTING_HOPE = 3;',
  },
  'daggerheart.L10.gold-denominations': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return Math.max(0, handfuls) + 10 * Math.max(0, bags) + 100 * Math.max(0, chests);',
    replace: 'return Math.max(0, handfuls) + 11 * Math.max(0, bags) + 100 * Math.max(0, chests);',
  },
  'daggerheart.L6.range-squares': {
    file: 'src/rules/daggerheartDerived.ts',
    find: "case 'very-far':\n      return 13;",
    replace: "case 'very-far':\n      return 14;",
  },
  'daggerheart.L7.short-rest-recovery': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return Math.max(0, Math.floor(d4Roll)) + Math.max(0, Math.floor(tier));',
    replace: 'return Math.max(0, Math.floor(d4Roll)) + Math.max(0, Math.floor(tier)) + 1;',
  },
  'daggerheart.L7.stress-vulnerable': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return currentStress >= maxStress;',
    replace: 'return currentStress > maxStress;',
  },
  'daggerheart.L8.death-moves': {
    file: 'src/rules/daggerheartDerived.ts',
    find: 'return { survives: true, clears: hopeDie };',
    replace: 'return { survives: true, clears: hopeDie + 1 };',
  },
};
