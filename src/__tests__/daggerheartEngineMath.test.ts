/**
 * Engine-math verification for Daggerheart (deterministic derived stats only;
 * triggered/narrative card effects are an accepted manual boundary — see
 * docs/srd-manifest/_exclusions.ts). Pins docs/compute-register/daggerheart.ts.
 */
import {
  getDaggerheartTier,
  getDaggerheartProficiency,
  getDaggerheartAncestryAdjustments,
  getDaggerheartDerivedStats,
  getDaggerheartPassiveBonuses,
  getDaggerheartEffectiveAttribute,
  getDaggerheartHpMarked,
  getDaggerheartDualityOutcome,
  getDaggerheartCriticalDamage,
  getDaggerheartSpellcastDamageDiceCount,
  getDaggerheartDamageAfterResistance,
  getDaggerheartHpMarkedAfterArmor,
  getDaggerheartExperienceBonus,
  getDaggerheartShortRestRecovery,
  getDaggerheartIsVulnerable,
  getDaggerheartStressOverflowHp,
  getDaggerheartRiskItAll,
  getDaggerheartAvoidDeathScar,
  getDaggerheartStartingTraitArray,
  DAGGERHEART_STARTING_HOPE,
} from '../utils/daggerheartDerived';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import { DaggerheartEngine } from '../systems/daggerheart/engine';
import type { CharacterDocument } from '../types/core/document';

// ── L1: tier by level, proficiency = tier ───────────────────────────────────
describe('L1 Daggerheart tier and proficiency', () => {
  it.each([
    [1, 1],
    [2, 2],
    [4, 2],
    [5, 3],
    [7, 3],
    [8, 4],
    [20, 4],
  ])('level %i → tier %i', (level, tier) => {
    expect(getDaggerheartTier(level)).toBe(tier);
  });
  it('proficiency equals tier (the damage-dice multiplier)', () => {
    expect(getDaggerheartProficiency(1)).toBe(1);
    expect(getDaggerheartProficiency(5)).toBe(3);
    expect(getDaggerheartProficiency(8)).toBe(4);
  });
});

// ── Ancestry adjustments ────────────────────────────────────────────────────
describe('Daggerheart ancestry adjustments', () => {
  it('known ancestries adjust evasion/HP/stress', () => {
    expect(getDaggerheartAncestryAdjustments({ id: 'giant' })).toEqual({
      evasion: 0,
      hitPoints: 1,
      stress: 0,
    });
    expect(getDaggerheartAncestryAdjustments({ id: 'simiah' })).toEqual({
      evasion: 1,
      hitPoints: 0,
      stress: 0,
    });
    expect(getDaggerheartAncestryAdjustments({ id: 'human' })).toEqual({
      evasion: 0,
      hitPoints: 0,
      stress: 1,
    });
  });
  it('unknown ancestry returns the zero default', () => {
    expect(getDaggerheartAncestryAdjustments({ id: 'unknown' })).toEqual({
      evasion: 0,
      hitPoints: 0,
      stress: 0,
    });
    expect(getDaggerheartAncestryAdjustments(null)).toEqual({
      evasion: 0,
      hitPoints: 0,
      stress: 0,
    });
  });
});

// ── L2: unarmored damage thresholds (major = level, severe = level × 2) ──────
describe('L2 Daggerheart derived stats (unarmored)', () => {
  it('level 1: major = 1, severe = 2, armor score = 0', () => {
    const stats = getDaggerheartDerivedStats({
      ...createDefaultDaggerheartData(),
      level: 1,
      evasion: 5,
    });
    expect(stats.majorThreshold).toBe(1);
    expect(stats.severeThreshold).toBe(2);
    expect(stats.armorScore).toBe(0);
  });
  it('thresholds scale with level (level 3: major 3, severe 6)', () => {
    const stats = getDaggerheartDerivedStats({
      ...createDefaultDaggerheartData(),
      level: 3,
    });
    expect(stats.majorThreshold).toBe(3);
    expect(stats.severeThreshold).toBe(6);
  });
  it('evasion falls back to the stored value when no class is selected', () => {
    const stats = getDaggerheartDerivedStats({
      ...createDefaultDaggerheartData(),
      evasion: 7,
    });
    expect(stats.evasion).toBe(7);
  });
});

const dhEngine = new DaggerheartEngine();
const dhDoc = (over: Partial<DaggerheartDataModel>): CharacterDocument<DaggerheartDataModel> => ({
  id: 'dh-engine-math',
  name: 'DH',
  systemId: 'daggerheart',
  system: { ...createDefaultDaggerheartData(), ...over },
  createdAt: new Date('2026-05-01'),
  updatedAt: new Date('2026-05-01'),
});

// ── L8: damage / heal / armor application ───────────────────────────────────
describe('L8 Daggerheart damage / heal / armor', () => {
  it('armor absorbs physical damage before HP', () => {
    const out = dhEngine.applyDamage(
      dhDoc({ hitPoints: { current: 6, max: 6 }, armor: { current: 3, max: 3 } }),
      5,
      'physical'
    );
    expect(out.system.armor.current).toBe(0);
    expect(out.system.hitPoints.current).toBe(4); // 5 damage − 3 armor = 2 to HP
  });
  it('stress damage fills the stress track and bypasses armor', () => {
    const out = dhEngine.applyDamage(
      dhDoc({ stress: { current: 0, max: 6 }, armor: { current: 3, max: 3 } }),
      2,
      'stress'
    );
    expect(out.system.stress.current).toBe(2);
    expect(out.system.armor.current).toBe(3);
  });
  it('healing restores HP up to max', () => {
    const out = dhEngine.applyDamage(dhDoc({ hitPoints: { current: 2, max: 6 } }), 3, 'heal');
    expect(out.system.hitPoints.current).toBe(5);
  });
});

// ── L7: track clamping ──────────────────────────────────────────────────────
describe('L7 Daggerheart track clamping', () => {
  it('clamps current HP/Stress to their max in prepareData', () => {
    const out = dhEngine.prepareData(
      dhDoc({ hitPoints: { current: 99, max: 6 }, stress: { current: 99, max: 6 } })
    );
    expect(out.system.hitPoints.current).toBe(6);
    expect(out.system.stress.current).toBe(6);
  });
});

// ── L2: passive bonus aggregation from equipped gear ────────────────────────
describe('L2 Daggerheart passive bonus aggregation', () => {
  it('aggregates passive bonuses from equipped armor (Gambeson +1 Evasion)', () => {
    const bonuses = getDaggerheartPassiveBonuses({
      ...createDefaultDaggerheartData(),
      armorId: 'daggerheart-armor-gambeson-armor-tier-1',
    });
    expect(bonuses.evasion).toBe(1);
  });
  it('effective attribute = base trait + equipped-gear passive bonus', () => {
    const system = {
      ...createDefaultDaggerheartData(),
      armorId: 'daggerheart-armor-full-plate-armor-tier-1', // attributes: { agility: -1 }
    };
    system.attributes = { ...system.attributes, agility: 2 };
    expect(getDaggerheartEffectiveAttribute(system, 'agility')).toBe(1); // 2 + (-1)
  });
});

// ── L8: damage thresholds → HP marked (the defining Daggerheart damage calc) ─
describe('L8 Daggerheart damage thresholds → HP marked', () => {
  it('marks 1 / 2 / 3 HP by Major / Severe thresholds (major 7, severe 12)', () => {
    expect(getDaggerheartHpMarked(0, 7, 12)).toBe(0);
    expect(getDaggerheartHpMarked(5, 7, 12)).toBe(1);
    expect(getDaggerheartHpMarked(7, 7, 12)).toBe(2);
    expect(getDaggerheartHpMarked(11, 7, 12)).toBe(2);
    expect(getDaggerheartHpMarked(12, 7, 12)).toBe(3);
    expect(getDaggerheartHpMarked(20, 7, 12)).toBe(3);
  });
});

// ── L8: duality (Hope/Fear/crit) mechanical resolution ──────────────────────
describe('L8 Daggerheart duality resolution', () => {
  it('higher die picks Hope vs Fear; matched dice are a critical', () => {
    expect(getDaggerheartDualityOutcome(9, 4)).toBe('hope');
    expect(getDaggerheartDualityOutcome(3, 8)).toBe('fear');
    expect(getDaggerheartDualityOutcome(6, 6)).toBe('critical');
  });
});

// ── L8: optional Massive Damage rule (≥ 2× Severe → mark 4) ──────────────────
describe('L8 Daggerheart massive damage (optional rule)', () => {
  it('marks 4 HP at or above twice the Severe threshold only when enabled', () => {
    expect(getDaggerheartHpMarked(24, 7, 12)).toBe(3); // default: capped at 3
    expect(getDaggerheartHpMarked(24, 7, 12, { massiveDamage: true })).toBe(4); // 24 ≥ 2×12
    expect(getDaggerheartHpMarked(23, 7, 12, { massiveDamage: true })).toBe(3); // below 2×12
  });
});

// ── L3: critical damage and Spellcast damage dice ───────────────────────────
describe('L3 Daggerheart damage rolls', () => {
  it('critical damage adds the max of the damage dice (not the modifier)', () => {
    // 2d8+1 rolled as 9 → crit adds 2×8 = 16 → 25
    expect(getDaggerheartCriticalDamage(9, 2, 8)).toBe(25);
    // unarmed [Prof 3]d4 rolled as 7 → crit adds 3×4 = 12 → 19
    expect(getDaggerheartCriticalDamage(7, 3, 4)).toBe(19);
  });
  it('Spellcast damage rolls a number of dice equal to the Spellcast trait (0 if ≤ 0)', () => {
    expect(getDaggerheartSpellcastDamageDiceCount(3)).toBe(3);
    expect(getDaggerheartSpellcastDamageDiceCount(0)).toBe(0);
    expect(getDaggerheartSpellcastDamageDiceCount(-2)).toBe(0);
  });
});

// ── L8: resistance/immunity and Armor Slot reduction ────────────────────────
describe('L8 Daggerheart damage reduction', () => {
  it('immunity ignores damage; resistance halves it before thresholds', () => {
    expect(getDaggerheartDamageAfterResistance(20, { immune: true })).toBe(0);
    expect(getDaggerheartDamageAfterResistance(20, { resistant: true })).toBe(10);
    expect(getDaggerheartDamageAfterResistance(20, {})).toBe(20);
  });
  it('each marked Armor Slot reduces HP marked by 1 (none if Armor Score 0)', () => {
    expect(getDaggerheartHpMarkedAfterArmor(3, 1, 4)).toBe(2);
    expect(getDaggerheartHpMarkedAfterArmor(3, 2, 4)).toBe(1);
    expect(getDaggerheartHpMarkedAfterArmor(1, 5, 4)).toBe(0); // floors at 0
    expect(getDaggerheartHpMarkedAfterArmor(3, 1, 0)).toBe(3); // no slots when Armor Score 0
  });
  it('resistance then armor compose the full reduction pipeline', () => {
    // 20 damage, resistant → 10; vs major 7 / severe 12 → marks 2; 1 armor slot → 1
    const reduced = getDaggerheartDamageAfterResistance(20, { resistant: true });
    const base = getDaggerheartHpMarked(reduced, 7, 12);
    expect(getDaggerheartHpMarkedAfterArmor(base, 1, 6)).toBe(1);
  });
});

// ── L7: experience bonus, short-rest recovery, Stress/Vulnerable ────────────
describe('L7 Daggerheart progression and recovery', () => {
  it('Experience bonus is +2, +1 per increase advancement', () => {
    expect(getDaggerheartExperienceBonus()).toBe(2);
    expect(getDaggerheartExperienceBonus(1)).toBe(3);
  });
  it('short-rest moves clear 1d4 + Tier', () => {
    expect(getDaggerheartShortRestRecovery(1, 1)).toBe(2); // min d4 + tier 1
    expect(getDaggerheartShortRestRecovery(4, 3)).toBe(7); // max d4 + tier 3
  });
  it('character creation assigns the +2/+1/+1/+0/+0/-1 trait array and starts with 2 Hope', () => {
    const array = getDaggerheartStartingTraitArray();
    expect([...array].sort((a, b) => b - a)).toEqual([2, 1, 1, 0, 0, -1]);
    expect(array).toHaveLength(6);
    expect(array.reduce((a, b) => a + b, 0)).toBe(3);
    expect(DAGGERHEART_STARTING_HOPE).toBe(2);
  });
  it('Vulnerable once the last Stress is marked; overflow marks 1 HP when full', () => {
    expect(getDaggerheartIsVulnerable(6, 6)).toBe(true);
    expect(getDaggerheartIsVulnerable(5, 6)).toBe(false);
    expect(getDaggerheartStressOverflowHp(6, 6, 1)).toBe(1); // full → 1 HP
    expect(getDaggerheartStressOverflowHp(4, 6, 1)).toBe(0); // room → no overflow
  });
});

// ── L8: death moves (Risk It All, Avoid Death) ──────────────────────────────
describe('L8 Daggerheart death moves', () => {
  it('Risk It All: Hope clears = Hope Die, Fear = death, matching = stay but clear nothing', () => {
    expect(getDaggerheartRiskItAll(9, 4)).toEqual({ survives: true, clears: 9 });
    expect(getDaggerheartRiskItAll(3, 8)).toEqual({ survives: false, clears: 0 });
    expect(getDaggerheartRiskItAll(6, 6)).toEqual({ survives: true, clears: 0 });
  });
  it('Avoid Death: a Hope Die at or below level leaves a scar', () => {
    expect(getDaggerheartAvoidDeathScar(3, 5)).toBe(true); // 3 ≤ 5
    expect(getDaggerheartAvoidDeathScar(8, 5)).toBe(false); // 8 > 5
  });
});
