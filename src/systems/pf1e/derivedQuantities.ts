/**
 * Pathfinder 1e declared derived quantities.
 *
 * Each entry is the single source of truth for a standing numeric quantity: the
 * engine computes it (via `applyDerivedQuantities` in prepareData), the shared
 * d20-legacy sheet surfaces it (the generic derived-stats cards), and one
 * generic test plus the compute register's mutation gate verify it — all from
 * this one declaration. Adding a quantity here needs no new engine, sheet, or
 * test code.
 *
 * The `compute`s reuse the existing cited pure helpers (the shared d20 classBAB
 * aggregation, pf1eMaxSkillRanks, and pf1e derivedMath's feat cadence); this
 * file only wires them into the declarative layer. Per RFC 003 the SHARED thing
 * is the mechanism, not the formula: PF1e diverges from 3.5e (max ranks = level,
 * a feat every odd level) and each divergence stays first-class here.
 *
 * ARMOR CLASS is declared here as THREE scalar specs (the shape forbids tuples),
 * all DISPLAY-LESS: the shared d20-legacy combat header (D20CombatSection) already
 * renders AC / touch / flat-footed, so — exactly like `bab-sum` above — these
 * compute (and, for `ac.total`, register-verify) without a `display` card, which
 * avoids a double-render on the derived strip.
 *   - `ac.total` reproduces the engine's resolver fold — the shared base formula
 *     computeD20LegacyAC(...).total seeds a `set` on 'ac' and the magic/feat/
 *     equipment AC effects add on top (resolveCharacterEffects(...).bonus('ac')),
 *     so compute() === data.armorClass.total (faithful). With no bonus-bearing
 *     gear it reduces to the base formula, so mutating defense.ts flips a case
 *     (mutation-verifiable) — this is the register-anchored quantity.
 *   - `ac.touch` / `ac.flat-footed` are PURE (computeD20LegacyAC(...).touch /
 *     .flatFooted): no resolver bonuses and no compute-register row.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import { classBAB } from '../shared/d20-helpers';
import { resolveCharacterEffects, computeD20LegacyAC } from '../../rules';
import { pf1eMaxSkillRanks } from '../../utils/derivedCombatMath';
import { pf1eConcentrationDCDefensive, pf1eFeatsFromLevel, pf1eWealthByLevel } from './derivedMath';
import type { Pf1eDataModel } from './data-model';

/** Total base attack bonus: sum each class's BAB track across all class levels. */
function totalBaseAttackBonus(system: Pf1eDataModel): number {
  return system.classLevels.reduce((sum, cl) => sum + classBAB(cl.level, cl.bab), 0);
}

/** Build a full ability-score block from partial overrides (defaults are 10). */
function attrs(overrides: Partial<Record<string, number>>): Record<string, number> {
  return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ...overrides };
}

/**
 * FULL Armor Class total, faithful to the engine's prepareData: the shared base
 * formula (computeD20LegacyAC(...).total) seeds a `set` on 'ac' and the equipped
 * magic-item / feat / feature AC effects layer on through the resolver, so this
 * equals data.armorClass.total exactly. With no bonus-bearing gear it collapses
 * to the base formula, so mutating the anchored defense.ts `total` line flips a
 * no-gear case red — keeping the migrated register row mutation-verifiable.
 */
function armorClassTotal(system: Pf1eDataModel): number {
  const ac = computeD20LegacyAC(
    system.baseAttributes.dex ?? 10,
    system.sizeCategory,
    system.equipment
  );
  return resolveCharacterEffects('pf1e', {
    equipment: system.equipment.filter((item) => item.equipped),
    feats: system.feats,
    features: system.features,
    baseArmorClass: ac.total,
  }).bonus('ac');
}

export const PF1E_DERIVED_QUANTITIES: ReadonlyArray<DerivedQuantitySpec<Pf1eDataModel>> = [
  {
    // Standing scalar: computed and registered, but NOT surfaced via the generic
    // cards — the shared d20-legacy combat header already renders a dedicated BAB
    // stat (with its iterative-attack breakdown), so this omits `display`.
    id: 'pf1e.L3.bab-sum',
    layer: 'L3',
    quantity: 'Total BAB (multiclass sum)',
    formula: 'sum(classBAB(level, track)) across class levels',
    source: 'PF1e Core Rulebook (OGC): Combat — Attack Bonus',
    compute: totalBaseAttackBonus,
    cases: [
      {
        name: 'single full-BAB class: BAB equals level',
        system: {
          classLevels: [
            {
              classId: 'fighter',
              level: 5,
              hitDieRolls: [],
              bab: 'full',
              fortSave: 'good',
              refSave: 'poor',
              willSave: 'poor',
              skillPointsPerLevel: 2,
              favoredClassBonus: 'hp',
            },
          ],
        },
        expected: 5,
      },
      {
        name: 'multiclass sums each class track: fighter 6 (full) + wizard 4 (half) = 8',
        system: {
          classLevels: [
            {
              classId: 'fighter',
              level: 6,
              hitDieRolls: [],
              bab: 'full',
              fortSave: 'good',
              refSave: 'poor',
              willSave: 'poor',
              skillPointsPerLevel: 2,
              favoredClassBonus: 'hp',
            },
            {
              classId: 'wizard',
              level: 4,
              hitDieRolls: [],
              bab: 'half',
              fortSave: 'poor',
              refSave: 'poor',
              willSave: 'good',
              skillPointsPerLevel: 2,
              favoredClassBonus: 'skill',
            },
          ],
        },
        expected: 8,
      },
      {
        name: 'three-quarter track floors: rogue 7 → floor(7 × 3/4) = 5',
        system: {
          classLevels: [
            {
              classId: 'rogue',
              level: 7,
              hitDieRolls: [],
              bab: 'three-quarter',
              fortSave: 'poor',
              refSave: 'good',
              willSave: 'poor',
              skillPointsPerLevel: 8,
              favoredClassBonus: 'skill',
            },
          ],
        },
        expected: 5,
      },
    ],
  },
  {
    id: 'pf1e.L4.max-rank-cap',
    layer: 'L4',
    quantity: 'Max skill ranks per skill',
    formula:
      'max ranks in a skill = character level (class skills add +3 to the bonus, not the cap)',
    source: 'PF1e Core Rulebook (OGC): Skills — Ranks',
    compute: (s) => pf1eMaxSkillRanks(s.level),
    cases: [
      { name: 'level 1 cap = 1', system: { level: 1 }, expected: 1 },
      { name: 'level 10 cap = 10', system: { level: 10 }, expected: 10 },
      { name: 'level 20 cap = 20', system: { level: 20 }, expected: 20 },
    ],
    display: { label: 'Max Skill Ranks', icon: 'GraduationCap' },
  },
  {
    id: 'pf1e.L7.feats-from-level',
    layer: 'L7',
    quantity: 'Feats gained from level',
    formula: 'one at 1st level and every odd level thereafter = ceil(level / 2)',
    source: 'PF1e Core Rulebook (OGC): Character Advancement',
    compute: (s) => pf1eFeatsFromLevel(s.level),
    cases: [
      { name: 'level 1 → 1 feat (1st)', system: { level: 1 }, expected: 1 },
      { name: 'level 5 → 3 feats (1st/3rd/5th)', system: { level: 5 }, expected: 3 },
      { name: 'level 20 → 10 feats', system: { level: 20 }, expected: 10 },
    ],
    display: { label: 'Feats', icon: 'Award' },
  },
  {
    id: 'pf1e.L5.concentration-dc',
    layer: 'L5',
    quantity: 'Defensive-casting Concentration DC',
    formula: 'defensive = 15 + 2 × spell level (while damaged = 10 + damage + spell level)',
    source: 'PF1e Core Rulebook (OGC): Magic — Concentration',
    // The DC scales with the spell level (and, for the damage flavor, in-play
    // damage), so the standing derived value is the base for a 0-level spell —
    // the floor the hint's formula scales up from. compute() calls the cited
    // defensive helper so the register's mutation anchor still bites.
    compute: () => pf1eConcentrationDCDefensive(0),
    cases: [{ name: 'base defensive DC (0-level spell) = 15', system: {}, expected: 15 }],
    display: {
      label: 'Defensive Casting DC',
      icon: 'Brain',
      hint: '15 + 2 × spell level — cast defensively to avoid an attack of opportunity (concentration check)',
    },
  },
  {
    id: 'pf1e.L10.wealth-by-level',
    layer: 'L10',
    quantity: 'Expected character wealth (gp) by level',
    formula: 'CRB "Character Wealth by Level" table (index = level − 1)',
    source: 'PF1e Core Rulebook (OGC): Character Wealth by Level',
    compute: (s) => pf1eWealthByLevel(s.level),
    cases: [
      { name: 'level 1 → 0 (use class starting wealth)', system: { level: 1 }, expected: 0 },
      { name: 'level 5 → 10,500 gp', system: { level: 5 }, expected: 10500 },
      { name: 'level 20 → 880,000 gp', system: { level: 20 }, expected: 880000 },
    ],
    display: { label: 'Wealth by Level', icon: 'Coins', format: (v) => `${v.toLocaleString()} gp` },
  },
  {
    // FAITHFUL + MUTATION-VERIFIABLE (register-anchored). compute() reproduces the
    // resolver fold so it equals data.armorClass.total; the no-gear cases reduce
    // to the anchored base `const total = 10 + armor + shield + Dex + size` in
    // defense.ts (shared with 3.5e), so the pf1e.L2.ac mutation flips them.
    id: 'pf1e.L2.ac.total',
    layer: 'L2',
    quantity: 'Armor Class (total)',
    formula:
      '10 + armor + shield + min(Dex, armor cap) + size, then + magic/feat/equipment AC bonuses',
    source: 'PF1e Core Rulebook (OGC): Combat — Armor Class',
    compute: armorClassTotal,
    cases: [
      { name: 'unarmored, medium, Dex 10 → 10', system: {}, expected: 10 },
      {
        name: 'Dex 14 (+2), unarmored, medium → 12',
        system: { baseAttributes: attrs({ dex: 14 }) },
        expected: 12,
      },
      {
        name: 'small (+1 size), Dex 12 (+1), unarmored → 12',
        system: { sizeCategory: 'small', baseAttributes: attrs({ dex: 12 }) },
        expected: 12,
      },
    ],
  },
  {
    // PURE scalar (no resolver bonuses) → no compute-register row; display-less
    // because the d20-legacy combat header already renders it.
    id: 'pf1e.L2.ac.touch',
    layer: 'L2',
    quantity: 'Touch AC',
    formula: '10 + min(Dex, armor cap) + size (ignores armor and shield)',
    source: 'PF1e Core Rulebook (OGC): Combat — Touch Attacks',
    compute: (s) =>
      computeD20LegacyAC(s.baseAttributes.dex ?? 10, s.sizeCategory, s.equipment).touch,
    cases: [
      {
        name: 'Dex 14 (+2), medium → 12',
        system: { baseAttributes: attrs({ dex: 14 }) },
        expected: 12,
      },
      {
        name: 'armor ignored: Full Plate (+8) equipped, Dex 14 → 12',
        system: {
          baseAttributes: attrs({ dex: 14 }),
          equipment: [
            {
              itemId: 'plate',
              name: 'Full Plate',
              equipped: true,
              armorClass: 8,
              armorType: 'heavy',
            },
          ],
        },
        expected: 12,
      },
      { name: 'small (+1 size), Dex 10 → 11', system: { sizeCategory: 'small' }, expected: 11 },
    ],
  },
  {
    // PURE scalar (no resolver bonuses) → no compute-register row; display-less
    // because the d20-legacy combat header already renders it.
    id: 'pf1e.L2.ac.flat-footed',
    layer: 'L2',
    quantity: 'Flat-footed AC',
    formula: '10 + armor + shield + size (no Dex)',
    source: 'PF1e Core Rulebook (OGC): Combat — Flat-Footed',
    compute: (s) =>
      computeD20LegacyAC(s.baseAttributes.dex ?? 10, s.sizeCategory, s.equipment).flatFooted,
    cases: [
      {
        name: 'Dex ignored: Dex 18, unarmored, medium → 10',
        system: { baseAttributes: attrs({ dex: 18 }) },
        expected: 10,
      },
      {
        name: 'armor counts: Full Plate (+8) equipped, medium → 18',
        system: {
          equipment: [
            {
              itemId: 'plate',
              name: 'Full Plate',
              equipped: true,
              armorClass: 8,
              armorType: 'heavy',
            },
          ],
        },
        expected: 18,
      },
      { name: 'large (-1 size), unarmored → 9', system: { sizeCategory: 'large' }, expected: 9 },
    ],
  },
];
