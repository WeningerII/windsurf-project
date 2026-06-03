import { describe, it, expect } from 'vitest';

import {
  expectedDamage,
  scoreTarget,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * Expected-value scoring: damage is weighted by its mean (closed-form, never
 * sampled), so the AI prefers a target it can reliably kill over one it could
 * only finish on a best-case roll — while staying fully deterministic.
 */

let seq = 0;
const dmg = (op: 'add' | 'add-die' | 'subtract', value: number): EffectInstance => ({
  id: `d-${op}-${value}-${seq++}`,
  systemId: 'dnd-5e-2014',
  target: 'damage',
  operation: op,
  value,
  stackPolicy: 'sum',
  source: { kind: 'custom', id: 'x', label: 'x' },
  label: 'd',
  category: 'other',
});

describe('expectedDamage', () => {
  it('averages dice and counts flat modifiers in full', () => {
    expect(expectedDamage([dmg('add-die', 6)])).toBe(3.5); // d6
    expect(expectedDamage([dmg('add-die', 6), dmg('add-die', 6), dmg('add', 3)])).toBe(10); // 2d6+3
    expect(expectedDamage([dmg('add', 5)])).toBe(5);
    expect(expectedDamage([dmg('add-die', 8), dmg('subtract', 2)])).toBe(2.5);
    expect(expectedDamage([])).toBe(0);
  });
});

describe('scoreTarget — expected vs possible kills', () => {
  // 2d6: expected 7, max 12. Reaches both targets equally.
  const actor: TacticalActor = {
    tokenId: 'hero',
    faction: 'party',
    position: { x: 0, y: 0 },
    attackEffects: [],
    damageEffects: [dmg('add-die', 6), dmg('add-die', 6)],
    reach: 5,
  };
  // Same wound fraction (50%) and same distance, differing only in absolute HP so
  // one is a reliable (expected) kill and the other only a best-case one.
  const reliable: TacticalTarget = {
    tokenId: 'reliable',
    faction: 'monsters',
    position: { x: 1, y: 0 },
    armorClass: 10,
    hp: { current: 6, max: 12 }, // expected 7 ≥ 6 → reliable kill
  };
  const lucky: TacticalTarget = {
    tokenId: 'lucky',
    faction: 'monsters',
    position: { x: 0, y: 1 },
    armorClass: 10,
    hp: { current: 10, max: 20 }, // max 12 ≥ 10 (possible) but expected 7 < 10
  };

  it('prefers the target it can reliably finish', () => {
    const r = scoreTarget(actor, reliable);
    const l = scoreTarget(actor, lucky);
    expect(r.canFinish).toBe(true);
    expect(l.canFinish).toBe(true); // both finishable on a max roll
    expect(r.expectedFinish).toBe(true);
    expect(l.expectedFinish).toBe(false); // but only one is a likely kill
    expect(r.score).toBeGreaterThan(l.score);
  });
});
