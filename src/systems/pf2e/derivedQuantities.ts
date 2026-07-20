/**
 * Pathfinder 2e declared derived quantities.
 *
 * Each entry is the single source of truth for a standing numeric quantity: the
 * engine computes it (via `applyDerivedQuantities` in prepareData), the sheet
 * surfaces it (the generic derived-stats cards), and one generic test plus the
 * compute register's mutation gate verify it — all from this one declaration.
 * Adding a quantity here needs no new engine, sheet, or test code.
 *
 * The `compute`s reuse the existing cited pure helpers (derivedCombatMath,
 * derivedCasterMath, data-model's profTotal); this file only wires them into the
 * declarative layer. Per RFC 003 the SHARED thing is the mechanism, not the
 * formula: PF2e's level + tier proficiency and Bulk math stay first-class here.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import { abilityMod } from '../../utils/math';
import { pf2eAutoHeightenRank, pf2eBulkLimits } from '../../utils/derivedCombatMath';
import { pf2eClassOrSpellDC } from '../../utils/derivedCasterMath';
import { resolveCharacterEffects, computePf2eAC } from '../../rules';
import { getPf2eConditionStatusPenalty } from '../../rules/conditions/pf2eConditions';
import { profTotal, type Pf2eDataModel, type Pf2eProficiencyTier } from './data-model';

/** Build a full ability-score block from partial overrides (defaults are 10). */
function attrs(overrides: Partial<Record<string, number>>): Record<string, number> {
  return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ...overrides };
}

/** Strength modifier from the (unprepared) ability-score block. */
function strMod(system: Pf2eDataModel): number {
  return abilityMod(system.baseAttributes.str ?? 10);
}

/**
 * FULL Armor Class, faithful to the engine's prepareData: the base formula
 * computePf2eAC(dex, armor proficiency, equipment) seeds a `set` on 'ac', the
 * equipped magic-item / feat / feature AC effects layer on through the resolver,
 * and the single worst Dex-scoped status penalty (frightened/sickened/clumsy) is
 * subtracted — so compute() === data.armorClass exactly. The armor proficiency
 * total is recomputed from its tier (profTotal), matching what the engine's
 * prepareData stores, so the compute works on both prepared and default data.
 *
 * MUTATION-VERIFIABLE: an unarmored case with no bonus-bearing gear reduces to
 * the anchored base `ac = 10 + dexMod + proficiencyBonus` in defense.ts, so the
 * pf2e.L2.ac mutation flips it. (The clumsy status penalty rides on
 * pf2eConditions.ts — its own anchor, pf2e.L2.ac-clumsy — not on this base.)
 */
function armorClass(system: Pf2eDataModel): number {
  const equippedArmor = system.equipment.find(
    (e) => e.equipped && e.armorClass != null && !e.shieldBonus
  );
  const armorCategory = equippedArmor?.armorType ?? 'unarmored';
  const armorTier =
    system.armorProficiencies[armorCategory]?.tier ??
    system.armorProficiencies.unarmored?.tier ??
    'untrained';
  const armorProf = profTotal(system.level, armorTier);
  const base = computePf2eAC(system.baseAttributes.dex ?? 10, armorProf, system.equipment);
  const acStatusPenalty = getPf2eConditionStatusPenalty(system.conditions, 'dex');
  return (
    resolveCharacterEffects('pf2e', {
      equipment: system.equipment.filter((item) => item.equipped),
      feats: system.feats,
      features: system.features,
      baseArmorClass: base,
    }).bonus('ac') - acStatusPenalty
  );
}

export const PF2E_DERIVED_QUANTITIES: ReadonlyArray<DerivedQuantitySpec<Pf2eDataModel>> = [
  {
    // FAITHFUL + MUTATION-VERIFIABLE (register-anchored, single scalar). compute()
    // reproduces the resolver fold minus the status penalty, so it equals
    // data.armorClass; the unarmored cases hit the anchored base branch
    // `ac = 10 + dexMod + proficiencyBonus` (pf2e.L2.ac) and flip under mutation.
    id: 'pf2e.L2.ac',
    layer: 'L2',
    quantity: 'Armor Class',
    formula:
      '10 + Dex mod (capped) + armor proficiency + armor item bonus, + magic/feat AC bonuses − worst Dex status penalty',
    source: 'PF2e Core Rulebook (OGC): Armor Class',
    compute: armorClass,
    cases: [
      { name: 'unarmored trained, Dex 10, level 1 → 13', system: {}, expected: 13 },
      {
        name: 'unarmored trained, Dex 18 (+4), level 1 → 17',
        system: { baseAttributes: attrs({ dex: 18 }) },
        expected: 17,
      },
      {
        name: 'light armor (+2) trained, Dex 14 (+2), level 1 → 17 (full AC incl. armor)',
        system: {
          baseAttributes: attrs({ dex: 14 }),
          armorProficiencies: {
            unarmored: { tier: 'trained', total: 0 },
            light: { tier: 'trained', total: 0 },
            medium: { tier: 'untrained', total: 0 },
            heavy: { tier: 'untrained', total: 0 },
          },
          equipment: [
            {
              itemId: 'leather',
              name: 'Leather Armor',
              bulk: 1,
              equipped: true,
              armorClass: 2,
              armorType: 'light',
            },
          ],
        },
        expected: 17,
      },
      {
        name: 'clumsy 1 subtracts a status penalty: unarmored trained, Dex 10, level 1 → 12',
        system: { conditions: [{ id: 'clumsy', name: 'Clumsy', value: 1 }] },
        expected: 12,
      },
    ],
    display: {
      label: 'AC',
      icon: 'Shield',
      hint: '10 + Dex + proficiency + armor − status',
    },
  },
  {
    id: 'pf2e.L6.bulk',
    layer: 'L6',
    quantity: 'Encumbered Bulk threshold',
    formula: 'Strength modifier + 5 (Bulk)',
    source: 'PF2e Core Rulebook (OGC): Bulk',
    compute: (s) => pf2eBulkLimits(strMod(s)).encumbered,
    cases: [
      {
        name: 'Str 10 (mod +0) → encumbered at 5 Bulk',
        system: { baseAttributes: attrs({ str: 10 }) },
        expected: 5,
      },
      {
        name: 'Str 18 (mod +4) → encumbered at 9 Bulk',
        system: { baseAttributes: attrs({ str: 18 }) },
        expected: 9,
      },
      {
        name: 'Str 8 (mod -1) → encumbered at 4 Bulk (negative mod)',
        system: { baseAttributes: attrs({ str: 8 }) },
        expected: 4,
      },
    ],
    display: {
      label: 'Encumbered',
      icon: 'Weight',
      format: (v) => `${v} Bulk`,
      hint: 'Str mod + 5',
    },
  },
  {
    id: 'pf2e.L6.bulk-max',
    layer: 'L6',
    quantity: 'Maximum Bulk',
    formula: 'Strength modifier + 10 (Bulk)',
    source: 'PF2e Core Rulebook (OGC): Bulk',
    compute: (s) => pf2eBulkLimits(strMod(s)).max,
    cases: [
      {
        name: 'Str 10 (mod +0) → max 10 Bulk',
        system: { baseAttributes: attrs({ str: 10 }) },
        expected: 10,
      },
      {
        name: 'Str 18 (mod +4) → max 14 Bulk',
        system: { baseAttributes: attrs({ str: 18 }) },
        expected: 14,
      },
      {
        name: 'Str 8 (mod -1) → max 9 Bulk (negative mod)',
        system: { baseAttributes: attrs({ str: 8 }) },
        expected: 9,
      },
    ],
    display: {
      label: 'Max Bulk',
      icon: 'Weight',
      format: (v) => `${v} Bulk`,
      hint: 'Str mod + 10',
    },
  },
  {
    id: 'pf2e.L5.heightening',
    layer: 'L5',
    quantity: 'Auto-heighten spell rank',
    formula: 'ceil(character level / 2)',
    source: 'PF2e Core Rulebook (OGC): Heightening Spells',
    compute: (s) => pf2eAutoHeightenRank(s.level),
    cases: [
      { name: 'level 1 → rank 1', system: { level: 1 }, expected: 1 },
      { name: 'level 10 → rank 5', system: { level: 10 }, expected: 5 },
      { name: 'level 20 → rank 10', system: { level: 20 }, expected: 10 },
    ],
    display: {
      label: 'Auto-Heighten',
      icon: 'Sparkles',
      hint: 'ceil(level / 2)',
    },
  },
  {
    // Class DC = 10 + key ability mod + class-DC proficiency total (level + tier).
    // Standing scalar: computed and registered here, but NOT surfaced via the
    // generic cards — the Overview already renders a dedicated Class DC card with
    // its own proficiency-badge cycling, so this omits `display`.
    id: 'pf2e.L2.class-spell-dc',
    layer: 'L2',
    quantity: 'Class DC',
    formula: '10 + key ability modifier + profTotal(level, class DC tier)',
    source: 'PF2e Core Rulebook (OGC): Class DC',
    compute: (s) => {
      const tier: Pf2eProficiencyTier = s.classDcProficiency?.tier ?? 'trained';
      const keyScore = s.keyAbility ? (s.baseAttributes[s.keyAbility] ?? 10) : 10;
      return pf2eClassOrSpellDC(profTotal(s.level, tier), abilityMod(keyScore));
    },
    cases: [
      {
        name: 'trained, no key ability, level 1 → 13',
        system: {},
        expected: 13,
      },
      {
        name: 'Str key ability 18, expert at level 5 → 23',
        system: {
          level: 5,
          keyAbility: 'str',
          baseAttributes: attrs({ str: 18 }),
          classDcProficiency: { tier: 'expert', total: 0 },
        },
        expected: 23,
      },
      {
        name: 'untrained class-DC proficiency contributes 0 (Dex 14, level 5) → 12',
        system: {
          level: 5,
          keyAbility: 'dex',
          baseAttributes: attrs({ dex: 14 }),
          classDcProficiency: { tier: 'untrained', total: 0 },
        },
        expected: 12,
      },
    ],
  },
];
