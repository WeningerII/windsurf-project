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

  // ── mam3e ──
  'mam3e.L3.attack-dc': {
    file: 'src/systems/mam3e/derivedMath.ts',
    find: 'return 10 + activeDefense;',
    replace: 'return 11 + activeDefense;',
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
};
