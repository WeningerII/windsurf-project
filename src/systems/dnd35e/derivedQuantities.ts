/**
 * D&D 3.5e declared derived quantities.
 *
 * Each entry is the single source of truth for a standing numeric quantity: the
 * engine computes it (via `applyDerivedQuantities` in prepareData), the shared
 * d20-legacy sheet surfaces it (the generic derived-stats cards), and one
 * generic test plus the compute register's mutation gate verify it — all from
 * this one declaration. Adding a quantity here needs no new engine, sheet, or
 * test code.
 *
 * The `compute`s reuse the existing cited pure helpers (the shared d20 classBAB
 * aggregation and dnd35e derivedMath / derivedCombatMath level-progression
 * formulas); this file only wires them into the declarative layer. Per RFC 003
 * the SHARED thing is the mechanism, not the formula: 3.5e's BAB tracks, skill
 * rank caps, and feat/ability-increase cadence stay first-class here.
 *
 * ARMOR CLASS (total / touch / flat-footed) is deliberately NOT declared here:
 * it is computed through the AC resolver fold (src/rules/compile/defense.ts) and
 * reserved for a later wave.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import { classBAB } from '../shared/d20-helpers';
import { dnd35eMaxSkillRanks } from '../../utils/derivedCombatMath';
import { dnd35eAbilityIncreases, dnd35eFeatsFromLevel } from './derivedMath';
import type { Dnd35eDataModel } from './data-model';

/** Total base attack bonus: sum each class's BAB track across all class levels. */
function totalBaseAttackBonus(system: Dnd35eDataModel): number {
  return system.classLevels.reduce((sum, cl) => sum + classBAB(cl.level, cl.bab), 0);
}

export const DND35E_DERIVED_QUANTITIES: ReadonlyArray<DerivedQuantitySpec<Dnd35eDataModel>> = [
  {
    // Standing scalar: computed and registered, but NOT surfaced via the generic
    // cards — the shared d20-legacy combat header already renders a dedicated BAB
    // stat (with its iterative-attack breakdown), so this omits `display`.
    id: 'dnd35e.L3.bab-sum',
    layer: 'L3',
    quantity: 'Total BAB (multiclass sum)',
    formula: 'sum(classBAB(level, track)) across class levels',
    source: 'SRD 3.5: Combat — Attack Bonus',
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
            },
          ],
        },
        expected: 5,
      },
    ],
  },
  {
    id: 'dnd35e.L4.max-rank-cap',
    layer: 'L4',
    quantity: 'Max skill ranks (class skill)',
    formula: 'class skills: level + 3',
    source: 'SRD 3.5: Skills — Ranks',
    compute: (s) => dnd35eMaxSkillRanks(s.level, true),
    cases: [
      { name: 'level 1 class-skill cap = 4', system: { level: 1 }, expected: 4 },
      { name: 'level 5 class-skill cap = 8', system: { level: 5 }, expected: 8 },
      { name: 'level 20 class-skill cap = 23', system: { level: 20 }, expected: 23 },
    ],
    display: { label: 'Max Skill Ranks', icon: 'GraduationCap' },
  },
  {
    id: 'dnd35e.L7.feats-from-level',
    layer: 'L7',
    quantity: 'Feats gained from level',
    formula: 'one at 1st level and every third level = 1 + floor(level / 3)',
    source: 'SRD 3.5: Character Advancement',
    compute: (s) => dnd35eFeatsFromLevel(s.level),
    cases: [
      { name: 'level 1 → 1 feat (1st)', system: { level: 1 }, expected: 1 },
      { name: 'level 6 → 3 feats (1st/3rd/6th)', system: { level: 6 }, expected: 3 },
      { name: 'level 20 → 7 feats', system: { level: 20 }, expected: 7 },
    ],
    display: { label: 'Feats', icon: 'Award' },
  },
  {
    id: 'dnd35e.L7.ability-increases',
    layer: 'L7',
    quantity: 'Ability score increases from level',
    formula: '+1 to an ability every fourth level = floor(level / 4)',
    source: 'SRD 3.5: Character Advancement',
    compute: (s) => dnd35eAbilityIncreases(s.level),
    cases: [
      { name: 'level 3 → 0 (no increase before 4th)', system: { level: 3 }, expected: 0 },
      { name: 'level 4 → 1 (first increase)', system: { level: 4 }, expected: 1 },
      { name: 'level 20 → 5', system: { level: 20 }, expected: 5 },
    ],
    display: { label: 'Ability Increases', icon: 'TrendingUp' },
  },
];
