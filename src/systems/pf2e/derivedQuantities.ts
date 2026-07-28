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
 * derivedCasterMath, data-model's profTotal, and derivedMath's death-track
 * functions); this file only wires them into the declarative layer. Per RFC 003
 * the SHARED thing is the mechanism, not the formula: PF2e's level + tier
 * proficiency and Bulk math stay first-class here.
 *
 * The L8 death-track entries below mirror the PF1e pattern (pf1e/
 * derivedQuantities.ts wiring pf1e/derivedMath.ts): the cited pure helpers in
 * ./derivedMath already carry compute-register rows and unit tests, and these
 * declarations are what make the engine actually COMPUTE them into
 * `system.derived` and let the sheet surface them. They are additive — every
 * pre-existing quantity keeps its exact value.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import { abilityMod } from '../../utils/math';
import { pf2eAutoHeightenRank, pf2eBulkLimits } from '../../utils/derivedCombatMath';
import { pf2eClassOrSpellDC } from '../../utils/derivedCasterMath';
import { resolvePf2eArmorClass } from '../../rules';
import { resolvePf2eCheckPenalty } from '../../rules/conditions/pf2eConditions';
import { pf2eInitialDying, pf2eRecoveryCheckDC, pf2eWoundedAfterRecovery } from './derivedMath';
import { profTotal, type Pf2eDataModel, type Pf2eProficiencyTier } from './data-model';

/** Build a full ability-score block from partial overrides (defaults are 10). */
function attrs(overrides: Partial<Record<string, number>>): Record<string, number> {
  return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ...overrides };
}

/**
 * Current magnitude of a valued condition (0 when absent). Matches the shared
 * condition reader in rules/conditions/pf2eConditions: name-insensitive match,
 * a missing `value` counts as 1, and the highest duplicate wins.
 */
function conditionValue(system: Pf2eDataModel, name: string): number {
  let highest = 0;
  for (const condition of system.conditions) {
    if (condition.name.toLowerCase() !== name) continue;
    const magnitude = condition.value != null ? condition.value : 1;
    if (magnitude > highest) highest = magnitude;
  }
  return highest;
}

/** True while the character is on the death track (dying or wounded present). */
function onDeathTrack(system: Pf2eDataModel): boolean {
  return conditionValue(system, 'dying') > 0 || conditionValue(system, 'wounded') > 0;
}

/** Strength modifier from the (unprepared) ability-score block. */
function strMod(system: Pf2eDataModel): number {
  return abilityMod(system.baseAttributes.str ?? 10);
}

/**
 * FULL Armor Class. Faithful to the engine's prepareData BY CONSTRUCTION: this
 * calls the very same shared composition (`resolvePf2eArmorClass`,
 * rules/compile/armorClass) the engine calls — base formula seeds a `set` on
 * 'ac', the equipped magic-item / feat / feature AC effects layer on through the
 * resolver, and the single worst Dex-scoped status penalty
 * (frightened/sickened/clumsy) is subtracted — so `compute() === data.armorClass`
 * is no longer a claim two copies have to keep agreeing on. The armor
 * proficiency total is recomputed from its tier (profTotal, PF2e-local), matching
 * what the engine's prepareData stores, so the compute works on both prepared and
 * default data.
 *
 * The status penalty is resolved through the SAME shared fold the engine uses
 * (`collectPf2eCheckConditionEffects` → resolver `pf2e-status` bucket), not a
 * second scalar read.
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
  return resolvePf2eArmorClass(
    system,
    profTotal(system.level, armorTier),
    resolvePf2eCheckPenalty(system.conditions, 'dex')
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
    // Surfaced as a read-only card in the generic derived-stats strip, consistent
    // with AC / Bulk / Auto-Heighten. The Pf2eOverview additionally keeps an
    // INTERACTIVE Class DC tile whose proficiency badge cycles the tier (the same
    // pattern as Perception): the strip is the canonical scalar readout, the
    // Overview tile is the editor for the proficiency rank.
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
    display: {
      label: 'Class DC',
      icon: 'Swords',
      hint: '10 + key ability + proficiency',
    },
  },
  {
    // L8 death track. compute() calls the cited helper in ./derivedMath (the one
    // the pf2e.L8.dying-on-knockout register row already pins), reading the
    // character's CURRENT wounded value — the non-critical case, which is the
    // standing scalar; the `fromCriticalHit` doubling is the situational input
    // the hint names, exactly as pf1e.L5.concentration-dc declares the 0-level
    // base and scales in its hint.
    id: 'pf2e.L8.dying-on-knockout',
    layer: 'L8',
    quantity: 'Dying value gained on being knocked out',
    formula: '(critical hit ? 2 : 1) + current wounded value',
    source: 'PF2e Core Rulebook (OGC): Hit Points, Healing, and Dying — Dying',
    compute: (s) => pf2eInitialDying(false, conditionValue(s, 'wounded')),
    cases: [
      { name: 'no wounded → dying 1', system: {}, expected: 1 },
      {
        name: 'wounded 2 adds on top → dying 3',
        system: { conditions: [{ id: 'wounded', name: 'Wounded', value: 2 }] },
        expected: 3,
      },
      {
        name: 'valueless wounded counts as 1 → dying 2',
        system: { conditions: [{ id: 'wounded', name: 'Wounded' }] },
        expected: 2,
      },
    ],
    display: {
      label: 'Dying on Knockout',
      icon: 'Skull',
      hint: '1 (2 from a critical hit) + wounded — shown while on the death track',
      visible: onDeathTrack,
    },
  },
  {
    id: 'pf2e.L8.dying-recovery',
    layer: 'L8',
    quantity: 'Recovery check flat DC',
    formula: 'recovery DC = 10 + current dying value',
    source: 'PF2e Core Rulebook (OGC): Hit Points, Healing, and Dying — Dying/Recovery',
    compute: (s) => pf2eRecoveryCheckDC(conditionValue(s, 'dying')),
    cases: [
      { name: 'not dying → base flat DC 10', system: {}, expected: 10 },
      {
        name: 'dying 1 → DC 11',
        system: { conditions: [{ id: 'dying', name: 'Dying', value: 1 }] },
        expected: 11,
      },
      {
        name: 'dying 3 → DC 13',
        system: { conditions: [{ id: 'dying', name: 'Dying', value: 3 }] },
        expected: 13,
      },
    ],
    display: {
      label: 'Recovery DC',
      icon: 'HeartPulse',
      hint: '10 + dying value — flat check at the start of your turn while dying',
      visible: onDeathTrack,
    },
  },
  {
    // Standing scalar, DISPLAY-LESS (the same call pf1e.L3.bab-sum makes): the
    // number only means anything at the moment the dying condition is removed,
    // so it is computed into `derived` for the death-track consumers rather than
    // rendered as a third card next to the two above.
    id: 'pf2e.L8.wounded-track',
    layer: 'L8',
    quantity: 'Wounded value after recovering from dying',
    formula: 'wounded += 1 each time the dying condition is removed',
    source: 'PF2e Core Rulebook (OGC): Hit Points, Healing, and Dying — Wounded',
    compute: (s) => pf2eWoundedAfterRecovery(conditionValue(s, 'wounded')),
    cases: [
      { name: 'no wounded → recovering leaves wounded 1', system: {}, expected: 1 },
      {
        name: 'wounded 1 → recovering leaves wounded 2',
        system: { conditions: [{ id: 'wounded', name: 'Wounded', value: 1 }] },
        expected: 2,
      },
      {
        name: 'wounded 3 → recovering leaves wounded 4',
        system: { conditions: [{ id: 'wounded', name: 'Wounded', value: 3 }] },
        expected: 4,
      },
    ],
  },
];
