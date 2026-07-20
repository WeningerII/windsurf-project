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
 * ARMOR CLASS (total / touch / flat-footed) is deliberately NOT declared here:
 * it is computed off src/utils/armorClass.ts and reserved for a later wave.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import { classBAB } from '../shared/d20-helpers';
import { pf1eMaxSkillRanks } from '../../utils/derivedCombatMath';
import { pf1eFeatsFromLevel } from './derivedMath';
import type { Pf1eDataModel } from './data-model';

/** Total base attack bonus: sum each class's BAB track across all class levels. */
function totalBaseAttackBonus(system: Pf1eDataModel): number {
  return system.classLevels.reduce((sum, cl) => sum + classBAB(cl.level, cl.bab), 0);
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
    formula: 'max ranks in a skill = character level (class skills add +3 to the bonus, not the cap)',
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
];
