/**
 * Mutants & Masterminds 3e declared derived quantities.
 *
 * Each entry is the single source of truth for a standing numeric quantity: the
 * engine computes it (via `applyDerivedQuantities` in prepareData), the sheet
 * surfaces it (the generic derived-stats cards), and one generic test plus the
 * compute register's mutation gate verify it — all from this one declaration.
 * Adding a quantity here needs no new engine, sheet, or test code.
 *
 * The `compute`s reuse the existing cited pure helpers in `derivedMath.ts`; this
 * file only wires them into the declarative layer. Parameterized quantities
 * (attack/damage/affliction DCs keyed by an effect rank, hero points keyed by
 * activated complications) are NOT standing sheet numbers and are intentionally
 * absent — they live in the compute register / engine math tests instead.
 */
import type { DerivedQuantitySpec } from '../../rules/derivation';
import { mam3eInitiative, mam3eStartingPowerPoints } from './derivedMath';
import type { Mam3eDataModel } from './data-model';

/** Build a full M&M ability block from partial overrides (ranks default to 0). */
function abilities(overrides: Partial<Mam3eDataModel['abilities']>): Mam3eDataModel['abilities'] {
  return { str: 0, sta: 0, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0, ...overrides };
}

/**
 * Rank of the Improved Initiative advantage on this build (0 when absent). The
 * advantage is ranked (`data/.../advantages/combat.ts` id `improved-initiative`),
 * so its `rank` is the +4-per-rank multiplier `mam3eInitiative` expects.
 */
function improvedInitiativeRank(system: Mam3eDataModel): number {
  const adv = system.advantages.find((a) => a.id === 'improved-initiative');
  return adv?.rank ?? 0;
}

export const MAM3E_DERIVED_QUANTITIES: ReadonlyArray<DerivedQuantitySpec<Mam3eDataModel>> = [
  {
    id: 'mam3e.L1.initiative',
    layer: 'L1',
    quantity: 'Initiative bonus',
    formula: 'Agility + 4 × Improved Initiative rank',
    source: "M&M 3e Hero's Handbook (DHH OGC): Initiative",
    compute: (s) => mam3eInitiative(s.abilities.agi, improvedInitiativeRank(s)),
    cases: [
      {
        name: 'no advantage: Agility only',
        system: { abilities: abilities({ agi: 4 }) },
        expected: 4,
      },
      {
        name: 'Improved Initiative adds +4 per rank',
        system: {
          abilities: abilities({ agi: 2 }),
          advantages: [{ id: 'improved-initiative', name: 'Improved Initiative', rank: 3 }],
        },
        expected: 14,
      },
      {
        name: 'negative Agility is legal and carries through',
        system: { abilities: abilities({ agi: -1 }) },
        expected: -1,
      },
    ],
    display: {
      label: 'Initiative',
      icon: 'Target',
      format: (v) => (v >= 0 ? `+${v}` : `${v}`),
    },
  },
  {
    id: 'mam3e.L7.starting-power-points',
    layer: 'L7',
    quantity: 'Starting power-point budget',
    formula: '15 × power level',
    source: "M&M 3e Hero's Handbook (DHH OGC): Power Level",
    compute: (s) => mam3eStartingPowerPoints(s.powerLevel),
    cases: [
      { name: 'PL 10 → 150 PP', system: { powerLevel: 10 }, expected: 150 },
      { name: 'PL 8 → 120 PP', system: { powerLevel: 8 }, expected: 120 },
      { name: 'PL 0 (floored) → 0 PP', system: { powerLevel: 0 }, expected: 0 },
    ],
    display: {
      label: 'Starting PP',
      icon: 'Zap',
      format: (v) => `${v} PP`,
    },
  },
];
