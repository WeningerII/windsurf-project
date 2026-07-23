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
import {
  dnd5eCantripScaleTier,
  dnd5eConcentrationDC,
  dnd5ePassivePerception,
} from '../../../utils/derivedCasterMath';
import {
  dnd5eCarryingCapacity,
  dnd5eHighJump,
  dnd5eLongJump,
  dnd5ePushDragLift,
} from './dnd5eMovement';
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
  {
    id: 'dnd5e.L5.cantrip-scaling',
    layer: 'L5',
    quantity: 'Cantrip damage-dice tier',
    formula: 'damage-dice tier 1, stepping up at character levels 5 / 11 / 17',
    source: 'D&D 5e SRD (5.1/5.2): Cantrips',
    compute: (s) => dnd5eCantripScaleTier(s.level),
    cases: [
      { name: 'level 1 → tier 1 (below first step)', system: { level: 1 }, expected: 1 },
      { name: 'level 5 → tier 2 (first step)', system: { level: 5 }, expected: 2 },
      { name: 'level 11 → tier 3', system: { level: 11 }, expected: 3 },
      { name: 'level 17 → tier 4 (max)', system: { level: 17 }, expected: 4 },
    ],
    // No `display`: computed and registered but not surfaced as a card — the tier
    // only matters for a cantrip-caster (cf. pf2e Class DC, likewise unsurfaced).
  },
  {
    id: 'dnd5e.L6.push-drag-lift',
    layer: 'L6',
    quantity: 'Push, drag, or lift maximum',
    formula: 'Strength score × 30 (lbs) — twice carrying capacity',
    source: 'D&D 5e SRD (5.1/5.2): Push, Drag, or Lift',
    compute: (s) => dnd5ePushDragLift(s.baseAttributes.str ?? 10),
    cases: [
      { name: 'Str 10 → 300 lb', system: { baseAttributes: attrs({ str: 10 }) }, expected: 300 },
      { name: 'Str 15 → 450 lb', system: { baseAttributes: attrs({ str: 15 }) }, expected: 450 },
      { name: 'Str 20 → 600 lb', system: { baseAttributes: attrs({ str: 20 }) }, expected: 600 },
    ],
    display: { label: 'Push / Drag / Lift', icon: 'Dumbbell', format: (v) => `${v} lb` },
  },
  {
    id: 'dnd5e.L6.long-jump',
    layer: 'L6',
    quantity: 'Long jump distance',
    formula: 'Strength score in feet with a 10-ft running start (half, rounded down, standing)',
    source: 'D&D 5e SRD (5.1/5.2): Jumping — Long Jump',
    compute: (s) => dnd5eLongJump(s.baseAttributes.str ?? 10),
    cases: [
      {
        name: 'Str 10 → 10 ft (running start)',
        system: { baseAttributes: attrs({ str: 10 }) },
        expected: 10,
      },
      { name: 'Str 15 → 15 ft', system: { baseAttributes: attrs({ str: 15 }) }, expected: 15 },
      { name: 'Str 20 → 20 ft', system: { baseAttributes: attrs({ str: 20 }) }, expected: 20 },
    ],
    display: { label: 'Long Jump', icon: 'MoveHorizontal', format: (v) => `${v} ft` },
  },
  {
    id: 'dnd5e.L6.high-jump',
    layer: 'L6',
    quantity: 'High jump height',
    formula:
      '3 + Strength modifier in feet with a 10-ft running start (half, rounded down, standing), min 0',
    source: 'D&D 5e SRD (5.1/5.2): Jumping — High Jump',
    compute: (s) => dnd5eHighJump(abilityMod(s.baseAttributes.str ?? 10)),
    cases: [
      {
        name: 'Str 10 (mod +0) → 3 ft',
        system: { baseAttributes: attrs({ str: 10 }) },
        expected: 3,
      },
      {
        name: 'Str 20 (mod +5) → 8 ft',
        system: { baseAttributes: attrs({ str: 20 }) },
        expected: 8,
      },
      {
        name: 'Str 1 (mod −5) → 0 ft (floored at 0)',
        system: { baseAttributes: attrs({ str: 1 }) },
        expected: 0,
      },
    ],
    display: { label: 'High Jump', icon: 'MoveVertical', format: (v) => `${v} ft` },
  },
  {
    id: 'dnd5e.L8.concentration-dc',
    layer: 'L8',
    quantity: 'Concentration save DC',
    formula: 'max(10, floor(damage taken / 2))',
    source: 'D&D 5e SRD (5.1/5.2): Concentration',
    // The DC scales with the damage taken in play (a runtime input), so the
    // standing derived value is the RAW floor — the minimum DC a concentrating
    // caster ever faces; the hint carries the damage-scaling rule.
    compute: () => dnd5eConcentrationDC(0),
    cases: [{ name: 'floors at 10 with no / low damage', system: {}, expected: 10 }],
    display: {
      label: 'Concentration DC',
      icon: 'Brain',
      hint: '10, or half the damage taken (whichever is higher), on a Con save to keep concentration',
    },
  },
];
