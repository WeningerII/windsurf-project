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
    file: 'src/systems/dnd5e/shared/engine.ts',
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
    find: 'return 3;',
    replace: 'return 2;',
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
    file: 'src/rules/combatants/characterCombatant.ts',
    find: '/^extra-attack(-\\d+)?$/',
    replace: '/^extra-attackXX(-\\d+)?$/',
  },

  // ── dnd-5e-2024 (reuses the shared 5e leaf helpers) ──
  'dnd5e2024.L1.ability-mod': {
    file: 'src/utils/math.ts',
    find: 'Math.floor((score - 10) / 2)',
    replace: 'Math.floor((score - 11) / 2)',
  },
  'dnd5e2024.L1.proficiency-bonus': {
    file: 'src/systems/dnd5e/shared/engine.ts',
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

  // ── dnd-3.5e ──
  'dnd35e.L1.save-progression': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: "if (quality === 'good') return 2 + Math.floor(level / 2);",
    replace: "if (quality === 'good') return 3 + Math.floor(level / 2);",
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
    find: "if (progression === 'full') return level;",
    replace: "if (progression === 'full') return level + 1;",
  },
  // Grapple = BAB + Str mod + size mod (3.5e engine leaf).
  'dnd35e.L3.grapple': {
    file: 'src/systems/dnd35e/engine.ts',
    find: 'data.grapple = totalBAB + strMod + grappleSizeMod;',
    replace: 'data.grapple = totalBAB + strMod + grappleSizeMod + 1;',
  },

  // ── pf1e (shares d20 helpers + legacy AC with 3.5e) ──
  'pf1e.L2.ac': {
    file: 'src/utils/armorClass.ts',
    find: 'const total = 10 + armorBonus + shieldBonus + effectiveDex + sizeMod;',
    replace: 'const total = 11 + armorBonus + shieldBonus + effectiveDex + sizeMod;',
  },
  'pf1e.L1.save-progression': {
    file: 'src/systems/shared/d20-helpers.ts',
    find: "if (quality === 'good') return 2 + Math.floor(level / 2);",
    replace: "if (quality === 'good') return 3 + Math.floor(level / 2);",
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
    find: "if (progression === 'full') return level;",
    replace: "if (progression === 'full') return level + 1;",
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

  // ── pf2e ──
  'pf2e.L8.degrees-of-success': {
    file: 'src/utils/pf2eDegree.ts',
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
    file: 'src/utils/daggerheartDerived.ts',
    find: 'if (level >= 8) {',
    replace: 'if (level >= 9) {',
  },
  // proficiency == tier (getDaggerheartProficiency delegates to getDaggerheartTier),
  // so the tier mutation breaks the shared "tier and proficiency" test for both.
  'daggerheart.L1.proficiency': {
    file: 'src/utils/daggerheartDerived.ts',
    find: 'if (level >= 8) {',
    replace: 'if (level >= 9) {',
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
    file: 'src/utils/daggerheartDerived.ts',
    find: 'return rolledTotal + Math.max(0, diceCount) * Math.max(0, dieSize);',
    replace: 'return rolledTotal + Math.max(0, diceCount) * Math.max(0, dieSize) + 1;',
  },
  'daggerheart.L3.spellcast-damage-dice': {
    file: 'src/utils/daggerheartDerived.ts',
    find: 'return Math.max(0, spellcastTrait);',
    replace: 'return Math.max(0, spellcastTrait) + 1;',
  },
};
