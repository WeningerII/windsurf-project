import { describe, it, expect } from 'vitest';

import {
  collectMam3eConditionEffects,
  mam3eBruisePenalty,
  mam3eToughnessPenalty,
  resolveEffects,
} from '../../rules';
import { Mam3eEngine } from '../../systems/mam3e/engine';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { CharacterDocument } from '../../types/core/document';

/**
 * PHASE 2/3 (RFC 003): M&M 3e's damage-track conditions are now DATA in the
 * shared IR. These tests pin the value-bearing Toughness selector (matching the
 * engine's previously hard-coded `mod -= bruised`), the id-facing bruise selector
 * absorbed from sceneConditions, and the effect stamping.
 */

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');
const engine = new Mam3eEngine();

function doc(over: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-conditions-ir',
    name: 'M&M Character',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('mam3eToughnessPenalty selector (value-bearing, parity with the engine)', () => {
  it('is the cumulative bruise count (each Bruised = -1)', () => {
    expect(mam3eToughnessPenalty({ bruised: 0 })).toBe(0);
    expect(mam3eToughnessPenalty({ bruised: 1 })).toBe(1);
    expect(mam3eToughnessPenalty({ bruised: 3 })).toBe(3);
  });

  it('clamps to a non-negative integer (defends the normalized invariant)', () => {
    expect(mam3eToughnessPenalty({ bruised: -2 })).toBe(0);
    expect(mam3eToughnessPenalty({ bruised: 2.9 })).toBe(2);
  });
});

describe('mam3eBruisePenalty (scene condition-id form)', () => {
  it('reads the cumulative bruised-N condition id (0 when absent)', () => {
    expect(mam3eBruisePenalty([])).toBe(0);
    expect(mam3eBruisePenalty(['dazed', 'bruised-3'])).toBe(3);
    expect(mam3eBruisePenalty(['bruised-2'])).toBe(2);
  });
});

describe('M&M condition effects compile to IR (provenance)', () => {
  it('emits a Toughness subtract for the bruise track', () => {
    const effects = collectMam3eConditionEffects({
      bruised: 2,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
    expect(effects).toHaveLength(1);
    expect(effects[0]).toMatchObject({
      systemId: 'mam3e',
      target: 'toughness',
      operation: 'subtract',
      value: 2,
      stackPolicy: 'sum',
      source: { kind: 'condition', id: 'bruised' },
      condition: { kind: 'has-condition', conditionId: 'bruised' },
    });
  });

  it('emits note-only effects for the action-restricting states', () => {
    const effects = collectMam3eConditionEffects({
      bruised: 0,
      dazed: true,
      staggered: false,
      incapacitated: true,
    });
    const states = effects.map((e) => e.source.id);
    expect(states).toEqual(['dazed', 'incapacitated']);
    for (const e of effects) {
      expect(e.operation).toBe('note');
      expect(e.value).toBeNull();
      expect(e.manualBoundary?.kind).toBe('manual');
      expect(e.condition?.kind).toBe('has-condition');
    }
  });

  it('an empty track contributes nothing', () => {
    expect(
      collectMam3eConditionEffects({
        bruised: 0,
        dazed: false,
        staggered: false,
        incapacitated: false,
      })
    ).toHaveLength(0);
  });

  it('the bruise subtract folds to the numeric penalty in the resolver', () => {
    const effects = collectMam3eConditionEffects({
      bruised: 3,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
    const resolved = resolveEffects(effects, { conditions: new Set(['bruised']) });
    expect(resolved.byTarget.toughness.total).toBe(-3);
  });
});

describe('engine sources its Toughness penalty from the selector (behavior preserved)', () => {
  it('PRESERVED: each Bruised is a cumulative -1 on Toughness checks', async () => {
    const track = { bruised: 3, dazed: false, staggered: false, incapacitated: false };
    const system = createDefaultMam3eData();
    system.defenses.toughness.total = 5;
    system.conditionTrack = track;
    const result = await engine.rollCheck(doc({ ...system }), 'toughness');
    // terms = [d20, mod]; mod carries the bruise penalty.
    const mod = result.terms[1];
    expect(mod).toBe(system.defenses.toughness.total - mam3eToughnessPenalty(track));
    expect(mod).toBe(2);
  });

  it('PRESERVED: no bruises → Toughness mod is the raw defense total', async () => {
    const system = createDefaultMam3eData();
    system.defenses.toughness.total = 7;
    system.conditionTrack = { bruised: 0, dazed: false, staggered: false, incapacitated: false };
    const result = await engine.rollCheck(doc({ ...system }), 'toughness');
    expect(result.terms[1]).toBe(7);
  });

  it('PRESERVED: the bruise penalty does not touch non-Toughness defenses', async () => {
    const system = createDefaultMam3eData();
    system.defenses.will.total = 4;
    system.conditionTrack = { bruised: 3, dazed: false, staggered: false, incapacitated: false };
    const result = await engine.rollCheck(doc({ ...system }), 'will');
    expect(result.terms[1]).toBe(4);
  });
});
