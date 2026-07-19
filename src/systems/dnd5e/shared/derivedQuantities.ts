/**
 * D&D 5e declared derived quantities (both editions share these).
 *
 * Each entry is the single source of truth for a derived quantity: the engine
 * computes it (via `applyDerivedQuantities` in prepareData), the sheet surfaces
 * it (the generic derived-stats cards), and one generic test plus the compute
 * register's mutation gate verify it — all from this one declaration. Adding a
 * quantity here needs no new engine, sheet, or test code.
 *
 * The `compute`s reuse the existing cited pure helpers (derivedCasterMath,
 * dnd5eMovement); this file only wires them into the declarative layer.
 */
import type { DerivedQuantitySpec } from '../../../rules/derivation';
import { abilityMod, profBonus } from '../../../utils/math';
import { dnd5ePassivePerception } from '../../../utils/derivedCasterMath';
import { dnd5eCarryingCapacity } from './dnd5eMovement';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';

/** Build a full ability-score block from partial overrides (defaults are 10). */
function attrs(overrides: Partial<Record<string, number>>): Record<string, number> {
  return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ...overrides };
}

function perceptionProficiency(system: Dnd5eLikeDataModel): 'none' | 'proficient' | 'expertise' {
  const level = system.skillProficiencies.perception?.level;
  if (level === 'expertise' || level === 'double') return 'expertise';
  if (level === 'proficient') return 'proficient';
  return 'none';
}

export const DND5E_DERIVED_QUANTITIES: ReadonlyArray<DerivedQuantitySpec<Dnd5eLikeDataModel>> = [
  {
    id: 'dnd5e.L4.passive-perception',
    layer: 'L4',
    quantity: 'Passive Perception',
    formula: '10 + Wis(Perception) modifier (proficiency/expertise applied)',
    source: 'D&D 5e SRD (5.1/5.2): Passive Checks',
    compute: (s) =>
      dnd5ePassivePerception(
        abilityMod(s.baseAttributes.wis ?? 10),
        profBonus(s.level),
        perceptionProficiency(s)
      ),
    cases: [
      {
        name: 'no proficiency: 10 + Wis mod',
        system: { baseAttributes: attrs({ wis: 14 }) },
        expected: 12,
      },
      {
        name: 'proficient at level 5: 10 + Wis mod + proficiency',
        system: {
          level: 5,
          baseAttributes: attrs({ wis: 14 }),
          skillProficiencies: { perception: { level: 'proficient', source: ['spec'] } },
        },
        expected: 15,
      },
      {
        name: 'expertise doubles the proficiency bonus',
        system: {
          level: 5,
          baseAttributes: attrs({ wis: 14 }),
          skillProficiencies: { perception: { level: 'expertise', source: ['spec'] } },
        },
        expected: 18,
      },
    ],
    display: { label: 'Passive Perception', icon: 'Eye' },
  },
  {
    id: 'dnd5e.L6.carrying-capacity',
    layer: 'L6',
    quantity: 'Carrying capacity',
    formula: 'Strength score × 15 (lbs)',
    source: 'D&D 5e SRD (5.1/5.2): Carrying Capacity',
    compute: (s) => dnd5eCarryingCapacity(s.baseAttributes.str ?? 10),
    cases: [
      { name: 'Str 10 → 150 lb', system: { baseAttributes: attrs({ str: 10 }) }, expected: 150 },
      { name: 'Str 15 → 225 lb', system: { baseAttributes: attrs({ str: 15 }) }, expected: 225 },
      { name: 'Str 20 → 300 lb', system: { baseAttributes: attrs({ str: 20 }) }, expected: 300 },
    ],
    display: { label: 'Carrying Capacity', icon: 'Weight', format: (v) => `${v} lb` },
  },
];
