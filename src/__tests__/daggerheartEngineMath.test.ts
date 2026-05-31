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
} from '../utils/daggerheartDerived';
import { createDefaultDaggerheartData } from '../systems/daggerheart/data-model';

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
