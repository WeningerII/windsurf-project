/**
 * Compute register (Denominator B) for Daggerheart, cited against the
 * Daggerheart SRD 1.0. Derived math: src/utils/daggerheartDerived.ts.
 * Triggered/narrative card effects and Hope/Fear narrative resolution are
 * accepted manual boundaries (see docs/srd-manifest/_exclusions.ts) and are not
 * counted here.
 */

import type { SystemComputeRegister } from './types';

const SRD = 'Daggerheart SRD 1.0';
const T = 'src/__tests__/daggerheartEngineMath.test.ts';

export const daggerheartComputeRegister: SystemComputeRegister = {
  systemId: 'daggerheart',
  srdVersion: SRD,
  entries: [
    {
      id: 'daggerheart.L1.tier',
      layer: 'L1',
      quantity: 'Tier by level',
      formula: 'tier 1 (L1), 2 (L2-4), 3 (L5-7), 4 (L8+)',
      inputs: ['level'],
      edgeCases: ['tier boundaries 2/5/8'],
      source: `${SRD}: Leveling Up`,
      status: 'verified',
      testRef: `${T} :: L1 Daggerheart tier and proficiency`,
    },
    {
      id: 'daggerheart.L1.proficiency',
      layer: 'L1',
      quantity: 'Proficiency (= tier; weapon damage-dice multiplier)',
      formula: 'proficiency = tier(level)',
      inputs: ['level'],
      edgeCases: ['multiplies number of weapon damage dice'],
      source: `${SRD}: Proficiency`,
      status: 'verified',
      testRef: `${T} :: L1 Daggerheart tier and proficiency`,
    },
    {
      id: 'daggerheart.L1.ancestry-adjustments',
      layer: 'L1',
      quantity: 'Ancestry adjustments (evasion/HP/stress)',
      formula: 'per-ancestry adjustment table; zero default',
      inputs: ['ancestry'],
      edgeCases: ['unknown ancestry → zero'],
      source: `${SRD}: Ancestries`,
      status: 'verified',
      testRef: `${T} :: Daggerheart ancestry adjustments`,
    },
    {
      id: 'daggerheart.L2.evasion',
      layer: 'L2',
      quantity: 'Evasion',
      formula: 'class starting evasion + ancestry adjustment + passive bonuses (else stored value)',
      inputs: ['class', 'ancestry', 'passive bonuses'],
      edgeCases: ['falls back to stored evasion when no class'],
      source: `${SRD}: Evasion`,
      status: 'verified',
      testRef: `${T} :: L2 Daggerheart derived stats (unarmored)`,
    },
    {
      id: 'daggerheart.L2.armor-score',
      layer: 'L2',
      quantity: 'Armor score (capped 0–12)',
      formula: 'clamp(0, 12, armor base + passive armor bonus)',
      inputs: ['armor', 'passive bonuses'],
      edgeCases: ['unarmored = 0', 'cap at 12'],
      source: `${SRD}: Armor`,
      status: 'verified',
      testRef: `${T} :: L2 Daggerheart derived stats (unarmored)`,
    },
    {
      id: 'daggerheart.L2.major-threshold',
      layer: 'L2',
      quantity: 'Major damage threshold',
      formula: 'armor baseMajor + level (unarmored: level) + passive bonus',
      inputs: ['armor', 'level', 'passive bonus'],
      edgeCases: ['unarmored = level'],
      source: `${SRD}: Damage Thresholds`,
      status: 'verified',
      testRef: `${T} :: L2 Daggerheart derived stats (unarmored)`,
    },
    {
      id: 'daggerheart.L2.severe-threshold',
      layer: 'L2',
      quantity: 'Severe damage threshold',
      formula: 'armor baseSevere + level (unarmored: level × 2) + passive bonus',
      inputs: ['armor', 'level', 'passive bonus'],
      edgeCases: ['unarmored = level × 2'],
      source: `${SRD}: Damage Thresholds`,
      status: 'verified',
      testRef: `${T} :: L2 Daggerheart derived stats (unarmored)`,
    },
    {
      id: 'daggerheart.L2.passive-bonuses',
      layer: 'L2',
      quantity: 'Passive bonus aggregation (weapon/armor/passive cards/inventory)',
      formula: 'sum of passive bonuses from equipped + active-passive sources',
      inputs: ['weapons', 'armor', 'passive domain cards', 'inventory'],
      edgeCases: ['only passive-mode cards; conditional passives'],
      source: `${SRD}: Equipment; Domain Cards`,
      status: 'verified',
      testRef: `${T} :: L2 Daggerheart passive bonus aggregation`,
    },
    {
      id: 'daggerheart.L7.tracks',
      layer: 'L7',
      quantity: 'HP / Stress / Armor track clamping + damage/heal/armor-absorption',
      formula:
        'current clamped to max; physical damage absorbed by armor then HP; stress fills the stress track (bypasses armor); heal restores up to max',
      inputs: ['HP/Stress/Armor tracks', 'damage amount', 'damage type'],
      edgeCases: [
        'armor absorbs before HP',
        'stress bypasses armor',
        'heal caps at max',
        'clamp current ≤ max',
      ],
      source: `${SRD}: Hit Points, Stress, Armor`,
      status: 'verified',
      testRef:
        'src/__tests__/daggerheartEngineMath.test.ts :: L8 Daggerheart damage / heal / armor',
    },
    {
      id: 'daggerheart.L3.attack-vs-difficulty',
      layer: 'L3',
      quantity: 'Attack roll vs Difficulty + damage',
      formula: 'trait + bonuses vs Difficulty; damage = (proficiency × weapon dice) + bonuses',
      inputs: ['trait', 'proficiency', 'weapon'],
      edgeCases: ['Hope/Fear outcome (narrative — excluded)'],
      source: `${SRD}: Attack Rolls; Damage`,
      status: 'verified',
      testRef: 'src/__tests__/derivedCombatMath.test.ts :: Daggerheart weapon damage dice',
    },
    {
      id: 'daggerheart.L8.hp-marked',
      layer: 'L8',
      quantity: 'HP marked by incoming damage (threshold bands)',
      formula: 'damage ≤ 0 → 0; < major → 1; < severe → 2; ≥ severe → 3',
      inputs: ['damage', 'major threshold', 'severe threshold'],
      edgeCases: ['zero damage', 'exactly at major', 'exactly at severe'],
      source: `${SRD}: Damage Thresholds`,
      status: 'verified',
      testRef: `${T} :: L8 Daggerheart damage thresholds → HP marked`,
    },
    {
      id: 'daggerheart.L8.duality-outcome',
      layer: 'L8',
      quantity: 'Duality (Hope/Fear/crit) mechanical resolution',
      formula: 'hope > fear → Hope; fear > hope → Fear; equal → critical',
      inputs: ['Hope die', 'Fear die'],
      edgeCases: ['matched dice = critical'],
      source: `${SRD}: Duality Dice`,
      status: 'verified',
      testRef: `${T} :: L8 Daggerheart duality resolution`,
      note: 'Only the numeric outcome is computed; narrative Hope/Fear consequences remain an accepted manual boundary (_exclusions.ts).',
    },
    {
      id: 'daggerheart.L1.effective-attribute',
      layer: 'L1',
      quantity: 'Effective attribute (base trait + passive bonuses)',
      formula: 'trait value + sum of equipped-gear/passive attribute bonuses',
      inputs: ['attribute', 'passive bonuses'],
      edgeCases: ['negative armor attribute penalties'],
      source: `${SRD}: Traits; Equipment`,
      status: 'verified',
      testRef: `${T} :: L2 Daggerheart passive bonus aggregation`,
    },
  ],
};

export default daggerheartComputeRegister;
