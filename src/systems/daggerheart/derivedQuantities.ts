/**
 * Daggerheart declared derived quantities.
 *
 * Each entry is the single source of truth for a standing numeric quantity: the
 * engine computes it (via `applyDerivedQuantities` in prepareData), the sheet
 * surfaces it (the generic derived-stats cards), and one generic test plus the
 * compute register's mutation gate verify it — all from this one declaration.
 * Adding a quantity here needs no new engine, sheet, or test code.
 *
 * The `compute`s reuse the existing cited pure helpers in
 * `src/rules/daggerheartDerived.ts` (the level-scaling `getDaggerheartTier` /
 * `getDaggerheartProficiency` and the consolidated `getDaggerheartDerivedStats`);
 * this file only wires them into the declarative layer.
 *
 * Deliberately absent: Evasion and Armor Score are only meaningful once a class
 * or armor is selected (a default sheet echoes stored/zero values), so their
 * `compute` would be content-dependent rather than a clean standing number; and
 * the per-effect quantities (HP marked, critical damage, Spellcast dice) take a
 * per-hit argument and are not standing sheet numbers. Both remain in the
 * compute register / engine-math tests instead. The two damage thresholds ARE
 * standing numbers whose unarmored form is a clean function of level, so they
 * are declared here.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import {
  getDaggerheartDerivedStats,
  getDaggerheartProficiency,
  getDaggerheartTier,
} from '../../rules/daggerheartDerived';
import type { DaggerheartDataModel } from './data-model';

export const DAGGERHEART_DERIVED_QUANTITIES: ReadonlyArray<
  DerivedQuantitySpec<DaggerheartDataModel>
> = [
  {
    id: 'daggerheart.L1.tier',
    layer: 'L1',
    quantity: 'Tier',
    formula: 'tier 1 (L1), 2 (L2–4), 3 (L5–7), 4 (L8+)',
    source: 'Daggerheart SRD 1.0: Leveling Up',
    compute: (s) => getDaggerheartTier(s.level),
    cases: [
      // level 1 is the mutation-sensitive case: the tier `breakpoints(...)` base
      // only shows through below the first (L2) breakpoint, so a base perturbation
      // is caught here and nowhere else.
      { name: 'level 1 → tier 1 (base, below first breakpoint)', system: { level: 1 }, expected: 1 },
      { name: 'level 2 → tier 2 (first breakpoint)', system: { level: 2 }, expected: 2 },
      { name: 'level 5 → tier 3', system: { level: 5 }, expected: 3 },
      { name: 'level 8 → tier 4', system: { level: 8 }, expected: 4 },
    ],
    display: { label: 'Tier', icon: 'Layers' },
  },
  {
    id: 'daggerheart.L1.proficiency',
    layer: 'L1',
    quantity: 'Proficiency (weapon damage-dice multiplier)',
    formula: 'proficiency = tier(level)',
    source: 'Daggerheart SRD 1.0: Proficiency',
    compute: (s) => getDaggerheartProficiency(s.level),
    cases: [
      // level 1 exercises the shared tier base (proficiency delegates to tier),
      // the term the mutation anchor perturbs.
      { name: 'level 1 → proficiency 1 (base)', system: { level: 1 }, expected: 1 },
      { name: 'level 4 → proficiency 2', system: { level: 4 }, expected: 2 },
      { name: 'level 7 → proficiency 3', system: { level: 7 }, expected: 3 },
    ],
    display: { label: 'Proficiency', icon: 'Award', format: (v) => `×${v}` },
  },
  {
    id: 'daggerheart.L2.major-threshold',
    layer: 'L2',
    quantity: 'Major damage threshold',
    formula: 'armor baseMajor + level (unarmored: level) + passive bonus',
    source: 'Daggerheart SRD 1.0: Damage Thresholds',
    compute: (s) => getDaggerheartDerivedStats(s).majorThreshold,
    cases: [
      // Unarmored default sheets: Major threshold = level, so every case exercises
      // the mutable `level` term the anchor perturbs.
      { name: 'unarmored level 1 → 1', system: { level: 1 }, expected: 1 },
      { name: 'unarmored level 5 → 5 (scales with level)', system: { level: 5 }, expected: 5 },
    ],
    display: { label: 'Major Threshold', icon: 'ShieldAlert' },
  },
  {
    id: 'daggerheart.L2.severe-threshold',
    layer: 'L2',
    quantity: 'Severe damage threshold',
    formula: 'armor baseSevere + level (unarmored: level × 2) + passive bonus',
    source: 'Daggerheart SRD 1.0: Damage Thresholds',
    compute: (s) => getDaggerheartDerivedStats(s).severeThreshold,
    cases: [
      // Unarmored default sheets: Severe threshold = level × 2.
      { name: 'unarmored level 1 → 2', system: { level: 1 }, expected: 2 },
      { name: 'unarmored level 5 → 10 (level × 2)', system: { level: 5 }, expected: 10 },
    ],
    display: { label: 'Severe Threshold', icon: 'ShieldX' },
  },
];
